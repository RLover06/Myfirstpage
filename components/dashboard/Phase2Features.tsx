'use client'

import { useState } from 'react'
import { MapPin, Calendar, Star, MessageSquare, CheckCircle } from 'lucide-react'

export default function Phase2Features() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const features = [
    {
      id: 'geolocation',
      title: 'Servicios Cercanos',
      icon: MapPin,
      color: 'blue',
      description: 'Encuentra profesionales cerca de ti con nuestra tecnología de geolocalización avanzada',
      features: [
        'Búsqueda por proximidad geográfica',
        'Filtros por distancia (5km - 50km)',
        'Ubicación automática del usuario'
      ]
    },
    {
      id: 'bookings',
      title: 'Sistema de Reservas',
      icon: Calendar,
      color: 'green',
      description: 'Agenda citas fácilmente con nuestro sistema de reservas integrado y gestión de calendario',
      features: [
        'Reservas con fecha y hora específicas',
        'Gestión de estados (Pendiente, Confirmada, etc.)',
        'Cálculo automático de precios'
      ]
    },
    {
      id: 'reviews',
      title: 'Reseñas y Calificaciones',
      icon: Star,
      color: 'yellow',
      description: 'Sistema completo de calificaciones y reseñas para construir confianza y reputación',
      features: [
        'Calificaciones de 1 a 5 estrellas',
        'Comentarios detallados',
        'Estadísticas de calificaciones promedio'
      ]
    },
    {
      id: 'chat',
      title: 'Chat en Tiempo Real',
      icon: MessageSquare,
      color: 'purple',
      description: 'Comunícate directamente con profesionales a través de nuestro sistema de mensajería integrado',
      features: [
        'Mensajería instantánea',
        'Notificaciones en tiempo real',
        'Historial de conversaciones'
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 Nuevas Funcionalidades - Fase 2
        </h2>
        <p className="text-lg text-gray-600">
          Descubre las últimas características que hacen de MI CHAMBA la plataforma más completa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon
          const colorClasses = getColorClasses(feature.color)
          
          return (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="text-center mb-6">
                <div className={`w-20 h-20 ${colorClasses.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`w-10 h-10 ${colorClasses.text}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {feature.description}
                </p>
              </div>
              
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="text-center">
                <button
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                  className={`${colorClasses.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                >
                  {activeFeature === feature.id ? 'Ocultar Detalles' : 'Más Información'}
                </button>
              </div>
              
              {activeFeature === feature.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Detalles Técnicos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Integración completa con la base de datos</li>
                    <li>• API REST para todas las operaciones</li>
                    <li>• Interfaz responsive y moderna</li>
                    <li>• Seguridad y validación de datos</li>
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Todas las funcionalidades están disponibles!
          </h3>
          <p className="text-gray-600 mb-4">
            Accede a estas características desde el menú lateral del dashboard
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/dashboard/services/nearby"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Servicios Cercanos
            </a>
            <a
              href="/dashboard/bookings"
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Mis Reservas
            </a>
            <a
              href="/dashboard/reviews"
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
            >
              Reseñas
            </a>
            <a
              href="/dashboard/messages"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Mensajes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
