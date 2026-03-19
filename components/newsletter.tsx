"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // For demo purposes, always succeed
    setStatus("success")
    setEmail("")
  }

  return (
    <section className="bg-brand-green-light py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-white mb-4 text-balance">
            Recibí los mejores artículos en tu correo
          </h2>
          <p className="text-brand-white/90 mb-8">
            Suscribite para recibir las últimas novedades sobre finanzas agropecuarias.
          </p>
          
          {status === "success" ? (
            <div className="bg-brand-white/20 rounded-lg p-4 text-brand-white font-medium">
              ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-brand-white border-0 text-brand-black placeholder:text-brand-black/50"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-white font-medium px-6"
              >
                {status === "loading" ? "Enviando..." : "Suscribirme"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
