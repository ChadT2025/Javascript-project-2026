
import { requireRole }      from "./auth.js";
import { initTheme }        from "./theme.js";
import { listenToLearners } from "./learners-list.js";
import { listenToAllTasks } from "./tasks-data.js";
import { listenToBookings } from "./booking-data.js";

initTheme();

const $ = (id) => document.getElementById(id);

requireRole("assessor").then(() => {
  startLearnerListener();
  startTaskListener();
  startBookingListener();
});

function startLearnerListener() {
  listenToLearners((learners) => {
    $("statLearners").textContent = learners.length;
  }, console.error);
}

function startTaskListener() {
  listenToAllTasks((tasks) => {
    const submitted = tasks.filter(t => t.status === "submitted");
    const reviewed  = tasks.filter(t => ["approved","rejected"].includes(t.status));

    $("statPending").textContent  = submitted.length;
    $("statReviewed").textContent = reviewed.length;
    $("reviewsDue").textContent   = submitted.length;

    renderRecentSubmissions(submitted.slice(0, 5));
  }, console.error);
}

function renderRecentSubmissions(tasks) {
  const list = $("reviewList");
  if (!tasks.length) {
    list.innerHTML = '<p class="empty">No pending submissions.</p>';
    return;
  }
  list.replaceChildren(...tasks.map(t => {
    const row   = document.createElement("div");
    row.className = "task submitted";
    const name  = document.createElement("span");
    name.textContent = `${t.learnerName} — ${t.title}`;
    const badge = document.createElement("span");
    badge.className = "badge submitted";
    badge.textContent = "Submitted";
    row.append(name, badge);
    return row;
  }));
}

function startBookingListener() {
  listenToBookings((bookings) => {
    const confirmed = bookings.filter(b => b.status === "confirmed");
    $("statSessions").textContent = confirmed.length;

    const box = $("sessionBox");
    if (!confirmed.length) {
      box.querySelector(".booking-title").textContent = "No upcoming sessions";
      box.querySelector(".booking-meta").textContent  = "—";
      return;
    }
    const next = confirmed[0];
    box.querySelector(".booking-title").textContent = `${next.learnerName} — ${next.topic}`;
    box.querySelector(".booking-meta").textContent  = next.dateLabel;
  }, console.error);
}

$("printBtn")?.addEventListener("click", () => window.print());
