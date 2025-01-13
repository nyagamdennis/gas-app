// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyProfile, selectMyProfile, updateMyProfile } from "../features/employees/myProfileSlice";
import { Link } from "react-router-dom";
import bluetick from "../components/media/bluetick.png";
import defaultProfile from "../components/media/default.png"

const MyProfilePage = () => {
  const dispatch = useAppDispatch();
  const myProfile = useAppSelector(selectMyProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_number: "",
    phone: "",
    alternative_phone: "",
    gender: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [frontIdImage, setFrontIdImage] = useState<File | null>(null);
  const [backIdImage, setBackIdImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (myProfile) {
      setFormData({
        first_name: myProfile.first_name || "",
        last_name: myProfile.last_name || "",
        id_number: myProfile.id_number || "",
        phone: myProfile.phone || "",
        alternative_phone: myProfile.alternative_phone || "",
        gender: myProfile.gender || "",
      });
    }
  }, [myProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "profile") setProfileImage(file);
    if (type === "front_id") setFrontIdImage(file);
    if (type === "back_id") setBackIdImage(file);
  };

  const handleSave = async () => {
    // Create a FormData object to handle both text and file inputs
    const submitData = new FormData();

    // Append form fields
    submitData.append("first_name", formData.first_name);
    submitData.append("last_name", formData.last_name);
    submitData.append("id_number", formData.id_number);
    submitData.append("phone", formData.phone);
    submitData.append("alternative_phone", formData.alternative_phone);
    submitData.append("gender", formData.gender);

    // Append images if they exist
    if (profileImage) {
      submitData.append("profile_image", profileImage);
    }
    if (frontIdImage) {
      submitData.append("front_id", frontIdImage);
    }
    if (backIdImage) {
      submitData.append("back_id", backIdImage);
    }

    try {
      // Dispatch the update action or make an API call directly
      const response = await dispatch(updateMyProfile(submitData)).unwrap();

      alert("Profile updated successfully!");
      console.log("Response:", response);

      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };


  return (
    <div className="min-h-screen min-w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-1 text-sm">Manage your profile information.</p>
        </div>
        <Link to="/sales" className="text-white underline">
          Back to Sales
        </Link>
      </div>

      {/* Content */}
      <div className="flex-grow p-6 flex flex-col items-center">
        {myProfile ? (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <div>
                <img
                  src={myProfile.profile_image || defaultProfile}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                {isEditing && (
                  <div className="mt-2">
                    <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700">
                      Upload Profile Image
                    </label>
                    <input
                      type="file"
                      id="profile_image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "profile")}
                      className="mt-1 block w-full text-sm text-gray-600"
                    />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center whitespace-nowrap space-x-1">
                  <div>
                    {formData.first_name} {formData.last_name}
                  </div>
                  {myProfile.verified && (<img className=" w-6 h-6 object-contain" src={bluetick} alt="bluetick" />)}


                </h2>
                <p className="text-gray-600">{myProfile.sales_team?.name || "No Sales Team Assigned"}</p>
              </div>
            </div>

            {/* ID Pictures */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">ID Pictures</h3>
              <div className="flex space-x-4">
                {/* Front ID */}
                <div>
                  <img
                    src={myProfile.front_id || "/default-front-id.png"}
                    alt="Front ID"
                    className="w-48 h-32 object-cover border border-gray-300 rounded-md"
                  />
                  {isEditing && (
                    <div className="mt-2">
                      <label htmlFor="front_id" className="block text-sm font-medium text-gray-700">
                        Upload Front ID
                      </label>
                      <input
                        type="file"
                        id="front_id"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "front_id")}
                        className="mt-1 block w-full text-sm text-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* Back ID */}
                <div>
                  <img
                    src={myProfile.back_id || defaultProfile}
                    alt="Back ID"
                    className="w-48 h-32 object-cover border border-gray-300 rounded-md"
                  />
                  {isEditing && (
                    <div className="mt-2">
                      <label htmlFor="back_id" className="block text-sm font-medium text-gray-700">
                        Upload Back ID
                      </label>
                      <input
                        type="file"
                        id="back_id"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "back_id")}
                        className="mt-1 block w-full text-sm text-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-6">
              {isEditing ? (
                <form className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-gray-700 font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-gray-700 font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      />
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="alternative_phone" className="block text-gray-700 font-medium">
                        Alternative Phone
                      </label>
                      <input
                        type="text"
                        id="alternative_phone"
                        name="alternative_phone"
                        value={formData.alternative_phone}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="id_number" className="block text-gray-700 font-medium">
                        id number
                      </label>
                      <input
                        type="text"
                        id="id_number"
                        name="id_number"
                        value={formData.id_number}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-gray-700 font-medium">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>

                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    <strong>First Name:</strong> {myProfile.first_name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Last Name:</strong> {myProfile.last_name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {myProfile.phone || "Not Provided"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Alternative Phone:</strong> {myProfile.alternative_phone || "Not Provided"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Id Number:</strong> {myProfile.id_number || "Not Provided"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Gender:</strong> {myProfile.gender || "Not Provided"}
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading profile...</p>
        )}
      </div>

      {/* Footer */}
      <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
        <Link className="hover:underline" to="/sales">
          Home
        </Link>
      </div>
    </div>
  );
};

export default MyProfilePage;
