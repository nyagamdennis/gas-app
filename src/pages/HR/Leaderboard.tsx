// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Leaderboard = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { businessName, businessId } = planStatus()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Sample data - replace with real data from API
  const [leaderboard, setLeaderboard] = useState([
    {
      id: 1,
      rank: 1,
      employee: "Sarah Williams",
      role: "SECURITY",
      points: 2150,
      level: "Platinum",
      performance: 98,
      attendance: 100,
      awards: 8,
      trend: "up",
      change: "+150",
    },
    {
      id: 2,
      rank: 2,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      points: 1825,
      level: "Gold",
      performance: 95,
      attendance: 98,
      awards: 6,
      trend: "up",
      change: "+125",
    },
    {
      id: 3,
      rank: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      points: 1650,
      level: "Gold",
      performance: 92,
      attendance: 96,
      awards: 5,
      trend: "up",
      change: "+200",
    },
    {
      id: 4,
      rank: 4,
      employee: "Lisa Chen",
      role: "SALES_PERSON",
      points: 1325,
      level: "Silver",
      performance: 89,
      attendance: 94,
      awards: 4,
      trend: "up",
      change: "+75",
    },
    {
      id: 5,
      rank: 5,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      points: 1150,
      level: "Silver",
      performance: 87,
      attendance: 92,
      awards: 3,
      trend: "down",
      change: "-50",
    },
    {
      id: 6,
      rank: 6,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      points: 850,
      level: "Bronze",
      performance: 82,
      attendance: 88,
      awards: 2,
      trend: "up",
      change: "+100",
    },
    {
      id: 7,
      rank: 7,
      employee: "Robert Wilson",
      role: "CONDUCTOR",
      points: 625,
      level: "Bronze",
      performance: 78,
      attendance: 85,
      awards: 1,
      trend: "up",
      change: "+25",
    },
    {
      id: 8,
      rank: 8,
      employee: "Emma Davis",
      role: "SALES_PERSON",
      points: 450,
      level: "Bronze",
      performance: 75,
      attendance: 82,
      awards: 1,
      trend: "steady",
      change: "0",
    },
  ])

  const [timeframe, setTimeframe] = useState("monthly") // monthly, quarterly, yearly, alltime
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterLevel, setFilterLevel] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)

  const departments = [
    { value: "Sales", label: "Sales", icon: "📈" },
    { value: "Operations", label: "Operations", icon: "🏭" },
    { value: "Security", label: "Security", icon: "🛡️" },
    { value: "Delivery", label: "Delivery", icon: "🚚" },
    { value: "Store", label: "Store", icon: "🏪" },
    { value: "All", label: "All Departments", icon: "👥" },
  ]

  const levelOptions = [
    {
      value: "Platinum",
      label: "Platinum",
      icon: "💎",
      color: "bg-blue-100 text-blue-700",
      min: 1501,
    },
    {
      value: "Gold",
      label: "Gold",
      icon: "🥇",
      color: "bg-yellow-100 text-yellow-700",
      min: 1001,
    },
    {
      value: "Silver",
      label: "Silver",
      icon: "🥈",
      color: "bg-gray-100 text-gray-700",
      min: 501,
    },
    {
      value: "Bronze",
      label: "Bronze",
      icon: "🥉",
      color: "bg-amber-100 text-amber-700",
      min: 0,
    },
  ]

  const timeframeOptions = [
    { value: "weekly", label: "This Week", icon: "📅" },
    { value: "monthly", label: "This Month", icon: "📆" },
    { value: "quarterly", label: "This Quarter", icon: "📊" },
    { value: "yearly", label: "This Year", icon: "🎯" },
    { value: "alltime", label: "All Time", icon: "⭐" },
  ]

  const filteredLeaderboard = leaderboard.filter((employee) => {
    const matchesDepartment =
      filterDepartment === "" ||
      filterDepartment === "All" ||
      employee.role.includes(filterDepartment) ||
      departments.find(
        (dept) =>
          dept.label === filterDepartment &&
          employee.role.includes(dept.label.split(" ")[0]),
      )

    const matchesLevel = filterLevel === "" || employee.level === filterLevel
    const matchesSearch =
      searchQuery === "" ||
      employee.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesDepartment && matchesLevel && matchesSearch
  })

  const getLevelInfo = (points) => {
    return levelOptions.find((level) => points >= level.min) || levelOptions[3]
  }

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeDetails(true)
  }

  const handleExport = () => {
    toast.success("Leaderboard exported successfully!")
  }

  const handleShare = () => {
    toast.info("Leaderboard shared with employees!")
  }

  // Calculate statistics
  const totalEmployees = leaderboard.length
  const totalPoints = leaderboard.reduce((sum, emp) => sum + emp.points, 0)
  const averagePoints = Math.round(totalPoints / totalEmployees)
  const topPerformer = leaderboard[0]
  const mostImproved =
    leaderboard.find((emp) => emp.change === "+200") || leaderboard[2]
  const platinumCount = leaderboard.filter(
    (emp) => emp.level === "Platinum",
  ).length
  const goldCount = leaderboard.filter((emp) => emp.level === "Gold").length

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
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">🏆</span>
                  Employee Leaderboard
                </h1>
                <p className="text-purple-100 text-sm">
                  Track performance and recognize top performers
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="bg-white text-purple-600 px-3 py-2 rounded-lg font-semibold hover:bg-purple-50 transition shadow-md text-sm"
                >
                  📥 Export
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white text-purple-600 px-3 py-2 rounded-lg font-semibold hover:bg-purple-50 transition shadow-md text-sm"
                >
                  📤 Share
                </button>
              </div>
            </div>
          </div>

          {/* Top Performer Spotlight */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center">
                <span className="mr-2">👑</span>
                Top Performer
              </h2>
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                #{topPerformer?.rank}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {topPerformer?.employee.charAt(0)}
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600 flex items-center justify-center">
                  <span className="text-white text-xs">🥇</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{topPerformer?.employee}</h3>
                <p className="text-yellow-100 text-sm">{topPerformer?.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">⭐ {topPerformer?.points}</span>
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                    {topPerformer?.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total Employees
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {totalEmployees}
                  </div>
                </div>
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg Points</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {averagePoints}
                  </div>
                </div>
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Platinum</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {platinumCount}
                  </div>
                </div>
                <span className="text-2xl">💎</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Gold</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {goldCount}
                  </div>
                </div>
                <span className="text-2xl">🥇</span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Timeframe
            </h3>
            <div className="flex overflow-x-auto pb-2 -mx-2 px-2">
              {timeframeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeframe(option.value)}
                  className={`flex-shrink-0 mx-1 px-4 py-2 rounded-lg font-medium transition ${
                    timeframe === option.value
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.icon} {dept.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  <option value="">All Levels</option>
                  {levelOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.icon} {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center justify-center gap-2"
                >
                  📥 Export
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
                >
                  📤 Share
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Employee Rankings ({filteredLeaderboard.length})
              </h2>
              <span className="text-sm text-gray-500">
                {timeframeOptions.find((t) => t.value === timeframe)?.label}
              </span>
            </div>

            {filteredLeaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">🏆</div>
                <p className="text-gray-500 text-lg mb-2">No employees found</p>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeaderboard.map((employee) => {
                  const level = levelOptions.find(
                    (l) => l.value === employee.level,
                  )
                  return (
                    <div
                      key={employee.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => handleViewDetails(employee)}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left Section - Rank & Info */}
                        <div className="flex items-center gap-3 flex-1">
                          {/* Rank Badge */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              employee.rank === 1
                                ? "bg-yellow-500"
                                : employee.rank === 2
                                ? "bg-gray-400"
                                : employee.rank === 3
                                ? "bg-amber-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            #{employee.rank}
                          </div>

                          {/* Employee Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800">
                                {employee.employee}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  level?.color || "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {level?.icon} {employee.level}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              🏢 {employee.role}
                            </p>

                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <span>⭐</span>
                                <span className="font-bold">
                                  {employee.points}
                                </span>
                              </div>
                              <div
                                className={`flex items-center gap-1 ${
                                  employee.trend === "up"
                                    ? "text-green-600"
                                    : employee.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {employee.trend === "up"
                                  ? "↗️"
                                  : employee.trend === "down"
                                  ? "↘️"
                                  : "➡️"}
                                <span>{employee.change}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>📊</span>
                                <span>{employee.performance}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <button className="text-2xl">👁️</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Level Information */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Level Requirements
            </h3>
            <div className="space-y-2">
              {levelOptions.map((level) => (
                <div
                  key={level.value}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{level.icon}</span>
                    <span className="font-medium">{level.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {level.min}+ points
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Employee Details Modal */}
        {showEmployeeDetails && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedEmployee.employee.charAt(0)}
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
                        selectedEmployee.rank === 1
                          ? "bg-yellow-400"
                          : selectedEmployee.rank === 2
                          ? "bg-gray-400"
                          : selectedEmployee.rank === 3
                          ? "bg-amber-700"
                          : "bg-gray-300"
                      }`}
                    >
                      <span className="text-white text-xs">
                        #{selectedEmployee.rank}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedEmployee.employee}
                    </h2>
                    <p className="text-purple-100">
                      🏢 {selectedEmployee.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Rank & Points</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-3xl text-gray-800">
                          #{selectedEmployee.rank}
                        </p>
                        <p className="text-sm text-gray-600">Global Rank</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-3xl text-yellow-600">
                          ⭐ {selectedEmployee.points}
                        </p>
                        <p className="text-sm text-gray-600">Total Points</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Level</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-2 rounded-full text-lg font-medium ${
                          levelOptions.find(
                            (l) => l.value === selectedEmployee.level,
                          )?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {
                          levelOptions.find(
                            (l) => l.value === selectedEmployee.level,
                          )?.icon
                        }{" "}
                        {selectedEmployee.level}
                      </span>
                      <div
                        className={`flex items-center gap-1 text-lg ${
                          selectedEmployee.trend === "up"
                            ? "text-green-600"
                            : selectedEmployee.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedEmployee.trend === "up"
                          ? "↗️"
                          : selectedEmployee.trend === "down"
                          ? "↘️"
                          : "➡️"}
                        <span className="font-bold">
                          {selectedEmployee.change}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Performance</p>
                      <p className="font-bold text-2xl text-gray-800">
                        📊 {selectedEmployee.performance}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Attendance</p>
                      <p className="font-bold text-2xl text-gray-800">
                        📅 {selectedEmployee.attendance}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Awards Received
                    </p>
                    <p className="font-bold text-2xl text-gray-800">
                      🏆 {selectedEmployee.awards}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Points Progress
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Current: {selectedEmployee.points}</span>
                        <span>
                          Next Level:{" "}
                          {levelOptions.find(
                            (l) => l.value === selectedEmployee.level,
                          )?.min + 1000 || 2000}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (selectedEmployee.points / 2000) * 100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Recent Achievements
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span>✅</span>
                        <span>Employee of the Month (Jan 2024)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>✅</span>
                        <span>Perfect Attendance Award</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>✅</span>
                        <span>Safety Excellence Certificate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEmployeeDetails(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      navigate(
                        `/hr/recognition/award?employee=${selectedEmployee.id}`,
                      )
                      setShowEmployeeDetails(false)
                    }}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    🏅 Give Award
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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">🏆</span>
                Employee Performance Leaderboard
              </h1>
              <p className="text-purple-100">
                Real-time rankings and performance tracking for {businessName}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleExport}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition shadow-lg"
              >
                📥 Export Report
              </button>
              <button
                onClick={handleShare}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition shadow-lg"
              >
                📤 Share Leaderboard
              </button>
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((employee, index) => {
            const level = levelOptions.find((l) => l.value === employee.level)
            return (
              <div
                key={employee.id}
                className={`rounded-2xl shadow-xl p-6 text-white ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : index === 1
                    ? "bg-gradient-to-r from-gray-500 to-gray-600"
                    : "bg-gradient-to-r from-amber-700 to-amber-800"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold">#{employee.rank}</div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20`}
                  >
                    {level?.icon} {employee.level}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {employee.employee.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{employee.employee}</h3>
                    <p className="opacity-90">{employee.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Points</p>
                    <p className="text-2xl font-bold">⭐ {employee.points}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Performance</p>
                    <p className="text-2xl font-bold">
                      {employee.performance}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      employee.trend === "up"
                        ? "text-green-300"
                        : employee.trend === "down"
                        ? "text-red-300"
                        : "text-white"
                    }`}
                  >
                    {employee.trend === "up"
                      ? "↗️"
                      : employee.trend === "down"
                      ? "↘️"
                      : "➡️"}
                    <span>{employee.change} this month</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Employees",
              value: totalEmployees,
              icon: "👥",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "Total Points Awarded",
              value: totalPoints,
              icon: "⭐",
              color: "text-yellow-600",
              bg: "bg-yellow-50",
            },
            {
              label: "Average Performance",
              value: `${Math.round(
                leaderboard.reduce((sum, emp) => sum + emp.performance, 0) /
                  totalEmployees,
              )}%`,
              icon: "📊",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Most Improved",
              value: mostImproved?.employee.split(" ")[0] || "-",
              icon: "🚀",
              color: "text-green-600",
              bg: "bg-green-50",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} rounded-xl shadow-lg p-6 hover:shadow-xl transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Select Timeframe
          </h3>
          <div className="flex gap-4">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeframe(option.value)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex flex-col items-center ${
                  timeframe === option.value
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-xl mb-1">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="🔍 Search employees by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.icon} {dept.label}
                </option>
              ))}
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            >
              <option value="">All Levels</option>
              {levelOptions.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.icon} {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Employee Rankings ({filteredLeaderboard.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {filteredLeaderboard.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-20">🏆</div>
              <h3 className="text-2xl text-gray-500 mb-4">
                No employees found
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                No employees match your filters. Try adjusting your search
                criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Rank
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Employee
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Department
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Points
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Level
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Performance
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Trend
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((employee) => {
                    const level = levelOptions.find(
                      (l) => l.value === employee.level,
                    )
                    return (
                      <tr
                        key={employee.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              employee.rank === 1
                                ? "bg-yellow-500"
                                : employee.rank === 2
                                ? "bg-gray-400"
                                : employee.rank === 3
                                ? "bg-amber-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            #{employee.rank}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                              {employee.employee.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold block">
                                {employee.employee}
                              </span>
                              <span className="text-sm text-gray-600">
                                {employee.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            {departments.find((d) =>
                              d.label.includes(employee.role.split(" ")[0]),
                            )?.icon || "🏢"}{" "}
                            {departments.find((d) =>
                              d.label.includes(employee.role.split(" ")[0]),
                            )?.label || employee.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800">
                            ⭐ {employee.points}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              level?.color || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {level?.icon} {employee.level}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${employee.performance}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">
                              {employee.performance}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div
                            className={`flex items-center gap-1 ${
                              employee.trend === "up"
                                ? "text-green-600"
                                : employee.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {employee.trend === "up"
                              ? "↗️"
                              : employee.trend === "down"
                              ? "↘️"
                              : "➡️"}
                            <span className="font-medium">
                              {employee.change}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(employee)}
                              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/hr/recognition/award?employee=${employee.id}`,
                                )
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-semibold transition"
                              title="Give Award"
                            >
                              🏅
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Level System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Level System & Requirements
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {levelOptions.map((level) => {
              const employeesInLevel = leaderboard.filter(
                (emp) => emp.level === level.value,
              ).length
              const percentage = Math.round(
                (employeesInLevel / totalEmployees) * 100,
              )
              return (
                <div
                  key={level.value}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{level.icon}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}
                    >
                      {level.value}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {level.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Minimum {level.min} points required
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Employees in this level:</span>
                      <span className="font-semibold">
                        {employeesInLevel} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          level.value === "Platinum"
                            ? "bg-blue-500"
                            : level.value === "Gold"
                            ? "bg-yellow-500"
                            : level.value === "Silver"
                            ? "bg-gray-400"
                            : "bg-amber-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    {selectedEmployee.employee.charAt(0)}
                  </div>
                  <div
                    className={`absolute -top-2 -right-2 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center ${
                      selectedEmployee.rank === 1
                        ? "bg-yellow-400"
                        : selectedEmployee.rank === 2
                        ? "bg-gray-400"
                        : selectedEmployee.rank === 3
                        ? "bg-amber-700"
                        : "bg-gray-300"
                    }`}
                  >
                    <span className="text-white font-bold">
                      #{selectedEmployee.rank}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {selectedEmployee.employee}
                  </h2>
                  <p className="text-purple-100 text-lg">
                    🏢 {selectedEmployee.role}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {/* ... same content as mobile modal but with larger spacing ... */}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEmployeeDetails(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigate(
                      `/hr/recognition/award?employee=${selectedEmployee.id}`,
                    )
                    setShowEmployeeDetails(false)
                  }}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
                >
                  🏅 Give Award
                </button>
                <button
                  onClick={() =>
                    navigate(`/admins/employees/${selectedEmployee.id}`)
                  }
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
                >
                  👤 View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default Leaderboard
