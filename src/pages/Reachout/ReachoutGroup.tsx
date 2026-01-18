// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { ToastContainer, toast } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tooltip,
  Fade,
  Collapse,
  LinearProgress,
} from "@mui/material"
import {
  Send,
  Email,
  Phone,
  Groups,
  Person,
  Business,
  LocationOn,
  Schedule,
  History,
  Attachment,
  Add,
  Close,
  CheckCircle,
  Error,
  Info,
  FilterList,
  Search,
  WhatsApp,
  Chat,
  Notifications,
  FormatListBulleted,
  FormatListNumbered,
  CloudUpload,
  Download,
  Print,
  Share,
  ContentCopy,
  ExpandMore,
  ChevronRight,
  AccessTime,
  CalendarToday,
  People,
  Storefront,
  DirectionsCar,
  TwoWheeler,
  Warning,
  AttachMoney,
  Receipt,
} from "@mui/icons-material"
import api from "../../../utils/api"
import DateDisplay from "../../components/DateDisplay"
import { fetchLocations, selectAllLocations } from "../../features/location/locationSlice"
import { fetchCustomers, selectAllCustomers } from "../../features/customers/customerSlice"
import { fetchEmployees, selectAllEmployees } from "../../features/employees/employeesSlice"

const ReachoutGroup = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

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

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const locations = useAppSelector(selectAllLocations)
  const customers = useAppSelector(selectAllCustomers)
  const employees = useAppSelector(selectAllEmployees)

  const [activeTab, setActiveTab] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showRecipientList, setShowRecipientList] = useState(false)
  const [communicationType, setCommunicationType] = useState("SMS")
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [scheduleSend, setScheduleSend] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [characterCount, setCharacterCount] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [messageHistory, setMessageHistory] = useState<any[]>([])
  const [openPreview, setOpenPreview] = useState(false)
  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 1,
      name: "Payment Reminder",
      content:
        "Dear customer, your payment of {amount} is due. Please make payment at your earliest convenience.",
    },
    {
      id: 2,
      name: "New Product",
      content:
        "Exciting news! We have launched new products. Visit us to explore!",
    },
    {
      id: 3,
      name: "Service Update",
      content: "Important service update: {details}",
    },
    {
      id: 4,
      name: "Holiday Greeting",
      content:
        "Season's greetings from {company}! Wishing you joy and prosperity.",
    },
    {
      id: 5,
      name: "Appointment Reminder",
      content: "Reminder: Your appointment is scheduled for {date} at {time}.",
    },
  ])

  // Stats
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalEmployees: 0,
    smsSent: 0,
    emailSent: 0,
    whatsappSent: 0,
  })

  useEffect(() => {
    dispatch(fetchLocations())
    dispatch(fetchCustomers())
    dispatch(fetchEmployees())

    // Load message history
    loadMessageHistory()

    // Calculate stats
    setStats({
      totalCustomers: customers.length,
      totalEmployees: employees.length,
      smsSent: 0, // You would fetch from API
      emailSent: 0,
      whatsappSent: 0,
    })
  }, [dispatch, customers.length, employees.length])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let formData = new FormData()
      formData.append("selected_group", selectedGroup)
      formData.append("selected_location", selectedLocation)
      formData.append("message", message)
      formData.append("communication_type", communicationType)
      formData.append("subject", subject)

      if (scheduleSend && scheduleDate && scheduleTime) {
        formData.append("schedule_date", scheduleDate)
        formData.append("schedule_time", scheduleTime)
      }

      // Add selected recipients
      if (selectedRecipients.length > 0) {
        formData.append("recipients", JSON.stringify(selectedRecipients))
      }

      // Add attachments
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      let endpoint = ""
      if (communicationType === "SMS") {
        endpoint = "/sendbulksms/"
      } else if (communicationType === "EMAIL") {
        endpoint = "/sendbulkemail/"
      } else if (communicationType === "WHATSAPP") {
        endpoint = "/sendbulkwhatsapp/"
      }

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 201) {
        toast.success(`${communicationType} sent successfully!`)
        setMessage("")
        setSubject("")
        setAttachments([])
        setSelectedRecipients([])
        setShowAlert(true)
        loadMessageHistory()

        setTimeout(() => setShowAlert(false), 5000)
      }
    } catch (error: any) {
      console.error("Send failed:", error)
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.")
      } else {
        toast.error(error.response?.data?.message || "Failed to send message")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadMessageHistory = async () => {
    try {
      const response = await api.get("/communication-history/")
      if (response.status === 200) {
        setMessageHistory(response.data)
      }
    } catch (error) {
      console.error("Failed to load message history:", error)
    }
  }

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group)
    let recipients: string[] = []

    if (group === "all") {
      recipients = [
        ...customers.map((c) => c.phone),
        ...employees.map((e) => e.phone),
      ]
    } else if (group === "wholesale") {
      recipients = customers
        .filter((c) => c.sales === "WHOLESALE")
        .map((c) => c.phone)
    } else if (group === "retail") {
      recipients = customers
        .filter((c) => c.sales === "RETAIL")
        .map((c) => c.phone)
    } else if (group === "debtors") {
      // Assuming debtors have a debt field
      recipients = customers
        .filter((c) => c.customer_debt?.some((d) => !d.cleared))
        .map((c) => c.phone)
    } else if (group === "employees") {
      recipients = employees.map((e) => e.phone)
    } else if (group === "custom") {
      setShowRecipientList(true)
      return
    }

    setSelectedRecipients(recipients)
  }

  const handleAddRecipient = (phone: string) => {
    if (!selectedRecipients.includes(phone)) {
      setSelectedRecipients([...selectedRecipients, phone])
    }
  }

  const handleRemoveRecipient = (phone: string) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r !== phone))
  }

  const handleAddManualRecipient = () => {
    const phone = prompt("Enter phone number:")
    if (phone && !selectedRecipients.includes(phone)) {
      setSelectedRecipients([...selectedRecipients, phone])
    }
  }

  const handleAddEmailRecipient = () => {
    const email = prompt("Enter email address:")
    if (email && !selectedRecipients.includes(email)) {
      setSelectedRecipients([...selectedRecipients, email])
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    setAttachments(newAttachments)
  }

  const handleTemplateSelect = (template: any) => {
    setMessage(template.content)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.toString().includes(searchQuery),
  )

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.toString().includes(searchQuery),
  )

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case "SMS":
        return <Phone fontSize="small" />
      case "EMAIL":
        return <Email fontSize="small" />
      case "WHATSAPP":
        return <WhatsApp fontSize="small" />
      default:
        return <Chat fontSize="small" />
    }
  }

  const getCommunicationColor = (type: string) => {
    switch (type) {
      case "SMS":
        return "primary"
      case "EMAIL":
        return "warning"
      case "WHATSAPP":
        return "success"
      default:
        return "default"
    }
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message)
    toast.success("Message copied to clipboard!")
  }

  return (
    <div>
      <ToastContainer />
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Communication Hub"}
            headerText={"Reach out to customers and employees efficiently"}
          />

          <main className="flex-grow p-2">
            {/* Stats Overview */}
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
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}
                  >
                    {stats.totalCustomers}
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
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    bgcolor: "background.paper",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "secondary.main", mb: 0.5 }}
                  >
                    {stats.totalEmployees}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Employees
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
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "success.main", mb: 0.5 }}
                  >
                    {stats.smsSent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SMS Sent
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
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "warning.main", mb: 0.5 }}
                  >
                    {stats.emailSent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Emails Sent
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Communication Type Tabs */}
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
                  },
                }}
              >
                <Tab
                  icon={<Phone />}
                  label="SMS"
                  onClick={() => setCommunicationType("SMS")}
                  iconPosition="start"
                />
                <Tab
                  icon={<Email />}
                  label="Email"
                  onClick={() => setCommunicationType("EMAIL")}
                  iconPosition="start"
                />
                <Tab
                  icon={<WhatsApp />}
                  label="WhatsApp"
                  onClick={() => setCommunicationType("WHATSAPP")}
                  iconPosition="start"
                />
                <Tab
                  icon={<History />}
                  label="History"
                  onClick={() => setShowHistory(!showHistory)}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            {/* Message History Panel */}
            <Collapse in={showHistory}>
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Message History
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setShowHistory(false)}
                  >
                    <Close />
                  </IconButton>
                </Box>

                {messageHistory.length === 0 ? (
                  <Box sx={{ textAlign: "center", p: 4 }}>
                    <History sx={{ fontSize: 48, color: "grey.300", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No message history yet
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {messageHistory.slice(0, 5).map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: `${getCommunicationColor(
                                  item.type,
                                )}.light`,
                              }}
                            >
                              {getCommunicationIcon(item.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {item.type} - {item.group}
                                </Typography>
                                <Chip
                                  label={item.status}
                                  size="small"
                                  color={
                                    item.status === "SENT" ? "success" : "error"
                                  }
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ mb: 1 }}
                                >
                                  {item.message.substring(0, 100)}...
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    <DateDisplay date={item.created_at} />
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {item.recipient_count} recipients
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < messageHistory.length - 1 && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Collapse>

            {/* Main Communication Form */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
              }}
            >
              <form onSubmit={handleSubmit}>
                {/* Communication Type */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Communication Type
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      icon={<Phone />}
                      label="SMS"
                      onClick={() => setCommunicationType("SMS")}
                      color={
                        communicationType === "SMS" ? "primary" : "default"
                      }
                      variant={
                        communicationType === "SMS" ? "filled" : "outlined"
                      }
                    />
                    <Chip
                      icon={<Email />}
                      label="Email"
                      onClick={() => setCommunicationType("EMAIL")}
                      color={
                        communicationType === "EMAIL" ? "warning" : "default"
                      }
                      variant={
                        communicationType === "EMAIL" ? "filled" : "outlined"
                      }
                    />
                    <Chip
                      icon={<WhatsApp />}
                      label="WhatsApp"
                      onClick={() => setCommunicationType("WHATSAPP")}
                      color={
                        communicationType === "WHATSAPP" ? "success" : "default"
                      }
                      variant={
                        communicationType === "WHATSAPP" ? "filled" : "outlined"
                      }
                    />
                  </Box>
                </Box>

                {/* Recipient Selection */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Select Recipients
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Add Phone Number">
                        <IconButton
                          size="small"
                          onClick={handleAddManualRecipient}
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add Email">
                        <IconButton
                          size="small"
                          onClick={handleAddEmailRecipient}
                        >
                          <Email fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Selected Recipients */}
                  {selectedRecipients.length > 0 && (
                    <Box
                      sx={{ mb: 2, p: 1, bgcolor: "grey.50", borderRadius: 1 }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: "block" }}
                      >
                        Selected: {selectedRecipients.length} recipients
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {selectedRecipients
                          .slice(0, 5)
                          .map((recipient, index) => (
                            <Chip
                              key={index}
                              label={recipient}
                              size="small"
                              onDelete={() => handleRemoveRecipient(recipient)}
                              variant="outlined"
                            />
                          ))}
                        {selectedRecipients.length > 5 && (
                          <Chip
                            label={`+${selectedRecipients.length - 5} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Group Selection */}
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Select Group</InputLabel>
                    <Select
                      value={selectedGroup}
                      label="Select Group"
                      onChange={(e) => handleGroupChange(e.target.value)}
                    >
                      <MenuItem value="">Choose Group</MenuItem>
                      <MenuItem value="all">All Contacts</MenuItem>
                      <MenuItem value="wholesale">Wholesale Customers</MenuItem>
                      <MenuItem value="retail">Retail Customers</MenuItem>
                      <MenuItem value="debtors">Customers with Debt</MenuItem>
                      <MenuItem value="employees">All Employees</MenuItem>
                      <MenuItem value="custom">Custom Selection</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Location Filter */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Location</InputLabel>
                    <Select
                      value={selectedLocation}
                      label="Filter by Location"
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <MenuItem value="all">All Locations</MenuItem>
                      {locations.map((loc) => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Custom Recipient List */}
                <Collapse in={showRecipientList}>
                  <Box
                    sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Select Individual Recipients
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setShowRecipientList(false)}
                      >
                        <Close />
                      </IconButton>
                    </Box>

                    {/* Search */}
                    <TextField
                      fullWidth
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="small"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Customer List */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Customers ({filteredCustomers.length})
                    </Typography>
                    <List
                      dense
                      sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}
                    >
                      {filteredCustomers.map((customer) => (
                        <ListItem
                          key={customer.id}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleAddRecipient(customer.phone)}
                              disabled={selectedRecipients.includes(
                                customer.phone,
                              )}
                            >
                              <Add />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor:
                                  customer.sales === "WHOLESALE"
                                    ? "primary.main"
                                    : "secondary.main",
                              }}
                            >
                              {customer.sales === "WHOLESALE" ? (
                                <Business />
                              ) : (
                                <Person />
                              )}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={customer.name}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  {customer.phone}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {customer.sales}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* Employee List */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Employees ({filteredEmployees.length})
                    </Typography>
                    <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                      {filteredEmployees.map((employee) => (
                        <ListItem
                          key={employee.id}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleAddRecipient(employee.phone)}
                              disabled={selectedRecipients.includes(
                                employee.phone,
                              )}
                            >
                              <Add />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "warning.main" }}>
                              <Person />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={employee.name}
                            secondary={
                              <Typography variant="caption">
                                {employee.phone}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>

                {/* Message Templates */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Quick Templates
                    </Typography>
                    <Tooltip title="Preview Message">
                      <IconButton
                        size="small"
                        onClick={() => setOpenPreview(true)}
                      >
                        <Chat />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {messageTemplates.map((template) => (
                      <Chip
                        key={template.id}
                        label={template.name}
                        size="small"
                        onClick={() => handleTemplateSelect(template)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Subject (for Email) */}
                {communicationType === "EMAIL" && (
                  <TextField
                    fullWidth
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    size="small"
                    sx={{ mb: 3 }}
                  />
                )}

                {/* Message Input */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Message
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {characterCount} characters
                      </Typography>
                      <Tooltip title="Copy Message">
                        <IconButton size="small" onClick={handleCopyMessage}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      setCharacterCount(e.target.value.length)
                    }}
                    required
                    placeholder="Type your message here..."
                    variant="outlined"
                  />
                </Box>

                {/* Attachments */}
                {(communicationType === "EMAIL" ||
                  communicationType === "WHATSAPP") && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Attachments
                    </Typography>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        sx={{ mr: 2 }}
                      >
                        Upload Files
                      </Button>
                    </label>

                    {attachments.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1, display: "block" }}
                        >
                          {attachments.length} file(s) attached
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {attachments.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              onDelete={() => handleRemoveAttachment(index)}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Schedule Send */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={scheduleSend}
                        onChange={(e) => setScheduleSend(e.target.checked)}
                      />
                    }
                    label="Schedule Send"
                  />

                  <Collapse in={scheduleSend}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
                </Box>

                {/* Submit Button */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setMessage("")
                      setSelectedRecipients([])
                      setAttachments([])
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Send />}
                    disabled={
                      isSubmitting ||
                      !message ||
                      selectedRecipients.length === 0
                    }
                    sx={{
                      px: 4,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      `Send ${communicationType}`
                    )}
                  </Button>
                </Box>

                {/* Alerts */}
                {showAlert && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Message sent successfully!
                  </Alert>
                )}
                {showError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Unauthorized. Please log in again.
                  </Alert>
                )}
              </form>
            </Paper>
          </main>

          {/* Preview Dialog */}
          <Dialog
            open={openPreview}
            onClose={() => setOpenPreview(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Message Preview</Typography>
                <IconButton onClick={() => setOpenPreview(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Paper sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {message || "No message to preview"}
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPreview(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <footer className="text-white">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default ReachoutGroup
