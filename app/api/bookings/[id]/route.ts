import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema para actualizar el estado de una reserva
const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
})

// GET - Obtener una reserva específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el usuario tiene acceso a esta reserva
    if (booking.clientId !== session.user.id && booking.providerId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta reserva' },
        { status: 403 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error al obtener reserva:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar una reserva (principalmente el estado)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    // Verificar que la reserva existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: true,
        client: true,
        provider: true
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Verificar permisos para actualizar
    const canUpdate = 
      existingBooking.providerId === session.user.id || // El proveedor puede cambiar el estado
      (existingBooking.clientId === session.user.id && validatedData.status === 'CANCELLED') // El cliente solo puede cancelar

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar esta reserva' },
        { status: 403 }
      )
    }

    // Actualizar la reserva
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        updatedAt: new Date()
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

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al actualizar reserva:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Cancelar una reserva
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que la reserva existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Solo el cliente puede cancelar su reserva
    if (existingBooking.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Solo puedes cancelar tus propias reservas' },
        { status: 403 }
      )
    }

    // Solo se pueden cancelar reservas pendientes o confirmadas
    if (!['PENDING', 'CONFIRMED'].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: 'Esta reserva no se puede cancelar' },
        { status: 400 }
      )
    }

    // Actualizar el estado a cancelado
    await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ message: 'Reserva cancelada exitosamente' })
  } catch (error) {
    console.error('Error al cancelar reserva:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
