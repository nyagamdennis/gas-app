/* eslint-disable prettier/prettier */
import React, { useState } from "react";

const AddProductBrand = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");

  const handleBrandChange = (event:any) => {
    setSelectedBrand(event.target.value);
  };

  const handleCustomBrandChange = (event:any) => {
    setCustomBrand(event.target.value);
  };

  const handleFormSubmit = (event:any) => {
    event.preventDefault();
    const finalBrand = customBrand || selectedBrand;
    // Do something with the selected or custom brand
    console.log("Selected Brand:", finalBrand);
    // Clear the customBrand input
    setCustomBrand("");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} className=" flex gap-1">
        <select name="brand" value={selectedBrand} onChange={handleBrandChange}>
          <option value="">K-Gas</option>
          <option value="volvo">Pro-Gas</option>
          <option value="saab">Harshi</option>
        </select>
        <input
          type="text"
          placeholder="Enter Custom Brand"
          value={customBrand}
          onChange={handleCustomBrandChange}
        />
        <select name="brand" value={selectedBrand} onChange={handleBrandChange}>
          <option value="">23Kg</option>
          <option value="volvo">12Kg</option>
          <option value="saab">18Kg</option>
        </select>
        <input type="text" placeholder="kg" />
        <button className=" text-white bg-blue-800 px-4 py-1 ms-2 rounded-md" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProductBrand;
