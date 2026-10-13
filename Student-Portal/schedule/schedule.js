import { db } from "../shared/firebase.js";
import { requireRole } from "../shared/auth.js";
import { esc } from "../shared/util.js";
import {
  collection, getDocs, addDoc, deleteDoc, doc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody      = document.querySelector("#scheduleBody");
const confirmedBadge = document.querySelector("#confirmedBadge");
const slotList       = document.querySelector("#slotList");
const slotForm       = document.querySelector("#slotForm");

async function loadSchedule() {
  const snapshot = await getDocs(collection(db, "bookings"));
  const bookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  confirmedBadge.innerText = `${confirmedCount} Confirmed`;

  if (bookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No sessions scheduled.</td></tr>`;
    return;
  }

  tableBody.innerHTML = bookings.map((b) => `
    <tr>
      <td>${esc(b.learnerName || "You")}</td>
      <td>${esc(b.date)}</td>
      <td>${esc(b.sessionType || b.topic)}</td>
      <td>${esc(b.status)}</td>
    </tr>`).join("");
}

// Open slots that learners can book from the Booking page
async function loadSlots() {
  const snap  = await getDocs(collection(db, "availableSlots"));
  const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (slots.length === 0) {
    slotList.innerHTML = `<p class="slot-empty">No open slots. Add one above so learners can book.</p>`;
    return;
  }

  slotList.innerHTML = slots.map((s) => `
    <div class="slot-row">
      <span>${esc(s.date)} at ${esc(s.time)}</span>
      <button class="slot-remove" data-id="${esc(s.id)}">Remove</button>
    </div>`).join("");

  slotList.querySelectorAll(".slot-remove").forEach((btn) =>
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "availableSlots", btn.dataset.id));
      loadSlots();
    }));
}

slotForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = document.querySelector("#slotDate").value;
  const time = document.querySelector("#slotTime").value;
  if (!date || !time) return;
  await addDoc(collection(db, "availableSlots"), { date, time });
  slotForm.reset();
  loadSlots();
});

requireRole("assessor").then(() => {
  loadSchedule();
  loadSlots();
}).catch(console.error);
