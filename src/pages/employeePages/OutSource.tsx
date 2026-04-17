// @ts-nocheck
import React, { useEffect, useState } from "react"
import EmployeeFooter from "../../components/ui/EmployeeFooter"
import Navbar from "../../components/ui/mobile/employees/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectEmployeeTeam } from "../../features/employees/employeesTeamSlice"
import api from "../../../utils/api"
import {
  Button,
  Skeleton,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline"
import CancelOutlined from "@mui/icons-material/CancelOutlined"
import EditOutlined from "@mui/icons-material/EditOutlined"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import { fetchStore, selectAllStore } from "../../features/store/storeSlice"

const OutSource = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const myTeamData = useAppSelector(selectEmployeeTeam)
  const assignmentData = myTeamData?.[0]
  const userId = assignmentData?.user
  const myTeamId = assignmentData?.assigned_to?.shop_id
  const myTeamType = assignmentData?.assigned_to?.type // "shop", "store", "vehicle"

  // Redux data
  const shops = useAppSelector(selectAllSalesTeamShops)
  const vehicles = useAppSelector(selectAllSalesTeamVehicle)
  const stores = useAppSelector(selectAllStore)

  // State for request creation
  const [step, setStep] = useState(1)
  const [teamType, setTeamType] = useState("")
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [itemType, setItemType] = useState("")
  const [availableItems, setAvailableItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [requestItems, setRequestItems] = useState([])
  const [submittingRequest, setSubmittingRequest] = useState(false)

  // Requests state
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [expandedRequestId, setExpandedRequestId] = useState(null)
  const [processingAction, setProcessingAction] = useState({})
  const [activeTab, setActiveTab] = useState("outgoing")

  // Update modal state
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [updatingRequest, setUpdatingRequest] = useState(null)
  const [tempUpdateItems, setTempUpdateItems] = useState([])
  const [updatingItemType, setUpdatingItemType] = useState("")
  const [updateAvailableItems, setUpdateAvailableItems] = useState([])
  const [loadingUpdateItems, setLoadingUpdateItems] = useState(false)

  // Fetch shops, vehicles, and stores on mount
  useEffect(() => {
    setLoadingTeams(true)
    dispatch(fetchSalesTeamShops())
    dispatch(fetchSalesTeamVehicle())
    dispatch(fetchStore())
    setLoadingTeams(false)
  }, [dispatch])

  // Fetch all outsource requests and split into outgoing/incoming
  const fetchRequests = async () => {
    if (!myTeamId || !myTeamType) return
    setLoadingRequests(true)
    try {
      const res = await api.get(`inventory/outsource/requests/`)
      const allRequests = res.data

      const outgoing = allRequests.filter(
        (req) =>
          req.requesting_location_id === myTeamId &&
          req.requesting_location_type.toUpperCase() ===
            myTeamType.toUpperCase(),
      )

      const incoming = allRequests.filter(
        (req) =>
          req.supplying_location_id === myTeamId &&
          req.supplying_location_type.toUpperCase() ===
            myTeamType.toUpperCase(),
      )

      setOutgoingRequests(outgoing)
      setIncomingRequests(incoming)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load requests")
    } finally {
      setLoadingRequests(false)
    }
  }

  // Approve request
  const approveRequests = async () => {
    if (!myTeamId || !myTeamType) return
    setLoadingRequests(true)
    try {
      const res = await api.get(
        `inventory/outsource/requests/${expandedRequestId}/`,
      )
      const allRequests = res.data

      const outgoing = allRequests.filter(
        (req) =>
          req.requesting_location_id === myTeamId &&
          req.requesting_location_type.toUpperCase() ===
            myTeamType.toUpperCase(),
      )

      const incoming = allRequests.filter(
        (req) =>
          req.supplying_location_id === myTeamId &&
          req.supplying_location_type.toUpperCase() ===
            myTeamType.toUpperCase(),
      )

      setOutgoingRequests(outgoing)
      setIncomingRequests(incoming)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load requests")
    } finally {
      setLoadingRequests(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [myTeamId, myTeamType])

  // Get teams list based on selected type (from Redux) with vehicle filter
  const getTeamsForType = (type) => {
    switch (type) {
      case "shop":
        return shops
      case "vehicle":
        return vehicles.filter((v) => v.type_of_vehicle === "VEHICLE")
      case "store":
        return stores
      default:
        return []
    }
  }

  // Fetch items (cylinders or products) for selected team
  const fetchItems = async (teamId, type, teamTypeParam) => {
    setLoadingItems(true)
    try {
      let endpoint = ""
      if (type === "cylinder") {
        if (teamTypeParam === "shop")
          endpoint = `/inventory/shops/${teamId}/cylinders/`
        else if (teamTypeParam === "vehicle")
          endpoint = `/inventory/vehicles/${teamId}/cylinders/`
        else if (teamTypeParam === "store")
          endpoint = `/inventory/stores/${teamId}/cylinders/`
      } else if (type === "product") {
        if (teamTypeParam === "shop")
          endpoint = `/inventory/shops/${teamId}/products/`
        else if (teamTypeParam === "vehicle")
          endpoint = `/inventory/vehicles/${teamId}/products/`
        else if (teamTypeParam === "store")
          endpoint = `/inventory/stores/${teamId}/products/`
      }
      const res = await api.get(endpoint)
      setAvailableItems(res.data)
    } catch (err) {
      toast.error("Failed to load items")
      console.error(err)
    } finally {
      setLoadingItems(false)
    }
  }

  const handleTeamTypeSelect = (type) => {
    setTeamType(type)
    setStep(2)
  }

  const handleTeamSelect = (team) => {
    setSelectedTeam(team)
    setStep(3)
  }

  const handleItemTypeSelect = (type) => {
    setItemType(type)
    fetchItems(selectedTeam.id, type, teamType)
    setStep(4)
  }

  const handleQuantityChange = (itemId, quantity) => {
    setRequestItems((prev) => {
      const existing = prev.find((i) => i.item_id === itemId)
      if (existing) {
        if (quantity <= 0) return prev.filter((i) => i.item_id !== itemId)
        return prev.map((i) => (i.item_id === itemId ? { ...i, quantity } : i))
      }
      if (quantity > 0) return [...prev, { item_id: itemId, quantity }]
      return prev
    })
  }

  const handleSubmitRequest = async () => {
    if (requestItems.length === 0) {
      toast.error("Please add at least one item")
      return
    }
    setSubmittingRequest(true)
    try {
      const payload = {
        requesting_location_id: myTeamId,
        requesting_location_type: myTeamType.toUpperCase(),
        supplying_location_id: selectedTeam.id,
        supplying_location_type: teamType.toUpperCase(),
        items: requestItems.map((item) => ({
          ...item,
          item_type: itemType.toUpperCase(),
        })),
      }
      await api.post("inventory/outsource/requests/", payload)
      toast.success("Request sent successfully")
      resetForm()
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send request")
    } finally {
      setSubmittingRequest(false)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    setProcessingAction((prev) => ({ ...prev, [requestId]: "accept" }))
    // alert("Are you sure you want to approve this request? This action cannot be undone.")
    try {
      await api.post(`inventory/outsource/requests/${requestId}/approve/`)
      // /outsource/requests/<id>/approve/
      toast.success("Request approved")
      fetchRequests()
    } catch (err) {
      toast.error("Failed to approve request")
    } finally {
      setProcessingAction((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const handleRejectRequest = async (requestId) => {
    setProcessingAction((prev) => ({ ...prev, [requestId]: "reject" }))
    try {
      await api.post(`inventory/outsource/requests/${requestId}/reject/`)
      toast.success("Request rejected")
      fetchRequests()
    } catch (err) {
      toast.error("Failed to reject request")
    } finally {
      setProcessingAction((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const handleCancelRequest = async (requestId) => {
    setProcessingAction((prev) => ({ ...prev, [requestId]: "cancel" }))
    try {
      await api.delete(`inventory/outsource/requests/${requestId}/`)
      toast.success("Request cancelled")
      fetchRequests()
    } catch (err) {
      toast.error("Failed to cancel request")
    } finally {
      setProcessingAction((prev) => ({ ...prev, [requestId]: null }))
    }
  }

  const handleOpenUpdateModal = async (request) => {
    // Set the request being updated
    setUpdatingRequest(request)
    setUpdatingItemType(request.items[0]?.item_type.toLowerCase() || "")

    // Pre-populate temp items from existing request items
    const existingItems = request.items.map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity,
    }))
    setTempUpdateItems(existingItems)

    // Fetch fresh available items from the supplying team
    setLoadingUpdateItems(true)
    try {
      const supplyingType = request.supplying_location_type.toLowerCase()
      const supplyingId = request.supplying_location_id
      let endpoint = ""
      if (request.items[0]?.item_type === "CYLINDER") {
        if (supplyingType === "shop")
          endpoint = `/inventory/shops/${supplyingId}/cylinders/`
        else if (supplyingType === "vehicle")
          endpoint = `/inventory/vehicles/${supplyingId}/cylinders/`
        else if (supplyingType === "store")
          endpoint = `/inventory/stores/${supplyingId}/cylinders/`
      } else {
        if (supplyingType === "shop")
          endpoint = `/inventory/shops/${supplyingId}/products/`
        else if (supplyingType === "vehicle")
          endpoint = `/inventory/vehicles/${supplyingId}/products/`
        else if (supplyingType === "store")
          endpoint = `/inventory/stores/${supplyingId}/products/`
      }
      const res = await api.get(endpoint)
      setUpdateAvailableItems(res.data)
    } catch (err) {
      toast.error("Failed to load available items")
    } finally {
      setLoadingUpdateItems(false)
    }
    setUpdateModalOpen(true)
  }

  const handleUpdateQuantityChange = (itemId, quantity) => {
    setTempUpdateItems((prev) => {
      const existing = prev.find((i) => i.item_id === itemId)
      if (existing) {
        if (quantity <= 0) return prev.filter((i) => i.item_id !== itemId)
        return prev.map((i) => (i.item_id === itemId ? { ...i, quantity } : i))
      }
      if (quantity > 0) return [...prev, { item_id: itemId, quantity }]
      return prev
    })
  }

  const handleSubmitUpdate = async () => {
    if (!updatingRequest) return
    if (tempUpdateItems.length === 0) {
      toast.error("Please add at least one item")
      return
    }
    setSubmittingRequest(true)
    try {
      const payload = {
        items: tempUpdateItems.map((item) => ({
          ...item,
          item_type: updatingItemType.toUpperCase(),
        })),
      }
      await api.patch(
        `inventory/outsource/requests/${updatingRequest.id}/`,
        payload,
      )
      toast.success("Request updated successfully")
      setUpdateModalOpen(false)
      setUpdatingRequest(null)
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update request")
    } finally {
      setSubmittingRequest(false)
    }
  }

  const toggleRequestExpand = (requestId) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId)
  }

  const resetForm = () => {
    setStep(1)
    setTeamType("")
    setSelectedTeam(null)
    setItemType("")
    setRequestItems([])
    setAvailableItems([])
  }

  console.log("items requested:", requestItems)
  if (!isMobile) {
    return (
      <div className="p-4">
        <p>Desktop view coming soon</p>
      </div>
    )
  }

  const teamsList = getTeamsForType(teamType)

  // Helper to render request card
  // Helper to render request card
  const renderRequestCard = (req, isIncoming = false) => {
    const isPending = req.status === "PENDING"
    const isAccepted = req.status === "ACCEPTED"
    const isRejected = req.status === "REJECTED"
    const isCancelled = req.status === "CANCELLED"
    const isExpanded = expandedRequestId === req.id

    // Determine border color based on status
    let borderColor = "border-gray-300"
    if (isPending) borderColor = "border-yellow-500"
    else if (isAccepted) borderColor = "border-green-500"
    else if (isRejected) borderColor = "border-red-500"
    else if (isCancelled) borderColor = "border-gray-400"

    // Determine background tint for non-pending states
    let bgTint = ""
    if (isAccepted) bgTint = "bg-green-50/30"
    else if (isRejected) bgTint = "bg-red-50/30"
    else if (isCancelled) bgTint = "bg-gray-50/50"

    return (
      <div
        key={req.id}
        className={`border rounded-lg overflow-hidden border-l-4 ${borderColor} ${bgTint}`}
      >
        <div
          className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50/80"
          onClick={() => toggleRequestExpand(req.id)}
        >
          <div>
            <p className="font-medium">
              {isIncoming
                ? `From: ${req.requesting_location_name} (${req.requesting_location_type})`
                : `To: ${req.supplying_location_name} (${req.supplying_location_type})`}
            </p>
            <p className="text-sm text-gray-600">
              {req.items_count} item(s) •{" "}
              {new Date(req.created_at).toLocaleDateString()}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isPending
                  ? "bg-yellow-100 text-yellow-800"
                  : isAccepted
                  ? "bg-green-100 text-green-800"
                  : isRejected
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {req.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isIncoming && isPending && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAcceptRequest(req.id)
                  }}
                  disabled={processingAction[req.id]}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Approve"
                >
                  {processingAction[req.id] === "accept" ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CheckCircleOutline />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRejectRequest(req.id)
                  }}
                  disabled={processingAction[req.id]}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Reject"
                >
                  {processingAction[req.id] === "reject" ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CancelOutlined />
                  )}
                </button>
              </>
            )}
            {!isIncoming && isPending && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenUpdateModal(req)
                  }}
                  disabled={processingAction[req.id]}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Update"
                >
                  <EditOutlined fontSize="small" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelRequest(req.id)
                  }}
                  disabled={processingAction[req.id]}
                  className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                  title="Cancel"
                >
                  <CancelOutlined fontSize="small" />
                </button>
              </>
            )}
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </div>
        {isExpanded && (
          <div className="p-3 border-t bg-gray-50">
            <h4 className="font-medium mb-2">Items</h4>
            <div className="space-y-1">
              {req.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.item_name}</span>
                  <span className="font-semibold">{item.quantity} units</span>
                </div>
              ))}
            </div>
            {req.notes && (
              <p className="text-sm text-gray-600 mt-2">Notes: {req.notes}</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar headerMessage="ERP" headerText="Outsource Requests" />

      <main className="flex-grow m-2 p-1 space-y-4">
        {/* New Request Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <span className="mr-2">📤</span> Request Items from Other Team
          </h2>

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-gray-600">
                Select the type of team you want to request from:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {["shop", "store", "vehicle"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTeamTypeSelect(type)}
                    className="bg-blue-50 border-2 border-blue-300 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition flex flex-col items-center"
                  >
                    <span className="text-2xl">
                      {type === "shop" ? "🏪" : type === "store" ? "🏢" : "🚚"}
                    </span>
                    <span className="font-medium capitalize mt-1">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center mb-3">
                <button onClick={resetForm} className="text-blue-600 mr-2">
                  ← Back
                </button>
                <h3 className="font-semibold">Select a {teamType}</h3>
              </div>
              {loadingTeams ? (
                <div className="space-y-2">
                  <Skeleton variant="rectangular" height={50} />
                  <Skeleton variant="rectangular" height={50} />
                </div>
              ) : teamsList.length === 0 ? (
                <p className="text-gray-500">No {teamType}s available</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {teamsList
                    .filter((team) => {
                      if (teamType.toUpperCase() === myTeamType.toUpperCase()) {
                        return team.id !== myTeamId
                      }
                      return true
                    })
                    .map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleTeamSelect(team)}
                        className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                      >
                        <span>{team.name || team.number_plate || team.id}</span>
                        <span>→</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center mb-3">
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 mr-2"
                >
                  ← Back
                </button>
                <h3 className="font-semibold">Select Item Type</h3>
              </div>
              <p className="mb-3 text-gray-600">
                Requesting from:{" "}
                <strong>
                  {selectedTeam?.name || selectedTeam?.number_plate}
                </strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["cylinder", "product"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleItemTypeSelect(type)}
                    className="bg-green-50 border-2 border-green-300 text-green-700 p-4 rounded-lg hover:bg-green-100 transition flex flex-col items-center"
                  >
                    <span className="text-2xl">
                      {type === "cylinder" ? "🛢️" : "📦"}
                    </span>
                    <span className="font-medium capitalize mt-1">{type}s</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center mb-3">
                <button
                  onClick={() => setStep(3)}
                  className="text-blue-600 mr-2"
                >
                  ← Back
                </button>
                <h3 className="font-semibold">Select Items & Quantities</h3>
              </div>
              {loadingItems ? (
                <div className="space-y-3">
                  <Skeleton variant="rectangular" height={80} />
                  <Skeleton variant="rectangular" height={80} />
                </div>
              ) : availableItems.length === 0 ? (
                <p className="text-gray-500">
                  No {itemType}s available in this team
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableItems.map((item) => {
                    const isCylinder = itemType === "cylinder"
                    const itemId = isCylinder ? item.id : item.id
                    const itemName = isCylinder
                      ? `${item.cylinder?.cylinder_type?.name} ${item.cylinder?.weight?.weight}kg`
                      : item.product?.name
                    const availableQty = isCylinder
                      ? item.full_cylinder_quantity || 0
                      : item.quantity || 0
                    const requestedItem = requestItems.find(
                      (i) => i.item_id === itemId,
                    )
                    const requestedQty = requestedItem?.quantity || 0

                    return (
                      <div
                        key={itemId}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{itemName}</p>
                            <p className="text-sm text-gray-600">
                              Available:{" "}
                              <span className="font-semibold">
                                {availableQty}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <TextField
                              type="number"
                              size="small"
                              value={requestedQty}
                              onChange={(e) =>
                                handleQuantityChange(
                                  itemId,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              inputProps={{ min: 0, max: availableQty }}
                              style={{ width: 80 }}
                            />
                            <span className="text-xs text-gray-500">units</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="contained"
                  onClick={handleSubmitRequest}
                  disabled={submittingRequest || requestItems.length === 0}
                  className="bg-blue-600"
                >
                  {submittingRequest ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Requests Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex border-b mb-3">
            <button
              onClick={() => setActiveTab("outgoing")}
              className={`px-4 py-2 font-medium ${
                activeTab === "outgoing"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              My Requests ({outgoingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("incoming")}
              className={`px-4 py-2 font-medium ${
                activeTab === "incoming"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Incoming Requests ({incomingRequests.length})
            </button>
          </div>

          {loadingRequests ? (
            <div className="space-y-2">
              <Skeleton variant="rectangular" height={100} />
              <Skeleton variant="rectangular" height={100} />
            </div>
          ) : activeTab === "outgoing" ? (
            outgoingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No outgoing requests
              </p>
            ) : (
              <div className="space-y-3">
                {outgoingRequests.map((req) => renderRequestCard(req, false))}
              </div>
            )
          ) : incomingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No incoming requests
            </p>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => renderRequestCard(req, true))}
            </div>
          )}
        </div>
      </main>

      {/* Update Request Modal */}
      <Dialog
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Request</DialogTitle>
        <DialogContent>
          {loadingUpdateItems ? (
            <div className="space-y-3">
              <Skeleton variant="rectangular" height={80} />
              <Skeleton variant="rectangular" height={80} />
            </div>
          ) : updateAvailableItems.length === 0 ? (
            <p className="text-gray-500">No items available</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto mt-2">
              {updateAvailableItems.map((item) => {
                const isCylinder = updatingItemType === "cylinder"
                const itemId = isCylinder ? item.id : item.id
                const itemName = isCylinder
                  ? `${item.cylinder?.cylinder_type?.name} ${item.cylinder?.weight?.weight}kg`
                  : item.product?.name
                const availableQty = isCylinder
                  ? item.full_cylinder_quantity || 0
                  : item.quantity || 0
                const existingItem = tempUpdateItems.find(
                  (i) => i.item_id === itemId,
                )
                const currentQty = existingItem?.quantity || 0

                return (
                  <div
                    key={itemId}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{itemName}</p>
                        <p className="text-sm text-gray-600">
                          Available:{" "}
                          <span className="font-semibold">{availableQty}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TextField
                          type="number"
                          size="small"
                          value={currentQty}
                          onChange={(e) =>
                            handleUpdateQuantityChange(
                              itemId,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          inputProps={{ min: 0, max: availableQty }}
                          style={{ width: 80 }}
                        />
                        <span className="text-xs text-gray-500">units</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitUpdate}
            variant="contained"
            disabled={submittingRequest || tempUpdateItems.length === 0}
          >
            {submittingRequest ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <EmployeeFooter />
    </div>
  )
}

export default OutSource
