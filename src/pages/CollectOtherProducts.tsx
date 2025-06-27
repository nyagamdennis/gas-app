// @ts-nocheck
import React, { useEffect, useState } from 'react'
import AdminNav from '../components/ui/AdminNav'
import planStatus from '../features/planStatus/planStatus'
import { fetchSalesTeam, selectAllSalesTeam } from '../features/salesTeam/salesTeamSlice'
import { fetchStore } from '../features/store/storeSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import AdminsFooter from '../components/AdminsFooter'
import api from '../../utils/api'
import { fetchEmployees, selectAllEmployees } from '../features/employees/employeesSlice'

const CollectOtherProducts = () => {
      const [selectedTeam, setSelectedTeam] = useState(null)
      const dispatch = useAppDispatch()
      const allSalesTeam = useAppSelector(selectAllSalesTeam)
      const employees = useAppSelector(selectAllEmployees)
      const [showStacked, setShowStacked] = useState<boolean>(false)
      const [loadingReturnAll, setLoadingReturnAll] = useState(false)
      const [loadingReturnSome, setLoadingReturnSome] = useState(false)
      const [assignedProducts, setAssignedProducts] = useState([])
      console.log("Assigned Products:", assignedProducts)
      const [selectedEmployee, setSelectedEmployee] = useState({})
      const [selectedEmployeeFilled, setSelectedEmployeeFilled] = useState({})
      const [selectedEmployeeLessPay, setSelectedEmployeeLessPay] = useState({})
      const [losses, setLosses] = useState({})
      const [lesses, setLesses] = useState({})
      const [showEmployeeDropdown, setShowEmployeeDropdown] = useState({})
      const [loadingLosses, setLoadingLosses] = useState({})
      const [showEmployeeFilledDropdown, setShowEmployeeFilledDropdown] = useState({},)
      const [loadingLossesFilled, setLoadingLossesFilled] = useState({})
      const [showEmployeeLessPayDropdown, setShowEmployeeLessPayDropdown] = useState({})
      const [loadingLessPay, setLoadingLessPay] = useState({})
      


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
              dispatch(fetchSalesTeam({ businessId }));
              dispatch(fetchEmployees({ businessId }))
            }
          }, [dispatch, businessId])
        
          
          useEffect(() => {
            if (selectedTeam && businessId) {
              dispatch(fetchStore({ businessId }))
            }
          }, [selectedTeam, businessId, dispatch])
      
    

            const hasProducts = assignedProducts.length > 0

            useEffect(() => {
    if (selectedTeam) {
      
      api.get("/the-assigned-products/", {params:{sales_team:selectedTeam.id}})
        .then((response) => setAssignedProducts(response.data))
        .catch((error) =>
          console.error("Error fetching assigned products:", error),
        )
    }
  }, [selectedTeam])



    const handleSelectTeam = (team) => {
    setSelectedTeam(team)
  }

  const handleShowStacked = () => {
    setShowStacked(!showStacked)
  }


   const handleReturnAllCylinders = () => {
      setLoadingReturnAll(true)
      const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }))
  
      // axios
      //   .post(`${apiUrl}/return-all-assigned-cylinders/`, payload, {
      //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      //   })
      api.post("/return-all-assigned-cylinders/", payload)
        .then(() =>
          navigate(`/admins/printallcollect/${selectedTeam?.id}`, {
            state: { salesTeamName: selectedTeam?.name },
          }),
        )
        .catch((error) => console.error("Error in cylinder Collection.", error))
        .finally(() => setLoadingReturnAll(false))
    }
  

    const handleReturnCylinders = () => {
    setLoadingReturnSome(true)
    const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }))

    // axios
    //   .post(`${apiUrl}/return-assigned-cylinders/`, payload, {
    //     headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
    //   })
    api.post("/return-assigned-cylinders/", payload)
      .then(() =>
        navigate(`/admins/printcollect/${selectedTeam?.id}`, {
          state: { salesTeamName: selectedTeam?.name },
        }),
      )
      .catch((error) => console.error("Error in cylinder Collection.", error))
      .finally(() => setLoadingReturnSome(false))
  }


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


  const handleToggleDropdown = (cylinderId) => {
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

const filteredEmployees = employees.filter(
    (employee) =>
      employee.sales_team && employee.sales_team.id === selectedTeam?.id,
  )

  return (
     <div className="bg-gray-100 min-h-screen flex flex-col ">
      <main className="flex-grow">
      <AdminNav headerMessage={"Collect Cylinders"} headerText={"Collect cylinders from your retailers or wholesalers"}  />
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
            Other products from {selectedTeam.name}
          </h2>

          {hasProducts ? (
            <>
                <div className="w-full overflow-x-auto">
                <table className="table-auto w-full text-xs md:text-sm border-collapse border border-gray-300 sticky top-0 bg-white z-10">
                  <thead>
                  <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Product name</th>
                  <th className="border px-2 py-1">Assigned quantity</th>
                  <th className="border px-2 py-1">Retail Sold</th>
                  <th className="border px-2 py-1">Wholesale Sold</th>
                  <th className="border px-2 py-1">Lost</th>
                  <th className="border px-2 py-1">Spoiled</th>
                  </tr>
                  </thead>
                  <tbody>
                  {assignedProducts.map((product) => (
                  <tr key={product.id} className="text-center">
                  <td className="border px-2 py-1">
                    {product?.product?.name}
                  </td>
                  <td className="border px-2 py-1">{product?.assigned_quantity}</td>
                  <td className="border px-2 py-1">
                    {product.assigned_quantity}
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    {product.retail_sold}
                    {product.retail_sold > 0 && (
                    <span className="text-red-500 ml-2 font-bold">
                    - {product.retail_sold}
                    </span>
                    )}
                    {product.less_pay > 0 && (
                    <span className="text-green-800 ml-2 font-bold">
                    - {product.less_pay}
                    </span>
                    )}
                  </td>
                  
                  <td className="border px-2 py-1">{product.spoiled}</td>
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
                  {showStacked ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </button>
              </div>

              {showStacked && (
                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                  {assignedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-300 rounded-lg shadow-md p-4"
                    >
                      <h3 className="text-lg font-bold text-blue</p>-600 mb-2">
                        {product.gas_type}
                      </h3>
                      <p className="text-sm text-gray-700">
                        Product name: {product.product?.name} kg
                      </p>
                      <p className="text-sm text-gray-700">
                        Assigned: {product.assigned_quantity}
                      </p>
                      <p className="text-sm text-gray-700">
                        Retail sold: {product.retail_sold}
                      </p>
                      <p className="text-sm text-gray-700">
                        wholesale sold: {product.wholesale_sold}
                      </p>
                      <p className="text-sm text-gray-700">
                        Lost: {product.missing_products}
                      </p>
                      <p className="text-sm text-gray-700">
                        Spoiled: {product.spoiled}
                      </p>
                      <p className="text-sm text-gray-700">
                        Less pay: {product.less_pay}
                      </p>
                      

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            // handleSubmitLosses(product.product);
                            if (
                              selectedEmployee[product.product] &&
                              losses[product.product]?.empties_lost > 0
                            ) {
                              handleSubmitLosses(product.product)
                            }
                          }}
                        >
                          <label className="block text-sm font-semibold">
                            Missing products
                            {selectedEmployee[product.missing_products] && (
                              <span className="text-blue-600">
                                {" "}
                                (
                                {
                                  filteredEmployees.find(
                                    (emp) =>
                                      emp.id ===
                                      selectedEmployee[product.product],
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
                              max={product.empties}
                              className="w-full p-1 border rounded-md"
                              placeholder="Enter amount"
                              value={
                                losses[product.product]?.empties_lost || ""
                              }
                              onChange={(e) =>
                                handleLossChange(
                                  product.product,
                                  "empties_lost",
                                  e.target.value,
                                )
                              }
                            />
                            <KeyboardArrowDownIcon
                              onClick={() =>
                                handleToggleDropdown(product.product)
                              }
                              className="cursor-pointer"
                            />
                            {showEmployeeDropdown[product.product] && (
                              <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                                {filteredEmployees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                      selectedEmployee[product.product] ===
                                      employee.id
                                        ? "bg-gray-200"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectEmployee(
                                        product.product,
                                        employee.id,
                                      )
                                    }
                                  >
                                    {employee.first_name} {employee.last_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                              loadingLosses[product.product]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            // disabled={loadingLosses[product.product]}
                            disabled={
                              !selectedEmployee[product.product] ||
                              !losses[product.product]?.empties_lost ||
                              loadingLosses[product.product]
                            }
                          >
                            {loadingLosses[product.product]
                              ? "Processing..."
                              : "Add"}
                          </button>
                        </form>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmitMissingFilled(product.product)
                          }}
                        >
                          <label className="block text-sm font-semibold">
                            Missing Filled
                            {selectedEmployeeFilled[product.product] && (
                              <span className="text-blue-600">
                                {" "}
                                (
                                {
                                  filteredEmployees.find(
                                    (emp) =>
                                      emp.id ===
                                      selectedEmployeeFilled[product.product],
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
                              max={product.filled}
                              className="w-full p-1 border rounded-md"
                              placeholder="Enter amount"
                              value={
                                losses[product.product]?.filled_lost || ""
                              }
                              onChange={(e) =>
                                handleLossFilledChange(
                                  product.product,
                                  "filled_lost",
                                  e.target.value,
                                )
                              }
                            />
                            <KeyboardArrowDownIcon
                              onClick={() =>
                                handleFilledToggleDropdown(product.product)
                              }
                              className="cursor-pointer"
                            />
                            {showEmployeeFilledDropdown[product.product] && (
                              <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                                {filteredEmployees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                      selectedEmployeeFilled[
                                        product.product
                                      ] === employee.id
                                        ? "bg-gray-200"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectEmployeeFilled(
                                        product.product,
                                        employee.id,
                                      )
                                    }
                                  >
                                    {employee.first_name} {employee.last_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                              loadingLossesFilled[product.product]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={loadingLossesFilled[product.product]}
                          >
                            {loadingLossesFilled[product.product]
                              ? "Processing..."
                              : "Add"}
                          </button>
                        </form>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmitLessPay(product.product)
                          }}
                        >
                          <label className="block text-sm font-semibold">
                            Less Payment
                            {selectedEmployeeLessPay[product.product] && (
                              <span className="text-blue-600">
                                {" "}
                                (
                                {
                                  filteredEmployees.find(
                                    (emp) =>
                                      emp.id ===
                                      selectedEmployeeLessPay[
                                        product.product
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
                              max={product.filled + product.empties}
                              className="w-full p-1 border rounded-md"
                              placeholder="Enter amount"
                              value={lesses[product.product]?.less_pay || ""}
                              onChange={(e) =>
                                handleLessPayChange(
                                  product.product,
                                  "less_pay",
                                  e.target.value,
                                )
                              }
                              required
                            />
                            <KeyboardArrowDownIcon
                              onClick={() =>
                                handleLessPayToggleDropdown(product.product)
                              }
                              className="cursor-pointer"
                            />
                            {showEmployeeLessPayDropdown[product.product] && (
                              <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                                {filteredEmployees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                      selectedEmployeeLessPay[
                                        product.product
                                      ] === employee.id
                                        ? "bg-gray-200"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectEmployeeLessPay(
                                        product.product,
                                        employee.id,
                                      )
                                    }
                                  >
                                    {employee.first_name} {employee.last_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            type="submit"
                            className={`mt-2 w-full bg-green-500 text-white py-1 rounded ${
                              loadingLessPay[product.product]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={loadingLessPay[product.product]}
                          >
                            {loadingLessPay[product.product]
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
                  {loadingReturnAll ? "Processing..." : "Return all Products"}
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
                    : "Return spoiled "}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center mt-4 text-gray-600">
              No data available for assigned products.
            </p>
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

export default CollectOtherProducts