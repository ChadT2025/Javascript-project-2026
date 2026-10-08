// Connecting Firebase database connection
import { db, auth } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const welcomeName = document.querySelector("#welcomeName");

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
  } else {
    console.log("No user logged in");
  }
}

onAuthStateChanged(auth, handleAuthChange);
