'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, MessageSquare, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { BookingFormData } from '@/types'

// Esquema de validación para el formulario de reserva
const bookingSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  duration: z.number().min(1, 'La duración debe ser al menos 1 hora').max(8, 'La duración no puede exceder 8 horas'),
  notes: z.string().optional()
})

interface BookingFormProps {
  serviceId: string
  serviceTitle: string
  providerName: string
  pricePerHour: number
  onSuccess?: (booking: any) => void
  onCancel?: () => void
}

export default function BookingForm({
  serviceId,
  serviceTitle,
  providerName,
  pricePerHour,
  onSuccess,
  onCancel
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema)
  })

  const duration = watch('duration') || 1
  const totalPrice = duration * pricePerHour

  // Generar opciones de duración (1-8 horas)
  const durationOptions = Array.from({ length: 8 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} hora${i > 0 ? 's' : ''}`
  }))

  // Generar opciones de hora (8:00 AM - 8:00 PM)
  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8
    const timeString = hour <= 12 
      ? `${hour}:00 ${hour === 12 ? 'PM' : 'AM'}`
      : `${hour - 12}:00 PM`
    
    return {
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: timeString
    }
  })

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Combinar fecha y hora
      const dateTime = new Date(`${data.date}T${data.time}:00`)
      
      const bookingData: BookingFormData = {
        serviceId,
        date: dateTime.toISOString(),
        duration: data.duration,
        notes: data.notes
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la reserva')
      }

      const result = await response.json()
      onSuccess?.(result.booking)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reservar Servicio
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Servicio:</strong> {serviceTitle}</p>
          <p><strong>Proveedor:</strong> {providerName}</p>
          <p><strong>Precio:</strong> ${pricePerHour}/hora</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Fecha
          </label>
          <Input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...register('date')}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="inline w-4 h-4 mr-1" />
            Hora
          </label>
          <Select
            {...register('time')}
            options={timeOptions}
            placeholder="Selecciona una hora"
            className={errors.time ? 'border-red-500' : ''}
          />
          {errors.time && (
            <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>
          )}
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="inline w-4 h-4 mr-1" />
            Duración
          </label>
          <Select
            {...register('duration', { valueAsNumber: true })}
            options={durationOptions}
            placeholder="Selecciona la duración"
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && (
            <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
          )}
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageSquare className="inline w-4 h-4 mr-1" />
            Notas adicionales (opcional)
          </label>
          <Textarea
            {...register('notes')}
            placeholder="Describe cualquier requerimiento especial..."
            rows={3}
          />
        </div>

        {/* Resumen del precio */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold text-green-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {duration} hora{duration > 1 ? 's' : ''} × ${pricePerHour}/hora
          </p>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
          </Button>
        </div>
      </form>
    </div>
  )
}
