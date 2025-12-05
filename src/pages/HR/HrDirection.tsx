import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import BadgeIcon from "@mui/icons-material/Badge"

import AdminsFooter from "../../components/AdminsFooter"
import { set } from "cookies"
import PaymentIcon from "@mui/icons-material/Payment"

const HrDirection = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    isPro,
    isTrial,
    isExpired,
    businessName,
    businessId,
    businessLogo,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            <div className="grid grid-cols-1 gap-4">
              {/* Cylinders Stock */}
              <button
                onClick={() => navigate("/admins/employees")}
                // onClick={handleViewStock}
                className="bg-blue-500 text-white py-3 flex items-center justify-center gap-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                <BadgeIcon />
                Employees
              </button>

              {/* Assign Cylinders */}
              <button
                onClick={() => navigate("/admins/payroll")}
                className="bg-green-500 flex items-center justify-center gap-3 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                <PaymentIcon />
                Payroll
              </button>

              {/* Collect Cylinders */}
              {/* <button
                onClick={() => navigate("/admins/collect")}
                className="bg-yellow-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                Collect Cylinders from Sales Groups
              </button> */}

              {/* Refilling Cylinders */}
              {/* <button
                onClick={() => navigate("/cylinders/refill")}
                className="bg-purple-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-purple-600 transition"
              >
                Refill Cylinders
              </button> */}

              {/* Add, Repair, and Remove Cylinders */}
              {/* <button
                // onClick={handleShowAddModal}
                className="bg-red-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Add or Repair Cylinders
              </button> */}
            </div>
          </main>
          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default HrDirection
