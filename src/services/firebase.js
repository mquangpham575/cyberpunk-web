import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkOsrmucmoCXpV26SXQeIstaVeUULJJLU",
  authDomain: "lab1-dpt.firebaseapp.com",
  projectId: "lab1-dpt",
  storageBucket: "lab1-dpt.firebasestorage.app",
  messagingSenderId: "555670765476",
  appId: "1:555670765476:web:15028c87a427374bec4b31",
  measurementId: "G-S5YXEYR52Z",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
