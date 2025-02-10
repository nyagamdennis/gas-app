import React from 'react'
import { Link } from 'react-router-dom'

const AdminsFooter = () => {
  return (
    <>
    <Link to="/admins" className="bg-blue-600 text-white py-3 text-center shadow-inner">
        Home
      </Link>
    </>
  )
}

export default AdminsFooter