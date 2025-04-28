// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  fetchAssignedCylinders,
  getAssignsError,
  getAssignsStatus,
  selectAllAssigns,
} from "../features/assigns/assignsSlice"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchCollectedCylinders,
  selectAllCollections,
} from "../features/collections/collectionsSlice"
import getApiUrl from "../getApiUrl"
import axios from "axios"
import Cookies from "cookies-js"
import CircularProgress from "@mui/material/CircularProgress"

const AfterCollectionAll = () => {
  const [printComplete, setPrintComplete] = useState(false)
  const salesTeamId = useParams()
  const dispatch = useAppDispatch()
  const cylinders = useAppSelector(selectAllCollections)
  const cylinderError = useAppSelector(getAssignsError)
  const cylinderStatus = useAppSelector(getAssignsStatus)
  const { state } = useLocation() // Get the state object passed via navigate
  const salesTeamName = state?.salesTeamName
  const [isSaving, setIsSaving] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    // Fetch all assigned cylinders (optionally filter by sales team)
    dispatch(fetchCollectedCylinders(salesTeamId?.id))
  }, [dispatch])

  const apiUrl = getApiUrl()
  console.log("all collections ", cylinders)

  const navigate = useNavigate()

  const handlePrint = async () => {
    if (!printComplete) {
      setPrintComplete(true)
      try {
        await axios.post(
          `${apiUrl}/mark-print-return-complete/`,
          { sales_team_id: salesTeamId?.id },
          {
            headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
          },
        )
        setIsPrinting(false)
        setPrintComplete(true)
      } catch (error) {
        setPrintComplete(false)
        alert("Error printing, try again.")
      }
      // .then(() => setPrintComplete(true))
      //     .catch(err => console.error("Error marking print complete:", err));
    } else {
      alert("Print already completed. No need to reprint.")
    }
    if (window.AndroidBridge && window.AndroidBridge.printText) {
      const currentDate = new Date().toLocaleDateString()

      let printContent = "\n\n" // Whitespace at the top
      printContent += `All Cylinders Returns:   ${salesTeamName}\n`
      printContent += `Date: ${currentDate}\n`
      printContent += "********************************\n"

      // Function to add section if there is data
      const addSection = (title, filterCondition) => {
        const filteredCylinders = cylinders.filter(filterCondition)
        if (filteredCylinders.length > 0) {
          printContent += `\n--------------------------------\n`
          printContent += `\n${title}\n`
          printContent += "--------------------------------\n"
          printContent += "Cylinder   Weight(kg)    Qty\n"
          printContent += "--------------------------------\n"
          filteredCylinders.forEach((cylinder) => {
            printContent += `${cylinder.gas_type.padEnd(
              10,
            )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.empties
              .toString()
              .padStart(10)}\n`
          })
        }
      }

      // Add sections only if they contain data
      addSection("Empty Cylinders", (cylinder) => cylinder.empties > 0)

      addSection("Filled Cylinders", (cylinder) => cylinder.filled > 0)
      addSection("Spoiled Cylinders", (cylinder) => cylinder.spoiled > 0)
      addSection(
        "Lost Filled Cylinders",
        (cylinder) => cylinder.filled_lost > 0,
      )
      addSection("Less Pay Cylinders", (cylinder) => cylinder.less_pay > 0)

      // Footer information
      printContent += "\n--------------------------------\n"
      printContent += "\n\nGoods Collected by: \n"
      printContent += "_________________________\n"
      printContent += "Signature: \n"
      printContent += "_________________________\n"
      printContent += "\n\nGoods dispatched by: \n"
      printContent += "_________________________\n"
      printContent += "Signature: \n"
      printContent += "_________________________\n"
      printContent += "\n\n\n\n\n" // Whitespace at the bottom

      // Call the native print method
      window.AndroidBridge.printText(printContent)
    } else {
      alert("AndroidBridge is not available")
    }
  }

  const handleSave = async () => {
    if (!printComplete) {
      setIsSaving(true)
      try {
        await axios.post(
          `${apiUrl}/mark-print-return-complete/`,
          { sales_team_id: salesTeamId?.id },
          {
            headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
          },
        )
        setIsSaving(false)
        setPrintComplete(true)
      } catch (error) {
        setIsSaving(false)
        alert("error saving try again.")
      }
    } else {
      alert("Already saved. No need to save again.")
    }
  }

  const handleGeneratePDF = () => {
    alert("Generate PDF functionality can be added here.")
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-center font-bold text-green-950 underline">
        Empty and Spoiled Cylinders Returns.
      </h2>

      {/*  */}
      {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
      {cylinders &&
        cylinders.length > 0 &&
        cylinders.some((cylinder) => cylinder.empties > 0) && (
          <div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Empty Cylinders.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Cylinder Name</th>
                  <th className="border px-4 py-2">Weight (kg)</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cylinders
                  .filter((cylinder) => cylinder.empties > 0)
                  .map((cylinder) => (
                    <tr key={cylinder.id}>
                      <td className="border px-4 py-2">{cylinder.gas_type}</td>
                      <td className="border px-4 py-2">{cylinder.weight}</td>
                      <td className="border px-4 py-2">{cylinder.empties}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

      {/* filled cylinders */}
      {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
      {cylinders &&
        cylinders.length > 0 &&
        cylinders.some((cylinder) => cylinder.filled > 0) && (
          <div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Filled Cylinders.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Cylinder Name</th>
                  <th className="border px-4 py-2">Weight (kg)</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cylinders
                  .filter((cylinder) => cylinder.filled > 0)
                  .map((cylinder) => (
                    <tr key={cylinder.id}>
                      <td className="border px-4 py-2">{cylinder.gas_type}</td>
                      <td className="border px-4 py-2">{cylinder.weight}</td>
                      <td className="border px-4 py-2">{cylinder.filled}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

      {/* spoiled cylinders */}
      {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
      {cylinders &&
        cylinders.length > 0 &&
        cylinders.some((cylinder) => cylinder.spoiled > 0) && (
          <div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Spoiled Cylinders.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Cylinder Name</th>
                  <th className="border px-4 py-2">Weight (kg)</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cylinders
                  .filter((cylinder) => cylinder.spoiled > 0)
                  .map((cylinder) => (
                    <tr key={cylinder.id}>
                      <td className="border px-4 py-2">{cylinder.gas_type}</td>
                      <td className="border px-4 py-2">{cylinder.weight}</td>
                      <td className="border px-4 py-2">{cylinder.spoiled}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

      {/* lost filled cylinders */}
      {/* cylinders && cylinders.length > 0 && cylinders.some(cylinder => cylinder.filled_lost > 0) */}
      {cylinders &&
        cylinders.length > 0 &&
        cylinders.some((cylinder) => cylinder.filled_lost > 0) && (
          <div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Lost Filled Cylinders.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Cylinder Name</th>
                  <th className="border px-4 py-2">Weight (kg)</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cylinders
                  .filter((cylinder) => cylinder.filled_lost > 0)
                  .map((cylinder) => (
                    <tr key={cylinder.id}>
                      <td className="border px-4 py-2">{cylinder.gas_type}</td>
                      <td className="border px-4 py-2">{cylinder.weight}</td>
                      <td className="border px-4 py-2">
                        {cylinder.filled_lost}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

      {/* lost empties */}
      {cylinders &&
        cylinders.length > 0 &&
        cylinders.some((cylinder) => cylinder.empties_lost > 0) && (
          <div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Lost Empty Cylinders.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Cylinder Name</th>
                  <th className="border px-4 py-2">Weight (kg)</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cylinders
                  .filter((cylinder) => cylinder.empties_lost > 0)
                  .map((cylinder) => (
                    <tr key={cylinder.id}>
                      <td className="border px-4 py-2">{cylinder.gas_type}</td>
                      <td className="border px-4 py-2">{cylinder.weight}</td>
                      <td className="border px-4 py-2">
                        {cylinder.empties_lost}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

      {/* less pay */}
      {cylinders &&
        cylinders.length > 0 &&
        cylinders.some((cylinder) => cylinder.less_pay > 0) && (
          <div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Less Pay Cylinders.</p>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Cylinder Name</th>
                  <th className="border px-4 py-2">Weight (kg)</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cylinders
                  .filter((cylinder) => cylinder.less_pay > 0)
                  .map((cylinder) => (
                    <tr key={cylinder.id}>
                      <td className="border px-4 py-2">{cylinder.gas_type}</td>
                      <td className="border px-4 py-2">{cylinder.weight}</td>
                      <td className="border px-4 py-2">{cylinder.less_pay}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

      <div className="mt-6 flex justify-center gap-4 ">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
          onClick={handlePrint}
          disabled={isPrinting}
        >
          {isPrinting ? <CircularProgress /> : "print"}
        </button>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <CircularProgress /> : "Save"}
        </button>
      </div>
    </div>
  )
}

export default AfterCollectionAll
