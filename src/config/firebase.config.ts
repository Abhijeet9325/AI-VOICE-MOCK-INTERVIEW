import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1j3wtTnW0CFFxHAJid5aHWVDyg5IlZd4",
  authDomain: "ai-interview-project-73e49.firebaseapp.com",
  projectId: "ai-interview-project-73e49",
  storageBucket: "ai-interview-project-73e49.firebasestorage.app",
  messagingSenderId: "1065780958827",
  appId: "1:1065780958827:web:85acea0849930a6b57c32e"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
