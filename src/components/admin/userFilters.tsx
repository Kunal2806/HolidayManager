'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, useTransition } from 'react'

interface UserFiltersProps {
  currentRole?: string
  currentSearch?: string
}

export default function UserFilters({
  currentRole,
  currentSearch,
}: UserFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch || '')

  const handleRoleFilter = (role: string | null) => {
    const params = new URLSearchParams(searchParams)
    
    if (role) {
      params.set('role', role)
    } else {
      params.delete('role')
    }
    
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Role Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => handleRoleFilter(null)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !currentRole
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={isPending}
        >
          All
        </button>
        <button
          onClick={() => handleRoleFilter('admin')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentRole === 'admin'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={isPending}
        >
          Admins
        </button>
        <button
          onClick={() => handleRoleFilter('manager')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentRole === 'manager'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={isPending}
        >
          Managers
        </button>
        <button
          onClick={() => handleRoleFilter('employee')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentRole === 'employee'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={isPending}
        >
          Employees
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isPending}
        />
      </div>
    </div>
  )
}