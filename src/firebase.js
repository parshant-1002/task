import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyCWxn2Vn-dgwOH24ab0tiUr3fZs3V8wMh4",
 authDomain: "slack-f9265.firebaseapp.com",
  databaseURL: "https://slack-f9265-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "slack-f9265",
 storageBucket: "slack-f9265.appspot.com",
 messagingSenderId: "650810530715",

  appId: "1:650810530715:web:c84597301ff3469fc5df3e",

  measurementId: "G-5RG2D69CRX"

};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
