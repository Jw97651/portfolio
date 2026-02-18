const panels = {
  about: document.getElementById("tab-about"),
  projects: document.getElementById("tab-projects"),
  contact: document.getElementById("tab-contact")
};

function setActive(tab) {
  Object.values(panels).forEach(p => p && p.classList.remove("is-active"));
  if (panels[tab]) panels[tab].classList.add("is-active");

  document.querySelectorAll(".tablink").forEach(a => a.classList.remove("is-active"));
  document.querySelectorAll(`.tablink[data-tab="${tab}"]`).forEach(a => a.classList.add("is-active"));
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-tab]");
  if (!link) return;

  const tab = link.getAttribute("data-tab");
  if (!tab) return;

  e.preventDefault();
  setActive(tab);
});

setActive("about");
