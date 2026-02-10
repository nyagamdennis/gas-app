// @ts-nocheck
import React from "react"
import {
  Refresh,
  CloudDownload,
  Assessment,
  Analytics,
  Print,
  FilterList,
  SelectAll,
  MoreVert,
} from "@mui/icons-material"

const QuickActions = ({
  onRefresh,
  onExport,
  onSummary,
  onAnalytics,
  onPrint,
  onFilters,
  onBatch,
  isFinalized,
  refreshing = false,
  batchMode = false,
  selectedCount = 0,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={refreshing || isFinalized}
        className={`p-2 rounded-lg ${
          refreshing
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        } ${isFinalized ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Refresh Data"
      >
        {refreshing ? (
          <div className="animate-spin">
            <Refresh />
          </div>
        ) : (
          <Refresh />
        )}
      </button>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={isFinalized}
        className={`p-2 rounded-lg ${
          batchMode && selectedCount > 0
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        } ${isFinalized ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Export Data"
      >
        <CloudDownload />
      </button>

      {/* Filters Button */}
      <button
        onClick={onFilters}
        className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        title="Toggle Filters"
      >
        <FilterList />
      </button>

      {/* Batch Mode Button */}
      <button
        onClick={onBatch}
        className={`p-2 rounded-lg ${
          batchMode
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title={batchMode ? "Exit Batch Mode" : "Enter Batch Mode"}
      >
        <SelectAll />
      </button>

      {/* More Actions Dropdown */}
      <div className="relative">
        <button
          className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          title="More Actions"
        >
          <MoreVert />
        </button>
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 hidden">
          <button
            onClick={onSummary}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <Assessment className="mr-2 text-gray-500" fontSize="small" />
            View Summary
          </button>
          <button
            onClick={onAnalytics}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <Analytics className="mr-2 text-gray-500" fontSize="small" />
            Analytics
          </button>
          <button
            onClick={onPrint}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <Print className="mr-2 text-gray-500" fontSize="small" />
            Print Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickActions
