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
    const [loadingReturnAll, setLoadingReturnAll] = useState(false);
    const [loadingReturnSome, setLoadingReturnSome] = useState(false);
    const [losses, setLosses] = useState({});
    const [loadingLosses, setLoadingLosses] = useState({});
    const apiUrl = getApiUrl();

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


    const handleLossChange = (cylinderId, field, value) => {
        setLosses((prev) => ({
            ...prev,
            [cylinderId]: {
                ...prev[cylinderId],
                [field]: parseInt(value, 10) || 0,
            },
        }));
    };

    const handleSubmitLosses = (cylinderId) => {
        const lossData = losses[cylinderId];
        if (!lossData) return;
        setLoadingLosses((prev) => ({ ...prev, [cylinderId]: true }));

        const payload = {
            sales_team_id: selectedTeam.id,
            losses: [{ cylinder_id: cylinderId, filled_lost: lossData.filled_lost, empties_lost: lossData.empties_lost }],
        };

        axios
            .post(`${apiUrl}/report-cylinder-losses/`, payload, {
                headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
            })
            .then((response) => {
                // Update frontend dynamically
                setAssignedCylinders((prev) =>
                    prev.map((cylinder) =>
                        cylinder.cylinder === cylinderId
                            ? { ...cylinder, filled_lost: lossData.filled_lost, empties_lost: lossData.empties_lost }
                            : cylinder
                    )
                );
                setLosses((prev) => ({ ...prev, [cylinderId]: { filled_lost: 0, empties_lost: 0 } }));
            })
            .catch((error) => console.error("Error reporting cylinder losses:", error))
            .finally(() => setLoadingLosses((prev) => ({ ...prev, [cylinderId]: false })));
    };


    const handleReturnCylinders = () => {
        setLoadingReturnSome(true);
        const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }));

        axios
            .post(`${apiUrl}/return-assigned-cylinders/`, payload, {
                headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
            })
            .then(() => navigate(`/admins/printcollect/${selectedTeam?.id}`, { state: { salesTeamName: selectedTeam?.name } }))
            .catch((error) => console.error("Error in cylinder Collection.", error))
            .finally(() => setLoadingReturnSome(false));
    };

    const handleReturnAllCylinders = () => {
        setLoadingReturnAll(true);
        const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }));

        axios
            .post(`${apiUrl}/return-all-assigned-cylinders/`, payload, {
                headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
            })
            .then(() => navigate(`/admins/printallcollect/${selectedTeam?.id}`, { state: { salesTeamName: selectedTeam?.name } }))
            .catch((error) => console.error("Error in cylinder Collection.", error))
            .finally(() => setLoadingReturnAll(false));
    };

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    const handleShowStacked = () => {
        setShowStacked(!showStacked);
    };

    const hasCylinders = assignedCylinders.length > 0;

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

                    {hasCylinders ? (
                        <>
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
                                                <td className="border px-2 py-1">
                                                    {cylinder.filled}
                                                    {cylinder.filled_lost > 0 && (
                                                        <span className="text-red-500 ml-2 font-bold">- {cylinder.filled_lost}</span>
                                                    )}
                                                </td>
                                                {/* <td className="border px-2 py-1">{cylinder.empties}</td> */}
                                                <td className="border px-2 py-1">
                                                    {cylinder.empties}
                                                    {cylinder.empties_lost > 0 && (
                                                        <span className="text-red-500 ml-2 font-bold">- {cylinder.empties_lost}</span>
                                                    )}
                                                </td>
                                                <td className="border px-2 py-1">{cylinder.spoiled}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex justify-center'>
                                <button className='bg-blue-400 mt-3 flex items-center text-white px-2 rounded-md ' onClick={handleShowStacked}>
                                    Details
                                    {showStacked ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                </button>
                            </div>

                            {showStacked && (
                                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                                    {assignedCylinders.map((cylinder) => (
                                        <div key={cylinder.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                            <h3 className="text-lg font-bold text-blue-600 mb-2">{cylinder.gas_type}</h3>
                                            <p className="text-sm text-gray-700">Weight: {cylinder.weight} kg</p>
                                            <p className="text-sm text-gray-700">Assigned: {cylinder.assigned_quantity}</p>
                                            <p className="text-sm text-gray-700">Filled: {cylinder.filled}</p>
                                            <p className="text-sm text-gray-700">Empties: {cylinder.empties}</p>
                                            <p className="text-sm text-gray-700">Filled lost: {cylinder.filled_lost}</p>
                                            <p className="text-sm text-gray-700">Empties lost: {cylinder.empties_lost}</p>
                                            <p className="text-sm text-gray-700">Spoiled: {cylinder.spoiled}</p>
                                            <div className="mt-4 grid grid-cols-2 gap-2">
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleSubmitLosses(cylinder.cylinder);
                                                    }}
                                                >
                                                    <label className="block text-sm font-semibold">Missing Empties</label>
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        max={cylinder.empties}
                                                        className="w-full p-1 border rounded-md"
                                                        placeholder="Enter amount"
                                                        value={losses[cylinder.cylinder]?.empties_lost || ""}
                                                        onChange={(e) => handleLossChange(cylinder.cylinder, "empties_lost", e.target.value)}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${loadingLosses[cylinder.cylinder] ? "opacity-50 cursor-not-allowed" : ""
                                                            }`}
                                                        disabled={loadingLosses[cylinder.cylinder]}
                                                    >
                                                        {loadingLosses[cylinder.cylinder] ? "Processing..." : "Add"}
                                                    </button>                                                </form>
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleSubmitLosses(cylinder.cylinder);
                                                    }}
                                                >
                                                    <label className="block text-sm font-semibold">Missing Filled</label>
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        max={cylinder.filled}
                                                        className="w-full p-1 border rounded-md"
                                                        placeholder="Enter amount"
                                                        value={losses[cylinder.cylinder]?.filled_lost || ""}
                                                        onChange={(e) => handleLossChange(cylinder.cylinder, "filled_lost", e.target.value)}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${loadingLosses[cylinder.cylinder] ? "opacity-50 cursor-not-allowed" : ""
                                                            }`}
                                                        disabled={loadingLosses[cylinder.cylinder]}
                                                    >
                                                        {loadingLosses[cylinder.cylinder] ? "Processing..." : "Add"}
                                                    </button>                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 text-center flex flex-col space-y-2">
                                <button
                                    className={`bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow ${loadingReturnAll ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'} transition`}
                                    onClick={handleReturnAllCylinders}
                                    disabled={loadingReturnAll}
                                >
                                    {loadingReturnAll ? 'Processing...' : 'Return all Cylinders'}
                                </button>
                                <button
                                    className={`bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow ${loadingReturnSome ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'} transition`}
                                    onClick={handleReturnCylinders}
                                    disabled={loadingReturnSome}
                                >
                                    {loadingReturnSome ? 'Processing...' : 'Return empty & spoiled Cylinders'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center mt-4 text-gray-600">No data available for assigned cylinders.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CollectCylinders
