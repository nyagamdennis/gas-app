// @ts-nocheck
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchAssignedCylinders, getAssignsError, getAssignsStatus, selectAllAssigns } from '../features/assigns/assignsSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCollectedCylinders, selectAllCollections } from '../features/collections/collectionsSlice';

const AfterCollection = () => {
    const salesTeamId = useParams();
    const dispatch = useAppDispatch();
    const cylinders = useAppSelector(selectAllCollections);
    const cylinderError = useAppSelector(getAssignsError);
    const cylinderStatus = useAppSelector(getAssignsStatus);
    const { state } = useLocation(); // Get the state object passed via navigate
    const salesTeamName = state?.salesTeamName;

    useEffect(() => {
        // Fetch all assigned cylinders (optionally filter by sales team)
        dispatch(fetchCollectedCylinders(salesTeamId?.id));
    }, [dispatch]);

    console.log('assigned ', cylinders);

    const navigate = useNavigate();

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
    //             if (cylinder.assigned_quantity > 0) {
    //                 printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`
    //                     .padStart(10)}${cylinder.assigned_quantity
    //                         .toString()
    //                         .padStart(10)}\n`;
    //             }
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
    //         alert("AndroidBridge is not available");
    //     }
    // };
    const handlePrint = () => {
        if (window.AndroidBridge && window.AndroidBridge.printText) {
            const currentDate = new Date().toLocaleDateString();

            let printContent = '\n\n'; // Whitespace at the top
            printContent += `Assigned Cylinders:   ${salesTeamName}\n`;
            printContent += `Date: ${currentDate}\n`;
            printContent += '********************************\n';

            // Section for Empty Cylinders
            printContent += '\nEmpty Cylinders\n';
            printContent += '--------------------------------\n';
            printContent += 'Cylinder   Weight(kg)    Qty\n';
            printContent += '--------------------------------\n';
            cylinders.filter(cylinder => cylinder.empties > 0).forEach(cylinder => {
                printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties.toString().padStart(10)}\n`;
            });

            // Section for Filled Cylinders
            printContent += '\nFilled Cylinders\n';
            printContent += '--------------------------------\n';
            printContent += 'Cylinder   Weight(kg)    Qty\n';
            printContent += '--------------------------------\n';
            cylinders.filter(cylinder => cylinder.filled > 0).forEach(cylinder => {
                printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.filled.toString().padStart(10)}\n`;
            });

            // Section for Spoiled Cylinders
            printContent += '\nSpoiled Cylinders\n';
            printContent += '--------------------------------\n';
            printContent += 'Cylinder   Weight(kg)    Qty\n';
            printContent += '--------------------------------\n';
            cylinders.filter(cylinder => cylinder.spoiled > 0).forEach(cylinder => {
                printContent += `${cylinder.gas_type.padEnd(10)}${`${cylinder.weight}kg`.padStart(10)}${cylinder.spoiled.toString().padStart(10)}\n`;
            });

            // Footer information
            printContent += '\n\nGoods received by: \n';
            printContent += '_________________________\n';
            printContent += 'Signature: \n';
            printContent += '_________________________\n';
            printContent += '\n\nGoods delivered by: \n';
            printContent += '_________________________\n';
            printContent += 'Signature: \n';
            printContent += '_________________________\n';
            printContent += '\n\n\n\n\n'; // Whitespace at the bottom

            // Call the native print method
            window.AndroidBridge.printText(printContent);
        } else {
            alert("AndroidBridge is not available");
        }
    };

    const handleGeneratePDF = () => {
        alert("Generate PDF functionality can be added here.");
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div>
                <div className="mb-4 text-center">
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
                <div className="mb-4 text-center">
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
                <div className="mb-4 text-center">
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
