
import { requireRole }             from "./auth.js";
import { initTheme }               from "./theme.js";
import { listenToLearnerTasks }    from "./tasks-data.js";
import { listenToLearnerBooking }  from "./booking-data.js";

initTheme();

const $ = (id) => document.getElementById(id);

requireRole("learner").then(({ uid }) => {
  startTaskListener(uid);
  startBookingListener(uid);
});

function startTaskListener(uid) {
  listenToLearnerTasks(uid, (tasks) => {
    const assigned  = tasks.length;
    const completed = tasks.filter(t => t.status === "approved").length;
    const outstanding = tasks.filter(t => !["approved", "rejected"].includes(t.status));
    const dueSoon   = outstanding.filter(t => t.status === "pending").length;

    // Stats
    $("statAssigned").textContent  = assigned;
    $("statCompleted").textContent = completed;
    $("statProgress").textContent  = assigned
      ? Math.round((completed / assigned) * 100) + "%" : "0%";
    $("tasksDue").textContent = dueSoon;

    // Task list
    if (!outstanding.length) {
      $("taskList").innerHTML = '<p class="empty">No outstanding tasks — great work!</p>';
      return;
    }

    $("taskList").replaceChildren(...outstanding.slice(0, 5).map(buildTaskRow));
  }, console.error);
}

function buildTaskRow(t) {
  const row   = document.createElement("div");
  row.className = "task " + t.status;
  const name  = document.createElement("span");
  name.textContent = t.title;
  const badge = document.createElement("span");
  badge.className = "badge " + t.status;
  badge.textContent = labelFor(t.status);
  row.append(name, badge);
  return row;
}

function labelFor(status) {
  const map = {
    "pending":     "Pending",
    "in-progress": "In Progress",
    "submitted":   "Submitted",
    "approved":    "Approved",
    "rejected":    "Rejected",
  };
  return map[status] || status;
}

function startBookingListener(uid) {
  listenToLearnerBooking(uid, (bookings) => {
    if (!bookings.length) return;
    const b = bookings[0];
    $("bookingBox").querySelector(".booking-title").textContent = b.topic;
    $("bookingBox").querySelector(".booking-meta").textContent  = b.dateLabel;
    const badge = $("bookingBox").querySelector(".booking-badge");
    if (badge) {
      badge.textContent  = b.status === "confirmed" ? "Confirmed" : "Pending";
      badge.className    = "badge " + b.status;
    }
  }, console.error);
}

$("printBtn")?.addEventListener("click", () => window.print());
