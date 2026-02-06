import Link from 'next/link'
import { Users, FolderKanban, UserCog, Settings, BarChart3, Shield } from 'lucide-react'

const links = [
  {
    title: 'Manage Users',
    description: 'Add, edit, or remove users',
    href: '/admin/users',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Manage Projects',
    description: 'Create and manage projects',
    href: '/admin/projects',
    icon: FolderKanban,
    color: 'bg-green-500',
  },
  {
    title: 'Assign Managers',
    description: 'Assign managers to projects',
    href: '/admin/assignments',
    icon: UserCog,
    color: 'bg-purple-500',
  },
  {
    title: 'Reports',
    description: 'View detailed analytics',
    href: '/admin/reports',
    icon: BarChart3,
    color: 'bg-orange-500',
  },
  {
    title: 'Roles & Permissions',
    description: 'Manage access control',
    href: '/admin/roles',
    icon: Shield,
    color: 'bg-red-500',
  },
  {
    title: 'Settings',
    description: 'System configuration',
    href: '/admin/settings',
    icon: Settings,
    color: 'bg-gray-500',
  },
]

export default function QuickLinks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-md"
          >
            <div className={`rounded-lg ${link.color} p-2`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                {link.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{link.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}