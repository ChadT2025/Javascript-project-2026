import { requireRole } from "../shared/auth.js";
import { db } from "../shared/firebase.js";
import { listenToLearnerTasks } from "../tasks/tasks-data.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (id) => document.getElementById(id);

// requireRole sends anyone who is not a signed-in learner back to the login page
// and fills in #welcomeName / #sidebarName for us.
requireRole("learner")
  .then(async ({ uid }) => {
    // Hangman wins card
    try {
      const stats = await getDoc(doc(db, "hangmanStats", uid));
      if (stats.exists())
        $("hangmanWins").textContent = "Wins: " + (stats.data().wins ?? 0);
    } catch (err) {
      console.error("Could not load hangman stats:", err);
    }

    // Progress summary card
    listenToLearnerTasks(
      uid,
      (tasks) => {
        const total = tasks.length;
        const approved = tasks.filter((t) => t.status === "approved").length;
        const review = tasks.filter((t) => t.status === "submitted").length;
        const pct = total ? Math.round((approved / total) * 100) : 0;
        $("progressSummary").textContent = total
          ? `${approved} of ${total} tasks approved (${pct}%)` +
            (review ? ` · ${review} awaiting review` : "")
          : "No tasks yet — create your first one on the Tasks page.";
        $("progressFill").style.width = pct + "%";
      },
      console.error
    );
  })
  .catch(console.error);
