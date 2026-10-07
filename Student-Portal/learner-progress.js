
import { requireRole }         from "./auth.js";
import { initTheme }           from "./theme.js";
import { listenToLearnerTasks} from "./tasks-data.js";

initTheme();

const $ = (id) => document.getElementById(id);

requireRole("learner").then(({ uid }) => {
  listenToLearnerTasks(uid, (tasks) => {
    const total    = tasks.length;
    const approved = tasks.filter(t => t.status === "approved");
    const pct      = total ? Math.round((approved.length / total) * 100) : 0;

    $("statTotal").textContent    = total;
    $("statApproved").textContent = approved.length;
    $("statPct").textContent      = pct + "%";

    const bar = $("progressBar");
    if (bar) bar.style.width = pct + "%";

    renderHistory(approved);
  }, console.error);
});

function renderHistory(approved) {
  const tbody = $("historyBody");
  if (!approved.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty-row">No completed tasks yet.</td></tr>';
    return;
  }

  tbody.replaceChildren(...approved.map(t => {
    const tr = document.createElement("tr");

    const tdTitle = document.createElement("td");
    tdTitle.textContent = t.title;

    const tdCat = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + t.category.toLowerCase();
    badge.textContent = t.category;
    tdCat.append(badge);

    const tdDate = document.createElement("td");
    tdDate.textContent = t.reviewedAt?.toDate
      ? t.reviewedAt.toDate().toLocaleDateString()
      : "—";

    tr.append(tdTitle, tdCat, tdDate);
    return tr;
  }));
}
