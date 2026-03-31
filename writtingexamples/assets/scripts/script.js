const menuToggle = document.getElementById("menuToggle");
const mainNav = document.querySelector(".main-nav");
const dropdown = document.querySelector(".dropdown");
const revealItems = document.querySelectorAll(".reveal");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

if (dropdown && window.innerWidth <= 980) {
  const dropdownLink = dropdown.querySelector("a");
  dropdownLink.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("open");
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));