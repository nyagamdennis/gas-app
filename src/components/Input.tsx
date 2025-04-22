// @ts-nocheck
import React from 'react'




// const Input = () => {
//     return (
      
//     );
//   };

const Input = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
          min={type === 'number' ? 0 : undefined}
        />
      </div>
  )
}

export default Input