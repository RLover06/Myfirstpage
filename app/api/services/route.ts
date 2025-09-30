import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ServiceCategory, UserRole } from '@prisma/client'

const serviceSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  pricePerHour: z.number().min(0.01),
  category: z.nativeEnum(ServiceCategory),
  location: z.string().min(1).max(100),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.PROVIDER) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, pricePerHour, category, location, latitude, longitude } = serviceSchema.parse(body)

    const service = await prisma.service.create({
      data: {
        title,
        description,
        pricePerHour,
        category,
        location,
        latitude,
        longitude,
        userId: session.user.id,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear servicio:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        ...(category && { category: category as ServiceCategory }),
        ...(userId && { userId }),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}







