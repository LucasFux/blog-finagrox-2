import Link from "next/link"
import Image from "next/image"
import { Post } from "@/types"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-green-light/20 text-brand-green-dark">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {post.readTime} min de lectura
          </span>
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-brand-green-dark transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={28}
              height={28}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-card-foreground">
                {post.author.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(post.date)}
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
    </article>
  )
}
