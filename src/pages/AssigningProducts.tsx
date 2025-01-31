// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchSalesTeam, selectAllSalesTeam } from "../features/salesTeam/salesTeamSlice";
import { fetchStore, selectAllStore } from "../features/store/storeSlice";
import { useNavigate } from "react-router-dom";
import { assignCylinders } from "../features/assigns/assignsSlice";

const AssigningProducts = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allSalesTeam = useAppSelector(selectAllSalesTeam);
    const store = useAppSelector(selectAllStore);

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [assignments, setAssignments] = useState([]); 

    useEffect(() => {
        dispatch(fetchSalesTeam());
        dispatch(fetchStore());
    }, [dispatch]);

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    const handleInputChange = (storeId, cylinderId, weightId, value) => {
        setAssignments((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((item) => item.storeId === storeId);

            if (index !== -1) {
                updated[index] = { storeId, cylinderId, weightId, assigned_quantity: parseInt(value, 10) };
            } else {
                updated.push({ storeId, cylinderId, weightId, assigned_quantity: parseInt(value, 10) });
            }

            return updated.filter((item) => item.assigned_quantity > 0); // Remove items with 0 quantity
        });
    };

   

    const handleAssign = () => {
        const payload = assignments.map((item) => ({
          sales_team: selectedTeam?.id,
          cylinder: item.cylinderId,
          assigned_quantity: item.assigned_quantity,
        }));
    
    
        dispatch(assignCylinders(payload))
        .then(() => navigate(`/admins/afterassign/${selectedTeam?.id}`, { state: { salesTeamName: selectedTeam?.name } }))
      .catch((error) => console.error("Error in cylinder assignment:", error));
      };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {!selectedTeam ? (
                <div>
                    <h2 className="text-xl font-bold text-center mb-4">Select a Sales Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allSalesTeam.map((team) => (
                            <div
                                key={team.id}
                                className="bg-white border border-blue-500 text-blue-600 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-blue-50 transition"
                                onClick={() => handleSelectTeam(team)}
                            >
                                <h3 className="text-lg font-semibold">{team.name}</h3>
                                <p className="text-sm mt-1">Type: {team.type_of_sales_team?.name || "N/A"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-bold text-center mb-4">
                        Assign Cylinders to {selectedTeam.name}
                    </h2>
                    <div>
                        {store.map((gas) => (
                            <div key={gas.id} className="mb-4 bg-white p-3 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-blue-600">{gas.name}</h3>
                                {gas.cylinders.map((cylinder) => (
                                    <div key={cylinder.id} className="mt-3">
                                        <h4 className="text-base font-semibold">
                                            Cylinder Weight: {cylinder.weight.weight}kg
                                        </h4>
                                        {cylinder.stores.length > 0 ? (
                                            <table className="mt-2 w-full border text-sm">
                                                <thead>
                                                    <tr className="bg-gray-200 text-left">
                                                        {/* <th className="border px-2 py-1">Store ID</th> */}
                                                        <th className="border px-2 py-1">Filled</th>
                                                        <th className="border px-2 py-1">Empties</th>
                                                        <th className="border px-2 py-1">Spoiled</th>
                                                        <th className="border px-2 py-1">Total</th>
                                                        <th className="border px-2 py-1">Assign</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cylinder.stores.map((storeItem) => (
                                                        <tr key={storeItem.id}>
                                                            {/* <td className="border px-2 py-1">{storeItem.id}</td> */}
                                                            <td className="border px-2 py-1 text-center">{storeItem.filled}</td>
                                                            <td className="border px-2 py-1 text-center">{storeItem.empties}</td>
                                                            <td className="border px-2 py-1 text-center">{storeItem.spoiled}</td>
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
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-gray-600 mt-2">No stores available for this cylinder.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                            onClick={handleAssign}
                        >
                            Assign Cylinders
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssigningProducts;
