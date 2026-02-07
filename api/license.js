// api/license.js

function normalizeDomain(input) {
  if (!input) return null;

  let d = String(input).trim().toLowerCase();

  try {
    if (d.startsWith("http://") || d.startsWith("https://")) {
      d = new URL(d).hostname;
    }
  } catch (_) {}

  d = d.replace(/^www\./, "");

  if (!/^[a-z0-9.-]+$/.test(d)) return null;
  if (!d.includes(".")) return null;

  return d;
}

const LICENSED_DOMAINS = new Set([
  "portal.remaxdenge.com",
  "beta.remaxdenge.com",
  "portal.remax-yildiz.com",
  "beta.remax-yildiz.com",
  "portal.mustafakocak.net",
  "login.ardreamturk.com"
]);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const domainRaw = req.query.domain;
  const domain = normalizeDomain(domainRaw);

  if (!domain) {
    return res.status(400).json({
      ok: false,
      error: "Invalid domain. Use ?domain=example.com"
    });
  }

  const licensed = LICENSED_DOMAINS.has(domain);

  return res.status(200).json({
    ok: true,
    domain,
    licensed
  });
}
