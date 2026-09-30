import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBzvuz5mu6ONdbA6yxDUWOi8Kf2w8_EAsc",
  authDomain: "school-learning-platform-3724e.firebaseapp.com",
  projectId: "school-learning-platform-3724e",
  storageBucket: "school-learning-platform-3724e.firebasestorage.app",
  messagingSenderId: "834872395484",
  appId: "1:834872395484:web:f58854a974f0f2afc8d619"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);