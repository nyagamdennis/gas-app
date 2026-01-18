// @ts-nocheck
import React, { useEffect, useState } from "react"
import LeftNav from "../components/ui/LeftNav"
import NavBar from "../components/ui/NavBar"
import Customers from "../components/Customers"
import { selectIsAuthenticated } from "../features/auths/authSlice"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import Login from "../components/Login"
import { useMediaQuery } from "react-responsive"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import { Alert } from "@mui/material"
import {
  fetchLocations,
  selectAllLocations,
} from "../features/location/locationSlice"
import { fetchProducts } from "../features/product/productSlice"
import { fetchSales } from "../features/sales/salesSlice"
import CustomerExcerpt from "../features/customers/CustomerExcerpt"
import ShortCuts from "../components/ShortCuts"
import AddIcon from "@mui/icons-material/Add"
import SaveAsIcon from "@mui/icons-material/SaveAs"
import api from "../../utils/api"
import {
  fetchCustomers,
  getCustomerError,
  getCustomersStatus,
  selectAllCustomers,
  selectPagination,
} from "../features/customers/customerSlice"
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Pagination,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material"
import {
  Search,
  FilterList,
  PersonAdd,
  Business,
  Person,
  Phone,
  LocationOn,
  Refresh,
  Sort,
} from "@mui/icons-material"

const CustomersPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const customers = useAppSelector(selectAllCustomers)
  const customerStatus = useAppSelector(getCustomersStatus)
  const customerError = useAppSelector(getCustomerError)
  const pagination = useAppSelector(selectPagination)
  const locations = useAppSelector(selectAllLocations)

  const [searchInput, setSearchInput] = useState("")
  const [addRetailCustomer, setAddRetailCustomer] = useState(false)
  const [addWholeSaleCustomer, setAddWholeSaleCustomer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [locationId, setLocationId] = useState("")
  const [filteredType, setFilteredType] = useState("ALL")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  const itemsPerPage = 10

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchLocations())
    dispatch(fetchProducts())
    dispatch(fetchSales())
  }, [dispatch])

  // Filter and sort customers
  const filterAndSortCustomers = () => {
    let filtered = customers

    // Filter by search
    if (searchInput) {
      filtered = filtered.filter((customer) => {
        const searchLower = searchInput.toLowerCase()
        return (
          customer.name.toLowerCase().includes(searchLower) ||
          customer.phone?.toString().includes(searchInput) ||
          customer.sales?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Filter by type
    if (filteredType !== "ALL") {
      filtered = filtered.filter((customer) => customer.sales === filteredType)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "date":
          aValue = new Date(a.date_aded)
          bValue = new Date(b.date_aded)
          break
        case "location":
          aValue = a.location
          bValue = b.location
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  const filteredCustomers = filterAndSortCustomers()

  // Paginate customers
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleRetailSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = {
        sales: "RETAIL",
        name: name,
        phone: phone,
        location: locationId,
      }

      const response = await api.post("/addcustomer/", formData)

      if (response.status === 201) {
        dispatch(fetchCustomers())
        setShowAlert(true)
        setName("")
        setPhone("")
        setLocationId("")
        setTimeout(() => {
          setShowAlert(false)
          setAddRetailCustomer(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWholeSaleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = {
        sales: "WHOLESALE",
        name: name,
        phone: phone,
        location: locationId,
      }

      const response = await api.post("/addcustomer/", formData)

      if (response.status === 201) {
        dispatch(fetchCustomers())
        setShowAlert(true)
        setName("")
        setPhone("")
        setLocationId("")
        setTimeout(() => {
          setShowAlert(false)
          setAddWholeSaleCustomer(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCustomerCountByType = (type) => {
    return customers.filter((customer) => customer.sales === type).length
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <LeftNav />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavBar />
        <ShortCuts />
        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Customers Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your retail and wholesale customers
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: { xs: "flex-start", md: "flex-end" },
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => setAddRetailCustomer(true)}
                  >
                    Add Retail
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Business />}
                    onClick={() => setAddWholeSaleCustomer(true)}
                  >
                    Add Wholesale
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {customers.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Customers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="secondary">
                      {getCustomerCountByType("RETAIL")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Retail Customers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="success">
                      {getCustomerCountByType("WHOLESALE")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Wholesale Customers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="warning">
                      {pagination?.total_pages || 1}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Pages
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Search and Filter Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search customers by name, phone, or type..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Type</InputLabel>
                  <Select
                    value={filteredType}
                    label="Filter by Type"
                    onChange={(e) => setFilteredType(e.target.value)}
                  >
                    <MenuItem value="ALL">All Types</MenuItem>
                    <MenuItem value="RETAIL">Retail</MenuItem>
                    <MenuItem value="WHOLESALE">Wholesale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="date">Date Added</MenuItem>
                    <MenuItem value="location">Location</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Customers List */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6">
                Customers ({filteredCustomers.length})
              </Typography>
            </Box>

            {customerStatus === "loading" ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : customerStatus === "failed" ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Alert severity="error">
                  Error loading customers: {customerError}
                </Alert>
              </Box>
            ) : (
              <>
                <List sx={{ p: 0 }}>
                  {paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map((customer) => (
                      <React.Fragment key={customer.id}>
                        <CustomerExcerpt customer={customer} />
                        <Divider />
                      </React.Fragment>
                    ))
                  ) : (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <Typography color="text.secondary">
                        No customers found. Try adjusting your search or add a
                        new customer.
                      </Typography>
                    </Box>
                  )}
                </List>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Add Retail Customer Dialog */}
      <Dialog
        open={addRetailCustomer}
        onClose={() => setAddRetailCustomer(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Retail Customer</DialogTitle>
        <DialogContent>
          <form onSubmit={handleRetailSubmit}>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                margin="normal"
                required
                type="tel"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationId}
                  label="Location"
                  onChange={(e) => setLocationId(e.target.value)}
                  required
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRetailCustomer(false)}>Cancel</Button>
          <Button
            onClick={handleRetailSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <SaveAsIcon />
            }
          >
            {isSubmitting ? "Adding..." : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Wholesale Customer Dialog */}
      <Dialog
        open={addWholeSaleCustomer}
        onClose={() => setAddWholeSaleCustomer(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Wholesale Customer</DialogTitle>
        <DialogContent>
          <form onSubmit={handleWholeSaleSubmit}>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Company/Organization Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                margin="normal"
                required
                type="tel"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationId}
                  label="Location"
                  onChange={(e) => setLocationId(e.target.value)}
                  required
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddWholeSaleCustomer(false)}>Cancel</Button>
          <Button
            onClick={handleWholeSaleSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <SaveAsIcon />
            }
          >
            {isSubmitting ? "Adding..." : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      {showAlert && (
        <Alert
          severity="success"
          sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
        >
          Customer added successfully!
        </Alert>
      )}
      {showError && (
        <Alert
          severity="error"
          sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
        >
          There was an error adding the customer. Please try again.
        </Alert>
      )}
    </Box>
  )
}

export default CustomersPage
