import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Link, useNavigate, useParams } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress"
import {
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material"
import {
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
} from "../../features/store/storeSlice"
import {
  fetchStoreCylinders,
  getStoreCylindersStatus,
  selectAllStoreCylinders,
} from "../../features/store/storeCylindersSlice"
import { fetchCylindersWeight, selectAllCylindersWeight } from "../../features/cylinders/cylindersWeightSlice"
import Navbar from "../../components/ui/mobile/employees/Navbar"
import { toast, ToastContainer } from "react-toastify"

const EmployeeStoreCylinders = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { businessId } = useAppSelector((state) => state.planStatus)

  // Get storeId and teamName from URL
  const { storeId, teamName } = useParams<{ storeId: string; teamName: string }>()

  const storeCylinder = useAppSelector(selectAllStoreCylinders)
  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreCylindersStatus)
  const fetchingStoreError = useAppSelector(getStoreError)

  // State for spoiled addition
  const [spoiledDialogOpen, setSpoiledDialogOpen] = useState(false)
  const [selectedCylinderItem, setSelectedCylinderItem] = useState<any>(null)
  const [spoiledToAdd, setSpoiledToAdd] = useState<number>(0)
  const [addingSpoiled, setAddingSpoiled] = useState(false)

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Fetch stores (needed only for potential context, but no selector UI)
  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  // Fetch cylinders when storeId is available from URL
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreCylinders({ storeId }))
    }
  }, [storeId, dispatch])

  // Fetch cylinder weights for display (if needed elsewhere)
  useEffect(() => {
    dispatch(fetchCylindersWeight())
  }, [dispatch])

  // Group cylinders by cylinder type
  const groupCylindersByType = () => {
    const grouped: Record<string, any[]> = {}
    storeCylinder.forEach((item) => {
      const typeName = item.cylinder?.cylinder_type?.name || "Unknown"
      if (!grouped[typeName]) {
        grouped[typeName] = []
      }
      grouped[typeName].push(item)
    })
    return grouped
  }

  // Handler to open the spoiled addition dialog
  const handleOpenSpoiledDialog = (cylinderItem: any) => {
    setSelectedCylinderItem(cylinderItem)
    setSpoiledToAdd(0)
    setSpoiledDialogOpen(true)
  }

  const handleCloseSpoiledDialog = () => {
    setSpoiledDialogOpen(false)
    setSelectedCylinderItem(null)
    setSpoiledToAdd(0)
  }

  // Function to add spoiled cylinders
  // TODO: Replace this with your actual API call to update the spoiled quantity
  const handleAddSpoiled = async () => {
    if (!selectedCylinderItem || spoiledToAdd <= 0) {
      toast.warning("Please enter a valid number of spoiled cylinders")
      return
    }

    setAddingSpoiled(true)
    try {
      // Example API call – adjust to your actual endpoint and payload
      // await dispatch(updateStoreCylinderSpoiled({
      //   storeCylinderId: selectedCylinderItem.id,
      //   spoiledToAdd: spoiledToAdd
      // })).unwrap()

      // Simulate success – replace with real dispatch
      console.log("Add spoiled:", {
        storeCylinderId: selectedCylinderItem.id,
        additionalSpoiled: spoiledToAdd,
      })
      toast.success(`Added ${spoiledToAdd} spoiled cylinder(s) successfully!`)

      // Refresh the cylinder list
      if (storeId) {
        await dispatch(fetchStoreCylinders({ storeId }))
      }
      handleCloseSpoiledDialog()
    } catch (error) {
      toast.error("Failed to add spoiled cylinders. Please try again.")
    } finally {
      setAddingSpoiled(false)
    }
  }

  if (!isMobile) {
    return (
      <div className="p-4">
        <p>Desktop view coming soon</p>
      </div>
    )
  }

  return (
    <div>
      <ToastContainer />
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
              {storeId && (
                <p className="text-sm text-gray-600">
                  Store ID: {storeId} {teamName && `| Team: ${teamName}`}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div>
            {/* Loading State */}
            {fetchingStoreStatus === "loading" && (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <Skeleton variant="text" height={28} width="60%" />
                    <Skeleton variant="rectangular" height={150} className="mt-3" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State - No Cylinders */}
            {storeId && fetchingStoreStatus === "succeeded" && storeCylinder.length === 0 && (
              <div className="text-center p-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 mb-2 text-lg">
                  No cylinders available in this store.
                </p>
              </div>
            )}

            {/* Cylinder Cards */}
            {fetchingStoreStatus === "succeeded" && storeCylinder.length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupCylindersByType()).map(([typeName, cylinders]) => (
                  <div
                    key={typeName}
                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-600 flex items-center">
                        <span className="mr-2">🛢️</span>
                        {typeName}
                      </h3>
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
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                              <td className="border border-gray-300 px-3 py-2">
                                <div className="font-medium">
                                  {item.cylinder?.weight?.weight || "N/A"} kg
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
                                <button
                                  onClick={() => handleOpenSpoiledDialog(item)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 transition"
                                >
                                  + Spoiled
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
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

        {/* Dialog for adding spoiled cylinders */}
        <Dialog open={spoiledDialogOpen} onClose={handleCloseSpoiledDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Add Spoiled Cylinders</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add spoiled quantity for{" "}
              <strong>
                {selectedCylinderItem?.cylinder?.cylinder_type?.name}{" "}
                {selectedCylinderItem?.cylinder?.weight?.weight}kg
              </strong>
              . Current spoiled: {selectedCylinderItem?.spoiled_cylinder_quantity || 0}.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Number of spoiled cylinders to add"
              type="number"
              fullWidth
              variant="standard"
              value={spoiledToAdd}
              onChange={(e) => setSpoiledToAdd(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSpoiledDialog}>Cancel</Button>
            <Button onClick={handleAddSpoiled} disabled={addingSpoiled} variant="contained" color="error">
              {addingSpoiled ? <CircularProgress size={20} color="inherit" /> : "Add Spoiled"}
            </Button>
          </DialogActions>
        </Dialog>

        <footer className="text-white">{/* <AdminsFooter /> */}</footer>
      </div>
    </div>
  )
}

export default EmployeeStoreCylinders