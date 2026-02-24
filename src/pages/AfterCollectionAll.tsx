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

import CircularProgress from "@mui/material/CircularProgress"
import api from "../../utils/api"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"
import { toast } from "react-toastify"

const AfterCollectionAll = () => {
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
  const [isSaving, setIsSaving] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    // Fetch all assigned cylinders (optionally filter by sales team)
    dispatch(fetchCollectedCylinders(salesTeamId?.id))
  }, [dispatch])

  const navigate = useNavigate()

  const handlePrint = async () => {
    if (!printComplete) {
      setIsPrinting(true)
      try {
        // await axios.post(
        //   `${apiUrl}/mark-print-return-complete/`,
        //   { sales_team_id: salesTeamId?.id },
        //   {
        //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        //   },
        // )
        await api.post("/mark-print-return-complete/", {
          sales_team_id: salesTeamId?.id,
        })
        setPrintComplete(true)
        alert("Print successfully")
      } catch (error) {
        setPrintComplete(false)
        alert("Error printing, try again.")
      } finally {
        setIsPrinting(false)
      }
      // .then(() => setPrintComplete(true))
      //     .catch(err => console.error("Error marking print complete:", err));
    } else {
      alert("Print already completed. No need to reprint.")
    }
    if (window.AndroidBridge && window.AndroidBridge.printText) {
      const currentDate = new Date().toLocaleDateString()

      let printContent = "\n\n" // Whitespace at the top
      printContent += `All Cylinders Returns:   ${salesTeamName}\n`
      printContent += `Date: ${currentDate}\n`
      printContent += "********************************\n"

      // Function to add section if there is data
      const addSection = (title, filterCondition) => {
        const filteredCylinders = cylinders.filter(filterCondition)
        if (filteredCylinders.length > 0) {
          printContent += `\n--------------------------------\n`
          printContent += `\n${title}\n`
          printContent += "--------------------------------\n"
          printContent += "Cylinder   Weight(kg)    Qty\n"
          printContent += "--------------------------------\n"
          filteredCylinders.forEach((cylinder) => {
            printContent += `${cylinder.gas_type.padEnd(
              10,
            )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties
              .toString()
              .padStart(10)}\n`
          })
        }
      }

      // Add sections only if they contain data
      addSection("Empty Cylinders", (cylinder) => cylinder.empties > 0)

      addSection("Filled Cylinders", (cylinder) => cylinder.filled > 0)
      addSection("Spoiled Cylinders", (cylinder) => cylinder.spoiled > 0)
      addSection(
        "Lost Filled Cylinders",
        (cylinder) => cylinder.filled_lost > 0,
      )
      addSection("Less Pay Cylinders", (cylinder) => cylinder.less_pay > 0)

      // Footer information
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

  const handleSave = async () => {
    if (!printComplete) {
      setIsSaving(true)
      try {
        // await axios.post(
        //   `${apiUrl}/mark-print-return-complete/`,
        //   { sales_team_id: salesTeamId?.id },
        //   {
        //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        //   },
        // )
        await api.post("/mark-print-return-complete/", {
          sales_team_id: salesTeamId?.id,
        })
        setPrintComplete(true)
        alert("Saved Successfully")
      } catch (error) {
        alert("error saving try again.")
      } finally {
        setIsSaving(false)
      }
    } else {
      alert("Already saved. No need to save again.")
    }
  }

  const handleGeneratePDF = async () => {
    if (!receiptData?.summary?.pdf_download_url) {
      toast.error("PDF download URL not available")
      return
    }

    setIsDownloadingPDF(true)
    try {
      const response = await api.get(receiptData.summary.pdf_download_url, {
        responseType: "blob",
      })

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

  return (
    <>
      <AdminNav
        headerMessage={"Collect Cylinders"}
        headerText={"Collect cylinders from your retailers or wholesalers"}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* Receipt Header */}
        {receiptData?.receipt && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Receipt Number</p>
                  <p className="text-lg font-bold text-green-600">
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
                    onClick={handleGeneratePDF}
                    disabled={isDownloadingPDF}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                      isDownloadingPDF
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 active:scale-95"
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

        {/* Transferred Items Summary */}
        {receiptData?.transferred_items &&
          receiptData.transferred_items.length > 0 && (
            <div className="max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Transfer Summary
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {receiptData.transferred_items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.cylinder}
                      </p>
                      <p className="text-sm text-gray-600">
                        Empty:{" "}
                        <span className="font-bold">{item.empty_quantity}</span>
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
                      <p className="text-xl font-bold text-green-600">
                        {item.total}
                      </p>
                      <p className="text-xs text-gray-500">units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <h2 className="text-center font-bold text-2xl text-gray-800 mb-6 max-w-4xl mx-auto">
          All Cylinders Returns
        </h2>

        {/*  */}
        {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
        {cylinders &&
          cylinders.length > 0 &&
          cylinders.some((cylinder) => cylinder.empties > 0) && (
            <div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Empty Cylinders.</p>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Cylinder Name</th>
                    <th className="border px-4 py-2">Weight (kg)</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cylinders
                    .filter((cylinder) => cylinder.empties > 0)
                    .map((cylinder) => (
                      <tr key={cylinder.id}>
                        <td className="border px-4 py-2">
                          {cylinder.gas_type}
                        </td>
                        <td className="border px-4 py-2">{cylinder.weight}</td>
                        <td className="border px-4 py-2">{cylinder.empties}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {/* filled cylinders */}
        {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
        {cylinders &&
          cylinders.length > 0 &&
          cylinders.some((cylinder) => cylinder.filled > 0) && (
            <div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Filled Cylinders.</p>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Cylinder Name</th>
                    <th className="border px-4 py-2">Weight (kg)</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cylinders
                    .filter((cylinder) => cylinder.filled > 0)
                    .map((cylinder) => (
                      <tr key={cylinder.id}>
                        <td className="border px-4 py-2">
                          {cylinder.gas_type}
                        </td>
                        <td className="border px-4 py-2">{cylinder.weight}</td>
                        <td className="border px-4 py-2">{cylinder.filled}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {/* spoiled cylinders */}
        {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
        {cylinders &&
          cylinders.length > 0 &&
          cylinders.some((cylinder) => cylinder.spoiled > 0) && (
            <div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Spoiled Cylinders.</p>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Cylinder Name</th>
                    <th className="border px-4 py-2">Weight (kg)</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cylinders
                    .filter((cylinder) => cylinder.spoiled > 0)
                    .map((cylinder) => (
                      <tr key={cylinder.id}>
                        <td className="border px-4 py-2">
                          {cylinder.gas_type}
                        </td>
                        <td className="border px-4 py-2">{cylinder.weight}</td>
                        <td className="border px-4 py-2">{cylinder.spoiled}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {/* lost filled cylinders */}
        {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
        {cylinders &&
          cylinders.length > 0 &&
          cylinders.some((cylinder) => cylinder.filled_lost > 0) && (
            <div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Lost Filled Cylinders.</p>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Cylinder Name</th>
                    <th className="border px-4 py-2">Weight (kg)</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cylinders
                    .filter((cylinder) => cylinder.filled_lost > 0)
                    .map((cylinder) => (
                      <tr key={cylinder.id}>
                        <td className="border px-4 py-2">
                          {cylinder.gas_type}
                        </td>
                        <td className="border px-4 py-2">{cylinder.weight}</td>
                        <td className="border px-4 py-2">
                          {cylinder.filled_lost}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {/* lost empties */}
        {cylinders &&
          cylinders.length > 0 &&
          cylinders.some((cylinder) => cylinder.empties_lost > 0) && (
            <div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Lost Empty Cylinders.</p>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Cylinder Name</th>
                    <th className="border px-4 py-2">Weight (kg)</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cylinders
                    .filter((cylinder) => cylinder.empties_lost > 0)
                    .map((cylinder) => (
                      <tr key={cylinder.id}>
                        <td className="border px-4 py-2">
                          {cylinder.gas_type}
                        </td>
                        <td className="border px-4 py-2">{cylinder.weight}</td>
                        <td className="border px-4 py-2">
                          {cylinder.empties_lost}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {/* less pay */}
        {cylinders &&
          cylinders.length > 0 &&
          cylinders.some((cylinder) => cylinder.less_pay > 0) && (
            <div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Less Pay Cylinders.</p>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Cylinder Name</th>
                    <th className="border px-4 py-2">Weight (kg)</th>
                    <th className="border px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cylinders
                    .filter((cylinder) => cylinder.less_pay > 0)
                    .map((cylinder) => (
                      <tr key={cylinder.id}>
                        <td className="border px-4 py-2">
                          {cylinder.gas_type}
                        </td>
                        <td className="border px-4 py-2">{cylinder.weight}</td>
                        <td className="border px-4 py-2">
                          {cylinder.less_pay}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        <div className="mt-6 flex justify-center gap-4 ">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <CircularProgress color="white" size={20} thickness={4} />
            ) : (
              "print"
            )}
          </button>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <CircularProgress color="white" size={20} thickness={4} />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      <AdminsFooter />
    </>
  )
}

export default AfterCollectionAll
