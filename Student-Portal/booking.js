
import { requireRole }        from "./auth.js";
import { initTheme }          from "./theme.js";
import {
  loadAvailableSlots,
  submitBooking,
  listenToLearnerBooking,
} from "./booking-data.js";

initTheme();

const $ = (id) => document.getElementById(id);

let slots        = [];
let currentUID   = "";
let currentName  = "";

requireRole("learner").then(({ uid, name }) => {
  currentUID  = uid;
  currentName = name;
  loadSlots();
  listenToLearnerBooking(uid, renderExisting, console.error);
});

async function loadSlots() {
  slots = await loadAvailableSlots();

  const badge  = $("slotsBadge");
  const select = $("slotSelect");
  const btn    = $("confirmButton");

  badge.textContent = `${slots.length} Slot${slots.length !== 1 ? "s" : ""} Available`;

  if (!slots.length) {
    select.innerHTML    = '<option value="">No slots available</option>';
    btn.textContent     = "No Slots Available";
    btn.disabled        = true;
    return;
  }

  btn.disabled = false;
  btn.textContent = "Confirm Support Slot";
  select.innerHTML = slots
    .map((s, i) => `<option value="${i}">${s.date} at ${s.time}</option>`)
    .join("");
}

$("confirmButton")?.addEventListener("click", handleSubmit);

async function handleSubmit() {
  const topic = $("topicSelect")?.value;
  const idx   = parseInt($("slotSelect")?.value ?? "-1", 10);

  if (!slots.length)  return alert("No slots available.");
  if (idx < 0)        return alert("Please select a time slot.");

  const btn    = $("confirmButton");
  btn.disabled = true;
  btn.textContent = "Booking…";

  try {
    await submitBooking(currentUID, currentName, topic, slots[idx]);
    showSuccess("Booking submitted! Your assessor will confirm shortly.");
    loadSlots();
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
    btn.disabled = false;
    btn.textContent = "Confirm Support Slot";
  }
}

function renderExisting(bookings) {
  const box = $("existingBooking");
  if (!box) return;
  if (!bookings.length) { box.style.display = "none"; return; }
  const b = bookings[0];
  box.style.display = "block";
  box.innerHTML = `
    <p class="booking-title">${b.topic}</p>
    <p class="booking-meta">${b.dateLabel}</p>
    <span class="badge ${b.status}" style="margin-top:8px;display:inline-block">${b.status === "confirmed" ? "Confirmed ✓" : "Pending review"}</span>
  `;
}

function showSuccess(msg) {
  const el = $("bookingSuccess");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 5000);
}
