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

const AdminHome = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isPro, isTrial, isExpired } = planStatus();

  useEffect(() => {
      dispatch(fetchBusiness())
    }, [dispatch])
    
  


  return (
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
            to: "",
            title: "Other Product Sales",
            subtitle: "Monitor and track sales of additional items.",
            color: "green",
          },
          {
            to: "/admin/sales",
            title: "Sales Insights",
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
  )
}

export default AdminHome
