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
import Input from "../../components/Input"
import {
  fetchStore,
  getStoreError,
  selectAllStore,
} from "../../features/store/storeSlice"
import { getStoreCylindersStatus } from "../../features/store/storeCylindersSlice"

const Products = () => {
  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreCylindersStatus)
  const fetchingStoreError = useAppSelector(getStoreError)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {
    isPro,
    isTrial,
    isExpired,
    businessName,
    businessId,
    businessLogo,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const otherProducts = useAppSelector(selectAllOtherProducts)
  const otherProductsStatus = useAppSelector(getOtherProductsStatus)
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [storeId, setStoreId] = useState("")
  const [selectedProduct, setSelectedProduct] = useState()
  const [openDeleteOtherProduct, setOpenDeleteOtherProduct] = useState(false)
  const [openUpdateOtherProduct, setOpenUpdateOtherProduct] = useState(false)
  const [productName, setProductName] = useState("")
  const [productQuantity, setProductQuantity] = useState<number | "">("")
  const [productSpoiled, setProductSpoiled] = useState<number | "">("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  useEffect(() => {
    if (fetchingStoreStatus === "succeeded" && store.length === 1 && !storeId) {
      setStoreId(store[0].id.toString())
    }
  }, [fetchingStoreStatus, store, storeId])

  useEffect(() => {
    if (storeId) {
      dispatch(fetchOtherProducts({ storeId }))
    }
  }, [dispatch, storeId])

  const handleClickOpenDeleteOtherProduct = (product) => {
    setProductName(product.product?.name)
    setSelectedProduct(product)
    setOpenDeleteOtherProduct(true)
  }

  const handleCloseDeleteOtherProduct = () => {
    setOpenDeleteOtherProduct(false)
    setSelectedProduct(null)
  }

  const handleClickOpenUpdateOtherProduct = (product) => {
    setSelectedProduct(product)
    setProductName(product.product?.name)
    setProductQuantity(product.quantity)
    setProductSpoiled(product.spoiled_product_quantity || 0)
    setOpenUpdateOtherProduct(true)
  }

  const handleCloseUpdateOtherProduct = () => {
    setOpenUpdateOtherProduct(false)
    setSelectedProduct(null)
  }

  const handleDeleteOtherProduct = async () => {
    setIsDeleting(true)
    const id = selectedProduct?.id
    try {
      await dispatch(deleteOtherProduct({ id: id })).unwrap()
      setOpenDeleteOtherProduct(false)
      toast.success("Product deleted successfully.")
      setSelectedProduct(null)
      setIsDeleting(false)
    } catch (error) {
      setIsDeleting(false)
      toast.error("An error occurred, try again.")
    }
  }

  const handleUpdateOtherProduct = async () => {
    setIsUpdating(true)
    const id = selectedProduct?.id
    const formData = {
      product_id: selectedProduct?.product?.id,
      quantity: productQuantity,
      spoiled_product_quantity: productSpoiled,
    }
    try {
      await dispatch(updateOtherProduct({ dat: formData, id: id })).unwrap()
      setIsUpdating(false)
      setOpenUpdateOtherProduct(false)
      toast.success("Product updated successfully.")
      setSelectedProduct(null)
    } catch (error) {
      console.log("error", error)
      setIsUpdating(false)
      toast.error(error?.message || "An error occurred, try again.")
    }
  }

  return (
    <div>
      <ToastContainer />
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your product inventory"}
          />

          <main className="flex-grow m-2 p-1">
            {/* Header Section */}
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

              {/* Store Selector */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Store
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                >
                  <option value="">-- Select a store --</option>
                  {store.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} Store
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {otherProductsStatus === "loading" && (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
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
            )}

            {/* Error State */}
            {otherProductsStatus === "failed" && (
              <div className="text-center p-12 bg-red-50 rounded-lg shadow-md">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-500 font-medium text-lg">
                  Error loading products. Please try again later.
                </p>
              </div>
            )}

            {/* Empty State - No Store Selected */}
            {!storeId && otherProductsStatus !== "loading" && (
              <div className="text-center p-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">🏪</div>
                <p className="text-gray-500 text-lg">
                  Please select a store to view products
                </p>
              </div>
            )}

            {/* Empty State - No Products */}
            {storeId &&
              otherProductsStatus === "succeeded" &&
              otherProducts.length === 0 && (
                <div className="text-center p-12 bg-white rounded-lg shadow-md">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 mb-2 text-lg">
                    No products available in this store.
                  </p>
                  <button className="text-blue-600 hover:underline font-medium">
                    Add products to inventory
                  </button>
                </div>
              )}

            {/* Products List */}
            {otherProductsStatus === "succeeded" &&
              otherProducts.length > 0 && (
                <div className="space-y-3">
                  {otherProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                    >
                      {/* Product Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                        <div className="flex items-center justify-between">
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
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        {/* Quantity Stats */}
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

                        {/* Total */}
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

                        {/* Pricing Info (if available) */}
                        {product.product?.prices && (
                          <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Pricing Information
                            </p>
                            {/* Add pricing details here if available */}
                            <p className="text-sm text-gray-500">
                              Pricing details available
                            </p>
                          </div>
                        )}

                        {/* Date Info */}
                        <div className="text-xs text-gray-500 mb-4">
                          <p>
                            Added:{" "}
                            {new Date(product.created_at).toLocaleDateString()}
                          </p>
                          <p>
                            Updated:{" "}
                            {new Date(product.updated_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleClickOpenUpdateOtherProduct(product)
                            }
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center"
                          >
                            <span className="mr-2">✏️</span>
                            Update
                          </button>
                          <button
                            onClick={() =>
                              handleClickOpenDeleteOtherProduct(product)
                            }
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center"
                          >
                            <span className="mr-2">🗑️</span>
                            Delete
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
            open={openUpdateOtherProduct}
            onClose={handleCloseUpdateOtherProduct}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle className="font-bold text-xl">
              Update {productName}
            </DialogTitle>
            <DialogContent>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    disabled
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Product name cannot be changed
                  </p>
                </div>

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
              <Button
                onClick={handleCloseUpdateOtherProduct}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateOtherProduct}
                variant="contained"
                disabled={
                  isUpdating || productQuantity < 0 || productSpoiled < 0
                }
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <CircularProgress size={20} className="mr-2" />
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
            open={openDeleteOtherProduct}
            onClose={handleCloseDeleteOtherProduct}
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
              <Button
                onClick={handleCloseDeleteOtherProduct}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteOtherProduct}
                variant="contained"
                color="error"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <CircularProgress size={20} className="mr-2" />
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

export default Products
