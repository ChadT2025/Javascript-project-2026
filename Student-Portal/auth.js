import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Where each role goes after login / when not logged in
export const HOME = {
  learner: "../Learner dashboard/learner.html",
  assessor: "../Assesor Landing Page/index.html",
};
export const LOGIN = {
  learner: "learner-login.html",
  assessor: "assessor-login.html",
};

// ---------- UI helpers ----------
export function showMsg(id, text, isError = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 3500);
}

export function friendlyError(err) {
  const map = {
    "auth/email-already-in-use": "Email already registered",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/invalid-email": "Invalid email address",
    "auth/invalid-credential": "Incorrect email or password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/network-request-failed": "Network error. Check your connection",
    "auth/wrong-password": "Current password is incorrect",
    "auth/requires-recent-login": "Please log in again, then retry",
    "permission-denied": "Database permission denied (check Firestore rules)",
  };
  return map[err.code] || err.message;
}

// ---------- Core functions ----------
export async function signUp(name, email, password, role) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    role,
    createdAt: serverTimestamp(),
  });
  return role;
}

export async function login(email, password, expectedRole) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  const role = snap.exists() ? snap.data().role : null;

  if (role !== expectedRole) {
    await signOut(auth);
    throw new Error(
      `This is not ${expectedRole === "assessor" ? "an assessor" : "a learner"} account`
    );
  }
  return role;
}

export async function logout(role = "learner") {
  await signOut(auth);
  location.href = LOGIN[role];
}

// ---------- Forgot / change password ----------
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred); // confirms the old password
  await updatePassword(user, newPassword);
}

function formatLastLogin(timeString) {
  if (!timeString) return "Today";
  const date = new Date(timeString);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return date.toDateString() === new Date().toDateString()
    ? "Today at " + time
    : date.toLocaleDateString() + " at " + time;
}

// ---------- Protect a dashboard page ----------
export function requireRole(expectedRole) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.href = LOGIN[expectedRole];
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data();

      if (!data) {
        await signOut(auth);
        location.href = LOGIN[expectedRole];
        return;
      }
      if (data.role !== expectedRole) {
        location.href = HOME[data.role];
        return;
      }

      const set = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };
      set("footerName", data.name);
      set("welcomeName", data.name);
      set("lastLogin", formatLastLogin(user.metadata.lastSignInTime));
      set("pageTitle", "Welcome, " + data.name);
      document.body.style.visibility = "visible";
    } catch (err) {
      console.error(err);
      alert(friendlyError(err));
    }
  });

  document.querySelector(".signout")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout(expectedRole);
  });
}

// ---------- Form wiring (used by the login / signup pages) ----------
export function initLoginForm(role) {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const email = document.getElementById("as_user").value.trim().toLowerCase();
    const pass = document.getElementById("as_pass").value;
    btn.disabled = true;
    try {
      await login(email, pass, role);
      showMsg("as_ok", "Welcome back!", false);
      setTimeout(() => (location.href = HOME[role]), 600);
    } catch (err) {
      showMsg("as_err", friendlyError(err));
      btn.disabled = false;
    }
  });
}

export function initSignupForm() {
  const form = document.getElementById("signupForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const name = document.getElementById("su_name").value.trim();
    const email = document
      .getElementById("su_email")
      .value.trim()
      .toLowerCase();
    const pass = document.getElementById("su_pass").value;
    const role = document.getElementById("su_role").value;

    if (!name || !email || !pass) return showMsg("su_err", "Fill all fields");

    btn.disabled = true;
    try {
      await signUp(name, email, pass, role);
      showMsg("su_ok", "Account created! Redirecting...", false);
      setTimeout(() => (location.href = HOME[role]), 1000);
    } catch (err) {
      showMsg("su_err", friendlyError(err));
      btn.disabled = false;
    }
  });
}

export function initForgotForm() {
  const role =
    new URLSearchParams(location.search).get("role") === "assessor"
      ? "assessor"
      : "learner";
  document.getElementById("backLink").href = LOGIN[role];

  const form = document.getElementById("forgotForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const email = document
      .getElementById("fp_email")
      .value.trim()
      .toLowerCase();
    btn.disabled = true;
    try {
      await resetPassword(email);
      showMsg(
        "fp_ok",
        "If that email is registered, a reset link has been sent.",
        false
      );
    } catch (err) {
      showMsg("fp_err", friendlyError(err));
    }
    btn.disabled = false;
  });
}

export function initChangePasswordForm() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.href = LOGIN.learner;
      return;
    }
    const snap = await getDoc(doc(db, "users", user.uid));
    const role = snap.exists() ? snap.data().role : "learner";
    document.getElementById("backLink").href = HOME[role];
  });

  const form = document.getElementById("changeForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const oldPass = document.getElementById("cp_old").value;
    const newPass = document.getElementById("cp_new").value;
    btn.disabled = true;
    try {
      await changePassword(oldPass, newPass);
      form.reset();
      showMsg("cp_ok", "Password updated", false);
    } catch (err) {
      showMsg("cp_err", friendlyError(err));
    }
    btn.disabled = false;
  });
}
