
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
import {
  addSalesTeam,
  deleteSalesTeam,
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
  updateSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import {
  addSalesTeamVehicle,
  deleteSalesTeamVehicle,
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
  updateSalesTeamVehicle,
} from "../features/salesTeam/salesTeamVehicleSlice"
import { fetchStore, selectAllStore } from "../features/store/storeSlice"
import planStatus from "../features/planStatus/planStatus"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"



const CreateTeamPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [teamName, setName] = useState("")
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
  const allSalesVehicles = useAppSelector(selectAllSalesTeamVehicle)
  const allStores = useAppSelector(selectAllStore)

  const { businessName, businessId } = planStatus()

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeamShops())
      dispatch(fetchSalesTeamVehicle())
      dispatch(fetchStore({ businessId }))
    }
  }, [dispatch, businessId])

  // Combine all teams for display
  const allTeams = [
    ...allStores.map((store) => ({
      ...store,
      teamType: "STORE",
      source: "store",
    })),
    ...allSalesTeamShops.map((shop) => ({
      ...shop,
      teamType: "SHOP",
      source: "shop",
    })),
    ...allSalesVehicles.map((vehicle) => ({
      ...vehicle,
      teamType: "VEHICLE",
      source: "vehicle",
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

  const teamCategories = [
    { value: "RETAIL", label: "Retail", icon: "🛒" },
    { value: "WHOLESALE", label: "Wholesale", icon: "📦" },
    { value: "DELIVERY", label: "Delivery", icon: "🚚" },
    { value: "LOGISTICS", label: "Logistics", icon: "🚛" },
    { value: "MARKETING", label: "Marketing", icon: "📢" },
    { value: "OPERATIONS", label: "Operations", icon: "⚙️" },
  ]

  const filteredTeams = allTeams.filter((team) => {
    const matchesType = filterType === "" || team.teamType === filterType
    const matchesSearch =
      searchQuery === "" ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.type &&
        team.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (team.location &&
        team.location.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesType && matchesSearch
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setSelectedImage(URL.createObjectURL(selectedFile))
    }
  }

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingTeam(true)

    const fileInput = document.getElementById(
      "profilePicture",
    ) as HTMLInputElement
    const file = fileInput.files?.[0]

    try {
      if (!teamName) {
        toast.error("Please enter a team name!")
        setAddingTeam(false)
        return
      }

      let response
      switch (teamType) {
        case "SHOP":
          // response = await dispatch(
          //   addSalesTeam({
          //     profile_image: file || undefined,
          //     name: teamName,
          //     teamType: teamType,
          //   }),
          // ).unwrap()
          break

        case "VEHICLE":
          // response = await dispatch(
          //   addSalesTeamVehicle({
          //     profile_image: file || undefined,
          //     name: teamName,
          //     teamType: teamType,
          //   }),
          // ).unwrap()
          break

        case "STORE":
          // response = await dispatch(
          //   addStore({
          //     profile_image: file || undefined,
          //     name: teamName,
          //     teamType: teamType,
          //   }),
          // ).unwrap()
          break

        default:
          throw new Error("Invalid team type")
      }

      toast.success("Team created successfully!")
      setAddingTeam(false)
      setSelectedImage(null)
      setName("")
      setTeamType("SHOP")
      setShowAdd(false)

      // Clear file input
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      toast.error("Failed to create team")
      setAddingTeam(false)
      console.error("Error adding team:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedTeam) return

    setDeletingTeam(true)
    try {
      switch (selectedTeamSource) {
        case "shop":
          await dispatch(deleteSalesTeam(selectedTeam.id)).unwrap()
          break
        case "vehicle":
          await dispatch(deleteSalesTeamVehicle(selectedTeam.id)).unwrap()
          break
        case "store":
          await dispatch(deleteStore(selectedTeam.id)).unwrap()
          break
      }

      toast.success("Team deleted successfully!")
      setDeletingTeam(false)
      setOpenDelete(false)
      setSelectedTeam(null)
    } catch (error) {
      toast.error("Failed to delete team")
      setDeletingTeam(false)
      console.error("Error deleting team:", error)
    }
  }

  const handleUpdate = async () => {
    if (!selectedTeam) return

    setUpdatingTeam(true)
    try {
      switch (selectedTeamSource) {
        case "shop":
          // await dispatch(
          //   updateSalesTeam({
          //     id: selectedTeam.id,
          //     name: teamName,
          //     type: "RETAIL",
          //     teamType: teamType,
          //   }),
          // ).unwrap()
          break
        case "vehicle":
          // await dispatch(
          //   updateSalesTeamVehicle({
          //     id: selectedTeam.id,
          //     name: teamName,
          //     type: "DELIVERY",
          //     teamType: teamType,
          //   }),
          // ).unwrap()
          break
        case "store":
          // await dispatch(
          //   updateStore({
          //     id: selectedTeam.id,
          //     name: teamName,
          //     type: "RETAIL",
          //     teamType: teamType,
          //   }),
          // ).unwrap()
          break
      }

      toast.success("Team updated successfully!")
      setUpdatingTeam(false)
      setOpenUpdate(false)
      setName("")
      setTeamType("SHOP")
      setSelectedTeam(null)
    } catch (error) {
      toast.error("Failed to update team")
      setUpdatingTeam(false)
      console.error("Error updating team:", error)
    }
  }

  const handleViewTeam = (team: any) => {
    setSelectedTeam(team)
    setSelectedTeamSource(team.source)
    setShowTeamDetails(true)
  }

  const getTeamTypeInfo = (type: string) => {
    return teamTypes.find((t) => t.value === type) || teamTypes[0]
  }

  const getDefaultImage = (teamType: string) => {
    switch (teamType) {
      case "VEHICLE":
        return defaultVehicle
      case "STORE":
        return defaultStore
      default:
        return defaultPic
    }
  }

  const getTeamStats = (team: any) => {
    return {
      members: Math.floor(Math.random() * 10) + 1,
      performance: Math.floor(Math.random() * 30) + 70,
      tasks: Math.floor(Math.random() * 20) + 5,
      stock: Math.floor(Math.random() * 100) + 50,
    }
  }

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

  if (isMobile) {
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
                    {allSalesVehicles.length}
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
                {/* Image Upload */}
                <div className="flex flex-col items-center">
                  <label htmlFor="profilePicture" className="cursor-pointer">
                    <div className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Team"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">
                            {teamType === "STORE"
                              ? "🏬"
                              : teamType === "VEHICLE"
                              ? "🚚"
                              : "🏪"}
                          </div>
                          <p className="text-sm text-gray-500">
                            Upload Team Image
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Team Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    placeholder="e.g., Downtown Store, Delivery Team"
                  />
                </div>

                {/* Team Type */}
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

                {/* Additional Fields based on type */}
                {teamType === "STORE" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Location
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      placeholder="e.g., 123 Main Street"
                    />
                  </div>
                )}

                {teamType === "VEHICLE" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition">
                      <option value="">Select Vehicle Type</option>
                      <option value="TRUCK">🚛 Truck</option>
                      <option value="VAN">🚐 Van</option>
                      <option value="BIKE">🏍️ Motorcycle</option>
                      <option value="CAR">🚗 Car</option>
                    </select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Description (Optional)
                  </label>
                  <textarea
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                    rows={3}
                    placeholder="Describe the team's purpose and responsibilities..."
                  ></textarea>
                </div>

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
                      Creating Team...
                    </span>
                  ) : (
                    `Create ${
                      teamTypes.find((t) => t.value === teamType)?.label ||
                      "Team"
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
                  placeholder="🔍 Search teams by name, type, or location..."
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
                  const stats = getTeamStats(team)
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
                            <img
                              src={
                                team.profile_image ||
                                getDefaultImage(team.teamType)
                              }
                              alt={team.name}
                              className="w-14 h-14 object-cover rounded-full border-2 border-white shadow"
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-white">
                              <span className="text-xs">{typeInfo?.icon}</span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg">
                              {team.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {typeInfo?.icon} {typeInfo?.label}
                              {team.location && ` • 📍 ${team.location}`}
                              {team.vehicle_type && ` • ${team.vehicle_type}`}
                            </p>

                            <div className="flex gap-2 mt-2 flex-wrap">
                              <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-300">
                                👥 {stats.members} members
                              </span>
                              <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-300">
                                📦 {stats.stock} items
                              </span>
                              {team.teamType === "VEHICLE" && (
                                <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-300">
                                  🚚 Delivery
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
                            onClick={() => {
                              navigate(
                                `/teamstock/${team.id}/${encodeURIComponent(
                                  team.name,
                                )}`,
                              )
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                          >
                            📦 Stock
                          </button>
                        )}
                        {team.teamType === "VEHICLE" && (
                          <button
                            onClick={() => {
                              navigate(`/vehicle/${team.id}`)
                            }}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                          >
                            🚚 Routes
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedTeam(team)
                            setSelectedTeamSource(team.source)
                            setName(team.name)
                            setTeamType(team.teamType)
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
                    <img
                      src={
                        selectedTeam.profile_image ||
                        getDefaultImage(selectedTeam.teamType)
                      }
                      alt={selectedTeam.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-white shadow"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-white flex items-center justify-center">
                      <span className="text-xs">
                        {getTeamTypeInfo(selectedTeam.teamType)?.icon}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
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
                      #{selectedTeam.id.slice(0, 8).toUpperCase()}
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

                  {selectedTeam.location && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Location</p>
                      <p className="font-semibold text-gray-800">
                        📍 {selectedTeam.location}
                      </p>
                    </div>
                  )}

                  {selectedTeam.vehicle_type && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Vehicle Type</p>
                      <p className="font-semibold text-gray-800">
                        🚗 {selectedTeam.vehicle_type}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Members</p>
                      <p className="font-bold text-2xl text-indigo-600">
                        👥 {getTeamStats(selectedTeam).members}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Stock Items</p>
                      <p className="font-bold text-2xl text-green-600">
                        📦 {getTeamStats(selectedTeam).stock}
                      </p>
                    </div>
                  </div>

                  {selectedTeam.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Description</p>
                      <p className="font-semibold text-gray-800">
                        {selectedTeam.description}
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
                  {selectedTeam.teamType !== "VEHICLE" && (
                    <button
                      onClick={() => {
                        navigate(
                          `/teamstock/${selectedTeam.id}/${encodeURIComponent(
                            selectedTeam.name,
                          )}`,
                        )
                        setShowTeamDetails(false)
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                      View Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {openDelete && selectedTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">⚠️</span>
                  Delete Team
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
                        {selectedTeam.name}
                      </h3>
                      <p className="text-gray-600">
                        {getTeamTypeInfo(selectedTeam.teamType)?.label}
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">
                      <span className="font-bold">Warning:</span> This action
                      cannot be undone. Deleting this team will remove all
                      associated data.
                    </p>
                  </div>

                  {selectedTeam.teamType === "STORE" && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                      <p className="text-yellow-700 text-sm">
                        <span className="font-bold">Note:</span> Store deletion
                        will also remove all inventory records.
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
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
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
                    {deletingTeam ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  Update Team
                </h2>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Type
                    </label>
                    <select
                      value={teamType}
                      onChange={(e) => setTeamType(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    >
                      {teamTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Changing team
                      type may affect team assignments and permissions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOpenUpdate(false)
                      setSelectedTeam(null)
                      setName("")
                      setTeamType("SHOP")
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
                    {updatingTeam ? "Updating..." : "Update Team"}
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

  // Desktop View
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />
      <ToastContainer />

      <main className="flex-grow p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-30">💻</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Desktop View Coming Soon
          </h2>
          <p className="text-gray-500">
            Please use a mobile device or check back later for the desktop
            version.
          </p>
        </div>
      </main>

      <footer className="mt-8">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default CreateTeamPage
