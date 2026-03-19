export interface Author {
  name: string
  avatar: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // markdown string
  coverImage: string
  category: string
  author: Author
  date: string // ISO string
  readTime: number // minutes
  featured: boolean
}

export type Category = "Créditos" | "Planificación" | "Impuestos" | "Mercados" | "Herramientas"

export const categories: Category[] = [
  "Créditos",
  "Planificación",
  "Impuestos",
  "Mercados",
  "Herramientas"
]
