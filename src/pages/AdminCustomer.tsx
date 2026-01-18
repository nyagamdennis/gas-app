// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchLocations,
  selectAllLocations,
} from "../features/location/locationSlice"
import { fetchProducts } from "../features/product/productSlice"
import { fetchSales } from "../features/sales/salesSlice"
import CustomerExcerpt from "../features/customers/CustomerExcerpt"
import AdminsFooter from "../components/AdminsFooter"
import Navbar from "../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"
import {
  fetchCustomers,
  getCustomerError,
  getCustomersStatus,
  selectAllCustomers,
  addCustomer,
} from "../features/customers/customerSlice"
import {
  Box,
  Container,
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
  Grid,
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
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Fab,
  useScrollTrigger,
  Zoom,
  Fade,
  Collapse,
} from "@mui/material"
import {
  Search,
  Add,
  PersonAdd,
  Business,
  Person,
  Phone,
  LocationOn,
  FilterList,
  Sort,
  Storefront,
  MoneyOff,
  Groups,
  KeyboardArrowUp,
  Close,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingBag,
  Receipt,
  Inventory,
} from "@mui/icons-material"

function ScrollTop(props) {
  const { children } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor",
    )

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 80, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  )
}

const AdminCustomer = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectAllCustomers)
  const locations = useAppSelector(selectAllLocations)
  const customerStatus = useAppSelector(getCustomersStatus)
  const customerError = useAppSelector(getCustomerError)

  const [phone, setPhone] = useState("")
  const [locationId, setLocationId] = useState("")
  const [name, setName] = useState("")
  const [customerType, setCustomerType] = useState("RETAIL")
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [filteredType, setFilteredType] = useState("ALL")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchLocations())
    dispatch(fetchProducts())
    dispatch(fetchSales())
  }, [dispatch])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c?.phone?.toString().includes(search),
  )

  const retailCustomers = filtered.filter((c) => c.sales === "RETAIL")
  const wholesaleCustomers = filtered.filter((c) => c.sales === "WHOLESALE")
  const debtors = filtered.filter((c) =>
    c.customer_debt?.some((debt) => !debt.cleared),
  )

  const getActiveCustomers = () => {
    switch (activeTab) {
      case 0:
        return filtered
      case 1:
        return retailCustomers
      case 2:
        return wholesaleCustomers
      case 3:
        return debtors
      default:
        return filtered
    }
  }

  const getTabLabel = (index) => {
    const labels = ["All", "Retail", "Wholesale", "Debtors"]
    const counts = [
      filtered.length,
      retailCustomers.length,
      wholesaleCustomers.length,
      debtors.length,
    ]
    return `${labels[index]} (${counts[index]})`
  }

  const getCustomerStats = () => {
    return {
      total: customers.length,
      retail: customers.filter((c) => c.sales === "RETAIL").length,
      wholesale: customers.filter((c) => c.sales === "WHOLESALE").length,
      withDebt: customers.filter((c) =>
        c.customer_debt?.some((d) => !d.cleared),
      ).length,
    }
  }

  const stats = getCustomerStats()

  const handleAddNewCustomer = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = {
        name,
        location: locationId,
        phone,
        sales: customerType,
      }

      await dispatch(addCustomer(formData)).unwrap()
      toast.success("Customer added successfully!")

      // Reset form
      setName("")
      setPhone("")
      setLocationId("")
      setCustomerType("RETAIL")
      setOpenDialog(false)
    } catch (error) {
      console.error("Error adding customer: ", error)
      toast.error(error?.message || "Failed to add customer. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 10) {
      setPhone(value)
    }
  }

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3]
    }
    return phone
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setName("")
    setPhone("")
    setLocationId("")
    setCustomerType("RETAIL")
  }

  if (!isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Desktop Customer Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Full desktop view with advanced customer management features coming
            soon
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <ToastContainer />
      <Navbar
        headerMessage={"Customer Management"}
        headerText={"Manage retail, wholesale customers and track debts"}
      />

      <div id="back-to-top-anchor" />

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Enhanced Stats Overview with Soft UI */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1,
                }}
              >
                <Groups sx={{ color: "primary.main", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}
              >
                {stats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Customers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "secondary.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1,
                }}
              >
                <Person sx={{ color: "secondary.main", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "secondary.main", mb: 0.5 }}
              >
                {stats.retail}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Retail
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "success.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1,
                }}
              >
                <Business sx={{ color: "success.main", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "success.main", mb: 0.5 }}
              >
                {stats.wholesale}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Wholesale
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "warning.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1,
                }}
              >
                <MoneyOff sx={{ color: "warning.main", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "warning.main", mb: 0.5 }}
              >
                {stats.withDebt}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                With Debt
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Enhanced Search Bar */}
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
          <TextField
            fullWidth
            placeholder="Search customers by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearch("")}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size="small"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Paper>

        {/* Enhanced Tabs with Soft UI */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: "grey.50",
              "& .MuiTab-root": {
                minWidth: 100,
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "none",
                py: 1.5,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <Tab
                key={index}
                label={getTabLabel(index)}
                icon={
                  index === 0 ? (
                    <Groups fontSize="small" />
                  ) : index === 1 ? (
                    <Person fontSize="small" />
                  ) : index === 2 ? (
                    <Business fontSize="small" />
                  ) : (
                    <MoneyOff fontSize="small" />
                  )
                }
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Customers List */}
        {customerStatus === "loading" ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
            <CircularProgress />
          </Box>
        ) : customerError ? (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            Error loading customers: {customerError}
          </Alert>
        ) : (
          <Box>
            {getActiveCustomers().length > 0 ? (
              <Box sx={{ "& > *:not(:last-child)": { mb: 2 } }}>
                {getActiveCustomers().map((customer) => (
                  <CustomerExcerpt key={customer.id} customer={customer} />
                ))}
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ mb: 3 }}>
                  {activeTab === 0 && (
                    <Groups sx={{ fontSize: 64, color: "grey.300" }} />
                  )}
                  {activeTab === 1 && (
                    <Person sx={{ fontSize: 64, color: "grey.300" }} />
                  )}
                  {activeTab === 2 && (
                    <Business sx={{ fontSize: 64, color: "grey.300" }} />
                  )}
                  {activeTab === 3 && (
                    <MoneyOff sx={{ fontSize: 64, color: "grey.300" }} />
                  )}
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  No customers found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {search
                    ? "Try adjusting your search criteria"
                    : activeTab === 1
                    ? "No retail customers yet"
                    : activeTab === 2
                    ? "No wholesale customers yet"
                    : activeTab === 3
                    ? "No customers with outstanding debts"
                    : "No customers found"}
                </Typography>
                {!search && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Add New Customer
                  </Button>
                )}
              </Paper>
            )}
          </Box>
        )}
      </Container>

      {/* Enhanced Add Customer Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`,
            color: "white",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            p: 3,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              transform: "translate(30%, -30%)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonAdd sx={{ fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Add New Customer
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseDialog}
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
        <DialogContent sx={{ pt: 4, px: 3 }}>
          <form className="mt-4" onSubmit={handleAddNewCustomer}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formatPhoneNumber(phone)}
                  onChange={handlePhoneChange}
                  required
                  type="tel"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Format: (123) 456-7890"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={locationId}
                    label="Location"
                    onChange={(e) => setLocationId(e.target.value)}
                    required
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOn fontSize="small" />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a location</em>
                    </MenuItem>
                    {locations.map((loc) => (
                      <MenuItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Customer Type
                  </Typography>
                  <RadioGroup
                    row
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    sx={{
                      "& .MuiFormControlLabel-root": {
                        flex: 1,
                        m: 0,
                      },
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor:
                          customerType === "RETAIL"
                            ? "primary.main"
                            : "grey.200",
                        bgcolor:
                          customerType === "RETAIL"
                            ? "primary.50"
                            : "transparent",
                        transition: "all 0.2s",
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      <FormControlLabel
                        value="RETAIL"
                        control={
                          <Radio color="primary" sx={{ display: "none" }} />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 1,
                              cursor: "pointer",
                            }}
                            onClick={() => setCustomerType("RETAIL")}
                          >
                            <Person
                              sx={{
                                fontSize: 32,
                                color:
                                  customerType === "RETAIL"
                                    ? "primary.main"
                                    : "grey.600",
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color:
                                  customerType === "RETAIL"
                                    ? "primary.main"
                                    : "text.primary",
                              }}
                            >
                              Retail
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor:
                          customerType === "WHOLESALE"
                            ? "success.main"
                            : "grey.200",
                        bgcolor:
                          customerType === "WHOLESALE"
                            ? "success.50"
                            : "transparent",
                        transition: "all 0.2s",
                        flex: 1,
                      }}
                    >
                      <FormControlLabel
                        value="WHOLESALE"
                        control={
                          <Radio color="primary" sx={{ display: "none" }} />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 1,
                              cursor: "pointer",
                            }}
                            onClick={() => setCustomerType("WHOLESALE")}
                          >
                            <Business
                              sx={{
                                fontSize: 32,
                                color:
                                  customerType === "WHOLESALE"
                                    ? "success.main"
                                    : "grey.600",
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color:
                                  customerType === "WHOLESALE"
                                    ? "success.main"
                                    : "text.primary",
                              }}
                            >
                              Wholesale
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddNewCustomer}
            variant="contained"
            disabled={submitting || !name || !phone || !locationId}
            startIcon={submitting ? <CircularProgress size={20} /> : <Add />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            {submitting ? "Adding..." : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          zIndex: 1000,
          boxShadow: "0 8px 20px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            boxShadow: "0 12px 30px rgba(25, 118, 210, 0.4)",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease",
        }}
        onClick={handleOpenDialog}
      >
        <Add />
      </Fab>

      {/* Scroll to Top Button */}
      <ScrollTop>
        <Fab
          color="secondary"
          size="small"
          sx={{
            boxShadow: "0 4px 12px rgba(156, 39, 176, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(156, 39, 176, 0.4)",
            },
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>

      <footer style={{ marginTop: "auto" }}>
        <AdminsFooter />
      </footer>
    </Box>
  )
}

export default AdminCustomer
