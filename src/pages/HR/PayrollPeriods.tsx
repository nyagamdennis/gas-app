// @ts-nocheck
import React, { useEffect, useState } from 'react'
import api from '../../../utils/api'

const PayrollPeriods = () => {
    const [periods, setPeriods] = useState([])
    useEffect(() => {
      api.get("/payroll/periods/").then((res) => setPeriods(res.data))
    }, [])


    // Advanced Features
      const [batchMode, setBatchMode] = useState(false)
      const [selectedBatchItems, setSelectedBatchItems] = useState([])
      const [lastUpdated, setLastUpdated] = useState(null)
      const [autoRefresh, setAutoRefresh] = useState(false)
      const [realTimeEnabled, setRealTimeEnabled] = useState(false)
      const [dataVersion, setDataVersion] = useState(0)
    
      
    const generatePayslips = (id) => {
      api.post(`/payroll/periods/${id}/generate/`).then(() => {
        // refresh list or show toast
      })
    }
  return (
    <div>
      {periods.map((p) => (
        <div key={p.id}>
          {p.period_label} - {p.status}
          {p.status === "DRAFT" && (
            <button onClick={() => generatePayslips(p.id)}>Generate</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default PayrollPeriods