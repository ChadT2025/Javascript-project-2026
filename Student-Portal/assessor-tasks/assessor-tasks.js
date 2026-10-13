import { requireRole } from "../shared/auth.js";
import { db }          from "../shared/firebase.js";
import { initTheme }   from "../shared/theme.js";
import {
  listenToAllTasks, addTask, reviewTask, deleteTask,
} from "../tasks/tasks-data.js";
import {
  collection, query, where, onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

initTheme();

const $ = (id) => document.getElementById(id);

let me       = null;
let allTasks = [];
let learners = [];

requireRole("assessor").then((user) => {
  me = user;

  listenToAllTasks((t) => { allTasks = t; render(); }, showError);

  onSnapshot(
    query(collection(db, "users"), where("role", "==", "learner")),
    (snap) => {
      learners = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      fillLearnerSelect();
    },
    showError
  );
}).catch(console.error);

$("filterInput")?.addEventListener("input", render);
$("statusFilter")?.addEventListener("change", render);

function showError(err) {
  console.error(err);
  $("taskList").innerHTML = "";
  const p = document.createElement("p");
  p.className = "empty";
  p.textContent = "Could not load data: " + err.message;
  $("taskList").append(p);
}

function fillLearnerSelect() {
  const sel = $("taskLearner");
  sel.replaceChildren();
  if (!learners.length) {
    sel.append(new Option("No learners have signed up yet", ""));
    return;
  }
  sel.append(new Option("Select a learner…", ""));
  learners.forEach((l) => sel.append(new Option(`${l.name || l.email}`, l.id)));
}

// ─── Rendering ────────────────────────────────────────────────────────────────
function render() {
  $("statTotal").textContent    = allTasks.length;
  $("statReview").textContent   = allTasks.filter((t) => t.status === "submitted").length;
  $("statApproved").textContent = allTasks.filter((t) => t.status === "approved").length;

  const term   = ($("filterInput")?.value || "").trim().toLowerCase();
  const status = $("statusFilter")?.value || "";
  const shown  = allTasks
    .filter((t) => !status || t.status === status)
    .filter((t) =>
      (t.title || "").toLowerCase().includes(term) ||
      (t.learnerName || "").toLowerCase().includes(term));

  if (!shown.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = allTasks.length ? "No tasks match your filters." : "No tasks yet — assign one with the button above.";
    $("taskList").replaceChildren(p);
    return;
  }
  $("taskList").replaceChildren(...shown.map(buildRow));
}

const LABELS = {
  "pending": "Pending", "in-progress": "In Progress",
  "submitted": "Submitted", "approved": "Approved", "rejected": "Rejected",
};

function buildRow(t) {
  const row = document.createElement("div");
  row.className = "task-row " + t.status;

  const left = document.createElement("div");
  left.className = "task-left";
  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = t.title;
  const meta = document.createElement("span");
  meta.className = "task-meta";
  const who = document.createElement("span");
  who.className = "learner-tag";
  who.textContent = t.learnerName || "Unknown learner";
  meta.append(who, ` · ${t.category} · ${t.priority} Priority`);
  left.append(title, meta);

  const right = document.createElement("div");
  right.className = "task-right";
  const badge = document.createElement("span");
  badge.className = "badge " + t.status;
  badge.textContent = LABELS[t.status] || t.status;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  if (t.status === "submitted") {
    const ok = document.createElement("button");
    ok.className = "btn-approve";
    ok.textContent = "Approve";
    ok.addEventListener("click", () => reviewTask(t.id, "approved", me.uid).catch(showError));
    const no = document.createElement("button");
    no.className = "btn-reject";
    no.textContent = "Reject";
    no.addEventListener("click", () => reviewTask(t.id, "rejected", me.uid).catch(showError));
    actions.append(ok, no);
  }

  const del = document.createElement("button");
  del.className = "btn-task-delete";
  del.title = "Delete task";
  del.textContent = "✕";
  del.addEventListener("click", () => {
    if (confirm(`Delete "${t.title}" for ${t.learnerName || "this learner"}?`)) {
      deleteTask(t.id).catch(showError);
    }
  });
  actions.append(del);

  right.append(badge, actions);
  row.append(left, right);
  return row;
}

// ─── Assign task modal ────────────────────────────────────────────────────────
const modal = $("taskModal");
$("addTaskBtn")?.addEventListener("click", () => { modal.style.display = "flex"; });
$("modalClose")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

function closeModal() {
  modal.style.display = "none";
  $("taskForm").reset();
  $("taskFormErr").style.display = "none";
}

$("taskForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn      = $("taskForm").querySelector("button[type=submit]");
  const learner  = learners.find((l) => l.id === $("taskLearner").value);
  const title    = $("taskTitle").value.trim();
  if (!learner || !title) return;

  btn.disabled = true;
  try {
    await addTask(learner.id, learner.name || learner.email, title,
      $("taskCategory").value, $("taskPriority").value, me.uid);
    closeModal();
  } catch (err) {
    $("taskFormErr").textContent = err.message;
    $("taskFormErr").style.display = "block";
  } finally {
    btn.disabled = false;
  }
});
