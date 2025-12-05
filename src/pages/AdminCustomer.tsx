// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addCustomer,
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
import Navbar from "../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"

const AdminCustomer = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectAllCustomers)
  const customerStatus = useAppSelector(getCustomersStatus)
  const customerError = useAppSelector(getCustomerError)

  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [name, setName] = useState("")
  const [customerType, setCustomerType] = useState("RETAIL")

  const [activeTab, setActiveTab] = useState("retail")
  const [search, setSearch] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchLocations())
    dispatch(fetchProducts())
    dispatch(fetchSales())
  }, [dispatch])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c?.phone?.toString().includes(search),
  )

  const retailCustomers = filtered.filter((c) => c.sales === "RETAIL")
  const wholesaleCustomers = filtered.filter((c) => c.sales === "WHOLESALE")
  const debtors = filtered.filter((c) =>
    c.customer_debt?.some((debt) => !debt.cleared),
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

  const handleAddNewCustomer = async (e: any) => {
    e.preventDefault()
    const formData = {
      name,
      location: { name: location },
      phone,
      sales: customerType,
    }

    try {
      await dispatch(addCustomer(formData)).unwrap()
      toast.success("Customer saved successfully.")
      setName("")
      setPhone("")
      setLocation("")
      setCustomerType("RETAIL")
    } catch (error: any) {
      console.error("Error adding customer: ", error)
      toast.error(error || "Error adding customer.")
    }
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <ToastContainer />
          <main className="flex-grow m-2 p-1">
            <div>
              {/* Tabs */}
              <div className="flex justify-center mb-4 gap-2">
                {["retail", "wholesale", "debtors", "add"].map((tab) => (
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
                    {tab === "add" && "Add"}
                  </button>
                ))}
              </div>
              <div>
                {/* Search */}
                {activeTab !== "add" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Search by name or phone..."
                      className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div>
                {activeTab === "add" ? (
                  // Form for adding new customers
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
                    <form onSubmit={handleAddNewCustomer} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          placeholder="Enter customer name"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          // required
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="Enter customer phone"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          placeholder="Enter customer location"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          // required
                        />
                      </div>
                      {/* Customer Type */}
                      {/* Customer Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Type
                        </label>
                        <div className="flex gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="customerType"
                              value="RETAIL"
                              checked={customerType === "RETAIL"}
                              onChange={(e) => setCustomerType(e.target.value)}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2">Retail</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="customerType"
                              value="WHOLESALE"
                              checked={customerType === "WHOLESALE"}
                              onChange={(e) => setCustomerType(e.target.value)}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2">Wholesale</span>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          // onClick={handleAddNewCustomer()}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                          Add Customer
                        </button>
                      </div>
                    </form>
                  </div>
                ) : customerStatus === "loading" ? (
                  <p className="text-center text-gray-500">
                    Loading customers...
                  </p>
                ) : customerError ? (
                  <p className="text-center text-red-500">
                    Error: {customerError}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getActiveCustomers().map((customer) => (
                      <CustomerExcerpt
                        key={customer.id}
                        customerId={customer.id}
                        customer={customer}
                      />
                    ))}
                    {getActiveCustomers().length === 0 &&
                      activeTab !== "add" && (
                        <p className="text-center text-gray-400 italic">
                          No customers found for this tab.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          </main>
          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>

    // <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
    //   <div className="px-4 pt-6">
    //     <h1 className="text-3xl font-bold text-center">Manage Customers</h1>
    //     <p className="text-sm text-center text-gray-500 mb-4">
    //       Easily manage retail, wholesale, and debtor records
    //     </p>

    //   </div>

    //   <main className="flex-grow px-4 pb-20">

    //   </main>

    //   <footer className="mt-auto">
    //     <AdminsFooter />
    //   </footer>
    // </div>
  )
}

export default AdminCustomer
