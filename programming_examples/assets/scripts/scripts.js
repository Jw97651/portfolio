document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card, .intro-card, .hero-card, .cta-card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.12 });

  cards.forEach((card) => {
    card.classList.add("fade-up");
    observer.observe(card);
  });
});