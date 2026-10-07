
import { db } from "./firebase.js";
import {
  collection, query, where, onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function listenToLearners(onData, onError) {
  const q = query(collection(db, "users"), where("role", "==", "learner"));
  return onSnapshot(q, (snap) => {
    const learners = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    learners.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    onData(learners);
  }, onError);
}
