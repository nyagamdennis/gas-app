import React from "react"
import EmployeeFooter from "../../components/ui/EmployeeFooter"
import Navbar from "../../components/ui/mobile/employees/Navbar"
import { ToastContainer } from "react-toastify"

const DeliverySales = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar headerMessage="ERP" headerText="My Deliveries" />

      <main className="flex-grow m-2 p-1 pb-20 space-y-4">{/* Header */}</main>

      <EmployeeFooter />
    </div>
  )
}

export default DeliverySales
