from __future__ import annotations

import json
import random
from pathlib import Path
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import networkx as nx

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# Top LVL Setup
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
EPISODES = 5000  # Number of training episodes per agent
MAX_STEPS = 50
BATCH_SIZE = 128
GAMMA = 0.95
EPSILON_START = 1.0
EPSILON_END = 0.05
EPSILON_DECAY = 0.995
LR = 1e-3

class UrbanPhenomenologyDQN(nn.Module):
    def __init__(self, state_size, action_size):
        super(UrbanPhenomenologyDQN, self).__init__()
        # Deep Neural Network for Spatial Navigation
        self.net = nn.Sequential(
            nn.Linear(state_size, 256),
            nn.ReLU(),
            nn.LayerNorm(256),
            nn.Dropout(0.2),
            nn.Linear(256, 256),
            nn.ReLU(),
            nn.LayerNorm(256),
            nn.Linear(256, action_size)
        )

    def forward(self, x):
        return self.net(x)

class ReplayBuffer:
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)
    
    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))
        
    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        state, action, reward, next_state, done = map(np.stack, zip(*batch))
        return state, action, reward, next_state, done

    def __len__(self):
        return len(self.buffer)

def get_node_features(node_id, graph, target_id, scenario_mods, agent_weights):
    """Encodes the state: current node features + vector to target."""
    node = graph.nodes[node_id]
    target = graph.nodes[target_id]
    
    # Distance/Direction vector
    dx = target['lon'] - node['lon']
    dy = target['lat'] - node['lat']
    dist = np.hypot(dx, dy)
    
    # Local phenomenology
    features = [
        dx, dy, dist,
        node.get('security', 0.5) * scenario_mods.get('risk', 1),
        node.get('commerce', 0.5) * scenario_mods.get('attraction', 1),
        node.get('comfort', 0.5),
        node.get('control', 0.5),
        agent_weights.get('risk', 1.0),
        agent_weights.get('time', 1.0)
    ]
    return np.array(features, dtype=np.float32)

def train_agent_profile(graph, agent, scenario, node_list):
    print(f"[{DEVICE}] Entrenando DRL Agent: {agent['label']} en {scenario['label']}...")
    
    node_to_idx = {n: i for i, n in enumerate(node_list)}
    idx_to_node = {i: n for i, n in enumerate(node_list)}
    
    state_size = 9 # Feature vector size
    action_size = len(node_list)
    
    policy_net = UrbanPhenomenologyDQN(state_size, action_size).to(DEVICE)
    target_net = UrbanPhenomenologyDQN(state_size, action_size).to(DEVICE)
    target_net.load_state_dict(policy_net.state_dict())
    target_net.eval()
    
    optimizer = optim.Adam(policy_net.parameters(), lr=LR)
    memory = ReplayBuffer()
    
    scenario_mods = scenario["modifiers"]
    agent_weights = agent["weights"]
    
    epsilon = EPSILON_START
    
    for episode in range(EPISODES):
        start_node = random.choice(agent["origins"])
        target_node = random.choice([t for t in agent["targets"] if t != start_node])
        
        current_node = start_node
        state = get_node_features(current_node, graph, target_node, scenario_mods, agent_weights)
        
        total_reward = 0
        
        for step in range(MAX_STEPS):
            # Select action
            if random.random() < epsilon:
                # Random valid neighbor
                neighbors = list(graph.neighbors(current_node))
                if not neighbors: break
                action_node = random.choice(neighbors)
                action_idx = node_to_idx[action_node]
            else:
                with torch.no_grad():
                    state_t = torch.FloatTensor(state).unsqueeze(0).to(DEVICE)
                    q_values = policy_net(state_t).squeeze(0).cpu().numpy()
                    
                    # Mask invalid moves with -inf
                    valid_moves = list(graph.neighbors(current_node))
                    mask = np.ones(action_size) * -np.inf
                    for v in valid_moves:
                        mask[node_to_idx[v]] = 0
                    
                    q_values += mask
                    action_idx = np.argmax(q_values)
                    action_node = idx_to_node[action_idx]
            
            # Step environment
            edge_data = graph.get_edge_data(current_node, action_node)
            
            # Phenomenological Reward Function
            travel = float(edge_data["travel_time_min"])
            risk = float(edge_data["risk"]) * float(scenario_mods["risk"])
            noise = float(edge_data["noise"]) * float(scenario_mods["noise"])
            
            cost = (
                float(agent_weights["time"]) * travel +
                float(agent_weights["risk"]) * risk +
                float(agent_weights["noise"]) * noise
            )
            
            reward = -cost
            done = (action_node == target_node)
            if done:
                reward += 100.0 # Goal reached
            
            next_state = get_node_features(action_node, graph, target_node, scenario_mods, agent_weights)
            
            memory.push(state, action_idx, reward, next_state, done)
            
            state = next_state
            current_node = action_node
            total_reward += reward
            
            # Optimize
            if len(memory) > BATCH_SIZE:
                s, a, r, ns, d = memory.sample(BATCH_SIZE)
                
                s = torch.FloatTensor(s).to(DEVICE)
                a = torch.LongTensor(a).unsqueeze(1).to(DEVICE)
                r = torch.FloatTensor(r).unsqueeze(1).to(DEVICE)
                ns = torch.FloatTensor(ns).to(DEVICE)
                d = torch.FloatTensor(d).unsqueeze(1).to(DEVICE)
                
                q_vals = policy_net(s).gather(1, a)
                next_q_vals = target_net(ns).max(1)[0].unsqueeze(1)
                target_q = r + (GAMMA * next_q_vals * (1 - d))
                
                loss = nn.MSELoss()(q_vals, target_q.detach())
                
                optimizer.zero_grad()
                loss.backward()
                # Gradient clipping for stability
                torch.nn.utils.clip_grad_norm_(policy_net.parameters(), max_norm=1.0)
                optimizer.step()
                
            if done: break
            
        epsilon = max(EPSILON_END, epsilon * EPSILON_DECAY)
        if episode % 1000 == 0:
            target_net.load_state_dict(policy_net.state_dict())
            print(f"   Episodio {episode}/{EPISODES} | Recompensa media: {total_reward:.2f} | Epsilon: {epsilon:.2f}")

    # Save model weights to disk (simulated checkpoint)
    model_path = OUTPUTS_DIR / f"drl_agent_{agent['id']}_{scenario['id']}.pth"
    torch.save(policy_net.state_dict(), model_path)
    return model_path

def main():
    case_model = read_json(OUTPUTS_DIR / "case_model.json")
    
    # Build Graph
    graph = nx.Graph()
    node_list = []
    for node in case_model["nodes"]:
        graph.add_node(node["id"], **node)
        node_list.append(node["id"])
        
    for edge in case_model["edges"]:
        graph.add_edge(edge["source"], edge["target"], **edge)

    print("Iniciando entrenamiento de Deep Reinforcement Learning (Q-Learning)...")
    print(f"Acelerador detectado: {DEVICE}")
    
    # Train DRL for one critical scenario to demonstrate capability
    target_scenario = next(s for s in case_model["scenarios"] if s["id"] == "peak_pm")
    
    for agent in case_model["agents"]:
        train_agent_profile(graph, agent, target_scenario, node_list)
        
    print("Entrenamiento de IA completado. Cerebros neuronales guardados.")

if __name__ == "__main__":
    main()
