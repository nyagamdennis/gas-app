//  @ts-nocheck
import React, { useEffect } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import CircularProgress from "@mui/material/CircularProgress"

import {
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
  storeRepairCylinders,
} from "../../features/store/storeSlice"
import { toast, ToastContainer } from "react-toastify"
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
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { Link } from "react-router-dom"
import StoreCard from "../../components/StoreCard"
import AdminsFooter from "../../components/AdminsFooter"
import { set } from "cookies"

const RepairCylindersStore = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
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

  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const fetchingStoreError = useAppSelector(getStoreError)

  const [storeRepair, setStoreRepair] = React.useState([])
  const [loadingAssign, setLoadingAssign] = React.useState(false)

  useEffect(() => {
      if (businessId) {
        dispatch(fetchStore({ businessId }))
      }
    }, [businessId, dispatch])

  const handleInputRepairChange = (storeId, cylinderId, weightId, value) => {
    const repair_quantity = Number(value); // Convert the input value to a
    setStoreRepair((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.storeId === storeId)

      if (index !== -1) {
        updated[index] = {
          storeId,
          cylinderId,
          weightId,
          repair_quantity,
        }
      } else {
        updated.push({
          storeId,
          cylinderId,
          weightId,
          repair_quantity,
        })
      }

      return updated.filter((item) => item.repair_quantity > 0) // Remove items with 0 quantity
    })
  }

  // console.log("Store Repair Data: ", storeRepair)
  const handleRepairs = async () => {
    setLoadingAssign(true)
    const payload = storeRepair.map((item) => ({
      // sales_team: selectedTeam?.id,
      id: item.storeId,
      cylinder: item.cylinderId,
      repair_quantity: item.repair_quantity,
    }))
    // console.log("Repairs ", payload)
    try {
      await dispatch(storeRepairCylinders({payload}))
      toast.success("Cylinders repaired successfully.")
      setLoadingAssign(false)
      setStoreRepair([])
    } catch (error) {
      setLoadingAssign(false)
      toast.error(error.message || "Failed to repair cylinders.")
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
              <h2 className="text-2xl font-semibold mb-4 underline">
                Repair Store Cylinders
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

                {fetchingStoreStatus === "succeeded" &&
                  store.length > 0 &&
                  store.map((gas) => (
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
                                  <th className="border px-2 py-1">Filled</th>
                                  <th className="border px-2 py-1">Empties</th>
                                  <th className="border px-2 py-1">Spoiled</th>
                                  <th className="border px-2 py-1">Total</th>
                                  <th className="border px-2 py-1">Repair</th>
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
                                        max={storeItem.spoiled}
                                        
                                        className="w-full border px-1 py-1"
                                        onChange={(e) =>
                                          handleInputRepairChange(
                                            // storeItem.id,
                                            storeItem.id,
                                            cylinder.id,
                                            cylinder.weight.id,
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
                  ))}
                  <div className=" flex space-x-1 items-center justify-center">
                  <button
                    onClick={handleRepairs}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow"
                  >
                    write off
                  </button>
                  <button
                    onClick={handleRepairs}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow"
                  >
                    repair
                  </button>
                  
                </div>
                {fetchingStoreStatus === "failed" && (
                  <div className="col-span-2 text-center text-red-500">
                    Failed to load stores. Please try again later.
                  </div>
                )}
              </div>
            </div>
          </main>
          
        

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

export default RepairCylindersStore
