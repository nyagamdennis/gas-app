// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchMyProfile,
  selectMyProfile,
} from "../features/employees/myProfileSlice"
import { Link } from "react-router-dom"
import {
  fetchSalesTeamData,
  selectAllSalesTeamData,
} from "../features/salesTeam/salesTeamDataSlice"
import defaultProfile from "../components/media/default.png"
import FormattedAmount from "../components/FormattedAmount"
import AdminsFooter from "../components/AdminsFooter"
import {
  fetchTeamExpenses,
  postExpenses,
  selectAllTeamExpenses,
} from "../features/expenses/teamExpensesSlice"
import { CircularProgress } from "@mui/material"

const TeamSalesPage = () => {
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(selectMyProfile)
  const allSalesData = useAppSelector(selectAllSalesTeamData)
  const expense = useAppSelector(selectAllTeamExpenses)
  const [cashAtHand, setCashAtHand] = useState<number>(0)
  const [expenseName, setExpenseName] = useState<string>("")
  const [expenseAmount, setExpenseAmount] = useState<number>(0)
  const [expenseDate, setExpenseDate] = useState<string>("")
  const [filteredSales, setFilteredSales] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [addingExpenses, setAddingExpenses] = useState(false)
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Default to today's date
  })
  const [endDate, setEndDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Default to today's date
  })

  const id = myProfile?.id

  const salesTeamId = myProfile?.sales_team?.id
  const employeeId = myProfile?.id
  const handleAddExpenses = (e) => {
    e.preventDefault()
    setAddingExpenses(true)
    try {
      dispatch(
        postExpenses({ employeeId, salesTeamId, expenseName, expenseAmount }),
      )
      setExpenseName('')
      setExpenseAmount(0)
      
      setAddingExpenses(false)
    } catch (error) {
      setAddingExpenses(false)
    }
    
  }

  useEffect(() => {
    dispatch(fetchMyProfile())
    dispatch(fetchSalesTeamData())
    dispatch(fetchTeamExpenses({ salesTeamId }))
  }, [dispatch, salesTeamId])

  

  useEffect(() => {
    // Filter sales data by date range
    const filtered = allSalesData.filter((sale) => {
      const saleDate = new Date(sale.timestamp).toISOString().split("T")[0]
      return saleDate >= startDate && saleDate <= endDate
    })
    setFilteredSales(filtered)
  }, [allSalesData, startDate, endDate])

  useEffect(() => {
    // Filter sales data by date range
    const filteredExpenses = expense.filter((expe) => {
      const expeDate = new Date(expe.date).toISOString().split("T")[0]
      return expeDate >= startDate && expeDate <= endDate
    })
    setFilteredExpenses(filteredExpenses)
  }, [expense, startDate, endDate])

  const totalSalesAmount = filteredSales.reduce((total, sale) => {
    const cash = Number(sale.amount_sold_for) || 0
    const mpesa = Number(sale.mpesaAmount) || 0
    return total + cash + mpesa
  }, 0)

  const totalAmounts = filteredSales.reduce(
    (totals, sale) => {
      const cash = Number(sale.amount_sold_for) || 0
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

  const totalExpenses = filteredExpenses.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  // console.log("filtered sales data", filteredSales)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
        <Link to="/sales">
          <h1 className="text-3xl font-bold">
            {myProfile?.sales_team?.name || "Sales Team"}
          </h1>
          <p className="mt-1 text-sm">Track your team's sales performance.</p>
        </Link>
        <Link to="/myprofile" className="flex items-center space-y-2 flex-col">
          <img
            src={myProfile?.profile_image || defaultProfile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <span className="text-white text-sm">
            {myProfile?.first_name} {myProfile?.last_name}
          </span>
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-md p-4 flex flex-col space-y-2 items-center  md:flex md:justify-between">
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
                Salesperson: {sale.sales_person.first_name}{" "}
                {sale.sales_person.last_name}
              </h3>

              {/* Customer */}
              <p className="mt-2 text-gray-700">
                <strong>Customer:</strong> {sale.customer?.name} (
                {sale.customer?.sales})
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Customer Phone:</strong> +254 {sale.customer?.phone}
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

              {/* Total Amount */}
              <p className="mt-4 text-gray-900 font-bold">
                Total Amount: <FormattedAmount amount={sale.amount_sold_for} />
              </p>
              {sale?.admin_payment_verified ? (
                <div>
                  <p className=" text-green-900 text-xl">payment verified.</p>
                </div>
              ) : (
                <div>
                  <p className=" text-red-900 text-xl">payment not verified.</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex justify-between items-center">
                <p className="mt-2 text-sm text-gray-500">
                Sold on: {new Date(sale.timestamp).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <button className="bg-red-500 px-2 rounded-md text-white">Delete</button>
                <Link to={`/salesrecordedit/${sale.id}`}>
              <button className="bg-blue-500 text-white px-2  rounded-md ">Edit</button>
              </Link>
              </div>
              
              
              </div>
              

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
        <div className="px-2">
          <h2 className="text-lg font-semibold">
            Expected total cash:{" "}
            <FormattedAmount amount={totalSalesAmount - totalExpenses} />
          </h2>

          <div className="bg-gray-500 my-2 p-2">
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
                          {/* <th className="border px-4 py-2">Date</th> */}
                        </tr>
                      </thead>
                      <tbody className="text-white font-bold text-lg">
                        {filteredExpenses.map((expense) => (
                          <tr key={expense.id}>
                            <td className="border px-4 py-2">
                              {expense.name ?? "N/A"}
                            </td>
                            <td className="border px-4 py-2">
                              {expense.amount ?? "N/A"}
                            </td>
                            {/* <td className="border px-4 py-2">
                              <DateDisplay date={expense.date} />
                            </td> */}
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
            ) : (
              ""
            )}

            <form className=" my-2 p-2">
              <div className="flex flex-col space-y-2">
                <div>
                  <label className=" font-semibold">Expense</label>
                  <input
                    className="font-semibold px-2 py-0.5 outline-none border border-green-950"
                    type="text"
                    required
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                  />
                </div>
                <div>
                  <label className=" font-semibold">Amount</label>
                  <input
                    required
                    className="font-semibold px-2 py-0.5 outline-none border border-green-950"
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className=" flex justify-center">
                <button
                  onClick={handleAddExpenses}
                  disabled={addingExpenses}
                  className="bg-blue-900 px-2 mt-2 text-white rounded-md"
                >
                  {addingExpenses ? <CircularProgress size={20} /> : "submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}

      <AdminsFooter />
    </div>
  )
}

export default TeamSalesPage
