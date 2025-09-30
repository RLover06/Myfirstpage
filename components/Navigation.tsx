'use client'

import { useSession, signOut } from 'next-auth/react'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Services, 
  MapPin, 
  Calendar, 
  Star, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function Navigation() {
  const { data: session, status } = useSession()
  const { user: supabaseUser, signOut: supabaseSignOut } = useSupabaseAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Usar Supabase si está disponible, sino NextAuth
  const currentUser = supabaseUser || session?.user
  const isLoading = status === 'loading'

  const handleSignOut = async () => {
    if (supabaseUser) {
      await supabaseSignOut()
    } else {
      signOut({ callbackUrl: '/' })
    }
  }

  const navigationItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/services', label: 'Servicios', icon: Services },
    { href: '/services/nearby', label: 'Cercanos', icon: MapPin },
    { href: '/bookings', label: 'Reservas', icon: Calendar },
    { href: '/reviews', label: 'Reseñas', icon: Star },
  ]

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  MI CHAMBA
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                MI CHAMBA
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  )
                })}
                
                {/* User menu */}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    {currentUser.image ? (
                      <img
                        src={currentUser.image}
                        alt={currentUser.name || 'Usuario'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {currentUser.name || currentUser.email || 'Usuario'}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a 
                  href="/auth/login" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Iniciar Sesión
                </a>
                <a 
                  href="/auth/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Registrarse
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUser ? (
                <>
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    )
                  })}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {currentUser.image ? (
                        <img
                          src={currentUser.image}
                          alt={currentUser.name || 'Usuario'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {currentUser.name || currentUser.email || 'Usuario'}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Salir</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <a 
                    href="/auth/login" 
                    className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Iniciar Sesión
                  </a>
                  <a 
                    href="/auth/register" 
                    className="block bg-primary-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-primary-700"
                  >
                    Registrarse
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
