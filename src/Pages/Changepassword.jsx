import React, { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Navigate, useNavigate } from "react-router-dom";

function Changepassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        navigate("/profile");

        setMessage("Password changed successfully.");
      } else {
        setMessage("No user is currently signed in.");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage("The current password you provided is wrong.");
      } else if (error.code === "auth/requires-recent-login") {
        setMessage(
          "User needs to reauthenticate before updating the password."
        );
      } else if (error.code === "auth/user-mismatch") {
        setMessage("User credentials do not match.");
      } else {
        setMessage(error.message);
      }
    }
  };
  return (
    <>
      <div className="flex h-screen max-h-full flex-1 flex-col justify-center content-center px-6 py-12 lg:px-8">
        <div className="  card-border p-20 m-auto rounded-lg shadow-xl content-center">

          <div className="sm:mx-auto sm:w-full w-50 sm:max-w-sm">
            <h1 className="text-center main-color text-3xl font-bold leading-9 tracking-tight text-gray-900">
              Change Password
            </h1>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    placeholder="Current Password"
                    value={currentPassword}
                    type="password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50  placeholder-gray-800"
                  />
                  {/* <label className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Current Password
                </label> */}
                </div>
              </div>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50  placeholder-gray-800"
                  />
                  {/* <label className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  New Password
                </label> */}
                </div>
              </div>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50  placeholder-gray-800"
                  />
                  {/* <label className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Confirm Password
                </label> */}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center bg-color text-xl font-bold rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  UPDATE
                </button>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>

    </>
  );
}

export default Changepassword
