#!/usr/bin/env node
/* Rebuilds data/rates.json — reference exchange rates for the currencies the
 * builder offers.
 *
 *   node scripts/build-rates.mjs
 *
 * Refreshed weekly by .github/workflows/refresh-rates.yml. Committed rather
 * than fetched from the browser, so the page still depends on no third-party
 * host while it runs — the same reason the airport tables are vendored.
 *
 * Source is @fawazahmed0/currency-api served from jsDelivr: no key, no rate
 * limit, and it carries all twelve currencies including MOP, which the ECB
 * (and therefore Frankfurter) does not publish.
 *
 * Rates are stored against USD. The builder's base currency is whatever the
 * user picked, so it re-bases at read time: rate(base -> X) = usd[X] / usd[base].
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";

/* Read the list out of the app rather than keeping a second copy here — a
   currency added to the picker must not silently go unpriced. */
function appCurrencies() {
  const js = readFileSync(join(ROOT, "js/app.js"), "utf8");
  const m = js.match(/const CURRENCIES=\[([^\]]*)\]/);
  if (!m) throw new Error("could not find CURRENCIES in js/app.js");
  return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}

const res = await fetch(SRC);
if (!res.ok) throw new Error(`${SRC}: HTTP ${res.status}`);
const body = await res.json();
if (!body || !body.usd || !body.date) throw new Error("unexpected payload shape");

const wanted = appCurrencies();
const rates = {};
const missing = [];
for (const c of wanted) {
  const v = body.usd[c.toLowerCase()];
  if (typeof v !== "number" || !isFinite(v) || v <= 0) { missing.push(c); continue; }
  /* Six significant digits is far past what an itinerary estimate needs and
     keeps the committed diff from churning on noise. */
  rates[c] = Number(v.toPrecision(6));
}
/* Refuse to publish a partial table: a silently missing currency would fall
   back to "no rate" and quietly drop costs out of every total. */
if (missing.length) throw new Error(`no rate for: ${missing.join(", ")}`);

const out = JSON.stringify({ date: body.date, base: "USD", rates }, null, 1) + "\n";
const path = join(ROOT, "data/rates.json");
const before = existsSync(path) ? readFileSync(path, "utf8") : null;
writeFileSync(path, out);
console.log(`data/rates.json: ${Object.keys(rates).length} currencies, dated ${body.date}` +
  (before === out ? " (unchanged)" : before === null ? " (new)" : " (updated)"));
