import React, { useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { ToastContainer } from "react-toastify"
import { useAppDispatch } from "../../../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../../../features/planStatus/planStatus"
import Navbar from "../../../components/ui/mobile/employees/Navbar"
import AdminsFooter from "../../../components/AdminsFooter"
import EmployeeFooter from "../../../components/ui/EmployeeFooter"

const EmployeeAllSales = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
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
  const [showModal, setShowModal] = useState(false)
  const [showOtherModal, setShowOtherModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)

  const handleView = () => {
    setShowModal(true) // Show the modal
  }


  const handleViewOthers = () => {
    setShowOtherModal(true) // Show the modal
  }


  const handleViewTeams = () => {
    setShowModal(false)
    setShowTeamModal(true) // Show the modal
    // Close the add modal if open
  }

  const handleNavigate = (path: string) => {
    setShowModal(false) // Close the modal
    navigate(path) // Navigate to the selected path
  }

  return (
    <div>
      <ToastContainer />
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow  p-1">
            <div className="grid grid-cols-1 gap-4">
              {/* Cylinders Stock */}
              <button
                // onClick={() => navigate("/cylinders/stock")}
                onClick={handleView}
                className="bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Cylinder Sales
              </button>

              {/* Assign Cylinders */}
              <button
                onClick={handleViewOthers}
                className="bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Other Products Sales
              </button>
            </div>
          </main>

          {/* Modal for selecting sales view */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Select cylinder sales Type?
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleNavigate(`/sales/whatsells/retail`)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Retail
                  </button>
                  <button
                    onClick={() => handleNavigate(`/sales/whatsells/wholesale`)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Wholesale
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showOtherModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Select product sales Type?
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleNavigate(`/sales/whatsells/retailothers`)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Retail
                  </button>
                  <button
                    onClick={() => handleNavigate(`/sales/whatsells/wholesaleothers`)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Wholesale
                  </button>

                  <button
                    onClick={() => setShowOtherModal(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer className=" text-white">
            <EmployeeFooter />
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

export default EmployeeAllSales
