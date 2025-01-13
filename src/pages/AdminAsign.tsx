import React from 'react';
import { Link } from 'react-router-dom';

const AdminAssign = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        <p className="text-center mt-2">Manage Your Business and Records Efficiently</p>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admins/assign"
          className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-300 ease-in-out"
        >
          <h3 className="text-xl font-semibold">Assign Cylinders</h3>
          <p className="mt-2 text-sm">Distribute cylinders to sales teams.</p>
        </Link>

        <Link
          to="/admins/collect"
          className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-300 ease-in-out"
        >
          <h3 className="text-xl font-semibold">Collect Cylinders</h3>
          <p className="mt-2 text-sm">Collect the Cylinders effectively</p>
        </Link>
        <Link
          to="/admins/assign"
          className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-300 ease-in-out"
        >
          <h3 className="text-xl font-semibold">Assign Other Products</h3>
          <p className="mt-2 text-sm">Allocate Other Products.</p>
        </Link>

        <div className="bg-white hover:bg-green-50 border border-green-500 text-green-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold">Other Sold</h3>
          <p className="mt-2 text-sm">Track sales of other items</p>
        </div>

        <Link
          to="/admin/sales"
          className="bg-white hover:bg-green-50 border border-green-500 text-green-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-300 ease-in-out"
        >
          <h3 className="text-xl font-semibold">Sales Record</h3>
          <p className="mt-2 text-sm">Access detailed sales data</p>
        </Link>

        <div className="bg-white hover:bg-yellow-50 border border-yellow-500 text-yellow-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold">Customer</h3>
          <p className="mt-2 text-sm">Manage customer data efficiently</p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
        <Link to="/sales" className="hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AdminAssign;
