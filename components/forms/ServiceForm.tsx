'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ServiceCategory } from '@prisma/client'
import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { SERVICE_CATEGORIES } from '@/types'

const serviceSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'El título es muy largo'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'La descripción es muy larga'),
  pricePerHour: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  category: z.nativeEnum(ServiceCategory),
  location: z.string().min(1, 'La ubicación es requerida').max(100, 'La ubicación es muy larga'),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData & { latitude?: number, longitude?: number }) => Promise<void>
  isLoading?: boolean
  initialData?: Partial<ServiceFormData>
}

export function ServiceForm({ onSubmit, isLoading = false, initialData }: ServiceFormProps) {
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData,
  })

  const location = watch('location')

  const categoryOptions = Object.entries(SERVICE_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }))

  // Función para obtener coordenadas de la ubicación
  const getLocationCoordinates = async () => {
    if (!location) {
      alert('Por favor ingresa una ubicación primero')
      return
    }

    try {
      setGettingLocation(true)
      const response = await fetch(`/api/geolocation?address=${encodeURIComponent(location)}`)
      
      if (!response.ok) {
        throw new Error('No se pudo obtener las coordenadas')
      }

      const data = await response.json()
      setLocationCoords({
        lat: data.latitude,
        lng: data.longitude
      })
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error)
      alert('No se pudo obtener las coordenadas de la ubicación')
    } finally {
      setGettingLocation(false)
    }
  }

  // Función para obtener ubicación actual del usuario
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en tu navegador')
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Obtener dirección usando reverse geocoding
          const response = await fetch('/api/geolocation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latitude, longitude })
          })

          if (response.ok) {
            const data = await response.json()
            setValue('location', data.address)
            setLocationCoords({ lat: latitude, lng: longitude })
          }
        } catch (error) {
          console.error('Error obteniendo dirección:', error)
        } finally {
          setGettingLocation(false)
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error)
        alert('No se pudo obtener tu ubicación actual')
        setGettingLocation(false)
      }
    )
  }

  const handleFormSubmit = (data: ServiceFormData) => {
    const submitData = {
      ...data,
      latitude: locationCoords?.lat,
      longitude: locationCoords?.lng
    }
    return onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Input
          label="Título del Servicio"
          placeholder="Ej: Desarrollo de aplicaciones web"
          error={errors.title?.message}
          {...register('title')}
        />
      </div>

      <div>
        <Textarea
          label="Descripción"
          placeholder="Describe tu servicio en detalle..."
          rows={4}
          error={errors.description?.message}
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Precio por Hora (€)"
            type="number"
            step="0.01"
            min="0"
            placeholder="25.00"
            error={errors.pricePerHour?.message}
            {...register('pricePerHour', { valueAsNumber: true })}
          />
        </div>

        <div>
          <Select
            label="Categoría"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />
        </div>
      </div>

      <div>
        <div className="space-y-2">
          <Input
            label="Ubicación"
            placeholder="Ej: Madrid, España"
            error={errors.location?.message}
            {...register('location')}
          />
          
          {/* Botones de geolocalización */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Mi Ubicación</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={getLocationCoordinates}
              disabled={gettingLocation || !location}
              className="flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Obtener Coordenadas</span>
            </Button>
          </div>

          {/* Mostrar coordenadas obtenidas */}
          {locationCoords && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  Coordenadas: {locationCoords.lat.toFixed(4)}, {locationCoords.lng.toFixed(4)}
                </span>
              </div>
            </div>
          )}

          {gettingLocation && (
            <div className="text-sm text-gray-600">
              Obteniendo ubicación...
            </div>
          )}
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        {initialData ? 'Actualizar Servicio' : 'Publicar Servicio'}
      </Button>
    </form>
  )
}







