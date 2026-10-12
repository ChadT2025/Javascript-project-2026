import { requireRole }          from "../shared/auth.js";
import { initTheme }            from "../shared/theme.js";
import { listenToLearnerTasks } from "../tasks/tasks-data.js";

initTheme();

const $ = (id) => document.getElementById(id);

requireRole("learner").then(({ uid }) => {
  listenToLearnerTasks(
    uid,
    (tasks) => {
      const total    = tasks.length;
      const approved = tasks.filter(t => t.status === "approved");
      const pct      = total ? Math.round((approved.length / total) * 100) : 0;

      $("statTotal").textContent    = total;
      $("statApproved").textContent = approved.length;
      $("statPct").textContent      = pct + "%";
      $("statPct2").textContent     = pct + "%";
      $("statOpen").textContent     = tasks.filter(t => t.status === "pending" || t.status === "in-progress").length;
      $("statReview").textContent   = tasks.filter(t => t.status === "submitted").length;
      $("statRejected").textContent = tasks.filter(t => t.status === "rejected").length;

      const bar = $("progressBar");
      if (bar) bar.style.width = pct + "%";

      renderHistory(approved);
    },
    console.error
  );
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
    badge.className = "badge " + (t.category || "other").toLowerCase();
    badge.textContent = t.category || "Other";
    tdCat.append(badge);

    const tdDate = document.createElement("td");
    const when = t.reviewedAt?.toDate ? t.reviewedAt
               : t.updatedAt?.toDate  ? t.updatedAt
               : null;
    tdDate.textContent = when ? when.toDate().toLocaleDateString() : "—";

    tr.append(tdTitle, tdCat, tdDate);
    return tr;
  }));
}
