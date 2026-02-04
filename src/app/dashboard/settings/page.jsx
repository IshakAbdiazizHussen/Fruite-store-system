import { Bell, User, Lock, Globe, Database } from 'lucide-react'
import React from 'react'

export default function SettingsPage() {
  return (
    <>
    <div className='p-6'>
        <h3 className='text-2xl'>Settings</h3>
        <p className='font-light text-gray-500'>Manage your application preferences and account settings</p>
    </div>

    {/* Flex Side */}
  <section className='flex gap-6 max-h-[560px]'>
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 m-4 w-full max-w-[460px]">
  {/* Header */}
  <div className="flex items-center gap-4 mb-8">
    <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center">
      <User className="text-green-600" size={30} />
    </div>
    <h4 className="text-xl font-light">Profile</h4>
  </div>

    
  {/* Form */}
  <form className="space-y-6">
    <div>
      <label className="block text-gray-700 mb-2">Full Name</label>
      <input
        type="text"
        placeholder="Ilwaad Mohamed"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-gray-700 mb-2">Email</label>
      <input
        type="email"
        placeholder="ilwaad@admin.com"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 
                  focus:ring-green-500"
      />
    </div>

    {/* Role */}
    <div>
      <label className="block text-gray-700 mb-2">Role</label>
      <input
        type="text"
        placeholder="Ilwaad Admin"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 
                  focus:ring-green-500"
      />
    </div>

    {/* Button */}
    <button
      type="button"
      className="w-full rounded-xl bg-green-500 py-3 text-white font-light hover:bg-green-600 transition-colors"
    >
      Update Profile
    </button>
  </form>

</div>

    {/* Notification side */}
<div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 m-4 w-full max-w-[460px]">
  {/* Header */}
  <div className="flex items-center gap-4 mb-10">
    <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
      <Bell className="text-blue-600" size={28} />
    </div>
    <h4 className="text-2xl font-light">Notifications</h4>
  </div>

  {/* Rows */}
  <div className="space-y-10">
    {/* Row 1 */}
  <div className="flex items-center justify-between">
  <p className="text-gray-800 font-light text-lg">Email Notifications</p>

  <label className="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" className="sr-only peer" defaultChecked />


    {/* track + knob */}
    <div
      className="
        relative h-9 w-16 rounded-full bg-gray-300 transition-colors
        peer-checked:bg-green-500 after:content-[''] after:absolute after:top-1 after:left-1 after:h-7 after:w-7 after:rounded-full 
        after:bg-white after:transition-all after:duration-200 peer-checked:after:translate-x-7"
    />
  </label>
</div>



    {/* Row 2 */}
    <div className="flex items-center justify-between">
  <p className="text-gray-800 font-light text-lg">Push Notifications</p>

  <label className="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" className="sr-only peer" defaultChecked />


    {/* track + knob */}
    <div
      className="
        relative h-9 w-16 rounded-full bg-gray-300 transition-colors
        peer-checked:bg-green-500 after:content-[''] after:absolute after:top-1 after:left-1 after:h-7 after:w-7 after:rounded-full 
        after:bg-white after:transition-all after:duration-200 peer-checked:after:translate-x-7"
    />
  </label>
</div>

    {/* Row 3 */}
  <div className="flex items-center justify-between">
  <p className="text-gray-800 font-light text-lg">Low Stock Alerts</p>

  <label className="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" className="sr-only peer" defaultChecked />


    {/* track + knob */}
    <div
      className="
        relative h-9 w-16 rounded-full bg-gray-300 transition-colors
        peer-checked:bg-green-500 after:content-[''] after:absolute after:top-1 after:left-1 after:h-7 after:w-7 after:rounded-full 
        after:bg-white after:transition-all after:duration-200 peer-checked:after:translate-x-7"
    />
  </label>
</div>

    {/* Row 4 */}
    <div className="flex items-center justify-between">
  <p className="text-gray-800 font-light text-lg">Expiry Alerts</p>

  <label className="relative inline-flex cursor-pointer items-center">
   <input type="checkbox" className="sr-only peer" defaultChecked />


    {/* track + knob */}
    <div
      className="
        relative h-9 w-16 rounded-full bg-gray-300 transition-colors
        peer-checked:bg-green-500 after:content-[''] after:absolute after:top-1 after:left-1 after:h-7 after:w-7 after:rounded-full 
        after:bg-white after:transition-all after:duration-200 peer-checked:after:translate-x-7"
    />
  </label>
</div>
  </div>
</div>



     {/* Security side */}
     <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 m-4 w-full max-w-[460px]">
     <section className='flex items-center gap-4 mb-8'>
      <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center">
        <Lock className="text-purple-600" size={30} />
      </div>

      <h4 className="text-2xl font-light my-6">Security</h4>
     </section>

     <form className="space-y-6">
    <div>
      <label className="block text-gray-700 mb-2">Current Password</label>
      <input
        type="password"
        placeholder="password"
        className="w-100 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block text-gray-700 mb-2">New Password</label>
      <input
        type="password"
        placeholder="new password"
        className="w-100 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 
                  focus:ring-green-500"
      />
    </div>

    {/* Role */}
    <div>
      <label className="block text-gray-700 mb-2">Confirm Password</label>
      <input
        type="password"
        placeholder="confirm password"
        className="w-100 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 
                  focus:ring-green-500"
      />
    </div>

    {/* Button */}
    <button
      type="button"
      className="w-100 rounded-xl bg-purple-500 py-3 text-white font-light hover:bg-green-600 transition-colors">
      Change Password
    </button>
  </form>

  </div>
    </section>


<section className="flex gap-6 px-8 mb-12">
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 w-full max-w-[780px]">
    {/* Header */}
    <div className="flex items-center gap-6 mb-12">
      <div className="h-20 w-20 rounded-2xl bg-orange-100 flex items-center justify-center">
        <Globe className="text-orange-600" size={34} />
      </div>
      <h4 className="text-3xl font-light">Regional Settings</h4>
    </div>

    {/* Language */}
    <div className="mb-10">
      <p className="text-gray-800 font-light text-2xl mb-4">Language</p>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-2xl border-2 border-green-500 px-6 py-5 pr-14 text-xl font-light outline-none"
          defaultValue="en-us"
        >
          <option value="en-us">English (US)</option>
          <option value="en-uk">English (UK)</option>
          <option value="so">Somali</option>
          <option value="ar">Arabic</option>
        </select>

        {/* Arrow down */}
        <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-gray-500">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>

    {/* Timezone */}
    <div className="mb-10">
      <p className="text-gray-800 font-light text-2xl mb-4">Timezone</p>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-2xl border border-gray-300 px-6 py-5 pr-14 text-xl font-light outline-none"
          defaultValue="utc-8"
        >
          <option value="utc-8">UTC-8 (Pacific Time)</option>
          <option value="utc">UTC</option>
          <option value="utc+3">UTC+3 (East Africa Time)</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-gray-500">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>

    {/* Currency */}
    <div>
      <p className="text-gray-800 font-light text-2xl mb-4">Currency</p>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-2xl border border-gray-300 px-6 py-5 pr-14 text-xl font-light outline-none"
          defaultValue="usd"
        >
          <option value="usd">USD ($)</option>
          <option value="eur">EUR (€)</option>
          <option value="gbp">GBP (£)</option>
          <option value="sos">SOS (Shilling)</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-gray-500">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  {/* RIGHT: Data Management */}
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 w-full max-w-[780px]">
    {/* Header */}
    <div className="flex items-center gap-6 mb-12">
      <div className="h-20 w-20 rounded-2xl bg-red-100 flex items-center justify-center">
        <Database className="text-red-600" size={34} />
      </div>
      <h4 className="text-3xl font-light">Data Management</h4>
    </div>

    {/* Buttons */}
    <div className="space-y-7 mb-12">
      <button
        type="button"
        className="w-full rounded-2xl bg-blue-500 py-5 text-white text-2xl font-light"
      >
        Export All Data
      </button>

      <button
        type="button"
        className="w-full rounded-2xl bg-orange-500 py-5 text-white text-2xl font-light"
      >
        Backup Database
      </button>

      <button
        type="button"
        className="w-full rounded-2xl bg-red-500 py-5 text-white text-2xl font-light"
      >
        Clear Cache
      </button>
    </div>

    <div className="border-t border-gray-200 pt-10">
      <p className="text-gray-500 font-light text-2xl mb-6">Danger Zone</p>

      <button
        type="button"
        className="w-full rounded-2xl border-2 border-red-500 py-5 text-red-500 text-2xl font-light bg-white hover:bg-red-50 transition-colors">
        Delete Account
      </button>
    </div>
  </div>
</section>

    </>
  )
}
