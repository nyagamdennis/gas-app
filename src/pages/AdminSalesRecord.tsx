// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import FormattedAmount from "../components/FormattedAmount"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchMyProfile,
  selectMyProfile,
} from "../features/employees/myProfileSlice"
import {
  fetchSalesTeamData,
  selectAllSalesTeamData,
} from "../features/salesTeam/salesTeamDataSlice"
import defaultProfile from "../components/media/default.png"
import {
  fetchAdminSalesTeamData,
  selectAllAdminSalesTeamData,
  toggleVerification,
} from "../features/salesTeam/adminSalesTeamDataSlice"
import AdminsFooter from "../components/AdminsFooter"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import {
  fetchTeamExpenses,
  selectAllTeamExpenses,
} from "../features/expenses/teamExpensesSlice"
import DateDisplay from "../components/DateDisplay"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice"
import { updateExpenseOwner } from "../features/expenses/expensesSlice"
import CurrencyConvert from "../components/CurrencyConvert"
import {
  fetchCash,
  postCash,
  selectAllCash,
} from "../features/cashAtHand/cashSlice"

const AdminSalesRecord = () => {
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(selectMyProfile)
  const allSalesData = useAppSelector(selectAllAdminSalesTeamData)
  const expense = useAppSelector(selectAllTeamExpenses)
  const employees = useAppSelector(selectAllEmployees)
  const allCash = useAppSelector(selectAllCash)
  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const [cashAtHand, setCashAtHand] = useState<number>(0)
  const [filteredSales, setFilteredSales] = useState([])
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [addingCash, setAddingCash] = useState(false)
  const [addingAssign, setAddingAssign] = useState(false)
  const [ownerSelections, setOwnerSelections] = useState<
    Record<number, string>
  >({})

  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Default to today's date
  })
  const [endDate, setEndDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Default to today's date
  })
  // const salesTeamId = selectedTeam === "all" ? null : selectedTeam;
  const salesTeamId =
    selectedTeam && selectedTeam !== "all" ? selectedTeam : null

  useEffect(() => {
    dispatch(fetchAdminSalesTeamData())
    dispatch(fetchSalesTeam())
    dispatch(fetchEmployees())
    dispatch(fetchCash())
  }, [dispatch])

  useEffect(() => {
    if (salesTeamId) {
      dispatch(fetchTeamExpenses({ salesTeamId }))
    }
  }, [dispatch, salesTeamId])

  useEffect(() => {
    const filtered = allSalesData.filter((sale) => {
      const saleDate = new Date(sale.timestamp).toISOString().split("T")[0]
      const dateMatch = saleDate >= startDate && saleDate <= endDate
      const teamMatch =
        selectedTeam === "all" ||
        String(sale.sales_team) === String(selectedTeam)
      return dateMatch && teamMatch
    })
    setFilteredSales(filtered)
  }, [allSalesData, startDate, endDate, selectedTeam])

  const handleToggleVerification = async (saleId, paymentType) => {
    dispatch(toggleVerification({ saleId, paymentType }))
  }

  const totalSalesAmount = filteredSales.reduce((total, sale) => {
    const cash = Number(sale.cashAmount) || 0
    const mpesa = Number(sale.mpesaAmount) || 0
    return total + cash + mpesa
  }, 0)

  const totalAmounts = filteredSales.reduce(
    (totals, sale) => {
      const cash = Number(sale.cashAmount) || 0
      const mpesa = sale.admin_mpesa_verified
        ? Number(sale.mpesaAmount) || 0
        : 0

      const unverifiedMpesa = !sale.admin_mpesa_verified
        ? Number(sale.mpesaAmount) || 0
        : 0
      return {
        totalCash: totals.totalCash + cash,
        totalMpesa: totals.totalMpesa + mpesa,
        totalUnverifiedMpesa: totals.totalUnverifiedMpesa + unverifiedMpesa,
      }
    },
    { totalCash: 0, totalMpesa: 0, totalUnverifiedMpesa: 0 },
  )

  const handleCashAtHand = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    // Filter sales data by date range
    const filteredExpenses = expense.filter((expe) => {
      const expeDate = new Date(expe.date).toISOString().split("T")[0]
      return expeDate >= startDate && expeDate <= endDate
    })
    setFilteredExpenses(filteredExpenses)
  }, [expense, startDate, endDate])

  const totalExpenses = filteredExpenses.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  const handleOwnerChange = (expenseId: number, newOwner: string) => {
    setOwnerSelections((prev) => ({
      ...prev,
      [expenseId]: newOwner,
    }))
  }

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    // Optionally submit here or elsewhere
  }

  const handleSubmitOwner = async (expenseId: number) => {
    const selectedOwner = ownerSelections[expenseId]
    if (!selectedOwner) return
    setAddingAssign(true);
    try {
      await dispatch(updateExpenseOwner({ expenseId, selectedOwner }));
      alert("Owner assigned successfully.");
    } catch (error) {
      console.error("Error assigning owner:", error)
      alert("Failed to assign owner.")
    }
    setAddingAssign(false);
    
  }

  const filteredEmployees = salesTeamId
    ? employees.filter(
        (employee) => employee.sales_team?.id === Number(salesTeamId),
      )
    : employees // show all when "all" is selected

  const totalDefaultCash = totalAmounts.totalCash - totalExpenses - cashAtHand

  const handleLessCash = async (e) => {
    e.preventDefault()
    setAddingCash(true)
    try {
      await dispatch(
        postCash({
          selectedEmployeeId,
          totalDefaultCash,
          cashAtHand,
          salesTeamId,
          endDate,
        }),
      )
      alert("Cash posted successfully.")
    } catch (error) {
      console.error("Error posting cash:", error)
      alert("Failed to post cash.")
    }
    setAddingCash(false)
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
      <div className="bg-white shadow-md p-4 flex justify-between items-center ">
        <div className="flex flex-col space-y-2 items-center  md:flex md:justify-between">
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
        <div className="ms-6">
          <label className="text-gray-700 font-medium mr-2">Sales Team:</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Teams</option>
            {allSalesTeam.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sales Data */}
      <div className=" mb-3">
        <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSales && filteredSales.length > 0 ? (
            filteredSales.map((sale, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                {/* Salesperson */}
                <h3 className="text-lg font-semibold text-blue-600">
                  Salesperson: {sale?.sales_person.first_name}{" "}
                  {sale?.sales_person.last_name}
                </h3>

                {/* Customer */}
                <p className="mt-2 text-gray-700">
                  <strong>Customer:</strong> {sale.customer?.name} (
                  {sale.customer?.sales})
                </p>
                <p className="mt-2 text-gray-700">
                  <strong>Customer phone:</strong> 0{sale.customer?.phone}
                </p>

                <p className="mt-2 text-gray-700">
                  <strong>Customer Location:</strong>{" "}
                  {sale.customer?.location?.name}
                </p>
                {/* Product */}
                <p className="mt-2 text-gray-700">
                  <strong>Product:</strong>{" "}
                  {sale.product?.cylinder
                    ? `${sale.product?.gas_type} ${sale.product?.weight}kg - Qty: ${sale.quantity}`
                    : "N/A"}
                </p>

                {/* Sale Type */}
                <p className="mt-2 text-gray-700">
                  <strong>Type:</strong> {sale.sales_type} ({sale.sales_choice})
                </p>

                {sale.exchanged_with_local ? (
                  <p className="mt-2 text-gray-700">
                    <strong>
                      Exchanged with Local:{" "}
                      <span className=" text-red-700 ms-2">Yes</span>
                    </strong>
                  </p>
                ) : (
                  <p className="mt-2 text-gray-700">
                    <strong>
                      Exchanged with Local:{" "}
                      <span className="text-green-700 ms-2">No</span>
                    </strong>
                  </p>
                )}

                {/* Debt Info */}
                {sale.debt_info ? (
                  <p className="mt-2 text-red-500">
                    <strong>Debt:</strong>{" "}
                    <FormattedAmount amount={sale?.debt_info?.debt_amount} /> (
                    Repay by: {sale.debt_info.expected_date_to_repay})
                  </p>
                ) : (
                  <p className="mt-2 text-green-600">
                    <strong>No Debt</strong>
                  </p>
                )}

                {sale.mpesaAmount > 0 && (
                  <div>
                    <p className="mt-4 text-gray-900 font-bold">
                      Mpesa Amount:{" "}
                      <FormattedAmount amount={sale.mpesaAmount} />
                    </p>

                    {/* Show Mpesa transaction details if they exist */}
                    {sale.mpesa_code?.length > 0 &&
                      sale.mpesa_code.map((txn, index) => (
                        <div key={index} className="mt-2 text-gray-700">
                          <p>
                            Transaction Code:{" "}
                            <span className="font-semibold">
                              {txn.code || "N/A"}
                            </span>
                          </p>
                          <p>
                            Transaction Amount:{" "}
                            <FormattedAmount amount={txn.amount} />
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {sale.cashAmount > 0 && (
                  <p className="mt-4 text-gray-900 font-bold">
                    Cash Amount: <FormattedAmount amount={sale.cashAmount} />
                  </p>
                )}

                {/* Mpesa Verification Section */}
                {Number(sale?.mpesaAmount) >= 1 && (
                  <div className="mb-4">
                    {sale?.admin_mpesa_verified ? (
                      <div>
                        <p className="text-green-900 text-xl">
                          Mpesa payment verified.
                        </p>
                        <button
                          onClick={() =>
                            handleToggleVerification(sale.id, "mpesa")
                          }
                          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                          Unverify Mpesa
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-900 text-xl">
                          Mpesa payment not verified.
                        </p>
                        <button
                          onClick={() =>
                            handleToggleVerification(sale.id, "mpesa")
                          }
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          Verify Mpesa
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Cash Verification Section */}
                {Number(sale?.cashAmount) >= 1 && (
                  <div className="mb-4">
                    {sale?.admin_payment_verified ? (
                      <div>
                        <p className="text-green-900 text-xl">
                          Cash payment verified.
                        </p>
                        <button
                          onClick={() =>
                            handleToggleVerification(sale.id, "cash")
                          }
                          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                          Unverify Cash
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-900 text-xl">
                          Cash payment not verified.
                        </p>
                        <button
                          onClick={() =>
                            handleToggleVerification(sale.id, "cash")
                          }
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          Verify Cash
                        </button>
                      </div>
                    )}
                  </div>
                )}

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
        <div>
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Cash Sales: Ksh {totalAmounts.totalCash.toLocaleString()}
            </h2>
            {totalAmounts.totalUnverifiedMpesa > 0 && (
              <h2 className="text-lg font-semibold text-gray-700">
                Total unverified Mpesa Sales: Ksh{" "}
                {totalAmounts.totalUnverifiedMpesa.toLocaleString()}
              </h2>
            )}

            <h2 className="text-lg font-semibold text-gray-700">
              Total Mpesa Sales: Ksh {totalAmounts.totalMpesa.toLocaleString()}
            </h2>
          </div>
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Sales Amount: Ksh {totalSalesAmount.toLocaleString()}
            </h2>
          </div>
        </div>
        <div>
          <div className="bg-gray-500 my-2 ">
            {filteredExpenses && filteredExpenses.length > 0 ? (
              <div className=" px-2 mb-5">
                <div className=" mt-4  border-t-2 border-dotted">
                  <h5 className=" text-lg font-bold">Expenses</h5>

                  <div className="mt-3">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border px-4 py-2">Name</th>
                          <th className="border px-4 py-2">Amount</th>
                          <th className="border px-4 py-2">Own</th>
                        </tr>
                      </thead>
                      <tbody className="text-white font-bold ">
                        {filteredExpenses.map((expense) => (
                          <tr key={expense.id}>
                            <td className="border px-4 py-2">
                              {expense.name ?? "N/A"}
                            </td>
                            <td className="border px-4 py-2">
                              {expense.amount ?? "N/A"}
                            </td>
                            <td className="border px-4 py-2 flex items-center space-x-1 text-sm">
                              <select
                                value={ownerSelections[expense.id] || ""}
                                onChange={(e) =>
                                  handleOwnerChange(expense.id, e.target.value)
                                }
                                className="text-black px-2 py-1 rounded"
                              >
                                <option value="" disabled>
                                  {/* {expense.employee
                                    ? `${expense.employee.first_name} ${expense.employee.last_name}`
                                    : "Select Owner"} */}
                                  {expense.expense_on_choice === null &&
                                    "Select Owner"}
                                  {expense.expense_on_choice === "COMPANY" &&
                                    "Company"}
                                  {expense.expense_on_choice === "EMPLOYEE" &&
                                  expense.employee
                                    ? `${expense.employee.first_name} ${expense.employee.last_name}`
                                    : null}
                                </option>
                                {filteredEmployees.map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                  </option>
                                ))}
                                <option value="Company">Company</option>
                              </select>
                            
                              <button
                                onClick={() => handleSubmitOwner(expense.id)}
                                disabled={addingAssign}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded ${
                                  addingAssign
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {addingAssign ? (
                                  <>
                                    <svg
                                      className="animate-spin h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                                      ></path>
                                    </svg>
                                    Loading...
                                  </>
                                ) : (
                                  "Assign"
                                )}
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
                    Total Expenses:{" "}
                    <span className="text-red-900 font-bold">
                      Ksh {totalExpenses.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="px-2">
          <h2 className="text-lg font-semibold">
            Expected Total Cash:{" "}
            <FormattedAmount amount={totalAmounts.totalCash - totalExpenses} />
          </h2>

          {cashAtHand > 0 && (
            <h2 className="text-lg font-semibold">
              Total cash Default:{" "}
              <FormattedAmount
                amount={totalAmounts.totalCash - totalExpenses - cashAtHand}
              />
            </h2>
          )}

          <form className=" flex flex-col bg-gray-400 py-3 space-x-1 items-center">
            <label className=" font-semibold">Cash at hand.</label>
            <input
              className="font-semibold px-2 py-0.5 outline-none border border-green-950"
              type="number"
              required
              value={cashAtHand}
              onChange={(e) => setCashAtHand(e.target.value)}
            />
            <div className=" flex flex-col">
              <label className="font-semibold mt-2">Sales Person</label>
              <select
                required
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="text-black px-2 py-1 rounded"
              >
                <option value="" disabled>
                  Select Employee
                </option>
                {filteredEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLessCash}
              disabled={addingCash}
              className={`bg-blue-900 px-2 text-white rounded-md mt-2 flex items-center justify-center gap-2 ${
                addingCash ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {addingCash ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <AdminsFooter />
    </div>
  )
}

export default AdminSalesRecord;