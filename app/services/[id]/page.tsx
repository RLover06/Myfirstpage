import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { SERVICE_CATEGORIES } from '@/types'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ServiceDetailPageProps {
  params: {
    id: string
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = await prisma.service.findUnique({
    where: {
      id: params.id,
      isActive: true,
    },
    include: {
      user: true,
    },
  })

  if (!service) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {service.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                  {SERVICE_CATEGORIES[service.category]}
                </span>
                <span className="text-secondary-500">
                  por {service.user.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(service.pricePerHour)}
              </p>
              <p className="text-secondary-500">por hora</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              Descripción del Servicio
            </h2>
            <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Ubicación
              </h3>
              <div className="flex items-center text-secondary-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {service.location}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Fecha de Publicación
              </h3>
              <p className="text-secondary-600">
                {formatDate(service.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/messages?service=${service.id}&provider=${service.userId}`} className="flex-1">
              <Button className="w-full">
                Contactar Proveedor
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full sm:w-auto">
                Volver a Servicios
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}







