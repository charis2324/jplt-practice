import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBNSBt8mMbvH7Qy0CLcPwdwvgYnVWoBGfs",
  authDomain: "jlpt-practice-9db97.firebaseapp.com",
  projectId: "jlpt-practice-9db97",
  storageBucket: "jlpt-practice-9db97.appspot.com",
  messagingSenderId: "418146694157",
  appId: "1:418146694157:web:4c2f0a7b66884c9c5d5144",
  measurementId: "G-J8FL47EMCF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);