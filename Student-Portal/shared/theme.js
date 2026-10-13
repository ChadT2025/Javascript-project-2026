
export function initTheme() {
  try {
    if (localStorage.getItem("st-theme") === "light") document.body.classList.add("light");
  } catch { /* storage unavailable (private mode) - ignore */ }

  const btn = document.getElementById("themeBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    try { localStorage.setItem("st-theme", isLight ? "light" : "dark"); } catch { /* storage unavailable (private mode) - ignore */ }
    btn.textContent = isLight ? "☽ Dark" : "☾ Light";
  });

  // Set initial label
  btn.textContent = document.body.classList.contains("light") ? "☽ Dark" : "☾ Light";
}
