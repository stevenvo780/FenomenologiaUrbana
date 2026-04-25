import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import mermaid from 'mermaid'
import { X, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import './ThesisView.css'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Space Grotesk'
})

const MermaidRenderer = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const renderMermaid = async () => {
      if (ref.current && chart) {
        try {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
          const { svg } = await mermaid.render(id, chart)
          setSvg(svg)
        } catch (error) {
          console.error('Mermaid render error:', error)
        }
      }
    }
    renderMermaid()
  }, [chart])

  return <div className="mermaid-container" ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
}

export function ThesisView({ onClose }: { onClose?: () => void }) {
  const [content, setContent] = useState('')

  useEffect(() => {
    // Vite specific way to load multiple files as raw strings
    const thesisModules = import.meta.glob('../tesis/0*.md', { query: '?raw', import: 'default', eager: true })
    const sortedKeys = Object.keys(thesisModules).sort()
    const allContent = sortedKeys.map(key => (thesisModules[key] as unknown as string)).join('\n\n---\n\n')
    setContent(allContent)
  }, [])

  return (
    <motion.div 
      className="thesis-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {onClose ? (
        <button className="thesis-close-btn" onClick={onClose} aria-label="Cerrar tesis">
          <X size={24} />
        </button>
      ) : (
        <a href="./" className="thesis-close-btn" aria-label="Volver al laboratorio">
          <Home size={24} />
        </a>
      )}

      <motion.div 
        className="thesis-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <article className="thesis-content">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                const isMermaid = match && match[1] === 'mermaid'

                if (!inline && isMermaid) {
                  return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </motion.div>
    </motion.div>
  )
}
