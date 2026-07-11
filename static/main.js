/* =========================================================
   Portfolio — Jocelin LAURET · interactions & animations
   ========================================================= */
(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navbar : état au scroll ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Menu mobile ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = () => { menuBtn.classList.remove("open"); navLinks.classList.remove("open"); };
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  /* ---------- Smooth scroll (avec offset navbar) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Reveal au scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal:not(.in)");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ---------- Parallax du hero ---------- */
  const heroBg = document.getElementById("heroBg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroBg && !reduceMotion) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            heroBg.style.transform = "translate3d(0," + (y * 0.35) + "px,0) scale(1.08)";
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Onglets Projets ---------- */
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".project-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.panel;
      tabs.forEach(t => t.classList.toggle("active", t === tab));
      panels.forEach(p => {
        const on = p.dataset.panel === key;
        p.classList.toggle("active", on);
        if (on) {
          p.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
        }
      });
    });
  });

  /* ---------- Cartes projet : lire la suite ---------- */
  document.querySelectorAll(".pcard-more").forEach(btn => {
    const text = btn.parentElement.querySelector(".pcard-text");
    btn.addEventListener("click", () => {
      const expanded = text.classList.toggle("expanded");
      btn.classList.toggle("open", expanded);
      btn.firstChild.textContent = expanded ? "Réduire " : "Lire la suite ";
    });
  });

  /* ---------- Formulaire de contact (EmailJS + reCAPTCHA) ---------- */
  if (typeof emailjs !== "undefined") emailjs.init("vCwDMPJLBtg6MrbGY");
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const reset = (txt, bg) => {
        btn.style.background = bg || "";
        btn.textContent = txt;
      };

      const recaptchaResponse = (typeof grecaptcha !== "undefined") ? grecaptcha.getResponse() : "";
      if (!recaptchaResponse) {
        reset("Veuillez compléter le reCAPTCHA", "#f44336");
        setTimeout(() => reset("Envoyer le message"), 3500);
        return;
      }

      btn.textContent = "Envoi en cours…";
      btn.disabled = true;

      emailjs.send("service_thfi504", "template_z0mh4i8", {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        "g-recaptcha-response": recaptchaResponse
      }).then(function () {
        btn.disabled = false;
        reset("✓ Message envoyé avec succès", "#22c55e");
        setTimeout(() => { reset("Envoyer le message"); form.reset(); grecaptcha.reset(); }, 4000);
      }, function (error) {
        btn.disabled = false;
        reset("Erreur — veuillez réessayer", "#f44336");
        setTimeout(() => reset("Envoyer le message"), 4000);
        console.error("Erreur lors de l'envoi:", error);
      });
    });
  }
})();
