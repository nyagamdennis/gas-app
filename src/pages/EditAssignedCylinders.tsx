// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate, useParams } from "react-router-dom"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import { fetchStore, selectAllStore } from "../features/store/storeSlice"
import {
  assignedCylindersUpdate,
  fetchAssignedCylinders,
  selectAllAssigns,
} from "../features/assigns/assignsSlice"

const EditAssignedCylinders = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const salesTeamId = useParams()
  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const store = useAppSelector(selectAllStore)
  const cylinders = useAppSelector(selectAllAssigns)
  console.log('assigned ', cylinders)

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)
console.log('assigned data ', assignments)

  const salesTeam = allSalesTeam.find(
    (team) => team.id === parseInt(salesTeamId?.id),
  )
  //  console.log('team id ', salesTeam)
  const [salesTeamName, setSalesTeamName] = useState(salesTeam?.name)
  useEffect(() => {
    dispatch(fetchSalesTeam())
    dispatch(fetchStore())
    dispatch(fetchAssignedCylinders(salesTeamId?.id))
  }, [dispatch])

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
  }


  const handleAssign = () => {
    setLoadingAssign(true)
    
    const payload = assignments.map((item) => ({
      sales_team: salesTeam?.id,
      cylinder: item.cylinderId,
      assignedCylinderId: item.assignedCylinderId,
      assigned_quantity: item.assigned_quantity,
    }))
    dispatch(assignedCylindersUpdate(payload))
      .then(() =>
        navigate(`/admins/afterassign/${salesTeam?.id}`, {
          state: { salesTeamName: salesTeam?.name },
        }),
      )
      .catch((error) => console.error("Error in cylinder assignment:", error))
      .finally(() => setLoadingAssign(false))
  }

  const getAssignedQuantity = (storeItemId) => {
    const found = cylinders.find((item) => item.cylinder === storeItemId)
    return found ? found.assigned_quantity : ""
  }

  const getAssignedData = (storeItemId) => {
    const found = cylinders.find((item) => item.cylinder === storeItemId)
    
    return found
      ? {
        assigned_quantity: found.assigned_quantity,
        assigned_cylinder_id: found.id,
      }
      : {
        assigned_quantity: "",
        assigned_cylinder_id: null,
      }
  }


  const getLocalAssignedValue = (storeItemId) => {
    const local = assignments.find((a) => a.storeId === storeItemId);
  
    // If we have a local assignment, return the value (even if it's an empty string)
    if (local) return local.assigned_quantity === undefined ? "" : local.assigned_quantity;
  
    // Fallback to backend data
    const fromBackend = getAssignedData(storeItemId).assigned_quantity;
    return fromBackend === undefined ? "" : fromBackend;
  };

  
  const handleInputChange = (storeId, cylinderId, assignedCylinderId, weightId, value) => {
    console.log('ass id ', assignedCylinderId)
    setAssignments((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.storeId === storeId);
  
      const isEmpty = value === "";
  
      const newEntry = {
        storeId,
        cylinderId,
        assignedCylinderId,
        weightId,
        assigned_quantity: isEmpty ? "" : parseInt(value, 10),
      };
  
      if (index !== -1) {
        updated[index] = newEntry;
      } else {
        updated.push(newEntry);
      }
  
      return updated;
    });
  };
  

  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div>
        <h2 className="text-xl font-bold text-center mb-4">
          Edit Cylinders assigned to {salesTeamName}
        </h2>
        <div>
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
                          <th className="border px-2 py-1">Empties</th>
                          <th className="border px-2 py-1">Spoiled</th>
                          <th className="border px-2 py-1">Total</th>
                          <th className="border px-2 py-1">Assigned</th>
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
                              className="w-full border px-1 py-1 border-green-700"
                              // value={getAssignedData(storeItem.id).assigned_quantity}
                              value={getLocalAssignedValue(storeItem.id)}
                              onChange={(e) =>
                                handleInputChange(
                                storeItem.id,
                                storeItem.id,
                                getAssignedData(storeItem.id).assigned_cylinder_id,
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
        <div className="mt-6 text-center">
          <button
            className={`bg-blue-500 text-white px-6 py-2 rounded-lg shadow ${
              loadingAssign
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            } transition`}
            onClick={handleAssign}
            disabled={loadingAssign}
          >
            {loadingAssign ? "Updating..." : "Update Cylinders"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditAssignedCylinders;