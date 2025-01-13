// @ts-nocheck
import React from 'react'
import { Link } from 'react-router-dom'

const SuspendedPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Account Suspended</h1>
        <p className="text-gray-700 mb-4">
          Your account has been temporarily suspended. Please contact the administrator for more information.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  )
}

export default SuspendedPage