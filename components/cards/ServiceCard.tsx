import Link from 'next/link'
import { Service } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { SERVICE_CATEGORIES } from '@/types'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {service.title}
            </h3>
            <p className="text-sm text-secondary-600 mb-2">
              por {service.user.name}
            </p>
            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              {SERVICE_CATEGORIES[service.category]}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(service.pricePerHour)}
            </p>
            <p className="text-sm text-secondary-500">por hora</p>
          </div>
        </div>

        <p className="text-secondary-700 mb-4 line-clamp-3">
          {service.description}
        </p>

        <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {service.location}
          </div>
          <span>{formatDate(service.createdAt)}</span>
        </div>

        <div className="flex space-x-2">
          <Link href={`/services/${service.id}`} className="flex-1">
            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
              Ver Detalles
            </button>
          </Link>
          <Link href={`/messages?service=${service.id}&provider=${service.userId}`}>
            <button className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-colors">
              Contactar
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}