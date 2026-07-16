import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'E-Compliance | GDPR Compliance Platform',
    template: '%s | E-Compliance',
  },
  description:
    'Plataforma inteligente de adequação à GDPR para empresas europeias. Gere, audite e gerencie seus documentos de conformidade com o apoio de IA.',
  keywords: ['GDPR', 'compliance', 'privacidade', 'LGPD', 'proteção de dados', 'DPA', 'política de privacidade'],
  authors: [{ name: 'Evolves' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'E-Compliance by Evolves',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100`}>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: '#1a2035',
              border: '1px solid rgba(51,112,250,0.2)',
            },
          }}
        />
      </body>
    </html>
  )
}
