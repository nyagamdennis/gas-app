import React from 'react'

const DateDisplay = ({date}: {date:string}) => {
    if (!date) return <span>N/A</span>; // Handle missing dates

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return <span>{formattedDate}</span>;
}

export default DateDisplay