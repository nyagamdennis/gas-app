//  @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchSalesTeam, selectAllSalesTeam } from "../../features/salesTeam/salesTeamSlice"
import planStatus from "../../features/planStatus/planStatus"

const AllSales = () => {
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
  const [showTeamModal, setShowTeamModal] = useState(false)

  const allSalesTeam = useAppSelector(selectAllSalesTeam)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeam({ businessId }))
    }
  }, [dispatch, businessId])

  const handleViewStock = () => {
    setShowModal(true) // Show the modal
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
            <div className="flex justify-end">
              <Link className="text-blue-950 underline">
                Record Store Sales
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* Cylinders Stock */}
              <button
                // onClick={() => navigate("/cylinders/stock")}
                onClick={handleViewStock}
                className="bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Cylinder Sales
              </button>

              {/* Assign Cylinders */}
              <button
                // onClick={() => navigate("/cylinders/assign")}
                className="bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Other Products Sales
              </button>
            </div>
          </main>
          {/* Modal for selecting stock view */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">
                  Where do you want to view the sales?
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleNavigate("/cylinders/stock/store")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    View Store Sales
                  </button>
                  <button
                    onClick={() => handleViewTeams()}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  >
                    View Sales-Team Sales
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

          {/* Modal for selecting sales view */}
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
                          `/admins/salesdata/${
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

          <footer className=" text-white">
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

export default AllSales
