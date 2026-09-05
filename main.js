(function () {
  "use strict";

  /* =====================================================
     Mobile menu
     ===================================================== */
  var burger = document.getElementById("burgerBtn");
  var overlay = document.getElementById("overlay");
  var menu = document.getElementById("mobileMenu");
  var body = document.body;

  function openMenu() {
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    overlay.hidden = false;
    menu.hidden = false;
    body.classList.add("menu-open");
  }

  function closeMenu() {
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    overlay.hidden = true;
    menu.hidden = true;
    body.classList.remove("menu-open");
  }

  function isMenuOpen() {
    return menu && !menu.hidden;
  }

  if (burger) {
    burger.addEventListener("click", function () {
      isMenuOpen() ? closeMenu() : openMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen()) closeMenu();
  });

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 720 && isMenuOpen()) closeMenu();
  });

  /* =====================================================
     Stats count-up
     ===================================================== */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(el, index) {
    var target = parseFloat(el.getAttribute("data-target"));
    var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500 + index * 80;
    var startOffset = 480 + index * 90;

    setTimeout(function () {
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutCubic(progress);
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(step);
    }, startOffset);
  }

  var statValues = document.querySelectorAll(".stat-value");
  var statsFooter = document.querySelector(".stats");
  var statsAnimated = false;

  if (statsFooter && statValues.length) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statValues.forEach(function (el, i) {
              animateStat(el, i);
            });
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsFooter);
  }

  /* =====================================================
     Below-fold scroll reveal
     ===================================================== */
  var sections = document.querySelectorAll(".below-fold .section");
  if (sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* =====================================================
     Exact section placement & Smooth Navigation
     ===================================================== */
  var navLinks = document.querySelectorAll(".nav-link");
  var mLinks = document.querySelectorAll(".m-link");
  var trackedSectionIds = ["home", "product", "case-studies", "contact"];

  function setActiveNav(sectionId) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var id = href.replace(/^#/, "");
      if (id === sectionId || (sectionId === "home" && (id === "" || id === "home"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    mLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var id = href.replace(/^#/, "");
      if (id === sectionId || (sectionId === "home" && (id === "" || id === "home"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function updateActiveSectionOnScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;

    // If reached bottom of page, highlight contact
    if (scrollY + winHeight >= docHeight - 40) {
      setActiveNav("contact");
      return;
    }

    var current = "home";
    for (var i = 0; i < trackedSectionIds.length; i++) {
      var sec = document.getElementById(trackedSectionIds[i]);
      if (sec) {
        var top = sec.offsetTop - 140;
        if (scrollY >= top) {
          current = trackedSectionIds[i];
        }
      }
    }
    setActiveNav(current);
  }

  window.addEventListener("scroll", updateActiveSectionOnScroll, { passive: true });
  window.addEventListener("resize", updateActiveSectionOnScroll, { passive: true });

  // Handle all hash navigation clicks with exact offset
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href").replace(/^#/, "");
      if (!targetId || targetId === "home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveNav("home");
        if (history.pushState) history.pushState(null, null, " ");
        return;
      }

      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = targetEl.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        setActiveNav(targetId);
        if (history.pushState) history.pushState(null, null, "#" + targetId);
      }
    });
  });

  // Logo button smooth scroll to top
  var logoBtn = document.getElementById("logoBtn");
  if (logoBtn) {
    logoBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveNav("home");
    });
  }

  var footerLogoBtn = document.querySelector(".site-footer .logo-btn");
  if (footerLogoBtn) {
    footerLogoBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveNav("home");
    });
  }

  /* =====================================================
     Scroll cue -> smooth scroll to first section below fold
     ===================================================== */
  var scrollCue = document.querySelector(".scroll-cue");
  var productSection = document.getElementById("product");
  if (scrollCue && productSection) {
    scrollCue.style.cursor = "pointer";
    scrollCue.addEventListener("click", function () {
      var headerOffset = 80;
      var elementPosition = productSection.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveNav("product");
    });
  }
})();
