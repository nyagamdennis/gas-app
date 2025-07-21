// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import { fetchStore, selectAllStore } from "../features/store/storeSlice"

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"
import planStatus from "../features/planStatus/planStatus"
import api from "../../utils/api"

const CollectCylinders = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const store = useAppSelector(selectAllStore)
  const employees = useAppSelector(selectAllEmployees)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [assignedCylinders, setAssignedCylinders] = useState([])
  const [showStacked, setShowStacked] = useState<boolean>(false)
  const [loadingReturnAll, setLoadingReturnAll] = useState(false)
  const [loadingReturnSome, setLoadingReturnSome] = useState(false)
  const [losses, setLosses] = useState({})
  const [lesses, setLesses] = useState({})
  const [loadingLosses, setLoadingLosses] = useState({})
  const [loadingLossesFilled, setLoadingLossesFilled] = useState({})
  const [loadingLessPay, setLoadingLessPay] = useState({})
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState({})
  const [showEmployeeLessPayDropdown, setShowEmployeeLessPayDropdown] =
    useState({})
  const [showEmployeeFilledDropdown, setShowEmployeeFilledDropdown] = useState(
    {},
  )
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [selectedEmployeeFilled, setSelectedEmployeeFilled] = useState({})
  const [selectedEmployeeLessPay, setSelectedEmployeeLessPay] = useState({})
  const [loading, setloading] = useState(true)

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

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeam({ businessId }))
      dispatch(fetchEmployees({ businessId }))
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (selectedTeam && businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [selectedTeam, businessId, dispatch])

  useEffect(() => {
    if (selectedTeam) {
      api
        .get("/the-assigned-cylinders/", {
          params: { sales_team: selectedTeam.id },
        })
        .then((response) => setAssignedCylinders(response.data))
        .catch((error) =>
          console.error("Error fetching assigned cylinders:", error),
        )
        .finally(() => {
          setloading(false)
        })
    }
  }, [selectedTeam])

  // Handle dropdown toggle
  const handleToggleDropdown = (cylinderId) => {
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  const handleFilledToggleDropdown = (cylinderId) => {
    setShowEmployeeFilledDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  const handleLessPayToggleDropdown = (cylinderId) => {
    setShowEmployeeLessPayDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  // Handle employee selection
  const handleSelectEmployee = (cylinderId, employeeId) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      [cylinderId]: employeeId,
    }))
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [cylinderId]: false,
    }))
  }

  const handleSelectEmployeeFilled = (cylinderId, employeeId) => {
    setSelectedEmployeeFilled((prev) => ({
      ...prev,
      [cylinderId]: employeeId,
    }))
    setShowEmployeeFilledDropdown((prev) => ({
      ...prev,
      [cylinderId]: false,
    }))
  }

  const handleSelectEmployeeLessPay = (cylinderId, employeeId) => {
    setSelectedEmployeeLessPay((prev) => ({
      ...prev,
      [cylinderId]: employeeId,
    }))
    setShowEmployeeLessPayDropdown((prev) => ({
      ...prev,
      [cylinderId]: false,
    }))
  }

  const handleLossChange = (cylinderId, field, value) => {
    setLosses((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleLossFilledChange = (cylinderId, field, value) => {
    setLosses((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleLessPayChange = (cylinderId, field, value) => {
    setLesses((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleSubmitLosses = (cylinderId) => {
    const lossData = losses[cylinderId]
    const employeeId = selectedEmployee[cylinderId]

    if (!lossData) return
    setLoadingLosses((prev) => ({ ...prev, [cylinderId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      losses: [
        {
          cylinder_id: cylinderId,
          filled_lost: lossData.filled_lost,
          empties_lost: lossData.empties_lost,
          employee_id: employeeId,
        },
      ],
    }

    // axios
    //   .post(`${apiUrl}/report-cylinder-losses/`, payload, {
    //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
    //   })
    api
      .post("/report-cylinder-losses/", payload)
      .then((response) => {
        // Update frontend dynamically
        setAssignedCylinders((prev) =>
          prev.map((cylinder) =>
            cylinder.cylinder === cylinderId
              ? {
                  ...cylinder,
                  filled_lost: lossData.filled_lost,
                  empties_lost: lossData.empties_lost,
                }
              : cylinder,
          ),
        )
        setLosses((prev) => ({
          ...prev,
          [cylinderId]: { filled_lost: 0, empties_lost: 0 },
        }))
      })
      .catch((error) =>
        console.error("Error reporting cylinder losses:", error),
      )
      .finally(() =>
        setLoadingLosses((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  const handleSubmitMissingFilled = (cylinderId) => {
    const lossData = losses[cylinderId]
    const employeeId = selectedEmployeeFilled[cylinderId]

    if (!lossData) return
    setLoadingLossesFilled((prev) => ({ ...prev, [cylinderId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      losses: [
        {
          cylinder_id: cylinderId,
          filled_lost: lossData.filled_lost,
          empties_lost: lossData.empties_lost,
          employee_id: employeeId,
        },
      ],
    }

    // axios
    //   .post(`${apiUrl}/report-cylinder-losses/`, payload, {
    //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
    //   })
    api
      .post("/report-cylinder-losses/", payload)
      .then((response) => {
        // Update frontend dynamically
        setAssignedCylinders((prev) =>
          prev.map((cylinder) =>
            cylinder.cylinder === cylinderId
              ? {
                  ...cylinder,
                  filled_lost: lossData.filled_lost,
                  empties_lost: lossData.empties_lost,
                }
              : cylinder,
          ),
        )
        setLosses((prev) => ({
          ...prev,
          [cylinderId]: { filled_lost: 0, empties_lost: 0 },
        }))
      })
      .catch((error) =>
        console.error("Error reporting cylinder losses:", error),
      )
      .finally(() =>
        setLoadingLossesFilled((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  const handleSubmitLessPay = (cylinderId) => {
    const lessData = lesses[cylinderId]
    const employeeId = selectedEmployeeLessPay[cylinderId]
    console.log("less pay employee id ", employeeId)

    if (!lessData) return
    setLoadingLessPay((prev) => ({ ...prev, [cylinderId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      lesses: [
        {
          cylinder_id: cylinderId,
          less_pay: lessData.less_pay,
          employee_id: employeeId,
        },
      ],
    }

    // axios
    //   .post(`${apiUrl}/report-less_pay/`, payload, {
    //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
    //   })
    api
      .post("/report-less_pay/", payload)
      .then((response) => {
        // Update frontend dynamically
        setAssignedCylinders((prev) =>
          prev.map((cylinder) =>
            cylinder.cylinder === cylinderId
              ? { ...cylinder, less_pay: lessData.less_pay }
              : cylinder,
          ),
        )
        setLesses((prev) => ({ ...prev, [cylinderId]: { less_pay: 0 } }))
      })
      .catch((error) =>
        console.error("Error reporting cylinder lesses:", error),
      )
      .finally(() =>
        setLoadingLessPay((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  const handleReturnCylinders = () => {
    setLoadingReturnSome(true)
    const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }))

    // axios
    //   .post(`${apiUrl}/return-assigned-cylinders/`, payload, {
    //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
    //   })
    api
      .post("/return-assigned-cylinders/", payload)
      .then(() =>
        navigate(`/admins/printcollect/${selectedTeam?.id}`, {
          state: { salesTeamName: selectedTeam?.name },
        }),
      )
      .catch((error) => console.error("Error in cylinder Collection.", error))
      .finally(() => setLoadingReturnSome(false))
  }

  const handleReturnAllCylinders = () => {
    setLoadingReturnAll(true)
    const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }))

    // axios
    //   .post(`${apiUrl}/return-all-assigned-cylinders/`, payload, {
    //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
    //   })
    api
      .post("/return-all-assigned-cylinders/", payload)
      .then(() =>
        navigate(`/admins/printallcollect/${selectedTeam?.id}`, {
          state: { salesTeamName: selectedTeam?.name },
        }),
      )
      .catch((error) => console.error("Error in cylinder Collection.", error))
      .finally(() => setLoadingReturnAll(false))
  }

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
  }

  const handleShowStacked = () => {
    setShowStacked(!showStacked)
  }

  const hasCylinders = assignedCylinders.length > 0

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.sales_team && employee.sales_team.id === selectedTeam?.id,
  )

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col ">
      <main className="flex-grow">
        <AdminNav
          headerMessage={"Collect Cylinders"}
          headerText={"Collect cylinders from your retailers or wholesalers"}
        />
        <div className="p-4">
          {!selectedTeam ? (
            <div>
              <h2 className="text-xl font-bold text-center mb-4">
                Select a Sales Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSalesTeam.map((team) => (
                  <div
                    key={team.id}
                    className="bg-white border border-blue-500 text-blue-600 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-blue-50 transition"
                    onClick={() => handleSelectTeam(team)}
                  >
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-sm mt-1">
                      Type: {team.type_of_sales_team?.name || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-center mb-4">
                Collect Cylinders from {selectedTeam.name}
              </h2>
              {!loading ? (
                <>
                  {assignedCylinders.length > 0 ? (
                    <>
                      <div className="w-full overflow-x-auto">
                        <table className="table-auto w-full text-xs md:text-sm border-collapse border border-gray-300 sticky top-0 bg-white z-10">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border px-2 py-1">Gas Type</th>
                              <th className="border px-2 py-1">Weight (kg)</th>
                              <th className="border px-2 py-1">Assigned</th>
                              <th className="border px-2 py-1">Filled</th>
                              <th className="border px-2 py-1">Empties</th>
                              <th className="border px-2 py-1">Spoiled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedCylinders.map((cylinder) => (
                              <tr key={cylinder.id} className="text-center">
                                <td className="border px-2 py-1">
                                  {cylinder.gas_type}
                                </td>
                                <td className="border px-2 py-1">
                                  {cylinder.weight}
                                </td>
                                <td className="border px-2 py-1">
                                  {cylinder.assigned_quantity}
                                </td>
                                <td className="border px-2 py-1 whitespace-nowrap">
                                  {cylinder.filled}
                                  {cylinder.filled_lost > 0 && (
                                    <span className="text-red-500 ml-2 font-bold">
                                      - {cylinder.filled_lost}
                                    </span>
                                  )}
                                  {cylinder.less_pay > 0 && (
                                    <span className="text-green-800 ml-2 font-bold">
                                      - {cylinder.less_pay}
                                    </span>
                                  )}
                                </td>
                                <td className="border px-2 py-1 whitespace-nowrap">
                                  {cylinder.empties}
                                  {cylinder.empties_lost > 0 && (
                                    <span className="text-red-500 ml-2 font-bold">
                                      - {cylinder.empties_lost}
                                    </span>
                                  )}
                                  {cylinder.less_pay > 0 && (
                                    <span className="text-green-800 ml-2 font-bold">
                                      + {cylinder.less_pay}
                                    </span>
                                  )}
                                </td>
                                <td className="border px-2 py-1">
                                  {cylinder.spoiled}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="bg-blue-400 mt-3 flex items-center text-white px-2 rounded-md "
                          onClick={handleShowStacked}
                        >
                          Details
                          {showStacked ? (
                            <ArrowDropUpIcon />
                          ) : (
                            <ArrowDropDownIcon />
                          )}
                        </button>
                      </div>

                      {showStacked && (
                        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                          {assignedCylinders.map((cylinder) => (
                            <div
                              key={cylinder.id}
                              className="bg-white border border-gray-300 rounded-lg shadow-md p-4"
                            >
                              <h3 className="text-lg font-bold text-blue</p>-600 mb-2">
                                {cylinder.gas_type}
                              </h3>
                              <p className="text-sm text-gray-700">
                                Weight: {cylinder.weight} kg
                              </p>
                              <p className="text-sm text-gray-700">
                                Assigned: {cylinder.assigned_quantity}
                              </p>
                              <p className="text-sm text-gray-700">
                                Filled: {cylinder.filled}
                              </p>
                              <p className="text-sm text-gray-700">
                                Empties: {cylinder.empties}
                              </p>
                              <p className="text-sm text-gray-700">
                                Filled lost: {cylinder.filled_lost}
                              </p>
                              <p className="text-sm text-gray-700">
                                Empties lost: {cylinder.empties_lost}
                              </p>
                              <p className="text-sm text-gray-700">
                                Less pay: {cylinder.less_pay}
                              </p>
                              <p className="text-sm text-gray-700">
                                Complete Sale(wholesale):{" "}
                                {cylinder.wholesale_sold}
                              </p>
                              <p className="text-sm text-gray-700">
                                Complete Sale(retail): {cylinder.retail_sold}
                              </p>
                              <p className="text-sm text-gray-700">
                                Spoiled: {cylinder.spoiled}
                              </p>

                              <div className="mt-4 grid grid-cols-2 gap-2">
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    // handleSubmitLosses(cylinder.cylinder);
                                    e.preventDefault()
                                    if (
                                      selectedEmployee[cylinder.cylinder] &&
                                      losses[cylinder.cylinder]?.empties_lost >
                                        0
                                    ) {
                                      handleSubmitLosses(cylinder.cylinder)
                                    }
                                  }}
                                >
                                  <label className="block text-sm font-semibold">
                                    Missing Empties
                                    {selectedEmployee[cylinder.cylinder] && (
                                      <span className="text-blue-600">
                                        {" "}
                                        (
                                        {
                                          filteredEmployees.find(
                                            (emp) =>
                                              emp.id ===
                                              selectedEmployee[
                                                cylinder.cylinder
                                              ],
                                          )?.first_name
                                        }
                                        )
                                      </span>
                                    )}
                                  </label>
                                  <div className=" flex items-center">
                                    <input
                                      type="number"
                                      min={0}
                                      max={cylinder.empties}
                                      className="w-full p-1 border rounded-md"
                                      placeholder="Enter amount"
                                      value={
                                        losses[cylinder.cylinder]
                                          ?.empties_lost || ""
                                      }
                                      onChange={(e) =>
                                        handleLossChange(
                                          cylinder.cylinder,
                                          "empties_lost",
                                          e.target.value,
                                        )
                                      }
                                    />
                                    <KeyboardArrowDownIcon
                                      onClick={() =>
                                        handleToggleDropdown(cylinder.cylinder)
                                      }
                                      className="cursor-pointer"
                                    />
                                    {showEmployeeDropdown[
                                      cylinder.cylinder
                                    ] && (
                                      <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                                        {filteredEmployees.map((employee) => (
                                          <div
                                            key={employee.id}
                                            className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                              selectedEmployee[
                                                cylinder.cylinder
                                              ] === employee.id
                                                ? "bg-gray-200"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleSelectEmployee(
                                                cylinder.cylinder,
                                                employee.id,
                                              )
                                            }
                                          >
                                            {employee.first_name}{" "}
                                            {employee.last_name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="submit"
                                    className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                                      loadingLosses[cylinder.cylinder]
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    // disabled={loadingLosses[cylinder.cylinder]}
                                    disabled={
                                      !selectedEmployee[cylinder.cylinder] ||
                                      !losses[cylinder.cylinder]
                                        ?.empties_lost ||
                                      loadingLosses[cylinder.cylinder]
                                    }
                                  >
                                    {loadingLosses[cylinder.cylinder]
                                      ? "Processing..."
                                      : "Add"}
                                  </button>
                                </form>

                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmitMissingFilled(cylinder.cylinder)
                                  }}
                                >
                                  <label className="block text-sm font-semibold">
                                    Missing Filled
                                    {selectedEmployeeFilled[
                                      cylinder.cylinder
                                    ] && (
                                      <span className="text-blue-600">
                                        {" "}
                                        (
                                        {
                                          filteredEmployees.find(
                                            (emp) =>
                                              emp.id ===
                                              selectedEmployeeFilled[
                                                cylinder.cylinder
                                              ],
                                          )?.first_name
                                        }
                                        )
                                      </span>
                                    )}
                                  </label>
                                  <div className=" flex items-center">
                                    <input
                                      type="number"
                                      min={0}
                                      max={cylinder.filled}
                                      className="w-full p-1 border rounded-md"
                                      placeholder="Enter amount"
                                      value={
                                        losses[cylinder.cylinder]
                                          ?.filled_lost || ""
                                      }
                                      onChange={(e) =>
                                        handleLossFilledChange(
                                          cylinder.cylinder,
                                          "filled_lost",
                                          e.target.value,
                                        )
                                      }
                                    />
                                    <KeyboardArrowDownIcon
                                      onClick={() =>
                                        handleFilledToggleDropdown(
                                          cylinder.cylinder,
                                        )
                                      }
                                      className="cursor-pointer"
                                    />
                                    {showEmployeeFilledDropdown[
                                      cylinder.cylinder
                                    ] && (
                                      <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                                        {filteredEmployees.map((employee) => (
                                          <div
                                            key={employee.id}
                                            className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                              selectedEmployeeFilled[
                                                cylinder.cylinder
                                              ] === employee.id
                                                ? "bg-gray-200"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleSelectEmployeeFilled(
                                                cylinder.cylinder,
                                                employee.id,
                                              )
                                            }
                                          >
                                            {employee.first_name}{" "}
                                            {employee.last_name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="submit"
                                    className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                                      loadingLossesFilled[cylinder.cylinder]
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    disabled={
                                      loadingLossesFilled[cylinder.cylinder]
                                    }
                                  >
                                    {loadingLossesFilled[cylinder.cylinder]
                                      ? "Processing..."
                                      : "Add"}
                                  </button>
                                </form>

                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmitLessPay(cylinder.cylinder)
                                  }}
                                >
                                  <label className="block text-sm font-semibold">
                                    Less Payment
                                    {selectedEmployeeLessPay[
                                      cylinder.cylinder
                                    ] && (
                                      <span className="text-blue-600">
                                        {" "}
                                        (
                                        {
                                          filteredEmployees.find(
                                            (emp) =>
                                              emp.id ===
                                              selectedEmployeeLessPay[
                                                cylinder.cylinder
                                              ],
                                          )?.first_name
                                        }
                                        )
                                      </span>
                                    )}
                                  </label>
                                  <div className=" flex items-center">
                                    <input
                                      type="number"
                                      min={0}
                                      max={cylinder.filled + cylinder.empties}
                                      className="w-full p-1 border rounded-md"
                                      placeholder="Enter amount"
                                      value={
                                        lesses[cylinder.cylinder]?.less_pay ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleLessPayChange(
                                          cylinder.cylinder,
                                          "less_pay",
                                          e.target.value,
                                        )
                                      }
                                      required
                                    />
                                    <KeyboardArrowDownIcon
                                      onClick={() =>
                                        handleLessPayToggleDropdown(
                                          cylinder.cylinder,
                                        )
                                      }
                                      className="cursor-pointer"
                                    />
                                    {showEmployeeLessPayDropdown[
                                      cylinder.cylinder
                                    ] && (
                                      <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                                        {filteredEmployees.map((employee) => (
                                          <div
                                            key={employee.id}
                                            className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                              selectedEmployeeLessPay[
                                                cylinder.cylinder
                                              ] === employee.id
                                                ? "bg-gray-200"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleSelectEmployeeLessPay(
                                                cylinder.cylinder,
                                                employee.id,
                                              )
                                            }
                                          >
                                            {employee.first_name}{" "}
                                            {employee.last_name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="submit"
                                    className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                                      loadingLessPay[cylinder.cylinder]
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    disabled={loadingLessPay[cylinder.cylinder]}
                                  >
                                    {loadingLessPay[cylinder.cylinder]
                                      ? "Processing..."
                                      : "Add"}
                                  </button>
                                </form>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 text-center flex flex-col space-y-2">
                        <button
                          className={`bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow ${
                            loadingReturnAll
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-red-600"
                          } transition`}
                          onClick={handleReturnAllCylinders}
                          disabled={loadingReturnAll}
                        >
                          {loadingReturnAll
                            ? "Processing..."
                            : "Return all Cylinders"}
                        </button>
                        <button
                          className={`bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow ${
                            loadingReturnSome
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-red-600"
                          } transition`}
                          onClick={handleReturnCylinders}
                          disabled={loadingReturnSome}
                        >
                          {loadingReturnSome
                            ? "Processing..."
                            : "Return empty & spoiled Cylinders"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-center mt-4 text-gray-600">
                      No data available for assigned cylinders.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className=" bottom-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default CollectCylinders
