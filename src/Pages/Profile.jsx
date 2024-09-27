import React, { useEffect, useState } from 'react'
import { SlArrowRight } from "react-icons/sl";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../Componets/Navbar';
import { auth, storage, updateProfile,doc,db,updateDoc } from '../firebase';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// import profile from './profile.png';

function Profile() {

    const isimageURL = JSON.parse(localStorage.getItem('user'))?.photoURL


    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [image, setImage] = useState("")
    const [selectedImage, setSelectedImage] = useState();
    const navigate = useNavigate();

    let user = localStorage.getItem('user')

    if (user) {
        user = JSON.parse(user)
    }

    // const isimageURL = user?.photoURL
    const getname = user?.displayName

    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const storageRef = ref(storage, file.name);
            await uploadBytes(storageRef, file);
            //start loader
            const downloadURL = await getDownloadURL(storageRef);
            // end loader 
            console.log(downloadURL)
            setSelectedImage(downloadURL);
            const user = auth.currentUser;
            if (user) {
                try {

                    await updateProfile(user, { photoURL: downloadURL });
                    const userDocRef = doc(db, "users", user?.uid);
                    await updateDoc(userDocRef, {
                        imageUrl: downloadURL
                      });
                
                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.reload()

                    toast.success("update profile successfully!");
                } catch (error) {
                    console.error("Error updating profile", error);
                }
            }
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            localStorage.clear();
            console.log('User signed out');
            navigate("/login");
            window.location.reload()

        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-h-full flex-1 flex-col justify-center content-center px-6 py-12 lg:px-8">
                <h1 className='font-bold text-3xl'>Profile</h1>
                <div className="profile-pic pt-5">
                    {isimageURL ?
                        <img src={isimageURL} alt="Profile" class="profile-picture" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                        :
                        <img style={{ width: '100px', height: '100px', borderRadius: '50%' }} src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1718795593~exp=1718799193~hmac=19f5df7027682d16b18ce8503b5140c6b59bbfea40291d37ec96bb0b3ec87b10&w=740" alt="" />
                    }
                    <div class="fileUpload">
                        <input type="file" class="upload" accept="image/*" onChange={handleImageChange} />
                        <span><i class="bi text-xl bi-pencil-square"></i></span>
                    </div>
                </div>
                <div className="profile-info">
                    <h2 className='font-bold '>{getname}</h2>
                    <p>Azim Cargo Driver</p>
                </div>
                <ul className="profile-menu ">
                    <li href="#">
                        <Link to="/update-profile">Edit Profile </Link>
                    </li>
                    <li>
                        <Link to="/Change-password">Change Password</Link>
                    </li>
                    <li>
                        <Link to="#">Terms &amp; Conditions</Link>
                    </li>
                    <li>
                        <Link to="#">Privacy &amp; Policy</Link>
                    </li>
                    <li className="push-notifications">
                        <span className='push-notifications'>Push Notifications</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round" />
                        </label>
                    </li>
                    <li>
                        <a href="#" className='mt-5' onClick={() => setIsDialogOpen(true)}>Log Out</a>
                    </li>
                </ul>
                {isDialogOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3 className="font-bold text-xl">Logout</h3>
                            <p>Are you sure you want to logout?</p>
                            <button className="yes" onClick={handleSignOut}>Yes</button>
                            <button className="no" onClick={() => setIsDialogOpen(false)}>No</button>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Profile