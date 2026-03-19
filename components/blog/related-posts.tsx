import { Post } from "@/types"
import { PostCard } from "./post-card"

interface RelatedPostsProps {
  posts: Post[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-12 border-t border-border">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-8">
        Artículos relacionados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
