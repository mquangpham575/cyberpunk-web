import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
const auth = getAuth(app);

export { auth };
