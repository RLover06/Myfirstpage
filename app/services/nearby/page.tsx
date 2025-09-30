'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MapPin, Search, Filter, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import NearbyServiceCard from '@/components/cards/NearbyServiceCard'
import { Service, SERVICE_CATEGORIES } from '@/types'

interface NearbyService extends Service {
  distance: number
  averageRating: number
  totalReviews: number
  totalBookings: number
}

export default function NearbyServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<NearbyService[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [radius, setRadius] = useState(10)
  const [category, setCategory] = useState<string>('all')

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Obtener ubicación del usuario
  useEffect(() => {
    if (session?.user?.id && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
          setError('No se pudo obtener tu ubicación. Puedes buscar por dirección.')
        }
      )
    }
  }, [session])

  // Buscar servicios cercanos cuando cambie la ubicación
  useEffect(() => {
    if (userLocation) {
      searchNearbyServices()
    }
  }, [userLocation, radius, category])

  const searchNearbyServices = async () => {
    if (!userLocation) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        latitude: userLocation.lat.toString(),
        longitude: userLocation.lng.toString(),
        radius: radius.toString()
      })

      if (category !== 'all') {
        params.append('category', category)
      }

      const response = await fetch(`/api/services/nearby?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al buscar servicios cercanos')
      }

      const data = await response.json()
      setServices(data.services)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/geolocation?address=${encodeURIComponent(searchAddress)}`)
      
      if (!response.ok) {
        throw new Error('No se encontró la dirección')
      }

      const data = await response.json()
      setUserLocation({
        lat: data.latitude,
        lng: data.longitude
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar la dirección')
    } finally {
      setLoading(false)
    }
  }

  const handleBookService = (service: Service) => {
    // Aquí podrías abrir un modal o navegar a una página de reserva
    router.push(`/services/${service.id}?action=book`)
  }

  const handleViewDetails = (service: Service) => {
    router.push(`/services/${service.id}`)
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
            Servicios Cercanos
          </h1>
          <p className="text-gray-600">
            Encuentra servicios profesionales cerca de ti
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {/* Búsqueda por dirección */}
            <div className="flex items-center space-x-4">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div className="flex-1 flex space-x-2">
                <Input
                  type="text"
                  placeholder="Buscar por dirección (ej: Madrid, España)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddressSearch} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              
              <Select
                value={radius.toString()}
                onChange={(value) => setRadius(parseInt(value))}
                options={[
                  { value: '5', label: '5 km' },
                  { value: '10', label: '10 km' },
                  { value: '25', label: '25 km' },
                  { value: '50', label: '50 km' }
                ]}
                className="w-32"
              />

              <Select
                value={category}
                onChange={(value) => setCategory(value)}
                options={[
                  { value: 'all', label: 'Todas las categorías' },
                  ...Object.entries(SERVICE_CATEGORIES).map(([key, value]) => ({
                    value: key,
                    label: value
                  }))
                ]}
                className="w-48"
              />

              {userLocation && (
                <Button
                  onClick={searchNearbyServices}
                  variant="outline"
                  disabled={loading}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Location status */}
        {userLocation && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                Ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
          </div>
        )}

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
            <p className="mt-4 text-gray-600">Buscando servicios...</p>
          </div>
        )}

        {/* No location message */}
        {!loading && !userLocation && !error && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ubicación requerida
            </h3>
            <p className="text-gray-600 mb-4">
              Para encontrar servicios cercanos, necesitamos tu ubicación o puedes buscar por dirección.
            </p>
            <Button onClick={() => window.location.reload()}>
              Permitir Ubicación
            </Button>
          </div>
        )}

        {/* No services found */}
        {!loading && userLocation && services.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-gray-600 mb-4">
              No hay servicios disponibles en el área seleccionada.
            </p>
            <Button onClick={() => setRadius(25)}>
              Ampliar Búsqueda
            </Button>
          </div>
        )}

        {/* Services grid */}
        {!loading && services.length > 0 && (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                Se encontraron {services.length} servicio{services.length > 1 ? 's' : ''} cerca de ti
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <NearbyServiceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookService}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
