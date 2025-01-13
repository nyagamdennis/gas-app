/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { addSalesTeam } from '../features/salesTeam/salesTeamSlice';

const CreateTeam = () => {
    const dispatch = useAppDispatch();

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [teamName, setName] = useState('')

    // const fileInput = document.getElementById("profilePicture") as HTMLInputElement;
    // const file = fileInput.files?.[0];

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            setSelectedImage(URL.createObjectURL(selectedFile))
        }
    }


    const handleSaveClick = async (e:any) => {
        e.preventDefault()
        const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    const file = fileInput.files?.[0];
        // Dispatch the updateStock action instead of calling handleStockUpdate
        dispatch(
          addSalesTeam({
            // @ts-ignore
            profile_image: file,
            name: teamName
          }),
        )
        // setIsEditing(false)
      }

    return (
        <div className='mt-5 mx-3'>
            <div className=' bg-slate-300'>
                <form className=' text-center flex justify-center items-center flex-col text-black py-2 'encType="multipart/form-data">
                    <div className=" text-center flex justify-center items-center ">
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
                            <div className="  text-lg">Profile Picture</div>
                        </label>
                        <input required
                            type="file"
                            id="profilePicture"
                            accept="image/jpeg,image/png,image/gif"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        
                    </div>
                    <div>
                        <label className=' mx-2'>Team Name</label>
                        <input type='text' className=' outline-none px-2'
                        required
                        value={teamName}
                        onChange={(e) => setName(e.target.value)} />
                    </div>
                    <button className=' mt-3 bg-slate-800 text-white font-bold px-4 py-1 rounded-lg' onClick={handleSaveClick}>Add</button>
                </form>
            </div>
        </div>
    )
}

export default CreateTeam