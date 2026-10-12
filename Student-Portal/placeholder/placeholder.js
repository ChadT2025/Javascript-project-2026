// Theme toggle for the pages styled with placeholder.css (dashboard, bookings,
// hangman, reviews, schedule). Shares the "st-theme" key with shared/theme.js,
// so the chosen theme follows the user across every page.
const root = document.documentElement;

try {
  if (localStorage.getItem("st-theme") === "light") root.classList.add("inv-light");
} catch {}

const btn = document.querySelector(".theme-btn");
if (btn) {
  const label = () =>
    (btn.textContent = root.classList.contains("inv-light") ? "☽ Dark" : "☾ Light");
  label();
  btn.addEventListener("click", () => {
    const light = root.classList.toggle("inv-light");
    try { localStorage.setItem("st-theme", light ? "light" : "dark"); } catch {}
    label();
  });
}
