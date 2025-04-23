// @ts-nocheck
import React, { useState } from 'react';
import Login from '../components/Login';
import { selectIsAuthenticated } from '../features/auths/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addSalesTeam } from '../features/salesTeam/salesTeamSlice';
import AdminsFooter from '../components/AdminsFooter';

const CreateTeamPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [teamName, setName] = useState('');
  const [teamType, setTeamType] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSelectedImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    const file = fileInput.files?.[0];

    dispatch(
      addSalesTeam({
        profile_image: file,
        name: teamName,
        type: teamType,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {isAuthenticated ? (
        <>
          {/* Header */}
          <header className="px-6 py-6 bg-white border-b border-gray-200 shadow-sm">
            <h1 className="text-4xl font-extrabold tracking-tight">Create New Team</h1>
            <p className="text-sm text-gray-500 mt-1">Upload a team profile and assign its type</p>
          </header>
          
          <div>
          <h1>All other teams.</h1>
          </div>
          {/* Main */}
          <main className="flex-grow flex justify-center items-center py-10">
            
            <form
              className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl p-8 space-y-6"
              encType="multipart/form-data"
              onSubmit={handleSaveClick}
            >
              {/* Image Upload */}
              <div className="flex flex-col items-center">
                <label htmlFor="profilePicture" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v14M5 12l2-2 2 2M15 12l2-2 2 2"
                        />
                      </svg>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <span className="text-sm text-gray-500 mt-2">Upload Team Image</span>
              </div>

              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  value={teamName}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Team Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value)}
                  required
                >
                  <option value="">-- Select Team Type --</option>
                  <option value="Retail Shop">Retail Shop</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg shadow hover:bg-blue-700 transition focus:ring-4 focus:ring-blue-300"
              >
                Add Team
              </button>
            </form>
          </main>

          {/* Footer */}
          <AdminsFooter />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default CreateTeamPage;
