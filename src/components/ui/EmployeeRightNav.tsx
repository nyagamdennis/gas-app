// @ts-nocheck
import React from 'react'
import ClearIcon from "@mui/icons-material/Clear"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { Link } from "react-router-dom"
import HomeIcon from "@mui/icons-material/Home"
import Person2Icon from "@mui/icons-material/Person2"
import SettingsIcon from "@mui/icons-material/Settings"
import NextPlanIcon from "@mui/icons-material/NextPlan"
import { useAppDispatch } from '../../app/hooks'
import planStatus from '../../features/planStatus/planStatus'
import { logout } from '../../features/auths/authSlice'
import defaultProfile from "../media/default.png"
import defaultTeamImage from "../media/default.png"

const EmployeeRightNav = ({ myProfile, isOpen, onClose }) => {
    const dispatch = useAppDispatch()
     

    const handleLogOut = () => {
        dispatch(logout())
      }

      // console.log('my profile is ', myProfile)
  return (
    <>
          {/* Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={onClose}
            />
          )}
    
          {/* Slide-in Nav */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
              ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <img
                  src={myProfile.profile_image || defaultTeamImage}
                  alt="my profile"
                  className="h-10 w-10 rounded-full"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {myProfile.sales_team?.name || "No team"}
                </h2>
                {/* <p className="text-sm text-gray-500">
                  {isTrial ? "Trial" : subscriptionPlan} Plan({planName})
                </p> */}
                {/* <h2 className="text-lg font-semibold">{businessName}</h2> */}
              </div>
    
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="text-gray-600 hover:text-black"
              >
                <ClearIcon />
              </button>
            </div>
    
            <nav className="p-4 space-y-3">
              <Link
                to="/sales"
                className="flex space-x-2 p-3 rounded-md hover:bg-gray-100 text-gray-800 items-center"
              >
                <HomeIcon fontSize="small" />
                <span>Home</span>
              </Link>
              {/* <Link
                to="/subscribe"
                className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 text-gray-800"
              >
                <NextPlanIcon fontSize="small" />
                <span>Subscription plans</span>
              </Link> */}
    
              <Link
                to="/myprofile"
                className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 text-gray-800"
              >
                <Person2Icon fontSize="small" />
                <span>Profile</span>
              </Link>
    
              {/* <Link
                to="/settings"
                className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 text-gray-800"
              >
                <SettingsIcon fontSize="small" />
                <span>Settings</span>
              </Link> */}
    
              <button
                onClick={handleLogOut}
                className="p-3 text-red-500 hover:text-red-600 transition duration-200 flex items-center space-x-2"
                title="Log out"
              >
                <PowerSettingsNewIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
  )
}

export default EmployeeRightNav