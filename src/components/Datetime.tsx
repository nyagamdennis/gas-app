// @ts-nocheck
import React from 'react'

const Datetime = ({ date, showTime = false }) => {
    const d = new Date(date)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    const formattedDate = d.toLocaleDateString(undefined, options)
  return (
    <>
    {formattedDate} {showTime && <>@ {d.toLocaleTimeString()}</>}
  </>
  )
}

export default Datetime