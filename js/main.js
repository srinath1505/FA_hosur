'use strict';

/* ════════════════════════════════════════════════════════
   FA – Finance Academy | main.js
   Lenis smooth scroll + GSAP ScrollTrigger animations
   ════════════════════════════════════════════════════════ */

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
  duration: 1.25,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
});

// Wire Lenis into GSAP's ticker so ScrollTrigger stays in sync
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ── Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('done'), 1000);
});

/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  lenis.on('scroll', ({ scroll }) => {
    navbar.classList.toggle('scrolled', scroll > 50);
  });
}

/* ── Hamburger / Mobile nav ── */
const hamburger = document.querySelector('.hamburger');
const overlay   = document.getElementById('nav-overlay');
if (hamburger && overlay) {
  let open = false;
  const toggle = () => {
    open = !open;
    hamburger.classList.toggle('active', open);
    overlay.classList.toggle('open', open);
    // pause/resume lenis when overlay is open
    open ? lenis.stop() : lenis.start();
  };
  hamburger.addEventListener('click', toggle);
  overlay.querySelectorAll('.nav-overlay-link').forEach(l => l.addEventListener('click', toggle));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(); });
}

/* ── Hero title — word split animation ── */
function splitWords(el) {
  const words = el.innerHTML
    .replace(/<br\s*\/?>/gi, ' ⏎ ')   // preserve line breaks
    .split(' ')
    .map(w => {
      if (w === '⏎') return '<br>';
      return `<span class="w-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;">` +
             `<span class="w-inner" style="display:inline-block;">${w}</span></span>`;
    })
    .join(' ');
  el.innerHTML = words;
  return el.querySelectorAll('.w-inner');
}

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const words = splitWords(heroTitle);
  gsap.set(heroTitle, { opacity: 1 }); // reveal container; words animate in below
  gsap.from(words, {
    y: '110%',
    duration: 0.9,
    stagger: 0.07,
    ease: 'power3.out',
    delay: 1.1,
  });
}

/* Hero eyebrow + desc + actions — fromTo overrides CSS opacity:0 on .reveal elements */
gsap.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.05 });
gsap.fromTo('.hero-desc',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.3  });
gsap.fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.5  });
gsap.fromTo('.hero-panel',   { opacity: 0, x: 28 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out', delay: 1.4  });
gsap.from('.scroll-indicator', { opacity: 0, duration: 0.6, delay: 2.2 });

/* ── GSAP ScrollTrigger reveals — fromTo explicitly sets opacity:1 so CSS opacity:0 is overridden ── */
gsap.utils.toArray('.reveal').forEach(el => {
  if (el.classList.contains('course-card')) return; // handled by batch below
  gsap.fromTo(el,
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      delay: el.dataset.delay ? +el.dataset.delay * 0.08 : 0,
    }
  );
});

gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
  );
});

gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
  );
});

/* ── Staggered course cards ── */
const courseCards = gsap.utils.toArray('.course-card');
if (courseCards.length) {
  ScrollTrigger.batch(courseCards, {
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out' }
    ),
    start: 'top 90%',
  });
}

/* ── Staggered why-rows ── */
gsap.utils.toArray('.why-row').forEach((row, i) => {
  gsap.fromTo(row,
    { opacity: 0, x: i % 2 === 0 ? -20 : 20 },
    { opacity: 1, x: 0, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 86%', once: true }, delay: i * 0.06 }
  );
});

/* ── Timeline cards ── */
gsap.utils.toArray('.tl-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true }, delay: i * 0.1 }
  );
});

/* ── Counter animation ── */
function animateCount(el) {
  const target = +el.dataset.count;
  gsap.to({ val: 0 }, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = Math.floor(this.targets()[0].val).toLocaleString();
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true,
    },
  });
}
document.querySelectorAll('[data-count]').forEach(animateCount);

/* ── Stats band — number scale-in ── */
gsap.utils.toArray('.stat-cell').forEach((cell, i) => {
  gsap.fromTo(cell,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: i * 0.1, scrollTrigger: { trigger: cell, start: 'top 88%', once: true } }
  );
});

/* ── Ticker duplicate ── */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  Array.from(tickerTrack.children).forEach(item =>
    tickerTrack.appendChild(item.cloneNode(true))
  );
}

/* ── Hero cursor orb ── */
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const r = heroSection.getBoundingClientRect();
    heroSection.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    heroSection.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
}

/* ── Testimonial slider ── */
const testimonials = [
  {
    text: "Very high energy classes — the way concepts are explained at FA is unlike anything I experienced before. I cleared Tally Level 1 in my very first attempt.",
    name: "Subiksha",
    role: "Tally Level 1 — Finance Academy, Hosur",
    initial: "S"
  },
  {
    text: "The real-life examples and professional development sessions at FA gave me an edge I didn't expect. Cleared CA Inter — this place is genuinely different.",
    name: "Nithish",
    role: "CA Inter, 2020 — Finance Academy",
    initial: "N"
  },
  {
    text: "FA's teaching style and the engagement opportunities in every session made me look forward to class every day. Cleared CA Foundation in first attempt.",
    name: "Sasivarman",
    role: "CA Foundation, 2024 — Finance Academy",
    initial: "S"
  },
  {
    text: "The regular tests and focus sessions at FA built my confidence like nothing else. I walked into the exam hall calm and walked out cleared — first attempt.",
    name: "Vikram",
    role: "CA Foundation, 2024 — Finance Academy",
    initial: "V"
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
  if (tText) {
    gsap.to(tText, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.in', onComplete() {
      tText.textContent = '“' + testimonials[i].text + '”';
      gsap.to(tText, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }});
  }
  if (tName)    tName.textContent    = testimonials[i].name;
  if (tRole)    tRole.textContent    = testimonials[i].role;
  if (tInitial) tInitial.textContent = testimonials[i].initial;
  tDots.forEach((d, j) => d.classList.toggle('active', j === i));
}

tDots.forEach((d, i) => d.addEventListener('click', () => setTestimonial(i)));
if (tDots.length) {
  setTestimonial(0);
  setInterval(() => setTestimonial((tIdx + 1) % testimonials.length), 5500);
}

/* ── Course / Product filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('[data-cat], [data-category]').forEach(c => {
      const cat  = c.dataset.cat || c.dataset.category;
      const show = f === 'all' || cat === f;
      gsap.to(c, { opacity: show ? 1 : 0, duration: 0.25, onComplete: () => {
        c.style.display = show ? 'flex' : 'none';
        if (show) gsap.from(c, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
      }});
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

/* ── Contact form (Web3Forms) ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    const data = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        btn.textContent      = 'Message Sent ✓';
        btn.style.background = '#22c55e';
        form.reset();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      btn.textContent      = 'Failed — try WhatsApp';
      btn.style.background = '#ef4444';
    } finally {
      setTimeout(() => {
        btn.textContent      = orig;
        btn.disabled         = false;
        btn.style.background = '';
      }, 4000);
    }
  });
}

/* ── Float buttons ── */
const waFloat = document.getElementById('wa-float');
const btt     = document.getElementById('back-to-top');
lenis.on('scroll', ({ scroll }) => {
  const show = scroll > 400;
  waFloat?.classList.toggle('show', show);
  btt?.classList.toggle('show', show);
});
btt?.addEventListener('click', e => {
  e.preventDefault();
  lenis.scrollTo(0, { duration: 1.4 });
});

/* ── Exam Countdown ── */
const countdownEl = document.getElementById('exam-days');
if (countdownEl) {
  const examDate = new Date(countdownEl.dataset.date || '2026-11-15');
  const now      = new Date();
  const days     = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
  if (days > 0) {
    countdownEl.textContent = days;
  } else {
    const strip = document.querySelector('.countdown-strip');
    if (strip) strip.style.display = 'none';
  }
}

/* ── Smooth anchor scroll (use Lenis) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = a.getAttribute('href');
    if (target === '#') return;
    const el = document.querySelector(target);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, {
      offset: -(navbar?.offsetHeight || 68),
      duration: 1.2,
    });
  });
});
