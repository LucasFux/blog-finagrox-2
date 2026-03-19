import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Acerca de | Finagrox Blog",
  description: "Conocé más sobre Finagrox, la plataforma de herramientas financieras para el productor agropecuario argentino.",
}

export default function AcercaDePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance">
              ¿Qué es Finagrox?
            </h1>
            
            <div className="prose prose-lg mx-auto text-left space-y-6 text-muted-foreground">
              <p>
                Finagrox es una plataforma de herramientas financieras diseñada específicamente para el productor agropecuario argentino. Nuestro objetivo es democratizar el acceso a información financiera de calidad y brindar recursos prácticos para la toma de decisiones.
              </p>
              
              <p>
                En un contexto de alta volatilidad económica, entendemos que los productores necesitan herramientas confiables para planificar sus campañas, evaluar líneas de crédito, optimizar su carga tributaria y tomar decisiones de comercialización informadas.
              </p>
              
              <p>
                Este blog es parte fundamental de nuestra misión: compartir conocimiento financiero adaptado a la realidad del campo argentino. Publicamos guías, análisis de mercado, novedades impositivas y tutoriales sobre el uso de herramientas digitales que pueden transformar la gestión de tu establecimiento.
              </p>
              
              <p>
                Nuestro equipo está compuesto por profesionales con experiencia en finanzas agropecuarias, agronomía y tecnología. Trabajamos día a día para crear contenido útil, actualizado y fácil de entender.
              </p>
            </div>
            
            <div className="mt-12">
              <Button
                asChild
                size="lg"
                className="bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-white"
              >
                <a href="https://finagrox.com" target="_blank" rel="noopener noreferrer">
                  Visitar Finagrox.com →
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
