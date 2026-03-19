"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/categorias", label: "Categorías" },
  { href: "/acerca-de", label: "Acerca de" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-brand-white/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-brand-white border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logopng-6dPNAFG7AgL9iTbsX4jC5ZdvEA7fH5.png"
              alt="Finagrox"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="font-heading text-xl font-bold text-brand-black">
              Finagrox
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-black/80 hover:text-brand-green-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-white"
            >
              <a href="https://finagrox.com" target="_blank" rel="noopener noreferrer">
                Ir a Finagrox →
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-brand-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 z-40 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="absolute inset-0 bg-brand-black/20" onClick={() => setIsMobileMenuOpen(false)} />
        <nav className="absolute right-0 top-0 h-full w-64 bg-brand-white shadow-xl p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-brand-black hover:text-brand-green-dark transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-4 bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-white"
          >
            <a href="https://finagrox.com" target="_blank" rel="noopener noreferrer">
              Ir a Finagrox →
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
