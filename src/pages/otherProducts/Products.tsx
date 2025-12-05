// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { toast, ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import CircularProgress from "@mui/material/CircularProgress"
import {
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import {
  deleteOtherProduct,
  fetchOtherProducts,
  getOtherProductstatus,
  selectAllOtherProducts,
  updateOtherProduct,
} from "../../features/store/otherProductsSlice"
import FormattedAmount from "../../components/FormattedAmount"
import Input from "../../components/Input"

const Products = () => {
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
  const otherProductsStatus = useAppSelector(getOtherProductstatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState()
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >()
  const [openDeleteOtherProduct, setOpenDeleteOtherProduct] = useState(false)
  const [selectedOtherProductId, setSelectedOtherProductId] =
    useState<string>("")
  const [openUpdateOtherProduct, setOpenUpdateOtherProduct] = useState(false)
  const [productName, setProductName] = useState("")
  const [productQuantity, setProductQuantity] = useState<number | "">("")
  const [productRetailPrice, setProductRetailPrice] = useState<number | "">("")
  const [productWholeSalePrice, setProductWholeSalePrice] = useState<
    number | ""
  >("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [productBuyingPrice, setProductBuyingPrice] = useState<number | "">("")

  useEffect(() => {
    dispatch(fetchOtherProducts({ businessId }))
  }, [dispatch])

  const handleClickOpenDeleteOtherProduct = (product) => {
    setProductName(product.name)
    setSelectedProduct(product)
    setSelectedOtherProductId(product.id)
    setOpenDeleteOtherProduct(true)
  }

  const handleCloseDeleteOtherProduct = () => {
    setOpenDeleteOtherProduct(false)
    setSelectedProduct(null)
  }

  const handleClickOpenUpdateOtherProduct = (product) => {
    setSelectedProduct(product)
    setSelectedOtherProductId(product.id)
    setProductName(product.name)
    setProductQuantity(product.quantity)
    setProductRetailPrice(product.retail_sales_price)
    setProductBuyingPrice(product.product_buying_price)
    setProductWholeSalePrice(product.whole_sales_price)

    setOpenUpdateOtherProduct(true)
  }

  const handleCloseUpdateOtherProduct = () => {
    setOpenUpdateOtherProduct(false)
    setSelectedProduct(null)
  }

  const handleDeleteOtherProduct = async () => {
    setIsDeleting(true)
    const id = selectedOtherProductId
    try {
      await dispatch(deleteOtherProduct({ id: id })).unwrap()
      setOpenDeleteOtherProduct(false)
      toast.success("Deleted successfully.")
      setSelectedProduct(null)
      setIsDeleting(false)
    } catch (error) {
      setIsDeleting(false)
      toast.error("an error occured, try again.")
    }
  }

  const handleNameInputChange = (e: any) => {
    setProductName(e.target.value)
  }

  const handleProductWholeSalePriceInputChange = (e: any) => {
    setProductWholeSalePrice(e.target.value)
  }

  const handleProductRetailPriceInputChange = (e: any) => {
    setProductRetailPrice(e.target.value)
  }

  const handleProductBuyigPriceInputChange = (e: any) => {
    setProductBuyingPrice(e.target.value)
  }

  const handleProductQuantityInputChange = (e: any) => {
    setProductQuantity(e.target.value)
  }

  const handleUpdateOtherProduct = async () => {
    setIsUpdating(true)
    const id = selectedOtherProductId
    const formData = {
      name: productName,
      whole_sales_price: productWholeSalePrice,
      retail_sales_price: productRetailPrice,
      product_buying_price: productBuyingPrice,
      quantity: productQuantity,
    }
    try {
      await dispatch(updateOtherProduct({ dat: formData, id: id })).unwrap()
      setIsUpdating(false)
      setOpenUpdateOtherProduct(false)
      toast.success("Updated successfully.")
      setSelectedProduct(null)
    } catch (error) {
      console.log("error", error)
      setIsUpdating(false)
      toast.error(error || error.message || "an error occured, try again.")
    }
  }
  return (
    <div>
      <ToastContainer />
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar headerMessage={"ERP"} headerText={""} />
          <main className="flex-grow  p-1">
            <div>
              {otherProductsStatus === "loading" && (
                <div className="flex justify-center items-center h-screen">
                  <CircularProgress />
                </div>
              )}
              {otherProductsStatus === "failed" && (
                <div className="flex justify-center items-center h-screen">
                  <p className="text-red-500">Error loading data</p>
                </div>
              )}
              {otherProductsStatus === "succeeded" &&
                otherProducts.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500">
                    No other products added to store.
                  </div>
                )}
              {otherProductsStatus === "succeeded" &&
                otherProducts.length > 0 && (
                  <div className="mt-2 w-full">
                    {otherProducts.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg mb-2 p-2 bg-white shadow-md"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">Product:</span>
                          <span>{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Quantity:</span>
                          <span>{product.quantity} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Retail Price:</span>
                          <span>
                            <FormattedAmount
                              amount={product.retail_sales_price}
                            />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            Wholesale Price:
                          </span>
                          <span>
                            <FormattedAmount
                              amount={product.whole_sales_price}
                            />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Buying Price:</span>
                          <span>
                            <FormattedAmount
                              amount={product.product_buying_price}
                            />
                          </span>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleClickOpenUpdateOtherProduct(product)
                            }
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              handleClickOpenDeleteOtherProduct(product)
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </main>
          <Dialog
            open={openUpdateOtherProduct}
            onClose={handleCloseUpdateOtherProduct}
          >
            <DialogTitle>Update {productName}</DialogTitle>
            <DialogContent>
              <Input
                autoFocus
                margin="dense"
                id="product-name"
                label="Product Name"
                type="text"
                fullWidth
                variant="standard"
                value={productName}
                onChange={handleNameInputChange}
                required
                error={productName.length === 0}
                helperText={productName.length === 0 ? "Required" : ""}
              />
              <Input
                autoFocus
                margin="dense"
                id="product-wholesale-price"
                label="Product Wholesale Price"
                type="number"
                fullWidth
                variant="standard"
                value={productWholeSalePrice}
                onChange={handleProductWholeSalePriceInputChange}
                required
                error={productWholeSalePrice <= 0}
                helperText={
                  productWholeSalePrice <= 0 ? "Required" : "Enter a number"
                }
              />
              <Input
                autoFocus
                margin="dense"
                id="product-retail-price"
                label="Product Retail Price"
                type="number"
                fullWidth
                variant="standard"
                value={productRetailPrice}
                onChange={handleProductRetailPriceInputChange}
                required
                error={productRetailPrice <= 0}
                helperText={
                  productRetailPrice <= 0 ? "Required" : "Enter a number"
                }
              />
              <Input
                autoFocus
                margin="dense"
                id="product-retail-price"
                label="Product Buying Price"
                type="number"
                fullWidth
                variant="standard"
                value={productBuyingPrice}
                onChange={handleProductBuyigPriceInputChange}
                required
                error={productBuyingPrice <= 0}
                helperText={
                  productBuyingPrice <= 0 ? "Required" : "Enter a number"
                }
              />
              <Input
                autoFocus
                margin="dense"
                id="product-quantity"
                label="Product Quantity"
                type="number"
                fullWidth
                variant="standard"
                value={productQuantity}
                onChange={handleProductQuantityInputChange}
                required
                error={productQuantity <= 0}
                helperText={
                  productQuantity <= 0 ? "Required" : "Enter a number"
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdateOtherProduct}>Cancel</Button>
              <Button onClick={handleUpdateOtherProduct}>
                {isUpdating ? <CircularProgress /> : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* delete product */}
          <Dialog
            open={openDeleteOtherProduct}
            onClose={handleCloseDeleteOtherProduct}
          >
            <DialogTitle>Delete {productName}</DialogTitle>
            <DialogContentText>
              Are you sure you want to delete {productName} permanently?
            </DialogContentText>
            <DialogActions>
              <Button onClick={handleCloseDeleteOtherProduct}>Cancel</Button>
              <Button onClick={handleDeleteOtherProduct}>
                {isDeleting ? <CircularProgress /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          <footer className=" text-white">
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

export default Products
