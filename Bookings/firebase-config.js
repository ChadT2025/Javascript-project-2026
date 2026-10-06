// firebase-config.js (Bookings folder)
// All three imports use the SAME Firebase version (11.0.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// IMPORTANT: copy apiKey and appId from your existing file.
// I couldn't read them reliably from the photo, so don't trust these placeholders.
const firebaseConfig = {
  apiKey: "AIzaSyBzvuz5mu6ONdbA6yxDUWOi8Kf2w8_EAsc",
  authDomain: "school-learning-platform-3724e.firebaseapp.com",
  projectId: "school-learning-platform-3724e",
  storageBucket: "school-learning-platform-3724e.firebasestorage.app",
  messagingSenderId: "834872395484",
  appId: "1:834872395484:web:f58854a974f0f2afc8d619",
  measurementId: "G-VDS4EX09ER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // NEW: lets Firestore know who is logged in
