// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchSalesTeam, selectAllSalesTeam } from '../features/salesTeam/salesTeamSlice';
import { fetchStore, selectAllStore } from '../features/store/storeSlice';
import axios from 'axios';
import getApiUrl from '../getApiUrl';
import Cookies from "cookies-js";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


const CollectCylinders = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allSalesTeam = useAppSelector(selectAllSalesTeam);
    const store = useAppSelector(selectAllStore);

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [assignedCylinders, setAssignedCylinders] = useState([]);
    const [showStacked, setShowStacked] = useState<boolean>(false);

    const apiUrl = getApiUrl()


    useEffect(() => {
        dispatch(fetchSalesTeam());
        dispatch(fetchStore());
    }, [dispatch]);


    useEffect(() => {
        if (selectedTeam) {
            axios
                .get(`${apiUrl}/the-assigned-cylinders/`, {
                    headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
                    params: { sales_team: selectedTeam.id },
                })
                .then((response) => setAssignedCylinders(response.data))
                .catch((error) => console.error("Error fetching assigned cylinders:", error));
        }
    }, [selectedTeam]);


    const handleReturnCylinders = () => {
        const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }));

        axios
            .post(`${apiUrl}/return-assigned-cylinders/`, payload, {
                headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
            })
            .then((response) => {
                console.log(response.data.message);
                setAssignedCylinders([]); // Clear table after return
                alert("Cylinders returned successfully!");
            })
            .catch((error) => console.error("Error returning cylinders:", error));
    };

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    const handleShowStacked = () => {
        setShowStacked(!showStacked);
    }

    // const handleHideStacked = () => {
    //     setShowStacked(false);
    // }


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
                        Collect Cylinders from {selectedTeam.name}
                    </h2>

                    {/* Responsive Table */}
                    <div className="w-full">
                        <table className="table-auto w-full text-xs md:text-sm border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-2 py-1">Gas Type</th>
                                    <th className="border px-2 py-1">Weight (kg)</th>
                                    <th className="border px-2 py-1">Assigned</th>
                                    <th className="border px-2 py-1">Filled</th>
                                    <th className="border px-2 py-1">Empties</th>
                                    <th className="border px-2 py-1">Spoiled</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedCylinders.map((cylinder) => (
                                    <tr key={cylinder.id} className="text-center">
                                        <td className="border px-2 py-1">{cylinder.gas_type}</td>
                                        <td className="border px-2 py-1">{cylinder.weight}</td>
                                        <td className="border px-2 py-1">{cylinder.assigned_quantity}</td>
                                        <td className="border px-2 py-1">{cylinder.filled}</td>
                                        <td className="border px-2 py-1">{cylinder.empties}</td>
                                        <td className="border px-2 py-1">{cylinder.spoiled}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className=' flex justify-center'>
                        <button className='bg-blue-400 mt-3 flex items-center text-white px-2 rounded-md ' onClick={handleShowStacked}>
                            Details
                            {showStacked ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </button>
                    </div>


                    {showStacked && (
                        <div className="block md:hidden mt-6">
                            {assignedCylinders.map((cylinder) => (
                                <div
                                    key={cylinder.id}
                                    className="bg-white border border-gray-300 rounded-lg shadow-md p-3 mb-4"
                                >
                                    <p className="text-sm">
                                        <span className="font-bold">Gas Type:</span> {cylinder.gas_type}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Weight:</span> {cylinder.weight} kg
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Assigned:</span> {cylinder.assigned_quantity}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Filled:</span> {cylinder.filled}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Empties:</span> {cylinder.empties}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}


                    <div className="mt-6 text-center flex space-x-2">
                        <button
                            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
                            onClick={handleReturnCylinders}
                        >
                            Return all Cylinders
                        </button>
                        <button
                            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
                            onClick={handleReturnCylinders}
                        >
                            Return empty Cylinders
                        </button>
                    </div>
                </div>
            )}
        </div>

    )
}

export default CollectCylinders