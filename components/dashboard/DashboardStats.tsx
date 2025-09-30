import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star,
  TrendingUp,
  DollarSign
} from 'lucide-react'

export default function DashboardStats() {
  // Datos de ejemplo - en producción vendrían de la API
  const stats = [
    {
      name: 'Servicios Activos',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Reservas Este Mes',
      value: '8',
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Mensajes Nuevos',
      value: '5',
      change: '+1',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      name: 'Calificación Promedio',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      name: 'Ingresos Este Mes',
      value: '€1,240',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      name: 'Crecimiento',
      value: '23%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`${stat.color} rounded-lg p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

