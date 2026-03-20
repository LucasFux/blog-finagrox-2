import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PostGrid } from "@/components/blog/post-grid"
import { getAllCategories, getCategoryBySlug, getPostsByCategorySlug } from "@/lib/posts"
import { slugifyCategory } from "@/lib/category-slug"

export const revalidate = 60

interface CategoryPostsPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({
    slug: slugifyCategory(category.name),
  }))
}

export async function generateMetadata({ params }: CategoryPostsPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Categoría no encontrada | Finagrox Blog",
    }
  }

  return {
    title: `${category.name} | Finagrox Blog`,
    description: `Listado de artículos de la categoría ${category.name}.`,
  }
}

export default async function CategoryPostsPage({ params }: CategoryPostsPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) notFound()

  const posts = await getPostsByCategorySlug(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a categorías
          </Link>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {category.name}
          </h1>
          <p className="text-muted-foreground mb-8">
            {category.count} {category.count === 1 ? "artículo" : "artículos"} en esta categoría.
          </p>

          <PostGrid posts={posts} showFilter={false} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
