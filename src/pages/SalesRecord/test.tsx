// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate, useLocation } from "react-router-dom"

import mpesalogo from "../../images/Mpesa-Logo.png"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectMyProfile } from "../../features/employees/myProfileSlice"
import {
  fetchAssignedProducts,
  selectAllAssignedProducts,
} from "../../features/product/assignedProductsSlice"
import { getSalesError, recordSales } from "../../features/sales/salesSlice"
import FormattedAmount from "../../components/FormattedAmount"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
// Add these icons at the top
import {
  LocationOn,
  MyLocation,
  Refresh,
  CheckCircle,
  LocationOff,
} from "@mui/icons-material"

const CylinderSales = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Get query parameters
  const queryParams = new URLSearchParams(location.search)
  const saleType = queryParams.get("type") || "retail" // 'retail' or 'wholesale'

  // Get team ID if present in URL
  const pathParts = location.pathname.split("/")
  const teamId =
    pathParts.includes("shop") || pathParts.includes("vehicle")
      ? pathParts[pathParts.length - 1]
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

  // Customer details
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocation, setCustomerLocation] = useState("")
  const [customerType, setCustomerType] = useState(
    saleType === "wholesale" ? "BUSINESS" : "INDIVIDUAL",
  )

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

  // Products
  const [products, setProducts] = useState([
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

  // Data
  const myProfile = useAppSelector(selectMyProfile)
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts)
  const operationError = useAppSelector(getSalesError)

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)
    setLocationError("")

    // Configure options for better accuracy
    const options = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 10000, // Wait up to 10 seconds
      maximumAge: 0, // Don't use cached position
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords

        // Format coordinates
        const coords = {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          accuracy: accuracy ? Math.round(accuracy) : null,
        }

        setLocationCoordinates(coords)
        setHasLocation(true)
        setIsGettingLocation(false)

        // Get address from coordinates (reverse geocoding)
        try {
          const address = await getAddressFromCoordinates(latitude, longitude)
          const locationText = `${address || "Location"} (${coords.latitude}, ${
            coords.longitude
          })`
          setCustomerLocation(locationText)

          // Update state with address if available
          setLocationCoordinates((prev) => ({
            ...prev,
            address: address || "",
          }))
        } catch (error) {
          // If reverse geocoding fails, just use coordinates
          const locationText = `Coordinates: ${coords.latitude}, ${coords.longitude}`
          setCustomerLocation(locationText)
        }

        // Set last update time
        const now = new Date().toLocaleTimeString()
        setLastLocationUpdate(now)

        toast.success("Location captured successfully!")
      },
      (error) => {
        setIsGettingLocation(false)
        let errorMessage = "Unable to retrieve your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }

        setLocationError(errorMessage)
        toast.error(errorMessage)
      },
      options,
    )
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

  // Fetch data
  useEffect(() => {
    dispatch(fetchAssignedProducts())
    // Set customer type based on sale type
    setCustomerType(saleType === "wholesale" ? "BUSINESS" : "INDIVIDUAL")
  }, [dispatch, saleType])

  // Handle product changes
  const handleProductChange = (index, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, [field]: value } : product,
      ),
    )
  }

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { productId: "", quantity: 1, paymentAmount: "MAXIMUM", customPrice: "" },
    ])
  }

  const handleRemoveProduct = (index) => {
    if (products.length > 1) {
      setProducts(products.filter((_, idx) => idx !== index))
    }
  }

  // Calculate total
  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const assignedProduct = allAssignedProducts.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (assignedProduct) {
        let price = 0

        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          price = parseFloat(product.customPrice)
        } else {
          // Different pricing for retail vs wholesale
          if (saleType === "retail") {
            price = assignedProduct.retail_refil_price || 0
          } else {
            price = assignedProduct.wholesale_price || 0
          }
        }

        return total + price * product.quantity
      }

      return total
    }, 0)
  }

  const calculateDebt = () => {
    const total = calculateTotal()
    return Math.max(total - deposit, 0)
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
          .post("/search-customer/", {
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
          .post("/search-customer/", {
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

  // Form submission - include coordinates in form data
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    const isFullyPaid = paymentType === "FULLY_PAID"
    const totalAmount = calculateTotal()

    const formData: any = {
      customer: {
        name: customerName,
        location: {
          name: customerLocation,
          coordinates: hasLocation ? locationCoordinates : null,
        },
        phone: parseInt(customerPhone) || 0,
        customer_type: customerType,
        sales: saleType.toUpperCase(),
      },
      sales_type: "COMPLETESALE",
      sale_category: saleType.toUpperCase(),
      products: products.map((product) => {
        const assignedProduct = allAssignedProducts.find(
          (prod) => prod.id === Number(product.productId),
        )

        let unitPrice = 0

        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          unitPrice = parseFloat(product.customPrice)
        } else {
          if (saleType === "retail") {
            unitPrice = assignedProduct?.retail_refil_price || 0
          } else {
            unitPrice = assignedProduct?.wholesale_price || 0
          }
        }

        return {
          id: product.productId,
          quantity: product.quantity,
          amount_sold_for: unitPrice * product.quantity,
          unit_price: unitPrice,
        }
      }),
      total_amount: totalAmount,
      partial_payment_amount: isFullyPaid ? totalAmount : deposit,
      debt_amount: !isFullyPaid ? calculateDebt() : 0,
      repayment_date: !isFullyPaid ? repayDate : null,
      is_fully_paid: isFullyPaid,
      exchanged_with_local: exchangedWithLocal,
      cylinder_exchanged_with: cylinderExchanged || null,
      sales_team_id: teamId || null,
      sales_team_type: teamType || null,
      // Include location data if available
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

    // Add payment mode data
    if (paymentMode === "cash") {
      formData.cashAmount = totalAmount
    } else if (paymentMode === "mpesa") {
      formData.mpesaAmount = totalAmount
      formData.mpesa_codes = mpesaCodes
    } else if (paymentMode === "mpesa_cash") {
      formData.cashAmount = cashAmount
      formData.mpesaAmount = totalAmount - cashAmount
      formData.mpesa_codes = mpesaCodes
    }

    try {
      await dispatch(recordSales(formData)).unwrap()
      toast.success(`🎉 ${saleType} sale recorded successfully!`)

      setTimeout(() => {
        navigate(teamId ? `/sales/teams/${teamId}` : "/sales")
      }, 2000)
    } catch (error: any) {
      toast.error(error.error || "Failed to record sale. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Rest of your component code remains the same until the Location field...

  // In the Location field section, replace the existing location input with this:

  // ... [All your existing code until the Location field section] ...

  // Replace the Location field section with this:

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer />
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
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    {teamType === "shop" ? "🏪" : "🚚"}
                  </div>
                  <div>
                    <p className="text-sm opacity-90">
                      Recording {saleType} sale for:
                    </p>
                    <p className="font-semibold">
                      {teamType === "shop" ? "Shop Team" : "Vehicle Team"}
                    </p>
                  </div>
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
                                setCustomerLocation(customer.location)
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
                                setCustomerLocation(customer.location)
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

                  {/* Location Field with Geolocation Button */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Location
                      </label>
                      {lastLocationUpdate && (
                        <span className="text-xs text-gray-500">
                          Last updated: {lastLocationUpdate}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customerLocation}
                          onChange={(e) => setCustomerLocation(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter location or use device location"
                        />
                        {hasLocation && (
                          <div className="absolute right-2 top-2">
                            <CheckCircle className="text-green-500" />
                          </div>
                        )}
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
                              ? "Location captured! Click to recapture"
                              : "Get current location"
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
                            title="Refresh location"
                          >
                            <Refresh className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Location details display */}
                    {hasLocation && locationCoordinates.latitude && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                          <div className="text-xs text-blue-700">
                            <span className="font-medium">Coordinates: </span>
                            {locationCoordinates.latitude},{" "}
                            {locationCoordinates.longitude}
                            {locationCoordinates.accuracy && (
                              <span className="ml-2">
                                (±{locationCoordinates.accuracy}m)
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={copyCoordinates}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                          >
                            Copy
                          </button>
                        </div>
                        {locationCoordinates.address && (
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Address: </span>
                            {locationCoordinates.address}
                          </div>
                        )}
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
                        ? "Location captured! You can also type a different location."
                        : "Click the location button to automatically capture your current position."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rest of your form remains the same... */}
              {/* ... [All your existing code for Products, Cylinder Exchange, Payment, etc.] ... */}
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
