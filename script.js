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
    const raw = el.textContent.trim();           // e.g. "5000+"
    const suffix = raw.replace(/[\d,]/g, "");       // "+"
    const target = parseInt(raw.replace(/[^\d]/g, ""), 10);
    if (isNaN(target)) return;

    const duration = 1400;
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
     10. Photography - Random Selection from Photo Bank
  ---------------------------------------------------------- */
  const photosData = [
    { id: 1, src: 'assets/photos/photo1.jpg', title: 'Boat Exiting Sea Cave', sub: 'Na Pali • Hawaii', details: 'A stunning view from within a sea cave on the Na Pali coast, captured during a boat tour. The natural light filtering through the opening creates a magical atmosphere and highlights the textures of the volcanic rock.' },
    { id: 2, src: 'assets/photos/photo2.jpg', title: 'Flight of Faith', sub: 'Saratoga • California', details: 'A candid moment of movement and grace captured in the heart of Saratoga. This shot captures the split-second beauty of a bird in flight, frozen against the backdrop of the afternoon sun.' },
    { id: 3, src: 'assets/photos/photo3.jpg', title: 'Emerald-shrouded Sapphire', sub: 'Saratoga • California', details: 'The vibrant blue of the water contrasting with the lush green foliage. Taken at a hidden spring, this photo highlights the purity and stillness of the local ecosystem.' },
    { id: 4, src: 'assets/photos/photo4.jpg', title: 'Tranquil Bonds', sub: 'La Jolla • California', details: 'A peaceful scene by the coast in La Jolla, reflecting the quiet beauty of nature and the rhythmic flow of the Pacific tides against the rugged shoreline.' },
    { id: 5, src: 'assets/photos/photo5.jpg', title: 'One Last Time', sub: 'Saratoga • California', details: 'A nostalgic look at a local landmark during the golden hour, symbolizing the end of an era and the fleeting beauty of a California sunset.' },
    { id: 6, src: 'assets/photos/photo6.jpg', title: 'Ribbit', sub: 'Saratoga • California', details: 'A macro shot of a local inhabitant, highlighting the intricate details and vibrant colors of nature that often go unnoticed in our daily lives.' },
    { id: 7, src: 'assets/photos/photo7.jpg', title: 'Winter Wonderland', sub: 'Ukkusissat • Greenland', details: 'An aerial shot of the Arctic, covering a massive canyon, filled with smooth silky ice.' },
    { id: 8, src: 'assets/photos/photo8.jpg', title: 'Mona Lisa', sub: 'Paris • France', details: 'Amidst the view of the most recognizable painting, people turn into statues as they try to capture their own version of her.' },
    { id: 9, src: 'assets/photos/photo9.jpg', title: 'Candelit Dinner', sub: 'San Francisco • California', details: 'The dim lighting and clinking glasses created a warm and intimate atmosphere.' },
    { id: 10, src: 'assets/photos/photo10.jpg', title: 'Cyberpunk City', sub: 'Shanghai • China', details: 'The city lights and skyscrapers capture the vibrant and futuristic atmosphere of the city.' },
  ];

  const photoSlider = document.getElementById('photoSlider');

  // Shuffle array function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderGallery() {
    if (!photoSlider) return;

    const shuffledPhotos = shuffle([...photosData]);

    photoSlider.innerHTML = shuffledPhotos.map((photo, index) => `
      <a class="photo-tile" href="${photo.src}" data-index="${index}">
        <img src="${photo.src}" alt="${photo.title}" loading="lazy" />
        <div class="photo-cap">
          <div class="photo-title">${photo.title}</div>
          <div class="photo-sub">${photo.sub}</div>
        </div>
      </a>
    `).join('');

    // Observe new tiles for scroll-reveal & bind clicks
    document.querySelectorAll('.photo-tile').forEach((tile, i) => {
      tile.classList.add('reveal');
      tile.style.transitionDelay = `${(i % 3) * 80}ms`;
      revealObs.observe(tile);

      tile.addEventListener('click', e => {
        e.preventDefault();
        openLightbox(parseInt(tile.dataset.index), shuffledPhotos);
      });
    });

    // Slider scroll controls
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        const scrollAmount = photoSlider.clientWidth * 0.8;
        if (photoSlider.scrollLeft <= 10) {
          // If at the very beginning, scroll to the end
          photoSlider.scrollTo({ left: photoSlider.scrollWidth, behavior: 'smooth' });
        } else {
          photoSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      });
      nextBtn.addEventListener('click', () => {
        const scrollAmount = photoSlider.clientWidth * 0.8;
        if (Math.ceil(photoSlider.scrollLeft + photoSlider.clientWidth) >= photoSlider.scrollWidth - 10) {
          // If at the end, scroll back to start
          photoSlider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          photoSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    }
  }

  renderGallery();

  /* ----------------------------------------------------------
     11. Photo lightbox
  ---------------------------------------------------------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbTitle = document.getElementById("lb-title");
  const lbSub = document.getElementById("lb-sub");
  const lbDetails = document.getElementById("lb-details");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");

  let lbIndex = 0;
  let currentSet = [];

  function openLightbox(index, photoSet) {
    lbIndex = index;
    currentSet = photoSet;
    const photo = currentSet[index];

    lbImg.src = photo.src;
    lbImg.alt = photo.title;
    lbTitle.textContent = photo.title;
    lbSub.textContent = photo.sub;
    lbDetails.textContent = photo.details;

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
    lbIndex = (lbIndex + dir + currentSet.length) % currentSet.length;
    openLightbox(lbIndex, currentSet);
  }

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
