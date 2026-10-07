
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
  doc, setDoc, getDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const HOME  = { learner: "learner-dashboard.html", assessor: "assessor-overview.html" };
export const LOGIN = { learner: "learner-login.html",     assessor: "assessor-login.html"    };

export function showMsg(id, text, isError = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 4000);
}

export function friendlyError(err) {
  const map = {
    "auth/email-already-in-use":  "Email is already registered.",
    "auth/weak-password":         "Password must be at least 6 characters.",
    "auth/invalid-email":         "Invalid email address.",
    "auth/invalid-credential":    "Incorrect email or password.",
    "auth/too-many-requests":     "Too many attempts — try again later.",
    "auth/network-request-failed":"Network error. Check your connection.",
    "auth/wrong-password":        "Current password is incorrect.",
    "auth/requires-recent-login": "Please log in again, then retry.",
    "permission-denied":          "Permission denied (check Firestore rules).",
  };
  return map[err.code] || err.message;
}

function formatLastLogin(ts) {
  if (!ts) return "Today";
  const d    = new Date(ts);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toDateString() === new Date().toDateString()
    ? `Today at ${time}`
    : `${d.toLocaleDateString()} at ${time}`;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

export async function signUp(name, email, password, role) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name, email, role,
    assigned: 0, completed: 0,
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
      `This is not ${expectedRole === "assessor" ? "an assessor" : "a learner"} account.`
    );
  }
  return role;
}

export async function logout(role = "learner") {
  await signOut(auth);
  location.href = LOGIN[role];
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in.");
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

export function requireRole(expectedRole) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { location.href = LOGIN[expectedRole]; return; }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.data();

        if (!data)                      { await signOut(auth); location.href = LOGIN[expectedRole]; return; }
        if (data.role !== expectedRole) { location.href = HOME[data.role]; return; }

        setText("footerName",  data.name);
        setText("welcomeName", data.name);
        setText("lastLogin",   formatLastLogin(user.metadata.lastSignInTime));
        setText("pageTitle",   "Welcome, " + data.name);

        document.body.style.visibility = "visible";
        resolve({ uid: user.uid, ...data });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });

    // Wire sign-out link for every protected page
    document.querySelector(".signout")?.addEventListener("click", (e) => {
      e.preventDefault();
      logout(expectedRole);
    });
  });
}

export function initLoginForm(role) {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn   = form.querySelector("button[type=submit]");
    const email = document.getElementById("as_user").value.trim().toLowerCase();
    const pass  = document.getElementById("as_pass").value;
    btn.disabled = true;
    try {
      await login(email, pass, role);
      showMsg("as_ok", "Welcome back!", false);
      setTimeout(() => (location.href = HOME[role]), 700);
    } catch (err) {
      showMsg("as_err", friendlyError(err));
      btn.disabled = false;
    }
  });
}

export function initSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn   = form.querySelector("button[type=submit]");
    const name  = document.getElementById("su_name").value.trim();
    const email = document.getElementById("su_email").value.trim().toLowerCase();
    const pass  = document.getElementById("su_pass").value;
    const conf  = document.getElementById("su_conf").value;
    const role  = document.getElementById("su_role").value;

    if (!name || !email || !pass) return showMsg("su_err", "Please fill all fields.");
    if (pass !== conf)            return showMsg("su_err", "Passwords do not match.");

    btn.disabled = true;
    try {
      await signUp(name, email, pass, role);
      showMsg("su_ok", "Account created! Redirecting…", false);
      setTimeout(() => (location.href = HOME[role]), 1000);
    } catch (err) {
      showMsg("su_err", friendlyError(err));
      btn.disabled = false;
    }
  });
}

export function initForgotForm() {
  const role = new URLSearchParams(location.search).get("role") === "assessor"
    ? "assessor" : "learner";
  const backLink = document.getElementById("backLink");
  if (backLink) backLink.href = LOGIN[role];

  const form = document.getElementById("forgotForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn   = form.querySelector("button[type=submit]");
    const email = document.getElementById("fp_email").value.trim().toLowerCase();
    btn.disabled = true;
    try {
      await resetPassword(email);
      showMsg("fp_ok", "If that email is registered, a reset link has been sent.", false);
    } catch (err) {
      showMsg("fp_err", friendlyError(err));
    }
    btn.disabled = false;
  });
}

export function initChangePasswordForm() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { location.href = LOGIN.learner; return; }
    const snap = await getDoc(doc(db, "users", user.uid));
    const role = snap.exists() ? snap.data().role : "learner";
    const back = document.getElementById("backLink");
    if (back) back.href = HOME[role];
  });

  const form = document.getElementById("changeForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn    = form.querySelector("button[type=submit]");
    const oldPw  = document.getElementById("cp_old").value;
    const newPw  = document.getElementById("cp_new").value;
    btn.disabled = true;
    try {
      await changePassword(oldPw, newPw);
      form.reset();
      showMsg("cp_ok", "Password updated successfully.", false);
    } catch (err) {
      showMsg("cp_err", friendlyError(err));
    }
    btn.disabled = false;
  });
}
