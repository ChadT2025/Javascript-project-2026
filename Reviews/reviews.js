// Connecting Firebase database connection
import { db } from "./firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

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
    // Save the document ID so we can update it later
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
    reviewsList.innerHTML = "<p>No reviews pending.</p>";
    return;
  }

  let reviewsHTML = "";

  for (const [index, booking] of bookings.entries()) {
    let buttonsHTML = "";

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
        <p>${booking.topic}</p>
        <p>${booking.learnerName || "Unknown"} · ${booking.date}</p>
        <span>${booking.status}</span>
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

// Updates one booking's status in Firebase, then refreshes the list
async function updateStatus(id, newStatus) {
  await updateDoc(doc(db, "bookings", id), { status: newStatus });
  loadReviews();
}

loadReviews();
