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
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import CircularProgress from "@mui/material/CircularProgress"
import AddBoxIcon from "@mui/icons-material/AddBox"
import Select from "react-select"

import planStatus from "../../features/planStatus/planStatus"
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
import {
  createCylindersWeight,
  fetchCylindersWeight,
  selectAllCylindersWeight,
} from "../../features/cylinders/cylindersWeightSlice"
import { fetchStore, selectAllStore } from "../../features/store/storeSlice"
import KenyanCurrencyInput from "../../components/KenyanCurrencyInput"
import {
  addStoreCylinders,
  fetchStoreCylinders,
  selectAllStoreCylinders,
} from "../../features/store/storeCylindersSlice"

const AddCylinders = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { businessId } = useAppSelector((state) => state.planStatus)

  const [showAddBrandModal, setShowAddBrandModal] = useState(false)
  const [showAddWeightModal, setShowAddWeightModal] = useState(false)

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = useState(false)
  const [openWeight, setOpenWeight] = useState(false)
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
  const [storeId, setStoreId] = useState("")

  const handleAddCylinder = async (e: any) => {
    e.preventDefault()

    if (!storeId) {
      toast.error("Please select a store")
      return
    }
    if (!selectedBrand) {
      toast.error("Please select a brand")
      return
    }
    if (!selectedWeight) {
      toast.error("Please select a weight")
      return
    }

    setAddingNewCylinder(true)
    const dat = {
      store_id: storeId,
      cylinder_type_id: selectedBrand,
      weight_id: selectedWeight,
      wholesale_refill_price: wholesaleRefillPrice,
      retail_refill_price: retailRefillPrice,
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
      await dispatch(addStoreCylinders({ dat })).unwrap()
      // Reset form
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
      setAddingNewCylinder(false)
      toast.error(error.message || error.toString() || "Failed to add cylinder")
    }
  }

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleCloseWeight = () => setOpenWeight(false)
  const handleClickOpenWeight = () => setOpenWeight(true)

  const allCylinderBrands = useAppSelector(selectAllCylinderBrands)
  const allCylinderWeights = useAppSelector(selectAllCylindersWeight)
  const store = useAppSelector(selectAllStore)
  const storeCylinder = useAppSelector(selectAllStoreCylinders)

  useEffect(() => {
    if (storeId) {
      dispatch(fetchCylindersBrand())
      dispatch(fetchCylindersWeight())
      dispatch(fetchStoreCylinders({ storeId }))
    }
  }, [dispatch, storeId])

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  useEffect(() => {
    if (selectedBrand == null || selectedWeight == null) return

    const brandId = Number(selectedBrand)
    const weightId = Number(selectedWeight)

    const exists = storeCylinder.some((s: any) => {
      const cylinders = Array.isArray(s.cylinder)
        ? s.cylinder
        : s.cylinder
        ? [s.cylinder]
        : []
      return cylinders.some((c: any) => {
        const cyl = c.cylinder ?? c
        const cWeightId = Number(
          cyl?.weight?.id ?? cyl?.weight ?? cyl?.weight_id ?? null,
        )
        const cBrandId = Number(
          cyl?.cylinder_type?.id ?? cyl?.gas_type ?? cyl?.brand_id ?? null,
        )
        return cBrandId === brandId && cWeightId === weightId
      })
    })

    if (exists) {
      toast.warning(
        "Cylinder with this brand and weight already exists in store",
      )
      setSelectedBrand(null)
      setSelectedWeight(null)
    }
  }, [selectedBrand, selectedWeight, storeCylinder])

  const handleAddNewBrand = async (e: any) => {
    e.preventDefault()
    if (!newBrandName.trim()) {
      toast.error("Please enter a brand name")
      return
    }
    setAddingNewBrand(true)
    try {
      const newBrand = await dispatch(
        createCylindersBrand({ name: newBrandName }),
      ).unwrap()
      setSelectedBrand(newBrand.type.id)
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
    if (!newWeight.trim()) {
      toast.error("Please enter a weight")
      return
    }
    setAddingNewWeight(true)
    try {
      const thisWeight = await dispatch(
        createCylindersWeight({ weight: newWeight }),
      ).unwrap()
      setSelectedWeight(thisWeight.weight.id)
      toast.success("Weight added successfully!")
      setOpenWeight(false)
      setNewWeight("")
      setAddingNewWeight(false)
    } catch (error: any) {
      setAddingNewWeight(false)
      toast.error(
        error.message || error.toString() || "Failed to add new weight",
      )
    }
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Add Cylinders"}
            headerText={"Add new cylinders to your inventory"}
          />
          <ToastContainer />

          <main className="flex-grow p-4 pb-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3 text-3xl">🛢️</span>
                  Add New Cylinder
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Fill in the details to add cylinders to your inventory
                </p>
              </div>

              {/* Form */}
              <form className="p-6 space-y-6" onSubmit={handleAddCylinder}>
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
                    {store.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand & Weight Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <span className="mr-2">🏷️</span>
                    Cylinder Details
                  </h3>

                  {/* Brand Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand Name *
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        options={allCylinderBrands.map((brand: any) => ({
                          value: brand.id,
                          label: brand.name,
                        }))}
                        value={
                          selectedBrand
                            ? {
                                value: selectedBrand,
                                label: allCylinderBrands.find(
                                  (brand: any) => brand.id === selectedBrand,
                                )?.name,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          const id = (selected as any)?.value ?? null
                          setSelectedBrand(id)
                        }}
                        placeholder="Select Brand"
                        isClearable
                        className="flex-grow"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "48px",
                            borderColor: "#d1d5db",
                            "&:hover": { borderColor: "#3b82f6" },
                          }),
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleClickOpen}
                        className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition active:scale-95"
                      >
                        <AddBoxIcon sx={{ fontSize: 24 }} />
                      </button>
                    </div>
                  </div>

                  {/* Weight Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Weight (kg) *
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        options={allCylinderWeights.map((weight: any) => ({
                          value: weight.id,
                          label: weight.weight + " kg",
                        }))}
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
                        }}
                        placeholder="Select Weight"
                        isClearable
                        className="flex-grow"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "48px",
                            borderColor: "#d1d5db",
                            "&:hover": { borderColor: "#3b82f6" },
                          }),
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleClickOpenWeight}
                        className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition active:scale-95"
                      >
                        <AddBoxIcon sx={{ fontSize: 24 }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <span className="mr-2">💰</span>
                    Pricing Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Outlet Prices */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3 text-sm">
                        Outlet Prices (Full Cylinder)
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Wholesale
                          </label>
                          <KenyanCurrencyInput
                            value={outletWholeSale}
                            onChange={(value) => setOutletWholeSale(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Retail
                          </label>
                          <KenyanCurrencyInput
                            value={outletRetail}
                            onChange={(value) => setOutletRetail(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Complete Package */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-3 text-sm">
                        Complete Package (Grill + Burner)
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Wholesale
                          </label>
                          <KenyanCurrencyInput
                            value={completeWholeSale}
                            onChange={(value) => setCompleteWholeSale(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Retail
                          </label>
                          <KenyanCurrencyInput
                            value={completeRetail}
                            onChange={(value) => setCompleteRetail(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Refill & Other Prices */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3 text-sm">
                        Refill & Other Prices
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Wholesale Refill
                          </label>
                          <KenyanCurrencyInput
                            value={wholesaleRefillPrice}
                            onChange={(value) => setWholesaleRefillPrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Retail Refill
                          </label>
                          <KenyanCurrencyInput
                            value={retailRefillPrice}
                            onChange={(value) => setRetailRefillPrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Empty Cylinder
                          </label>
                          <KenyanCurrencyInput
                            value={emptyCylinderPrice}
                            onChange={(value) => setEmptyCylinderPrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Depot Refill
                          </label>
                          <KenyanCurrencyInput
                            value={depositPrice}
                            onChange={(value) => setDepositPrice(value)}
                            className="w-full p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Quantities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                    <span className="mr-2">📊</span>
                    Initial Stock Quantities
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-green-800 mb-2">
                        Full
                      </label>
                      <input
                        min={0}
                        type="number"
                        placeholder="0"
                        value={fullCylindersStock}
                        onChange={(e) =>
                          setFullCylindersStock(Number(e.target.value))
                        }
                        className="w-full p-2 rounded-md border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-center font-semibold text-lg"
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-blue-800 mb-2">
                        Empty
                      </label>
                      <input
                        min={0}
                        value={emptyCylindersStock}
                        onChange={(e) =>
                          setEmptyCylindersStock(Number(e.target.value))
                        }
                        type="number"
                        placeholder="0"
                        className="w-full p-2 rounded-md border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-center font-semibold text-lg"
                      />
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-red-800 mb-2">
                        Spoiled
                      </label>
                      <input
                        min={0}
                        value={spoiledCylindersStock}
                        onChange={(e) =>
                          setSpoiledCylindersStock(Number(e.target.value))
                        }
                        type="number"
                        placeholder="0"
                        className="w-full p-2 rounded-md border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-center font-semibold text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {addingNewCylinder ? (
                    <button
                      type="button"
                      disabled
                      className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <CircularProgress size={24} style={{ color: "white" }} />
                      Adding Cylinder...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <AddBoxIcon />
                      Add Cylinder to Inventory
                    </button>
                  )}
                </div>
              </form>
            </div>
          </main>

          {/* Add Brand Dialog */}
          <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              Add Cylinder Brand
            </DialogTitle>
            <DialogContent className="mt-4">
              <TextField
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                autoFocus
                required
                margin="dense"
                id="brand"
                name="cylinder_brand"
                label="Brand Name"
                type="text"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              {addingNewBrand ? (
                <Button disabled>
                  <CircularProgress size={20} thickness={4} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleAddNewBrand}
                  variant="contained"
                >
                  Add Brand
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Add Weight Dialog */}
          <Dialog
            open={openWeight}
            onClose={handleCloseWeight}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              Add Cylinder Weight
            </DialogTitle>
            <DialogContent className="mt-4">
              <TextField
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                autoFocus
                required
                margin="dense"
                type="number"
                id="weight"
                name="cylinder_weight"
                label="Weight (kg)"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={handleCloseWeight} variant="outlined">
                Cancel
              </Button>
              {addingNewWeight ? (
                <Button disabled>
                  <CircularProgress size={20} thickness={4} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleAddNewWeight}
                  variant="contained"
                >
                  Add Weight
                </Button>
              )}
            </DialogActions>
          </Dialog>

          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-8 min-h-screen bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">
              Desktop View Coming Soon
            </h2>
            <p className="text-gray-600">
              The desktop version of this feature is under development. Please
              use a mobile device for now.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCylinders
