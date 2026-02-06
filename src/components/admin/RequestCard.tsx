'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RequestCardProps {
    request: {
    id: string
    employeeId: string
    userName: string | null
    userEmail: string | null
    dayType: "working" | "wfh" | "half_day" | "leave" | "holiday"
    hours: string | null
    description: string | null
    status: "draft" | "submitted" | "approved" | null
    workDate: string
    createdAt: Date | null
  }
}

export default function RequestCard({ request }: RequestCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showRemarks, setShowRemarks] = useState(false)
  const [remarks, setRemarks] = useState('')

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/admin/requests/${request.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks }),
      })

      if (!res.ok) throw new Error('Failed to approve')

      startTransition(() => {
        router.refresh()
      })
      setShowRemarks(false)
      setRemarks('')
    } catch (error) {
      alert('Failed to approve request')
      console.error(error)
    }
  }

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      const res = await fetch(`/api/admin/requests/${request.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks }),
      })

      if (!res.ok) throw new Error('Failed to reject')

      startTransition(() => {
        router.refresh()
      })
      setShowRemarks(false)
      setRemarks('')
    } catch (error) {
      alert('Failed to reject request')
      console.error(error)
    }
  }

  const statusConfig = {
    null:{
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-700',
      icon: <Clock className="h-4 w-4" />,
    },
    draft: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-700',
      icon: <Clock className="h-4 w-4" />,
    },
    approved: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-700',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    submitted: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      icon: <XCircle className="h-4 w-4" />,
    },
  }

  const config = statusConfig[request.status || "null"]

  return (
    <div
      className={`rounded-lg border ${config.border} ${config.bg} p-6 shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
              {request.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {request.userName || 'Unknown User'}
              </h3>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <User className="h-3 w-3" />
                {request.userEmail}
              </p>
            </div>
          </div>

          {/* Request Details */}
          <div className="mt-4 space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <span className="ml-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700">
                {request.dayType}
              </span>
            </div>
            {request.description && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Description:
                </span>
                <p className="mt-1 text-sm text-gray-600">
                  {request.description}
                </p>
              </div>
            )}
            {/* {request. && (
              <div className="rounded-lg bg-white p-3">
                <span className="text-sm font-medium text-gray-700">
                  Admin Remarks:
                </span>
                <p className="mt-1 text-sm text-gray-600">
                  {request.adminRemarks}
                </p>
              </div>
            )} */}
          </div>

          {/* Timestamp */}
          <p className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            Submitted {formatDistanceToNow(request.createdAt ? new Date(request.createdAt): "-", { addSuffix: true })}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.badge}`}
        >
          {config.icon}
          {request.status && request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      {/* Actions (only for pending requests) */}
      {request.status === 'draft' && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {!showRemarks ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowRemarks(true)}
                disabled={isPending}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => setShowRemarks(true)}
                disabled={isPending}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks (optional for approval, required for rejection)"
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Confirm Approval
                </button>
                <button
                  onClick={handleReject}
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setShowRemarks(false)
                    setRemarks('')
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}