
import { db } from "./firebase.js";
import {
  collection, query, where, orderBy,
  doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function listenToLearnerTasks(uid, onData, onError) {
  const q = query(
    collection(db, "tasks"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, onError);
}

export async function addTask(uid, learnerName, title, category, priority) {
  await addDoc(collection(db, "tasks"), {
    uid, learnerName, title, category, priority,
    status: "pending",
    createdAt: serverTimestamp(),
    submittedAt: null,
    reviewedAt: null,
  });
}

export async function updateTaskStatus(taskId, status) {
  const extra = {};
  if (status === "submitted") extra.submittedAt = serverTimestamp();
  if (status === "approved" || status === "rejected") extra.reviewedAt = serverTimestamp();
  await updateDoc(doc(db, "tasks", taskId), { status, ...extra });
}

export async function deleteTask(taskId) {
  await deleteDoc(doc(db, "tasks", taskId));
}

export function listenToAllTasks(onData, onError) {
  const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, onError);
}
