import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookingFormData } from '@/types'
import { z } from 'zod'

// Esquema de validación para crear una reserva
const createBookingSchema = z.object({
  serviceId: z.string().min(1, 'El ID del servicio es requerido'),
  date: z.string().datetime('Fecha inválida'),
  duration: z.number().min(1, 'La duración debe ser al menos 1 hora').max(24, 'La duración no puede exceder 24 horas'),
  notes: z.string().optional()
})

// GET - Obtener reservas del usuario autenticado
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'client' o 'provider'
    const status = searchParams.get('status')

    let whereClause: any = {}

    if (type === 'client') {
      whereClause.clientId = session.user.id
    } else if (type === 'provider') {
      whereClause.providerId = session.user.id
    } else {
      // Si no se especifica tipo, mostrar ambas
      whereClause.OR = [
        { clientId: session.user.id },
        { providerId: session.user.id }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        service: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva reserva
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)

    // Verificar que el servicio existe y está activo
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      include: { user: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      )
    }

    if (!service.isActive) {
      return NextResponse.json(
        { error: 'El servicio no está disponible' },
        { status: 400 }
      )
    }

    // Verificar que el usuario no está reservando su propio servicio
    if (service.userId === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes reservar tu propio servicio' },
        { status: 400 }
      )
    }

    // Verificar que no hay una reserva duplicada para la misma fecha y servicio
    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId: validatedData.serviceId,
        date: new Date(validatedData.date),
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Ya existe una reserva para esta fecha y hora' },
        { status: 400 }
      )
    }

    // Crear la reserva
    const booking = await prisma.booking.create({
      data: {
        serviceId: validatedData.serviceId,
        clientId: session.user.id,
        providerId: service.userId,
        date: new Date(validatedData.date),
        duration: validatedData.duration,
        notes: validatedData.notes,
        status: 'PENDING'
      },
      include: {
        service: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear reserva:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
