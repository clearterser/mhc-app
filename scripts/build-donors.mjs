#!/usr/bin/env node
// Parse the Give Lively / GiveWP CSV export and generate lib/donors.js.
// Usage: node scripts/build-donors.mjs <path-to-csv>

import fs from "node:fs";
import path from "node:path";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/build-donors.mjs <csv-path>");
  process.exit(1);
}

// --- Minimal RFC4180-ish CSV parser ---
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        row.push(cell);
        cell = "";
      } else if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else if (ch === "\r") {
        // ignore
      } else {
        cell += ch;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(raw);
const header = rows[0];
const data = rows.slice(1).filter((r) => r.length >= header.length / 2);

const idx = (name) => header.indexOf(name);
const COL = {
  total: idx("Donation Total"),
  status: idx("Donation Status"),
  date: idx("Donation Date"),
  firstName: idx("First Name"),
  lastName: idx("Last Name"),
  company: idx("Company Name"),
  donorId: idx("Donor ID"),
  email: idx("Email Address"),
};

// --- Aggregate per donor ID ---
const byDonor = new Map();
for (const r of data) {
  if (r[COL.status] !== "Complete") continue;
  const amount = Number(r[COL.total].replace(/,/g, "")) || 0;
  if (amount <= 0) continue;
  const donorId = r[COL.donorId] || r[COL.email] || `${r[COL.firstName]}_${r[COL.lastName]}`;
  const date = r[COL.date];
  const first = (r[COL.firstName] || "").trim();
  const last = (r[COL.lastName] || "").trim();
  const company = (r[COL.company] || "").trim();

  if (!byDonor.has(donorId)) {
    byDonor.set(donorId, {
      first,
      last,
      company,
      total: 0,
      lastDate: date,
    });
  }
  const d = byDonor.get(donorId);
  d.total += amount;
  if (!d.company && company) d.company = company;
  if (!d.first && first) d.first = first;
  if (!d.last && last) d.last = last;
  // Keep latest date
  if (date > d.lastDate) d.lastDate = date;
}

// --- Build display name (Mongolian convention) ---
// Extracts first letter of "last name", uppercases it, strips leading punctuation.
function buildInitial(s) {
  const cleaned = s.replace(/^[^\p{L}]+/u, "").replace(/\.$/, "");
  if (!cleaned) return "";
  return cleaned.charAt(0).toLocaleUpperCase("mn-MN");
}

function buildDisplayName(d) {
  // Company / organization: use as-is
  if (d.company) return d.company;
  const first = d.first;
  const last = d.last;
  if (!first && !last) return null; // anonymous
  if (!last) return first;
  if (!first) return last;

  // If "last name" field is actually a comment / multi-name string (contains comma,
  // newline, or is unusually long), fall back to just the first name.
  if (last.includes(",") || last.includes("\n") || last.length > 20) {
    return first;
  }

  // If last name is already a single initial (1 char), use it (uppercased).
  const lastStripped = last.replace(/\.$/, "");
  if (lastStripped.length === 1) {
    return `${lastStripped.toLocaleUpperCase("mn-MN")}. ${first}`;
  }

  // Otherwise take first letter as initial.
  const initial = buildInitial(last);
  if (!initial) return first;
  return `${initial}. ${first}`;
}

// --- Assign tier from total ---
function tierFor(total) {
  if (total >= 30000) return "ochir";
  if (total >= 10000) return "altan";
  if (total >= 5000) return "mongon";
  if (total >= 2000) return "hurel";
  if (total >= 500) return "erhem";
  if (total >= 250) return "hundet";
  return "donor";
}

// --- Compose final list ---
const donors = [];
let anonymousCount = 0;
for (const d of byDonor.values()) {
  const name = buildDisplayName(d);
  if (!name) {
    anonymousCount++;
    continue;
  }
  donors.push({
    name,
    tier: tierFor(d.total),
    amount: Math.round(d.total),
    date: d.lastDate,
  });
}

// Sort: by tier order (highest first), then by amount desc within tier.
const TIER_ORDER = [
  "ochir",
  "altan",
  "mongon",
  "hurel",
  "erhem",
  "hundet",
  "donor",
];
donors.sort((a, b) => {
  const ta = TIER_ORDER.indexOf(a.tier);
  const tb = TIER_ORDER.indexOf(b.tier);
  if (ta !== tb) return ta - tb;
  return b.amount - a.amount;
});

// --- Output as JS module ---
const lines = [
  "// Generated from " + path.basename(csvPath) + ".",
  "// Run `node scripts/build-donors.mjs <csv-path>` to regenerate.",
  "// Tiers (match dictionaries/*.json → donors.tiers): ochir / altan / mongon / hurel / erhem / hundet / donor",
  "// `amount` is in USD; `date` is the most recent donation date (ISO YYYY-MM-DD).",
  "",
  "export const donors = [",
];
let currentTier = null;
for (const d of donors) {
  if (d.tier !== currentTier) {
    if (currentTier !== null) lines.push("");
    lines.push(`  // ${d.tier}`);
    currentTier = d.tier;
  }
  const esc = JSON.stringify(d.name);
  lines.push(
    `  { name: ${esc}, tier: ${JSON.stringify(d.tier)}, amount: ${d.amount}, date: ${JSON.stringify(d.date)} },`
  );
}
lines.push("];");
lines.push("");
lines.push(`// Donations from donors who did not provide a name.`);
lines.push(`export const anonymousCount = ${anonymousCount};`);
lines.push("");

const out = lines.join("\n");
const outPath = path.resolve(process.cwd(), "lib/donors.js");
fs.writeFileSync(outPath, out);

// Summary
const tierCounts = donors.reduce((acc, d) => {
  acc[d.tier] = (acc[d.tier] || 0) + 1;
  return acc;
}, {});
console.error(
  `Wrote ${donors.length} donors (+ ${anonymousCount} anonymous) → ${outPath}`
);
console.error("Tier counts:", tierCounts);
