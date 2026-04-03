// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AdminsFooter from "../../components/AdminsFooter"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useMediaQuery, useTheme } from "@mui/material"
import api from "../../../utils/api"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

const EmployeePayment = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()
  const navigate = useNavigate()
  const employeeId = location.pathname.split("/").pop()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [employeeData, setEmployeeData] = useState(null)

  // Active tab for the detailed lists
  const [activeTab, setActiveTab] = useState("salary") // salary, losses, expenses, advances, deficits

  // Salary structure form state
  const [basicSalary, setBasicSalary] = useState("")
  const [houseAllowance, setHouseAllowance] = useState("0")
  const [transportAllowance, setTransportAllowance] = useState("0")
  const [medicalAllowance, setMedicalAllowance] = useState("0")
  const [otherAllowances, setOtherAllowances] = useState("0")
  const [nhifDeduction, setNhifDeduction] = useState("0")
  const [nssfDeduction, setNssfDeduction] = useState("0")
  const [payeDeduction, setPayeDeduction] = useState("0")
  const [paymentMethod, setPaymentMethod] = useState("CASH")
  const [paymentDay, setPaymentDay] = useState("")
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankBranch, setBankBranch] = useState("")

  // Advanced Features
    const [batchMode, setBatchMode] = useState(false)
    const [selectedBatchItems, setSelectedBatchItems] = useState([])
    const [lastUpdated, setLastUpdated] = useState(null)
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [realTimeEnabled, setRealTimeEnabled] = useState(false)
    const [dataVersion, setDataVersion] = useState(0)
  
    

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMonth, setPaymentMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [paymentYear, setPaymentYear] = useState(new Date().getFullYear())
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  )
  const [processingPayment, setProcessingPayment] = useState(false)


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from(
    { length: 3 },
    (_, i) => new Date().getFullYear() + i,
  )

  const handleProcessPayment = async () => {
    if (!employeeData) return
    setProcessingPayment(true)
    try {
      const payload = {
        month: paymentMonth,
        year: paymentYear,
        payment_date: paymentDate,
        payment_reference: paymentReference || null,
        amount: totals.finalPayable, // maybe not needed, backend can compute
      }
      // Adjust endpoint as per your backend
      await api.post(`/payroll/employees/${employeeId}/pay/`, payload)
      toast.success("Payment processed successfully")
      setShowPaymentModal(false)
      // Optionally refresh data
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to process payment")
    } finally {
      setProcessingPayment(false)
    }
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await api.get(
          `/payroll/employees/${employeeId}/payroll-summary/`,
        )
        const data = response.data

        // Handle salary_structure being an array (backend returns many=True)
        let salaryStruct = null
        if (
          Array.isArray(data.salary_structure) &&
          data.salary_structure.length > 0
        ) {
          salaryStruct = data.salary_structure[0]
        } else if (
          data.salary_structure &&
          !Array.isArray(data.salary_structure)
        ) {
          salaryStruct = data.salary_structure
        }

        setEmployeeData({ ...data, salary_structure: salaryStruct })

        // Prefill form if salary structure exists
        if (salaryStruct) {
          setBasicSalary(salaryStruct.basic_salary || "")
          setHouseAllowance(salaryStruct.house_allowance || "0")
          setTransportAllowance(salaryStruct.transport_allowance || "0")
          setMedicalAllowance(salaryStruct.medical_allowance || "0")
          setOtherAllowances(salaryStruct.other_allowances || "0")
          setNhifDeduction(salaryStruct.nhif_deduction || "0")
          setNssfDeduction(salaryStruct.nssf_deduction || "0")
          setPayeDeduction(salaryStruct.paye_deduction || "0")
          setPaymentMethod(salaryStruct.payment_method || "CASH")
          setPaymentDay(salaryStruct.payment_day || "")
          setMpesaNumber(salaryStruct.mpesa_number || "")
          setBankName(salaryStruct.bank_name || "")
          setBankAccount(salaryStruct.bank_account || "")
          setBankBranch(salaryStruct.bank_branch || "")
        }
      } catch (err) {
        console.error(err)
        toast.error(
          err.response?.data?.message || "Failed to load employee data",
        )
      } finally {
        setLoading(false)
      }
    }

    if (employeeId) fetchData()
  }, [employeeId])

  // Next payment date calculation
  const getNextPaymentDate = () => {
    if (!paymentDay) return null
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = parseInt(paymentDay, 10)

    let paymentDate = new Date(year, month, day)
    if (paymentDate < today) {
      paymentDate = new Date(year, month + 1, day)
    }
    // Handle month overflow
    if (paymentDate.getMonth() !== (paymentDate > today ? month + 1 : month)) {
      paymentDate = new Date(year, month + 1, 0)
      if (paymentDate < today) {
        paymentDate = new Date(year, month + 2, 0)
      }
    }
    return paymentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Compute totals
  const computeTotals = () => {
    const basic = parseFloat(basicSalary) || 0
    const house = parseFloat(houseAllowance) || 0
    const transport = parseFloat(transportAllowance) || 0
    const medical = parseFloat(medicalAllowance) || 0
    const other = parseFloat(otherAllowances) || 0
    const gross = basic + house + transport + medical + other

    const nhif = parseFloat(nhifDeduction) || 0
    const nssf = parseFloat(nssfDeduction) || 0
    const paye = parseFloat(payeDeduction) || 0
    const statutory = nhif + nssf + paye

    const netAfterStatutory = gross - statutory

    let totalLosses = 0
    let totalExpenses = 0
    let totalAdvances = 0
    let totalDeficits = 0

    if (employeeData) {
      totalLosses =
        employeeData.losses?.reduce(
          (sum, l) => sum + (parseFloat(l.amount) || 0),
          0,
        ) || 0
      totalExpenses =
        employeeData.expenses?.reduce(
          (sum, e) => sum + (parseFloat(e.deduction_amount) || 0),
          0,
        ) || 0
      totalAdvances =
        employeeData.advances?.reduce(
          (sum, a) => sum + (parseFloat(a.amount_approved) || 0),
          0,
        ) || 0
      totalDeficits =
        employeeData.deficits?.reduce((sum, d) => {
          if (d.is_salary_deductible) {
            return sum + (parseFloat(d.total_difference) || 0)
          } // Advanced Features
          const [batchMode, setBatchMode] = useState(false)
          const [selectedBatchItems, setSelectedBatchItems] = useState([])
          const [lastUpdated, setLastUpdated] = useState(null)
          const [autoRefresh, setAutoRefresh] = useState(false)
          const [realTimeEnabled, setRealTimeEnabled] = useState(false)
          const [dataVersion, setDataVersion] = useState(0)

          return sum
        }, 0) || 0
    }

    const totalOtherDeductions =
      totalLosses + totalExpenses + totalAdvances + totalDeficits
    const finalPayable = netAfterStatutory - totalOtherDeductions

    return {
      gross,
      statutory,
      netAfterStatutory,
      totalLosses,
      totalExpenses,
      totalAdvances,
      totalDeficits,
      totalOtherDeductions,
      finalPayable,
    }
  }

  const totals = computeTotals()
  const nextPaymentDate = getNextPaymentDate()

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!employeeData) return

    if (!basicSalary || parseFloat(basicSalary) <= 0) {
      toast.warning("Please enter a valid basic salary")
      return
    }
    if (!paymentDay || parseInt(paymentDay) < 1 || parseInt(paymentDay) > 31) {
      toast.warning("Please enter a valid payment day (1-31)")
      return
    }
    if (paymentMethod === "MPESA" && !mpesaNumber) {
      toast.warning("Please enter M-Pesa phone number")
      return
    }
    if (paymentMethod === "BANK_TRANSFER" && (!bankName || !bankAccount)) {
      toast.warning("Please fill required bank details")
      return
    }

    setSaving(true)
    try {
      const payload = {
        basic_salary: parseFloat(basicSalary),
        house_allowance: parseFloat(houseAllowance) || 0,
        transport_allowance: parseFloat(transportAllowance) || 0,
        medical_allowance: parseFloat(medicalAllowance) || 0,
        other_allowances: parseFloat(otherAllowances) || 0,
        nhif_deduction: parseFloat(nhifDeduction) || 0,
        nssf_deduction: parseFloat(nssfDeduction) || 0,
        paye_deduction: parseFloat(payeDeduction) || 0,
        payment_method: paymentMethod,
        payment_day: parseInt(paymentDay) || null,
        mpesa_number: paymentMethod === "MPESA" ? mpesaNumber : null,
        bank_name: paymentMethod === "BANK_TRANSFER" ? bankName : null,
        bank_account: paymentMethod === "BANK_TRANSFER" ? bankAccount : null,
        bank_branch: paymentMethod === "BANK_TRANSFER" ? bankBranch : null,
      }

      if (employeeData.salary_structure?.id) {
        await api.put(
          `/salary-structures/${employeeData.salary_structure.id}/`,
          payload,
        )
      } else {
        payload.employee = employeeData.employee.id
        payload.company = employeeData.employee.company
        await api.post(
          `/payroll/employees/${employeeId}/payroll-summary/`,
          payload,
        )
      }

      toast.success("Salary structure saved successfully")
      navigate(-1)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
        <Navbar headerMessage="Loading..." headerText="Please wait" />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </main>
        <footer>
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
        <Navbar headerMessage="Error" headerText="No employee data" />
        <div className="prevent-overflow">
                  <RealTimeIndicator
                    enabled={autoRefresh}
                    lastUpdated={lastUpdated}
                    dataVersion={dataVersion}
                    onToggle={() => setAutoRefresh(!autoRefresh)}
                  />
                </div>
        <main className="flex-grow p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-500">Could not load employee information.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </main>
        <footer>
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  const employee = employeeData.employee

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage="Employee Payment"
        headerText={`${employee.first_name} ${employee.last_name}`}
      />
      <ToastContainer />

      <main className="flex-grow p-4 pb-24">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-3">
            <div className="text-xs text-gray-500">Gross Salary</div>
            <div className="text-lg font-bold text-gray-800">
              KES {totals.gross.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="text-xs text-gray-500">Statutory Deductions</div>
            <div className="text-lg font-bold text-red-600">
              KES {totals.statutory.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="text-xs text-gray-500">Net after Statutory</div>
            <div className="text-lg font-bold text-blue-600">
              KES {totals.netAfterStatutory.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="text-xs text-gray-500">Other Deductions</div>
            <div className="text-lg font-bold text-orange-600">
              KES {totals.totalOtherDeductions.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 col-span-2 md:col-span-1">
            <div className="text-xs text-gray-500">Final Payable</div>
            <div className="text-lg font-bold text-green-600">
              KES {totals.finalPayable.toLocaleString()}
            </div>
          </div>
        </div>
        {/* Payment Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md flex items-center gap-2 transition"
          >
            <span>💰</span> Process Payment
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-1 mb-4 flex flex-wrap">
          {[
            { id: "salary", label: "💰 Salary Structure" },
            {
              id: "losses",
              label: `📉 Losses (${employeeData.losses?.length || 0})`,
            },
            {
              id: "expenses",
              label: `🧾 Expenses (${employeeData.expenses?.length || 0})`,
            },
            {
              id: "advances",
              label: `💸 Advances (${employeeData.advances?.length || 0})`,
            },
            {
              id: "deficits",
              label: `⚠️ Deficits (${employeeData.deficits?.length || 0})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "salary" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-semibold text-gray-800">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {employee.email} • {employee.phone_number}
                </p>
                {employee.assigned_to && (
                  <p className="text-xs text-gray-500 mt-1">
                    Assigned to: {employee.assigned_to.name} (
                    {employee.assigned_to.type})
                  </p>
                )}
              </div>

              {/* Earnings */}
              <div>
                <h3 className="text-lg font-semibold mb-3">📈 Earnings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Basic Salary (KES) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="e.g. 30000"
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "House Allowance",
                        state: houseAllowance,
                        set: setHouseAllowance,
                      },
                      {
                        label: "Transport Allowance",
                        state: transportAllowance,
                        set: setTransportAllowance,
                      },
                      {
                        label: "Medical Allowance",
                        state: medicalAllowance,
                        set: setMedicalAllowance,
                      },
                      {
                        label: "Other Allowances",
                        state: otherAllowances,
                        set: setOtherAllowances,
                      },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="number"
                          value={field.state}
                          onChange={(e) => field.set(e.target.value)}
                          className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          min="0"
                          step="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statutory Deductions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  📉 Statutory Deductions
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "NHIF",
                      state: nhifDeduction,
                      set: setNhifDeduction,
                    },
                    {
                      label: "NSSF",
                      state: nssfDeduction,
                      set: setNssfDeduction,
                    },
                    {
                      label: "PAYE",
                      state: payeDeduction,
                      set: setPayeDeduction,
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        value={field.state}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        min="0"
                        step="100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  💳 Payment Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Payment Day <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={paymentDay}
                      onChange={(e) => setPaymentDay(e.target.value)}
                      min="1"
                      max="31"
                      className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="e.g. 25"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Day of month (1‑31). If the day exceeds month length, the
                      last day is used.
                    </p>
                  </div>
                  {nextPaymentDate && (
                    <div className="bg-blue-50 p-3 rounded-lg flex items-center">
                      <span className="text-blue-700 font-medium">
                        Next payment: {nextPaymentDate}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {["CASH", "MPESA", "BANK_TRANSFER"].map((method) => (
                      <label
                        key={method}
                        className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        <span className="font-medium">
                          {method === "BANK_TRANSFER"
                            ? "Bank Transfer"
                            : method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {paymentMethod === "MPESA" && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="tel"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                )}

                {paymentMethod === "BANK_TRANSFER" && (
                  <div className="mt-3 p-3 bg-green-50 rounded space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Equity Bank"
                        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="e.g. 1234567890"
                        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch (Optional)
                      </label>
                      <input
                        type="text"
                        value={bankBranch}
                        onChange={(e) => setBankBranch(e.target.value)}
                        placeholder="e.g. Nairobi"
                        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  {saving
                    ? "Saving..."
                    : employeeData.salary_structure?.id
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          )}

          {/* Losses Tab */}
          {activeTab === "losses" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Cylinder Losses</h3>
              {employeeData.losses?.length === 0 ? (
                <p className="text-gray-500">No losses recorded.</p>
              ) : (
                <div className="space-y-3">
                  {employeeData.losses.map((loss) => (
                    <div
                      key={loss.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {loss.cylinder_details?.display_name || "Cylinder"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {loss.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Location: {loss.location_name}
                          </p>
                          {loss.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              {loss.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            KES {parseFloat(loss.amount).toLocaleString()}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              loss.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : loss.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {loss.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Employee Expenses</h3>
              {employeeData.expenses?.length === 0 ? (
                <p className="text-gray-500">No expenses attached.</p>
              ) : (
                <div className="space-y-3">
                  {employeeData.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">
                            {exp.expense?.title || "Expense"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {exp.description || "No description"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Attached:{" "}
                            {new Date(exp.attached_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">
                            KES{" "}
                            {parseFloat(exp.deduction_amount).toLocaleString()}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              exp.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : exp.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {exp.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Advances Tab */}
          {activeTab === "advances" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Salary Advances</h3>
              {employeeData.advances?.length === 0 ? (
                <p className="text-gray-500">No advances recorded.</p>
              ) : (
                <div className="space-y-3">
                  {employeeData.advances.map((adv) => (
                    <div
                      key={adv.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">
                            Requested: KES{" "}
                            {parseFloat(adv.amount_requested).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Approved: KES{" "}
                            {parseFloat(
                              adv.amount_approved || 0,
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Reason: {adv.reason}
                          </p>
                          <p className="text-xs text-gray-500">
                            Recovered: KES{" "}
                            {parseFloat(adv.amount_recovered).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              adv.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : adv.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : adv.status === "RECOVERING"
                                ? "bg-blue-100 text-blue-800"
                                : adv.status === "CLEARED"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {adv.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Deficits Tab */}
          {activeTab === "deficits" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Daily Deficits</h3>
              {employeeData.deficits?.length === 0 ? (
                <p className="text-gray-500">No deficits recorded.</p>
              ) : (
                <div className="space-y-3">
                  {employeeData.deficits.map((def) => (
                    <div
                      key={def.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{def.item_name}</p>
                          <p className="text-sm text-gray-600">
                            Invoice: {def.invoice_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expected: KES{" "}
                            {parseFloat(def.expected_price).toLocaleString()} |
                            Actual: KES{" "}
                            {parseFloat(def.actual_price).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Reason: {def.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            KES{" "}
                            {parseFloat(def.total_difference).toLocaleString()}
                          </p>
                          {def.is_salary_deductible && (
                            <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              Deductible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">💰</span>
                  Process Payment
                </h2>
                <p className="text-green-100 mt-1">
                  {employee.first_name} {employee.last_name}
                </p>
              </div>
              <div className="p-6">
                <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Net Payable</p>
                  <p className="text-2xl font-bold text-green-700">
                    KES {totals.finalPayable.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Month/Year selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <select
                        value={paymentMonth}
                        onChange={(e) =>
                          setPaymentMonth(parseInt(e.target.value))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      >
                        {months.map((name, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <select
                        value={paymentYear}
                        onChange={(e) =>
                          setPaymentYear(parseInt(e.target.value))
                        }
                        className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>

                  {/* Payment Reference (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Reference{" "}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. M-Pesa transaction ID"
                      className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition"
                    disabled={processingPayment}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={processingPayment}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center"
                  >
                    {processingPayment ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Confirm Payment"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default EmployeePayment
