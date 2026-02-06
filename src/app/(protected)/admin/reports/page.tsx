import { db } from '@/db'
import { requests, UsersTable } from '@/db/schema'
import { eq, sql, and, gte } from 'drizzle-orm'
import { BarChart3, TrendingUp, Users, FileText } from 'lucide-react'

export default async function ReportsPage() {
  // Get date 30 days ago
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Fetch analytics data
  const [
    totalUsers,
    totalRequests,
    recentRequests,
    requestsByStatus,
    requestsByType,
  ] = await Promise.all([
    // Total users
    db.select({ count: sql<number>`count(*)` }).from(UsersTable),
    
    // Total requests
    db.select({ count: sql<number>`count(*)` }).from(requests),
    
    // Recent requests (last 30 days)
    db
      .select({ count: sql<number>`count(*)` })
      .from(requests)
      .where(gte(requests.createdAt, thirtyDaysAgo)),
    
    // Requests by status
    db
      .select({
        status: requests.status,
        count: sql<number>`count(*)`,
      })
      .from(requests)
      .groupBy(requests.status),
    
    // Requests by type
    db
      .select({
        type: requests.type,
        count: sql<number>`count(*)`,
      })
      .from(requests)
      .groupBy(requests.type)
      .limit(10),
  ])

  const stats = {
    totalUsers: totalUsers[0]?.count || 0,
    totalRequests: totalRequests[0]?.count || 0,
    recentRequests: recentRequests[0]?.count || 0,
  }

  // Calculate approval rate
  const approvedCount =
    requestsByStatus.find((r) => r.status === 'approved')?.count || 0
  const totalProcessed =
    requestsByStatus
      .filter((r) => r.status !== 'pending')
      .reduce((sum, r) => sum + (r.count || 0), 0) || 1
  const approvalRate = Math.round((approvedCount / totalProcessed) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          System-wide statistics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard
          label="Total Users"
          value={stats.totalUsers.toString()}
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <MetricCard
          label="Total Requests"
          value={stats.totalRequests.toString()}
          icon={<FileText className="h-5 w-5" />}
          color="purple"
        />
        <MetricCard
          label="Last 30 Days"
          value={stats.recentRequests.toString()}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <MetricCard
          label="Approval Rate"
          value={`${approvalRate}%`}
          icon={<BarChart3 className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Requests by Status */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Requests by Status
          </h2>
          <div className="space-y-3">
            {requestsByStatus.map((item) => (
              <StatusBar
                key={item.status}
                label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                value={item.count || 0}
                total={stats.totalRequests}
                status={item.status}
              />
            ))}
          </div>
        </div>

        {/* Requests by Type */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Top Request Types
          </h2>
          <div className="space-y-3">
            {requestsByType.map((item, index) => (
              <TypeBar
                key={item.type}
                label={item.type}
                value={item.count || 0}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Export Data
        </h2>
        <div className="flex gap-3">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export as CSV
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export as Excel
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'purple' | 'green' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatusBar({
  label,
  value,
  total,
  status,
}: {
  label: string
  value: number
  total: number
  status: string
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  const colors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full ${colors[status as keyof typeof colors]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function TypeBar({
  label,
  value,
  rank,
}: {
  label: string
  value: number
  rank: number
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {rank}
        </span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}