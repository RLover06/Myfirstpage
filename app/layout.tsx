import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { SupabaseAuthProvider } from '@/components/auth/SupabaseAuthProvider'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MI CHAMBA - Marketplace de Servicios',
  description: 'Conecta con proveedores de servicios profesionales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <SupabaseAuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                      </div>
                      <span className="text-xl font-bold">MI CHAMBA</span>
                    </div>
                    <p className="text-gray-400">
                      © 2024 MI CHAMBA. Todos los derechos reservados.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </SupabaseAuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}