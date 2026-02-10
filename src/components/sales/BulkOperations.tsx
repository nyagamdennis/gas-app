// @ts-nocheck
import React, { useState } from "react"
import {
  CloudDownload,
  Print,
  CheckCircle,
  Send,
  MoreVert,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material"

const BulkOperations = ({
  selectedItems,
  onExport,
  onPrint,
  onMarkPaid,
  onSendReceipts,
  onDelete,
  onArchive,
}) => {
  const [showOptions, setShowOptions] = useState(false)

  if (selectedItems.length === 0) return null

  const operations = [
    {
      id: "export",
      label: "Export Selected",
      icon: <CloudDownload />,
      onClick: onExport,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      id: "print",
      label: "Print Selected",
      icon: <Print />,
      onClick: onPrint,
      color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
    {
      id: "markPaid",
      label: "Mark as Paid",
      icon: <CheckCircle />,
      onClick: onMarkPaid,
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      id: "sendReceipts",
      label: "Send Receipts",
      icon: <Send />,
      onClick: onSendReceipts,
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
  ]

  const moreOperations = [
    {
      id: "archive",
      label: "Archive Selected",
      onClick: onArchive,
    },
    {
      id: "delete",
      label: "Delete Selected",
      onClick: onDelete,
      color: "text-red-600",
    },
  ]

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Main Actions */}
        <div className="flex gap-2">
          {operations.slice(0, 2).map((op) => (
            <button
              key={op.id}
              onClick={op.onClick}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${op.color}`}
            >
              {op.icon}
              <span className="hidden sm:inline">{op.label}</span>
            </button>
          ))}
        </div>

        {/* More Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
          >
            <MoreVert />
            <span className="hidden sm:inline">More</span>
            {showOptions ? <ExpandLess /> : <ExpandMore />}
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
              {operations.slice(2).map((op) => (
                <button
                  key={op.id}
                  onClick={() => {
                    op.onClick()
                    setShowOptions(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                >
                  <span className="mr-2">{op.icon}</span>
                  {op.label}
                </button>
              ))}
              <div className="border-t my-1"></div>
              {moreOperations.map((op) => (
                <button
                  key={op.id}
                  onClick={() => {
                    op.onClick()
                    setShowOptions(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                    op.color || ""
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Count Badge */}
        <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
          {selectedItems.length} selected
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  )
}

export default BulkOperations
