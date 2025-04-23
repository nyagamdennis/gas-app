// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchCustomers,
  getCustomerError,
  getCustomersStatus,
  selectAllCustomers,
} from "../features/customers/customerSlice"
import { fetchLocations } from "../features/location/locationSlice"
import { fetchProducts } from "../features/product/productSlice"
import { fetchSales } from "../features/sales/salesSlice"
import CustomerExcerpt from "../features/customers/CustomerExcerpt"
import AdminsFooter from "../components/AdminsFooter"

const AdminCustomer = () => {
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectAllCustomers)
  const customerStatus = useAppSelector(getCustomersStatus)
  const customerError = useAppSelector(getCustomerError)

  const [activeTab, setActiveTab] = useState("retail")
  const [search, setSearch] = useState("")

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchLocations())
    dispatch(fetchProducts())
    dispatch(fetchSales())
  }, [dispatch])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c?.phone?.toString().includes(search)
  )

  const retailCustomers = filtered.filter((c) => c.sales === "RETAIL")
  const wholesaleCustomers = filtered.filter((c) => c.sales === "WHOLESALE")
  const debtors = filtered.filter(
    (c) => c.customer_debt?.some((debt) => !debt.cleared)
  )

  const getActiveCustomers = () => {
    switch (activeTab) {
      case "retail":
        return retailCustomers
      case "wholesale":
        return wholesaleCustomers
      case "debtors":
        return debtors
      default:
        return []
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <div className="px-4 pt-6">
        <h1 className="text-3xl font-bold text-center">Manage Customers</h1>
        <p className="text-sm text-center text-gray-500 mb-4">
          Easily manage retail, wholesale, and debtor records
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-4 gap-2">
          {["retail", "wholesale", "debtors"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab === "retail" && "Retail"}
              {tab === "wholesale" && "Wholesale"}
              {tab === "debtors" && "Debtors"}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Content */}
      <main className="flex-grow px-4 pb-20">
        {customerStatus === "loading" ? (
          <p className="text-center text-gray-500">Loading customers...</p>
        ) : customerError ? (
          <p className="text-center text-red-500">Error: {customerError}</p>
        ) : (
          <div className="space-y-3">
            {getActiveCustomers().map((customer) => (
              <CustomerExcerpt
                key={customer.id}
                customerId={customer.id}
                customer={customer}
              />
            ))}
            {getActiveCustomers().length === 0 && (
              <p className="text-center text-gray-400 italic">
                No customers found for this tab.
              </p>
            )}
          </div>
        )}
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AdminCustomer
