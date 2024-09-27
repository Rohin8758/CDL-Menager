import React from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db, signInWithEmailAndPassword,  } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  //* function for signing in
  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      let user = userCredential.user;
      let userDoc = await getDoc(doc(db, "users", user.uid))

      if(userDoc){
        userDoc = userDoc.data()
        user = {...user,...userDoc}
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isloggedIn", "true"); // Store as a string  

      toast.success("Signed in successfully!");
      navigate("/dashboard"); 
      window.location.reload()
    } catch (error) {
      handleSignInError(error);
    } finally {
      setIsSigningIn(false); // Ensure this runs whether sign-in succeeds or fails
    }
  };

  const resetemail = () => {
    localStorage.setItem("email", email);
  }

  const handleSignInError = (error) => {
    if (error.code === "auth/user-not-found") {
      toast.error("No user found for that email. Please create an account.");
    } else if (["auth/wrong-password", "auth/invalid-credential"].includes(error.code)) {
      toast.error("Wrong password provided.");
    } else {
      console.error("Error signing in:", error);
      toast.error("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen">
        <div className="card-border w-fit m-auto mt-10 rounded-lg shadow-xl">
          <div className="flex pt-10 justify-center">
            <img width={"200px"} src={require("../assets/logo.png")} />
          </div>
          <div className="fle max-h-full flex-1 flex-col justify-center content-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full w-50 sm:max-w-sm">
              <h1 className="text-center main-color text-4xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome to CDL ExpressWay
              </h1>
              <h3 className="text-lg text-gray-400">Team Communication</h3>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder-gray-800"
                    />
                    {/* <label className="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Email
                  </label> */}
                  </div>
                </div>
                <div>
                  <div className="relative h-11 w-full min-w-[200px]">
                    <input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder-gray-800"
                    />
                    {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Password
                  </label> */}
                  </div>
                </div>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    onClick={resetemail}
                    className="font-semibold  text-gray-400 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="flex w-full justify-center bg-color text-xl font-bold rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {/* {isSigningIn ? 'Signing In...' : 'Sign In'} */}
                    SIGN IN
                  </button>
                  <Link to="/signup">
                    <h1 className="my-5 font-semibold  text-gray-400 hover:text-indigo-500">
                      SIGN UP FOR AN ACCOUNT
                    </h1>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
