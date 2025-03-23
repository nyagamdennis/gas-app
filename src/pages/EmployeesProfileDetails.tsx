// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { fetchSingleEmployee, selectSingleEmployees, transferEmployee, updateSimgleEmployeeStatus } from '../features/employees/singleEmployeeSlice';
import { fetchSalesTeam, selectAllSalesTeam } from '../features/salesTeam/salesTeamSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { clearDefault, fetchDefaults, selectAllDefaults } from '../features/defaults/defaultsSlice';
import { fetchLessPay, selectAllLessPay } from '../features/defaults/lessPaySlice';
import DateDisplay from '../components/DateDisplay';
import { fetchExpenses, selectAllExpenses } from '../features/expenses/expensesSlice';
import FormattedAmount from '../components/FormattedAmount';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const EmployeesProfileDetails = () => {

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const employee = useAppSelector(selectSingleEmployees);
  const allSalesTeams = useAppSelector(selectAllSalesTeam);
  const employeeDefaults = useAppSelector(selectAllDefaults);
  const employeeLessPays = useAppSelector(selectAllLessPay)
  const expense = useAppSelector(selectAllExpenses);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newSalesTeam, setNewSalesTeam] = useState("");
  const [loading, setLoading] = useState(false);
  // const [employeeDefaults, setEmployeeDefaults] = useState({});
  // const [employeeLessPays, setEmployeeLessPays] = useState({});

  const [modalEmployee, setModalEmployee] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    if (id) {
      dispatch(fetchSingleEmployee({ employeeId: Number(id) }));
      dispatch(fetchSalesTeam());
      dispatch(fetchDefaults(id));
      dispatch(fetchLessPay(id));
      dispatch(fetchExpenses(id));
    }

  }, [dispatch, id]);

  console.log('defaults ', employeeDefaults)

  const handleStatusChange = async (employeeId, statusField) => {
    setLoading(true);
    try {
      await dispatch(updateSimgleEmployeeStatus({ employeeId, statusField })).unwrap();
      alert(`Employee status updated: ${statusField}`);
      setSelectedEmployee(null);
    } catch (error) {
      console.log('error ', error)
      alert("Failed to update employee status ", error);
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



  const handleClearDefaults = async (defaultId) => {
    setLoading(true);
    try {
      await dispatch(clearDefault(defaultId)).unwrap();
      alert("Defaults cleared successfully.");

      // Remove the cleared item from the frontend state
      setEmployeeDefaults((prev) => {
        const updatedDefaults = { ...prev };
        updatedDefaults[employee.id] = updatedDefaults[employee.id].filter(item => item.id !== defaultId);
        return updatedDefaults;
      });
    } catch (error) {
      alert("Failed to clear defaults.");
    }
    setLoading(false);
  };



  const handleReturnDefault = async () => {

  }


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

  const handleSalesTeamChange = async (event) => {
    const newSalesTeamId = event.target.value;
    if (!newSalesTeamId) return;

    setLoading(true);
    try {
      const updatedEmployee = await dispatch(
        transferEmployee({ employeeId: employee.id, salesTeamId: Number(newSalesTeamId) })
      ).unwrap();

      alert("Sales Team updated successfully!");
    } catch (error) {
      alert("Failed to update Sales Team.");
    }
    setLoading(false);
  };

  // Calculate the total max wholesale refill price for all Less Pays
  const totalMaxWholesaleRefillPrice = employeeLessPays.reduce((total, item) => {
    return total + (item.cylinder?.max_wholesale_refil_price || 0) * item.cylinders_less_pay;
  }, 0);


  // Calculate total max wholesale price for defaults
  const totalMaxWholesaleDefaultPrice = employeeDefaults.reduce((total, item) => {
    const emptyPrice = (item.number_of_empty_cylinder || 0) * (item.cylinder?.max_wholesale_refil_price || 0);
    const filledPrice = (item.number_of_filled_cylinder || 0) * (item.cylinder?.max_wholesale_selling_price || 0);
    return total + emptyPrice + filledPrice;
  }, 0);


  // const totalExpenses = expense.reduce((total, expe) => {
  //   return total + (expe.amount || 0)
  // })

  // Calculate total expenses
const totalExpenses = expense.reduce((total, item) => total + (item.amount || 0), 0);


const handleAddNewSalary = () => {
  
}
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
        onClick={() => navigate("/admins/employees")}
      >
        ← Back to Employees
      </button>

      {/* Employee Card */}
      <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={employee.profile_image}
            alt={`${employee.first_name} ${employee.last_name}`}
            className="w-32 h-32 rounded-full border border-gray-400 object-cover"
          />
          <h2 className="text-xl font-bold mt-2">
            {employee.first_name} {employee.last_name}
          </h2>
          <p className="text-gray-600">{employee?.user?.email}</p>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <p><strong>ID Number:</strong> {employee.id_number}</p>
              <p><strong>Gender:</strong> {employee.gender}</p>
              <p><strong>Phone:</strong> {employee.phone}</p>
              <p><strong>Alternative Phone:</strong> {employee.alternative_phone}</p>
            </div>

            {/* Sales Team */}
            <div>
              <h3 className="text-lg font-semibold">Sales Team</h3>
              <div className="flex items-center gap-2">
                <img
                  src={employee.sales_team?.profile_image}
                  alt={employee.sales_team?.name}
                  className="w-12 h-12 rounded-full border border-gray-300"
                />
                <p>{employee.sales_team?.name || "Not assigned"}</p>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">Change Sales Team:</label>
                <select
                  onChange={handleSalesTeamChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Select a new Sales Team</option>
                  {allSalesTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <span
              onClick={() => handleStatusChange(employee.id, "verified")}
              className={`px-3 py-1 rounded text-white text-sm text-center ${employee.verified ? "bg-green-500" : "bg-gray-400"}`}>
              {employee.verified ? "Verified ✅" : "Not Verified ❌"}
            </span>
            <span className={`px-3 py-1 rounded text-white text-sm text-center ${employee.defaulted ? "bg-red-500" : "bg-gray-400"}`}>
              {employee.defaulted ? "Defaulted ⚠️" : "No Defaults"}
            </span>
            <span className={`px-3 py-1 rounded text-white text-sm text-center ${employee.suspended ? "bg-yellow-500" : "bg-gray-400"}`}>
              {employee.suspended ? "Suspended 🚫" : "Active"}
            </span>
            <span className={`px-3 py-1 rounded text-white text-sm text-center ${employee.fired ? "bg-black" : "bg-gray-400"}`}>
              {employee.fired ? "Fired 🔥" : "Employed"}
            </span>
            <span onClick={handleClickOpen} className='px-3 py-1 rounded text-white bg-pink-800 text-sm text-center'>
              enter salary
            </span>
          </div>
        </div>
      </div>

      {/* ID Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Front ID</h3>
          <img src={employee.front_id} alt="Front ID" className="w-full h-48 object-cover border border-gray-400 rounded-lg" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Back ID</h3>
          <img src={employee.back_id} alt="Back ID" className="w-full h-48 object-cover border border-gray-400 rounded-lg" />
        </div>
      </div>


      <div className=' my-3 p-4 border border-green-500'>
        <p>Payment Date: </p>
        <h4>Salary: <span>{employee.contract_salary}</span></h4>
        <h4>Total Expenses: ksh {totalExpenses.toLocaleString()}</h4>
        <h4>Total Less Pay: ksh {totalMaxWholesaleRefillPrice.toLocaleString()}</h4>
        <h4>Total Defaults: ksh {totalMaxWholesaleDefaultPrice.toLocaleString()}</h4>

        <div>
          <h4 className=' text-lg font-bold underline '><span>Total Salary:</span> <span className=' text-green-800 '><FormattedAmount amount={employee.salary - totalExpenses - totalMaxWholesaleDefaultPrice - totalMaxWholesaleRefillPrice} /> </span></h4>
        </div>
        <div className=' flex justify-end'>
          <button className=' bg-green-950 text-white px-2 py-0.5 rounded-md'>Paid</button>
        </div>
      </div>

      {expense.length > 0 && (
        <div className=" px-2 mb-5">
        <div className=" mt-4  border-t-2 border-dotted">
          <h5 className=" text-lg font-bold">Expenses</h5>

          <div className="mt-3">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {expense.map((expense) => (
                  <tr key={expense.id}>
                    <td className="border px-4 py-2">{expense.name ?? "N/A"}</td>
                    <td className="border px-4 py-2">{expense.amount ?? "N/A"}</td>
                    <td className="border px-4 py-2"><DateDisplay date = {expense.date} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-right font-semibold text-lg">
        <p>Total Expenses: <span className="text-red-600">Ksh {totalExpenses.toLocaleString()}</span></p>
      </div>
      </div>
      )}
      <div>
        {/* Defaults Table */}
        <h3 className="font-semibold mt-4">Defaults</h3>
        {employeeDefaults?.length > 0 ? (
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
                  {employeeDefaults?.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-0.5 py-2">{item.cylinder?.gas_type || "N/A"}</td>
                      <td className="border px-0.5 py-2">{item.cylinder?.weight}kg</td>
                      <td className="border px-0.5 py-2">{item?.number_of_filled_cylinder}</td>
                      <td className="border px-0.5 py-2">{item?.number_of_empty_cylinder}</td>
                      <td className="border px-0.5 py-2">
                        <DateDisplay date={item.date_lost} />
                      </td>
                      <div className=' flex space-x-1'>
                        <td className="border px-3 py-2">
                          {item.cleared ? "Yes" : <button
                            onClick={() => handleClearDefaults(item?.id)}
                            className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            disabled={loading}
                          >clear</button>}
                        </td>
                        <td className="border px-3 py-2">
                          {item.cleared ? "Yes" : <button
                            onClick={() => handleClearDefaults(item?.id)}
                            className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            disabled={loading}
                          >Return</button>}
                        </td>
                      </div>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right font-semibold text-lg">
              <p>Total Defaults: <span className="text-blue-600">Ksh {totalMaxWholesaleDefaultPrice.toLocaleString()}</span></p>
            </div>

          </>
        ) : (
          <p>No default records found.</p>
        )}

        {/* Less Pays Table */}
        <h3 className="font-semibold mt-4">Less Pays</h3>
        {employeeLessPays?.length > 0 ? (
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
                  {employeeLessPays.map((item) => (
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
            {/* Display the Total Max Wholesale Refill Price */}
            <div className="mt-4 text-right font-semibold text-lg">
              <p>Total Less Pay: <span className="text-blue-600">Ksh {totalMaxWholesaleRefillPrice.toLocaleString()}</span></p>
            </div>
          </>
        ) : (
          <p>No less pay records found.</p>
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        
      >
        <DialogTitle>Enter Salary</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new employees salary.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="New Salary"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EmployeesProfileDetails;
