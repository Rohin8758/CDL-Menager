import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCdC5KwOxWvKxfdYs4U_I9nh4O_vPYQ4cA",
  authDomain: "shout-45dd4.firebaseapp.com",
  databaseURL: "https://shout-45dd4.firebaseio.com",
  projectId: "shout-45dd4",
  storageBucket: "shout-45dd4.appspot.com",
  messagingSenderId: "343548189133",
  appId: "1:343548189133:web:3eed80097d4293d8b88c84"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, collection, getDocs, doc, updateDoc, setDoc, ref, uploadBytes, getDownloadURL, getDoc };