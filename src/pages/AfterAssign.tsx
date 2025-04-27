// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchAssignedCylinders,
  getAssignsError,
  getAssignsStatus,
  selectAllAssigns,
} from "../features/assigns/assignsSlice"
import getApiUrl from "../getApiUrl"
import axios from "axios"
import Cookies from "cookies-js";
import CircularProgress from '@mui/material/CircularProgress';

const AfterAssign = () => {
  const salesTeamId = useParams()
  const dispatch = useAppDispatch()
  const cylinders = useAppSelector(selectAllAssigns)
  const cylinderError = useAppSelector(getAssignsError)
  const cylinderStatus = useAppSelector(getAssignsStatus)
  const { state } = useLocation() // Get the state object passed via navigate
  const [printComplete, setPrintComplete] = useState(false)
  const salesTeamName = state?.salesTeamName
  const navigate = useNavigate()
  const [savingReciept, setSavingReciept] = useState(false);

  useEffect(() => {
    dispatch(fetchAssignedCylinders(salesTeamId?.id))
  }, [dispatch])

  const apiUrl = getApiUrl()

  const handlePrint = () => {
    // if (!printComplete) {
    axios
      .post(
        `${apiUrl}/mark-print-complete/`,
        { sales_team_id: salesTeamId?.id },
        { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } },
      )
      .then(() => setPrintComplete(true))
      .catch((err) => console.error("Error marking print complete:", err))
    // } else {
    //     alert("Print already completed. No need to reprint.");
    // }

    if (window.AndroidBridge && window.AndroidBridge.printText) {
      const currentDate = new Date().toLocaleDateString()

      let printContent = "\n\n" // Whitespace at the top
      printContent += `Assigned Cylinders:   ${salesTeamName}\n`
      printContent += `Date: ${currentDate}\n`
      printContent += "********************************\n"
      printContent += "Cylinder   Weight(kg)    Qty\n" // Table header
      printContent += "--------------------------------\n"

      cylinders.forEach((cylinder) => {
        printContent += `${cylinder.gas_type.padEnd(
          10,
        )}${`${cylinder.weight}kg`.padStart(10)}${cylinder.assigned_quantity
          .toString()
          .padStart(10)}\n`
      })

      printContent +=
        "\n\nGoods delivered by: \n_________________________\nSignature: \n_________________________\n\n\n"
      printContent +=
        "\n\nGoods received by: \n_________________________\nSignature: \n_________________________\n"

      printContent += "\n\n"
      printContent += "\n\n"
      // printContent += '\n\n';

      window.AndroidBridge.printText(printContent)

      // Mark print as complete in the backend
    } else {
      alert("Printer is not available, but reciept is saved.")
    }
  }

  const handleSaveReciet = async () => {
  setSavingReciept(true); // Start loader
  try {
    const response = await axios.post(
    `${apiUrl}/mark-print-complete/`,
    { sales_team_id: salesTeamId?.id },
    { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } }
    );
    if (response.status === 200) {
    alert("Receipt saved successfully.");
    } else {
    alert("Failed to save receipt. Please try again.");
    }
  } catch (error) {
    console.error("Error saving receipt:", error);
    alert("An error occurred while saving the receipt.");
  } finally {
    setSavingReciept(false); // Stop loader
  }
    // axios
    //   .post(
    //     `${apiUrl}/mark-print-complete/`,
    //     { sales_team_id: salesTeamId?.id },
    //     { headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` } },
    //   )
    //   .then(() => setPrintComplete(true))
    //   .catch((err) => console.error("Error marking print complete:", err))
  }

  const handleGeneratePDF = () => {
    alert("Generate PDF functionality can be added here.")
  }

  const handleNavigateToEdit = () => {
    navigate(`/admins/editassigned/${salesTeamId?.id}`, {
      state: { salesTeamName },
    })
  }


  return (
    <div className="min-h-screen bg-white p-4">
      <div>
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">Assigned Cylinders Report</p>
        </div>

        <div className="overflow-x-auto"></div>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-2">Cylinder Name</th>
              <th className="border px-2 py-2">Weight (kg)</th>
              <th className="border px-2 py-2">Assigned Quantity</th>
              <th className="border px-2 py-2">Date Assigned</th>
            </tr>
          </thead>
          <tbody>
            {cylinders.map((cylinder) => (
              <tr key={cylinder.id}>
                <td className="border px-2 py-2">{cylinder.gas_type}</td>
                <td className="border px-2 py-2">{cylinder.weight}</td>
                <td className="border px-2 py-2">{cylinder.assigned_quantity}</td>
                <td className="border px-2 py-2">
                  {new Date(cylinder.date_assigned).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex flex-col gap-4 items-center">
          <button
            className="w-full max-w-xs bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
            onClick={handlePrint}
          >
            Print & Save
          </button>
            <button
            className={`w-full max-w-xs px-6 py-2 rounded shadow text-white ${
              savingReciept ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleSaveReciet}
            disabled={savingReciept}
            >
            {savingReciept ? <CircularProgress size={20} className="mr-2" /> : null}
            {savingReciept ? "Saving..." : "Save"}
            </button>
          <button
            className="w-full max-w-xs bg-yellow-500 text-white px-6 py-2 rounded shadow hover:bg-yellow-600"
            onClick={handleNavigateToEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default AfterAssign
