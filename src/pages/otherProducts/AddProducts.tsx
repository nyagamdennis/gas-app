// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import TextField from "@mui/material/TextField"
import CircularProgress from "@mui/material/CircularProgress"
import AddBoxIcon from "@mui/icons-material/AddBox"

import { fetchStore, selectAllStore } from "../../features/store/storeSlice"
import AdminsFooter from "../../components/AdminsFooter"
import KenyanCurrencyInput from "../../components/KenyanCurrencyInput"
import api from "../../../utils/api"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

// Import product actions – adjust the path to match your actual slice

const AddProducts = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { businessId } = useAppSelector((state) => state.planStatus)

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Form state
  const [storeId, setStoreId] = useState("")
  const [productName, setProductName] = useState("")
  const [wholesalePrice, setWholesalePrice] = useState(0)
  const [retailPrice, setRetailPrice] = useState(0)
  const [buyingPrice, setBuyingPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [addingNewProduct, setAddingNewProduct] = useState(false)


  // Advanced Features
      const [batchMode, setBatchMode] = useState(false)
      const [selectedBatchItems, setSelectedBatchItems] = useState([])
      const [lastUpdated, setLastUpdated] = useState(null)
      const [autoRefresh, setAutoRefresh] = useState(false)
      const [realTimeEnabled, setRealTimeEnabled] = useState(false)
      const [dataVersion, setDataVersion] = useState(0)
    
  // Data from Redux
  const stores = useAppSelector(selectAllStore)
  let storeProducts

  // Fetch stores when businessId is available
  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  // Fetch existing products when a store is selected
  // useEffect(() => {
  //   if (storeId) {
  //     dispatch(fetchStoreProducts({ storeId }))
  //   }
  // }, [dispatch, storeId])

  // Duplicate product name check (case‑insensitive)
  useEffect(() => {
    if (!storeId || !productName.trim() || !storeProducts) return

    const exists = storeProducts.some(
      (p: any) =>
        p.product_name?.toLowerCase() === productName.trim().toLowerCase(),
    )

    if (exists) {
      toast.warning(
        "A product with this name already exists in the selected store",
      )
      setProductName("")
    }
  }, [productName, storeId, storeProducts])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!storeId) {
      toast.error("Please select a store")
      return
    }
    if (!productName.trim()) {
      toast.error("Please enter a product name")
      return
    }
    if (wholesalePrice <= 0) {
      toast.error("Wholesale price must be greater than zero")
      return
    }
    if (retailPrice <= 0) {
      toast.error("Retail price must be greater than zero")
      return
    }
    if (buyingPrice <= 0) {
      toast.error("Buying price must be greater than zero")
      return
    }

    setAddingNewProduct(true)

    const payload = {
      store_id: storeId,
      name: productName.trim(),
      wholesale_price: wholesalePrice,
      retail_price: retailPrice,
      buying_price: buyingPrice,
      quantity: quantity,
    }

    try {
      await api.post(`inventory/stores/${storeId}/products/`, payload)
      // Reset form
      setProductName("")
      setWholesalePrice(0)
      setRetailPrice(0)
      setBuyingPrice(0)
      setQuantity(0)
      // setStoreId("")
      toast.success("Product added successfully!")
    } catch (error: any) {
      toast.error(error.message || error.toString() || "Failed to add product")
    } finally {
      setAddingNewProduct(false)
    }
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Add Products"}
            headerText={"Add regulators, burners and other accessories"}
          />
          <ToastContainer />
          <div className="prevent-overflow">
            <RealTimeIndicator
              enabled={autoRefresh}
              lastUpdated={lastUpdated}
              dataVersion={dataVersion}
              onToggle={() => setAutoRefresh(!autoRefresh)}
            />
          </div>

          <main className="flex-grow p-4 pb-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3 text-3xl">🛠️</span>
                  Add New Product
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Fill in the details to add a new product to your inventory
                </p>
              </div>

              {/* Form */}
              <form className="p-6 space-y-6" onSubmit={handleAddProduct}>
                {/* Store Selection */}
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    📍 Select Store *
                  </label>
                  <select
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    required
                  >
                    <option value="">-- Select a store --</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <span className="mr-2">📦</span>
                    Product Information
                  </h3>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Regulator, Single Burner, Double Burner"
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <span className="mr-2">💰</span>
                    Pricing (KES)
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Wholesale Price *
                          </label>
                          <KenyanCurrencyInput
                            value={wholesalePrice}
                            onChange={(value) => setWholesalePrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Retail Price *
                          </label>
                          <KenyanCurrencyInput
                            value={retailPrice}
                            onChange={(value) => setRetailPrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Buying Price *
                          </label>
                          <KenyanCurrencyInput
                            value={buyingPrice}
                            onChange={(value) => setBuyingPrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            // min={0}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {addingNewProduct ? (
                    <button
                      type="button"
                      disabled
                      className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <CircularProgress size={24} style={{ color: "white" }} />
                      Adding Product...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <AddBoxIcon />
                      Add Product to Inventory
                    </button>
                  )}
                </div>
              </form>
            </div>
          </main>

          <footer className="text-white mt-auto">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <p className="text-6xl mb-4">💻</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              Desktop View Coming Soon
            </p>
            <p className="text-gray-600">
              Please use a mobile device or resize your browser window
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddProducts
