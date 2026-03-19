import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/hero"
import { FeaturedPost } from "@/components/blog/featured-post"
import { PostGrid } from "@/components/blog/post-grid"
import { Newsletter } from "@/components/newsletter"
import { getAllPosts, getFeaturedPost } from "@/lib/posts"  // 👈 cambia mock-posts por posts

export const revalidate = 60

export default async function HomePage() {  // 👈 agregamos async
  const [allPosts, featuredPost] = await Promise.all([
    getAllPosts(),
    getFeaturedPost(),
  ])

  const regularPosts = allPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        {featuredPost && (
          <section className="py-12 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
                Artículo destacado
              </h2>
              <FeaturedPost post={featuredPost} />
            </div>
          </section>
        )}

        <section className="py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
              Últimos artículos
            </h2>
            <PostGrid posts={regularPosts} />
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}