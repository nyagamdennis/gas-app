/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import axios from "axios"
import Paper from "@mui/material/Paper"
import profile from "../images/alexander-shatov-niUkImZcSP8-unsplash.jpg"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchProducts,
  selectAllProducts,
} from "../features/product/productSlice"
import Cookies from "cookies-js"
import { assignCylinders, fetchSalesTeamManagement } from "../features/salesTeam/salesTeamManagementSlice"
import getApiUrl from "../getApiUrl"
import RemoveIcon from '@mui/icons-material/Remove';


const apiUrl = getApiUrl()

interface SalesRecord {
  name: string
  kg3: {
    quantity: number
    returned: number
    sold: number
    revenue: number
  }
  kg12: {
    quantity: number
    returned: number
    sold: number
    revenue: number
  }
  kg24: {
    quantity: number
    returned: number
    sold: number
    revenue: number
  }
}
// @ts-ignore
const SalesTableRow = ({ gas, handleUpdate }) => {
  const [newQuantity, setNewQuantity] = useState("");


  return (
    <TableRow key={gas.id}>
      <TableCell>{gas.cylinder.gas_type.name}</TableCell>
      <TableCell align="center">{gas.cylinder.weight.weight}(Kg)</TableCell>
      <TableCell align="center">{gas.assigned_quantity}</TableCell>
      <TableCell align="center">{gas.empties}</TableCell>
      <TableCell align="center">{gas.complete_sale}</TableCell>
      <TableCell align="center">
        <div className=" flex space-x-2">
          <button className=" bg-green-500 text-white px-1 rounded-md">Move</button>
          <button className="bg-blue-800 text-white px-1 rounded-md">Update</button>
          <button className="bg-red-600 text-white px-1 rounded-md">Delete</button>
        </div>

        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(gas.id, newQuantity);
          }}
          className=" flex items-center space-x-2"
        >
          <input
            type="number"
            placeholder="Add Quantity"
            className="outline-none shadow-md px-1 py-1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 px-3 py-1 font-bold text-blue-950"
          >
            Add
          </button>
        </form> */}
      </TableCell>
    </TableRow>
  );
};
// @ts-ignore
// const SalesTable = ({ team, handleUpdate }) => {
//   return (
//     <TableBody>
//       {team.grouped_assigned_cylinders.map((gas: any) => (
//         <SalesTableRow key={gas.id} gas={gas} handleUpdate={handleUpdate} />
//       ))}
//     </TableBody>
//   );
// };
// @ts-ignore
const MakeSales = ({ team }) => {
  const [selectedSalesTeam, setSelectedSalesTeam] = useState("")
  const [selectCylinder, setSelectedCylinder] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const quantityRef = useRef<HTMLInputElement | null>(null)

  const [newQuantity, setNewQuantity] = useState("")

  const dispatch = useAppDispatch()

  const allProducts = useAppSelector(selectAllProducts)

  // const per_sales_team_statistics = team.salesTeam.map((gas:any) =>
  //   console.log("statistics ", gas.cylinder.gas_type.name),
  // )

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Create an object with the form data
      const formData = {
        sales_team: team.id,
        cylinder: selectCylinder,
        assigned_quantity: quantityRef.current?.value,
      }
      const response = await axios.post(
        `${apiUrl}/addassignedcylinder/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      )
      if (response.status === 201 || response.status === 200) {
        setShowAlert(true)


        if (quantityRef.current) {
          quantityRef.current.value = ""
        }
        setTimeout(() => {
          setShowAlert(false)
        }, 5000)

      } else {
        if (response.status === 400) {
          alert("Hello!")
        } else if (response.status === 401) {
        } else {
        }
      }
    } catch (error: any) {
      if (error.response === 401) {
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
        }, 5000)
      } else {
      }

    } finally {
      setIsSubmitting(false)

    }
  }

  const handleSaveClick = async () => {
    // Dispatch the updateStock action instead of calling handleStockUpdate
    dispatch(
      assignCylinders({
        sales_team: team.id,
        cylinder: selectCylinder,
        // @ts-ignore
        assigned_quantity: quantityRef.current?.value,
      }),
    )
    // setIsEditing(false)
  }

  const handleUpdate = async (gasId: number, newQuantity: string) => {

    try {
      const response = await axios.patch(`${apiUrl}/update_assigned_quantity/${gasId}/`,
        { new_quantity: parseInt(newQuantity, 10) },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          }
        })

      if (response.status === 200 || response.status === 201) {

        dispatch(fetchSalesTeamManagement());
        // Update success
      } else {
        // Handle error cases
      }
    } catch (error) {
    }
  }


console.log('Team data ', team)


  return (
    <div className="mt-5 mx-3 bg-slate-600 px-4">
      <h3 className="font-extrabold text-2xl text-center bg-slate-600 font-serif underline">
        Sales Record
      </h3>
      <div className="bg-slate-400 my-2 p-2 flex space-x-2 ">
        <div className="bg-slate-200 p-2">
          <div className="flex items-center flex-col top-0">
            <img
              src={team.profile_image}
              className="w-20 h-20 rounded-lg object-fill mb-2"
              alt={team.name}
            />
            <h5 className="font-extrabold text-green-800">
              {team.name}
              {/* <span className="font-medium text-xs align-super bg-blue-400 px-2 rounded-xl">
                wholesale
              </span> */}
            </h5>
            {/* <h5>
              <LocalPhoneIcon /> +254 700200566
            </h5> */}
          </div>
          <div className=" text-black">
            <div className=" h-36 bg-blue-400 flex flex-col">
              <div className=" px-2 ">
                <h5 className=" text-center font-bold text-white underline">
                  Employees
                </h5>
                {team.employees.map((employee: any, index: any) => (
                  <p key={employee.id} className=" font-semibold text-white flex justify-between items-center">
                    {index + 1}. {employee.first_name} {employee.last_name} +254{" "}
                    {employee.phone} <RemoveIcon className=" cursor-pointer border border-solid" />
                  </p>

                ))}
              </div>
            </div>
            <div>
              <h3>Assign Products</h3>
              <form className=" space-x-2" onSubmit={handleSaveClick}>
                <select
                  className=" outline-none"
                  onChange={(e) => {
                    setSelectedCylinder(e.target.value)
                  }}
                >
                  <option>Select Product</option>
                  {allProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.gas_type.name} {product.weight.weight}(Kg)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="quantity"
                  className=" outline-none px-2"
                  ref={quantityRef}
                  required
                />
                <button className=" bg-gray-950 text-white font-bold px-2 rounded-sm">
                  Assign
                </button>
              </form>
            </div>
            <div>
              <h3>Assign Emplooye</h3>
              <div>

              </div>
            </div>
          </div>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 50 }} stickyHeader aria-label="sales table">
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Product</TableCell>
                  <TableCell align="center">Weight</TableCell>
                  <TableCell align="center">Assigned Quantity</TableCell>
                  <TableCell align="center">Empties</TableCell>
                  <TableCell align="center">Complete Sales</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              {/* <SalesTable team={yourTeamData} handleUpdate={handleUpdate} /> */}
              {/* <SalesTable team={team} handleUpdate={handleUpdate} /> */}

            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

export default MakeSales