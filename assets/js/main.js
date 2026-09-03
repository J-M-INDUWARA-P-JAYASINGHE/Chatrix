// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// theme toggle
const toggleBtn = document.getElementById("themeToggle");
const icon = toggleBtn.querySelector("i");
const savedTheme = localStorage.getItem("cavexa_theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
  icon.className = "fa-solid fa-sun";
}

toggleBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("cavexa_theme", isLight ? "light" : "dark");
  icon.className = isLight
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
});
