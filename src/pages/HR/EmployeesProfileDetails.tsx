// @ts-nocheck
import React, { useEffect, useState } from "react"
import {
  addEmployeeSalary,
  addEmployeeSalaryDate,
  fetchSingleEmployee,
  selectSingleEmployees,
  transferEmployee,
  updateSimgleEmployeeStatus,
} from "../../features/employees/singleEmployeeSlice"
import { selectAllSalesTeamShops } from "../../features/salesTeam/salesTeamSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate, useParams } from "react-router-dom"
import {
  clearDefault,
  fetchDefaults,
  ReturnDefault,
  selectAllDefaults,
} from "../../features/defaults/defaultsSlice"
import {
  clearLessPay,
  fetchLessPay,
  selectAllLessPay,
} from "../../features/defaults/lessPaySlice"
import DateDisplay from "../../components/DateDisplay"
import {
  fetchExpenses,
  selectAllExpenses,
} from "../../features/expenses/expensesSlice"
import FormattedAmount from "../../components/FormattedAmount"
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
} from "../../features/defaults/advancesSlice"
import { fetchCash, selectAllCash } from "../../features/cashAtHand/cashSlice"
import defaultPic from "../../components/media/default.png"
import AdminsFooter from "../../components/AdminsFooter"
import {
  fetchSalary,
  selectAllSalary,
} from "../../features/monthlySalary/salarySlice"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"

const EmployeesProfileDetails = () => {
  const [showIds, setShowIds] = useState<boolean>(false)
  const [addingSalary, setAddingSalary] = useState<Boolean>(false)
  const [addingSalaryDate, setAddingSalaryDate] = useState<Boolean>(false)
  const [salaryAmount, setSalaryAmount] = useState<number>(0)
  const [addingAdvance, setAddingAdvance] = useState<Boolean>(false)
  const [advanceAmount, setAdvanceAmount] = useState<number>(0)
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const employee = useAppSelector(selectSingleEmployees)
  const allSalesTeams = useAppSelector(selectAllSalesTeamShops)
  const employeeDefaults = useAppSelector(selectAllDefaults)
  const employeeLessPays = useAppSelector(selectAllLessPay)
  const expense = useAppSelector(selectAllExpenses)
  const advances = useAppSelector(selectAllAdvance)
  const allCash = useAppSelector(selectAllCash)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.toLocaleString("default", {
      month: "long",
    })} ${now.getFullYear()}`
  })


  // const employeeSalary = useAppSelector(selectAllSalary)
  const employeeSalary = useAppSelector(selectAllSalary)
  // console.log('employee sala ', employeeSalary)

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
      dispatch(fetchSingleEmployee({ id }))
      dispatch(fetchSalesTeam())
      dispatch(fetchDefaults(id))
      dispatch(fetchLessPay(id))
      dispatch(fetchExpenses(id))
      dispatch(fetchAdvances(id))
      dispatch(fetchSalary({ employeeId: Number(id) }))
      dispatch(fetchCash())
    }
  }, [dispatch, id])

  const handleStatusChange = async (employeeId, statusField) => {
    setLoading(true)
    try {
      await dispatch(
        updateSimgleEmployeeStatus({ employeeId, statusField }),
      ).unwrap()
      toast.success(`employee status updated: ${statusField}`)
      setSelectedEmployee(null)
    } catch (error) {
      toast.error(`Failed to update status: ${error}`)
    }
    setLoading(false)
  }


  const handleTermination = async (employeeId, statusField) => {
    setLoading(true)
    try {
      await dispatch(
        updateSimgleEmployeeStatus({ employeeId, statusField }),
      ).unwrap()
      alert(`Employee status updated: ${statusField}`)
      setSelectedEmployee(null)
    } catch (error) {
      alert("Failed to update employee status ", error)
    }
    setLoading(false)
  }
  const employeeId = Number(id)

  const handleTransferEmployee = async () => {
    if (!newSalesTeam) {
      toast.error("Please select a sales team.")
      return
    }
    setLoading(true)
    try {
      await dispatch(
        transferEmployee({
          employeeId: selectedEmployee?.id,
          salesTeamId: newSalesTeam,
        }),
      ).unwrap()
      toast.success("Employee transferred successfully.")
      setSelectedEmployee(null)
    } catch (error) {
      toast.error("Failed to transfer employee, try again.")
    }
    setLoading(false)
  }

  const handleClearDefaults = async (defaultId) => {
    setLoading(true)
    try {
      await dispatch(clearDefault(defaultId)).unwrap()
      // alert("Defaults cleared successfully.")
      toast.success("Defaults cleared successfully.")
    } catch (error) {
      // alert("Failed to clear defaults.")
      toast.error("Failed to clear default, try again.")
    }
    setLoading(false)
  }

  const handleReturnDefaults = async (defaultId) => {
    setLoading(true)
    try {
      await dispatch(ReturnDefault(defaultId)).unwrap()
      // alert("Defaults cleared successfully.")
      toast.success("Defaults cleared successfully.")
    } catch (error) {
      // alert("Failed to clear defaults.")
      toast.error("Failed to cleared defaults.")
    }
    setLoading(false)
  }

  const handleReturnDefault = async () => {}

  const handleClearLessPay = async (lessPayId) => {
    setLoading(true)
    try {
      await dispatch(clearLessPay(lessPayId)).unwrap()
      // alert("less payments cleared successfully.")
      toast.success("Less payments cleared successfully.")
    } catch (error) {
      // alert("Failed to clear less pay.")
      toast.error("Failed to clear less pay.")
    }
    setLoading(false)
  }

  const handleRemoveAdvance = async (advanceId) => {
    // setLoading(true);
    try {
      await dispatch(clearAdvances(advanceId)).unwrap()
      // alert("advance cleared successfully.")
      toast.success("advance cleared successfully.")
    } catch (error) {
      // alert("Failed to clear advance.")
      toast.error("Failed to clear advance.")
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

      // alert("Sales Team updated successfully!")
      toast.success("Sales Team updated successfully!")
    } catch (error) {
      // alert("Failed to update Sales Team.")
      toast.error("Failed to update Sales Team.")
    }
    setLoading(false)
  }

  // ------------------------------------------------------------------
  const getDateRangeForSelectedMonth = (
    selectedMonth: string,
    salaries: Salary[],
  ): { startDate: Date; endDate: Date } => {
    const [monthStr, yearStr] = selectedMonth.split(" ")
    const selectedDate = new Date(`${monthStr} 1, ${yearStr}`)

    const sortedSalaries = salaries
      .filter((s) => !!s.payment_date)
      .map((s) => new Date(s.payment_date))
      .sort((a, b) => a.getTime() - b.getTime())

    let startDate: Date
    let endDate: Date = new Date() // fallback to today

    // Check if payment exists for selected month
    const currentSalaryDate = sortedSalaries.find((date) => {
      return (
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      )
    })

    if (currentSalaryDate) {
      startDate = currentSalaryDate

      const nextSalaryDate = sortedSalaries.find((d) => d > currentSalaryDate)
      if (nextSalaryDate) endDate = nextSalaryDate
    } else {
      // No salary for this month, default range
      startDate = selectedDate

      const nextSalaryDate = sortedSalaries.find((d) => d > startDate)
      if (nextSalaryDate) endDate = nextSalaryDate
    }

    return { startDate, endDate }
  }

  // -------------------------------------------------------------------
  const { startDate, endDate } = getDateRangeForSelectedMonth(
    selectedMonth,
    employeeSalary,
  )

  const filteredExpenses = expense?.filter((cash) => {
    const cashDate = new Date(cash.date)
    if (isNaN(cashDate)) return false

    return (
      cash.employee?.id === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const filteredtotalMaxWholesaleDefaultPrice = employeeDefaults?.filter(
    (cash) => {
      const cashDate = new Date(cash.date_lost)
      if (isNaN(cashDate)) return false

      return (
        cash.employee === employeeId &&
        cashDate >= startDate &&
        cashDate < endDate
      )
    },
  )

  // Calculate total max wholesale price for defaults
  const totalMaxWholesaleDefaultPrice =
    filteredtotalMaxWholesaleDefaultPrice.reduce((total, item) => {
      const emptyPrice =
        (item.number_of_empty_cylinder || 0) *
        (item.cylinder?.max_wholesale_refil_price || 0)
      const filledPrice =
        (item.number_of_filled_cylinder || 0) *
        (item.cylinder?.max_wholesale_selling_price || 0)
      return total + emptyPrice + filledPrice
    }, 0)

  const filteredEmployeeLessPay = employeeLessPays?.filter((cash) => {
    const cashDate = new Date(cash.date_lost)
    if (isNaN(cashDate)) return false

    return (
      cash.employee === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const totalMaxWholesaleRefillLessPayPrice = filteredEmployeeLessPay.reduce(
    (total, item) => {
      return (
        total +
        (item.cylinder?.max_retail_refil_price || 0) * item.cylinders_less_pay
      )
    },
    0,
  )

  const filteredAdvances = advances?.filter((cash) => {
    const cashDate = new Date(cash.date_added)
    if (isNaN(cashDate)) return false

    return (
      cash.employee === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  // ------------------------------
  const totalExpenses = filteredExpenses?.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  const totalAdvances = filteredAdvances.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  const handleAddNewSalary = async () => {
    setAddingSalary(true)
    try {
      const updatedEmployeeSalary = await dispatch(
        addEmployeeSalary({
          employeeId: employeeId,
          salaryAmount: Number(salaryAmount),
        }),
      ).unwrap()
      // alert("Salary added successfully!")
      toast.success("Salary added successfully!")
      handleClose()
    } catch (error) {
      // console.log("error ", error)
      toast.error("Failed to add salary.", error.message)
    }
    setAddingSalary(false)
  }
  const handleAddSalaryDate = async () => {
    setAddingSalaryDate(true)
    try {
      const updatedEmployeeSalary = await dispatch(
        addEmployeeSalaryDate({
          employeeId: employeeId,
          salaryDate: salaryDate,
        }),
      )
      toast.success("Salary date added successfully!")
      handleClickCloseAddSalaryDate()
    } catch (error) {
      console.log("error ", error)
      toast.error("Failed to add salary date.", error.message)
    }
    setAddingSalaryDate(false)
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
      toast.success("advance added successfully!")
      handleCloseAdvance()
    } catch (error) {
      console.log("error ", error)
      toast.error("Failed to advance.", error.message)
    }
    setAddingAdvance(false)
  }

  const totalCost = filteredtotalMaxWholesaleDefaultPrice.reduce(
    (sum, cylinder) => {
      const isFilled = !!cylinder.number_of_filled_cylinder
      const isEmpty = !!cylinder.number_of_empty_cylinder

      const price = isFilled
        ? cylinder.cylinder?.max_retail_selling_price
        : isEmpty
        ? cylinder.cylinder?.empty_cylinder_price
        : 0

      return sum + (price || 0) // fallback in case price is undefined
    },
    0,
  )

  const filteredCash = allCash?.filter((cash) => {
    const cashDate = new Date(cash.deficit_date)
    return (
      cash.employee === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const totalCashDefault = filteredCash?.reduce((acc, cash) => {
    return acc + cash.cash_default
  }, 0)
  console.log("Total cash default ", filteredCash)

  const formated_payment_date = () => {
    const today = new Date() // current date
    const joined = new Date(employee?.date_joined) // original date
    // Construct new date with current year & month, but day from `date_joined`
    const adjusted = new Date(
      today.getFullYear(),
      today.getMonth(),
      joined.getDate(),
    )
    return adjusted
  }

  const generateMonthOptions = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const joinedDate = new Date(employee?.date_joined)
    const currentDate = new Date()
    const options = []

    for (
      let date = new Date(joinedDate);
      date <= currentDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const label = `${months[date.getMonth()]} ${date.getFullYear()}`
      if (label !== selectedMonth) {
        options.push(
          <option key={label} value={label}>
            {label}
          </option>,
        )
      }
    }

    return options
  }

  const hasSalaryForSelectedMonth = () => {
    const [monthStr, yearStr] = selectedMonth.split(" ")
    const targetMonth = new Date(`${monthStr} 1, ${yearStr}`).getMonth()
    const targetYear = parseInt(yearStr, 10)

    const salaryList = Array.isArray(employeeSalary) ? employeeSalary : []
    

    const match = employeeSalary.find((salary) => {
      const date = new Date(salary.payment_date)
      const amount = salary.amount
      return (
        date.getMonth() === targetMonth &&
        date.getFullYear() === targetYear &&
        amount
      )
    })

    return match
      ? { paid: true, paymentDate: match.payment_date, amount: match.amount }
      : { paid: false, paymentDate: null, amount: null }
  }

  const { paid, paymentDate, amount } = hasSalaryForSelectedMonth()
  const handlePayment = () => {}
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <main className="flex-grow">
        <Navbar
          headerMessage={"Manage Employees"}
          headerText={"View, edit, and organize your workforce"}
        />
        <ToastContainer />
        <div className="max-w-4xl mx-auto p-3">
          {/* Back Button */}
          <button
            className="mb-6 px-5 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition"
            onClick={() => navigate("/admins/employees")}
          >
            ← Back to Employees
          </button>

          {/* Employee Card */}
          <div className="bg-white p-6 shadow-md rounded-xl flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <img
                src={employee?.profile_image || defaultPic}
                alt={`${employee?.first_name} ${employee?.last_name}`}
                className="w-32 h-32 rounded-full border border-gray-300 object-cover"
              />
              <h2 className="text-xl font-semibold mt-3">
                {employee?.first_name} {employee?.last_name}
              </h2>
              <p className="text-gray-500 text-sm">{employee?.user?.email}</p>
            </div>

            {/* Details Section */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Personal Info */}
                <section>
                  <h3 className="text-base font-bold text-gray-700 mb-2">
                    Personal Details
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      <strong>ID Number:</strong> {employee?.id_number}
                    </li>
                    <li>
                      <strong>Gender:</strong> {employee?.gender}
                    </li>
                    <li>
                      <strong>Phone:</strong> {employee?.phone}
                    </li>
                    <li>
                      <strong>Alt. Phone:</strong> {employee?.alternative_phone}
                    </li>
                  </ul>
                </section>

                {/* Sales Team */}
                <section>
                  <h3 className="text-base font-bold text-gray-700 mb-2">
                    Sales Team
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={employee?.sales_team?.profile_image || defaultPic}
                      alt={employee?.sales_team?.name}
                      className="w-12 h-12 rounded-full border border-gray-300"
                    />
                    <p className="text-sm">
                      {employee?.sales_team?.name || "Not Assigned"}
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Change Team
                    </label>
                    <select
                      onChange={handleSalesTeamChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
                    >
                      <option value="">Select a new Sales Team</option>
                      {allSalesTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>
              </div>

              {/* Status & Actions */}
              <div >
                {/* <button
              onClick={() => handleStatusChange(employee?.id, "verified")}
              className={`px-3 py-1 rounded-md text-white text-sm font-medium transition ${
                employee?.verified ? "bg-green-600" : "bg-gray-400"
              }`}
            >
              {employee?.verified ? "Verified ✅" : "Not Verified ❌"}
            </button> */}
                {/* Verification Status */}
                <div className="mt-6">
                  <h3 className="text-base whitespace-nowrap font-bold text-gray-700 mb-2">
                    Verification Status
                  </h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verificationStatus"
                        value="verified"
                        checked={employee?.verified}
                        onChange={() =>
                          handleStatusChange(employee?.id, "verified")
                        }
                        className="form-radio h-4 w-4 text-green-600"
                      />
                      <span className="text-sm text-gray-700">Verified</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verificationStatus"
                        value="not_verified"
                        checked={!employee?.verified}
                        onChange={() =>
                          handleStatusChange(employee?.id, "verified")
                        }
                        className="form-radio h-4 w-4 text-gray-600"
                      />
                      <span className="text-sm text-gray-700 whitespace-nowrap">
                        Not Verified
                      </span>
                    </label>
                  </div>
                </div>

                
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                

                <button
                  onClick={handleClickOpenAddSalaryDate}
                  className="px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium"
                >
                  Payment Date
                </button>

                <div
                  className={`px-3 py-1 rounded-md text-white text-sm font-medium text-center ${
                    employee?.fired ? "bg-black" : "bg-gray-400"
                  }`}
                  onClick={() => handleStatusChange(employee?.id, "fire")}
                >
                  {employee?.fired ? "Terminated 🔥" : "Terminate"}
                </div>

                <button
                  onClick={handleClickOpen}
                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Enter Salary
                </button>

                <button
                  onClick={handleClickOpenAdvance}
                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Add Advance
                </button>
              </div>
            </div>
          </div>

          {/* ID Card Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={handleOpenIds}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
            >
              {showIds ? "Hide ID Cards" : "Show ID Cards"}
            </button>
          </div>

          {/* ID Card Display */}
          {showIds && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-1">
                  Front ID
                </h3>
                <img
                  src={employee?.front_id || defaultPic}
                  alt="Front ID"
                  className="w-full h-48 object-cover border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-1">
                  Back ID
                </h3>
                <img
                  src={employee?.back_id || defaultPic}
                  alt="Back ID"
                  className="w-full h-48 object-cover border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="my-6 p-6 rounded-2xl shadow-sm border border-gray-200 bg-white space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    Payment Date:
                  </span>{" "}
                  <DateDisplay date={formated_payment_date()} />
                </p>
                <select
                  className="border outline-none border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value={selectedMonth} disabled hidden>
                    {selectedMonth}
                  </option>
                  {generateMonthOptions()}
                </select>
              </div>

              <h4 className="text-base font-semibold text-blue-700">
                Salary:{" "}
                <span className="font-normal text-gray-800">
                  <FormattedAmount amount={employee?.contract_salary} />
                </span>
              </h4>

              <h4 className="text-base font-semibold text-yellow-700">
                Total Advances:{" "}
                <span className="font-normal text-gray-800">
                  <FormattedAmount amount={totalAdvances} />
                </span>
              </h4>

              <h4 className="text-base font-semibold text-orange-600">
                Total Expenses:{" "}
                <span className="font-normal text-gray-800">
                  Ksh {totalExpenses.toLocaleString()}
                </span>
              </h4>

              <h4 className="text-base font-semibold text-rose-600">
                Total Less Pay:{" "}
                <span className="font-normal text-gray-800">
                  Ksh {totalMaxWholesaleRefillLessPayPrice.toLocaleString()}
                </span>
              </h4>

              <h4 className="text-base font-semibold text-red-600">
                Total Defaults:{" "}
                <span className="font-normal text-gray-800">
                  Ksh {totalCost.toLocaleString()}
                </span>
              </h4>

              <div className="text-base font-semibold text-purple-700">
                Total Cash Default:{" "}
                <span className="text-gray-800">
                  {totalCashDefault.toLocaleString("en-US", {
                    style: "currency",
                    currency: "KSH",
                  })}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-lg font-bold text-green-800 flex items-center justify-between">
                <span>Total Net Salary:</span>
                {paid ? (
                  <span>
                    <FormattedAmount amount={amount} />
                  </span>
                ) : (
                  <span>
                    <FormattedAmount
                      amount={
                        employee?.contract_salary -
                        totalExpenses -
                        totalCost -
                        totalMaxWholesaleRefillLessPayPrice -
                        totalAdvances -
                        totalCashDefault
                      }
                    />
                  </span>
                )}
              </h4>
            </div>

            <div className="flex justify-end">
              {paid ? (
                <button className="bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded-md transition-all">
                  paid
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded-md transition-all"
                >
                  Pay
                </button>
              )}
            </div>
          </div>

          {/* Advances */}
          {filteredAdvances.length > 0 && (
            <section className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Advance Payments
              </h3>
              <div className="overflow-auto rounded-md border border-gray-100">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 font-semibold text-gray-600 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdvances.map((advance) => (
                      <tr key={advance.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{advance.amount ?? "N/A"}</td>
                        <td className="px-4 py-2">
                          <DateDisplay date={advance.date_issued} />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleRemoveAdvance(advance.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right text-base font-semibold text-red-700">
                Total Advances: <FormattedAmount amount={totalAdvances} />
              </div>
            </section>
          )}

          {/* Cash at Hand Defaults */}
          {filteredCash.length > 0 && (
            <section className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Cash at Hand Defaults
              </h3>
              <div className="overflow-auto rounded-md border border-gray-100">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 font-semibold text-gray-600 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCash.map((cash) => (
                      <tr key={cash.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          {cash.cash_default ?? "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          <DateDisplay date={cash.date} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right text-base font-semibold text-red-700">
                Total Cash Default: Ksh {totalCashDefault.toLocaleString()}
              </div>
            </section>
          )}

          {/* Expenses */}
          {filteredExpenses.length > 0 && (
            <section className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Expenses</h3>
              <div className="overflow-auto rounded-md border border-gray-100">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-50 font-semibold text-gray-600 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{expense.name ?? "N/A"}</td>
                        <td className="px-4 py-2">{expense.amount ?? "N/A"}</td>
                        <td className="px-4 py-2">
                          <DateDisplay date={expense.date} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right text-base font-semibold text-red-700">
                Total Expenses: Ksh {totalExpenses.toLocaleString()}
              </div>
            </section>
          )}

          {/* --------------------------------------- */}
          <div className="space-y-6">
            {/* Lost Cylinders Section */}
            {filteredtotalMaxWholesaleDefaultPrice.length > 0 && (
              <section className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Lost Cylinders
                </h3>
                <div className="overflow-auto rounded-md border border-gray-100">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 font-semibold text-gray-600 uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-3">Gas Type</th>
                        <th className="px-4 py-3">Weight (kg)</th>
                        <th className="px-4 py-3">Filled</th>
                        <th className="px-4 py-3">Empty</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Action</th>
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
                          <tr
                            key={cylinder.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-2">
                              {cylinder.cylinder?.gas_type ?? "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {cylinder.cylinder?.weight ?? "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {cylinder.number_of_filled_cylinder ?? "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {cylinder.number_of_empty_cylinder ?? "N/A"}
                            </td>
                            <td className="px-4 py-2">{cost}</td>
                            <td className="px-4 py-2">
                              <DateDisplay date={cylinder.date_lost} />
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                {!cylinder.cleared && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleClearDefaults(cylinder.id)
                                      }
                                      disabled={loading}
                                      className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                      Clear
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleReturnDefaults(cylinder.id)
                                      }
                                      disabled={loading}
                                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                      Return
                                    </button>
                                  </>
                                )}
                                {cylinder.cleared && (
                                  <span className="text-green-700 font-medium">
                                    Yes
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="text-right text-base font-medium mt-4 text-red-600">
                  Total Lost Cylinder Cost: Ksh {totalCost.toLocaleString()}
                </div>
              </section>
            )}

            {/* Less Pays Section */}
            <section className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Less Pay Records
              </h3>
              {filteredEmployeeLessPay?.length > 0 ? (
                <>
                  <div className="overflow-auto rounded-md border border-gray-100">
                    <table className="min-w-full text-sm text-left text-gray-700">
                      <thead className="bg-gray-50 font-semibold text-gray-600 uppercase tracking-wide">
                        <tr>
                          <th className="px-4 py-3">Cylinder</th>
                          <th className="px-4 py-3">Weight</th>
                          <th className="px-4 py-3">Quantity</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Resolved</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeLessPays.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-2">
                              {item.cylinder?.gas_type || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {item.cylinder?.weight}
                            </td>
                            <td className="px-4 py-2">
                              {item.cylinders_less_pay}
                            </td>
                            <td className="px-4 py-2">
                              <DateDisplay date={item.date_lost} />
                            </td>
                            <td className="px-4 py-2">
                              {item.resolved ? (
                                <span className="text-green-700 font-medium">
                                  Yes
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleClearLessPay(item.id)}
                                  disabled={loading}
                                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                  Clear
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right font-semibold text-base text-blue-600">
                    Total Less Pay: Ksh{" "}
                    {totalMaxWholesaleRefillLessPayPrice.toLocaleString()}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No less pay records found.</p>
              )}
            </section>
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
                Enter payment dates from date 1-28.
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
                <Button
                  onClick={handleAddSalaryDate}
                  disabled={addingSalaryDate}
                >
                  Add
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </main>

      {/* Footer */}
      <AdminsFooter />
    </div>
  )
}

export default EmployeesProfileDetails
