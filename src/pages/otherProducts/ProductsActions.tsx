// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import { fetchSalesTeamVehicle, selectAllSalesTeamVehicle } from "../../features/salesTeam/salesTeamVehicleSlice"

const ProductsActions = () => {
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
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showRepairTeamModal, setShowRepairTeamModal] = useState(false)
  const [repairDestination, setRepairDestination] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [modalType, setModalType] = useState("") // 'view' or 'repair'
  const [showAddRepairModal, setShowAddRepairModal] = useState(false)
  const [showRepairLocationModal, setShowRepairLocationModal] = useState(false)
  const [showShopListModal, setShowShopListModal] = useState(false)
  const [showVehicleListModal, setShowVehicleListModal] = useState(false)

  const allSalesTeam = useAppSelector(selectAllSalesTeamShops)
  const allSalesShop = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicle = useAppSelector(selectAllSalesTeamVehicle)

  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeamShops())
    }
  }, [dispatch, businessId])

  useEffect(() => {
    setLoading(true)
    dispatch(fetchSalesTeamShops())
    dispatch(fetchSalesTeamVehicle())
    setLoading(false)
  }, [dispatch])

  // Handle View Stock button
  const handleViewStock = () => {
    setModalType("view")
    setShowStockModal(true)
  }

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

  // Close all modals
  const closeAllModals = () => {
    setShowStockModal(false)
    setShowAddRepairModal(false)
    setShowRepairLocationModal(false)
    setShowShopListModal(false)
    setShowVehicleListModal(false)
  }

  // const handleViewStock = () => {
  //   setShowModal(true)
  // }

  const handleViewTeams = () => {
    setShowAddModal(false)
    setShowTeamModal(true)
  }

  const handleVIewRepairTeams = () => {
    setShowAddModal(false)
    setShowRepairTeamModal(true)
  }

  const handleNavigate = (path: string) => {
    setShowModal(false)
    navigate(path)
  }

  // Handle location selection for viewing
  const handleViewLocation = (location) => {
    if (location === "store") {
      closeAllModals()
      navigate("/store/othersproductslist")
    } else if (location === "shops") {
      setShowStockModal(false)
      setShowShopListModal(true)
    } else if (location === "vehicles") {
      setShowStockModal(false)
      setShowVehicleListModal(true)
    }
  }

  // Handle shop selection
  const handleShopSelect = (shop) => {
    closeAllModals()
    if (modalType === "view") {
      navigate(
        `/products/stock/team/${shop.id}/${encodeURIComponent(shop.name)}`,
      )
    } else if (modalType === "repair") {
      navigate(`/products/repair/${shop.id}/${encodeURIComponent(shop.name)}`)
    }
  }

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    closeAllModals()
    if (modalType === "view") {
      navigate(
        `/products/stock/vehicle/${vehicle.id}/${encodeURIComponent(
          vehicle.number_plate,
        )}`,
      )
    } else if (modalType === "repair") {
      navigate(
        `/products/repair/vehicle/${vehicle.id}/${encodeURIComponent(
          vehicle.number_plate,
        )}`,
      )
    }
  }

  // Reusable ActionCard Component
  const ActionCard = ({ icon, title, description, onClick, gradient }) => (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group ${gradient}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-6 text-left">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </button>
  )

  // Reusable Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all"
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }

  // Reusable Modal Button Component
  const ModalButton = ({ onClick, variant = "primary", children }) => {
    const baseClasses =
      "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
    const variants = {
      primary:
        "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg",
      success:
        "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg",
      warning:
        "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    }

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]}`}
      >
        {children}
      </button>
    )
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />

          <main className="flex-grow p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Product Management
              </h1>
              <p className="text-gray-600 text-sm">
                Select an action to get started
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <ActionCard
                icon="📦"
                title="View Products"
                description="Browse and manage your product inventory"
                onClick={handleViewStock}
                gradient="bg-gradient-to-br from-blue-500 to-blue-700"
              />

              <ActionCard
                icon="🚀"
                title="Assign Products"
                description="Distribute products to sales groups efficiently"
                onClick={() => navigate("/products/assign")}
                
                gradient="bg-gradient-to-br from-green-500 to-green-700"
              />

              <ActionCard
                icon="📥"
                title="Collect Products"
                description="Retrieve products from sales groups"
                onClick={() => navigate("/store/collectotherproducts")}
                gradient="bg-gradient-to-br from-amber-500 to-amber-700"
              />
            </div>
          </main>

          <footer>
            <AdminsFooter />
          </footer>

          {/* Modal for View Stock Location Selection */}
          {showStockModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  View Products Stock
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Select where you want to view the stock
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleViewLocation("store")}
                    className="bg-blue-50 border-2 border-blue-500 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      <span className="font-semibold">View Store Stock</span>
                    </div>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => handleViewLocation("shops")}
                    className="bg-green-50 border-2 border-green-500 text-green-700 py-3 px-4 rounded-lg hover:bg-green-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏪</span>
                      <span className="font-semibold">View Shops Stock</span>
                    </div>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => handleViewLocation("vehicles")}
                    className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 py-3 px-4 rounded-lg hover:bg-emerald-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🚚</span>
                      <span className="font-semibold">View Vehicles Stock</span>
                    </div>
                    <span>→</span>
                  </button>
                  <button
                    onClick={closeAllModals}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all font-semibold mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Shop List Selection */}
          {showShopListModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {modalType === "view"
                    ? "Select Shop to View"
                    : "Select Shop to Repair"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a shop from the list below
                </p>

                {loading ? (
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        height={60}
                        className="rounded-lg"
                      />
                    ))}
                  </div>
                ) : allSalesShop.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl mb-4">🏪</p>
                      <p className="text-gray-500">No shops available</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {allSalesShop.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => handleShopSelect(shop)}
                        className="w-full bg-blue-50 border-2 border-blue-500 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">🏪</span>
                          <div className="text-left">
                            <p className="font-semibold">{shop.name}</p>
                            <p className="text-xs text-blue-600">
                              {shop.type_of_sales_team?.name || "N/A"}
                            </p>
                          </div>
                        </div>
                        <span>→</span>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowShopListModal(false)
                    if (modalType === "view") {
                      setShowStockModal(true)
                    } else {
                      setShowRepairLocationModal(true)
                    }
                  }}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all font-semibold mt-4"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Modal for Vehicle List Selection */}
          {showVehicleListModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {modalType === "view"
                    ? "Select Vehicle to View"
                    : "Select Vehicle to Repair"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Choose a vehicle from the list below
                </p>

                {loading ? (
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        height={60}
                        className="rounded-lg"
                      />
                    ))}
                  </div>
                ) : allSalesVehicle.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl mb-4">🚚</p>
                      <p className="text-gray-500">No vehicles available</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {allSalesVehicle.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => handleVehicleSelect(vehicle)}
                        className="w-full bg-green-50 border-2 border-green-500 text-green-700 py-3 px-4 rounded-lg hover:bg-green-100 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">🚚</span>
                          <div className="text-left">
                            <p className="font-semibold">
                              {vehicle.number_plate}
                            </p>
                            {vehicle.name && (
                              <p className="text-xs text-green-600">
                                Driver: {vehicle.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <span>→</span>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowVehicleListModal(false)
                    if (modalType === "view") {
                      setShowStockModal(true)
                    } else {
                      setShowRepairLocationModal(true)
                    }
                  }}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all font-semibold mt-4"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Stock View Modal */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Select Stock Location"
          >
            <div className="space-y-3">
              <ModalButton
                onClick={() => handleNavigate("/cylinders/stock/store")}
                variant="primary"
              >
                Store Stock
              </ModalButton>
              <ModalButton onClick={() => handleViewTeams()} variant="success">
                Sales Team Stock
              </ModalButton>
              <ModalButton
                onClick={() => setShowModal(false)}
                variant="secondary"
              >
                Cancel
              </ModalButton>
            </div>
          </Modal>

          {/* Repair Destination Modal */}
          <Modal
            isOpen={repairDestination}
            onClose={() => setRepairDestination(false)}
            title="Select Repair Location"
          >
            <div className="space-y-3">
              <ModalButton
                onClick={() => handleNavigate("/store/repair")}
                variant="primary"
              >
                Repair in Store
              </ModalButton>
              <ModalButton
                onClick={() => handleVIewRepairTeams()}
                variant="success"
              >
                Repair in Sales Team
              </ModalButton>
              <ModalButton
                onClick={() => setRepairDestination(false)}
                variant="secondary"
              >
                Cancel
              </ModalButton>
            </div>
          </Modal>

          {/* Sales Team Selection Modal */}
          <Modal
            isOpen={showTeamModal}
            onClose={() => setShowTeamModal(false)}
            title="Select Sales Team"
          >
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allSalesTeam.map((team) => (
                <ModalButton
                  key={team.id}
                  onClick={() =>
                    handleNavigate(
                      `/cylinders/stock/team/${team.id}/${encodeURIComponent(
                        team.name,
                      )}`,
                    )
                  }
                  variant="primary"
                >
                  {team.name}
                </ModalButton>
              ))}
              <ModalButton
                onClick={() => setShowTeamModal(false)}
                variant="secondary"
              >
                Cancel
              </ModalButton>
            </div>
          </Modal>

          {/* Repair Team Selection Modal */}
          <Modal
            isOpen={showRepairTeamModal}
            onClose={() => setShowRepairTeamModal(false)}
            title="Select Team for Repair"
          >
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allSalesTeam.map((team) => (
                <ModalButton
                  key={team.id}
                  onClick={() =>
                    handleNavigate(
                      `/thecylinders/repair/${team.id}/${encodeURIComponent(
                        team.name,
                      )}`,
                    )
                  }
                  variant="primary"
                >
                  {team.name}
                </ModalButton>
              ))}
              <ModalButton
                onClick={() => setShowRepairTeamModal(false)}
                variant="secondary"
              >
                Cancel
              </ModalButton>
            </div>
          </Modal>

          {/* Add/Repair Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Quick Actions"
          >
            <div className="space-y-3">
              <ModalButton
                onClick={() => navigate("/cylinders/add")}
                variant="primary"
              >
                Add New Cylinder
              </ModalButton>
              <ModalButton
                onClick={() => handleShowRepairDestinationModel()}
                variant="success"
              >
                Repair Cylinders
              </ModalButton>
              <ModalButton
                onClick={() => setShowAddModal(false)}
                variant="secondary"
              >
                Cancel
              </ModalButton>
            </div>
          </Modal>

          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
            <div className="text-6xl mb-6">💼</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Desktop View
            </h1>
            <p className="text-gray-600 text-lg">
              The desktop experience is currently under development. Please use
              a mobile device or resize your browser window for the best
              experience.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsActions
