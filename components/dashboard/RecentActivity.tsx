import { Clock, User, Calendar, MessageSquare } from 'lucide-react'

export default function RecentActivity() {
  // Datos de ejemplo - en producción vendrían de la API
  const activities = [
    {
      id: 1,
      type: 'booking',
      title: 'Nueva reserva recibida',
      description: 'Ana Rodríguez reservó tu servicio de Desarrollo Web',
      time: 'Hace 2 horas',
      icon: Calendar,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'message',
      title: 'Mensaje nuevo',
      description: 'Carlos Mendoza te envió un mensaje',
      time: 'Hace 4 horas',
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 3,
      type: 'review',
      title: 'Nueva reseña',
      description: 'Laura Fernández dejó una reseña de 5 estrellas',
      time: 'Ayer',
      icon: User,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 4,
      type: 'service',
      title: 'Servicio publicado',
      description: 'Tu servicio de Marketing Digital está activo',
      time: 'Hace 2 días',
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Actividad Reciente
        </h3>
        <a
          href="/dashboard/activity"
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Ver todo
        </a>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`${activity.bgColor} rounded-full p-2`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay actividad reciente
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Cuando tengas actividad en tu cuenta, aparecerá aquí.
          </p>
        </div>
      )}
    </div>
  )
}

