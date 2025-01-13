/* eslint-disable prettier/prettier */
import React, { useState } from "react"
import { useAppSelector } from "../app/hooks"

const Profile: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setSelectedImage(URL.createObjectURL(selectedFile))
    }
  }
  return (
    <div>
      <div className="w-1/2 bg-slate-500 mx-auto rounded-md mb-4">
        <h1 className=" text-center text-lg font-semibold">
          {
          // @ts-ignore
          user?.username} Profile Update
        </h1>
      </div>
      <div className="w-1/2 bg-slate-500 mx-auto rounded-md ">
        <div>
          <form className="p-3 flex justify-center flex-col">
            <div className=" text-center flex justify-center">
              <label htmlFor="profilePicture" className="cursor-pointer">
                <div className="rounded-full bg-white w-20 h-20 items-center">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12l2-2 2 2M15 12l2-2 2 2"></path>
                    </svg>
                  )}
                </div>
                <div className="mt-2">Profile Picture</div>
              </label>
              <input
                type="file"
                id="profilePicture"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex flex-col p-4">
              <label>username</label>
              <input
                type="text"
                className=" text-black p-1 outline-none rounded-sm"
              />
              <label>First name</label>
              <input
                type="text"
                className=" text-black p-1 outline-none rounded-sm"
              />
              <label>last name</label>
              <input
                type="text"
                className=" text-black p-1 outline-none rounded-sm"
              />
              <label>phone number</label>
              <input
                type="tel"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                className=" text-black p-1 outline-none rounded-sm"
              />
              <label>Gender</label>
              <div className="flex gap-2">
                <input type="radio" name="age" value="male" />
                <label>Male</label>
                <br />
                <input type="radio" name="age" value="female" />
                <label>Female</label>
                <br></br>
              </div>
            </div>
            <button className=" bg-green-600 py-2">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
