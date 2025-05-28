// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../components/AdminsFooter"
import AdminNav from "../components/ui/AdminNav"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addSettings,
  fetchSettings,
  selectAllSettings,
  updateSettings,
} from "../features/settings/settingsSlice"
import { Link } from "react-router-dom"

const Settings = () => {
  const [businessName, setBusinessName] = useState("")
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const currentPlan = "Pro" // Ideally this comes from Redux or API
  const dispatch = useAppDispatch()
  const [addingSettings, setAddingSettings] = useState(false)
  const my_settings = useAppSelector(selectAllSettings)
  const [editing, setEditing] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
console.log("my_settings", my_settings)
  useEffect(() => {
    dispatch(fetchSettings())
  }, [dispatch])

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmitSettings = async (e: any) => {
    e.preventDefault()
    // console.log('det ', logoFile)
    try {
      setAddingSettings(true)
      const dat = {
        name: businessName,
        business_logo: logoFile,
      }
      await dispatch(addSettings({ dat }))
    } catch (error) {
      alert(`Failed to save settings: ${error}`)
    } finally {
      setAddingSettings(false)
    }
  }

  const handleDeleteSettings = async (id: string) => {
    try {
      setAddingSettings(true)
      await dispatch(deleteSettings(id))
    } catch (error) {
      alert(`Failed to delete settings: ${error}`)
    } finally {
      setAddingSettings(false)
    }
  }

  const handleOpenUpdate = () => {
    setBusinessName(my_settings.name)
    setLogoPreview(my_settings.business_logo)
    setLogoFile(null)
    // Switch to edit mode
    setEditing(true)
  }

  const handleCloseUpdate = () => {
    setBusinessName("")
    setLogoPreview(null)
    setLogoFile(null)
    // Switch to view mode
    setEditing(false)
  }

  const handleUpdateBusiness = async (e,id: string) => {
    e.preventDefault()
    try {
      setAddingSettings(true)
      const dat = {
        name: businessName,
        business_logo: logoFile,
      }
      await dispatch(updateSettings({ dat }))
    } catch (error) {
      alert(`Failed to update settings: ${error}`)
    } finally {
      setAddingSettings(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminNav
        headerMessage="Manage Your Business"
        headerText="Manage it like a pro"
      />
  
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Business Settings</h2>
  
        {my_settings && my_settings?.name ? (
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{my_settings?.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Plan: <strong>{my_settings.subscription_plan?.name || "No Plan"}</strong>
                </p>
  
                {my_settings.subscription_plan ? (
                  <Link className="mt-2 text-sm text-blue-600 hover:underline" to={`/subscribe?current_plan=${my_settings.subscription_plan.id}`}>Change Plan</Link>
                 
                ) : (
                    <Link to='/subscribe?eligibleForFreeTrial=true' className="mt-2 text-sm text-green-600 hover:underline">Subscribe to a Plan</Link>
                 
                )}
              </div>
  
              <img
                src={my_settings.business_logo}
                alt="Business Logo"
                className="h-20 w-20 object-contain border rounded-lg"
              />
            </div>
  
            <div className="flex gap-4 mt-6">
              {editing ? (
                <button
                  onClick={handleCloseUpdate}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleOpenUpdate}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
  
              <button
                onClick={() => alert("Delete not implemented")}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
  
            {editing && (
              <form
                onSubmit={handleUpdateBusiness}
                className="mt-8 border-t pt-6 space-y-6"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Update Info</h4>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block"
                  />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="mt-3 h-20 object-contain rounded-md"
                    />
                  )}
                </div>
  
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    {addingSettings ? "Saving..." : "Update Business"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmitSettings}
            className="bg-white p-6 rounded-xl shadow-md space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800">Add Your Business</h3>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Business Logo Preview"
                  className="mt-3 h-20 object-contain rounded"
                />
              )}
            </div>
  
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              >
                {addingSettings ? "Saving..." : "Save Business"}
              </button>
            </div>
          </form>
        )}
      </main>
  
      <footer className="bg-gray-100 mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  )
  
}

export default Settings
