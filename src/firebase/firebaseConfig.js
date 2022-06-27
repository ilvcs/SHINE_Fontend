import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import * as analytics from "firebase/analytics";
import "firebase/analytics";
let app = null;
let functions = null;
let auth = null;
let db = null;
let storage = null;
const firebaseConfig = {
  apiKey: "AIzaSyCv2XVqSqKGWFN_qJ_Xevl5bIKgue2VC3o",
  authDomain: "shine-38d71.firebaseapp.com",
  projectId: "shine-38d71",
  storageBucket: "shine-38d71.appspot.com",
  messagingSenderId: "286854755944",
  appId: "1:286854755944:web:99eca9121a6b7270a6eddd",
  measurementId: "G-Z1EH0H7Q6M",
};

// We only initialize if the app hasn't initialized
// to avoid nessesry revalidatin.
try {
  // Initialize Firebase
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  functions = getFunctions(app);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (!!analytics && analytics.isSupported()) {
    getAnalytics(app);
  }
} catch (error) {
  console.log(error.message);
}

export { app, auth, db, functions, storage };
