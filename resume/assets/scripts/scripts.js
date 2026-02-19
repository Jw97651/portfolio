(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    const topnav = document.getElementById("topnav2");
    const menuBtn = document.getElementById("menuBtn");
    const dropdown = document.querySelector(".dropdown2");
    const dropBtn = dropdown ? dropdown.querySelector(".dropbtn2") : null;
    const dropContent = dropdown ? dropdown.querySelector(".dropdown2-content") : null;

    function isMobile() {
      return window.matchMedia("(max-width: 760px)").matches;
    }

    function closeMobileMenu() {
      if (topnav) topnav.classList.remove("is-open");
      if (dropdown) dropdown.classList.remove("is-open");
      if (dropContent) dropContent.style.display = "";
    }

    function toggleMobileMenu() {
      if (!topnav) return;
      topnav.classList.toggle("is-open");
      if (!topnav.classList.contains("is-open")) {
        if (dropdown) dropdown.classList.remove("is-open");
        if (dropContent) dropContent.style.display = "";
      }
    }

    function toggleDropdownMobile() {
      if (!dropdown || !dropContent) return;
      if (!isMobile()) return;
      dropdown.classList.toggle("is-open");
      if (dropdown.classList.contains("is-open")) {
        dropContent.style.display = "block";
      } else {
        dropContent.style.display = "";
      }
    }

    if (menuBtn) {
      menuBtn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleMobileMenu();
      });
    }

    if (dropBtn) {
      dropBtn.addEventListener("click", function (e) {
        if (!isMobile()) return;
        e.preventDefault();
        toggleDropdownMobile();
      });
    }

    if (topnav) {
      topnav.addEventListener("click", function (e) {
        const a = e.target.closest("a");
        if (!a) return;
        const href = a.getAttribute("href") || "";
        if (href === "#" || href === "" || href.toLowerCase().startsWith("javascript:")) return;
        if (isMobile()) closeMobileMenu();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileMenu();
    });

    document.addEventListener("click", function (e) {
      if (!isMobile()) return;
      if (!topnav) return;
      if (topnav.classList.contains("is-open") && !topnav.contains(e.target)) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (!isMobile()) {
        if (topnav) topnav.classList.remove("is-open");
        if (dropdown) dropdown.classList.remove("is-open");
        if (dropContent) dropContent.style.display = "";
      }
    });
  });
})();
