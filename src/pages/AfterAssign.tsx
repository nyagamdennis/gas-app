// @ts-nocheck
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAssignedCylinders, getAssignsError, getAssignsStatus, selectAllAssigns } from '../features/assigns/assignsSlice';

const AfterAssign = () => {
    const salesTeamId  = useParams();
    const dispatch = useAppDispatch();
    const cylinders = useAppSelector(selectAllAssigns);
    const cylinderError = useAppSelector(getAssignsError);
    const cylinderStatus = useAppSelector(getAssignsStatus);

    useEffect(() => {
        // Fetch all assigned cylinders (optionally filter by sales team)
        // dispatch(fetchAssignedCylinders(salesTeamId));
        dispatch(fetchAssignedCylinders(salesTeamId?.id));
    }, [dispatch]);

    // if (cylinderStatus === "loading") return <p>Loading...</p>;
    // if (cylinderStatus === "failed") return <p>Error</p>;


    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    const handleGeneratePDF = () => {
        alert("Generate PDF functionality can be added here.");
    };
    return (
       
        <div className="min-h-screen bg-white p-6">
            <div className="mb-4 text-center">
                {/* <h2 className="text-2xl font-bold">{salesTeamName}</h2> */}
                <p className="text-sm text-gray-600">Assigned Cylinders Report</p>
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
                    onClick={() => window.print()}
                >
                    Print
                </button>
                <button
                    className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600"
                    onClick={() => alert("PDF Generation not implemented yet")}
                >
                    Generate PDF
                </button>
            </div>
        </div>
        // <div className="min-h-screen bg-gray-100 p-4">
        //     <h2 className="text-xl font-bold text-center mb-4">Assigned Cylinders</h2>
        //     <table className="w-full border text-sm">
        //         <thead>
        //             <tr className="bg-gray-200 text-left">
        //                 <th className="border px-2 py-1">Sales Team</th>
        //                 <th className="border px-2 py-1">Store ID</th>
        //                 <th className="border px-2 py-1">Cylinder ID</th>
        //                 <th className="border px-2 py-1">Weight (kg)</th>
        //                 <th className="border px-2 py-1">Assigned</th>
        //             </tr>
        //         </thead>
        //         <tbody>

        //             <tr>
        //                 <td className="border px-2 py-1">Team Alpha</td>
        //                 <td className="border px-2 py-1 text-center">7</td>
        //                 <td className="border px-2 py-1 text-center">1</td>
        //                 <td className="border px-2 py-1 text-center">12</td>
        //                 <td className="border px-2 py-1 text-center">10</td>
        //             </tr>
        //         </tbody>
        //     </table>
        //     <div className="mt-6 flex justify-center space-x-4">
        //         <button
        //             className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
        //             onClick={handlePrint}
        //         >
        //             Print
        //         </button>
        //         <button
        //             className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
        //             onClick={handleGeneratePDF}
        //         >
        //             Generate PDF
        //         </button>
        //     </div>
        // </div>
    )
}

export default AfterAssign