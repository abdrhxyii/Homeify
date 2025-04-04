// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAh2Clip0Qiya-t28AhTPpJGSeLUB-RzQ",
  authDomain: "homeifye.firebaseapp.com",
  projectId: "homeifye",
  storageBucket: "homeifye.firebasestorage.app",
  messagingSenderId: "735501952844",
  appId: "1:735501952844:web:747978a733353d129111e9",
  measurementId: "G-VQNTHFPXBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export {auth, googleProvider, signInWithPopup}