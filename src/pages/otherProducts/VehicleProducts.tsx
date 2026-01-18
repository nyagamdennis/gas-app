// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "../../app/hooks"
import api from "../../../utils/api"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import LocalMallIcon from "@mui/icons-material/LocalMall"
import InventoryIcon from "@mui/icons-material/Inventory"
import WarningIcon from "@mui/icons-material/Warning"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import UpdateIcon from "@mui/icons-material/Update"
import StorefrontIcon from "@mui/icons-material/Storefront"
import PointOfSaleIcon from "@mui/icons-material/PointOfSale"

const VehicleProducts = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
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

  const [assignedProducts, setAssignedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showStacked, setShowStacked] = useState(false)
  const [expandedRows, setExpandedRows] = useState({})

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const idParams = useParams()
  const shopId = idParams.id
  const shopName = idParams.name ? decodeURIComponent(idParams.name) : ""

  useEffect(() => {
    if (shopId) {
      api
        .get(`/inventory/vehicles/${shopId}/products/`)
        .then((response) => {
          console.log("Assigned products data:", response.data)
          setAssignedProducts(response.data)
        })
        .catch((error) =>
          console.error("Error fetching assigned products:", error),
        )
        .finally(() => {
          setLoading(false)
        })
    }
  }, [shopId])

  const toggleRowExpansion = (productId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  // Helper function to get price value - handles both number and object
  const getProductPrice = (prices) => {
    if (!prices) return 0

    // If prices is a number, return it
    if (typeof prices === "number") return prices

    // If prices is an object, try to get retail price first, then wholesale
    if (typeof prices === "object") {
      return (
        prices.retail_sales_price ||
        prices.whole_sales_price ||
        prices.product_buying_price ||
        0
      )
    }

    return 0
  }

  // Calculate totals
  const calculateTotals = () => {
    return assignedProducts.reduce(
      (acc, product) => {
        const quantity = product.quantity || 0
        const price = getProductPrice(product.product?.prices)

        acc.totalQuantity += quantity
        acc.totalSpoiled += product.spoiled_product_quantity || 0
        acc.totalValue += quantity * price
        return acc
      },
      {
        totalQuantity: 0,
        totalSpoiled: 0,
        totalValue: 0,
      },
    )
  }

  const totals = assignedProducts.length > 0 ? calculateTotals() : null

  // Group products by category or type
  const groupByProductType = () => {
    const grouped = {}
    assignedProducts.forEach((product) => {
      const productName = product.product?.name || "Uncategorized"
      if (!grouped[productName]) {
        grouped[productName] = []
      }
      grouped[productName].push(product)
    })
    return grouped
  }

  const groupedProducts =
    assignedProducts.length > 0 ? groupByProductType() : {}

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Format price object for display
  const formatPriceObject = (prices) => {
    if (!prices) return "N/A"

    if (typeof prices === "number") {
      return `KSh ${prices.toLocaleString()}`
    }

    if (typeof prices === "object") {
      const priceList = []
      if (prices.retail_sales_price)
        priceList.push(
          `Retail: KSh ${prices.retail_sales_price.toLocaleString()}`,
        )
      if (prices.whole_sales_price)
        priceList.push(
          `Wholesale: KSh ${prices.whole_sales_price.toLocaleString()}`,
        )
      if (prices.product_buying_price)
        priceList.push(
          `Cost: KSh ${prices.product_buying_price.toLocaleString()}`,
        )

      return priceList.join(" | ")
    }

    return "N/A"
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your shop products with style and clarity"}
          />

          <main className="flex-grow m-2 p-1">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-white hover:text-purple-100 font-medium transition mb-3"
              >
                <span className="mr-2">←</span> Back to Vehicles
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {shopName || "Shop"} Products
                  </h1>
                  <p className="text-purple-100 text-sm">
                    Product Inventory Overview
                  </p>
                </div>
                <div className="text-6xl opacity-20">🛍️</div>
              </div>
            </div>

            {!loading ? (
              <>
                {assignedProducts.length > 0 ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="text-xs text-gray-600 mb-1 flex items-center">
                          <InventoryIcon className="mr-1" fontSize="small" />
                          Available
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {totals.totalQuantity}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total items
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                        <div className="text-xs text-gray-600 mb-1 flex items-center">
                          <WarningIcon className="mr-1" fontSize="small" />
                          Spoiled
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {totals.totalSpoiled}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Damaged items
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="text-xs text-gray-600 mb-1 flex items-center">
                          <AttachMoneyIcon className="mr-1" fontSize="small" />
                          Value
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          KSh {totals.totalValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total value
                        </div>
                      </div>
                    </div>

                    {/* Product Count */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <LocalMallIcon className="text-purple-600 mr-2" />
                        <span className="text-gray-700">
                          {assignedProducts.length} product{" "}
                          {assignedProducts.length === 1 ? "type" : "types"}
                        </span>
                      </div>

                      {/* Toggle View Button */}
                      <button
                        onClick={() => setShowStacked(!showStacked)}
                        className="bg-purple-50 px-4 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-100 transition flex items-center gap-2"
                      >
                        {showStacked ? (
                          <>
                            <span>📊</span> Table View
                          </>
                        ) : (
                          <>
                            <span>📋</span> Card View
                          </>
                        )}
                      </button>
                    </div>

                    {!showStacked ? (
                      /* Table View */
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gradient-to-r from-purple-100 to-purple-200">
                                <th className="border border-gray-300 px-3 py-3 text-left font-semibold">
                                  Product Details
                                </th>
                                <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-green-600">
                                  Available
                                </th>
                                <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-red-600">
                                  Spoiled
                                </th>
                                <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-blue-600">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {assignedProducts.map((product) => {
                                const quantity = product.quantity || 0
                                const price = getProductPrice(
                                  product.product?.prices,
                                )
                                const productValue = quantity * price

                                return (
                                  <tr
                                    key={product.id}
                                    className="hover:bg-gray-50 transition cursor-pointer"
                                    onClick={() =>
                                      toggleRowExpansion(product.id)
                                    }
                                  >
                                    <td className="border border-gray-300 px-3 py-3">
                                      <div className="font-semibold text-gray-800">
                                        {product.product?.name ||
                                          "Unnamed Product"}
                                      </div>
                                      <div className="text-xs text-gray-600 flex items-center mt-1">
                                        <CalendarTodayIcon
                                          fontSize="small"
                                          className="mr-1"
                                        />
                                        Added: {formatDate(product.created_at)}
                                      </div>
                                    </td>
                                    <td className="border border-gray-300 px-3 py-3 text-center">
                                      <div className="font-bold text-green-600 text-lg">
                                        {quantity}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        units
                                      </div>
                                    </td>
                                    <td className="border border-gray-300 px-3 py-3 text-center">
                                      <div className="font-bold text-red-600 text-lg">
                                        {product.spoiled_product_quantity || 0}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        units
                                      </div>
                                    </td>
                                    <td className="border border-gray-300 px-3 py-3 text-center">
                                      <div className="font-bold text-blue-600 text-lg">
                                        KSh {productValue.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        @ KSh {price.toLocaleString()}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Card View */
                      <div className="space-y-4">
                        {Object.entries(groupedProducts).map(
                          ([productName, products]) => (
                            <div
                              key={productName}
                              className="bg-white rounded-lg shadow-md border-l-4 border-purple-500 overflow-hidden"
                            >
                              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-bold text-purple-700 flex items-center">
                                    <span className="mr-2">📦</span>
                                    {productName}
                                  </h3>
                                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {products.length}{" "}
                                    {products.length === 1
                                      ? "entry"
                                      : "entries"}
                                  </span>
                                </div>
                              </div>

                              <div className="p-4 space-y-3">
                                {products.map((product) => {
                                  const quantity = product.quantity || 0
                                  const price = getProductPrice(
                                    product.product?.prices,
                                  )
                                  const productValue = quantity * price

                                  return (
                                    <div
                                      key={product.id}
                                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                                    >
                                      <div className="flex justify-between items-start mb-3">
                                        <div>
                                          <div className="font-semibold text-gray-800 text-lg">
                                            {product.product?.name ||
                                              "Unnamed Product"}
                                          </div>
                                          <div className="text-xs text-gray-500 flex items-center mt-1">
                                            <CalendarTodayIcon
                                              fontSize="small"
                                              className="mr-1"
                                            />
                                            Last updated:{" "}
                                            {formatDate(product.updated_at)}
                                          </div>
                                        </div>
                                        <button
                                          onClick={() =>
                                            toggleRowExpansion(product.id)
                                          }
                                          className="text-purple-600 hover:text-purple-800"
                                        >
                                          {expandedRows[product.id] ? (
                                            <ArrowDropUpIcon />
                                          ) : (
                                            <ArrowDropDownIcon />
                                          )}
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-3 gap-3 mb-3">
                                        <div className="text-center p-2 bg-green-50 rounded">
                                          <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                                            <InventoryIcon
                                              fontSize="small"
                                              className="mr-1"
                                            />
                                            Available
                                          </div>
                                          <div className="text-xl font-bold text-green-600">
                                            {quantity}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            units
                                          </div>
                                        </div>

                                        <div className="text-center p-2 bg-red-50 rounded">
                                          <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                                            <WarningIcon
                                              fontSize="small"
                                              className="mr-1"
                                            />
                                            Spoiled
                                          </div>
                                          <div className="text-xl font-bold text-red-600">
                                            {product.spoiled_product_quantity ||
                                              0}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            units
                                          </div>
                                        </div>

                                        <div className="text-center p-2 bg-blue-50 rounded">
                                          <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                                            <AttachMoneyIcon
                                              fontSize="small"
                                              className="mr-1"
                                            />
                                            Value
                                          </div>
                                          <div className="text-xl font-bold text-blue-600">
                                            KSh {productValue.toLocaleString()}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            total
                                          </div>
                                        </div>
                                      </div>

                                      {/* Expanded Details */}
                                      {expandedRows[product.id] && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 flex items-center">
                                              <CalendarTodayIcon
                                                fontSize="small"
                                                className="mr-1"
                                              />
                                              Created:
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                              {formatDate(product.created_at)}
                                            </span>
                                          </div>

                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 flex items-center">
                                              <UpdateIcon
                                                fontSize="small"
                                                className="mr-1"
                                              />
                                              Last Updated:
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                              {formatDate(product.updated_at)}
                                            </span>
                                          </div>

                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                              Quantity:
                                            </span>
                                            <span className="font-semibold text-green-600">
                                              {quantity} units
                                            </span>
                                          </div>

                                          <div className="text-sm">
                                            <span className="text-gray-600 block mb-1">
                                              Pricing:
                                            </span>
                                            <div className="bg-gray-50 p-2 rounded text-xs">
                                              {formatPriceObject(
                                                product.product?.prices,
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                              Shop:
                                            </span>
                                            <span className="font-semibold text-purple-600 flex items-center">
                                              <StorefrontIcon
                                                fontSize="small"
                                                className="mr-1"
                                              />
                                              {product.shop_name ||
                                                "Unknown Shop"}
                                            </span>
                                          </div>

                                          {product.spoiled_product_quantity >
                                            0 && (
                                            <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                                              <div className="text-xs text-red-700 flex items-center">
                                                <WarningIcon
                                                  fontSize="small"
                                                  className="mr-1"
                                                />
                                                {
                                                  product.spoiled_product_quantity
                                                }{" "}
                                                units marked as spoiled
                                              </div>
                                            </div>
                                          )}

                                          {productValue > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                                              <div className="text-xs text-green-700 flex items-center">
                                                <PointOfSaleIcon
                                                  fontSize="small"
                                                  className="mr-1"
                                                />
                                                Total Value: KSh{" "}
                                                {productValue.toLocaleString()}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4 opacity-30">📦</div>
                    <p className="text-gray-500 text-lg mb-2">
                      No products assigned yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Add products to this vehicle to see inventory information
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/inventory/add-products/${shopId}`)
                      }
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition"
                    >
                      Add Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Loading product data...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Fetching inventory details
                  </p>
                </div>
              </div>
            )}
          </main>

          <footer>
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

export default VehicleProducts
