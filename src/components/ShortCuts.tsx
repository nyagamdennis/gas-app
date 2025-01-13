/* eslint-disable prettier/prettier */
import HailIcon from "@mui/icons-material/Hail"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchCustomers, selectAllCustomers } from "../features/customers/customerSlice"
import { fetchDebtors, selectAllDebtors } from "../features/debtors/debtorsSlice"
import { useEffect } from "react"
import { Link } from "react-router-dom"

const ShortCuts = () => {
  const customers = useAppSelector(selectAllCustomers)
  const debtors = useAppSelector(selectAllDebtors)

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDebtors())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])
  const retail_customers = customers.filter(
    (retails) => retails.sales === "RETAIL",
  )
  const wholesale_customers = customers.filter(
    (retails) => retails.sales === "WHOLESALE",
  )
  console.log("This is a retail client", retail_customers)

  const overdueDebtors = debtors.filter((debtor) => {
    const currentDate = new Date();
    // @ts-ignore
    const expectedDate = new Date(debtor.expected_date_to_repay);
    return expectedDate <= currentDate;
  });

//   const formattedDates =
//     customer &&
//     customer.customer_debt.map((debt) => {
//       const debtDate = new Date(debt.expected_date_to_repay)
//       const formattedDate = debtDate.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//       return {
//         formattedDate,
//         isPastDue: debtDate < new Date(),
//       }
//     })

  return (
    <div className=" mx-3 grid grid-cols-5 gap-4">
      <div className="flex items-center bg-slate-600  shadow-md rounded-md justify-around py-4 cursor-pointer">
        <div className=" flex flex-col items-center">
          <h6 className=" text-lg font-bold">{customers.length}</h6>
          <p className=" text-gray-400 text-xl">Total Customers</p>
        </div>
        <div className=" bg-blue-500 text-lg p-2 rounded-full">
          <HailIcon />
        </div>
      </div>

      <div className="flex items-center bg-slate-600  shadow-md rounded-md justify-around py-4 cursor-pointer">
        <div className=" flex flex-col items-center">
          <h6>{wholesale_customers.length}</h6>
          <p>WholeSale Customers</p>
        </div>
        <div className=" bg-slate-400 p-2 rounded-full">
          <HailIcon />
        </div>
      </div>
      <div className="flex items-center bg-slate-600  shadow-md rounded-md justify-around py-4 cursor-pointer">
        <div className=" flex flex-col items-center">
          <h6>{retail_customers.length}</h6>
          <p>Total Retail Customers</p>
        </div>
        <div className=" bg-slate-400 p-2 rounded-full">
          <HailIcon />
        </div>
      </div>
      <Link to='/debtors'>
        <div className="flex items-center bg-slate-600  shadow-md rounded-md justify-around py-4 cursor-pointer">
          <div className=" flex flex-col items-center">
            <h6>{debtors.length}</h6>
            <p>Total Customers in Debt</p>
          </div>
          <div className=" bg-slate-400 p-2 rounded-full">
            <HailIcon />
          </div>
        </div>
      </Link>
      <Link to='/overduedebtors'>
      <div className="flex items-center bg-slate-600  shadow-md rounded-md justify-around py-4 cursor-pointer">
        <div className=" flex flex-col items-center">
          <h6>{overdueDebtors.length}</h6>
          <p>Total Overdue Debtors</p>
        </div>
        <div className=" bg-slate-400 p-2 rounded-full">
          <HailIcon />
        </div>
      </div>
      </Link>
      
    </div>
  )
}

export default ShortCuts
