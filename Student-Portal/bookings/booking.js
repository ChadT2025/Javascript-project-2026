// Connecting Firebase database connection
import { db } from "../shared/firebase.js";
import { requireRole } from "../shared/auth.js";
import { esc } from "../shared/util.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// The signed-in learner (set by requireRole below)
let me = null;

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

  confirmButton.innerText = "Confirm Support Slot";

  let optionsHTML = "";

  // Option value is the array index, used later to find the slot
  for (const [index, slot] of slots.entries()) {
    optionsHTML += `<option value="${index}">${esc(slot.date)} at ${esc(slot.time)}</option>`;
  }

  slotSelect.innerHTML = optionsHTML;
}

// This Runs when the confirm button is clicked
async function handleBookingSubmit() {
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
    uid: me.uid,
    learnerName: nameInput.value.trim(),
    topic: topicSelect.value,
    slotId: chosenSlot.id,
    date: `${chosenSlot.date} at ${chosenSlot.time}`,

    // status starts as pending until approved or rejected in reviews.js
    status: "pending",
  };

  // This Saves the booking to Firebase
  await addDoc(collection(db, "bookings"), newBooking);
  await deleteDoc(doc(db, "availableSlots", chosenSlot.id));

  alert("Booking submitted! Your assessor will confirm it shortly.");

  loadAvailableSlots();
  loadMyBookings();
}

// Lists this learner's own bookings and their status
async function loadMyBookings() {
  const list = document.querySelector("#myBookings");
  const snap = await getDocs(query(collection(db, "bookings"), where("uid", "==", me.uid)));

  if (snap.empty) {
    list.innerHTML = `<p class="my-empty">You have no bookings yet.</p>`;
    return;
  }

  list.innerHTML = snap.docs
    .map((d) => d.data())
    .map((b) => `
      <div class="my-row">
        <span>${esc(b.topic)} — ${esc(b.date)}</span>
        <span class="my-status ${esc(b.status)}">${esc(b.status)}</span>
      </div>`)
    .join("");
}

// Lets the HTML button call this function
window.handleBookingSubmit = handleBookingSubmit;

// Only signed-in learners may book
requireRole("learner").then((user) => {
  me = user;
  nameInput.value = user.name || "";
  loadAvailableSlots();
  loadMyBookings();
}).catch(console.error);
