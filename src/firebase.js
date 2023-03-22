// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWxn2Vn-dgwOH24ab0tiUr3fZs3V8wMh4",
  authDomain: "slack-f9265.firebaseapp.com",
  projectId: "slack-f9265",
  storageBucket: "slack-f9265.appspot.com",
  messagingSenderId: "650810530715",
  appId: "1:650810530715:web:c84597301ff3469fc5df3e",
  measurementId: "G-5RG2D69CRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;