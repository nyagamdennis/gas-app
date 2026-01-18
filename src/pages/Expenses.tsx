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
} from "@mui/icons-material"
import { fetchCompanyExpenses, selectAllCompanyExpenses } from "../features/expenses/companyExpensesSlice"
import { fetchExpenseCategories, fetchExpenseSubCategories, fetchExpenseSummary, selectAllExpenseCategories, selectAllExpenseSubCategories, selectExpenseSummary } from "../features/expenses/expensesSlice"

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
  const categories = useAppSelector(selectAllExpenseCategories)
  const subcategories = useAppSelector(selectAllExpenseSubCategories)
  const summary = useAppSelector(selectExpenseSummary)
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
    expense_date: new Date().toISOString().split('T')[0],
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
  })

  useEffect(() => {
    dispatch(fetchCompanyExpenses())
    dispatch(fetchExpenseCategories())
    dispatch(fetchExpenseSummary())
  }, [dispatch])

  useEffect(() => {
    if (expenseData.category) {
      dispatch(fetchExpenseSubCategories(expenseData.category))
    }
  }, [expenseData.category, dispatch])

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
      expense_date: new Date().toISOString().split('T')[0],
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

  const handleAddExpense = async (e: any) => {
    e.preventDefault()
    setLoading({ ...loading, add: true })
    
    try {
      await dispatch(addNewExpense(expenseData))
      setLoading({ ...loading, add: false })
      handleClose()
      dispatch(fetchExpenseSummary()) // Refresh summary
    } catch (error: any) {
      alert(error.message)
      setLoading({ ...loading, add: false })
    }
  }

  const handleEdit = async (e: any) => {
    e.preventDefault()
    setLoading({ ...loading, update: true })
    
    try {
      await dispatch(updateCompanyExpense({
        expenseId: updateExpenseData.id,
        formData: updateExpenseData
      }))
      setLoading({ ...loading, update: false })
      handleCloseUpdate()
      dispatch(fetchExpenseSummary()) // Refresh summary
    } catch (error: any) {
      alert(error.message)
      setLoading({ ...loading, update: false })
    }
  }

  const handleDelete = async () => {
    setLoading({ ...loading, delete: true })
    
    try {
      await dispatch(deleteExpense(deleteData.id))
      setLoading({ ...loading, delete: false })
      handleDeleteClose()
      dispatch(fetchExpenseSummary()) // Refresh summary
    } catch (error: any) {
      setLoading({ ...loading, delete: false })
      alert(error.message)
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setExpenseData({
      ...expenseData,
      [name]: value
    })
  }

  const handleUpdateInputChange = (e: any) => {
    const { name, value } = e.target
    setUpdateExpenseData({
      ...updateExpenseData,
      [name]: value
    })
  }

  const getExpenseTypeIcon = (type: string) => {
    switch (type) {
      case "VEHICLE": return <DirectionsCar sx={{ fontSize: 16 }} />
      case "MOTORBIKE": return <TwoWheeler sx={{ fontSize: 16 }} />
      case "SHOP": return <Storefront sx={{ fontSize: 16 }} />
      case "OFFICE": return <Business sx={{ fontSize: 16 }} />
      case "STAFF": return <Person sx={{ fontSize: 16 }} />
      default: return <Receipt sx={{ fontSize: 16 }} />
    }
  }

  const getExpenseTypeColor = (type: string) => {
    switch (type) {
      case "VEHICLE": return "primary"
      case "MOTORBIKE": return "secondary"
      case "SHOP": return "success"
      case "OFFICE": return "warning"
      case "STAFF": return "info"
      default: return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
      case "PENDING": return <Pending sx={{ fontSize: 16, color: "warning.main" }} />
      case "REJECTED": return <Warning sx={{ fontSize: 16, color: "error.main" }} />
      case "PAID": return <Payment sx={{ fontSize: 16, color: "info.main" }} />
      default: return <AccessTime sx={{ fontSize: 16 }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "success"
      case "PENDING": return "warning"
      case "REJECTED": return "error"
      case "PAID": return "info"
      default: return "default"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "MPESA": return <AttachMoney sx={{ fontSize: 16 }} />
      case "BANK_TRANSFER": return <Payment sx={{ fontSize: 16 }} />
      default: return <Receipt sx={{ fontSize: 16 }} />
    }
  }

  const filteredExpenses = all_expenses.filter(expense => {
    const matchesSearch = search === "" || 
      expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.description?.toLowerCase().includes(search.toLowerCase()) ||
      expense.receipt_number?.toLowerCase().includes(search.toLowerCase())
    
    const matchesType = filter.expense_type === "ALL" || expense.expense_type === filter.expense_type
    const matchesCategory = filter.category === "" || expense.category?.id === filter.category
    const matchesStatus = filter.status === "ALL" || expense.status === filter.status
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.total_amount || expense.amount), 0)

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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <AttachMoney sx={{ color: "primary.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                      KSh {summary.total_amount?.toLocaleString() || "0"}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Receipt sx={{ color: "success.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Count
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                      {summary.count || 0}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <TrendingUp sx={{ color: "warning.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Avg/Expense
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "warning.main" }}>
                      KSh {summary.average_amount ? Math.round(summary.average_amount).toLocaleString() : "0"}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Warning sx={{ color: "error.main", fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "error.main" }}>
                      {summary.pending_count || 0}
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
              <Box sx={{ display: "flex", gap: 1, mb: showAdvancedFilters ? 2 : 0 }}>
                <TextField
                  fullWidth
                  placeholder="Search expenses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
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
                        onChange={(e) => setFilter({...filter, expense_type: e.target.value})}
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
                        onChange={(e) => setFilter({...filter, category: e.target.value})}
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
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => setFilter({
                          expense_type: "ALL",
                          category: "",
                          status: "ALL",
                          start_date: "",
                          end_date: "",
                        })}
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
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Add Expense
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<LocalGasStation />}
                onClick={() => {
                  setExpenseData({
                    ...expenseData,
                    expense_type: "VEHICLE",
                    title: "Fuel Expense",
                    category: categories.find(c => c.code === "FUEL")?.id || ""
                  })
                  handleClickOpen()
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
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
                    title: "Shop Maintenance"
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
                      label={`${filteredExpenses.length} expenses · KSh ${totalExpenses.toLocaleString()}`}
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {search ? "Try adjusting your search criteria" : "Add your first expense to get started"}
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
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2">
                              <DateDisplay date={expense.expense_date} />
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {expense.title}
                              </Typography>
                              {expense.description && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                                  {expense.description.substring(0, 50)}...
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {getExpenseTypeIcon(expense.expense_type)}
                              <Chip
                                label={expense.expense_type}
                                size="small"
                                color={getExpenseTypeColor(expense.expense_type) as any}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "success.main" }}
                            >
                              KSh {parseFloat(expense.total_amount || expense.amount).toLocaleString()}
                            </Typography>
                            {expense.tax_amount > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                (Tax: KSh {expense.tax_amount.toLocaleString()})
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleClickUpdateOpen(expense)}
                                  sx={{ color: "primary.main" }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleClickDeleteOpen(expense.id, expense.title)}
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

          {/* Add Expense Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ 
              bgcolor: "primary.main", 
              color: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              p: 3,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Add sx={{ fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Add New Expense
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 4 }}>
              <form className="mt-4" onSubmit={handleAddExpense}>
                <Grid container spacing={2}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading.add}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading.add ? <CircularProgress size={24} /> : "Save Expense"}
                  </Button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>

          {/* Update Expense Dialog */}
          <Dialog
            open={openUpdate}
            onClose={handleCloseUpdate}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ 
              bgcolor: "warning.main", 
              color: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              p: 3,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Edit sx={{ fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Update Expense
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleCloseUpdate}
                  sx={{
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 4 }}>
              <form onSubmit={handleEdit}>
                <Grid container spacing={2}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                  
                  <Grid item xs={12} sm={6}>
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
                
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button
                    onClick={handleCloseUpdate}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    disabled={loading.update}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading.update ? <CircularProgress size={24} /> : "Update Expense"}
                  </Button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDelete}
            onClose={handleDeleteClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600 }}>
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the expense: <strong>{deleteData.title}</strong>? 
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={handleDeleteClose}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                disabled={loading.delete}
                sx={{ borderRadius: 2 }}
              >
                {loading.delete ? <CircularProgress size={24} /> : "Delete"}
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