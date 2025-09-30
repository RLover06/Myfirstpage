import { prisma } from '@/lib/prisma'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { Select } from '@/components/ui/Select'
import { ServiceCategory, SERVICE_CATEGORIES } from '@/types'

interface ServicesPageProps {
  searchParams: {
    category?: string
  }
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { category } = searchParams

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      ...(category && { category: category as ServiceCategory }),
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...Object.entries(SERVICE_CATEGORIES).map(([value, label]) => ({
      value,
      label,
    })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Servicios Disponibles
        </h1>
        <p className="text-secondary-600 mb-6">
          Encuentra el servicio perfecto para tus necesidades
        </p>
        
        <div className="max-w-md">
          <form method="GET" action="/services">
            <Select
              name="category"
              options={categoryOptions}
              defaultValue={category || ''}
              onChange={(e) => {
                const form = e.target.closest('form')
                form?.submit()
              }}
            />
          </form>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-secondary-600">
            {category 
              ? `No hay servicios disponibles en la categoría "${SERVICE_CATEGORIES[category as ServiceCategory]}"`
              : 'No hay servicios disponibles en este momento'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}







