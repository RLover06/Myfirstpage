'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session } = useSession()
  const [showServices, setShowServices] = useState(false)

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-secondary-900">MI CHAMBA</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-2 mr-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">Conectado</span>
                  </div>
                  <Link href="/dashboard" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/services" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                    Mis Servicios
                  </Link>
                  <button 
                    onClick={() => {
                      // Aquí iría la lógica de logout
                      window.location.href = '/'
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                    Iniciar Sesión
                  </Link>
                  <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
            {session ? (
              <>
                ¡Bienvenido de vuelta a <span className="text-primary-600">MI CHAMBA</span>!<br />
                Continúa gestionando tus servicios profesionales
              </>
            ) : (
              <>
                Encuentra tu <span className="text-primary-600">Próxima Chamba</span><br />
                o Ofrece tus Servicios Profesionales
              </>
            )}
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            {session ? 
              'Accede a tu dashboard para gestionar tus servicios, reservas y mensajes.' :
              'Conecta con profesionales talentosos o encuentra clientes para tus servicios. Una plataforma segura y fácil de usar para freelancers y empresas.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                <Link href="/dashboard" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 w-full sm:w-auto text-center">
                  Ir al Dashboard
                </Link>
                <Link href="/dashboard/services/create" className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-50 w-full sm:w-auto text-center">
                  Crear Servicio
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 w-full sm:w-auto text-center">
                  Comenzar Ahora
                </Link>
                <button 
                  onClick={() => setShowServices(true)}
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-50 w-full sm:w-auto"
                >
                  Ver Servicios
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            ¿Por qué elegir MI CHAMBA?
          </h2>
          <p className="text-lg text-secondary-600">
            La plataforma líder para conectar freelancers con empresas. Segura, confiable y diseñada para el éxito profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Geolocalización */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Servicios Cercanos</h3>
            <p className="text-secondary-600">
              Encuentra profesionales cerca de ti con nuestra tecnología de geolocalización. Filtra por distancia y encuentra servicios locales.
            </p>
          </div>

          {/* Sistema de Reservas */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Sistema de Reservas</h3>
            <p className="text-secondary-600">
              Agenda citas fácilmente con nuestro sistema de reservas integrado. Gestiona tu calendario y coordina servicios sin complicaciones.
            </p>
          </div>

          {/* Reseñas y Calificaciones */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Reseñas y Calificaciones</h3>
            <p className="text-secondary-600">
              Sistema completo de calificaciones y reseñas. Lee experiencias reales y construye tu reputación profesional.
            </p>
          </div>

          {/* Chat en Tiempo Real */}
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Chat en Tiempo Real</h3>
            <p className="text-secondary-600">
              Comunícate directamente con profesionales a través de nuestro sistema de mensajería integrado. Negocia términos y coordina proyectos fácilmente.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Números que Hablan</h2>
            <p className="text-primary-100">La plataforma líder en servicios profesionales</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Profesionales Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-primary-100">Reservas Completadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">850+</div>
              <div className="text-primary-100">Reseñas Positivas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-primary-100">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {showServices && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Servicios Disponibles</h1>
            <p className="text-secondary-600 mb-6">Encuentra el servicio perfecto para tus necesidades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Desarrollo Web Full Stack</h3>
                  <p className="text-sm text-secondary-600 mb-2">por Ana Rodríguez</p>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">Tecnología</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">35€</p>
                  <p className="text-sm text-secondary-500">por hora</p>
                </div>
              </div>
              <p className="text-secondary-700 mb-4">Desarrollo de aplicaciones web completas con React, Node.js y bases de datos. Especialista en e-commerce y aplicaciones empresariales.</p>
              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Barcelona, España
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>2.5 km</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>4.8 (24 reseñas)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Disponible</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Reservar Ahora
                </button>
                <button className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Diseño UX/UI</h3>
                  <p className="text-sm text-secondary-600 mb-2">por Carlos Mendoza</p>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">Diseño</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">28€</p>
                  <p className="text-sm text-secondary-500">por hora</p>
                </div>
              </div>
              <p className="text-secondary-700 mb-4">Diseño de interfaces de usuario intuitivas y experiencias digitales excepcionales. Especialista en Figma y prototipado.</p>
              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Madrid, España
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>1.8 km</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>4.9 (18 reseñas)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Disponible</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Reservar Ahora
                </button>
                <button className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">Marketing Digital & SEO</h3>
                  <p className="text-sm text-secondary-600 mb-2">por Laura Fernández</p>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">Marketing</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">32€</p>
                  <p className="text-sm text-secondary-500">por hora</p>
                </div>
              </div>
              <p className="text-secondary-700 mb-4">Estrategias completas de marketing digital, SEO, SEM y redes sociales. Aumenta tu visibilidad online y genera más leads.</p>
              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Valencia, España
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>3.2 km</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>4.7 (31 reseñas)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Disponible</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  Reservar Ahora
                </button>
                <button className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-secondary-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MI CHAMBA</span>
            </div>
            <p className="text-secondary-400">
              © 2024 MI CHAMBA. Conectando talento con oportunidades. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}