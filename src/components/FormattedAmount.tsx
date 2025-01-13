import React from 'react';

interface FormattedAmountProps {
  amount: number;
}

const FormattedAmount: React.FC<FormattedAmountProps> = ({ amount }) => {
  // Format the amount using Intl.NumberFormat
  const formattedAmount = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);

  // Remove the currency symbol ("KES") prefix, keeping only the formatted number
  const formattedWithoutSymbol = formattedAmount.replace('KES', '').trim();

  return <span>{`${formattedWithoutSymbol}`}</span>;
};

export default FormattedAmount;
