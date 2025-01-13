import React from 'react'
import { Link } from 'react-router-dom'

const FiredPage = () => {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">You’ve Been Fired! 🚫</h1>
        <p className="text-gray-700 mb-4">
          Well, this is awkward... but your journey here has come to an end. Feel free to contact the admin if you think there’s been a mistake.
        </p>
        <Link
          to="/"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default FiredPage