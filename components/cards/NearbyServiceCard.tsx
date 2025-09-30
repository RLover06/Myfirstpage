'use client'

import { MapPin, Star, Clock, DollarSign, Users } from 'lucide-react'
import { Service } from '@/types'
import { Button } from '@/components/ui/Button'

interface NearbyServiceCardProps {
  service: Service & {
    distance: number
    averageRating: number
    totalReviews: number
    totalBookings: number
  }
  onBook?: (service: Service) => void
  onViewDetails?: (service: Service) => void
}

export default function NearbyServiceCard({
  service,
  onBook,
  onViewDetails
}: NearbyServiceCardProps) {
  // Función para renderizar las estrellas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  // Formatear categoría
  const formatCategory = (category: string) => {
    return category.charAt(0) + category.slice(1).toLowerCase()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header con título y distancia */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {service.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.distance} km de distancia</span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {formatCategory(service.category)}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {service.description}
      </p>

      {/* Información del proveedor */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          {service.user.image ? (
            <img
              src={service.user.image}
              alt={service.user.name || 'Proveedor'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Users className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {service.user.name || 'Proveedor'}
          </p>
          <p className="text-xs text-gray-500">{service.location}</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Calificación */}
          <div className="flex items-center space-x-1">
            {renderStars(service.averageRating)}
            <span className="text-sm text-gray-600">
              ({service.totalReviews})
            </span>
          </div>
          
          {/* Precio */}
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>${service.pricePerHour}/hora</span>
          </div>
        </div>

        {/* Reservas totales */}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          <span>{service.totalBookings} reservas</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => onViewDetails?.(service)}
          className="flex-1"
        >
          Ver Detalles
        </Button>
        <Button
          onClick={() => onBook?.(service)}
          className="flex-1"
        >
          Reservar
        </Button>
      </div>
    </div>
  )
}
