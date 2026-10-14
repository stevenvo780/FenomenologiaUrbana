// Run: node --experimental-vm-modules --experimental-test-isolation=none --test tests/deck-keyboard.test.mjs
// React hooks and DOM are simulations. This does not test native activation.
// The complete real hook is loaded; only its import boundaries are doubled.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import test from 'node:test'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'

const hookPath = process.env.DECK_HOOK_PATH ??
  new URL('../src/presentation/hooks/useDeckController.ts', import.meta.url)
const source = stripTypeScriptTypes(await readFile(hookPath, 'utf8'))
const SLIDES = [
  'apertura', 'symploke', 'mapa', 'heterotopias', 'perfiles', 'presion',
  'simulacion', 'multitudes', 'estres', 'asfixia', 'ambiente', 'visibilidad',
  'economia', 'historia', 'evidencia', 'triangulacion', 'cierre',
].map((id) => ({ id }))
const keys = [
  'Enter', ' ', 'ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp',
  'Backspace', 'Home', 'End', 'd', 'D',
]

// Synthetic structure only: no repository datasets or scientific calculations.
function payload() {
  return {
    scenarios: [{
      id: 'scenario-test', top_bottlenecks: [], top_routes: [],
      profile_stats: [{ agent_id: 'agent-a' }, { agent_id: 'agent-b' }],
    }],
    agents: [{ id: 'agent-a' }, { id: 'agent-b' }],
    nodes: [{ id: 'node-test' }],
    source_summary: { downloaded: 0, total: 1 },
    fieldwork: { summary: { external_dependency: false } },
  }
}

class Element {
  constructor(tag, attributes = {}, parentElement = null) {
    this.localName = tag
    this.attributes = attributes
    this.parentElement = parentElement
  }
  closest(selector) {
    const selectors = selector.split(',').map((part) => {
      const match = /^([a-z]+)(?:\[([a-z]+)\])?$/i.exec(part.trim())
      assert.ok(match, `unsupported simulated selector: ${part}`)
      return { tag: match[1], attribute: match[2] }
    })
    for (let node = this; node; node = node.parentElement) {
      if (selectors.some(({ tag, attribute }) => node.localName === tag &&
        (!attribute || Object.hasOwn(node.attributes, attribute)))) return node
    }
    return null
  }
}
class HTMLInputElement extends Element {}
class HTMLTextAreaElement extends Element {}
class HTMLSelectElement extends Element {}
class SVGElement extends Element {}
function element(tag, attributes = {}, parent = null) {
  const Type = {
    input: HTMLInputElement, textarea: HTMLTextAreaElement,
    select: HTMLSelectElement, svg: SVGElement, path: SVGElement,
  }[tag] ?? Element
  return new Type(tag, attributes, parent)
}
const shapes = {
  direct: (control) => control,
  span: (control) => element('strong', {}, element('span', {}, control)),
  svg: (control) => element('path', {}, element('svg', {}, control)),
}

function simulatedReact() {
  const slots = []
  let cursor = 0
  let pending = []
  let dirty = false
  const equal = (a, b) => a && b && a.length === b.length &&
    a.every((value, index) => Object.is(value, b[index]))
  const hooks = {
    useState(initial) {
      const index = cursor++
      if (!slots[index]) {
        const slot = { value: typeof initial === 'function' ? initial() : initial }
        slot.set = (next) => {
          const value = typeof next === 'function' ? next(slot.value) : next
          if (!Object.is(value, slot.value)) { slot.value = value; dirty = true }
        }
        slots[index] = slot
      }
      return [slots[index].value, slots[index].set]
    },
    useMemo(factory, deps) {
      const index = cursor++
      if (!slots[index] || !equal(slots[index].deps, deps)) {
        slots[index] = { value: factory(), deps }
      }
      return slots[index].value
    },
    useCallback(callback, deps) { return hooks.useMemo(() => callback, deps) },
    useDeferredValue(value) { return hooks.useMemo(() => value, [value]) },
    useEffect(effect, deps) {
      const index = cursor++
      if (!slots[index] || !equal(slots[index].deps, deps)) {
        pending.push(() => {
          slots[index]?.cleanup?.()
          slots[index] = { deps, cleanup: effect() }
        })
      }
    },
  }
  return {
    hooks,
    render(callback) {
      cursor = 0; pending = []; dirty = false
      const result = callback()
      for (const effect of pending) effect()
      return result
    },
    get dirty() { return dirty },
    unmount() { for (const slot of slots) slot.cleanup?.() },
  }
}

async function mount(t) {
  const react = simulatedReact()
  const listeners = new Set()
  const added = [], removed = []
  const window = {
    addEventListener(type, listener) {
      assert.equal(type, 'keydown'); listeners.add(listener); added.push(listener)
    },
    removeEventListener(type, listener) {
      assert.equal(type, 'keydown'); assert.ok(listeners.delete(listener))
      removed.push(listener)
    },
  }
  const context = createContext({
    window, Element, HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement,
  })
  const doubles = {
    react: react.hooks,
    '../constants': { SLIDES },
    '../utils': { compareProfiles: () => ({ synthetic: true }) },
  }
  const module = new SourceTextModule(source, { context, identifier: String(hookPath) })
  await module.link((specifier) => {
    assert.ok(Object.hasOwn(doubles, specifier), `unexpected import: ${specifier}`)
    const exports = doubles[specifier]
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value)
    }, { context })
  })
  await module.evaluate()
  const data = payload()
  let deck = react.render(() => module.namespace.useDeckController(data))
  let mounted = true
  function flush() {
    for (let count = 0; react.dirty; count++) {
      assert.ok(count < 20, 'render loop')
      deck = react.render(() => module.namespace.useDeckController(data))
    }
  }
  const harness = {
    get deck() { return deck }, listeners, added, removed,
    act(action) { action(deck); flush() },
    key(key, target = element('body')) {
      const event = { key, target, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true } }
      for (const listener of [...listeners]) listener(event)
      flush()
      return event
    },
    unmount() { if (mounted) { react.unmount(); mounted = false } },
  }
  t.after(() => harness.unmount())
  assert.equal(listeners.size, 1)
  assert.equal(deck.data, data)
  assert.equal(deck.agent.id, 'agent-a')
  assert.equal(deck.compareAgent.id, 'agent-b')
  assert.equal(deck.downloadedRatio, '0/1')
  assert.equal(deck.profileComparison.synthetic, true)
  return harness
}
function state(deck) {
  return [deck.activeSlide, deck.activeIndex, deck.progress, deck.modal,
    deck.isHeatlinePaused, deck.isHistoryPaused, deck.historyYearIndex]
}

const controls = [
  ['input', {}], ['textarea', {}], ['select', {}], ['button', {}],
  ['a', { href: '/tesis' }], ['a', { href: '' }],
]
for (const [tag, attrs] of controls) {
  for (const [shape, wrap] of Object.entries(shapes)) {
    test(`guard ignores ${tag} ${JSON.stringify(attrs)} / ${shape}`, async (t) => {
      const h = await mount(t)
      h.act((deck) => deck.goToSlide('perfiles'))
      const target = wrap(element(tag, attrs))
      const before = state(h.deck)
      for (const key of keys) {
        assert.equal(h.key(key, target).defaultPrevented, false, key)
        assert.deepEqual(state(h.deck), before, key)
      }
    })
  }
}
for (const [tag, attrs] of [['button', {}], ['a', { href: '/tesis' }]]) {
  for (const [shape, wrap] of Object.entries(shapes)) {
    test(`Space preserves ${tag} / ${shape}`, async (t) => {
      const h = await mount(t)
      h.act((deck) => deck.goToSlide('perfiles'))
      const before = state(h.deck)
      const event = h.key(' ', wrap(element(tag, attrs)))
      assert.equal(event.defaultPrevented, false)
      assert.deepEqual(state(h.deck), before)
    })
  }
}
for (const label of ['Abrir Data Room', 'Slide anterior', 'Abrir selector de slides']) {
  test(`DeckNav button: ${label}`, async (t) => {
    const h = await mount(t)
    h.act((deck) => deck.goToSlide('perfiles'))
    const target = shapes.svg(element('button', { type: 'button', 'aria-label': label }))
    const before = state(h.deck)
    for (const key of ['Enter', ' ']) {
      assert.equal(h.key(key, target).defaultPrevented, false)
      assert.deepEqual(state(h.deck), before)
    }
  })
}

const ordinaryTargets = {
  null: () => null,
  body: () => element('body'),
  'anchor without href': () => element('a'),
  'anchor descendant without href': () => shapes.span(element('a')),
  'non Element': () => ({ closest() { throw new Error('must not call closest') } }),
  'text node inside button': () => ({ nodeType: 3, parentElement: element('button') }),
}
for (const [label, makeTarget] of Object.entries(ordinaryTargets)) {
  test(`ordinary shortcuts: ${label}`, async (t) => {
    const h = await mount(t)
    for (const key of keys) {
      h.act((deck) => deck.goToSlide('perfiles'))
      assert.equal(h.key(key, makeTarget()).defaultPrevented, true, key)
      const expected = ['Enter', ' ', 'ArrowRight', 'PageDown'].includes(key) ? 'presion'
        : ['ArrowLeft', 'PageUp', 'Backspace'].includes(key) ? 'heterotopias'
        : key === 'Home' ? 'apertura' : key === 'End' ? 'cierre' : 'perfiles'
      assert.equal(h.deck.activeSlide, expected, key)
      assert.equal(h.deck.modal, key.toLowerCase() === 'd' ? 'status' : null, key)
      if (h.deck.modal) h.act((deck) => deck.closeModal())
    }
    const before = state(h.deck)
    for (const key of ['Escape', 'Tab', 'x']) {
      assert.equal(h.key(key, makeTarget()).defaultPrevented, false)
      assert.deepEqual(state(h.deck), before)
    }
  })
}

test('slide boundaries and Home/End stay clamped', async (t) => {
  const h = await mount(t)
  for (const key of ['ArrowLeft', 'PageUp', 'Backspace', 'Home']) {
    assert.equal(h.key(key).defaultPrevented, true)
    assert.equal(h.deck.activeIndex, 0)
  }
  h.key('End')
  for (const key of ['ArrowRight', 'PageDown', ' ', 'Enter', 'End']) {
    assert.equal(h.key(key).defaultPrevented, true)
    assert.equal(h.deck.activeIndex, SLIDES.length - 1)
  }
  assert.equal(h.deck.progress, 100)
  h.key('Home')
  assert.equal(h.deck.activeSlide, 'apertura')
})

test('history arrows pause and clamp years without moving slides', async (t) => {
  const h = await mount(t)
  h.act((deck) => deck.goToSlide('historia'))
  for (const [key, year] of [
    ['ArrowLeft', 0], ['ArrowRight', 1], ['ArrowRight', 2], ['ArrowRight', 2],
    ['ArrowLeft', 1], ['ArrowLeft', 0], ['ArrowLeft', 0],
  ]) {
    assert.equal(h.key(key).defaultPrevented, true)
    assert.equal(h.deck.historyYearIndex, year)
    assert.equal(h.deck.isHistoryPaused, true)
    assert.equal(h.deck.activeSlide, 'historia')
  }
  h.key('PageDown')
  assert.equal(h.deck.activeSlide, 'evidencia')
})

test('crowd Space toggles heatline, Enter still advances', async (t) => {
  const h = await mount(t)
  h.act((deck) => deck.goToSlide('multitudes'))
  for (const paused of [true, false, true]) {
    assert.equal(h.key(' ').defaultPrevented, true)
    assert.equal(h.deck.isHeatlinePaused, paused)
    assert.equal(h.deck.activeSlide, 'multitudes')
  }
  h.key('Enter')
  assert.equal(h.deck.activeSlide, 'estres')
})

for (const [tag, attrs] of [['button', {}], ['a', { href: '/tesis' }]]) {
  test(`guard preserves history/crowd state on ${tag} descendants`, async (t) => {
    const h = await mount(t)
    const target = shapes.svg(element(tag, attrs))
    for (const slide of ['historia', 'multitudes']) {
      h.act((deck) => deck.goToSlide(slide))
      const before = state(h.deck)
      for (const key of keys) {
        assert.equal(h.key(key, target).defaultPrevented, false, key)
        assert.deepEqual(state(h.deck), before, key)
      }
    }
  })
}

test('d/D retain technical modal mapping and modal guard', async (t) => {
  const h = await mount(t)
  for (const [slide, kind] of [
    ['asfixia', 'calibration-detail'], ['estres', 'stress-detail'],
    ['evidencia', 'evidence'], ['mapa', 'model'],
    ['heterotopias', 'fieldwork'], ['apertura', 'status'],
  ]) {
    h.act((deck) => deck.goToSlide(slide))
    for (const key of ['d', 'D']) {
      assert.equal(h.key(key).defaultPrevented, true)
      assert.equal(h.deck.modal, kind)
      const before = state(h.deck)
      for (const blocked of keys) {
        assert.equal(h.key(blocked).defaultPrevented, false, blocked)
        assert.deepEqual(state(h.deck), before, blocked)
      }
      h.act((deck) => deck.closeModal())
    }
  }
  for (const slide of ['historia', 'multitudes']) {
    h.act((deck) => { deck.goToSlide(slide); deck.openModal('status') })
    const before = state(h.deck)
    for (const key of keys) {
      assert.equal(h.key(key).defaultPrevented, false)
      assert.deepEqual(state(h.deck), before)
    }
    h.act((deck) => deck.closeModal())
  }
  h.key('Home')
  assert.equal(h.deck.activeSlide, 'apertura')
})

test('effect replaces exact listener on deps changes and removes it on unmount', async (t) => {
  const h = await mount(t)
  const first = [...h.listeners][0]
  h.key('ArrowRight')
  assert.equal(h.removed[0], first)
  assert.equal(h.listeners.size, 1)
  assert.notEqual([...h.listeners][0], first)
  h.key('d')
  assert.equal(h.listeners.size, 1)
  h.act((deck) => deck.closeModal())
  h.act((deck) => deck.goToSlide('historia'))
  const historyListener = [...h.listeners][0]
  h.key('ArrowRight')
  assert.equal([...h.listeners][0], historyListener)
  h.unmount()
  assert.equal(h.listeners.size, 0)
  assert.deepEqual(h.removed, h.added)
  const before = state(h.deck)
  assert.equal(h.key('End').defaultPrevented, false)
  assert.deepEqual(state(h.deck), before)
})
