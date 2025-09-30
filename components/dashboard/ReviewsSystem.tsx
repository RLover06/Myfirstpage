'use client'

import { useState } from 'react'
import { Star, MessageSquare, ThumbsUp, Filter, Search } from 'lucide-react'

interface Review {
  id: string
  serviceName: string
  provider: string
  clientName: string
  rating: number
  comment: string
  date: string
  helpful: number
  verified: boolean
}

export default function ReviewsSystem() {
  const [activeTab, setActiveTab] = useState<'received' | 'given' | 'write'>('received')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newReview, setNewReview] = useState({
    serviceId: '',
    rating: 5,
    comment: ''
  })

  // Datos de ejemplo
  const receivedReviews: Review[] = [
    {
      id: '1',
      serviceName: 'Desarrollo Web Full Stack',
      provider: 'Ana Rodríguez',
      clientName: 'María García',
      rating: 5,
      comment: 'Excelente trabajo! Ana fue muy profesional y entregó el proyecto antes de tiempo. La comunicación fue fluida durante todo el proceso.',
      date: '2024-01-12',
      helpful: 3,
      verified: true
    },
    {
      id: '2',
      serviceName: 'Diseño UX/UI',
      provider: 'Carlos Mendoza',
      clientName: 'Juan Pérez',
      rating: 4,
      comment: 'Muy buen diseño, aunque tardó un poco más de lo esperado. El resultado final valió la pena.',
      date: '2024-01-08',
      helpful: 1,
      verified: true
    }
  ]

  const givenReviews: Review[] = [
    {
      id: '3',
      serviceName: 'Marketing Digital & SEO',
      provider: 'Laura Fernández',
      clientName: 'Tú',
      rating: 5,
      comment: 'Laura es una excelente profesional. Su estrategia de marketing digital aumentó significativamente nuestro tráfico web.',
      date: '2024-01-05',
      helpful: 2,
      verified: true
    }
  ]

  const availableServices = [
    { id: '1', name: 'Desarrollo Web Full Stack', provider: 'Ana Rodríguez' },
    { id: '2', name: 'Diseño UX/UI', provider: 'Carlos Mendoza' },
    { id: '3', name: 'Marketing Digital & SEO', provider: 'Laura Fernández' }
  ]

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const filteredReviews = (reviews: Review[]) => {
    return reviews.filter(review => {
      const matchesRating = filterRating === null || review.rating === filterRating
      const matchesSearch = searchTerm === '' || 
        review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesRating && matchesSearch
    })
  }

  const handleWriteReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReview.serviceId || !newReview.comment.trim()) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }
    
    const service = availableServices.find(s => s.id === newReview.serviceId)
    if (!service) return

    alert(`Reseña enviada exitosamente para ${service.name}`)
    
    // Reset form
    setNewReview({
      serviceId: '',
      rating: 5,
      comment: ''
    })
    setActiveTab('given')
  }

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{review.serviceName}</h4>
            {review.verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Verificado
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">por {review.provider}</p>
          <div className="flex items-center space-x-2 mb-2">
            {renderStars(review.rating)}
            <span className="text-sm text-gray-500">
              {review.rating}/5 estrellas
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{review.clientName}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.date).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">{review.comment}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <button className="flex items-center space-x-1 hover:text-gray-700">
            <ThumbsUp className="w-4 h-4" />
            <span>Útil ({review.helpful})</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-gray-700">
            <MessageSquare className="w-4 h-4" />
            <span>Responder</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Reseñas y Calificaciones</h3>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'received', label: 'Reseñas Recibidas', count: receivedReviews.length },
            { id: 'given', label: 'Reseñas Enviadas', count: givenReviews.length },
            { id: 'write', label: 'Escribir Reseña', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filtros y búsqueda */}
      {(activeTab === 'received' || activeTab === 'given') && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filtros</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por calificación
              </label>
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Todas las calificaciones</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar reseñas
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por servicio o comentario..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de las tabs */}
      {activeTab === 'received' && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Reseñas Recibidas ({filteredReviews(receivedReviews).length})
          </h4>
          <div className="space-y-4">
            {filteredReviews(receivedReviews).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {filteredReviews(receivedReviews).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tienes reseñas recibidas</p>
                <p className="text-sm">Las reseñas aparecerán aquí cuando los clientes califiquen tus servicios</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'given' && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Reseñas Enviadas ({filteredReviews(givenReviews).length})
          </h4>
          <div className="space-y-4">
            {filteredReviews(givenReviews).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {filteredReviews(givenReviews).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No has enviado ninguna reseña</p>
                <button
                  onClick={() => setActiveTab('write')}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Escribir una reseña
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'write' && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Escribir Nueva Reseña</h4>
          <form onSubmit={handleWriteReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicio *
              </label>
              <select
                value={newReview.serviceId}
                onChange={(e) => setNewReview({ ...newReview, serviceId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Selecciona un servicio...</option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.provider}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calificación *
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({ ...newReview, rating })
                )}
                <span className="text-sm text-gray-500">
                  {newReview.rating}/5 estrellas
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentario *
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
                rows={4}
                placeholder="Comparte tu experiencia con este servicio..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('given')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Enviar Reseña
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
