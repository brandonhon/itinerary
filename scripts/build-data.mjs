#!/usr/bin/env node
/* Rebuilds data/airports.json and data/airlines.json.
 *
 *   npm install && node scripts/build-data.mjs
 *
 * Build-time only — the published site is plain HTML/CSS/JS and depends on
 * none of this. Output is committed rather than fetched at runtime, so the page
 * depends on no third-party host while it runs.
 *
 * Airports come from OurAirports (public domain), which is actively maintained.
 * OpenFlights was used first and turned out to be years stale: it was missing
 * Istanbul (IST, opened 2018), Beijing Daxing (PKX, 2019) and Chengdu Tianfu
 * (TFU, 2021), and carried outright errors — it placed Aral Tarim in Xinjiang
 * (ACF) in Australia/Brisbane and Samarinda (AAP) in America/Chicago.
 *
 * OurAirports has no timezone column, so the zone is resolved from the
 * airport's own coordinates with tz-lookup at build time. That is strictly
 * better than a stored table: it cannot disagree with where the airport
 * actually is, and it yields modern canonical names (Asia/Kolkata, not
 * Asia/Calcutta).
 *
 * Airlines still come from OpenFlights (ODbL) — nothing better is free, and
 * carrier names do not rot the way airport lists do.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tzLookup from "tz-lookup";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AIRPORTS = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const AIRLINES = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";

/* Both sources quote any field containing a comma, so splitting on commas
   silently produces garbage. OpenFlights writes null as the two characters \N. */
function parseLine(line) {
  const out = [];
  let cur = "", quoted = false;
  for (const ch of line) {
    if (ch === '"') { quoted = !quoted; continue; }
    if (ch === "," && !quoted) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((f) => (f === "\\N" ? "" : f));
}

async function fetchText(url, minBytes) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const text = await res.text();
  if (text.length < minBytes) throw new Error(`${url}: implausibly small (${text.length} bytes)`);
  return text;
}

/* OurAirports columns: id,ident,type,name,lat,lon,elev,continent,iso_country,
   iso_region,municipality,scheduled_service,icao_code,iata_code,... */
function buildAirports(text) {
  const rows = text.trim().split("\n").slice(1).map(parseLine);
  const SIZED = { large_airport: 1, medium_airport: 1, small_airport: 1 };
  const NOTABLE = { large_airport: 1, medium_airport: 1 };
  const out = {};
  for (const r of rows) {
    const type = r[2], name = r[3], lat = +r[4], lon = +r[5];
    const city = r[10], scheduled = r[11], iata = (r[13] || "").toUpperCase();
    if (!/^[A-Z]{3}$/.test(iata)) continue;
    if (!(type in SIZED)) continue;                /* no heliports, seaplane bases, closed fields */
    /* Anywhere with commercial service, plus every large or medium airport even
       where OurAirports has not flagged its service. Taking every small airstrip
       too would add ~3,500 entries and 36KB for places nobody books a ticket
       to; taking only scheduled ones would drop ~900 that people do use. */
    if (scheduled !== "yes" && !(type in NOTABLE)) continue;
    if (!isFinite(lat) || !isFinite(lon)) continue;
    let tz;
    try { tz = tzLookup(lat, lon); } catch { continue; }
    if (!tz) continue;
    out[iata] = [city || name, tz];
  }
  return out;
}

/* airlines.dat: id,name,alias,IATA,ICAO,callsign,country,active */
function buildAirlines(text) {
  const out = {};
  for (const r of text.trim().split("\n").map(parseLine)) {
    const [, name, , iata, , , , active] = r;
    if (!iata || iata.length !== 2 || active !== "Y" || !name) continue;
    if (name === "Private flight" || out[iata.toUpperCase()]) continue;
    out[iata.toUpperCase()] = name;
  }
  return out;
}

/* Sorted keys keep the diff readable, so a refresh commit shows what actually
   changed instead of a reshuffle. */
function stable(obj) {
  const sorted = {};
  for (const k of Object.keys(obj).sort()) sorted[k] = obj[k];
  return JSON.stringify(sorted) + "\n";
}

function write(rel, text, minEntries) {
  const path = join(ROOT, rel);
  const count = Object.keys(JSON.parse(text)).length;
  /* A truncated or failed upstream fetch would otherwise be committed as a
     "refresh" that quietly deletes most of the table. */
  if (count < minEntries) throw new Error(`${rel}: only ${count} entries, expected >= ${minEntries}`);
  const before = existsSync(path) ? readFileSync(path, "utf8") : null;
  writeFileSync(path, text);
  console.log(`${rel}: ${count} entries, ${(text.length / 1024).toFixed(0)}KB` +
    (before === text ? " (unchanged)" : before === null ? " (new)" : " (updated)"));
}

mkdirSync(join(ROOT, "data"), { recursive: true });
const [apText, alText] = await Promise.all([
  fetchText(AIRPORTS, 1_000_000),
  fetchText(AIRLINES, 10_000),
]);
write("data/airports.json", stable(buildAirports(apText)), 4500);
write("data/airlines.json", stable(buildAirlines(alText)), 800);
