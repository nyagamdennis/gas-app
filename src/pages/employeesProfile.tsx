// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Modal } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { fetchEmployees, selectAllEmployees, transferEmployee, updateEmployeeStatus } from "../features/employees/employeesSlice";
import { fetchSalesTeam, selectAllSalesTeam } from "../features/salesTeam/salesTeamSlice";
import { clearDefault, fetchDefaults } from "../features/defaults/defaultsSlice";
import { clearLessPay, fetchLessPay } from "../features/defaults/lessPaySlice";
import defaultProfile from "../components/media/default.png"
import DateDisplay from "../components/DateDisplay";


const Employee = () => {
  const dispatch = useAppDispatch();
  const allEmployees = useAppSelector(selectAllEmployees);
  const allSalesTeams = useAppSelector(selectAllSalesTeam);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newSalesTeam, setNewSalesTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [employeeDefaults, setEmployeeDefaults] = useState({});
  const [employeeLessPays, setEmployeeLessPays] = useState({});

  const [modalEmployee, setModalEmployee] = useState(null);


  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchSalesTeam());
  }, [dispatch]);

  const handleSelectEmployee = async (employee) => {
    setSelectedEmployee(employee);

    if (!employeeDefaults[employee.id]) {
      const defaultsResponse = await dispatch(fetchDefaults(employee.id)).unwrap();
      setEmployeeDefaults((prev) => ({ ...prev, [employee.id]: defaultsResponse }));
    }

    if (!employeeLessPays[employee.id]) {
      const lessPayResponse = await dispatch(fetchLessPay(employee.id)).unwrap();
      setEmployeeLessPays((prev) => ({ ...prev, [employee.id]: lessPayResponse }));
    }
  };

  const handleStatusChange = async (employeeId, statusField) => {
    setLoading(true);
    try {
      await dispatch(updateEmployeeStatus({ employeeId, statusField })).unwrap();
      alert(`Employee status updated: ${statusField}`);
      setSelectedEmployee(null);
    } catch (error) {
      alert("Failed to update employee status");
    }
    setLoading(false);
  };

  const handleTransferEmployee = async () => {
    if (!newSalesTeam) {
      alert("Please select a sales team.");
      return;
    }
    setLoading(true);
    try {
      await dispatch(transferEmployee({ employeeId: selectedEmployee.id, salesTeamId: newSalesTeam })).unwrap();
      alert("Employee transferred successfully.");
      setSelectedEmployee(null);
    } catch (error) {
      alert("Failed to transfer employee.");
    }
    setLoading(false);
  };



  // const handleClearDefaults = async (defaultId) => {
  //   setLoading(true);
  //   try {
  //     await dispatch(clearDefault(defaultId)).unwrap();
  //     alert("Defaults cleared successfully.");
  //     setEmployeeDefaults((prev) => ({ ...prev, [defaultId]: [] }));
  //   } catch (error) {
  //     alert("Failed to clear defaults.");
  //   }
  //   setLoading(false);
  // };
  const handleClearDefaults = async (defaultId) => {
    setLoading(true);
    try {
      await dispatch(clearDefault(defaultId)).unwrap();
      alert("Defaults cleared successfully.");

      // Remove the cleared item from the frontend state
      setEmployeeDefaults((prev) => {
        const updatedDefaults = { ...prev };
        updatedDefaults[selectedEmployee.id] = updatedDefaults[selectedEmployee.id].filter(item => item.id !== defaultId);
        return updatedDefaults;
      });
    } catch (error) {
      alert("Failed to clear defaults.");
    }
    setLoading(false);
  };

  const handleClearLessPay = async (lessPayId) => {
    setLoading(true);
    try {
      await dispatch(clearLessPay(lessPayId)).unwrap();
      alert("less payments cleared successfully.");

      // Remove the cleared item from the frontend state
      setEmployeeLessPays((prev) => {
        const updatedLessPay = { ...prev };
        updatedLessPay[selectedEmployee.id] = updatedLessPay[selectedEmployee.id].filter(item => item.id !== lessPayId);
        return updatedLessPay;
      });
    } catch (error) {
      alert("Failed to clear defaults.");
    }
    setLoading(false);
  };


  // const handleClearLessPay = async (defaultId) => {
  //   setLoading(true);
  //   try {
  //     await dispatch(clearLessPay(defaultId)).unwrap();
  //     alert("Less Pay data cleared successfully.");
  //     setEmployeeLessPays((prev) => ({ ...prev, [defaultId]: [] }));
  //   } catch (error) {
  //     alert("Failed to clear less pay data.");
  //   }
  //   setLoading(false);
  // };


  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Employees</h1>

        {loading && (
          <div className="flex justify-center my-4">
            <ClipLoader size={25} color={"#6366f1"} />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer"
              onClick={() => handleSelectEmployee(employee)}
            >
              <img
                src={employee.profile_image || defaultProfile}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="w-20 h-20 rounded-full object-contain mx-auto"
              />
              <h2 className="text-center mt-2 font-semibold text-gray-700">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-center text-gray-500">{employee.phone || "No Phone"}</p>
              <p className="text-center text-indigo-600">
                Current sales team: <span className=" font-bold">{employee.sales_team?.name || 'Not placed'}</span>

              </p>
            </div>
          ))}
        </div>

        {/* Employee Modal */}
        {selectedEmployee && (
          <Modal open={Boolean(selectedEmployee)} onClose={() => setSelectedEmployee(null)}>
            <div className="bg-white p-4 rounded-lg shadow-md mx-4 mt-2 max-w-md m-auto">
              <h2 className="text-xl font-bold mb-4">
                {selectedEmployee.first_name} {selectedEmployee.last_name}
              </h2>
              <p><strong>ID:</strong> {selectedEmployee.id_number || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedEmployee.phone || "N/A"}</p>

              {/* Status Management */}
              <h3 className="font-semibold mt-4">Manage Status</h3>
              <div className="flex justify-between mt-2">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 rounded"
                  onClick={() => handleStatusChange(selectedEmployee.id, "verified")}
                >
                  {selectedEmployee.verified ? "Unverify" : "Verify"}
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded"
                  onClick={() => handleStatusChange(selectedEmployee.id, "suspended")}
                >
                  {selectedEmployee.suspended ? "Unsuspend" : "Suspend"}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                  onClick={() => handleStatusChange(selectedEmployee.id, "fired")}
                >
                  {selectedEmployee.fired ? "Rehire" : "Fire"}
                </button>
              </div>

              <div>
                {/* Defaults Table */}
                <h3 className="font-semibold mt-4">Defaults</h3>
                {employeeDefaults[selectedEmployee.id]?.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="border px-0.5 py-2 ">Cylinder Name</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Weight</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Filled</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Empty</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Date</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Cleared</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeDefaults[selectedEmployee.id].map((item) => (
                            <tr key={item.id}>
                              <td className="border px-0.5 py-2">{item.cylinder?.gas_type || "N/A"}</td>
                              <td className="border px-0.5 py-2">{item.cylinder?.weight}</td>
                              <td className="border px-0.5 py-2">{item.cylinder?.filled_lost}</td>
                              <td className="border px-0.5 py-2">{item.cylinder?.empties_lost}</td>
                              <td className="border px-0.5 py-2">
                                <DateDisplay date={item.date_lost} />
                              </td>
                              <td>
                                {item.cleared ? "Yes" : <button
                                  onClick={() => handleClearDefaults(item?.id)}
                                  className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                  disabled={loading}
                                >clear</button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </>
                ) : (
                  <p>No default records found.</p>
                )}

                {/* Less Pays Table */}
                <h3 className="font-semibold mt-4">Less Pays</h3>
                {employeeLessPays[selectedEmployee.id]?.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="border px-0.5 py-2 ">Cylinder Name</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Weight</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Quantity</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Date</th>
                            <th className="border px-0.5 py-2 whitespace-nowrap">Resolved</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeLessPays[selectedEmployee.id].map((item) => (
                            <tr key={item.id}>
                              <td className="border px-0.5 py-2">{item.cylinder?.gas_type || "N/A"}</td>
                              <td className="border px-0.5 py-2">{item.cylinder?.weight}</td>
                              <td className="border px-0.5 py-2">{item.cylinders_less_pay}</td>
                              <td className="border px-0.5 py-2">
                                <DateDisplay date={item.date_lost} />
                              </td>
                              <td className="border px-3 py-2">
                                {item.resolved ? "Yes" : <button
                                  onClick={() => handleClearLessPay(item.id)}
                                  className={`mt-2 w-full bg-blue-500 text-white py-1 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                  disabled={loading}
                                >clear</button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p>No less pay records found.</p>
                )}
              </div>


              {/* Transfer Employee */}
              <h3 className="font-semibold mt-4">Transfer Employee</h3>
              <select
                className="border p-2 rounded w-full mt-2"
                onChange={(e) => setNewSalesTeam(e.target.value)}
              >
                <option value="">Select Sales Team</option>
                {allSalesTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleTransferEmployee}
                className="mt-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-1 rounded"
                disabled={!newSalesTeam}
              >
                Transfer
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="w-full bg-gray-700 text-white mt-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Employee;
