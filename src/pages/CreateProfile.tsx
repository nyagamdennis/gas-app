// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createMyProfile, fetchMyProfile, selectMyProfile } from "../features/employees/myProfileSlice";
import { Link, useNavigate } from "react-router-dom";
import bluetick from "../components/media/bluetick.png";
import defaultProfile from "../components/media/default.png";

const CreateProfile = () => {
    const dispatch = useAppDispatch();
    const myProfile = useAppSelector(selectMyProfile);
    const navigate = useNavigate();

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

    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [frontIdImagePreview, setFrontIdImagePreview] = useState<string | null>(null);
    const [backIdImagePreview, setBackIdImagePreview] = useState<string | null>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === "profile") {
                setProfileImage(file);
                setProfileImagePreview(URL.createObjectURL(file));
            }
            if (type === "front_id") {
                setFrontIdImage(file);
                setFrontIdImagePreview(URL.createObjectURL(file));
            }
            if (type === "back_id") {
                setBackIdImage(file);
                setBackIdImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSave = async () => {
        const submitData = new FormData();

        // Append form fields
        Object.keys(formData).forEach((key) => {
            submitData.append(key, formData[key as keyof typeof formData]);
        });

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
            const response = await dispatch(createMyProfile(submitData)).unwrap();
            alert("Profile created successfully!");
            navigate("/myprofile")
            console.log("Response:", response);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to create profile:", error);
            alert("An error occurred while creating the profile.");
        }
    };

    return (
        <div className="min-h-screen min-w-full bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Profile</h1>
                    <p className="mt-1 text-sm">Complete your profile information.</p>
                </div>
                <Link to="/sales" className="text-white underline">
                    Back to Sales
                </Link>
            </div>

            {/* Content */}
            <div className="flex-grow p-6 flex flex-col items-center">
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                    <form className="space-y-4">
                        {/* Profile Image */}
                        <div>
                            <label className="block text-gray-700 font-medium">Profile Image</label>
                            <img
                                src={profileImagePreview || defaultProfile}
                                alt="Profile Preview"
                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, "profile")}
                                className="mt-2 block w-full text-sm text-gray-600"
                            />
                        </div>

                        {/* ID Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Front of ID</label>
                                <img
                                    src={frontIdImagePreview || defaultProfile}
                                    alt="Front ID Preview"
                                    className="w-full h-32 object-cover border-2 border-gray-200"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, "front_id")}
                                    className="mt-2 block w-full text-sm text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Back of ID</label>
                                <img
                                    src={backIdImagePreview || defaultProfile}
                                    alt="Back ID Preview"
                                    className="w-full h-32 object-cover border-2 border-gray-200"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, "back_id")}
                                    className="mt-2 block w-full text-sm text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Alternative Phone</label>
                                <input
                                    type="text"
                                    name="alternative_phone"
                                    value={formData.alternative_phone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>

                        </div>

                        <div>
                            <div>
                                <div>
                                    <label className="block text-gray-700 font-medium">Id Number</label>
                                    <input
                                        type="text"
                                        name="id_number"
                                        value={formData.id_number}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                    />
                                </div>
                            </div>
                            <label className="block text-gray-700 font-medium">Gender</label>
                            <select
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
                    </form>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
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

export default CreateProfile;
