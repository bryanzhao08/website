// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

function setExpanded(expanded) {
  navToggle?.setAttribute("aria-expanded", expanded ? "true" : "false");
}

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  setExpanded(isOpen);
});

// Close menu on link click (mobile)
siteNav?.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    if (siteNav.classList.contains("open")) {
      siteNav.classList.remove("open");
      setExpanded(false);
    }
  });
});

// Active link highlight on scroll
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];

const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((l) => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      active?.classList.add("active");
    });
  },
  { root: null, threshold: 0.28 }
);

sections.forEach((s) => obs.observe(s));

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

});

});

renderTestimonial(tIndex);

// Contact form: open mail client with prefilled body
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  const to = "hello@yourname.com";
  const mailSubject = encodeURIComponent(subject || "Portfolio inquiry");
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}

${message}
`
  );
  window.location.href = `mailto:${to}?subject=${mailSubject}&body=${body}`;
});
