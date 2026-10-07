
import { requireRole }                    from "./auth.js";
import { initTheme }                      from "./theme.js";
import { listenToAllTasks, updateTaskStatus } from "./tasks-data.js";

initTheme();

const $ = (id) => document.getElementById(id);
let allTasks = [];

requireRole("assessor").then(() => {
  listenToAllTasks((tasks) => {
    allTasks = tasks;
    renderReviews(tasks);
  }, console.error);
});

function renderReviews(tasks) {
  const reviewable = tasks.filter(t =>
    ["submitted", "approved", "rejected"].includes(t.status)
  );

  const pending = reviewable.filter(t => t.status === "submitted").length;
  $("pendingCount").textContent = pending + " Pending";

  if (!reviewable.length) {
    $("reviewList").innerHTML = '<p class="empty">No submissions to review yet.</p>';
    return;
  }

  $("reviewList").replaceChildren(...reviewable.map(buildCard));
}

function buildCard(t) {
  const card = document.createElement("div");
  card.className = "review-card " + t.status;
  card.id = "card-" + t.id;

  const left = document.createElement("div");
  left.className = "review-left";

  const title = document.createElement("p");
  title.className = "review-title";
  title.textContent = t.title;

  const meta = document.createElement("p");
  meta.className = "review-meta";
  meta.textContent = `${t.learnerName}  ·  ${t.category}`;

  const date = document.createElement("span");
  date.className = "review-date";
  date.textContent = t.submittedAt?.toDate
    ? t.submittedAt.toDate().toLocaleDateString()
    : "—";

  left.append(title, meta, date);

  const right = document.createElement("div");
  right.className = "review-right";

  const statusBadge = document.createElement("span");
  statusBadge.className = "badge " + t.status;
  statusBadge.textContent = labelFor(t.status);

  right.append(statusBadge);

  // Action buttons
  if (t.status === "submitted") {
    const approve = document.createElement("button");
    approve.className = "btn-approve";
    approve.textContent = "✓ Approve";
    approve.addEventListener("click", () => doReview(t.id, "approved"));

    const reject = document.createElement("button");
    reject.className = "btn-reject";
    reject.textContent = "✕ Reject";
    reject.addEventListener("click", () => {
      if (confirm(`Reject "${t.title}"?`)) doReview(t.id, "rejected");
    });

    right.append(approve, reject);
  } else {
    // Undo button for already-reviewed tasks
    const undo = document.createElement("button");
    undo.className = "btn-undo";
    undo.textContent = "Undo";
    undo.addEventListener("click", () => doReview(t.id, "submitted"));
    right.append(undo);
  }

  card.append(left, right);
  return card;
}

async function doReview(taskId, status) {
  try {
    await updateTaskStatus(taskId, status);
  } catch (err) {
    console.error(err);
    alert("Error updating review: " + err.message);
  }
}

function labelFor(s) {
  return { submitted: "Submitted", approved: "Approved", rejected: "Rejected" }[s] || s;
}
