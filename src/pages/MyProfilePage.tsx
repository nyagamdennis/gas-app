// @ts-nocheck
import React, { useEffect, useState } from "react"
import { format, differenceInMonths, addMonths, isSameMonth } from "date-fns"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchMyProfile,
  selectMyProfile,
  updateMyProfile,
} from "../features/employees/myProfileSlice"
import { Link } from "react-router-dom"
import bluetick from "../components/media/bluetick.png"
import defaultProfile from "../components/media/default.png"
import {
  fetchDefaults,
  selectAllDefaults,
} from "../features/defaults/defaultsSlice"
import {
  fetchLessPay,
  selectAllLessPay,
} from "../features/defaults/lessPaySlice"
import DateDisplay from "../components/DateDisplay"
import {
  fetchExpenses,
  selectAllExpenses,
} from "../features/expenses/expensesSlice"
import CurrencyConvert from "../components/CurrencyConvert"
import FormattedAmount from "../components/FormattedAmount"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import { logout } from "../features/auths/authSlice"
import { fetchCash, selectAllCash } from "../features/cashAtHand/cashSlice"
import { fetchSalary, selectAllSalary } from "../features/salary/salarySlice"
import {
  fetchAdvances,
  selectAllAdvance,
} from "../features/defaults/advancesSlice"
import Navbar from "../components/ui/mobile/employees/Navbar"
import EmployeeFooter from "../components/ui/EmployeeFooter"
import {
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  IconButton,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import BadgeIcon from "@mui/icons-material/Badge"
import WcIcon from "@mui/icons-material/Wc"
import WorkIcon from "@mui/icons-material/Work"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import ReceiptIcon from "@mui/icons-material/Receipt"
import DeleteIcon from "@mui/icons-material/Delete"
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"
import WarningIcon from "@mui/icons-material/Warning"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const MyProfilePage = () => {
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(selectMyProfile)
  const advances = useAppSelector(selectAllAdvance)
  const defaulted_data = useAppSelector(selectAllDefaults)
  const lessPay_data = useAppSelector(selectAllLessPay)
  const expense = useAppSelector(selectAllExpenses)
  const allCash = useAppSelector(selectAllCash)
  const mySalary = useAppSelector(selectAllSalary)
  const employeeSalary = useAppSelector(selectAllSalary)

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.toLocaleString("default", {
      month: "long",
    })} ${now.getFullYear()}`
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_number: "",
    phone: "",
    alternative_phone: "",
    gender: "",
  })

  const employeeId = myProfile?.id

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [frontIdImage, setFrontIdImage] = useState<File | null>(null)
  const [backIdImage, setBackIdImage] = useState<File | null>(null)

  useEffect(() => {
    dispatch(fetchMyProfile())
    dispatch(fetchCash())
  }, [dispatch])

  useEffect(() => {
    if (myProfile?.id) {
      dispatch(fetchDefaults(myProfile.id))
      dispatch(fetchLessPay(myProfile.id))
      dispatch(fetchExpenses(myProfile.id))
      dispatch(fetchSalary(myProfile.id))
      dispatch(fetchAdvances(myProfile?.id))
    }
  }, [dispatch, myProfile])

  useEffect(() => {
    if (myProfile) {
      setFormData({
        first_name: myProfile.first_name || "",
        last_name: myProfile.last_name || "",
        id_number: myProfile.id_number || "",
        phone: myProfile.phone || "",
        alternative_phone: myProfile.alternative_phone || "",
        gender: myProfile.gender || "",
      })
    }
  }, [myProfile])

  const getDateRangeForSelectedMonth = (
    selectedMonth: string,
    salaries: any[],
  ): { startDate: Date; endDate: Date } => {
    const [monthStr, yearStr] = selectedMonth.split(" ")
    const selectedDate = new Date(`${monthStr} 1, ${yearStr}`)

    const sortedSalaries = salaries
      .filter((s) => !!s.payment_date)
      .map((s) => new Date(s.payment_date))
      .sort((a, b) => a.getTime() - b.getTime())

    let startDate: Date
    let endDate: Date = new Date()

    const currentSalaryDate = sortedSalaries.find((date) => {
      return (
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      )
    })

    if (currentSalaryDate) {
      startDate = currentSalaryDate
      const nextSalaryDate = sortedSalaries.find((d) => d > currentSalaryDate)
      if (nextSalaryDate) endDate = nextSalaryDate
    } else {
      startDate = selectedDate
      const nextSalaryDate = sortedSalaries.find((d) => d > startDate)
      if (nextSalaryDate) endDate = nextSalaryDate
    }

    return { startDate, endDate }
  }

  const { startDate, endDate } = getDateRangeForSelectedMonth(
    selectedMonth,
    employeeSalary,
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (type === "profile") setProfileImage(file)
    if (type === "front_id") setFrontIdImage(file)
    if (type === "back_id") setBackIdImage(file)
  }

  const handleSave = async () => {
    const submitData = new FormData()
    submitData.append("first_name", formData.first_name)
    submitData.append("last_name", formData.last_name)
    submitData.append("id_number", formData.id_number)
    submitData.append("phone", formData.phone)
    submitData.append("alternative_phone", formData.alternative_phone)
    submitData.append("gender", formData.gender)

    if (profileImage) submitData.append("profile_image", profileImage)
    if (frontIdImage) submitData.append("front_id", frontIdImage)
    if (backIdImage) submitData.append("back_id", backIdImage)

    try {
      await dispatch(updateMyProfile(submitData)).unwrap()
      alert("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("An error occurred while updating the profile.")
    }
  }

  const HandleLogout = () => {
    dispatch(logout())
  }

  const filteredCash = allCash?.filter((cash) => {
    const cashDate = new Date(cash.deficit_date)
    return (
      cash.employee === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const totalCashDefault = filteredCash?.reduce((acc, cash) => {
    return acc + cash.cash_default
  }, 0)

  const filteredtotalMaxWholesaleDefaultPrice = defaulted_data?.filter(
    (cash) => {
      const cashDate = new Date(cash.date_lost)
      if (isNaN(cashDate)) return false
      return (
        cash.employee === employeeId &&
        cashDate >= startDate &&
        cashDate < endDate
      )
    },
  )

  const totalCost = filteredtotalMaxWholesaleDefaultPrice.reduce(
    (sum, cylinder) => {
      const isFilled = !!cylinder.number_of_filled_cylinder
      const isEmpty = !!cylinder.number_of_empty_cylinder
      const price = isFilled
        ? cylinder.cylinder?.max_retail_selling_price
        : isEmpty
        ? cylinder.cylinder?.empty_cylinder_price
        : 0
      return sum + (price || 0)
    },
    0,
  )

  const filteredEmployeeLessPay = lessPay_data?.filter((cash) => {
    const cashDate = new Date(cash.date_lost)
    if (isNaN(cashDate)) return false
    return (
      cash.employee === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const totalLessPay = filteredEmployeeLessPay.reduce((sum, cylinder) => {
    return sum + (cylinder.cylinder?.max_retail_refil_price || 0)
  }, 0)

  const filteredExpenses = expense?.filter((cash) => {
    const cashDate = new Date(cash.date)
    if (isNaN(cashDate)) return false
    return (
      cash.employee?.id === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const totalExpenses = filteredExpenses.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  const filteredAdvances = advances?.filter((cash) => {
    const cashDate = new Date(cash.date_added)
    if (isNaN(cashDate)) return false
    return (
      cash.employee === employeeId &&
      cashDate >= startDate &&
      cashDate < endDate
    )
  })

  const totalAdvances = filteredAdvances.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )

  const netSalary =
    myProfile?.contract_salary -
    totalCashDefault -
    totalExpenses -
    totalCost -
    totalLessPay -
    totalAdvances

  const formated_payment_date = () => {
    const today = new Date()
    const joined = new Date(myProfile?.date_joined)
    return new Date(today.getFullYear(), today.getMonth(), joined.getDate())
  }

  const generateMonthOptions = () => {
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
    const joinedDate = new Date(myProfile?.date_joined)
    const currentDate = new Date()
    const options = []
    for (
      let date = new Date(joinedDate);
      date <= currentDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const label = `${months[date.getMonth()]} ${date.getFullYear()}`
      if (label !== selectedMonth) {
        options.push(
          <option key={label} value={label}>
            {label}
          </option>,
        )
      }
    }
    return options
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <Navbar
        headerMessage={myProfile?.sales_team?.name || "No Sales Team"}
        headerText="Manage your profile"
      />

      <main className="flex-grow m-2 p-1 pb-20 space-y-4">
        {myProfile ? (
          <>
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={myProfile.profile_image || defaultProfile}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
                      <EditIcon fontSize="small" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "profile")}
                      />
                    </label>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {formData.first_name} {formData.last_name}
                    </h2>
                    {myProfile.verified && (
                      <img src={bluetick} alt="Verified" className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <WorkIcon fontSize="small" />
                    {myProfile.sales_team?.name || "No Sales Team Assigned"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <BadgeIcon fontSize="small" />
                    ID: {myProfile.id_number || "Not Provided"}
                  </p>
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                  onClick={() => setIsEditing(!isEditing)}
                  className="normal-case"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </div>

            {/* ID Pictures Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BadgeIcon className="text-blue-600" />
                ID Pictures
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Front ID</p>
                  <img
                    src={myProfile.front_id || defaultProfile}
                    alt="Front ID"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 text-sm"
                      onChange={(e) => handleImageChange(e, "front_id")}
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Back ID</p>
                  <img
                    src={myProfile.back_id || defaultProfile}
                    alt="Back ID"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 text-sm"
                      onChange={(e) => handleImageChange(e, "back_id")}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details Card */}
            {isEditing ? (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Edit Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <TextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Alternative Phone"
                    name="alternative_phone"
                    value={formData.alternative_phone}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="ID Number"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PersonIcon className="text-blue-600" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">First Name:</span>{" "}
                    <span className="font-medium">{myProfile.first_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Name:</span>{" "}
                    <span className="font-medium">{myProfile.last_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>{" "}
                    <span className="font-medium">
                      {myProfile.phone || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Alt Phone:</span>{" "}
                    <span className="font-medium">
                      {myProfile.alternative_phone || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">ID Number:</span>{" "}
                    <span className="font-medium">
                      {myProfile.id_number || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>{" "}
                    <span className="font-medium">
                      {myProfile.gender || "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Salary Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <AttachMoneyIcon className="text-green-600" />
                  Salary Summary
                </h3>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm bg-gray-50"
                >
                  <option value={selectedMonth} disabled>
                    {selectedMonth}
                  </option>
                  {generateMonthOptions()}
                </select>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Salary</span>
                  <span className="font-semibold">
                    <FormattedAmount amount={myProfile.contract_salary} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Default</span>
                  <span className="font-semibold text-red-600">
                    - <FormattedAmount amount={totalCashDefault} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expenses</span>
                  <span className="font-semibold text-red-600">
                    - <FormattedAmount amount={totalExpenses} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lost Cylinders</span>
                  <span className="font-semibold text-red-600">
                    - <FormattedAmount amount={totalCost} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Less Pay</span>
                  <span className="font-semibold text-red-600">
                    - <FormattedAmount amount={totalLessPay} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Advances</span>
                  <span className="font-semibold text-red-600">
                    - <FormattedAmount amount={totalAdvances} />
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Salary</span>
                  <span className="text-green-700">
                    <FormattedAmount amount={netSalary} />
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Payment Date: <DateDisplay date={formated_payment_date()} />
                </p>
              </div>
            </div>

            {/* Deductions Detail Sections (collapsible cards) */}
            {filteredCash.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CreditCardIcon className="text-red-500" />
                  Cash Defaults
                </h4>
                <div className="space-y-2">
                  {filteredCash.map((cash) => (
                    <div
                      key={cash.id}
                      className="flex justify-between text-sm border-b py-1"
                    >
                      <span>
                        <DateDisplay date={cash.date} />
                      </span>
                      <span className="font-medium">
                        <FormattedAmount amount={cash.cash_default} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredExpenses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <ReceiptIcon className="text-orange-500" />
                  Expenses
                </h4>
                <div className="space-y-2">
                  {filteredExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between text-sm border-b py-1"
                    >
                      <span>
                        {exp.name}{" "}
                        <span className="text-gray-400">
                          <DateDisplay date={exp.date} />
                        </span>
                      </span>
                      <span className="font-medium">
                        <FormattedAmount amount={exp.amount} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredtotalMaxWholesaleDefaultPrice.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <DeleteIcon className="text-purple-500" />
                  Lost Cylinders
                </h4>
                <div className="space-y-2">
                  {filteredtotalMaxWholesaleDefaultPrice.map((cyl) => (
                    <div key={cyl.id} className="text-sm border-b py-1">
                      <div className="flex justify-between">
                        <span>
                          {cyl.cylinder?.gas_type} {cyl.cylinder?.weight}kg
                        </span>
                        <span className="font-medium">
                          <FormattedAmount
                            amount={
                              cyl.cylinder?.max_retail_selling_price ||
                              cyl.cylinder?.empty_cylinder_price
                            }
                          />
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {cyl.number_of_filled_cylinder
                          ? `Filled: ${cyl.number_of_filled_cylinder}`
                          : `Empty: ${cyl.number_of_empty_cylinder}`}{" "}
                        • <DateDisplay date={cyl.date_lost} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredEmployeeLessPay.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <WarningIcon className="text-amber-500" />
                  Less Pay Cylinders
                </h4>
                <div className="space-y-2">
                  {filteredEmployeeLessPay.map((cyl) => (
                    <div
                      key={cyl.id}
                      className="flex justify-between text-sm border-b py-1"
                    >
                      <span>
                        {cyl.cylinder?.gas_type} {cyl.cylinder?.weight}kg x
                        {cyl.cylinders_less_pay}{" "}
                        <DateDisplay date={cyl.date_lost} />
                      </span>
                      <span className="font-medium">
                        <FormattedAmount
                          amount={cyl.cylinder?.max_retail_refil_price}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        )}
      </main>

      <EmployeeFooter />
    </div>
  )
}

export default MyProfilePage
