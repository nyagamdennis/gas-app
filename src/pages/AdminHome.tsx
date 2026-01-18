// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { logout } from "../features/auths/authSlice"
import AdminsFooter from "../components/AdminsFooter"
import AdminNav from "../components/ui/AdminNav"
import {
  fetchBusiness,
  selectAllBusiness,
} from "../features/company/companySlice"
import planStatus from "../features/planStatus/planStatus"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material"
import Navbar from "../components/ui/mobile/admin/Navbar"
import DashboardIcon from "@mui/icons-material/Dashboard"
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler"
import GasMeterIcon from "@mui/icons-material/GasMeter"
import MicrowaveIcon from "@mui/icons-material/Microwave"
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"
import Diversity1Icon from "@mui/icons-material/Diversity1"
import CreditScoreIcon from "@mui/icons-material/CreditScore"
import InsightsIcon from "@mui/icons-material/Insights"
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact"
import SettingsIcon from "@mui/icons-material/Settings"
import InventoryIcon from "@mui/icons-material/Inventory"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import MessageIcon from "@mui/icons-material/Message"
import AssignmentIcon from "@mui/icons-material/Assignment"
import CollectionsIcon from "@mui/icons-material/Collections"
import StoreIcon from "@mui/icons-material/Store"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import SmartToyIcon from "@mui/icons-material/SmartToy"

const AdminHome = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const allBusiness = useAppSelector(selectAllBusiness)
  const { isPro, isTrial, isExpired, businessName } = planStatus()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    dispatch(fetchBusiness())
  }, [dispatch])

  const mobileMenuItems = [
    {
      to: "/dashboard",
      icon: DashboardIcon,
      label: "Dashboard",
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      to: "/thecylinders",
      icon: GasMeterIcon,
      label: "Cylinders",
      color: "from-green-500 to-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      to: "/store/otherproducts",
      icon: MicrowaveIcon,
      label: "Products",
      color: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    {
      to: "/hr",
      icon: SensorOccupiedIcon,
      label: "HR",
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
    {
      to: "/createteam",
      icon: PeopleAltIcon,
      label: "Teams",
      color: "from-pink-500 to-pink-600",
      textColor: "text-pink-700",
      bgColor: "bg-pink-50",
    },
    {
      to: "/admins/salesdata",
      icon: BusinessCenterIcon,
      label: "Sales",
      color: "from-red-500 to-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
    {
      to: "/admins/customers",
      icon: Diversity1Icon,
      label: "Customers",
      color: "from-teal-500 to-teal-600",
      textColor: "text-teal-700",
      bgColor: "bg-teal-50",
    },
    {
      to: "/admin/expenses",
      icon: CreditScoreIcon,
      label: "Expenses",
      color: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-50",
    },
    {
      to: "/admins/prediction",
      icon: SmartToyIcon,
      label: "AI Tools",
      color: "from-violet-500 to-violet-600",
      textColor: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      to: "/admin/reachout",
      icon: ConnectWithoutContactIcon,
      label: "Reach Out",
      color: "from-cyan-500 to-cyan-600",
      textColor: "text-cyan-700",
      bgColor: "bg-cyan-50",
    },
    {
      to: "/admin/deliveries",
      icon: TwoWheelerIcon,
      label: "Deliveries",
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      to: "/admin/settings",
      icon: SettingsIcon,
      label: "Settings",
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
  ]

  const desktopMenuItems = [
    {
      to: "/dashboard",
      icon: DashboardIcon,
      title: "Dashboard",
      subtitle: "Overview of your business operations",
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      to: "/thecylinders",
      icon: GasMeterIcon,
      title: "Cylinder Management",
      subtitle: "Manage cylinder inventory and operations",
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
    {
      to: "/admins/assign",
      icon: AssignmentIcon,
      title: "Assign Cylinders",
      subtitle: "Efficiently allocate cylinders to sales teams",
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      to: "/admins/collect",
      icon: CollectionsIcon,
      title: "Collect Cylinders",
      subtitle: "Streamline the collection of cylinders",
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      to: "/createteam",
      icon: PeopleAltIcon,
      title: "Team Management",
      subtitle: "Form and manage sales teams",
      color: "pink",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      to: "/admins/salesdata",
      icon: BusinessCenterIcon,
      title: "Sales Data",
      subtitle: "Dive into detailed sales analytics",
      color: "red",
      gradient: "from-red-500 to-red-600",
    },
    {
      to: "/admins/store",
      icon: StoreIcon,
      title: "Store Management",
      subtitle: "Oversee store inventory and operations",
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      to: "/store/otherproducts",
      icon: InventoryIcon,
      title: "Other Products",
      subtitle: "Manage additional product inventory",
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      to: "/admins/customers",
      icon: Diversity1Icon,
      title: "Customer Relations",
      subtitle: "Handle customer data and interactions",
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
    },
    {
      to: "/admin/expenses",
      icon: CreditScoreIcon,
      title: "Expense Tracker",
      subtitle: "Monitor and manage company expenses",
      color: "cyan",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      to: "/admins/analysis",
      icon: AnalyticsIcon,
      title: "Performance Analytics",
      subtitle: "Evaluate sales and operational performance",
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      to: "/admins/sms",
      icon: MessageIcon,
      title: "Messaging Center",
      subtitle: "Communicate with customers via SMS",
      color: "violet",
      gradient: "from-violet-500 to-violet-600",
    },
    {
      to: "/admin/deliveries",
      icon: TwoWheelerIcon,
      title: "Delivery Management",
      subtitle: "Track deliveries and assign delivery personnel",
      color: "lime",
      gradient: "from-lime-500 to-lime-600",
    },
    {
      to: "/hr",
      icon: SensorOccupiedIcon,
      title: "Human Resources",
      subtitle: "Organize and manage employee data",
      color: "fuchsia",
      gradient: "from-fuchsia-500 to-fuchsia-600",
    },
    {
      to: "/admins/prediction",
      icon: SmartToyIcon,
      title: "AI Predictions",
      subtitle: "Utilize AI for strategic business forecasting",
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
    },
    {
      to: "/admin/reachout",
      icon: ConnectWithoutContactIcon,
      title: "Customer Outreach",
      subtitle: "Engage with customers and prospects",
      color: "sky",
      gradient: "from-sky-500 to-sky-600",
    },
  ]

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />

          {/* Welcome Section */}
          <div className="mx-2 mt-2 mb-4 p-4 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome Back! 👋
            </h1>
            <p className="text-sm text-gray-600">
              {businessName || "Your Business"}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isPro
                    ? "bg-green-100 text-green-700"
                    : isTrial
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isPro ? "Pro Plan" : isTrial ? "Trial" : "Free Plan"}
              </span>
            </div>
          </div>

          <main className="flex-grow m-2 p-1">
            <div className="grid grid-cols-3 gap-3">
              {mobileMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className={`${item.bgColor} relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 aspect-square active:scale-95`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 hover:opacity-10 transition-opacity duration-200`}
                  ></div>
                  <item.icon
                    className={`${item.textColor} z-10`}
                    sx={{ fontSize: 36 }}
                  />
                  <p
                    className={`mt-2 text-xs font-semibold ${item.textColor} text-center z-10`}
                  >
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>
          </main>

          <footer className="mt-auto">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <AdminNav
            headerMessage={"Admin Dashboard"}
            headerText={"Manage your operations with style and clarity"}
          />

          {/* Welcome Section */}
          <div className="mx-6 mt-6 mb-4 p-6 bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back! 👋
                </h1>
                <p className="text-gray-600">
                  {businessName || "Your Business"} - Dashboard
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isPro
                      ? "bg-green-100 text-green-700"
                      : isTrial
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isPro
                    ? "✨ Pro Plan"
                    : isTrial
                    ? "🔄 Trial"
                    : "📦 Free Plan"}
                </span>
              </div>
            </div>
          </div>

          <main className="flex-grow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {desktopMenuItems.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col overflow-hidden hover:scale-105"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div
                  className={`relative z-10 w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}
                >
                  <item.icon className="text-white" sx={{ fontSize: 28 }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Arrow */}
                <div className="relative z-10 mt-4 flex items-center text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">
                  <span>Learn more</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </main>

          <AdminsFooter />
        </div>
      )}
    </div>
  )
}

export default AdminHome
