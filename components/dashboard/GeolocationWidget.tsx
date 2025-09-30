'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Search, Filter } from 'lucide-react'

interface GeolocationWidgetProps {
  onLocationUpdate?: (location: { lat: number; lng: number; address: string }) => void
}

export default function GeolocationWidget({ onLocationUpdate }: GeolocationWidgetProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchRadius, setSearchRadius] = useState(10) // km
  const [nearbyServices, setNearbyServices] = useState([
    { id: 1, name: 'Desarrollo Web Full Stack', provider: 'Ana Rodríguez', distance: 2.5, price: '35€/h' },
    { id: 2, name: 'Diseño UX/UI', provider: 'Carlos Mendoza', distance: 1.8, price: '28€/h' },
    { id: 3, name: 'Marketing Digital & SEO', provider: 'Laura Fernández', distance: 3.2, price: '32€/h' }
  ])

  // Obtener ubicación del usuario
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada por este navegador.')
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Simular dirección (en una app real usarías una API de geocodificación inversa)
        const address = `Ubicación actual (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        
        const location = { lat: latitude, lng: longitude, address }
        setUserLocation(location)
        onLocationUpdate?.(location)
        setIsLoading(false)
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error)
        alert('No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación.')
        setIsLoading(false)
      }
    )
  }

  // Filtrar servicios por distancia
  const filteredServices = nearbyServices.filter(service => service.distance <= searchRadius)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Servicios Cercanos</h3>
        </div>
        <button
          onClick={getUserLocation}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Navigation className="w-4 h-4" />
          <span>{isLoading ? 'Obteniendo...' : 'Usar Mi Ubicación'}</span>
        </button>
      </div>

      {/* Información de ubicación */}
      {userLocation && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Ubicación Actual:</span>
          </div>
          <p className="text-blue-800 text-sm">{userLocation.address}</p>
        </div>
      )}

      {/* Filtros de búsqueda */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filtros de Búsqueda</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Radio de búsqueda: {searchRadius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por dirección
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ingresa una dirección..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de servicios cercanos */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Servicios encontrados ({filteredServices.length})
        </h4>
        
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{service.name}</h5>
                  <p className="text-sm text-gray-600 mb-2">por {service.provider}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.distance} km</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-green-600">{service.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Ver Detalles
                  </button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron servicios en el radio seleccionado</p>
            <p className="text-sm">Intenta aumentar el radio de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
