// @ts-nocheck

import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import AdminsFooter from "../../components/AdminsFooter"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import Skeleton from "@mui/material/Skeleton"

const Cylinders = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { businessId } = useAppSelector(
    (state) =>
      state.planStatus || {
        businessId: null,
      },
  )

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [showStockModal, setShowStockModal] = useState(false)
  const [showAddRepairModal, setShowAddRepairModal] = useState(false)
  const [showRepairLocationModal, setShowRepairLocationModal] = useState(false)
  const [showShopListModal, setShowShopListModal] = useState(false)
  const [showVehicleListModal, setShowVehicleListModal] = useState(false)
  const [modalType, setModalType] = useState("") // 'view' or 'repair'
  const [loading, setLoading] = useState(false)

  const allSalesShop = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicle = useAppSelector(selectAllSalesTeamVehicle)

  useEffect(() => {
    setLoading(true)
    dispatch(fetchSalesTeamShops())
    dispatch(fetchSalesTeamVehicle())
    setLoading(false)
  }, [dispatch])

  // Close all modals
  const closeAllModals = () => {
    setShowStockModal(false)
    setShowAddRepairModal(false)
    setShowRepairLocationModal(false)
    setShowShopListModal(false)
    setShowVehicleListModal(false)
  }

  // Handle View Stock button
  const handleViewStock = () => {
    setModalType("view")
    setShowStockModal(true)
  }

  // Handle Add or Repair button
  const handleAddRepair = () => {
    setShowAddRepairModal(true)
  }

  // Handle Repair Cylinders selection
  const handleRepairCylinders = () => {
    setShowAddRepairModal(false)
    setModalType("repair")
    setShowRepairLocationModal(true)
  }

  // Handle location selection for viewing
  const handleViewLocation = (location) => {
    if (location === "store") {
      closeAllModals()
      navigate("/cylinders/stock/store")
    } else if (location === "shops") {
      setShowStockModal(false)
      setShowShopListModal(true)
    } else if (location === "vehicles") {
      setShowStockModal(false)
      setShowVehicleListModal(true)
    }
  }

  // Handle location selection for repair
  const handleRepairLocation = (location) => {
    if (location === "store") {
      closeAllModals()
      navigate("/store/repair")
    } else if (location === "shops") {
      setShowRepairLocationModal(false)
      setShowShopListModal(true)
    } else if (location === "vehicles") {
      setShowRepairLocationModal(false)
      setShowVehicleListModal(true)
    }
  }

  // Handle shop selection
  const handleShopSelect = (shop) => {
    closeAllModals()
    if (modalType === "view") {
      navigate(
        `/cylinders/stock/team/${shop.id}/${encodeURIComponent(shop.name)}`,
      )
    } else if (modalType === "repair") {
      navigate(
        `/thecylinders/repair/${shop.id}/${encodeURIComponent(shop.name)}`,
      )
    }
  }

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    closeAllModals()
    if (modalType === "view") {
      navigate(
        `/cylinders/stock/vehicle/${vehicle.id}/${encodeURIComponent(
          vehicle.number_plate,
        )}`,
      )
    } else if (modalType === "repair") {
      navigate(
        `/thecylinders/repair/vehicle/${vehicle.id}/${encodeURIComponent(
          vehicle.number_plate,
        )}`,
      )
    }
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
                Cylinder Management
              </h1>
              <p className="text-center text-gray-600 text-sm">
                Manage all your cylinder operations from here
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* View Cylinders Stock */}
              <button
                onClick={handleViewStock}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">📦</span>
                  <div className="text-left">
                    <p className="font-bold text-lg">View Cylinders Stock</p>
                    <p className="text-sm text-blue-100">
                      Check inventory levels
                    </p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </button>

              {/* Assign Cylinders */}
              <button
                onClick={() => navigate("/cylinders/assign")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all active:scale-95 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">📤</span>
                  <div className="text-left">
                    <p className="font-bold text-lg">Assign Cylinders</p>
                    <p className="text-sm text-green-100">To sales groups</p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </button>

              {/* Collect Cylinders */}
              <button
                onClick={() => navigate("/admins/collect")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all active:scale-95 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">📥</span>
                  <div className="text-left">
                    <p className="font-bold text-lg">Collect Cylinders</p>
                    <p className="text-sm text-yellow-100">From sales groups</p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </button>

              {/* Refill Cylinders */}
              <button
                onClick={() => navigate("/cylinders/refill")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all active:scale-95 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">⛽</span>
                  <div className="text-left">
                    <p className="font-bold text-lg">Refill Cylinders</p>
                    <p className="text-sm text-purple-100">
                      Gas refilling operations
                    </p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </button>

              {/* Add or Repair Cylinders */}
              <button
                onClick={handleAddRepair}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all active:scale-95 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">🔧</span>
                  <div className="text-left">
                    <p className="font-bold text-lg">Add or Repair</p>
                    <p className="text-sm text-red-100">
                      Manage cylinder inventory
                    </p>
                  </div>
                </div>
                <span className="text-2xl">→</span>
              </button>
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
                  View Cylinder Stock
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

          {/* Modal for Add or Repair Selection */}
          {showAddRepairModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  Cylinder Operations
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose what you want to do
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      closeAllModals()
                      navigate("/cylinders/add")
                    }}
                    className="bg-blue-50 border-2 border-blue-500 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">➕</span>
                      <span className="font-semibold">Add New Cylinder</span>
                    </div>
                    <span>→</span>
                  </button>
                  <button
                    onClick={handleRepairCylinders}
                    className="bg-orange-50 border-2 border-orange-500 text-orange-700 py-3 px-4 rounded-lg hover:bg-orange-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔧</span>
                      <span className="font-semibold">Repair Cylinders</span>
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

          {/* Modal for Repair Location Selection */}
          {showRepairLocationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  Repair Cylinders
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Select where you want to repair cylinders
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleRepairLocation("store")}
                    className="bg-blue-50 border-2 border-blue-500 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      <span className="font-semibold">Repair in Store</span>
                    </div>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => handleRepairLocation("shops")}
                    className="bg-green-50 border-2 border-green-500 text-green-700 py-3 px-4 rounded-lg hover:bg-green-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏪</span>
                      <span className="font-semibold">Repair in Shops</span>
                    </div>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => handleRepairLocation("vehicles")}
                    className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 py-3 px-4 rounded-lg hover:bg-emerald-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🚚</span>
                      <span className="font-semibold">Repair in Vehicles</span>
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
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <p className="text-6xl mb-4">💻</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              Desktop View Coming Soon
            </p>
            <p className="text-gray-600">
              Please use a mobile device or resize your browser window
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cylinders
