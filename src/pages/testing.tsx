// @ts-nocheck
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

import DateDisplay from "../components/DateDisplay"
import {
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Paper,
  Grid,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Fab,
  Collapse,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  Switch,
  FormGroup,
  FormLabel,
  Slider,
  Autocomplete,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/ui/mobile/admin/Navbar"
import {
  Add,
  Edit,
  Delete,
  Receipt,
  LocalGasStation,
  Business,
  Person,
  Payment,
  Warning,
  CheckCircle,
  Pending,
  AccessTime,
  TrendingUp,
  AttachMoney,
  FilterList,
  Download,
  Category,
  Storefront,
  DirectionsCar,
  TwoWheeler,
  ArrowForward,
  ExpandMore,
  Close,
  Search,
  Sort,
  DateRange,
  ArrowUpward,
  ArrowDownward,
  CloudUpload,
  AttachFile,
  PersonAdd,
  MoneyOff,
  Money,
  AccountBalance,
  Assignment,
  ReceiptLong,
  Print,
  Share,
  Email,
  Phone,
  AccountCircle,
  MoreVert,
  Visibility,
  FileDownload,
  CreditCard,
  Savings,
} from "@mui/icons-material"
import {
  createExpense,
  deleteExpense,
  fetchExpenseCategories,
  fetchExpenses,
  fetchExpenseSubCategories,
  fetchExpenseSummary,
  selectAllExpenses,
  selectExpenseCategories,
  selectExpenseSubCategories,
  selectExpenseSummary,
  updateExpense,
  approveExpense,
  rejectExpense,
  markExpenseAsPaid,
  attachExpenseToEmployee,
  fetchEmployeesForExpense,
  selectAllEmployees,
} from "../features/expenses/expensesSlice"

const Expenses = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openApprove, setOpenApprove] = useState(false)
  const [openReject, setOpenReject] = useState(false)
  const [openAttachToEmployee, setOpenAttachToEmployee] = useState(false)
  const [openMarkPaid, setOpenMarkPaid] = useState(false)
  const dispatch = useAppDispatch()

  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Form states
  const [expenseData, setExpenseData] = useState({
    title: "",
    expense_type: "SHOP",
    category: "",
    subcategory: "",
    description: "",
    amount: "",
    tax_amount: "0",
    payment_method: "CASH",
    payment_reference: "",
    location: "",
    vehicle: "",
    motorbike: "",
    expense_date: new Date().toISOString().split("T")[0],
    receipt_number: "",
    notes: "",
  })

  const [updateExpenseData, setUpdateExpenseData] = useState({
    id: "",
    title: "",
    category: "",
    subcategory: "",
    description: "",
    amount: "",
    tax_amount: "0",
    payment_method: "CASH",
    payment_reference: "",
  })

  const [deleteData, setDeleteData] = useState({
    id: "",
    title: "",
  })

  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Employee attachment state
  const [attachEmployeeData, setAttachEmployeeData] = useState({
    expenseId: "",
    employeeId: "",
    deductionAmount: "",
    description: "",
  })

  const [loading, setLoading] = useState({
    add: false,
    update: false,
    delete: false,
    categories: false,
    summary: false,
    approve: false,
    reject: false,
    markPaid: false,
    attachEmployee: false,
    fetchEmployees: false,
  })

  const [filter, setFilter] = useState({
    expense_type: "ALL",
    category: "",
    status: "ALL",
    start_date: "",
    end_date: "",
    has_employee_attachment: "ALL", // 'ALL', 'YES', 'NO'
  })

  // updated code start
  const expenses = useAppSelector(selectAllExpenses)
  const categories = useAppSelector(selectExpenseCategories)
  const subcategories = useAppSelector(selectExpenseSubCategories)
  const summary = useAppSelector(selectExpenseSummary)
  const employees = useAppSelector(selectAllEmployees)

  console.log("category sub expenses are ", categories)

  useEffect(() => {
    dispatch(fetchExpenses())
    dispatch(fetchExpenseCategories())
    dispatch(fetchExpenseSummary())
    dispatch(fetchEmployeesForExpense()) // Fetch employees
  }, [dispatch])

  useEffect(() => {
    if (expenseData.category) {
      dispatch(fetchExpenseSubCategories(parseInt(expenseData.category)))
    }
  }, [expenseData.category, dispatch])

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading({ ...loading, add: true })

    try {
      const formData = new FormData()

      // Add all form data
      Object.entries(expenseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString())
        }
      })

      // Add company ID (you might need to get this from user context)
      formData.append("company", "1") // Replace with actual company ID

      await dispatch(createExpense(formData))
      setLoading({ ...loading, add: false })
      handleClose()
      dispatch(fetchExpenseSummary()) // Refresh summary
      dispatch(fetchExpenses()) // Refresh expenses list
    } catch (error: any) {
      alert(error.message || "Failed to create expense")
      setLoading({ ...loading, add: false })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading({ ...loading, update: true })

    try {
      const expenseId = parseInt(updateExpenseData.id)
      await dispatch(
        updateExpense({
          id: expenseId,
          expenseData: updateExpenseData,
        }),
      )
      setLoading({ ...loading, update: false })
      handleCloseUpdate()
      dispatch(fetchExpenseSummary()) // Refresh summary
      dispatch(fetchExpenses()) // Refresh expenses list
    } catch (error: any) {
      alert(error.message || "Failed to update expense")
      setLoading({ ...loading, update: false })
    }
  }

  const handleDelete = async () => {
    setLoading({ ...loading, delete: true })

    try {
      const expenseId = parseInt(deleteData.id)
      await dispatch(deleteExpense(expenseId))
      setLoading({ ...loading, delete: false })
      handleDeleteClose()
      dispatch(fetchExpenseSummary()) // Refresh summary
      dispatch(fetchExpenses()) // Refresh expenses list
    } catch (error: any) {
      setLoading({ ...loading, delete: false })
      alert(error.message || "Failed to delete expense")
    }
  }

  // New functions for admin actions
  const handleApproveExpense = async (expenseId: number) => {
    setLoading({ ...loading, approve: true })
    try {
      await dispatch(approveExpense(expenseId))
      setLoading({ ...loading, approve: false })
      setOpenApprove(false)
      dispatch(fetchExpenses())
    } catch (error: any) {
      alert(error.message || "Failed to approve expense")
      setLoading({ ...loading, approve: false })
    }
  }

  const handleRejectExpense = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }

    setLoading({ ...loading, reject: true })
    try {
      await dispatch(
        rejectExpense({
          id: selectedExpense.id,
          rejection_reason: rejectionReason,
        }),
      )
      setLoading({ ...loading, reject: false })
      setOpenReject(false)
      setRejectionReason("")
      dispatch(fetchExpenses())
    } catch (error: any) {
      alert(error.message || "Failed to reject expense")
      setLoading({ ...loading, reject: false })
    }
  }

  const handleMarkAsPaid = async (expenseId: number) => {
    setLoading({ ...loading, markPaid: true })
    try {
      await dispatch(markExpenseAsPaid(expenseId))
      setLoading({ ...loading, markPaid: false })
      setOpenMarkPaid(false)
      dispatch(fetchExpenses())
    } catch (error: any) {
      alert(error.message || "Failed to mark expense as paid")
      setLoading({ ...loading, markPaid: false })
    }
  }

  const handleAttachToEmployee = async () => {
    if (!attachEmployeeData.employeeId || !attachEmployeeData.deductionAmount) {
      alert("Please select an employee and enter deduction amount")
      return
    }

    setLoading({ ...loading, attachEmployee: true })
    try {
      await dispatch(
        attachExpenseToEmployee({
          expenseId: parseInt(attachEmployeeData.expenseId),
          employeeId: parseInt(attachEmployeeData.employeeId),
          deductionAmount: parseFloat(attachEmployeeData.deductionAmount),
        }),
      )
      setLoading({ ...loading, attachEmployee: false })
      setOpenAttachToEmployee(false)
      setAttachEmployeeData({
        expenseId: "",
        employeeId: "",
        deductionAmount: "",
        description: "",
      })
      dispatch(fetchExpenses())
    } catch (error: any) {
      alert(error.message || "Failed to attach expense to employee")
      setLoading({ ...loading, attachEmployee: false })
    }
  }

  const handleClickApproveOpen = (expense: any) => {
    setSelectedExpense(expense)
    setOpenApprove(true)
  }

  const handleClickRejectOpen = (expense: any) => {
    setSelectedExpense(expense)
    setOpenReject(true)
  }

  const handleClickMarkPaidOpen = (expense: any) => {
    setSelectedExpense(expense)
    setOpenMarkPaid(true)
  }

  const handleClickAttachToEmployeeOpen = (expense: any) => {
    setAttachEmployeeData({
      ...attachEmployeeData,
      expenseId: expense.id.toString(),
    })
    setOpenAttachToEmployee(true)
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      search === "" ||
      expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.description?.toLowerCase().includes(search.toLowerCase()) ||
      expense.receipt_number?.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      filter.expense_type === "ALL" ||
      expense.expense_type === filter.expense_type
    const matchesCategory =
      filter.category === "" ||
      expense.category.id.toString() === filter.category
    const matchesStatus =
      filter.status === "ALL" || expense.status === filter.status

    // Check for employee attachment (you'll need to add this field to your Expense interface)
    const hasEmployeeAttachment =
      expense.employee_attachments && expense.employee_attachments.length > 0
    const matchesEmployeeAttachment =
      filter.has_employee_attachment === "ALL" ||
      (filter.has_employee_attachment === "YES" && hasEmployeeAttachment) ||
      (filter.has_employee_attachment === "NO" && !hasEmployeeAttachment)

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesStatus &&
      matchesEmployeeAttachment
    )
  })

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.total_amount),
    0,
  )

  const handleQuickFuel = () => {
    const fuelCategory = categories.find((c) => c.code === "FUEL")
    if (fuelCategory) {
      setExpenseData({
        ...expenseData,
        expense_type: "VEHICLE",
        title: "Fuel Expense",
        category: fuelCategory.id.toString(),
      })
      handleClickOpen()
    } else {
      alert("Fuel category not found. Please ensure categories are loaded.")
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setExpenseData({
      title: "",
      expense_type: "SHOP",
      category: "",
      subcategory: "",
      description: "",
      amount: "",
      tax_amount: "0",
      payment_method: "CASH",
      payment_reference: "",
      location: "",
      vehicle: "",
      motorbike: "",
      expense_date: new Date().toISOString().split("T")[0],
      receipt_number: "",
      notes: "",
    })
  }

  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }

  const handleClickDeleteOpen = (expenseId: string, expenseTitle: string) => {
    setDeleteData({
      id: expenseId,
      title: expenseTitle,
    })
    setOpenDelete(true)
  }

  const handleDeleteClose = () => {
    setOpenDelete(false)
  }

  const handleClickUpdateOpen = (expense: any) => {
    setUpdateExpenseData({
      id: expense.id,
      title: expense.title,
      category: expense.category?.id || "",
      subcategory: expense.subcategory?.id || "",
      description: expense.description || "",
      amount: expense.amount,
      tax_amount: expense.tax_amount || "0",
      payment_method: expense.payment_method || "CASH",
      payment_reference: expense.payment_reference || "",
    })
    setOpenUpdate(true)
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setExpenseData({
      ...expenseData,
      [name]: value,
    })
  }

  const handleUpdateInputChange = (e: any) => {
    const { name, value } = e.target
    setUpdateExpenseData({
      ...updateExpenseData,
      [name]: value,
    })
  }

  const handleAttachEmployeeInputChange = (e: any) => {
    const { name, value } = e.target
    setAttachEmployeeData({
      ...attachEmployeeData,
      [name]: value,
    })
  }

  const getExpenseTypeIcon = (type: string) => {
    switch (type) {
      case "VEHICLE":
        return <DirectionsCar sx={{ fontSize: 16 }} />
      case "MOTORBIKE":
        return <TwoWheeler sx={{ fontSize: 16 }} />
      case "SHOP":
        return <Storefront sx={{ fontSize: 16 }} />
      case "OFFICE":
        return <Business sx={{ fontSize: 16 }} />
      case "STAFF":
        return <Person sx={{ fontSize: 16 }} />
      default:
        return <Receipt sx={{ fontSize: 16 }} />
    }
  }

  const getExpenseTypeColor = (type: string) => {
    switch (type) {
      case "VEHICLE":
        return "primary"
      case "MOTORBIKE":
        return "secondary"
      case "SHOP":
        return "success"
      case "OFFICE":
        return "warning"
      case "STAFF":
        return "info"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
      case "PENDING":
        return <Pending sx={{ fontSize: 16, color: "warning.main" }} />
      case "REJECTED":
        return <Warning sx={{ fontSize: 16, color: "error.main" }} />
      case "PAID":
        return <Payment sx={{ fontSize: 16, color: "info.main" }} />
      default:
        return <AccessTime sx={{ fontSize: 16 }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success"
      case "PENDING":
        return "warning"
      case "REJECTED":
        return "error"
      case "PAID":
        return "info"
      default:
        return "default"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "MPESA":
        return <AttachMoney sx={{ fontSize: 16 }} />
      case "BANK_TRANSFER":
        return <Payment sx={{ fontSize: 16 }} />
      default:
        return <Receipt sx={{ fontSize: 16 }} />
    }
  }

  // Check if expense has employee attachments
  const hasEmployeeAttachment = (expense: any) => {
    return (
      expense.employee_attachments && expense.employee_attachments.length > 0
    )
  }

  // Render employee attachments badge
  const renderEmployeeAttachmentBadge = (expense: any) => {
    if (hasEmployeeAttachment(expense)) {
      const count = expense.employee_attachments.length
      return (
        <Tooltip
          title={`Attached to ${count} employee(s) for salary deduction`}
        >
          <Badge badgeContent={count} color="secondary" sx={{ ml: 1 }}>
            <PersonAdd fontSize="small" />
          </Badge>
        </Tooltip>
      )
    }
    return null
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Expense Management"}
            headerText={"Track and manage all company expenses"}
          />

          <main className="flex-grow m-2 p-1">
            {/* Stats Overview */}
            {summary && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <AttachMoney
                        sx={{ color: "primary.main", fontSize: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      KSh{" "}
                      {summary.summary.total_amount?.toLocaleString() || "0"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Receipt sx={{ color: "success.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Count
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "success.main" }}
                    >
                      {summary.summary.count || 0}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <TrendingUp
                        sx={{ color: "warning.main", fontSize: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Avg/Expense
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "warning.main" }}
                    >
                      KSh{" "}
                      {summary.summary.average_amount
                        ? Math.round(
                            summary.summary.average_amount,
                          ).toLocaleString()
                        : "0"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Warning sx={{ color: "error.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "error.main" }}
                    >
                      {summary.summary.pending_count || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Search and Filter Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: showAdvancedFilters ? 2 : 0,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search expenses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Search
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <IconButton
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  sx={{
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 2,
                  }}
                >
                  <FilterList />
                </IconButton>
              </Box>

              <Collapse in={showAdvancedFilters}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={filter.expense_type}
                        label="Type"
                        onChange={(e) =>
                          setFilter({ ...filter, expense_type: e.target.value })
                        }
                      >
                        <MenuItem value="ALL">All Types</MenuItem>
                        <MenuItem value="VEHICLE">Vehicle</MenuItem>
                        <MenuItem value="MOTORBIKE">Motorbike</MenuItem>
                        <MenuItem value="SHOP">Shop</MenuItem>
                        <MenuItem value="OFFICE">Office</MenuItem>
                        <MenuItem value="STAFF">Staff</MenuItem>
                        <MenuItem value="UTILITY">Utility</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={filter.category}
                        label="Category"
                        onChange={(e) =>
                          setFilter({ ...filter, category: e.target.value })
                        }
                      >
                        <MenuItem value="">All Categories</MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filter.status}
                        label="Status"
                        onChange={(e) =>
                          setFilter({ ...filter, status: e.target.value })
                        }
                      >
                        <MenuItem value="ALL">All Status</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                        <MenuItem value="PAID">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Employee Attached</InputLabel>
                      <Select
                        value={filter.has_employee_attachment}
                        label="Employee Attached"
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            has_employee_attachment: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="ALL">All</MenuItem>
                        <MenuItem value="YES">Yes</MenuItem>
                        <MenuItem value="NO">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() =>
                          setFilter({
                            expense_type: "ALL",
                            category: "",
                            status: "ALL",
                            start_date: "",
                            end_date: "",
                            has_employee_attachment: "ALL",
                          })
                        }
                      >
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Collapse>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleClickOpen}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Add Expense
              </Button>

              <Button
                variant="outlined"
                startIcon={<LocalGasStation />}
                onClick={handleQuickFuel}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Quick Fuel
              </Button>

              <Button
                variant="outlined"
                startIcon={<Storefront />}
                onClick={() => {
                  setExpenseData({
                    ...expenseData,
                    expense_type: "SHOP",
                    title: "Shop Maintenance",
                  })
                  handleClickOpen()
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Shop Expense
              </Button>

              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {
                  /* Add export functionality */
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Export
              </Button>
            </Box>

            {/* Expenses Table */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Expenses
                  {filteredExpenses.length > 0 && (
                    <Chip
                      label={`${
                        filteredExpenses.length
                      } expenses · KSh ${totalExpenses.toLocaleString()}`}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Typography>
              </Box>

              {filteredExpenses.length === 0 ? (
                <Box sx={{ p: 6, textAlign: "center" }}>
                  <Receipt sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No expenses found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {search
                      ? "Try adjusting your search criteria"
                      : "Add your first expense to get started"}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleClickOpen}
                  >
                    Add Expense
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow
                          key={expense.id}
                          hover
                          sx={{
                            "&:last-child td": { border: 0 },
                            transition: "background-color 0.2s",
                            bgcolor:
                              expense.status === "PENDING"
                                ? "action.hover"
                                : "inherit",
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2">
                              <DateDisplay date={expense.expense_date} />
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {expense.title}
                              </Typography>
                              {renderEmployeeAttachmentBadge(expense)}
                              {expense.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block", mt: 0.5 }}
                                >
                                  {expense.description.substring(0, 50)}...
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {getExpenseTypeIcon(expense.expense_type)}
                              <Chip
                                label={expense.expense_type}
                                size="small"
                                color={
                                  getExpenseTypeColor(
                                    expense.expense_type,
                                  ) as any
                                }
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "success.main" }}
                            >
                              KSh{" "}
                              {parseFloat(
                                expense.total_amount,
                              ).toLocaleString()}
                            </Typography>
                            {parseFloat(expense.tax_amount) > 0 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                (Tax: KSh{" "}
                                {parseFloat(
                                  expense.tax_amount,
                                ).toLocaleString()}
                                )
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {getStatusIcon(expense.status)}
                              <Chip
                                label={expense.status}
                                size="small"
                                color={getStatusColor(expense.status) as any}
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleClickUpdateOpen(expense)}
                                  sx={{ color: "primary.main" }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {expense.status === "PENDING" && (
                                <>
                                  <Tooltip title="Approve">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleClickApproveOpen(expense)
                                      }
                                      sx={{ color: "success.main" }}
                                    >
                                      <CheckCircle fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleClickRejectOpen(expense)
                                      }
                                      sx={{ color: "error.main" }}
                                    >
                                      <Warning fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}

                              {expense.status === "APPROVED" && (
                                <Tooltip title="Mark as Paid">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleClickMarkPaidOpen(expense)
                                    }
                                    sx={{ color: "info.main" }}
                                  >
                                    <Payment fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="Attach to Employee">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleClickAttachToEmployeeOpen(expense)
                                  }
                                  sx={{ color: "secondary.main" }}
                                >
                                  <PersonAdd fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleClickDeleteOpen(
                                      expense.id.toString(),
                                      expense.title,
                                    )
                                  }
                                  sx={{ color: "error.main" }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </main>

          {/* Add Expense Dialog - Keep existing */}
          {/* Update Expense Dialog - Keep existing */}
          {/* Delete Confirmation Dialog - Keep existing */}

          {/* Approve Expense Dialog */}
          <Dialog
            open={openApprove}
            onClose={() => setOpenApprove(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600, color: "success.main" }}>
              <CheckCircle sx={{ mr: 1, verticalAlign: "middle" }} />
              Approve Expense
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to approve the expense:{" "}
                <strong>{selectedExpense?.title}</strong>?
              </DialogContentText>
              <Box
                sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "success.contrastText" }}
                >
                  Amount: KSh{" "}
                  {selectedExpense
                    ? parseFloat(selectedExpense.total_amount).toLocaleString()
                    : "0"}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => setOpenApprove(false)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApproveExpense(selectedExpense?.id)}
                variant="contained"
                color="success"
                disabled={loading.approve}
                sx={{ borderRadius: 2 }}
              >
                {loading.approve ? <CircularProgress size={24} /> : "Approve"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Reject Expense Dialog */}
          <Dialog
            open={openReject}
            onClose={() => setOpenReject(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600, color: "error.main" }}>
              <Warning sx={{ mr: 1, verticalAlign: "middle" }} />
              Reject Expense
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to reject the expense:{" "}
                <strong>{selectedExpense?.title}</strong>?
              </DialogContentText>
              <TextField
                fullWidth
                label="Rejection Reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                multiline
                rows={3}
                sx={{ mt: 2 }}
                required
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => {
                  setOpenReject(false)
                  setRejectionReason("")
                }}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectExpense}
                variant="contained"
                color="error"
                disabled={loading.reject || !rejectionReason.trim()}
                sx={{ borderRadius: 2 }}
              >
                {loading.reject ? <CircularProgress size={24} /> : "Reject"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Mark as Paid Dialog */}
          <Dialog
            open={openMarkPaid}
            onClose={() => setOpenMarkPaid(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600, color: "info.main" }}>
              <Payment sx={{ mr: 1, verticalAlign: "middle" }} />
              Mark as Paid
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to mark the expense as paid:{" "}
                <strong>{selectedExpense?.title}</strong>?
              </DialogContentText>
              <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: "info.contrastText" }}>
                  Amount: KSh{" "}
                  {selectedExpense
                    ? parseFloat(selectedExpense.total_amount).toLocaleString()
                    : "0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "info.contrastText", mt: 1 }}
                >
                  Payment Method: {selectedExpense?.payment_method}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => setOpenMarkPaid(false)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleMarkAsPaid(selectedExpense?.id)}
                variant="contained"
                color="info"
                disabled={loading.markPaid}
                sx={{ borderRadius: 2 }}
              >
                {loading.markPaid ? (
                  <CircularProgress size={24} />
                ) : (
                  "Mark as Paid"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Attach to Employee Dialog */}
          <Dialog
            open={openAttachToEmployee}
            onClose={() => setOpenAttachToEmployee(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600, color: "secondary.main" }}>
              <PersonAdd sx={{ mr: 1, verticalAlign: "middle" }} />
              Attach Expense to Employee
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Attach this expense to an employee for salary deduction.
              </DialogContentText>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Employee</InputLabel>
                <Select
                  name="employeeId"
                  value={attachEmployeeData.employeeId}
                  label="Select Employee"
                  onChange={handleAttachEmployeeInputChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select an employee</em>
                  </MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} -{" "}
                      {employee.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Deduction Amount (KSh)"
                name="deductionAmount"
                type="number"
                value={attachEmployeeData.deductionAmount}
                onChange={handleAttachEmployeeInputChange}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={attachEmployeeData.description}
                onChange={handleAttachEmployeeInputChange}
                multiline
                rows={2}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => setOpenAttachToEmployee(false)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAttachToEmployee}
                variant="contained"
                color="secondary"
                disabled={loading.attachEmployee}
                sx={{ borderRadius: 2 }}
              >
                {loading.attachEmployee ? (
                  <CircularProgress size={24} />
                ) : (
                  "Attach"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          <footer>
            <AdminsFooter />
          </footer>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              zIndex: 1000,
              boxShadow: "0 8px 20px rgba(25, 118, 210, 0.3)",
            }}
            onClick={handleClickOpen}
          >
            <Add />
          </Fab>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default Expenses
