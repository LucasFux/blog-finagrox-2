import Link from "next/link"
import Image from "next/image"
import { Post } from "@/types"
import { formatDate } from "@/lib/utils"

interface FeaturedPostProps {
  post: Post
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        <Link href={`/blog/${post.slug}`} className="block lg:w-1/2">
          <div className="relative aspect-video lg:aspect-auto lg:h-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </Link>
        
        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-green-light/20 text-brand-green-dark">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">
              Destacado
            </span>
          </div>
          
          <Link href={`/blog/${post.slug}`}>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-card-foreground mb-4 group-hover:text-brand-green-dark transition-colors text-balance">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-muted-foreground mb-6 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-card-foreground">
                  {post.author.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.date)} · {post.readTime} min de lectura
                </span>
              </div>
            </div>
            
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm font-medium text-brand-green-dark hover:text-brand-green-light transition-colors"
            >
              Leer más →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
