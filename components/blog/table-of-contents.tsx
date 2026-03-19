"use client"

import { useEffect, useState } from "react"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches: Heading[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9áéíóúñü\s]/g, "")
        .replace(/\s+/g, "-")
      
      matches.push({ id, text, level })
    }

    setHeadings(matches)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -66%" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-2">
      <h3 className="font-heading font-semibold text-foreground mb-4">
        Contenido
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                activeId === heading.id
                  ? "text-brand-green-dark font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
