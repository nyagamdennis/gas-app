// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchAdminSalesTeamData,
  selectAllAdminSalesTeamData,
  toggleVerification,
} from "../../features/salesTeam/adminSalesTeamDataSlice"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../../features/salesTeam/salesTeamSlice"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import {
  fetchCash,
  postCash,
  selectAllCash,
} from "../../features/cashAtHand/cashSlice"
import {
  fetchTeamExpenses,
  selectAllTeamExpenses,
} from "../../features/expenses/teamExpensesSlice"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { selectMyProfile } from "../../features/employees/myProfileSlice"
import { updateExpenseOwner } from "../../features/expenses/expensesSlice"
import { useParams } from "react-router-dom"
import FormattedAmount from "../../components/FormattedAmount"
import { toast, ToastContainer } from "react-toastify"
import { set } from "cookies"

const TeamsSales = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(selectMyProfile)
  const allSalesData = useAppSelector(selectAllAdminSalesTeamData)
  const expense = useAppSelector(selectAllTeamExpenses)
  const employees = useAppSelector(selectAllEmployees)
  const allCash_sales = useAppSelector(selectAllCash)
  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const [cashAtHand, setCashAtHand] = useState<number>(0)
  const [filteredSales, setFilteredSales] = useState([])
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [addingCash, setAddingCash] = useState(false)
  const [editSales, setEditSales] = useState(false)
  const [editSalesBack, setEditSalesBack] = useState(false)
  const [addingAssign, setAddingAssign] = useState(false)
  const [ownerSelections, setOwnerSelections] = useState<
    Record<number, string>
  >({})
  const [submittingOwner, setSubmittingOwner] = useState(false)

  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Default to today's date
  })
  const { id, name } = useParams()

  const [endDate, setEndDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Default to today's date
  })
  const salesDate = startDate
  const decodedTeamName = decodeURIComponent(name)
  const teamId = id

  // const salesTeamId = selectedTeam === "all" ? null : selectedTeam;
  const salesTeamId = teamId

  const {
    isPro,
    isTrial,
    isExpired,
    businessName,
    businessId,
    businessLogo,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeam({ businessId }))
      dispatch(fetchEmployees({ businessId }))
      
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (businessId && teamId && salesDate) {
      dispatch(fetchAdminSalesTeamData({ teamId, salesDate }))
      dispatch(fetchCash({ businessId, salesDate }))
    }
  }, [dispatch, businessId, teamId, salesDate])

  useEffect(() => {
    const filtered = allSalesData.filter((sale) => {
      const saleDate = new Date(sale.timestamp).toISOString().split("T")[0]
      return saleDate >= startDate && saleDate <= endDate
    })
    setFilteredSales(filtered)
  }, [allSalesData, startDate, endDate])

  console.log("cash sales ", allCash_sales)

  useEffect(() => {
    if (salesTeamId) {
      dispatch(fetchTeamExpenses({ salesTeamId }))
    }
  }, [dispatch, salesTeamId])

  const handleToggleVerification = async (saleId, paymentType) => {
    dispatch(toggleVerification({ saleId, paymentType }))
  }

  const totalSalesAmount = filteredSales.reduce((total, sale) => {
    const cash = Number(sale.cashAmount) || 0
    const mpesa = Number(sale.mpesaAmount) || 0
    const debt = sale.debt_info?.debt_amount || 0
    return total + cash + mpesa - debt
  }, 0)

  const totalAmounts = filteredSales.reduce(
    (totals, sale) => {
      const cash = Number(sale.cashAmount) || 0
      const debt = sale.debt_info?.debt_amount || 0
      const mpesa = sale.admin_mpesa_verified
        ? Number(sale.mpesaAmount) || 0
        : 0

      const unverifiedMpesa = !sale.admin_mpesa_verified
        ? Number(sale.mpesaAmount) || 0
        : 0
      return {
        totalCash: totals.totalCash + cash - debt,
        totalMpesa: totals.totalMpesa + mpesa,
        totalUnverifiedMpesa: totals.totalUnverifiedMpesa + unverifiedMpesa,
      }
    },
    { totalCash: 0, totalMpesa: 0, totalUnverifiedMpesa: 0 },
  )
  // console.log('filtered sales ', filteredSales)

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
  const handleSubmitOwner = async (
    expenseId: number,
    selectedOwner: string,
  ) => {
    if (!selectedOwner) return

    setAddingAssign(true)
    try {
      await dispatch(updateExpenseOwner({ expenseId, selectedOwner }))
    } catch (error) {}
    setAddingAssign(false)
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
      toast.success("Cash posted successfully.")
    } catch (error) {
      toast.error("Failed to post cash.")
    }
    setAddingCash(false)
  }

  const handleEnableSalesEdit = () => {
    setEditSales(true)
    setEditSalesBack(true)
    setCashAtHand(allCash_sales?.cash ?? 0)
    setSelectedEmployeeId(allCash_sales?.employee?.id?.toString() || "")
  }

  const handleDesableSalesEdit = () => {
    setEditSales(false)
    setEditSalesBack(false)
    setCashAtHand(0)
    setSelectedEmployeeId("")
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <ToastContainer />
          <main className="flex-grow m-2 p-1">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center text-blue-700 underline">
                {decodedTeamName} sales
              </h2>
            </div>
            {/* Filter Section */}
            <div className="bg-white shadow-md p-1 flex justify-between items-center mb-2">
              <div className="flex flex-col space-y-2 items-center  md:flex md:justify-between">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="start-date"
                    className="text-gray-700 font-medium"
                  >
                    Sales Date:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                {/* <div className="flex items-center space-x-2">
                  <label
                    htmlFor="end-date"
                    className="text-gray-700 font-medium"
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div> */}
              </div>
              {/* <div className="ms-5">
                <label className="text-gray-700 font-medium mr-2">
                  Sales Team:
                </label>
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
              </div> */}
            </div>

            {/* Sales Data */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSalesData && allSalesData.length > 0 ? (
                  allSalesData.map((sale, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow hover:shadow-lg border border-gray-200 p-6 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-blue-700 mb-2">
                          {sale.sales_person?.first_name}{" "}
                          {sale.sales_person?.last_name}
                        </h3>
                        <h5 className="text-red-400">{sale.sales_choice}</h5>
                      </div>

                      <div className="text-gray-600 space-y-1 text-sm">
                        <p>
                          <strong>Customer:</strong> {sale.customer?.name} (
                          {sale.customer?.sales})
                        </p>
                        <p>
                          <strong>Phone:</strong> 0{sale.customer?.phone}
                        </p>
                        <p>
                          <strong>Location:</strong>{" "}
                          {sale.customer?.location?.name}
                        </p>
                        <p>
                          <strong>Product:</strong>{" "}
                          {sale.product?.cylinder
                            ? `${sale.product?.gas_type} ${sale.product?.weight}kg (Qty: ${sale.quantity})`
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Sale Type:</strong> {sale.sales_type} (
                          {sale.sales_choice})
                        </p>
                        <p>
                          <strong>Exchange:</strong>{" "}
                          {sale.exchanged_with_local ? (
                            <span className="text-red-600">
                              {sale?.cylinder_exchanged_with?.gas_type}{" "}
                              {sale?.cylinder_exchanged_with?.weight}kg
                            </span>
                          ) : (
                            <span className="text-green-600">No</span>
                          )}
                        </p>
                        <p>
                          <strong>Debt:</strong>{" "}
                          {sale.debt_info ? (
                            <span className="text-red-500">
                              {
                                <FormattedAmount
                                  amount={sale.debt_info.debt_amount}
                                />
                              }{" "}
                              (Repay by: {sale.debt_info.expected_date_to_repay}
                              )
                            </span>
                          ) : (
                            <span className="text-green-500">No Debt</span>
                          )}
                        </p>
                      </div>

                      <div className="mt-3 space-y-2">
                        {sale.mpesaAmount > 0 && (
                          <div className="text-sm">
                            <p className="font-bold text-blue-600">
                              Mpesa:{" "}
                              {
                                <FormattedAmount
                                  amount={
                                    sale.mpesaAmount * sale.quantity -
                                    (sale.debt_info?.debt_amount || 0)
                                  }
                                />
                              }
                            </p>
                            {sale.mpesa_code?.length > 0 &&
                              sale.mpesa_code.map((txn, idx) => (
                                <div key={idx} className="text-gray-500">
                                  {/* <p>Txn Code: {txn.code || "N/A"}</p>
                            <p>
                              Txn Amount:{" "}
                              {<FormattedAmount amount={txn.amount} />}
                            </p> */}
                                </div>
                              ))}
                          </div>
                        )}

                        {sale.cashAmount > 0 && (
                          <p className="text-sm font-bold text-green-700">
                            Cash:{" "}
                            {
                              <FormattedAmount
                                amount={
                                  sale.cashAmount * sale.quantity -
                                  (sale.debt_info?.debt_amount || 0)
                                }
                              />
                            }
                          </p>
                        )}

                        {/* Verification Buttons */}
                        {sale.mpesaAmount > 0 && (
                          <div>
                            {sale.admin_mpesa_verified ? (
                              <button
                                onClick={() =>
                                  handleToggleVerification(sale.id, "mpesa")
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                              >
                                Unverify Mpesa
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleVerification(sale.id, "mpesa")
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
                              >
                                Verify Mpesa
                              </button>
                            )}
                          </div>
                        )}

                        {sale.cashAmount > 0 && (
                          <div>
                            {sale.admin_payment_verified ? (
                              <button
                                onClick={() =>
                                  handleToggleVerification(sale.id, "cash")
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                              >
                                Unverify Cash
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleVerification(sale.id, "cash")
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
                              >
                                Verify Cash
                              </button>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          Sold on:{" "}
                          {new Date(sale.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500">
                    No sales data available for selected period.
                  </p>
                )}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold mb-2 text-blue-700">
                    Sales Summary
                  </h2>
                  <p className="text-gray-700">
                    Total Cash: {totalAmounts.totalCash.toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    Total Mpesa: {totalAmounts.totalMpesa.toLocaleString()}
                  </p>
                  {totalAmounts.totalUnverifiedMpesa > 0 && (
                    <p className="text-red-500">
                      Unverified Mpesa:{" "}
                      {totalAmounts.totalUnverifiedMpesa.toLocaleString()}
                    </p>
                  )}
                  <p className="text-black font-bold mt-2">
                    Total Sales: {totalSalesAmount.toLocaleString()}
                  </p>
                </div>

                {/* Expenses */}
                {filteredExpenses.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                    <h2 className="text-lg font-bold mb-2 text-green-700">
                      Expenses Summary
                    </h2>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Owner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map((exp) => (
                          <tr key={exp.id}>
                            <td className="p-2">{exp.name}</td>
                            <td className="p-2">{exp.amount}</td>
                            <td className="p-2">
                              <select
                                className="border border-gray-300 rounded p-1"
                                value={
                                  ownerSelections[exp.id] ??
                                  (exp.expense_on_choice === "EMPLOYEE"
                                    ? exp.employee?.id?.toString()
                                    : exp.expense_on_choice === "COMPANY"
                                    ? "Company"
                                    : "")
                                }
                                onChange={(e) => {
                                  const selected = e.target.value
                                  handleOwnerChange(exp.id, selected)
                                  handleSubmitOwner(exp.id, selected)
                                }}
                              >
                                <option value="" disabled>
                                  Select Owner
                                </option>
                                {filteredEmployees.map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                  </option>
                                ))}
                                <option value="Company">Company</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="font-bold text-red-700 mt-2">
                      Total Expenses: Ksh {totalExpenses.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Cash Handling */}
              {allCash_sales && !editSales ? (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold text-purple-700 mb-4">
                    Sales Submitted
                  </h2>
                  <h3>
                    Cash Submitted:{" "}
                    <span>
                      <FormattedAmount amount={allCash_sales?.cash} />
                    </span>
                  </h3>
                  <h3>
                    Cash Default:{" "}
                    <span>
                      <FormattedAmount amount={allCash_sales?.cash_default} />
                    </span>
                  </h3>
                  <h3>
                    Sales Person:{" "}
                    <span>
                      {allCash_sales?.employee?.first_name}{" "}
                      {allCash_sales?.employee?.last_name}
                    </span>
                  </h3>

                  <div className=" flex justify-end">
                    <button
                      onClick={handleEnableSalesEdit}
                      className="bg-blue-500 text-white font-bold rounded-md px-1 "
                    >
                      Edit Sales
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold text-purple-700 mb-4 flex justify-between items-center">
                    Cash Management
                    {editSalesBack && (
                      <span
                        onClick={handleDesableSalesEdit}
                        className="text-blue-800 underline font-light text-sm"
                      >
                        back
                      </span>
                    )}
                  </h2>
                  <form className="flex flex-col gap-4">
                    <div>
                      <label className="font-semibold">Cash at Hand</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded p-2 mt-1"
                        value={cashAtHand}
                        onChange={(e) => setCashAtHand(Number(e.target.value))}
                      />
                      <span className="text-sm flex justify-end font-bold ">
                        {totalDefaultCash > 0 && (
                          <div className="flex gap-2 items-center text-red-700">
                            Default{" "}
                            <FormattedAmount amount={totalDefaultCash} />
                          </div>
                        )}
                        {totalDefaultCash < 0 && (
                          <div className="flex gap-2 items-center text-green-700">
                            Excess <FormattedAmount amount={totalDefaultCash} />
                          </div>
                        )}
                      </span>
                    </div>
                    <div>
                      <label className="font-semibold">Salesperson</label>
                      <select
                        className="w-full border border-gray-300 rounded p-2 mt-1"
                        value={selectedEmployeeId}
                        onChange={(e) => handleEmployeeChange(e.target.value)}
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
                      type="button"
                      onClick={handleLessCash}
                      disabled={addingCash}
                      className="bg-blue-700 text-white rounded p-2 hover:bg-blue-800"
                    >
                      {addingCash ? "Submitting..." : "Submit Cash"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </main>
          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default TeamsSales
