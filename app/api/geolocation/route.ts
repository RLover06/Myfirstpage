import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener coordenadas de una dirección usando geocoding
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Se requiere una dirección' },
        { status: 400 }
      )
    }

    // Usar la API de geocoding de OpenStreetMap (Nominatim) - gratuita
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    
    const response = await fetch(geocodingUrl, {
      headers: {
        'User-Agent': 'MiChamba-App/1.0' // Requerido por Nominatim
      }
    })

    if (!response.ok) {
      throw new Error('Error en la API de geocoding')
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró la dirección' },
        { status: 404 }
      )
    }

    const result = data[0]
    
    return NextResponse.json({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name,
      formattedAddress: result.display_name
    })
  } catch (error) {
    console.error('Error en geocoding:', error)
    return NextResponse.json(
      { error: 'Error al obtener coordenadas' },
      { status: 500 }
    )
  }
}

// POST - Obtener ubicación actual del usuario (requiere permisos del navegador)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude } = body

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Se requieren coordenadas válidas' },
        { status: 400 }
      )
    }

    // Usar reverse geocoding para obtener la dirección
    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    
    const response = await fetch(reverseGeocodingUrl, {
      headers: {
        'User-Agent': 'MiChamba-App/1.0'
      }
    })

    if (!response.ok) {
      throw new Error('Error en reverse geocoding')
    }

    const data = await response.json()

    return NextResponse.json({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: data.display_name || 'Dirección no disponible',
      formattedAddress: data.display_name || 'Dirección no disponible'
    })
  } catch (error) {
    console.error('Error en reverse geocoding:', error)
    return NextResponse.json(
      { error: 'Error al obtener dirección' },
      { status: 500 }
    )
  }
}
