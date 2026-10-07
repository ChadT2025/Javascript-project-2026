
import { requireRole, friendlyError } from "./auth.js";
import { initTheme }                  from "./theme.js";
import { listenToLearners }           from "./learners-list.js";

initTheme();

const $ = (id) => document.getElementById(id);
let allLearners = [];


requireRole("assessor").then(() => {
  listenToLearners(
    (learners) => { allLearners = learners; render(); },
    (err)      => { console.error(err); messageRow(friendlyError(err)); }
  );
});

$("search")?.addEventListener("input", render);

function render() {
  const term  = ($("search")?.value || "").trim().toLowerCase();
  const shown = allLearners.filter(l =>
    (l.name  || "").toLowerCase().includes(term) ||
    (l.email || "").toLowerCase().includes(term)
  );

  $("enrolledCount").textContent = allLearners.length + " Enrolled";

  if (!shown.length) {
    $("learnerRows").replaceChildren(blankRow(
      allLearners.length ? "No learners match your search." : "No learners have signed up yet."
    ));
    return;
  }

  $("learnerRows").replaceChildren(...shown.map(buildRow));
}

function buildRow(l) {
  const assigned  = Number(l.assigned)  || 0;
  const completed = Number(l.completed) || 0;
  const pct       = assigned ? Math.round((completed / assigned) * 100) : 0;

  let statusClass = "active", statusLabel = "Active";
  if (assigned && completed >= assigned) { statusClass = "completed"; statusLabel = "Completed"; }
  else if (assigned && pct < 40)         { statusClass = "at-risk";   statusLabel = "At Risk";   }

  const tr = document.createElement("tr");

  
  const prog  = document.createElement("div");
  prog.className = "progress";
  const track = document.createElement("div");
  track.className = "bar-track";
  const fill  = document.createElement("div");
  fill.className = "bar-fill " + (statusClass === "at-risk" ? "red" : statusClass === "completed" ? "green" : "");
  fill.style.width = pct + "%";
  track.append(fill);
  const pctSpan = document.createElement("span");
  pctSpan.className = "percent";
  pctSpan.textContent = pct + "%";
  prog.append(track, pctSpan);

  const statusEl = document.createElement("span");
  statusEl.className = "status " + statusClass;
  statusEl.textContent = statusLabel;

  tr.append(
    cell(l.name  || "—", "learner-name"),
    cell(l.email || "—", "email"),
    cell(prog),
    cell(`${completed} / ${assigned}`),
    cell(statusEl)
  );
  return tr;
}

function cell(child, cls) {
  const td = document.createElement("td");
  if (cls) td.className = cls;
  typeof child === "string" ? td.textContent = child : td.append(child);
  return td;
}

function blankRow(text) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.className = "empty-row";
  td.colSpan   = 5;
  td.textContent = text;
  tr.append(td);
  return tr;
}
