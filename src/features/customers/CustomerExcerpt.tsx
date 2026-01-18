// @ts-nocheck
import React, { useState, useRef, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAllLocations } from "../location/locationSlice"
import { selectAllProducts } from "../product/productSlice"
import { selectAllSales } from "../sales/salesSlice"
import api from "../../../utils/api"
import FormattedAmount from "../../components/FormattedAmount"

import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Paper,
  Chip,
  Box,
  Grid,
  Pagination,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Avatar,
  Fade,
  Collapse,
  Divider,
  LinearProgress,
  CircularProgress,
  Stack,
} from "@mui/material"
import {
  Receipt,
  LocalGasStation,
  Inventory,
  CheckCircle,
  Pending,
  AccessTime,
  Person,
  Business,
  History,
  Send as SendIcon,
  Phone as PhoneInTalkIcon,
  LocationOn as LocationOnIcon,
  ExpandMore,
  TrendingUp,
  ShoppingBag,
  AttachMoney,
  CalendarMonth,
  Close,
  CalendarToday,
  Payment,
  ShoppingCart,
  ArrowForward,
  TrendingDown,
  Warning,
  Info,
} from "@mui/icons-material"

import {
  fetchCustomersHistory,
  selectAllCustomersHistory,
} from "./customerHistorySlice"

const CustomerExcerpt = ({ customer }) => {
  const dispatch = useAppDispatch()
  const [smsState, setSmsState] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [cylinderPage, setCylinderPage] = useState(1)
  const [productPage, setProductPage] = useState(1)
  const itemsPerPage = 5

  const messageTextareaRef = useRef(null)

  const locations = useAppSelector(selectAllLocations)
  const products = useAppSelector(selectAllProducts)
  const salesProduct = useAppSelector(selectAllSales)
  const salesHistory = useAppSelector(selectAllCustomersHistory)

  const location = locations.find((l) => l.id === customer.location)
  const phoneStr = customer?.phone?.toString()

  // Filter sales history by type
  const cylinderSales = salesHistory.filter(
    (sale) => sale.cylinder_items && sale.cylinder_items.length > 0,
  )

  const productSales = salesHistory.filter(
    (sale) => sale.items && sale.items.length > 0,
  )

  // Calculate customer stats
  const calculateCustomerStats = () => {
    if (!salesHistory || salesHistory.length === 0) {
      return {
        totalPurchases: 0,
        totalAmount: 0,
        cylinderPurchases: 0,
        productPurchases: 0,
        cylinderSalesCount: 0,
        productSalesCount: 0,
        avgPurchaseValue: 0,
        lastPurchaseDate: null,
        purchaseFrequency: 0,
        outstandingBalance: 0,
      }
    }

    const totalAmount = salesHistory.reduce(
      (sum, sale) => sum + parseFloat(sale.total_amount || 0),
      0,
    )

    const cylinderPurchases = salesHistory.reduce(
      (sum, sale) =>
        sum +
        (sale.cylinder_items?.reduce(
          (itemSum, item) => itemSum + item.quantity,
          0,
        ) || 0),
      0,
    )

    const productPurchases = salesHistory.reduce(
      (sum, sale) =>
        sum +
        (sale.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) ||
          0),
      0,
    )

    const lastPurchaseDate =
      salesHistory.length > 0 ? new Date(salesHistory[0].created_at) : null

    return {
      totalPurchases: salesHistory.length,
      totalAmount,
      cylinderPurchases,
      productPurchases,
      cylinderSalesCount: cylinderSales.length,
      productSalesCount: productSales.length,
      avgPurchaseValue: totalAmount / salesHistory.length,
      lastPurchaseDate,
      purchaseFrequency: salesHistory.length,
      outstandingBalance: 0,
    }
  }

  const stats = calculateCustomerStats()

  // Paginate history
  const paginateData = (data, page, pageSize) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return data.slice(startIndex, endIndex)
  }

  const allPurchases = paginateData(salesHistory, currentPage, itemsPerPage)
  const paginatedCylinderSales = paginateData(
    cylinderSales,
    cylinderPage,
    itemsPerPage,
  )
  const paginatedProductSales = paginateData(
    productSales,
    productPage,
    itemsPerPage,
  )

  const totalAllPages = Math.ceil(salesHistory.length / itemsPerPage)
  const totalCylinderPages = Math.ceil(cylinderSales.length / itemsPerPage)
  const totalProductPages = Math.ceil(productSales.length / itemsPerPage)

  const toggleSMS = () => setSmsState(!smsState)

  const toggleHistory = () => {
    if (!showHistory) {
      dispatch(fetchCustomersHistory({ id: customer.id }))
    }
    setShowHistory(!showHistory)
  }

  const getSaleTypeColor = (type) => {
    switch (type) {
      case "RETAIL":
        return "primary"
      case "WHOLESALE":
        return "secondary"
      case "REFILL":
        return "success"
      default:
        return "default"
    }
  }

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle sx={{ fontSize: 18 }} />
      case "PENDING":
        return <Pending sx={{ fontSize: 18 }} />
      case "PARTIAL":
        return <AccessTime sx={{ fontSize: 18 }} />
      default:
        return <Pending sx={{ fontSize: 18 }} />
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success"
      case "PENDING":
        return "warning"
      case "PARTIAL":
        return "info"
      default:
        return "default"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderCylinderDetails = (cylinderItems) => {
    if (!cylinderItems || cylinderItems.length === 0) return null

    return cylinderItems.map((item, idx) => (
      <Box
        key={idx}
        sx={{
          mb: 1,
          p: 1.5,
          bgcolor: "grey.50",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 500,
            mb: 1,
          }}
        >
          <LocalGasStation sx={{ fontSize: 16, color: "primary.main" }} />
          <strong>Cylinder:</strong>
          {item.cylinder?.weight ? `${item.cylinder.weight}kg` : "N/A"}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {item.sale_type || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Qty:</strong> {item.quantity}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Unit:</strong>{" "}
              <FormattedAmount amount={item.unit_price} />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Total:</strong>{" "}
              <FormattedAmount amount={item.total_price} />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ))
  }

  const renderProductDetails = (items) => {
    if (!items || items.length === 0) return null

    return items.map((item, idx) => (
      <Box
        key={idx}
        sx={{
          mb: 1,
          p: 1.5,
          bgcolor: "grey.50",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 500,
            mb: 1,
          }}
        >
          <Inventory sx={{ fontSize: 16, color: "secondary.main" }} />
          <strong>Product:</strong> {item.product?.name || "N/A"}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Qty:</strong> {item.quantity}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Unit:</strong>{" "}
              <FormattedAmount amount={item.unit_price} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Total:</strong>{" "}
              <FormattedAmount amount={item.total_price} />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ))
  }

  const renderEmptyState = (type) => (
    <Box sx={{ p: 6, textAlign: "center" }}>
      {type === "cylinders" ? (
        <LocalGasStation sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
      ) : (
        <Inventory sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
      )}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No {type} purchases found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This customer hasn't purchased any{" "}
        {type === "cylinders" ? "cylinders" : "products"} yet.
      </Typography>
    </Box>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = {
        message,
        customer: [customer.id],
        location: [customer.location],
      }
      const response = await api.post("/sendsms/", formData)
      if (response.status === 201) {
        setShowAlert(true)
        if (messageTextareaRef.current) {
          messageTextareaRef.current.value = ""
        }
        setTimeout(() => setShowAlert(false), 5000)
      }
    } catch (error) {
      console.error("SMS error", error)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSmsState(false), 5000)
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "visible",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Section with Gradient Background */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${
              customer.sales === "WHOLESALE"
                ? "#1976d2 0%, #42a5f5 100%"
                : "#9c27b0 0%, #ba68c8 100%"
            })`,
            borderRadius: 2,
            p: 3,
            mb: 3,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              transform: "translate(30%, -30%)",
            },
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    color:
                      customer.sales === "WHOLESALE"
                        ? "primary.main"
                        : "secondary.main",
                    width: 64,
                    height: 64,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  {customer.sales === "WHOLESALE" ? (
                    <Business sx={{ fontSize: 32 }} />
                  ) : (
                    <Person sx={{ fontSize: 32 }} />
                  )}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 0.5,
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {customer.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={customer.sales}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 600,
                        backdropFilter: "blur(10px)",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "rgba(255,255,255,0.95)",
                      }}
                    >
                      <PhoneInTalkIcon sx={{ fontSize: 16 }} />
                      <Typography
                        variant="body2"
                        component="a"
                        href={`tel:${phoneStr}`}
                        sx={{
                          color: "inherit",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {phoneStr}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "rgba(255,255,255,0.95)",
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {location?.name || "No location"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <Tooltip title="Send Message" arrow>
                  <IconButton
                    onClick={toggleSMS}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "white",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View History" arrow>
                  <IconButton
                    onClick={toggleHistory}
                    sx={{
                      bgcolor: showHistory
                        ? "rgba(255,255,255,1)"
                        : "rgba(255,255,255,0.9)",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "white",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <History />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* SMS Form with Animation */}
        <Collapse in={smsState}>
          <Fade in={smsState}>
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Send Message
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setSmsState(false)}
                    sx={{ color: "text.secondary" }}
                  >
                    <Close />
                  </IconButton>
                </Box>

                <TextField
                  inputRef={messageTextareaRef}
                  placeholder="Type your message here..."
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={message}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Message will be sent to: <strong>{phoneStr}</strong>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={isSubmitting}
                    sx={{
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Box>

                {showAlert && (
                  <Alert
                    severity="success"
                    sx={{ mt: 2, borderRadius: 1.5 }}
                    onClose={() => setShowAlert(false)}
                  >
                    Message sent successfully!
                  </Alert>
                )}

                {showError && (
                  <Alert
                    severity="error"
                    sx={{ mt: 2, borderRadius: 1.5 }}
                    onClose={() => setShowError(false)}
                  >
                    Please login to send messages.
                  </Alert>
                )}
              </form>
            </Paper>
          </Fade>
        </Collapse>

        {/* Purchase History Section */}
        <Collapse in={showHistory}>
          <Fade in={showHistory}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
              >
                Customer Overview
              </Typography>

              {/* Enhanced Stats Cards */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
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
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "primary.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <ShoppingBag sx={{ color: "primary.main" }} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}
                    >
                      {stats.totalPurchases}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Total Orders
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        size="small"
                        label={`${stats.cylinderSalesCount}C`}
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                      <Chip
                        size="small"
                        label={`${stats.productSalesCount}P`}
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
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
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "success.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <AttachMoney sx={{ color: "success.main" }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "success.main", mb: 0.5 }}
                    >
                      <FormattedAmount amount={stats.totalAmount} />
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Total Revenue
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <TrendingUp
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                      <Typography variant="caption" color="success.main">
                        Active
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
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
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "warning.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <Receipt sx={{ color: "warning.main" }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "warning.main", mb: 0.5 }}
                    >
                      <FormattedAmount amount={stats.avgPurchaseValue} />
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Avg Order Value
                    </Typography>
                    {stats.lastPurchaseDate && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(stats.lastPurchaseDate).split(",")[0]}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
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
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "error.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <Warning sx={{ color: "error.main" }} />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "error.main", mb: 0.5 }}
                    >
                      <FormattedAmount amount={stats.outstandingBalance} />
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Outstanding
                    </Typography>
                    <Chip
                      size="small"
                      label="No Debt"
                      color="success"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 20 }}
                    />
                  </Paper>
                </Grid>
              </Grid>

              {/* Modern Purchase History Tabs */}
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  mb: 3,
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.875rem",
                  },
                }}
              >
                <Tab
                  icon={<Receipt sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={`All (${salesHistory.length})`}
                />
                <Tab
                  icon={<LocalGasStation sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={`Cylinders (${cylinderSales.length})`}
                />
                <Tab
                  icon={<Inventory sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={`Products (${productSales.length})`}
                />
              </Tabs>

              {/* All Purchases Tab */}
              {activeTab === 0 && (
                <Box>
                  {salesHistory.length > 0 ? (
                    <>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                          overflow: "hidden",
                          mb: 3,
                        }}
                      >
                        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            All Purchases
                          </Typography>
                        </Box>
                        <Divider />
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: "grey.50" }}>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Date
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Invoice
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Type
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Items
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Amount
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Payment
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Status
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {allPurchases.map((sale, index) => (
                                <TableRow
                                  key={sale.id}
                                  hover
                                  sx={{
                                    "&:last-child td": { border: 0 },
                                    transition: "background-color 0.2s",
                                  }}
                                >
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <CalendarMonth
                                        sx={{
                                          fontSize: 18,
                                          color: "text.secondary",
                                        }}
                                      />
                                      <Typography variant="body2">
                                        {formatDate(sale.created_at)}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.invoice_number}
                                      size="small"
                                      sx={{
                                        fontWeight: 600,
                                        bgcolor: "primary.50",
                                        color: "primary.main",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.sale_type}
                                      size="small"
                                      color={getSaleTypeColor(sale.sale_type)}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {sale.cylinder_items?.map((item, idx) => (
                                        <Chip
                                          key={idx}
                                          icon={
                                            <LocalGasStation
                                              sx={{ fontSize: 14 }}
                                            />
                                          }
                                          label={`Cyl x${item.quantity}`}
                                          size="small"
                                          variant="outlined"
                                          sx={{ fontSize: "0.75rem" }}
                                        />
                                      ))}
                                      {sale.items?.map((item, idx) => (
                                        <Chip
                                          key={idx}
                                          icon={
                                            <Inventory sx={{ fontSize: 14 }} />
                                          }
                                          label={`${item.product?.name} x${item.quantity}`}
                                          size="small"
                                          variant="outlined"
                                          sx={{ fontSize: "0.75rem" }}
                                        />
                                      ))}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: "success.main",
                                      }}
                                    >
                                      <FormattedAmount
                                        amount={sale.total_amount}
                                      />
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.payment_method}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={getPaymentStatusIcon(
                                        sale.payment_status,
                                      )}
                                      label={sale.payment_status}
                                      size="small"
                                      color={getPaymentStatusColor(
                                        sale.payment_status,
                                      )}
                                      sx={{ fontWeight: 500 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {salesHistory.length > itemsPerPage && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 2,
                              bgcolor: "grey.50",
                            }}
                          >
                            <Pagination
                              count={totalAllPages}
                              page={currentPage}
                              onChange={(e, page) => setCurrentPage(page)}
                              color="primary"
                              shape="rounded"
                            />
                          </Box>
                        )}
                      </Paper>
                    </>
                  ) : (
                    <Box sx={{ p: 6, textAlign: "center" }}>
                      <Receipt
                        sx={{ fontSize: 64, color: "grey.300", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No purchase history found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This customer hasn't made any purchases yet.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Cylinders Tab */}
              {activeTab === 1 && (
                <Box>
                  {cylinderSales.length > 0 ? (
                    <>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                          overflow: "hidden",
                          mb: 3,
                        }}
                      >
                        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Cylinder Purchases
                          </Typography>
                        </Box>
                        <Divider />
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: "grey.50" }}>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Date
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Invoice
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Type
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Details
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Amount
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Payment
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Status
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedCylinderSales.map((sale) => (
                                <TableRow key={sale.id} hover>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatDate(sale.created_at)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      fontWeight={500}
                                    >
                                      {sale.invoice_number}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.sale_type}
                                      size="small"
                                      color={getSaleTypeColor(sale.sale_type)}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ maxWidth: 300 }}>
                                    {renderCylinderDetails(sale.cylinder_items)}
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: "success.main",
                                      }}
                                    >
                                      <FormattedAmount
                                        amount={sale.total_amount}
                                      />
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.payment_method}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={getPaymentStatusIcon(
                                        sale.payment_status,
                                      )}
                                      label={sale.payment_status}
                                      size="small"
                                      color={getPaymentStatusColor(
                                        sale.payment_status,
                                      )}
                                      sx={{ fontWeight: 500 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {cylinderSales.length > itemsPerPage && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 2,
                              bgcolor: "grey.50",
                            }}
                          >
                            <Pagination
                              count={totalCylinderPages}
                              page={cylinderPage}
                              onChange={(e, page) => setCylinderPage(page)}
                              color="primary"
                              shape="rounded"
                            />
                          </Box>
                        )}
                      </Paper>
                    </>
                  ) : (
                    renderEmptyState("cylinders")
                  )}
                </Box>
              )}

              {/* Products Tab */}
              {activeTab === 2 && (
                <Box>
                  {productSales.length > 0 ? (
                    <>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                          overflow: "hidden",
                          mb: 3,
                        }}
                      >
                        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Product Purchases
                          </Typography>
                        </Box>
                        <Divider />
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: "grey.50" }}>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Date
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Invoice
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Type
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Details
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Amount
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Payment
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Status
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedProductSales.map((sale) => (
                                <TableRow key={sale.id} hover>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatDate(sale.created_at)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      fontWeight={500}
                                    >
                                      {sale.invoice_number}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.sale_type}
                                      size="small"
                                      color={getSaleTypeColor(sale.sale_type)}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ maxWidth: 300 }}>
                                    {renderProductDetails(sale.items)}
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: "success.main",
                                      }}
                                    >
                                      <FormattedAmount
                                        amount={sale.total_amount}
                                      />
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={sale.payment_method}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={getPaymentStatusIcon(
                                        sale.payment_status,
                                      )}
                                      label={sale.payment_status}
                                      size="small"
                                      color={getPaymentStatusColor(
                                        sale.payment_status,
                                      )}
                                      sx={{ fontWeight: 500 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {productSales.length > itemsPerPage && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 2,
                              bgcolor: "grey.50",
                            }}
                          >
                            <Pagination
                              count={totalProductPages}
                              page={productPage}
                              onChange={(e, page) => setProductPage(page)}
                              color="primary"
                              shape="rounded"
                            />
                          </Box>
                        )}
                      </Paper>
                    </>
                  ) : (
                    renderEmptyState("products")
                  )}
                </Box>
              )}

              {/* Recent Purchases Summary */}
              {salesHistory.length > 0 && (
                <Accordion
                  elevation={0}
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: "8px 8px 0 0",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <History />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Recent Purchase Summary
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {salesHistory.slice(0, 3).map((sale) => (
                        <Grid item xs={12} key={sale.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "grey.200",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "primary.50",
                              },
                            }}
                          >
                            <Grid container spacing={1} alignItems="center">
                              <Grid item xs={8}>
                                <Typography variant="body1" fontWeight={600}>
                                  {sale.invoice_number}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {formatDate(sale.created_at)}
                                </Typography>
                                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                  {sale.cylinder_items?.length > 0 && (
                                    <Chip
                                      size="small"
                                      label={`${
                                        sale.cylinder_items.length
                                      } cylinder${
                                        sale.cylinder_items.length > 1
                                          ? "s"
                                          : ""
                                      }`}
                                      icon={
                                        <LocalGasStation fontSize="small" />
                                      }
                                      variant="outlined"
                                    />
                                  )}
                                  {sale.items?.length > 0 && (
                                    <Chip
                                      size="small"
                                      label={`${sale.items.length} product${
                                        sale.items.length > 1 ? "s" : ""
                                      }`}
                                      icon={<Inventory fontSize="small" />}
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              </Grid>
                              <Grid item xs={4} sx={{ textAlign: "right" }}>
                                <Typography
                                  variant="h6"
                                  fontWeight={700}
                                  color="success.main"
                                >
                                  <FormattedAmount amount={sale.total_amount} />
                                </Typography>
                                <Chip
                                  label={sale.payment_status}
                                  size="small"
                                  color={
                                    sale.payment_status === "PAID"
                                      ? "success"
                                      : "warning"
                                  }
                                  sx={{ mt: 1, fontWeight: 500 }}
                                />
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          </Fade>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default CustomerExcerpt
