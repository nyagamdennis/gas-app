// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import MenuIcon from "@mui/icons-material/Menu"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import RightNav from '../../../RightNav'

const notifications = [
  { id: 1, message: "New order received", time: "2 mins ago" },
  { id: 2, message: "Delivery assigned", time: "10 mins ago" },
  { id: 3, message: "Inventory low warning", time: "1 hour ago" },
]

const Navbar = ({ headerMessage, headerText }) => {
    const [navOpen, setNavOpen] = useState(false)
      const [showDropdown, setShowDropdown] = useState(false)
      const dropdownRef = useRef(null)
    
      useEffect(() => {
        function handleClickOutside(event) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false)
          }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
      }, [])

  return (
    <div className="relative">
          <header className="bg-gradient-to-r from-blue-500 to-blue-700 backdrop-blur-md shadow-md border-b border-gray-200 px-.5 py-4 flex items-center justify-between">
            
            {/* LEFT SIDE: Menu + Header */}
            <div className="flex items-center ">
              <button
                onClick={() => setNavOpen(true)}
                className="p-2 text-gray-700 hover:text-black focus:outline-none"
                aria-label="Open menu"
              >
                <MenuIcon className='text-white' />
              </button>
              <div>
                <h1 className="text-white text-2xl font-extrabold tracking-tight">
                  {headerMessage}
                </h1>
                {/* <p className="text-sm text-gray-500">{headerText}</p> */}
              </div>
            </div>
    
            {/* RIGHT SIDE: Notifications + More */}
            <div className="flex items-center  relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-700 hover:text-black focus:outline-none"
                aria-label="Notifications"
              >
                <NotificationsNoneIcon className='text-white' fontSize="medium" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
    
              {showDropdown && (
                <div className="absolute right-0 top-12 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                  <div className="p-4 border-b font-semibold text-gray-700">
                    Notifications
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <li
                          key={note.id}
                          className="px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          <div className="text-gray-800">{note.message}</div>
                          <div className="text-gray-400 text-xs">{note.time}</div>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">
                        No new notifications
                      </li>
                    )}
                  </ul>
                </div>
              )}
    
              <button
                className="p-1 text-gray-700 hover:text-black focus:outline-none"
                aria-label="More options"
              >
                <MoreVertIcon className='text-white' />
              </button>
            </div>
          </header>
    
          {/* RightNav Drawer */}
          <RightNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
        </div>
  )
}

export default Navbar