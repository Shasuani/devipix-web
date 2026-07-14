# PROJECT HANDOFF — "KSTACK Terminal" Portfolio Website

Paste this whole document into Claude to continue the project. It describes a
website that was designed and prototyped over several sessions. Rebuild it (or
work from the attached HTML file if provided) and continue with the TODO list
at the bottom.

---

## 1. WHO / WHAT

Portfolio website for **Konstantinos**, a freelance full-stack developer based
in Greece, selling to clients worldwide (EU/US/UAE):
1. Premium custom websites & landing pages
2. Full-stack web & mobile apps (dashboards, booking systems, portals)
3. AI-powered tools & workflow automation

Target visitors are mostly **non-technical clients**, plus some technical
evaluators. The site must be memorable AND easy for non-devs.

## 2. THE CONCEPT

The entire site is a **retro CRT terminal (Fallout-style)**. Visitors interact
by typing commands OR tapping buttons. Content opens in popup "windows" on top
of the terminal. There is a built-in **AI assistant** that answers visitor
questions about services, process, and pricing.

## 3. VISUAL DESIGN (exact spec)

- **Physical monitor frame**: dark plastic bezel (#181512 range gradients),
  4 corner screws with slot detail, brand plate "KSTACK SYSTEMS" bottom-center
  with a pulsing green power LED.
- **CRT screen inside the bezel**: deep green-black tube (#071008), rounded
  tube corners, inner shadow for curvature.
- **Phosphor green** primary (#33FF66) with text glow
  (`text-shadow: 0 0 6px rgba(51,255,102,.55), 0 0 20px rgba(51,255,102,.18)`),
  dim green #1E9C43, faint #12592A. **Amber** accent #FFB000 (commands, AI,
  warnings), red #FF4E42 (errors).
- **CRT effects**: horizontal scanlines (repeating-linear-gradient, 3px),
  a slow refresh band sweeping down (~7s loop), subtle opacity flicker,
  vignette. A white "power-on flash" on boot. All disabled under
  `prefers-reduced-motion`.
- **Fonts**: VT323 (terminal/headings), IBM Plex Mono 400/600 (window body
  text). Google Fonts, only these weights.
- **Buttons = mechanical keycaps**: 3D look via inset+drop box-shadows,
  press-down transform on :active. Green keys + amber accent keys
  (ASK AI ◆, CONTACT ▸).
- Header strip: "KSTACK UNIFIED OS v3.0" + live clock (en-GB, updates 1s).

## 4. TERMINAL BEHAVIOR

- **Boot sequence** (typewriter effect): fake ROM header
  "KSTACK INDUSTRIES (TM) UNIFIED OPERATING SYSTEM / COPYRIGHT 2019-2026",
  INITIALIZING... OK, LOADING AI CO-PROCESSOR... OK, then intro:
  "OPERATOR: KONSTANTINOS — FULL-STACK ENGINEER / I build websites, apps and
  AI-powered tools for people who want them done properly." then a hint line
  with clickable command names.
- **Input**: hidden `<input>` (font-size 16px to prevent iOS zoom) mirrored to
  a fake prompt `> ` with blinking block cursor. Click/tap anywhere on prompt
  row focuses it. On desktop, any printable keypress focuses input.
- **Commands**: services / projects / about / contact (open windows),
  ask (AI mode), help, clear, exit. Easter eggs: whoami, ls, cat .vault
  (fake ACCESS DENIED lockout joke), sudo hire-me (opens contact).
- **↑/↓ command history, Tab autocomplete, ESC** closes top window / exits AI
  mode.
- **Unknown input** with ≥3 words or a "?" routes to the AI instead of
  "UNKNOWN COMMAND" (so non-technical people can just type naturally).

## 5. WINDOWS (popup panels)

- Fallout-Termlink style: green 2px border, title bar `[ SERVICES.MD ]`,
  red-bordered `ESC ✕` close button. Scale-in animation.
- **Desktop**: draggable by title bar, stack with cascade offset,
  click brings to front.
- **Mobile (≤640px)**: full-width bottom sheets (82% height), slide-up
  animation, swipe-down on the title bar to close.
- Accessibility: role="dialog", aria-labels, focus moves to close button,
  aria-live="polite" on terminal output.
- **SEO-critical**: all window content lives as REAL semantic HTML `<section>`
  elements in the DOM (positioned off-screen), cloned into windows at open.
  Page also has meta description, OG tags, and JSON-LD Person schema.

## 6. CONTENT (current copy)

- **SERVICES.MD**: 3 numbered boxes (01 Websites that convert / 02 Web &
  mobile apps / 03 AI tools & automation — mentions the terminal's own AI as
  a live demo). "How it works": one conversation → fixed quote → build →
  launch; clients talk directly to the person writing the code.
- **~/PROJECTS**: 3 cards, each with a pixel-art SVG logo thumbnail
  (crispEdges rendering, glow):
  - Meridian Coffee — pixel coffee cup — animated single-file landing page,
    mood-based drink selector. Tags: HTML/CSS/JS, SVG animation, mobile-first.
  - COOLFIX (Dubai) — amber pixel villa + palm + snowflake — multi-page premium
    site for property maintenance co. serving luxury villa owners. Tags:
    multi-page, premium brand, lead gen.
  - Ascend — pixel sword + sparkles — RPG habit app: XP, quests, AI
    personalization. Tags: app, gamification, AI.
- **ABOUT.TXT**: whoami paragraphs (based in Greece, whole stack, one person
  not an agency chain, cares about the last 5%), quick facts rows: location /
  stack (JS/TS, React, Node, Python) / focus / style.
- **CONTACT — NEW TRANSMISSION**: themed form (CALLSIGN/NAME,
  RETURN FREQUENCY/EMAIL, TRANSMISSION textarea, ▸ TRANSMIT button),
  direct links row, "STATUS: AVAILABLE FOR NEW PROJECTS".

## 7. AI ASSISTANT ("AI CO-PROCESSOR")

- `ask` or ASK AI keycap enters **chat mode**: prompt changes to amber `AI>`,
  exit/ESC leaves. One-shot also works: `ask how much is a website`.
- Answers render as amber left-bordered blocks with typewriter effect and a
  PROCESSING... animation while waiting. Keeps last 12 messages of history.
- **Architecture**: browser → **Cloudflare Worker** (holds ANTHROPIC_API_KEY
  as a secret) → Anthropic API (claude-haiku-4-5 by default for
  speed/cost, max_tokens 300) → back. The HTML has `AI_ENDPOINT` constant
  pointing to the Worker URL. NEVER put the API key client-side.
- Worker features: CORS (ALLOWED_ORIGIN const, lock to real domain in prod),
  per-IP rate limit 10 req/min, input sanitization (roles whitelist, 2000-char
  cap, last 12 msgs), error handling.
- **AI system prompt** (in the Worker): terminal-persona assistant for
  Konstantinos; knows the services/projects/stack/process listed above; plain
  text only, 1–4 sentences, dry wit; never invents prices (says projects are
  quoted individually, points to contact); never claims to BE Konstantinos;
  never invents projects/credentials; steers off-topic questions back.

## 8. DEPLOYMENT PLAN

Cloudflare Pages (static HTML, free) + Cloudflare Worker (AI proxy, free
tier). Anthropic console API key with a spend limit. Steps: create Worker →
paste worker.js → add ANTHROPIC_API_KEY secret → test with curl → put Worker
URL into AI_ENDPOINT in the HTML → rename HTML to index.html → upload to
Pages → later add custom domain and set ALLOWED_ORIGIN to it.

## 9. TODO LIST (do these next)

1. Replace ALL placeholders: real email (2 places: contact section +
   sendContact mailto), real LinkedIn/GitHub URLs.
2. **Make project cards clickable** → live sites in new tabs, hover glow +
   "▸ VIEW LIVE" hint. Ascend isn't public: give it an "IN DEVELOPMENT" badge
   or open a detail window instead of a link.
3. **Real screenshots** in project cards (keep pixel logo as a small corner
   badge over the screenshot). Optional CRT treatment: slight green tint +
   scanline overlay via CSS filter, full color on hover/tap. Lazy-load, WebP.
4. Contact form: replace mailto fallback with Formspree (or a second route on
   the same Worker that emails via an email API).
5. Favicon + OG image (screenshot of the booted terminal).
6. Add one outcome/result line per project (e.g. delivery time, business
   result) — social proof for evaluators.
7. Optional polish, in this order: deep links (#projects opens window on
   load), `theme` command (green ↔ amber phosphor via CSS variables), key
   click + boot hum sounds (OFF by default, SND ON/OFF toggle).
8. Do NOT add more CRT effects — current intensity is deliberately the max
   before readability suffers.

## 10. DESIGN PRINCIPLES TO PRESERVE

- Non-technical visitors must never be stuck: buttons for everything,
  natural-language input goes to the AI, content windows are normal readable
  UI (IBM Plex Mono, not VT323, for body text).
- The terminal is the hook; conversion elements (contact, proof, CTA) are the
  point. Every window should offer a path toward contact.
- Single-file site, no frameworks, no build step. Fast loading is part of the
  sales pitch.
- Restraint: the aesthetic reads premium because effects stop short of
  gimmicky.
