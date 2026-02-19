(function () {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    const topnav2 = document.getElementById("topnav2");
    const menuBtn = document.getElementById("menuBtn");
    const dropdown = document.querySelector(".dropdown2");
    const dropBtn = dropdown ? dropdown.querySelector(".dropbtn2") : null;
    const dropContent = dropdown ? dropdown.querySelector(".dropdown2-content") : null;

    const toTopBtn = document.getElementById("toTopBtn");

    function isMobile() {
      return window.matchMedia("(max-width: 760px)").matches;
    }

    function closeAll() {
      if (topnav2) topnav2.classList.remove("is-open");
      if (dropdown) dropdown.classList.remove("is-open");
      if (dropContent) dropContent.style.display = "";
    }

    if (menuBtn && topnav2) {
      menuBtn.addEventListener("click", function (e) {
        e.preventDefault();
        topnav2.classList.toggle("is-open");
        if (!topnav2.classList.contains("is-open")) {
          if (dropdown) dropdown.classList.remove("is-open");
          if (dropContent) dropContent.style.display = "";
        }
      });
    }

    if (dropBtn && dropContent) {
      dropBtn.addEventListener("click", function (e) {
        if (!isMobile()) return;
        e.preventDefault();
        dropdown.classList.toggle("is-open");
        if (dropdown.classList.contains("is-open")) dropContent.style.display = "block";
        else dropContent.style.display = "";
      });
    }

    document.addEventListener("click", function (e) {
      if (!isMobile()) return;
      if (!topnav2) return;
      if (topnav2.classList.contains("is-open") && !topnav2.contains(e.target)) closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });

    window.addEventListener("resize", function () {
      if (!isMobile()) closeAll();
    });

    function updateToTop() {
      if (!toTopBtn) return;
      if (window.scrollY > 400) toTopBtn.style.display = "inline-flex";
      else toTopBtn.style.display = "none";
    }

    if (toTopBtn) {
      toTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      updateToTop();
      window.addEventListener("scroll", updateToTop, { passive: true });
    }
  });
})();