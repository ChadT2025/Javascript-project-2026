
import { requireRole }                         from "./auth.js";
import { initTheme }                           from "./theme.js";
import { listenToBookings, updateBookingStatus } from "./booking-data.js";
import { db }                                  from "./firebase.js";
import {
  collection, addDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

initTheme();

const $ = (id) => document.getElementById(id);

requireRole("assessor").then(() => {
  listenToBookings((bookings) => renderSchedule(bookings), console.error);
});

function renderSchedule(bookings) {
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  $("confirmedCount").textContent = confirmed + " Confirmed";

  const active = bookings.filter(b => ["pending", "confirmed"].includes(b.status));

  if (!active.length) {
    $("scheduleBody").innerHTML = '<tr><td class="empty-row" colspan="4">No bookings yet.</td></tr>';
    return;
  }

  $("scheduleBody").replaceChildren(...active.map(buildRow));
}

function buildRow(b) {
  const tr = document.createElement("tr");

  const tdLearner = document.createElement("td");
  tdLearner.className = "learner-name";
  tdLearner.textContent = b.learnerName;

  const tdDate = document.createElement("td");
  tdDate.textContent = b.dateLabel;
  tdDate.style.color = "var(--accent-light)";

  const tdTopic = document.createElement("td");
  tdTopic.textContent = b.topic;

  const tdStatus = document.createElement("td");
  const actions  = document.createElement("div");
  actions.style.cssText = "display:flex;gap:8px;align-items:center;";

  const badge = document.createElement("span");
  badge.className = "badge " + b.status;
  badge.textContent = b.status === "confirmed" ? "Confirmed" : "Pending";
  actions.append(badge);

  if (b.status === "pending") {
    const confirm = document.createElement("button");
    confirm.className = "btn-confirm-booking";
    confirm.textContent = "Confirm";
    confirm.addEventListener("click", () => updateBookingStatus(b.id, "confirmed").catch(console.error));
    actions.append(confirm);
  }

  const cancel = document.createElement("button");
  cancel.className = "btn-cancel-booking";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => {
    if (confirm(`Cancel booking for ${b.learnerName}?`)) {
      updateBookingStatus(b.id, "cancelled").catch(console.error);
    }
  });
  actions.append(cancel);

  tdStatus.append(actions);
  tr.append(tdLearner, tdDate, tdTopic, tdStatus);
  return tr;
}

$("addSlotBtn")?.addEventListener("click", () => {
  $("slotModal").style.display = "flex";
});

$("slotModalClose")?.addEventListener("click", closeModal);
$("slotModal")?.addEventListener("click", (e) => { if (e.target === $("slotModal")) closeModal(); });

function closeModal() {
  $("slotModal").style.display = "none";
  $("slotForm").reset();
  $("slotFormErr").style.display = "none";
}

$("slotForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn  = $("slotForm").querySelector("button[type=submit]");
  const date = $("slotDate").value;
  const time = $("slotTime").value;

  if (!date || !time) return;

  btn.disabled = true;
  try {
    await addDoc(collection(db, "availableSlots"), {
      date,
      time,
      createdAt: serverTimestamp(),
    });
    closeModal();
  } catch (err) {
    $("slotFormErr").textContent = err.message;
    $("slotFormErr").style.display = "block";
  }
  btn.disabled = false;
});
