import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import BadgeIcon from "@mui/icons-material/Badge"
import AdminsFooter from "../../components/AdminsFooter"
import PaymentIcon from "@mui/icons-material/Payment"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import EventNoteIcon from "@mui/icons-material/EventNote"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AssignmentIcon from "@mui/icons-material/Assignment"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import FolderSharedIcon from "@mui/icons-material/FolderShared"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import SchoolIcon from "@mui/icons-material/School"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import ReportProblemIcon from "@mui/icons-material/ReportProblem"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import {
  fetchEmployeeStatistics,
  selectEmployeeStatistics,
} from "../../features/employees/employeesSlice"

const HrDirection = () => {
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

  const staticsEmployees = useAppSelector(selectEmployeeStatistics)

  useEffect(() => {
    dispatch(fetchEmployeeStatistics())
    // Dispatch any actions if needed
  }, [dispatch])

  console.log("Employee Statistics:", staticsEmployees)

  const hrMenuItems = [
    {
      to: "/admins/employees",
      icon: BadgeIcon,
      label: "Employees",
      description: "Manage employee records",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      to: "/hr/recruitment",
      icon: PersonAddIcon,
      label: "Recruitment",
      description: "Post jobs & hire talent",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      to: "/admins/payroll",
      icon: PaymentIcon,
      label: "Payroll",
      description: "Process salaries & wages",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      to: "/hr/attendance",
      icon: AccessTimeIcon,
      label: "Attendance",
      description: "Track work hours",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    {
      to: "/hr/leave",
      icon: EventNoteIcon,
      label: "Leave Management",
      description: "Manage time off requests",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      to: "/hr/performance",
      icon: TrendingUpIcon,
      label: "Performance",
      description: "Reviews & evaluations",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      to: "/hr/documents",
      icon: FolderSharedIcon,
      label: "Documents",
      description: "Employee files & records",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
    },
    {
      to: "/hr/shifts",
      icon: CalendarTodayIcon,
      label: "Shift Scheduling",
      description: "Plan work schedules",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      to: "/hr/training",
      icon: SchoolIcon,
      label: "Training",
      description: "Learning & development",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
    },
    {
      to: "/hr/benefits",
      icon: LocalHospitalIcon,
      label: "Benefits",
      description: "Manage employee benefits",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
    },
    {
      to: "/hr/complaints",
      icon: ReportProblemIcon,
      label: "Complaints",
      description: "Handle grievances",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
    },
    {
      to: "/hr/recognition",
      icon: EmojiEventsIcon,
      label: "Recognition",
      description: "Rewards & awards",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
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
              Human Resources 👥
            </h1>
            <p className="text-sm text-gray-600">
              Manage your workforce efficiently
            </p>
          </div>

          <main className="flex-grow m-2 p-1">
            <div className="grid grid-cols-2 gap-3">
              {hrMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.to)}
                  className={`${item.bgColor} relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 aspect-square active:scale-95`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 hover:opacity-10 transition-opacity duration-200`}
                  ></div>
                  <item.icon
                    className={`${item.textColor} z-10`}
                    sx={{ fontSize: 40 }}
                  />
                  <p
                    className={`mt-2 text-sm font-semibold ${item.textColor} text-center z-10`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 text-center z-10 mt-1">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600 font-medium">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {staticsEmployees?.total_employees || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-gray-600 font-medium">
                    Present Today
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {staticsEmployees?.present}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-xs text-gray-600 font-medium">On Leave</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {staticsEmployees?.on_leave}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-xs text-gray-600 font-medium">
                    Pending Reviews
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {staticsEmployees?.pending_leave_reviews}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/hr/recruitment")}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <PersonAddIcon className="mr-3" />
                    <span className="font-semibold">Add New Employee</span>
                  </div>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate("/hr/attendance")}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <AccessTimeIcon className="mr-3" />
                    <span className="font-semibold">Mark Attendance</span>
                  </div>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate("/admins/payroll")}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <PaymentIcon className="mr-3" />
                    <span className="font-semibold">Process Payroll</span>
                  </div>
                  <span>→</span>
                </button>
              </div>
            </div>
          </main>

          <footer className="mt-4">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />

          {/* Welcome Section */}
          <div className="mx-6 mt-6 mb-4 p-6 bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Human Resources Management 👥
                </h1>
                <p className="text-gray-600">
                  Comprehensive HR solutions for{" "}
                  {businessName || "your business"}
                </p>
              </div>
            </div>
          </div>

          <main className="flex-grow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hrMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.to)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col overflow-hidden hover:scale-105"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div
                  className={`relative z-10 w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}
                >
                  <item.icon className="text-white" sx={{ fontSize: 28 }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="relative z-10 mt-4 flex items-center text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">
                  <span>Access</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </button>
            ))}
          </main>

          <footer>
            <AdminsFooter />
          </footer>
        </div>
      )}
    </div>
  )
}

export default HrDirection
