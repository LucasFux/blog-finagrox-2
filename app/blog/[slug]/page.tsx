import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PostContent } from "@/components/blog/post-content"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { ShareButtons } from "@/components/blog/share-buttons"
import { RelatedPosts } from "@/components/blog/related-posts"
import { getPostBySlug, getRelatedPosts, mockPosts } from "@/lib/mock-posts"
import { formatDate } from "@/lib/utils"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Artículo no encontrado | Finagrox Blog",
    }
  }

  return {
    title: `${post.title} | Finagrox Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al blog
            </Link>

            {/* Post Header */}
            <header className="max-w-3xl mx-auto text-center mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-green-light/20 text-brand-green-dark mb-4">
                {post.category}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.date)} · {post.readTime} min de lectura
                  </p>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </div>

            {/* Content with Sidebar */}
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="lg:flex-1 max-w-3xl mx-auto lg:mx-0">
                  <PostContent content={post.content} />
                </div>

                {/* Sidebar - Desktop Only */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="sticky top-24 space-y-8">
                    <TableOfContents content={post.content} />
                    <ShareButtons title={post.title} slug={post.slug} />
                  </div>
                </aside>
              </div>
            </div>

            {/* Related Posts */}
            <div className="max-w-7xl mx-auto mt-16">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  )
}
