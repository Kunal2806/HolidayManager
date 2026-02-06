import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/db'
import { UsersTable, projects, managerProjects } from '@/db/schema'
import { eq } from 'drizzle-orm'
import StatCard from '@/components/admin/StatCard'
import StatusChart from '@/components/admin/StatusChart'
import AssignmentsTable from '@/components/admin/AssignmentsTable'
import QuickLinks from '@/components/admin/QuickLinks'

// Type definitions based on your schema
interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  createdAt: Date
}

interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'completed' | 'on_hold'
  createdAt: Date
}

interface ManagerProject {
  id: number
  managerId: number
  managerName: string | null
  projectId: number
  projectName: string | null
  assignedAt: Date
}

interface StatusCount {
  active: number
  completed: number
  on_hold: number
}

// Server Component - runs on server only
export default async function AdminDashboardPage() {
  // STEP 1 & 2: Session check and role guard
  const session = await auth()

  // if (!session || session.user.role !== 'admin') {
  //   redirect('/auth/login')
  // }

  // STEP 3: Fetch data directly from database using Drizzle
  try {
    const [users, projectsList, assignments] = await Promise.all([
      // Fetch users
      db
        .select({
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email,
          role: UsersTable.role,
          createdAt: UsersTable.createdAt,
        })
        .from(UsersTable),

      // Fetch projects
      db
        .select({
          id: projects.id,
          name: projects.name,
          description: projects.description,
          status: projects.status,
          createdAt: projects.createdAt,
        })
        .from(projects),

      // Fetch manager-project assignments with joins
      db
        .select({
          id: managerProjects.id,
          managerId: managerProjects.managerId,
          managerName: UsersTable.name,
          projectId: managerProjects.projectId,
          projectName: projects.name,
          assignedAt: managerProjects.assignedAt,
        })
        .from(managerProjects)
        .leftJoin(UsersTable, eq(managerProjects.managerId, UsersTable.id))
        .leftJoin(projects, eq(managerProjects.projectId, projects.id)),
    ])

    // STEP 5: Data aggregation
    const totalUsers = users.length
    const totalProjects = projectsList.length

    // Calculate role breakdown
    const roleBreakdown = {
      admin: users.filter((u) => u.role === 'ADMIN').length,
      manager: users.filter((u) => u.role === 'MANAGER').length,
      employee: users.filter((u) => u.role === 'EMPLOYEE').length,
    }

    // Calculate project status counts
    const statusCount: StatusCount = {
      active: projectsList.filter((p) => p.status === 'active').length,
      completed: projectsList.filter((p) => p.status === 'completed').length,
      on_hold: projectsList.filter((p) => p.status === 'on_hold').length,
    }

    const totalAssignments = assignments.length

    // Format assignments for the table component
    const formattedAssignments = assignments.map((a) => ({
      managerName: a.managerName || 'Unknown Manager',
      projectName: a.projectName || 'Unknown Project',
      assignedAt: a.assignedAt?.toISOString(),
    }))

    // STEP 6: Render UI with aggregated data
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Overview of users, projects, and assignments
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={totalUsers}
              description={`${roleBreakdown.admin} admins, ${roleBreakdown.manager} managers`}
              icon="users"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Projects"
              value={totalProjects}
              description={`${statusCount.active} active projects`}
              icon="projects"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Active Projects"
              value={statusCount.active}
              description={`${statusCount.completed} completed`}
              icon="activity"
            />
            <StatCard
              title="Assignments"
              value={totalAssignments}
              description="Manager-project assignments"
              icon="assignment"
            />
          </div>

          {/* Charts and Tables Grid */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Project Status Chart */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Project Status Distribution
              </h2>
              <StatusChart data={statusCount} />
            </div>

            {/* Quick Links */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
              <QuickLinks />
            </div>
          </div>

          {/* Recent Assignments Table */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Manager Assignments
            </h2>
            <AssignmentsTable assignments={formattedAssignments.slice(0, 10)} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    
    // Error fallback UI
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-red-600">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">
            Failed to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}