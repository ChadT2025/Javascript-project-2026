import { db } from "../shared/firebase.js";
import {
  collection, addDoc, doc, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tasksCol = collection(db, "tasks");

// NOTE: the owner field is called "uid" because the Firestore rules check
// request.resource.data.uid / resource.data.uid. Do not rename it Chad (Pleeaase my G).

// Newest first. A just-created(new) task has createdAt = null until the server
// confirms it, so those float to the top.
const byNewest = (a, b) =>
  (b.createdAt?.seconds ?? Infinity) - (a.createdAt?.seconds ?? Infinity);

const toList = (snap) =>
  snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byNewest);

// Learner: only their own tasks, updates live
export function listenToLearnerTasks(uid, onData, onError) {
  const q = query(tasksCol, where("uid", "==", uid));
  return onSnapshot(q, (snap) => onData(toList(snap)), onError);
}

// Assessor: every learner's tasks, updates live
export function listenToAllTasks(onData, onError) {
  return onSnapshot(tasksCol, (snap) => onData(toList(snap)), onError);
}

// assignedBy is only set when an assessor creates the task for a learner.
export function addTask(uid, learnerName, title, category, priority, assignedBy = null) {
  const data = {
    uid,
    learnerName,
    title,
    category,
    priority,
    status: "pending",
    createdAt: serverTimestamp(),
  };
  if (assignedBy) data.assignedBy = assignedBy;
  return addDoc(tasksCol, data);
}

// Assessor decision on a submitted task: "approved" or "rejected".
export function reviewTask(id, status, reviewerUid) {
  return updateDoc(doc(db, "tasks", id), {
    status,
    reviewedBy: reviewerUid,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateTaskStatus(id, status) {
  return updateDoc(doc(db, "tasks", id), { status, updatedAt: serverTimestamp() });
}

export function deleteTask(id) {
  return deleteDoc(doc(db, "tasks", id));
}
