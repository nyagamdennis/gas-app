// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../../utils/api"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import AddBoxIcon from "@mui/icons-material/AddBox"

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
  fetchCylindersWeight,
  selectAllCylindersWeight,
} from "../../features/cylinders/cylindersWeightSlice"

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

  const allCylinderWeights = useAppSelector(selectAllCylindersWeight)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
      dispatch(fetchCylindersWeight())
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
            <div className="bg-white p-4 rounded-lg shadow-md">
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
                      to="/admins/store"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Create a new store
                    </Link>
                  </div>
                )}

                {fetchingStoreStatus === "succeeded" && store.length > 0 && (
                  <div className="">
                    {store.map((gas) => (
                      <StoreCard
                        gas={gas}
                        onDialogOpen={handleOpenDialog}
                        onDialogOpenAgain={handleOpenDialogAgain}
                      />
                    ))}
                    {/* {store.map((gas) => (
                      <div
                        key={gas.id}
                        className="mb-4 bg-white p-3 rounded-lg shadow-xl"
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
                                    <th className="border px-2 py-1">Filled</th>
                                    <th className="border px-2 py-1">
                                      Empties
                                    </th>
                                    <th className="border px-2 py-1">
                                      Spoiled
                                    </th>
                                    <th className="border px-2 py-1">Total</th>
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
                    ))} */}
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
                // <form>
                //   <Input
                //     label="Cylinder Weight"
                //     type="number"
                //     value={anotherCylinderWeight}
                //     onChange={(e) => setAnotherCylinderWeight(e.target.value)}
                //   />
                //   <Input
                //     label="Filled"
                //     type="number"
                //     value={anotherCylinderFilled}
                //     onChange={(e) => setAnotherCylinderFilled(e.target.value)}
                //   />
                //   <Input
                //     label="Empties"
                //     type="number"
                //     value={anotherCylinderEmpties}
                //     onChange={(e) => setAnotherCylinderEmpties(e.target.value)}
                //   />
                //   <Input
                //     label="Spoiled"
                //     type="number"
                //     value={anotherCylinderSpoiled}
                //     onChange={(e) => setAnotherCylinderSpoiled(e.target.value)}
                //   />
                //   <Input
                //     label="Min Retail Selling Price"
                //     type="number"
                //     value={anotherCylinderMinRetailSelling}
                //     onChange={(e) =>
                //       setAnotherCylinderMinRetailSelling(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Min Wholesale Selling Price"
                //     type="number"
                //     value={anotherCylinderMinWholeSaleSelling}
                //     onChange={(e) =>
                //       setAnotherCylinderMinWholeSaleSelling(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Min Wholesale Refilling Price"
                //     type="number"
                //     value={anotherCylinderMinWholeSaleRefill}
                //     onChange={(e) =>
                //       setAnotherCylinderMinWholeSaleRefill(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Min Retail Refilling Price"
                //     type="number"
                //     value={anotherCylinderMinRetailRefill}
                //     onChange={(e) =>
                //       setAnotherCylinderMinRetailRefill(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Max Retail Selling Price"
                //     type="number"
                //     value={anotherCylinderMaxRetailSelling}
                //     onChange={(e) =>
                //       setAnotherCylinderMaxRetailSelling(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Max Wholesale Selling Price"
                //     type="number"
                //     value={anotherCylinderMaxWholeSaleSelling}
                //     onChange={(e) =>
                //       setAnotherCylinderMaxWholeSaleSelling(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Max Wholesale Refilling Price"
                //     type="number"
                //     value={anotherCylinderMaxWholeSaleRefill}
                //     onChange={(e) =>
                //       setAnotherCylinderMaxWholeSaleRefill(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Max Retail Refilling Price"
                //     type="number"
                //     value={anotherCylinderMaxRetailRefill}
                //     onChange={(e) =>
                //       setAnotherCylinderMaxRetailRefill(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="Empty Cylinder Price"
                //     type="number"
                //     value={anotherCylinderEmptyCylinderPrice}
                //     onChange={(e) =>
                //       setAnotherCylinderEmptyCylinderPrice(e.target.value)
                //     }
                //   />
                //   <Input
                //     label="depot refill price"
                //     type="number"
                //     value={anotherCylinderCylinderDepotRefillPrice}
                //     onChange={(e) =>
                //       setAnotherCylinderCylinderDepotRefillPrice(e.target.value)
                //     }
                //   />
                // </form>
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
                        onChange={(selected) => {
                          if (
                            selected &&
                            (selected as any).value === "add_new"
                          ) {
                            setShowAddBrandModal(true)
                          }
                        }}
                        placeholder="Select Weight"
                        isClearable
                        className="flex-grow"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAddBrandModal(true)}
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
                        <input
                          type="number"
                          placeholder="Enter outlet price"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Outlet Retail Price (Full Cylinder)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter outlet price"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Wholesale Refill Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Wholesale Refill Price
                        </label>
                        <input
                          type="number"
                          placeholder="Enter wholesale refill price"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Retail Refill Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Retail Refill Price
                        </label>
                        <input
                          type="number"
                          placeholder="Enter retail refill price"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Depot Refill Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Depot Refill Price
                        </label>
                        <input
                          type="number"
                          placeholder="Enter depot refill price"
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
                          type="number"
                          placeholder="Enter quantity"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Empty Cylinders */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Empty Cylinders
                        </label>
                        <input
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
                          type="number"
                          placeholder="Enter quantity"
                          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                      Add Cylinders
                    </button>
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
                <Button variant="contained" onClick={handleAddAnotherCylinder}>
                  Add
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
                    value={
                      selectedGasCylinder?.min_wholesale_selling_price || ""
                    }
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
                    value={
                      selectedGasCylinder?.max_wholesale_selling_price || ""
                    }
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
