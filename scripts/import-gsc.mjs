// Turns a Search Console "Performance → Export → CSV" folder into the JSON the
// UrbanNook SEO case study renders, and copies the raw CSVs to /public as proof.
//
//   node scripts/import-gsc.mjs "<export folder>"
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("Usage: node scripts/import-gsc.mjs <export folder>");

// Minimal RFC 4180 parser: queries can contain commas inside quotes.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [head, ...body] = rows.filter((r) => r.some((c) => c !== ""));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const read = (f) => parseCsv(fs.readFileSync(path.join(dir, f), "utf8"));
const num = (v) => Number(String(v).replace("%", ""));
const sum = (rows, k) => rows.reduce((a, r) => a + num(r[k]), 0);

const daily = read("Chart.csv").map((r) => ({ d: r.Date, c: num(r.Clicks), i: num(r.Impressions), ctr: num(r.CTR), p: num(r.Position) }));
const windowAvg = (from, to) => {
  const w = daily.filter((r) => r.d >= from && r.d <= to);
  return { from, to, days: w.length, clicksPerDay: +(w.reduce((a, r) => a + r.c, 0) / w.length).toFixed(1), impressionsPerDay: +(w.reduce((a, r) => a + r.i, 0) / w.length).toFixed(1) };
};
const totals = {
  clicks: daily.reduce((a, r) => a + r.c, 0),
  impressions: daily.reduce((a, r) => a + r.i, 0),
};
totals.ctr = +((totals.clicks / totals.impressions) * 100).toFixed(1);

const queries = read("Queries.csv");
const isBrand = (q) => /urban\s*nook|urbannook|urbanook/i.test(q);
const brand = queries.filter((r) => isBrand(r["Top queries"]));
const nonBrand = queries.filter((r) => !isBrand(r["Top queries"]));
const q = (r) => ({ query: r["Top queries"], clicks: num(r.Clicks), impressions: num(r.Impressions), position: num(r.Position) });

const pages = read("Pages.csv");
const typeOf = (url) => {
  const p = url.replace(/^https?:\/\/[^/]+/, "");
  if (p.startsWith("/blog/")) return "Blog posts";
  if (p.startsWith("/product")) return "Product pages";
  if (p.startsWith("/category")) return "Category pages";
  if (p === "/" || p === "") return "Home page";
  return "Other pages";
};
const pageTypes = {};
for (const r of pages) {
  const t = (pageTypes[typeOf(r["Top pages"])] ??= { pages: 0, clicks: 0, impressions: 0 });
  t.pages++;
  t.clicks += num(r.Clicks);
  t.impressions += num(r.Impressions);
}

const out = {
  source: "Google Search Console, Performance on Search (web), exported 14 Nov 2026",
  range: { from: daily[0].d, to: daily.at(-1).d },
  totals,
  before: windowAvg("2026-08-11", "2026-10-15"),
  after: windowAvg("2026-11-01", daily.at(-1).d),
  daily,
  brand: { queries: brand.length, clicks: sum(brand, "Clicks"), impressions: sum(brand, "Impressions"), top: brand.slice(0, 3).map(q) },
  nonBrand: {
    queries: nonBrand.length,
    clicks: sum(nonBrand, "Clicks"),
    impressions: sum(nonBrand, "Impressions"),
    onPageOne: nonBrand.filter((r) => num(r.Position) <= 10 && num(r.Impressions) >= 5).length,
    topByImpressions: [...nonBrand].sort((a, b) => num(b.Impressions) - num(a.Impressions)).slice(0, 10).map(q),
    bestRanked: nonBrand.filter((r) => num(r.Impressions) >= 10).sort((a, b) => num(a.Position) - num(b.Position)).slice(0, 10).map(q),
  },
  pageTypes,
  blogPagesWithImpressions: pages.filter((r) => typeOf(r["Top pages"]) === "Blog posts" && num(r.Impressions) > 0).length,
  appearance: read("Search appearance.csv").map((r) => ({ type: r["Search Appearance"], clicks: num(r.Clicks), impressions: num(r.Impressions) })),
  devices: read("Devices.csv").map((r) => ({ device: r.Device, clicks: num(r.Clicks), impressions: num(r.Impressions) })),
  countriesWithImpressions: read("Countries.csv").filter((r) => num(r.Impressions) > 0).length,
};

fs.mkdirSync("src/content/data", { recursive: true });
fs.writeFileSync("src/content/data/urbannook-seo.json", JSON.stringify(out, null, 1));
const proof = "public/proof/urbannook-seo";
fs.mkdirSync(proof, { recursive: true });
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".csv"))) fs.copyFileSync(path.join(dir, f), path.join(proof, f.toLowerCase().replace(/\s+/g, "-")));
console.log(`daily ${daily.length} · clicks ${totals.clicks} · impressions ${totals.impressions} · non-brand queries ${nonBrand.length}`);
