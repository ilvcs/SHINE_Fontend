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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
