import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../../features/salesTeam/salesTeamSlice"
import AdminsFooter from "../../components/AdminsFooter"
import { set } from "cookies"

const Cylinders = () => {
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

  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showRepairTeamModal, setShowRepairTeamModal] = useState(false)
  const [repairDestination, setRepairDestination] = useState(false)

  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeam({ businessId }))
    }
  }, [dispatch, businessId])

  const handleShowAddModal = () => {
    setShowAddModal(true)
  }

  const handleShowRepairDestinationModel = () => {
    setShowRepairTeamModal(false)
    setRepairDestination(true)
    setShowModal(false)
    setShowAddModal(false)
  }
  

  const handleCloseRepairDestinationModel = () => {
    setRepairDestination(false)
  }
  

  const handleCloseAddModal = () => {
    setShowAddModal(false)
  }

  // Function to handle the "View Cylinders Stock" button click
  const handleViewStock = () => {
    setShowModal(true) // Show the modal
  }

  const handleViewTeams = () => {
    setShowAddModal(false)
    setShowTeamModal(true) // Show the modal
    // Close the add modal if open
  }

  const handleVIewRepairTeams = () => {
    setShowAddModal(false)
    setShowRepairTeamModal(true)
  }

  // Function to handle navigation based on user choice
  const handleNavigate = (path: string) => {
    setShowModal(false) // Close the modal
    navigate(path) // Navigate to the selected path
  }

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
                // onClick={() => navigate("/cylinders/stock")}
                onClick={handleViewStock}
                className="bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                View Cylinders Stock
              </button>

              {/* Assign Cylinders */}
              <button
                onClick={() => navigate("/cylinders/assign")}
                className="bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Assign Cylinders to Sales Groups
              </button>

              {/* Collect Cylinders */}
              <button
                onClick={() => navigate("/admins/collect")}
                className="bg-yellow-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                Collect Cylinders from Sales Groups
              </button>

              {/* Refilling Cylinders */}
              <button
                onClick={() => navigate("/cylinders/refill")}
                className="bg-purple-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-purple-600 transition"
              >
                Refill Cylinders
              </button>

              {/* Add, Repair, and Remove Cylinders */}
              <button
                onClick={handleShowAddModal}
                className="bg-red-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Add or Repair Cylinders
              </button>
            </div>
          </main>
          <footer>
            <AdminsFooter />
          </footer>

          {/* Modal for selecting stock view */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Where do you want to view the stock?
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleNavigate("/cylinders/stock/store")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    View Store Stock
                  </button>
                  <button
                    onClick={() => handleViewTeams()}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  >
                    View Sales Team Stock
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

          {/* ---------------------------- */}
          {/* Modal for selecting stock view */}
          {repairDestination && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Where do you want to repair cylinders?
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleNavigate("/store/repair")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Repair in Store
                  </button>
                  <button
                    onClick={() => handleVIewRepairTeams()}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  >
                    Repair in Sales Team
                  </button>
                  <button
                    onClick={() => setRepairDestination(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for selecting stock view */}
          {showTeamModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Select sales Team?
                </h2>
                <div className="flex flex-col gap-4">
                  {allSalesTeam.map((team) => (
                    <button
                      key={team.id}
                      onClick={() =>
                        handleNavigate(
                          `/cylinders/stock/team/${
                            team.id
                          }/${encodeURIComponent(team.name)}`,
                        )
                      }
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                      {team.name}
                    </button>
                  ))}

                  {/* Modal for selecting stock view */}

                  <button
                    onClick={() => setShowTeamModal(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for selecting stock view */}
          {showRepairTeamModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Select sales Team to repair?
                </h2>
                <div className="flex flex-col gap-4">
                  {allSalesTeam.map((team) => (
                    <button
                      key={team.id}
                      onClick={() =>
                        handleNavigate(
                          `/thecylinders/repair/${
                            team.id
                          }/${encodeURIComponent(team.name)}`,
                        )
                      }
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                      {team.name}
                    </button>
                  ))}

                  {/* Modal for selecting stock view */}

                  <button
                    onClick={() => setShowRepairTeamModal(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">Where to?</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => navigate("/cylinders/add")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Add new Cylinder
                  </button>
                  <button
                    onClick={() => handleShowRepairDestinationModel()}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  >
                    Repair cylinders
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default Cylinders
