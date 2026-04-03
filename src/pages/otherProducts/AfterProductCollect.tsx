// @ts-nocheck
import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/ui/AdminNav'
import { toast } from 'react-toastify'
import api from '../../../utils/api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllCollections } from '../../features/collections/collectionsSlice'
import { getAssignsError } from '../../features/assigns/assignsSlice'
import AdminsFooter from '../../components/AdminsFooter'
import RealTimeIndicator from '../../components/sales/RealTimeIndicator'

const AfterProductCollect = () => {
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const { receiptNumber } = useParams()
  const dispatch = useAppDispatch()


  // Advanced Features
      const [batchMode, setBatchMode] = useState(false)
      const [selectedBatchItems, setSelectedBatchItems] = useState([])
      const [lastUpdated, setLastUpdated] = useState(null)
      const [autoRefresh, setAutoRefresh] = useState(false)
      const [realTimeEnabled, setRealTimeEnabled] = useState(false)
      const [dataVersion, setDataVersion] = useState(0)
    
  
  const [receiptData, setReceiptData] = useState([])


  useEffect(() => {
    const fetchReceipt = async () => {
      if (!receiptNumber) return

      try {
        const response = await api.get(`/inventory/receipts/${receiptNumber}/`)

        setReceiptData(response.data)
        console.log("last receipt data: ", response.data)
      } catch (error) {
        console.error("Error fetching receipt:", error)
      }
    }

    fetchReceipt()
  }, [receiptNumber])


  const handleSave = async () => {
    if (!printComplete) {
      setIsSaving(true)
      try {
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
    if (!receiptData?.receipt_number) {
      toast.error("Receipt number not available")
      return
    }

    setIsDownloadingPDF(true)
    try {
      const response = await api.get(
        `/inventory/receipts/${receiptNumber}/product-pdf/`,
        {
          responseType: "blob",
        },
      )

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
        headerMessage={"Collect All Cylinders"}
        headerText={"Collect cylinders from your retailers or wholesalers"}
      />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {receiptData && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Receipt Number</p>
                  <p className="text-lg font-bold text-green-600">
                    {receiptData.receipt_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold text-green-600">
                    {receiptData.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-lg font-bold text-purple-600">
                    {receiptData.total_items}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    From Location
                  </p>
                  <p className="text-gray-600">
                    {receiptData.from_shop_name ||
                      receiptData.from_location_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {receiptData.from_location_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    To Location
                  </p>
                  <p className="text-gray-600">
                    {receiptData.to_store_name || receiptData.to_location_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {receiptData.to_location_type}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Transferred By:</span>{" "}
                    {receiptData.transferred_by_name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Transfer Date:</span>{" "}
                    {new Date(receiptData.transfer_date).toLocaleString()}
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

        {receiptData?.items && receiptData.items.length > 0 && (
          <div className="max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Transfer Summary
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {receiptData.items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.item_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity:{" "}
                      <span className="font-bold">{item.quantity}</span>
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
                      {item.total_quantity}
                    </p>
                    <p className="text-xs text-gray-500">units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AdminsFooter />
    </>
  )
}

export default AfterProductCollect