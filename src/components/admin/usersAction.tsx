'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { UserCog, Trash2, AlertTriangle } from 'lucide-react'

interface UserActionsProps {
  userId: string
  currentRole: string
  userName: string
}

export default function UserActions({
  userId,
  currentRole,
  userName,
}: UserActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    if (confirm(`Change ${userName}'s role to ${newRole}?`)) {
      try {
        const res = await fetch(`/api/admin/users/${userId}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        })

        if (!res.ok) {
          throw new Error('Failed to update role')
        }

        startTransition(() => {
          router.refresh()
        })
      } catch (error) {
        alert('Failed to update user role')
        console.error(error)
      }
    }
  }

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete user')
      }

      router.push('/admin/users')
      router.refresh()
    } catch (error) {
      alert('Failed to delete user')
      console.error(error)
    }
  }

  return (
    <div className="space-y-3">
      {/* Change Role */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          <UserCog className="h-4 w-4" />
          Change Role
        </h3>
        <div className="space-y-2">
          {(['admin', 'manager', 'employee'] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              disabled={isPending || currentRole === role}
              className={`w-full rounded-lg border px-4 py-2 text-left text-sm font-medium transition-colors ${
                currentRole === role
                  ? 'border-blue-200 bg-blue-50 text-blue-700 cursor-not-allowed'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {currentRole === role && '✓ '}
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-3">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-red-700">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete User
          </button>
        ) : (
          <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteUser}
                disabled={isPending}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}