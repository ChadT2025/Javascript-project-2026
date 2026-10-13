import { db } from "../shared/firebase.js";
import { requireRole } from "../shared/auth.js";
import { initTheme } from "../shared/theme.js";
import { listenToAllTasks } from "../tasks/tasks-data.js";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function listenToLearners(onData, onError) {
  const q = query(collection(db, "users"), where("role", "==", "learner"));
  return onSnapshot(
    q,
    (snap) => {
      const learners = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      learners.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      onData(learners);
    },
    onError
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
initTheme();

const $ = (id) => document.getElementById(id);

let learners = [];
let tasks = [];

requireRole("assessor").then(() => {
  listenToLearners((l) => {
    learners = l;
    render();
  }, showError);
  listenToAllTasks((t) => {
    tasks = t;
    render();
  }, showError);
});

$("filterInput")?.addEventListener("input", render);

function showError(err) {
  console.error(err);
  $("learnersBody").innerHTML =
    `<tr><td colspan="6" class="empty-row">Could not load data: ${err.message}</td></tr>`;
}

function summarise(learner) {
  const mine = tasks.filter((t) => t.uid === learner.id);
  const total = mine.length;
  const approved = mine.filter((t) => t.status === "approved").length;
  const submitted = mine.filter((t) => t.status === "submitted").length;
  const rejected = mine.filter((t) => t.status === "rejected").length;
  const pct = total ? Math.round((approved / total) * 100) : 0;
  const status = rejected
    ? "at-risk"
    : total && approved === total
      ? "completed"
      : "active";
  return { total, approved, submitted, pct, status };
}

function render() {
  const term = ($("filterInput")?.value || "").trim().toLowerCase();
  const shown = learners.filter(
    (l) =>
      (l.name || "").toLowerCase().includes(term) ||
      (l.email || "").toLowerCase().includes(term)
  );

  const rows = learners.map(summarise);
  $("statLearners").textContent = learners.length;
  $("statReview").textContent = rows.reduce((n, r) => n + r.submitted, 0);
  $("statAvg").textContent =
    (rows.length
      ? Math.round(rows.reduce((n, r) => n + r.pct, 0) / rows.length)
      : 0) + "%";

  const body = $("learnersBody");
  if (!shown.length) {
    body.innerHTML = `<tr><td colspan="6" class="empty-row">${
      learners.length ? "No learners match your search." : "No learners yet."
    }</td></tr>`;
    return;
  }

  body.replaceChildren(...shown.map(buildRow));
}

function buildRow(l) {
  const s = summarise(l);
  const tr = document.createElement("tr");

  const cell = (text, cls) => {
    const td = document.createElement("td");
    if (cls) td.className = cls;
    td.textContent = text;
    return td;
  };

  const tdProg = document.createElement("td");
  const wrap = document.createElement("div");
  wrap.className = "progress";
  const track = document.createElement("div");
  track.className = "bar-track";
  const fill = document.createElement("div");
  fill.className = "bar-fill" + (s.pct === 100 ? " green" : "");
  fill.style.width = s.pct + "%";
  track.append(fill);
  const pctEl = document.createElement("span");
  pctEl.className = "percent";
  pctEl.textContent = s.pct + "%";
  wrap.append(track, pctEl);
  tdProg.append(wrap);

  const tdStatus = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "status " + s.status;
  badge.textContent = {
    "at-risk": "At risk",
    completed: "Completed",
    active: "Active",
  }[s.status];
  tdStatus.append(badge);

  tr.append(
    cell(l.name || "—", "learner-name"),
    cell(l.email || "—", "email"),
    cell(`${s.approved} / ${s.total}`),
    cell(s.submitted),
    tdProg,
    tdStatus
  );
  return tr;
}
