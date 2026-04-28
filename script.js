/* ============================================================
   portfolio – script.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------------
     1. Footer year
  ---------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     2. Mobile nav toggle
  ---------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const siteNav   = document.getElementById("siteNav");

  function setExpanded(v) {
    navToggle?.setAttribute("aria-expanded", v ? "true" : "false");
  }
  navToggle?.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    setExpanded(isOpen);
  });
  siteNav?.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", () => {
      siteNav.classList.remove("open");
      setExpanded(false);
    });
  });

  /* ----------------------------------------------------------
     3. Scroll-spy: active nav link
  ---------------------------------------------------------- */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks  = [...document.querySelectorAll(".nav-link")];

  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove("active"));
      document.querySelector(`.nav-link[href="#${e.target.id}"]`)
              ?.classList.add("active");
    });
  }, { root: null, threshold: 0.3 });

  sections.forEach(s => spyObs.observe(s));

  /* ----------------------------------------------------------
     4. Scroll-triggered section reveal animations
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    ".hero-copy, .hero-card, .card, .work-card, .photo-tile, .service, .section-head, .metric"
  );

  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    // stagger siblings inside grids
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  /* ----------------------------------------------------------
     5. Typewriter on hero title
  ---------------------------------------------------------- */
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent.trim();
    heroTitle.textContent = "";
    heroTitle.style.visibility = "visible";

    let i = 0;
    const type = () => {
      if (i < originalText.length) {
        heroTitle.textContent += originalText[i++];
        setTimeout(type, 70);
      } else {
        heroTitle.classList.add("typed-done");
      }
    };
    setTimeout(type, 400); // slight delay after page load
  }

  /* ----------------------------------------------------------
     6. Animated stat counters
  ---------------------------------------------------------- */
  const metrics = document.querySelectorAll(".metric-value");

  function animateCounter(el) {
    const raw     = el.textContent.trim();           // e.g. "5000+"
    const suffix  = raw.replace(/[\d,]/g, "");       // "+"
    const target  = parseInt(raw.replace(/[^\d]/g, ""), 10);
    if (isNaN(target)) return;

    const duration = 1400;
    const start    = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current  = Math.round(ease * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  metrics.forEach(m => counterObs.observe(m));

  /* ----------------------------------------------------------
     7. Custom cursor
  ---------------------------------------------------------- */
  const cursor    = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");

  if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener("mousemove", e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px)`;
    });

    // Ring follows with spring lag
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Grow ring on hoverable elements
    const hoverables = document.querySelectorAll(
      "a, button, .work-card, .photo-tile, .card, .metric, .service, .btn"
    );
    hoverables.forEach(el => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-hover"));
    });

    document.addEventListener("mousedown", () => cursor.classList.add("cursor-click"));
    document.addEventListener("mouseup",   () => cursor.classList.remove("cursor-click"));

    // Hide default cursor only after we know it works
    document.body.classList.add("custom-cursor-active");
  }

  /* ----------------------------------------------------------
     8. Hero parallax on mouse move
  ---------------------------------------------------------- */
  const bgGif = document.querySelector(".background-gif");
  const heroSection = document.querySelector(".hero");

  if (bgGif && heroSection) {
    document.addEventListener("mousemove", e => {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 2; // -1..1
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      bgGif.style.transform = `translate(${xPct * -8}px, ${yPct * -8}px) scale(1.02)`;
    });
  }

  /* ----------------------------------------------------------
     9. Back-to-top button
  ---------------------------------------------------------- */
  const btt = document.getElementById("back-to-top");
  if (btt) {
    window.addEventListener("scroll", () => {
      btt.classList.toggle("btt-visible", window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ----------------------------------------------------------
     10. Photo lightbox
  ---------------------------------------------------------- */
  const lb        = document.getElementById("lightbox");
  const lbImg     = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbClose   = document.getElementById("lb-close");
  const lbPrev    = document.getElementById("lb-prev");
  const lbNext    = document.getElementById("lb-next");

  const photoTiles = [...document.querySelectorAll(".photo-tile")];
  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    const tile = photoTiles[index];
    const img  = tile.querySelector("img");
    const title = tile.querySelector(".photo-title")?.textContent || "";
    const sub   = tile.querySelector(".photo-sub")?.textContent   || "";
    lbImg.src         = img.src;
    lbImg.alt         = img.alt;
    lbCaption.textContent = `${title} — ${sub}`;
    lb.classList.add("lb-open");
    document.body.style.overflow = "hidden";
    lbImg.classList.remove("lb-img-in");
    requestAnimationFrame(() => lbImg.classList.add("lb-img-in"));
  }

  function closeLightbox() {
    lb.classList.remove("lb-open");
    document.body.style.overflow = "";
  }

  function stepLightbox(dir) {
    lbIndex = (lbIndex + dir + photoTiles.length) % photoTiles.length;
    openLightbox(lbIndex);
  }

  photoTiles.forEach((tile, i) => {
    // Prevent default anchor navigation; open lightbox instead
    tile.addEventListener("click", e => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  lbClose?.addEventListener("click", closeLightbox);
  lbPrev?.addEventListener("click",  () => stepLightbox(-1));
  lbNext?.addEventListener("click",  () => stepLightbox(1));
  lb?.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (!lb?.classList.contains("lb-open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

});
