// @ts-nocheck
import React, { useEffect, useState } from "react";
import LeftNav from "../components/ui/LeftNav";
import NavBar from "../components/ui/NavBar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    fetchEmployees,
    selectAllEmployees,
    transferEmployee,
    updateEmployeeStatus,
} from "../features/employees/employeesSlice";
import { ClipLoader } from "react-spinners";
import { fetchSalesTeam, selectAllSalesTeam } from "../features/salesTeam/salesTeamSlice";

const Employee = () => {
    const dispatch = useAppDispatch();
    const allEmployees = useAppSelector(selectAllEmployees);
    const all_salesTeam = useAppSelector(selectAllSalesTeam);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newSalesTeam, setNewSalesTeam] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchSalesTeam());
    }, [dispatch]);

    const toggleRow = (employeeId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [employeeId]: !prev[employeeId], // Toggle the expanded state
        }));
    };

    const handleStatusChange = async (employeeId, statusField) => {
        setLoading(true);
        try {
            await dispatch(
                updateEmployeeStatus({ employeeId, statusField })
            ).unwrap();
            alert(`Employee status updated: ${statusField}`);
        } catch (error) {
            alert("Failed to update employee status");
        }
        setLoading(false);
    };

    const handleSalesTeamChange = async (employeeId) => {
        if (!newSalesTeam) {
            alert("Please select a sales team.");
            return;
        }
        setLoading(true);
        try {
            await dispatch(transferEmployee({ employeeId, salesTeamId: newSalesTeam })).unwrap();
            alert("Employee transferred successfully");
        } catch (error) {
            alert("Failed to transfer employee");
        }
        setLoading(false);
    };


    const handleImageClick = (imageSrc) => {
        setModalImage(imageSrc); // Open the modal with the selected image
    };

    const closeModal = () => {
        setModalImage(null); // Close the modal
    };

    return (
        <div>
            <div className="flex gap-1 bg-slate-900 text-white h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                <div className="w-1/6">
                    <LeftNav />
                </div>
                <div className="w-full">
                    <NavBar />
                    <div className="m-4">
                        <h1 className="text-2xl font-bold mb-4">Manage Employees</h1>
                        {loading && (
                            <div className="flex justify-center my-4">
                                <ClipLoader size={25} color={"#ffffff"} />
                            </div>
                        )}
                        <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2">Phone</th>
                                    <th className="px-4 py-2">Sales Team</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                    <th className="px-4 py-2">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allEmployees.map((employee) => (
                                    <React.Fragment key={employee.id}>
                                        <tr className="border-b border-gray-600">
                                            <td className="px-4 py-2">
                                                {employee.first_name} {employee.last_name}
                                            </td>
                                            <td className="px-4 py-2">{employee.phone}</td>
                                            <td className="px-4 py-2">{employee.sales_team?.name || "None"}</td>
                                            <td className="px-4 py-2">
                                                {employee.verified ? "Verified" : "Not Verified"} |{" "}
                                                {employee.suspended ? "Suspended" : "Active"} |{" "}
                                                {employee.fired ? "Fired" : "Employed"} |{" "}
                                                {employee.defaulted ? "Defaulted" : "In Good Standing"}
                                            </td>
                                            <td className="px-4 py-2 space-x-1 flex">
                                                <button
                                                    onClick={() => handleStatusChange(employee.id, "verified")}
                                                    className={`px-2 py-1 rounded ${employee.verified ? "bg-green-500" : "bg-gray-500"
                                                        }`}
                                                >
                                                    {employee.verified ? "Unverify" : "Verify"}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(employee.id, "suspended")}
                                                    className={`px-2 py-1 rounded ${employee.suspended ? "bg-red-500" : "bg-yellow-500"
                                                        }`}
                                                >
                                                    {employee.suspended ? "Unsuspend" : "Suspend"}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(employee.id, "fired")}
                                                    className={`px-2 py-1 rounded ${employee.fired ? "bg-red-700" : "bg-blue-500"
                                                        }`}
                                                >
                                                    {employee.fired ? "Rehire" : "Fire"}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(employee.id, "defaulted")}
                                                    className={`px-2 py-1 rounded ${employee.defaulted ? "bg-orange-500" : "bg-green-500"
                                                        }`}
                                                >
                                                    {employee.defaulted ? "Clear Default" : "Default"}
                                                </button>
                                                <button
                                                    onClick={() => setSelectedEmployee(employee.id)}
                                                    className=" whitespace-nowrap px-2 py-1 bg-purple-500 rounded"
                                                >
                                                    Change Team
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => toggleRow(employee.id)}
                                                    className="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 transition whitespace-nowrap"
                                                >
                                                    {expandedRows[employee.id] ? "Hide" : "View"} Details
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRows[employee.id] && (
                                            <tr>
                                                <td colSpan="6" className="p-4 bg-gray-700">
                                                    <div className="flex space-x-6">
                                                        <img
                                                            src={employee.profile_image || "default_profile.jpg"}
                                                            alt="Profile"
                                                            onClick={() => handleImageClick(employee.profile_image)}
                                                            className="w-24 h-24 rounded-md border cursor-pointer hover:scale-110 transition"
                                                        />
                                                        <img
                                                            src={employee.front_id || "default_id.jpg"}
                                                            alt="Front ID"
                                                            onClick={() => handleImageClick(employee.front_id)}
                                                            className="w-24 h-24 rounded-md border cursor-pointer hover:scale-110 transition"
                                                        />
                                                        <img
                                                            src={employee.back_id || "default_id.jpg"}
                                                            alt="Back ID"
                                                            onClick={() => handleImageClick(employee.back_id)}
                                                            className="w-24 h-24 rounded-md border cursor-pointer hover:scale-110 transition"
                                                        />
                                                    </div>
                                                    <div className="mt-4">
                                                        <p>
                                                            <strong>ID Number:</strong> {employee.id_number}
                                                        </p>
                                                        <p>
                                                            <strong>Phone:</strong> {employee.phone}
                                                        </p>
                                                        <p>
                                                            <strong>Alt Phone:</strong> {employee.alternative_phone || "N/A"}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        {selectedEmployee && (
                            <div className="mt-4 p-4 bg-gray-700 text-white rounded-lg">
                                <h2 className="text-lg font-bold mb-2">Transfer Employee</h2>
                                <select
                                    value={newSalesTeam}
                                    onChange={(e) => setNewSalesTeam(e.target.value)}
                                    className="border border-gray-500 text-gray-500 rounded px-2 py-1"
                                >
                                    <option value="">Select Sales Team</option>
                                    {all_salesTeam.map((team) => (

                                        <>

                                            <option value={team.id}>{team.name}</option>

                                        </>
                                    ))}

                                </select>
                                <button
                                    onClick={() => handleSalesTeamChange(selectedEmployee)}
                                    className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Transfer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {modalImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="relative">
                        <img src={modalImage} alt="Full Screen" className="max-w-screen-lg max-h-screen-lg" />
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employee;
