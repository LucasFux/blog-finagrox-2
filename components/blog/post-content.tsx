"use client"

import { useEffect, useRef } from "react"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Add IDs to headings for anchor links
    const headings = contentRef.current.querySelectorAll("h2, h3")
    headings.forEach((heading) => {
      const text = heading.textContent || ""
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9áéíóúñü\s]/g, "")
        .replace(/\s+/g, "-")
      heading.id = id
    })
  }, [content])

  // Simple markdown to HTML parser
  const parseMarkdown = (markdown: string): string => {
    const escapeAttr = (value: string): string =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

    let html = markdown
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      // Images - notion-to-md genera `![alt](url)`
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, url: string) => {
        const safeAlt = escapeAttr(String(alt ?? ""))
        const safeUrl = escapeAttr(String(url ?? ""))
        return `<img src="${safeUrl}" alt="${safeAlt}" loading="lazy" />`
      })
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Blockquotes
      .replace(/^>\s*"?(.+)"?$/gm, '<blockquote>$1</blockquote>')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Paragraphs - wrap remaining text
      .replace(/\n\n/g, '</p><p>')

    // Wrap consecutive li elements in ul
    html = html.replace(/(<li>.*<\/li>(\n)?)+/g, (match) => {
      return '<ul>' + match + '</ul>'
    })

    // Wrap in paragraph
    html = '<p>' + html + '</p>'

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '')
    html = html.replace(/<p>\s*(<h[23]>)/g, '$1')
    html = html.replace(/(<\/h[23]>)\s*<\/p>/g, '$1')
    html = html.replace(/<p>\s*(<ul>)/g, '$1')
    html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1')
    html = html.replace(/<p>\s*(<blockquote>)/g, '$1')
    html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1')
    html = html.replace(/<p>\s*(<pre>)/g, '$1')
    html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1')
    html = html.replace(/<p>\s*(<hr \/>)/g, '$1')
    html = html.replace(/(<hr \/>)\s*<\/p>/g, '$1')

    return html
  }

  return (
    <div
      ref={contentRef}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
