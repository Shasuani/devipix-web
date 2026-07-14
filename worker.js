/**
 * DeviPix — AI CO-PROCESSOR proxy (Cloudflare Worker)
 * -----------------------------------------------------
 * The browser calls THIS worker; the worker holds the Anthropic API key as a
 * secret and calls the Anthropic API. NEVER put ANTHROPIC_API_KEY in the HTML.
 *
 * Setup:
 *   1. Create a Worker in the Cloudflare dashboard (or `wrangler init`).
 *   2. Add a secret:  ANTHROPIC_API_KEY  (Anthropic Console key, with a spend limit).
 *   3. Set ALLOWED_ORIGIN below to your real domain before launch.
 *   4. Put the deployed Worker URL into CONFIG.AI_ENDPOINT in index.html.
 *
 * Request body (from the browser):  { "messages": [{role, content}, ...] }
 * Response:                          { "reply": "..." }
 */

const ALLOWED_ORIGIN = "*"; // <-- change to "https://devipix.com" in production
const MODEL = "claude-haiku-4-5"; // fast + cheap for a site assistant
const MAX_TOKENS = 300;
const RATE_LIMIT = 10;   // requests
const RATE_WINDOW = 60;  // seconds, per IP

const SYSTEM_PROMPT = `You are the AI CO-PROCESSOR inside the DeviPix terminal website — a
retro CRT assistant for DeviPix, a studio that builds premium websites, full-stack web & mobile
apps, and AI-powered tools & automation. DeviPix is based in Greece and works with clients across
the EU, US and UAE; clients talk directly to the people writing the code.

Process: one conversation -> a fixed quote -> build -> launch.
Stack: JavaScript/TypeScript, React, Node, Python.
Projects: Meridian Coffee (animated landing page), COOLFIX Dubai (premium multi-page site),
Ascend (RPG habit app, in development).

Rules:
- Plain text only. 1-4 sentences. Dry, confident wit.
- NEVER invent prices — say projects are quoted individually and point people to the Contact form.
- NEVER claim to BE a specific person; you are DeviPix's assistant.
- NEVER invent projects, clients, or credentials beyond what's listed.
- Steer off-topic questions back to what DeviPix builds.`;

// Very small in-memory rate limiter (per-isolate; good enough for a portfolio site).
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now() / 1000;
  const rec = hits.get(ip) || { n: 0, t: now };
  if (now - rec.t > RATE_WINDOW) { rec.n = 0; rec.t = now; }
  rec.n++; hits.set(ip, rec);
  return rec.n > RATE_LIMIT;
}

function cors() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors() });
    if (request.method !== "POST") return json({ error: "POST only" }, 405);

    const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
    if (rateLimited(ip)) return json({ error: "Slow down — try again in a minute." }, 429);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400); }

    // Sanitize: whitelist roles, cap length, keep last 12 messages.
    const raw = Array.isArray(body.messages) ? body.messages : [];
    const messages = raw
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    if (messages.length === 0) return json({ error: "No messages" }, 400);
    if (!env.ANTHROPIC_API_KEY) return json({ error: "Server not configured" }, 500);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return json({ error: "Upstream error", detail: data?.error?.message || "" }, 502);
      }
      const reply = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      return json({ reply: reply || "…" });
    } catch (e) {
      return json({ error: "Request failed" }, 502);
    }
  },
};
