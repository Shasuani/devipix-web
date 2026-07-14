# DeviPix — Deploy Guide

Static site (`index.html`) on **Cloudflare Pages** + AI proxy (`worker.js`) on a
**Cloudflare Worker**. Both free tier. ~20 minutes end to end.

---

## 0. Before you deploy — fill in the placeholders

Search `index.html` and update these (all currently placeholders):

- `CONFIG.CONTACT_EMAIL` — your real email (also update the two links in the CONTACT section + `og`/canonical URLs if the domain differs)
- Contact links: LinkedIn / GitHub URLs (CONTACT section, `href=`)
- Project card links: `https://example.com/meridian`, `https://example.com/coolfix` → real URLs
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

---

## 3. Deploy the site (Cloudflare Pages)

1. **Workers & Pages → Create → Pages → Upload assets** (no build step needed).
2. Upload `index.html` (rename is not required — it's already `index.html`). Optionally include `og.png` (see below).
3. Deploy → you get a `*.pages.dev` URL. Test the terminal, windows, AI, and form.
4. **Custom domain:** Pages → your project → **Custom domains** → add `devipix.com`. Then set the Worker's `ALLOWED_ORIGIN` to that domain and re-deploy the Worker.

---

## 4. OG image (optional but recommended)

`index.html` references `og.png` for social previews. Generate a 1200×630 screenshot of
the booted terminal (this is where DeviPix **blue** brand can appear as a border/frame),
save as `og.png`, and upload it alongside `index.html` on Pages.

---

## 5. Launch checklist

- [ ] Placeholders filled (email, links, project URLs, domain)
- [ ] Worker deployed + `ANTHROPIC_API_KEY` secret set + spend limit on
- [ ] `CONFIG.AI_ENDPOINT` points at the Worker; `curl` test passes
- [ ] `ALLOWED_ORIGIN` locked to the real domain
- [ ] Contact form verified (Formspree or mailto)
- [ ] Site on custom domain, HTTPS green
- [ ] Favicon shows; OG preview looks right (test with a link unfurl)
- [ ] Mobile: bottom-sheet windows + swipe-to-close work
