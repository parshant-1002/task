import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyD8awnumo5566d5FY8BPSgGPvv5AODDrAk",

  authDomain: "automation-9122d.firebaseapp.com",

  databaseURL: "https://automation-9122d-default-rtdb.firebaseio.com",

  projectId: "automation-9122d",

  storageBucket: "automation-9122d.appspot.com",

  messagingSenderId: "1072831635727",

  appId: "1:1072831635727:web:72e6ce49815401d5ce1e7a",

  measurementId: "G-7JLZ5MVLFT"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

