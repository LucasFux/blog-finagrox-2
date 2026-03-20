import { notion, n2m } from "./notion"
import { Post } from "@/types"
import { unstable_cache } from "next/cache"
import { slugifyCategory } from "./category-slug"

const DATABASE_ID = process.env.NOTION_DATABASE_ID!
const FALLBACK_COVER = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=450&fit=crop"

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function getStatusName(prop: any): string {
  return prop?.status?.name ?? prop?.select?.name ?? ""
}

function isPublishedStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase()
  return ["published", "publicado", "publish", "live"].includes(normalized)
}

function getNotionPageCover(page: any): string {
  const cover = page?.cover
  if (!cover) return ""

  if (cover.type === "external") return cover.external?.url ?? ""
  if (cover.type === "file") return cover.file?.url ?? ""

  return ""
}

// ─── Conversor de página Notion → Post ──────────────────────────────────────

function pageToPost(page: any): Post {
  const props = page.properties
  const authorName = getRichText(props.AuthorName) || "Finagrox"
  const coverImage =
    getNotionPageCover(page) ||
    getUrl(props.CoverImage) ||
    FALLBACK_COVER
  const authorAvatar =
    getUrl(props.AuthorAvatar) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=31511e&color=fff`

  return {
    id: page.id,
    title: getTitle(props.Title) || "Sin título",
    slug: getRichText(props.Slug),
    excerpt: getRichText(props.Excerpt),
    content: "",
    coverImage,
    category: getSelect(props.Category),
    author: {
      name: authorName,
      avatar: authorAvatar,
    },
    date: getDate(props.Date),
    readTime: getNumber(props.ReadTime) || 5,
    featured: getCheckbox(props.Featured),
  }
}

// ─── Funciones base (sin caché) ──────────────────────────────────────────────

async function fetchAllPosts(): Promise<Post[]> {
  const pages: any[] = []
  let cursor: string | undefined = undefined

  do {
    const response: any = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: "Date", direction: "descending" }],
      start_cursor: cursor,
      page_size: 100,
    })

    pages.push(...response.results)
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return pages
    .filter((page) => isPublishedStatus(getStatusName(page.properties?.Status)))
    .map((page) => pageToPost(page))
    .filter((post) => Boolean(post.slug))
}

// ─── Funciones exportadas (con caché de 60 segundos) ────────────────────────

export const getAllPosts = unstable_cache(
  fetchAllPosts,
  ["all-posts"],
  { revalidate: 60 }
)

export const getFeaturedPost = unstable_cache(
  async (): Promise<Post | undefined> => {
    const posts = await getAllPosts()
    return posts.find((post) => post.featured)
  },
  ["featured-post"],
  { revalidate: 60 }
)

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | undefined> => {
    const response: any = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Slug",
        rich_text: { equals: slug },
      },
    })

    if (response.results.length === 0) return undefined

    const page = response.results[0]
    if (!isPublishedStatus(getStatusName(page.properties?.Status))) return undefined

    const post = pageToPost(page)
    if (!post.slug) return undefined

    const mdBlocks = await n2m.pageToMarkdown(page.id)
    const mdString = n2m.toMarkdownString(mdBlocks)
    post.content = mdString.parent

    return post
  },
  ["post-by-slug"],
  { revalidate: 60 }
)

export const getRelatedPosts = unstable_cache(
  async (currentSlug: string, category: string, limit: number = 3): Promise<Post[]> => {
    const posts = await getAllPosts()
    return posts
      .filter((post) => post.category === category)
      .filter((post) => post.slug !== currentSlug)
      .slice(0, limit)
  },
  ["related-posts"],
  { revalidate: 60 }
)

export const getAllCategories = unstable_cache(
  async (): Promise<{ name: string; count: number }[]> => {
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
  },
  ["all-categories"],
  { revalidate: 60 }
)

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<{ name: string; count: number } | undefined> => {
    const categories = await getAllCategories()
    return categories.find((category) => slugifyCategory(category.name) === slug)
  },
  ["category-by-slug"],
  { revalidate: 60 }
)

export const getPostsByCategorySlug = unstable_cache(
  async (slug: string): Promise<Post[]> => {
    const posts = await getAllPosts()
    return posts.filter((post) => slugifyCategory(post.category) === slug)
  },
  ["posts-by-category-slug"],
  { revalidate: 60 }
)

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((post) => post.slug)
}