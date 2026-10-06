import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const tableBody = document.querySelector("#scheduleBody");
const confirmedBadge = document.querySelector("#confirmedBadge");

async function loadSchedule() {
  const snapshot = await getDocs(collection(db, "bookings"));
  const bookings = [];
  for (const docSnap of snapshot.docs) {
    const booking = docSnap.data();
    booking.id = docSnap.id;
    bookings.push(booking);
  }

  let confirmedCount = 0;

  for (const booking of bookings) {
    if (booking.status === "confirmed") {
      confirmedCount = confirmedCount + 1;
    }
  }

  confirmedBadge.innerText = `${confirmedCount} Confirmed`;

  if (bookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No sessions scheduled.</td></tr>`;
    return;
  }

  let rowsHTML = "";

  for (const booking of bookings) {
    const learner = booking.learnerName || "You";
    const sessionType = booking.sessionType || booking.topic;

    rowsHTML += `
      <tr>
        <td>${learner}</td>
        <td>${booking.date}</td>
        <td>${sessionType}</td>
        <td>${booking.status}</td>
      </tr>
    `;
  }

  tableBody.innerHTML = rowsHTML;
}

// Runs when we find out if someone is logged in
function handleAuthChange(user) {
  if (user) {
    loadSchedule();
  } else {
    window.location.href = "../Student-Portal/learner-login.html";
  }
}

onAuthStateChanged(auth, handleAuthChange);
