// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchMyProfile,
  selectMyProfile,
} from "../features/employees/myProfileSlice"
import defaultProfile from "../components/media/default.png"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { logout, selectUserRole } from "../features/auths/authSlice"
import AdminsFooter from "../components/AdminsFooter"
import EmployeeFooter from "../components/ui/EmployeeFooter"
import EmployeeNav from "../components/ui/EmployeeNav"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material"
import Navbar from "../components/ui/mobile/employees/Navbar"
import DashboardIcon from "@mui/icons-material/Dashboard"
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler"
import GasMeterIcon from "@mui/icons-material/GasMeter"
import MicrowaveIcon from "@mui/icons-material/Microwave"
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent"
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"
import Diversity1Icon from "@mui/icons-material/Diversity1"
import CreditScoreIcon from "@mui/icons-material/CreditScore"
import InsightsIcon from "@mui/icons-material/Insights"
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact"
import SettingsIcon from "@mui/icons-material/Settings"
import FactCheckIcon from "@mui/icons-material/FactCheck"
import { selectEmployeeTeam } from "../features/employees/employeesTeamSlice"
import {
  CreditCard,
  DeliveryDiningSharp,
  TransferWithinAStation,
} from "@mui/icons-material"

const EmployeeHomePage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const myTeamData = useAppSelector(selectEmployeeTeam)

  // Modal state
  const [showSalesModal, setShowSalesModal] = useState(false)
  const [saleType, setSaleType] = useState<"wholesale" | "retail" | null>(null)
  const [productType, setProductType] = useState<
    "cylinder" | "products" | null
  >(null)

  // Extract user assignment data
  const assignmentData = myTeamData?.[0]
  const userId = assignmentData?.user
  const shopId = assignmentData?.assigned_to?.shop_id
  const teamType = assignmentData?.assigned_to?.type
  const teamName = assignmentData?.assigned_to?.name

  // Handle record sales button click - show modal
  const handleRecordSalesClick = () => {
    setShowSalesModal(true)
  }

  // Handle navigation after modal selection
  const handleNavigateToSales = () => {
    if (!saleType || !productType) {
      console.error("Sale type and product type must be selected")
      return
    }

    if (!shopId || !teamType || !teamName) {
      console.error("Missing assignment data")
      return
    }

    const typeMap: { [key: string]: string } = {
      Shop: "shop",
      Vehicle: "vehicle",
      Store: "store",
    }

    const routeType = typeMap[teamType]
    if (!routeType) {
      console.error(`Unknown team type: ${teamType}`)
      return
    }

    let navigationPath = ""
    if (productType === "cylinder") {
      navigationPath = `/cylinder/sales/employee/${routeType}/${teamName}/${shopId}?type=${saleType}`
    } else if (productType === "products") {
      navigationPath = `/product/sales/new/${routeType}/${shopId}?type=${saleType}`
    }

    if (navigationPath) {
      setShowSalesModal(false)
      setSaleType(null)
      setProductType(null)
      navigate(navigationPath)
    }
  }

  const closeSalesModal = () => {
    setShowSalesModal(false)
    setSaleType(null)
    setProductType(null)
  }

  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const userRole = useAppSelector(selectUserRole)
  console.log("User Role:", userRole)

  const handleLogOut = () => {
    dispatch(logout())
    navigate("/login")
  }

  const menuItems = [
    {
      to: "/salesteamcylinders",
      title: "Cylinders",
      subtitle: "View assigned cylinders",
      color: "blue",
    },
    {
      to: "/wholesalesrecord",
      title: "Wholesale",
      subtitle: "Record wholesale transactions",
      color: "blue",
    },
    {
      to: "/retailsalesrecord",
      title: "Retail",
      subtitle: "Record retail transactions",
      color: "green",
    },
    {
      to: "/otherproducts",
      title: "Other Products",
      subtitle: "Record sales of grills, burners, etc",
      color: "green",
    },
    {
      to: "/teamsales",
      title: "Cylinder Sales",
      subtitle: "Track your cylinder sales",
      color: "yellow",
    },
    {
      to: "/teamotherssales",
      title: "Other Sales",
      subtitle: "Track your other product sales",
      color: "yellow",
    },
  ]

  // Define role-based menu tiles
  const deliveryTiles = [
    {
      to: "/mydeliveries",
      title: "Deliveries",
      icon: <TwoWheelerIcon className="text-cyan-600" fontSize="large" />,
      bg: "from-cyan-50 to-cyan-100",
      text: "text-cyan-700",
    },
    // {
    //   to: "/salesteamcylinders",
    //   title: "Sales",
    //   icon: <RealEstateAgentIcon className="text-blue-600" fontSize="large" />,
    //   bg: "from-green-50 to-green-100",
    //   text: "text-green-700",
    // },
    
    // {
    //   to: "/salesteamcylinders",
    //   title: "Cylinders",
    //   icon: <GasMeterIcon className="text-green-600" fontSize="large" />,
    //   bg: "from-green-50 to-green-100",
    //   text: "text-green-700",
    // },
  ]

  const salesTiles = [
    {
      to: "/sales/employee-sales",
      title: "Record Sales",
      icon: <FactCheckIcon className="text-blue-600" fontSize="large" />,
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-700",
    },
    {
      to: `/employees/cylinders/stock/team/${shopId}/${teamName}`,
      title: "Cylinders",
      icon: <GasMeterIcon className="text-green-600" fontSize="large" />,
      bg: "from-green-50 to-green-100",
      text: "text-green-700",
    },
    {
      to: `/employee/products/stock/team/${shopId}/${teamName}`,
      title: "Other Products",
      icon: <MicrowaveIcon className="text-yellow-600" fontSize="large" />,
      bg: "from-yellow-50 to-yellow-100",
      text: "text-yellow-700",
    },
    {
      to: "/teamsales",
      title: "Sales",
      icon: <BusinessCenterIcon className="text-red-600" fontSize="large" />,
      bg: "from-red-50 to-red-100",
      text: "text-red-700",
    },
    {
      to: "/employee/expenses",
      title: "Expenses",
      icon: <CreditScoreIcon className="text-indigo-600" fontSize="large" />,
      bg: "from-indigo-50 to-indigo-100",
      text: "text-indigo-700",
    },
    {
      to: "/employee/debts",
      title: "Debts",
      icon: <CreditCard className="text-violet-600" fontSize="large" />,
      bg: "from-indigo-50 to-indigo-100",
      text: "text-indigo-700",
    },
    {
      to: "/outsource",
      title: "Outsource",
      icon: (
        <TransferWithinAStation className="text-violet-600" fontSize="large" />
      ),
      bg: "from-indigo-50 to-indigo-100",
      text: "text-indigo-700",
    },
    {
      to: "/salesperson/delivery",
      title: "Delivery",
      icon: (
        <DeliveryDiningSharp className="text-violet-600" fontSize="large" />
      ),
      bg: "from-indigo-50 to-indigo-100",
      text: "text-indigo-700",
    },
  ]

  const storeTiles = [
    {
      to: "/salesteamcylinders",
      title: "Cylinders",
      icon: <GasMeterIcon className="text-green-600" fontSize="large" />,
      bg: "from-green-50 to-green-100",
      text: "text-green-700",
    },
    {
      to: "/store",
      title: "Store",
      icon: <MicrowaveIcon className="text-yellow-600" fontSize="large" />,
      bg: "from-yellow-50 to-yellow-100",
      text: "text-yellow-700",
    },
  ]

  // Pick tiles based on role
  const getTilesForRole = () => {
    switch (userRole) {
      case "DELIVERY_GUY":
      case "TRUCK_DRIVER":
      case "CONDUCTOR":
        return deliveryTiles
      case "STORE_MAN":
        return storeTiles
      case "SHOP_ATTENDANT":
      case "SALES_PERSON":
      default:
        return salesTiles
    }
  }

  const tilesToShow = getTilesForRole()

  return (
    <div>
      {/* Sales Type and Product Type Modal */}
      {showSalesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Select Sale Details
            </h2>

            {/* Sale Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Sale Type
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSaleType("wholesale")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    saleType === "wholesale"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Wholesale
                </button>
                <button
                  onClick={() => setSaleType("retail")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    saleType === "retail"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Retail
                </button>
              </div>
            </div>

            {/* Product Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Product Type
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setProductType("cylinder")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    productType === "cylinder"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cylinder
                </button>
                <button
                  onClick={() => setProductType("products")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    productType === "products"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Products
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeSalesModal}
                className="flex-1 py-3 px-4 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleNavigateToSales}
                disabled={!saleType || !productType}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  saleType && productType
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="m-2 p-1 grid grid-cols-3 gap-4">
            {tilesToShow.map((tile) =>
              tile.title === "Record Sales" ? (
                <div
                  key={tile.title}
                  onClick={handleRecordSalesClick}
                  className={`bg-gradient-to-br ${tile.bg} flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square cursor-pointer`}
                >
                  {tile.icon}
                  <p
                    className={`mt-2 text-sm font-semibold ${tile.text} text-center`}
                  >
                    {tile.title}
                  </p>
                </div>
              ) : (
                <Link
                  key={tile.to}
                  to={tile.to}
                  className={`bg-gradient-to-br ${tile.bg} flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square`}
                >
                  {tile.icon}
                  <p
                    className={`mt-2 text-sm font-semibold ${tile.text} text-center`}
                  >
                    {tile.title}
                  </p>
                </Link>
              ),
            )}
          </main>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <AdminNav
            headerMessage={"Admin Dashboard"}
            headerText={"Manage your operations with style and clarity"}
          />

          <main className="flex-grow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                to: "/admins/assign",
                title: "Cylinder Assignment",
                subtitle: "Efficiently allocate cylinders to sales teams.",
                color: "blue",
              },
              {
                to: "/admins/collect",
                title: "Cylinder Collection",
                subtitle: "Streamline the collection of cylinders.",
                color: "blue",
              },
              {
                to: "/admins/assignothers",
                title: "Product Allocation",
                subtitle: "Distribute other products seamlessly.",
                color: "blue",
              },
              {
                to: "/admin/otherssales",
                title: "Other Product Sales",
                subtitle: "Monitor and track sales of additional items.",
                color: "green",
              },
              {
                to: "/admin/sales",
                title: "Cylinder Sales Insights",
                subtitle: "Dive into detailed sales analytics.",
                color: "green",
              },
              {
                to: "/admins/employees",
                title: "Employee Management",
                subtitle: "Organize and manage employee data.",
                color: "yellow",
              },
              {
                to: "#",
                title: "Delivery Management",
                subtitle: "Track deliveries and assign delivery personnel.",
                color: "yellow", // Blue for logistics/delivery
              },
              {
                to: "#",
                title: "Order Management",
                subtitle: "Monitor and manage customer orders efficiently.",
                color: "yellow", // Yellow is fine for alerts/orders
              },
              {
                to: "/createteam",
                title: "Team Builder",
                subtitle: "Form and manage new sales teams.",
                color: "blue",
              },
              {
                to: "/admins/store",
                title: "Inventory Hub",
                subtitle: "Oversee store inventory and operations.",
                color: "blue",
              },
              {
                to: "/admins/customers",
                title: "Customer Relations",
                subtitle: "Handle customer data and interactions.",
                color: "blue",
              },
              {
                to: "/admins/sms",
                title: "Messaging Center",
                subtitle: "Communicate with customers via SMS.",
                color: "blue",
              },
              {
                to: "/admins/analysis",
                title: "Performance Analytics",
                subtitle: "Evaluate sales and operational performance.",
                color: "blue",
              },
              {
                to: "/admin/expenses",
                title: "Expense Tracker",
                subtitle: "Monitor and manage company expenses.",
                color: "blue",
              },
              {
                to: "/admins/prediction",
                title: "AI Predictions",
                subtitle: "Utilize AI for strategic business forecasting.",
                color: "blue",
              },
              {
                to: "/admins/collectothersproducts",
                title: "Other Products Collection",
                subtitle: "Streamline collection of other products.",
                color: "blue",
              },
            ].map(({ to, title, subtitle, color }, index) =>
              to ? (
                <Link
                  to={to}
                  key={index}
                  className={`rounded-2xl shadow-xl bg-white hover:bg-${color}-50 border border-${color}-300 text-${color}-600 transition duration-300 ease-in-out p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02]`}
                >
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
                </Link>
              ) : (
                <div
                  key={index}
                  className={`rounded-2xl shadow-xl bg-white hover:bg-${color}-50 border border-${color}-300 text-${color}-600 transition duration-300 ease-in-out p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02]`}
                >
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
                </div>
              ),
            )}
          </main>

          <AdminsFooter />
        </div>
      )}
    </div>
  )
}

export default EmployeeHomePage
