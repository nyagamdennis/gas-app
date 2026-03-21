// @ts-nocheck
import React, { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAllLocations } from "../location/locationSlice"
import api from "../../../utils/api"
import FormattedAmount from "../../components/FormattedAmount"
import {
  fetchCustomersHistory,
  selectAllCustomersHistory,
} from "./customerHistorySlice"

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
  Tooltip,
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
  TrendingUp,
  ShoppingBag,
  AttachMoney,
  CalendarMonth,
  Close,
  Warning,
  ExpandMore,
  ExpandLess,
  MoneyOff,
  AccountBalanceWallet,
  EventBusy,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material"
import { getSendSmsError, getSendSmsStatus, getSmsBalanceStatus, getSmsError, selectAllSmsMessages, sendSms } from "../sms/smsSlice"

const CustomerExcerpt = ({ customer }) => {
  const dispatch = useAppDispatch()
  const [smsState, setSmsState] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showDebtDetail, setShowDebtDetail] = useState(false)
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
  const salesHistory = useAppSelector(selectAllCustomersHistory)

  const location = locations.find((l) => l.id === customer.location)
  const phoneStr = customer?.phone?.toString()
  const debt = customer.debt_summary // from customers list API

  const cylinderSales = salesHistory.filter((s) => s.cylinder_items?.length > 0)
  const productSales = salesHistory.filter((s) => s.items?.length > 0)
  const salesWithDebt = salesHistory.filter(
    (s) => s.debt !== null && s.debt !== undefined,
  )

  const totalAllPages = Math.ceil(salesHistory.length / itemsPerPage)
  const totalCylinderPages = Math.ceil(cylinderSales.length / itemsPerPage)
  const totalProductPages = Math.ceil(productSales.length / itemsPerPage)


  const messages = useAppSelector(selectAllSmsMessages)
  const sendStatus = useAppSelector(getSendSmsStatus)
  const balance = useAppSelector(getSmsBalanceStatus)
  const sendSmsError = useAppSelector(getSendSmsError)

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const stats = {
    totalPurchases: salesHistory.length,
    totalAmount: salesHistory.reduce(
      (s, x) => s + parseFloat(x.total_amount || 0),
      0,
    ),
    cylinderSalesCount: cylinderSales.length,
    productSalesCount: productSales.length,
    avgPurchaseValue: salesHistory.length
      ? salesHistory.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0) /
        salesHistory.length
      : 0,
    outstandingBalance: parseFloat(debt?.total_remaining || 0),
  }

  const toggleHistory = () => {
    if (!showHistory) dispatch(fetchCustomersHistory({ id: customer.id }))
    setShowHistory(!showHistory)
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formatShortDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—"

  const getPaymentColor = (status) =>
    ({ PAID: "success", PENDING: "warning", PARTIAL: "info" }[status] ||
    "default")

  const getPaymentIcon = (status) =>
    ({
      PAID: <CheckCircle sx={{ fontSize: 16 }} />,
      PENDING: <Pending sx={{ fontSize: 16 }} />,
      PARTIAL: <AccessTime sx={{ fontSize: 16 }} />,
    }[status])

  const getDebtStatusColor = (status) =>
    ({
      PENDING: "#f59e0b",
      PARTIALLY_PAID: "#3b82f6",
      PAID: "#10b981",
      WRITTEN_OFF: "#6b7280",
    }[status] || "#6b7280")


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(sendSms({ recipient: phoneStr, message: message })).unwrap()
      setShowAlert(true)
      setMessage("")
    } catch (err) {
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  

  const isOverdue = debt?.has_overdue
  const headerGradient = isOverdue
    ? "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)"
    : customer.sales === "WHOLESALE"
    ? "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
    : "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)"

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* ── Header ── */}
        <Box
          sx={{
            background: headerGradient,
            borderRadius: 2,
            p: 3,
            mb: debt ? 0 : 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    color: "primary.main",
                    width: 56,
                    height: 56,
                  }}
                >
                  {customer.sales === "WHOLESALE" ? (
                    <Business sx={{ fontSize: 28 }} />
                  ) : (
                    <Person sx={{ fontSize: 28 }} />
                  )}
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "white", mb: 0.5 }}
                  >
                    {customer.name}
                    {isOverdue && (
                      <Chip
                        label="OVERDUE"
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor: "#fef08a",
                          color: "#854d0e",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                        }}
                      />
                    )}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={customer.sales}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 600,
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
                      <PhoneInTalkIcon sx={{ fontSize: 14 }} />
                      <Typography
                        variant="body2"
                        component="a"
                        href={`tel:${phoneStr}`}
                        sx={{ color: "inherit", textDecoration: "none" }}
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
                      <LocationOnIcon sx={{ fontSize: 14 }} />
                      <Typography variant="body2">
                        {location?.name || customer.location_name || "—"}
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
                <Tooltip title="Send SMS">
                  <IconButton
                    onClick={() => setSmsState(!smsState)}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "primary.main",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Purchase History">
                  <IconButton
                    onClick={toggleHistory}
                    sx={{
                      bgcolor: showHistory ? "white" : "rgba(255,255,255,0.9)",
                      color: "primary.main",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <History />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ── Debt Banner ── */}
        {debt && (
          <Box
            sx={{
              background: isOverdue ? "#fef2f2" : "#fffbeb",
              border: `1px solid ${isOverdue ? "#fca5a5" : "#fcd34d"}`,
              borderRadius: "0 0 12px 12px",
              px: 2,
              py: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isOverdue ? (
                  <ErrorOutline sx={{ color: "#dc2626", fontSize: 20 }} />
                ) : (
                  <MoneyOff sx={{ color: "#d97706", fontSize: 20 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isOverdue ? "#dc2626" : "#92400e",
                  }}
                >
                  {isOverdue ? "OVERDUE DEBT" : "OUTSTANDING DEBT"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: isOverdue ? "#dc2626" : "#b45309",
                  }}
                >
                  KES {parseFloat(debt.total_remaining).toLocaleString()}
                </Typography>
                {debt.nearest_due_date && (
                  <Chip
                    icon={<EventBusy sx={{ fontSize: 14 }} />}
                    label={`Due: ${formatShortDate(debt.nearest_due_date)}`}
                    size="small"
                    sx={{
                      bgcolor: isOverdue ? "#fee2e2" : "#fef3c7",
                      color: isOverdue ? "#dc2626" : "#92400e",
                      fontSize: "0.7rem",
                    }}
                  />
                )}
                {parseFloat(debt.total_deposited) > 0 && (
                  <Chip
                    icon={<AccountBalanceWallet sx={{ fontSize: 14 }} />}
                    label={`Deposited: KES ${parseFloat(
                      debt.total_deposited,
                    ).toLocaleString()}`}
                    size="small"
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#166534",
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={`${debt.pending_debts_count} invoice${
                    debt.pending_debts_count > 1 ? "s" : ""
                  }`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    borderColor: isOverdue ? "#fca5a5" : "#fcd34d",
                    color: isOverdue ? "#dc2626" : "#92400e",
                  }}
                />
                <Button
                  size="small"
                  endIcon={showDebtDetail ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => setShowDebtDetail(!showDebtDetail)}
                  sx={{
                    fontSize: "0.75rem",
                    color: isOverdue ? "#dc2626" : "#92400e",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {showDebtDetail ? "Hide" : "Details"}
                </Button>
              </Box>
            </Box>

            {/* Debt detail rows */}
            <Collapse in={showDebtDetail}>
              <Box sx={{ mt: 1.5 }}>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: isOverdue ? "#fca5a5" : "#fcd34d",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{ bgcolor: isOverdue ? "#fee2e2" : "#fef9c3" }}
                      >
                        {[
                          "Invoice",
                          "Original",
                          "Remaining",
                          "Deposited",
                          "Due Date",
                          "Status",
                          "Overdue",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              py: 0.75,
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {debt.debts.map((d) => (
                        <TableRow key={d.debt_id} hover>
                          <TableCell
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {d.invoice_number}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            KES {parseFloat(d.original_amount).toLocaleString()}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: d.is_overdue ? "#dc2626" : "#d97706",
                            }}
                          >
                            KES{" "}
                            {parseFloat(d.remaining_amount).toLocaleString()}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "0.75rem", color: "#16a34a" }}
                          >
                            {parseFloat(d.amount_deposited) > 0
                              ? `KES ${parseFloat(
                                  d.amount_deposited,
                                ).toLocaleString()}`
                              : "—"}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>
                            {formatShortDate(d.repayment_date)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={d.status.replace("_", " ")}
                              size="small"
                              sx={{
                                fontSize: "0.65rem",
                                height: 20,
                                bgcolor: `${getDebtStatusColor(d.status)}20`,
                                color: getDebtStatusColor(d.status),
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {d.is_overdue ? (
                              <Chip
                                label={`${d.days_overdue}d late`}
                                size="small"
                                sx={{
                                  fontSize: "0.65rem",
                                  height: 20,
                                  bgcolor: "#fee2e2",
                                  color: "#dc2626",
                                  fontWeight: 700,
                                }}
                              />
                            ) : (
                              <CheckCircleOutline
                                sx={{ fontSize: 16, color: "#10b981" }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* SMS debt reminder button */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<SendIcon sx={{ fontSize: 14 }} />}
                    onClick={() => {
                      setMessage(
                        `Dear ${
                          customer.name
                        }, you have an outstanding balance of KES ${parseFloat(
                          debt.total_remaining,
                        ).toLocaleString()} due on ${formatShortDate(
                          debt.nearest_due_date,
                        )}. Please make payment at your earliest convenience.`,
                      )
                      setSmsState(true)
                    }}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "none",
                      borderColor: isOverdue ? "#dc2626" : "#d97706",
                      color: isOverdue ? "#dc2626" : "#d97706",
                    }}
                  >
                    Send Debt Reminder
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Box>
        )}

        {/* ── SMS Form ── */}
        <Collapse in={smsState}>
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
                  Send Message to {customer.name}
                </Typography>
                <IconButton size="small" onClick={() => setSmsState(false)}>
                  <Close />
                </IconButton>
              </Box>
              <TextField
                inputRef={messageTextareaRef}
                placeholder="Type your message..."
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={message}
                required
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { bgcolor: "white" } }}
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
                  Sending to: <strong>{phoneStr}</strong>
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
                  sx={{ mt: 2 }}
                  onClose={() => setShowAlert(false)}
                >
                  Sent successfully!
                </Alert>
              )}
              {showError && (
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                  onClose={() => setShowError(false)}
                >
                  {sendSmsError || "Failed to send. Please try again."}
                </Alert>
              )}
            </form>
          </Paper>
        </Collapse>

        {/* ── Purchase History ── */}
        <Collapse in={showHistory}>
          <Fade in={showHistory}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Customer Overview
              </Typography>

              {/* Stats row */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  {
                    label: "Total Orders",
                    value: stats.totalPurchases,
                    color: "primary.main",
                    bg: "primary.50",
                    icon: <ShoppingBag />,
                  },
                  {
                    label: "Total Revenue",
                    value: `KES ${stats.totalAmount.toLocaleString()}`,
                    color: "success.main",
                    bg: "success.50",
                    icon: <AttachMoney />,
                  },
                  {
                    label: "Avg Order",
                    value: `KES ${Math.round(
                      stats.avgPurchaseValue,
                    ).toLocaleString()}`,
                    color: "warning.main",
                    bg: "warning.50",
                    icon: <Receipt />,
                  },
                  {
                    label: "Outstanding",
                    value: `KES ${stats.outstandingBalance.toLocaleString()}`,
                    color:
                      stats.outstandingBalance > 0
                        ? "error.main"
                        : "success.main",
                    bg:
                      stats.outstandingBalance > 0 ? "error.50" : "success.50",
                    icon: <Warning />,
                  },
                ].map((s) => (
                  <Grid item xs={6} md={3} key={s.label}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        textAlign: "center",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          bgcolor: s.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 1,
                        }}
                      >
                        {React.cloneElement(s.icon, { sx: { color: s.color } })}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: s.color, mb: 0.25 }}
                      >
                        {s.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  mb: 3,
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
                }}
              >
                <Tab
                  icon={<Receipt sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label={`All (${salesHistory.length})`}
                />
                <Tab
                  icon={<LocalGasStation sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label={`Cylinders (${cylinderSales.length})`}
                />
                <Tab
                  icon={<Inventory sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label={`Products (${productSales.length})`}
                />
                <Tab
                  icon={<MoneyOff sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label={`Debts (${salesWithDebt.length})`}
                  sx={{
                    color: salesWithDebt.length > 0 ? "error.main" : "inherit",
                  }}
                />
              </Tabs>

              {/* All tab */}
              {activeTab === 0 && (
                <SalesTable
                  data={paginate(salesHistory, currentPage)}
                  showDebt
                  formatDate={formatDate}
                  formatShortDate={formatShortDate}
                  getPaymentColor={getPaymentColor}
                  getPaymentIcon={getPaymentIcon}
                  getDebtStatusColor={getDebtStatusColor}
                />
              )}
              {activeTab === 0 && salesHistory.length > itemsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Pagination
                    count={totalAllPages}
                    page={currentPage}
                    onChange={(_, p) => setCurrentPage(p)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}

              {/* Cylinders tab */}
              {activeTab === 1 &&
                (cylinderSales.length === 0 ? (
                  <EmptyState type="cylinders" />
                ) : (
                  <>
                    <SalesTable
                      data={paginate(cylinderSales, cylinderPage)}
                      showDebt
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      getPaymentColor={getPaymentColor}
                      getPaymentIcon={getPaymentIcon}
                      getDebtStatusColor={getDebtStatusColor}
                    />
                    {cylinderSales.length > itemsPerPage && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <Pagination
                          count={totalCylinderPages}
                          page={cylinderPage}
                          onChange={(_, p) => setCylinderPage(p)}
                          color="primary"
                          shape="rounded"
                        />
                      </Box>
                    )}
                  </>
                ))}

              {/* Products tab */}
              {activeTab === 2 &&
                (productSales.length === 0 ? (
                  <EmptyState type="products" />
                ) : (
                  <>
                    <SalesTable
                      data={paginate(productSales, productPage)}
                      showDebt
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      getPaymentColor={getPaymentColor}
                      getPaymentIcon={getPaymentIcon}
                      getDebtStatusColor={getDebtStatusColor}
                    />
                    {productSales.length > itemsPerPage && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <Pagination
                          count={totalProductPages}
                          page={productPage}
                          onChange={(_, p) => setProductPage(p)}
                          color="primary"
                          shape="rounded"
                        />
                      </Box>
                    )}
                  </>
                ))}

              {/* Debts tab */}
              {activeTab === 3 &&
                (salesWithDebt.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: "center" }}>
                    <CheckCircleOutline
                      sx={{ fontSize: 64, color: "success.light", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      No outstanding debts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This customer has cleared all balances.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {salesWithDebt.map((sale) => (
                      <DebtCard
                        key={sale.id}
                        sale={sale}
                        formatDate={formatDate}
                        formatShortDate={formatShortDate}
                        getDebtStatusColor={getDebtStatusColor}
                      />
                    ))}
                  </Box>
                ))}
            </Box>
          </Fade>
        </Collapse>
      </CardContent>
    </Card>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

const SalesTable = ({
  data,
  showDebt,
  formatDate,
  formatShortDate,
  getPaymentColor,
  getPaymentIcon,
  getDebtStatusColor,
}) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 2,
      border: "1px solid",
      borderColor: "grey.200",
      overflow: "hidden",
      mb: 2,
    }}
  >
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            {[
              "Date",
              "Invoice",
              "Items",
              "Amount",
              "Paid",
              "Status",
              ...(showDebt ? ["Debt"] : []),
            ].map((h) => (
              <TableCell
                key={h}
                sx={{ fontWeight: 700, fontSize: "0.75rem", py: 1 }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((sale) => (
            <TableRow
              key={sale.id}
              hover
              sx={{ "&:last-child td": { border: 0 } }}
            >
              <TableCell sx={{ fontSize: "0.75rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarMonth
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  {formatDate(sale.created_at)}
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
                    fontSize: "0.7rem",
                  }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {sale.cylinder_items?.map((item, i) => (
                    <Chip
                      key={i}
                      icon={<LocalGasStation sx={{ fontSize: 12 }} />}
                      label={`Cyl ×${item.quantity}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.65rem" }}
                    />
                  ))}
                  {sale.items?.map((item, i) => (
                    <Chip
                      key={i}
                      icon={<Inventory sx={{ fontSize: 12 }} />}
                      label={`${item.product?.name} ×${item.quantity}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.65rem" }}
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "success.main",
                  fontSize: "0.8rem",
                }}
              >
                KES {parseFloat(sale.total_amount).toLocaleString()}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                KES {parseFloat(sale.amount_paid).toLocaleString()}
              </TableCell>
              <TableCell>
                <Chip
                  icon={getPaymentIcon(sale.payment_status)}
                  label={sale.payment_status}
                  size="small"
                  color={getPaymentColor(sale.payment_status)}
                  sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                />
              </TableCell>
              {showDebt && (
                <TableCell>
                  {sale.debt ? (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#dc2626",
                          display: "block",
                        }}
                      >
                        KES{" "}
                        {parseFloat(
                          sale.debt.remaining_amount,
                        ).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due: {formatShortDate(sale.debt.repayment_date)}
                      </Typography>
                    </Box>
                  ) : (
                    <CheckCircleOutline
                      sx={{ fontSize: 18, color: "success.main" }}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
)

const DebtCard = ({
  sale,
  formatDate,
  formatShortDate,
  getDebtStatusColor,
}) => {
  const debt = sale.debt
  const isOverdue =
    debt.repayment_date && new Date(debt.repayment_date) < new Date()
  const daysOverdue = isOverdue
    ? Math.floor((new Date() - new Date(debt.repayment_date)) / 86400000)
    : 0
  const paidPercent = Math.round(
    (parseFloat(debt.amount_paid) / parseFloat(debt.original_amount)) * 100,
  )

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${isOverdue ? "#fca5a5" : "#fcd34d"}`,
        bgcolor: isOverdue ? "#fff7f7" : "#fffdf0",
      }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Receipt sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {sale.invoice_number}
            </Typography>
            {isOverdue && (
              <Chip
                label={`${daysOverdue}d overdue`}
                size="small"
                sx={{
                  bgcolor: "#fee2e2",
                  color: "#dc2626",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1.5 }}
          >
            Sold: {formatDate(sale.created_at)}
          </Typography>

          {/* Items sold */}
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
            {sale.cylinder_items?.map((item, i) => (
              <Chip
                key={i}
                icon={<LocalGasStation sx={{ fontSize: 12 }} />}
                label={`${item.cylinder?.weight}kg ×${item.quantity}`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
            {sale.items?.map((item, i) => (
              <Chip
                key={i}
                icon={<Inventory sx={{ fontSize: 12 }} />}
                label={`${item.product?.name} ×${item.quantity}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={1}>
            {[
              {
                label: "Sale Total",
                value: `KES ${parseFloat(sale.total_amount).toLocaleString()}`,
                color: "text.primary",
              },
              {
                label: "Amount Paid",
                value: `KES ${parseFloat(sale.amount_paid).toLocaleString()}`,
                color: "success.main",
              },
              {
                label: "Debt Amount",
                value: `KES ${parseFloat(
                  debt.original_amount,
                ).toLocaleString()}`,
                color: "#d97706",
              },
              {
                label: "Still Owed",
                value: `KES ${parseFloat(
                  debt.remaining_amount,
                ).toLocaleString()}`,
                color: isOverdue ? "#dc2626" : "#d97706",
              },
            ].map((row) => (
              <Grid item xs={6} key={row.label}>
                <Box
                  sx={{
                    p: 1,
                    bgcolor: "white",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: row.color }}
                  >
                    {row.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Progress bar */}
          <Box sx={{ mt: 1.5 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                Repayment progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {paidPercent}%
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: "grey.200",
                borderRadius: 1,
                height: 8,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor:
                    paidPercent === 100
                      ? "#10b981"
                      : isOverdue
                      ? "#dc2626"
                      : "#f59e0b",
                  height: "100%",
                  width: `${paidPercent}%`,
                  borderRadius: 1,
                  transition: "width 0.4s ease",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EventBusy
                sx={{ fontSize: 14, color: isOverdue ? "#dc2626" : "#d97706" }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: isOverdue ? "#dc2626" : "#d97706",
                  fontWeight: 600,
                }}
              >
                Due: {formatShortDate(debt.repayment_date)}
              </Typography>
            </Box>
            <Chip
              label={debt.status.replace("_", " ")}
              size="small"
              sx={{
                bgcolor: `${getDebtStatusColor(debt.status)}20`,
                color: getDebtStatusColor(debt.status),
                fontWeight: 700,
                fontSize: "0.65rem",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

const EmptyState = ({ type }) => (
  <Box sx={{ p: 6, textAlign: "center" }}>
    {type === "cylinders" ? (
      <LocalGasStation sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
    ) : (
      <Inventory sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
    )}
    <Typography variant="h6" color="text.secondary">
      No {type} purchases
    </Typography>
    <Typography variant="body2" color="text.secondary">
      This customer hasn't purchased any {type} yet.
    </Typography>
  </Box>
)

export default CustomerExcerpt
