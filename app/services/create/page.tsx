'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ServiceForm } from '@/components/forms/ServiceForm'
import { ServiceFormData } from '@/types'
import { UserRole } from '@prisma/client'

export default function CreateServicePage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Verificar autenticación y rol
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 bg-primary-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  if (session.user.role !== UserRole.PROVIDER) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-secondary-600">
            Solo los proveedores pueden crear servicios.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: ServiceFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/profile')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al crear el servicio')
      }
    } catch (error) {
      setError('Error al crear el servicio')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Publicar Nuevo Servicio
        </h1>
        <p className="text-secondary-600">
          Completa la información de tu servicio para que los clientes puedan encontrarlo
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <ServiceForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}







