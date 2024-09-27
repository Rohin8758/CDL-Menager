import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; // Ensure to import your Firebase instance
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


function Updateprofile() {
    // const [email, setEmail] = useState('');
    // const [fullName, setFullName] = useState('');
    // const [password, setPassword] = useState('');
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user's data on component mount
        const currentUser = auth.currentUser;
        if (currentUser) {
            setEmail(currentUser.email || '');
            setFullName(currentUser.displayName || '');
        }
    }, []);


    const handleUpdateProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await updateProfile(user, { displayName: fullName });
                await updateEmail(user, email);
                console.log("user", user);
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/profile");

                toast.success("Signed in successfully!");

                // alert("Profile updated successfully");//need to add tostify
                // need to navigate on profirle page
            } catch (error) {
                console.error("Error updating profile", error);
            }
        }
    };
    console.log("user", email, fullName);

    return (
        <>
            <ToastContainer />
            <div className="flex  max-h-full h-screen flex-1 flex-col justify-center content-center px-6 py-12 lg:px-8">
                <div className="  card-border p-20 m-auto rounded-lg shadow-xl content-center">

                    <div className="sm:mx-auto sm:w-full w-50 sm:max-w-sm">
                        <h1 className="text-center main-color text-3xl font-bold leading-9 tracking-tight text-gray-900">
                            Edit Profile
                        </h1>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form
                            className="space-y-6"
                            noValidate
                            autoComplete="off"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateProfile();
                            }}
                        >
                            <div>
                                <div className="relative h-11 w-full min-w-[200px]">
                                    <input
                                        placeholder=""
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50  placeholder-gray-800"
                                    />
                                    {/* <label className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Email Address
                                </label> */}
                                </div>
                            </div>
                            <div>
                                <div className="relative h-11 w-full min-w-[200px]">
                                    <input
                                        placeholder=""
                                        className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50  placeholder-gray-800"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    {/* <label
                                    type="text"

                                    className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                                >
                                    Full Name
                                </label> */}
                                </div>
                            </div>
                            {/* <div>
                        <div className="relative h-11 w-full min-w-[200px]">
                        <input placeholder=""
                        className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                                className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Company
                                </label>
                                </div>
                                </div>
                                <div>
                                <div className="relative h-11 w-full min-w-[200px]">
                                <input placeholder=""
                                className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                                <label
                                className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Role
                                </label>
                                </div>
                                </div>
                                <div>
                                <div className="relative h-11 w-full min-w-[200px]">
                                <input placeholder=""
                                className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                                <label
                                className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Dot Number
                                </label>
                                </div>
                                </div> */}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center bg-color text-xl font-bold rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    UPDATE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Updateprofile;
