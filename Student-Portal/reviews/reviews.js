// Connecting Firebase database connection
import { db } from "../shared/firebase.js";
import { requireRole } from "../shared/auth.js";
import { esc } from "../shared/util.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Stores all bookings from the firebase
let bookings = [];

const reviewsList = document.querySelector("#reviewsList");
const pendingBadge = document.querySelector("#pendingBadge");

// loadReviews loads bookings from Firebase and show them as cards
async function loadReviews() {
  const snapshot = await getDocs(collection(db, "bookings"));

  bookings = [];

  for (const docSnap of snapshot.docs) {
    const booking = docSnap.data();
    // Save the Doc
    booking.id = docSnap.id;
    bookings.push(booking);
  }

  // Adds to the pending bookings badge
  let pendingCount = 0;

  for (const booking of bookings) {
    if (booking.status === "pending") {
      pendingCount = pendingCount + 1;
    }
  }

  pendingBadge.innerText = `${pendingCount} Pending`;

  if (bookings.length === 0) {
    reviewsList.innerHTML = "<p>No session bookings yet.</p>";
    return;
  }

  let reviewsHTML = "";

  for (const [index, booking] of bookings.entries()) {
    let buttonsHTML;

    // Pending gets Approve/Reject, anything else gets an Undo
    // The index makes each button's class unique
    if (booking.status === "pending") {
      buttonsHTML = `
        <button class="js-approve-button-${index}">Approve</button>
        <button class="js-reject-button-${index}">Reject</button>
      `;
    } else {
      buttonsHTML = `<button class="js-undo-button-${index}">Undo</button>`;
    }

    //This creates the html for the cards
    reviewsHTML += `
      <div class="review-card">
        <p>${esc(booking.topic)}</p>
        <p>${esc(booking.learnerName || "Unknown")} · ${esc(booking.date)}</p>
        <span>${esc(booking.status)}</span>
        ${buttonsHTML}
      </div>
    `;
  }

  reviewsList.innerHTML = reviewsHTML;

  // Buttons only exist after the HTML is added, so click listeners go here
  for (const [index, booking] of bookings.entries()) {
    if (booking.status === "pending") {
      function handleApproveClick() {
        updateStatus(booking.id, "confirmed");
      }

      document
        .querySelector(`.js-approve-button-${index}`)
        .addEventListener("click", handleApproveClick);

      function handleRejectClick() {
        updateStatus(booking.id, "rejected");
      }

      document
        .querySelector(`.js-reject-button-${index}`)
        .addEventListener("click", handleRejectClick);
    } else {
      function handleUndoClick() {
        updateStatus(booking.id, "pending");
      }

      document
        .querySelector(`.js-undo-button-${index}`)
        .addEventListener("click", handleUndoClick);
    }
  }
}

// Updates a learners booking's status in Firebase, then refreshes the list
async function updateStatus(id, newStatus) {
  await updateDoc(doc(db, "bookings", id), { status: newStatus });
  loadReviews();
}

// Only signed-in assessors may see this page
requireRole("assessor").then(loadReviews).catch(console.error);
