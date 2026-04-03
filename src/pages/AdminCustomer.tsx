// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchLocations,
  selectAllLocations,
} from "../features/location/locationSlice"
import CustomerExcerpt from "../features/customers/CustomerExcerpt"
import AdminsFooter from "../components/AdminsFooter"
import Navbar from "../components/ui/mobile/admin/Navbar"
import Pagination from "@mui/material/Pagination"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  fetchCustomers,
  getCustomerError,
  getCustomersStatus,
  selectAllCustomers,
  addCustomer,
  customerCount,
} from "../features/customers/customerSlice"
import AddBoxIcon from "@mui/icons-material/AddBox"
import CircularProgress from "@mui/material/CircularProgress"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
} from "@mui/material"
import RealTimeIndicator from "../components/sales/RealTimeIndicator"
import api from "../../utils/api"

const Icons = {
  Search: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Close: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  ArrowUp: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  ),
}

const AdminCustomer = () => {
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectAllCustomers)
  const locations_list = useAppSelector(selectAllLocations)
  const customerStatus = useAppSelector(getCustomersStatus)
  const customerError = useAppSelector(getCustomerError)

  const [phone, setPhone] = useState("")
  const [locationId, setLocationId] = useState("")
  const [name, setName] = useState("")
  const [customerType, setCustomerType] = useState("RETAIL")
  const [search, setSearch] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const customerCounts = useAppSelector(customerCount)

  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  const [customersStatistics, setCustomersStatistics] = useState(null)
  const [statisticsLoading, setStatisticsLoading] = useState(false)
  const [page, setPage] = useState(1)

  // Fetch statistics once on mount
  useEffect(() => {
    const fetchStatistics = async () => {
      setStatisticsLoading(true)
      try {
        const response = await api.get("/customers/statistics/")
        setCustomersStatistics(response.data)
      } catch (error) {
        console.error("Failed to fetch customer statistics:", error)
      } finally {
        setStatisticsLoading(false)
      }
    }
    fetchStatistics()
  }, [])

  // Fetch customers when page or filter changes
  useEffect(() => {
    dispatch(fetchCustomers({ page, type: activeFilter }))
  }, [dispatch, page, activeFilter])

  useEffect(() => {
    dispatch(fetchLocations())
  }, [dispatch])

  useEffect(() => {
    setPage(1)
  }, [activeFilter, search])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Reset frontend pagination when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, search])

  // Static counts from statistics (never change, no loader on tabs)
  const stats = {
    total: customersStatistics?.total_customers ?? 0,
    retail: customersStatistics?.total_retail_customers ?? 0,
    wholesale: customersStatistics?.total_wholesale_customers ?? 0,
    withDebt: customersStatistics?.total_debtors ?? 0,
  }

  const filterCounts = {
    all: customersStatistics?.total_customers ?? 0,
    retail: customersStatistics?.total_retail_customers ?? 0,
    wholesale: customersStatistics?.total_wholesale_customers ?? 0,
    debtors: customersStatistics?.total_debtors ?? 0,
  }

  // Filter customers for display (client‑side)
  const getFilteredCustomers = () => {
    let filtered = customers
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c?.phone?.toString().includes(search),
      )
    }
    switch (activeFilter) {
      case "retail":
        filtered = filtered.filter((c) => c.sales === "RETAIL")
        break
      case "wholesale":
        filtered = filtered.filter((c) => c.sales === "WHOLESALE")
        break
      case "debtors":
        filtered = filtered.filter((c) => c.debt_summary !== null)
        break
      default:
        break
    }
    return filtered
  }

  const allFilteredCustomers = getFilteredCustomers()
  const totalItems = allFilteredCustomers.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedCustomers = allFilteredCustomers.slice(startIndex, endIndex)

  const handleAddNewCustomer = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = {
        name,
        location: locationId,
        phone,
        sales: customerType,
      }
      await dispatch(addCustomer(formData)).unwrap()
      toast.success("Customer added successfully!")
      setName("")
      setPhone("")
      setLocationId("")
      setCustomerType("RETAIL")
      setDialogOpen(false)
    } catch (error) {
      toast.error(error?.message || "Failed to add customer. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 10) setPhone(value)
  }

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const handleFilterClick = (filterType) => setActiveFilter(filterType)

  const refreshCustomers = () => {
    dispatch(fetchCustomers({ page, type: activeFilter }))
  }

  const tabs = [
    {
      type: "all",
      label: "All",
      icon: "👥",
      count: filterCounts.all,
      color: "blue",
    },
    {
      type: "retail",
      label: "Retail",
      icon: "🛒",
      count: filterCounts.retail,
      color: "green",
    },
    {
      type: "wholesale",
      label: "Wholesale",
      icon: "🏭",
      count: filterCounts.wholesale,
      color: "purple",
    },
    {
      type: "debtors",
      label: "Debtors",
      icon: "💰",
      count: filterCounts.debtors,
      color: "yellow",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage customers with style and clarity"}
      />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      <main className="flex-grow m-2 p-1 pb-4">
        {/* Header Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">👥</span>
              Customer Management
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search customers by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <Icons.Close />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Retail</p>
                {statisticsLoading ? (
                  <Skeleton variant="text" width={60} height={32} />
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    {stats.retail}
                  </p>
                )}
              </div>
              <span className="text-3xl">🛒</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wholesale</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.wholesale}
                </p>
              </div>
              <span className="text-3xl">🏭</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Debt</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.withDebt}
                </p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs - ALWAYS VISIBLE, NEVER LOADING */}
        <div className="bg-white p-2 rounded-lg shadow-md mb-4">
          <div className="flex overflow-x-auto scrollbar-hide gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.type}
                onClick={() => handleFilterClick(tab.type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeFilter === tab.type
                    ? `bg-${tab.color}-500 text-white shadow-md`
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    activeFilter === tab.type
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer List Area */}
        <div>
          {/* Loading skeletons for customer containers */}
          {customerStatus === "loading" && (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-md">
                  <Skeleton variant="text" height={28} width="60%" />
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state when no customers exist */}
          {customerStatus === "succeeded" && customers.length === 0 && (
            <div className="text-center p-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 mb-2 text-lg">
                No customers available.
              </p>
              <button
                onClick={() => setDialogOpen(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center gap-2 mx-auto text-sm font-semibold"
              >
                <AddBoxIcon sx={{ fontSize: 20 }} />
                Add New Customer
              </button>
            </div>
          )}

          {/* Actual customer list */}
          {customerStatus === "succeeded" && customers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of{" "}
                  {totalItems}{" "}
                  {activeFilter === "all" ? "customers" : activeFilter}
                </p>
                {activeFilter !== "all" && (
                  <button
                    onClick={() => setActiveFilter("all")}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {displayedCustomers.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-lg shadow-md">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-lg">
                    {search
                      ? `No customers found matching "${search}"`
                      : `No ${activeFilter} customers found`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`bg-white rounded-lg shadow-md border-l-4 ${
                        customer.sales === "RETAIL"
                          ? "border-green-500"
                          : customer.sales === "WHOLESALE"
                          ? "border-purple-500"
                          : customer.debt_summary !== null
                          ? "border-yellow-500"
                          : "border-blue-500"
                      } overflow-hidden`}
                    >
                      <CustomerExcerpt
                        customer={customer}
                        refreshCustomers={refreshCustomers}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="my-2 flex justify-center">
                <Pagination
                  count={Math.ceil(customerCounts / 8)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  color="primary"
                />
              </div>
            </div>
          )}

          {/* Error state */}
          {customerStatus === "failed" && (
            <div className="text-center p-12 bg-red-50 rounded-lg shadow-md">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-500 font-medium text-lg">
                Failed to load customer data. Please try again later.
              </p>
              <p className="text-red-400 text-sm mt-2">{customerError}</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Customer Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <span>Add New Customer</span>
          </div>
        </DialogTitle>
        <DialogContent className="mt-4">
          <form onSubmit={handleAddNewCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formatPhoneNumber(phone)}
                onChange={handlePhoneChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="(123) 456-7890"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: (123) 456-7890
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
              >
                <option value="">Select a location</option>
                {locations_list.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerType("RETAIL")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    customerType === "RETAIL"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🛒</span>
                    <span
                      className={`font-medium ${
                        customerType === "RETAIL"
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      Retail
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType("WHOLESALE")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    customerType === "WHOLESALE"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🏭</span>
                    <span
                      className={`font-medium ${
                        customerType === "WHOLESALE"
                          ? "text-purple-600"
                          : "text-gray-700"
                      }`}
                    >
                      Wholesale
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setDialogOpen(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddNewCustomer}
            disabled={submitting || !name || !phone || !locationId}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            style={{ backgroundColor: "#3b82f6", color: "white" }}
          >
            {submitting ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              "Add Customer"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
      >
        <AddBoxIcon />
      </button>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 left-4 z-40 w-10 h-10 bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
        >
          <Icons.ArrowUp />
        </button>
      )}

      <footer className="text-white mt-4">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AdminCustomer
