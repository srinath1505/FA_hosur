'use strict';

/* ── Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('done'), 800);
});

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── Hamburger / Mobile Nav ── */
const hamburger = document.querySelector('.hamburger');
const overlay   = document.getElementById('nav-overlay');
if (hamburger && overlay) {
  let open = false;
  const toggle = () => {
    open = !open;
    hamburger.classList.toggle('active', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  hamburger.addEventListener('click', toggle);
  overlay.querySelectorAll('.nav-overlay-link').forEach(l => l.addEventListener('click', toggle));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(); });
}

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if (revealEls.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => ro.observe(el));
}

/* ── Counter animation ── */
function animateCount(el) {
  const target = +el.dataset.count;
  const dur    = 1800;
  const start  = performance.now();
  const run = (now) => {
    const p    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        animateCount(e.target);
        co.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  counterEls.forEach(el => co.observe(el));
}

/* ── Ticker duplicate ── */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  const items = Array.from(tickerTrack.children);
  items.forEach(item => tickerTrack.appendChild(item.cloneNode(true)));
}

/* ── Testimonial slider ── */
const testimonials = [
  {
    text: "Finance Academy transformed my understanding of accounting. I went from struggling to scoring in the top 5% of my batch — in a single semester.",
    name: "Meena Krishnan",
    role: "CA Foundation, 2024",
    initial: "M"
  },
  {
    text: "The question bank of 10,000+ questions is FA's real advantage. Nothing in the exam could surprise me. I cleared with distinction.",
    name: "Ravi Kumar",
    role: "State Topper — Tamil Nadu",
    initial: "R"
  },
  {
    text: "My custom coaching plan at FA was perfectly structured. My mentor addressed every weakness. Cleared in first attempt exactly as planned.",
    name: "Divya Menon",
    role: "Custom Coaching Graduate, 2025",
    initial: "D"
  },
  {
    text: "FA's published study material is far better than any generic textbook — concise, accurate and exam-focused. Distinction across all papers.",
    name: "Suresh Babu",
    role: "Distinction, All Papers 2024",
    initial: "S"
  }
];

let tIdx       = 0;
const tText    = document.getElementById('tText');
const tName    = document.getElementById('tName');
const tRole    = document.getElementById('tRole');
const tInitial = document.getElementById('tInitial');
const tDots    = document.querySelectorAll('.t-dot');

function setTestimonial(i) {
  tIdx = i;
  if (tText)    tText.textContent    = '“' + testimonials[i].text + '”';
  if (tName)    tName.textContent    = testimonials[i].name;
  if (tRole)    tRole.textContent    = testimonials[i].role;
  if (tInitial) tInitial.textContent = testimonials[i].initial;
  tDots.forEach((d, j) => d.classList.toggle('active', j === i));
}

tDots.forEach((d, i) => d.addEventListener('click', () => setTestimonial(i)));
if (tDots.length) {
  setTestimonial(0);
  setInterval(() => setTestimonial((tIdx + 1) % testimonials.length), 5000);
}

/* ── Course / Product filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('[data-cat]').forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.style.display = show ? 'flex' : 'none';
    });
    document.querySelectorAll('[data-category]').forEach(c => {
      const show = f === 'all' || c.dataset.category === f;
      c.style.display = show ? 'flex' : 'none';
    });
  });
});

/* ── Accordion ── */
document.querySelectorAll('.accordion-hd').forEach(hd => {
  hd.addEventListener('click', () => {
    const item   = hd.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Contact form ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    setTimeout(() => {
      btn.textContent      = 'Message Sent ✓';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent      = orig;
        btn.disabled         = false;
        btn.style.background = '';
        form.reset();
      }, 3500);
    }, 1400);
  });
}

/* ── Float buttons ── */
const waFloat = document.getElementById('wa-float');
const btt     = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  waFloat?.classList.toggle('show', show);
  btt?.classList.toggle('show', show);
}, { passive: true });

btt?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = a.getAttribute('href');
    if (target === '#') return;
    const el = document.querySelector(target);
    if (!el) return;
    e.preventDefault();
    const offset = navbar?.offsetHeight || 68;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});
