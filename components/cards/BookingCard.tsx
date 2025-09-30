'use client'

import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Booking } from '@/types'
import { Button } from '@/components/ui/Button'

interface BookingCardProps {
  booking: Booking
  onUpdateStatus?: (bookingId: string, status: string) => void
  onCancel?: (bookingId: string) => void
  isProvider?: boolean
}

export default function BookingCard({
  booking,
  onUpdateStatus,
  onCancel,
  isProvider = false
}: BookingCardProps) {
  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el icono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'NO_SHOW':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente'
      case 'CONFIRMED':
        return 'Confirmada'
      case 'CANCELLED':
        return 'Cancelada'
      case 'COMPLETED':
        return 'Completada'
      case 'NO_SHOW':
        return 'No se presentó'
      default:
        return status
    }
  }

  // Formatear fecha y hora
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  // Calcular precio total
  const totalPrice = booking.duration * (booking.service?.pricePerHour || 0)

  // Determinar qué acciones están disponibles
  const canConfirm = isProvider && booking.status === 'PENDING'
  const canComplete = isProvider && booking.status === 'CONFIRMED'
  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header con información del servicio */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {booking.service?.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{booking.service?.location}</span>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span>{getStatusText(booking.status)}</span>
        </div>
      </div>

      {/* Información de la cita */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDateTime(booking.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{booking.duration} hora{booking.duration > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>
            {isProvider ? 'Cliente' : 'Proveedor'}: {isProvider ? booking.client?.name : booking.provider?.name}
          </span>
        </div>
      </div>

      {/* Notas */}
      {booking.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Notas:</strong> {booking.notes}
          </p>
        </div>
      )}

      {/* Información de precio */}
      <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Total:</span>
        <span className="font-semibold text-green-600">
          ${totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Botones de acción */}
      {(canConfirm || canComplete || canCancel) && (
        <div className="flex space-x-2">
          {canConfirm && (
            <Button
              onClick={() => onUpdateStatus?.(booking.id, 'CONFIRMED')}
              className="flex-1"
            >
              Confirmar
            </Button>
          )}
          
          {canComplete && (
            <Button
              onClick={() => onUpdateStatus?.(booking.id, 'COMPLETED')}
              className="flex-1"
            >
              Marcar Completada
            </Button>
          )}
          
          {canCancel && (
            <Button
              variant="outline"
              onClick={() => onCancel?.(booking.id)}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
