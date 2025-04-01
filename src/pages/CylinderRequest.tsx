// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchSalesTeam, selectAllSalesTeam } from '../features/salesTeam/salesTeamSlice';
import { fetchStore, selectAllStore } from '../features/store/storeSlice';
import getApiUrl from '../getApiUrl';
import Cookies from "cookies-js";
import axios from 'axios';
import { addRequest, approveRequest, clearRequested, fetchRequests, selectAllRequests } from '../features/RequestCylinders/requestedSlice';

const CylinderRequest = () => {
    const apiUrl = getApiUrl();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allSalesTeam = useAppSelector(selectAllSalesTeam);
    const allRequests = useAppSelector(selectAllRequests);
    const store = useAppSelector(selectAllStore);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [assignedCylinders, setAssignedCylinders] = useState([]);
    const [requestData, setRequestData] = useState({});
    const [loadingRequest, setLoadingRequest] = useState({});
    const salesTeamId = selectedTeam?.id;

    console.log('requests ', allRequests)
    console.log('cylinders ', assignedCylinders)

    useEffect((salesTeamId) => {
        dispatch(fetchSalesTeam());
        dispatch(fetchStore());

    }, [dispatch, salesTeamId]);

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

    useEffect(() => {
        if (salesTeamId) {
            dispatch(fetchRequests({ salesTeamId }));
        }
    }, [dispatch, salesTeamId]);

    const handleRequestChange = (cylinderId, field, value) => {
        setRequestData((prev) => ({
            ...prev,
            [cylinderId]: {
                ...prev[cylinderId],
                [field]: parseInt(value, 10) || 0,
            },
        }));
    };

    const handleSubmitRequest = async (cylinderId) => {
        const requestDetails = requestData[cylinderId];

        if (!requestDetails || requestDetails.request_quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        setLoadingRequest((prev) => ({ ...prev, [cylinderId]: true }));

        const payload = {
            sales_team_id: selectedTeam.id,
            cylinder_id: cylinderId,
            quantity: requestDetails.request_quantity,
        };

        try {
            await dispatch(addRequest({
                employee: Cookies.get("employeeId"), // assuming this is stored in cookies
                sales_team_id: selectedTeam.id,
                assigned_cylinder_id: cylinderId,
                quantity: requestDetails.request_quantity
            }));
            console.log("Request sent:", payload);
        } catch (error) {
            console.log("Error:", error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setLoadingRequest((prev) => ({ ...prev, [cylinderId]: false }));
        }
    };

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    const getRequestForCylinder = (cylinderId) => {
        return allRequests.find(request => request.cylinder === cylinderId);
    };


    const handleDeleteRequest = async (cylinderId) => {
        await dispatch(clearRequested({cylinderId}))
    }



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
                        Request Cylinders from {selectedTeam.name}
                    </h2>

                    {assignedCylinders.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                            {assignedCylinders.map((cylinder) => (
                                <div key={cylinder.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                    <h3 className="text-lg font-bold text-blue-600 mb-2">{cylinder.gas_type}</h3>
                                    <p className="text-sm text-gray-700">Weight: {cylinder.weight} kg</p>
                                    <p className="text-sm text-gray-700">Filled: {cylinder.filled}</p>
                                    <p className="text-sm text-gray-700">Empties: {cylinder.empties}</p>
                                    {(() => {
                                        const requestData = getRequestForCylinder(cylinder.id);
                                        return requestData ? (
                                            <div className=' flex space-x-4'>
                                                <p>Requested: <span className="font-bold text-red-600">{requestData.quantity}</span></p>
                                                <button onClick={() => handleDeleteRequest(cylinder.id)} className='rounded-md px-1 bg-red-600 text-white'>delete</button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No requests</p>
                                        );
                                    })()}
                                    <form>
                                        <label className="block text-sm font-semibold mt-2">Enter Quantity</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={cylinder.filled}
                                            className="w-full p-1 border rounded-md"
                                            placeholder="Quantity"
                                            value={requestData[cylinder.id]?.request_quantity || ""}
                                            onChange={(e) => handleRequestChange(cylinder.id, "request_quantity", e.target.value)}
                                        />

                                        <button
                                            onClick={() => handleSubmitRequest(cylinder.id)}
                                            className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${loadingRequest[cylinder.id] ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                            disabled={loadingRequest[cylinder.id]}
                                        >
                                            {loadingRequest[cylinder.id] ? "Processing..." : "Request"}
                                        </button>
                                    </form>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-4 text-gray-600">No data available for assigned cylinders.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CylinderRequest;
