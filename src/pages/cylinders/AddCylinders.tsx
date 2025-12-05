// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import { CiSquarePlus } from "react-icons/ci"
import Button from "@mui/material/Button"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CircularProgress from "@mui/material/CircularProgress"

import planStatus from "../../features/planStatus/planStatus"
import AddBoxIcon from "@mui/icons-material/AddBox"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../../features/salesTeam/salesTeamSlice"
import AdminsFooter from "../../components/AdminsFooter"
import {
  createCylindersBrand,
  fetchCylindersBrand,
  selectAllCylinderBrands,
} from "../../features/cylinders/cylindersBrandSlice"
import Select from "react-select"
import {
  createCylindersWeight,
  fetchCylindersWeight,
  selectAllCylindersWeight,
} from "../../features/cylinders/cylindersWeightSlice"
import { all } from "axios"
import {
  addNewCylinders,
  fetchStore,
  selectAllStore,
} from "../../features/store/storeSlice"
import { set } from "cookies"
import KenyanCurrencyInput from "../../components/KenyanCurrencyInput"

const AddCylinders = () => {
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
  const [showAddBrandModal, setShowAddBrandModal] = useState(false)
  const [showAddWeightModal, setShowAddWeightModal] = useState(false)

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = React.useState(false)
  const [openWeight, setOpenWeight] = React.useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedWeight, setSelectedWeight] = useState(null)
  const [addingNewBrand, setAddingNewBrand] = useState(false)

  const [outletWholeSale, setOutletWholeSale] = useState(0)
  const [outletRetail, setOutletRetail] = useState(0)
  const [completeWholeSale, setCompleteWholeSale] = useState(0)
  const [completeRetail, setCompleteRetail] = useState(0)
  const [emptyCylinderPrice, setEmptyCylinderPrice] = useState(0)
  const [wholesaleRefillPrice, setWholesaleRefillPrice] = useState(0)
  const [retailRefillPrice, setRetailRefillPrice] = useState(0)
  const [depositPrice, setDepositPrice] = useState(0)
  const [fullCylindersStock, setFullCylindersStock] = useState(0)
  const [emptyCylindersStock, setEmptyCylindersStock] = useState(0)
  const [spoiledCylindersStock, setSpoiledCylindersStock] = useState(0)
  const [addingNewCylinder, setAddingNewCylinder] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [addingNewWeight, setAddingNewWeight] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")

  const handleAddCylinder = async (e: any) => {
    e.preventDefault()
    setAddingNewCylinder(true)
    const formData = {
      gas_type: selectedBrand,
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
      await dispatch(addNewCylinders({ businessId, formData })).unwrap()
      setSelectedBrand(null)
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
      console.error("Error adding cylinder:", error)
      setAddingNewCylinder(false)
      toast.error(error.message || error.toString() || "Failed to add cylinder")
    }
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseWeight = () => {
    setOpenWeight(false)
  }

  const handleClickOpenWeight = () => {
    setOpenWeight(true)
  }

  const allCylinderBrands = useAppSelector(selectAllCylinderBrands)
  const allCylinderWeights = useAppSelector(selectAllCylindersWeight)
  const store = useAppSelector(selectAllStore)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchCylindersBrand())
      dispatch(fetchCylindersWeight())
      dispatch(fetchStore({ businessId }))
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (selectedBrand == null || selectedWeight == null) return

    const brandId = Number(selectedBrand)
    const weightId = Number(selectedWeight)

    const exists = store.some(
      (s: any) =>
        Array.isArray(s.cylinders) &&
        s.cylinders.some((c: any) => {
          // cylinder weight might be an object { id: ... } or an id directly
          const cWeightId = c.weight?.id ?? c.weight ?? null
          // brand id on the cylinder in your example is stored as gas_type
          const cBrandId = c.gas_type ?? c.brand_id ?? null
          return cBrandId == brandId && cWeightId == weightId
        }),
    )

    if (exists) {
      alert(
        "Cylinder with the selected brand and weight already exists in store",
      )
      // optional: clear selections to force user to pick different values
      setSelectedBrand(null)
      setSelectedWeight(null)
    }
  }, [selectedBrand, selectedWeight, store])

  const handleAddNewBrand = async (e: any) => {
    e.preventDefault()
    setAddingNewBrand(true)
    try {
      const newBrand = await dispatch(
        createCylindersBrand({ name: newBrandName }),
      ).unwrap()
      setSelectedBrand(newBrand.id)
      toast.success("Brand added successfully!")
      setOpen(false)
      setNewBrandName("")
      setAddingNewBrand(false)
    } catch (error: any) {
      setAddingNewBrand(false)
      toast.error(
        error.message || error.toString() || "Failed to add new brand",
      )
    }
  }

  const handleAddNewWeight = async (e: any) => {
    e.preventDefault()
    setAddingNewWeight(true)
    try {
      const thisWeight = await dispatch(
        createCylindersWeight({ weight: newWeight }),
      ).unwrap();

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

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <ToastContainer />
          <main className="flex-grow m-2 p-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Add Cylinders</h2>
              <form className="space-y-6" onSubmit={handleAddCylinder}>
                {/* Cylinder Brand Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <div className="flex items-center gap-2">
                    <Select
                      options={[
                        ...allCylinderBrands.map((brand: any) => ({
                          value: brand.id,
                          label: brand.name,
                        })),
                      ]}
                      value={
                        selectedBrand ? {
                          value: selectedBrand,
                          label: allCylinderBrands.find((brand:any) => brand.id === selectedBrand)?.name,
                        }: null
                      }
                      onChange={(selected) => {
                        const id = (selected as any)?.value ?? null
                        setSelectedBrand(id)
                        // console.log("selected brand id:", id) // use this id as needed (set state, send to API, etc.)
                        if (id === "add_new") setShowAddBrandModal(true)
                      }}
                      placeholder="Select Brand"
                      isClearable
                      className="flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => handleClickOpen()}
                      className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                      <AddBoxIcon sx={{ fontSize: 24 }} />
                    </button>
                  </div>
                </div>

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
                        selectedWeight ? {
                          value: selectedWeight,
                          label: allCylinderWeights.find((weight:any) => weight.id === selectedWeight)?.weight + " kg",
                        } : null
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
                      onClick={() => handleClickOpenWeight()}
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

                {/* Submit Button */}
                <div>
                  {addingNewCylinder ? (
                    <button
                      type="button"
                      disabled
                      className="mx-auto flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md"
                      aria-live="polite"
                      aria-label="Adding cylinders"
                    >
                      <CircularProgress
                        size={20}
                        thickness={4}
                        style={{ color: "white" }}
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                      Add Cylinders
                    </button>
                  )}
                </div>
              </form>
            </div>
            {/* add cylinder brand dialogue */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Cylinder Brand</DialogTitle>
              <DialogContent>
                <DialogContentText></DialogContentText>
                <form id="subscription-form">
                  <TextField
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    autoFocus
                    required
                    margin="dense"
                    id="brand"
                    name="cylinder_brand"
                    label="Cylinder brand"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {addingNewBrand ? (
                  <Button disabled>
                    <CircularProgress
                      size={20}
                      thickness={4}
                      style={{ color: "blue" }}
                    />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleAddNewBrand}>
                    Add
                  </Button>
                )}
              </DialogActions>
            </Dialog>

            {/* add cylinder Weight dialogue */}
            <Dialog open={openWeight} onClose={handleCloseWeight}>
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
                <Button onClick={handleCloseWeight}>Cancel</Button>
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
          </main>
          <footer>
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

export default AddCylinders
