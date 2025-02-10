// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAssignedCylinders, getAssignsError, getAssignsStatus, selectAllAssigns } from '../features/assigns/assignsSlice';
import getApiUrl from '../getApiUrl';
import axios from 'axios';
import { fetchAssignedOthers, selectAllAssignsOthers } from '../features/assigns/assignsOthersSlice';

const AfterAssignOthers = () => {
    const salesTeamId = useParams();
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectAllAssignsOthers);
    const cylinderError = useAppSelector(getAssignsError);
    const cylinderStatus = useAppSelector(getAssignsStatus);
    const { state } = useLocation(); // Get the state object passed via navigate
    const [printComplete, setPrintComplete] = useState(false);
    const salesTeamName = state?.salesTeamName;

    console.log('team name ', salesTeamName)
    useEffect(() => {
        // Fetch all assigned cylinders (optionally filter by sales team)
        // dispatch(fetchAssignedCylinders(salesTeamId));
        dispatch(fetchAssignedOthers(salesTeamId?.id));
    }, [dispatch]);

    // console.log('assigned ', cylinders)
    // if (cylinderStatus === "loading") return <p>Loading...</p>;
    // if (cylinderStatus === "failed") return <p>Error</p>;


    const navigate = useNavigate();



    const apiUrl = getApiUrl();

    const handlePrint = () => {
        if (window.AndroidBridge && window.AndroidBridge.printText) {
            const currentDate = new Date().toLocaleDateString();

            let printContent = '\n\n'; // Whitespace at the top
            printContent += `Assigned products:   ${salesTeamName}\n`;
            printContent += `Date: ${currentDate}\n`;
            printContent += '********************************\n';
            printContent += 'product       Qty\n'; // Table header
            printContent += '--------------------------------\n';

            products.forEach((product) => {
                printContent += `${product.product.name.padEnd(10)}${product.assigned_quantity.toString().padStart(10)}\n`;
            });

            printContent += '\n\nGoods dispatched by: \n_________________________\nSignature: \n_________________________\n';
            printContent += '\n\nGoods delivered by: \n_________________________\nSignature: \n_________________________\n\n\n';
            printContent += '\n\nGoods received by: \n_________________________\nSignature: \n_________________________\n';


            window.AndroidBridge.printText(printContent);

            // Mark print as complete in the backend
            if (!printComplete) {
                axios.post(`${apiUrl}/mark-print-complete-others/`,
                    { sales_team_id: salesTeamId?.id },
                    { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
                ).then(() => setPrintComplete(true))
                    .catch(err => console.error("Error marking print complete:", err));
            } else {
                alert("Print already completed. No need to reprint.");
            }
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
                <p className="text-sm text-gray-600">Assigned Products Report.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-4 py-2">Product</th>
                        <th className="border px-4 py-2">Quantity</th>
                        <th className="border px-4 py-2">Date Assigned</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="border px-4 py-2">{product.product.name}</td>
                            <td className="border px-4 py-2">{product.assigned_quantity}</td>
                            <td className="border px-4 py-2">
                                {new Date(product.date_assigned).toLocaleDateString()}
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

export default AfterAssignOthers