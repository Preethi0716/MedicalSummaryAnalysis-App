import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
 
const firebaseConfig = {
    apiKey: "AIzaSyAtYoMyXYNwC5I9kecVL2WO4_u5Tb__Goo",
    authDomain: "medicalapp-8f518.firebaseapp.com",
    projectId: "medicalapp-8f518",
    storageBucket: "medicalapp-8f518.firebasestorage.app",
    messagingSenderId: "861890999195",
    appId: "1:861890999195:web:489699d976f4f49ed7273e",
    measurementId: "G-CPH6MGYF61"
  };
 
const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app)

export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No active user found.");

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) throw new Error("User data not found in Firestore.");

    return userDoc.data();
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw error;
  }
};