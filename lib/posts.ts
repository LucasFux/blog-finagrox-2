import { notion, n2m } from "./notion"
import { Post } from "@/types"

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

// Helper para extraer texto plano de propiedades de Notion
function getRichText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? ""
}

function getTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? ""
}

function getSelect(prop: any): string {
  return prop?.select?.name ?? ""
}

function getDate(prop: any): string {
  return prop?.date?.start ?? ""
}

function getNumber(prop: any): number {
  return prop?.number ?? 0
}

function getCheckbox(prop: any): boolean {
  return prop?.checkbox ?? false
}

function getUrl(prop: any): string {
  return prop?.url ?? ""
}

// Convierte una página de Notion en nuestro tipo Post
function pageToPost(page: any): Post {
  const props = page.properties

  return {
    id: page.id,
    title: getTitle(props.Title),
    slug: getRichText(props.Slug),
    excerpt: getRichText(props.Excerpt),
    content: "", // se llena en getPostBySlug
    coverImage: getUrl(props.CoverImage),
    category: getSelect(props.Category),
    author: {
      name: getRichText(props.AuthorName),
      avatar: getUrl(props.AuthorAvatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(getRichText(props.AuthorName))}&background=31511e&color=fff`,
    },
    date: getDate(props.Date),
    readTime: getNumber(props.ReadTime),
    featured: getCheckbox(props.Featured),
  }
}

// Obtener todos los posts publicados
export async function getAllPosts(): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  })

  return response.results.map((page: any) => pageToPost(page))
}

// Obtener un post por slug (con contenido completo)
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
      ],
    },
  })

  if (response.results.length === 0) return undefined

  const page = response.results[0] as any
  const post = pageToPost(page)

  // Convertir bloques de Notion a Markdown
  const mdBlocks = await n2m.pageToMarkdown(page.id)
  const mdString = n2m.toMarkdownString(mdBlocks)
  post.content = mdString.parent

  return post
}

// Obtener el post destacado
export async function getFeaturedPost(): Promise<Post | undefined> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
      ],
    },
    page_size: 1,
  })

  if (response.results.length === 0) return undefined
  return pageToPost(response.results[0] as any)
}

// Obtener posts relacionados
export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: "Status",
          select: { equals: "Published" },
        },
        {
          property: "Category",
          select: { equals: category },
        },
      ],
    },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: limit + 1,
  })

  return response.results
    .map((page: any) => pageToPost(page))
    .filter((post: Post) => post.slug !== currentSlug)
    .slice(0, limit)
}

// Obtener todos los slugs (para generateStaticParams)
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((post) => post.slug)
}

// Obtener categorías únicas con conteo de posts
export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
    const posts = await getAllPosts()
    
    const countMap: Record<string, number> = {}
    posts.forEach((post) => {
      if (post.category) {
        countMap[post.category] = (countMap[post.category] || 0) + 1
      }
    })
  
    return Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }