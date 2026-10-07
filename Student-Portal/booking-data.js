
import { db } from "./firebase.js";
import {
  collection, query, where, orderBy,
  doc, addDoc, deleteDoc, updateDoc,
  getDocs, onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function loadAvailableSlots() {
  const snap = await getDocs(collection(db, "availableSlots"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function submitBooking(uid, learnerName, topic, slot) {
  const booking = {
    uid,
    learnerName,
    topic,
    slotId:    slot.id,
    date:      slot.date,
    time:      slot.time,
    dateLabel: `${slot.date} at ${slot.time}`,
    status:    "pending",
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, "bookings"), booking);
  // Remove the slot so no one else can book it
  await deleteDoc(doc(db, "availableSlots", slot.id));
}

export function listenToBookings(onData, onError) {
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(bookings);
  }, onError);
}

export async function updateBookingStatus(bookingId, status) {
  await updateDoc(doc(db, "bookings", bookingId), { status });
}

export function listenToLearnerBooking(uid, onData, onError) {
  const q = query(
    collection(db, "bookings"),
    where("uid", "==", uid),
    where("status", "in", ["pending", "confirmed"])
  );
  return onSnapshot(q, (snap) => {
    const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(bookings);
  }, onError);
}
