import { 
  Users, 
  FolderKanban, 
  Activity, 
  ClipboardList,
  TrendingUp,
  TrendingDown 
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  description?: string
  icon?: 'users' | 'projects' | 'activity' | 'assignment'
  trend?: {
    value: number
    isPositive: boolean
  }
}

const iconMap = {
  users: Users,
  projects: FolderKanban,
  activity: Activity,
  assignment: ClipboardList,
}

export default function StatCard({ 
  title, 
  value, 
  description, 
  icon = 'users',
  trend 
}: StatCardProps) {
  const Icon = iconMap[icon]
  
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  )
}