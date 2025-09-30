'use client'

import { Star, User, Calendar } from 'lucide-react'
import { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Función para renderizar las estrellas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header con información del autor */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {review.author?.image ? (
              <img
                src={review.author.image}
                alt={review.author.name || 'Usuario'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {review.author?.name || 'Usuario Anónimo'}
            </h4>
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">
                ({review.rating}/5)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(review.createdAt)}
        </div>
      </div>

      {/* Comentario */}
      {review.comment && (
        <div className="mb-3">
          <p className="text-gray-700 leading-relaxed">
            {review.comment}
          </p>
        </div>
      )}

      {/* Información del servicio */}
      {review.service && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <strong>Servicio:</strong> {review.service.title}
          </p>
        </div>
      )}
    </div>
  )
}
