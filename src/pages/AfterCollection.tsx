// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  fetchAssignedCylinders,
  getAssignsError,
  getAssignsStatus,
  selectAllAssigns,
} from "../features/assigns/assignsSlice"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchCollectedCylinders,
  selectAllCollections,
} from "../features/collections/collectionsSlice"
import api from "../../utils/api"
import { toast } from "react-toastify"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"

const AfterCollection = () => {
  const [printComplete, setPrintComplete] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const salesTeamId = useParams()
  const dispatch = useAppDispatch()
  const cylinders = useAppSelector(selectAllCollections)
  const cylinderError = useAppSelector(getAssignsError)
  const cylinderStatus = useAppSelector(getAssignsStatus)
  const { state } = useLocation() // Get the state object passed via navigate
  const salesTeamName = state?.salesTeamName
  const receiptData = state?.receiptData

  console.log("cyd ", cylinders)
  useEffect(() => {
    // Fetch all assigned cylinders (optionally filter by sales team)
    dispatch(fetchCollectedCylinders(salesTeamId?.id))
  }, [dispatch])

  const navigate = useNavigate()

  const handlePrint = () => {
    if (!printComplete) {
      // axios.post(`${apiUrl}/mark-print-return-complete/`,
      //     { sales_team_id: salesTeamId?.id },
      //     { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
      // )
      api
        .post("/mark-print-return-complete/", {
          sales_team_id: salesTeamId?.id,
        })
        .then(() => setPrintComplete(true))
        .catch((err) => console.error("Error marking print complete:", err))
    } else {
      alert("Print already completed. No need to reprint.")
    }
    if (window.AndroidBridge && window.AndroidBridge.printText) {
      const currentDate = new Date().toLocaleDateString()
      let printContent = "\n\n" // Whitespace at the top
      printContent += `Empty & Spoiled Returns only:   ${salesTeamName}\n`
      printContent += `Date: ${currentDate}\n`
      printContent += "********************************\n"

      // Empty Cylinders Section
      const emptyCylinders = cylinders.filter(
        (cylinder) => cylinder.empties > 0,
      )
      if (emptyCylinders.length > 0) {
        printContent += "\nEmpty Cylinders\n"
        printContent += "--------------------------------\n"
        printContent += "Cylinder   Weight(kg)    Qty\n"
        printContent += "--------------------------------\n"
        emptyCylinders.forEach((cylinder) => {
          printContent += `${cylinder.gas_type.padEnd(
            10,
          )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties
            .toString()
            .padStart(10)}\n`
        })
      }

      // Filled Cylinders Section
      const filledCylinders = cylinders.filter(
        (cylinder) => cylinder.filled > 0,
      )
      if (filledCylinders.length > 0) {
        printContent += "\n--------------------------------\n"
        printContent += "\nFilled Cylinders\n"
        printContent += "--------------------------------\n"
        printContent += "Cylinder   Weight(kg)    Qty\n"
        printContent += "--------------------------------\n"
        filledCylinders.forEach((cylinder) => {
          printContent += `${cylinder.gas_type.padEnd(
            10,
          )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled
            .toString()
            .padStart(10)}\n`
        })
      }

      // Spoiled Cylinders Section
      const spoiledCylinders = cylinders.filter(
        (cylinder) => cylinder.spoiled > 0,
      )
      if (spoiledCylinders.length > 0) {
        printContent += "\n--------------------------------\n"
        printContent += "\nSpoiled Cylinders\n"
        printContent += "--------------------------------\n"
        printContent += "Cylinder   Weight(kg)    Qty\n"
        printContent += "--------------------------------\n"
        spoiledCylinders.forEach((cylinder) => {
          printContent += `${cylinder.gas_type.padEnd(
            10,
          )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.spoiled
            .toString()
            .padStart(10)}\n`
        })
      }

      // Lost Empties Cylinders Section
      const lostEmpties = cylinders.filter(
        (cylinder) => cylinder.empties_lost > 0,
      )
      if (lostEmpties.length > 0) {
        printContent += "\n--------------------------------\n"
        printContent += "\nLost Spoiled Cylinders\n"
        printContent += "--------------------------------\n"
        printContent += "Cylinder   Weight(kg)    Qty\n"
        printContent += "--------------------------------\n"
        lostEmpties.forEach((cylinder) => {
          printContent += `${cylinder.gas_type.padEnd(
            10,
          )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties_lost
            .toString()
            .padStart(10)}\n`
        })
      }

      // Lost Filled Cylinders Section
      const lostFilled = cylinders.filter(
        (cylinder) => cylinder.filled_lost > 0,
      )
      if (lostFilled.length > 0) {
        printContent += "\n--------------------------------\n"
        printContent += "\nLost Filled Cylinders\n"
        printContent += "--------------------------------\n"
        printContent += "Cylinder   Weight(kg)    Qty\n"
        printContent += "--------------------------------\n"
        lostFilled.forEach((cylinder) => {
          printContent += `${cylinder.gas_type.padEnd(
            10,
          )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled_lost
            .toString()
            .padStart(10)}\n`
        })
      }

      // Less Pay Cylinders Section
      const lessPay = cylinders.filter((cylinder) => cylinder.less_pay > 0)
      if (lessPay.length > 0) {
        printContent += "\n--------------------------------\n"
        printContent += "\nLess Pay Cylinders\n"
        printContent += "--------------------------------\n"
        printContent += "Cylinder   Weight(kg)    Qty\n"
        printContent += "--------------------------------\n"
        lessPay.forEach((cylinder) => {
          printContent += `${cylinder.gas_type.padEnd(
            10,
          )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.less_pay
            .toString()
            .padStart(10)}\n`
        })
      }

      // Footer Information
      printContent += "\n--------------------------------\n"
      printContent += "\n\nGoods Collected by: \n"
      printContent += "_________________________\n"
      printContent += "Signature: \n"
      printContent += "_________________________\n"
      printContent += "\n\nGoods dispatched by: \n"
      printContent += "_________________________\n"
      printContent += "Signature: \n"
      printContent += "_________________________\n"
      printContent += "\n\n\n\n\n" // Whitespace at the bottom

      // Call the native print method
      window.AndroidBridge.printText(printContent)
    } else {
      alert("AndroidBridge is not available")
    }
  }

  const handleSaveRecipt = async () => {
    if (!printComplete) {
      await api
        .post("/mark-print-return-complete/", {
          sales_team_id: salesTeamId?.id,
        })
        .then(() => setPrintComplete(true))
        .catch((err) => console.error("Error marking print complete:", err))
    } else {
      alert("Print already completed. No need to reprint.")
    }
  }

  const handleDownloadPDF = async () => {
    if (!receiptData?.receipt?.receipt_number) {
      toast.error("Receipt number not available")
      return
    }

    setIsDownloadingPDF(true)
    try {
      const response = await api.get(
        `/inventory/receipts/${receiptData.receipt.receipt_number}/pdf/`,
        {
          responseType: "blob",
        },
      )
      //   GET /api/inventory/receipts/{receipt_number}/pdf/

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${receiptData.receipt?.receipt_number || "Receipt"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF")
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  const handleGeneratePDF = () => {
    alert("Generate PDF functionality can be added here.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Navbar />
      {/* Receipt Header */}
      <main>
        {receiptData?.receipt && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Receipt Number</p>
                  <p className="text-lg font-bold text-blue-600">
                    {receiptData.receipt.receipt_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold text-green-600">
                    {receiptData.receipt.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-lg font-bold text-purple-600">
                    {receiptData.receipt.total_items}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    From Location
                  </p>
                  <p className="text-gray-600">
                    {receiptData.receipt.from_shop_name ||
                      receiptData.receipt.from_location_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {receiptData.receipt.from_location_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    To Location
                  </p>
                  <p className="text-gray-600">
                    {receiptData.receipt.to_store_name ||
                      receiptData.receipt.to_location_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {receiptData.receipt.to_location_type}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Transferred By:</span>{" "}
                    {receiptData.receipt.transferred_by_name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Transfer Date:</span>{" "}
                    {new Date(
                      receiptData.receipt.transfer_date,
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloadingPDF}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                      isDownloadingPDF
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    } transition-all`}
                  >
                    {isDownloadingPDF ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        Downloading...
                      </>
                    ) : (
                      <>📄 Download PDF</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center font-bold text-2xl text-gray-800 mb-6">
            Empty and Spoiled Cylinders Returns
          </h2>

          {/* Transferred Items Summary */}
          {receiptData?.transferred_items &&
            receiptData.transferred_items.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Transfer Summary
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {receiptData.transferred_items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.cylinder}
                        </p>
                        <p className="text-sm text-gray-600">
                          Empty:{" "}
                          <span className="font-bold">
                            {item.empty_quantity}
                          </span>
                          {item.spoiled_quantity > 0 && (
                            <>
                              {" | "}Spoiled:{" "}
                              <span className="font-bold">
                                {item.spoiled_quantity}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">
                          {item.total}
                        </p>
                        <p className="text-xs text-gray-500">units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Detailed Receipt Items */}
          {receiptData?.receipt?.items &&
            receiptData.receipt.items.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Detailed Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-4 py-2 text-left font-bold">
                          Item Name
                        </th>
                        <th className="px-4 py-2 text-center font-bold">
                          Full
                        </th>
                        <th className="px-4 py-2 text-center font-bold">
                          Empty
                        </th>
                        <th className="px-4 py-2 text-center font-bold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptData.receipt.items.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 font-semibold">
                            {item.item_name}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {item.full_quantity}
                          </td>
                          <td className="px-4 py-2 text-center text-blue-600 font-bold">
                            {item.empty_quantity}
                          </td>
                          <td className="px-4 py-2 text-center font-bold text-green-600">
                            {item.total_quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </main>

      <footer className="text-white">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AfterCollection
