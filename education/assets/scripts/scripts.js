const topnav2 = document.getElementById("topnav2");
const menuBtn = document.getElementById("menuBtn");
const dropdownWork = document.getElementById("dropdownWork");
const dropbtnWork = document.getElementById("dropbtnWork");
const dropdownWorkContent = document.getElementById("dropdownWorkContent");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    topnav2.classList.toggle("is-open");
  });
}

if (dropbtnWork) {
  dropbtnWork.addEventListener("click", (e) => {
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    if (!isMobile) return;
    e.preventDefault();
    dropdownWork.classList.toggle("is-open");
    const open = dropdownWork.classList.contains("is-open");
    dropdownWorkContent.setAttribute("aria-hidden", open ? "false" : "true");
  });
}

document.addEventListener("click", (e) => {
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  if (!isMobile) return;
  if (!dropdownWork.contains(e.target) && dropdownWork.classList.contains("is-open")) {
    dropdownWork.classList.remove("is-open");
    dropdownWorkContent.setAttribute("aria-hidden", "true");
  }
});

const courseCards = Array.from(document.querySelectorAll(".course"));
courseCards.forEach((card) => {
  const btn = card.querySelector(".course-top");
  if (!btn) return;
  btn.addEventListener("click", () => {
    card.classList.toggle("is-open");
  });
});

const expandAllBtn = document.getElementById("expandAll");
const collapseAllBtn = document.getElementById("collapseAll");

if (expandAllBtn) {
  expandAllBtn.addEventListener("click", () => {
    courseCards.forEach((c) => c.classList.add("is-open"));
  });
}

if (collapseAllBtn) {
  collapseAllBtn.addEventListener("click", () => {
    courseCards.forEach((c) => c.classList.remove("is-open"));
  });
}

const chips = Array.from(document.querySelectorAll(".chip"));
const groups = Array.from(document.querySelectorAll(".group"));

function setActiveChip(target) {
  chips.forEach((c) => c.classList.remove("is-active"));
  target.classList.add("is-active");
}

function applyFilter(tag) {
  if (tag === "all") {
    groups.forEach((g) => g.classList.remove("is-hidden"));
    courseCards.forEach((c) => c.classList.remove("is-hidden"));
    return;
  }

  groups.forEach((g) => g.classList.add("is-hidden"));
  courseCards.forEach((c) => c.classList.add("is-hidden"));

  const matchingCourses = courseCards.filter((c) => (c.dataset.tags || "").split(" ").includes(tag));
  matchingCourses.forEach((c) => c.classList.remove("is-hidden"));

  const showGroups = new Set(
    matchingCourses
      .map((c) => c.closest(".group"))
      .filter(Boolean)
  );

  showGroups.forEach((g) => g.classList.remove("is-hidden"));
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const tag = chip.getAttribute("data-filter") || "all";
    setActiveChip(chip);
    applyFilter(tag);
  });
});

(function highlightNavFromPath(){
  const path = (window.location.pathname.split("/").pop() || "").toLowerCase();
  if (!path) return;

  const links = Array.from(document.querySelectorAll(".topnav2 a.tablink"));
  links.forEach((a) => a.classList.remove("is-active"));

  const match = links.find((a) => (a.getAttribute("href") || "").toLowerCase() === path);
  if (match) match.classList.add("is-active");
})();