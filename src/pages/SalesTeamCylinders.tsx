// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    addSpoiledCylinder,
    fetchAssignedProducts,
    selectAllAssignedProducts,
    updateSpoiledCylinder,
} from "../features/product/assignedProductsSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import FormattedAmount from "../components/FormattedAmount";
import { fetchMyProfile, selectMyProfile } from "../features/employees/myProfileSlice";
import defaultProfile from "../components/media/default.png"
import { fetchOtherProducts, selectAllOtherProducts } from "../features/store/otherProductsSlice";

const SalesTeamCylinders = () => {
    const dispatch = useAppDispatch();
    const assigned_cylinders = useAppSelector(selectAllAssignedProducts);
    const myProfile = useAppSelector(selectMyProfile);
    const other_products = useAppSelector(selectAllOtherProducts);


    const [viewMode, setViewMode] = useState({});
    const [spoiledInput, setSpoiledInput] = useState({});
    const [updateSpoiledInput, setUpdateSpoiledInput] = useState({});

    useEffect(() => {
        dispatch(fetchAssignedProducts());
        dispatch(fetchMyProfile());
        dispatch(fetchOtherProducts());
    }, [dispatch]);


    // Extract Sales Team Name
    const salesTeamName =
        assigned_cylinders.length > 0 ? assigned_cylinders[0].sales_team?.name : "Sales Team";

    const togglePriceView = (id) => {
        setViewMode((prev) => ({
            ...prev,
            [id]: prev[id] === "retail" ? "wholesale" : "retail",
        }));
    };

    const handleSpoiledInputChange = (id, value) => {
        setSpoiledInput((prev) => ({ ...prev, [id]: Number(value) }));
    };

    const handleUpdateOfSpoiledInputChange = (id, value) => {
        setUpdateSpoiledInput((prev) => ({ ...prev, [id]: Number(value) }));
    };

    const handleSpoiledSubmit = (id) => {
        const spoiledQty = spoiledInput[id];
        if (!spoiledQty || spoiledQty < 0) {
            alert("Please enter a valid spoiled quantity.");
            return;
        }

        // Dispatch addSpoiledCylinder action
        dispatch(addSpoiledCylinder({ id, spoiled: spoiledQty }))
            .unwrap()
            .then(() => {
                alert("Spoiled cylinders updated successfully!");
                dispatch(fetchAssignedProducts()); // Refresh the assigned products after update
                setSpoiledInput((prev) => ({ ...prev, [id]: "" })); // Reset input
            })
            .catch((error) => {
                console.error("Failed to update spoiled cylinders:", error);
                alert("Failed to update spoiled cylinders.");
            });
    };
    const handleUpdateSpoiledSubmit = (id) => {
        const spoiledQty = updateSpoiledInput[id];
        if (!spoiledQty || spoiledQty < 0) {
            alert("Please enter a valid spoiled quantity.");
            return;
        }

        // Dispatch addSpoiledCylinder action
        dispatch(updateSpoiledCylinder({ id, spoiled: spoiledQty }))
            .unwrap()
            .then(() => {
                alert("Spoiled cylinders updated successfully!");
                dispatch(fetchAssignedProducts()); // Refresh the assigned products after update
                setSpoiledInput((prev) => ({ ...prev, [id]: "" })); // Reset input
            })
            .catch((error) => {
                console.error("Failed to update spoiled cylinders:", error);
                alert("Failed to update spoiled cylinders.");
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
                <div>
                    <h1 className="text-3xl font-bold">{salesTeamName}</h1>
                    <p className="mt-1 text-sm">Make sales the easy way.</p>
                </div>
                <Link to="/myprofile" className="flex items-center space-y-2 flex-col">
                    <img
                        src={myProfile.profile_image || defaultProfile}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <span className="text-white text-sm">{myProfile.first_name} {myProfile.last_name}</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assigned_cylinders.map((cylinder) => (
                    <div
                        key={cylinder.id}
                        className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                    >
                        {/* Cylinder Info */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-blue-700">
                                {cylinder.gas_type} {cylinder.weight}kg
                            </h3>
                            <button
                                onClick={() => togglePriceView(cylinder.id)}
                                className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
                            >
                                {viewMode[cylinder.id] === "retail"
                                    ? "Show Wholesale"
                                    : "Show Retail"}
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">
                            Assigned: {cylinder.assigned_quantity}
                        </p>
                        <p className="text-gray-600">Filled: {cylinder.filled}</p>
                        <p className="text-gray-600">Empties: {cylinder.empties}</p>
                        <p className="text-gray-600">Spoiled: {cylinder.spoiled}</p>

                        {/* Pricing */}
                        <div className="mt-4">
                            {viewMode[cylinder.id] === "retail" ? (
                                <div>
                                    <h4 className="text-lg font-bold text-green-600">Retail Prices</h4>
                                    <p>Min Selling: <FormattedAmount amount={cylinder.min_retail_selling_price} /></p>
                                    <p>Standard Selling: <FormattedAmount amount={cylinder.retail_selling_price} /></p>
                                    <p>Max Selling: <FormattedAmount amount={cylinder.max_retail_selling_price} /></p>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-lg font-bold text-blue-600">Wholesale Prices</h4>
                                    <p>Min Selling: <FormattedAmount amount={cylinder.min_wholesale_selling_price} /></p>
                                    <p>Standard Selling: <FormattedAmount amount={cylinder.wholesale_selling_price} /></p>
                                    <p>Max Selling: <FormattedAmount amount={cylinder.max_wholesale_selling_price} /></p>
                                </div>
                            )}
                        </div>

                        {/* Spoiled Input */}
                        <div className="mt-4 flex "></div>
                        <div className="">
                            <label
                                htmlFor={`spoiled-${cylinder.id}`}
                                className="block text-gray-700 font-medium"
                            >
                                Add Spoiled Cylinders:
                            </label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="number"
                                    max={cylinder.filled}
                                    min={0}
                                    id={`spoiled-${cylinder.id}`}
                                    value={spoiledInput[cylinder.id] || ""}
                                    onChange={(e) =>
                                        handleSpoiledInputChange(cylinder.id, e.target.value)
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-1 w-24"
                                    placeholder="Qty"
                                />
                                <button
                                    onClick={() => handleSpoiledSubmit(cylinder.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        {/* <div className="mt-4">
                            <label
                                htmlFor={`spoiled-${cylinder.id}`}
                                className="block text-gray-700 font-medium"
                            >
                                Update Spoiled Cylinders:
                            </label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="number"
                                    // max={cylinder.filled}
                                    min={0}
                                    id={`spoiled-${cylinder.id}`}
                                    value={updateSpoiledInput[cylinder.id] || ""}
                                    onChange={(e) =>
                                        handleUpdateOfSpoiledInputChange(cylinder.id, e.target.value)
                                    }
                                    className="border border-gray-300 rounded-md px-3 py-1 w-24"
                                    placeholder="Qty"
                                />
                                <button
                                    onClick={() => handleUpdateSpoiledSubmit(cylinder.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    update
                                </button>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
                <Link className="hover:underline" to="/sales">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default SalesTeamCylinders;
