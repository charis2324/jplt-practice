import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const signInAnonymouslyWithFirebase = () => {
  return signInAnonymously(auth)
    .then(() => {
      console.log("User signed in anonymously");
      return auth.currentUser;
    })
    .catch((error) => {
      console.error("Anonymous sign-in error", error.code, error.message);
      throw error;
    });
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};