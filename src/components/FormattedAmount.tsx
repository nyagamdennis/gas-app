import React from "react"

interface FormattedAmountProps {
  amount: number
}

const FormattedAmount: React.FC<FormattedAmountProps> = ({ amount }) => {
  // Coerce to number to handle string inputs and preserve negative values (e.g., -2000)
  const numAmount = Number(amount) || 0

  // console.log("Formatting amount: ", numAmount)
  // Format the amount using Intl.NumberFormat (supports negatives natively)
  const formattedAmount = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(numAmount)

  // console.log("Formatted amount: ", formattedAmount)
  // Remove the currency symbol ("KES") prefix, keeping only the formatted number and sign
  const formattedWithoutSymbol = formattedAmount.replace("KES", "").trim()

  return <span>{`${formattedWithoutSymbol}`}</span>
}

export default FormattedAmount
