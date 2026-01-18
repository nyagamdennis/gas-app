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
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
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
import {
  addStoreCylinders,
  deleteCylinders,
  deleteStoreCylindersByIds,
  fetchStoreCylinders,
  getStoreCylindersStatus,
  selectAllStoreCylinders,
  updateCylinders,
  updateThisStoreCylinders,
} from "../../features/store/storeCylindersSlice"
import { set } from "cookies"

const StoreCylinders = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { businessId } = useAppSelector((state) => state.planStatus)

  const storeCylinder = useAppSelector(selectAllStoreCylinders)
  const storeCylinderWeight = useAppSelector(selectAllCylindersWeight)

  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreCylindersStatus)
  const fetchingStoreError = useAppSelector(getStoreError)
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [openUpdateCylinderData, setOpenUpdateCylinderData] =
    useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState(null)
  const [selectedGas, setSelectedGas] = useState(null)
  const [selectedGasData, setSelectedGasData] = useState(null)
  const [selectedGasCylinder, setSelectedGasCylinder] = useState(null)
  const [dialogOpenAgain, setDialogOpenAgain] = useState(false)
  const [dialogTypeAgain, setDialogTypeAgain] = useState(null)
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
  const errorDeletingCylinder = useAppSelector(
    (state) => state.storeCylinders.deleteCylinderTypeError,
  )

  const [storeId, setStoreId] = useState("")

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
      dispatch(fetchStoreCylinders({ storeId }))
    }
  }, [storeId, dispatch])

  useEffect(() => {
    dispatch(fetchCylindersWeight())
  }, [dispatch])

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
      dataRest?.stores[0]?.cylinder_details?.wholesale_refill_price,
    )
    setUpdateCylinderDataRetailSelling(
      dataRest?.stores[0]?.cylinder_details?.retail_selling_price,
    )
    setUpdateCylinderDataRetailRefill(
      dataRest?.stores[0]?.cylinder_details?.retail_refill_price,
    )
    setUpdateCylinderDataSpoiled(dataRest?.stores[0]?.spoiled)
    setOpenUpdateCylinderData(true)
  }

  const handleCloseUpdateCylinderData = () => {
    setOpenUpdateCylinderData(false)
  }

  const handleDeleteCylinder = async (id) => {
    setIsDeleting(true)
    try {
      await dispatch(deleteCylinders({ id })).unwrap()
      setDialogOpen(false)
      setDeleteCylinderId("")
      toast.success("Deleted successfully.")
      setIsDeleting(false)
    } catch (error: any) {
      console.error("Error deleting cylinder:", error)
      setIsDeleting(false)
      const apiError =
        error?.error ||
        errorDeletingCylinder ||
        error?.message ||
        "An error occurred, try again."
      toast.error(apiError)
    }
  }

  const handleDeleteThisCylinder = async () => {
    const id = selectedGasCylinder?.id

    if (!id) {
      toast.error("Invalid cylinder ID")
      return
    }

    setIsDeleting(true)

    try {
      await dispatch(deleteStoreCylindersByIds({ id })).unwrap()
      setDialogOpenAgain(false)
      setSelectedGasCylinder(null)
      setSelectedGasData(null)
      toast.success("Cylinder deleted successfully.")
    } catch (error: any) {
      console.error("Error deleting cylinder:", error)
      const apiError =
        error?.error ||
        error?.message ||
        "An error occurred while deleting the cylinder."
      toast.error(apiError)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateCylinderData = async (id: string) => {
    const storeData = selectedGasCylinder || {}
    const stockId = storeId

    const formData = {
      store_id: stockId,
      cylinder_id: selectedGasCylinder?.cylinder?.id,
      weightId: selectedGasCylinder?.cylinder?.weight?.id,
      weight: selectedGasCylinder?.cylinder?.weight?.weight,
      empties: storeData.empty_cylinder_quantity,
      filled: storeData.full_cylinder_quantity,
      spoiled: storeData.spoiled_cylinder_quantity,
      retail_refill_price: selectedGasCylinder?.cylinder?.retail_refill_price,
      wholesale_refill_price:
        selectedGasCylinder?.cylinder?.wholesale_refill_price,
      complete_retail_price:
        selectedGasCylinder?.cylinder?.complete_retail_price,
      complete_wholesale_price:
        selectedGasCylinder?.cylinder?.complete_wholesale_price,
      outlet_wholesale_price:
        selectedGasCylinder?.cylinder?.outlet_wholesale_price,
      outlet_retail_price: selectedGasCylinder?.cylinder?.outlet_retail_price,
      empty_cylinder_price: selectedGasCylinder?.cylinder?.empty_cylinder_price,
      depot_refill_price: selectedGasCylinder?.cylinder?.depot_refill_price,
    }
    try {
      await dispatch(
        updateThisStoreCylinders({ stockId, dat: formData }),
      ).unwrap()
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

  const updateCylinderTypeStatus = useAppSelector(
    (state) => state.storeCylinders.updateCylinderTypeStatus,
  )

  const handleUpdateCylinder = async (id) => {
    const formData = { name: selectedGas.name }
    setIsUpdating(true)
    try {
      await dispatch(updateCylinders({ dat: formData, id: id })).unwrap()
      setIsUpdating(false)
      toast.success("Cylinder name updated successfully.")
      setDialogOpen(false)
    } catch (error) {
      setIsUpdating(false)
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
      setSelectedWeight(thisWeight.weight.id)
      setOpenWeight(false)
      setNewWeight("")
      setAddingNewWeight(false)
    } catch (error: any) {
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
      store_id: storeId,
      weight_id: selectedWeight,
      wholesale_refill_price: wholesaleRefillPrice,
      retail_refill_price: retailRefillPrice,
      outlet_wholesale_price: outletWholeSale,
      outlet_retail_price: outletRetail,
      complete_wholesale_price: completeWholeSale,
      complete_retail_price: completeRetail,
      depot_refill_price: depositPrice,
      filled: fullCylindersStock,
      empties: emptyCylindersStock,
      spoiled: spoiledCylindersStock,
      empty_cylinder_price: emptyCylinderPrice,
    }
    try {
      await dispatch(
        addStoreCylinders({
          dat: { ...formData, cylinder_type_id: selectedGas.id },
        }),
      ).unwrap()
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
      setDialogOpen(false)
      toast.success("Cylinder recorded successfully!")
    } catch (error: any) {
      setAddingNewCylinder(false)
      toast.error(error.message || error.toString() || "Failed to add cylinder")
    }
  }

  // Group cylinders by cylinder type
  const groupCylindersByType = () => {
    const grouped = {}
    storeCylinder.forEach((item) => {
      const typeName = item.cylinder?.cylinder_type?.name || "Unknown"
      if (!grouped[typeName]) {
        grouped[typeName] = []
      }
      grouped[typeName].push(item)
    })
    return grouped
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

          <main className="flex-grow m-2 p-1">
            {/* Header Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex flex-col space-y-3">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-2">🛢️</span>
                  Store Cylinders Stock
                </h2>

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
            </div>

            {/* Content Section */}
            <div>
              {/* Loading State */}
              {fetchingStoreStatus === "loading" && (
                <div className="grid grid-cols-1 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <Skeleton variant="text" height={28} width="60%" />
                      <Skeleton
                        variant="rectangular"
                        height={150}
                        className="mt-3"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State - No Store Selected */}
              {!storeId && fetchingStoreStatus !== "loading" && (
                <div className="text-center p-12 bg-white rounded-lg shadow-md">
                  <div className="text-6xl mb-4">🏪</div>
                  <p className="text-gray-500 text-lg">
                    Please select a store to view cylinder inventory
                  </p>
                </div>
              )}

              {/* Empty State - No Cylinders */}
              {storeId &&
                fetchingStoreStatus === "succeeded" &&
                storeCylinder.length === 0 && (
                  <div className="text-center p-12 bg-white rounded-lg shadow-md">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-500 mb-2 text-lg">
                      No cylinders available in this store.
                    </p>
                    <Link
                      to="/cylinders/add"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Add cylinders to inventory
                    </Link>
                  </div>
                )}

              {/* Cylinder Cards */}
              {fetchingStoreStatus === "succeeded" &&
                storeCylinder.length > 0 && (
                  <div className="space-y-4">
                    {Object.entries(groupCylindersByType()).map(
                      ([typeName, cylinders]) => (
                        <div
                          key={typeName}
                          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-blue-600 flex items-center">
                              <span className="mr-2">🛢️</span>
                              {typeName}
                            </h3>
                            <button
                              onClick={() =>
                                handleOpenDialog("add", {
                                  name: typeName,
                                  id: cylinders[0]?.cylinder?.cylinder_type?.id,
                                })
                              }
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center text-sm font-semibold"
                            >
                              <AddBoxIcon sx={{ fontSize: 20, mr: 0.5 }} />
                              Add Weight
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full border text-sm">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                                    Weight
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-green-600">
                                    Full
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                    Empty
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-red-600">
                                    Spoiled
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                    Total
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {cylinders.map((item) => (
                                  <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition"
                                  >
                                    <td className="border border-gray-300 px-3 py-2">
                                      <div className="font-medium">
                                        {item.cylinder?.weight?.weight || "N/A"}
                                        kg
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {item.cylinder?.display_name || ""}
                                      </div>
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-green-600">
                                      {item.full_cylinder_quantity || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      {item.empty_cylinder_quantity || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-red-600">
                                      {item.spoiled_cylinder_quantity || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                      {item.total_quantity || 0}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">
                                      <div className="flex items-center justify-center space-x-2">
                                        <button
                                          onClick={() =>
                                            handleOpenDialogAgain(
                                              "update",
                                              { name: typeName },
                                              item,
                                            )
                                          }
                                          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-600 transition"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleOpenDialogAgain(
                                              "delete",
                                              { name: typeName },
                                              item,
                                            )
                                          }
                                          className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

              {/* Error State */}
              {fetchingStoreStatus === "failed" && (
                <div className="text-center p-12 bg-red-50 rounded-lg shadow-md">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-red-500 font-medium text-lg">
                    Failed to load cylinder data. Please try again later.
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* Dialogs remain the same */}
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle className="font-semibold">
              {dialogType === "add" && `Add a ${selectedGas?.name} Cylinder`}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        options={[
                          ...storeCylinderWeight.map((weight: any) => ({
                            value: weight.id,
                            label: weight.weight + " kg",
                          })),
                        ]}
                        value={
                          selectedWeight
                            ? {
                                value: selectedWeight,
                                label:
                                  storeCylinderWeight.find(
                                    (weight: any) =>
                                      weight.id === selectedWeight,
                                  )?.weight + " kg",
                              }
                            : null
                        }
                        onChange={(selected) => {
                          const id = (selected as any)?.value ?? null
                          setSelectedWeight(id)
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prices
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Outlet Wholesale Price (Full)
                        </label>
                        <KenyanCurrencyInput
                          value={outletWholeSale}
                          onChange={(value) => setOutletWholeSale(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Outlet Retail Price (Full)
                        </label>
                        <KenyanCurrencyInput
                          value={outletRetail}
                          onChange={(value) => setOutletRetail(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Complete Wholesale (Grill + Burner)
                        </label>
                        <KenyanCurrencyInput
                          value={completeWholeSale}
                          onChange={(value) => setCompleteWholeSale(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Complete Retail (Grill + Burner)
                        </label>
                        <KenyanCurrencyInput
                          value={completeRetail}
                          onChange={(value) => setCompleteRetail(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Empty Cylinder Price
                        </label>
                        <KenyanCurrencyInput
                          value={emptyCylinderPrice}
                          onChange={(value) => setEmptyCylinderPrice(value)}
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantities
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {dialogTypeAgain === "delete" &&
                `Delete: ${selectedGasData?.name} ${selectedGasCylinder?.cylinder?.weight?.weight}kg`}
              {dialogTypeAgain === "update" &&
                `Update: ${selectedGasData?.name} ${selectedGasCylinder?.cylinder?.weight?.weight}kg`}
            </DialogTitle>

            <DialogContent>
              {dialogTypeAgain === "delete" && (
                <p className="text-gray-700">
                  Are you sure you want to delete{" "}
                  <strong>
                    {selectedGasData?.name}{" "}
                    {selectedGasCylinder?.cylinder?.weight?.weight}kg
                  </strong>
                  ?
                </p>
              )}

              {dialogTypeAgain === "update" && (
                <form className="space-y-4">
                  <Input
                    label="Cylinder Weight"
                    type="number"
                    value={selectedGasCylinder?.cylinder?.weight?.weight || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          weight: {
                            ...prev.cylinder.weight,
                            weight: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                  <Input
                    label="Cylinder Filled"
                    type="number"
                    value={selectedGasCylinder?.full_cylinder_quantity || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        full_cylinder_quantity: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Cylinder Empties"
                    type="number"
                    value={selectedGasCylinder?.empty_cylinder_quantity || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        empty_cylinder_quantity: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Cylinder Spoiled"
                    type="number"
                    value={selectedGasCylinder?.spoiled_cylinder_quantity || ""}
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        spoiled_cylinder_quantity: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Retail Refill Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.retail_refill_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          retail_refill_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Wholesale Refill Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.wholesale_refill_price ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          wholesale_refill_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Outlet Retail Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.outlet_retail_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          outlet_retail_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Outlet Wholesale Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.outlet_wholesale_price ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          outlet_wholesale_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Complete Retail Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.complete_retail_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          complete_retail_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Complete Wholesale Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.complete_wholesale_price ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          complete_wholesale_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Empty Cylinder Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.empty_cylinder_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          empty_cylinder_price: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    label="Depot Refill Price"
                    type="number"
                    value={
                      selectedGasCylinder?.cylinder?.depot_refill_price || ""
                    }
                    onChange={(e) =>
                      setSelectedGasCylinder((prev) => ({
                        ...prev,
                        cylinder: {
                          ...prev.cylinder,
                          depot_refill_price: e.target.value,
                        },
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
                    handleUpdateCylinderData(
                      selectedGasCylinder?.id,
                      selectedGasCylinder?.id,
                    )
                  }
                  disabled={isUpdating}
                >
                  {isUpdating ? <CircularProgress size={24} /> : "Update"}
                </Button>
              )}
            </DialogActions>
          </Dialog>

          <Dialog open={openWeight} onClose={handleCloseDialogueOfWeight}>
            <DialogTitle>Cylinder Weight</DialogTitle>
            <DialogContent>
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

          <footer className="text-white">
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