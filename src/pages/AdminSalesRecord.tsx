// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FormattedAmount from '../components/FormattedAmount'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyProfile, selectMyProfile } from '../features/employees/myProfileSlice';
import { fetchSalesTeamData, selectAllSalesTeamData } from '../features/salesTeam/salesTeamDataSlice';
import defaultProfile from "../components/media/default.png"
import { fetchAdminSalesTeamData, selectAllAdminSalesTeamData, toggleVerification } from '../features/salesTeam/adminSalesTeamDataSlice';

const AdminSalesRecord = () => {
    const dispatch = useAppDispatch();
    const myProfile = useAppSelector(selectMyProfile);
    const allSalesData = useAppSelector(selectAllAdminSalesTeamData);

    const [filteredSales, setFilteredSales] = useState([]);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Default to today's date
    });
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Default to today's date
    });

    useEffect(() => {
        dispatch(fetchAdminSalesTeamData());
    }, [dispatch]);
    console.log('data sales ', allSalesData)


    useEffect(() => {
        // Filter sales data by date range
        const filtered = allSalesData.filter((sale) => {
            const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
            return saleDate >= startDate && saleDate <= endDate;
        });
        setFilteredSales(filtered);
    }, [allSalesData, startDate, endDate]);


    const handleToggleVerification = async (salesId) => {
        console.log("salesId:", salesId);
        try {
            await dispatch(toggleVerification(saleId)).unwrap();
            alert('and this is called')
        } catch (error) {
            alert("error!", error)
        }
    }

    

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
                <div>
                    <p className="mt-1 text-xl">Track your team's sales performance.</p>
                </div>

            </div>

            {/* Filter Section */}
            <div className="bg-white shadow-md p-4 flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                    <label htmlFor="start-date" className="text-gray-700 font-medium">
                        Start Date:
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="end-date" className="text-gray-700 font-medium">
                        End Date:
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            {/* Sales Data */}
            <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSales && filteredSales.length > 0 ? (
                    filteredSales.map((sale, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                        >
                            {/* Salesperson */}
                            <h3 className="text-lg font-semibold text-blue-600">
                                Salesperson: {sale?.sales_person.first_name} {sale?.sales_person.last_name}
                            </h3>

                            {/* Customer */}
                            <p className="mt-2 text-gray-700">
                                <strong>Customer:</strong> {sale.customer?.name} ({sale.customer?.sales})
                            </p>
                            <p className="mt-2 text-gray-700">
                                <strong>Customer Location:</strong> {sale.customer?.location?.name}
                            </p>

                            {/* Product */}
                            <p className="mt-2 text-gray-700">
                                <strong>Product:</strong>{' '}
                                {sale.product?.cylinder
                                    ? `${sale.product?.gas_type} ${sale.product?.weight}kg - Qty: ${sale.quantity}`
                                    : 'N/A'}
                            </p>

                            {/* Sale Type */}
                            <p className="mt-2 text-gray-700">
                                <strong>Type:</strong> {sale.sales_type} ({sale.sales_choice})
                            </p>

                            {/* Debt Info */}
                            {sale.debt_info ? (
                                <p className="mt-2 text-red-500">
                                    <strong>Debt:</strong> <FormattedAmount amount={sale?.debt_info?.debt_amount} /> (
                                    Repay by: {sale.debt_info.expected_date_to_repay})
                                </p>
                            ) : (
                                <p className="mt-2 text-green-600">
                                    <strong>No Debt</strong>
                                </p>
                            )}

                            {/* Total Amount */}
                            <p className="mt-4 text-gray-900 font-bold">
                                Total Amount: <FormattedAmount amount={sale.total_amount} />
                            </p>
                            {sale?.admin_payment_verified ? <div>
                                <p className=' text-green-900 text-xl'>payment verified.</p>
                            </div>
                                :
                                <div>
                                    <p className=' text-red-900 text-xl'>payment not verified.</p>
                                </div>}
                            <button
                                onClick={() => handleToggleVerification(sale.id)}
                                className={`px-4 py-2 rounded ${sale.admin_payment_verified ? "bg-red-500" : "bg-green-500"
                                    } text-white`}
                            >
                                {sale.admin_payment_verified ? "Unverify" : "Verify"}
                            </button>

                            {/* Timestamp */}
                            <p className="mt-2 text-sm text-gray-500">
                                Sold on: {new Date(sale.timestamp).toLocaleDateString()}
                            </p>

                            {/* verified */}


                            {/* Payment Verified: {sale?.admin_payment_verified} */}

                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">
                        No sales data available for the selected dates.
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
                <Link className="hover:underline" to="/sales">
                    Home
                </Link>
            </div>
        </div>
    )
}

export default AdminSalesRecord