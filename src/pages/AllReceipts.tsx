import React from 'react'
import { useMediaQuery, useTheme } from "@mui/material"
import AdminsFooter from '../components/AdminsFooter'
import Navbar from '../components/ui/mobile/admin/Navbar'

const AllReceipts = () => {
    const theme = useTheme()
    const matches = useMediaQuery("(min-width:600px)")
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    
  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
          
          </main>
          <footer className="text-white">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default AllReceipts