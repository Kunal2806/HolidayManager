import { db } from '@/db'
import { UsersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Mail, Calendar, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import UserActions from '@/components/admin/usersAction'

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params

  if (!userId) notFound()

  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, userId),
  })

  if (!user) notFound()

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'

  const displayName = user.name ?? 'Unknown User'
  const initials = displayName.charAt(0).toUpperCase()
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          </div>
        </div>
        <RoleBadge role={user.role} />
      </div>

      {/* User Info Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic Info */}
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            User Information
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<Shield className="h-5 w-5" />}
              label="User ID"
              value={`#${user.id}`}
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5" />}
              label="Joined"
              value={joinedDate}
            />
            <InfoItem
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={user.email}
            />
            <InfoItem
              icon={<Shield className="h-5 w-5" />}
              label="Role"
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            />
          </dl>
        </div>

        {/* Admin Actions */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Admin Actions
          </h2>
          <UserActions userId={user.id} currentRole={user.role} userName={user.name} />
        </div>
      </div>

      {/* Activity Section (placeholder) */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Activity
        </h2>
        <p className="text-sm text-gray-500">
          No recent activity to display.
        </p>
      </div>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    manager: 'bg-blue-100 text-blue-700 border-blue-200',
    employee: 'bg-green-100 text-green-700 border-green-200',
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
        styles[role as keyof typeof styles]
      }`}
    >
      <Shield className="h-4 w-4" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )
}