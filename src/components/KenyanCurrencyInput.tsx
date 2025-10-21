import React, { useState } from "react";

const KenyanCurrencyInput = ({ value, onChange, placeholder }: any) => {
  const [formattedValue, setFormattedValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
    if (!isNaN(Number(rawValue))) {
      const formatted = new Intl.NumberFormat("en-KE").format(Number(rawValue)); // Format as Kenyan currency
      setFormattedValue(formatted);
      onChange(rawValue); // Pass the raw value (without commas) to the parent
    }
  };

  return (
    <input
      type="text"
      value={formattedValue || value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    />
  );
};

export default KenyanCurrencyInput;