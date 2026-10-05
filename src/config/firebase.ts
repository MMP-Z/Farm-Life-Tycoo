import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0a7RIW5BEVQC6MR5VuXHqA23IZC4SIY0",
  authDomain: "farm-life-tycoo.firebaseapp.com",
  projectId: "farm-life-tycoo",
  storageBucket: "farm-life-tycoo.firebasestorage.app",
  messagingSenderId: "26859678399",
  appId: "1:26859678399:web:77caebf473596d32a0740a",
  measurementId: "G-HYGSTLF23S"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out", error);
    throw error;
  }
};
