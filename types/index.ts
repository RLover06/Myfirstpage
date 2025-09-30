import { UserRole, ServiceCategory, BookingStatus } from '@prisma/client'

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  title: string
  description: string
  pricePerHour: number
  category: ServiceCategory
  location: string
  latitude?: number | null
  longitude?: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user: User
  bookings?: Booking[]
  reviews?: Review[]
}

export interface Message {
  id: string
  content: string
  isRead: boolean
  createdAt: Date
  senderId: string
  receiverId: string
  serviceId: string | null
  sender: User
  receiver: User
  service?: Service | null
}

export interface Profile {
  id: string
  userId: string
  bio: string | null
  location: string | null
  phone: string | null
  website: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ServiceFormData {
  title: string
  description: string
  pricePerHour: number
  category: ServiceCategory
  location: string
}

export interface MessageFormData {
  content: string
  receiverId: string
  serviceId?: string
}

export interface AuthFormData {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginFormData {
  email: string
  password: string
}

// Interfaces para reservas
export interface Booking {
  id: string
  serviceId: string
  clientId: string
  providerId: string
  date: Date
  duration: number
  status: BookingStatus
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  service?: Service
  client?: User
  provider?: User
}

export interface BookingFormData {
  serviceId: string
  date: string // Formato ISO string
  duration: number
  notes?: string
}

// Interfaces para reseñas
export interface Review {
  id: string
  serviceId: string
  authorId: string
  receiverId: string
  rating: number
  comment?: string | null
  createdAt: Date
  updatedAt: Date
  service?: Service
  author?: User
  receiver?: User
}

export interface ReviewFormData {
  serviceId: string
  rating: number
  comment?: string
}

// Interfaces para geolocalización
export interface LocationData {
  latitude: number
  longitude: number
  address?: string
}

export interface NearbyServicesParams {
  latitude: number
  longitude: number
  radius?: number // en kilómetros, por defecto 10km
  category?: ServiceCategory
}

export const SERVICE_CATEGORIES = {
  TECHNOLOGY: 'Tecnología',
  DESIGN: 'Diseño',
  MARKETING: 'Marketing',
  WRITING: 'Escritura',
  CONSULTING: 'Consultoría',
  EDUCATION: 'Educación',
  HEALTH: 'Salud',
  FITNESS: 'Fitness',
  PHOTOGRAPHY: 'Fotografía',
  OTHER: 'Otro'
} as const

export const USER_ROLES = {
  CLIENT: 'Cliente',
  PROVIDER: 'Proveedor'
} as const

export const BOOKING_STATUS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
  NO_SHOW: 'No se presentó'
} as const