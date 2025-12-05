// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../../utils/api"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import AddBoxIcon from "@mui/icons-material/AddBox"
import CircularProgress from "@mui/material/CircularProgress"

import Select from "react-select"

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
import {
  addAnotherCylinder,
  addNewCylinders,
  deleteCylinder,
  deleteThisCylinder,
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
  updateTheCylinder,
  updateThisCylinder,
} from "../../features/store/storeSlice"
import AdminsFooter from "../../components/AdminsFooter"
import StoreCard from "../../components/StoreCard"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Input from "../../components/Input"
import { toast, ToastContainer } from "react-toastify"

import {
  createCylindersWeight,
  fetchCylindersWeight,
  selectAllCylindersWeight,
} from "../../features/cylinders/cylindersWeightSlice"
import KenyanCurrencyInput from "../../components/KenyanCurrencyInput"

const StoreCylinders = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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

  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const fetchingStoreError = useAppSelector(getStoreError)
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [openUpdateCylinderData, setOpenUpdateCylinderData] =
    useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState(null) // 'update' | 'delete' | 'add'
  const [selectedGas, setSelectedGas] = useState(null)
  const [selectedGasData, setSelectedGasData] = useState(null)
  const [selectedGasCylinder, setSelectedGasCylinder] = useState(null)
  const [dialogOpenAgain, setDialogOpenAgain] = useState(false)
  const [dialogTypeAgain, setDialogTypeAgain] = useState(null) // 'update' | 'delete'
  const [isDeleting, setIsDeleting] = useState(false)
  const [anotherCylinderWeight, setAnotherCylinderWeight] = useState<number>()
  const [anotherCylinderFilled, setAnotherCylinderFilled] = useState<number>()
  const [anotherCylinderEmpties, setAnotherCylinderEmpties] = useState<number>()
  const [selectedWeight, setSelectedWeight] = useState(null)
  const [outletWholeSale, setOutletWholeSale] = useState(0)
  const [outletRetail, setOutletRetail] = useState(0)
  const [completeWholeSale, setCompleteWholeSale] = useState(0)
  const [addingNewCylinder, setAddingNewCylinder] = useState(false)

  const [completeRetail, setCompleteRetail] = useState(0)
  const [emptyCylinderPrice, setEmptyCylinderPrice] = useState(0)
  const [wholesaleRefillPrice, setWholesaleRefillPrice] = useState(0)
  const [retailRefillPrice, setRetailRefillPrice] = useState(0)
  const [depositPrice, setDepositPrice] = useState(0)
  const [fullCylindersStock, setFullCylindersStock] = useState(0)
  const [emptyCylindersStock, setEmptyCylindersStock] = useState(0)
  const [spoiledCylindersStock, setSpoiledCylindersStock] = useState(0)
  const [gasType, setGasType] = useState<string>("")

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
  const [
    anotherCylinderCylinderDepotRefillPrice,
    setAnotherCylinderCylinderDepotRefillPrice,
  ] = useState<number>()
  const [anotherCylinderMaxRetailSelling, setAnotherCylinderMaxRetailSelling] =
    useState<number>()
  const [anotherCylinderSpoiled, setAnotherCylinderSpoiled] = useState<number>()
  const [anotherCylinderId, setAnotherCylinderId] = useState<string>("")
  const [anotherCylinderName, setAnotherCylinderName] = useState<string>("")
  const [openDeleteCylinder, setOpenDeleteCylinder] = useState<boolean>(false)
  const [deleteCylinderId, setDeleteCylinderId] = useState<string>("")
  const [deleteCylinderName, setDeleteCylinderName] = useState<string>("")

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
  const [isUpdating, setIsUpdating] = useState(false)
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [addingNewCylinderBrand, setAddingNewCylinderBrand] = useState(false)
  const [showAddWeigthModal, setShowAddWeightModal] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [addingNewWeight, setAddingNewWeight] = useState(false)
  const [openWeight, setOpenWeight] = useState(false)
  

  const allCylinderWeights = useAppSelector(selectAllCylindersWeight)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  const handleOpenDialog = (type, gas) => {
    // console.log('opening dialog')
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
    setDialogTypeAgain(type)
    setSelectedGasData(gas)
    setSelectedGasCylinder(cylinder)
    setDialogOpenAgain(true)
  }

  const handleOpenDialogueOfWeight = () => {
    setOpenWeight(true)
  }

  const handleCloseDialogueOfWeight = () => {
    setOpenWeight(false)
  }

  const handleCloseDialogueOfBrand = () => {
    setShowAddBrandModal(false)
  }

  const handleCloseDialogAgain = () => {
    setDialogOpenAgain(false)
    setDialogTypeAgain(null)
    setSelectedGasData(null)
    setSelectedGasCylinder(null)
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

  const handleGasTypeInputChange = (e: any) => {
    setGasType(e.target.value)
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

    try {
      await dispatch(deleteThisCylinder({ id, cylinderWeight })).unwrap()
      setDialogOpenAgain(false)
      setDeleteCylinderId("")
      toast.success("Deleted successfully.")
    } catch (error) {
      toast.error("an error occured, try again.")
    }
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
      depot_refill_price: anotherCylinderCylinderDepotRefillPrice,
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
      setAnotherCylinderCylinderDepotRefillPrice(0)
      setOpenAddAnotherCylinder(false)

      toast.success("Added successfully.")
    } catch (error) {
      toast.error("an error occured, try again.")
    }
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

  const handleAddNewWeight = async (e: any) => {
    e.preventDefault()
    setAddingNewWeight(true)
    try {
      const thisWeight = await dispatch(
        createCylindersWeight({ weight: newWeight }),
      ).unwrap()

      setSelectedWeight(thisWeight.id)
      toast.success("Weight added successfully!")

      setOpenWeight(false)
      setNewWeight("")
      setAddingNewWeight(false)
    } catch (error: any) {
      console.log("Error adding new weight:", error)
      setAddingNewWeight(false)
      toast.error(
        error.message || error.toString() || "Failed to add new brand",
      )
    }
  }

  const handleAddCylinder = async (e: any) => {
    e.preventDefault()
    setAddingNewCylinder(true)
    const formData = {
      weight: selectedWeight,
      wholesale_refil_price: wholesaleRefillPrice,
      retail_refil_price: retailRefillPrice,
      outlet_wholesale_price: outletWholeSale,
      outlet_retail_price: outletRetail,
      complete_wholesale_price: completeWholeSale,
      complete_retail_price: completeRetail,

      filled: fullCylindersStock,
      empties: emptyCylindersStock,
      spoiled: spoiledCylindersStock,
      empty_cylinder_price: emptyCylinderPrice,
      depot_refill_price: depositPrice,
    }
    try {
      await dispatch(
        addAnotherCylinder({ dat: formData, id: selectedGas.id }),
      ).unwrap()
      // addAnotherCylinder({ dat: formData, id: selectedGas.id }),
      setSelectedWeight(null)
      setOutletWholeSale(0)
      setOutletRetail(0)
      setCompleteWholeSale(0)
      setCompleteRetail(0)
      setEmptyCylinderPrice(0)
      setWholesaleRefillPrice(0)
      setRetailRefillPrice(0)
      setDepositPrice(0)
      setFullCylindersStock(0)
      setEmptyCylindersStock(0)
      setSpoiledCylindersStock(0)
      setAddingNewCylinder(false)
      toast.success("Cylinder recorded successfully!")
    } catch (error: any) {
      setAddingNewCylinder(false)
      toast.error(error.message || error.toString() || "Failed to add cylinder")
    }
  }

  return (
    <div>
      <ToastContainer />
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow  p-1">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Store Cylinders stock
              </h2>
              <div>
                {fetchingStoreStatus === "loading" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="mb-4 bg-white p-3 rounded-lg shadow-md"
                      >
                        <h3 className="text-lg font-semibold text-blue-600">
                          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                        </h3>

                        <div className="mt-3">
                          <h4 className="text-base font-semibold">
                            Cylinder Weight:{" "}
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1rem" }}
                            />
                          </h4>

                          <table className="mt-2 w-full border text-sm">
                            <thead>
                              <tr className="bg-gray-200 text-left">
                                <th className="border px-2 py-1">Filled</th>
                                <th className="border px-2 py-1">Empties</th>
                                <th className="border px-2 py-1">Spoiled</th>
                                <th className="border px-2 py-1">Total</th>
                                <th className="border px-2 py-1">Assign</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border px-2 py-1 text-center">
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </td>
                                <td className="border px-2 py-1 text-center">
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </td>
                                <td className="border px-2 py-1 text-center">
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </td>
                                <td className="border px-2 py-1 text-center">
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </td>
                                <td className="border px-2 py-1 text-center">
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {fetchingStoreStatus === "succeeded" && store.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500">
                    No stores available for this sales team.
                    <Link
                      to="/cylinders/add"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Create a new store
                    </Link>
                  </div>
                )}

                {fetchingStoreStatus === "succeeded" && store.length > 0 && (
                  <div>
                    {store.map((gas) => (
                      <StoreCard
                        gas={gas}
                        onDialogOpen={handleOpenDialog}
                        onDialogOpenAgain={handleOpenDialogAgain}
                        // onDialogueOfBrand={handleOpenDialogueOfWeight}
                      />
                    ))}
                  </div>
                )}
                {fetchingStoreStatus === "failed" && (
                  <div className="col-span-2 text-center text-red-500">
                    Failed to load stores. Please try again later.
                  </div>
                )}
              </div>
            </div>
          </main>
          {/* updating the single cylinders */}

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
                      setSelectedGas((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </form>
              )}

              {dialogType === "add" && (
                <form className="space-y-6">
                  {/* Cylinder Brand Select */}

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        options={[
                          ...allCylinderWeights.map((weight: any) => ({
                            value: weight.id,
                            label: weight.weight + " kg",
                          })),
                        ]}
                        value={
                          selectedWeight
                            ? {
                                value: selectedWeight,
                                label:
                                  allCylinderWeights.find(
                                    (weight: any) =>
                                      weight.id === selectedWeight,
                                  )?.weight + " kg",
                              }
                            : null
                        }
                        onChange={(selected) => {
                          const id = (selected as any)?.value ?? null
                          setSelectedWeight(id)
                          // console.log("selected brand id:", id) // use this id as needed (set state, send to API, etc.)
                          if (id === "add_new") setShowAddWeightModal(true)
                        }}
                        placeholder="Select Weight"
                        isClearable
                        className="flex-grow"
                      />
                      <button
                        type="button"
                        onClick={() => setOpenWeight(true)}
                        className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition"
                      >
                        <AddBoxIcon sx={{ fontSize: 24 }} />
                      </button>
                    </div>
                  </div>

                  {/* Prices */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prices
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Outlet Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Outlet Wholesale Price (Full Cylinder)
                        </label>
                        <KenyanCurrencyInput
                          value={outletWholeSale}
                          onChange={(value) => setOutletWholeSale(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Outlet Retail Price (Full Cylinder)
                        </label>
                        <KenyanCurrencyInput
                          value={outletRetail}
                          onChange={(value) => setOutletRetail(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* complete */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Complete Wholesale Price (Grill + Burner)
                        </label>
                        <KenyanCurrencyInput
                          value={completeWholeSale}
                          onChange={(value) => setCompleteWholeSale(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Complete Retail Price (Grill + Burner)
                        </label>
                        <KenyanCurrencyInput
                          value={completeRetail}
                          onChange={(value) => setCompleteRetail(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* empty cylinder price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Empty cylinder Price
                        </label>
                        <KenyanCurrencyInput
                          value={emptyCylinderPrice}
                          onChange={(value) => setEmptyCylinderPrice(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Wholesale Refill Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Wholesale Refill Price
                        </label>
                        <KenyanCurrencyInput
                          value={wholesaleRefillPrice}
                          onChange={(value) => setWholesaleRefillPrice(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Retail Refill Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Retail Refill Price
                        </label>
                        <KenyanCurrencyInput
                          value={retailRefillPrice}
                          onChange={(value) => setRetailRefillPrice(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Depot Refill Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Depot Refill Price
                        </label>
                        <KenyanCurrencyInput
                          value={depositPrice}
                          onChange={(value) => setDepositPrice(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantities
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Full Cylinders */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Full Cylinders
                        </label>
                        <input
                          min={0}
                          type="number"
                          placeholder="Enter quantity"
                          value={fullCylindersStock}
                          onChange={(e) =>
                            setFullCylindersStock(Number(e.target.value))
                          }
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Empty Cylinders */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Empty Cylinders
                        </label>
                        <input
                          min={0}
                          value={emptyCylindersStock}
                          onChange={(e) =>
                            setEmptyCylindersStock(Number(e.target.value))
                          }
                          type="number"
                          placeholder="Enter quantity"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Spoiled Cylinders */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Spoiled Cylinders
                        </label>
                        <input
                          min={0}
                          value={spoiledCylindersStock}
                          onChange={(e) =>
                            setSpoiledCylindersStock(Number(e.target.value))
                          }
                          type="number"
                          placeholder="Enter quantity"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
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
                <Button
                  variant="contained"
                  onClick={handleAddCylinder}
                  disabled={addingNewCylinder}
                >
                  {addingNewCylinder ? <CircularProgress size={24} /> : "Add"}
                </Button>
              )}
            </DialogActions>
          </Dialog>

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
                    {selectedGasData?.name}{" "}
                    {selectedGasCylinder?.weight?.weight}kg
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
                    label="Retail Refil Price"
                    type="number"
                    value={selectedGasCylinder?.retail_refil_price || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        retail_refil_price: e.target.value,
                      }))
                    }
                  />
                  
                  
                  <Input
                    label="Wholesale Refill Price"
                    type="number"
                    value={
                      selectedGasCylinder?.wholesale_refil_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        wholesale_refil_price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Outlet Retail Price(cylinder)"
                    type="number"
                    value={selectedGasCylinder?.outlet_retail_price || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        outlet_retail_price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Outlet Wholesale Price(cylinder)"
                    type="number"
                    value={selectedGasCylinder?.outlet_wholesale_price || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        outlet_wholesale_price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Complete Retail Price(Grill + Burner)"
                    type="number"
                    value={selectedGasCylinder?.complete_retail_price || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        complete_retail_price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Complete Wholesale Price(Grill + Burner)"
                    type="number"
                    value={
                      selectedGasCylinder?.complete_wholesale_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        complete_wholesale_price: e.target.value,
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
                  onClick={() =>
                    handleDeleteThisCylinder(selectedGasCylinder?.id)
                  }
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

          {/* add cylinder Weight dialogue */}
          <Dialog open={openWeight} onClose={handleCloseDialogueOfWeight}>
            <DialogTitle>Cylinder Weight</DialogTitle>
            <DialogContent>
              <DialogContentText></DialogContentText>
              <form id="subscription-form">
                <TextField
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  autoFocus
                  required
                  margin="dense"
                  type="text"
                  id="weight"
                  name="cylinder_weight"
                  label="Cylinder Weight in kg"
                  fullWidth
                  variant="standard"
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialogueOfWeight}>Cancel</Button>
              {addingNewWeight ? (
                <Button disabled>
                  <CircularProgress
                    size={20}
                    thickness={4}
                    style={{ color: "blue" }}
                  />
                </Button>
              ) : (
                <Button type="button" onClick={handleAddNewWeight}>
                  Add
                </Button>
              )}
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

export default StoreCylinders
