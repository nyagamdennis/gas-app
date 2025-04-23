// @ts-nocheck
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchMyProfile, selectMyProfile } from "../features/employees/myProfileSlice"
import defaultProfile from "../components/media/default.png"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { logout } from "../features/auths/authSlice"
import AdminsFooter from "../components/AdminsFooter"

const SalesRecordPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(selectMyProfile)

  useEffect(() => {
    dispatch(fetchMyProfile())
  }, [dispatch])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">{myProfile?.sales_team?.name || "Sales Team"}</h1>
          <p className="text-sm text-gray-500 mt-1">Quick access to your sales functions</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/myprofile" className="flex items-center gap-2">
            <img
              src={myProfile?.profile_image || defaultProfile}
              alt="Profile"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <div>
              <p className="text-sm font-medium">{myProfile?.first_name} {myProfile?.last_name}</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </Link>
          <button
            onClick={handleLogOut}
            className="text-red-500 hover:text-red-600 transition"
            title="Log out"
          >
            <PowerSettingsNewIcon fontSize="large" />
          </button>
        </div>
      </header>

      {/* Main Menu */}
      <main className="flex-grow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(({ to, title, subtitle, color }, idx) => (
          <Link
            key={idx}
            to={to}
            className={`rounded-2xl shadow-xl bg-white hover:bg-${color}-50 border border-${color}-300 text-${color}-600 transition duration-300 ease-in-out p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02]`}
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <AdminsFooter />
    </div>
  )
}

export default SalesRecordPage
