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
  const siteNav = document.getElementById("siteNav");

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
  const navLinks = [...document.querySelectorAll(".nav-link")];

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
    ".hero-copy, .hero-card, .card, .work-card, .service, .section-head, .metric"
  );

  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
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
    const raw = (el.dataset.target || el.textContent).trim(); // e.g. "5000+"
    const suffix = raw.replace(/[\d,]/g, "");                  // "+"
    const target = parseInt(raw.replace(/[^\d]/g, ""), 10);
    if (isNaN(target)) return;

    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(ease * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Store original values before animation, then trigger on load with delay
  metrics.forEach(m => m.dataset.target = m.textContent.trim());

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  metrics.forEach(m => {
    // Zero out immediately so there's no flash of the final number
    const suffix = m.textContent.trim().replace(/[\d,]/g, "");
    m.textContent = "0" + suffix;
    counterObs.observe(m);
  });

  /* ----------------------------------------------------------
     7. Custom cursor
  ---------------------------------------------------------- */
  const cursor = document.getElementById("cursor-dot");
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
    document.addEventListener("mouseup", () => cursor.classList.remove("cursor-click"));

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
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      bgGif.style.transform = `translate(${xPct * -8}px, ${yPct * -8}px) scale(1.02)`;
    });
  }

  /* ----------------------------------------------------------
     9. Experience slider controls
  ---------------------------------------------------------- */
  const expSlider = document.getElementById("expSlider");
  const expPrev = document.querySelector(".exp-prev");
  const expNext = document.querySelector(".exp-next");

  if (expSlider && expPrev && expNext) {
    expPrev.addEventListener("click", () => {
      const amount = expSlider.clientWidth * 0.8;
      if (expSlider.scrollLeft <= 10) {
        expSlider.scrollTo({ left: expSlider.scrollWidth, behavior: "smooth" });
      } else {
        expSlider.scrollBy({ left: -amount, behavior: "smooth" });
      }
    });
    expNext.addEventListener("click", () => {
      const amount = expSlider.clientWidth * 0.8;
      if (Math.ceil(expSlider.scrollLeft + expSlider.clientWidth) >= expSlider.scrollWidth - 10) {
        expSlider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        expSlider.scrollBy({ left: amount, behavior: "smooth" });
      }
    });
  }

  /* ----------------------------------------------------------
     10. Back-to-top button
  ---------------------------------------------------------- */
  const btt = document.getElementById("back-to-top");
  if (btt) {
    window.addEventListener("scroll", () => {
      btt.classList.toggle("btt-visible", window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  }

  /* ----------------------------------------------------------
     10. Photography - Lightbox with Horizontal Scroll
  ---------------------------------------------------------- */
  const photoCards = document.querySelectorAll(".photo-card");
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbTitle = document.getElementById("lb-title");
  const lbSub = document.getElementById("lb-sub");
  const lbDetails = document.getElementById("lb-details");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");

  let currentPhotoIndex = 0;
  const photoCardsArray = [...photoCards];

  function openLightbox(index) {
    if (index < 0 || index >= photoCardsArray.length) return;
    currentPhotoIndex = index;
    const card = photoCardsArray[index];
    if (!card) return;

    lbImg.src = card.dataset.src;
    lbImg.alt = card.dataset.title;
    lbTitle.textContent = card.dataset.title;
    lbSub.textContent = card.dataset.sub;
    lbDetails.textContent = card.dataset.details;

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
    const nextIndex = (currentPhotoIndex + dir + photoCardsArray.length) % photoCardsArray.length;
    openLightbox(nextIndex);
  }

  photoCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  lbClose?.addEventListener("click", closeLightbox);
  lbPrev?.addEventListener("click", () => stepLightbox(-1));
  lbNext?.addEventListener("click", () => stepLightbox(1));
  lb?.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (!lb?.classList.contains("lb-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

});
