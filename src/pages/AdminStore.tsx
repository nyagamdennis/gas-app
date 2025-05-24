// @ts-nocheck
import React, { useEffect, useState } from "react"
import LeftNav from "../components/ui/LeftNav"
import NavBar from "../components/ui/NavBar"
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
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addAnotherCylinder,
  addNewCylinders,
  deleteCylinder,
  deleteThisCylinder,
  fetchStore,
  getStoreStatus,
  refillEmpties,
  selectAllStore,
  storeRefillCylinders,
  updateTheCylinder,
  updateThisCylinder,
} from "../features/store/storeSlice"
import { TransitionProps } from "@mui/material/transitions"
import Slide from "@mui/material/Slide"
import {
  addNewProduct,
  deleteOtherProduct,
  fetchOtherProducts,
  getOtherProductsError,
  getOtherProductstatus,
  selectAllOtherProducts,
  updateOtherProduct,
} from "../features/store/otherProductsSlice"
import FormattedAmount from "../components/FormattedAmount"
import AddBoxIcon from "@mui/icons-material/AddBox"

import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import AdminsFooter from "../components/AdminsFooter"
import Input from "../components/Input"
import CircularProgress from "@mui/material/CircularProgress"
import { set } from "cookies"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import StoreCard from "../components/StoreCard"
import planStatus from "../features/planStatus/planStatus"
import { Link } from "react-router-dom"
import AdminNav from "../components/ui/AdminNav"
import api from "../../utils/api"

const AdminStore = () => {
  const [refillingCylinders, setRefillingCylinders] = useState(false);
  const [activeTab, setActiveTab] = useState("cylinders")
  const dispatch = useAppDispatch()
  const [openAssign, setOpenAssign] = useState<boolean>(false)
  const [openSell, setOpenSell] = useState<boolean>(false)
  const [activeForm, setActiveForm] = useState<string>("cylinders")
  const addOtherProductsError = useAppSelector(getOtherProductsError)
  const otherProductsStatus = useAppSelector(getOtherProductstatus)

  const store = useAppSelector(selectAllStore)
  const otherProducts = useAppSelector(selectAllOtherProducts)
  const updatingCylinderStatus = useAppSelector(
    (state) => state.store.updateCylinderStatus,
  )
  const updatingCylinderError = useAppSelector(
    (state) => state.store.updateCylinderError,
  )
  const storeStatus = useAppSelector(getStoreStatus)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [selectedEmpties, setSelectedEmpties] = useState<number>(0)
  const [refillAmount, setRefillAmount] = useState<number>()
  const [refillId, setRefillId] = useState<string>()
  const [refillValue, setRefillValue] = useState<number>()

  const [soldId, setSoldId] = useState<string>()

  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >()
  const [selectedProduct, setSelectedProduct] = useState()
  const [quantity, setQuantity] = useState(1)
  const [fullyPaid, setFullyPaid] = useState(true)
  const [saleType, setSaleType] = useState("COMPLETESALE")
  const [salesTyleWholeSaleRetail, setSalesTyleWholeSaleRetail] =
    useState("RETAIL")
  const [deposit, setDeposit] = useState(0)
  const [isExhanged, setIsExchanged] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocation, setCustomerLocation] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [debt, setDebt] = useState()
  const [repayDate, setRepayDate] = useState("")
  const [totalPaid, setTotalPaid] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [gasType, setGasType] = useState<string>("")
  const [minRetailSellingPrice, setMinRetailSellingPrice] = useState<number>(0)
  const [minRetailRefillingPrice, setMinRetailRefillingPrice] =
    useState<number>(0)
  const [minWholeSaleSellingPrice, setMinWholeSellingPrice] =
    useState<number>(0)
  const [minWholeSaleRefillingPrice, setMinWholeRefillingPrice] =
    useState<number>(0)
  const [maxRetailSellingPrice, setMaxRetailSellingPrice] = useState<number>(0)
  const [maxRetailRefillingPrice, setMaxRetailRefillingPrice] =
    useState<number>(0)
  const [emptyCylinderPrice, setEmptyCylinderPrice] = useState<number>(0)
  const [depotRefillPrice, setDepotRefillPrice] = useState<number>(0)
  const [maxWholeSaleSellingPrice, setMaxWholeSellingPrice] =
    useState<number>(0)
  const [maxWholeSaleRefillingPrice, setMaxWholeRefillingPrice] =
    useState<number>(0)
  const [cylinderWeight, setCylinderWeight] = useState<number>(0)
  const [gasEmpties, setGasEmpties] = useState<number>(0)
  const [gasFilled, setGasFilled] = useState<number>(0)
  const [gasSpoiled, setGasSpoiled] = useState<number>(0)
  const [productName, setProductName] = useState<string>("")
  const [productWholeSalePrice, setProductWholeSalePrice] = useState<number>(0)
  const [productRetailPrice, setProductRetailPrice] = useState<number>(0)
  const [productBuyingPrice,setProductBuyingPrice] = useState<number>(0)
  const [productQuantity, setProductQuantity] = useState<number>(0)
  const [openUpdateCylinder, setOpenUpdateCylinder] = useState<boolean>(false)
  const [updateCylinderId, setUpdateCylinderID] = useState<string>("")
  const [updateCylinderName, setUpdateCylinderName] = useState<string>("")
  const [openAddAnotherCylinder, setOpenAddAnotherCylinder] =
    useState<boolean>(false)
  const [anotherCylinderWeight, setAnotherCylinderWeight] = useState<number>()
  const [anotherCylinderFilled, setAnotherCylinderFilled] = useState<number>()
  const [anotherCylinderEmpties, setAnotherCylinderEmpties] = useState<number>()
  const [
    anotherCylinderMinWholeSaleSelling,
    setAnotherCylinderMinWholeSaleSelling,
  ] = useState<number>()
  const [
    anotherCylinderMinWholeSaleRefill,
    setAnotherCylinderMinWholeSaleRefill,
  ] = useState<number>()
  const [anotherCylinderMinRetailRefill, setAnotherCylinderMinRetailRefill] =
    useState<number>()
  const [anotherCylinderMinRetailSelling, setAnotherCylinderMinRetailSelling] =
    useState<number>()
  const [
    anotherCylinderMaxWholeSaleSelling,
    setAnotherCylinderMaxWholeSaleSelling,
  ] = useState<number>()
  const [
    anotherCylinderMaxWholeSaleRefill,
    setAnotherCylinderMaxWholeSaleRefill,
  ] = useState<number>()
  const [anotherCylinderMaxRetailRefill, setAnotherCylinderMaxRetailRefill] =
    useState<number>()
  const [
    anotherCylinderEmptyCylinderPrice,
    setAnotherCylinderEmptyCylinderPrice,
  ] = useState<number>(0)
  const [anotherCylinderMaxRetailSelling, setAnotherCylinderMaxRetailSelling] =
    useState<number>()
  const [anotherCylinderSpoiled, setAnotherCylinderSpoiled] = useState<number>()
  const [anotherCylinderId, setAnotherCylinderId] = useState<string>("")
  const [anotherCylinderName, setAnotherCylinderName] = useState<string>("")
  const [openDeleteCylinder, setOpenDeleteCylinder] = useState<boolean>(false)
  const [deleteCylinderId, setDeleteCylinderId] = useState<string>("")
  const [deleteCylinderName, setDeleteCylinderName] = useState<string>("")

  const [openUpdateCylinderData, setOpenUpdateCylinderData] =
    useState<boolean>(false)
  const [openDeleteCylinderData, setOpenDeleteCylinderData] =
    useState<boolean>(false)
  const [deleteCylinderDataId, setDeleteCylinderDataId] = useState<string>("")
  const [deleteCylinderDataName, setDeleteCylinderDataName] =
    useState<string>("")
  const [deleteCylinderDataWeightId, setDeleteCylinderDataWeightId] =
    useState<string>("")
  const [deleteCylinderDataWeight, setDeleteCylinderDataWeight] =
    useState<string>("")
  const [updateCylinderDataName, setUpdateCylinderDataName] =
    useState<string>("")
  const [updateCylinderData, setUpdateCylinderData] = useState<string>("")
  const [updateCylinderDataWeight, setUpdateCylinderDataWeight] =
    useState<number>()
  const [updateCylinderDataFilled, setUpdateCylinderDataFilled] =
    useState<number>()
  const [updateCylinderDataEmpties, setUpdateCylinderDataEmpties] =
    useState<number>()
  const [updateCylinderDataSpoiled, setUpdateCylinderDataSpoiled] =
    useState<number>()
  const [
    updateCylinderDataWholesaleSelling,
    setUpdateCylinderDataWholesaleSelling,
  ] = useState<number>()
  const [
    updateCylinderDataWholesaleRefill,
    setUpdateCylinderDataWholesaleRefill,
  ] = useState<number>()
  const [updateCylinderDataRetailSelling, setUpdateCylinderDataRetailSelling] =
    useState<number>()
  const [updateCylinderDataRetailRefill, setUpdateCylinderDataRetailRefill] =
    useState<number>()

  const handleCustomerNameInput = (e: any) => setCustomerName(e.target.value)
  const handleCustomerPhoneInput = (e: any) => setCustomerPhone(e.target.value)
  const handleCustomerLocationInput = (e: any) =>
    setCustomerLocation(e.target.value)
  const handleSelectedProduct = (e: any) => setSelectedProduct(e.target.value)
  const addCylinderError = useAppSelector(
    (state) => state.store.addNewCylinderError,
  )

  const [submittingOtherProducts, setSubmittingOtherProducts] = useState(false)
  const [openUpdateOtherProduct, setOpenUpdateOtherProduct] = useState(false)
  const [selectedOtherProduct, setSelectedOtherProduct] = useState(null)
  const [addingNewCylinder, setAddingNewCylinder] = useState(false)
  const [selectedOtherProductId, setSelectedOtherProductId] =
    useState<string>("")

  const [openDeleteOtherProduct, setOpenDeleteOtherProduct] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState(null) // 'update' | 'delete' | 'add'
  const [selectedGas, setSelectedGas] = useState(null)
  const [selectedGasData, setSelectedGasData] = useState(null)
  const [selectedGasCylinder, setSelectedGasCylinder] = useState(null)
  // console.log("selected gas", selectedGas)
  // console.log("selected gas data", selectedGasData);
  const [storeRefill, setStoreRefill] = useState([])
  const [storeRepair, setStoreRepair] = useState([])

  const [dialogOpenAgain, setDialogOpenAgain] = useState(false)
  const [dialogTypeAgain, setDialogTypeAgain] = useState(null) // 'update' | 'delete'

  const [openRefill, setOpenRefill] = React.useState(false)

  const handleClickOpenRefills = () => {
    setOpenRefill(true)
  }

  const handleCloseRefills = () => {
    setOpenRefill(false)
  }

  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

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

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
      dispatch(fetchOtherProducts({ businessId }))
    }
  }, [businessId, dispatch])

  const handleCloseDeleteOtherProduct = () => {
    setOpenDeleteOtherProduct(false)
    setSelectedProduct(null)
  }

  const handleClickOpenDeleteOtherProduct = (product) => {
    setSelectedProduct(product)
    setSelectedOtherProductId(product.id)

    setOpenDeleteOtherProduct(true)
  }

  const handleCloseUpdateOtherProduct = () => {
    setOpenUpdateOtherProduct(false)
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
      setIsUpdating(false)
      toast.error("an error occured, try again.")
    }
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

  const handleOpenDeleteCylinderData = (
    id: string,
    cylinderWeightId: string,
    cylinderName: string,
    cylinderWeight: string,
  ) => {
    setDeleteCylinderDataName(cylinderName)
    setDeleteCylinderDataWeight(cylinderWeight)
    setDeleteCylinderDataWeightId(cylinderWeightId)
    setDeleteCylinderDataId(id)

    setOpenDeleteCylinderData(true)
  }

  const handleCloseDeleteCylinderData = () => {
    setOpenDeleteCylinderData(false)
  }

  const handleOpenUpdateCylinderData = (
    id: string,
    cylindersName: string,
    dataRest: any,
  ) => {
    setUpdateCylinderDataName(cylindersName)
    setUpdateCylinderData(dataRest)
    setUpdateCylinderDataWeight(dataRest?.weight?.weight)
    setUpdateCylinderDataFilled(dataRest?.stores[0]?.filled)
    setUpdateCylinderDataEmpties(dataRest?.stores[0]?.empties)
    setUpdateCylinderDataWholesaleSelling(
      dataRest?.stores[0]?.cylinder_details?.wholesale_selling_price,
    )
    setUpdateCylinderDataWholesaleRefill(
      dataRest?.stores[0]?.cylinder_details?.wholesale_refil_price,
    )
    setUpdateCylinderDataRetailSelling(
      dataRest?.stores[0]?.cylinder_details?.retail_selling_price,
    )
    setUpdateCylinderDataRetailRefill(
      dataRest?.stores[0]?.cylinder_details?.retail_refil_price,
    )
    setUpdateCylinderDataSpoiled(dataRest?.stores[0]?.spoiled)
    setOpenUpdateCylinderData(true)
  }

  const handleCloseUpdateCylinderData = () => {
    setOpenUpdateCylinderData(false)
  }

  const handleUpdateCylinderDataWeightInputChange = (e: any) => {
    setUpdateCylinderDataWeight(e.target.value)
  }

  const handleUpdateCylinderDataFilledInputChange = (e: any) => {
    setUpdateCylinderDataFilled(e.target.value)
  }

  const handleUpdateCylinderDataEmptiesInputChange = (e: any) => {
    setUpdateCylinderDataEmpties(e.target.value)
  }

  const handleUpdateCylinderDataWholeSaleSellingInputChange = (e: any) => {
    setUpdateCylinderDataWholesaleSelling(e.target.value)
  }

  const handleUpdateCylinderDataWholeSaleRefillInputChange = (e: any) => {
    setUpdateCylinderDataWholesaleRefill(e.target.value)
  }

  const handleUpdateCylinderDataRetailSellingInputChange = (e: any) => {
    setUpdateCylinderDataRetailSelling(e.target.value)
  }

  const handleUpdateCylinderDataRetailRefillInputChange = (e: any) => {
    setUpdateCylinderDataRetailRefill(e.target.value)
  }

  const handleUpdateCylinderDataSpoiledInputChange = (e: any) => {
    setUpdateCylinderDataSpoiled(e.target.value)
  }

  const handleAnotherCylinderWeightInputChange = (e: any) => {
    setAnotherCylinderWeight(e.target.value)
  }

  const handleAnotherCylinderFilledInputChange = (e: any) => {
    setAnotherCylinderFilled(e.target.value)
  }

  const handleAnotherCylinderEmptyInputChange = (e: any) => {
    setAnotherCylinderEmpties(e.target.value)
  }

  const handleAnotherCylinderMinWholesaleSellingInputChange = (e: any) => {
    setAnotherCylinderMinWholeSaleSelling(e.target.value)
  }

  const handleAnotherCylinderMinWholesaleRefillingInputChange = (e: any) => {
    setAnotherCylinderMinWholeSaleRefill(e.target.value)
  }

  const handleAnotherCylinderMinRetailRefillInputChange = (e: any) => {
    setAnotherCylinderMinRetailRefill(e.target.value)
  }

  const handleAnotherCylinderMinRetailSellingInputChange = (e: any) => {
    setAnotherCylinderMinRetailSelling(e.target.value)
  }

  const handleAnotherCylinderMaxWholesaleSellingInputChange = (e: any) => {
    setAnotherCylinderMaxWholeSaleSelling(e.target.value)
  }

  const handleAnotherCylinderMaxWholesaleRefillingInputChange = (e: any) => {
    setAnotherCylinderMaxWholeSaleRefill(e.target.value)
  }

  const handleAnotherCylinderMaxRetailRefillInputChange = (e: any) => {
    setAnotherCylinderMaxRetailRefill(e.target.value)
  }

  const handleAnotherCylinderMaxRetailSellingInputChange = (e: any) => {
    setAnotherCylinderMaxRetailSelling(e.target.value)
  }

  const handleAnotherCylinderSpoiledInputChange = (e: any) => {
    setAnotherCylinderSpoiled(e.target.value)
  }

  const handleOpenAddAnotherCylinder = (id: string, cylinderName: string) => {
    setAnotherCylinderId(id)
    setAnotherCylinderName(cylinderName)
    setOpenAddAnotherCylinder(true)
  }

  const handleCloseDeleteCylinder = () => {
    setOpenDeleteCylinder(false)
  }

  const handleOpenDeleteCylinder = (id: string, cylinderDeleteName: string) => {
    setDeleteCylinderName(cylinderDeleteName)
    setDeleteCylinderId(id)
    setOpenDeleteCylinder(true)
  }

  const handleDeleteCylinder = async (id) => {
    try {
      await dispatch(deleteCylinder({ id }))
      setDialogOpen(false)
      setDeleteCylinderId("")
      toast.success("Deleted successfully.")
    } catch (error) {
      toast.error("an error occured, try again.")
    }
  }

  const handleDeleteThisCylinder = async () => {
    const id = selectedGasCylinder?.id
    const cylinderWeight = selectedGasCylinder?.weight?.id
    console.log("id to delete cylinder ", selectedGasCylinder)
    console.log("cylinder weight ", cylinderWeight)

    try {
      await dispatch(deleteThisCylinder({ id, cylinderWeight })).unwrap()
      setDialogOpenAgain(false)
      setDeleteCylinderId("")
      toast.success("Deleted successfully.")
    } catch (error) {
      toast.error("an error occured, try again.")
    }
  }

  const handleOpenDialog = (type, gas) => {
    setDialogType(type)
    setSelectedGas(gas)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogType(null)
    setSelectedGas(null)
  }

  const handleOpenDialogAgain = (type, gas, cylinder) => {
    // console.log('selected cylinder again', cylinder)
    setDialogTypeAgain(type)
    setSelectedGasData(gas)
    setSelectedGasCylinder(cylinder)
    setDialogOpenAgain(true)
  }

  const handleCloseDialogAgain = () => {
    setDialogOpenAgain(false)
    setDialogTypeAgain(null)
    setSelectedGasData(null)
    setSelectedGasCylinder(null)
  }

  const handleCloseAddAnotherCylinder = () => {
    setOpenAddAnotherCylinder(false)
  }

  const handleAddAnotherCylinder = async () => {
    // setAnotherCylinderId(id);
    const formData = {
      weight: anotherCylinderWeight,
      empties: anotherCylinderEmpties,
      filled: anotherCylinderFilled,
      spoiled: anotherCylinderSpoiled,
      min_wholesale_selling_price: anotherCylinderMinWholeSaleSelling,
      min_wholesale_refill_price: anotherCylinderMinWholeSaleRefill,
      min_retail_selling_price: anotherCylinderMinRetailSelling,
      min_retail_refill_price: anotherCylinderMinRetailRefill,

      max_wholesale_selling_price: anotherCylinderMaxWholeSaleSelling,
      max_wholesale_refill_price: anotherCylinderMaxWholeSaleRefill,
      max_retail_selling_price: anotherCylinderMaxRetailSelling,
      max_retail_refill_price: anotherCylinderMaxRetailRefill,
      empty_cylinder_price: anotherCylinderEmptyCylinderPrice,
    }
    try {
      await dispatch(
        addAnotherCylinder({ dat: formData, id: selectedGas.id }),
      ).unwrap()
      setDialogOpen(false)
      setAnotherCylinderId("")
      setAnotherCylinderName("")
      setAnotherCylinderWeight(0)
      setAnotherCylinderEmpties(0)
      setAnotherCylinderFilled(0)
      setAnotherCylinderSpoiled(0)
      setAnotherCylinderMinWholeSaleSelling(0)
      setAnotherCylinderMinWholeSaleRefill(0)
      setAnotherCylinderMinRetailSelling(0)
      setAnotherCylinderMinRetailRefill(0)
      setAnotherCylinderMaxWholeSaleSelling(0)
      setAnotherCylinderMaxWholeSaleRefill(0)
      setAnotherCylinderMaxRetailSelling(0)
      setAnotherCylinderMaxRetailRefill(0)
      setAnotherCylinderEmptyCylinderPrice(0)
      setOpenAddAnotherCylinder(false)

      toast.success("Added successfully.")
    } catch (error) {
      toast.error("an error occured, try again.")
    }
  }

  const openAssignDialogue = (empties: number, id: string) => {
    setSelectedEmpties(empties)
    setRefillId(id)
    setOpenAssign(true)
  }

  const handleClose = () => {
    setRefillValue(0)
    setOpenAssign(false)
  }

  const openSellDialogue = (id: string) => {
    setSoldId(id)
    setOpenSell(true)
  }

  const handleCloseSellDialogue = () => {
    setRefillValue(0)
    setOpenSell(false)
  }

  const changectiveTab = (tab: string) => {
    setActiveTab(tab)
  }

  const changectiveFrom = (form: string) => {
    setActiveForm(form)
  }

  const handleRefillValueInputChange = (e: any) => {
    setRefillValue(e.target.value)
  }

  const handleRefill = () => {
    const formData = {
      id: refillId,
      empties: refillValue,
    }

    dispatch(refillEmpties(formData))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      const formData = {
        customer: {
          name: customerName,
          location: {
            name: customerLocation,
          },
          phone: parseInt(customerPhone),
          sales: salesTyleWholeSaleRetail,
        },
        sales_type: saleType,
        sales_choice: salesTyleWholeSaleRetail,

        // product: selectedProduct,
        store_product: soldId,
        quantity: quantity,
        is_fully_paid: fullyPaid,
        partial_payment_amount: deposit,
        exchanged_with_local: isExhanged,
        debt_amount: debt,
        expected_date_to_repay: repayDate,
        total_amount: totalPaid,
      }

      // const response = await axios.post(`${apiUrl}/recordsales/`, formData, {
      //   headers: {
      //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     "Content-Type": "application/json",
      //   },
      // })
      const response  = api.post("/recordsales/", formData)
      if (response.status === 201) {
        console.log("Form submitted successfully!")
      } else {
        console.error("Form submission failed.")
      }
    } catch (error) {
      console.error("Error occurred while submitting the form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDebt = () => {
    if (deposit <= 0) {
      return 0
    } else {
      return calculateTotalAmount() - deposit
    }
  }
  const calculateTotalAmount = () => {
    if (selectedProduct) {
      const priceProperty =
        saleType === "COMPLETESALE"
          ? "wholesale_selling_price"
          : "wholesale_refil_price"
      if (
        // @ts-ignore
        selected[priceProperty] !== undefined &&
        // @ts-ignore
        !isNaN(selected[priceProperty]) &&
        !isNaN(quantity)
      ) {
        // @ts-ignore
        return selected[priceProperty] * quantity
      }
    }
    return 0
  }

  const renderDepositAndTotalDebt = () => {
    if (!fullyPaid) {
      return (
        <>
          <div className="flex flex-col my-2">
            <label>Deposit</label>
            <input
              type="number"
              min={0}
              className="px-2 border-solid outline-none border-gray-500 border-2"
              value={deposit}
              onChange={(e) => setDeposit(parseFloat(e.target.value))}
            />
            <label>Repay Date</label>
            <input
              type="date"
              value={repayDate}
              onChange={(e) => setRepayDate(e.target.value)}
              className="px-2 border-solid outline-none border-gray-500 border-2"
            />
          </div>
          <div className="flex gap-2">
            <h3>Total Debt:</h3>
            <h5>Ksh{calculateDebt()}</h5>
          </div>
        </>
      )
    }
    return null
  }

  const handleOpenUpdateCylinder = (upDateId: string, updateName: string) => {
    setUpdateCylinderID(upDateId)
    setUpdateCylinderName(updateName)
    setOpenUpdateCylinder(true)
  }

  const handleUpdateCylinder = async (id) => {
    try {
      await dispatch(
        updateTheCylinder({ name: selectedGas.name, id: id }),
      ).unwrap()
      toast.success("Cylinder name updated successfully.")
      setDialogOpen(false)
    } catch (error) {
      toast.error("An error occurred while updating the cylinder name.")
    }
  }

  const handleUpdateCylinderNameInputChange = (e: any) => {
    setUpdateCylinderName(e.target.value)
  }

  const handleCloseUpdateCylinder = () => {
    setOpenUpdateCylinder(false)
  }

  const handleUpdateCylinderData = async (id: string) => {
    const storeData = selectedGasCylinder?.stores?.[0] || {}

    const formData = {
      cylinderId: selectedGasCylinder?.id,
      weight: selectedGasCylinder?.weight?.weight,
      weightId: selectedGasCylinder?.weight?.id,
      empties: storeData.empties,
      filled: storeData.filled,
      spoiled: storeData.spoiled,
      min_wholesale_selling_price:
        selectedGasCylinder?.min_wholesale_selling_price,
      min_wholesale_refill_price:
        selectedGasCylinder?.min_wholesale_refil_price,
      min_retail_selling_price: selectedGasCylinder?.min_retail_selling_price,
      min_retail_refill_price: selectedGasCylinder?.min_retail_refil_price,
      max_wholesale_selling_price:
        selectedGasCylinder?.max_wholesale_selling_price,
      max_wholesale_refill_price:
        selectedGasCylinder?.max_wholesale_refil_price,
      max_retail_selling_price: selectedGasCylinder?.max_retail_selling_price,
      max_retail_refill_price: selectedGasCylinder?.max_retail_refil_price,
      empty_cylinder_price: selectedGasCylinder?.empty_cylinder_price,
      depot_refill_price: selectedGasCylinder?.depot_refill_price,
    }
    try {
      await dispatch(updateThisCylinder({ dat: formData, id })).unwrap()
      toast.success("Cylinder updated successfully.")
      setOpenUpdateCylinderData(false)
      setDialogOpenAgain(false)
    } catch (error) {
      toast.error(
        "An error occurred while updating the cylinder. Please try again.",
      )
      console.error("Update error:", error)
    }
  }

  const addNewCylinder = async (e: any) => {
    e.preventDefault()
    setAddingNewCylinder(true)
    const formData = {
      gas_type: gasType,
      weight: cylinderWeight,
      min_wholesale_selling_price: minWholeSaleSellingPrice,
      min_wholesale_refil_price: minWholeSaleRefillingPrice,
      min_retail_selling_price: minRetailSellingPrice,
      min_retail_refil_price: minRetailRefillingPrice,
      max_wholesale_selling_price: maxWholeSaleSellingPrice,
      max_wholesale_refil_price: maxWholeSaleRefillingPrice,
      max_retail_selling_price: maxRetailSellingPrice,
      max_retail_refil_price: maxRetailRefillingPrice,
      filled: gasFilled,
      empties: gasEmpties,
      spoiled: gasSpoiled,
      empty_cylinder_price: emptyCylinderPrice,
      depot_refill_price: depotRefillPrice,
    }

    try {
      await dispatch(addNewCylinders({ businessId, formData })).unwrap()
      setGasType("")
      setCylinderWeight(0)
      setMinWholeSellingPrice(0)
      setMinWholeRefillingPrice(0)
      setMinRetailSellingPrice(0)
      setMinRetailRefillingPrice(0)
      setMaxWholeSellingPrice(0)
      setMaxWholeRefillingPrice(0)
      setMaxRetailSellingPrice(0)
      setMaxRetailRefillingPrice(0)
      setEmptyCylinderPrice(0)
      setDepotRefillPrice(0)
      setGasFilled(0)
      setGasEmpties(0)
      setGasSpoiled(0)
      toast.success("Cylinder recorded successfully!")
      setAddingNewCylinder(false)
    } catch (error) {
      setAddingNewCylinder(false)
      toast.error(error)
    }
  }

  const addOtherProducts = async (e: any) => {
    e.preventDefault()
    setSubmittingOtherProducts(true)
    const formData = {
      name: productName,
      whole_sales_price: productWholeSalePrice,
      retail_sales_price: productRetailPrice,
      product_buying_price: productBuyingPrice,
      quantity: productQuantity,
    }
    try {
      await dispatch(addNewProduct({ businessId, formData })).unwrap()
      toast.success("Product added successfully!")
      setProductName("")
      setProductWholeSalePrice(0)
      setProductRetailPrice(0)
      setProductBuyingPrice(0)
      setProductQuantity(0)
      setSubmittingOtherProducts(false)
    } catch (error) {
      setSubmittingOtherProducts(false)
      const message = addOtherProductsError // If backend gives a message
      // alert(addOtherProductsError)
      toast.error(addOtherProductsError)
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

  const handleGasTypeInputChange = (e: any) => {
    setGasType(e.target.value)
  }

  const handleGasWeightInputChange = (e: any) => {
    setCylinderWeight(e.target.value)
  }
  // --------------------------------------------------

  const handleMinWholeSaleSellingtInputChange = (e: any) => {
    setMinWholeSellingPrice(e.target.value)
  }

  const handleMinWholeSaleRefillingInputChange = (e: any) => {
    setMinWholeRefillingPrice(e.target.value)
  }

  const handleMinRetailSalesInputChange = (e: any) => {
    setMinRetailSellingPrice(e.target.value)
  }

  const handleMinRetailFillingInputChange = (e: any) => {
    setMinRetailRefillingPrice(e.target.value)
  }

  const handleMaxWholeSaleSellingtInputChange = (e: any) => {
    setMaxWholeSellingPrice(e.target.value)
  }

  const handleMaxWholeSaleRefillingInputChange = (e: any) => {
    setMaxWholeRefillingPrice(e.target.value)
  }

  const handleMaxRetailSalesInputChange = (e: any) => {
    setMaxRetailSellingPrice(e.target.value)
  }

  const handleMaxRetailFillingInputChange = (e: any) => {
    setMaxRetailRefillingPrice(e.target.value)
  }

  const handleEmptyCylinderInputChange = (e: any) => {
    setEmptyCylinderPrice(e.target.value)
  }

  const handleDepotRefillPriceInputChange = (e: any) => {
    setDepotRefillPrice(e.target.value)
  }
  // ----------------------------------------------------
  const handleGasFilledInputChange = (e: any) => {
    setGasFilled(e.target.value)
  }

  const handleGasEmptiesInputChange = (e: any) => {
    setGasEmpties(e.target.value)
  }

  const handleSpoiledInputChange = (e: any) => {
    setGasSpoiled(e.target.value)
  }

  const handleInputChange = (
    storeId,
    cylinderId,
    weightId,
    weightName,
    cylinderName,
    refill_price,
    value,
  ) => {
    setStoreRefill((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.storeId === storeId)

      if (index !== -1) {
        updated[index] = {
          storeId,
          cylinderId,
          weightId,
          weightName,
          cylinderName,
          refill_price,
          refill_quantity: parseInt(value, 10),
        }
      } else {
        updated.push({
          storeId,
          cylinderId,
          weightId,
          weightName,
          cylinderName,
          refill_price,
          refill_quantity: parseInt(value, 10),
        })
      }

      return updated.filter((item) => item.refill_quantity > 0) // Remove items with 0 quantity
    })
  }

  const handleInputRepairChange = (storeId, cylinderId, weightId, value) => {
    setStoreRepair((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.storeId === storeId)

      if (index !== -1) {
        updated[index] = {
          storeId,
          cylinderId,
          weightId,
          repair_quantity: parseInt(value, 10),
        }
      } else {
        updated.push({
          storeId,
          cylinderId,
          weightId,
          repair_quantity: parseInt(value, 10),
        })
      }

      return updated.filter((item) => item.repair_quantity > 0) // Remove items with 0 quantity
    })
  }

  const handleAddRefill = () => {
    // setLoadingAssign(true)
   setRefillingCylinders(true);
    const payload = storeRefill.map((item) => ({
      // sales_team: selectedTeam?.id,
      id: item.storeId,
      cylinder: item.cylinderId,
      refill_quantity: item.refill_quantity,
    }))
    try {
      dispatch(storeRefillCylinders({ payload}))
      setRefillingCylinders(false);
      toast.success("Refilling cylinders successfully.")
      setOpenRefill(false)
      setStoreRefill([])
    } catch (error) {
      setRefillingCylinders(false);
      toast.error("an error occured, try again.")
    }
    
    
  }

  const handleRepairs = () => {
    // setLoadingAssign(true)
    const payload = storeRepair.map((item) => ({
      sales_team: selectedTeam?.id,
      cylinder: item.cylinderId,
      repair_quantity: item.repair_quantity,
    }))
    console.log("Repairs ", payload)
    // dispatch(assignCylinders(payload))
    //   .then(() =>
    //     navigate(`/admins/afterassign/${selectedTeam?.id}`, {
    //       state: { salesTeamName: selectedTeam?.name },
    //     }),
    //   )
    //   .catch((error) => console.error("Error in cylinder assignment:", error))
    //   .finally(() => setLoadingAssign(false))
  }

  const weightSummary = storeRefill.reduce((acc, item) => {
    const { weightId, weightName, refill_price, refill_quantity } = item
    console.log("weightId, weightName, refill_price, refill_quantity")
    console.log(weightId, weightName, refill_price, refill_quantity)
    if (!acc[weightId]) {
      acc[weightId] = {
        weightName,
        totalQuantity: 0,
        totalPrice: 0,
      }
    }

    acc[weightId].totalQuantity += refill_quantity
    acc[weightId].totalPrice += refill_quantity * refill_price

    return acc
  }, {})

  const grandTotalPrice = Object.values(weightSummary).reduce(
    (sum, entry) => sum + entry.totalPrice,
    0,
  )

  const renderContent = () => {
    switch (activeTab) {
      case "cylinders":
        return (
          <div className="p-2 space-y-6">
            {storeStatus === "loading" && (
              <div className="flex justify-center items-center h-screen">
                <CircularProgress />
              </div>
            )}

            {storeStatus === "failed" && (
              <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading data</p>
              </div>
            )}

            {storeStatus === "succeeded" && store.length === 0 && (
              <div className="col-span-2 text-center text-gray-500">
                No cylinders added to store.
              </div>
            )}
            {storeStatus === "succeeded" && store.length > 0 && (
              <div>
                {store.map((gas) => (
                  <StoreCard
                    gas={gas}
                    onDialogOpen={handleOpenDialog}
                    onDialogOpenAgain={handleOpenDialogAgain}
                  />
                ))}
              </div>
            )}
            {/* {store.map((gas) => (
              <StoreCard
                gas={gas}
                onDialogOpen={handleOpenDialog}
                onDialogOpenAgain={handleOpenDialogAgain}
              />
            ))} */}
          </div>
        )
      case "others":
        return (
          <div className="p-1">
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
                <table className="mt-2 w-full border text-xs">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="border px-2 py-1">product</th>
                      <th className="border px-2 py-1">quantity</th>
                      <th className="border px-2 py-1">Retail Price</th>
                      <th className="border px-2 py-1">Wholesale Price</th>
                      <th className="border px-2 py-1">Buying Price</th>
                      <th className="border px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="border px-2 py-1 text-center">
                          {product.name}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {product.quantity}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <FormattedAmount
                            amount={product.retail_sales_price}
                          />
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <FormattedAmount amount={product.whole_sales_price} />{" "}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <FormattedAmount amount={product.product_buying_price} />{" "}
                        </td>

                        <td className="border py-1  text-center">
                          <div className=" flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleClickOpenUpdateOtherProduct(product)
                              }
                              className="bg-blue-500 text-white px-1 py-1 rounded"
                            >
                              Update
                            </button>
                            <button
                              onClick={() =>
                                handleClickOpenDeleteOtherProduct(product)
                              }
                              className="bg-red-500 text-white px-1 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

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
          </div>
        )

      case "add":
        return (
          <div className="p-6">
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "add" ? "block" : "hidden"
              }`}
            >
              <div className=" flex flex-col items-center">
                {/* Form toggle tabs */}
                <div className="flex mb-6 space-x-2 bg-white border border-blue-500 p-1 rounded-lg shadow-sm">
                  <button
                    onClick={() => changectiveFrom("cylinders")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                      activeForm === "cylinders"
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Add Cylinders
                  </button>
                  <button
                    onClick={() => changectiveFrom("others")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                      activeForm === "others"
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Add Other Products
                  </button>
                </div>

                {/* Cylinders Form */}
                <form
                  className={`bg-white shadow-lg rounded-xl p-6 w-full max-w-6xl space-y-4 border border-gray-200 transition ${
                    activeForm === "cylinders" ? "block" : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                      <Input
                        required
                        label="Cylinder Type"
                        type="text"
                        value={gasType}
                        onChange={handleGasTypeInputChange}
                      />
                      <Input
                        required
                        label="Cylinder Weight"
                        type="number"
                        value={cylinderWeight}
                        onChange={handleGasWeightInputChange}
                      />
                      <Input
                        required
                        label="Filled"
                        type="number"
                        value={gasFilled}
                        onChange={handleGasFilledInputChange}
                      />
                      <Input
                        required
                        label="Empties"
                        type="number"
                        value={gasEmpties}
                        onChange={handleGasEmptiesInputChange}
                      />
                      <Input
                        required
                        label="Spoiled"
                        type="number"
                        value={gasSpoiled}
                        onChange={handleSpoiledInputChange}
                      />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                      <Input
                        required
                        label="Min Retail Selling Price"
                        type="number"
                        value={minRetailSellingPrice}
                        onChange={handleMinRetailSalesInputChange}
                      />
                      <Input
                        required
                        label="Min Wholesale Selling Price"
                        type="number"
                        value={minWholeSaleSellingPrice}
                        onChange={handleMinWholeSaleSellingtInputChange}
                      />
                      <Input
                        required
                        label="Min Wholesale Refilling Price"
                        type="number"
                        value={minWholeSaleRefillingPrice}
                        onChange={handleMinWholeSaleRefillingInputChange}
                      />
                      <Input
                        required
                        label="Min Retail Refilling Price"
                        type="number"
                        value={minRetailRefillingPrice}
                        onChange={handleMinRetailFillingInputChange}
                      />
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                      <Input
                        required
                        label="Max Retail Selling Price"
                        type="number"
                        value={maxRetailSellingPrice}
                        onChange={handleMaxRetailSalesInputChange}
                      />
                      <Input
                        required
                        label="Max Wholesale Selling Price"
                        type="number"
                        value={maxWholeSaleSellingPrice}
                        onChange={handleMaxWholeSaleSellingtInputChange}
                      />
                      <Input
                        required
                        label="Max Wholesale Refilling Price"
                        type="number"
                        value={maxWholeSaleRefillingPrice}
                        onChange={handleMaxWholeSaleRefillingInputChange}
                      />
                      <Input
                        required
                        label="Max Retail Refilling Price"
                        type="number"
                        value={maxRetailRefillingPrice}
                        onChange={handleMaxRetailFillingInputChange}
                      />

                      <Input
                        required
                        label="Empty Cylinder Price"
                        type="number"
                        value={emptyCylinderPrice}
                        onChange={handleEmptyCylinderInputChange}
                      />

                      <Input
                        required
                        label="Depot Refill Price"
                        type="number"
                        value={depotRefillPrice}
                        onChange={handleDepotRefillPriceInputChange}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={addNewCylinder}
                      type="submit"
                      className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 focus:ring focus:ring-green-300 transition"
                    >
                      {addingNewCylinder ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>

                {/* Other Products Form */}
                <form
                  className={`bg-white shadow-lg rounded-xl p-6 w-full max-w-lg space-y-4 border border-gray-200 ${
                    activeForm === "others" ? "block" : "hidden"
                  }`}
                >
                  <Input
                    label="Product Name"
                    value={productName}
                    onChange={handleNameInputChange}
                  />
                  <Input
                    label="Product Wholesale Price"
                    type="number"
                    value={productWholeSalePrice}
                    onChange={handleProductWholeSalePriceInputChange}
                  />
                  <Input
                    label="Product Retail Price"
                    type="number"
                    value={productRetailPrice}
                    onChange={handleProductRetailPriceInputChange}
                  />
                  <Input
                    label="Product buying Price Per Piece"
                    type="number"
                    value={productBuyingPrice}
                    onChange={handleProductBuyigPriceInputChange}
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={productQuantity}
                    onChange={handleProductQuantityInputChange}
                  />

                  <div className="pt-4">
                    <button
                      onClick={addOtherProducts}
                      disabled={submittingOtherProducts}
                      type="submit"
                      className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 focus:ring focus:ring-green-300 transition"
                    >
                      {submittingOtherProducts ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      case "depot":
        return (
          <div className="p-6">
            <div className="min-h-screen bg-gray-100">
              <div>
                {storeStatus === "loading" && (
                  <div className="flex justify-center items-center h-screen">
                    <CircularProgress />
                  </div>
                )}
                {storeStatus === "failed" && (
                  <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500">Error loading data</p>
                  </div>
                )}

                {storeStatus === "succeeded" && store.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500">
                    No cylinders added to store.
                  </div>
                )}
                {storeStatus === "succeeded" &&
                  store.length > 0 &&
                  store.map(
                    (gas) => (
                      // console.log("gases", gas),
                      (
                        <div
                          key={gas.id}
                          className="mb-4 bg-white p-1 rounded-lg shadow-md"
                        >
                          <h3 className="text-lg font-semibold text-blue-600">
                            {gas.name}
                          </h3>
                          {gas.cylinders.map((cylinder) => (
                            <div key={cylinder.id} className="mt-3">
                              <h4 className="text-base font-semibold">
                                Cylinder Weight: {cylinder.weight.weight}kg
                              </h4>
                              {cylinder.stores.length > 0 ? (
                                <table className="mt-2 w-full border text-sm">
                                  <thead>
                                    <tr className="bg-gray-200 text-left">
                                      <th className="border px-2 py-1">
                                        Filled
                                      </th>
                                      <th className="border px-2 py-1">
                                        Empties
                                      </th>
                                      <th className="border px-2 py-1">
                                        Spoiled
                                      </th>
                                      <th className="border px-2 py-1">
                                        Total
                                      </th>
                                      <th className="border px-2 py-1">
                                        Refill
                                      </th>
                                      <th className="border px-2 py-1">
                                        Repair
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cylinder.stores.map((storeItem) => (
                                      <tr key={storeItem.id}>
                                        <td className="border px-2 py-1 text-center">
                                          {storeItem.filled}
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                          {storeItem.empties}
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                          {storeItem.spoiled}
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                          {storeItem.total_cylinders}
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                          <input
                                            type="number"
                                            min="0"
                                            max={storeItem.empties}
                                            className="w-full border px-1 py-1"
                                            onChange={(e) =>
                                              handleInputChange(
                                                storeItem.id,
                                                storeItem.id,
                                                cylinder.weight.id,
                                                cylinder.weight.weight,
                                                gas.name,
                                                cylinder.depot_refill_price,
                                                e.target.value,
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                          <input
                                            type="number"
                                            min="0"
                                            max={storeItem.spoiled}
                                            className="w-full border px-1 py-1"
                                            onChange={(e) =>
                                              handleInputRepairChange(
                                                storeItem.id,
                                                storeItem.id,
                                                cylinder.weight.id,
                                                cylinder.weight.weight,

                                                e.target.value,
                                              )
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-gray-600 mt-2">
                                  No stores available for this cylinder.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    ),
                  )}
                <div className=" flex space-x-1 items-center justify-center">
                  <button
                    onClick={handleClickOpenRefills}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow"
                  >
                    repair
                  </button>
                  <button
                    onClick={handleClickOpenRefills}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow"
                  >
                    refill
                  </button>
                </div>
              </div>
              {/* <div className="mt-6 text-center">
                        <button
                            className={`bg-blue-500 text-white px-6 py-2 rounded-lg shadow ${loadingAssign ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} transition`}
                            onClick={handleAssign}
                            disabled={loadingAssign}
                        >
                            {loadingAssign ? 'Assigning...' : 'Assign Cylinders'}
                        </button>
                    </div> */}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <ToastContainer />
      {/* Header */}

      <AdminNav
        headerMessage={"Admin Store"}
        headerText={"Switch between product layouts and depot view"}
      />

      {/* dialogue refills */}
      <Dialog
        open={openRefill}
        onClose={handleCloseRefills}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Refill this cylinders."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            refill this cylinder
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cylinder</TableCell>
                    <TableCell>Weight (kg)</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storeRefill.map((item) => (
                    <TableRow key={item.storeId}>
                      <TableCell>{item.cylinderName}</TableCell>
                      <TableCell>{item.weightName}</TableCell>
                      <TableCell>{item.refill_quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ marginTop: "1rem" }}>
              <Typography variant="h6">Summary Totals by Weight</Typography>
              {Object.values(weightSummary).map(
                ({ weightName, totalQuantity, totalPrice }) => (
                  <Typography key={weightName}>
                    Total {weightName}Kg = {totalQuantity} @ KES{" "}
                    {totalPrice.toLocaleString()}
                  </Typography>
                ),
              )}
              <span>
                -------------------------------------------------------
              </span>
              {/* <div>Total Refil Amount: </div> */}
              <Typography
                variant="h6"
                style={{ marginTop: "0.5rem", fontWeight: "bold" }}
              >
                Grand Total = KES {grandTotalPrice.toLocaleString()}
              </Typography>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRefills}>Cancel</Button>
          <Button disabled={refillingCylinders} onClick={handleAddRefill} autoFocus>
            {refillingCylinders ? <CircularProgress size={24} /> : "Refill"}
            
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialogue refills */}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-semibold">
          {dialogType === "add" && `Add a ${selectedGas?.name} Cylinder.`}
          {dialogType === "delete" && "Delete Confirmation"}
          {dialogType === "update" && "Update Product"}
        </DialogTitle>

        <DialogContent>
          {dialogType === "delete" && (
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{selectedGas?.name}</strong>?
            </p>
          )}

          {dialogType === "update" && (
            <form className="space-y-4">
              <Input
                label="Cylinder Type"
                type="text"
                value={selectedGas?.name || ""}
                onChange={(e) =>
                  setSelectedGas((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </form>
          )}

          {dialogType === "add" && (
            <form>
              <Input
                label="Cylinder Weight"
                type="number"
                value={anotherCylinderWeight}
                onChange={(e) => setAnotherCylinderWeight(e.target.value)}
              />
              <Input
                label="Filled"
                type="number"
                value={anotherCylinderFilled}
                onChange={(e) => setAnotherCylinderFilled(e.target.value)}
              />
              <Input
                label="Empties"
                type="number"
                value={anotherCylinderEmpties}
                onChange={(e) => setAnotherCylinderEmpties(e.target.value)}
              />
              <Input
                label="Spoiled"
                type="number"
                value={anotherCylinderSpoiled}
                onChange={(e) => setAnotherCylinderSpoiled(e.target.value)}
              />
              <Input
                label="Min Retail Selling Price"
                type="number"
                value={anotherCylinderMinRetailSelling}
                onChange={(e) =>
                  setAnotherCylinderMinRetailSelling(e.target.value)
                }
              />
              <Input
                label="Min Wholesale Selling Price"
                type="number"
                value={anotherCylinderMinWholeSaleSelling}
                onChange={(e) =>
                  setAnotherCylinderMinWholeSaleSelling(e.target.value)
                }
              />
              <Input
                label="Min Wholesale Refilling Price"
                type="number"
                value={anotherCylinderMinWholeSaleRefill}
                onChange={(e) =>
                  setAnotherCylinderMinWholeSaleRefill(e.target.value)
                }
              />
              <Input
                label="Min Retail Refilling Price"
                type="number"
                value={anotherCylinderMinRetailRefill}
                onChange={(e) =>
                  setAnotherCylinderMinRetailRefill(e.target.value)
                }
              />
              <Input
                label="Max Retail Selling Price"
                type="number"
                value={anotherCylinderMaxRetailSelling}
                onChange={(e) =>
                  setAnotherCylinderMaxRetailSelling(e.target.value)
                }
              />
              <Input
                label="Max Wholesale Selling Price"
                type="number"
                value={anotherCylinderMaxWholeSaleSelling}
                onChange={(e) =>
                  setAnotherCylinderMaxWholeSaleSelling(e.target.value)
                }
              />
              <Input
                label="Max Wholesale Refilling Price"
                type="number"
                value={anotherCylinderMaxWholeSaleRefill}
                onChange={(e) =>
                  setAnotherCylinderMaxWholeSaleRefill(e.target.value)
                }
              />
              <Input
                label="Max Retail Refilling Price"
                type="number"
                value={anotherCylinderMaxRetailRefill}
                onChange={(e) =>
                  setAnotherCylinderMaxRetailRefill(e.target.value)
                }
              />
              <Input
                label="Empty Cylinder Price"
                type="number"
                value={anotherCylinderEmptyCylinderPrice}
                onChange={(e) =>
                  setAnotherCylinderEmptyCylinderPrice(e.target.value)
                }
              />
            </form>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogType === "delete" && (
            <Button
              color="error"
              onClick={() => handleDeleteCylinder(selectedGas?.id)}
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          )}
          {dialogType === "update" && (
            <Button
              variant="contained"
              onClick={() => handleUpdateCylinder(selectedGas?.id)}
              disabled={isUpdating}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Update"}
            </Button>
          )}
          {dialogType === "add" && (
            <Button variant="contained" onClick={handleAddAnotherCylinder}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* updating the single cylinders */}

      <Dialog
        open={dialogOpenAgain}
        onClose={handleCloseDialogAgain}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-semibold">
          {/* {dialogType === "add" && `Add a ${selectedGas?.name} Cylinder.`} */}
          {dialogTypeAgain === "delete" &&
            `Delete Confirmation ${selectedGasData?.name} ${selectedGasCylinder?.weight?.weight}kg`}
          {dialogTypeAgain === "update" &&
            `Update Product ${selectedGasData?.name} ${selectedGasCylinder?.weight?.weight}kg`}
        </DialogTitle>

        <DialogContent>
          {dialogTypeAgain === "delete" && (
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong>
                {selectedGasData?.name} {selectedGasCylinder?.weight?.weight}kg
              </strong>
              ?
            </p>
          )}

          {dialogTypeAgain === "update" && (
            <form className="space-y-4">
              <Input
                label="Cylinder Weight"
                type="number"
                value={selectedGasCylinder?.weight?.weight || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    weight: { ...prev.weight, weight: e.target.value },
                  }))
                }
              />
              <Input
                label="Cylinder Filled"
                type="number"
                value={selectedGasCylinder?.stores[0]?.filled || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    stores: [
                      {
                        ...prev.stores[0],
                        filled: e.target.value,
                      },
                    ],
                  }))
                }
              />
              <Input
                label="Cylinder Empties"
                type="number"
                value={selectedGasCylinder?.stores[0]?.empties || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    stores: [
                      {
                        ...prev.stores[0],
                        empties: e.target.value,
                      },
                    ],
                  }))
                }
              />
              <Input
                label="Cylinder Spoiled"
                type="number"
                value={selectedGasCylinder?.stores[0]?.spoiled || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    stores: [
                      {
                        ...prev.stores[0],
                        spoiled: e.target.value,
                      },
                    ],
                  }))
                }
              />
              <Input
                label="Min Retail Selling Price"
                type="number"
                value={selectedGasCylinder?.min_retail_selling_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    min_retail_selling_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Min Wholesale Selling Price"
                type="number"
                value={selectedGasCylinder?.min_wholesale_selling_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    min_wholesale_selling_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Min Wholesale Refilling Price"
                type="number"
                value={selectedGasCylinder?.min_wholesale_refil_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    min_wholesale_refil_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Min Retail Refilling Price"
                type="number"
                value={selectedGasCylinder?.min_retail_refil_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    min_retail_refil_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Max Retail Selling Price"
                type="number"
                value={selectedGasCylinder?.max_retail_selling_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    max_retail_selling_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Max Wholesale Selling Price"
                type="number"
                value={selectedGasCylinder?.max_wholesale_selling_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    max_wholesale_selling_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Max Wholesale Refilling Price"
                type="number"
                value={selectedGasCylinder?.max_wholesale_refil_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    max_wholesale_refil_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Max Retail Refilling Price"
                type="number"
                value={selectedGasCylinder?.max_retail_refil_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    max_retail_refil_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Empty Cylinder Price"
                type="number"
                value={selectedGasCylinder?.empty_cylinder_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    empty_cylinder_price: e.target.value,
                  }))
                }
              />
              <Input
                label="Depot Refill Price"
                type="number"
                value={selectedGasCylinder?.depot_refill_price || ""}
                onChange={(e) =>
                  setSelectedGasCylinder((prev) => ({
                    ...prev,
                    depot_refill_price: e.target.value,
                  }))
                }
              />
            </form>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialogAgain}>Cancel</Button>
          {dialogTypeAgain === "delete" && (
            <Button
              color="error"
              onClick={() => handleDeleteThisCylinder(selectedGasCylinder?.id)}
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          )}
          {dialogTypeAgain === "update" && (
            <Button
              variant="contained"
              onClick={() =>
                handleUpdateCylinderData(selectedGasCylinder?.stores[0].id)
              }
              disabled={isUpdating}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Update"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Navigation Tabs */}
      <nav className="flex justify-center gap-4 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => setActiveTab("cylinders")}
          className={`px-4 py-2 rounded-md font-medium transition text-xs ${
            activeTab === "cylinders"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Cylinders
        </button>
        <button
          onClick={() => setActiveTab("others")}
          className={`px-4 py-2 rounded-md font-medium text-xs transition ${
            activeTab === "others"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Other Products
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded-md text-xs font-medium transition ${
            activeTab === "add"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Add Products
        </button>
        <button
          onClick={() => setActiveTab("depot")}
          className={`px-4 py-2 rounded-md font-medium transition text-xs ${
            activeTab === "depot"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Depot
        </button>
      </nav>

      {/* Dynamic Content */}
      <main className="flex-grow overflow-x-hidden ">{renderContent()}</main>

      {/* Footer */}
      <AdminsFooter />
    </div>
  )
}

export default AdminStore
