# DeviPix — Deploy Guide

Static site (`index.html`) on **Cloudflare Pages** + AI proxy (`worker.js`) on a
**Cloudflare Worker**. Both free tier. ~20 minutes end to end.

---

## 0. Before you deploy — fill in the placeholders

Search `index.html` and update these (all currently placeholders):

- `CONFIG.CONTACT_EMAIL` — your real email (also update the two links in the CONTACT section + `og`/canonical URLs if the domain differs)
- Contact links: LinkedIn / GitHub URLs (CONTACT section, `href=`)
- Project card links: `https://example.com/meridian`, `https://example.com/fedari` → real URLs
- JSON-LD + `og:` + `canonical` URLs: swap `devipix.com` for your domain
- Later: `CONFIG.AI_ENDPOINT` (step 2) and `CONFIG.FORMSPREE_ID` (step 4)

---

## 1. Deploy the AI Worker

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Worker**. Name it e.g. `devipix-ai`.
2. Paste the contents of `worker.js` into the editor → **Deploy**.
3. Add the secret: Worker → **Settings → Variables → Add secret**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from the Anthropic Console (set a **monthly spend limit** there — this is a public endpoint).
4. In `worker.js`, set `ALLOWED_ORIGIN` to your real domain (e.g. `"https://devipix.com"`) and re-deploy. Use `"*"` only while testing.
5. Test it:
   ```bash
   curl -X POST https://devipix-ai.<your-subdomain>.workers.dev \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"how much is a website?"}]}'
   # → {"reply":"..."}
   ```
6. Put that Worker URL into `index.html` → `CONFIG.AI_ENDPOINT`.

Model is `claude-haiku-4-5` (fast/cheap), `max_tokens` 300 — change in `worker.js` if needed.

---

## 2. Contact form (pick one)

- **Formspree (fastest):** create a form at formspree.io, copy the form ID (the part after `/f/`), and set `CONFIG.FORMSPREE_ID` in `index.html`. Done.
- **No Formspree:** leave `FORMSPREE_ID` empty — the form falls back to a `mailto:` to `CONFIG.CONTACT_EMAIL`.
- **Advanced:** add a second route to the Worker that emails via an email API, and point the form's fetch at it.

**Spam protection is already on:** the form has a hidden honeypot field + a submit-timing trap
(no config needed — catches most bots). For stronger protection, add **Cloudflare Turnstile**:
create a Turnstile widget in the Cloudflare dashboard, put the **site key** in
`CONFIG.TURNSTILE_SITEKEY`, and the widget appears automatically. (To fully enforce it you
should also verify the token server-side — do that on the Worker if you route the form through it.)

---

## 2b. Protect the AI endpoint (important — it spends money)

The Worker holds your Anthropic key, so a public, unprotected endpoint can run up a bill:

- Keep the Anthropic **spend limit** on (step 1).
- Set `ALLOWED_ORIGIN` to your domain — the Worker now **rejects other origins** (403).
- Add a **Cloudflare Rate Limiting rule** on the Worker route for durable protection. The
  in-Worker limiter is best-effort (per-isolate, resets) — fine as a backstop, not as your only line.

---

## 3. Deploy the site (Cloudflare Pages)

1. **Workers & Pages → Create → Pages → Upload assets** (no build step needed).
2. Upload `index.html` (rename is not required — it's already `index.html`). Optionally include `og.png` (see below).
3. Deploy → you get a `*.pages.dev` URL. Test the terminal, windows, AI, and form.
4. **Custom domain:** Pages → your project → **Custom domains** → add `devipix.com`. Then set the Worker's `ALLOWED_ORIGIN` to that domain and re-deploy the Worker.

---

## 4. Included files (upload the whole folder to Pages)

Cloudflare Pages serves the entire folder, so all of these ship automatically:

- `index.html` — the site
- `og.png` — 1200×630 social preview card (already generated, DeviPix-blue framed)
- `privacy.html` — privacy policy (linked from the contact form)
- `404.html` — themed not-found page (Pages serves it automatically)
- `robots.txt` + `sitemap.xml` — SEO (update the domain inside both if it isn't `devipix.com`)

`worker.js` is **not** part of the site upload — it's deployed separately as the Worker (step 1).

---

## 5. Launch checklist

- [ ] Placeholders filled (email, links, project URLs, domain in index/privacy/robots/sitemap)
- [ ] Worker deployed + `ANTHROPIC_API_KEY` secret set + spend limit on
- [ ] `CONFIG.AI_ENDPOINT` points at the Worker; `curl` test passes
- [ ] `ALLOWED_ORIGIN` locked to the real domain (Worker now 403s other origins)
- [ ] Cloudflare Rate Limiting rule added on the Worker route
- [ ] Contact form verified (Formspree or mailto); honeypot works; Turnstile optional
- [ ] Privacy page reachable; `/privacy.html` link works
- [ ] `robots.txt` + `sitemap.xml` domain is correct; `404.html` shows on a bad URL
- [ ] Site on custom domain, HTTPS green
- [ ] Favicon shows; OG preview looks right (test with a link unfurl)
- [ ] Mobile: bottom-sheet windows + swipe-to-close work
