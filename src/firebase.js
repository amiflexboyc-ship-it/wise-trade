import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAprGI70cv69zdLY71pZGLiUXUzcguPgRY",
  authDomain: "wiestrade.firebaseapp.com",
  projectId: "wiestrade",
  storageBucket: "wiestrade.firebasestorage.app",
  messagingSenderId: "440247174484",
  appId: "1:440247174484:web:0ea29c2843ff046803f4c1",
  measurementId: "G-0YK33TVC5R",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;