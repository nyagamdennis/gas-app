import React, { useEffect, useState, useMemo } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import AdminsFooter from "../components/AdminsFooter"
import Navbar from "../components/ui/mobile/admin/Navbar"
import api from "../../utils/api"
import {
  Receipt as ReceiptIcon,
  ArrowForward,
  LocationOn,
  Inventory,
  Person,
  EventNote,
  Notes,
  Search,
  Refresh,
} from "@mui/icons-material"

interface Receipt {
  id: number
  receipt_number: string
  from_location_type: string
  from_location_name: string
  to_location_type: string
  to_location_name: string
  status: string
  total_items: number
  items_count: number
  transferred_by_name: string
  transfer_date: string
  notes: string
  created_at: string
}

const AllReceipts = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch receipts using async/await
  const fetchReceipts = async () => {
    try {
      setLoading(true)
      const response = await api.get("/inventory/receipts")
      setReceipts(response.data)
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch receipts:", err)
      setError(err.response?.data?.message || "Failed to load receipts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReceipts()
  }, [])

  // Filter receipts based on search term (receipt number, from/to location names)
  const filteredReceipts = useMemo(() => {
    if (!searchTerm.trim()) return receipts
    const term = searchTerm.toLowerCase()
    return receipts.filter(
      (r) =>
        r.receipt_number.toLowerCase().includes(term) ||
        r.from_location_name.toLowerCase().includes(term) ||
        r.to_location_name.toLowerCase().includes(term) ||
        r.transferred_by_name.toLowerCase().includes(term),
    )
  }, [receipts, searchTerm])

  // Helper to format date (relative or short)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case "COMPLETED":
          return {
            bg: "bg-green-100",
            text: "text-green-800",
            label: "Completed",
          }
        case "PENDING":
          return {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            label: "Pending",
          }
        case "CANCELLED":
          return { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" }
        default:
          return { bg: "bg-gray-100", text: "text-gray-800", label: status }
      }
    }
    const config = getStatusConfig(status)
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
        <Navbar
          headerMessage="Stock Transfers"
          headerText="Loading transfer receipts..."
        />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading receipts...</p>
          </div>
        </div>
        <AdminsFooter />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
        <Navbar
          headerMessage="Stock Transfers"
          headerText="Error loading receipts"
        />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchReceipts}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 mx-auto"
            >
              <Refresh fontSize="small" /> Retry
            </button>
          </div>
        </div>
        <AdminsFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage="Stock Transfers"
        headerText="Inventory transfer receipts"
      />

      <main className="flex-grow px-4 py-3 pb-24">
        {/* Header with count and search */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-800">
              Transfer Receipts
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {filteredReceipts.length} total
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fontSize="small"
            />
            <input
              type="text"
              placeholder="Search by receipt #, location, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Receipts list - card layout */}
        {filteredReceipts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <ReceiptIcon
              className="text-gray-300 text-5xl mx-auto mb-3"
              style={{ fontSize: 48 }}
            />
            <p className="text-gray-500">No transfer receipts found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 text-blue-600 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100"
              >
                {/* Header: Receipt number and status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <ReceiptIcon fontSize="small" className="text-blue-500" />
                    <span className="font-mono font-medium text-blue-600 text-sm">
                      {receipt.receipt_number}
                    </span>
                  </div>
                  <StatusBadge status={receipt.status} />
                </div>

                {/* Transfer route: From → To */}
                <div className="flex items-center gap-2 mb-3 bg-gray-50 p-2 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">From</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {receipt.from_location_type}: {receipt.from_location_name}
                    </p>
                  </div>
                  <ArrowForward
                    fontSize="small"
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">To</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {receipt.to_location_type}: {receipt.to_location_name}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Inventory fontSize="small" className="text-gray-400" />
                    <span className="text-gray-700">
                      {receipt.total_items} item
                      {receipt.total_items !== 1 && "s"} ({receipt.items_count}{" "}
                      type{receipt.items_count !== 1 && "s"})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Person fontSize="small" className="text-gray-400" />
                    <span className="text-gray-700 truncate">
                      {receipt.transferred_by_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <EventNote fontSize="small" className="text-gray-400" />
                    <span className="text-gray-500 text-xs">
                      {formatDate(receipt.transfer_date)}
                    </span>
                  </div>
                  {receipt.notes && (
                    <div className="flex items-start gap-1.5 col-span-2 mt-1 pt-1 border-t border-gray-100">
                      <Notes
                        fontSize="small"
                        className="text-gray-400 mt-0.5"
                      />
                      <span className="text-gray-500 text-xs line-clamp-2">
                        {receipt.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AllReceipts
