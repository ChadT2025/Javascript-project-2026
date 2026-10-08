// Connecting Firebase database connection
import { db, auth } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const welcomeName = document.querySelector("#welcomeName");
const pendingCount = document.querySelector("#pendingCount");
const reviewedCount = document.querySelector("#reviewedCount");

// Loads the bookings from firebase and counts pending and reviewed
async function loadOverview() {
  const snapshot = await getDocs(collection(db, "bookings"));

  let pending = 0;
  let reviewed = 0;

  for (const docSnap of snapshot.docs) {
    const booking = docSnap.data();

    if (booking.status === "pending") {
      pending = pending + 1;
    } else {
      reviewed = reviewed + 1;
    }
  }

  pendingCount.innerText = pending;
  reviewedCount.innerText = reviewed;
}

// Shows the logged in user's name in the welcome banner
async function loadWelcomeName(user) {
  // Starts with the email in case we can't find a name
  let name = user.email;

  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (userSnap.exists()) {
    // Change "name" if your users documents use a different field
    if (userSnap.data().name) {
      name = userSnap.data().name;
    }
  }

  welcomeName.innerText = name;
}

// Runs when we find out if someone is logged in
function handleAuthChange(user) {
  if (user) {
    loadWelcomeName(user);
    loadOverview();
  } else {
    window.location.href = "../Student-Portal/assessor-login.html";
  }
}

onAuthStateChanged(auth, handleAuthChange);
