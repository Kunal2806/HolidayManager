import { Settings as SettingsIcon, Shield, Bell, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure system-wide settings and preferences
        </p>
      </div>

      {/* Warning Banner */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 flex-shrink-0 text-yellow-700" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800">
              Danger Zone
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Changes here affect the entire system. Proceed with caution.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <SettingsSection
          title="General Settings"
          icon={<SettingsIcon className="h-5 w-5" />}
        >
          <SettingItem
            label="System Name"
            description="The name displayed across the application"
          >
            <input
              type="text"
              defaultValue="Employee Request Manager"
              className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </SettingItem>

          <SettingItem
            label="Max Requests Per User"
            description="Maximum number of pending requests a user can have"
          >
            <input
              type="number"
              defaultValue="5"
              min="1"
              max="50"
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </SettingItem>

          <SettingItem
            label="Auto-Archive Completed Requests"
            description="Automatically archive requests after they're completed"
          >
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"></div>
            </label>
          </SettingItem>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notification Settings"
          icon={<Bell className="h-5 w-5" />}
        >
          <SettingItem
            label="Email Notifications"
            description="Send email notifications for new requests"
          >
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"></div>
            </label>
          </SettingItem>

          <SettingItem
            label="Admin Email"
            description="Email address for admin notifications"
          >
            <input
              type="email"
              defaultValue="admin@company.com"
              className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </SettingItem>
        </SettingsSection>

        {/* Request Types */}
        <SettingsSection
          title="Request Types"
          icon={<Database className="h-5 w-5" />}
        >
          <SettingItem
            label="Allowed Request Types"
            description="Types of requests users can submit"
          >
            <div className="space-y-2">
              {['Leave', 'Equipment', 'Training', 'Reimbursement', 'Other'].map(
                (type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                )
              )}
            </div>
          </SettingItem>
        </SettingsSection>

        {/* Save Button */}
        <div className="flex items-center gap-3 border-t pt-6">
          <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Save Changes
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}

function SettingItem({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}