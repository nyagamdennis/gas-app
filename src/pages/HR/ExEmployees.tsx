// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../../components/AdminsFooter"
import { ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import defaultProfile from "../../components/media/default.png"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../../features/salesTeam/salesTeamSlice"
import { ClipLoader } from "react-spinners"
import { fetchFiredEmployees, selectAllFiredEmployees } from "../../features/employees/firedEmployeesSlice"

const ExEmployees = () => {
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

  const allEmployees = useAppSelector(selectAllFiredEmployees)
  const allSalesTeams = useAppSelector(selectAllSalesTeam)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (businessId) {
      dispatch(fetchFiredEmployees({ businessId }))
      dispatch(fetchSalesTeam({ businessId }))
    }
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
      <Navbar
        headerMessage={"Ex Employees"}
        headerText={"View, edit, and organize your workforce"}
      />
      <ToastContainer />
      <main className="flex-grow">
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
              {/* <button>Suspend</button>
              <button>Fire</button> */}
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

export default ExEmployees
