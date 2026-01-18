// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Backdrop,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button as MuiButton,
} from "@mui/material"
import {
  LocalGasStation,
  Inventory,
  Store,
  Groups,
  ChevronRight,
  TrendingUp,
  Receipt,
  Close,
  ArrowBack,
  DirectionsCar,
  LocalShipping,
  TwoWheeler,
  BikeScooter,
  LocalTaxi,
  ArrowForward,
  Home,
  ShoppingCart,
  Storefront,
} from "@mui/icons-material"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import planStatus from "../../features/planStatus/planStatus"

const AllSales = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const [initialLoad, setInitialLoad] = useState(false)
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
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [showProductsTeamModal, setShowProductsTeamModal] = useState(false)
  const [showProductsVehicleModal, setShowProductsVehicleModal] =
    useState(false)
  const [activeModalType, setActiveModalType] = useState("cylinders")

  // New state for record sale flow
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false)
  const [recordSaleStep, setRecordSaleStep] = useState(0)
  const [selectedTeamType, setSelectedTeamType] = useState<
    "shop" | "vehicle" | null
  >(null)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [selectedSaleType, setSelectedSaleType] = useState<
    "retail" | "wholesale" | null
  >(null)
  const [selectedProductType, setSelectedProductType] = useState<
    "cylinders" | "products" | null
  >(null)

  const allSalesTeam = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicles = useAppSelector(selectAllSalesTeamVehicle)
  const [loading, setLoading] = useState(false)



const [hasFetched, setHasFetched] = useState(false)

useEffect(() => {
  // Only fetch if we have businessId, haven't fetched yet, and arrays are empty
  if (
    businessId &&
    !hasFetched &&
    allSalesTeam.length === 0 &&
    allSalesVehicles.length === 0
  ) {
    setLoading(true)
    Promise.all([
      dispatch(fetchSalesTeamShops()),
      dispatch(fetchSalesTeamVehicle()),
    ])
      .finally(() => setLoading(false))
      .then(() => setHasFetched(true))
  }
}, [
  dispatch,
  businessId,
  hasFetched,
  allSalesTeam.length,
  allSalesVehicles.length,
])


  const handleViewCylinderSales = () => {
    setActiveModalType("cylinders")
    setShowModal(true)
  }

  const handleViewProductSales = () => {
    setActiveModalType("products")
    setShowProductsModal(true)
  }

  const handleViewTeams = (type: "cylinders" | "products") => {
    setActiveModalType(type)
    if (type === "cylinders") {
      setShowModal(false)
      setShowTeamModal(true)
    } else {
      setShowProductsModal(false)
      setShowProductsTeamModal(true)
    }
  }

  const handleViewVehicles = (type: "cylinders" | "products") => {
    setActiveModalType(type)
    if (type === "cylinders") {
      setShowModal(false)
      setShowVehicleModal(true)
    } else {
      setShowProductsModal(false)
      setShowProductsVehicleModal(true)
    }
  }

  const handleNavigate = (path: string) => {
    setShowModal(false)
    setShowTeamModal(false)
    setShowVehicleModal(false)
    setShowProductsModal(false)
    setShowProductsTeamModal(false)
    setShowProductsVehicleModal(false)
    navigate(path)
  }

  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
      case "car":
      case "sedan":
        return <DirectionsCar />
      case "truck":
      case "lorry":
        return <LocalShipping />
      case "motorcycle":
      case "bike":
        return <TwoWheeler />
      case "scooter":
        return <BikeScooter />
      case "taxi":
        return <LocalTaxi />
      default:
        return <DirectionsCar />
    }
  }

  const getVehicleColor = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
      case "car":
      case "sedan":
        return "bg-blue-500"
      case "truck":
      case "lorry":
        return "bg-orange-500"
      case "motorcycle":
      case "bike":
        return "bg-green-500"
      case "scooter":
        return "bg-purple-500"
      case "taxi":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  // New functions for record sale flow
  const handleRecordNewSale = () => {
    setShowRecordSaleModal(true)
    setRecordSaleStep(0)
    setSelectedTeamType(null)
    setSelectedTeam(null)
    setSelectedSaleType(null)
    setSelectedProductType(null)
  }

  const handleSelectTeamType = (type: "shop" | "vehicle") => {
    setSelectedTeamType(type)
    setRecordSaleStep(1)
  }

  const handleSelectTeam = (team: any) => {
    setSelectedTeam(team)
    setRecordSaleStep(2)
  }

  const handleSelectSaleType = (type: "retail" | "wholesale") => {
    setSelectedSaleType(type)
    setRecordSaleStep(3)
  }

  const handleSelectProductType = (type: "cylinders" | "products") => {
    setSelectedProductType(type)

    // Navigate to appropriate page based on selections
    if (type === "cylinders") {
      navigateToCylinderSales()
    } else {
      navigateToProductSales()
    }
  }
  const navigateToCylinderSales = () => {
    setShowRecordSaleModal(false)

    // Build route based on selections
    let route = "/cylinders/sales/new"
    if (selectedTeamType === "shop" && selectedTeam) {
      route = `/cylinders/sales/new/shop/${selectedTeam.name}/${selectedTeam.id}`
    } else if (selectedTeamType === "vehicle" && selectedTeam) {
      route = `/cylinders/sales/new/vehicle/${selectedTeam.name}/${selectedTeam.id}`
    }

    // Add sale type as query param
    if (selectedSaleType) {
      route += `?type=${selectedSaleType}`
    }

    navigate(route)
  }

  const navigateToProductSales = () => {
    setShowRecordSaleModal(false)

    // Build route based on selections
    let route = "/products/sales/new"
    if (selectedTeamType === "shop" && selectedTeam) {
      route = `/products/sales/new/shop/${selectedTeam.id}`
    } else if (selectedTeamType === "vehicle" && selectedTeam) {
      route = `/products/sales/new/vehicle/${selectedTeam.id}`
    }

    // Add sale type as query param
    if (selectedSaleType) {
      route += `?type=${selectedSaleType}`
    }

    navigate(route)
  }

  const handleBackInRecordSale = () => {
    if (recordSaleStep > 0) {
      setRecordSaleStep(recordSaleStep - 1)
      // Reset appropriate state based on step
      if (recordSaleStep === 1) {
        setSelectedTeamType(null)
      } else if (recordSaleStep === 2) {
        setSelectedTeam(null)
      } else if (recordSaleStep === 3) {
        setSelectedSaleType(null)
      }
    } else {
      setShowRecordSaleModal(false)
    }
  }

  const stats = {
    totalSales: 1242,
    teamCount: allSalesTeam.length,
    vehicleCount: allSalesVehicles.length,
    monthlyGrowth: 12.5,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <CircularProgress size={60} />
      </div>
    )
  }

  // Steps for record sale
  const recordSaleSteps = [
    "Select Team Type",
    "Select Team",
    "Select Sale Type",
    "Select Product Type",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer />
      {isMobile ? (
        <div className="flex flex-col min-h-screen">
          <Navbar
            headerMessage={"Sales Dashboard"}
            headerText={"Manage your sales operations efficiently"}
          />

          <div className="py-6 px-4 flex-1">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-600">
                  Sales Management
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    isExpired
                      ? "border-red-500 text-red-600 bg-red-50"
                      : isPro
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-yellow-500 text-yellow-600 bg-yellow-50"
                  }`}
                >
                  {planName}
                </span>
              </div>

              {/* Hero Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 mb-6 text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Sales</p>
                    <h2 className="text-3xl font-bold">
                      {stats.totalSales.toLocaleString()}
                    </h2>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="text-sm mr-1" />
                      <p className="text-sm">
                        {stats.monthlyGrowth}% this month
                      </p>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Receipt className="text-2xl" />
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-600">
                    {allSalesTeam.length}
                  </h3>
                  <p className="text-sm text-gray-600">Sales Teams</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <h3 className="text-2xl font-bold text-purple-600">
                    {allSalesVehicles.length}
                  </h3>
                  <p className="text-sm text-gray-600">Vehicles</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Quick Actions
              </h2>
              <button
                onClick={handleRecordNewSale}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Receipt />
                Record New Sale
              </button>
            </div>

            {/* Sales Categories Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Sales Categories
              </h2>

              {/* Cylinder Sales Card */}
              <div className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-500 mb-4 hover:shadow-xl transition-all duration-200">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <LocalGasStation className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Cylinder Sales
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage cylinder sales from all channels
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleNavigate("/cylinders/stock/store")}
                      className="py-2 px-3 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Store className="text-sm" />
                      Store
                    </button>
                    <button
                      onClick={() => handleViewTeams("cylinders")}
                      disabled={allSalesTeam.length === 0}
                      className={`py-2 px-3 border rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                        allSalesTeam.length === 0
                          ? "border-gray-300 text-gray-400 bg-gray-50"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Groups className="text-sm" />
                      Teams
                    </button>
                    <button
                      onClick={() => handleViewVehicles("cylinders")}
                      disabled={allSalesVehicles.length === 0}
                      className={`py-2 px-3 border rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                        allSalesVehicles.length === 0
                          ? "border-gray-300 text-gray-400 bg-gray-50"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <DirectionsCar className="text-sm" />
                      Vehicles
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Products Card */}
              <div className="bg-white rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-200">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Inventory className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        Other Products
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage products sales from all channels
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleNavigate("/products/sales/store")}
                      className="py-2 px-3 border border-green-300 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Store className="text-sm" />
                      Store
                    </button>
                    <button
                      onClick={() => handleViewTeams("products")}
                      disabled={allSalesTeam.length === 0}
                      className={`py-2 px-3 border rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                        allSalesTeam.length === 0
                          ? "border-gray-300 text-gray-400 bg-gray-50"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Groups className="text-sm" />
                      Teams
                    </button>
                    <button
                      onClick={() => handleViewVehicles("products")}
                      disabled={allSalesVehicles.length === 0}
                      className={`py-2 px-3 border rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                        allSalesVehicles.length === 0
                          ? "border-gray-300 text-gray-400 bg-gray-50"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <DirectionsCar className="text-sm" />
                      Vehicles
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Teams Section */}
            {allSalesTeam.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Sales Teams ({allSalesTeam.length})
                  </h2>
                  <button
                    onClick={() => handleViewTeams("cylinders")}
                    className="text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    View All <ChevronRight className="text-sm" />
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {allSalesTeam.slice(0, 3).map((team, index) => (
                    <React.Fragment key={team.id}>
                      <button
                        onClick={() =>
                          handleNavigate(
                            `/admins/salesdata/${team.id}/${encodeURIComponent(
                              team.name,
                            )}`,
                          )
                        }
                        className="w-full px-4 py-4 flex items-center hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <Groups className="text-blue-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-gray-900">
                            {team.name}
                          </h3>
                          <p className="text-sm text-gray-600">ID: {team.id}</p>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </button>
                      {index < 2 && (
                        <div className="border-b border-gray-100 mx-4" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicles Section */}
            {allSalesVehicles.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Sales Vehicles ({allSalesVehicles.length})
                  </h2>
                  <button
                    onClick={() => handleViewVehicles("cylinders")}
                    className="text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    View All <ChevronRight className="text-sm" />
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {allSalesVehicles.slice(0, 3).map((vehicle, index) => (
                    <React.Fragment key={vehicle.id}>
                      <button
                        onClick={() =>
                          handleNavigate(
                            `/admins/vehicle-sales/${
                              vehicle.id
                            }/${encodeURIComponent(
                              vehicle.name ||
                                vehicle.vehicleNumber ||
                                "Vehicle",
                            )}`,
                          )
                        }
                        className="w-full px-4 py-4 flex items-center hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getVehicleColor(
                            vehicle.vehicleType,
                          )}`}
                        >
                          {getVehicleIcon(vehicle.vehicleType)}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-gray-900">
                            {vehicle.name ||
                              vehicle.number_plate ||
                              `Vehicle ${vehicle.id}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {vehicle.vehicleType || "Vehicle"} •{" "}
                            {vehicle.number_plate || "No Plate"}
                          </p>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </button>
                      {index < 2 && (
                        <div className="border-b border-gray-100 mx-4" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal for Record New Sale Flow */}
          <Dialog
            open={showRecordSaleModal}
            onClose={() => setShowRecordSaleModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden max-h-[90vh]",
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Record New Sale</h3>
                    <p className="text-sm opacity-90 mt-1">
                      Select sale options step by step
                    </p>
                  </div>
                  {recordSaleStep > 0 && (
                    <IconButton
                      color="inherit"
                      onClick={handleBackInRecordSale}
                      className="bg-white/20 hover:bg-white/30"
                    >
                      <ArrowBack />
                    </IconButton>
                  )}
                </div>
              </DialogTitle>
            </div>

            <DialogContent className="p-6">
              {/* Stepper */}
              <Stepper
                activeStep={recordSaleStep}
                orientation="vertical"
                className="mb-6"
              >
                {recordSaleSteps.map((label, index) => (
                  <Step key={label} completed={index < recordSaleStep}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {/* Step 0: Select Team Type */}
                      {index === 0 && (
                        <div className="space-y-3 mt-4">
                          <button
                            onClick={() => handleSelectTeamType("shop")}
                            className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <Storefront className="text-blue-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Shop Team
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {allSalesTeam.length} shop(s) available
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-blue-500" />
                          </button>

                          <button
                            onClick={() => handleSelectTeamType("vehicle")}
                            className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <DirectionsCar className="text-green-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Vehicle Team
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {allSalesVehicles.length} vehicle(s) available
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-green-500" />
                          </button>

                          <button
                            onClick={() => {
                              // Direct store sale (no team)
                              setSelectedTeamType(null)
                              setSelectedTeam(null)
                              setRecordSaleStep(2) // Skip to sale type
                            }}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <Home className="text-purple-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Store Sale
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Direct store sale (no team)
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-purple-500" />
                          </button>
                        </div>
                      )}

                      {/* Step 1: Select Team */}
                      {index === 1 && selectedTeamType && (
                        <div className="mt-4 max-h-64 overflow-y-auto">
                          {selectedTeamType === "shop" ? (
                            allSalesTeam.length === 0 ? (
                              <div className="text-center py-8">
                                <Storefront className="text-5xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">
                                  No shop teams available
                                </p>
                              </div>
                            ) : (
                              <List>
                                {allSalesTeam.map((team) => (
                                  <ListItemButton
                                    key={team.id}
                                    onClick={() => handleSelectTeam(team)}
                                    className="rounded-xl border border-gray-200 mb-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                  >
                                    <ListItemIcon>
                                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">
                                          {team.name.charAt(0)}
                                        </span>
                                      </div>
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={team.name}
                                      secondary={`Type: ${
                                        team.type_of_sales_team?.name || "N/A"
                                      }`}
                                      primaryTypographyProps={{
                                        className: "font-semibold",
                                      }}
                                    />
                                    <ArrowForward className="text-gray-400" />
                                  </ListItemButton>
                                ))}
                              </List>
                            )
                          ) : selectedTeamType === "vehicle" ? (
                            allSalesVehicles.length === 0 ? (
                              <div className="text-center py-8">
                                <DirectionsCar className="text-5xl text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">
                                  No vehicles available
                                </p>
                              </div>
                            ) : (
                              <List>
                                {allSalesVehicles.map((vehicle) => (
                                  <ListItemButton
                                    key={vehicle.id}
                                    onClick={() => handleSelectTeam(vehicle)}
                                    className="rounded-xl border border-gray-200 mb-3 hover:border-green-500 hover:bg-green-50 transition-all"
                                  >
                                    <ListItemIcon>
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getVehicleColor(
                                          vehicle.vehicleType,
                                        )}`}
                                      >
                                        {getVehicleIcon(vehicle.vehicleType)}
                                      </div>
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        vehicle.name ||
                                        vehicle.number_plate ||
                                        `Vehicle ${vehicle.id}`
                                      }
                                      secondary={`${
                                        vehicle.vehicleType || "Vehicle"
                                      } • ${
                                        vehicle.number_plate || "No Plate"
                                      }`}
                                      primaryTypographyProps={{
                                        className: "font-semibold",
                                      }}
                                    />
                                    <ArrowForward className="text-gray-400" />
                                  </ListItemButton>
                                ))}
                              </List>
                            )
                          ) : null}
                        </div>
                      )}

                      {/* Step 2: Select Sale Type */}
                      {index === 2 && (
                        <div className="space-y-3 mt-4">
                          <button
                            onClick={() => handleSelectSaleType("retail")}
                            className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <ShoppingCart className="text-blue-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Retail Sale
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Individual customer sales
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-blue-500" />
                          </button>

                          <button
                            onClick={() => handleSelectSaleType("wholesale")}
                            className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <Store className="text-green-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Wholesale Sale
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Bulk sales to businesses
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-green-500" />
                          </button>
                        </div>
                      )}

                      {/* Step 3: Select Product Type */}
                      {index === 3 && (
                        <div className="space-y-3 mt-4">
                          <button
                            onClick={() => handleSelectProductType("cylinders")}
                            className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <LocalGasStation className="text-blue-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Cylinder Sales
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Gas cylinder sales
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-blue-500" />
                          </button>

                          <button
                            onClick={() => handleSelectProductType("products")}
                            className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <Inventory className="text-green-600 text-xl" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                  Other Products
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Accessories and other products
                                </p>
                              </div>
                            </div>
                            <ArrowForward className="text-gray-400 group-hover:text-green-500" />
                          </button>
                        </div>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {/* Current Selection Summary */}
              {(selectedTeamType || selectedTeam || selectedSaleType) && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Current Selection:
                  </h4>
                  <div className="space-y-2">
                    {selectedTeamType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Type:</span>
                        <span className="font-medium">
                          {selectedTeamType === "shop"
                            ? "Shop Team"
                            : selectedTeamType === "vehicle"
                            ? "Vehicle Team"
                            : "Store Sale"}
                        </span>
                      </div>
                    )}
                    {selectedTeam && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team:</span>
                        <span className="font-medium">
                          {selectedTeam.name ||
                            selectedTeam.number_plate ||
                            `Team ${selectedTeam.id}`}
                        </span>
                      </div>
                    )}
                    {selectedSaleType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sale Type:</span>
                        <span className="font-medium capitalize">
                          {selectedSaleType}
                        </span>
                      </div>
                    )}
                    {selectedProductType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Type:</span>
                        <span className="font-medium">
                          {selectedProductType === "cylinders"
                            ? "Cylinders"
                            : "Other Products"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRecordSaleModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Close />
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal for selecting cylinder sales channel */}
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden",
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <h3 className="text-xl font-bold">View Cylinder Sales</h3>
                <p className="text-sm opacity-90 mt-1">
                  Select sales channel to view
                </p>
              </DialogTitle>
            </div>
            <DialogContent className="p-6">
              <List className="space-y-2 mb-4">
                <ListItemButton
                  onClick={() => handleNavigate("/cylinders/stock/store")}
                  className="rounded-xl border border-blue-200 hover:border-blue-500 transition-all mb-3"
                >
                  <ListItemIcon>
                    <Store className="text-blue-600" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Store Sales"
                    secondary="Main store cylinder sales"
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => handleViewTeams("cylinders")}
                  disabled={allSalesTeam.length === 0}
                  className={`rounded-xl border transition-all mb-3 ${
                    allSalesTeam.length === 0
                      ? "border-gray-200 bg-gray-50"
                      : "border-green-200 hover:border-green-500"
                  }`}
                >
                  <ListItemIcon>
                    <Groups
                      className={
                        allSalesTeam.length === 0
                          ? "text-gray-400"
                          : "text-green-600"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Team Sales"
                    secondary={
                      allSalesTeam.length === 0
                        ? "No sales teams available"
                        : `${allSalesTeam.length} team${
                            allSalesTeam.length !== 1 ? "s" : ""
                          } available`
                    }
                  />
                  {allSalesTeam.length > 0 && (
                    <Badge
                      badgeContent={allSalesTeam.length}
                      color="success"
                      className="mr-2"
                    />
                  )}
                </ListItemButton>
                <ListItemButton
                  onClick={() => handleViewVehicles("cylinders")}
                  disabled={allSalesVehicles.length === 0}
                  className={`rounded-xl border transition-all ${
                    allSalesVehicles.length === 0
                      ? "border-gray-200 bg-gray-50"
                      : "border-blue-200 hover:border-blue-500"
                  }`}
                >
                  <ListItemIcon>
                    <DirectionsCar
                      className={
                        allSalesVehicles.length === 0
                          ? "text-gray-400"
                          : "text-blue-600"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Vehicle Sales"
                    secondary={
                      allSalesVehicles.length === 0
                        ? "No vehicles available"
                        : `${allSalesVehicles.length} vehicle${
                            allSalesVehicles.length !== 1 ? "s" : ""
                          } available`
                    }
                  />
                  {allSalesVehicles.length > 0 && (
                    <Badge
                      badgeContent={allSalesVehicles.length}
                      color="info"
                      className="mr-2"
                    />
                  )}
                </ListItemButton>
              </List>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Close />
                Cancel
              </button>
            </DialogContent>
          </Dialog>

          {/* Modal for selecting product sales channel */}
          <Dialog
            open={showProductsModal}
            onClose={() => setShowProductsModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden",
            }}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <h3 className="text-xl font-bold">View Product Sales</h3>
                <p className="text-sm opacity-90 mt-1">
                  Select sales channel to view
                </p>
              </DialogTitle>
            </div>
            <DialogContent className="p-6">
              <List className="space-y-2 mb-4">
                <ListItemButton
                  onClick={() => handleNavigate("/products/sales/store")}
                  className="rounded-xl border border-green-200 hover:border-green-500 transition-all mb-3"
                >
                  <ListItemIcon>
                    <Store className="text-green-600" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Store Sales"
                    secondary="Main store product sales"
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => handleViewTeams("products")}
                  disabled={allSalesTeam.length === 0}
                  className={`rounded-xl border transition-all mb-3 ${
                    allSalesTeam.length === 0
                      ? "border-gray-200 bg-gray-50"
                      : "border-blue-200 hover:border-blue-500"
                  }`}
                >
                  <ListItemIcon>
                    <Groups
                      className={
                        allSalesTeam.length === 0
                          ? "text-gray-400"
                          : "text-blue-600"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Team Sales"
                    secondary={
                      allSalesTeam.length === 0
                        ? "No sales teams available"
                        : `${allSalesTeam.length} team${
                            allSalesTeam.length !== 1 ? "s" : ""
                          } available`
                    }
                  />
                  {allSalesTeam.length > 0 && (
                    <Badge
                      badgeContent={allSalesTeam.length}
                      color="primary"
                      className="mr-2"
                    />
                  )}
                </ListItemButton>
                <ListItemButton
                  onClick={() => handleViewVehicles("products")}
                  disabled={allSalesVehicles.length === 0}
                  className={`rounded-xl border transition-all ${
                    allSalesVehicles.length === 0
                      ? "border-gray-200 bg-gray-50"
                      : "border-blue-200 hover:border-blue-500"
                  }`}
                >
                  <ListItemIcon>
                    <DirectionsCar
                      className={
                        allSalesVehicles.length === 0
                          ? "text-gray-400"
                          : "text-blue-600"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Vehicle Sales"
                    secondary={
                      allSalesVehicles.length === 0
                        ? "No vehicles available"
                        : `${allSalesVehicles.length} vehicle${
                            allSalesVehicles.length !== 1 ? "s" : ""
                          } available`
                    }
                  />
                  {allSalesVehicles.length > 0 && (
                    <Badge
                      badgeContent={allSalesVehicles.length}
                      color="info"
                      className="mr-2"
                    />
                  )}
                </ListItemButton>
              </List>
              <button
                onClick={() => setShowProductsModal(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Close />
                Cancel
              </button>
            </DialogContent>
          </Dialog>

          {/* Modal for selecting cylinder sales team */}
          <Dialog
            open={showTeamModal}
            onClose={() => setShowTeamModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden",
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <div className="flex items-center">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      setShowTeamModal(false)
                      setShowModal(true)
                    }}
                    className="mr-3"
                  >
                    <ArrowBack />
                  </IconButton>
                  <div>
                    <h3 className="text-xl font-bold">
                      Select Sales Team (Cylinders)
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                      Choose a team to view their cylinder sales
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </div>
            <DialogContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-4">
                {allSalesTeam.length === 0 ? (
                  <div className="text-center py-8">
                    <Groups className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sales teams available</p>
                  </div>
                ) : (
                  <List>
                    {allSalesTeam.map((team) => (
                      <ListItemButton
                        key={team.id}
                        onClick={() =>
                          handleNavigate(
                            `/admins/cylinders/team-sales/${
                              team.id
                            }/${encodeURIComponent(team.name)}`,
                          )
                        }
                        className="rounded-xl border border-gray-200 mb-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <ListItemIcon>
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {team.name.charAt(0)}
                            </span>
                          </div>
                        </ListItemIcon>
                        <ListItemText
                          primary={team.name}
                          secondary={`ID: ${team.id}`}
                          primaryTypographyProps={{
                            className: "font-semibold",
                          }}
                        />
                        <ChevronRight className="text-gray-400" />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Close />
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal for selecting product sales team */}
          <Dialog
            open={showProductsTeamModal}
            onClose={() => setShowProductsTeamModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden",
            }}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <div className="flex items-center">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      setShowProductsTeamModal(false)
                      setShowProductsModal(true)
                    }}
                    className="mr-3"
                  >
                    <ArrowBack />
                  </IconButton>
                  <div>
                    <h3 className="text-xl font-bold">
                      Select Sales Team (Products)
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                      Choose a team to view their product sales
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </div>
            <DialogContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-4">
                {allSalesTeam.length === 0 ? (
                  <div className="text-center py-8">
                    <Groups className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sales teams available</p>
                  </div>
                ) : (
                  <List>
                    {allSalesTeam.map((team) => (
                      <ListItemButton
                        key={team.id}
                        onClick={() =>
                          handleNavigate(
                            `/admins/products/team-sales/${
                              team.id
                            }/${encodeURIComponent(team.name)}`,
                          )
                        }
                        className="rounded-xl border border-gray-200 mb-3 hover:border-green-500 hover:bg-green-50 transition-all"
                      >
                        <ListItemIcon>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold">
                              {team.name.charAt(0)}
                            </span>
                          </div>
                        </ListItemIcon>
                        <ListItemText
                          primary={team.name}
                          secondary={`ID: ${team.id}`}
                          primaryTypographyProps={{
                            className: "font-semibold",
                          }}
                        />
                        <ChevronRight className="text-gray-400" />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowProductsTeamModal(false)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Close />
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal for selecting cylinder vehicle */}
          <Dialog
            open={showVehicleModal}
            onClose={() => setShowVehicleModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden",
            }}
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <div className="flex items-center">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      setShowVehicleModal(false)
                      setShowModal(true)
                    }}
                    className="mr-3"
                  >
                    <ArrowBack />
                  </IconButton>
                  <div>
                    <h3 className="text-xl font-bold">
                      Select Vehicle (Cylinders)
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                      Choose a vehicle to view their cylinder sales
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </div>
            <DialogContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-4">
                {allSalesVehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <DirectionsCar className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No vehicles available</p>
                  </div>
                ) : (
                  <List>
                    {allSalesVehicles.map((vehicle) => (
                      <ListItemButton
                        key={vehicle.id}
                        onClick={() =>
                          handleNavigate(
                            `/admins/cylinders/vehicle-sales/${
                              vehicle.id
                            }/${encodeURIComponent(
                              vehicle.name ||
                                vehicle.vehicleNumber ||
                                "Vehicle",
                            )}`,
                          )
                        }
                        className="rounded-xl border border-gray-200 mb-3 hover:border-cyan-500 hover:bg-cyan-50 transition-all"
                      >
                        <ListItemIcon>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getVehicleColor(
                              vehicle.vehicleType,
                            )}`}
                          >
                            {getVehicleIcon(vehicle.vehicleType)}
                          </div>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            vehicle.name ||
                            vehicle.vehicleNumber ||
                            `Vehicle ${vehicle.id}`
                          }
                          secondary={
                            <>
                              <span className="font-medium text-gray-900">
                                {vehicle.vehicleType || "Vehicle"}
                              </span>
                              {vehicle.vehicleNumber &&
                                ` • ${vehicle.vehicleNumber}`}
                            </>
                          }
                          primaryTypographyProps={{
                            className: "font-semibold",
                          }}
                        />
                        <ChevronRight className="text-gray-400" />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowVehicleModal(false)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Close />
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal for selecting product vehicle */}
          <Dialog
            open={showProductsVehicleModal}
            onClose={() => setShowProductsVehicleModal(false)}
            maxWidth="sm"
            fullWidth
            BackdropComponent={Backdrop}
            TransitionComponent={Fade}
            PaperProps={{
              className: "rounded-3xl overflow-hidden",
            }}
          >
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 text-white">
              <DialogTitle className="text-white p-0">
                <div className="flex items-center">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      setShowProductsVehicleModal(false)
                      setShowProductsModal(true)
                    }}
                    className="mr-3"
                  >
                    <ArrowBack />
                  </IconButton>
                  <div>
                    <h3 className="text-xl font-bold">
                      Select Vehicle (Products)
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                      Choose a vehicle to view their product sales
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </div>
            <DialogContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-4">
                {allSalesVehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <DirectionsCar className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No vehicles available</p>
                  </div>
                ) : (
                  <List>
                    {allSalesVehicles.map((vehicle) => (
                      <ListItemButton
                        key={vehicle.id}
                        onClick={() =>
                          handleNavigate(
                            `/admins/products/vehicle-sales/${
                              vehicle.id
                            }/${encodeURIComponent(
                              vehicle.name ||
                                vehicle.vehicleNumber ||
                                "Vehicle",
                            )}`,
                          )
                        }
                        className="rounded-xl border border-gray-200 mb-3 hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                      >
                        <ListItemIcon>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getVehicleColor(
                              vehicle.vehicleType,
                            )}`}
                          >
                            {getVehicleIcon(vehicle.vehicleType)}
                          </div>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            vehicle.name ||
                            vehicle.vehicleNumber ||
                            `Vehicle ${vehicle.id}`
                          }
                          secondary={
                            <>
                              <span className="font-medium text-gray-900">
                                {vehicle.vehicleType || "Vehicle"}
                              </span>
                              {vehicle.vehicleNumber &&
                                ` • ${vehicle.vehicleNumber}`}
                            </>
                          }
                          primaryTypographyProps={{
                            className: "font-semibold",
                          }}
                        />
                        <ChevronRight className="text-gray-400" />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowProductsVehicleModal(false)}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Close />
                  Cancel
                </button>
              </div>
            </DialogContent>
          </Dialog>

          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">
                Desktop Dashboard
              </h1>
              <p className="text-gray-600 mb-8">
                Full desktop view with advanced analytics and management
                features including vehicle sales
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-4xl font-bold text-blue-600 mb-2">
                    {allSalesTeam.length}
                  </h3>
                  <p className="text-gray-700">Sales Teams</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">
                    {allSalesVehicles.length}
                  </h3>
                  <p className="text-gray-700">Sales Vehicles</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-4xl font-bold text-green-600 mb-2">
                    {stats.totalSales}
                  </h3>
                  <p className="text-gray-700">Total Sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllSales
