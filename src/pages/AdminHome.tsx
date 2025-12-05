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
} from "../features/business/businnesSlice"
import planStatus from "../features/planStatus/planStatus"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material"
import Navbar from "../components/ui/mobile/admin/Navbar"
import DashboardIcon from "@mui/icons-material/Dashboard"
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
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

const AdminHome = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const allBusiness = useAppSelector(selectAllBusiness)
  const { isPro, isTrial, isExpired } = planStatus()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    dispatch(fetchBusiness())
  }, [dispatch])

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="m-2 p-1 grid grid-cols-3 gap-4">
            <Link
              to={"/dashboard"}
              className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square"
            >
              <DashboardIcon className="text-blue-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-blue-700 text-center">
                Dashboard
              </p>
            </Link>
            <Link to={"/thecylinders"} className="bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <GasMeterIcon className="text-green-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-green-700 text-center">
                Cylinders
              </p>
            </Link>
            <Link to={"/store/otherproducts"} className="bg-gradient-to-br from-yellow-50 to-yellow-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <MicrowaveIcon className="text-yellow-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-yellow-700 text-center">
                Other Products
              </p>
            </Link>
            <Link to={"/hr"} className="bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <SensorOccupiedIcon
                className="text-purple-600"
                fontSize="large"
              />
              <p className="mt-2 text-sm font-semibold text-purple-700 text-center">
                HR
              </p>
            </Link>
            <Link to={"/createteam"} className="bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <PeopleAltIcon className="text-pink-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-pink-700 text-center">
                Teams
              </p>
            </Link>
            <Link to={"/admins/salesdata"} className="bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <BusinessCenterIcon className="text-red-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-red-700 text-center">
                Sales
              </p>
            </Link>
            <Link to={'/admins/customers'} className="bg-gradient-to-br from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <Diversity1Icon className="text-teal-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-teal-700 text-center">
                Customers
              </p>
            </Link>
            <Link to={"/admin/expenses"} className="bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <CreditScoreIcon className="text-indigo-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-indigo-700 text-center">
                Expenses
              </p>
            </Link>
            <Link className="bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <InsightsIcon className="text-gray-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-gray-700 text-center">
                AI Tools
              </p>
            </Link>
            <Link to={"/admin/reachout"} className="bg-gradient-to-br from-cyan-50 to-cyan-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <ConnectWithoutContactIcon
                className="text-cyan-600"
                fontSize="large"
              />
              <p className="mt-2 text-sm font-semibold text-cyan-700 text-center">
                Reach Out
              </p>
            </Link>
            <Link to={"/admin/deliveries"} className="bg-gradient-to-br from-cyan-50 to-cyan-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <TwoWheelerIcon
                className="text-cyan-600"
                fontSize="large"
              />
              <p className="mt-2 text-sm font-semibold text-cyan-700 text-center">
                Deliveries
              </p>
            </Link>
            <Link className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow aspect-square">
              <SettingsIcon className="text-amber-600" fontSize="large" />
              <p className="mt-2 text-sm font-semibold text-amber-700 text-center">
                Settings
              </p>
            </Link>
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

export default AdminHome
