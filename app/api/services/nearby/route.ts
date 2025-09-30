import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para servicios cercanos
const nearbyServicesSchema = z.object({
  latitude: z.number().min(-90).max(90, 'Latitud inválida'),
  longitude: z.number().min(-180).max(180, 'Longitud inválida'),
  radius: z.number().min(0.1).max(100).optional().default(10), // Radio en kilómetros
  category: z.string().optional()
})

// Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371 // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// GET - Obtener servicios cercanos basados en coordenadas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extraer parámetros de la URL
    const latitude = parseFloat(searchParams.get('latitude') || '0')
    const longitude = parseFloat(searchParams.get('longitude') || '0')
    const radius = parseFloat(searchParams.get('radius') || '10')
    const category = searchParams.get('category')

    // Validar parámetros
    const validatedData = nearbyServicesSchema.parse({
      latitude,
      longitude,
      radius,
      category
    })

    // Construir filtros para la consulta
    let whereClause: any = {
      isActive: true,
      latitude: { not: null },
      longitude: { not: null }
    }

    if (validatedData.category) {
      whereClause.category = validatedData.category
    }

    // Obtener todos los servicios activos con coordenadas
    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    })

    // Filtrar servicios por distancia y calcular estadísticas
    const nearbyServices = services
      .map(service => {
        if (!service.latitude || !service.longitude) return null

        const distance = calculateDistance(
          validatedData.latitude,
          validatedData.longitude,
          service.latitude,
          service.longitude
        )

        // Calcular calificación promedio
        const averageRating = service.reviews.length > 0
          ? service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length
          : 0

        return {
          ...service,
          distance: Math.round(distance * 100) / 100, // Redondear a 2 decimales
          averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
          totalReviews: service._count.reviews,
          totalBookings: service._count.bookings
        }
      })
      .filter(service => 
        service !== null && 
        service.distance <= validatedData.radius
      )
      .sort((a, b) => a.distance - b.distance) // Ordenar por distancia

    // Remover campos innecesarios del resultado
    const cleanServices = nearbyServices.map(service => {
      const { reviews, _count, ...cleanService } = service
      return cleanService
    })

    return NextResponse.json({
      services: cleanServices,
      total: cleanServices.length,
      searchParams: {
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        radius: validatedData.radius,
        category: validatedData.category
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al obtener servicios cercanos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
