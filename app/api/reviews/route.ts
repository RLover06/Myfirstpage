import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ReviewFormData } from '@/types'
import { z } from 'zod'

// Esquema de validación para crear una reseña
const createReviewSchema = z.object({
  serviceId: z.string().min(1, 'El ID del servicio es requerido'),
  rating: z.number().min(1, 'La calificación debe ser al menos 1').max(5, 'La calificación no puede exceder 5'),
  comment: z.string().optional()
})

// GET - Obtener reseñas de un servicio específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const userId = searchParams.get('userId') // Para obtener reseñas de un usuario específico

    if (!serviceId && !userId) {
      return NextResponse.json(
        { error: 'Se requiere serviceId o userId' },
        { status: 400 }
      )
    }

    let whereClause: any = {}

    if (serviceId) {
      whereClause.serviceId = serviceId
    }

    if (userId) {
      whereClause.receiverId = userId
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estadísticas si se solicitan reseñas de un servicio
    let stats = null
    if (serviceId) {
      const reviewStats = await prisma.review.aggregate({
        where: { serviceId },
        _avg: {
          rating: true
        },
        _count: {
          rating: true
        }
      })

      stats = {
        averageRating: reviewStats._avg.rating || 0,
        totalReviews: reviewStats._count.rating
      }
    }

    return NextResponse.json({ reviews, stats })
  } catch (error) {
    console.error('Error al obtener reseñas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva reseña
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Verificar que el servicio existe
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

    // Verificar que el usuario no está reseñando su propio servicio
    if (service.userId === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes reseñar tu propio servicio' },
        { status: 400 }
      )
    }

    // Verificar que el usuario ya reservó este servicio y está completado
    const completedBooking = await prisma.booking.findFirst({
      where: {
        serviceId: validatedData.serviceId,
        clientId: session.user.id,
        status: 'COMPLETED'
      }
    })

    if (!completedBooking) {
      return NextResponse.json(
        { error: 'Debes completar una reserva antes de poder reseñar' },
        { status: 400 }
      )
    }

    // Verificar que no existe ya una reseña para este servicio por este usuario
    const existingReview = await prisma.review.findUnique({
      where: {
        serviceId_authorId: {
          serviceId: validatedData.serviceId,
          authorId: session.user.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Ya has reseñado este servicio' },
        { status: 400 }
      )
    }

    // Crear la reseña
    const review = await prisma.review.create({
      data: {
        serviceId: validatedData.serviceId,
        authorId: session.user.id,
        receiverId: service.userId,
        rating: validatedData.rating,
        comment: validatedData.comment
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear reseña:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
