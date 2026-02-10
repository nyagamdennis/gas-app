// @ts-nocheck

import React, { useState } from "react"
import {
  Close,
  CloudDownload,
  PictureAsPdf,
  TableChart,
  TextFields,
  Code,
  Check,
} from "@mui/icons-material"

const ExportModal = ({
  open,
  onClose,
  onExport,
  selectedCount,
  totalCount,
  formats = ["pdf", "excel", "csv", "json"],
}) => {
  const [selectedFormat, setSelectedFormat] = useState("pdf")
  const [exportRange, setExportRange] = useState("all")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)

  const handleExport = () => {
    const options = {
      format: selectedFormat,
      selectedOnly: exportRange === "selected",
      includeCharts,
      includeSummary,
    }
    onExport(selectedFormat, options)
    onClose()
  }

  if (!open) return null

  const formatIcons = {
    pdf: <PictureAsPdf />,
    excel: <TableChart />,
    csv: <TextFields />,
    json: <Code />,
  }

  const formatLabels = {
    pdf: "PDF Document",
    excel: "Excel Spreadsheet",
    csv: "CSV File",
    json: "JSON Data",
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <CloudDownload className="mr-2 text-blue-600" />
              Export Data
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>
          </div>

          <div className="space-y-6">
            {/* Export Range */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Export Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExportRange("all")}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center ${
                    exportRange === "all"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">All Data</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {totalCount} items
                  </div>
                  {exportRange === "all" && (
                    <Check className="text-blue-500 mt-2" />
                  )}
                </button>
                <button
                  onClick={() => setExportRange("selected")}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center ${
                    exportRange === "selected"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={selectedCount === 0}
                >
                  <div className="font-medium">Selected Only</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedCount} selected
                  </div>
                  {exportRange === "selected" && (
                    <Check className="text-blue-500 mt-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Format</h4>
              <div className="grid grid-cols-2 gap-3">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center ${
                      selectedFormat === format
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{formatIcons[format]}</div>
                    <div className="font-medium">{formatLabels[format]}</div>
                    <div className="text-xs text-gray-500 mt-1">. {format}</div>
                    {selectedFormat === format && (
                      <Check className="text-blue-500 mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Options</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    Include charts and graphs
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeSummary}
                    onChange={(e) => setIncludeSummary(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    Include summary statistics
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    Include date and time stamp
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
              >
                <CloudDownload className="mr-2" />
                Export Data
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
