// @ts-nocheck
import React, { useEffect, useState } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import defaultPic from "../images/alexander-shatov-niUkImZcSP8-unsplash.jpg"
import defaultVehicle from "../images/alexander-shatov-niUkImZcSP8-unsplash.jpg"
import defaultStore from "../images/alexander-shatov-niUkImZcSP8-unsplash.jpg"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAppDispatch, useAppSelector } from "../app/hooks"

import planStatus from "../features/planStatus/planStatus"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"
import {
  addSalesTeam,
  deleteSalesTeam,
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
  updateSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import {
  addVehicle,
  deleteVehicle,
  fetchVehicles,
  getAllVehicles,
  updateVehicle,
} from "../features/deliveries/vehiclesSlice"
import {
  addStore,
  deleteStore,
  fetchStore,
  selectAllStore,
  updateStore,
} from "../features/store/storeSlice"

const CreateTeamPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [teamName, setTeamName] = useState("")
  const [numberPlate, setNumberPlate] = useState("")
  const [engineSize, setEngineSize] = useState("")
  const [locationName, setLocationName] = useState("")
  const [locationCoordinates, setLocationCoordinates] = useState("")
  const [teamType, setTeamType] = useState("SHOP") // SHOP, STORE, VEHICLE
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [selectedTeamSource, setSelectedTeamSource] = useState<
    "shop" | "vehicle" | "store"
  >("shop")
  const [addingTeam, setAddingTeam] = useState(false)
  const [updatingTeam, setUpdatingTeam] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")
  const [showTeamDetails, setShowTeamDetails] = useState(false)

  const allSalesTeamShops = useAppSelector(selectAllSalesTeamShops)
  const allVehicles = useAppSelector(getAllVehicles)
  console.log("all shops ", allSalesTeamShops)
  const allStores = useAppSelector(selectAllStore)

  const { businessName, businessId } = planStatus()

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeamShops())
      dispatch(fetchVehicles({ businessId }))
      dispatch(fetchStore({ businessId }))
    }
  }, [dispatch, businessId])

  // Combine all teams for display
  const allTeams = [
    ...allStores.map((store) => ({
      ...store,
      teamType: "STORE",
      source: "store",
      displayName: store.name,
    })),
    ...allSalesTeamShops.map((shop) => ({
      ...shop,
      teamType: "SHOP",
      source: "shop",
      displayName: shop.name,
    })),
    ...allVehicles.map((vehicle) => ({
      ...vehicle,
      teamType: "VEHICLE",
      source: "vehicle",
      displayName: `${vehicle.number_plate} - ${vehicle.engine_size}`,
    })),
  ]

  const teamTypes = [
    {
      value: "STORE",
      label: "Store",
      icon: "🏬",
      description: "Main store locations",
      color: "bg-purple-100 text-purple-700",
      source: "store",
    },
    {
      value: "SHOP",
      label: "Shop Team",
      icon: "🏪",
      description: "Retail shop sales teams",
      color: "bg-blue-100 text-blue-700",
      source: "shop",
    },
    {
      value: "VEHICLE",
      label: "Vehicle Team",
      icon: "🚚",
      description: "Delivery and transportation teams",
      color: "bg-green-100 text-green-700",
      source: "vehicle",
    },
  ] 

  const filteredTeams = allTeams.filter((team) => {
    const matchesType = filterType === "" || team.teamType === filterType
    const matchesSearch =
      searchQuery === "" ||
      team.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.number_plate &&
        team.number_plate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (team.location_name &&
        team.location_name.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesType && matchesSearch
  })

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingTeam(true)

    try {
      switch (teamType) {
        case "STORE":
          if (!teamName || !locationName) {
            toast.error("Store name and location are required!")
            setAddingTeam(false)
            return
          }

          await dispatch(
            addStore({
              name: teamName,
              location_name: locationName,
              // location_coordinates: locationCoordinates,
            }),
          ).unwrap()
          break

        case "SHOP":
          if (!teamName || !locationName) {
            toast.error("Shop name and location are required!")
            setAddingTeam(false)
            return
          }
          const Data = {
            name: teamName,
            location_name: locationName,
          }
          await dispatch(addSalesTeam(Data)).unwrap()

          break

        case "VEHICLE":
          if (!numberPlate || !engineSize) {
            toast.error("Number plate and engine size are required!")
            setAddingTeam(false)
            return
          }
          const formData = {
            number_plate: numberPlate,
            engine_size: engineSize,
          }
          await dispatch(addVehicle(formData)).unwrap()
          break

        default:
          throw new Error("Invalid team type")
      }

      toast.success(`${teamType} created successfully!`)

      // Reset form
      setAddingTeam(false)
      setSelectedImage(null)
      setTeamName("")
      setNumberPlate("")
      setEngineSize("")
      setLocationName("")
      setLocationCoordinates("")
      setTeamType("SHOP")
      setShowAdd(false)

      // Refresh data
      dispatch(fetchVehicles())
      dispatch(fetchStore({ businessId }))
    } catch (error: any) {
      toast.error(error.message || "Failed to create team")
      setAddingTeam(false)
      console.error("Error creating team:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedTeam) return

    setDeletingTeam(true)
    try {
      switch (selectedTeamSource) {
        case "store":
          await dispatch(deleteStore(selectedTeam.id)).unwrap()
          break
        case "vehicle":
          await dispatch(deleteVehicle(selectedTeam.id)).unwrap()
          break
        case "shop":
          await dispatch(deleteSalesTeam(selectedTeam.id)).unwrap()
          break
      }

      toast.success("Team deleted successfully!")
      setDeletingTeam(false)
      setOpenDelete(false)
      setSelectedTeam(null)

      // Refresh data
      dispatch(fetchVehicles())
      dispatch(fetchStore({ businessId }))
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team")
      setDeletingTeam(false)
      console.error("Error deleting team:", error)
    }
  }

  const handleUpdate = async () => {
    if (!selectedTeam) return

    setUpdatingTeam(true)
    try {
      switch (selectedTeamSource) {
        case "store":
          await dispatch(
            updateStore({
              id: selectedTeam.id,
              data: {
                name: teamName,
                location_name: locationName,
                location_coordinates: locationCoordinates,
              },
            }),
          ).unwrap()
          break
        case "vehicle":
          await dispatch(
            updateVehicle({
              id: selectedTeam.id,
              data: {
                number_plate: numberPlate,
                engine_size: engineSize,
              },
            }),
          ).unwrap()
          break
        case "shop":
          await dispatch(updateSalesTeam({ id: selectedTeam.id, name: teamName })).unwrap()
          // Update shop logic
          break
      }

      toast.success("Team updated successfully!")
      setUpdatingTeam(false)
      setOpenUpdate(false)

      // Reset form
      setTeamName("")
      setNumberPlate("")
      setEngineSize("")
      setLocationName("")
      setLocationCoordinates("")
      setSelectedTeam(null)

      // Refresh data
      dispatch(fetchVehicles())
      dispatch(fetchStore({ businessId }))
    } catch (error: any) {
      toast.error(error.message || "Failed to update team")
      setUpdatingTeam(false)
      console.error("Error updating team:", error)
    }
  }

  // Update the form fields based on selected team type
  useEffect(() => {
    if (selectedTeam && openUpdate) {
      if (selectedTeamSource === "store") {
        setTeamName(selectedTeam.name || "")
        setLocationName(selectedTeam.location?.name || "")
        setLocationCoordinates(selectedTeam.location?.coordinates || "")
      } else if (selectedTeamSource === "vehicle") {
        setNumberPlate(selectedTeam.number_plate || "")
        setEngineSize(selectedTeam.engine_size || "")
      } else if (selectedTeamSource === "shop") {
        setTeamName(selectedTeam.name || "")
        setLocationName(selectedTeam.location?.name || "")
      }
    }
  }, [selectedTeam, openUpdate, selectedTeamSource])

  const handleStockNavigation = (team) => {
    switch (team.teamType) {
      case "STORE":
        navigate(`/cylinders/stock/store/${team.id}`)
        break
      case "SHOP":
        navigate(`/cylinders/stock/team/${team.id}/${team.name}`)
        break
      case "VEHICLE":
        navigate(`/cylinders/stock/vehicle/${team.id}/${team.number_plate}`)
        break
      default:
        console.warn("Unknown team type")
    }
  }


  const handleViewTeam = (team: any) => {
    setSelectedTeam(team)
    setSelectedTeamSource(team.source)
    setShowTeamDetails(true)
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />
      <ToastContainer />

      <main className="flex-grow m-2 p-1 mb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg shadow-lg mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                <span className="mr-2">👥</span>
                Team Management
              </h1>
              <p className="text-indigo-100 text-sm">
                Manage Stores, Shops & Vehicle Teams
              </p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-md"
            >
              {showAdd ? "− Cancel" : "+ Create Team"}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Teams</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {allTeams.length}
                </div>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Stores</div>
                <div className="text-2xl font-bold text-purple-600">
                  {allStores.length}
                </div>
              </div>
              <span className="text-2xl">🏬</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Shops</div>
                <div className="text-2xl font-bold text-blue-600">
                  {allSalesTeamShops.length}
                </div>
              </div>
              <span className="text-2xl">🏪</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Vehicles</div>
                <div className="text-2xl font-bold text-green-600">
                  {allVehicles.length}
                </div>
              </div>
              <span className="text-2xl">🚚</span>
            </div>
          </div>
        </div>

        {/* Create Team Form */}
        {showAdd && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">➕</span>
              Create New Team
            </h2>

            <form onSubmit={handleSaveClick} className="space-y-4">
              {/* Team Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team Type
                </label>
                <select
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value)}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                >
                  <option value="">Select Team Type</option>
                  {teamTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Form Fields based on Team Type */}
              {teamType === "STORE" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., Downtown Store"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Name
                    </label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Coordinates (Optional)
                    </label>
                    <input
                      type="text"
                      value={locationCoordinates}
                      onChange={(e) => setLocationCoordinates(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., 40.7128° N, 74.0060° W"
                    />
                  </div>
                </>
              )}

              {teamType === "SHOP" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., Retail Shop"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Name
                    </label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., Mall Location"
                    />
                  </div>
                </>
              )}

              {teamType === "VEHICLE" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number Plate
                    </label>
                    <input
                      type="text"
                      value={numberPlate}
                      onChange={(e) =>
                        setNumberPlate(e.target.value.toUpperCase())
                      }
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., ABC123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Engine Size
                    </label>
                    <input
                      type="text"
                      value={engineSize}
                      onChange={(e) => setEngineSize(e.target.value)}
                      required
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., 2.0L Turbo"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={addingTeam}
                className={`w-full bg-gradient-to-r ${getTeamColor(
                  teamType,
                )} text-white py-3 rounded-lg font-semibold ${
                  addingTeam
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-95"
                } transition-all duration-200 shadow-md`}
              >
                {addingTeam ? (
                  <span className="flex items-center justify-center">
                    <CircularProgress
                      size={20}
                      className="mr-2"
                      style={{ color: "white" }}
                    />
                    Creating...
                  </span>
                ) : (
                  `Create ${
                    teamTypes.find((t) => t.value === teamType)?.label || "Team"
                  }`
                )}
              </button>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="🔍 Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              >
                <option value="">All Types</option>
                {teamTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAdd(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2"
              >
                <span>➕</span>
                <span>New Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* Teams List */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              All Teams ({filteredTeams.length})
            </h2>
            <span className="text-sm text-gray-500">{businessName}</span>
          </div>

          {filteredTeams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">👥</div>
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery || filterType
                  ? "No teams found"
                  : "No teams created yet"}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {searchQuery || filterType
                  ? "Try adjusting your search or filters"
                  : "Create your first team to get started"}
              </p>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 transition"
              >
                ➕ Create Team
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTeams.map((team) => {
                const typeInfo = getTeamTypeInfo(team.teamType)
                return (
                  <div
                    key={`${team.source}-${team.id}`}
                    className={`border-2 rounded-lg p-4 hover:shadow-md transition ${getTeamBorderColor(
                      team.teamType,
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-white shadow flex items-center justify-center">
                            <span className="text-2xl">{typeInfo?.icon}</span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {team.displayName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {typeInfo?.icon} {typeInfo?.label}
                            {team.location && ` • 📍 ${team.location.name}`}
                            {team.engine_size && ` • ${team.engine_size} CC`}
                          </p>

                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-300">
                              {team.teamType === "VEHICLE"
                                ? "🚚 Vehicle"
                                : team.teamType === "STORE"
                                ? "🏬 Store"
                                : "🏪 Shop"}
                            </span>
                            {team.created_at && (
                              <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-300">
                                📅{" "}
                                {new Date(team.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewTeam(team)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          View
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      {team.teamType !== "VEHICLE" && (
                        <button
                          onClick={() => handleStockNavigation(team)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                        >
                          📦 Stock
                        </button>
                      )}
                      {team.teamType === "VEHICLE" && (
                        <button
                          onClick={() => handleStockNavigation(team)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                        >
                          📦 Stock
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTeam(team)
                          setSelectedTeamSource(team.source)
                          setOpenUpdate(true)
                        }}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeam(team)
                          setSelectedTeamSource(team.source)
                          setOpenDelete(true)
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Update Team Modal */}
      {openUpdate && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div
              className={`bg-gradient-to-r ${getTeamColor(
                selectedTeam.teamType,
              )} text-white p-6`}
            >
              <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-2">✏️</span>
                Update {selectedTeam.teamType}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {selectedTeamSource === "store" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location Name
                      </label>
                      <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </>
                )}

                {selectedTeamSource === "vehicle" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number Plate
                      </label>
                      <input
                        type="text"
                        value={numberPlate}
                        onChange={(e) =>
                          setNumberPlate(e.target.value.toUpperCase())
                        }
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Engine Size
                      </label>
                      <input
                        type="text"
                        value={engineSize}
                        onChange={(e) => setEngineSize(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </>
                )}

                {selectedTeamSource === "shop" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Shop Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location Name
                      </label>
                      <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenUpdate(false)
                    setSelectedTeam(null)
                    setTeamName("")
                    setNumberPlate("")
                    setEngineSize("")
                    setLocationName("")
                    setLocationCoordinates("")
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updatingTeam}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    updatingTeam
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {updatingTeam ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {showTeamDetails && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${getTeamColor(
                selectedTeam.teamType,
              )} text-white p-6`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-white shadow flex items-center justify-center">
                    <span className="text-2xl">
                      {getTeamTypeInfo(selectedTeam.teamType)?.icon}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedTeam.displayName}
                  </h2>
                  <p className="text-white/90">
                    {getTeamTypeInfo(selectedTeam.teamType)?.icon}{" "}
                    {getTeamTypeInfo(selectedTeam.teamType)?.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Team ID</p>
                  <p className="font-semibold text-gray-800 font-mono">
                    #{selectedTeam.id?.toString().padStart(6, "0")}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getTeamTypeInfo(selectedTeam.teamType)?.color ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {getTeamTypeInfo(selectedTeam.teamType)?.icon}{" "}
                    {getTeamTypeInfo(selectedTeam.teamType)?.label}
                  </span>
                </div>

                {selectedTeam.location?.name && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-800">
                      📍 {selectedTeam.location.name}
                    </p>
                  </div>
                )}

                {selectedTeam.engine_size && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Engine Size</p>
                    <p className="font-semibold text-gray-800">
                      🚗 {selectedTeam.engine_size}
                    </p>
                  </div>
                )}

                {selectedTeam.number_plate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Number Plate</p>
                    <p className="font-semibold text-gray-800">
                      🚗 {selectedTeam.number_plate}
                    </p>
                  </div>
                )}

                {selectedTeam.created_at && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Created Date</p>
                    <p className="font-semibold text-gray-800">
                      📅{" "}
                      {new Date(selectedTeam.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTeamDetails(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleStockNavigation(selectedTeam)
                    setShowTeamDetails(false)
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  View Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openDelete && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-2">⚠️</span>
                Delete Confirmation
              </h2>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {getTeamTypeInfo(selectedTeam.teamType)?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedTeam.displayName}
                    </h3>
                    <p className="text-gray-600">
                      {getTeamTypeInfo(selectedTeam.teamType)?.label}
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <span className="font-bold">Warning:</span> Are you sure you
                    want to delete this {selectedTeam.teamType.toLowerCase()}?
                    This action cannot be undone and all associated data will be
                    permanently removed.
                  </p>
                </div>

                {selectedTeam.teamType === "STORE" && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Deleting this
                      store will also remove all inventory records associated
                      with it.
                    </p>
                  </div>
                )}

                {selectedTeam.teamType === "VEHICLE" && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Deleting this
                      vehicle will remove all delivery records associated with
                      it.
                    </p>
                  </div>
                )}

                {selectedTeam.teamType === "SHOP" && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Deleting this
                      shop will remove all team assignments and sales records.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenDelete(false)
                    setSelectedTeam(null)
                    setDeletingTeam(false)
                  }}
                  disabled={deletingTeam}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deletingTeam}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    deletingTeam
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {deletingTeam ? (
                    <span className="flex items-center justify-center">
                      <CircularProgress
                        size={20}
                        className="mr-2"
                        style={{ color: "white" }}
                      />
                      Deleting...
                    </span>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

// Helper functions
const getTeamColor = (teamType: string) => {
  switch (teamType) {
    case "STORE":
      return "from-purple-500 to-purple-600"
    case "SHOP":
      return "from-blue-500 to-blue-600"
    case "VEHICLE":
      return "from-green-500 to-green-600"
    default:
      return "from-indigo-500 to-indigo-600"
  }
}

const getTeamBorderColor = (teamType: string) => {
  switch (teamType) {
    case "STORE":
      return "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50"
    case "SHOP":
      return "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50"
    case "VEHICLE":
      return "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
    default:
      return "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
  }
}

const getTeamTypeInfo = (type: string) => {
  const teamTypes = [
    {
      value: "STORE",
      label: "Store",
      icon: "🏬",
      description: "Main store locations",
      color: "bg-purple-100 text-purple-700",
      source: "store",
    },
    {
      value: "SHOP",
      label: "Shop Team",
      icon: "🏪",
      description: "Retail shop sales teams",
      color: "bg-blue-100 text-blue-700",
      source: "shop",
    },
    {
      value: "VEHICLE",
      label: "Vehicle Team",
      icon: "🚚",
      description: "Delivery and transportation teams",
      color: "bg-green-100 text-green-700",
      source: "vehicle",
    },
  ]
  return teamTypes.find((t) => t.value === type) || teamTypes[0]
}

export default CreateTeamPage
