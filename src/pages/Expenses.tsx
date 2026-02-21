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
import { styled } from "@mui/material/styles"

import DateDisplay from "../components/DateDisplay"
import {
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Grid,
  Box,
  Typography,
  IconButton,
  Collapse,
  Fade,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Fab,
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
  Category,
  Storefront,
  DirectionsCar,
  TwoWheeler,
  Close,
  Search,
  PersonAdd,
  MoreVert,
  CalendarToday,
} from "@mui/icons-material"
import {
  approveExpense,
  attachExpenseToEmployee,
  createExpense,
  deleteExpense,
  fetchExpenseCategories,
  fetchExpenses,
  fetchExpenseSubCategories,
  fetchExpenseSummary,
  markExpenseAsPaid,
  rejectExpense,
  selectAllExpenses,
  selectExpenseCategories,
  selectExpenseSubCategories,
  selectExpenseSummary,
  updateExpense,
} from "../features/expenses/expensesSlice"
import Badge from "@mui/material/Badge"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice"
import planStatus from "../features/planStatus/planStatus"

// Styled components for mobile optimization
const MobileContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "100vw",
  overflowX: "hidden",
  position: "relative",
}))

const ContentWrapper = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: "12px",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  overflowX: "hidden",
}))

const StatsGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  marginBottom: "16px",
  width: "100%",
}))

const StatCard = styled(Paper)(({ theme }) => ({
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  width: "100%",
  boxSizing: "border-box",
}))

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: "12px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  width: "100%",
  boxSizing: "border-box",
}))

const ActionButtonsRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
  flexWrap: "wrap",
  width: "100%",
}))

const ExpenseCard = styled(Card)(({ theme }) => ({
  marginBottom: "8px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "none",
  width: "100%",
  boxSizing: "border-box",
}))

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: "2px",
}))

const Expenses = () => {
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
  const [openActions, setOpenActions] = useState(null)
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")

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

  // Employee attachment state
  const [attachEmployeeData, setAttachEmployeeData] = useState({
    expenseId: "",
    employeeId: "",
    deductionAmount: "",
    description: "",
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

  const [loading, setLoading] = useState({
    add: false,
    update: false,
    delete: false,
    categories: false,
    summary: false,
  })

  const [filter, setFilter] = useState({
    expense_type: "ALL",
    category: "",
    status: "ALL",
    start_date: "",
    end_date: "",
    location_type: "ALL",
  })

  const expenses = useAppSelector(selectAllExpenses)
  const categories = useAppSelector(selectExpenseCategories)
  const subcategories = useAppSelector(selectExpenseSubCategories)
  const summary = useAppSelector(selectExpenseSummary)
  const employees = useAppSelector(selectAllEmployees)

  useEffect(() => {
    dispatch(fetchExpenses())
    dispatch(fetchEmployees({ businessId }))
    dispatch(fetchExpenseCategories())
    dispatch(fetchExpenseSummary())
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

      Object.entries(expenseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString())
        }
      })

      formData.append("company", "1")

      await dispatch(createExpense(formData))
      setLoading({ ...loading, add: false })
      handleClose()
      dispatch(fetchExpenseSummary())
      dispatch(fetchExpenses())
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
      dispatch(fetchExpenseSummary())
      dispatch(fetchExpenses())
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
      dispatch(fetchExpenseSummary())
      dispatch(fetchExpenses())
    } catch (error: any) {
      setLoading({ ...loading, delete: false })
      alert(error.message || "Failed to delete expense")
    }
  }

  const handleApproveExpense = async (expenseId: number) => {
    setLoading({ ...loading, approve: true })
    try {
      await dispatch(approveExpense(expenseId))
      setLoading({ ...loading, approve: false })
      setOpenApprove(false)
      setOpenActions(null)
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
      setOpenActions(null)
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
      setOpenActions(null)
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
      setOpenActions(null)
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
    setOpenActions(null)
  }

  const handleClickRejectOpen = (expense: any) => {
    setSelectedExpense(expense)
    setOpenReject(true)
    setOpenActions(null)
  }

  const handleClickMarkPaidOpen = (expense: any) => {
    setSelectedExpense(expense)
    setOpenMarkPaid(true)
    setOpenActions(null)
  }

  const handleClickAttachToEmployeeOpen = (expense: any) => {
    setAttachEmployeeData({
      ...attachEmployeeData,
      expenseId: expense.id.toString(),
    })
    setOpenAttachToEmployee(true)
    setOpenActions(null)
  }

  const handleClickDeleteOpen = (expenseId: string, expenseTitle: string) => {
    setDeleteData({
      id: expenseId,
      title: expenseTitle,
    })
    setOpenDelete(true)
    setOpenActions(null)
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
    setOpenActions(null)
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

    return matchesSearch && matchesType && matchesCategory && matchesStatus
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

  const handleDeleteClose = () => {
    setOpenDelete(false)
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
        return <DirectionsCar sx={{ fontSize: 18 }} />
      case "MOTORBIKE":
        return <TwoWheeler sx={{ fontSize: 18 }} />
      case "SHOP":
        return <Storefront sx={{ fontSize: 18 }} />
      case "OFFICE":
        return <Business sx={{ fontSize: 18 }} />
      case "STAFF":
        return <Person sx={{ fontSize: 18 }} />
      default:
        return <Receipt sx={{ fontSize: 18 }} />
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
        return <CheckCircle sx={{ fontSize: 16, color: "#2e7d32" }} />
      case "PENDING":
        return <Pending sx={{ fontSize: 16, color: "#ed6c02" }} />
      case "REJECTED":
        return <Warning sx={{ fontSize: 16, color: "#d32f2f" }} />
      case "PAID":
        return <Payment sx={{ fontSize: 16, color: "#0288d1" }} />
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

  const hasEmployeeAttachment = (expense: any) => {
    return (
      expense.employee_attachments && expense.employee_attachments.length > 0
    )
  }

  const renderEmployeeAttachmentBadge = (expense: any) => {
    if (hasEmployeeAttachment(expense)) {
      const count = expense.employee_attachments.length
      return (
        <Tooltip
          title={`Attached to ${count} employee(s) for salary deduction`}
        >
          <Badge badgeContent={count} color="secondary" sx={{ ml: 1 }}>
            <PersonAdd sx={{ fontSize: 16 }} />
          </Badge>
        </Tooltip>
      )
    }
    return null
  }

  const toggleActions = (expenseId: any) => {
    if (openActions === expenseId) {
      setOpenActions(null)
    } else {
      setOpenActions(expenseId)
    }
  }

  return (
    <div>
      {isMobile ? (
        <MobileContainer>
          <Navbar
            headerMessage="Expense Management"
            headerText="Track and manage all company expenses"
          />

          <ContentWrapper>
            {/* Stats Overview */}
            {summary && (
              <StatsGrid>
                <StatCard>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <AttachMoney sx={{ color: "primary.main", fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    KSh {summary.summary.total_amount?.toLocaleString() || "0"}
                  </Typography>
                </StatCard>

                <StatCard>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Receipt sx={{ color: "success.main", fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">
                      Count
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "success.main",
                      fontSize: "1rem",
                    }}
                  >
                    {summary.summary.count || 0}
                  </Typography>
                </StatCard>

                <StatCard>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <TrendingUp sx={{ color: "warning.main", fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">
                      Avg
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "warning.main",
                      fontSize: "1rem",
                    }}
                  >
                    KSh{" "}
                    {summary.summary.average_amount
                      ? Math.round(
                          summary.summary.average_amount,
                        ).toLocaleString()
                      : "0"}
                  </Typography>
                </StatCard>

                <StatCard>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Warning sx={{ color: "error.main", fontSize: 18 }} />
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "error.main",
                      fontSize: "1rem",
                    }}
                  >
                    {summary.summary.pending_count || 0}
                  </Typography>
                </StatCard>
              </StatsGrid>
            )}

            {/* Search Bar */}
            <SearchBar>
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
                      fontSize: "0.9rem",
                    },
                  }}
                />
                <IconButton
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  sx={{
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    width: 40,
                    height: 40,
                  }}
                >
                  <FilterList />
                </IconButton>
              </Box>

              <Collapse in={showAdvancedFilters}>
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel sx={{ fontSize: "0.9rem" }}>Type</InputLabel>
                    <Select
                      value={filter.expense_type}
                      label="Type"
                      onChange={(e) =>
                        setFilter({ ...filter, expense_type: e.target.value })
                      }
                      sx={{ fontSize: "0.9rem" }}
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

                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel sx={{ fontSize: "0.9rem" }}>
                      Category
                    </InputLabel>
                    <Select
                      value={filter.category}
                      label="Category"
                      onChange={(e) =>
                        setFilter({ ...filter, category: e.target.value })
                      }
                      sx={{ fontSize: "0.9rem" }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel sx={{ fontSize: "0.9rem" }}>Status</InputLabel>
                    <Select
                      value={filter.status}
                      label="Status"
                      onChange={(e) =>
                        setFilter({ ...filter, status: e.target.value })
                      }
                      sx={{ fontSize: "0.9rem" }}
                    >
                      <MenuItem value="ALL">All Status</MenuItem>
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="APPROVED">Approved</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                      <MenuItem value="PAID">Paid</MenuItem>
                    </Select>
                  </FormControl>

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
                      })
                    }
                    sx={{ borderRadius: 2, fontSize: "0.9rem" }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Collapse>
            </SearchBar>

            {/* Action Buttons */}
            <ActionButtonsRow>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleClickOpen}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                Add
              </Button>

              <Button
                variant="outlined"
                startIcon={<LocalGasStation />}
                onClick={handleQuickFuel}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                Fuel
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
                  fontSize: "0.85rem",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                Shop
              </Button>
            </ActionButtonsRow>

            {/* Expenses List - Card View for Mobile */}
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                  px: 0.5,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Recent Expenses
                </Typography>
                {filteredExpenses.length > 0 && (
                  <Chip
                    label={`${
                      filteredExpenses.length
                    } · KSh ${totalExpenses.toLocaleString()}`}
                    size="small"
                    sx={{ fontSize: "0.75rem" }}
                  />
                )}
              </Box>

              {filteredExpenses.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                  <Receipt sx={{ fontSize: 48, color: "grey.300", mb: 2 }} />
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    No expenses found
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    {search
                      ? "Try adjusting your search"
                      : "Add your first expense"}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleClickOpen}
                    size="small"
                  >
                    Add Expense
                  </Button>
                </Paper>
              ) : (
                <Box sx={{ width: "100%" }}>
                  {filteredExpenses.map((expense) => (
                    <ExpenseCard key={expense.id}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        {/* Header Row */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {getExpenseTypeIcon(expense.expense_type)}
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, fontSize: "0.95rem" }}
                            >
                              {expense.title}
                            </Typography>
                            {renderEmployeeAttachmentBadge(expense)}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => toggleActions(expense.id)}
                            sx={{ ml: 1 }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Details Grid */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Amount
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "success.main" }}
                            >
                              KSh{" "}
                              {parseFloat(
                                expense.total_amount,
                              ).toLocaleString()}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Date
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday
                                sx={{ fontSize: 12, color: "text.secondary" }}
                              />
                              <Typography variant="caption">
                                <DateDisplay date={expense.expense_date} />
                              </Typography>
                            </Box>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Type
                            </Typography>
                            <Chip
                              label={expense.expense_type}
                              size="small"
                              color={
                                getExpenseTypeColor(expense.expense_type) as any
                              }
                              sx={{ height: 24, fontSize: "0.7rem" }}
                            />
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              Status
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {getStatusIcon(expense.status)}
                              <Chip
                                label={expense.status}
                                size="small"
                                color={getStatusColor(expense.status) as any}
                                variant="outlined"
                                sx={{ height: 24, fontSize: "0.7rem" }}
                              />
                            </Box>
                          </Box>

                          {/* Location/Asset Name - Show the actual name from the response */}
                          {(expense.shop_name ||
                            expense.store_name ||
                            expense.vehicle_name ||
                            expense.motorbike_name ||
                            expense.location_name) && (
                            <Box sx={{ gridColumn: "span 2" }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mb: 0.5 }}
                              >
                                Location / Asset
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  flexWrap: "wrap",
                                }}
                              >
                                {/* Shop Name */}
                                {expense.shop_name && (
                                  <Chip
                                    icon={<Storefront sx={{ fontSize: 14 }} />}
                                    label={expense.shop_name}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                  />
                                )}

                                {/* Store Name */}
                                {expense.store_name && (
                                  <Chip
                                    icon={<Storefront sx={{ fontSize: 14 }} />}
                                    label={expense.store_name}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                  />
                                )}

                                {/* Vehicle Name */}
                                {expense.vehicle_name && (
                                  <Chip
                                    icon={
                                      <DirectionsCar sx={{ fontSize: 14 }} />
                                    }
                                    label={expense.vehicle_name}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                  />
                                )}

                                {/* Motorbike Name */}
                                {expense.motorbike_name && (
                                  <Chip
                                    icon={<TwoWheeler sx={{ fontSize: 14 }} />}
                                    label={expense.motorbike_name}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                  />
                                )}

                                {/* Location Name */}
                                {expense.location_name && (
                                  <Chip
                                    icon={<Business sx={{ fontSize: 14 }} />}
                                    label={expense.location_name}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                  />
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>

                        {/* Description if exists */}
                        {expense.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1 }}
                          >
                            {expense.description.length > 60
                              ? `${expense.description.substring(0, 60)}...`
                              : expense.description}
                          </Typography>
                        )}

                        {/* Actions Menu */}
                        <Collapse in={openActions === expense.id}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              flexWrap: "wrap",
                              mt: 1,
                              pt: 1,
                              borderTop: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleClickUpdateOpen(expense)}
                                sx={{
                                  color: "primary.main",
                                  bgcolor: "primary.50",
                                  p: 1,
                                }}
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
                                    sx={{
                                      color: "success.main",
                                      bgcolor: "success.50",
                                      p: 1,
                                    }}
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
                                    sx={{
                                      color: "error.main",
                                      bgcolor: "error.50",
                                      p: 1,
                                    }}
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
                                  sx={{
                                    color: "info.main",
                                    bgcolor: "info.50",
                                    p: 1,
                                  }}
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
                                sx={{
                                  color: "secondary.main",
                                  bgcolor: "secondary.50",
                                  p: 1,
                                }}
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
                                sx={{
                                  color: "error.main",
                                  bgcolor: "error.50",
                                  p: 1,
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </ExpenseCard>
                  ))}
                </Box>
              )}
            </Box>
          </ContentWrapper>

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
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              width: 48,
              height: 48,
            }}
            onClick={handleClickOpen}
          >
            <Add />
          </Fab>

          {/* Dialogs - Keep all your existing dialogs but ensure they're optimized for mobile */}
          <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
              sx: {
                borderRadius: 0,
              },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Add sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Add New Expense
                </Typography>
              </Box>
              <IconButton onClick={handleClose} sx={{ color: "white", p: 0.5 }}>
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
              <form onSubmit={handleAddExpense} className=" mt-4">
                <Grid container spacing={2}>
                  {/* All your form fields remain the same */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Expense Title"
                      name="title"
                      value={expenseData.title}
                      onChange={handleInputChange}
                      required
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Expense Type</InputLabel>
                      <Select
                        name="expense_type"
                        value={expenseData.expense_type}
                        label="Expense Type"
                        onChange={handleInputChange}
                        required
                      >
                        <MenuItem value="VEHICLE">Vehicle Expense</MenuItem>
                        <MenuItem value="MOTORBIKE">Motorbike Expense</MenuItem>
                        <MenuItem value="SHOP">Shop Expense</MenuItem>
                        <MenuItem value="OFFICE">Office Expense</MenuItem>
                        <MenuItem value="STAFF">Staff Expense</MenuItem>
                        <MenuItem value="UTILITY">Utility Expense</MenuItem>
                        <MenuItem value="MARKETING">Marketing Expense</MenuItem>
                        <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={expenseData.category}
                        label="Category"
                        onChange={handleInputChange}
                        required
                      >
                        <MenuItem value="">
                          <em>Select Category</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Subcategory</InputLabel>
                      <Select
                        name="subcategory"
                        value={expenseData.subcategory}
                        label="Subcategory"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>Select Subcategory</em>
                        </MenuItem>
                        {subcategories.map((subcat) => (
                          <MenuItem key={subcat.id} value={subcat.id}>
                            {subcat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount (KSh)"
                      name="amount"
                      type="number"
                      value={expenseData.amount}
                      onChange={handleInputChange}
                      required
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tax Amount (KSh)"
                      name="tax_amount"
                      type="number"
                      value={expenseData.tax_amount}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        name="payment_method"
                        value={expenseData.payment_method}
                        label="Payment Method"
                        onChange={handleInputChange}
                        required
                      >
                        <MenuItem value="CASH">Cash</MenuItem>
                        <MenuItem value="MPESA">M-Pesa</MenuItem>
                        <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                        <MenuItem value="CHEQUE">Cheque</MenuItem>
                        <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Reference"
                      name="payment_reference"
                      value={expenseData.payment_reference}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Receipt Number"
                      name="receipt_number"
                      value={expenseData.receipt_number}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={expenseData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={expenseData.notes}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading.add}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading.add ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Save Expense"
                    )}
                  </Button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>

          {/* Keep all other dialogs as is but ensure they're mobile-optimized */}
          {/* Update Expense Dialog */}
          <Dialog
            open={openUpdate}
            onClose={handleCloseUpdate}
            fullScreen
            PaperProps={{
              sx: { borderRadius: 0 },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: "warning.main",
                color: "white",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Edit sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Update Expense
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseUpdate}
                sx={{ color: "white", p: 0.5 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
              <form onSubmit={handleEdit}>
                <Grid container spacing={2}>
                  {/* All update form fields - similar structure to add form */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Expense Title"
                      name="title"
                      value={updateExpenseData.title}
                      onChange={handleUpdateInputChange}
                      required
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={updateExpenseData.category}
                        label="Category"
                        onChange={handleUpdateInputChange}
                        required
                      >
                        <MenuItem value="">
                          <em>Select Category</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Subcategory</InputLabel>
                      <Select
                        name="subcategory"
                        value={updateExpenseData.subcategory}
                        label="Subcategory"
                        onChange={handleUpdateInputChange}
                      >
                        <MenuItem value="">
                          <em>Select Subcategory</em>
                        </MenuItem>
                        {subcategories.map((subcat) => (
                          <MenuItem key={subcat.id} value={subcat.id}>
                            {subcat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount (KSh)"
                      name="amount"
                      type="number"
                      value={updateExpenseData.amount}
                      onChange={handleUpdateInputChange}
                      required
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tax Amount (KSh)"
                      name="tax_amount"
                      type="number"
                      value={updateExpenseData.tax_amount}
                      onChange={handleUpdateInputChange}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        name="payment_method"
                        value={updateExpenseData.payment_method}
                        label="Payment Method"
                        onChange={handleUpdateInputChange}
                        required
                      >
                        <MenuItem value="CASH">Cash</MenuItem>
                        <MenuItem value="MPESA">M-Pesa</MenuItem>
                        <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                        <MenuItem value="CHEQUE">Cheque</MenuItem>
                        <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Reference"
                      name="payment_reference"
                      value={updateExpenseData.payment_reference}
                      onChange={handleUpdateInputChange}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={updateExpenseData.description}
                      onChange={handleUpdateInputChange}
                      multiline
                      rows={3}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    onClick={handleCloseUpdate}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="warning"
                    disabled={loading.update}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading.update ? <CircularProgress size={24} /> : "Update"}
                  </Button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>

          {/* Keep other dialogs but make them fullScreen for mobile */}
          <Dialog
            open={openDelete}
            onClose={handleDeleteClose}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Delete "<strong>{deleteData.title}</strong>"? This cannot be
                undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={handleDeleteClose} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                disabled={loading.delete}
                fullWidth
              >
                {loading.delete ? <CircularProgress size={24} /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openApprove}
            onClose={() => setOpenApprove(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx={{ fontWeight: 600, color: "success.main" }}>
              Approve Expense
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Approve "<strong>{selectedExpense?.title}</strong>"?
              </DialogContentText>
              <Box
                sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}
              >
                <Typography variant="body2">
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
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApproveExpense(selectedExpense?.id)}
                variant="contained"
                color="success"
                disabled={loading.approve}
                fullWidth
              >
                {loading.approve ? <CircularProgress size={24} /> : "Approve"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openReject}
            onClose={() => setOpenReject(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx={{ fontWeight: 600, color: "error.main" }}>
              Reject Expense
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Reject "<strong>{selectedExpense?.title}</strong>"?
              </DialogContentText>
              <TextField
                fullWidth
                label="Reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                multiline
                rows={3}
                sx={{ mt: 2 }}
                required
                size="small"
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => {
                  setOpenReject(false)
                  setRejectionReason("")
                }}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectExpense}
                variant="contained"
                color="error"
                disabled={loading.reject || !rejectionReason.trim()}
                fullWidth
              >
                {loading.reject ? <CircularProgress size={24} /> : "Reject"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openMarkPaid}
            onClose={() => setOpenMarkPaid(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx={{ fontWeight: 600, color: "info.main" }}>
              Mark as Paid
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Mark "<strong>{selectedExpense?.title}</strong>" as paid?
              </DialogContentText>
              <Box sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="body2">
                  Amount: KSh{" "}
                  {selectedExpense
                    ? parseFloat(selectedExpense.total_amount).toLocaleString()
                    : "0"}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={() => setOpenMarkPaid(false)}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleMarkAsPaid(selectedExpense?.id)}
                variant="contained"
                color="info"
                disabled={loading.markPaid}
                fullWidth
              >
                {loading.markPaid ? (
                  <CircularProgress size={24} />
                ) : (
                  "Mark Paid"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openAttachToEmployee}
            onClose={() => setOpenAttachToEmployee(false)}
            fullScreen
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                color: "secondary.main",
                bgcolor: "secondary.50",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonAdd />
                <Typography variant="subtitle1">Attach to Employee</Typography>
              </Box>
              <IconButton onClick={() => setOpenAttachToEmployee(false)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 2}}>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }} size="small">
                <InputLabel>Select Employee</InputLabel>
                <Select
                  name="employeeId"
                  value={attachEmployeeData.employeeId}
                  label="Select Employee"
                  onChange={handleAttachEmployeeInputChange}
                  required
                  size="small"
                >
                  <MenuItem value="">
                    <em>Select an employee</em>
                  </MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name}
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
                size="small"
              />

              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={attachEmployeeData.description}
                onChange={handleAttachEmployeeInputChange}
                multiline
                rows={3}
                size="small"
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                fullWidth
                onClick={() => setOpenAttachToEmployee(false)}
                variant="outlined"
                sx={{ mb: 1 }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={handleAttachToEmployee}
                variant="contained"
                color="secondary"
                disabled={loading.attachEmployee}
              >
                {loading.attachEmployee ? (
                  <CircularProgress size={24} />
                ) : (
                  "Attach"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </MobileContainer>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default Expenses
