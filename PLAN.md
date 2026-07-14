# DeviPix — Build Plan

Authoritative, step-by-step plan to build the DeviPix website. Adapted from
`HANDOFF.md` (the original "KSTACK Terminal" spec, kept as the source record).
Read `HANDOFF.md` for the full design/behavior spec; this file records the
**DeviPix-specific decisions** and the **ordered task list**.

Concept unchanged: the whole site is a **retro green CRT terminal** (Fallout-
style). Visitors type commands OR tap keycap buttons; content opens in popup
"windows"; a built-in AI assistant answers questions. Single HTML file, no
framework, no build step.

---

## 0. Locked decisions (DeviPix adaptation)

| Topic | Decision |
|---|---|
| **Color** | **Keep green phosphor** (#33FF66 primary, #1E9C43 dim, #12592A faint, amber #FFB000 accent, red #FF4E42 error). Unchanged from handoff. |
| **Brand blue** | DeviPix blue (~#4A90E2 / gradient from logo) is the **secondary/off-terminal** color — OG image, favicon backing, future marketing. Not used inside the green tube. |
| **Logo** | **Redesign toward a pixel-grid node mark**, rendered in **phosphor green** so it lives on the CRT. Keep proportions of the current mark (circular node/pin). Blue smooth version retained only for off-terminal use (OG/social). |
| **Voice** | **DeviPix studio voice** — "DeviPix builds…", honest for a one-person studio today, scales when hiring. No fake team size, no "just me" hedging. |
| **Tech** | Single self-contained `index.html`, no frameworks/build. AI via Cloudflare Worker (key server-side). Deploy on Cloudflare Pages + Worker. |

### Rename map (apply everywhere)

| Old (handoff) | New (DeviPix) |
|---|---|
| `KSTACK SYSTEMS` (brand plate) | `DEVIPIX` |
| `KSTACK UNIFIED OS v3.0` (header) | `DEVIPIX OS v3.0` |
| `KSTACK INDUSTRIES (TM) UNIFIED OPERATING SYSTEM / COPYRIGHT 2019-2026` | `DEVIPIX LABS (TM) UNIFIED OPERATING SYSTEM / COPYRIGHT 2019-2026` |
| `OPERATOR: KONSTANTINOS — FULL-STACK ENGINEER` | `DEVIPIX — FULL-STACK WEB · APPS · AI` (studio line, not a person) |
| "I build websites…" intro | "DeviPix builds websites, apps and AI-powered tools for people who want them done properly." |
| `sudo hire-me` easter egg | keep (opens contact) |

---

## Placeholders YOU must provide before launch

Track these — the site can be built with dummies, but launch is blocked until real:

- [ ] Contact **email** (used in 2 places: contact section + `sendContact` mailto)
- [ ] **LinkedIn** URL
- [ ] **GitHub** URL
- [ ] **Domain** (e.g. `devipix.com`) — for CORS lock + canonical/OG URLs
- [ ] Real **project URLs** (Meridian Coffee, COOLFIX) + note that Ascend is in dev
- [ ] Real **project screenshots** (WebP) — see Phase 8
- [ ] **Anthropic API key** (with a spend limit) — for the AI Worker
- [ ] **Formspree form ID** (or chosen email route) — for the contact form
- [ ] One **outcome/result line** per project (delivery time or business result)

---

## Phase 1 — Scaffold + design system

- [ ] 1.1 Create `index.html` shell: `<head>` meta (charset, viewport w/ `font-size:16px` input rule note), Google Fonts (VT323 + IBM Plex Mono 400/600 only).
- [ ] 1.2 CSS variables for the full palette (greens, amber, red) + glow tokens.
- [ ] 1.3 **Monitor frame**: dark plastic bezel gradient (#181512 range), 4 corner screws w/ slot detail, brand plate `DEVIPIX` bottom-center + pulsing green power LED.
- [ ] 1.4 **CRT screen**: deep green-black tube (#071008), rounded tube corners, inner curvature shadow.
- [ ] 1.5 **CRT effects**: scanlines (3px repeating-linear-gradient), slow refresh band (~7s), subtle flicker, vignette, white power-on flash. All wrapped in `@media (prefers-reduced-motion: reduce)` to disable.
- [ ] 1.6 **Keycap buttons**: 3D inset+drop box-shadows, press-down `:active`. Green keys + amber accent keys (`ASK AI ◆`, `CONTACT ▸`).
- [ ] 1.7 Header strip: `DEVIPIX OS v3.0` + live clock (en-GB, 1s tick).
- [ ] ✅ Checkpoint: static shell renders, effects toggle off under reduced-motion.

## Phase 2 — Terminal engine

- [ ] 2.1 **Boot sequence** (typewriter): DeviPix ROM header (see rename map), `INITIALIZING... OK`, `LOADING AI CO-PROCESSOR... OK`, intro line, then hint line w/ clickable command names.
- [ ] 2.2 **Input**: hidden `<input>` (16px, no iOS zoom) mirrored to fake `> ` prompt + blinking block cursor. Tap prompt row focuses; desktop printable-key focuses.
- [ ] 2.3 **Commands**: `services` `projects` `about` `contact` (open windows), `ask` (AI mode), `help`, `clear`, `exit`.
- [ ] 2.4 **Easter eggs**: `whoami`, `ls`, `cat .vault` (fake ACCESS DENIED lockout), `sudo hire-me` (opens contact).
- [ ] 2.5 **History** (↑/↓), **Tab autocomplete**, **ESC** closes top window / exits AI mode.
- [ ] 2.6 **Natural-language routing**: unknown input with ≥3 words or a `?` goes to the AI instead of `UNKNOWN COMMAND`.
- [ ] ✅ Checkpoint: all commands + eggs work by typing and by clicking.

## Phase 3 — Windows system

- [ ] 3.1 Window chrome: green 2px border, title bar `[ SERVICES.MD ]`, red-bordered `ESC ✕` close, scale-in animation.
- [ ] 3.2 **Desktop**: draggable by title bar, cascade offset, click-to-front.
- [ ] 3.3 **Mobile (≤640px)**: full-width bottom sheets (82% h), slide-up, swipe-down title bar to close.
- [ ] 3.4 **A11y**: `role="dialog"`, aria-labels, focus → close button, `aria-live="polite"` on terminal output.
- [ ] ✅ Checkpoint: open/drag/close on desktop; sheet behavior on mobile.

## Phase 4 — Content sections (semantic HTML, SEO-critical)

All content lives as real `<section>` elements in the DOM (positioned off-screen),
cloned into windows on open. Body text = IBM Plex Mono (not VT323).

- [ ] 4.1 **SERVICES.MD**: 3 numbered boxes (01 Websites that convert / 02 Web & mobile apps / 03 AI tools & automation — reference the terminal's own AI as a live demo). "How it works": one conversation → fixed quote → build → launch. **DeviPix voice.**
- [ ] 4.2 **~/PROJECTS**: 3 cards w/ pixel-art SVG thumbnails (crispEdges, glow): Meridian Coffee, COOLFIX (Dubai), Ascend (RPG habit app — mark IN DEVELOPMENT).
- [ ] 4.3 **ABOUT.TXT**: DeviPix studio blurb (based in Greece, full stack, direct access to the person building it, cares about the last 5%). Quick-facts rows: location / stack (JS/TS, React, Node, Python) / focus / style.
- [ ] 4.4 **CONTACT — NEW TRANSMISSION**: themed form (CALLSIGN/NAME, RETURN FREQUENCY/EMAIL, TRANSMISSION textarea, `▸ TRANSMIT`), direct links row, `STATUS: AVAILABLE FOR NEW PROJECTS`.
- [ ] ✅ Checkpoint: every window offers a path toward contact.

## Phase 5 — Pixel logo + brand assets

- [ ] 5.1 **Redesign logo → pixel-grid node mark** in phosphor green (keep circular node/pin silhouette). Deliver as inline SVG (crispEdges).
- [ ] 5.2 Use pixel mark in header + boot screen.
- [ ] 5.3 **Favicon** from the pixel mark (multi-size / SVG + ICO).
- [ ] 5.4 **OG image**: booted-terminal screenshot; may use DeviPix **blue** brand framing here (off-terminal is where blue lives).
- [ ] 5.5 Keep the original smooth blue logo file for social/marketing only.

## Phase 6 — AI assistant (Cloudflare Worker)

- [ ] 6.1 Write `worker.js`: browser → Worker (holds `ANTHROPIC_API_KEY` secret) → Anthropic API (`claude-haiku-4-5`, `max_tokens` 300) → back. **Never put the key client-side.** *(Confirm latest model id via the claude-api skill before finalizing.)*
- [ ] 6.2 Worker hardening: CORS (`ALLOWED_ORIGIN` const, lock to real domain in prod), per-IP rate limit 10 req/min, input sanitization (role whitelist, 2000-char cap, last 12 msgs), error handling.
- [ ] 6.3 **System prompt**: DeviPix terminal-persona assistant; knows services/projects/stack/process; plain text, 1–4 sentences, dry wit; never invents prices (says projects are quoted individually → points to contact); never claims to BE a specific person; never invents projects/credentials; steers off-topic back.
- [ ] 6.4 Client: `AI_ENDPOINT` constant → Worker URL. `ask` / `ASK AI` enters chat mode (amber `AI>`), one-shot `ask <question>` works, ESC exits. Amber left-bordered answer blocks, typewriter, `PROCESSING…` animation, keep last 12 msgs.
- [ ] ✅ Checkpoint: `curl` the Worker; then chat through the terminal.

## Phase 7 — Contact form delivery

- [ ] 7.1 Replace mailto-only with **Formspree** (or a second Worker route that emails via an email API). Keep mailto as fallback.
- [ ] ✅ Checkpoint: submit a real test transmission, confirm receipt.

## Phase 8 — SEO, links, proof

- [ ] 8.1 Meta description, OG tags, **JSON-LD** — switch Person schema to **Organization** (DeviPix) for company framing.
- [ ] 8.2 **Project cards clickable** → live sites in new tabs, hover glow + `▸ VIEW LIVE`. Ascend: `IN DEVELOPMENT` badge / detail window instead of a link.
- [ ] 8.3 **Real screenshots** in cards (pixel logo as small corner badge over screenshot). Optional CRT filter (green tint + scanline), full color on hover/tap. Lazy-load, WebP.
- [ ] 8.4 One **outcome/result line** per project (delivery time / business result).

## Phase 9 — Deploy

- [ ] 9.1 Cloudflare **Worker**: create → paste `worker.js` → add `ANTHROPIC_API_KEY` secret → `curl` test.
- [ ] 9.2 Put Worker URL into `AI_ENDPOINT` in the HTML.
- [ ] 9.3 Rename HTML → `index.html`, upload to Cloudflare **Pages**.
- [ ] 9.4 Add custom domain; set Worker `ALLOWED_ORIGIN` to it. Set Anthropic spend limit.
- [ ] ✅ Checkpoint: live on domain, AI + form working, CORS locked.

## Phase 10 — Optional polish (in order, only if wanted)

- [ ] 10.1 Deep links (`#projects` opens window on load).
- [ ] 10.2 `theme` command (green ↔ amber phosphor via CSS vars). *(Could add a DeviPix-blue phosphor theme here as an easter egg — brand blue inside the tube, opt-in only.)*
- [ ] 10.3 Key-click + boot-hum sounds, **OFF by default**, `SND ON/OFF` toggle.

> **Do NOT** add more CRT effects — current intensity is the deliberate max before readability suffers.

---

## Design principles to preserve

- Non-technical visitors must never be stuck: buttons for everything; natural-language input routes to AI; window content is normal readable UI.
- The terminal is the hook; **conversion** (contact, proof, CTA) is the point. Every window offers a path toward contact.
- Single-file, no frameworks, no build step. Fast load is part of the pitch.
- Restraint: it reads premium because effects stop short of gimmicky.

---

## Suggested execution order

Phase 1 → 2 → 3 → 4 give a fully working, browsable site (AI/form stubbed).
That's the natural first milestone to review. Then 5 (brand), 6–7 (AI + form),
8 (SEO/proof), 9 (deploy), 10 (polish). We do them one checkpoint at a time.
