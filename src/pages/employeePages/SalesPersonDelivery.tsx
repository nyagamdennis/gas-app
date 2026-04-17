// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectEmployeeTeam } from "../../features/employees/employeesTeamSlice"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import api from "../../../utils/api"
import EmployeeFooter from "../../components/ui/EmployeeFooter"
import Navbar from "../../components/ui/mobile/employees/Navbar"
import {
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import LocalAtmIcon from "@mui/icons-material/LocalAtm"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import HomeIcon from "@mui/icons-material/Home"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import StorefrontIcon from "@mui/icons-material/Storefront"
import { RefreshCwIcon } from "lucide-react"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"

const SalesPersonDelivery = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const myTeamData = useAppSelector(selectEmployeeTeam)
  const vehicles = useAppSelector(selectAllSalesTeamVehicle)

  const assignmentData = myTeamData?.[0]
  const userId = assignmentData?.user
  const shopId = assignmentData?.assigned_to?.shop_id
  const storeId = assignmentData?.assigned_to?.store_id
  const vehicleId = assignmentData?.assigned_to?.vehicle_id
  const teamType = assignmentData?.assigned_to?.type?.toUpperCase()
  const teamName = assignmentData?.assigned_to?.name

  const myTeamId = shopId || storeId || vehicleId
  const myTeamTypeLower = assignmentData?.assigned_to?.type?.toLowerCase()

  // State
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [availableCylinders, setAvailableCylinders] = useState([])
  const [availableProducts, setAvailableProducts] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const [selectedDriver, setSelectedDriver] = useState("")
  const [selectedDriverMotorbike, setSelectedDriverMotorbike] = useState(null)
  const [selectedDriverInfo, setSelectedDriverInfo] = useState(null)

  // Cart state
  const [cartCylinders, setCartCylinders] = useState([
    { productId: "", quantity: 1, customPrice: "", saleType: "refill" },
  ])
  const [cartProducts, setCartProducts] = useState([
    { productId: "", quantity: 1, customPrice: "" },
  ])

  const [deliveryType, setDeliveryType] = useState("RETAIL")
  const [selectedMotorbike, setSelectedMotorbike] = useState("")

  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocation, setCustomerLocation] = useState("")
  const [apartmentName, setApartmentName] = useState("")
  const [roomNumber, setRoomNumber] = useState("")

  // Deliveries list
  const [deliveries, setDeliveries] = useState([])
  const [loadingDeliveries, setLoadingDeliveries] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false)
  const [selectedCompletedDelivery, setSelectedCompletedDelivery] =
    useState(null)
  const [emptiesReturned, setEmptiesReturned] = useState({}) // key: saleItemId -> number
  const [finalizing, setFinalizing] = useState(false)

  // Fetch motorbikes on mount
  useEffect(() => {
    dispatch(fetchEmployees({ businessId: assignmentData?.business }))
    fetchDeliveries()
    setLoadingTeams(true)
    dispatch(fetchSalesTeamVehicle())
    setLoadingTeams(false)
  }, [dispatch])

  const motorbikes = useMemo(() => {
    return vehicles.filter((v) => v.type_of_vehicle === "MOTORBIKE")
  }, [vehicles])

  const all_employees = useAppSelector(selectAllEmployees)
  const motorbikeEmployees = useMemo(() => {
    return all_employees.filter(
      (employee) => employee.assigned_to?.type === "MOTORBIKE",
    )
  }, [all_employees])

  useEffect(() => {
    if (selectedDriver) {
      const employee = all_employees.find(
        (emp) => emp.id === parseInt(selectedDriver),
      )
      if (employee) {
        setSelectedDriverInfo(employee)
        const bike = motorbikes.find((v) => v.driver?.id === employee.id)
        setSelectedDriverMotorbike(bike || null)
      } else {
        setSelectedDriverInfo(null)
        setSelectedDriverMotorbike(null)
      }
    } else {
      setSelectedDriverInfo(null)
      setSelectedDriverMotorbike(null)
    }
  }, [selectedDriver, all_employees, motorbikes])

  const fetchDeliveries = async () => {
    setLoadingDeliveries(true)
    const sales_team_type = teamType.toLowerCase()
    const sales_team_id = myTeamId
    try {
      const response = await api.get("vehicle/deliveries/team-deliveries/", {
        params: {
          sales_team_type: sales_team_type,
          sales_team_id: sales_team_id,
        },
      })
      setDeliveries(response.data)
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
      toast.error("Could not load deliveries")
    } finally {
      setLoadingDeliveries(false)
    }
  }

  // Fetch items for form
  useEffect(() => {
    if (!myTeamId || !myTeamTypeLower) return
    const fetchItems = async () => {
      setLoadingItems(true)
      try {
        let cylindersEndpoint = ""
        let productsEndpoint = ""
        if (myTeamTypeLower === "shop") {
          cylindersEndpoint = `/inventory/shops/${myTeamId}/cylinders/`
          productsEndpoint = `/inventory/shops/${myTeamId}/products/`
        } else if (myTeamTypeLower === "vehicle") {
          cylindersEndpoint = `/inventory/vehicles/${myTeamId}/cylinders/`
          productsEndpoint = `/inventory/vehicles/${myTeamId}/products/`
        } else if (myTeamTypeLower === "store") {
          cylindersEndpoint = `/inventory/stores/${myTeamId}/cylinders/`
          productsEndpoint = `/inventory/stores/${myTeamId}/products/`
        }
        const [cylRes, prodRes] = await Promise.all([
          api.get(cylindersEndpoint),
          api.get(productsEndpoint),
        ])
        setAvailableCylinders(cylRes.data || [])
        setAvailableProducts(prodRes.data || [])
      } catch (err) {
        console.error(err)
        toast.error("Failed to load inventory")
      } finally {
        setLoadingItems(false)
      }
    }
    if (createModalOpen) {
      fetchItems()
    }
  }, [myTeamId, myTeamTypeLower, createModalOpen])

  // Cart handlers (cylinders)
  const handleAddCylinder = () => {
    setCartCylinders([
      ...cartCylinders,
      { productId: "", quantity: 1, customPrice: "", saleType: "refill" },
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

  // Cart handlers (products)
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

  // Price helpers
  const getDefaultCylinderPrice = (cylinder, saleType) => {
    if (deliveryType === "RETAIL") {
      return saleType === "refill"
        ? cylinder.cylinder?.retail_refill_price || 0
        : cylinder.cylinder?.outlet_retail_price || 0
    } else {
      return saleType === "refill"
        ? cylinder.cylinder?.wholesale_refill_price || 0
        : cylinder.cylinder?.outlet_wholesale_price || 0
    }
  }

  const getDefaultProductPrice = (product) => {
    if (deliveryType === "RETAIL") {
      return product.prices?.retail_sales_price || 0
    } else {
      return product.prices?.whole_sales_price || 0
    }
  }

  const calculateCartTotal = () => {
    let total = 0
    cartCylinders.forEach((item) => {
      const product = availableCylinders.find(
        (p) => p.cylinder.id === parseInt(item.productId),
      )
      if (product) {
        const price = item.customPrice
          ? parseFloat(item.customPrice)
          : getDefaultCylinderPrice(product, item.saleType)
        total += price * item.quantity
      }
    })
    cartProducts.forEach((item) => {
      const product = availableProducts.find(
        (p) => p.product?.id === parseInt(item.productId),
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

  const handleSubmitDelivery = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver")
      return
    }
    if (!selectedDriverMotorbike) {
      toast.error("Selected driver has no motorbike assigned")
      return
    }
    if (!customerPhone || !customerLocation) {
      toast.error("Customer phone and location are required")
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
    const salesType = deliveryType.toLowerCase()
    const deliveryAddress = [customerLocation, apartmentName, roomNumber]
      .filter(Boolean)
      .join(", ")

    const payload = {
      driver_id: parseInt(selectedDriver),
      motorbike_id: parseInt(selectedMotorbike),
      source_type: myTeamTypeLower,
      source_id: myTeamId,
      delivery_type: deliveryType,
      customer_phone: customerPhone,
      delivery_address: deliveryAddress,
      cylinders: cartCylinders
        .filter((c) => c.productId)
        .map((c) => ({
          cylinder_id: parseInt(c.productId),
          quantity: c.quantity,
          custom_price: c.customPrice ? parseFloat(c.customPrice) : null,
          sales_type: salesType,
          sales_category: c.saleType,
        })),
      products: cartProducts
        .filter((p) => p.productId)
        .map((p) => ({
          product_id: parseInt(p.productId),
          quantity: p.quantity,
          custom_price: p.customPrice ? parseFloat(p.customPrice) : null,
          sales_type: salesType,
        })),
      assigned_at: new Date().toISOString(),
      customer: {
        customerPhone: customerPhone,
        location: customerLocation,
        apertmentName: apartmentName,
        roomNumber: roomNumber,
      },
    }

    try {
      await api.post("vehicle/deliveries/", payload)
      toast.success("Delivery created successfully!")
      // Reset form and close modal
      setSelectedMotorbike("")
      setCustomerPhone("")
      setCustomerLocation("")
      setApartmentName("")
      setRoomNumber("")
      setCartCylinders([
        { productId: "", quantity: 1, customPrice: "", saleType: "refill" },
      ])
      setCartProducts([{ productId: "", quantity: 1, customPrice: "" }])
      setCreateModalOpen(false)
      setSelectedDriver("")
      setSelectedDriverMotorbike(null)
      setSelectedDriverInfo(null)
      fetchDeliveries()
    } catch (error) {
      console.error(error)
      toast.error("Failed to create delivery")
    } finally {
      setSubmitting(false)
    }
  }

  const renderCylinderRow = (item, idx) => {
    const selectedProduct = availableCylinders.find(
      (p) => p.cylinder.id === parseInt(item.productId),
    )
    if (!selectedProduct) {
      return (
        <div key={idx} className="bg-blue-50 rounded-xl p-3 mb-3">
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
        </div>
      )
    }

    const cylinderData = selectedProduct.cylinder
    const retailPrice =
      item.saleType === "refill"
        ? cylinderData.retail_refill_price || 0
        : cylinderData.outlet_retail_price || 0
    const wholesalePrice =
      item.saleType === "refill"
        ? cylinderData.wholesale_refill_price || 0
        : cylinderData.outlet_wholesale_price || 0

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

            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => handleCylinderChange(idx, "saleType", "refill")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  item.saleType === "refill"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Refill
              </button>
              <button
                type="button"
                onClick={() => handleCylinderChange(idx, "saleType", "outlet")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  item.saleType === "outlet"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Outlet
              </button>
            </div>

            <div className="flex gap-2 mb-2 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  handleCylinderChange(idx, "customPrice", retailPrice)
                }
                className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200"
              >
                Retail: Ksh {retailPrice.toLocaleString()}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCylinderChange(idx, "customPrice", wholesalePrice)
                }
                className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium hover:bg-orange-200"
              >
                Wholesale: Ksh {wholesalePrice.toLocaleString()}
              </button>
              {item.customPrice && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                  Custom: Ksh {parseFloat(item.customPrice).toLocaleString()}
                </span>
              )}
            </div>

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
      (p) => p.product.id === parseInt(item.productId),
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
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200"
                >
                  Retail: Ksh {retailPrice.toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleProductChange(idx, "customPrice", wholesalePrice)
                  }
                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium hover:bg-orange-200"
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

  const handleOpenFinalize = (delivery) => {
    setSelectedCompletedDelivery(delivery)
    // Initialize empties returned from sale items (if field exists) or default to sold quantity
    const initialEmpties = {}
    if (delivery.sale?.items) {
      delivery.sale.items.forEach((item) => {
        if (item.item_type === "CYLINDER" && item.sales_category === "REFILL") {
          // Use existing empties_returned if present, otherwise default to quantity
          initialEmpties[item.id] =
            item.empties_returned !== undefined
              ? item.empties_returned
              : item.quantity
        }
      })
    }
    setEmptiesReturned(initialEmpties)
    setFinalizeDialogOpen(true)
  }

  const handleEmptiesChange = (saleItemId, value) => {
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    setEmptiesReturned((prev) => ({ ...prev, [saleItemId]: num }))
  }

  const handleFinalizeSubmit = async () => {
    if (!selectedCompletedDelivery?.sale) return
    const saleId = selectedCompletedDelivery.sale.id
    const deliveryId = selectedCompletedDelivery.id

    const payload = {
      empties: Object.entries(emptiesReturned).map(([itemId, count]) => ({
        sale_item_id: parseInt(itemId),
        empties_returned: count,
      })),
    }

    setFinalizing(true)
    try {
      // Use the new finalize-sale endpoint
      await api.patch(
        `vehicle/deliveries/${deliveryId}/finalize-sale/`,
        payload,
      )
      toast.success("Sale finalized with empties recorded")
      fetchDeliveries()
      setFinalizeDialogOpen(false)
    } catch (error) {
      console.error("Failed to finalize sale:", error)
      toast.error(error.response?.data?.error || "Could not finalize sale")
    } finally {
      setFinalizing(false)
    }
  }
  if (!isMobile) {
    return (
      <div className="p-4">
        <p>Desktop view coming soon</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar headerMessage="ERP" headerText="My Deliveries" />

      <main className="flex-grow m-2 p-1 pb-20 space-y-4">
        {/* Header with refresh and create */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LocalShippingIcon className="text-blue-600" />
            Assigned Deliveries
          </h2>
          <div className="flex gap-2">
            <button
              onClick={fetchDeliveries}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
            >
              <RefreshCwIcon size={20} />
            </button>
          </div>
        </div>

        {loadingDeliveries ? (
          <div className="text-center py-12">
            <CircularProgress size={40} />
          </div>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <LocalShippingIcon className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No deliveries yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Tap the + button to create a new delivery
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((del) => {
              const cylinderItems = del.items.filter(
                (item) => item.cylinder !== null,
              )
              const productItems = del.items.filter(
                (item) => item.product !== null,
              )
              const totalCylinders = cylinderItems.reduce(
                (sum, item) => sum + (item.cylinder_quantity || 0),
                0,
              )
              const totalProducts = productItems.reduce(
                (sum, item) => sum + (item.product_quantity || 0),
                0,
              )
              const totalValue = [...cylinderItems, ...productItems].reduce(
                (sum, item) =>
                  sum +
                  (parseFloat(item.custom_price) || 0) *
                    (item.cylinder_quantity || item.product_quantity || 0),
                0,
              )

              const sale = del.sale
              const isCompleted = del.status === "COMPLETED"

              return (
                <div
                  key={del.id}
                  className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500"
                >
                  {/* Customer Info */}
                  {del.customer ? (
                    <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-purple-800 mb-2">
                        📞 Customer Details
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <PhoneIcon
                            fontSize="small"
                            className="text-purple-600"
                          />
                          <a
                            href={`tel:${del.customer.customerPhone}`}
                            className="text-blue-600 underline"
                          >
                            {del.customer.customerPhone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <LocationOnIcon
                            fontSize="small"
                            className="text-purple-600"
                          />
                          <span>{del.customer.location}</span>
                        </div>
                        {del.customer.apertmentName && (
                          <div className="flex items-center gap-1">
                            <HomeIcon
                              fontSize="small"
                              className="text-purple-600"
                            />
                            <span>{del.customer.apertmentName}</span>
                          </div>
                        )}
                        {del.customer.roomNumber && (
                          <div className="flex items-center gap-1">
                            <MeetingRoomIcon
                              fontSize="small"
                              className="text-purple-600"
                            />
                            <span>{del.customer.roomNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg text-gray-500 text-sm italic">
                      No customer details recorded
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <TwoWheelerIcon
                          fontSize="small"
                          className="text-blue-500"
                        />
                        <span>
                          {del.delivery_vehicle_number_plate || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <StorefrontIcon fontSize="small" />
                        <span>
                          {del.source_location_name} ({del.source_location_type}
                          )
                        </span>
                      </div>
                      {del.driver_name && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <PersonIcon
                            fontSize="small"
                            className="text-blue-500"
                          />
                          <span>{del.driver_name}</span>
                          {del.driver_phone && (
                            <a
                              href={`tel:${del.driver_phone}`}
                              className="ml-1 text-blue-600 underline text-xs flex items-center gap-1"
                            >
                              📞 {del.driver_phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        del.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : del.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {del.status}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {totalCylinders > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        🛢️ {totalCylinders} cylinder
                        {totalCylinders !== 1 && "s"}
                      </span>
                    )}
                    {totalProducts > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                        📦 {totalProducts} product{totalProducts !== 1 && "s"}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      💰 Total: Ksh {totalValue.toLocaleString()}
                    </span>
                  </div>

                  {/* Items */}
                  {(productItems.length > 0 || cylinderItems.length > 0) && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm">
                      {productItems.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Products
                          </p>
                          <div className="space-y-1">
                            {productItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <span>{item.product_name}</span>
                                <div className="flex gap-3 text-xs">
                                  <span>Qty: {item.product_quantity}</span>
                                  <span className="text-green-600">
                                    Ksh{" "}
                                    {parseFloat(
                                      item.custom_price,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {cylinderItems.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Cylinders
                          </p>
                          <div className="space-y-1">
                            {cylinderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-2">
                                  <span>
                                    {item.cylinder_name} ({item.cylinder_weight}
                                    kg)
                                  </span>
                                  <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                                    {item.sales_category || "refill"}
                                  </span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                  <span>Qty: {item.cylinder_quantity}</span>
                                  <span className="text-green-600">
                                    Ksh{" "}
                                    {parseFloat(
                                      item.custom_price,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isCompleted && sale && (
                    <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">💰</span>
                        <h4 className="font-semibold text-gray-800">
                          Sale Summary
                        </h4>
                        {sale.finalized_by && (
                          <Chip
                            label="Finalized"
                            size="small"
                            className="ml-auto bg-green-600 text-white"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Total Amount:</span>
                          <span className="font-medium ml-1">
                            Ksh {parseFloat(sale.total_amount).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Paid:</span>
                          <span className="font-medium ml-1 text-green-600">
                            Ksh {parseFloat(sale.total_paid).toLocaleString()}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Balance:</span>
                          <span
                            className={`font-medium ml-1 ${
                              parseFloat(sale.balance) > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            Ksh {parseFloat(sale.balance).toLocaleString()}
                            {parseFloat(sale.balance) > 0 && " (Debt)"}
                          </span>
                        </div>
                      </div>

                      {/* Payments breakdown */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                          Payments
                        </p>
                        {sale.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between text-xs py-1 border-b border-gray-200 last:border-0"
                          >
                            <span className="flex items-center gap-1">
                              {payment.payment_method === "CASH"
                                ? "💵 Cash"
                                : "📱 M-Pesa"}
                              {payment.transaction_code && (
                                <span className="text-gray-500">
                                  ({payment.transaction_code})
                                </span>
                              )}
                            </span>
                            <span className="font-medium">
                              Ksh {parseFloat(payment.amount).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Finalized information */}
                      {sale.finalized_by && (
                        <div className="mb-3 text-xs text-gray-700 bg-white/60 rounded-lg p-2 flex items-center gap-1">
                          <span>✅</span>
                          <span>
                            Finalized by{" "}
                            <span className="font-medium">
                              {sale.finalized_by_name}
                            </span>{" "}
                            on {new Date(sale.finalized_at).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Empties status and finalize button */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-green-200">
                        <div>
                          <span className="text-xs text-gray-600">
                            Empties returned:
                          </span>
                          {sale.items.some(
                            (item) =>
                              item.item_type === "CYLINDER" &&
                              item.sales_category === "REFILL",
                          ) ? (
                            <span className="ml-2 text-sm font-medium">
                              {sale.items
                                .filter(
                                  (item) =>
                                    item.item_type === "CYLINDER" &&
                                    item.sales_category === "REFILL",
                                )
                                .reduce(
                                  (sum, item) =>
                                    sum + (item.empties_returned || 0),
                                  0,
                                )}{" "}
                              / {totalCylinders}
                            </span>
                          ) : (
                            <span className="ml-2 text-sm text-gray-500">
                              N/A
                            </span>
                          )}
                        </div>
                        {!sale.finalized_by ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenFinalize(del)}
                            className="normal-case text-xs"
                          >
                            Finalize / Update Empties
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            disabled
                            className="normal-case text-xs"
                          >
                            Finalized
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mt-3">
                    🕒 {new Date(del.created_at).toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setCreateModalOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
      >
        <AddIcon fontSize="large" />
      </button>

      {/* Create Delivery Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        fullScreen
      >
        <DialogTitle className="bg-blue-600 text-white">
          Create New Delivery
        </DialogTitle>
        <DialogContent className="bg-gray-50">
          <div className="space-y-4 pt-2">
            {/* Motorbike Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PersonIcon className="text-blue-600" />
                1. Select Delivery Driver
              </h2>
              {loadingTeams ? (
                <CircularProgress size={24} />
              ) : (
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
              )}
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
                    <div>
                      <p className="font-semibold">Driver</p>
                      <p className="text-sm">
                        {selectedDriverInfo?.first_name}{" "}
                        {selectedDriverInfo?.last_name} -{" "}
                        <a
                          href={`tel:${selectedDriverInfo?.phone_number}`}
                          className="text-blue-600"
                        >
                          {selectedDriverInfo?.phone_number || "No phone"}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Type */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
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
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PersonIcon className="text-purple-600" />
                Customer Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
                  <PhoneIcon className="text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Customer phone number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
                  <LocationOnIcon className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Location / Area *"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
                  <HomeIcon className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Apartment / Hostel name (optional)"
                    value={apartmentName}
                    onChange={(e) => setApartmentName(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
                  <MeetingRoomIcon className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Room / Floor number (optional)"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Items Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <LocalShippingIcon className="text-green-600" />
                Items to Deliver
              </h2>
              {loadingItems ? (
                <div className="text-center py-8">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-blue-700">Cylinders</h3>
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

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-green-700">Products</h3>
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

                  <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                    <div className="flex justify-between font-bold text-lg">
                      <span>
                        Total Value (
                        {deliveryType === "RETAIL" ? "Retail" : "Wholesale"}):
                      </span>
                      <span>Ksh {calculateCartTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitDelivery}
            variant="contained"
            disabled={submitting}
            className="bg-blue-600"
          >
            {submitting ? <CircularProgress size={24} /> : "Create Delivery"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Finalize Sale Dialog */}
      <Dialog
        open={finalizeDialogOpen}
        onClose={() => setFinalizeDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-indigo-600 text-white">
          Finalize Sale – Record Empties
        </DialogTitle>
        <DialogContent dividers>
          {selectedCompletedDelivery?.sale?.items.filter(
            (item) =>
              item.item_type === "CYLINDER" && item.sales_category === "REFILL",
          ).length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the number of empty cylinders returned by the customer.
              </p>
              {selectedCompletedDelivery.sale.items
                .filter(
                  (item) =>
                    item.item_type === "CYLINDER" &&
                    item.sales_category === "REFILL",
                )
                .map((item) => {
                  const soldQty = item.quantity
                  const currentVal = emptiesReturned[item.id] ?? soldQty
                  return (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.item_name}</span>
                        <span className="text-sm text-gray-600">
                          Sold: {soldQty}
                        </span>
                      </div>
                      <TextField
                        label="Empties Returned"
                        type="number"
                        value={currentVal}
                        onChange={(e) =>
                          handleEmptiesChange(item.id, e.target.value)
                        }
                        inputProps={{ min: 0, max: soldQty }}
                        fullWidth
                        size="small"
                        helperText={`Must be between 0 and ${soldQty}`}
                      />
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              No refill cylinders in this sale.
            </p>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setFinalizeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleFinalizeSubmit}
            variant="contained"
            color="primary"
            disabled={finalizing}
          >
            {finalizing ? <CircularProgress size={24} /> : "Save Empties"}
          </Button>
        </DialogActions>
      </Dialog>

      
      <EmployeeFooter />
    </div>
  )
}

export default SalesPersonDelivery
