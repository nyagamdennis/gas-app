import React, { useEffect, useState } from "react"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import Button from "@mui/material/Button"
import { useMediaQuery, useTheme } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import {
  addNewExpense,
  deleteExpense,
  fetchCompanyExpenses,
  selectAllCompanyExpenses,
  updateCompanyExpense,
} from "../features/expenses/companyExpensesSlice"
import DateDisplay from "../components/DateDisplay"
import { CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/ui/mobile/admin/Navbar"

const Expenses = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const dispatch = useAppDispatch()

  const all_expenses = useAppSelector(selectAllCompanyExpenses)
  const [expenseName, setExpenseName] = useState("")
  const [expenseAmount, setExpenseAmount] = useState(0)
  const [addingExpense, setAddingExpense] = useState(false)
  const [updateExpenseId, setUpdateExpenseId] = useState("")
  const [updateExpenseName, setUpdateExpenseName] = useState("")
  const [updateExpenseAmount, setUpdateExpenseAmount] = useState(0)
  const [deleteData, setDeleteData] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [addingUpdate, setAddingUpdate] = useState(false)

  useEffect(() => {
    dispatch(fetchCompanyExpenses())
  }, [dispatch])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }

  const handleClickDeleteOpen = (expenseId: string, expenseNames: string) => {
    setDeleteData(expenseNames)
    setDeleteId(expenseId)
    setOpenDelete(true)
  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  }

  const handleClickUpdateOpen = (
    expenseId: string,
    expenseNames: string,
    expenseAmount: number,
  ) => {
    setUpdateExpenseName(expenseNames)
    setUpdateExpenseId(expenseId)
    setUpdateExpenseAmount(expenseAmount)
    console.log("expence name and id is ", expenseId, expenseNames)
    setOpenUpdate(true)
  }

  const handleAddExpense = async (e: any) => {
    e.preventDefault()
    const formData = {
      expense_name: expenseName,
      amount: expenseAmount,
    }
    setAddingExpense(true)
    try {
      await dispatch(addNewExpense({ formData }))
      setAddingExpense(false)
      setExpenseName("")
      setExpenseAmount(0)
      setOpen(false)
    } catch (error: any) {
      alert(error.message)
      setAddingExpense(false)
    }
  }

  const handleEdit = async (e: any) => {
    e.preventDefault()
    setAddingUpdate(true)
    const formData = {
      expense_name: updateExpenseName,
      amount: updateExpenseAmount,
    }
    try {
      await dispatch(
        updateCompanyExpense({ expenseId: updateExpenseId, formData }),
      )
      setAddingUpdate(false)
      setUpdateExpenseAmount(0)
      setUpdateExpenseName("")
      setUpdateExpenseId("")
      setOpenUpdate(false)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteExpense(deleteId))
      setDeleteId("")
      setDeleteData("")
      setIsDeleting(false)
      setOpenDelete(false)
    } catch (error: any) {
      setIsDeleting(false)
      alert(error.message)
    }
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            <div className="bg-white shadow p-4 flex space-x-1 justify-end items-center border-b border-gray-200">
              {/* <h2 className="text-xl font-semibold text-gray-800"></h2> */}
              <button
                onClick={handleClickOpen}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
              >
                + Add Expense
              </button>
              <button
                onClick={handleClickOpen}
                className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2 rounded"
              >
                + Fuel Expense
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-2 py-2 text-left">Name</th>
                    <th className="px-2 py-2 text-left">Amount</th>
                    <th className="px-2 py-2 text-left">Date</th>
                    <th className="px-2 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {all_expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2">{expense.expense_name}</td>
                      <td className="px-2 py-2">
                        KES {expense.amount.toLocaleString()}
                      </td>
                      <td className="px-2 py-2">
                        <DateDisplay date={expense.date} />{" "}
                      </td>
                      <td className="px-2 py-2 space-x-2">
                        <button
                          onClick={() =>
                            handleClickUpdateOpen(
                              expense.id,
                              expense.expense_name,
                              expense.amount,
                            )
                          }
                          className="text-yellow-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleClickDeleteOpen(
                              expense.id,
                              expense.expense_name,
                            )
                          }
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {all_expenses.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        No expenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Add new expense"}
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label
                    htmlFor="expenseName"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Expense Name
                  </label>
                  <input
                    type="text"
                    id="expenseName"
                    name="expenseName"
                    value={expenseName}
                    onChange={(e: any) => setExpenseName(e.target.value)}
                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter expense name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={expenseAmount}
                    onChange={(e: any) => setExpenseAmount(e.target.value)}
                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 border border-neutral-300 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingExpense}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
                  >
                    {addingExpense ? <CircularProgress size={20} /> : "Save"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* ---------------update dialogue---------------- */}
          <Dialog
            open={openUpdate}
            onClose={handleCloseUpdate}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Add new expense"}
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label
                    htmlFor="expenseName"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Expense Name
                  </label>
                  <input
                    type="text"
                    id="expenseName"
                    name="expenseName"
                    value={updateExpenseName}
                    onChange={(e: any) => setUpdateExpenseName(e.target.value)}
                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter expense name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={updateExpenseAmount}
                    onChange={(e: any) =>
                      setUpdateExpenseAmount(e.target.value)
                    }
                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseUpdate}
                    className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 border border-neutral-300 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingUpdate}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
                  >
                    {addingUpdate ? <CircularProgress size={20} /> : "Update"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* ---------------update dialogue---------------- */}

          {/* ------------------------- */}
          <Dialog
            open={openDelete}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Are you sure you want to delete ${deleteData}?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action will delete {deleteData} permanently.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClose}>Cancel</Button>
              <Button onClick={handleDelete} autoFocus>
                {isDeleting ? <CircularProgress size={20} /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
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

    // <div className="flex flex-col min-h-screen bg-gray-50">
    //   <AdminNav
    //     headerMessage="Expense Records"
    //     headerText="Manage your expenses"
    //   />

    //   <main className="flex-grow p-6 overflow-x-auto">

    //   </main>

    //   <AdminsFooter />
    // </div>
  )
}

export default Expenses
