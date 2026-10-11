// Connecting Firebase database connection
import { db, auth } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const welcomeName = document.querySelector("#welcomeName");
const hangmanWins = document.querySelector("#hangmanWins");

async function loadWelcomeName(user) {
  // Start with the email in case we can't find a name
  let name = user.email;

  const userSnap = await getDoc(doc(db, "users", user.uid));

  // Change "name" if your users documents use a different field
  if (userSnap.exists() && userSnap.data().name) {
    name = userSnap.data().name;
  }

  welcomeName.innerText = name;
}

// Shows the user's hangman wins on the dashboard card
async function loadHangmanWins(user) {
  const statsSnap = await getDoc(doc(db, "hangmanStats", user.uid));

  if (statsSnap.exists()) {
    hangmanWins.innerText = "Wins: " + statsSnap.data().wins;
  }
}

// Runs when we find out if someone is logged in
function handleAuthChange(user) {
  if (user) {
    loadWelcomeName(user);
    loadHangmanWins(user);
  } else {
    console.log("No user logged in");
  }
}

onAuthStateChanged(auth, handleAuthChange);
