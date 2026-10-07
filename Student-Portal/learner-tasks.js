
import { requireRole }          from "./auth.js";
import { initTheme }            from "./theme.js";
import {
  listenToLearnerTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
} from "./tasks-data.js";

initTheme();

const $ = (id) => document.getElementById(id);

let currentUID  = "";
let currentName = "";
let allTasks    = [];
requireRole("learner").then(({ uid, name }) => {
  currentUID  = uid;
  currentName = name;
  listenToLearnerTasks(uid, (tasks) => { allTasks = tasks; render(); }, console.error);
});

$("filterInput")?.addEventListener("input", render);

function render() {
  const term  = ($("filterInput")?.value || "").trim().toLowerCase();
  const shown = allTasks.filter(t => t.title.toLowerCase().includes(term));

  if (!shown.length) {
    $("taskList").innerHTML = `<p class="empty">${allTasks.length ? "No tasks match your search." : "No tasks yet — add one above."}</p>`;
    return;
  }

  $("taskList").replaceChildren(...shown.map(buildRow));
}

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
  meta.textContent = `${t.category} · ${t.priority} Priority`;

  left.append(title, meta);

  const right = document.createElement("div");
  right.className = "task-right";

  const badge = document.createElement("span");
  badge.className = "badge " + t.status;
  badge.textContent = labelFor(t.status);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const nextStatus = nextFor(t.status);
  if (nextStatus) {
    const adv = document.createElement("button");
    adv.className = "btn-task-action";
    adv.textContent = nextLabel(nextStatus);
    adv.addEventListener("click", () => updateTaskStatus(t.id, nextStatus).catch(console.error));
    actions.append(adv);
  }
  
  const del = document.createElement("button");
  del.className = "btn-task-delete";
  del.title = "Delete task";
  del.textContent = "✕";
  del.addEventListener("click", () => {
    if (confirm(`Delete "${t.title}"?`)) {
      deleteTask(t.id).catch(console.error);
    }
  });
  actions.append(del);

  right.append(badge, actions);
  row.append(left, right);
  return row;
}

function labelFor(s) {
  return { "pending": "Pending", "in-progress": "In Progress", "submitted": "Submitted", "approved": "Approved", "rejected": "Rejected" }[s] || s;
}

function nextFor(s) {
  return { "pending": "in-progress", "in-progress": "submitted" }[s] || null;
}

function nextLabel(s) {
  return { "in-progress": "Start", "submitted": "Submit" }[s] || s;
}

// ─── Add task modal ───────────────────────────────────────────────────────────
$("addTaskBtn")?.addEventListener("click", () => {
  $("taskModal").style.display = "flex";
});

$("modalClose")?.addEventListener("click", closeModal);
$("taskModal")?.addEventListener("click", (e) => { if (e.target === $("taskModal")) closeModal(); });

function closeModal() {
  $("taskModal").style.display = "none";
  $("taskForm").reset();
  $("taskFormErr").style.display = "none";
}

$("taskForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn      = $("taskForm").querySelector("button[type=submit]");
  const title    = $("taskTitle").value.trim();
  const category = $("taskCategory").value;
  const priority = $("taskPriority").value;

  if (!title) return;

  btn.disabled = true;
  try {
    await addTask(currentUID, currentName, title, category, priority);
    closeModal();
  } catch (err) {
    $("taskFormErr").textContent = err.message;
    $("taskFormErr").style.display = "block";
  }
  btn.disabled = false;
});
