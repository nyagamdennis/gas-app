import React from 'react'
import AdminsFooter from '../components/AdminsFooter'
import { ToastContainer } from 'react-toastify'
import Navbar from '../components/ui/mobile/admin/Navbar'

const AiPredict = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <ToastContainer />
    
          <main className="flex-grow m-2 p-1 mb-20">
          

         
          </main>
    
         
          
        
          <footer className="fixed bottom-0 left-0 right-0">
            <AdminsFooter />
          </footer>
        </div>
  )
}

export default AiPredict