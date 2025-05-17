import React from "react"
import { Link } from "react-router-dom"

const EmployeeFooter = () => {
  return (
    <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
      <Link
        
        to="/sales"
      >
        <div className="text-white text-lg font-bold">Home</div>
      </Link>
    </div>
  )
}

export default EmployeeFooter