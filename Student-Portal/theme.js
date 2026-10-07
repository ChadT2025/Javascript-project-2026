
export function initTheme() {
  try {
    if (localStorage.getItem("st-theme") === "light") document.body.classList.add("light");
  } catch {}

  const btn = document.getElementById("themeBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    try { localStorage.setItem("st-theme", isLight ? "light" : "dark"); } catch {}
    btn.textContent = isLight ? "☽ Dark" : "☾ Light";
  });

  // Set initial label
  btn.textContent = document.body.classList.contains("light") ? "☽ Dark" : "☾ Light";
}
