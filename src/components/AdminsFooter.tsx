import React from "react"
import { Link } from "react-router-dom"

const AdminsFooter = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-t border-t border-gray-200 mt-8">
      <Link
        to="/admins"
        className="text-blue-600 font-medium text-lg hover:underline hover:text-blue-800 transition duration-200"
      >
        <div className="flex justify-center py-4">⬅ Return to Admin Home</div>
      </Link>
    </footer>
  )
}

export default AdminsFooter
