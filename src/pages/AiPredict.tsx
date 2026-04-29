// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from "react"
import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"
import api from "../../utils/api"

// Icons (you can use any icon library, here using simple SVG for demo)
const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
)

// ---------- Dummy Data Generator (unchanged) ----------
const generateDummyPredictions = () => {
  const teams = ["Team A", "Team B", "Team C", "Team D"]
  const cylinderSizes = ["6kg", "13kg", "22.5kg", "50kg"]
  const customers = [
    { id: 101, name: "Acme Corp" },
    { id: 102, name: "Sunrise Café" },
    { id: 103, name: "Hilltop Hotel" },
    { id: 104, name: "Green Valley Restaurant" },
    { id: 105, name: "City Bakery" },
    { id: 106, name: "Ocean View Resort" },
    { id: 107, name: "Metro Hospital" },
    { id: 108, name: "Lakeside School" },
  ]
  const predictions = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const size = cylinderSizes[Math.floor(Math.random() * cylinderSizes.length)]
    const team = teams[Math.floor(Math.random() * teams.length)]
    const daysOffset = Math.floor(Math.random() * 14) - 2
    const predDate = new Date(today)
    predDate.setDate(today.getDate() + daysOffset)
    const confidence = (0.6 + Math.random() * 0.39).toFixed(2)
    predictions.push({
      id: `pred-${i}`,
      customer_id: customer.id,
      customer_name: customer.name,
      cylinder_id: 1000 + i,
      cylinder_size: size,
      sale_type: i % 3 === 0 ? "WHOLESALE" : "RETAIL",
      team: team,
      predicted_date: predDate.toISOString(),
      lower_bound: predDate.toISOString(),
      upper_bound: predDate.toISOString(),
      avg_refill_days: 28 + Math.floor(Math.random() * 10),
      data_points: 4 + Math.floor(Math.random() * 10),
      confidence: parseFloat(confidence),
      status: "predicted",
    })
  }
  return predictions
}

// ---------- Main Component ----------
const AiPredict = () => {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState("All")
  const [useDummyData, setUseDummyData] = useState(true)

  // Chat state
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const chatEndRef = useRef(null)

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, isChatOpen])

  // Fetch predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true)
      setError(null)
      try {
        if (useDummyData) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setPredictions(generateDummyPredictions())
        } else {
          const response = await fetch("/api/cylinder-predictions/")
          if (!response.ok) throw new Error("Failed to fetch predictions")
          const data = await response.json()
          setPredictions(data.results || [])
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail ||
          err.message ||
          "Failed to load predictions"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    fetchPredictions()
  }, [useDummyData])

  const teamOptions = useMemo(() => {
    const teams = new Set(predictions.map((p) => p.team).filter(Boolean))
    return ["All", ...Array.from(teams).sort()]
  }, [predictions])

  const filteredPredictions = useMemo(() => {
    if (selectedTeam === "All") return predictions
    return predictions.filter((p) => p.team === selectedTeam)
  }, [predictions, selectedTeam])

  const summaryStats = useMemo(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const stats = {
      today: { total: 0, bySize: {}, byTeam: {} },
      tomorrow: { total: 0, bySize: {}, byTeam: {} },
      upcoming: { total: 0 },
    }

    filteredPredictions.forEach((p) => {
      const date = parseISO(p.predicted_date)
      const size = p.cylinder_size || "unknown"
      const team = p.team || "Unassigned"

      if (isToday(date)) {
        stats.today.total++
        stats.today.bySize[size] = (stats.today.bySize[size] || 0) + 1
        stats.today.byTeam[team] = (stats.today.byTeam[team] || 0) + 1
      } else if (isTomorrow(date)) {
        stats.tomorrow.total++
        stats.tomorrow.bySize[size] = (stats.tomorrow.bySize[size] || 0) + 1
        stats.tomorrow.byTeam[team] = (stats.tomorrow.byTeam[team] || 0) + 1
      }
      if (date >= today) stats.upcoming.total++
    })

    return stats
  }, [filteredPredictions])

  // AI Chat Handler
  const handleSendChat = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setAiLoading(true)

    try {
      // ✅ Correct axios-style usage
      const response = await api.post("/sales_ai/ask/", {
        question: chatInput,
      })
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.answer },
      ])
    } catch (err) {
      // Axios error object has response.data with server error details
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "Request failed"
      toast.error(errorMessage)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}`,
        },
      ])
    } finally {
      setAiLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-sans">
      <Navbar
        headerMessage="AI Predictions"
        headerText="Forecast cylinder refills and team workload"
      />
      <ToastContainer />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 to-slate-100 pt-2 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Refill Prediction Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
                <input
                  type="checkbox"
                  checked={useDummyData}
                  onChange={(e) => setUseDummyData(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Demo Data</span>
              </label>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              title: "Today's Refills",
              value: summaryStats.today.total,
              color: "indigo",
              details: summaryStats.today.bySize,
            },
            {
              title: "Tomorrow's Refills",
              value: summaryStats.tomorrow.total,
              color: "emerald",
              details: summaryStats.tomorrow.bySize,
            },
            {
              title: "Upcoming (14d)",
              value: summaryStats.upcoming.total,
              color: "amber",
              details: null,
            },
            {
              title: "Avg Confidence",
              value: filteredPredictions.length
                ? (
                    filteredPredictions.reduce((s, p) => s + p.confidence, 0) /
                    filteredPredictions.length
                  ).toFixed(2)
                : "—",
              color: "blue",
              details: `${filteredPredictions.length} predictions`,
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md border border-gray-200/60 p-5 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-sm font-medium text-gray-500">
                {card.title}
              </h3>
              <p className={`text-3xl font-bold mt-1 text-${card.color}-700`}>
                {card.value}
              </p>
              {card.details && typeof card.details === "object" ? (
                <div className="mt-3 text-xs text-gray-600 space-y-0.5">
                  {Object.entries(card.details).map(([size, count]) => (
                    <div key={size} className="flex justify-between">
                      <span>{size}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              ) : card.details ? (
                <div className="mt-2 text-xs text-gray-500">{card.details}</div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Predictions Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Predictions
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Team:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              >
                {teamOptions.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading predictions...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error: {error}</div>
          ) : filteredPredictions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No predictions found for this team.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Cylinder</th>
                    <th className="px-4 py-3 text-left">Size</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-left">Expected Date</th>
                    <th className="px-4 py-3 text-left">Confidence</th>
                    <th className="px-4 py-3 text-left">Data Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPredictions.slice(0, 20).map((pred) => {
                    const date = parseISO(pred.predicted_date)
                    const isSoon = isToday(date) || isTomorrow(date)
                    return (
                      <tr
                        key={pred.id}
                        className={`hover:bg-gray-50 transition ${
                          isSoon ? "bg-amber-50/50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-medium">
                          {pred.customer_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          #{pred.cylinder_id}
                        </td>
                        <td className="px-4 py-3">{pred.cylinder_size}</td>
                        <td className="px-4 py-3">{pred.team}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {format(date, "EEE, MMM d")}
                            {isToday(date) && (
                              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                Today
                              </span>
                            )}
                            {isTomorrow(date) && (
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Tomorrow
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${pred.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">
                              {(pred.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {pred.data_points}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredPredictions.length > 20 && (
                <p className="text-xs text-gray-500 p-3 border-t">
                  Showing 20 of {filteredPredictions.length} predictions.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 ${
          isChatOpen
            ? "bg-gray-700 text-white hover:bg-gray-800"
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
        }`}
        aria-label="AI Assistant"
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
        {!isChatOpen && (
          <span className="hidden sm:inline text-sm font-medium">
            AI Assistant
          </span>
        )}
        {chatMessages.length > 0 && !isChatOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {chatMessages.length}
          </span>
        )}
      </button>

      {/* AI Chat Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "64px", height: "calc(100vh - 64px)" }} // Adjust based on navbar height
      >
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <ChatIcon />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  AI Prediction Assistant
                </h3>
                <p className="text-xs text-gray-500">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-200/50 transition"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-sm">Ask me about predictions!</p>
                <p className="text-xs mt-2">
                  e.g., "Which team has the most refills tomorrow?"
                </p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Type your question..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                disabled={aiLoading}
              />
              <button
                onClick={handleSendChat}
                disabled={aiLoading || !chatInput.trim()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition font-medium text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when chat is open (mobile) */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-30">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AiPredict
