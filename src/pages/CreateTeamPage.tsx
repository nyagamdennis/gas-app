// @ts-nocheck
import React, { useState } from 'react';
import LeftNav from '../components/ui/LeftNav';
import NavBar from '../components/ui/NavBar';
import Login from '../components/Login';
import { selectIsAuthenticated } from '../features/auths/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addSalesTeam } from '../features/salesTeam/salesTeamSlice';

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
    <div className="h-screen bg-gray-100">
      {isAuthenticated ? (
        <div className="flex h-full overflow-hidden">
          {/* Left Navigation */}
          <aside className="w-1/6 bg-gray-900 text-white">
            <LeftNav />
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            <NavBar />

            <div className="flex justify-center items-center mt-10">
              <form
                className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-6"
                encType="multipart/form-data"
                onSubmit={handleSaveClick}
              >
                <div className="flex flex-col items-center">
                  <label htmlFor="profilePicture" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-gray-500"
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
                  <span className="text-gray-600 text-sm mt-2">Upload Profile Picture</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Team Name</label>
                  <input
                    type="text"
                    className=" px-2 py-0.5 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={teamName}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">Team Type</label>
                  <input
                    type="text"
                    className=" py-0.5 px-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={teamType}
                    onChange={(e) => setTeamType(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                >
                  Add Team
                </button>
              </form>
            </div>
          </main>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default CreateTeamPage;
