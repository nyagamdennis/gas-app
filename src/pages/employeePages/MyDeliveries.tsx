// @ts-nocheck
import React, { useEffect, useState } from "react"
import EmployeeFooter from "../../components/ui/EmployeeFooter"
import Navbar from "../../components/ui/mobile/employees/Navbar"
import { toast, ToastContainer } from "react-toastify"
import api from "../../../utils/api"
import {
  
 
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Chip,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import PersonIcon from "@mui/icons-material/Person"
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler"
import StorefrontIcon from "@mui/icons-material/Storefront"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import HomeIcon from "@mui/icons-material/Home"
import { NavigationIcon } from "lucide-react"

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"

import { RefreshCwIcon } from "lucide-react"

const MyDeliveries = () => {
  const [loadingDeliveries, setLoadingDeliveries] = useState(false)
  const [deliveries, setDeliveries] = useState([])
  const [actionLoading, setActionLoading] = useState(false)

  // Confirmation dialogs
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)

   const [saleForm, setSaleForm] = useState({
     customer: {
       customerPhone: "",
       location: "",
       apertmentName: "",
       roomNumber: "",
     },
     items: [],
     payments: [
       {
         type: "CASH",
         amount: "",
         transaction_code: "",
         phone: "",
         name: "",
       },
     ],
   })

  const fetchDeliveries = async () => {
    setLoadingDeliveries(true)
    try {
      const response = await api.get("vehicle/deliveries/my_assigned_items/")
      setDeliveries(response.data)
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
      toast.error("Could not load deliveries")
    } finally {
      setLoadingDeliveries(false)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const handleAccept = (delivery) => {
    setSelectedDelivery(delivery)
    setAcceptDialogOpen(true)
  }

  const handleReject = (delivery) => {
    setSelectedDelivery(delivery)
    setRejectDialogOpen(true)
  }


  const handleOpenComplete = (delivery) => {
    setSelectedDelivery(delivery)
    // Pre-fill form with delivery data
    const customer = delivery.customer || {
      customerPhone: "",
      location: "",
      apertmentName: "",
      roomNumber: "",
    }
    const items = delivery.items.map((item) => ({
      ...item,
      custom_price: item.custom_price || "",
      sales_type: item.sales_type || delivery.delivery_type,
      sales_category: item.sales_category || "REFILL",
    }))
    const totalValue = items.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.custom_price) || 0) *
          (item.cylinder_quantity || item.product_quantity || 1),
      0,
    )
    setSaleForm({
      customer: {
        customerPhone: customer.customerPhone || "",
        location: customer.location || "",
        apertmentName: customer.apertmentName || "",
        roomNumber: customer.roomNumber || "",
      },
      items,
      payments: [
        {
          type: "CASH",
          amount: totalValue.toFixed(2),
          transaction_code: "",
          phone: "",
          name: "",
        },
      ],
    })
    setCompleteDialogOpen(true)
  }


  const confirmAccept = async () => {
    if (!selectedDelivery) return
    setActionLoading(true)
    try {
      await api.post(
        `vehicle/deliveries/${selectedDelivery.id}/mark-in-transit/`,
      )
      toast.success("Delivery accepted – now in transit")
      fetchDeliveries()
    } catch (error) {
      console.error("Failed to accept delivery:", error)
      toast.error("Failed to update delivery")
    } finally {
      setActionLoading(false)
      setAcceptDialogOpen(false)
      setSelectedDelivery(null)
    }
  }

  const confirmReject = async () => {
    if (!selectedDelivery) return
    setActionLoading(true)
    try {
      await api.post(
        `vehicle/deliveries/${selectedDelivery.id}/mark-as-reject/`,
        {
          status: "REJECTED",
        },
      )
      toast.success("Delivery rejected")
      fetchDeliveries()
    } catch (error) {
      console.error("Failed to reject delivery:", error)
      toast.error("Failed to update delivery")
    } finally {
      setActionLoading(false)
      setRejectDialogOpen(false)
      setSelectedDelivery(null)
    }
  }


  const handlePaymentChange = (index, field, value) => {
    const updated = [...saleForm.payments]
    updated[index][field] = value
    setSaleForm({ ...saleForm, payments: updated })
  }

  const addPayment = () => {
    setSaleForm({
      ...saleForm,
      payments: [
        ...saleForm.payments,
        { type: "CASH", amount: "", transaction_code: "", phone: "", name: "" },
      ],
    })
  }

  const removePayment = (index) => {
    const updated = saleForm.payments.filter((_, i) => i !== index)
    setSaleForm({ ...saleForm, payments: updated })
  }



  const handleItemChange = (index, field, value) => {
    const updated = [...saleForm.items]
    updated[index][field] = value
    setSaleForm({ ...saleForm, items: updated })
  }


  const calculateTotals = () => {
    const totalDue = saleForm.items.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.custom_price) || 0) *
          (item.cylinder_quantity || item.product_quantity || 1),
      0,
    )
    const totalPaid = saleForm.payments.reduce(
      (sum, p) => sum + (parseFloat(p.amount) || 0),
      0,
    )
    return { totalDue, totalPaid, balance: totalDue - totalPaid }
  }

  const confirmCompleteSale = async () => {
    if (!selectedDelivery) return
    const { totalDue, totalPaid } = calculateTotals()
    if (totalPaid < totalDue) {
      toast.error("Payment amount must cover the total due.")
      return
    }
    setActionLoading(true)
    try {
      const payload = {
        customer: saleForm.customer,
        items: saleForm.items.map((item) => ({
          id: item.id,
          custom_price: item.custom_price,
          sales_type: item.sales_type,
          sales_category: item.sales_category,
        })),
        payments: saleForm.payments.filter((p) => parseFloat(p.amount) > 0),
      }
      await api.post(
        `vehicle/deliveries/${selectedDelivery.id}/complete-sale/`,
        payload,
      )
      toast.success("Sale completed and delivery marked as delivered!")
      fetchDeliveries()
      setCompleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to complete sale:", error)
      toast.error("Failed to complete sale")
    } finally {
      setActionLoading(false)
    }
  }


  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border border-green-200"
      case "PENDING":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar headerMessage="ERP" headerText="My Deliveries" />

      <main className="flex-grow m-2 p-1 pb-20 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LocalShippingIcon className="text-blue-600" />
            Assigned Deliveries
          </h2>
          <button
            onClick={fetchDeliveries}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
            disabled={loadingDeliveries}
          >
            <RefreshCwIcon size={20} />
          </button>
        </div>

        {loadingDeliveries ? (
          <div className="text-center py-12">
            <CircularProgress size={40} />
          </div>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <LocalShippingIcon className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No deliveries assigned</p>
            <p className="text-gray-400 text-sm mt-1">
              Check back later or pull to refresh
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((del) => {
              const cylinderItems =
                del.items?.filter((item) => item.cylinder !== null) || []
              const productItems =
                del.items?.filter((item) => item.product !== null) || []
              const totalCylinders = cylinderItems.reduce(
                (sum, item) => sum + (item.cylinder_quantity || 0),
                0,
              )
              const totalProducts = productItems.reduce(
                (sum, item) => sum + (item.product_quantity || 0),
                0,
              )
              const totalValue = [...cylinderItems, ...productItems].reduce(
                (sum, item) =>
                  sum +
                  (parseFloat(item.custom_price) || 0) *
                    (item.cylinder_quantity || item.product_quantity || 0),
                0,
              )

              return (
                <div
                  key={del.id}
                  className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500"
                >
                  {/* Customer Info (unchanged) */}
                  {del.customer ? (
                    <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 overflow-hidden">
                      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PersonIcon
                            className="text-purple-700"
                            fontSize="small"
                          />
                          <span className="font-semibold text-gray-800">
                            {del.customer_details?.name || "Customer"}
                          </span>
                        </div>
                        {del.customer_details?.latitude &&
                        del.customer_details?.longitude ? (
                          <button
                            onClick={() => {
                              const { latitude, longitude } =
                                del.customer_details
                              window.open(
                                // `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
                                `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=motorcycling`,
                                "_blank",
                                "noreferrer",
                              )
                            }}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition"
                          >
                            <NavigationIcon size={16} />
                            Navigate
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const address = [
                                del.customer_details?.fallback
                                  ?.location_description ||
                                  del.customer.location,
                                del.customer_details?.fallback?.apartment ||
                                  del.customer.apertmentName,
                                del.customer_details?.fallback?.room ||
                                  del.customer.roomNumber,
                              ]
                                .filter(Boolean)
                                .join(", ")
                              if (address) {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    address,
                                  )}`,
                                  "_blank",
                                )
                              }
                            }}
                            className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition"
                          >
                            <NavigationIcon size={16} />
                            Directions
                          </button>
                        )}
                      </div>

                      <div className="px-4 pb-3 space-y-1.5 text-sm">
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon
                            fontSize="small"
                            className="text-purple-600"
                          />
                          <a
                            href={`tel:${del.customer.customerPhone}`}
                            className="text-blue-600 underline"
                          >
                            {del.customer.customerPhone}
                          </a>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <LocationOnIcon
                            fontSize="small"
                            className="text-purple-600 mt-0.5"
                          />
                          <span className="text-gray-700">
                            {del.customer_details?.location_name ||
                              del.customer.location}
                          </span>
                        </div>
                        {del.customer.apertmentName && (
                          <div className="flex items-start gap-1.5">
                            <HomeIcon
                              fontSize="small"
                              className="text-purple-600 mt-0.5"
                            />
                            <span className="text-gray-700">
                              {del.customer.apertmentName}
                            </span>
                          </div>
                        )}
                        {del.customer.roomNumber && (
                          <div className="flex items-start gap-1.5">
                            <MeetingRoomIcon
                              fontSize="small"
                              className="text-purple-600 mt-0.5"
                            />
                            <span className="text-gray-700">
                              {del.customer.roomNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {(del.customer_details?.address ||
                        del.customer.location ||
                        del.customer.apertmentName ||
                        del.customer.roomNumber) && (
                        <div className="px-4 pb-3 text-xs text-gray-500 border-t border-purple-100 pt-2 mt-1">
                          <span className="font-medium">📍 Full address: </span>
                          {[
                            del.customer_details?.address,
                            del.customer_details?.location_name ||
                              del.customer.location,
                            del.customer.apertmentName,
                            del.customer.roomNumber,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg text-gray-500 text-sm italic">
                      No customer details recorded
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <TwoWheelerIcon
                          fontSize="small"
                          className="text-blue-500"
                        />
                        <span>
                          {del.delivery_vehicle_number_plate || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <StorefrontIcon fontSize="small" />
                        <span>
                          {del.source_location_name} ({del.source_location_type}
                          )
                        </span>
                      </div>
                      {del.driver_name && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <PersonIcon
                            fontSize="small"
                            className="text-blue-500"
                          />
                          <span>{del.driver_name}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        del.status,
                      )}`}
                    >
                      {del.status || "PENDING"}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {totalCylinders > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        🛢️ {totalCylinders} cylinder
                        {totalCylinders !== 1 && "s"}
                      </span>
                    )}
                    {totalProducts > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                        📦 {totalProducts} product{totalProducts !== 1 && "s"}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      💰 Total: Ksh {totalValue.toLocaleString()}
                    </span>
                  </div>

                  {/* Items detail */}
                  {(productItems.length > 0 || cylinderItems.length > 0) && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm">
                      {productItems.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Products
                          </p>
                          <div className="space-y-1">
                            {productItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <span>{item.product_name}</span>
                                <div className="flex gap-3 text-xs">
                                  <span>Qty: {item.product_quantity}</span>
                                  <span className="text-green-600">
                                    Ksh{" "}
                                    {parseFloat(
                                      item.custom_price,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {cylinderItems.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Cylinders
                          </p>
                          <div className="space-y-1">
                            {cylinderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-2">
                                  <span>
                                    {item.cylinder_name} ({item.cylinder_weight}
                                    kg)
                                  </span>
                                  <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                                    {item.sales_category || "refill"}
                                  </span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                  <span>Qty: {item.cylinder_quantity}</span>
                                  <span className="text-green-600">
                                    Ksh{" "}
                                    {parseFloat(
                                      item.custom_price,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    🕒 {new Date(del.created_at).toLocaleString()}
                  </div>

                  {/* Action Buttons (only for PENDING deliveries) */}
                  {del.status === "PENDING" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleReject(del)}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                      >
                        ✗ Reject
                      </button>
                      <button
                        onClick={() => handleAccept(del)}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        ✓ Accept
                      </button>
                    </div>
                  )}

                  {del.status === "IN_TRANSIT" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleOpenComplete(del)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        💵 Complete Sale
                      </button>
                    </div>
                  )}
                  {/* For IN_TRANSIT deliveries, you could add a "Complete" button later */}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Accept Confirmation Dialog */}
      <Dialog
        open={acceptDialogOpen}
        onClose={() => setAcceptDialogOpen(false)}
      >
        <DialogTitle>Accept Delivery?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By accepting, you confirm that you are starting this delivery. The
            status will change to "In Transit".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmAccept}
            color="primary"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Yes, Start Delivery"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reject Delivery?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this delivery? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmReject}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Yes, Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "#f8fafc",
          },
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
          <div className="flex items-center gap-2">
            <LocalShippingIcon />
            <span className="text-xl font-bold">Complete Sale & Delivery</span>
          </div>
          <p className="text-sm text-blue-100 mt-1">
            Finalize customer details, adjust prices, and record payments
          </p>
        </DialogTitle>

        <DialogContent className="p-4" dividers={false}>
          <div className="space-y-5">
            {/* Customer Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <PersonIcon className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Customer Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Phone Number"
                  value={saleForm.customer.customerPhone}
                  onChange={(e) =>
                    setSaleForm({
                      ...saleForm,
                      customer: {
                        ...saleForm.customer,
                        customerPhone: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon
                        className="text-gray-400 mr-2"
                        fontSize="small"
                      />
                    ),
                  }}
                />
                <TextField
                  label="Location / Area"
                  value={saleForm.customer.location}
                  onChange={(e) =>
                    setSaleForm({
                      ...saleForm,
                      customer: {
                        ...saleForm.customer,
                        location: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <LocationOnIcon
                        className="text-gray-400 mr-2"
                        fontSize="small"
                      />
                    ),
                  }}
                />
                <TextField
                  label="Apartment / Building"
                  value={saleForm.customer.apertmentName}
                  onChange={(e) =>
                    setSaleForm({
                      ...saleForm,
                      customer: {
                        ...saleForm.customer,
                        apertmentName: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <HomeIcon
                        className="text-gray-400 mr-2"
                        fontSize="small"
                      />
                    ),
                  }}
                />
                <TextField
                  label="Room / Floor"
                  value={saleForm.customer.roomNumber}
                  onChange={(e) =>
                    setSaleForm({
                      ...saleForm,
                      customer: {
                        ...saleForm.customer,
                        roomNumber: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <MeetingRoomIcon
                        className="text-gray-400 mr-2"
                        fontSize="small"
                      />
                    ),
                  }}
                />
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <StorefrontIcon className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Order Items
                </h3>
              </div>
              <div className="space-y-4">
                {saleForm.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {item.cylinder_name || item.product_name}
                        </span>
                        <div className="text-sm text-gray-500">
                          {item.cylinder_weight &&
                            `${item.cylinder_weight}kg • `}
                          {item.cylinder_quantity || item.product_quantity || 1}{" "}
                          unit(s)
                        </div>
                      </div>
                      <Chip
                        label={`${item.sales_type} • ${item.sales_category}`}
                        size="small"
                        className="bg-gray-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormControl fullWidth size="small">
                        <InputLabel>Sales Type</InputLabel>
                        <Select
                          value={item.sales_type}
                          onChange={(e) =>
                            handleItemChange(idx, "sales_type", e.target.value)
                          }
                          label="Sales Type"
                        >
                          <MenuItem value="RETAIL">Retail</MenuItem>
                          <MenuItem value="WHOLESALE">Wholesale</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={item.sales_category}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "sales_category",
                              e.target.value,
                            )
                          }
                          label="Category"
                        >
                          <MenuItem value="REFILL">Refill</MenuItem>
                          <MenuItem value="OUTLET">Outlet</MenuItem>
                          <MenuItem value="COMPLETE">Complete</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Unit Price (Ksh)"
                        type="number"
                        value={item.custom_price}
                        onChange={(e) =>
                          handleItemChange(idx, "custom_price", e.target.value)
                        }
                        fullWidth
                        size="small"
                        className="col-span-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <span className="text-green-600 text-xl">💵</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payments
                  </h3>
                </div>
                <Button
                  startIcon={<Add />}
                  onClick={addPayment}
                  variant="contained"
                  size="small"
                  className="bg-blue-600 hover:bg-blue-700 normal-case"
                >
                  Add Payment
                </Button>
              </div>

              {saleForm.payments.map((payment, idx) => (
                <div
                  key={idx}
                  className={`mb-4 p-4 rounded-xl border-l-4 ${
                    payment.type === "CASH"
                      ? "border-l-green-500 bg-green-50/50"
                      : "border-l-blue-500 bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FormControl size="small" className="w-32">
                        <Select
                          value={payment.type}
                          onChange={(e) =>
                            handlePaymentChange(idx, "type", e.target.value)
                          }
                          className="bg-white"
                        >
                          <MenuItem value="CASH">
                            <span className="flex items-center gap-1">
                              💵 Cash
                            </span>
                          </MenuItem>
                          <MenuItem value="MPESA">
                            <span className="flex items-center gap-1">
                              📱 M-Pesa
                            </span>
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <span className="text-sm font-medium text-gray-700">
                        Payment #{idx + 1}
                      </span>
                    </div>
                    {saleForm.payments.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removePayment(idx)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <TextField
                      label="Amount (Ksh)"
                      type="number"
                      value={payment.amount}
                      onChange={(e) =>
                        handlePaymentChange(idx, "amount", e.target.value)
                      }
                      fullWidth
                      size="small"
                      variant="outlined"
                      className="bg-white"
                    />
                    {payment.type === "MPESA" && (
                      <>
                        <TextField
                          label="Transaction Code"
                          value={payment.transaction_code}
                          onChange={(e) =>
                            handlePaymentChange(
                              idx,
                              "transaction_code",
                              e.target.value,
                            )
                          }
                          fullWidth
                          size="small"
                          variant="outlined"
                          className="bg-white"
                          placeholder="e.g., QWERTY123"
                        />
                        <TextField
                          label="Phone Number"
                          value={payment.phone}
                          onChange={(e) =>
                            handlePaymentChange(idx, "phone", e.target.value)
                          }
                          fullWidth
                          size="small"
                          variant="outlined"
                          className="bg-white"
                          placeholder="07XXXXXXXX"
                        />
                        <TextField
                          label="Payer Name (optional)"
                          value={payment.name}
                          onChange={(e) =>
                            handlePaymentChange(idx, "name", e.target.value)
                          }
                          fullWidth
                          size="small"
                          variant="outlined"
                          className="bg-white"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-lg p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🧾</span> Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Due</span>
                  <span className="text-xl font-bold">
                    Ksh {calculateTotals().totalDue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Paid</span>
                  <span className="text-xl font-bold text-green-400">
                    Ksh {calculateTotals().totalPaid.toLocaleString()}
                  </span>
                </div>
                <Divider className="bg-gray-600" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Balance</span>
                  <span
                    className={`text-2xl font-bold ${
                      calculateTotals().balance <= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    Ksh {Math.abs(calculateTotals().balance).toLocaleString()}
                    {calculateTotals().balance > 0 && " (Debt)"}
                  </span>
                </div>
                {calculateTotals().balance > 0 && (
                  <Chip
                    label="⚠️ Outstanding debt will be recorded"
                    className="mt-2 bg-yellow-600 text-white"
                    size="small"
                  />
                )}
                {calculateTotals().balance < 0 && (
                  <Chip
                    label="✅ Overpayment – change due"
                    className="mt-2 bg-blue-600 text-white"
                    size="small"
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="p-4 bg-gray-50 border-t">
          <Button
            onClick={() => setCompleteDialogOpen(false)}
            variant="outlined"
            className="text-gray-600 border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCompleteSale}
            variant="contained"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg disabled:opacity-70"
            disabled={actionLoading}
            startIcon={
              actionLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {actionLoading
              ? "Processing..."
              : "Confirm Sale & Complete Delivery"}
          </Button>
        </DialogActions>
      </Dialog>

      <EmployeeFooter />
    </div>
  )
}

export default MyDeliveries
