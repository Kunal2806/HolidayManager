'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface RequestFiltersProps {
  currentStatus?: string
}

export default function RequestFilters({ currentStatus }: RequestFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleStatusFilter = (status: string | null) => {
    const params = new URLSearchParams(searchParams)
    
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    
    startTransition(() => {
      router.push(`/admin/requests?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-2 rounded-lg bg-white p-4 shadow-sm">
      <button
        onClick={() => handleStatusFilter(null)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          !currentStatus
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={isPending}
      >
        All Requests
      </button>
      <button
        onClick={() => handleStatusFilter('pending')}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          currentStatus === 'pending'
            ? 'bg-yellow-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={isPending}
      >
        Pending
      </button>
      <button
        onClick={() => handleStatusFilter('approved')}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          currentStatus === 'approved'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={isPending}
      >
        Approved
      </button>
      <button
        onClick={() => handleStatusFilter('rejected')}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          currentStatus === 'rejected'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={isPending}
      >
        Rejected
      </button>
    </div>
  )
}