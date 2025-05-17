// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchSalesTeam,
  getSalesTeamStatus,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import {
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
} from "../features/store/storeSlice"
import { Link, useNavigate } from "react-router-dom"
import { assignCylinders } from "../features/assigns/assignsSlice"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"
import planStatus from "../features/planStatus/planStatus"
import Skeleton from "@mui/material/Skeleton"

const AssigningProducts = () => {
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

  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const fetchingSalesteamStatus = useAppSelector(getSalesTeamStatus)
  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const fetchingStoreError = useAppSelector(getStoreError)

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeam({ businessId }))
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (selectedTeam && businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [selectedTeam, businessId, dispatch])

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
  }

  const handleInputChange = (storeId, cylinderId, weightId, value) => {
    setAssignments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.storeId === storeId)

      if (index !== -1) {
        updated[index] = {
          storeId,
          cylinderId,
          weightId,
          assigned_quantity: parseInt(value, 10),
        }
      } else {
        updated.push({
          storeId,
          cylinderId,
          weightId,
          assigned_quantity: parseInt(value, 10),
        })
      }

      return updated.filter((item) => item.assigned_quantity > 0) // Remove items with 0 quantity
    })
  }

  const handleAssign = () => {
    setLoadingAssign(true)
    const payload = assignments.map((item) => ({
      sales_team: selectedTeam?.id,
      cylinder: item.cylinderId,
      assigned_quantity: item.assigned_quantity,
    }))

    dispatch(assignCylinders(payload))
      .then(() =>
        navigate(`/admins/afterassign/${selectedTeam?.id}`, {
          state: { salesTeamName: selectedTeam?.name },
        }),
      )
      .catch((error) => console.error("Error in cylinder assignment:", error))
      .finally(() => setLoadingAssign(false))
  }

  return (
    <div className=" bg-gray-100 min-h-screen flex flex-col">
      <main className="flex-grow">
        <AdminNav
          headerMessage={"Assign Cylinder"}
          headerText={"Issue cuylinders to your sales team."}
        />
        <div className="p-4">
          {!selectedTeam ? (
            <div>
              <h2 className="text-xl font-bold text-center mb-4">
                Select a Sales Team
              </h2>
              <div>
                {fetchingSalesteamStatus === "loading" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-white border border-blue-300 rounded-lg shadow-md p-5 space-y-4 animate-pulse"
                      >
                        <Skeleton variant="text" height={28} width="60%" />
                        <Skeleton variant="text" height={20} width="80%" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fetchingSalesteamStatus === "succeeded" &&
                    allSalesTeam.length === 0 && (
                      <div className="col-span-2 text-center text-gray-500">
                        No sales teams available.
                        <Link
                          to="/createteam"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          Create a new team
                        </Link>
                      </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fetchingSalesteamStatus === "succeeded" &&
                    allSalesTeam.map((team) => (
                      <div
                        key={team.id}
                        className="bg-white border border-blue-500 text-blue-600 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-blue-50 transition"
                        onClick={() => handleSelectTeam(team)}
                      >
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <p className="text-sm mt-1">
                          Type {team.type_of_sales_team?.name || "N/A"}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fetchingSalesteamStatus === "failed" && (
                    <div className="col-span-2 text-center text-red-500">
                      Failed to load sales teams. Please try again later.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-center mb-4">
                Assign Cylinders to {selectedTeam.name}
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



                        <div  className="mt-3">
                            <h4 className="text-base font-semibold">
                              Cylinder Weight: <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                            </h4>
                            
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
                                    <th className="border px-2 py-1">Assign</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  
                                    <tr >
                                      <td className="border px-2 py-1 text-center">
                                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                                      </td>
                                      <td className="border px-2 py-1 text-center">
                                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                                      </td>
                                      <td className="border px-2 py-1 text-center">
                                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                                      </td>
                                      <td className="border px-2 py-1 text-center">
                                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                                      </td>
                                      <td className="border px-2 py-1 text-center">
                                        
                                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
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
                      <div
                        key={gas.id}
                        className="mb-4 bg-white p-3 rounded-lg shadow-md"
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
                                    <th className="border px-2 py-1">Assign</th>
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
                                          max={storeItem.filled}
                                          className="w-full border px-1 py-1"
                                          onChange={(e) =>
                                            handleInputChange(
                                              storeItem.id,
                                              storeItem.id,
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
                  </div>
                )}
                {fetchingStoreStatus === "failed" && (
                  <div className="col-span-2 text-center text-red-500">
                    Failed to load stores. Please try again later.
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                {fetchingStoreStatus === "succeeded" && store.length > 0 && (
                  <button
                    className={`bg-blue-500 text-white px-6 py-2 rounded-lg shadow ${
                      loadingAssign
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    } transition`}
                    onClick={handleAssign}
                    disabled={loadingAssign}
                  >
                    {loadingAssign ? "Assigning..." : "Assign Cylinders"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer>
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AssigningProducts
