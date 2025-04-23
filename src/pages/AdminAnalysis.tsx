import React from "react"
import AdminsFooter from "../components/AdminsFooter"

const AdminAnalysis = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Main Content */}
      <main className="flex-grow px-4 pt-8 pb-20 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600 text-sm mb-6">
          This feature is currently under development. Stay tuned!
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📊 Coming Soon</h2>
          <p className="text-sm text-gray-500">
            You’ll soon be able to explore product performance, customer trends, and store metrics in one place.
          </p>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AdminAnalysis
