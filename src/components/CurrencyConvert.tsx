/* eslint-disable prettier/prettier */
// import React from 'react'

// const CurrencyConvert = () => {
//   return (
//     <div>CurrencyConvert</div>
//   )
// }

// export default CurrencyConvert



import React from 'react';

interface PriceProps {
  price: number;
}

const CurrencyConvert: React.FC<PriceProps> = ({ price }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KSH',
  }).format(price);

  return <span>{formattedPrice}</span>;
};

export default CurrencyConvert;
