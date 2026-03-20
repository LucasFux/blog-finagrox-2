import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getAllCategories } from "@/lib/posts"
import { slugifyCategory } from "@/lib/category-slug"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Categorías | Finagrox Blog",
  description: "Explorá todos los artículos del blog de Finagrox organizados por categoría.",
}

const categoryDescriptions: Record<string, string> = {
  "Créditos": "Guías sobre financiamiento, líneas de crédito y acceso a capital para el productor.",
  "Planificación": "Herramientas y consejos para planificar tus campañas y gestionar tu establecimiento.",
  "Impuestos": "Novedades tributarias, obligaciones fiscales y estrategias de optimización.",
  "Mercados": "Análisis de mercados, proyecciones de precios y estrategias de comercialización.",
  "Herramientas": "Software, apps y tecnología para modernizar tu gestión agropecuaria.",
}

const categoryIcons: Record<string, string> = {
  "Créditos": "💳",
  "Planificación": "📊",
  "Impuestos": "📋",
  "Mercados": "📈",
  "Herramientas": "🛠️",
}

export default async function CategoriasPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Categorías
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explorá nuestros artículos organizados por temática para encontrar exactamente lo que necesitás.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/categorias/${slugifyCategory(name)}`}
                  className="group block bg-card rounded-xl p-6 border border-border hover:border-brand-green-light hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl" role="img" aria-label={name}>
                      {categoryIcons[name] ?? "📄"}
                    </span>
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-card-foreground group-hover:text-brand-green-dark transition-colors">
                        {name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        {categoryDescriptions[name] ?? ""}
                      </p>
                      <p className="text-sm font-medium text-brand-green-dark mt-3">
                        {count} {count === 1 ? "artículo" : "artículos"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}