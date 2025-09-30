'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'El nombre es muy largo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.nativeEnum(UserRole),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type RegisterFormData = z.infer<typeof registerSchema>
type LoginFormData = z.infer<typeof loginSchema>

interface AuthFormProps {
  mode: 'login' | 'register'
  onSubmit: (data: RegisterFormData | LoginFormData) => Promise<void>
  isLoading?: boolean
}

export function AuthForm({ mode, onSubmit, isLoading = false }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData | LoginFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
  })

  const roleOptions = [
    { value: UserRole.CLIENT, label: 'Cliente' },
    { value: UserRole.PROVIDER, label: 'Proveedor' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {mode === 'register' && (
        <div>
          <Input
            label="Nombre completo"
            placeholder="Tu nombre completo"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>
      )}

      <div>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {mode === 'register' && (
        <div>
          <Select
            label="Tipo de usuario"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />
        </div>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </Button>
    </form>
  )
}







