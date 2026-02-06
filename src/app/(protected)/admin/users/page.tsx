import { db } from '@/db'
import { UsersTable } from '@/db/schema'
import { eq, ilike, or } from 'drizzle-orm'
import Link from 'next/link'
import UserFilters from '@/components/admin/userFilters'
import { Mail, UserCircle } from 'lucide-react'

interface PageProps {
  searchParams: {
    role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
    search?: string
  }
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Build query based on filters
  let query = db.select().from(UsersTable)

  const conditions = []

  // Filter by role
  if (searchParams.role) {
    conditions.push(eq(UsersTable.role, searchParams.role))
  }

  // Search by name or email
  if (searchParams.search) {
    conditions.push(
      or(
        ilike(UsersTable.name, `%${searchParams.search}%`),
        ilike(UsersTable.email, `%${searchParams.search}%`)
      )
    )
  }

  const users = conditions.length > 0
    ? await query.where(or(...conditions))
    : await query

  // Calculate stats
  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === 'ADMIN').length,
    manager: users.filter((u) => u.role === 'MANAGER').length,
    employee: users.filter((u) => u.role === 'EMPLOYEE').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and their roles
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add User
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={stats.total} />
        <StatCard label="Admins" value={stats.admin} color="red" />
        <StatCard label="Managers" value={stats.manager} color="blue" />
        <StatCard label="Employees" value={stats.employee} color="green" />
      </div>

      {/* Filters */}
      <UserFilters
        currentRole={searchParams.role}
        currentSearch={searchParams.search}
      />

      {/* Users Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'gray',
}: {
  label: string
  value: number
  color?: 'red' | 'blue' | 'green' | 'gray'
}) {
  const colorClasses = {
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-50 text-gray-700',
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-blue-100 text-blue-700',
    employee: 'bg-green-100 text-green-700',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[role as keyof typeof styles]
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )
}