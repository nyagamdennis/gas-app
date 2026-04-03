// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate, useLocation } from "react-router-dom"

import mpesalogo from "../../images/Mpesa-Logo.png"
import { useAppDispatch } from "../../app/hooks"
import {
  LocationOn,
  MyLocation,
  Refresh,
  CheckCircle,
  LocationOff,
  Receipt,
} from "@mui/icons-material"
import FormattedAmount from "../../components/FormattedAmount"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import api from "../../../utils/api"
import planStatus from "../../features/planStatus/planStatus"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

const ProductSales = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { businessId } = planStatus()

  // Get query parameters
  const queryParams = new URLSearchParams(location.search)
  const saleType = queryParams.get("type") || "retail" // 'retail' or 'wholesale'
  const [saleResponse, setSaleResponse] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Get team ID if present in URL
  const pathParts = location.pathname.split("/")
  const teamId =
    pathParts.includes("shop") ||
    pathParts.includes("vehicle") ||
    pathParts.includes("store")
      ? pathParts[pathParts.length - 1]
      : null

  const teamName =
    pathParts.includes("shop") ||
    pathParts.includes("vehicle") ||
    pathParts.includes("store")
      ? decodeURIComponent(pathParts[pathParts.length - 2])
      : null

  const teamType = pathParts.includes("shop")
    ? "shop"
    : pathParts.includes("vehicle")
    ? "vehicle"
    : pathParts.includes("store")
    ? "store"
    : null

  // State
  const [searchResults, setSearchResults] = useState([])
  const [searchPhoneResults, setSearchPhoneResults] = useState([])
  const [searchingBy, setSearchingBy] = useState("")
  const [availableProducts, setAvailableProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [productFetchError, setProductFetchError] = useState("")
  const [salesNote, setSalesNote] = useState("")

  // M-Pesa states
  const [isCheckingMpesa, setIsCheckingMpesa] = useState(false)
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("")
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [useSamePhone, setUseSamePhone] = useState(true)
  const [mpesaVerificationStatus, setMpesaVerificationStatus] = useState({})

  // Customer details
  const [customerType, setCustomerType] = useState(
    saleType === "wholesale" ? "BUSINESS" : "INDIVIDUAL",
  )
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocationName, setCustomerLocationName] = useState("")

  // Location tracking state
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)
  const [locationCoordinates, setLocationCoordinates] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    address: "",
  })
  const [locationError, setLocationError] = useState("")
  const [lastLocationUpdate, setLastLocationUpdate] = useState("")
  const [watchId, setWatchId] = useState(null)

  // Products
  const [productItems, setProductItems] = useState([
    {
      productId: "",
      quantity: 1,
      paymentAmount: "MAXIMUM",
      customPrice: "",
      isPipe: false,
      lengthInMeters: 1, // For pipe products
    },
  ])

  // Payment
  const [paymentType, setPaymentType] = useState("FULLY_PAID")
  const [deposit, setDeposit] = useState(0)
  const [repayDate, setRepayDate] = useState("")

  // Payment mode
  const [paymentMode, setPaymentMode] = useState("cash")
  const [cashAmount, setCashAmount] = useState(0)
  const [numMpesaDeposits, setNumMpesaDeposits] = useState(1)
  const [mpesaCodes, setMpesaCodes] = useState([{ code: "", amount: 0 }])

  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show summary state
  const [showSummary, setShowSummary] = useState(false)

  // Fetch product data based on source
  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    setProductFetchError("")

    try {
      let response

      if (teamType === "shop" && teamId) {
        response = await api.get(`/inventory/shops/${teamId}/products/`)
      } else if (teamType === "vehicle" && teamId) {
        response = await api.get(`/inventory/vehicles/${teamId}/products/`)
      } else if (teamType === "store" && teamId) {
        response = await api.get(`/inventory/stores/${teamId}/products/`)
      } else {
        response = await api.get(`/inventory/stores/products/`)
      }

      if (response.data && Array.isArray(response.data)) {
        // Transform the data and identify pipe products
        const transformedProducts = response.data.map((product) => ({
          id: product.id || 0,
          product_type_id: product?.product?.id,
          product: product?.product?.name || "Unknown",
          retail_price: product?.product?.prices?.retail_sales_price || 0,
          whole_sales_price: product?.product?.prices?.whole_sales_price || 0,
          // Check if this is a pipe product (you may need to adjust this logic)
          isPipe:
            product?.product?.name?.toLowerCase().includes("pipe") ||
            product?.product?.category?.name?.toLowerCase().includes("pipe") ||
            false,
          // For pipes, you might have price per meter in a different field
          // Adjust based on your actual data structure
          price_per_meter:
            product?.product?.prices?.price_per_meter ||
            product?.product?.retail_price_per_meter ||
            0,
        }))

        setAvailableProducts(transformedProducts)
      } else {
        setProductFetchError("Invalid data format received")
        toast.error("Failed to load product data")
      }
    } catch (error) {
      setProductFetchError(error.message || "Failed to fetch products")
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    setCustomerType(saleType === "wholesale" ? "BUSINESS" : "INDIVIDUAL")
    fetchProducts()
  }, [saleType, teamType, teamId])

  // Location functions (same as CylinderSales)
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    setLocationError("")

    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 10000,
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        navigator.geolocation.clearWatch(id)
        setWatchId(null)

        const { latitude, longitude, accuracy } = position.coords

        if (accuracy > 1000) {
          toast.warning(
            "Location accuracy is poor. Moving to better reception may help.",
          )
        }

        const coords = {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          accuracy: accuracy ? Math.round(accuracy) : null,
        }

        setLocationCoordinates(coords)
        setHasLocation(true)
        setIsGettingLocation(false)

        try {
          const address = await getAddressFromCoordinates(latitude, longitude)
          setLocationCoordinates((prev) => ({
            ...prev,
            address: address || "",
          }))
        } catch (error) {}

        setLastLocationUpdate(new Date().toLocaleTimeString())
      },
      (error) => {
        navigator.geolocation.clearWatch(id)
        setWatchId(null)
        setIsGettingLocation(false)

        let errorMessage = "Unable to retrieve device location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location unavailable. Make sure location/GPS is turned ON."
            break
          case error.TIMEOUT:
            errorMessage =
              "Taking too long to get location. Please check GPS is ON."
            break
        }

        setLocationError(errorMessage)
        toast.error(errorMessage)

        if (error.code === error.TIMEOUT) {
          setTimeout(() => getIPBasedLocation(), 1000)
        }
      },
      options,
    )

    setWatchId(id)

    setTimeout(() => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
        setWatchId(null)
        if (isGettingLocation) {
          setIsGettingLocation(false)
          getIPBasedLocation()
        }
      }
    }, 25000)
  }

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  const getIPBasedLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      if (!response.ok) throw new Error("IP location failed")
      const data = await response.json()

      if (data.latitude && data.longitude) {
        const coords = {
          latitude: data.latitude.toFixed(6),
          longitude: data.longitude.toFixed(6),
          accuracy: 50000,
          address: `${data.city || ""}, ${data.region || ""}, ${
            data.country_name || ""
          }`,
        }

        setLocationCoordinates(coords)
        setHasLocation(true)
        setLastLocationUpdate(new Date().toLocaleTimeString())
      }
    } catch (ipError) {
      toast.error("Could not determine device location")
    }
  }

  const refreshLocation = () => {
    setHasLocation(false)
    setLastLocationUpdate("")
    getCurrentLocation()
  }

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      )
      if (!response.ok) throw new Error("Reverse geocoding failed")
      const data = await response.json()

      if (data.address) {
        const address = data.address
        const parts = []
        if (address.road) parts.push(address.road)
        if (address.suburb) parts.push(address.suburb)
        if (address.city || address.town || address.village) {
          parts.push(address.city || address.town || address.village)
        }
        if (address.county) parts.push(address.county)
        return parts.join(", ")
      }
      return null
    } catch (error) {
      return null
    }
  }

  const copyCoordinates = () => {
    if (locationCoordinates.latitude && locationCoordinates.longitude) {
      const coords = `${locationCoordinates.latitude}, ${locationCoordinates.longitude}`
      navigator.clipboard
        .writeText(coords)
        .then(() => toast.success("Coordinates copied to clipboard!"))
        .catch(() => toast.error("Failed to copy coordinates"))
    }
  }

  // Handle product changes
  const handleProductChange = (index, field, value) => {
    setProductItems((prevProducts) =>
      prevProducts.map((product, i) => {
        if (i === index) {
          const updatedProduct = { ...product, [field]: value }

          // If product is selected, check if it's a pipe
          if (field === "productId" && value) {
            const selectedProduct = availableProducts.find(
              (prod) => prod.id === Number(value),
            )
            updatedProduct.isPipe = selectedProduct?.isPipe || false
            // Reset length when product changes
            if (!selectedProduct?.isPipe) {
              updatedProduct.lengthInMeters = 1
            }
          }

          return updatedProduct
        }
        return product
      }),
    )
  }

  const handleAddProduct = () => {
    setProductItems([
      ...productItems,
      {
        productId: "",
        quantity: 1,
        paymentAmount: "MAXIMUM",
        customPrice: "",
        isPipe: false,
        lengthInMeters: 1,
      },
    ])
  }

  const handleRemoveProduct = (index) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter((_, idx) => idx !== index))
    }
  }

  // Get product price based on sale type and product type
  const getProductPrice = (selectedProduct, productItem) => {
    if (!selectedProduct) return 0

    // For pipe products, price is per meter
    if (selectedProduct.isPipe) {
      const pricePerMeter =
        saleType === "retail"
          ? selectedProduct.retail_price
          : selectedProduct.whole_sales_price

      // If there's a specific price_per_meter field, use that instead
      const actualPricePerMeter =
        selectedProduct.price_per_meter || pricePerMeter

      return actualPricePerMeter * (productItem.lengthInMeters || 1)
    }

    // For regular products, price is per item
    return saleType === "retail"
      ? selectedProduct.retail_price || 0
      : selectedProduct.whole_sales_price || 0
  }

  // Calculate total
  const calculateTotal = useCallback(() => {
    return productItems.reduce((total, product) => {
      const selectedProduct = availableProducts.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (selectedProduct && product.productId) {
        let price = 0

        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          price = parseFloat(product.customPrice)
        } else {
          price = getProductPrice(selectedProduct, product)
        }

        // For pipe products, quantity is in meters/units
        return total + price * product.quantity
      }

      return total
    }, 0)
  }, [productItems, availableProducts, saleType])

  const calculateDebt = () => {
    const total = calculateTotal()
    return Math.max(total - deposit, 0)
  }

  // Get product summary
  const getProductSummary = () => {
    const summary = {
      products: [],
      grandTotal: 0,
    }

    productItems.forEach((product) => {
      const selectedProduct = availableProducts.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (selectedProduct && product.productId) {
        let unitPrice = 0
        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          unitPrice = parseFloat(product.customPrice)
        } else {
          unitPrice =
            getProductPrice(selectedProduct, product) / product.quantity
        }

        const totalPrice =
          getProductPrice(selectedProduct, product) * product.quantity
        summary.grandTotal += totalPrice

        let productName = selectedProduct.product
        if (selectedProduct.isPipe) {
          productName += ` (${product.lengthInMeters}m)`
        }

        summary.products.push({
          name: productName,
          quantity: product.quantity,
          lengthInMeters: selectedProduct.isPipe
            ? product.lengthInMeters
            : null,
          unitPrice,
          totalPrice,
          isCustom: product.paymentAmount === "CUSTOM",
          customPrice: product.customPrice,
          isPipe: selectedProduct.isPipe,
        })
      }
    })

    return summary
  }

  // M-Pesa functions (similar to CylinderSales)
  const handleNumDepositsChange = (e) => {
    const count = Math.max(1, Math.min(2, parseInt(e.target.value, 10) || 1))
    setNumMpesaDeposits(count)
    distributeMpesaAmounts(count)
  }

  const handleMpesaCodeChange = (index, field, value) => {
    setMpesaCodes((prevCodes) => {
      const newCodes = [...prevCodes]
      newCodes[index][field] = value
      return newCodes
    })
  }

  const distributeMpesaAmounts = (depositCount) => {
    const totalAmount = calculateTotal()
    let mpesaAmount = totalAmount

    if (paymentMode === "mpesa_cash") {
      mpesaAmount = totalAmount - cashAmount
    }

    if (depositCount > 1) {
      const averageAmount = mpesaAmount / depositCount
      setMpesaCodes((prevCodes) => {
        const newCodes = [...prevCodes]
        while (newCodes.length < depositCount) {
          newCodes.push({ code: "", amount: averageAmount })
        }
        return newCodes.slice(0, depositCount).map((code, index) => ({
          ...code,
          amount: code.amount || averageAmount,
        }))
      })
    } else {
      setMpesaCodes([{ code: "", amount: mpesaAmount }])
    }
  }

  // Customer search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchingBy === "name" && customerName.length > 2) {
        api
          .post("/customers/search/", {
            type: "name",
            query: customerName,
          })
          .then((response) => {
            setSearchResults(response.data)
          })
          .catch((error) => {})
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [customerName, searchingBy])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchingBy === "phone" && customerPhone.length > 3) {
        api
          .post("/customers/search/", {
            type: "phone",
            query: customerPhone,
          })
          .then((response) => {
            setSearchPhoneResults(response.data)
          })
          .catch((error) => {})
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [customerPhone, searchingBy])

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!showSummary) {
      setShowSummary(true)
      return
    }

    setIsSubmitting(true)

    const isFullyPaid = paymentType === "FULLY_PAID"
    const totalAmount = calculateTotal()

    let location_type = null
    if (teamType === "shop") {
      location_type = "SHOP"
    } else if (teamType === "vehicle") {
      location_type = "VEHICLE"
    } else if (teamType === "store" || !teamType) {
      location_type = "STORE"
    }

    const validMpesaCodes = mpesaCodes.filter(
      (code) => code.code && code.code.trim() !== "",
    )

    const formData = {
      company_id: businessId,
      customer_details: {
        name: customerName,
        location: {
          name: customerLocationName,
          ...(hasLocation && {
            coordinates: {
              latitude: locationCoordinates.latitude,
              longitude: locationCoordinates.longitude,
              accuracy: locationCoordinates.accuracy,
              address: locationCoordinates.address,
              timestamp: lastLocationUpdate,
            },
          }),
        },
        phone: parseInt(customerPhone) || 0,
        sales: saleType.toUpperCase(),
      },
      sale_type: saleType.toUpperCase(),
      notes: salesNote,
      items: productItems.map((product) => {
        const selectedProduct = availableProducts.find(
          (prod) => prod.id === Number(product.productId),
        )

        let unitPrice = 0
        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          unitPrice = parseFloat(product.customPrice)
        } else {
          unitPrice = getProductPrice(selectedProduct, product)
        }

        // For pipe products, include length information
        const itemData = {
          product_id: selectedProduct?.product_type_id || product.productId,
          quantity: product.quantity,
          unit_price: unitPrice * product.quantity,
          is_custom_price: product.paymentAmount === "CUSTOM",
        }

        // Add length_in_meters for pipe products
        if (selectedProduct?.isPipe) {
          itemData.length_in_meters = product.lengthInMeters
        }

        return itemData
      }),
      payment_info: {
        amount: totalAmount,
      },
      total_amount: totalAmount,
      partial_payment_amount: isFullyPaid ? totalAmount : deposit,
      debt_amount: !isFullyPaid ? calculateDebt() : 0,
      repayment_date: !isFullyPaid ? repayDate : null,
      is_fully_paid: isFullyPaid,
      location_id: teamId || null,
      location_type: location_type,
      location_data: hasLocation
        ? {
            latitude: locationCoordinates.latitude,
            longitude: locationCoordinates.longitude,
            accuracy: locationCoordinates.accuracy,
            timestamp: lastLocationUpdate,
            address: locationCoordinates.address,
          }
        : null,
    }

    // Handle payment methods
    if (paymentMode === "cash") {
      formData.payment_method = "CASH"
      formData.cashAmount = totalAmount
      formData.payment_info.payment_method = "CASH"
    } else if (paymentMode === "mpesa") {
      formData.payment_method = "MPESA"
      formData.payment_info.payment_method = "MPESA"

      if (validMpesaCodes.length === 0) {
        toast.error("Please enter at least one M-Pesa code")
        setIsSubmitting(false)
        return
      }

      if (validMpesaCodes.length === 1) {
        formData.payment_info.mpesa_receipt_number = validMpesaCodes[0].code
        if (customerPhone) {
          formData.payment_info.mpesa_phone_number = customerPhone
        }
      } else {
        formData.mpesa_payments = validMpesaCodes.map((code) => ({
          code: code.code,
          amount:
            parseFloat(code.amount) || totalAmount / validMpesaCodes.length,
        }))
        if (customerPhone) {
          formData.payment_info.mpesa_phone_number = customerPhone
        }
      }
    } else if (paymentMode === "mpesa_cash") {
      formData.payment_method = "CASH+MPESA"
      formData.payment_info.payment_method = "CASH+MPESA"
      formData.cashAmount = cashAmount
      formData.mpesaAmount = totalAmount - cashAmount

      if (validMpesaCodes.length === 0) {
        toast.error("Please enter at least one M-Pesa code")
        setIsSubmitting(false)
        return
      }

      if (validMpesaCodes.length === 1) {
        formData.payment_info.mpesa_receipt_number = validMpesaCodes[0].code
        if (customerPhone) {
          formData.payment_info.mpesa_phone_number = customerPhone
        }
      } else {
        formData.mpesa_payments = validMpesaCodes.map((code) => ({
          code: code.code,
          amount:
            parseFloat(code.amount) ||
            (totalAmount - cashAmount) / validMpesaCodes.length,
        }))
        if (customerPhone) {
          formData.payment_info.mpesa_phone_number = customerPhone
        }
      }
    }

    // Set location based on team type
    if (teamType === "shop") {
      formData.shop = teamId
    } else if (teamType === "vehicle") {
      formData.vehicle = teamId
    } else {
      formData.store = teamId
    }

    try {
      // You'll need to create this API endpoint or reuse existing one
      const response = await api.post("/sales/sales/", formData)
      toast.success("🎉 Product sale recorded successfully!")
      setSaleResponse(response.data)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error submitting sale:", error)
      toast.error(
        error.response?.data?.message ||
          "Failed to record sale. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
      setShowSummary(false)
    }
  }

  // Render product row
  const renderProductRow = (product, index) => {
    const selectedProduct = availableProducts.find(
      (prod) => prod.id === Number(product.productId),
    )

    // Filter available products
    const filteredProducts = availableProducts.filter(
      (prod) =>
        prod.id === Number(product.productId) ||
        !productItems.some(
          (p, i) => i !== index && p.productId === prod.id.toString(),
        ),
    )

    return (
      <div
        key={index}
        className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Product {index + 1}</h3>
          {productItems.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveProduct(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Product
            </label>
            {isLoadingProducts ? (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-700">
                No products available from this source
              </div>
            ) : (
              <select
                value={product.productId}
                onChange={(e) =>
                  handleProductChange(index, "productId", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select product</option>
                {filteredProducts.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.product} {prod.isPipe ? "(Price per meter)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedProduct && (
            <>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedProduct.isPipe
                      ? "Price per meter:"
                      : "Price per unit:"}
                  </span>
                  <span className="font-bold text-blue-600">
                    <FormattedAmount
                      amount={
                        saleType === "retail"
                          ? selectedProduct.retail_price
                          : selectedProduct.whole_sales_price
                      }
                    />
                  </span>
                </div>

                {selectedProduct.isPipe && (
                  <div className="mt-2 text-xs text-gray-500">
                    Pipe product - price is per meter
                  </div>
                )}

                {/* Source info */}
                <div className="flex justify-between text-xs mt-2 text-blue-700">
                  <span>Source:</span>
                  <span className="font-medium">
                    {teamType === "shop"
                      ? `Shop: ${teamName || "N/A"}`
                      : teamType === "vehicle"
                      ? `Vehicle: ${teamName || "N/A"}`
                      : "Store"}
                  </span>
                </div>
              </div>

              {/* Length input for pipe products */}
              {selectedProduct.isPipe && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Length (meters)
                  </label>
                  <input
                    type="number"
                    value={product.lengthInMeters || 1}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "lengthInMeters",
                        parseFloat(e.target.value) || 1,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0.1"
                    step="0.1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total price:{" "}
                    <FormattedAmount
                      amount={
                        getProductPrice(selectedProduct, product) *
                        product.quantity
                      }
                    />
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Pricing Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleProductChange(index, "paymentAmount", "MAXIMUM")
                    }
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      product.paymentAmount === "MAXIMUM"
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    Standard Price
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleProductChange(index, "paymentAmount", "CUSTOM")
                    }
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      product.paymentAmount === "CUSTOM"
                        ? "bg-green-100 border-green-500 text-green-600"
                        : "bg-white border-gray-300 hover:border-green-300"
                    }`}
                  >
                    Custom Price
                  </button>
                </div>
              </div>

              {product.paymentAmount === "CUSTOM" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Custom Amount (Ksh)
                  </label>
                  <input
                    type="number"
                    value={product.customPrice || ""}
                    onChange={(e) =>
                      handleProductChange(index, "customPrice", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter amount"
                    min="0"
                    required
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() =>
                  handleProductChange(
                    index,
                    "quantity",
                    Math.max(1, product.quantity - 1),
                  )
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <span className="text-lg">−</span>
              </button>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "quantity",
                    parseInt(e.target.value) || 1,
                  )
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                min={1}
                required
              />
              <button
                type="button"
                onClick={() =>
                  handleProductChange(index, "quantity", product.quantity + 1)
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render order summary
  const renderOrderSummary = () => {
    const summary = getProductSummary()
    const totalAmount = calculateTotal()
    const isFullyPaid = paymentType === "FULLY_PAID"
    const debtAmount = calculateDebt()

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-5 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Receipt className="mr-2" />
                Order Summary
              </h2>
              <button
                onClick={() => setShowSummary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Review your order before submission
            </p>
          </div>

          <div className="p-5">
            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Customer Details
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {customerName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {customerPhone || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-right">
                    {customerLocationName || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sale Type */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Sale Type</h3>
              <div className="flex items-center">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    saleType === "retail"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {saleType === "retail" ? "Retail" : "Wholesale"}
                </div>
              </div>
            </div>

            {/* Products */}
            {summary.products.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Products</h3>
                <div className="space-y-3">
                  {summary.products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{product.name}</span>
                        <span className="font-bold text-blue-700">
                          <FormattedAmount amount={product.totalPrice} />
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {product.quantity} ×{" "}
                          <FormattedAmount amount={product.unitPrice} />
                          {product.isCustom && " (Custom)"}
                          {product.isPipe && ` (${product.lengthInMeters}m)`}
                        </span>
                        <span>
                          {product.quantity} unit
                          {product.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Amount Summary
              </h3>
              <div className="space-y-2">
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">
                      <FormattedAmount amount={totalAmount} />
                    </span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Payment Type:</span>
                    <span
                      className={`font-medium ${
                        paymentType === "FULLY_PAID"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {paymentType === "FULLY_PAID"
                        ? "Fully Paid"
                        : "On Credit"}
                    </span>
                  </div>

                  {paymentType === "DEBT" && (
                    <>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-medium">
                          <FormattedAmount amount={deposit} />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance:</span>
                        <span className="font-bold text-yellow-700">
                          <FormattedAmount amount={debtAmount} />
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {paymentMode === "cash"
                        ? "Cash"
                        : paymentMode === "mpesa"
                        ? "M-Pesa"
                        : "Cash + M-Pesa"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Customer Location:</span>
                  <span className="font-medium text-right">
                    {customerLocationName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPS Location:</span>
                  <span
                    className={`font-medium ${
                      hasLocation ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {hasLocation ? "✓ Captured" : "Not captured"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white pt-4 border-t">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSummary(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    saleType === "retail"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm & Submit"
                  )}
                </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                By submitting, you confirm that all details are correct
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render success modal (similar to CylinderSales but simplified for products)
  const renderSuccessModal = () => {
    if (!saleResponse) return null

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    const formatCurrency = (amount) => {
      return `Ksh ${parseFloat(amount).toLocaleString()}`
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <CheckCircle className="mr-3 h-8 w-8" />
                  Sale Completed Successfully!
                </h2>
                <p className="text-green-100 mt-1">
                  Invoice: {saleResponse.invoice_number}
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-white hover:text-green-100 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Invoice Summary */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="text-lg font-bold text-blue-700">
                    {saleResponse.invoice_number}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(saleResponse.created_at)}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Customer Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Name</p>
                    <p className="font-medium">
                      {saleResponse.customer_info.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Phone</p>
                    <p className="font-medium">
                      {saleResponse.customer_info.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Sale Type</p>
                    <p className="font-medium">{saleResponse.sale_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Location</p>
                    <p className="font-medium">
                      {saleResponse.location_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Items */}
              {saleResponse.items && saleResponse.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Products</h3>
                  <div className="space-y-3">
                    {saleResponse.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-green-50 p-4 rounded-xl border border-green-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-green-800">
                              {item.product_name}
                            </h4>
                            <p className="text-sm text-green-700">
                              {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                              {item.length_in_meters &&
                                ` • ${item.length_in_meters}m`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-800">
                              {formatCurrency(item.total_price)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Unit: {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {saleResponse.payments && saleResponse.payments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    {saleResponse.payments.map((payment, index) => (
                      <div
                        key={payment.id}
                        className="bg-yellow-50 p-4 rounded-xl border border-yellow-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-yellow-800">
                              {payment.payment_method} Payment
                            </h4>
                            <p className="text-sm text-yellow-700">
                              {formatDate(payment.transaction_date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-800">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p
                              className={`text-sm ${
                                payment.is_verified
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {payment.is_verified
                                ? "✓ Verified"
                                : "Pending Verification"}
                            </p>
                          </div>
                        </div>
                        {payment.mpesa_receipt_number && (
                          <div className="mt-2 text-sm">
                            <p className="text-gray-600">
                              M-Pesa Receipt: {payment.mpesa_receipt_number}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount Summary */}
              <div className="bg-gray-50 p-5 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Amount Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-blue-700">
                      {formatCurrency(saleResponse.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(saleResponse.amount_paid)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Balance Due:</span>
                    <span
                      className={`font-bold ${
                        saleResponse.balance_due === "0.00"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {formatCurrency(saleResponse.balance_due)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Payment Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        saleResponse.payment_status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {saleResponse.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handlePrintReceipt()}
                className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
              >
                <Receipt className="mr-2" />
                Print Receipt
              </button>
              <button
                onClick={() =>
                  navigate(
                    teamId
                      ? `/admins/salesdata/${teamId}/${teamName}/${teamType}`
                      : "/sales",
                  )
                }
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                View All Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlePrintReceipt = () => {
    if (!saleResponse) return

    const printContent = `
    <html>
      <head>
        <title>Receipt - ${saleResponse.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .invoice-number { font-size: 18px; font-weight: bold; }
          .section { margin-bottom: 15px; }
          .total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
          .thank-you { text-align: center; margin-top: 30px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Product Sales Receipt</h2>
          <div class="invoice-number">${saleResponse.invoice_number}</div>
          <div>Date: ${new Date(saleResponse.created_at).toLocaleString()}</div>
        </div>
        
        <div class="section">
          <h3>Customer: ${saleResponse.customer_info.name}</h3>
          <p>Phone: ${saleResponse.customer_info.phone}</p>
        </div>
        
        <div class="section">
          <h3>Items:</h3>
          ${saleResponse.items
            ?.map(
              (item) => `
            <p>${item.product_name}${
                item.length_in_meters ? ` (${item.length_in_meters}m)` : ""
              } - ${item.quantity} x Ksh ${item.unit_price} = Ksh ${
                item.total_price
              }</p>
          `,
            )
            .join("")}
        </div>
        
        <div class="section">
          <h3>Payment:</h3>
          <p>Method: ${saleResponse.payment_method}</p>
          <p>Amount: Ksh ${saleResponse.total_amount}</p>
          <p>Status: ${saleResponse.payment_status}</p>
        </div>
        
        <div class="total">
          Total: Ksh ${saleResponse.total_amount}
        </div>
        
        <div class="thank-you">
          <p>Thank you for your business!</p>
        </div>
      </body>
    </html>
  `

    const printWindow = window.open("", "_blank")
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const getPageTitle = () => {
    if (saleType === "retail") {
      return "Product Retail Sale"
    } else if (saleType === "wholesale") {
      return "Product Wholesale Sale"
    }
    return "Product Sale"
  }

  const getPageDescription = () => {
    if (saleType === "retail") {
      return "Record retail product sales (grills, burners, pipes, etc.)"
    } else if (saleType === "wholesale") {
      return "Record wholesale product sales (grills, burners, pipes, etc.)"
    }
    return "Record product sales"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>
      {showSummary && renderOrderSummary()}
      {showSuccessModal && renderSuccessModal()}

      {isMobile ? (
        <div className="flex flex-col min-h-screen">
          <Navbar
            headerMessage={getPageTitle()}
            headerText={getPageDescription()}
          />

          <main className="flex-grow p-4">
            {/* Team Info */}
            {teamId && (
              <div
                className={`bg-gradient-to-r ${
                  saleType === "retail"
                    ? "from-blue-500 to-blue-600"
                    : "from-green-500 to-green-600"
                } text-white rounded-2xl p-4 mb-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      {teamType === "shop" ? "🏪" : "🚚"}
                    </div>
                    <div>
                      <p className="text-sm opacity-90">
                        Recording {saleType} sale for:{" "}
                        <span className="font-bold">{teamName}</span>
                      </p>
                      <p className="font-semibold">
                        {teamType === "shop"
                          ? "Shop Team"
                          : teamType === "vehicle"
                          ? "Vehicle Team"
                          : "Store Team"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fetchProducts}
                    disabled={isLoadingProducts}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
                    title="Refresh product data"
                  >
                    <Refresh
                      className={isLoadingProducts ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>
            )}

            {!teamId && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    🏬
                  </div>
                  <div>
                    <p className="text-sm opacity-90">
                      Recording {saleType} sale from:
                    </p>
                    <p className="font-semibold">Main Store</p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Fetch Status */}
            {productFetchError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center text-red-700">
                  <span className="mr-2">⚠️</span>
                  <span>{productFetchError}</span>
                </div>
              </div>
            )}

            {/* Sale Type Badge */}
            <div className="flex justify-center mb-6">
              <div
                className={`px-6 py-2 rounded-full font-semibold ${
                  saleType === "retail"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {saleType === "retail" ? "🛒 Retail Sale" : "🏢 Wholesale Sale"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">👤</span>
                  {saleType === "wholesale"
                    ? "Business Details"
                    : "Customer Details"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {saleType === "wholesale"
                        ? "Business Name"
                        : "Customer Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setSearchingBy("name")
                          setCustomerName(e.target.value)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          saleType === "wholesale"
                            ? "Enter business name"
                            : "Enter customer name"
                        }
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {searchResults.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => {
                                setCustomerName(customer.name)
                                setCustomerPhone(customer.phone)
                                setCustomerLocationName(customer.location)
                                setSearchResults([])
                              }}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-600">
                                {customer.phone} • {customer.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          setSearchingBy("phone")
                          setCustomerPhone(e.target.value)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="07XX XXX XXX"
                      />
                      {searchPhoneResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {searchPhoneResults.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => {
                                setCustomerName(customer.name)
                                setCustomerPhone(customer.phone)
                                setCustomerLocationName(customer.location)
                                setSearchPhoneResults([])
                              }}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-600">
                                {customer.phone} • {customer.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Location Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {saleType === "wholesale"
                        ? "Business Location"
                        : "Customer Location"}
                    </label>
                    <input
                      type="text"
                      value={customerLocationName}
                      onChange={(e) => setCustomerLocationName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        saleType === "wholesale"
                          ? "Enter business location/address"
                          : "Enter customer location/address"
                      }
                      required
                    />
                  </div>

                  {/* Device Location Capture Section (same as CylinderSales) */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Device Location (GPS)
                      </label>
                      {lastLocationUpdate && (
                        <span className="text-xs text-gray-500">
                          Last updated: {lastLocationUpdate}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                          <div className="text-sm text-gray-600">
                            {hasLocation ? (
                              <div className="flex justify-between items-center">
                                <span>GPS Location Captured ✓</span>
                                <CheckCircle className="text-green-500 h-5 w-5" />
                              </div>
                            ) : (
                              "No GPS location captured"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className={`px-4 py-3 rounded-lg border transition-all flex items-center justify-center ${
                            isGettingLocation
                              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                              : hasLocation
                              ? "bg-green-100 border-green-500 text-green-600 hover:bg-green-200"
                              : "bg-blue-100 border-blue-500 text-blue-600 hover:bg-blue-200"
                          }`}
                          title={
                            hasLocation
                              ? "Device location captured! Click to recapture"
                              : "Capture device GPS location"
                          }
                        >
                          {isGettingLocation ? (
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : hasLocation ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <MyLocation className="h-5 w-5" />
                          )}
                        </button>

                        {hasLocation && !isGettingLocation && (
                          <button
                            type="button"
                            onClick={refreshLocation}
                            className="px-4 py-3 bg-yellow-100 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all flex items-center justify-center"
                            title="Refresh device location"
                          >
                            <Refresh className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Location details display */}
                    {hasLocation && locationCoordinates.latitude && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-blue-800">
                            Device GPS Details:
                          </h4>
                          <button
                            type="button"
                            onClick={copyCoordinates}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                          >
                            Copy Coordinates
                          </button>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex">
                            <span className="font-medium text-blue-700 w-24">
                              Coordinates:
                            </span>
                            <span className="text-blue-900">
                              {locationCoordinates.latitude},{" "}
                              {locationCoordinates.longitude}
                            </span>
                          </div>
                          {locationCoordinates.accuracy && (
                            <div className="flex">
                              <span className="font-medium text-blue-700 w-24">
                                Accuracy:
                              </span>
                              <span className="text-blue-900">
                                ±{locationCoordinates.accuracy} meters
                              </span>
                            </div>
                          )}
                          {locationCoordinates.address && (
                            <div className="flex">
                              <span className="font-medium text-blue-700 w-24">
                                Address:
                              </span>
                              <span className="text-blue-900">
                                {locationCoordinates.address}
                              </span>
                            </div>
                          )}
                          {lastLocationUpdate && (
                            <div className="flex">
                              <span className="font-medium text-blue-700 w-24">
                                Time:
                              </span>
                              <span className="text-blue-900">
                                {lastLocationUpdate}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          This GPS location will be submitted with the sale
                          record.
                        </p>
                      </div>
                    )}

                    {locationError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center text-red-700">
                          <LocationOff className="h-4 w-4 mr-2" />
                          <span className="text-xs">{locationError}</span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      {hasLocation
                        ? "Device GPS location captured and ready for submission."
                        : "Click the location button to capture device GPS coordinates."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">📦</span>
                    Products
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({availableProducts.length} available)
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={fetchProducts}
                      disabled={isLoadingProducts}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                      title="Refresh product data"
                    >
                      <Refresh
                        className={`h-4 w-4 mr-1 ${
                          isLoadingProducts ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      + Add Product
                    </button>
                  </div>
                </div>

                {isLoadingProducts ? (
                  <div className="text-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 mx-auto text-blue-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-gray-600 mt-2">Loading products...</p>
                  </div>
                ) : availableProducts.length === 0 ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-700">
                      No products available from this source
                    </p>
                    <button
                      type="button"
                      onClick={fetchProducts}
                      className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productItems.map((product, index) =>
                      renderProductRow(product, index),
                    )}
                  </div>
                )}
              </div>

              {/* Payment Section (similar to CylinderSales but without cylinder exchange) */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  💳 Payment Details
                </h2>

                <div className="space-y-6">
                  {/* Payment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      Payment Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType("FULLY_PAID")}
                        className={`py-3 px-4 rounded-xl border transition-all ${
                          paymentType === "FULLY_PAID"
                            ? "bg-green-100 border-green-500 text-green-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        💰 Fully Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("DEBT")}
                        className={`py-3 px-4 rounded-xl border transition-all ${
                          paymentType === "DEBT"
                            ? "bg-yellow-100 border-yellow-500 text-yellow-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        📝 On Credit
                      </button>
                    </div>
                  </div>

                  {/* Debt Details */}
                  {paymentType === "DEBT" && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-3">
                        Credit Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-yellow-700 mb-1">
                            Deposit Amount (Ksh)
                          </label>
                          <input
                            type="number"
                            value={deposit}
                            onChange={(e) =>
                              setDeposit(parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            min="0"
                            max={calculateTotal()}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-yellow-700 mb-1">
                            Repayment Date
                          </label>
                          <input
                            type="date"
                            value={repayDate}
                            onChange={(e) => setRepayDate(e.target.value)}
                            className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-yellow-800">
                              Credit Balance:
                            </span>
                            <span className="font-bold text-yellow-900">
                              <FormattedAmount amount={calculateDebt()} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMode("cash")}
                        className={`py-3 rounded-xl border transition-all ${
                          paymentMode === "cash"
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        💵 Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode("mpesa")}
                        className={`py-3 rounded-xl border transition-all ${
                          paymentMode === "mpesa"
                            ? "bg-green-100 border-green-500 text-green-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={mpesalogo}
                          alt="M-Pesa"
                          className="h-5 mx-auto w-16"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode("mpesa_cash")}
                        className={`py-3 rounded-xl border transition-all ${
                          paymentMode === "mpesa_cash"
                            ? "bg-purple-100 border-purple-500 text-purple-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        💰 + M-Pesa
                      </button>
                    </div>
                  </div>

                  {/* Cash Amount */}
                  {(paymentMode === "cash" || paymentMode === "mpesa_cash") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Cash Amount (Ksh)
                      </label>
                      <input
                        type="number"
                        value={cashAmount}
                        onChange={(e) =>
                          setCashAmount(parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max={calculateTotal()}
                        required={paymentMode === "cash"}
                      />
                    </div>
                  )}

                  {/* M-Pesa Details */}
                  {(paymentMode === "mpesa" ||
                    paymentMode === "mpesa_cash") && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-green-800 flex items-center">
                          <img
                            src={mpesalogo}
                            alt="M-Pesa"
                            className="h-6 w-20 mr-2"
                          />
                          M-Pesa Details
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleMpesaPrompt(0)}
                            disabled={isCheckingMpesa}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center disabled:opacity-50"
                          >
                            <span>Prompt</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => checkMpesaPayment(0)}
                            disabled={isCheckingMpesa}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center disabled:opacity-50"
                          >
                            <Refresh
                              className={`h-4 w-4 mr-1 ${
                                isCheckingMpesa ? "animate-spin" : ""
                              }`}
                            />
                            Refresh
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Phone Number Input */}
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">
                            Phone Number for M-Pesa
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => {
                              setSearchingBy("phone")
                              setCustomerPhone(e.target.value)
                            }}
                            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="07XX XXX XXX"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter the phone number used for M-Pesa payment
                          </p>
                        </div>

                        {/* Number of Deposits */}
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">
                            Number of M-Pesa Deposits
                          </label>
                          <input
                            type="number"
                            value={numMpesaDeposits}
                            onChange={handleNumDepositsChange}
                            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            min="1"
                            max="2"
                            required
                          />
                        </div>

                        {/* First M-Pesa Payment */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-green-700">
                              First M-Pesa Code
                            </label>
                            <div className="text-xs text-gray-500">
                              Expected: Ksh{" "}
                              {getExpectedAmountForPayment(0).toLocaleString()}
                            </div>
                          </div>

                          <input
                            type="text"
                            value={mpesaCodes[0]?.code || ""}
                            onChange={(e) =>
                              handleMpesaCodeChange(0, "code", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., RF48HGT678"
                            required
                          />

                          {/* Verification Status for First Payment */}
                          {renderMpesaVerificationStatus(0)}
                        </div>

                        {/* Second M-Pesa Payment (if needed) */}
                        {numMpesaDeposits > 1 && (
                          <div className="space-y-4 pt-4 border-t border-green-200">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-green-700">
                                  Second M-Pesa Code
                                </label>
                                <div className="text-xs text-gray-500">
                                  Remaining: Ksh{" "}
                                  {remainingAmount.toLocaleString()}
                                </div>
                              </div>

                              <input
                                type="text"
                                value={mpesaCodes[1]?.code || ""}
                                onChange={(e) =>
                                  handleMpesaCodeChange(
                                    1,
                                    "code",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="e.g., RF48HGT679"
                                required={numMpesaDeposits > 1}
                              />

                              {/* Phone Option for Second Payment */}
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                  Pay with same phone number?
                                </label>
                                <div className="flex space-x-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePhoneOptionChange("same")
                                    }
                                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                                      useSamePhone
                                        ? "bg-blue-100 border-blue-500 text-blue-600"
                                        : "bg-gray-100 border-gray-300 hover:border-gray-400"
                                    }`}
                                  >
                                    Same Phone
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handlePhoneOptionChange("different")
                                    }
                                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                                      !useSamePhone
                                        ? "bg-green-100 border-green-500 text-green-600"
                                        : "bg-gray-100 border-gray-300 hover:border-gray-400"
                                    }`}
                                  >
                                    Different Phone
                                  </button>
                                </div>
                              </div>

                              {/* Different Phone Input */}
                              {!useSamePhone && (
                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Phone Number for Second Payment
                                  </label>
                                  <input
                                    type="tel"
                                    value={mpesaPhoneNumber}
                                    onChange={(e) =>
                                      setMpesaPhoneNumber(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="07XX XXX XXX"
                                  />
                                </div>
                              )}

                              {/* Second Payment Buttons */}
                              <div className="flex space-x-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => handleMpesaPrompt(1)}
                                  disabled={isCheckingMpesa}
                                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50"
                                >
                                  <span>Prompt for 2nd Payment</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => checkMpesaPayment(1)}
                                  disabled={isCheckingMpesa}
                                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50"
                                >
                                  <Refresh
                                    className={`h-4 w-4 mr-1 ${
                                      isCheckingMpesa ? "animate-spin" : ""
                                    }`}
                                  />
                                  Refresh
                                </button>
                              </div>

                              {/* Verification Status for Second Payment */}
                              {renderMpesaVerificationStatus(1)}

                              {/* Duplicate Code Warning */}
                              {mpesaCodes[0]?.code &&
                                mpesaCodes[1]?.code &&
                                mpesaCodes[0].code === mpesaCodes[1].code && (
                                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-700">
                                      ⚠️ The second M-Pesa code is the same as
                                      the first. Please wait for the second
                                      payment to be processed.
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sales Note */}
                <div className="mt-2">
                  <span className="text-sm">Note</span>
                  <input
                    type="text"
                    value={salesNote}
                    onChange={(e) => setSalesNote(e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mt-2"
                    placeholder="sales sticky note"
                  />
                </div>
              </div>

              {/* Summary & Submit */}
              <div className="sticky bottom-0 bg-white rounded-t-2xl shadow-lg p-5 border-t">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-lg font-semibold">
                      <FormattedAmount amount={calculateTotal()} />
                    </span>
                  </div>
                  {paymentType === "DEBT" && (
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-600">Credit Balance:</span>
                      <span className="text-lg font-bold text-yellow-700">
                        <FormattedAmount amount={calculateDebt()} />
                      </span>
                    </div>
                  )}
                  {hasLocation && (
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-green-600">Device GPS:</span>
                      <span className="font-medium text-green-700">
                        ✓ Ready to submit
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-blue-600">Source:</span>
                    <span className="font-medium text-blue-700">
                      {teamType === "shop"
                        ? `Shop: ${teamName || "N/A"}`
                        : teamType === "vehicle"
                        ? `Vehicle: ${teamName || "N/A"}`
                        : "Store"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || availableProducts.length === 0}
                  className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    saleType === "retail"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : showSummary ? (
                    "Confirm & Submit"
                  ) : (
                    "Review Order Summary"
                  )}
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  {showSummary
                    ? "Click 'Confirm & Submit' to complete the sale"
                    : "Click to review all details before submission"}
                </p>
              </div>
            </form>
          </main>

          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                Product Sales
              </h1>
              <p className="text-gray-600 mb-8">
                Desktop version coming soon. Please use mobile view for
                recording sales.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSales
