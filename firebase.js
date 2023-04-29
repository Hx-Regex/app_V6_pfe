// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOb65Y0TrjUSe5hmZKIHZbQ-b3HsvwOWI",
  authDomain: "fir-auth-76eb8.firebaseapp.com",
  databaseURL: "https://fir-auth-76eb8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-auth-76eb8",
  storageBucket: "fir-auth-76eb8.appspot.com",
  messagingSenderId: "590823849142",
  appId: "1:590823849142:web:a3ec44ab059a7135bb3a17"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestoreDB = getFirestore(app);
const auth = getAuth(app);

export { db, auth ,firestoreDB };