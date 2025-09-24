// @ts-nocheck
import React, { useEffect, useState } from "react"
import Login from "../components/Login"
import { selectIsAuthenticated } from "../features/auths/authSlice"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addSalesTeam,
  deleteSalesTeam,
  fetchSalesTeam,
  selectAllSalesTeam,
  updateSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import AdminsFooter from "../components/AdminsFooter"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CircularProgress from "@mui/material/CircularProgress"
import defaultPic from "../images/shop.png"

import { set } from "cookies"
import AdminNav from "../components/ui/AdminNav"
import planStatus from "../features/planStatus/planStatus"
import { Link, useNavigate } from "react-router-dom"

const CreateTeamPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [teamName, setName] = useState("")
  const [teamType, setTeamType] = useState("")
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [salesTeamData, setSalesTeamData] = useState([])
  const [addingTeam, setAddingTeam] = useState(false)
  const [updatingTeam, setUpdatingTeam] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState(false)

  const all_salesTeam = useAppSelector(selectAllSalesTeam)

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
    }
  }, [dispatch, businessId])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setSelectedImage(URL.createObjectURL(selectedFile))
    }
  }

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingTeam(true)
    const fileInput = document.getElementById(
      "profilePicture",
    ) as HTMLInputElement
    const file = fileInput.files?.[0]
    try {
      if (!file) {
        alert("Please select an image file.")
        return
      }
      dispatch(
        addSalesTeam({
          profile_image: file,
          name: teamName,
          teamType: teamType,
        }),
      )
      setAddingTeam(false)
      setSelectedImage(null)
      setName("")
      setTeamType("")
    } catch (error) {
      setAddingTeam(false)
      console.error("Error adding team:", error)
    }
    setSelectedImage(null)
    setName("")
    setTeamType("")
  }

  const handleOpenDelete = (salesTeam) => {
    setSalesTeamData(salesTeam)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    // setSalesTeamId(null)
    setOpenDelete(false)
  }

  const handleOpenUpdate = () => {
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }

  const handleDelete = async (id: string) => {
    setDeletingTeam(true)
    try {
      await dispatch(deleteSalesTeam(id))
      setDeletingTeam(false)
      handleCloseDelete()
    } catch (error) {
      setDeletingTeam(false)
      console.error("Error deleting team:", error)
    }
  }

  const handleUpdate = async (id: string, name: string) => {
    setUpdatingTeam(true)
    try {
      await dispatch(updateSalesTeam({ id, name, type: teamType }))
      setUpdatingTeam(false)
      handleCloseUpdate()
    } catch (error) {
      setUpdatingTeam(false)
      console.error("Error updating team:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <>
        {/* Header */}

        <AdminNav
          headerMessage={"Create New Team"}
          headerText={"Upload a team profile and assign its type"}
        />

        {/* Main */}
        <main className="flex-grow flex justify-center items-center py-10">
          <form
            className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl p-8 space-y-6"
            encType="multipart/form-data"
            onSubmit={handleSaveClick}
          >
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <label htmlFor="profilePicture" className="cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v14M5 12l2-2 2 2M15 12l2-2 2 2"
                      />
                    </svg>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="text-sm text-gray-500 mt-2">
                Upload Team Image
              </span>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                value={teamName}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Team Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                value={teamType}
                onChange={(e) => setTeamType(e.target.value)}
                required
              >
                <option value="">-- Select Team Type --</option>
                <option value="retail">Retail</option>
                <option value="wholesale">WholeSale</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg shadow hover:bg-blue-700 transition focus:ring-4 focus:ring-blue-300"
            >
              {addingTeam ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Team"
              )}
            </button>
          </form>
        </main>
        {/* Sales Teams List */}
        <section className="px-6 py-8 bg-white mt-4 rounded-xl shadow-md border border-gray-200 max-w-4xl mx-auto w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Sales Teams
          </h2>
          {all_salesTeam.length === 0 ? (
            <p className="text-sm text-gray-500">
              No teams available. Add a new team to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {all_salesTeam.map((team) => (
                <div
                  key={team.id}
                  className="flex-col space-y-1 items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border border-gray-200 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={team.profile_image || defaultPic}
                      alt={team.name}
                      className="w-14 h-14 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-500">{team.type}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* <Link to='/teamstock'> */}
                    <button
                      onClick={() => {
                        navigate(
                          `/teamstock/${team.id}/${encodeURIComponent(
                            team.name,
                          )}`,
                        )
                      }}
                      className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      stock
                    </button>
                    {/* </Link> */}

                    <button
                      onClick={() => {
                        handleOpenUpdate()
                        setSalesTeamData(team)
                        setName(team.name)
                        setTeamType(team.type)
                      }}
                      className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      update
                    </button>

                    <button
                      onClick={() => {
                        handleOpenDelete(team)
                        // TODO: dispatch delete logic here
                        // alert(`Delete logic for team ID: ${team.id}`)
                      }}
                      className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Are you sure you want to delete ${salesTeamData.name}?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action cannot be undone. Please confirm if you want to
                proceed with the deletion.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete}>Disagree</Button>
              <Button onClick={() => handleDelete(salesTeamData.id)} autoFocus>
                {deletingTeam ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update Dialogue */}
          <Dialog
            open={openUpdate}
            onClose={handleCloseUpdate}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Update ${salesTeamData.name}`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  value={teamName}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdate}>Disagree</Button>
              <Button
                onClick={() => handleUpdate(salesTeamData.id, teamName)}
                autoFocus
              >
                {updatingTeam ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </section>

        {/* Footer */}
        <AdminsFooter />
      </>
    </div>
  )
}

export default CreateTeamPage
