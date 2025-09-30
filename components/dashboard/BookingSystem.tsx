'use client'

import { useState } from 'react'
import { Calendar, Clock, User, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Booking {
  id: string
  serviceName: string
  provider: string
  date: string
  time: string
  duration: number
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  location: string
  notes?: string
}

export default function BookingSystem() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'create'>('upcoming')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [notes, setNotes] = useState('')

  // Datos de ejemplo
  const upcomingBookings: Booking[] = [
    {
      id: '1',
      serviceName: 'Desarrollo Web Full Stack',
      provider: 'Ana Rodríguez',
      date: '2024-01-15',
      time: '10:00',
      duration: 2,
      price: 70,
      status: 'confirmed',
      location: 'Barcelona, España',
      notes: 'Reunión inicial para definir requerimientos'
    },
    {
      id: '2',
      serviceName: 'Diseño UX/UI',
      provider: 'Carlos Mendoza',
      date: '2024-01-18',
      time: '14:30',
      duration: 1.5,
      price: 42,
      status: 'pending',
      location: 'Madrid, España'
    }
  ]

  const bookingHistory: Booking[] = [
    {
      id: '3',
      serviceName: 'Marketing Digital & SEO',
      provider: 'Laura Fernández',
      date: '2024-01-10',
      time: '09:00',
      duration: 3,
      price: 96,
      status: 'completed',
      location: 'Valencia, España'
    }
  ]

  const availableServices = [
    { id: '1', name: 'Desarrollo Web Full Stack', provider: 'Ana Rodríguez', price: 35 },
    { id: '2', name: 'Diseño UX/UI', provider: 'Carlos Mendoza', price: 28 },
    { id: '3', name: 'Marketing Digital & SEO', provider: 'Laura Fernández', price: 32 }
  ]

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendiente'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
    }
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
    }
  }

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }
    
    const service = availableServices.find(s => s.id === selectedService)
    if (!service) return

    // Aquí iría la lógica para crear la reserva
    alert(`Reserva creada exitosamente para ${service.name} el ${selectedDate} a las ${selectedTime}`)
    
    // Reset form
    setSelectedService('')
    setSelectedDate('')
    setSelectedTime('')
    setNotes('')
    setActiveTab('upcoming')
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{booking.serviceName}</h4>
          <p className="text-sm text-gray-600">por {booking.provider}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(booking.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(booking.date).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{booking.time} ({booking.duration}h)</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{booking.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium text-green-600">€{booking.price}</span>
        </div>
      </div>
      
      {booking.notes && (
        <div className="bg-gray-50 rounded p-2 mb-3">
          <p className="text-sm text-gray-700">
            <strong>Notas:</strong> {booking.notes}
          </p>
        </div>
      )}
      
      <div className="flex space-x-2">
        {booking.status === 'pending' && (
          <>
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
              Confirmar
            </button>
            <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
              Cancelar
            </button>
          </>
        )}
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
          Ver Detalles
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sistema de Reservas</h3>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'upcoming', label: 'Próximas Reservas', count: upcomingBookings.length },
            { id: 'history', label: 'Historial', count: bookingHistory.length },
            { id: 'create', label: 'Nueva Reserva', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === 'upcoming' && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Próximas Reservas ({upcomingBookings.length})
          </h4>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
            {upcomingBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tienes reservas próximas</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Crear una nueva reserva
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Historial de Reservas ({bookingHistory.length})
          </h4>
          <div className="space-y-4">
            {bookingHistory.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
            {bookingHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tienes reservas en tu historial</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Crear Nueva Reserva</h4>
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio *
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona un servicio...</option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.provider} (€{service.price}/h)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (horas)
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="1">1 hora</option>
                  <option value="1.5">1.5 horas</option>
                  <option value="2">2 horas</option>
                  <option value="3">3 horas</option>
                  <option value="4">4 horas</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Describe cualquier requerimiento especial o información adicional..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Crear Reserva
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
