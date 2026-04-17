// @ts-nocheck
import React, { useState, useMemo } from "react"
import {
  Receipt,
  Person,
  LocalGasStation,
  ShoppingCart,
  Phone,
  Visibility,
  Edit,
  Warning,
  CheckCircle,
  Cancel,
  ChevronRight,
  ErrorOutline,
  AttachMoney,
  MoneyOff,
  Assignment,
  Business,
  ExpandMore,
  ExpandLess,
  Payment,
  Delete,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const SalesList = ({
  sales,
  batchMode,
  selectedItems,
  onToggleSelection,
  onToggleDetails,
  expandedSaleId,
  getSaleTypeBadge,
  getSalespersonBadge,
  onItemDeficit,
  onEditDeficit,
  isFinalized,
  mobile = false,
  deficits = [],
}) => {
  const [expandedDeficitId, setExpandedDeficitId] = useState(null)

  // Helper function to get deficits for a specific sale by invoice number
  const getDeficitsForSale = (invoiceNumber) => {
    return deficits.filter(
      (deficit) =>
        deficit.invoice_number === invoiceNumber ||
        deficit.invoice_number?.includes(invoiceNumber) ||
        invoiceNumber?.includes(deficit.invoice_number),
    )
  }

  // Helper function to get deficit badge (mobile optimized)
  const getDeficitBadge = (deficit, small = false) => {
    const amount = parseFloat(
      deficit.difference_amount || deficit.absolute_difference || 0,
    )
    const isDeficit = deficit.difference_type === "DEFICIT"

    const sizeClass = small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"

    return (
      <span
        className={`${sizeClass} rounded-full font-medium flex items-center ${
          isDeficit
            ? "bg-red-100 text-red-800 border border-red-200"
            : "bg-green-100 text-green-800 border border-green-200"
        }`}
        title={`${deficit.difference_type}: Ksh ${Math.abs(amount).toFixed(2)}`}
      >
        {isDeficit ? (
          <ErrorOutline fontSize="inherit" className="mr-0.5" />
        ) : (
          <AttachMoney fontSize="inherit" className="mr-0.5" />
        )}
        <span className="hidden sm:inline">
          {isDeficit ? "Deficit" : "Excess"}:
        </span>
        <FormattedAmount amount={Math.abs(amount)} className="ml-0.5" />
      </span>
    )
  }

  // Function to get deficit for specific item by invoice number and item ID
  const getItemDeficit = (invoiceNumber, itemId, itemType) => {
    return deficits.find(
      (deficit) =>
        deficit.invoice_number === invoiceNumber &&
        parseInt(deficit.item_id) === itemId &&
        deficit.item_type === itemType,
    )
  }

  const toggleDeficitDetails = (deficitId) => {
    setExpandedDeficitId(expandedDeficitId === deficitId ? null : deficitId)
  }

  // Format time for mobile
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(" ", "")
  }

  // Format date for mobile
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Separate active and voided sales for display
  const activeSales = useMemo(() => sales.filter((s) => !s.is_void), [sales])
  const voidedSales = useMemo(() => sales.filter((s) => s.is_void), [sales])
  const allSalesDisplay = [...activeSales, ...voidedSales]

  // Counts for header
  const voidedCount = voidedSales.length

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <Receipt className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500">No sales found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border mb-8">
      {/* Header */}
      <div className="p-3 border-b bg-gray-50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
              Sales
              {deficits.length > 0 && (
                <span className="ml-2 text-xs sm:text-sm bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                  {deficits.length} deficit(s)
                </span>
              )}
            </h3>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-1">
              <span>{activeSales.length} active sales</span>
              {voidedCount > 0 && (
                <span className="text-gray-400">• {voidedCount} voided</span>
              )}
              <span className="hidden sm:inline">•</span>
              <span>
                Total:{" "}
                <FormattedAmount
                  amount={activeSales.reduce(
                    (sum, s) => sum + (parseFloat(s.total_amount) || 0),
                    0,
                  )}
                />
              </span>
              {deficits.length > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-red-600">
                    Deficits:{" "}
                    <FormattedAmount
                      amount={deficits.reduce(
                        (sum, d) => sum + parseFloat(d.difference_amount || 0),
                        0,
                      )}
                    />
                  </span>
                </>
              )}
            </div>
          </div>
          {batchMode && (
            <div className="text-xs sm:text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {selectedItems.length} sel
            </div>
          )}
        </div>
      </div>

      {/* Sales List - Enhanced borders between items */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {allSalesDisplay.map((sale, index) => {
          const saleDeficits = getDeficitsForSale(sale.invoice_number)
          const hasDeficits = saleDeficits.length > 0
          const totalDeficitAmount = saleDeficits.reduce(
            (sum, d) => sum + parseFloat(d.difference_amount || 0),
            0,
          )
          const isVoided = sale.is_void === true

          return (
            <div
              key={sale.id}
              className={`
                relative border-b border-gray-200 last:border-b-0
                transition-all duration-200
                ${isVoided ? "bg-gray-50 opacity-75" : "hover:bg-gray-50"}
                ${selectedItems.includes(sale.id) ? "bg-blue-50" : ""}
                ${hasDeficits ? "border-l-4 border-red-400" : ""}
              `}
            >
              {/* Subtle shadow between items on hover */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start">
                  {batchMode && (
                    <div className="mr-2 pt-0.5 sm:pt-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(sale.id)}
                        onChange={() => onToggleSelection(sale.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                        disabled={isVoided}
                      />
                    </div>
                  )}

                  <div
                    className="flex-1 min-w-0"
                    onClick={() => mobile && onToggleDetails(sale.id)}
                  >
                    {/* First Row: Invoice & Badges */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none ${
                            isVoided
                              ? "text-gray-500 line-through"
                              : "text-blue-700"
                          }`}
                        >
                          {sale.invoice_number.split("-").pop()}
                          <span className="hidden sm:inline">
                            {" "}
                            ({sale.invoice_number})
                          </span>
                        </span>

                        {/* VOIDED Badge */}
                        {isVoided && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] sm:text-xs font-medium">
                            VOIDED
                          </span>
                        )}

                        {/* Payment Status Badge */}
                        {!isVoided && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs ${
                              sale.payment_status === "PAID"
                                ? "bg-green-100 text-green-800"
                                : sale.payment_status === "PARTIAL"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sale.payment_status.charAt(0)}
                            <span className="hidden sm:inline">
                              {sale.payment_status.slice(1)}
                            </span>
                          </span>
                        )}

                        {/* Deficit Badges */}
                        {hasDeficits &&
                          !isVoided &&
                          saleDeficits.length === 1 && (
                            <div>{getDeficitBadge(saleDeficits[0], true)}</div>
                          )}
                        {hasDeficits &&
                          !isVoided &&
                          saleDeficits.length > 1 && (
                            <div className="flex items-center">
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px]">
                                {saleDeficits.length}×{" "}
                                <ErrorOutline fontSize="inherit" />
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Total Amount */}
                      <div className="text-right">
                        <div
                          className={`text-base sm:text-lg font-bold ${
                            isVoided ? "text-gray-500 line-through" : ""
                          }`}
                        >
                          <FormattedAmount amount={sale.total_amount} />
                        </div>
                        {hasDeficits && !isVoided && (
                          <div className="text-[10px] sm:text-xs text-red-600">
                            <FormattedAmount amount={totalDeficitAmount} />{" "}
                            deficit
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Second Row: Customer & Details */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-medium truncate ${
                              isVoided ? "text-gray-500" : "text-gray-800"
                            }`}
                          >
                            {sale.customer_info?.name || "Walk-in"}
                          </p>
                          {sale.customer_info?.phone && (
                            <p className="text-[10px] sm:text-xs text-gray-500 flex items-center">
                              <Phone fontSize="inherit" className="mr-0.5" />
                              {sale.customer_info.phone}
                            </p>
                          )}
                        </div>

                        {/* Payment Method */}
                        {!isVoided && sale.payments?.[0] && (
                          <div className="ml-2 flex items-center">
                            {sale.payments[0].payment_method === "CASH" ? (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-[10px] flex items-center">
                                <Payment
                                  fontSize="inherit"
                                  className="mr-0.5"
                                />
                                <span className="hidden sm:inline">Cash</span>
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] flex items-center">
                                <Payment
                                  fontSize="inherit"
                                  className="mr-0.5"
                                />
                                <span className="hidden sm:inline">M-Pesa</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Third Row: Time & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                          {formatTime(sale.created_at)}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[80px] sm:max-w-none">
                          {sale.salesperson_data?.full_name?.split("@")[0] ||
                            sale.salesperson_data?.full_name ||
                            "Unknown"}
                        </span>
                        {sale.balance_due > 0 && !isVoided && (
                          <>
                            <span>•</span>
                            <span className="text-red-600">
                              Due: <FormattedAmount amount={sale.balance_due} />
                            </span>
                          </>
                        )}
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => onToggleDetails(sale.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedSaleId === sale.id ? (
                          <ExpandLess fontSize="small" />
                        ) : (
                          <ExpandMore fontSize="small" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {(!mobile || expandedSaleId === sale.id) && !isVoided && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {/* Deficits Section */}
                    {hasDeficits && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center text-sm">
                          <ErrorOutline
                            className="text-red-600 mr-2"
                            fontSize="small"
                          />
                          Price Differences
                        </h4>
                        <div className="space-y-2">
                          {saleDeficits.map((deficit) => {
                            const isDeficit =
                              deficit.difference_type === "DEFICIT"
                            const amount = parseFloat(
                              deficit.difference_amount ||
                                deficit.absolute_difference ||
                                0,
                            )
                            const isExpanded = expandedDeficitId === deficit.id

                            return (
                              <div
                                key={deficit.id}
                                className={`p-2 sm:p-3 rounded-lg ${
                                  isDeficit
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-green-50 border border-green-200"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <p className="font-medium text-xs sm:text-sm truncate">
                                        {deficit.item_name}
                                      </p>
                                      {deficit.reason && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded truncate">
                                          {deficit.reason}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-600">
                                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        <div>
                                          <span className="font-medium">
                                            Exp:
                                          </span>{" "}
                                          <FormattedAmount
                                            amount={deficit.expected_price}
                                          />
                                        </div>
                                        <div>
                                          <span className="font-medium">
                                            Act:
                                          </span>{" "}
                                          <FormattedAmount
                                            amount={deficit.actual_price}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 ml-2">
                                    <div className="text-right">
                                      <div
                                        className={`text-sm sm:text-base font-bold ${
                                          isDeficit
                                            ? "text-red-700"
                                            : "text-green-700"
                                        }`}
                                      >
                                        {isDeficit ? "+" : "-"}
                                        <FormattedAmount
                                          amount={Math.abs(amount)}
                                        />
                                      </div>
                                      <p className="text-[10px] text-gray-500">
                                        {isDeficit ? "DEFICIT" : "EXCESS"}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        toggleDeficitDetails(deficit.id)
                                      }
                                      className="text-gray-500"
                                    >
                                      {isExpanded ? (
                                        <ExpandLess fontSize="small" />
                                      ) : (
                                        <ExpandMore fontSize="small" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <div className="space-y-1.5">
                                      <div className="flex items-center text-[10px] sm:text-xs text-gray-600">
                                        <span className="font-medium mr-1">
                                          Responsibility:
                                        </span>
                                        {deficit.responsibility_type ===
                                        "EMPLOYEE" ? (
                                          <span className="flex items-center text-blue-600">
                                            <Person
                                              fontSize="inherit"
                                              className="mr-0.5"
                                            />
                                            {deficit.assigned_employee_name ||
                                              "Employee"}
                                          </span>
                                        ) : (
                                          <span className="flex items-center text-gray-600">
                                            <Business
                                              fontSize="inherit"
                                              className="mr-0.5"
                                            />
                                            Company
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center text-[10px] sm:text-xs text-gray-600">
                                        <span className="font-medium mr-1">
                                          Status:
                                        </span>
                                        <span
                                          className={`px-1 py-0.5 rounded ${
                                            deficit.status === "RECORDED"
                                              ? "bg-blue-100 text-blue-800"
                                              : deficit.status === "DEDUCTED"
                                              ? "bg-green-100 text-green-800"
                                              : deficit.status === "ADJUSTED"
                                              ? "bg-purple-100 text-purple-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {deficit.status}
                                        </span>
                                        {deficit.is_salary_deductible && (
                                          <span className="ml-1.5 flex items-center text-red-600">
                                            <Assignment
                                              fontSize="inherit"
                                              className="mr-0.5"
                                            />
                                            Salary Deduct
                                          </span>
                                        )}
                                      </div>

                                      <div className="text-[10px] sm:text-xs text-gray-500">
                                        By {deficit.recorded_by_name} •{" "}
                                        {formatDate(deficit.created_at)} at{" "}
                                        {formatTime(deficit.created_at)}
                                      </div>

                                      {deficit.notes && (
                                        <div className="text-[10px] sm:text-xs text-gray-600 bg-white/50 rounded p-1.5">
                                          <span className="font-medium">
                                            Notes:
                                          </span>{" "}
                                          {deficit.notes}
                                        </div>
                                      )}

                                      <div className="flex justify-end pt-1">
                                        <button
                                          onClick={() => onEditDeficit(deficit)}
                                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center"
                                          disabled={isFinalized}
                                        >
                                          <Edit
                                            fontSize="inherit"
                                            className="mr-1"
                                          />
                                          Edit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-700 mb-2 text-sm">
                        Items
                      </h4>
                      <div className="space-y-1.5">
                        {sale.cylinder_items?.map((cylinder, index) => {
                          const itemDeficit = getItemDeficit(
                            sale.invoice_number,
                            cylinder.id,
                            "CYLINDER",
                          )
                          return (
                            <div
                              key={`cylinder-${index}`}
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                itemDeficit
                                  ? "bg-red-50 border border-red-200"
                                  : "bg-blue-50"
                              }`}
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <LocalGasStation
                                  className={`${
                                    itemDeficit
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  } mr-2`}
                                  fontSize="small"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <p className="font-medium text-xs sm:text-sm truncate">
                                      {cylinder.cylinder_name}
                                    </p>
                                    {itemDeficit && (
                                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-1">
                                        Deficit
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    <span>
                                      {cylinder.quantity} ×{" "}
                                      <FormattedAmount
                                        amount={cylinder.unit_price}
                                      />
                                    </span>
                                    {itemDeficit && (
                                      <span className="ml-2 text-red-600">
                                        Diff:{" "}
                                        <FormattedAmount
                                          amount={itemDeficit.difference_amount}
                                        />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 ml-2">
                                <span
                                  className={`font-bold text-sm sm:text-base ${
                                    itemDeficit ? "text-red-700" : ""
                                  }`}
                                >
                                  <FormattedAmount
                                    amount={cylinder.total_price}
                                  />
                                </span>
                                {!itemDeficit && !isFinalized && (
                                  <button
                                    onClick={() =>
                                      onItemDeficit(sale, cylinder, "cylinder")
                                    }
                                    className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-1 rounded hover:bg-orange-200"
                                    title="Record Deficit"
                                  >
                                    <Warning fontSize="inherit" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}

                        {sale.items?.map((item, index) => {
                          const itemDeficit = getItemDeficit(
                            sale.invoice_number,
                            item.id,
                            "PRODUCT",
                          )
                          return (
                            <div
                              key={`item-${index}`}
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                itemDeficit
                                  ? "bg-red-50 border border-red-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <ShoppingCart
                                  className={`${
                                    itemDeficit
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  } mr-2`}
                                  fontSize="small"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <p className="font-medium text-xs sm:text-sm truncate">
                                      {item.product_name || item.name}
                                    </p>
                                    {itemDeficit && (
                                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-1">
                                        Deficit
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    <span>
                                      {item.quantity} ×{" "}
                                      <FormattedAmount
                                        amount={item.unit_price}
                                      />
                                    </span>
                                    {itemDeficit && (
                                      <span className="ml-2 text-red-600">
                                        Diff:{" "}
                                        <FormattedAmount
                                          amount={itemDeficit.difference_amount}
                                        />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 ml-2">
                                <span
                                  className={`font-bold text-sm sm:text-base ${
                                    itemDeficit ? "text-red-700" : ""
                                  }`}
                                >
                                  <FormattedAmount amount={item.total_price} />
                                </span>
                                {!itemDeficit && !isFinalized && (
                                  <button
                                    onClick={() =>
                                      onItemDeficit(sale, item, "regular")
                                    }
                                    className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-1 rounded hover:bg-orange-200"
                                    title="Record Deficit"
                                  >
                                    <Warning fontSize="inherit" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Payments */}
                    {sale.payments?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-700 mb-2 text-sm">
                          Payments
                        </h4>
                        <div className="space-y-1.5">
                          {sale.payments.map((payment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-1.5 sm:mr-2 text-xs sm:text-sm ${
                                    payment.payment_method === "CASH"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {payment.payment_method === "CASH"
                                    ? "C"
                                    : "M"}
                                </div>
                                <div>
                                  <p className="font-medium text-xs sm:text-sm">
                                    {payment.payment_method}
                                  </p>
                                  {payment.mpesa_receipt_number && (
                                    <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none">
                                      {payment.mpesa_receipt_number}
                                    </p>
                                  )}
                                  {!payment.is_verified && (
                                    <p className="text-[10px] text-orange-500">
                                      Not verified
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-sm sm:text-base">
                                  <FormattedAmount amount={payment.amount} />
                                </div>
                                <p className="text-[10px] text-gray-500">
                                  {formatTime(payment.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-1.5 pt-3 border-t">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onToggleDetails(sale.id)}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                        >
                          <Visibility fontSize="small" className="mr-1" />
                          <span className="hidden sm:inline">Close</span>
                        </button>
                        <button
                          onClick={() =>
                            window.open(`/sales/${sale.id}/edit`, "_blank")
                          }
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                          disabled={isFinalized}
                        >
                          <Edit fontSize="small" className="mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => window.print()}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Print"
                        >
                          <Receipt fontSize="small" />
                        </button>
                        {hasDeficits &&
                          saleDeficits.some(
                            (d) => !d.salary_deducted && d.is_salary_deductible,
                          ) && (
                            <button
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Mark as Deducted"
                            >
                              <CheckCircle fontSize="small" />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                {/* For voided sales, show the products that were voided */}
                {isVoided && expandedSaleId === sale.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {/* Void reason banner */}
                    <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded-lg text-xs text-red-700 flex items-center">
                      <Delete fontSize="small" className="mr-1.5" />
                      <span>
                        <strong>Voided:</strong>{" "}
                        {sale.void_reason || "No reason provided"}
                      </span>
                    </div>

                    {/* Items List - Show voided products */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-700 mb-2 text-sm flex items-center gap-2">
                        <ShoppingCart fontSize="small" />
                        Voided Products
                      </h4>
                      <div className="space-y-1.5">
                        {/* Cylinder Items Section */}
                        {sale.cylinder_items &&
                          sale.cylinder_items.length > 0 && (
                            <>
                              {sale.cylinder_items.map((cylinder, index) => (
                                <div
                                  key={`void-cylinder-${index}`}
                                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                                >
                                  <div className="flex items-center flex-1 min-w-0">
                                    <LocalGasStation
                                      className="text-gray-500 mr-2"
                                      fontSize="small"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-0.5">
                                        <p className="font-medium text-xs sm:text-sm text-gray-600 line-through truncate">
                                          {cylinder.cylinder_name}
                                        </p>
                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-1">
                                          VOIDED
                                        </span>
                                      </div>
                                      <div className="text-[10px] sm:text-xs text-gray-400 line-through">
                                        <span>
                                          {cylinder.quantity} ×{" "}
                                          <FormattedAmount
                                            amount={cylinder.unit_price}
                                          />
                                        </span>
                                      </div>
                                      {cylinder.cylinder_exchanged_with_detail && (
                                        <div className="text-[10px] text-gray-400 mt-0.5 line-through">
                                          Exchanged with:{" "}
                                          {
                                            cylinder
                                              .cylinder_exchanged_with_detail
                                              .display_name
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="ml-2">
                                    <span className="font-bold text-sm text-gray-400 line-through">
                                      <FormattedAmount
                                        amount={cylinder.total_price}
                                      />
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}

                        {/* Regular Items Section */}
                        {sale.items && sale.items.length > 0 && (
                          <>
                            {sale.items.map((item, index) => (
                              <div
                                key={`void-item-${index}`}
                                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                              >
                                <div className="flex items-center flex-1 min-w-0">
                                  <ShoppingCart
                                    className="text-gray-500 mr-2"
                                    fontSize="small"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <p className="font-medium text-xs sm:text-sm text-gray-600 line-through truncate">
                                        {item.product_name || item.name}
                                      </p>
                                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-1">
                                        VOIDED
                                      </span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 line-through">
                                      <span>
                                        {item.quantity} ×{" "}
                                        <FormattedAmount
                                          amount={item.unit_price}
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-2">
                                  <span className="font-bold text-sm text-gray-400 line-through">
                                    <FormattedAmount
                                      amount={item.total_price}
                                    />
                                  </span>
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        {(!sale.cylinder_items ||
                          sale.cylinder_items.length === 0) &&
                          (!sale.items || sale.items.length === 0) && (
                            <div className="text-center text-xs text-gray-500 p-2">
                              No products recorded for this sale.
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Optional: Show that payments were reversed? */}
                    {sale.payments && sale.payments.length > 0 && (
                      <div className="text-center text-[10px] text-gray-400 mt-2 pt-2 border-t">
                        Payments for this sale have been reversed.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SalesList
