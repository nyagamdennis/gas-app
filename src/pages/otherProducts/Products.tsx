// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { toast, ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import CircularProgress from "@mui/material/CircularProgress"
import { Button, Skeleton } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import {
  deleteOtherProduct,
  fetchOtherProducts,
  getOtherProductsStatus,
  selectAllOtherProducts,
  updateOtherProduct,
} from "../../features/store/productsSlice"
import FormattedAmount from "../../components/FormattedAmount"
import {
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
} from "../../features/store/storeSlice"
import { useNavigate } from "react-router-dom"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

const Products = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { businessId } = planStatus()

  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreStatus) // ← use the correct selector for store loading
  const fetchingStoreError = useAppSelector(getStoreError)
  const otherProducts = useAppSelector(selectAllOtherProducts)
  const otherProductsStatus = useAppSelector(getOtherProductsStatus)

  const [storeId, setStoreId] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [productName, setProductName] = useState("")
  const [productQuantity, setProductQuantity] = useState<number | "">("")
  const [productSpoiled, setProductSpoiled] = useState<number | "">("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)


  // Advanced Features
      const [batchMode, setBatchMode] = useState(false)
      const [selectedBatchItems, setSelectedBatchItems] = useState([])
      const [lastUpdated, setLastUpdated] = useState(null)
      const [autoRefresh, setAutoRefresh] = useState(false)
      const [realTimeEnabled, setRealTimeEnabled] = useState(false)
      const [dataVersion, setDataVersion] = useState(0)
    
  // 1. Fetch stores on mount
  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  // 2. Auto-select when there is exactly one store
  useEffect(() => {
    if (fetchingStoreStatus === "succeeded" && store.length === 1) {
      setStoreId(store[0].id.toString())
    }
  }, [fetchingStoreStatus, store])

  // 3. Re-fetch products whenever storeId changes
  useEffect(() => {
    if (storeId) {
      dispatch(fetchOtherProducts({ storeId }))
    }
  }, [storeId, dispatch])

  // --- Dialog handlers ---
  const openDelete = (product) => {
    console.log("Opening delete dialog for product:", product)
    setSelectedProduct(product)
    setProductName(product.product?.name)
    setOpenDeleteDialog(true)
  }

  const closeDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedProduct(null)
  }

  const openUpdate = (product) => {
    setSelectedProduct(product)
    setProductName(product.product?.name)
    setProductQuantity(product.quantity)
    setProductSpoiled(product.spoiled_product_quantity || 0)
    setOpenUpdateDialog(true)
  }

  const closeUpdate = () => {
    setOpenUpdateDialog(false)
    setSelectedProduct(null)
  }

  // --- Action handlers ---
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log("Attemting to delete product with store ID:", storeId, "and product ID:", selectedProduct?.id)
      await dispatch(deleteOtherProduct({ store_id: storeId, id: selectedProduct?.id })).unwrap()
      toast.success("Product deleted successfully.")
      closeDelete()
    } catch {
      toast.error("An error occurred, try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await dispatch(
        updateOtherProduct({
          id: selectedProduct?.id,
          dat: {
            product_id: selectedProduct?.product?.id,
            quantity: productQuantity,
            spoiled_product_quantity: productSpoiled,
          },
        }),
      ).unwrap()
      toast.success("Product updated successfully.")
      closeUpdate()
    } catch (error) {
      toast.error(error?.message || "An error occurred, try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // --- Sub-components / helpers ---
  const renderEmptyState = () => {
    if (fetchingStoreStatus === "loading") {
      return (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )
    }

    if (!storeId) {
      return (
        <div className="text-center p-12 bg-white rounded-lg shadow-md">
          {store.length === 0 ? (
            <>
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">
                No stores found. Please create a store first.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🏪</div>
              <p className="text-gray-500 text-lg">
                Please select a store to view products
              </p>
            </>
          )}
        </div>
      )
    }

    if (otherProductsStatus === "loading") {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md">
              <Skeleton variant="text" height={28} width="60%" />
              <Skeleton
                variant="text"
                height={20}
                width="80%"
                className="mt-2"
              />
              <Skeleton
                variant="text"
                height={20}
                width="40%"
                className="mt-2"
              />
            </div>
          ))}
        </div>
      )
    }

    if (otherProductsStatus === "failed") {
      return (
        <div className="text-center p-12 bg-red-50 rounded-lg shadow-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium text-lg">
            Error loading products. Please try again later.
          </p>
        </div>
      )
    }

    if (otherProductsStatus === "succeeded" && otherProducts.length === 0) {
      return (
        <div className="text-center p-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 mb-2 text-lg">
            No products available in this store.
          </p>
          <button
            onClick={() => navigate(`/store/othersproductslist/add/${storeId}`)}
            className="text-blue-600 hover:underline font-medium"
          >
            Add products to inventory
          </button>
        </div>
      )
    }

    return null
  }

  if (!isMobile) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer />
      <Navbar headerMessage="ERP" headerText="Manage your product inventory" />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      <main className="flex-grow m-2 p-1">
        {/* Header + Store Selector */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📦</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Product Inventory
              </h2>
              <p className="text-sm text-gray-600">
                Manage your store products
              </p>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Store
            </label>
            <select
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
            >
              {store.length !== 1 && (
                <option value="">-- Select a store --</option>
              )}
              {store.map((s) => (
                <option key={s.id} value={s.id.toString()}>
                  {s.name} Store
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty / loading / error states */}
        {renderEmptyState()}

        {/* Products list */}
        {otherProductsStatus === "succeeded" && otherProducts.length > 0 && (
          <div className="space-y-3">
            {otherProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Card header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">📦</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {product.product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-blue-100">
                        Store: {product.store_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 font-medium">
                        Available
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {product.quantity || 0}
                      </p>
                      <p className="text-xs text-gray-500">items</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-xs text-gray-600 font-medium">
                        Spoiled
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {product.spoiled_product_quantity || 0}
                      </p>
                      <p className="text-xs text-gray-500">items</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Total Items:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {(product.quantity || 0) +
                          (product.spoiled_product_quantity || 0)}
                      </span>
                    </div>
                  </div>

                  {product.product?.prices && (
                    <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Pricing Information
                      </p>
                      <p className="text-sm text-gray-500">
                        Retail Price:{" "}
                        <FormattedAmount
                          amount={product.product.prices.retail_sales_price}
                        />
                      </p>
                      <p className="text-sm text-gray-500">
                        Wholesale Price:{" "}
                        <FormattedAmount
                          amount={product.product.prices.whole_sales_price}
                        />
                      </p>
                      <p className="text-sm text-gray-500">
                        Cost Price:{" "}
                        <FormattedAmount
                          amount={product.product.prices.product_buying_price}
                        />
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    <p>
                      Added: {new Date(product.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      Updated:{" "}
                      {new Date(product.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openUpdate(product)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center"
                    >
                      <span className="mr-2">✏️</span>Update
                    </button>
                    <button
                      onClick={() => openDelete(product)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center"
                    >
                      <span className="mr-2">🗑️</span>Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Update Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={closeUpdate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-bold text-xl">
          Update {productName}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            {[
              {
                label: "Store",
                value: selectedProduct?.store_name || "",
                note: "Product store cannot be changed",
              },
              {
                label: "Product Name",
                value: productName,
                note: "Product name cannot be changed",
              },
            ].map(({ label, value, note }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={value}
                  disabled
                  className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">{note}</p>
              </div>
            ))}

            {[
              { label: "Wholesale Price", key: "whole_sales_price" },
              { label: "Retail Price", key: "retail_sales_price" },
              { label: "Buying Price", key: "product_buying_price" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type="text"
                  value={
                    selectedProduct?.product?.prices?.[key]
                      ? `Ksh${selectedProduct.product.prices[key]}`
                      : "N/A"
                  }
                  disabled
                  className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Quantity
              </label>
              <input
                type="number"
                min="0"
                value={productQuantity}
                onChange={(e) => setProductQuantity(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Spoiled Quantity
              </label>
              <input
                type="number"
                min="0"
                value={productSpoiled}
                onChange={(e) => setProductSpoiled(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Enter spoiled quantity"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Total Items:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {(Number(productQuantity) || 0) +
                    (Number(productSpoiled) || 0)}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={closeUpdate} className="text-gray-600">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={
              isUpdating ||
              Number(productQuantity) < 0 ||
              Number(productSpoiled) < 0
            }
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <CircularProgress size={20} />
                Updating...
              </span>
            ) : (
              "Update Product"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={closeDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-bold text-xl text-red-600">
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-700">
            Are you sure you want to delete <strong>{productName}</strong>{" "}
            permanently? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={closeDelete} className="text-gray-600">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <CircularProgress size={20} />
                Deleting...
              </span>
            ) : (
              "Delete Product"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <footer className="text-white mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default Products
