// @ts-nocheck
import React, { useState } from "react";
import AdminsFooter from "../components/AdminsFooter";
import AdminNav from "../components/ui/AdminNav";

const Settings = () => {
  const [businessName, setBusinessName] = useState("My Business");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const currentPlan = "Pro"; // Ideally this comes from Redux or API

  const handleLogoChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav
        headerMessage="Manage Your Business"
        headerText="Manage it like a pro"
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Business Settings</h2>

        <form className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block"
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Business Logo Preview"
                className="mt-3 h-20 object-contain"
              />
            )}
          </div>

          {/* Current Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Plan
            </label>
            <div className="text-gray-800 font-semibold">{currentPlan}</div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Save Settings
          </button>
        </form>
      </main>

      <footer className="bg-gray-100 mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  );
};

export default Settings;
