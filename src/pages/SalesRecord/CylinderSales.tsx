// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate, useLocation } from "react-router-dom"

import mpesalogo from "../../images/Mpesa-Logo.png"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectMyProfile } from "../../features/employees/myProfileSlice"
import {
  LocationOn,
  MyLocation,
  Refresh,
  CheckCircle,
  LocationOff,
  Receipt,
} from "@mui/icons-material"
import {
  fetchAssignedProducts,
  selectAllAssignedProducts,
} from "../../features/product/assignedProductsSlice"
import { getSalesError, recordSales } from "../../features/sales/salesSlice"
import FormattedAmount from "../../components/FormattedAmount"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import api from "../../../utils/api"
import planStatus from "../../features/planStatus/planStatus"

const CylinderSales = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()
  const navigate = useNavigate()
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
  const company = businessId

  // Get query parameters
  const queryParams = new URLSearchParams(location.search)
  const saleType = queryParams.get("type") || "retail" // 'retail' or 'wholesale'

  // Get team ID if present in URL
  const pathParts = location.pathname.split("/")

  const teamId =
    pathParts.includes("shop") || pathParts.includes("vehicle")
      ? pathParts[pathParts.length - 1]
      : null

  const teamName =
    pathParts.includes("shop") || pathParts.includes("vehicle")
      ? decodeURIComponent(pathParts[pathParts.length - 2])
      : null

  const teamType = pathParts.includes("shop")
    ? "shop"
    : pathParts.includes("vehicle")
    ? "vehicle"
    : null

  // State
  const [searchResults, setSearchResults] = useState([])
  const [searchPhoneResults, setSearchPhoneResults] = useState([])
  const [searchingBy, setSearchingBy] = useState("")
  const [cylinderExchanged, setCylinderExchanged] = useState("")
  const [availableCylinders, setAvailableCylinders] = useState([]) // Store fetched cylinders
  const [availableProducts, setAvailableProducts] = useState([])
  const [isLoadingCylinders, setIsLoadingCylinders] = useState(false)
  const [cylinderFetchError, setCylinderFetchError] = useState("")
  const [productFetchError, setProductFetchError] = useState("")
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [salesNote, setSalesNote] = useState("")

  // NEW: Sales type state (refill, complete, outlet)
  const [salesType, setSalesType] = useState("refill") // Default to refill

  // Customer details
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocationName, setCustomerLocationName] = useState("") // User-entered location name
  const [customerType, setCustomerType] = useState(
    saleType === "wholesale" ? "BUSINESS" : "INDIVIDUAL",
  )

  // Location tracking state (for device coordinates)
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

  // Products
  const [cylinderProducts, setCylinderProducts] = useState([
    { productId: "", quantity: 1, paymentAmount: "MAXIMUM", customPrice: "" },
  ])

  // NEW: Additional products for complete sales
  const [additionalProducts, setAdditionalProducts] = useState([
    { productId: "", quantity: 1, paymentAmount: "MAXIMUM", customPrice: "" },
  ])

  // Payment
  const [paymentType, setPaymentType] = useState("FULLY_PAID")
  const [deposit, setDeposit] = useState(0)
  const [repayDate, setRepayDate] = useState("")
  const [exchangedWithLocal, setExchangedWithLocal] = useState(false)

  // Payment mode
  const [paymentMode, setPaymentMode] = useState("cash")
  const [cashAmount, setCashAmount] = useState<number>(0)
  const [numMpesaDeposits, setNumMpesaDeposits] = useState(1)
  const [mpesaCodes, setMpesaCodes] = useState([{ code: "", amount: 0 }])

  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false)

  // NEW: Show summary state
  const [showSummary, setShowSummary] = useState(false)

  // Data
  const myProfile = useAppSelector(selectMyProfile)
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts)
  const operationError = useAppSelector(getSalesError)
  const [watchId, setWatchId] = useState(null)

  // Fetch cylinder data based on source
  const fetchCylinders = async () => {
    setIsLoadingCylinders(true)
    setCylinderFetchError("")

    try {
      let response

      if (teamType === "shop" && teamId) {
        // Fetch from shop
        response = await api.get(`/inventory/shops/${teamId}/cylinders/`)
        console.log("shop cylinders ", response.data)
      } else if (teamType === "vehicle" && teamId) {
        // Fetch from vehicle
        response = await api.get(`/inventory/vehicles/${teamId}/cylinders/`)
      } else {
        // Fetch from store (default)
        response = await api.get(`/inventory/stores/cylinders/`)
      }

      if (response.data && Array.isArray(response.data)) {
        // Transform the data to match your existing structure
        const transformedCylinders = response.data.map((cylinder) => ({
          id: cylinder.id || cylinder.product_id,
          gas_type: cylinder?.cylinder?.cylinder_type?.name || 0,
          weight: cylinder?.cylinder?.weight?.weight || 0,
          filled: cylinder.full_cylinder_quantity || cylinder.stock || 0,
          retail_refil_price: cylinder?.cylinder.retail_refill_price || 0,
          complete_retail_price: cylinder?.cylinder?.complete_retail_price || 0,
          outlet_retail_price: cylinder?.cylinder?.outlet_retail_price || 0,

          outlet_wholesale_price:
            cylinder?.cylinder?.outlet_wholesale_price || 0,
          complete_wholesale_price:
            cylinder?.cylinder?.complete_wholesale_price || 0,
          wholesale_refil_price:
            cylinder?.cylinder?.wholesale_refill_price || 0,
          wholesale_price: cylinder.wholesale_price || cylinder.bulk_price,
          // Add any other necessary fields
        }))

        setAvailableCylinders(transformedCylinders)
        // toast.success(`Loaded ${transformedCylinders.length} cylinders`)
      } else {
        setCylinderFetchError("Invalid data format received")
        toast.error("Failed to load cylinder data")
      }
    } catch (error) {
      console.error("Error fetching cylinders:", error)
      setCylinderFetchError(error.message || "Failed to fetch cylinders")
      toast.error("Failed to load available cylinders")

      // Fallback to assigned products if API fails
      if (allAssignedProducts.length > 0) {
        setAvailableCylinders(allAssignedProducts)
        // toast.info("Using available assigned products as fallback")
      }
    } finally {
      setIsLoadingCylinders(false)
    }
  }

  // Fetch accessory products data based on source
  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    setProductFetchError("")

    try {
      let response

      if (teamType === "shop" && teamId) {
        // Fetch from shop
        response = await api.get(`/inventory/shops/${teamId}/products/`)
        console.log("shop products ", response.data)
      } else if (teamType === "vehicle" && teamId) {
        // Fetch from vehicle
        response = await api.get(`/inventory/vehicles/${teamId}/products/`)
      } else {
        // Fetch from store (default)
        response = await api.get(`/inventory/stores/products/`)
      }

      if (response.data && Array.isArray(response.data)) {
        // Transform the data to match your existing structure
        const transformedProducts = response.data.map((product) => ({
          id: product.id || 0,
          product: product?.product?.name || 0,
          retail_price: product?.product?.retail_sales_price || 0,
          whole_sales_price: product?.product?.whole_sales_price || 0,
          // Add any other necessary fields
        }))

        setAvailableProducts(transformedProducts)
        // toast.success(`Loaded ${transformedProducts.length} products`)
      } else {
        setProductFetchError("Invalid data format received")
        toast.error("Failed to load product data")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProductFetchError(error.message || "Failed to fetch products")
      // toast.error("Failed to load available products")
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    // Set customer type based on sale type
    setCustomerType(saleType === "wholesale" ? "BUSINESS" : "INDIVIDUAL")

    // Fetch cylinder data
    fetchCylinders()
    fetchProducts()

    // Also fetch assigned products as fallback
    // dispatch(fetchAssignedProducts())
  }, [saleType, teamType, teamId])

  // Function to get current location (device coordinates)
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    setLocationError("")

    // Clear any existing watcher
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // 20 seconds
      maximumAge: 10000, // 10 seconds max age
    }

    // Use watchPosition instead of getCurrentPosition
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        // Stop watching after we get a good position
        navigator.geolocation.clearWatch(id)
        setWatchId(null)

        const { latitude, longitude, accuracy } = position.coords

        // Accept location only if accuracy is reasonable
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

        // Get address from coordinates but don't auto-fill the location name field
        try {
          const address = await getAddressFromCoordinates(latitude, longitude)
          setLocationCoordinates((prev) => ({
            ...prev,
            address: address || "",
          }))

          // Show address in the display but don't auto-fill customerLocationName
          toast
            .success
            // "Device location captured! Enter customer location separately.",
            ()
        } catch (error) {
          console.log("Reverse geocoding failed, coordinates only")
        }

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
              "Location access denied. Please enable location services in your device settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location unavailable. Make sure location/GPS is turned ON."
            break
          case error.TIMEOUT:
            errorMessage =
              "Taking too long to get location. Please check: 1) GPS is ON 2) You're outdoors 3) Location permission granted"
            break
        }

        setLocationError(errorMessage)
        toast.error(errorMessage)

        // Try IP fallback after timeout
        if (error.code === error.TIMEOUT) {
          setTimeout(() => getIPBasedLocation(), 1000)
        }
      },
      options,
    )

    setWatchId(id)

    // Auto-clear after 25 seconds
    setTimeout(() => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
        setWatchId(null)
        if (isGettingLocation) {
          setIsGettingLocation(false)
          // toast.error("Location request cancelled after 25 seconds")
          getIPBasedLocation() // Try IP fallback
        }
      }
    }, 25000)
  }

  // Don't forget to clear watch on component unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  // Function to get approximate location via IP
  const getIPBasedLocation = async () => {
    try {
      // toast.info("Trying alternative location method...")

      // Using IP-based location service
      const response = await fetch("https://ipapi.co/json/")

      if (!response.ok) {
        throw new Error("IP location failed")
      }

      const data = await response.json()

      if (data.latitude && data.longitude) {
        const coords = {
          latitude: data.latitude.toFixed(6),
          longitude: data.longitude.toFixed(6),
          accuracy: 50000, // IP-based location is less accurate (~50km)
          address: `${data.city || ""}, ${data.region || ""}, ${
            data.country_name || ""
          }`,
        }

        setLocationCoordinates(coords)
        setHasLocation(true)
        setLastLocationUpdate(new Date().toLocaleTimeString())

        // toast.success("Approximate device location captured via IP")
      }
    } catch (ipError) {
      console.error("IP location error:", ipError)
      toast.error("Could not determine device location")
    }
  }

  // Function to refresh location
  const refreshLocation = () => {
    setHasLocation(false)
    setLastLocationUpdate("")
    getCurrentLocation()
  }

  // Function to get address from coordinates (reverse geocoding)
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      )

      if (!response.ok) {
        throw new Error("Reverse geocoding failed")
      }

      const data = await response.json()

      if (data.address) {
        // Construct a readable address
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
      console.error("Reverse geocoding error:", error)
      return null
    }
  }

  // Function to copy coordinates to clipboard
  const copyCoordinates = () => {
    if (locationCoordinates.latitude && locationCoordinates.longitude) {
      const coords = `${locationCoordinates.latitude}, ${locationCoordinates.longitude}`
      navigator.clipboard
        .writeText(coords)
        .then(() => {
          toast.success("Coordinates copied to clipboard!")
        })
        .catch(() => {
          toast.error("Failed to copy coordinates")
        })
    }
  }

  // Handle cylinder product changes
  const handleCylinderProductChange = (index, field, value) => {
    setCylinderProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, [field]: value } : product,
      ),
    )
  }

  const handleAddCylinderProduct = () => {
    setCylinderProducts([
      ...cylinderProducts,
      { productId: "", quantity: 1, paymentAmount: "MAXIMUM", customPrice: "" },
    ])
  }

  const handleRemoveCylinderProduct = (index) => {
    if (cylinderProducts.length > 1) {
      setCylinderProducts(cylinderProducts.filter((_, idx) => idx !== index))
    }
  }

  // Handle additional product changes (for complete sales)
  const handleAdditionalProductChange = (index, field, value) => {
    setAdditionalProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, [field]: value } : product,
      ),
    )
  }

  const handleAddAdditionalProduct = () => {
    setAdditionalProducts([
      ...additionalProducts,
      { productId: "", quantity: 1, paymentAmount: "MAXIMUM", customPrice: "" },
    ])
  }

  const handleRemoveAdditionalProduct = (index) => {
    if (additionalProducts.length > 1) {
      setAdditionalProducts(
        additionalProducts.filter((_, idx) => idx !== index),
      )
    }
  }

  // Calculate cylinder price based on sales type
  const getCylinderPrice = (selectedProduct) => {
    if (!selectedProduct) return 0

    if (salesType === "complete") {
      return saleType === "retail"
        ? selectedProduct.complete_retail_price || 0
        : selectedProduct.complete_wholesale_price || 0
    } else if (salesType === "outlet") {
      return saleType === "retail"
        ? selectedProduct.outlet_retail_price || 0
        : selectedProduct.outlet_wholesale_price || 0
    } else {
      // refill sale
      return saleType === "retail"
        ? selectedProduct.retail_refil_price || 0
        : selectedProduct.wholesale_refil_price || 0
    }
  }

  // Get product price
  const getProductPrice = (selectedProduct) => {
    if (!selectedProduct) return 0
    return saleType === "retail"
      ? selectedProduct.retail_price || 0
      : selectedProduct.whole_sales_price || 0
  }

  // Calculate total including cylinders and additional products (for complete sales)
  const calculateTotal = () => {
    let cylinderTotal = cylinderProducts.reduce((total, product) => {
      const selectedProduct = availableCylinders.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (selectedProduct) {
        let price = 0

        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          price = parseFloat(product.customPrice)
        } else {
          price = getCylinderPrice(selectedProduct)
        }

        return total + price * product.quantity
      }

      return total
    }, 0)

    // Add additional products total if it's a complete sale
    let additionalProductsTotal = 0
    if (salesType === "complete") {
      additionalProductsTotal = additionalProducts.reduce((total, product) => {
        const selectedProduct = availableProducts.find(
          (prod) => prod.id === Number(product.productId),
        )

        if (selectedProduct) {
          let price = 0

          if (product.paymentAmount === "CUSTOM" && product.customPrice) {
            price = parseFloat(product.customPrice)
          } else {
            price = getProductPrice(selectedProduct)
          }

          return total + price * product.quantity
        }

        return total
      }, 0)
    }

    return cylinderTotal + additionalProductsTotal
  }

  const calculateDebt = () => {
    const total = calculateTotal()
    return Math.max(total - deposit, 0)
  }

  // Get product summary data
  const getProductSummary = () => {
    const summary = {
      cylinders: [],
      accessories: [],
      cylinderTotal: 0,
      accessoriesTotal: 0,
      grandTotal: 0,
    }

    // Cylinder products
    cylinderProducts.forEach((product) => {
      const selectedProduct = availableCylinders.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (selectedProduct && product.productId) {
        let unitPrice = 0
        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          unitPrice = parseFloat(product.customPrice)
        } else {
          unitPrice = getCylinderPrice(selectedProduct)
        }

        const totalPrice = unitPrice * product.quantity
        summary.cylinderTotal += totalPrice

        summary.cylinders.push({
          name: `${selectedProduct.gas_type} ${selectedProduct.weight}kg`,
          quantity: product.quantity,
          unitPrice,
          totalPrice,
          isCustom: product.paymentAmount === "CUSTOM",
          customPrice: product.customPrice,
        })
      }
    })

    // Additional products (only for complete sales)
    if (salesType === "complete") {
      additionalProducts.forEach((product) => {
        const selectedProduct = availableProducts.find(
          (prod) => prod.id === Number(product.productId),
        )

        if (selectedProduct && product.productId) {
          let unitPrice = 0
          if (product.paymentAmount === "CUSTOM" && product.customPrice) {
            unitPrice = parseFloat(product.customPrice)
          } else {
            unitPrice = getProductPrice(selectedProduct)
          }

          const totalPrice = unitPrice * product.quantity
          summary.accessoriesTotal += totalPrice

          summary.accessories.push({
            name: selectedProduct.product,
            quantity: product.quantity,
            unitPrice,
            totalPrice,
            isCustom: product.paymentAmount === "CUSTOM",
            customPrice: product.customPrice,
          })
        }
      })
    }

    summary.grandTotal = summary.cylinderTotal + summary.accessoriesTotal
    return summary
  }

  // M-Pesa handling
  const handleNumDepositsChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value, 10) || 1)
    setNumMpesaDeposits(count)

    setMpesaCodes((prevCodes) => {
      const newCodes = [...prevCodes]
      while (newCodes.length < count) {
        newCodes.push({ code: "", amount: 0 })
      }
      return newCodes.slice(0, count)
    })
  }

  const handleMpesaCodeChange = (index, field, value) => {
    setMpesaCodes((prevCodes) => {
      const newCodes = [...prevCodes]
      newCodes[index][field] = value
      return newCodes
    })
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
          .catch((error) => {
            console.error("Search error:", error)
          })
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
          .catch((error) => {
            console.error("Search error:", error)
          })
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [customerPhone, searchingBy])

  // Form submission - include BOTH location name and coordinates
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Show summary before submission if not already shown
    if (!showSummary) {
      setShowSummary(true)
      // toast.info("Please review the order summary before submitting")
      return
    }

    setIsSubmitting(true)

    const isFullyPaid = paymentType === "FULLY_PAID"
    const totalAmount = calculateTotal()
    const team_type = teamType?.toLocaleUpperCase()

    const formData: any = {
      company_id: businessId,
      customer_details: {
        name: customerName,
        location: {
          name: customerLocationName, // User-entered location name
          // Include coordinates separately if available
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
        // customer_type: customerType,
        sales: saleType.toUpperCase(),
      },

      sale_type: saleType.toUpperCase(),
      notes: salesNote,
      cylinder_items: [
        // Cylinder products
        ...cylinderProducts.map((product) => {
          const selectedProduct = availableCylinders.find(
            (prod) => prod.id === Number(product.productId),
          )

          let unitPrice = 0

          if (product.paymentAmount === "CUSTOM" && product.customPrice) {
            unitPrice = parseFloat(product.customPrice)
          } else {
            unitPrice = getCylinderPrice(selectedProduct)
          }

          return {
            cylinder_id: product.productId,
            sale_type: salesType.toUpperCase(), // Use selected sales type (refill, complete, outlet)
            quantity: product.quantity,
            unit_price: unitPrice * product.quantity,
            // unit_price: unitPrice,
            empties_returned: product.quantity,
            // source_type: teamType || "store", // Add source type
            // source_id: teamId || null, // Add source ID if available
          }
        }),
        // Additional products (only for complete sales)
      ],
      product_items: [
        ...(salesType === "complete"
          ? additionalProducts.map((product) => {
              const selectedProduct = availableProducts.find(
                (prod) => prod.id === Number(product.productId),
              )

              let unitPrice = 0

              if (product.paymentAmount === "CUSTOM" && product.customPrice) {
                unitPrice = parseFloat(product.customPrice)
              } else {
                unitPrice = getProductPrice(selectedProduct)
              }

              return {
                product_id: product.productId,
                quantity: product.quantity,
                unit_price: unitPrice * product.quantity,
                // unit_price: unitPrice,
                // source_type: teamType || "store",
                // source_id: teamId || null,
              }
            })
          : []),
      ],
      payment_info: {
        amount: totalAmount,
        mpesa_receipt_number: "ABC123",
        mpesa_phone_number: "254712345678",
      },
      total_amount: totalAmount,
      partial_payment_amount: isFullyPaid ? totalAmount : deposit,
      debt_amount: !isFullyPaid ? calculateDebt() : 0,
      repayment_date: !isFullyPaid ? repayDate : null,
      is_fully_paid: isFullyPaid,
      exchanged_with_local: exchangedWithLocal,
      cylinder_exchanged_with: cylinderExchanged || null,
      location_id: teamId || null,
      location_type: team_type || null,
      // Also include location data separately in case backend needs it
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

    if (paymentMode === "cash") {
      formData.cashAmount = totalAmount
      formData.payment_info.payment_method = "CASH"
    } else if (paymentMode === "mpesa") {
      formData.payment_info.payment_method = "MPESA"
      formData.payment_info = customerPhone
      formData.payment_info.mpesa_receipt_number = mpesaCodes
    } else if (paymentMode === "mpesa_cash") {
      formData.payment_info.payment_method = "CASH+MPESA"
      formData.cashAmount = cashAmount
      formData.mpesaAmount = totalAmount - cashAmount
      formData.mpesa_codes = mpesaCodes
    }
    // {teamType === "shop" ? "Shop Team" : "Vehicle Team"}
    if (teamType === "shop") {
      formData.shop = teamId
    } else if (teamType === "Vehicle Team") {
      formData.vehicle = teamId
    } else {
      formData.store = teamId
    }
    console.log("Submitting form data:", formData)

    try {
      await dispatch(recordSales(formData)).unwrap()
      toast.success(`🎉 ${salesType} sale recorded successfully!`)

      setTimeout(() => {
        navigate(teamId ? `/sales/teams/${teamId}` : "/sales")
      }, 2000)
    } catch (error: any) {
      toast.error(error.error || "Failed to record sale. Please try again.")
    } finally {
      setIsSubmitting(false)
      setShowSummary(false)
    }
  }

  // Render cylinder product row
  const renderCylinderProductRow = (product, index) => {
    const selectedProduct = availableCylinders.find(
      (prod) => prod.id === Number(product.productId),
    )

    // Filter available products - show only those not already selected in other rows
    const filteredCylinders = availableCylinders.filter(
      (prod) =>
        prod.id === Number(product.productId) ||
        !cylinderProducts.some(
          (p, i) => i !== index && p.productId === prod.id.toString(),
        ),
    )

    return (
      <div
        key={index}
        className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-700">Cylinder {index + 1}</h3>
          {cylinderProducts.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveCylinderProduct(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gas Cylinder
            </label>
            {isLoadingCylinders ? (
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
                Loading cylinders...
              </div>
            ) : filteredCylinders.length === 0 ? (
              <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-700">
                No cylinders available from this source
              </div>
            ) : (
              <select
                value={product.productId}
                onChange={(e) =>
                  handleCylinderProductChange(
                    index,
                    "productId",
                    e.target.value,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select cylinder type</option>
                {filteredCylinders.map((cylinder) => (
                  <option key={cylinder.id} value={cylinder.id}>
                    {cylinder.gas_type} {cylinder.weight}kg
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedProduct && (
            <>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold">
                    {selectedProduct.filled || 0} units
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">
                    {salesType === "complete"
                      ? "Complete Price:"
                      : salesType === "outlet"
                      ? "Outlet Price:"
                      : "Refill Price:"}
                  </span>
                  <span className="font-bold text-blue-600">
                    <FormattedAmount
                      amount={getCylinderPrice(selectedProduct)}
                    />
                  </span>
                </div>
                {/* Show source info */}
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

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Pricing Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCylinderProductChange(
                        index,
                        "paymentAmount",
                        "MAXIMUM",
                      )
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
                      handleCylinderProductChange(
                        index,
                        "paymentAmount",
                        "CUSTOM",
                      )
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
                      handleCylinderProductChange(
                        index,
                        "customPrice",
                        e.target.value,
                      )
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
                  handleCylinderProductChange(
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
                  handleCylinderProductChange(index, "quantity", e.target.value)
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                min={1}
                max={selectedProduct?.filled || 1}
                required
              />
              <button
                type="button"
                onClick={() =>
                  handleCylinderProductChange(
                    index,
                    "quantity",
                    product.quantity + 1,
                  )
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
            {selectedProduct && (
              <p className="text-xs text-gray-500 mt-1">
                Max available: {selectedProduct.filled || 0} units
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render additional product row (for complete sales)
  const renderAdditionalProductRow = (product, index) => {
    const selectedProduct = availableProducts.find(
      (prod) => prod.id === Number(product.productId),
    )

    // Filter available products - show only those not already selected in other rows
    const filteredProducts = availableProducts.filter(
      (prod) =>
        prod.id === Number(product.productId) ||
        !additionalProducts.some(
          (p, i) => i !== index && p.productId === prod.id.toString(),
        ),
    )

    return (
      <div
        key={index}
        className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-green-700">
            Accessory {index + 1}
          </h3>
          {additionalProducts.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveAdditionalProduct(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product/Accessory
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
                  handleAdditionalProductChange(
                    index,
                    "productId",
                    e.target.value,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                required
              >
                <option value="">Select product/accessory</option>
                {filteredProducts.map((productItem) => (
                  <option key={productItem.id} value={productItem.id}>
                    {productItem.product}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedProduct && (
            <>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-green-600">
                    <FormattedAmount
                      amount={getProductPrice(selectedProduct)}
                    />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Pricing Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAdditionalProductChange(
                        index,
                        "paymentAmount",
                        "MAXIMUM",
                      )
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
                      handleAdditionalProductChange(
                        index,
                        "paymentAmount",
                        "CUSTOM",
                      )
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
                      handleAdditionalProductChange(
                        index,
                        "customPrice",
                        e.target.value,
                      )
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
                  handleAdditionalProductChange(
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
                  handleAdditionalProductChange(
                    index,
                    "quantity",
                    e.target.value,
                  )
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500"
                min={1}
                required
              />
              <button
                type="button"
                onClick={() =>
                  handleAdditionalProductChange(
                    index,
                    "quantity",
                    product.quantity + 1,
                  )
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

  // Get page title based on sale type
  const getPageTitle = () => {
    if (saleType === "retail") {
      return "Cylinder Retail Sale"
    } else if (saleType === "wholesale") {
      return "Cylinder Wholesale Sale"
    }
    return "Cylinder Sale"
  }

  const getPageDescription = () => {
    if (saleType === "retail") {
      return "Record retail cylinder sales"
    } else if (saleType === "wholesale") {
      return "Record wholesale cylinder sales"
    }
    return "Record cylinder sales"
  }

  // Refresh cylinders data
  const handleRefreshCylinders = () => {
    fetchCylinders()
  }

  // Refresh products data
  const handleRefreshProducts = () => {
    fetchProducts()
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
                    salesType === "refill"
                      ? "bg-blue-100 text-blue-700"
                      : salesType === "complete"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {salesType === "refill"
                    ? "Refill Sale"
                    : salesType === "complete"
                    ? "Complete Sale"
                    : "Outlet Sale"}
                </div>
                <div
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    saleType === "retail"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {saleType === "retail" ? "Retail" : "Wholesale"}
                </div>
              </div>
            </div>

            {/* Cylinder Products */}
            {summary.cylinders.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Cylinders</h3>
                <div className="space-y-3">
                  {summary.cylinders.map((cylinder, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{cylinder.name}</span>
                        <span className="font-bold text-blue-700">
                          <FormattedAmount amount={cylinder.totalPrice} />
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {cylinder.quantity} ×{" "}
                          <FormattedAmount amount={cylinder.unitPrice} />
                          {cylinder.isCustom && " (Custom)"}
                        </span>
                        <span>
                          {cylinder.quantity} unit
                          {cylinder.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Products */}
            {summary.accessories.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Accessories
                </h3>
                <div className="space-y-3">
                  {summary.accessories.map((accessory, index) => (
                    <div
                      key={index}
                      className="bg-green-50 p-3 rounded-lg border border-green-200"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{accessory.name}</span>
                        <span className="font-bold text-green-700">
                          <FormattedAmount amount={accessory.totalPrice} />
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {accessory.quantity} ×{" "}
                          <FormattedAmount amount={accessory.unitPrice} />
                          {accessory.isCustom && " (Custom)"}
                        </span>
                        <span>
                          {accessory.quantity} unit
                          {accessory.quantity > 1 ? "s" : ""}
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
                {summary.cylinders.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cylinders:</span>
                    <span className="font-medium">
                      <FormattedAmount amount={summary.cylinderTotal} />
                    </span>
                  </div>
                )}
                {summary.accessories.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accessories:</span>
                    <span className="font-medium">
                      <FormattedAmount amount={summary.accessoriesTotal} />
                    </span>
                  </div>
                )}
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

            {/* Exchange Info */}
            {exchangedWithLocal && cylinderExchanged && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Cylinder Exchange
                </h3>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-yellow-700">
                      Customer exchanging with another cylinder
                    </span>
                  </div>
                </div>
              </div>
            )}

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer />
      {showSummary && renderOrderSummary()}

      {isMobile ? (
        <div className="flex flex-col min-h-screen">
          <Navbar
            headerMessage={getPageTitle()}
            headerText={getPageDescription()}
          />

          <main className="flex-grow p-4">
            {/* Team Info (if applicable) */}
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
                        {teamType === "shop" ? "Shop Team" : "Vehicle Team"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshCylinders}
                    disabled={isLoadingCylinders}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
                    title="Refresh cylinder data"
                  >
                    <Refresh
                      className={isLoadingCylinders ? "animate-spin" : ""}
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

            {/* Cylinder Fetch Status */}
            {cylinderFetchError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center text-red-700">
                  <span className="mr-2">⚠️</span>
                  <span>{cylinderFetchError}</span>
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
              {/* Sales Type Selection */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🏷️</span>
                  Sale Type
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSalesType("refill")}
                    className={`py-3 px-4 rounded-xl border transition-all flex flex-col items-center ${
                      salesType === "refill"
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : "bg-gray-100 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-lg mb-1">🛢️</span>
                    <span className="text-sm font-medium">Refill Sale</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Cylinder only
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSalesType("complete")}
                    className={`py-3 px-4 rounded-xl border transition-all flex flex-col items-center ${
                      salesType === "complete"
                        ? "bg-green-100 border-green-500 text-green-600"
                        : "bg-gray-100 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-lg mb-1">🎁</span>
                    <span className="text-sm font-medium">Complete Sale</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Cylinder + Accessories
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSalesType("outlet")}
                    className={`py-3 px-4 rounded-xl border transition-all flex flex-col items-center ${
                      salesType === "outlet"
                        ? "bg-purple-100 border-purple-500 text-purple-600"
                        : "bg-gray-100 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-lg mb-1">🏪</span>
                    <span className="text-sm font-medium">Outlet Sale</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Outlet price
                    </span>
                  </button>
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-700 font-medium mr-2">
                      {salesType === "refill"
                        ? "Refill Sale"
                        : salesType === "complete"
                        ? "Complete Sale"
                        : "Outlet Sale"}
                    </span>
                    <span className="text-blue-600 text-sm">
                      {salesType === "refill"
                        ? "Cylinder refill only"
                        : salesType === "complete"
                        ? "Cylinder with accessories"
                        : "Outlet pricing"}
                    </span>
                  </div>
                </div>
              </div>

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
                                setCustomerLocationName(customer.location) // Update location name
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
                                setCustomerLocationName(customer.location) // Update location name
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

                  {/* Customer Location Name (User-entered) */}
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

                  {/* Device Location Capture Section */}
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
                        {/* Main location button */}
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className={`
                            px-4 py-3 rounded-lg border transition-all flex items-center justify-center
                            ${
                              isGettingLocation
                                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                : hasLocation
                                ? "bg-green-100 border-green-500 text-green-600 hover:bg-green-200"
                                : "bg-blue-100 border-blue-500 text-blue-600 hover:bg-blue-200"
                            }
                          `}
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

                        {/* Refresh button (only shows when location is already captured) */}
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

                    {/* Location error display */}
                    {locationError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center text-red-700">
                          <LocationOff className="h-4 w-4 mr-2" />
                          <span className="text-xs">{locationError}</span>
                        </div>
                      </div>
                    )}

                    {/* Help text */}
                    <p className="text-xs text-gray-500 mt-1">
                      {hasLocation
                        ? "Device GPS location captured and ready for submission."
                        : "Click the location button to capture device GPS coordinates."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cylinders Section */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">🛢️</span>
                    Gas Cylinders
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({availableCylinders.length} available)
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRefreshCylinders}
                      disabled={isLoadingCylinders}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                      title="Refresh cylinder data"
                    >
                      <Refresh
                        className={`h-4 w-4 mr-1 ${
                          isLoadingCylinders ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCylinderProduct}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      + Add Cylinder
                    </button>
                  </div>
                </div>

                {isLoadingCylinders ? (
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
                    <p className="text-gray-600 mt-2">Loading cylinders...</p>
                  </div>
                ) : availableCylinders.length === 0 ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-700">
                      No cylinders available from this source
                    </p>
                    <button
                      type="button"
                      onClick={handleRefreshCylinders}
                      className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cylinderProducts.map((product, index) =>
                      renderCylinderProductRow(product, index),
                    )}
                  </div>
                )}
              </div>

              {/* Additional Products Section (Only for Complete Sales) */}
              {salesType === "complete" && (
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="mr-2">🛍️</span>
                      Additional Products & Accessories
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({availableProducts.length} available)
                      </span>
                    </h2>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleRefreshProducts}
                        disabled={isLoadingProducts}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                        title="Refresh products data"
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
                        onClick={handleAddAdditionalProduct}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        + Add Product
                      </button>
                    </div>
                  </div>

                  {isLoadingProducts ? (
                    <div className="text-center py-8">
                      <svg
                        className="animate-spin h-8 w-8 mx-auto text-green-500"
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
                    <div className="text-center py-8 bg-yellow-50 rounded-xl border border-yellow-200">
                      <p className="text-yellow-700">
                        No additional products available from this source
                      </p>
                      <button
                        type="button"
                        onClick={handleRefreshProducts}
                        className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {additionalProducts.map((product, index) =>
                        renderAdditionalProductRow(product, index),
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cylinder Exchange */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Cylinder Exchange
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      Customer exchanging with another cylinder?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setExchangedWithLocal(false)}
                        className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                          !exchangedWithLocal
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        No Exchange
                      </button>
                      <button
                        type="button"
                        onClick={() => setExchangedWithLocal(true)}
                        className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                          exchangedWithLocal
                            ? "bg-green-100 border-green-500 text-green-600"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        With Exchange
                      </button>
                    </div>
                  </div>

                  {exchangedWithLocal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Exchange Cylinder Type
                      </label>
                      <select
                        value={cylinderExchanged}
                        onChange={(e) => setCylinderExchanged(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select cylinder type</option>
                        {availableCylinders.map((cylinder) => (
                          <option key={cylinder.id} value={cylinder.id}>
                            {cylinder.gas_type} {cylinder.weight}kg
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
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
                      <h3 className="font-semibold text-green-800 mb-3">
                        M-Pesa Details
                      </h3>
                      <div className="space-y-3">
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
                            required
                          />
                        </div>

                        {mpesaCodes.map((code, index) => (
                          <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-green-700">
                              M-Pesa Code {index + 1}
                            </label>
                            <input
                              type="text"
                              value={code.code}
                              onChange={(e) =>
                                handleMpesaCodeChange(
                                  index,
                                  "code",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., RF48HGT678"
                              required
                            />
                            {numMpesaDeposits > 1 && (
                              <input
                                type="number"
                                value={code.amount}
                                onChange={(e) =>
                                  handleMpesaCodeChange(
                                    index,
                                    "amount",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mt-2"
                                placeholder="Amount for this code"
                                min="0"
                                required
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-purple-600">Sale Type:</span>
                    <span className="font-medium text-purple-700">
                      {salesType === "refill"
                        ? "Refill Sale"
                        : salesType === "complete"
                        ? "Complete Sale"
                        : "Outlet Sale"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || availableCylinders.length === 0}
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
                Cylinder Sales
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

export default CylinderSales
