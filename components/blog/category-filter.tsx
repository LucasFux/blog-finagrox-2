"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface CategoryFilterProps {
  categories: {
    name: string
    count: number
    slug: string
  }[]
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          activeCategory === null
            ? "bg-brand-green-dark text-brand-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        Todos
      </button>
      {categories.map((category) => {
        const isActive = activeCategory === category.name
        return (
          <div
            key={category.name}
            className={cn(
              "inline-flex items-center rounded-full border transition-colors",
              isActive ? "border-brand-green-dark bg-brand-green-dark text-brand-white" : "border-transparent bg-muted"
            )}
          >
            <button
              onClick={() => onCategoryChange(category.name)}
              className={cn(
                "pl-4 pr-2 py-2 rounded-l-full text-sm font-medium transition-colors",
                isActive ? "text-brand-white" : "text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category.name} ({category.count})
            </button>
            <Link
              href={`/categorias/${category.slug}`}
              className={cn(
                "pr-3 py-2 text-xs rounded-r-full transition-colors",
                isActive ? "text-brand-white/90 hover:text-brand-white" : "text-muted-foreground hover:text-foreground"
              )}
              title={`Ver ${category.name}`}
              aria-label={`Ver categoría ${category.name}`}
            >
              Ver
            </Link>
          </div>
        )
      })}
    </div>
  )
}
