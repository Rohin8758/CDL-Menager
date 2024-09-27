import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  updateProfile,
  collection,
  getDocs,
  setDoc,
  doc,
  ref,
  uploadBytes,
  getDownloadURL,
  addDoc
} from "../firebase";
import { getStorage } from "firebase/storage";

function Signup() {
  const { register, handleSubmit } = useForm();
  const [companies, setCompanies] = useState([]);
  // const [userImage, setUserImage] = useState([]);
  // const [userUploadedImage, setUserUploadedImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companySnapshot = await getDocs(collection(db, "companies"));
        const companyList = companySnapshot.docs
          .filter((doc) => doc.data().isActive)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(companyList);
        setCompanies(companyList);
      } catch (error) {
        console.error("Error getting companies:", error);
      }
    };
    fetchCompanies();
  }, []);


  const onSubmit = async (data) => {
    console.log(data, "data");
    const { email, password, name, companyId, role, dotNumber } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(auth.currentUser, {
        displayName: name,
        // photoURL: userImage,
      });
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");
      await setDoc(doc(db, "users", user.uid), {
        companyId,
        role,
        isActivated: true,
        firstName,
        lastName,
        dotNumber,
        // password
        // Never store passwords in Firestore
        // id: user.uid,
        // imageUrl: userImage,
      });
      // await db.collection("users").doc(user.uid).set({
      //   companyId,
      //   role,
      //   isActivated: true,
      //   firstName,
      //   lastName,
      //   // password
      //   // id: user.uid,
      //   // imageUrl: userImage,
      // });
      // user.companyId = companyId
      // user.dotNumber = dotNumber
      // user.role = role
      console.log("User registered successfully:", user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isloggedIn", "true");
      // localStorage.setItem("user", companyId);
      window.location.reload()

      navigate("/dashborad");

    } catch (error) {
      console.error("Error registering user:", error);
      if (error.code === "auth/weak-password") {
        alert("The password provided is too weak.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("The account already exists for that email.");
      }
    }
  };

  // const handleImageSelection = async (event) => {
  // const file = event.target.files[0];
  // if (file) {
  // 
  // const storageRef = await storage.ref(file.name);

  // await storageRef.put(file);
  // const downloadURL = await storageRef.getDownloadURL();
  // setUserImage(downloadURL);
  // setUserUploadedImage(true);
  // console.log(file);
  // }
  // };

  return (
    <>
      <div className="flex h-screen max-h-fit flex-1 flex-col justify-center content-center px-6 py-12 lg:px-8">
        <div className="card-border w-fit m-auto p-5 rounded-lg shadow-xl">
          <div className="sm:mx-auto sm:w-full w-50 sm:max-w-sm">
            <h1 className="text-center main-color text-4xl font-bold leading-9 tracking-tight text-gray-900">
              SIGN UP
            </h1>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    placeholder="Email Address"
                    type="email"
                    required
                    {...register("email")}
                    className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder-gray-800"
                  />
                  {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-400 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[14px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Email Address
                </label> */}
                </div>
              </div>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    placeholder="Full Name"
                    {...register("name")}
                    className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 placeholder-gray-800 disabled:bg-blue-gray-50 "
                    required
                  />
                  {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-400 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[14px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Full Name
                </label> */}
                </div>
              </div>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <select placeholder="Role" className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4  font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder-gray-700" {...register("role")} required>
                    <option value="" c disabled selected>Role</option>

                    <option value="Driver">Driver</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-400 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[14px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Role
                </label> */}
                </div>
              </div>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-400 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[14px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Company
                </label> */}
                  <select placeholder="Company" className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 " {...register("companyId")} required>
                    <option value="" disabled selected hidden>Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}

                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    {...register("dotNumber")}
                    placeholder="Dot Number"
                    className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder-gray-800"
                  />
                  {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-400 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[14px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Dot Number
                </label> */}
                </div>
              </div>
              <div>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    {...register("password")}
                    placeholder="Password"
                    type="password"
                    className="peer  h-full w-full border-b border-blue-gray-200 text-bold bg-transparent pt-4 pb-1.5 font-sans text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder-gray-800 "
                  />
                  {/* <label className="after:content[''] text-filed text-xxl font-medium pointer-events-none text-bold absolute left-0 text-lg font-medium leading-6 text-gray-400 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[14px] font-normal leading-tight text-gray-1000 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500  peer-focus:leading-tight peer-focus:text-gray-400  peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Password
                </label> */}
                </div>
              </div>
              <div>
                {/* <div className="relative h-11 w-full min-w-[200px]">
                <div class="file-upload">
                  <div class="file-select">
                    <div class="file-select-button" id="fileName">Choose File</div>
                    <div class="file-select-name" id="noFile">No file chosen...</div>
                    <input type="file" name="chooseFile" onChange={handleImageSelection} id="chooseFile" />
                  </div>
                </div>
              </div> */}
              </div>
              <p className="mt-10 text-center text-sm text-gray-500">
                By clicking SIGN UP, you agree to our{""}
                <a
                  href="#"
                  className="font-semibold leading-6 main-color underline"
                >
                  Terms and Conditions
                </a>
                and that you have read our
                <a
                  href="#"
                  className="font-semibold leading-6 main-color underline"
                >
                  Privacy Policy
                </a>
              </p>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center bg-color text-xl font-bold rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  SIGN UP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
