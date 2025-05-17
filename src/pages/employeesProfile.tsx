// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { ClipLoader } from "react-spinners"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import defaultProfile from "../components/media/default.png"
import { useNavigate } from "react-router-dom"
import AdminsFooter from "../components/AdminsFooter"
import AdminNav from "../components/ui/AdminNav"
import planStatus from "../features/planStatus/planStatus"

const Employee = () => {
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

  const allEmployees = useAppSelector(selectAllEmployees)
  const allSalesTeams = useAppSelector(selectAllSalesTeam)

  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (businessId){
    dispatch(fetchEmployees({businessId}))
    dispatch(fetchSalesTeam({businessId}))}
  }, [dispatch, businessId])

  const handleNavigate = (id) => {
    navigate(`/admins/employees/${id}`)
  }

  const filteredEmployees = allEmployees.filter((employee) =>
    `${employee.first_name} ${employee.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )

  const inviteLink = `/register?ref=${encodeURIComponent(
    btoa(JSON.stringify({ id: businessId, name: businessName })),
  )}`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <main className="flex-grow">
        <AdminNav
          headerMessage={"Manage Employees"}
          headerText={"View, edit, and organize your workforce"}
        />
        <div className=" mt-2">
          <h2 className="text-lg font-semibold text-gray-800 px-6">
            {allEmployees.length} Employees
          </h2>
          <p className="text-sm text-gray-500 px-6">
            {isTrial
              ? "You are on a trial plan. Upgrade to Pro for more features."
              : isExpired
              ? "Your plan has expired. Please renew to continue using the service."
              : `You are on the ${subscriptionPlan} (${planName}) plan.`}
          </p>
          <p className="text-sm text-gray-500 px-6">
            {isPro
              ? "You have access to all features."
              : "Upgrade to Pro for more features."}
          </p>
        </div>
        {allEmployees.length < employeeLimit ? (
          <div className="px-6 py-4">
            <h3 className="text-sm text-gray-700 font-medium mb-2">
              Invite an employee
            </h3>
            <div className="flex flex-col gap-4 ">
              <input
                type="text"
                value={window.location.origin + inviteLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <div className="">
                <div className="flex items-center gap-3  md:flex-row md:gap-0.5 md:space-x-4">
                  {/* Native Share (if supported) */}
                  <button
                    onClick={() => {
                      const url = window.location.origin + inviteLink
                      if (navigator.share) {
                        navigator
                          .share({
                            title: "Join My Business",
                            text: "Register as an employee for our business",
                            url: url,
                          })
                          .catch((err) => console.error("Sharing failed", err))
                      } else {
                        navigator.clipboard.writeText(url)
                        alert("Link copied to clipboard. You can now paste it.")
                      }
                    }}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 text-xs rounded"
                  >
                    Share Link
                  </button>

                  {/* WhatsApp Share */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Register here: ${window.location.origin + inviteLink}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 text-xs rounded text-center"
                  >
                    WhatsApp
                  </a>

                  {/* SMS Share */}
                  <a
                    href={`sms:?body=${encodeURIComponent(
                      `Register here: ${window.location.origin + inviteLink}`,
                    )}`}
                    className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-800 text-xs rounded text-center"
                  >
                    SMS
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This link will allow an employee to register under your business.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 px-6 mt-5">
            already reached employee limit. Update package for more features
          </p>
        )}

        {/* Search */}
        <div className="px-6 py-4">
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-6">
            <ClipLoader size={28} color={"#6366f1"} />
          </div>
        )}

        {/* Employee Cards */}

        <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              onClick={() => handleNavigate(employee.id)}
              className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition duration-200 hover:scale-[1.01] cursor-pointer p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                {/* Left */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Phone:{" "}
                    <span className="text-gray-700">
                      {employee.phone || "No phone"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Team:{" "}
                    <span className="text-gray-700">
                      {employee.sales_team?.name || "Not assigned"}
                    </span>
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={employee.profile_image || defaultProfile}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    className="w-16 h-16 object-cover rounded-full border border-gray-300"
                  />
                  <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-3 py-1 rounded transition">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!filteredEmployees.length && !loading && (
            <div className="col-span-full text-center text-gray-400 mt-6">
              No employees match your search.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <AdminsFooter />
    </div>
  )
}

export default Employee
