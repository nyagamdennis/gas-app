// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Modal } from "@mui/material";
import defaultProfile from "../components/media/default.png"
import { fetchEmployees, selectAllEmployees } from "../features/employees/employeesSlice";
import { fetchSalesTeam, selectAllSalesTeam } from "../features/salesTeam/salesTeamSlice";
import { fetchDefaults } from "../features/defaults/defaultsSlice";
import { fetchLessPay } from "../features/defaults/lessPaySlice";


const EmployeesProfile = () => {
  const dispatch = useAppDispatch();
  const allEmployees = useAppSelector(selectAllEmployees);
  const allSalesTeams = useAppSelector(selectAllSalesTeam);

  const [modalEmployee, setModalEmployee] = useState(null);
  const [employeeDefaults, setEmployeeDefaults] = useState({});
  const [employeeLessPays, setEmployeeLessPays] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchSalesTeam());
  }, [dispatch]);

  const handleSelectEmployee = async (employee) => {
    setModalEmployee(employee);

    // Fetch defaults and less pay for the selected employee
    if (!employeeDefaults[employee.id]) {
      const defaultsResponse = await dispatch(fetchDefaults(employee.id)).unwrap();
      setEmployeeDefaults((prev) => ({ ...prev, [employee.id]: defaultsResponse }));
    }

    if (!employeeLessPays[employee.id]) {
      const lessPayResponse = await dispatch(fetchLessPay(employee.id)).unwrap();
      setEmployeeLessPays((prev) => ({ ...prev, [employee.id]: lessPayResponse }));
    }
  };

  const handleCloseModal = () => {
    setModalEmployee(null);
  };

  const handleClearDefaults = async (employeeId) => {
    setLoading(true);
    try {
      await dispatch(clearDefault(employeeId)).unwrap();
      alert("Defaults cleared successfully.");
      setEmployeeDefaults((prev) => ({ ...prev, [employeeId]: [] }));
    } catch (error) {
      alert("Failed to clear defaults.");
    }
    setLoading(false);
  };

  const handleClearLessPay = async (employeeId) => {
    setLoading(true);
    try {
      await dispatch(clearLessPay(employeeId)).unwrap();
      alert("Less Pay data cleared successfully.");
      setEmployeeLessPays((prev) => ({ ...prev, [employeeId]: [] }));
    } catch (error) {
      alert("Failed to clear less pay data.");
    }
    setLoading(false);
  };


  const handleTransfer = async (employeeId) => {
    if (!newSalesTeam) {
      alert("Please select a sales team.");
      return;
    }
    setLoading(true);
    try {
      await dispatch(transferEmployee({ employeeId, salesTeamId: newSalesTeam })).unwrap();
      alert("Employee transferred successfully.");
      setModalEmployee(null);
    } catch (error) {
      alert("Failed to transfer employee.");
    }
    setLoading(false);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Employees List</h1>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white p-4 shadow rounded-lg cursor-pointer"
            onClick={() => handleSelectEmployee(employee)}
          >
            <img
              src={employee.profile_image || defaultProfile}
              alt={`${employee.first_name} ${employee.last_name}`}
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="text-center mt-2 font-semibold">
              {employee.first_name} {employee.last_name}
            </h2>
            <p className="text-center text-gray-600">{employee.phone || "No Phone"}</p>
            <p className="text-center text-gray-500">
              Current Sales Team:{" "}
              {allSalesTeams.find((team) => team.id === employee.sales_team)?.name || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Employee Details */}
      {modalEmployee && (
        <Modal open={Boolean(modalEmployee)} onClose={handleCloseModal}>
          <div className="bg-white p-6 rounded-lg shadow-md mx-4 mt-20 max-w-md m-auto">
            <h2 className="text-xl font-bold mb-4">
              {modalEmployee.first_name} {modalEmployee.last_name}
            </h2>
            <img
              src={modalEmployee.profile_image || defaultProfile}
              alt={`${modalEmployee.first_name} ${modalEmployee.last_name}`}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p><strong>ID Number:</strong> {modalEmployee.id_number || "N/A"}</p>
            <p><strong>Phone:</strong> {modalEmployee.phone || "N/A"}</p>
            <p><strong>Current Sales Team:</strong> {allSalesTeams.find(team => team.id === modalEmployee.sales_team)?.name || "N/A"}</p>

            {/* Defaults Table */}
            <h3 className="font-semibold mt-4">Defaults</h3>
            {employeeDefaults[modalEmployee.id]?.length > 0 ? (
              <>
                <table className="w-full border-collapse border border-gray-300 text-sm mt-2">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-4 py-2">Cylinder Name</th>
                      <th className="border px-4 py-2">Amount</th>
                      <th className="border px-4 py-2">Cleared</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeDefaults[modalEmployee.id].map((item) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">
                          {item.cylinder?.gas_type || "N/A"}
                        </td>
                        <td className="border px-4 py-2">{item.amount}</td>
                        <td className="border px-4 py-2">
                          {item.cleared ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => handleClearDefaults(modalEmployee.id)}
                  className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  Clear Defaults
                </button>
              </>
            ) : (
              <p>No default records found.</p>
            )}

            {/* Less Pays Table */}
            <h3 className="font-semibold mt-4">Less Pays</h3>
            {employeeLessPays[modalEmployee.id]?.length > 0 ? (
              <>
                <table className="w-full border-collapse border border-gray-300 text-sm mt-2">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-4 py-2">Cylinder Name</th>
                      <th className="border px-4 py-2">Less Pay Amount</th>
                      <th className="border px-4 py-2">Resolved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeLessPays[modalEmployee.id].map((item) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">
                          {item.cylinder?.gas_type || "N/A"}
                        </td>
                        <td className="border px-4 py-2">{item.cylinders_less_pay}</td>
                        <td className="border px-4 py-2">
                          {item.resolved ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => handleClearLessPay(modalEmployee.id)}
                  className={`mt-2 w-full bg-blue-500 text-white py-1 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  Clear Less Pay
                </button>
              </>
            ) : (
              <p>No less pay records found.</p>
            )}

            <button
              onClick={handleCloseModal}
              className="w-full bg-red-500 text-white mt-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesProfile;
