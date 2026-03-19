import type { Metadata } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: 'Finagrox Blog | Finanzas para el campo',
  description: 'Recursos, guías y herramientas para que el productor agropecuario tome mejores decisiones financieras.',
  keywords: ['finanzas', 'agro', 'campo', 'agricultura', 'créditos', 'planificación', 'Argentina'],
  authors: [{ name: 'Finagrox' }],
  openGraph: {
    title: 'Finagrox Blog | Finanzas para el campo',
    description: 'Recursos, guías y herramientas para que el productor agropecuario tome mejores decisiones financieras.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
