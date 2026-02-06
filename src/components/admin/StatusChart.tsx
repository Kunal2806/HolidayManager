'use client'

interface StatusChartProps {
  data: {
    active: number
    completed: number
    on_hold: number
  }
}

export default function StatusChart({ data }: StatusChartProps) {
  const total = data.active + data.completed + data.on_hold
  
  // Calculate percentages
  const activePercent = total > 0 ? (data.active / total) * 100 : 0
  const completedPercent = total > 0 ? (data.completed / total) * 100 : 0
  const onHoldPercent = total > 0 ? (data.on_hold / total) * 100 : 0

  const stats = [
    {
      label: 'Active',
      value: data.active,
      percent: activePercent,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      label: 'Completed',
      value: data.completed,
      percent: completedPercent,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      label: 'On Hold',
      value: data.on_hold,
      percent: onHoldPercent,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="flex h-full">
          {data.active > 0 && (
            <div
              className="bg-green-500"
              style={{ width: `${activePercent}%` }}
            />
          )}
          {data.completed > 0 && (
            <div
              className="bg-blue-500"
              style={{ width: `${completedPercent}%` }}
            />
          )}
          {data.on_hold > 0 && (
            <div
              className="bg-yellow-500"
              style={{ width: `${onHoldPercent}%` }}
            />
          )}
        </div>
      </div>

      {/* Stats List */}
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${stat.color}`} />
              <span className="text-sm font-medium text-gray-700">
                {stat.label}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {stat.percent.toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <div className={`rounded px-2 py-1 ${stat.lightColor}`}>
                  <span className={`text-sm font-semibold ${stat.textColor}`}>
                    {stat.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  )
}