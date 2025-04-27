// @ts-nocheck
import React, { useEffect, useState } from "react"
import {
  addEmployeeSalary,
  fetchSingleEmployee,
  selectSingleEmployees,
  transferEmployee,
  updateSimgleEmployeeStatus,
} from "../features/employees/singleEmployeeSlice"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate, useParams } from "react-router-dom"
import {
  clearDefault,
  fetchDefaults,
  ReturnDefault,
  selectAllDefaults,
} from "../features/defaults/defaultsSlice"
import {
  clearLessPay,
  fetchLessPay,
  selectAllLessPay,
} from "../features/defaults/lessPaySlice"
import DateDisplay from "../components/DateDisplay"
import {
  fetchExpenses,
  selectAllExpenses,
} from "../features/expenses/expensesSlice"
import FormattedAmount from "../components/FormattedAmount"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CircularProgress from "@mui/material/CircularProgress"
import {
  addEmployeeAdvance,
  clearAdvances,
  fetchAdvances,
  selectAllAdvance,
} from "../features/defaults/advancesSlice"
import { fetchCash, selectAllCash } from "../features/cashAtHand/cashSlice"
import defaultPic from "../components/media/default.png"
import AdminsFooter from "../components/AdminsFooter"

const EmployeesProfileDetails = () => {
  const [showIds, setShowIds] = useState<boolean>(false)
  const [addingSalary, setAddingSalary] = useState<Boolean>(false)
  const [salaryAmount, setSalaryAmount] = useState<number>(0)
  const [addingAdvance, setAddingAdvance] = useState<Boolean>(false)
  const [advanceAmount, setAdvanceAmount] = useState<number>(0)
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const employee = useAppSelector(selectSingleEmployees)
  const allSalesTeams = useAppSelector(selectAllSalesTeam)
  const employeeDefaults = useAppSelector(selectAllDefaults)
  const employeeLessPays = useAppSelector(selectAllLessPay)
  const expense = useAppSelector(selectAllExpenses)
  const advances = useAppSelector(selectAllAdvance)
  const allCash = useAppSelector(selectAllCash)

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [newSalesTeam, setNewSalesTeam] = useState("")
  const [loading, setLoading] = useState(false)
  const [advanceDate, setAdvanceDate] = useState("")
  const [openAddDate, setOpenAddDate] = useState(false)
  // const [employeeLessPays, setEmployeeLessPays] = useState({});

  const [modalEmployee, setModalEmployee] = useState(null)

  const [open, setOpen] = React.useState(false)
  const [openAdvance, setOpenAdvance] = React.useState(false)
  const [salaryDate, setSalaryDate] = useState("")

  const handleAddSalaryData = async () => {
    setAddingSalary(true)
    try {
      const updatedEmployeeSalary = await dispatch({ salaryDate })
      alert("Salary date added successfully!")
      handleClickCloseAddSalaryDate()
    } catch (error) {
      console.log("error ", error)
      alert("Failed to add salary date.", error.message)
    }
    setAddingSalary(false)
  }

  const handleOpenIds = () => {
    setShowIds(!showIds)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickOpenAdvance = () => {
    setOpenAdvance(true)
  }

  const handleCloseAdvance = () => {
    setOpenAdvance(false)
  }

  const handleClickOpenAddSalaryDate = () => {
    setOpenAddDate(true)
  }

  const handleClickCloseAddSalaryDate = () => {
    setOpenAddDate(false)
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleEmployee({ employeeId: Number(id) }))
      dispatch(fetchSalesTeam())
      dispatch(fetchDefaults(id))
      dispatch(fetchLessPay(id))
      dispatch(fetchExpenses(id))
      dispatch(fetchAdvances(id))
      dispatch(fetchCash())
    }
  }, [dispatch, id])

  const handleStatusChange = async (employeeId, statusField) => {
    setLoading(true)
    try {
      await dispatch(
        updateSimgleEmployeeStatus({ employeeId, statusField }),
      ).unwrap()
      alert(`Employee status updated: ${statusField}`)
      setSelectedEmployee(null)
    } catch (error) {
      console.log("error ", error)
      alert("Failed to update employee status ", error)
    }
    setLoading(false)
  }

  const handleTransferEmployee = async () => {
    if (!newSalesTeam) {
      alert("Please select a sales team.")
      return
    }
    setLoading(true)
    try {
      await dispatch(
        transferEmployee({
          employeeId: selectedEmployee.id,
          salesTeamId: newSalesTeam,
        }),
      ).unwrap()
      alert("Employee transferred successfully.")
      setSelectedEmployee(null)
    } catch (error) {
      alert("Failed to transfer employee.")
    }
    setLoading(false)
  }

  const handleClearDefaults = async (defaultId) => {
    setLoading(true)
    try {
      await dispatch(clearDefault(defaultId)).unwrap()
      alert("Defaults cleared successfully.")
    } catch (error) {
      console.log("Error in clearing defaults ", error.message)
      alert("Failed to clear defaults.")
    }
    setLoading(false)
  }

  const handleReturnDefaults = async (defaultId) => {
    setLoading(true)
    try {
      await dispatch(ReturnDefault(defaultId)).unwrap()
      alert("Defaults cleared successfully.")
    } catch (error) {
      console.log("Error in clearing defaults ", error.message)
      alert("Failed to clear defaults.")
    }
    setLoading(false)
  }

  const handleReturnDefault = async () => {}

  const handleClearLessPay = async (lessPayId) => {
    setLoading(true)
    try {
      await dispatch(clearLessPay(lessPayId)).unwrap()
      alert("less payments cleared successfully.")
    } catch (error) {
      console.log("failed to clear less pay ", error.message)
      alert("Failed to clear less pay.")
    }
    setLoading(false)
  }

  const handleRemoveAdvance = async (advanceId) => {
    // setLoading(true);
    try {
      await dispatch(clearAdvances(advanceId)).unwrap()
      alert("advance cleared successfully.")
    } catch (error) {
      console.log("failed to clear advavance.", error.message)
      alert("Failed to clear advance.")
    }
    // setLoading(false);
  }

  const handleSalesTeamChange = async (event) => {
    const newSalesTeamId = event.target.value
    if (!newSalesTeamId) return

    setLoading(true)
    try {
      const updatedEmployee = await dispatch(
        transferEmployee({
          employeeId: employee.id,
          salesTeamId: Number(newSalesTeamId),
        }),
      ).unwrap()

      alert("Sales Team updated successfully!")
    } catch (error) {
      alert("Failed to update Sales Team.")
    }
    setLoading(false)
  }

  // Calculate the total max wholesale refill price for all Less Pays
  const totalMaxWholesaleRefillLessPayPrice = employeeLessPays.reduce(
    (total, item) => {
      return (
        total +
        (item.cylinder?.max_retail_refil_price || 0) * item.cylinders_less_pay
      )
    },
    0,
  )

  // Calculate total max wholesale price for defaults
  const totalMaxWholesaleDefaultPrice = employeeDefaults.reduce(
    (total, item) => {
      const emptyPrice =
        (item.number_of_empty_cylinder || 0) *
        (item.cylinder?.max_wholesale_refil_price || 0)
      const filledPrice =
        (item.number_of_filled_cylinder || 0) *
        (item.cylinder?.max_wholesale_selling_price || 0)
      return total + emptyPrice + filledPrice
    },
    0,
  )

  const totalExpenses = expense.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )
  const totalAdvances = advances.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  const employeeId = Number(id)
  const handleAddNewSalary = async () => {
    setAddingSalary(true)
    try {
      const updatedEmployeeSalary = await dispatch(
        addEmployeeSalary({
          employeeId: employeeId,
          salaryAmount: Number(salaryAmount),
        }),
      ).unwrap()
      alert("Salary added successfully!")
      handleClose()
    } catch (error) {
      console.log("error ", error)
      alert("Failed to add salary.", error.message)
    }
    setAddingSalary(false)
  }

  const handleAddNewAdvance = async () => {
    setAddingSalary(true)
    try {
      const employeeAdvance = await dispatch(
        addEmployeeAdvance({
          employeeId: employeeId,
          amount: Number(advanceAmount),
          date_issued: advanceDate,
        }),
      ).unwrap()
      alert("advance added successfully!")
      handleCloseAdvance()
    } catch (error) {
      console.log("error ", error)
      alert("Failed to advance.", error.message)
    }
    setAddingAdvance(false)
  }

  const totalCost = employeeDefaults.reduce((sum, cylinder) => {
    const isFilled = !!cylinder.number_of_filled_cylinder
    const isEmpty = !!cylinder.number_of_empty_cylinder

    const price = isFilled
      ? cylinder.cylinder?.max_retail_selling_price
      : isEmpty
      ? cylinder.cylinder?.empty_cylinder_price
      : 0

    return sum + (price || 0) // fallback in case price is undefined
  }, 0)

  const filteredCash = allCash?.filter((cash) => {
    return cash.employee === employeeId
  })
  const totalCashDefault = filteredCash?.reduce((acc, cash) => {
    return acc + cash.cash_default
  }, 0)

  return (
    <div className="max-w-4xl mx-auto p-3">
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
            src={employee.profile_image || defaultPic}
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
              <p>
                <strong>ID Number:</strong> {employee.id_number}
              </p>
              <p>
                <strong>Gender:</strong> {employee.gender}
              </p>
              <p>
                <strong>Phone:</strong> {employee.phone}
              </p>
              <p>
                <strong>Alternative Phone:</strong> {employee.alternative_phone}
              </p>
            </div>

            {/* Sales Team */}
            <div>
              <h3 className="text-lg font-semibold">Sales Team</h3>
              <div className="flex items-center gap-2">
                <img
                  src={employee.sales_team?.profile_image || defaultPic}
                  alt={employee.sales_team?.name}
                  className="w-12 h-12 rounded-full border border-gray-300"
                />
                <p>{employee.sales_team?.name || "Not assigned"}</p>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">
                  Change Sales Team:
                </label>
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
              className={`px-3 py-1 rounded text-white text-sm text-center ${
                employee.verified ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {employee.verified ? "Verified ✅" : "Not Verified ❌"}
            </span>
            <span
              className={`px-3 py-1 rounded text-white text-sm text-center ${
                employee.defaulted ? "bg-red-500" : "bg-gray-400"
              }`}
            >
              {employee.defaulted ? "Defaulted ⚠️" : "No Defaults"}
            </span>
            <span
              onClick={handleClickOpenAddSalaryDate}
              className="px-3 py-1 rounded text-white text-sm text-center bg-yellow-900"
            >
              payment date
            </span>
            <span
              className={`px-3 py-1 rounded text-white text-sm text-center ${
                employee.fired ? "bg-black" : "bg-gray-400"
              }`}
            >
              {employee.fired ? "Fired 🔥" : "Employed"}
            </span>
            <span
              onClick={handleClickOpen}
              className="px-3 py-1 rounded text-white bg-pink-800 text-sm text-center"
            >
              enter salary
            </span>
            <span
              onClick={handleClickOpenAdvance}
              className="px-3 py-1 rounded text-white bg-pink-800 text-sm text-center"
            >
              Add Advance
            </span>
          </div>
        </div>
      </div>

      <div>
        {/* Toggle Button */}
        <div className=" flex justify-center">
          <button
            onClick={handleOpenIds}
            className="bg-blue-500 text-white  px-4 py-2 rounded-md m-4"
          >
            {showIds ? "Hide ID Cards" : "Show ID Cards"}
          </button>
        </div>

        {/* ID Cards */}
        {showIds && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Front ID</h3>
              <img
                src={employee.front_id || defaultPic}
                alt="Front ID"
                className="w-full h-48 object-cover border border-gray-400 rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Back ID</h3>
              <img
                src={employee.back_id || defaultPic}
                alt="Back ID"
                className="w-full h-48 object-cover border border-gray-400 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className=" my-3 p-4 border border-green-500">
        <p>
          Payment Date: <DateDisplay date={employee.date_joined} />{" "}
        </p>
        <h4>
          Salary:{" "}
          <span>
            <FormattedAmount amount={employee.contract_salary} />{" "}
          </span>
        </h4>
        <h4>
          Total advances:{" "}
          <span>
            <FormattedAmount amount={totalAdvances} />
          </span>
        </h4>
        <h4>Total Expenses: ksh {totalExpenses.toLocaleString()}</h4>
        <h4>
          Total Less Pay: ksh{" "}
          {totalMaxWholesaleRefillLessPayPrice.toLocaleString()}
        </h4>
        <h4>Total Defaults: ksh {totalCost.toLocaleString()}</h4>

        <div className="flex items-center space-x-2">
          <h4 className=" me-2 font-bold">Total Cash Default: </h4>
          {totalCashDefault.toLocaleString("en-US", {
            style: "currency",
            currency: "KSH",
          })}
        </div>

        <div>
          <h4 className=" text-lg font-bold underline ">
            <span>Total Salary:</span>{" "}
            <span className=" text-green-800 ">
              <FormattedAmount
                amount={
                  employee.contract_salary -
                  totalExpenses -
                  totalCost -
                  totalMaxWholesaleRefillLessPayPrice -
                  totalAdvances -
                  totalCashDefault
                }
              />{" "}
            </span>
          </h4>
        </div>
        <div className=" flex justify-end">
          <button className=" bg-green-950 text-white px-2 py-0.5 rounded-md">
            Pay
          </button>
        </div>
      </div>

      {advances.length > 0 && (
        <div className=" px-2 mb-5">
          <div className=" mt-4  border-t-2 border-dotted">
            <h5 className=" text-lg font-bold">Advances</h5>

            <div className="mt-3">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {advances.map((advance) => (
                    <tr key={advance.id}>
                      <td className="border px-4 py-2">
                        {advance.amount ?? "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        <DateDisplay date={advance.date_issued} />
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleRemoveAdvance(advance?.id)}
                          className="bg-green-800 px-1 py-0.5 text-white"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-right font-semibold text-lg">
            <p>
              Total Advances:{" "}
              <span className="text-red-600">
                <FormattedAmount amount={totalAdvances} />
              </span>
            </p>
          </div>
        </div>
      )}

      <div>
        {filteredCash.length > 0 && (
          <div className=" px-2 mb-5">
            <div className=" mt-4  border-t-2 border-dotted">
              <h5 className=" text-lg font-bold">Cash at Hand Defaults</h5>

              <div className="mt-3">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-4 py-2">Amount</th>
                      <th className="border px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCash.map((cash) => (
                      <tr key={cash.id}>
                        <td className="border px-4 py-2">
                          {cash.cash_default ?? "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          <DateDisplay date={cash.date} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 text-right font-semibold text-lg">
              <p>
                Total Cash Default:{" "}
                <span className="text-red-600">
                  Ksh {totalCashDefault.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        )}
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
                      <td className="border px-4 py-2">
                        {expense.name ?? "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {expense.amount ?? "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        <DateDisplay date={expense.date} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-right font-semibold text-lg">
            <p>
              Total Expenses:{" "}
              <span className="text-red-600">
                Ksh {totalExpenses.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      )}
      <div>
        {/* Defaults Table */}

        {employeeDefaults.length > 0 && (
          <section className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Lost Cylinders
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 border">Gas Type</th>
                    <th className="px-4 py-2 border">Weight (kg)</th>
                    <th className="px-4 py-2 border">Filled</th>
                    <th className="px-4 py-2 border">Empty</th>
                    <th className="px-4 py-2 border">Cost</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeDefaults.map((cylinder) => {
                    const isFilled = !!cylinder.number_of_filled_cylinder
                    const isEmpty = !!cylinder.number_of_empty_cylinder
                    const cost = isFilled
                      ? cylinder.cylinder?.max_retail_selling_price
                      : isEmpty
                      ? cylinder.cylinder?.empty_cylinder_price
                      : "N/A"

                    return (
                      <tr key={cylinder.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">
                          {cylinder.cylinder?.gas_type ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {cylinder.cylinder?.weight ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {cylinder.number_of_filled_cylinder ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {cylinder.number_of_empty_cylinder ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">{cost ?? "N/A"}</td>
                        <td className="px-4 py-2 border">
                          <DateDisplay date={cylinder.date_lost} />
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-1">
                            {cylinder.cleared ? (
                              "Yes"
                            ) : (
                              <button
                                onClick={() =>
                                  handleClearDefaults(cylinder?.id)
                                }
                                className={`mt-2 bg-green-500 text-white py-1 px-2 rounded ${
                                  loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={loading}
                              >
                                Clear
                              </button>
                            )}
                            {cylinder.cleared ? (
                              "Yes"
                            ) : (
                              <button
                                onClick={() =>
                                  handleReturnDefaults(cylinder?.id)
                                }
                                className={`mt-2 bg-green-500 text-white py-1 px-2 rounded ${
                                  loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={loading}
                              >
                                Return
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-right text-lg font-semibold mt-4">
              Total Lost Cylinder Cost:{" "}
              <span className="text-red-600">
                Ksh {totalCost.toLocaleString()}
              </span>
            </div>
          </section>
        )}

        {/* Less Pays Table */}

        <h3 className="font-semibold mt-4">Less Pays</h3>
        {employeeLessPays?.length > 0 ? (
          <section className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Less Pay Records
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 border">Cylinder Name</th>
                    <th className="px-4 py-2 border">Weight</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeLessPays.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 border">
                        {item.cylinder?.gas_type || "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {item.cylinder?.weight}
                      </td>
                      <td className="px-4 py-2 border">
                        {item.cylinders_less_pay}
                      </td>
                      <td className="px-4 py-2 border">
                        <DateDisplay date={item.date_lost} />
                      </td>
                      <td className="border px-4 py-2">
                        {item.resolved ? (
                          "Yes"
                        ) : (
                          <button
                            onClick={() => handleClearLessPay(item.id)}
                            className={`mt-2 w-full bg-blue-500 text-white py-1 rounded ${
                              loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                          >
                            clear
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Display the Total Max Wholesale Refill Price */}
            <div className="mt-4 text-right font-semibold text-lg">
              <p>
                Total Less Pay:{" "}
                <span className="text-blue-600">
                  Ksh {totalMaxWholesaleRefillLessPayPrice.toLocaleString()}
                </span>
              </p>
            </div>
          </section>
        ) : (
          <p>No less pay records found.</p>
        )}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Salary</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter new employees salary.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-salary"
            label="New Salary"
            type="number"
            fullWidth
            variant="standard"
            value={salaryAmount}
            onChange={(e) => setSalaryAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <CircularProgress />
          <Button onClick={handleAddNewSalary}>Add</Button> */}
          {addingSalary ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={handleAddNewSalary} disabled={addingSalary}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openAdvance} onClose={handleCloseAdvance}>
        <DialogTitle>Enter Advance</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter new Advance.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="new-advance"
            label="New Salary"
            type="number"
            fullWidth
            variant="standard"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="advance-date"
            label="Advance Date"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={advanceDate}
            onChange={(e) => setAdvanceDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdvance}>Cancel</Button>
          {/* <CircularProgress />
          <Button onClick={handleAddNewSalary}>Add</Button> */}
          {addingAdvance ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={handleAddNewAdvance} disabled={addingAdvance}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDate} onClose={handleClickCloseAddSalaryDate}>
        <DialogTitle>Enter Payment date.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter payment dates from date 1-29.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            name="payment-date"
            label="Payment Date"
            type="number"
            min={1}
            max={28}
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={salaryDate}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (val >= 1 && val <= 28) {
                setSalaryDate(val)
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseAddSalaryDate}>Cancel</Button>
          {/* <CircularProgress />
          <Button onClick={handleAddNewSalary}>Add</Button> */}
          {addingAdvance ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={handleAddSalaryData} disabled={addingAdvance}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <footer className="mt-6 text-center text-gray-500">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default EmployeesProfileDetails
