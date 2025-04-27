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

const MyProfilePage = () => {
  const dispatch = useAppDispatch()
  const myProfile = useAppSelector(selectMyProfile)

  const defaulted_data = useAppSelector(selectAllDefaults);
  console.log("defaulted_data", defaulted_data)
  const lessPay_data = useAppSelector(selectAllLessPay)
  console.log("lessPay_data", lessPay_data)
  const expense = useAppSelector(selectAllExpenses)
  const allCash = useAppSelector(selectAllCash)
  const mySalary = useAppSelector(selectAllSalary)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_number: "",
    phone: "",
    alternative_phone: "",
    gender: "",
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [frontIdImage, setFrontIdImage] = useState<File | null>(null)
  const [backIdImage, setBackIdImage] = useState<File | null>(null)

  useEffect(() => {
    dispatch(fetchMyProfile())
    dispatch(fetchCash())
  }, [dispatch])

  useEffect(() => {
    if (myProfile?.id) {
      // Fetch data only when myProfile is available
      dispatch(fetchDefaults(myProfile.id))
      dispatch(fetchLessPay(myProfile.id))
      dispatch(fetchExpenses(myProfile.id))
      dispatch(fetchSalary(myProfile.id))
    }
  }, [dispatch, myProfile])

  const totalExpenses = expense.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  )
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
    // Create a FormData object to handle both text and file inputs
    const submitData = new FormData()

    // Append form fields
    submitData.append("first_name", formData.first_name)
    submitData.append("last_name", formData.last_name)
    submitData.append("id_number", formData.id_number)
    submitData.append("phone", formData.phone)
    submitData.append("alternative_phone", formData.alternative_phone)
    submitData.append("gender", formData.gender)

    // Append images if they exist
    if (profileImage) {
      submitData.append("profile_image", profileImage)
    }
    if (frontIdImage) {
      submitData.append("front_id", frontIdImage)
    }
    if (backIdImage) {
      submitData.append("back_id", backIdImage)
    }

    try {
      // Dispatch the update action or make an API call directly
      const response = await dispatch(updateMyProfile(submitData)).unwrap()

      alert("Profile updated successfully!")
      console.log("Response:", response)

      setIsEditing(false) // Exit editing mode
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("An error occurred while updating the profile.")
    }
  }

  const HandleLogout = () => {
    dispatch(logout())
  }

  const employeeId = myProfile?.id

  const filteredCash = allCash?.filter((cash) => {
    return cash.employee === employeeId
  })
  const totalCashDefault = filteredCash?.reduce((acc, cash) => {
    return acc + cash.cash_default
  }, 0)

  const totalCost = defaulted_data.reduce((sum, cylinder) => {
    const isFilled = !!cylinder.number_of_filled_cylinder
    const isEmpty = !!cylinder.number_of_empty_cylinder

    const price = isFilled
      ? cylinder.cylinder?.max_retail_selling_price
      : isEmpty
      ? cylinder.cylinder?.empty_cylinder_price
      : 0

    return sum + (price || 0) // fallback in case price is undefined
  }, 0)

  const totalLessPay = lessPay_data.reduce((sum, cylinder) => {
    return sum + (cylinder.cylinder?.max_retail_refil_price || 0)
  }, 0)

  // payment filters
  // Payment Filters - Salary Period Logic
  const [selectedPeriod, setSelectedPeriod] = useState("")

  const joinDate = myProfile?.date_joined
    ? new Date(myProfile.date_joined)
    : new Date()
  const today = new Date()

  const monthDiff = differenceInMonths(today, joinDate) + 1
  const months = Array.from({ length: monthDiff }, (_, i) =>
    addMonths(joinDate, i),
  )

  const getMonthStatus = (monthDate) => {
    const record = mySalary.find((entry) =>
      isSameMonth(new Date(entry.payment_date), monthDate),
    )
    return {
      isPaid: record?.is_paid || false,
      paymentDate: record?.payment_date || null,
    }
  }

  const unpaidMonths = months.filter((month) => !getMonthStatus(month).isPaid)

  const netSalary =
    myProfile.contract_salary - totalCashDefault - totalExpenses - totalCost

  return (
    <div className="min-h-screen min-w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your profile information.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/sales"
            className="text-sm font-medium text-blue-600 hover:underline transition duration-150"
          >
            Back to Sales
          </Link>

          <button
            onClick={HandleLogout}
            title="Logout"
            className="text-red-500 hover:text-red-600 transition duration-200"
          >
            <PowerSettingsNewIcon fontSize="medium" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow py-6 px-2 flex flex-col items-center">
        {myProfile ? (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <div>
                <img
                  src={myProfile.profile_image || defaultProfile}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                {isEditing && (
                  <div className="mt-2">
                    <label
                      htmlFor="profile_image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Profile Image
                    </label>
                    <input
                      type="file"
                      id="profile_image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "profile")}
                      className="mt-1 block w-full text-sm text-gray-600"
                    />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center whitespace-nowrap space-x-1">
                  <div>
                    {formData.first_name} {formData.last_name}
                  </div>
                  {myProfile.verified && (
                    <img
                      className=" w-6 h-6 object-contain"
                      src={bluetick}
                      alt="bluetick"
                    />
                  )}
                </h2>
                <p className="text-gray-600">
                  {myProfile.sales_team?.name || "No Sales Team Assigned"}
                </p>
              </div>
            </div>

            {/* ID Pictures */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                ID Pictures
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Front ID */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Front ID
                  </h4>
                  <img
                    src={myProfile.front_id || defaultProfile}
                    alt="Front ID"
                    className="w-full h-40 object-cover rounded-md border border-gray-300"
                  />
                  {isEditing && (
                    <div className="mt-3">
                      <label
                        htmlFor="front_id"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Upload Front ID
                      </label>
                      <input
                        type="file"
                        id="front_id"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "front_id")}
                        className="block w-full text-sm text-gray-700 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-white hover:file:bg-gray-100"
                      />
                    </div>
                  )}
                </div>

                {/* Back ID */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Back ID
                  </h4>
                  <img
                    src={myProfile.back_id || defaultProfile}
                    alt="Back ID"
                    className="w-full h-40 object-cover rounded-md border border-gray-300"
                  />
                  {isEditing && (
                    <div className="mt-3">
                      <label
                        htmlFor="back_id"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Upload Back ID
                      </label>
                      <input
                        type="file"
                        id="back_id"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "back_id")}
                        className="block w-full text-sm text-gray-700 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-white hover:file:bg-gray-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-6">
              {isEditing ? (
                <form className="space-y-6 bg-white shadow-md rounded-xl p-6 border border-gray-200">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="text-sm font-semibold text-gray-600"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="alternative_phone"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Alternative Phone
                      </label>
                      <input
                        type="text"
                        id="alternative_phone"
                        name="alternative_phone"
                        value={formData.alternative_phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* ID & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="id_number"
                        className="text-sm font-semibold text-gray-600"
                      >
                        ID Number
                      </label>
                      <input
                        type="text"
                        id="id_number"
                        name="id_number"
                        value={formData.id_number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  {[
                    { label: "First Name", value: myProfile.first_name },
                    { label: "Last Name", value: myProfile.last_name },
                    {
                      label: "Phone",
                      value: myProfile.phone || "Not Provided",
                    },
                    {
                      label: "Alternative Phone",
                      value: myProfile.alternative_phone || "Not Provided",
                    },
                    {
                      label: "ID Number",
                      value: myProfile.id_number || "Not Provided",
                    },
                    {
                      label: "Gender",
                      value: myProfile.gender || "Not Provided",
                    },
                  ].map(({ label, value }, idx) => (
                    <p key={idx} className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {label}:
                      </span>{" "}
                      {value}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading profile...</p>
        )}
      </div>

      {unpaidMonths.length > 0 && (
        <div className="bg-red-50 border border-red-300 p-4 rounded-md text-red-700 mt-6">
          <h4 className="font-semibold">Unpaid Months</h4>
          <ul className="list-disc ml-5 mt-2 text-sm">
            {unpaidMonths.map((month, i) => (
              <li key={i}>{format(month, "MMMM yyyy")}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Period Selector */}
        <div className="flex justify-end">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-blue-500"
          >
            {months.map((month, i) => (
              <option key={i} value={month.toISOString()}>
                {format(month, "MMMM yyyy")}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Base Salary</span>
            <span className="text-lg font-semibold text-gray-900">
              <FormattedAmount amount={myProfile.contract_salary} />
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Cash Default</span>
            <span className="text-lg font-semibold text-red-600">
              {filteredCash
                .filter((item) =>
                  isSameMonth(new Date(item.date), new Date(selectedPeriod)),
                )
                .reduce((sum, item) => sum + item.cash_default, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "KSH",
                })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Expenses</span>
            <span className="text-lg font-semibold text-yellow-600">
              {expense
                .filter((item) =>
                  isSameMonth(new Date(item.date), new Date(selectedPeriod)),
                )
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "KSH",
                })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Lost Cylinders</span>
            <span className="text-lg font-semibold text-rose-600">
              {defaulted_data
                .filter((item) =>
                  isSameMonth(
                    new Date(item.date_lost),
                    new Date(selectedPeriod),
                  ),
                )
                .reduce((sum, cylinder) => {
                  const isFilled = !!cylinder.number_of_filled_cylinder
                  const isEmpty = !!cylinder.number_of_empty_cylinder
                  const price = isFilled
                    ? cylinder.cylinder?.maximum_selling_price
                    : isEmpty
                    ? cylinder.cylinder?.empty_cylinder_price
                    : 0
                  return sum + (price || 0)
                }, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "KSH",
                })}
            </span>
          </div>
        </div>

        {/* Net Salary */}
        <div className="border border-dashed border-green-800 rounded-md p-4 bg-green-50">
          <h4 className="text-md font-bold text-green-900 mb-1">Net Salary</h4>
          <p className="text-xl font-bold text-green-700">
            <FormattedAmount
              amount={
                myProfile.contract_salary -
                filteredCash
                  .filter((item) =>
                    isSameMonth(new Date(item.date), new Date(selectedPeriod)),
                  )
                  .reduce((sum, item) => sum + item.cash_default, 0) -
                expense
                  .filter((item) =>
                    isSameMonth(new Date(item.date), new Date(selectedPeriod)),
                  )
                  .reduce((sum, item) => sum + item.amount, 0) -
                defaulted_data
                  .filter((item) =>
                    isSameMonth(
                      new Date(item.date_lost),
                      new Date(selectedPeriod),
                    ),
                  )
                  .reduce((sum, cylinder) => {
                    const isFilled = !!cylinder.number_of_filled_cylinder
                    const isEmpty = !!cylinder.number_of_empty_cylinder
                    const price = isFilled
                      ? cylinder.cylinder?.maximum_selling_price
                      : isEmpty
                      ? cylinder.cylinder?.empty_cylinder_price
                      : 0
                    return sum + (price || 0)
                  }, 0)
              }
            />
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Salary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Base Salary</span>
            <span className="text-lg font-semibold text-gray-900">
              <FormattedAmount amount={myProfile.contract_salary} />
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Cash Default</span>
            <span className="text-lg font-semibold text-red-600">
              {totalCashDefault.toLocaleString("en-US", {
                style: "currency",
                currency: "KSH",
              })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Expenses</span>
            <span className="text-lg font-semibold text-yellow-600">
              {totalExpenses.toLocaleString("en-US", {
                style: "currency",
                currency: "KSH",
              })}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Lost Cylinders</span>
            <span className="text-lg font-semibold text-rose-600">
              {totalCost.toLocaleString("en-US", {
                style: "currency",
                currency: "KSH",
              })}
            </span>
          </div>


          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Less Pay</span>
            <span className="text-lg font-semibold text-rose-600">
              {totalLessPay.toLocaleString("en-US", {
                style: "currency",
                currency: "KSH",
              })}
            </span>
          </div>
        </div>

        

        {/* Net Salary */}
        <div className="border border-dashed border-green-800 rounded-md p-4 bg-green-50">
          <h4 className="text-md font-bold text-green-900 mb-1">Net Salary</h4>
          <p className="text-xl font-bold text-green-700">
            <FormattedAmount
              amount={
                myProfile.contract_salary -
                totalCashDefault -
                totalExpenses -
                totalCost - totalLessPay
              }
            />
          </p>
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {/* Cash Defaults */}
        {filteredCash.length > 0 && (
          <section className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cash at Hand Defaults
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredCash.map((cash) => (
                    <tr key={cash.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {cash.cash_default ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        <DateDisplay date={cash.date} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Expenses */}
        {expense.length > 0 && (
          <section className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Expenses</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expense.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{exp.name ?? "N/A"}</td>
                      <td className="px-4 py-2 border">
                        {exp.amount ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        <DateDisplay date={exp.date} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-lg font-semibold mt-4">
              Total Expenses:{" "}
              <span className="text-red-600">
                Ksh {totalExpenses.toLocaleString()}
              </span>
            </div>
          </section>
        )}

        {/* Lost Cylinders */}
        {defaulted_data.length > 0 && (
          <section className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Lost Cylinders
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 border">Gas Type</th>
                    <th className="px-4 py-2 border">Weight (kg)</th>
                    <th className="px-4 py-2 border">Filled</th>
                    <th className="px-4 py-2 border">Empty</th>
                    <th className="px-4 py-2 border">Cost</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {defaulted_data.map((cylinder) => {
                    const isFilled = !!cylinder.number_of_filled_cylinder
                    const isEmpty = !!cylinder.number_of_empty_cylinder
                    const cost = isFilled
                      ? cylinder.cylinder?.max_retail_selling_price
                      : isEmpty
                      ? cylinder.cylinder?.empty_cylinder_price
                      : "N/A"

                    return (
                      <tr key={cylinder.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">
                          {cylinder.cylinder?.gas_type ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {cylinder.cylinder?.weight ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {cylinder.number_of_filled_cylinder ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {cylinder.number_of_empty_cylinder ?? "N/A"}
                        </td>
                        <td className="px-4 py-2 border">{cost ?? "N/A"}</td>
                        <td className="px-4 py-2 border">
                          <DateDisplay date={cylinder.date_lost} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-right text-lg font-semibold mt-4">
              Total Lost Cylinder Cost:{" "}
              <span className="text-red-600">
                Ksh {totalCost.toLocaleString()}
              </span>
            </div>
          </section>
        )}

        {/* Less Pay Cylinders */}
        {lessPay_data.length > 0 && (
          <section className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Less Pay Cylinders
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 border">Gas Type</th>
                    <th className="px-4 py-2 border">Weight (kg)</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {lessPay_data.map((cylinder) => (
                    <tr key={cylinder.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {cylinder.cylinder?.gas_type ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {cylinder.cylinder?.weight ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {cylinder.cylinders_less_pay ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        <DateDisplay date={cylinder.date_lost} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right text-lg font-semibold mt-4">
              Total Less Pay Cost:{" "}
              <span className="text-red-600">
                Ksh {totalLessPay.toLocaleString()}
              </span>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}

      <Link
        className="bg-blue-600 text-white py-3 text-center shadow-inner"
        to="/sales"
      >
        <div className="">Home</div>
      </Link>
    </div>
  )
}

export default MyProfilePage
