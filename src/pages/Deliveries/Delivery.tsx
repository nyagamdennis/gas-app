// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import BadgeIcon from "@mui/icons-material/Badge"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler"
import SaveIcon from "@mui/icons-material/Save"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import PersonIcon from "@mui/icons-material/Person"
import EngineeringIcon from "@mui/icons-material/Engineering"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import SpeedIcon from "@mui/icons-material/Speed"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import PaymentIcon from "@mui/icons-material/Payment"
import StorefrontIcon from "@mui/icons-material/Storefront"
import LocalAtmIcon from "@mui/icons-material/LocalAtm"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addVehicle,
  deleteVehicle,
  fetchVehicles,
  getAllVehicles,
  updateVehicle,
} from "../../features/deliveries/vehiclesSlice"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import { toast, ToastContainer } from "react-toastify"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import {
  fetchStore,
  selectAllStore,
  getStoreStatus,
} from "../../features/store/storeSlice"
import api from "../../../utils/api"
import { RefreshCwIcon } from "lucide-react"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Delivery = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const navigate = useNavigate()
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

  // Delivery assignment state
  const [selectedDriver, setSelectedDriver] = useState("")
  const [selectedDriverName, setSelectedDriverName] = useState("")
  const [selectedDriverMotorbike, setSelectedDriverMotorbike] = useState(null)
  const [showSourceModal, setShowSourceModal] = useState(false)
  const [sourceType, setSourceType] = useState(null) // 'shop', 'vehicle', 'store'
  const [selectedSource, setSelectedSource] = useState(null)
  const [availableCylinders, setAvailableCylinders] = useState([])
  const [availableProducts, setAvailableProducts] = useState([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [cartCylinders, setCartCylinders] = useState([
    { productId: "", quantity: 1, customPrice: "" },
  ])
  const [cartProducts, setCartProducts] = useState([
    { productId: "", quantity: 1, customPrice: "" },
  ])
  const [deliveries, setDeliveries] = useState([])
  const [loadingDeliveries, setLoadingDeliveries] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // NEW: Delivery type (wholesale or retail)
  const [deliveryType, setDeliveryType] = useState("RETAIL") // "RETAIL" or "WHOLESALE"

  // Existing vehicle management state (keep for compatibility)
  const [vehicleType, setVehicleType] = useState("MOTORBIKE")
  const [numberPlate, setNumberPlate] = useState("")
  const [engineCC, setEngineCC] = useState("")
  const [driver, setDriver] = useState("")
  const [conductor, setConductor] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [delting, setDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteVehicleNumber, setDeleteVehicleNumber] = useState("")
  const [deleteVehicleType, setDeleteVehicleType] = useState("")
  const [openAssignedModal, setOpenAssignedModal] = useState(false)
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState(null)
  const [editVehicleType, setEditVehicleType] = useState("MOTORBIKE")
  const [editNumberPlate, setEditNumberPlate] = useState("")
  const [editEngineCC, setEditEngineCC] = useState("")
  const [editDriver, setEditDriver] = useState("")
  const [editConductor, setEditConductor] = useState("")
  const [editing, setEditing] = useState(false)

  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  // Data from Redux
  const all_vehicles = useAppSelector(getAllVehicles)
  const all_employees = useAppSelector(selectAllEmployees)
  const motorbikeEmployees = useMemo(() => {
    return all_employees.filter(
      (employee) => employee.assigned_to?.type === "MOTORBIKE",
    )
  }, [all_employees])

  const allShops = useAppSelector(selectAllSalesTeamShops)
  const allVehicles = useAppSelector(selectAllSalesTeamVehicle)
  const allStores = useAppSelector(selectAllStore)
  const storeStatus = useAppSelector(getStoreStatus)

  // Filter only motorbikes for driver assignment
  const motorbikes = all_vehicles.filter(
    (v) => v.type_of_vehicle === "MOTORBIKE",
  )

  // Fetch data on mount
  useEffect(() => {
    if (!businessId) return
    dispatch(fetchVehicles({ businessId }))
    dispatch(fetchEmployees({ businessId }))
    dispatch(fetchSalesTeamShops())
    dispatch(fetchSalesTeamVehicle())
    dispatch(fetchStore({ businessId }))
    fetchDeliveries()
  }, [dispatch, businessId])

  // Fetch deliveries from backend
  const fetchDeliveries = async () => {
    setLoadingDeliveries(true)
    try {
      const response = await api.get("vehicle/deliveries/")
      setDeliveries(response.data)
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
      toast.error("Could not load deliveries")
    } finally {
      setLoadingDeliveries(false)
    }
  }

  const [selectedDriverInfo, setSelectedDriverInfo] = useState(null)
  // When driver changes, find their assigned motorbike
  useEffect(() => {
    if (selectedDriver) {
      const employee = all_employees.find(
        (emp) => emp.id === parseInt(selectedDriver),
      )
      if (employee) {
        setSelectedDriverName(`${employee.first_name} ${employee.last_name}`)
        setSelectedDriverInfo(employee)
        // Find motorbike assigned to this driver
        const bike = motorbikes.find((v) => v.driver?.id === employee.id)
        setSelectedDriverMotorbike(bike || null)
      } else {
        setSelectedDriverName("")
        setSelectedDriverMotorbike(null)
      }
    } else {
      setSelectedDriverName("")
      setSelectedDriverMotorbike(null)
    }
  }, [selectedDriver, all_employees, motorbikes])

  // Load cylinders/products when source is selected
  const loadItemsFromSource = async () => {
    if (!selectedSource) return
    setIsLoadingItems(true)
    try {
      let cylindersRes, productsRes
      if (sourceType === "shop") {
        cylindersRes = await api.get(
          `/inventory/shops/${selectedSource.id}/cylinders/`,
        )
        productsRes = await api.get(
          `/inventory/shops/${selectedSource.id}/products/`,
        )
      } else if (sourceType === "vehicle") {
        cylindersRes = await api.get(
          `/inventory/vehicles/${selectedSource.id}/cylinders/`,
        )
        productsRes = await api.get(
          `/inventory/vehicles/${selectedSource.id}/products/`,
        )
      } else {
        cylindersRes = await api.get(
          `/inventory/stores/${selectedSource.id}/cylinders/`,
        )
        productsRes = await api.get(
          `/inventory/stores/${selectedSource.id}/products/`,
        )
      }
      setAvailableCylinders(cylindersRes.data || [])
      setAvailableProducts(productsRes.data || [])
      toast.success(`Loaded from ${selectedSource.name}`)
    } catch (error) {
      console.error("Failed to load items:", error)
      toast.error("Could not load cylinders/products from this source")
    } finally {
      setIsLoadingItems(false)
    }
  }

  useEffect(() => {
    if (selectedSource) {
      loadItemsFromSource()
    }
  }, [selectedSource])

  // Cart handlers for cylinders
  const handleAddCylinder = () => {
    setCartCylinders([
      ...cartCylinders,
      { productId: "", quantity: 1, customPrice: "" },
    ])
  }
  const handleRemoveCylinder = (index) => {
    if (cartCylinders.length > 1) {
      setCartCylinders(cartCylinders.filter((_, i) => i !== index))
    }
  }
  const handleCylinderChange = (index, field, value) => {
    setCartCylinders((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    )
  }

  // Cart handlers for products
  const handleAddProduct = () => {
    setCartProducts([
      ...cartProducts,
      { productId: "", quantity: 1, customPrice: "" },
    ])
  }
  const handleRemoveProduct = (index) => {
    if (cartProducts.length > 1) {
      setCartProducts(cartProducts.filter((_, i) => i !== index))
    }
  }
  const handleProductChange = (index, field, value) => {
    setCartProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    )
  }

  // Helper to get default price based on delivery type
  const getDefaultCylinderPrice = (cylinder) => {
    if (deliveryType === "RETAIL") {
      return cylinder.retail_refil_price || 0
    } else {
      return cylinder.wholesale_refill_price || 0
    }
  }

  const getDefaultProductPrice = (product) => {
    if (deliveryType === "RETAIL") {
      return product.prices?.retail_sales_price || 0
    } else {
      return product.prices?.whole_sales_price || 0
    }
  }

  // Calculate cart total using delivery type for fallback
  const calculateCartTotal = () => {
    let total = 0
    cartCylinders.forEach((item) => {
      const product = availableCylinders.find(
        (p) => p.id === parseInt(item.productId),
      )
      if (product) {
        const price = item.customPrice
          ? parseFloat(item.customPrice)
          : getDefaultCylinderPrice(product)
        total += price * item.quantity
      }
    })
    cartProducts.forEach((item) => {
      const product = availableProducts.find(
        (p) => p.id === parseInt(item.productId),
      )
      if (product) {
        const price = item.customPrice
          ? parseFloat(item.customPrice)
          : getDefaultProductPrice(product)
        total += price * item.quantity
      }
    })
    return total
  }

  // Submit delivery assignment
  const handleAssignDelivery = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver")
      return
    }
    if (!selectedSource) {
      toast.error("Please select a source (shop/vehicle/store)")
      return
    }
    if (
      cartCylinders.every((c) => !c.productId) &&
      cartProducts.every((p) => !p.productId)
    ) {
      toast.error("Please add at least one cylinder or product")
      return
    }

    setSubmitting(true)
    const payload = {
      driver_id: parseInt(selectedDriver),
      motorbike_id: selectedDriverMotorbike?.id || null,
      source_type: sourceType,
      source_id: selectedSource.id,
      delivery_type: deliveryType, // include delivery type
      cylinders: cartCylinders
        .filter((c) => c.productId)
        .map((c) => ({
          cylinder_id: parseInt(c.productId),
          quantity: c.quantity,
          custom_price: c.customPrice ? parseFloat(c.customPrice) : null,
        })),
      products: cartProducts
        .filter((p) => p.productId)
        .map((p) => ({
          product_id: parseInt(p.productId),
          quantity: p.quantity,
          custom_price: p.customPrice ? parseFloat(p.customPrice) : null,
        })),
      assigned_at: new Date().toISOString(),
    }

    try {
      await api.post("vehicle/deliveries/", payload)
      toast.success("Delivery assigned successfully!")
      // Reset cart and source
      setCartCylinders([{ productId: "", quantity: 1, customPrice: "" }])
      setCartProducts([{ productId: "", quantity: 1, customPrice: "" }])
      setSelectedSource(null)
      setSourceType(null)
      setAvailableCylinders([])
      setAvailableProducts([])
      fetchDeliveries() // Refresh list
    } catch (error) {
      console.error("Assignment failed:", error)
      toast.error("Failed to assign delivery")
    } finally {
      setSubmitting(false)
    }
  }

  // Source selection modal handlers
  const openSourceModal = (type) => {
    setSourceType(type)
    setShowSourceModal(true)
  }

  const selectSource = (source) => {
    setSelectedSource(source)
    setShowSourceModal(false)
  }

  // Helper to get source display name
  const getSourceDisplay = () => {
    if (!selectedSource) return "None"
    return `${selectedSource.name} (${
      sourceType === "shop"
        ? "Shop"
        : sourceType === "vehicle"
        ? "Vehicle"
        : "Store"
    })`
  }

  console.log("Available products:", availableProducts)
  // Updated row renderers with clickable price chips
  const renderCylinderRow = (item, idx) => {
    const selectedProduct = availableCylinders.find(
      (p) => p.id === parseInt(item.productId),
    )
    const retailPrice = selectedProduct?.cylinder?.retail_refill_price || 0
    const wholesalePrice =
      selectedProduct?.cylinder?.wholesale_refill_price || 0

    return (
      <div key={idx} className="bg-blue-50 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <select
              value={item.productId}
              onChange={(e) =>
                handleCylinderChange(idx, "productId", e.target.value)
              }
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="">Select cylinder</option>
              {availableCylinders.map((cyl) => (
                <option key={cyl.id} value={cyl.cylinder?.id}>
                  {cyl.cylinder?.display_name || `Cylinder ${cyl.id}`} -{" "}
                  {cyl.full_cylinder_quantity || 0} in stock
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="flex gap-2 mb-2 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    handleCylinderChange(idx, "customPrice", retailPrice)
                  }
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200 transition"
                >
                  Retail: Ksh {retailPrice.toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCylinderChange(idx, "customPrice", wholesalePrice)
                  }
                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium hover:bg-orange-200 transition"
                >
                  Wholesale: Ksh {wholesalePrice.toLocaleString()}
                </button>
                {item.customPrice && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                    Custom: Ksh {parseFloat(item.customPrice).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleCylinderChange(
                    idx,
                    "quantity",
                    parseInt(e.target.value) || 1,
                  )
                }
                className="w-20 p-2 border rounded-lg"
                min="1"
              />
              <input
                type="number"
                placeholder="Custom price (optional)"
                value={item.customPrice}
                onChange={(e) =>
                  handleCylinderChange(idx, "customPrice", e.target.value)
                }
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={() => handleRemoveCylinder(idx)}
            className="text-red-500 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  const renderProductRow = (item, idx) => {
    const selectedProduct = availableProducts.find(
      (p) => p.id === parseInt(item.productId),
    )
    const retailPrice =
      selectedProduct?.product?.prices?.retail_sales_price || 0
    const wholesalePrice =
      selectedProduct?.product?.prices?.whole_sales_price || 0

    return (
      <div key={idx} className="bg-green-50 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <select
              value={item.productId}
              onChange={(e) =>
                handleProductChange(idx, "productId", e.target.value)
              }
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="">Select product</option>
              {availableProducts.map((prod) => (
                <option key={prod.id} value={prod.product?.id}>
                  {prod.product?.name || `Product ${prod.id}`} -{" "}
                  {prod.quantity || 0} in stock
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="flex gap-2 mb-2 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    handleProductChange(idx, "customPrice", retailPrice)
                  }
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200 transition"
                >
                  Retail: Ksh {retailPrice.toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleProductChange(idx, "customPrice", wholesalePrice)
                  }
                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium hover:bg-orange-200 transition"
                >
                  Wholesale: Ksh {wholesalePrice.toLocaleString()}
                </button>
                {item.customPrice && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                    Custom: Ksh {parseFloat(item.customPrice).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(
                    idx,
                    "quantity",
                    parseInt(e.target.value) || 1,
                  )
                }
                className="w-20 p-2 border rounded-lg"
                min="1"
              />
              <input
                type="number"
                placeholder="Custom price (optional)"
                value={item.customPrice}
                onChange={(e) =>
                  handleProductChange(idx, "customPrice", e.target.value)
                }
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={() => handleRemoveProduct(idx)}
            className="text-red-500 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  // Existing vehicle management handlers (unchanged but keep for compatibility)
  const handleShowForm = () => {
    setShowForm((prev) => {
      const newShowForm = !prev
      if (newShowForm) {
        dispatch(fetchEmployees({ businessId }))
      }
      return newShowForm
    })
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = {
      business: businessId,
      type_of_vehicle: vehicleType,
      number_plate: numberPlate,
      engine_size: engineCC,
      driver: driver,
      conductor: vehicleType === "VEHICLE" ? conductor : undefined,
    }
    try {
      await dispatch(addVehicle(formData)).unwrap()
      toast.success("Vehicle added successfully!")
      setVehicleType("MOTORBIKE")
      setNumberPlate("")
      setEngineCC("")
      setDriver("")
      setConductor("")
      setShowForm(false)
    } catch (error: any) {
      toast.error(error || "Failed to add vehicle. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenDeleteVehicle = (id, vehicle_number, type_of_vehicle) => {
    setDeleteId(id)
    setDeleteVehicleNumber(vehicle_number)
    setDeleteVehicleType(type_of_vehicle)
    setOpen(true)
  }

  const handleDeleteThisVehicle = async () => {
    setDeleting(true)
    try {
      await dispatch(deleteVehicle(deleteId)).unwrap()
      toast.success("Vehicle deleted successfully!")
      setOpen(false)
    } catch (error) {
      toast.error(error || "Failed to delete vehicle. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  const getVehicleIcon = (type) => {
    return type === "MOTORBIKE" ? <TwoWheelerIcon /> : <DirectionsCarIcon />
  }

  const getVehicleColor = (type) => {
    return type === "MOTORBIKE" ? "bg-blue-500" : "bg-purple-500"
  }

  const getVehicleBgColor = (type) => {
    return type === "MOTORBIKE" ? "bg-blue-50" : "bg-purple-50"
  }

  const handleEmployeeSelection = (employee, setter) => {
    if (employee?.assigned_to?.type && employee?.assigned_to?.name) {
      setSelectedEmployeeForModal(employee)
      setOpenAssignedModal(true)
    }
    setter(employee.id)
  }

  const getEmployeeDisplayText = (employee) => {
    const name = `${employee.first_name} ${employee.last_name}`
    if (employee.assigned_to?.type && employee.assigned_to?.name) {
      return `${name} (Assigned to ${employee.assigned_to.type}: ${employee.assigned_to.name})`
    }
    return name
  }

  const driverOptions = all_employees.filter(
    (emp) => emp.id !== Number(conductor),
  )
  const conductorOptions = all_employees.filter(
    (emp) => emp.id !== Number(driver),
  )

  const handleEditClick = (vehicle) => {
    setEditVehicle(vehicle)
    setEditVehicleType(vehicle.type_of_vehicle)
    setEditNumberPlate(vehicle.number_plate)
    setEditEngineCC(vehicle.engine_size)
    setEditDriver(vehicle.driver?.id || "")
    setEditConductor(vehicle.conductor?.id || "")
    setEditOpen(true)
  }

  const handleUpdateVehicle = (vehicle) => {
    handleEditClick(vehicle)
  }

  const handleEditDriverChange = (empId) => {
    const employee = all_employees.find((emp) => emp.id === Number(empId))
    if (employee) {
      if (employee?.assigned_to?.type && employee?.assigned_to?.name) {
        setSelectedEmployeeForModal(employee)
        setOpenAssignedModal(true)
      }
      setEditDriver(employee.id)
    } else {
      setEditDriver(empId)
    }
  }

  const handleEditConductorChange = (empId) => {
    const employee = all_employees.find((emp) => emp.id === Number(empId))
    if (employee) {
      if (employee?.assigned_to?.type && employee?.assigned_to?.name) {
        setSelectedEmployeeForModal(employee)
        setOpenAssignedModal(true)
      }
      setEditConductor(employee.id)
    } else {
      setEditConductor(empId)
    }
  }

  const driverOptionsEdit = all_employees.filter(
    (emp) => emp.id !== Number(editConductor),
  )
  const conductorOptionsEdit = all_employees.filter(
    (emp) => emp.id !== Number(editDriver),
  )

  const handleEditSubmit = async () => {
    setEditing(true)
    const formData = {
      id: editVehicle.id,
      business: businessId,
      type_of_vehicle: editVehicleType,
      number_plate: editNumberPlate,
      engine_size: editEngineCC,
      driver: editDriver,
      conductor: editVehicleType === "VEHICLE" ? editConductor : undefined,
    }
    try {
      await dispatch(updateVehicle(formData)).unwrap()
      toast.success("Vehicle updated successfully!")
      setEditOpen(false)
      dispatch(fetchVehicles({ businessId }))
    } catch (error: any) {
      toast.error(error || "Failed to update vehicle. Please try again.")
    } finally {
      setEditing(false)
    }
  }

  // Main render
  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Delivery Management"}
            headerText={"Assign cylinders & products to motorbike drivers"}
          />
          <ToastContainer />

          <div className="prevent-overflow">
            <RealTimeIndicator
              enabled={autoRefresh}
              lastUpdated={lastUpdated}
              dataVersion={dataVersion}
              onToggle={() => setAutoRefresh(!autoRefresh)}
            />
          </div>

          <main className="flex-grow p-4 pb-20">
            {/* Driver Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PersonIcon className="text-blue-600" />
                1. Select Delivery guy
              </h2>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
              >
                <option value="">Choose a driver</option>
                {motorbikeEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} -{" "}
                    {emp.phone_number || "No phone"}
                  </option>
                ))}
              </select>
              {selectedDriverMotorbike && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
                  <TwoWheelerIcon className="text-blue-600" />
                  <div className="flex space-x-5 justify-between">
                    <div>
                      <p className="font-semibold">Assigned Motorbike</p>
                      <p className="text-sm">
                        {selectedDriverMotorbike.number_plate} •{" "}
                        {selectedDriverMotorbike.engine_size} CC
                      </p>
                    </div>
                    <div className="">
                      <p className="font-semibold">Assigned Driver</p>
                      <p className="text-sm">
                        {selectedDriverInfo?.first_name}{" "}
                        {selectedDriverInfo?.last_name} -{" "}
                        {
                          <a
                            href={`tel:${selectedDriverInfo?.phone_number}`}
                            className="text-blue-600"
                          >
                            {selectedDriverInfo?.phone_number || "No phone"}
                          </a>
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NEW: Delivery Type Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <LocalAtmIcon className="text-yellow-600" />
                Delivery Type
              </h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType("RETAIL")}
                  className={`flex-1 py-3 rounded-xl font-semibold transition ${
                    deliveryType === "RETAIL"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🏪 Retail
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType("WHOLESALE")}
                  className={`flex-1 py-3 rounded-xl font-semibold transition ${
                    deliveryType === "WHOLESALE"
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📦 Wholesale
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {deliveryType === "RETAIL"
                  ? "Using retail prices as default. Click on any price chip to set a custom price."
                  : "Using wholesale prices as default. Click on any price chip to set a custom price."}
              </p>
            </div>

            {/* Source Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <LocalShippingIcon className="text-green-600" />
                2. Select Source (Shop / Vehicle / Store)
              </h2>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => openSourceModal("shop")}
                  className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-xl"
                >
                  Shop
                </button>
                <button
                  onClick={() => openSourceModal("vehicle")}
                  className="flex-1 py-2 bg-green-100 text-green-700 rounded-xl"
                >
                  Vehicle
                </button>
                <button
                  onClick={() => openSourceModal("store")}
                  className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-xl"
                >
                  Store
                </button>
              </div>
              {selectedSource && (
                <div className="p-3 bg-gray-100 rounded-xl flex justify-between items-center">
                  <span>Selected: {getSourceDisplay()}</span>
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="text-red-500"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Items to Deliver */}
            {selectedSource && (
              <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  3. Add Cylinders & Products
                </h2>
                {isLoadingItems ? (
                  <div className="text-center py-8">
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    {/* Cylinders */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-blue-700">
                          Cylinders
                        </h3>
                        <button
                          onClick={handleAddCylinder}
                          className="text-blue-600 text-sm flex items-center gap-1"
                        >
                          <AddIcon fontSize="small" /> Add
                        </button>
                      </div>
                      {cartCylinders.map((item, idx) =>
                        renderCylinderRow(item, idx),
                      )}
                    </div>

                    {/* Products */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-green-700">
                          Products
                        </h3>
                        <button
                          onClick={handleAddProduct}
                          className="text-green-600 text-sm flex items-center gap-1"
                        >
                          <AddIcon fontSize="small" /> Add
                        </button>
                      </div>
                      {cartProducts.map((item, idx) =>
                        renderProductRow(item, idx),
                      )}
                    </div>

                    {/* Cart Summary */}
                    <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                      <div className="flex justify-between font-bold text-lg">
                        <span>
                          Total Value (
                          {deliveryType === "RETAIL" ? "Retail" : "Wholesale"}):
                        </span>
                        <span>Ksh {calculateCartTotal().toLocaleString()}</span>
                      </div>
                      <button
                        onClick={handleAssignDelivery}
                        disabled={submitting || !selectedDriver}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50"
                      >
                        {submitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Assign to Driver"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Existing Deliveries List */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Assigned Deliveries
                </h2>
                <button onClick={fetchDeliveries} className="text-blue-600">
                  <RefreshCwIcon />
                </button>
              </div>
              {loadingDeliveries ? (
                <div className="text-center py-8">
                  <CircularProgress />
                </div>
              ) : deliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No deliveries assigned yet
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveries.map((del) => (
                    <div key={del.id} className="border rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            Driver: {del.driver_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Motorbike: {del.motorbike_plate || "Not assigned"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Source: {del.source_name} ({del.source_type})
                          </p>
                          <p className="text-sm text-gray-600">
                            Type: {del.delivery_type || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Items: {del.cylinders?.length || 0} cylinders,{" "}
                            {del.products?.length || 0} products
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            del.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {del.status || "Pending"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(del.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Source Selection Modal */}
          <Dialog
            open={showSourceModal}
            onClose={() => setShowSourceModal(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              Select{" "}
              {sourceType === "shop"
                ? "Shop"
                : sourceType === "vehicle"
                ? "Vehicle"
                : "Store"}
            </DialogTitle>
            <DialogContent>
              {sourceType === "shop" &&
                allShops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => selectSource(shop)}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50"
                  >
                    <p className="font-semibold">{shop.name}</p>
                    <p className="text-sm text-gray-500">
                      {shop.location?.name}
                    </p>
                  </div>
                ))}
              {sourceType === "vehicle" &&
                allVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => selectSource(vehicle)}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50"
                  >
                    <p className="font-semibold">{vehicle.number_plate}</p>
                    <p className="text-sm text-gray-500">
                      {vehicle.vehicleType} • {vehicle.engine_size} CC
                    </p>
                  </div>
                ))}
              {sourceType === "store" &&
                allStores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => selectSource(store)}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50"
                  >
                    <p className="font-semibold">{store.name}</p>
                    <p className="text-sm text-gray-500">
                      {store.location?.name}
                    </p>
                  </div>
                ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSourceModal(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>

          {/* Vehicle Management UI (unchanged - keep for compatibility) */}
          {/* ... (all existing vehicle management dialogs and footer) ... */}

          {/* Assigned Employee Warning Modal */}
          <Dialog
            open={openAssignedModal}
            onClose={() => setOpenAssignedModal(false)}
          >
            <DialogTitle>Employee Already Assigned</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedEmployeeForModal?.first_name}{" "}
                {selectedEmployeeForModal?.last_name} is already assigned to{" "}
                {selectedEmployeeForModal?.assigned_to?.type}:{" "}
                {selectedEmployeeForModal?.assigned_to?.name}. Assigning them
                may cause conflicts. Do you want to proceed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAssignedModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setOpenAssignedModal(false)
                }}
                color="warning"
              >
                Proceed Anyway
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete {deleteVehicleType}{" "}
                {deleteVehicleNumber}? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleDeleteThisVehicle} color="error">
                {delting ? <CircularProgress size={24} /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Vehicle Dialog */}
          <Dialog
            open={editOpen}
            onClose={() => setEditOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogContent>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={editVehicleType}
                    onChange={(e) => setEditVehicleType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="MOTORBIKE">Motorbike</option>
                    <option value="VEHICLE">Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number Plate
                  </label>
                  <input
                    type="text"
                    value={editNumberPlate}
                    onChange={(e) => setEditNumberPlate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Engine CC
                  </label>
                  <input
                    type="text"
                    value={editEngineCC}
                    onChange={(e) => setEditEngineCC(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Driver
                  </label>
                  <select
                    value={editDriver}
                    onChange={(e) => handleEditDriverChange(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Driver</option>
                    {driverOptionsEdit.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {getEmployeeDisplayText(emp)}
                      </option>
                    ))}
                  </select>
                </div>
                {editVehicleType === "VEHICLE" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Conductor
                    </label>
                    <select
                      value={editConductor}
                      onChange={(e) =>
                        handleEditConductorChange(e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Conductor</option>
                      {conductorOptionsEdit.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {getEmployeeDisplayText(emp)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEditSubmit} disabled={editing}>
                {editing ? <CircularProgress size={24} /> : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          <footer className="mt-auto">
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

export default Delivery
