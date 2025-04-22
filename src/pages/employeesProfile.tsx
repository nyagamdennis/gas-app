// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ClipLoader } from "react-spinners";
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice";
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice";
import defaultProfile from "../components/media/default.png";
import { useNavigate } from "react-router-dom";
import AdminsFooter from "../components/AdminsFooter";

const Employee = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const allEmployees = useAppSelector(selectAllEmployees);
  const allSalesTeams = useAppSelector(selectAllSalesTeam);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchSalesTeam());
  }, [dispatch]);

  const handleNavigate = (id) => {
    navigate(`/admins/employees/${id}`);
  };

  const filteredEmployees = allEmployees.filter((employee) =>
    `${employee.first_name} ${employee.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Manage Employees
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View, edit, and organize your workforce
        </p>
      </header>

      {/* Search */}
      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-6">
          <ClipLoader size={28} color={"#6366f1"} />
        </div>
      )}

      {/* Employee Cards */}
      <main className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => handleNavigate(employee.id)}
            className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition duration-200 hover:scale-[1.01] cursor-pointer p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              {/* Left */}
              <div>
                <h3 className="text-xl font-semibold">
                  {employee.first_name} {employee.last_name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Phone:{" "}
                  <span className="text-gray-700">
                    {employee.phone || "No phone"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Team:{" "}
                  <span className="text-gray-700">
                    {employee.sales_team?.name || "Not assigned"}
                  </span>
                </p>
              </div>

              {/* Right */}
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={employee.profile_image || defaultProfile}
                  alt={`${employee.first_name} ${employee.last_name}`}
                  className="w-16 h-16 object-cover rounded-full border border-gray-300"
                />
                <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-3 py-1 rounded transition">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}

        {!filteredEmployees.length && !loading && (
          <div className="col-span-full text-center text-gray-400 mt-6">
            No employees match your search.
          </div>
        )}
      </main>
      {/* Footer */}
      <AdminsFooter />
    </div>
  );
};

export default Employee;
