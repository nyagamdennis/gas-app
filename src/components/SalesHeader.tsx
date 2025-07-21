// @ts-nocheck
import React from "react"
import { Link } from "react-router-dom"
import defaultProfile from "../components/media/default.png"

function SalesHeader({ teamName, profileImage, firstName, lastName,description})  {
  return (
    <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
      <Link to="/sales">
        <h1 className="text-3xl font-bold">
          {teamName || "Sales Team"}
        </h1>
        <p className="mt-1 text-sm">{description}</p>
      </Link>
      <Link to="/myprofile" className="flex items-center space-y-2 flex-col">
        <img
          src={profileImage || defaultProfile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        />
        <span className="text-white text-sm">
          {firstName} {lastName}
        </span>
      </Link>
    </div>
  )
}

export default SalesHeader
