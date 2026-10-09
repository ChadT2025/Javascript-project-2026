// Shows the logged in user's name in the sidebar footer
import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const sidebarName = document.querySelector("#sidebarName");

async function loadSidebarName(user) {
  // Start with the email in case we can't find a name
  let name = user.email;

  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (userSnap.exists() && userSnap.data().name) {
    name = userSnap.data().name;
  }

  sidebarName.innerText = name;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadSidebarName(user);
  } else {
    console.log("No user logged in");
  }
});
