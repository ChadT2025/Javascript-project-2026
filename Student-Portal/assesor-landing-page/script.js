import { requireRole } from "../shared/auth.js";
import { db } from "../shared/firebase.js";
import { listenToAllTasks } from "../tasks/tasks-data.js";
import {
  collection, getDocs, query, where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (id) => document.getElementById(id);

let bookings = [];
let tasks    = [];

// Pending = bookings waiting for a decision + tasks learners have submitted.
// Reviewed = everything an assessor has already decided on.
function render() {
  const pendingBookings  = bookings.filter((b) => b.status === "pending").length;
  const submittedTasks   = tasks.filter((t) => t.status === "submitted").length;
  const reviewedBookings = bookings.length - pendingBookings;
  const reviewedTasks    = tasks.filter((t) => t.status === "approved" || t.status === "rejected").length;

  $("pendingCount").textContent  = pendingBookings + submittedTasks;
  $("reviewedCount").textContent = reviewedBookings + reviewedTasks;
}

requireRole("assessor").then(async () => {
  try {
    const learners = await getDocs(query(collection(db, "users"), where("role", "==", "learner")));
    $("learnersCount").textContent = learners.size;

    const snap = await getDocs(collection(db, "bookings"));
    bookings = snap.docs.map((d) => d.data());
    render();
  } catch (err) {
    console.error(err);
  }

  listenToAllTasks((t) => { tasks = t; render(); }, console.error);
}).catch(console.error);
