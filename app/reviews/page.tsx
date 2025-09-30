'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Star, Filter, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import ReviewCard from '@/components/cards/ReviewCard'
import { Review } from '@/types'

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'received' | 'written'>('received')

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Cargar reseñas
  useEffect(() => {
    if (session?.user?.id) {
      loadReviews()
    }
  }, [session, filterType])

  const loadReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filterType === 'received') {
        params.append('userId', session?.user?.id || '')
      } else {
        // Para reseñas escritas, necesitaríamos una API diferente
        // Por ahora, cargamos las recibidas
        params.append('userId', session?.user?.id || '')
      }

      const response = await fetch(`/api/reviews?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar las reseñas')
      }

      const data = await response.json()
      setReviews(data.reviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas de reseñas
  const calculateStats = () => {
    if (reviews.length === 0) return { average: 0, total: 0 }

    const total = reviews.length
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    const average = sum / total

    return {
      average: Math.round(average * 10) / 10,
      total
    }
  }

  const stats = calculateStats()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reseñas y Calificaciones
          </h1>
          <p className="text-gray-600">
            Gestiona las reseñas de tus servicios
          </p>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Estadísticas de Reseñas
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.average}
                    </span>
                    <span className="text-gray-600">/ 5.0</span>
                  </div>
                  <div className="text-gray-600">
                    {stats.total} reseña{stats.total > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button onClick={() => router.push('/bookings')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ver Reservas
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Filtros</h3>
            
            <Select
              value={filterType}
              onChange={(value) => setFilterType(value as any)}
              options={[
                { value: 'received', label: 'Reseñas recibidas' },
                { value: 'written', label: 'Reseñas escritas' }
              ]}
              className="w-48"
            />

            <Button
              onClick={loadReviews}
              variant="outline"
              className="ml-auto"
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reseñas...</p>
          </div>
        )}

        {/* No reviews */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay reseñas
            </h3>
            <p className="text-gray-600 mb-4">
              {filterType === 'received' 
                ? 'Aún no has recibido reseñas por tus servicios'
                : 'Aún no has escrito ninguna reseña'
              }
            </p>
            <Button onClick={() => router.push('/services')}>
              Explorar Servicios
            </Button>
          </div>
        )}

        {/* Reviews list */}
        {!loading && reviews.length > 0 && (
          <div className="space-y-6">
            <div className="mb-4">
              <p className="text-gray-600">
                {reviews.length} reseña{reviews.length > 1 ? 's' : ''} encontrada{reviews.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
