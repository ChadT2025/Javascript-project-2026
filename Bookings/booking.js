// Connecting Firebase database connection
import { db, auth } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// NEW: lets us check who is logged in
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Stores the available slots from firebase
let slots = [];

const nameInput = document.querySelector("#nameInput");
const topicSelect = document.querySelector("#topicSelect");
const slotSelect = document.querySelector("#slotSelect");
const slotsBadge = document.querySelector("#slotsBadge");
const confirmButton = document.querySelector("#confirmButton");

// Loads available slots from firebase into the dropdowns
async function loadAvailableSlots() {
  const snapshot = await getDocs(collection(db, "availableSlots"));

  slots = [];

  for (const docSnap of snapshot.docs) {
    const slot = docSnap.data();

    // This saves the document ID so we know which slot was booked
    slot.id = docSnap.id;

    slots.push(slot);
  }

  slotsBadge.innerText = `${slots.length} Slots Available`;

  // No slots: show a message and stop
  if (slots.length === 0) {
    slotSelect.innerHTML = `<option value="none">No slots available</option>`;

    confirmButton.innerText = "No Slots Available";

    return;
  }

  let optionsHTML = "";

  // Option value is the array index, used later to find the slot
  for (const [index, slot] of slots.entries()) {
    optionsHTML += `<option value="${index}">${slot.date} at ${slot.time}</option>`;
  }

  slotSelect.innerHTML = optionsHTML;
}

// This Runs when the confirm button is clicked
async function handleBookingSubmit() {
  // Validation
  if (slots.length === 0) {
    alert("No slots available.");

    return;
  }

  if (nameInput.value.trim() === "") {
    alert("Please enter your name.");

    return;
  }

  // Finds the slot the user has picked
  const chosenSlot = slots[slotSelect.value];

  // newBooking object is created
  const newBooking = {
    learnerName: nameInput.value,
    topic: topicSelect.value,
    slotId: chosenSlot.id,
    date: `${chosenSlot.date} at ${chosenSlot.time}`,

    // status starts as pending until approved or rejected in reviews.js
    status: "pending",
  };

  // This Saves the booking to Firebase
  await addDoc(collection(db, "bookings"), newBooking);
  await deleteDoc(doc(db, "availableSlots", chosenSlot.id));

  alert("Booking submitted!");

  nameInput.value = "";

  loadAvailableSlots();
}

// Lets the HTML button call this function
window.handleBookingSubmit = handleBookingSubmit;

// Runs when the page loads, but only once we know someone is logged in.
// (This replaces your old loadAvailableSlots(); line)
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadAvailableSlots();
  } else {
    window.location.href = "../Student-Portal/learner-login.html";
  }
});
