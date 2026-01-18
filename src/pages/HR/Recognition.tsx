// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Recognition = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { businessName, businessId } = planStatus()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Sample data - replace with real data from API
  const [recognitions, setRecognitions] = useState([
    {
      id: 1,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      type: "Employee of the Month",
      category: "Performance",
      status: "Awarded",
      date: "2024-01-15",
      points: 500,
      reward: "Cash Bonus + Certificate",
      description:
        "Outstanding sales performance and customer service in December",
      awardedBy: "Store Manager",
      photo: "🏆",
      featured: true,
    },
    {
      id: 2,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      type: "Safety Star",
      category: "Safety",
      status: "Awarded",
      date: "2024-01-10",
      points: 300,
      reward: "Safety Gear + Certificate",
      description: "Perfect safety record for 6 consecutive months",
      awardedBy: "Operations Head",
      photo: "🛡️",
      featured: false,
    },
    {
      id: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      type: "Innovation Award",
      category: "Innovation",
      status: "Awarded",
      date: "2024-01-05",
      points: 400,
      reward: "Tech Gadget + Certificate",
      description: "Implemented new inventory system that reduced waste by 20%",
      awardedBy: "Regional Manager",
      photo: "💡",
      featured: true,
    },
    {
      id: 4,
      employee: "Sarah Williams",
      role: "SECURITY",
      type: "Loyalty Award",
      category: "Loyalty",
      status: "Awarded",
      date: "2024-01-02",
      points: 1000,
      reward: "5-Year Service Pin + Bonus",
      description: "5 years of dedicated service with perfect attendance",
      awardedBy: "HR Manager",
      photo: "🎖️",
      featured: true,
    },
    {
      id: 5,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      type: "Team Player",
      category: "Teamwork",
      status: "Pending",
      date: "2024-01-20",
      points: 200,
      reward: "Team Lunch + Certificate",
      description: "Always helping colleagues and going beyond duties",
      awardedBy: "Team Lead",
      photo: "🤝",
      featured: false,
    },
    {
      id: 6,
      employee: "Lisa Chen",
      role: "SALES_PERSON",
      type: "Customer Service Star",
      category: "Customer Service",
      status: "Awarded",
      date: "2024-01-18",
      points: 350,
      reward: "Gift Voucher + Certificate",
      description: "Consistently receives positive customer feedback",
      awardedBy: "Sales Manager",
      photo: "⭐",
      featured: false,
    },
  ])

  const [rewardsCatalog, setRewardsCatalog] = useState([
    {
      id: 1,
      name: "Employee of the Month",
      points: 500,
      category: "Performance",
      icon: "🏆",
      available: true,
    },
    {
      id: 2,
      name: "Safety Excellence",
      points: 300,
      category: "Safety",
      icon: "🛡️",
      available: true,
    },
    {
      id: 3,
      name: "Innovation Champion",
      points: 400,
      category: "Innovation",
      icon: "💡",
      available: true,
    },
    {
      id: 4,
      name: "5-Year Service",
      points: 1000,
      category: "Loyalty",
      icon: "🎖️",
      available: true,
    },
    {
      id: 5,
      name: "Team Player Award",
      points: 200,
      category: "Teamwork",
      icon: "🤝",
      available: true,
    },
    {
      id: 6,
      name: "Customer Service Star",
      points: 350,
      category: "Customer Service",
      icon: "⭐",
      available: true,
    },
    {
      id: 7,
      name: "Attendance Perfect",
      points: 250,
      category: "Attendance",
      icon: "📅",
      available: true,
    },
    {
      id: 8,
      name: "Sales Champion",
      points: 600,
      category: "Sales",
      icon: "📈",
      available: false,
    },
  ])

  const [employeePoints, setEmployeePoints] = useState([
    {
      id: 1,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      points: 1500,
      level: "Gold",
    },
    {
      id: 2,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      points: 900,
      level: "Silver",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      points: 1200,
      level: "Gold",
    },
    {
      id: 4,
      employee: "Sarah Williams",
      role: "SECURITY",
      points: 2000,
      level: "Platinum",
    },
    {
      id: 5,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      points: 600,
      level: "Bronze",
    },
    {
      id: 6,
      employee: "Lisa Chen",
      role: "SALES_PERSON",
      points: 750,
      level: "Silver",
    },
  ])

  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewAward, setShowNewAward] = useState(false)
  const [showAwardDetails, setShowAwardDetails] = useState(false)
  const [selectedAward, setSelectedAward] = useState(null)
  const [newAward, setNewAward] = useState({
    employee: "",
    type: "",
    category: "",
    points: "",
    reward: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const awardCategories = [
    {
      value: "Performance",
      label: "Performance",
      icon: "🏆",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Safety",
      label: "Safety",
      icon: "🛡️",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "Innovation",
      label: "Innovation",
      icon: "💡",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Loyalty",
      label: "Loyalty",
      icon: "🎖️",
      color: "bg-purple-100 text-purple-700",
    },
    {
      value: "Teamwork",
      label: "Teamwork",
      icon: "🤝",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      value: "Customer Service",
      label: "Customer Service",
      icon: "⭐",
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "Attendance",
      label: "Attendance",
      icon: "📅",
      color: "bg-teal-100 text-teal-700",
    },
    {
      value: "Sales",
      label: "Sales",
      icon: "📈",
      color: "bg-red-100 text-red-700",
    },
  ]

  const statusOptions = [
    {
      value: "Awarded",
      label: "Awarded",
      icon: "✅",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "Pending",
      label: "Pending",
      icon: "⏳",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Planned",
      label: "Planned",
      icon: "📅",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      icon: "❌",
      color: "bg-red-100 text-red-700",
    },
  ]

  const levelOptions = [
    {
      value: "Bronze",
      label: "Bronze",
      icon: "🥉",
      color: "bg-amber-100 text-amber-700",
      min: 0,
      max: 500,
    },
    {
      value: "Silver",
      label: "Silver",
      icon: "🥈",
      color: "bg-gray-100 text-gray-700",
      min: 501,
      max: 1000,
    },
    {
      value: "Gold",
      label: "Gold",
      icon: "🥇",
      color: "bg-yellow-100 text-yellow-700",
      min: 1001,
      max: 1500,
    },
    {
      value: "Platinum",
      label: "Platinum",
      icon: "💎",
      color: "bg-blue-100 text-blue-700",
      min: 1501,
      max: 9999,
    },
  ]

  const filteredRecognitions = recognitions.filter((recognition) => {
    const matchesCategory =
      filterCategory === "" || recognition.category === filterCategory
    const matchesStatus =
      filterStatus === "" || recognition.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      recognition.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recognition.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recognition.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recognition.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesStatus && matchesSearch
  })

  const getLevel = (points) => {
    return (
      levelOptions.find(
        (level) => points >= level.min && points <= level.max,
      ) || levelOptions[0]
    )
  }

  const handleAward = (awardId) => {
    setRecognitions((prev) =>
      prev.map((rec) =>
        rec.id === awardId ? { ...rec, status: "Awarded" } : rec,
      ),
    )
    toast.success("Award confirmed and points added!")
  }

  const handleCancel = (awardId) => {
    setRecognitions((prev) =>
      prev.map((rec) =>
        rec.id === awardId ? { ...rec, status: "Cancelled" } : rec,
      ),
    )
    toast.info("Award cancelled")
  }

  const handleViewDetails = (award) => {
    setSelectedAward(award)
    setShowAwardDetails(true)
  }

  const handleSubmitAward = () => {
    const newId = recognitions.length + 1
    const category = awardCategories.find(
      (cat) => cat.value === newAward.category,
    )

    setRecognitions((prev) => [
      {
        id: newId,
        employee: newAward.employee,
        role: "SHOP_ATTENDANT",
        type: newAward.type,
        category: newAward.category,
        status: "Pending",
        date: newAward.date,
        points: parseInt(newAward.points) || 0,
        reward: newAward.reward,
        description: newAward.description,
        awardedBy: "Manager",
        photo: category?.icon || "🏆",
        featured: false,
      },
      ...prev,
    ])

    toast.success("New award created successfully!")
    setShowNewAward(false)
    setNewAward({
      employee: "",
      type: "",
      category: "",
      points: "",
      reward: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleExport = () => {
    toast.info("Recognition report exported successfully!")
  }

  const handleRedeem = (rewardId) => {
    toast.success("Reward redeemed successfully!")
  }

  // Calculate statistics
  const totalAwards = recognitions.filter((r) => r.status === "Awarded").length
  const pendingAwards = recognitions.filter(
    (r) => r.status === "Pending",
  ).length
  const totalPoints = employeePoints.reduce((sum, emp) => sum + emp.points, 0)
  const averagePoints = Math.round(totalPoints / employeePoints.length)
  const featuredAwards = recognitions.filter((r) => r.featured).length

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
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">🏆</span>
                  Recognition & Rewards
                </h1>
                <p className="text-yellow-100 text-sm">
                  Celebrate and reward employee achievements
                </p>
              </div>
              <button
                onClick={() => setShowNewAward(true)}
                className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition shadow-md"
              >
                🏅 New Award
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Awards</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {totalAwards}
                  </div>
                </div>
                <span className="text-2xl">🏆</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Points</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalPoints}
                  </div>
                </div>
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Pending Awards
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {pendingAwards}
                  </div>
                </div>
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Avg Points</div>
                  <div className="text-2xl font-bold text-green-600">
                    {averagePoints}
                  </div>
                </div>
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          {/* Employee Leaderboard */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Points Leaderboard
            </h2>
            <div className="space-y-3">
              {employeePoints
                .sort((a, b) => b.points - a.points)
                .slice(0, 3)
                .map((emp, index) => {
                  const level = getLevel(emp.points)
                  return (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-amber-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {emp.employee}
                          </h3>
                          <p className="text-sm text-gray-600">{emp.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${level.color}`}
                        >
                          {level.icon} {emp.points} pts
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
            <button
              onClick={() => navigate("/hr/recognition/leaderboard")}
              className="w-full mt-4 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
            >
              View Full Leaderboard →
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search awards or employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                >
                  <option value="">All Categories</option>
                  {awardCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center justify-center gap-2"
              >
                📥 Export Report
              </button>
            </div>
          </div>

          {/* Featured Awards */}
          {featuredAwards > 0 && (
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <span className="mr-2">🌟</span>
                Featured Awards
              </h2>
              <div className="space-y-3">
                {recognitions
                  .filter((r) => r.featured)
                  .slice(0, 2)
                  .map((award) => {
                    const category = awardCategories.find(
                      (cat) => cat.value === award.category,
                    )
                    return (
                      <div
                        key={award.id}
                        className="bg-white bg-opacity-20 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{award.photo}</div>
                          <div>
                            <h3 className="font-bold">{award.employee}</h3>
                            <p className="text-yellow-100 text-sm">
                              {award.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Awards List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Awards & Recognitions ({filteredRecognitions.length})
              </h2>
              <span className="text-sm text-gray-500">This Year</span>
            </div>

            {filteredRecognitions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">🏆</div>
                <p className="text-gray-500 text-lg mb-2">No awards found</p>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your filters or create a new award
                </p>
                <button
                  onClick={() => setShowNewAward(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition"
                >
                  🏅 Create Award
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecognitions.map((award) => {
                  const status = statusOptions.find(
                    (s) => s.value === award.status,
                  )
                  const category = awardCategories.find(
                    (cat) => cat.value === award.category,
                  )
                  return (
                    <div
                      key={award.id}
                      className={`border-2 rounded-lg p-4 hover:shadow-md transition ${
                        award.status === "Awarded"
                          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                          : award.status === "Pending"
                          ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                          : award.status === "Planned"
                          ? "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50"
                          : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-3xl">{award.photo}</div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {award.employee}
                              </h3>
                              <p className="text-sm text-gray-600">
                                🏢 {award.role}
                              </p>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <p className="font-bold text-lg">{award.type}</p>
                            <p className="truncate">📝 {award.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                status?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {status?.icon} {award.status}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                category?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {category?.icon} {award.category}
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              ⭐ {award.points} pts
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              🎁 {award.reward}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(award)}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                        >
                          👁️ View
                        </button>
                        {award.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleAward(award.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                            >
                              ✅ Award
                            </button>
                            <button
                              onClick={() => handleCancel(award.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                            >
                              ❌ Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Rewards Catalog */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎁</span>
              Rewards Catalog
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {rewardsCatalog.slice(0, 4).map((reward) => (
                <div
                  key={reward.id}
                  className="border-2 border-gray-200 rounded-lg p-3 hover:border-yellow-500 transition"
                >
                  <div className="text-2xl mb-2">{reward.icon}</div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {reward.name}
                  </h3>
                  <p className="text-xs text-gray-600">{reward.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-yellow-600 font-bold">
                      ⭐ {reward.points}
                    </span>
                    {reward.available ? (
                      <button
                        onClick={() => handleRedeem(reward.id)}
                        className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      >
                        Redeem
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500">Coming Soon</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/hr/recognition/rewards")}
              className="w-full mt-4 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
            >
              View All Rewards →
            </button>
          </div>
        </main>

        {/* New Award Modal */}
        {showNewAward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">🏅</span>
                  Create New Award
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Employee
                    </label>
                    <select
                      value={newAward.employee}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          employee: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    >
                      <option value="">Select Employee</option>
                      <option value="John Doe">
                        John Doe (Shop Attendant)
                      </option>
                      <option value="Jane Smith">
                        Jane Smith (Delivery Person)
                      </option>
                      <option value="Mike Johnson">
                        Mike Johnson (Store Manager)
                      </option>
                      <option value="Sarah Williams">
                        Sarah Williams (Security)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Award Type
                    </label>
                    <select
                      value={newAward.type}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    >
                      <option value="">Select Award Type</option>
                      {rewardsCatalog.map((reward) => (
                        <option key={reward.id} value={reward.name}>
                          {reward.icon} {reward.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newAward.category}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    >
                      <option value="">Select Category</option>
                      {awardCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        value={newAward.points}
                        onChange={(e) =>
                          setNewAward((prev) => ({
                            ...prev,
                            points: e.target.value,
                          }))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                        placeholder="e.g., 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Award Date
                      </label>
                      <input
                        type="date"
                        value={newAward.date}
                        onChange={(e) =>
                          setNewAward((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reward Description
                    </label>
                    <input
                      type="text"
                      value={newAward.reward}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          reward: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                      placeholder="e.g., Cash Bonus + Certificate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Achievement Description
                    </label>
                    <textarea
                      value={newAward.description}
                      onChange={(e) =>
                        setNewAward((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                      rows="3"
                      placeholder="Describe the achievement or reason for this award..."
                    ></textarea>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Awards
                      automatically add points to the employee's total. These
                      points can be redeemed for rewards from the catalog.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewAward(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAward}
                    disabled={
                      !newAward.employee ||
                      !newAward.type ||
                      !newAward.description
                    }
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      !newAward.employee ||
                      !newAward.type ||
                      !newAward.description
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    Create Award
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Award Details Modal */}
        {showAwardDetails && selectedAward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{selectedAward.photo}</div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedAward.employee}
                    </h2>
                    <p className="text-yellow-100">🏢 {selectedAward.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Award Type</p>
                    <p className="font-bold text-2xl text-gray-800">
                      {selectedAward.type}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Category</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {
                          awardCategories.find(
                            (c) => c.value === selectedAward.category,
                          )?.icon
                        }
                      </span>
                      <p className="font-bold text-gray-800">
                        {selectedAward.category}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">
                        Points Awarded
                      </p>
                      <p className="font-bold text-2xl text-yellow-600">
                        ⭐ {selectedAward.points}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Award Date</p>
                      <p className="font-bold text-gray-800">
                        📅 {selectedAward.date}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        statusOptions.find(
                          (s) => s.value === selectedAward.status,
                        )?.color || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {
                        statusOptions.find(
                          (s) => s.value === selectedAward.status,
                        )?.icon
                      }{" "}
                      {selectedAward.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Reward</p>
                    <p className="font-semibold text-gray-800">
                      🎁 {selectedAward.reward}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Description</p>
                    <p className="font-semibold text-gray-800">
                      📝 {selectedAward.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Awarded By</p>
                    <p className="font-semibold text-gray-800">
                      👤 {selectedAward.awardedBy}
                    </p>
                  </div>

                  {selectedAward.featured && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Featured</p>
                      <p className="font-semibold text-gray-800">
                        🌟 This award is featured on the recognition wall
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Make Featured</p>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Feature this award on the main page
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAwardDetails(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                  {selectedAward.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAward(selectedAward.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                      >
                        Confirm Award
                      </button>
                      <button
                        onClick={() => handleCancel(selectedAward.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
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
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">🏆</span>
                Recognition & Rewards Program
              </h1>
              <p className="text-yellow-100">
                Celebrate excellence and reward outstanding performance at{" "}
                {businessName}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/hr/recognition/wall")}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition shadow-lg"
              >
                🎨 Recognition Wall
              </button>
              <button
                onClick={() => setShowNewAward(true)}
                className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition shadow-lg"
              >
                🏅 Create New Award
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Awards Given",
              value: totalAwards,
              icon: "🏆",
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              trend: "+5",
            },
            {
              label: "Total Points Awarded",
              value: totalPoints,
              icon: "⭐",
              color: "text-blue-600",
              bg: "bg-blue-50",
              trend: "+1200",
            },
            {
              label: "Average Employee Points",
              value: averagePoints,
              icon: "📊",
              color: "text-green-600",
              bg: "bg-green-50",
              trend: "+45",
            },
            {
              label: "Featured Awards",
              value: featuredAwards,
              icon: "🌟",
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: "+2",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} rounded-xl shadow-lg p-6 hover:shadow-xl transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <span className="text-sm text-gray-500">{stat.trend}</span>
                  </div>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Left Column - Leaderboard */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📊</span>
                Employee Points Leaderboard
              </h2>
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
                        Role
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Points
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Level
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeePoints
                      .sort((a, b) => b.points - a.points)
                      .map((emp, index) => {
                        const level = getLevel(emp.points)
                        return (
                          <tr
                            key={emp.id}
                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="p-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                    ? "bg-amber-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                                  {emp.employee.charAt(0)}
                                </div>
                                <span className="font-semibold">
                                  {emp.employee}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-gray-600">{emp.role}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-gray-800">
                                ⭐ {emp.points}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}
                              >
                                {level.icon} {level.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() =>
                                  navigate(`/hr/recognition/employee/${emp.id}`)
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Rewards */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setFilterStatus("Pending")}
                  className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-3 rounded-lg font-semibold transition flex items-center gap-3"
                >
                  <span className="text-xl">⏳</span>
                  <span>Review Pending Awards</span>
                </button>
                <button
                  onClick={() => navigate("/hr/recognition/rewards")}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg font-semibold transition flex items-center gap-3"
                >
                  <span className="text-xl">🎁</span>
                  <span>View Rewards Catalog</span>
                </button>
                <button
                  onClick={handleExport}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 p-3 rounded-lg font-semibold transition flex items-center gap-3"
                >
                  <span className="text-xl">📥</span>
                  <span>Export Reports</span>
                </button>
                <button
                  onClick={() => navigate("/hr/recognition/settings")}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg font-semibold transition flex items-center gap-3"
                >
                  <span className="text-xl">⚙️</span>
                  <span>Program Settings</span>
                </button>
              </div>
            </div>

            {/* Top Rewards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Popular Rewards
              </h2>
              <div className="space-y-3">
                {rewardsCatalog.slice(0, 3).map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-yellow-500 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{reward.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {reward.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {reward.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-600 font-bold">
                        ⭐ {reward.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="🔍 Search awards, employees, or achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
            >
              <option value="">All Categories</option>
              {awardCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => toast.info("Bulk award creation coming soon!")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center gap-2"
            >
              📦 Bulk Awards
            </button>
            <button
              onClick={() => navigate("/hr/recognition/calendar")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2"
            >
              📅 Award Calendar
            </button>
          </div>
        </div>

        {/* Awards List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Awards & Recognitions ({filteredRecognitions.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Showing awards from current year
              </span>
            </div>
          </div>

          {filteredRecognitions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-20">🏆</div>
              <h3 className="text-2xl text-gray-500 mb-4">No awards found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                No awards match your filters. Try adjusting your search criteria
                or create a new award.
              </p>
              <button
                onClick={() => setShowNewAward(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition text-lg"
              >
                🏅 Create New Award
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {filteredRecognitions.map((award) => {
                const status = statusOptions.find(
                  (s) => s.value === award.status,
                )
                const category = awardCategories.find(
                  (cat) => cat.value === award.category,
                )
                return (
                  <div
                    key={award.id}
                    className={`border-2 rounded-xl p-6 hover:shadow-xl transition ${
                      award.status === "Awarded"
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                        : award.status === "Pending"
                        ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                        : award.status === "Planned"
                        ? "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{award.photo}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {award.employee}
                          </h3>
                          <p className="text-gray-600">🏢 {award.role}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          status?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status?.icon} {award.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">
                        {award.type}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        📝 {award.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          category?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {category?.icon} {award.category}
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                        ⭐ {award.points} pts
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                        🎁 {award.reward}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(award)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        View Details
                      </button>
                      {award.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleAward(award.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                            title="Award"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => handleCancel(award.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                            title="Cancel"
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals (same as mobile but larger for desktop) */}
      {showNewAward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-8">
              <h2 className="text-3xl font-bold flex items-center">
                <span className="mr-3">🏅</span>
                Create New Award
              </h2>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {/* ... same content as mobile modal but with larger spacing ... */}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowNewAward(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAward}
                  disabled={
                    !newAward.employee ||
                    !newAward.type ||
                    !newAward.description
                  }
                  className={`flex-1 py-4 rounded-lg font-semibold transition text-lg ${
                    !newAward.employee ||
                    !newAward.type ||
                    !newAward.description
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  Create Award
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

export default Recognition
