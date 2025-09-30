'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { ReviewFormData } from '@/types'

// Esquema de validación para el formulario de reseña
const reviewSchema = z.object({
  rating: z.number().min(1, 'Debes seleccionar una calificación').max(5, 'La calificación no puede exceder 5'),
  comment: z.string().optional()
})

interface ReviewFormProps {
  serviceId: string
  serviceTitle: string
  onSuccess?: (review: any) => void
  onCancel?: () => void
}

export default function ReviewForm({
  serviceId,
  serviceTitle,
  onSuccess,
  onCancel
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema)
  })

  const rating = watch('rating') || 0

  const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const reviewData: ReviewFormData = {
        serviceId,
        rating: data.rating,
        comment: data.comment
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la reseña')
      }

      const result = await response.json()
      onSuccess?.(result.review)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para renderizar las estrellas interactivas
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1
      const isActive = starNumber <= (hoveredStar || rating)
      
      return (
        <button
          key={i}
          type="button"
          className={`w-8 h-8 transition-colors ${
            isActive 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-gray-300 hover:text-yellow-400'
          }`}
          onClick={() => setValue('rating', starNumber)}
          onMouseEnter={() => setHoveredStar(starNumber)}
          onMouseLeave={() => setHoveredStar(null)}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      )
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Escribir Reseña
        </h2>
        <p className="text-gray-600">
          <strong>Servicio:</strong> {serviceTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Calificación con estrellas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && (
                rating === 1 ? 'Muy malo' :
                rating === 2 ? 'Malo' :
                rating === 3 ? 'Regular' :
                rating === 4 ? 'Bueno' :
                'Excelente'
              )}
            </span>
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageSquare className="inline w-4 h-4 mr-1" />
            Comentario (opcional)
          </label>
          <Textarea
            {...register('comment')}
            placeholder="Comparte tu experiencia con este servicio..."
            rows={4}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
          </Button>
        </div>
      </form>
    </div>
  )
}
