"use client"

import { useState, useMemo } from "react"
import { Post, Category } from "@/types"
import { PostCard } from "./post-card"
import { CategoryFilter } from "./category-filter"

interface PostGridProps {
  posts: Post[]
  showFilter?: boolean
}

export function PostGrid({ posts, showFilter = true }: PostGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts
    return posts.filter((post) => post.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <div>
      {showFilter && (
        <div className="mb-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      )}
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay artículos en esta categoría todavía.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
