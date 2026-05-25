# FA – Finance Academy | Project Handoff
**Date:** 25 May 2026  
**Session:** Design system overhaul + CMS setup  
**Dev server:** `http://localhost:3000` (Node.js static server, run `node server.js` or re-use the inline command below)

---

## Goal We're Working Toward

Rebuild **fahosur.com** from scratch as a modern, premium static website that replaces the current generic WordPress site. The client described the previous design attempt as "vibe coded" (AI-generated feel) and wants something innovative and premium.

**Target:** A 6-page static site (HTML/CSS/JS) deployed on Vercel, connected to PagesCMS so the client can update content without touching code.

**Budget:** ₹60,000 INR total. Static hosting on Vercel is free. No backend, no paid CMS.

**Audit report** (`FA_Website_Audit_Report.md`) is in the repo — 20 findings, full implementation guide already in there.

---

## Current State of the Code

### What's done

| File | Status | Notes |
|---|---|---|
| `css/style.css` | ✅ Complete redesign | Fraunces font, refined tokens, no translateY hovers, gradient mesh hero, grain overlay, gradient border/text utilities |
| `js/main.js` | ✅ Complete rewrite | Lenis 1.1.14 + GSAP 3.12.5 + ScrollTrigger. Hero word-split, staggered reveals, GSAP counters, Web3Forms contact |
| `index.html` | ✅ Updated | Fraunces font CDN, GSAP/Lenis scripts, exam countdown strip added, loader subtitle added |
| `about.html` | ✅ Updated | Font + scripts injected |
| `contact.html` | ✅ Updated | Font + scripts injected |
| `lounge.html` | ✅ Updated | Font + scripts injected |
| `programs.html` | ✅ Updated | Font + scripts injected |
| `store.html` | ✅ Updated | Font + scripts injected |
| `pages.config.yml` | ✅ Created | Full PagesCMS schema for all content types |
| `content/settings.json` | ✅ Created | Contact info, stats, exam date |
| `content/courses.json` | ✅ Created | 8 courses with full metadata |
| `content/team.json` | ✅ Created | 9 core faculty + 5 visiting |
| `content/testimonials.json` | ✅ Created | 6 testimonials |
| `content/news.json` | ✅ Created | 4 news/events |
| `content/walloffame.json` | ✅ Created | 10 student winners |

### Design system (locked — do not change without client approval)

```
Font display:  Fraunces (ital, opsz, wght variable) — Google Fonts
Font body:     Inter 300/400/500/600/700 — Google Fonts

--bg:        #05070f    (near-black, slight warm blue)
--surface:   #080d1a    (section backgrounds)
--surface-2: #0c1526    (card/panel backgrounds)
--border:    rgba(255,255,255,.055)
--gold:      #c9a84c    (primary accent)
--gold-hi:   #e8cc7a    (hover state gold)
--text-1:    #eceff8    (primary text)
--text-2:    #8a94aa    (secondary/muted)
--text-3:    #1c2740    (ghost/decorative numbers)

Hover rule:  NO translateY on any card or button hover.
             Cards → border-color shift + background shift.
             Buttons → ring box-shadow (--glow) + active:scale(0.97).
```

### What the page sections look like (index.html)

1. **Loader** — FA italic in Fraunces + "Finance Academy — Hosur" subtitle + fill line
2. **Navbar** — Fixed, blurs on scroll, Enroll Now gold button
3. **Hero** — 3-layer radial gradient mesh, word-split GSAP animation, stats panel (hidden on mobile)
4. **Exam Countdown Strip** — Gold strip showing days to next CA Foundation exam
5. **Ticker** — Scrolling stats marquee
6. **Stats Band** — 4 animated counters (GSAP ScrollTrigger)
7. **Programs** — Editorial 3-col grid, featured card spans 2 rows, filter buttons
8. **Why FA** — Numbered rows with ghost Fraunces numbers
9. **News Timeline** — Left/right alternating cards
10. **Testimonials** — Large quote carousel + 3 mini review cards
11. **Blog/Knowledge Hub** — 3 cards
12. **CTA** — Gold section with grain overlay
13. **Footer** — 4-col grid

---

## Files Actively Being Edited

Right now **none** — last session ended with all planned changes committed. But the next person should be working in:

- `index.html` — needs real content for testimonials, blog cards, news items (currently using placeholder copy from team's initial scrape)
- `programs.html` — needs the full 26-course listing (currently only 6 shown)
- `contact.html` — needs Web3Forms access key inserted
- Any new page that gets created needs the GSAP/Lenis CDN block (copy from index.html lines ~565-571)

---

## Everything Tried That Failed

### 1. Python HTTP server
`python3 -m http.server` — Python not installed on this Windows machine. Switched to Node.js inline server instead. Works fine.

### 2. Edit tool on index.html (duplicate content issue)
The team had accidentally copy-pasted the entire footer + closing tags twice — the file had two `</body></html>` blocks. The `Edit` tool's exact-string matching kept finding both matches. Fixed by using Node.js string manipulation to target the first occurrence and strip the tail.

### 3. DM Serif Display → Fraunces via CSS @import only
Initially thought changing the `@import` in `style.css` was enough. But the `<link rel="stylesheet">` in all 6 HTML files also had the old Google Fonts URL hardcoded. Had to update all 6 HTML files separately via Node.js batch script.

### 4. `replace_all: false` Edit on non-unique strings
The `<script src="js/main.js"></script>` tag existed twice in index.html (due to the duplicate footer bug). Had to use `run_in_background` Node.js script to fix index.html instead.

---

## Next Steps (Priority Order)

### Immediate (before showing client)

**1. Web3Forms access key (30 min)**  
Go to https://web3forms.com, create a free account with `supportfa@fahosur.com`.  
Get the access key. In `contact.html`, find the form with `id="contactForm"` and add:
```html
<input type="hidden" name="access_key" value="YOUR_KEY_HERE">
<input type="hidden" name="subject" value="New Enquiry — FA Finance Academy">
```

**2. Populate real content in index.html (2-3 hrs)**  
- Replace placeholder testimonial names with the real ones from `content/testimonials.json`
- Replace placeholder blog cards with real article titles from the live site
- Update the hero eyebrow text: currently says "Finance Courses for All of You — Hosur" — change to something like "Hosur's Premier Finance Academy"

**3. Complete programs.html (3-4 hrs)**  
Currently only shows 6 courses. Import all 8 from `content/courses.json` and add the remaining 18+ courses from the live site (https://fahosur.com/courses/). Use the same `.course-card` HTML pattern.

**4. Verify exam countdown date**  
In `content/settings.json`, `exam_date` is set to `"2025-11-01"`. Update to the actual next CA Foundation exam date. The countdown strip on index.html reads `data-date` from `#exam-days` — update that attribute too.

### Short term (week 1-2)

**5. PagesCMS onboarding**  
1. Push the repo (with `pages.config.yml` and `content/` folder) to GitHub
2. Go to https://app.pagescms.org
3. Sign in with GitHub
4. Select the `madtitan0/FAHHHHH` repo
5. The CMS is live — client can edit courses, testimonials, faculty, settings

**6. Deploy to Vercel**  
```bash
npm install -g vercel
vercel --prod
```
Point DNS: `fahosur.com` CNAME → `cname.vercel-dns.com`

**7. Replace placeholder copy in other pages**  
`about.html` — fill in all 9 faculty bios from `content/team.json`  
`lounge.html` — fill in news events from `content/news.json` and wall of fame from `content/walloffame.json`  
`store.html` — add FA's actual published books/materials

### Medium term (week 3-4)

**8. Course filter JS on programs.html**  
The filter buttons exist but need data attributes on all 26 course cards:  
`data-cat="ca"` / `data-cat="pro"` / `data-cat="custom"`

**9. Real faculty photos**  
Upload photos to `assets/images/team/` and update `content/team.json` photo fields. The team cards in `about.html` use `.tutor-initial` as a placeholder — swap with `<img>` when photos are available.

**10. WhatsApp bot deep link**  
All "Enroll" CTAs currently go to `contact.html`. For higher conversion, change primary CTA to:  
```html
<a href="https://wa.me/918098301702?text=Hi%2C%20I%27m%20interested%20in%20enrolling%20at%20FA%20Finance%20Academy.%20Please%20share%20course%20details." ...>
```

---

## How to Restart the Dev Server

```bash
# From c:\Users\Srinath\Downloads\FA
node -e "
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = 3000, ROOT = process.cwd();
const mime = {'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let p = req.url.split('?')[0]; if(p==='/') p='/index.html';
  fs.readFile(path.join(ROOT,p),(e,d)=>{
    if(e){res.writeHead(404);res.end('404');return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'text/plain','Cache-Control':'no-cache'});
    res.end(d);
  });
}).listen(PORT,()=>console.log('http://localhost:'+PORT));
"
```

Or install `serve` globally once: `npm i -g serve` then just run `serve .` from the project folder.

---

## Key External Links

| Resource | URL |
|---|---|
| Live site (old) | https://fahosur.com |
| GitHub repo | https://github.com/madtitan0/FAHHHHH |
| PagesCMS dashboard | https://app.pagescms.org |
| Web3Forms | https://web3forms.com |
| Vercel | https://vercel.com |
| Audit report | `FA_Website_Audit_Report.md` in repo root |
| GSAP docs | https://gsap.com/docs/v3 |
| Lenis docs | https://lenis.darkroom.engineering |
| Fraunces specimen | https://fonts.google.com/specimen/Fraunces |
| Undraw illustrations (free) | https://undraw.co |

---

*This handoff was written at end of session on 25 May 2026. All code changes are uncommitted — push to GitHub before ending the session.*
