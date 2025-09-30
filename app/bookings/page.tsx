'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import BookingCard from '@/components/cards/BookingCard'
import { Booking, BOOKING_STATUS } from '@/types'

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'client' | 'provider'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Cargar reservas
  useEffect(() => {
    if (session?.user?.id) {
      loadBookings()
    }
  }, [session, filterType, filterStatus])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filterType !== 'all') {
        params.append('type', filterType)
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/bookings?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar las reservas')
      }

      const data = await response.json()
      setBookings(data.bookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado')
      }

      // Recargar las reservas
      loadBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al cancelar la reserva')
      }

      // Recargar las reservas
      loadBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

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
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Gestiona tus citas y servicios reservados
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Filtros</h3>
            
            <Select
              value={filterType}
              onChange={(value) => setFilterType(value as any)}
              options={[
                { value: 'all', label: 'Todas las reservas' },
                { value: 'client', label: 'Como cliente' },
                { value: 'provider', label: 'Como proveedor' }
              ]}
              className="w-48"
            />

            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'PENDING', label: BOOKING_STATUS.PENDING },
                { value: 'CONFIRMED', label: BOOKING_STATUS.CONFIRMED },
                { value: 'COMPLETED', label: BOOKING_STATUS.COMPLETED },
                { value: 'CANCELLED', label: BOOKING_STATUS.CANCELLED },
                { value: 'NO_SHOW', label: BOOKING_STATUS.NO_SHOW }
              ]}
              className="w-48"
            />

            <Button
              onClick={loadBookings}
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
            <p className="mt-4 text-gray-600">Cargando reservas...</p>
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay reservas
            </h3>
            <p className="text-gray-600 mb-4">
              {filterType === 'all' 
                ? 'No tienes reservas registradas'
                : filterType === 'client'
                ? 'No has reservado ningún servicio'
                : 'No tienes servicios reservados'
              }
            </p>
            <Button onClick={() => router.push('/services')}>
              Explorar Servicios
            </Button>
          </div>
        )}

        {/* Bookings grid */}
        {!loading && bookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onUpdateStatus={handleUpdateStatus}
                onCancel={handleCancel}
                isProvider={booking.providerId === session.user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
