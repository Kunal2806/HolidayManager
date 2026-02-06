import { db } from '@/db'
import { requests, UsersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { FileText, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'
import RequestFilters from '@/components/admin/RequestFilters'
import RequestCard from '@/components/admin/RequestCard'

interface PageProps {
  searchParams: {
    status?: 'pending' | 'approved' | 'rejected'
  }
}

export default async function RequestsPage({ searchParams }: PageProps) {
  // Fetch requests with user info
  let query = db
    .select({
      id: requests.id,
      userId: requests.userId,
      userName: UsersTable.name,
      userEmail: UsersTable.email,
      type: requests.type,
      description: requests.description,
      status: requests.status,
      adminRemarks: requests.adminRemarks,
      createdAt: requests.createdAt,
      updatedAt: requests.updatedAt,
    })
    .from(requests)
    .leftJoin(UsersTable, eq(requests.userId, UsersTable.id))
    .$dynamic()

  // Filter by status
  if (searchParams.status) {
    query = query.where(eq(requests.status, searchParams.status))
  }

  const allRequests = await query

  // Calculate stats
  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === 'pending').length,
    approved: allRequests.filter((r) => r.status === 'approved').length,
    rejected: allRequests.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve employee requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          icon={<FileText className="h-5 w-5" />}
          color="gray"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5" />}
          color="red"
        />
      </div>

      {/* Filters */}
      <RequestFilters currentStatus={searchParams.status} />

      {/* Requests List */}
      <div className="space-y-4">
        {allRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-12 shadow-sm">
            <FileText className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No requests found</p>
          </div>
        ) : (
          allRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: 'gray' | 'yellow' | 'green' | 'red'
}) {
  const colorClasses = {
    gray: 'bg-gray-50 text-gray-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`mt-1 text-2xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}