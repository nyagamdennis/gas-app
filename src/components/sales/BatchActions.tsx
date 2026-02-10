// @ts-nocheck

import React from "react"
import {
  SelectAll,
  ClearAll,
  CloudDownload,
  CheckCircle,
  Send,
  Archive,
  Delete,
  MoreVert,
} from "@mui/icons-material"

const BatchActions = ({
  selectedCount,
  onSelectAll,
  onClearAll,
  onExport,
  onMarkPaid,
  onSendReceipts,
  onArchive,
  onDelete,
  onExit,
}) => {
  const actions = [
    {
      id: "export",
      label: "Export",
      icon: <CloudDownload fontSize="small" />,
      onClick: onExport,
      color: "text-blue-600 hover:bg-blue-50",
    },
    {
      id: "markPaid",
      label: "Mark as Paid",
      icon: <CheckCircle fontSize="small" />,
      onClick: onMarkPaid,
      color: "text-green-600 hover:bg-green-50",
    },
    {
      id: "sendReceipts",
      label: "Send Receipts",
      icon: <Send fontSize="small" />,
      onClick: onSendReceipts,
      color: "text-purple-600 hover:bg-purple-50",
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive fontSize="small" />,
      onClick: onArchive,
      color: "text-gray-600 hover:bg-gray-50",
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Delete fontSize="small" />,
      onClick: onDelete,
      color: "text-red-600 hover:bg-red-50",
    },
  ]

  return (
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
      {/* Selection Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSelectAll}
          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded flex items-center text-sm"
          title="Select All"
        >
          <SelectAll fontSize="small" />
          <span className="ml-1 hidden sm:inline">Select All</span>
        </button>
        <button
          onClick={onClearAll}
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center text-sm"
          title="Clear Selection"
        >
          <ClearAll fontSize="small" />
          <span className="ml-1 hidden sm:inline">Clear</span>
        </button>
      </div>

      <div className="h-6 w-px bg-blue-300"></div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1">
        {actions.slice(0, 2).map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-1.5 rounded flex items-center text-sm ${action.color}`}
            title={action.label}
          >
            {action.icon}
            <span className="ml-1 hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>

      {/* More Actions Dropdown */}
      {actions.length > 2 && (
        <div className="relative">
          <button
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
            title="More Actions"
          >
            <MoreVert fontSize="small" />
          </button>
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 hidden">
            {actions.slice(2).map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center ${action.color}`}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-6 w-px bg-blue-300"></div>

      {/* Selected Count & Exit */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-blue-700 whitespace-nowrap">
          {selectedCount} selected
        </span>
        <button
          onClick={onExit}
          className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Exit Batch
        </button>
      </div>
    </div>
  )
}

export default BatchActions
