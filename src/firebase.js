import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAprGI70cv69zdLY71pZGLiUXUzcguPgRY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wiestrade.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wiestrade",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "wiestrade.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "440247174484",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:440247174484:web:0ea29c2843ff046803f4c1",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0YK33TVC5R",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;