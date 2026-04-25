import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import mermaid from 'mermaid'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AmbientField } from './presentation/components/AmbientField'
import './ThesisView.css'
import './presentation.css' 

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Space Grotesk'
})

const thesisModules = import.meta.glob('../tesis/0*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const thesisContent = Object.keys(thesisModules)
  .sort()
  .map((key) => thesisModules[key])
  .join('\n\n---\n\n')

type MarkdownCodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean
  node?: unknown
}

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

export function ThesisView() {
  return (
    <div className="thesis-page-wrapper">
      <AmbientField />
      
      <motion.div 
        className="thesis-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <header className="thesis-header">
          <div className="thesis-header-nav">
            <Link to="/" className="thesis-home-link" title="Volver al laboratorio">
              <Home size={20} />
              <span>Laboratorio</span>
            </Link>
          </div>
          <div className="thesis-title-block">
            <p className="deck-eyebrow">Tesis de Grado</p>
            <h1>Fenomenología Urbana Operacional</h1>
            <p className="thesis-subtitle">Corredor San Antonio - Junín · Medellín</p>
          </div>
        </header>

        <motion.div 
          className="thesis-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <article className="thesis-content">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ inline, className, children, ...props }: MarkdownCodeProps) {
                  const { node, ...codeProps } = props
                  void node
                  const match = /language-(\w+)/.exec(className || '')
                  const isMermaid = match && match[1] === 'mermaid'

                  if (!inline && isMermaid) {
                    return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />
                  }

                  return (
                    <code className={className} {...codeProps}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {thesisContent}
            </ReactMarkdown>
          </article>
        </motion.div>

        <footer className="thesis-footer">
          <p>© 2024 · Medellín, Colombia · Laboratorio de Fenomenología Urbana</p>
        </footer>
      </motion.div>
    </div>
  )
}
