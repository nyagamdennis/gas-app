// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAssignedCylinders, getAssignsError, getAssignsStatus, selectAllAssigns } from '../features/assigns/assignsSlice';
import getApiUrl from '../getApiUrl';
import axios from 'axios';
import Cookies from "cookies-js"

const AfterAssign = () => {
    const salesTeamId = useParams();
    const dispatch = useAppDispatch();
    const cylinders = useAppSelector(selectAllAssigns);
    const cylinderError = useAppSelector(getAssignsError);
    const cylinderStatus = useAppSelector(getAssignsStatus);
    const { state } = useLocation(); // Get the state object passed via navigate
    const [printComplete, setPrintComplete] = useState(false);
    const salesTeamName = state?.salesTeamName;

    
    useEffect(() => {
        // Fetch all assigned cylinders (optionally filter by sales team)
        // dispatch(fetchAssignedCylinders(salesTeamId));
        dispatch(fetchAssignedCylinders(salesTeamId?.id));
    }, [dispatch]);

    // console.log('assigned ', cylinders)
    // if (cylinderStatus === "loading") return <p>Loading...</p>;
    // if (cylinderStatus === "failed") return <p>Error</p>;


    const navigate = useNavigate();



    const apiUrl = getApiUrl();
    // const handlePrint = () => {
    //     if (window.AndroidBridge && window.AndroidBridge.printText) {
    //         const currentDate = new Date().toLocaleDateString();

    //         let printContent = '\n\n'; // Whitespace at the top
    //         printContent += `Assigned Cylinders:   ${salesTeamName}\n`;
    //         printContent += `Date: ${currentDate}\n`;
    //         printContent += '********************************\n';
    //         printContent += 'Cylinder   Weight(kg)    Qty\n'; // Table header
    //         printContent += '--------------------------------\n';

    //         // Format table rows
    //         cylinders.forEach((cylinder) => {

    //             printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`
    //                 .padStart(10)}${cylinder.assigned_quantity
    //                     .toString()
    //                     .padStart(10)}\n`;
    //         });

    //         printContent += '\n\n\n';
    //         printContent += 'Goods received by: \n';
    //         printContent += '_________________________\n';
    //         printContent += 'Signature: \n';
    //         printContent += '_________________________\n';
    //         printContent += '\n\n\n';
    //         printContent += 'Goods delivered by: \n';
    //         printContent += '_________________________\n';
    //         printContent += 'Signature: \n';
    //         printContent += '_________________________\n';
    //         printContent += '\n\n\n\n\n'; // Whitespace at the bottom
    //         window.AndroidBridge.printText(printContent); // Call the native print method
    //     } else {
    //         alert("Printer is not available");
    //     }
    // };
    const handlePrint = () => {
        // if (!printComplete) {
            axios.post(`${apiUrl}/mark-print-complete/`,
                { sales_team_id: salesTeamId?.id },
                { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
            ).then(() => setPrintComplete(true))
                .catch(err => console.error("Error marking print complete:", err));
        // } else {
        //     alert("Print already completed. No need to reprint.");
        // }

        if (window.AndroidBridge && window.AndroidBridge.printText) {
            const currentDate = new Date().toLocaleDateString();

            let printContent = '\n\n'; // Whitespace at the top
            printContent += `Assigned Cylinders:   ${salesTeamName}\n`;
            printContent += `Date: ${currentDate}\n`;
            printContent += '********************************\n';
            printContent += 'Cylinder   Weight(kg)    Qty\n'; // Table header
            printContent += '--------------------------------\n';

            cylinders.forEach((cylinder) => {
                printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.assigned_quantity.toString().padStart(10)}\n`;
            });

            printContent += '\n\nGoods delivered by: \n_________________________\nSignature: \n_________________________\n\n\n';
            printContent += '\n\nGoods received by: \n_________________________\nSignature: \n_________________________\n';
            
            printContent += '\n\n';
            printContent += '\n\n';
            // printContent += '\n\n';


            window.AndroidBridge.printText(printContent);

            // Mark print as complete in the backend
            
        } else {
            alert("Printer is not available");
        }

    };

    const handleGeneratePDF = () => {
        alert("Generate PDF functionality can be added here.");
    };

    return (

        <div className="min-h-screen bg-white p-6">
            <div className="mb-4 text-center">
                {/* <h2 className="text-2xl font-bold">{salesTeamName}</h2> */}
                <p className="text-sm text-gray-600">Assigned Cylinders Report.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-4 py-2">Cylinder Name</th>
                        <th className="border px-4 py-2">Weight (kg)</th>
                        <th className="border px-4 py-2">Assigned Quantity</th>
                        <th className="border px-4 py-2">Date Assigned</th>
                    </tr>
                </thead>
                <tbody>
                    {cylinders.map((cylinder) => (
                        <tr key={cylinder.id}>
                            <td className="border px-4 py-2">{cylinder.gas_type}</td>
                            <td className="border px-4 py-2">{cylinder.weight}</td>
                            <td className="border px-4 py-2">{cylinder.assigned_quantity}</td>
                            <td className="border px-4 py-2">
                                {new Date(cylinder.date_assigned).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

export default AfterAssign