// @ts-nocheck
import React, { useEffect, useState } from 'react'
import AdminNav from '../components/ui/AdminNav'
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchStore, getStoreError, getStoreStatus, selectAllStore } from '../features/store/storeSlice';
import planStatus from '../features/planStatus/planStatus';
import AdminsFooter from '../components/AdminsFooter';
import { stockupCylinders } from '../features/stockup/stockupSlice';

const Stockup = () => {
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


        const { teamId, teamName } = useParams<{ teamId: string; teamName: string }>()
        const [loadingAssign, setLoadingAssign] = useState(false)
        const store = useAppSelector(selectAllStore)
          const fetchingStoreStatus = useAppSelector(getStoreStatus)
          const fetchingStoreError = useAppSelector(getStoreError)
            const [assignments, setAssignments] = useState([])
          const dispatch = useAppDispatch()
          const selectedTeam = teamId ? parseInt(teamId, 10) : null


          useEffect(() => {
              if (selectedTeam && businessId) {
                dispatch(fetchStore({ businessId }))
              }
            }, [selectedTeam, businessId, dispatch])
          


            const handleInputChange = (storeId, cylinderId, weightId, field, value) => {
    setAssignments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.storeId === storeId)

      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          [field]: parseInt(value, 10),
          // storeId,
          // cylinderId,
          // weightId,
          // assigned_quantity: parseInt(value, 10),
        }
      } else {
        updated.push({
          storeId,
          cylinderId,
          weightId,
          [field] : parseInt(value, 10),
        })
      }

      return updated
    })
  }


  const handleAssign = () => {
      // setLoadingAssign(true)
      const payload = assignments.map((item) => ({
        sales_team: selectedTeam,
        cylinder: item.cylinderId,
        filled: item.filled || 0,
        empties: item.empties || 0,
        spoiled: item.spoiled || 0,
      }))
      console.log("Payload for assignment:", payload)
  
      dispatch(stockupCylinders(payload))
        // .then(() =>
        //   navigate(`/admins/afterassign/${selectedTeam?.id}`, {
        //     state: { salesTeamName: selectedTeam?.name },
        //   }),
        // )
        // .catch((error) => console.error("Error in cylinder assignment:", error))
        // .finally(() => setLoadingAssign(false))
    }

  return (
    <div>
      <AdminNav headerMessage={teamName} headerText={'Stock up'} />
      <main className="justify-center min-h-screen bg-gray-100">
        <div>
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
                                   
                                  </tr>
                                </thead>
                                <tbody>
                                  {cylinder.stores.map((storeItem) => (
                                    <tr key={storeItem.id}>
                                      <td className="border px-2 py-1 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          // max={storeItem.filled}
                                          className="w-full border px-1 py-1"
                                          onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                              handleInputChange(
                                                storeItem.id,
                                                storeItem.id,
                                                cylinder.weight.id,
                                                'filled', // or 'empties' or 'spoiled'
                                                value
                                              );
                                          }}

                                        />
                                      </td>
                                      <td className="border px-2 py-1 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          // max={storeItem.filled}
                                          className="w-full border px-1 py-1"
                                          onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                              handleInputChange(
                                                storeItem.id,
                                                storeItem.id,
                                                cylinder.weight.id,
                                                'empties', // or 'empties' or 'spoiled'
                                                value
                                              );
                                          }}
                                        />
                                      </td>
                                      <td className="border px-2 py-1 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          // max={storeItem.filled}
                                          className="w-full border px-1 py-1"
                                          onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                              handleInputChange(
                                                storeItem.id,
                                                storeItem.id,
                                                cylinder.weight.id,
                                                'spoiled', // or 'empties' or 'spoiled'
                                                value
                                              );
                                          }}
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
                    {loadingAssign ? "Stocking..." : "Stock Up"}
                  </button>
                )}
              </div>
        </div>
      </main>
      <AdminsFooter />

      
    </div>
  )
}

export default Stockup