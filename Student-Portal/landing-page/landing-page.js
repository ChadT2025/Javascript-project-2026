import { homeForCurrentUser } from "../shared/auth.js";

document.getElementById("year").textContent = new Date().getFullYear();

// If the visitor is already signed in, swap the login/sign-up buttons for a
// "Go to my dashboard" shortcut. Signed-out visitors keep the normal buttons.
homeForCurrentUser().then((home) => {
  if (!home) return;
  const go = (id, text) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = home;
    if (text) el.textContent = text;
  };
  go("navLogin", "My dashboard");
  go("heroLearner", "Go to my dashboard");
  go("bottomSignup", "Go to my dashboard");
  document.getElementById("navSignup")?.remove();
  document.getElementById("heroAssessor")?.remove();
  document.getElementById("authNote").textContent = "You're signed in.";
}).catch(console.error);
