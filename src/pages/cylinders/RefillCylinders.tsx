// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
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
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchStore,
  getStoreStatus,
  selectAllStore,
} from "../../features/store/storeSlice"
import CircularProgress from "@mui/material/CircularProgress"
import planStatus from "../../features/planStatus/planStatus"

const RefillCylinders = () => {
  const [refillingCylinders, setRefillingCylinders] = useState(false)
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
  const [storeRefill, setStoreRefill] = useState([])

  const storeStatus = useAppSelector(getStoreStatus)
  const store = useAppSelector(selectAllStore)

  const [openRefill, setOpenRefill] = useState(false)

  const handleClickOpenRefills = () => {
    setOpenRefill(true)
  }

  const handleCloseRefills = () => {
    setOpenRefill(false)
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

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
      // dispatch(fetchOtherProducts({ businessId }))
    }
  }, [businessId, dispatch])

  const handleAddRefill = () => {
    // setLoadingAssign(true)
    setRefillingCylinders(true)
    const payload = storeRefill.map((item) => ({
      // sales_team: selectedTeam?.id,
      id: item.storeId,
      cylinder: item.cylinderId,
      refill_quantity: item.refill_quantity,
    }))
    try {
      dispatch(storeRefillCylinders({ payload }))
      setRefillingCylinders(false)
      toast.success("Refilling cylinders successfully.")
      setOpenRefill(false)
      setStoreRefill([])
    } catch (error) {
      setRefillingCylinders(false)
      toast.error("an error occured, try again.")
    }
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

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            <div className="">
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
                  store.map((gas) => (
                    // console.log("gases", gas),
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
                                  <th className="border px-2 py-1">Refill</th>
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
          </main>
          <footer className=" text-white">
            <AdminsFooter />
          </footer>

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
              <Button
                disabled={refillingCylinders}
                onClick={handleAddRefill}
                autoFocus
              >
                {refillingCylinders ? <CircularProgress size={24} /> : "Refill"}
              </Button>
            </DialogActions>
          </Dialog>
          
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default RefillCylinders
