import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
// import { database } from "./FirebaseConfig"

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const recoverPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      // alert("Your password reset link has been sent to your email");
      toast.success("Check your email");
      // navigate("/");

    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      let errorMessage = error.message;
      if (error.code === "auth/user-not-found") {
        errorMessage = "User is not registered";
      }
      alert(errorMessage);
    }
  };
  // let [email, setEmail] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // 
  // const recoverPassword = async () => {
  // setIsSubmitting(true);
  // try {
  // await auth.sendPasswordResetEmail(email);
  // Replace with your navigation logic to handle success
  // alert("Your password reset link has been sent to your email");
  // } catch (error) {
  // console.error("Error sending password reset email:", error.message);
  // let errorMessage = error.message;
  // if (error.code === "auth/user-not-found") {
  // errorMessage = "User is not registered";
  // }
  // alert(errorMessage);
  // } finally {
  // setIsSubmitting(false);
  // }
  // };
  // useEffect(() => {
  // 
  // email = localStorage.getItem("email");
  // setEmail(email)
  // 
  // }, [])
  // 
  // console.log(email);
  // 
  // const recoverPassword = async (e) => {
  // e.preventDefault()
  // 
  // const email = e.target.value;
  // sendPasswordResetEmail(auth, email).then(data => {
  // alert("check your email")
  // console.log(email);
  // 
  // }).catch(err => {
  // alert(err.code)
  // })
  // 
  // }

  return (
    <>
      <ToastContainer />
      <div className=" grid h-screen content-center">
        <div className="  card-border p-20 m-auto rounded-lg shadow-xl content-center">
          <div class="flex pt-10 justify-center">
            <img width={"300px"} src={require("../assets/logo.png")} />
          </div>
          <div className="fle max-h-full flex-1 flex-col justify-center content-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  // e.preventDefault();
                  recoverPassword(e);
                }}
              >
                <div>
                  <div class="relative h-11 w-full min-w-[200px]">
                    <input
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      class="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50  placeholder-gray-800"
                      required
                    />
                    {/* <label class="after:content[''] text-filed font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-500 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[13px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 placeholder-gray-800">
                    Email Address
                  </label> */}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    // disabled={isSubmitting}
                    className="flex w-full justify-center bg-color text-xl font-bold rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {/* {isSubmitting ? 'Submitting...' : 'Recover Password'} */}Recover Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Forgotpassword
