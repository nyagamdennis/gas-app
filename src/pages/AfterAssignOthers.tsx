// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useMediaQuery, useTheme } from "@mui/material"
import api from "../../utils/api"
import CircularProgress from "@mui/material/CircularProgress"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"
import LocalMallIcon from "@mui/icons-material/LocalMall"
import StorefrontIcon from "@mui/icons-material/Storefront"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import DescriptionIcon from "@mui/icons-material/Description"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import PrintIcon from "@mui/icons-material/Print"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import InventoryIcon from "@mui/icons-material/Inventory"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const AfterAssignOthers = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const receipt_number = useParams()
  const dispatch = useAppDispatch()
  const { state } = useLocation()
  const [printComplete, setPrintComplete] = useState(false)
  const salesTeamName = state?.salesTeamName
  const salesTeamType = state?.salesTeamType
  const navigate = useNavigate()
  const [savingReciept, setSavingReciept] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get(`/inventory/receipts/${receipt_number.id}/`)
      .then((response) => {
        console.log("Receipt Data:", response.data)
        setReceiptData(response.data)
      })
      .catch((error) => {
        console.error("Error fetching receipt:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [receipt_number.id])

  const handlePrint = () => {
    if (!receiptData) return

    if (window.AndroidBridge && window.AndroidBridge.printText) {
      const currentDate = new Date(
        receiptData.transfer_date,
      ).toLocaleDateString()

      let printContent = "\n\n"
      printContent += `PRODUCT TRANSFER RECEIPT\n`
      printContent += `Receipt #: ${receiptData.receipt_number}\n`
      printContent += `Date: ${currentDate}\n`
      printContent += "********************************\n"
      printContent += `From: ${receiptData.from_location_name} (${receiptData.from_location_type})\n`
      printContent += `To: ${receiptData.to_location_name} (${receiptData.to_location_type})\n`
      printContent += "********************************\n"
      printContent += "Product           Qty\n"
      printContent += "--------------------------------\n"

      receiptData.items.forEach((item) => {
        printContent += `${item.item_name.padEnd(15)}${item.quantity
          .toString()
          .padStart(8)}\n`
      })

      printContent += "--------------------------------\n"
      printContent += `Total Items: ${receiptData.total_items}\n`
      if (receiptData.notes) {
        printContent += `Notes: ${receiptData.notes}\n`
      }
      printContent += `Printed At: ${new Date().toLocaleString()}\n`
      printContent += "\n\n"

      window.AndroidBridge.printText(printContent)
    } else {
      alert("Printer is not available, but receipt is saved.")
    }
  }

  const handleSaveReceipt = async () => {
    setSavingReciept(true)
    try {
      const response = await api.post("mark-print-complete-others/", {
        sales_team_id: receipt_number.id,
      })
      if (response.status === 200) {
        alert("Receipt saved successfully.")
      } else {
        alert("Failed to save receipt. Please try again.")
      }
    } catch (error) {
      console.error("Error saving receipt:", error)
      alert("An error occurred while saving the receipt.")
    } finally {
      setSavingReciept(false)
    }
  }

  const handleNavigateToEdit = () => {
    navigate(`/admins/editassignedothers/${receipt_number.id}`, {
      state: { salesTeamName },
    })
  }

  const handleDownloadPDF = async () => {
    if (!receiptData) return

    setDownloadingPDF(true)
    try {
      const response = await api.get(
        `/inventory/receipts/${receipt_number.id}/product-pdf/`,
        {
          responseType: "blob",
        },
      )

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Product_Receipt_${receiptData.receipt_number}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to download PDF. Please try again.")
    } finally {
      setDownloadingPDF(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate totals for products
  const calculateProductTotals = () => {
    if (!receiptData?.items) return { totalQuantity: 0, totalValue: 0 }

    return receiptData.items.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity || 0
        acc.totalValue += (item.quantity || 0) * (item.unit_price || 0)
        return acc
      },
      { totalQuantity: 0, totalValue: 0 },
    )
  }

  const productTotals = calculateProductTotals()

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 font-sans">
          <Navbar
            headerMessage={"Product Transfer"}
            headerText={"View and manage product transfer details"}
          />
          <main className="flex-grow m-2 p-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Loading receipt...
                  </p>
                </div>
              </div>
            ) : receiptData ? (
              <div className="space-y-4">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white hover:text-purple-100 font-medium transition mb-3"
                  >
                    <span className="mr-2">←</span> Back
                  </button>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">
                        Product Transfer Receipt
                      </h1>
                      <p className="text-purple-100 text-sm">
                        #{receiptData.receipt_number}
                      </p>
                    </div>
                    <div className="text-6xl opacity-20">📦</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      receiptData.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {receiptData.status}
                  </span>
                </div>

                {/* Transfer Details */}
                <div className="bg-white rounded-lg shadow-md p-5">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🔄</span>
                    Transfer Information
                  </h3>

                  <div className="space-y-3">
                    {/* From Section */}
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">From:</p>
                        <p className="font-semibold text-gray-800">
                          {receiptData.from_location_name}
                        </p>
                        <p className="text-sm text-blue-600 flex items-center">
                          <StorefrontIcon fontSize="small" className="mr-1" />
                          {receiptData.from_location_type}
                          {receiptData.from_store_name &&
                            ` - ${receiptData.from_store_name}`}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <span className="text-2xl text-gray-400">↓</span>
                    </div>

                    {/* To Section */}
                    <div className="flex items-start p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">To:</p>
                        <p className="font-semibold text-gray-800">
                          {receiptData.to_location_name}
                        </p>
                        <p className="text-sm text-green-600 flex items-center">
                          <ShoppingCartIcon fontSize="small" className="mr-1" />
                          {receiptData.to_location_type}
                          {receiptData.to_shop_name &&
                            ` - ${receiptData.to_shop_name}`}
                        </p>
                      </div>
                    </div>

                    {/* Date and User */}
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Transfer Date:</span>
                        <span className="font-medium text-gray-800">
                          {formatDate(receiptData.transfer_date)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Transferred By:</span>
                        <span className="font-medium text-gray-800">
                          {receiptData.transferred_by_email}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-bold text-purple-600">
                          {receiptData.total_items} products
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {receiptData.notes && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <DescriptionIcon className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800 mb-1 text-sm">
                          Notes:
                        </p>
                        <p className="text-gray-700 text-sm">
                          {receiptData.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 border-b border-gray-300">
                    <h3 className="font-bold text-gray-800 flex items-center">
                      <LocalMallIcon className="mr-2" />
                      Product Items ({receiptData.items.length})
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-100 to-purple-200">
                          <th className="border border-gray-300 px-3 py-3 text-left font-semibold">
                            Product
                          </th>
                          <th className="border border-gray-300 px-3 py-3 text-center font-semibold">
                            Type
                          </th>
                          <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-green-600">
                            Quantity
                          </th>
                          <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-blue-600">
                            Unit Price
                          </th>
                          <th className="border border-gray-300 px-3 py-3 text-center font-semibold">
                            Total Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {receiptData.items.map((item) => {
                          const itemValue =
                            (item.quantity || 0) * (item.unit_price || 0)
                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="border border-gray-300 px-3 py-3">
                                <div className="font-semibold text-gray-800">
                                  {item.item_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Product ID: {item.product || "N/A"}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-3 py-3 text-center">
                                <span className="font-medium text-gray-700">
                                  {item.item_type}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-3 py-3 text-center">
                                <span className="font-bold text-green-600 text-lg">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-3 py-3 text-center">
                                <span className="font-medium text-blue-600">
                                  {item.unit_price
                                    ? `KSh ${item.unit_price.toLocaleString()}`
                                    : "N/A"}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-3 py-3 text-center">
                                <span className="font-bold text-purple-600">
                                  {itemValue > 0
                                    ? `KSh ${itemValue.toLocaleString()}`
                                    : "N/A"}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                          <td
                            colSpan="2"
                            className="border border-gray-300 px-3 py-3 text-right"
                          >
                            Grand Totals:
                          </td>
                          <td className="border border-gray-300 px-3 py-3 text-center text-green-600">
                            <div className="flex items-center justify-center">
                              <InventoryIcon className="mr-1" />
                              {productTotals.totalQuantity}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-3 text-center text-blue-600">
                            -
                          </td>
                          <td className="border border-gray-300 px-3 py-3 text-center text-purple-600">
                            <div className="flex items-center justify-center">
                              <AttachMoneyIcon className="mr-1" />
                              KSh {productTotals.totalValue.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Total Products
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          {productTotals.totalQuantity}
                        </p>
                      </div>
                      <InventoryIcon className="text-green-600 text-2xl" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Total Value
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          KSh {productTotals.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <AttachMoneyIcon className="text-purple-600 text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 sticky bottom-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] pt-4 pb-2 space-y-3">
                  <button
                    className={`w-full px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      downloadingPDF
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 active:scale-95"
                    }`}
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                  >
                    {downloadingPDF ? (
                      <>
                        <CircularProgress
                          size={20}
                          style={{ color: "white" }}
                        />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FileDownloadIcon />
                        Download PDF
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                      onClick={handlePrint}
                    >
                      <PrintIcon />
                      Print
                    </button>

                    {/* <button
                      className={`px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        savingReciept
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-95"
                      }`}
                      onClick={handleSaveReceipt}
                      disabled={savingReciept}
                    >
                      {savingReciept ? (
                        <>
                          <CircularProgress
                            size={20}
                            style={{ color: "white" }}
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon />
                          Save
                        </>
                      )}
                    </button> */}
                  </div>

                  {/* <button
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={handleNavigateToEdit}
                  >
                    <EditIcon />
                    Edit Assignment
                  </button> */}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4 opacity-30">❌</div>
                <p className="text-gray-500 text-lg mb-2">Receipt not found</p>
                <p className="text-gray-400 text-sm">
                  Unable to load receipt data
                </p>
              </div>
            )}
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
  )
}

export default AfterAssignOthers
