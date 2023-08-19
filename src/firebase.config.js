// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtoxIp2e6HHUU5CUrGbOFN1udw4Eld-Qc",
  authDomain: "house-marketplace-app-2b760.firebaseapp.com",
  projectId: "house-marketplace-app-2b760",
  storageBucket: "house-marketplace-app-2b760.appspot.com",
  messagingSenderId: "782013881521",
  appId: "1:782013881521:web:06be8027305655a8861690"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();