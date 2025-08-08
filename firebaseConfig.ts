

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration.
// This is safe to be published on the client-side as it only contains public identifiers.
const firebaseConfig = {
  apiKey: "AIzaSyDwMX9zOZKqhIHOoIAtQyG_bFXJ6Znt9Fs",
  authDomain: "citadined60-4063b.firebaseapp.com",
  projectId: "citadined60-4063b",
  storageBucket: "citadined60-4063b.firebasestorage.app",
  messagingSenderId: "56934005010",
  appId: "1:56934005010:web:c77c78f01db774ec6d5bcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for use throughout the application
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);