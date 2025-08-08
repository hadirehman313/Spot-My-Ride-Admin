import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdTxZ4s931eG0M0ZOW_Rf4sQzgOYAVEts",
  authDomain: "spot-my-ride.firebaseapp.com",
  projectId: "spot-my-ride",
  storageBucket: "spot-my-ride.appspot.com",
  messagingSenderId: "225557833166",
  appId: "1:225557833166:web:909066c6061a35a508779f",
  measurementId: "G-SGRCHCPRMW",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const storage = getStorage(app);
