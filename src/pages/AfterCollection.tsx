// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchAssignedCylinders, getAssignsError, getAssignsStatus, selectAllAssigns } from '../features/assigns/assignsSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCollectedCylinders, selectAllCollections } from '../features/collections/collectionsSlice';
import getApiUrl from '../getApiUrl';
import axios from 'axios';
import Cookies from "cookies-js"

const AfterCollection = () => {
    const [printComplete, setPrintComplete] = useState(false);
    const salesTeamId = useParams();
    const dispatch = useAppDispatch();
    const cylinders = useAppSelector(selectAllCollections);
    const cylinderError = useAppSelector(getAssignsError);
    const cylinderStatus = useAppSelector(getAssignsStatus);
    const { state } = useLocation(); // Get the state object passed via navigate
    const salesTeamName = state?.salesTeamName;

    console.log('cyd ', cylinders)
    useEffect(() => {
        // Fetch all assigned cylinders (optionally filter by sales team)
        dispatch(fetchCollectedCylinders(salesTeamId?.id));
    }, [dispatch]);

    const apiUrl = getApiUrl();

    const navigate = useNavigate();

    // const handlePrint = () => {

    //     if (window.AndroidBridge && window.AndroidBridge.printText) {
    //         const currentDate = new Date().toLocaleDateString();

    //         let printContent = '\n\n'; // Whitespace at the top
    //         printContent += `Empty & Spoiled Returns only:   ${salesTeamName}\n`;
    //         printContent += `Date: ${currentDate}\n`;
    //         printContent += '********************************\n';

    //         // Section for Empty Cylinders
    //         printContent += '\nEmpty Cylinders\n';
    //         printContent += '--------------------------------\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n';
    //         printContent += '--------------------------------\n';
    //         cylinders.filter(cylinder => cylinder.empties > 0).forEach(cylinder => {
    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties.toString().padStart(10)}\n`;
    //         });

    //         // Section for Filled Cylinders
    //         printContent += '\n--------------------------------\n';
    //         printContent += '\nFilled Cylinders\n';
    //         printContent += '--------------------------------\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n';
    //         printContent += '--------------------------------\n';
    //         cylinders.filter(cylinder => cylinder.filled > 0).forEach(cylinder => {
    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled.toString().padStart(10)}\n`;
    //         });

    //         // Section for Spoiled Cylinders
    //         printContent += '\n--------------------------------\n';
    //         printContent += '\nSpoiled Cylinders\n';
    //         printContent += '--------------------------------\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n';
    //         printContent += '--------------------------------\n';
    //         cylinders.filter(cylinder => cylinder.spoiled > 0).forEach(cylinder => {
    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.spoiled.toString().padStart(10)}\n`;
    //         });

    //         // Section for lost empties Cylinders
    //         printContent += '\n--------------------------------\n';
    //         printContent += '\nLost Spoiled Cylinders\n';
    //         printContent += '--------------------------------\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n';
    //         printContent += '--------------------------------\n';
    //         cylinders.filter(cylinder => cylinder.empties_lost > 0).forEach(cylinder => {
    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties_lost.toString().padStart(10)}\n`;
    //         });

    //         // Section for lost empties Cylinders
    //         printContent += '\n--------------------------------\n';
    //         printContent += '\nLost Filled Cylinders\n';
    //         printContent += '--------------------------------\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n';
    //         printContent += '--------------------------------\n';
    //         cylinders.filter(cylinder => cylinder.filled_lost > 0).forEach(cylinder => {
    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled_lost.toString().padStart(10)}\n`;
    //         });

    //         // Section for less pay Cylinders
    //         printContent += '\n--------------------------------\n';
    //         printContent += '\nLess Pay Cylinders\n';
    //         printContent += '--------------------------------\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n';
    //         printContent += '--------------------------------\n';
    //         cylinders.filter(cylinder => cylinder.less_pay > 0).forEach(cylinder => {
    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.less_pay.toString().padStart(10)}\n`;
    //         });

    //         // Footer information
    //         printContent += '\n--------------------------------\n';
    //         printContent += '\n\nGoods Collected by: \n';
    //         printContent += '_________________________\n';
    //         printContent += 'Signature: \n';
    //         printContent += '_________________________\n';
    //         printContent += '\n\nGoods dispatched by: \n';
    //         printContent += '_________________________\n';
    //         printContent += 'Signature: \n';
    //         printContent += '_________________________\n';
    //         printContent += '\n\n\n\n\n'; // Whitespace at the bottom

    //         // Call the native print method
    //         window.AndroidBridge.printText(printContent);

    //         if (!printComplete) {
    //             axios.post(`${apiUrl}/mark-print-return-complete/`,
    //                 { sales_team_id: salesTeamId?.id },
    //                 { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
    //             ).then(() => setPrintComplete(true))
    //                 .catch(err => console.error("Error marking print complete:", err));
    //         } else {
    //             alert("Print already completed. No need to reprint.");
    //         }

    //     } else {
    //         alert("AndroidBridge is not available");
    //     }


    // };

    const handlePrint = () => {
        if (window.AndroidBridge && window.AndroidBridge.printText) {
            const currentDate = new Date().toLocaleDateString();
            let printContent = '\n\n'; // Whitespace at the top
            printContent += `Empty & Spoiled Returns only:   ${salesTeamName}\n`;
            printContent += `Date: ${currentDate}\n`;
            printContent += '********************************\n';
    
            // Empty Cylinders Section
            const emptyCylinders = cylinders.filter(cylinder => cylinder.empties > 0);
            if (emptyCylinders.length > 0) {
                printContent += '\nEmpty Cylinders\n';
                printContent += '--------------------------------\n';
                printContent += 'Cylinder   Weight(kg)    Qty\n';
                printContent += '--------------------------------\n';
                emptyCylinders.forEach(cylinder => {
                    printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties.toString().padStart(10)}\n`;
                });
            }
    
            // Filled Cylinders Section
            const filledCylinders = cylinders.filter(cylinder => cylinder.filled > 0);
            if (filledCylinders.length > 0) {
                printContent += '\n--------------------------------\n';
                printContent += '\nFilled Cylinders\n';
                printContent += '--------------------------------\n';
                printContent += 'Cylinder   Weight(kg)    Qty\n';
                printContent += '--------------------------------\n';
                filledCylinders.forEach(cylinder => {
                    printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled.toString().padStart(10)}\n`;
                });
            }
    
            // Spoiled Cylinders Section
            const spoiledCylinders = cylinders.filter(cylinder => cylinder.spoiled > 0);
            if (spoiledCylinders.length > 0) {
                printContent += '\n--------------------------------\n';
                printContent += '\nSpoiled Cylinders\n';
                printContent += '--------------------------------\n';
                printContent += 'Cylinder   Weight(kg)    Qty\n';
                printContent += '--------------------------------\n';
                spoiledCylinders.forEach(cylinder => {
                    printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.spoiled.toString().padStart(10)}\n`;
                });
            }
    
            // Lost Empties Cylinders Section
            const lostEmpties = cylinders.filter(cylinder => cylinder.empties_lost > 0);
            if (lostEmpties.length > 0) {
                printContent += '\n--------------------------------\n';
                printContent += '\nLost Spoiled Cylinders\n';
                printContent += '--------------------------------\n';
                printContent += 'Cylinder   Weight(kg)    Qty\n';
                printContent += '--------------------------------\n';
                lostEmpties.forEach(cylinder => {
                    printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties_lost.toString().padStart(10)}\n`;
                });
            }
    
            // Lost Filled Cylinders Section
            const lostFilled = cylinders.filter(cylinder => cylinder.filled_lost > 0);
            if (lostFilled.length > 0) {
                printContent += '\n--------------------------------\n';
                printContent += '\nLost Filled Cylinders\n';
                printContent += '--------------------------------\n';
                printContent += 'Cylinder   Weight(kg)    Qty\n';
                printContent += '--------------------------------\n';
                lostFilled.forEach(cylinder => {
                    printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled_lost.toString().padStart(10)}\n`;
                });
            }
    
            // Less Pay Cylinders Section
            const lessPay = cylinders.filter(cylinder => cylinder.less_pay > 0);
            if (lessPay.length > 0) {
                printContent += '\n--------------------------------\n';
                printContent += '\nLess Pay Cylinders\n';
                printContent += '--------------------------------\n';
                printContent += 'Cylinder   Weight(kg)    Qty\n';
                printContent += '--------------------------------\n';
                lessPay.forEach(cylinder => {
                    printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.less_pay.toString().padStart(10)}\n`;
                });
            }
    
            // Footer Information
            printContent += '\n--------------------------------\n';
            printContent += '\n\nGoods Collected by: \n';
            printContent += '_________________________\n';
            printContent += 'Signature: \n';
            printContent += '_________________________\n';
            printContent += '\n\nGoods dispatched by: \n';
            printContent += '_________________________\n';
            printContent += 'Signature: \n';
            printContent += '_________________________\n';
            printContent += '\n\n\n\n\n'; // Whitespace at the bottom
    
            // Call the native print method
            window.AndroidBridge.printText(printContent);
    
            if (!printComplete) {
                axios.post(`${apiUrl}/mark-print-return-complete/`,
                    { sales_team_id: salesTeamId?.id },
                    { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
                ).then(() => setPrintComplete(true))
                    .catch(err => console.error("Error marking print complete:", err));
            } else {
                alert("Print already completed. No need to reprint.");
            }
    
        } else {
            alert("AndroidBridge is not available");
        }
    };
    
    const handleGeneratePDF = () => {
        alert("Generate PDF functionality can be added here.");
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <h2 className='text-center font-bold text-green-950 underline'>Empty and Spoiled Cylinders Returns.</h2>
            <div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Empty Cylinders.</p>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Cylinder Name</th>
                            <th className="border px-4 py-2">Weight (kg)</th>
                            <th className="border px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.filter(cylinder => cylinder.empties > 0).map((cylinder) => (
                            <tr key={cylinder.id}>
                                <td className="border px-4 py-2">{cylinder.gas_type}</td>
                                <td className="border px-4 py-2">{cylinder.weight}</td>
                                <td className="border px-4 py-2">{cylinder.empties}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Filled Cylinders.</p>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Cylinder Name</th>
                            <th className="border px-4 py-2">Weight (kg)</th>
                            <th className="border px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.filter(cylinder => cylinder.filled > 0).map((cylinder) => (
                            <tr key={cylinder.id}>
                                <td className="border px-4 py-2">{cylinder.gas_type}</td>
                                <td className="border px-4 py-2">{cylinder.weight}</td>
                                <td className="border px-4 py-2">{cylinder.filled}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Spoiled Cylinders.</p>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Cylinder Name</th>
                            <th className="border px-4 py-2">Weight (kg)</th>
                            <th className="border px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.filter(cylinder => cylinder.spoiled > 0).map((cylinder) => (
                            <tr key={cylinder.id}>
                                <td className="border px-4 py-2">{cylinder.gas_type}</td>
                                <td className="border px-4 py-2">{cylinder.weight}</td>
                                <td className="border px-4 py-2">{cylinder.spoiled}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Lost Filled Cylinders.</p>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Cylinder Name</th>
                            <th className="border px-4 py-2">Weight (kg)</th>
                            <th className="border px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.filter(cylinder => cylinder.filled_lost > 0).map((cylinder) => (
                            <tr key={cylinder.id}>
                                <td className="border px-4 py-2">{cylinder.gas_type}</td>
                                <td className="border px-4 py-2">{cylinder.weight}</td>
                                <td className="border px-4 py-2">{cylinder.filled_lost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Lost Empty Cylinders.</p>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">Cylinder Name</th>
                            <th className="border px-4 py-2">Weight (kg)</th>
                            <th className="border px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cylinders.filter(cylinder => cylinder.empties_lost > 0).map((cylinder) => (
                            <tr key={cylinder.id}>
                                <td className="border px-4 py-2">{cylinder.gas_type}</td>
                                <td className="border px-4 py-2">{cylinder.weight}</td>
                                <td className="border px-4 py-2">{cylinder.empties_lost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-center gap-4">
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
                    onClick={handlePrint}
                >
                    Print
                </button>
            </div>
        </div>
    )
}

export default AfterCollection
