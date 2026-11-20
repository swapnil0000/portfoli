import "server-only";
import type { StaticImageData } from "next/image";
import type { CommandCentreData } from "@/components/case/command-centre";
import type { Day } from "@/components/case/trend-chart";
import noticesShot from "./media/seo-command-centre/official-notices.png";
import cwvOverviewShot from "./media/seo-command-centre/cwv-overview.png";
import cwvTrendsShot from "./media/seo-command-centre/cwv-trends.png";
import lcpCompetitorsShot from "./media/seo-command-centre/lcp-vs-competitors.png";
import seo from "./data/urbannook-seo.json";
import gscPerformanceShot from "./media/urbannook-seo/gsc-performance.png";
import gscTopPagesShot from "./media/urbannook-seo/gsc-top-pages.png";
import merchantShot from "./media/urbannook-seo/merchant-center.png";
import businessShot from "./media/urbannook-seo/google-business.png";
import ga4AcquisitionShot from "./media/urbannook-seo/ga4-acquisition.png";
import ga4LandingShot from "./media/urbannook-seo/ga4-landing-pages.png";
import ga4OverviewShot from "./media/urbannook-seo/ga4-overview.png";
import speedPageA from "./media/adda247-speed/page-a.png";
import speedPageB from "./media/adda247-speed/page-b.png";
import speedPageC from "./media/adda247-speed/page-c.png";
import speedPageD from "./media/adda247-speed/page-d.png";

// Long-form case-study content. Kept out of work.ts so it never ships in the
// client bundle (the ⌘K palette imports work.ts).

type Status = "good" | "needs-improvement" | "poor";

export type Visual =
  | {
      kind: "bars";
      title: string;
      caption?: string;
      source?: string;
      rows: { label: string; value: number; display: string; note?: string; emphasis?: boolean }[];
    }
  | { kind: "table"; title: string; caption?: string; source?: string; columns: string[]; rows: string[][]; emphasisRow?: number }
  | {
      kind: "vitals";
      title: string;
      caption?: string;
      source?: string;
      items: { metric: string; abbr: string; before: string; after: string; beforeStatus: Status; afterStatus: Status; threshold: string }[];
    }
  | { kind: "events"; title: string; caption?: string; source?: string; events: { name: string; step: string; platforms: string[] }[] }
  | ({ kind: "command-centre"; title: string } & CommandCentreData)
  | { kind: "architecture"; title: string; caption?: string; columns: { label: string; items: { name: string; detail: string }[] }[] }
  | {
      kind: "cwv";
      title: string;
      caption?: string;
      source?: string;
      verdict: string;
      items: { abbr: string; name: string; value: string; status: Status; dist: [number, number, number] }[];
    }
  | { kind: "gallery"; title: string; caption?: string; frameLabel?: string; images: { src: StaticImageData; alt: string; caption: string; label?: string }[] }
  | { kind: "dashboard"; title: string; caption?: string; groups: { source: string; period: string; tiles: { value: string; label: string }[] }[] }
  | { kind: "trend"; title: string; caption?: string; source?: string; daily: Day[]; annotations: { d: string; label: string }[]; panels: { key: "i" | "c"; title: string }[] }
  | { kind: "downloads"; title: string; caption?: string; files: { label: string; detail: string; href: string }[] }
  | {
      kind: "journey";
      title: string;
      caption?: string;
      phases: { name: string; steps: { when: string; who: "auto" | "team" | "customer"; title: string; detail: string }[] }[];
    }
  | {
      kind: "timeline";
      title: string;
      caption?: string;
      source?: string;
      events: { date: string; type: "release" | "field" | "lab"; title: string; detail: string }[];
    }
  | {
      kind: "waterfall";
      title: string;
      caption?: string;
      source?: string;
      scenarios: {
        label: string;
        result: string;
        // schematic units, not milliseconds
        rows: { name: string; start: number; end: number; blocking?: boolean }[];
        paintAt: number;
      }[];
    };

export type CaseBody = {
  // Proof-led cases show the evidence straight after the summary.
  evidenceFirst?: boolean;
  role: string;
  context: string[];
  workstreams: { stage: string; title: string; points: string[] }[];
  evidence?: { intro: string; visuals: Visual[]; findings?: string[] };
  results: string[];
  next?: string[];
};

const n = (v: number) => v.toLocaleString("en-IN");
const growth = (a: number, b: number) => {
  const r = b / a;
  return `${r >= 10 ? Math.round(r) : r.toFixed(1)}×`;
};
const pageType = (k: keyof typeof seo.pageTypes) => seo.pageTypes[k];

export const caseBodies: Record<string, CaseBody> = {
  "urbannook-sales": {
    evidenceFirst: true,
    role: "Built most of the system — WhatsApp login, every automatic message, the Customer Hub, call notes and the inbox — with Dheeraj on the Sales Desk and reviews. The three of us (Swapnil, Yash, Dheeraj) also make the calls.",
    context: [
      "8 out of 10 UrbanNook visitors arrive from Instagram ads and browse inside Instagram's own browser. Google blocks its login there, so most shoppers who added something to their cart stayed anonymous — no phone number, no way to follow up.",
      "WhatsApp CRMs charge a monthly fee per seat on top of message costs. We wanted the same thing for the price of the messages alone, built into the admin the team already uses.",
    ],
    workstreams: [
      {
        stage: "convert",
        title: "Capture the number: WhatsApp login",
        points: [
          "Inside Instagram and Facebook's browsers the Google button is hidden and WhatsApp login is offered instead: the site shows a code, the shopper sends it to our WhatsApp, and Gupshup's webhook signs them in.",
          "Codes expire in 5 minutes, skip look-alike characters (0/O, 1/I/L), are rate-limited, and the webhook is protected by a secret. No SMS OTP to pay for.",
          "Numbers are normalised to 10 digits so existing customers are matched, not duplicated.",
        ],
      },
      {
        stage: "convert",
        title: "Messages that send themselves",
        points: [
          "Cart left: a WhatsApp reminder after about 20 minutes, separate from the email funnel.",
          "Payment failed: a “complete my order” message 45 minutes to 12 hours later, only between 9 am and 9 pm, at most 30 per run.",
          "Order paid, out for delivery, delivered, back in stock — each with its own approved template.",
          "Rules for every message: one template per number per 24 hours, two failed sends and the number is skipped, and opting out of offers never stops delivery updates.",
        ],
      },
      {
        stage: "convert",
        title: "A call desk inside the admin",
        points: [
          "Customer Hub: abandoned carts, recovery, failed orders, delivery follow-up, WhatsApp, notify-me, customisation requests and questions in one place.",
          "Sales Desk tags carts Hot (under 6 hours), Warm (under 48 hours) or Cold, with 6 ready-made messages; “Not interested”, “Wrong number” or three “No answer” calls close a cart.",
          "Every call note records the outcome, a callback time, who called and from which team number; “Call back now” appears when it's due.",
          "Review calls are split between three callers by phone number, so a customer always belongs to the same person; “Start calling” serves the next 10.",
        ],
      },
      {
        stage: "measure",
        title: "Reply like a person, at scale",
        points: [
          "WhatsApp Inbox with chats grouped per customer and their order beside the thread; free replies inside WhatsApp's 24-hour window, approved templates outside it.",
          "Quick replies, and new templates created and submitted for approval from the admin.",
          "The live offer on a customer's products is written into recovery messages automatically.",
          "Product photos are converted from .webp to JPEG first — WhatsApp silently drops .webp images while Gupshup reports them as sent.",
        ],
      },
    ],
    evidence: {
      intro: "Numbers from one month of running it. Revenue and order counts are from the team's own records.",
      visuals: [
        {
          kind: "dashboard",
          title: "One month, in numbers",
          caption: "No CRM subscription — the only running cost is Gupshup's per-message fee.",
          groups: [
            {
              source: "Sales calls + WhatsApp follow-up",
              period: "1 month",
              tiles: [
                { value: "30", label: "orders won back by the team" },
                { value: "≈ ₹1L", label: "revenue from those orders (about ₹3,300 each)" },
              ],
            },
            {
              source: "Gupshup (WhatsApp)",
              period: "1 month",
              tiles: [
                { value: "1,300", label: "people messaged" },
                { value: "₹900", label: "total cost — under ₹0.70 per person" },
              ],
            },
            {
              source: "WhatsApp login",
              period: "since Sep 2026",
              tiles: [
                { value: "+35%", label: "more phone numbers captured (team measurement)" },
                { value: "₹0", label: "spent on SMS OTPs" },
              ],
            },
            {
              source: "Customer Hub",
              period: "always on",
              tiles: [
                { value: "8", label: "queues in one place: carts to reviews" },
                { value: "3", label: "callers, customers split automatically" },
              ],
            },
          ],
        },
        {
          kind: "journey",
          title: "What happens after someone visits",
          caption: "Green steps send themselves; blue steps are a person on the team.",
          phases: [
            {
              name: "Capture",
              steps: [
                { when: "visit", who: "customer", title: "Arrives from an Instagram ad", detail: "Browsing inside Instagram's own browser, where Google login is blocked." },
                { when: "login", who: "customer", title: "Logs in with WhatsApp", detail: "Sends a short code to our number — we now have their phone." },
                { when: "add to cart", who: "customer", title: "Adds to cart, then leaves", detail: "The cart lands on the Sales Desk, tagged Hot." },
              ],
            },
            {
              name: "Recover",
              steps: [
                { when: "+20 min", who: "auto", title: "Cart reminder on WhatsApp", detail: "From the UrbanNook number, with the product." },
                { when: "< 6 h", who: "team", title: "A call from the Sales Desk", detail: "Note saved: outcome, who called, when to call back." },
                { when: "+45 min", who: "auto", title: "If payment fails: “complete my order”", detail: "Only 9 am–9 pm; the live offer is filled in." },
                { when: "chat", who: "team", title: "Questions answered in the inbox", detail: "Reply inside 24 h, with their order beside the chat." },
              ],
            },
            {
              name: "Retain",
              steps: [
                { when: "paid", who: "auto", title: "Order confirmed", detail: "Then out for delivery with courier and AWB." },
                { when: "delayed", who: "team", title: "Delay update, before they ask", detail: "Same message on WhatsApp, email and the order page." },
                { when: "day 3", who: "auto", title: "“All good?” check", detail: "Anyone with an issue is never asked for a review." },
                { when: "happy", who: "team", title: "Google review link", detail: "Sent by the customer's assigned caller." },
              ],
            },
          ],
        },
        {
          kind: "table",
          title: "Every automatic WhatsApp message",
          caption: "Approved Gupshup templates, each switched on separately.",
          columns: ["Trigger", "Message", "Timing / rule"],
          rows: [
            ["Cart left", "Cart reminder", "~20 min after"],
            ["Payment failed", "Complete my order", "45 min–12 h, 9 am–9 pm"],
            ["Order paid", "Order confirmation", "Instantly"],
            ["Courier update", "Out for delivery / delivered", "From tracking"],
            ["Back in stock", "Notify-me alert", "When stock returns"],
            ["Sale or launch", "Campaign", "Opt-outs excluded"],
          ],
        },
      ],
      findings: [
        "₹900 of WhatsApp messages in a month — the same month the team's calls and WhatsApp follow-ups brought back 30 orders worth about ₹1 lakh.",
        "WhatsApp login fixed the biggest gap: Instagram's browser blocks Google login, and those shoppers now leave a phone number.",
        "Customers trust a store more when it talks to them on WhatsApp like a person: order updates, a call when something's stuck, a reply in the same chat.",
      ],
    },
    results: [
      "30 orders and about ₹1 lakh won back in one month through calls and WhatsApp.",
      "WhatsApp cost: ₹900 for 1,300 people — under ₹0.70 each, with no CRM subscription.",
      "About 35% more phone numbers captured since WhatsApp login went live.",
      "One admin for the whole team: queues, call notes, caller split and the inbox.",
    ],
    next: ["Track recovered revenue per caller and per message automatically, instead of from the team's records."],
  },

  "urbannook-seo": {
    evidenceFirst: true,
    role: "Led UrbanNook's SEO with the in-house team: technical SEO, the blog and category system, structured data, Merchant Center feeds, Google Business Profile and Search Console measurement.",
    context: [
      "Until mid-October, Google showed UrbanNook almost only to people who already typed its name — about 27 times a day. The store was a client-side app, so Google saw little content, and there was no blog, no category pages and no clean product data for Shopping.",
      "Most sales came from Instagram ads. The goal was a second, free channel: people searching for anime katanas, car lamps and gifts finding UrbanNook on their own.",
    ],
    workstreams: [
      {
        stage: "get-found",
        title: "Make every page readable to Google",
        points: [
          "Every public page pre-built as real HTML at deploy time — product pages now serve 1,700+ words of content Google can read, with one H1 and a self-referencing canonical.",
          "Structured data on every template: product groups with variants and offers, return policy, real ratings only, FAQs, breadcrumbs, category listings and blog posts.",
          "A 129-URL sitemap with 110 product images, real 404s, 301s for old URLs, noindex on account and checkout pages, and a robots.txt plus llms.txt that welcome AI search crawlers.",
        ],
      },
      {
        stage: "get-found",
        title: "A blog that answers what fans search for",
        points: [
          "44 posts on anime and game swords, car lamps and gift ideas — each linked to the matching product by SKU (“Know the story”), so readers can buy what they just read about.",
          "8 category pages with titles, descriptions and FAQs the team edits from the admin.",
        ],
      },
      {
        stage: "get-customers",
        title: "Free product listings on Google Shopping",
        points: [
          "A Merchant Center feed per variant with SKU, colour, material and size, cleaned of car-brand trademarks and restricted items so it passes policy review — all 66 products approved.",
        ],
      },
      {
        stage: "measure",
        title: "Local trust and measurement",
        points: [
          "A verified Google Business Profile with 4.9★ from 18 reviews, fed by a review-request flow that only asks happy customers.",
          "Search Console compared with first-party tracking, and SEO & Ads health checks every 6 hours with WhatsApp alerts.",
        ],
      },
    ],
    evidence: {
      intro: "Everything below comes straight from Google's own tools. The raw Search Console export is at the bottom of the page.",
      visuals: [
        {
          kind: "dashboard",
          title: "The numbers, from Google",
          caption: "Each card is one Google tool; the screenshots further down show the same numbers.",
          groups: [
            {
              source: "Google Search Console",
              period: "11 Aug – 10 Nov 2026",
              tiles: [
                { value: growth(seo.before.impressionsPerDay, seo.after.impressionsPerDay), label: `daily impressions (${Math.round(seo.before.impressionsPerDay)} → ${Math.round(seo.after.impressionsPerDay)} a day)` },
                { value: growth(seo.before.clicksPerDay, seo.after.clicksPerDay), label: `daily clicks (${Math.round(seo.before.clicksPerDay)} → ${Math.round(seo.after.clicksPerDay)} a day)` },
                { value: n(seo.nonBrand.queries), label: "different searches that show UrbanNook" },
                { value: String(seo.nonBrand.onPageOne), label: "non-brand searches ranking on page one" },
              ],
            },
            {
              source: "Google Merchant Center",
              period: "17 Oct – 13 Nov 2026",
              tiles: [
                { value: "1.09K", label: "free product clicks (+161.7% vs previous 28 days)" },
                { value: "66 / 66", label: "products approved, none disapproved" },
              ],
            },
            {
              source: "Google Business Profile",
              period: "Nov 2026",
              tiles: [
                { value: "4.9★", label: "from 18 Google reviews, verified profile" },
                { value: "#1.3", label: "average position for “urbannook”, 73% click-through" },
              ],
            },
            {
              source: "Google Analytics 4",
              period: "17 Oct – 13 Nov 2026",
              tiles: [
                { value: "2,002", label: "sessions from Google search" },
                { value: "2.5×", label: "longer visits than paid social (1m 09s vs 28s)" },
              ],
            },
          ],
        },
        {
          kind: "trend",
          title: "Google started showing the store to new people",
          caption: "Daily impressions and clicks on Google Search. Hover or use arrow keys to read any day.",
          source: seo.source,
          daily: seo.daily,
          annotations: [
            { d: "2026-09-27", label: "SEO phase 0 live" },
            { d: "2026-10-16", label: "Pre-built pages + blog live" },
          ],
          panels: [
            { key: "i", title: "Impressions per day" },
            { key: "c", title: "Clicks per day" },
          ],
        },
        {
          kind: "table",
          title: "Ranking on page one for what shoppers search",
          caption: "Best-ranked searches that don't include the brand name (10+ impressions).",
          source: seo.source,
          columns: ["Search", "Avg position", "Impressions"],
          rows: seo.nonBrand.bestRanked.map((r) => [r.query, r.position.toFixed(1), n(r.impressions)]),
        },
        {
          kind: "bars",
          title: "The blog brings the most new eyes",
          caption: "Impressions by page type. Search Console counts each page separately, so these add up to more than the site total.",
          source: seo.source,
          rows: [
            { label: `Blog posts (${pageType("Blog posts").pages})`, value: pageType("Blog posts").impressions, display: n(pageType("Blog posts").impressions), emphasis: true, note: `${seo.blogPagesWithImpressions} posts already appear in Google` },
            { label: `Product pages (${pageType("Product pages").pages})`, value: pageType("Product pages").impressions, display: n(pageType("Product pages").impressions), note: `${n(seo.appearance[0].impressions)} with product rich results` },
            { label: "Home page", value: pageType("Home page").impressions, display: n(pageType("Home page").impressions) },
            { label: `Category pages (${pageType("Category pages").pages})`, value: pageType("Category pages").impressions, display: n(pageType("Category pages").impressions) },
          ],
        },
        {
          kind: "bars",
          title: "Visitors from Google stay longer",
          caption: "Average engagement time per session, by channel.",
          source: "Google Analytics 4, Traffic acquisition, 17 Oct – 13 Nov 2026",
          rows: [
            { label: "Google search", value: 69, display: "1m 09s", emphasis: true, note: "84% engagement rate" },
            { label: "Direct", value: 47, display: "47s" },
            { label: "Organic social", value: 41, display: "41s" },
            { label: "Paid social", value: 28, display: "28s", note: "74.5% engagement rate" },
          ],
        },
        {
          kind: "gallery",
          title: "Screenshots from each tool",
          caption: "Taken 13–14 Nov 2026. Personal names and account IDs are cropped out.",
          images: [
            { src: gscPerformanceShot, label: "search console", alt: "Search Console performance, last 3 months: 1.62K clicks, 12.8K impressions, 12.7% CTR, average position 8.4, with impressions rising sharply from mid-October.", caption: "Search Console — 1.62K clicks, 12.8K impressions in 3 months" },
            { src: gscTopPagesShot, label: "search console", alt: "Search Console top pages table: home page, products, contact, and blog posts such as Jin Sakai katana, anime katana under 2000 and Vergil's Yamato.", caption: "Search Console — top pages, blog posts among them" },
            { src: merchantShot, label: "merchant center", alt: "Merchant Center: 1.09K total clicks in the last 28 days, up 161.7%, and 66 of 66 products approved.", caption: "Merchant Center — 1.09K clicks (+161.7%), 66/66 approved" },
            { src: businessShot, label: "google search", alt: "Google search for UrbanNook showing the verified business panel with 4.9 stars from 18 Google reviews and the website as the first result.", caption: "Brand search — verified profile, 4.9★, site ranks first" },
            { src: ga4AcquisitionShot, label: "google analytics", alt: "GA4 user acquisition by channel for 17 Oct to 13 Nov 2026, with Organic Search users showing 3m 48s average engagement time.", caption: "GA4 — users by channel" },
            { src: ga4LandingShot, label: "google analytics", alt: "GA4 landing pages report with sessions, key events and revenue per landing page.", caption: "GA4 — landing pages with revenue" },
            { src: ga4OverviewShot, label: "google analytics", alt: "GA4 overview showing new users by channel and organic Google Search landing pages led by blog posts.", caption: "GA4 — organic landing pages led by the blog" },
          ],
        },
        {
          kind: "downloads",
          title: "Raw data — Search Console export",
          caption: "The exact files behind every number above, exported 14 Nov 2026.",
          files: [
            { label: "chart.csv", detail: "Daily clicks, impressions, CTR and position — 92 days", href: "/proof/urbannook-seo/chart.csv" },
            { label: "queries.csv", detail: `${n(seo.brand.queries + seo.nonBrand.queries)} search terms`, href: "/proof/urbannook-seo/queries.csv" },
            { label: "pages.csv", detail: "Every page that appeared in Google", href: "/proof/urbannook-seo/pages.csv" },
            { label: "countries.csv", detail: `${seo.countriesWithImpressions} countries with impressions`, href: "/proof/urbannook-seo/countries.csv" },
            { label: "devices.csv", detail: "Mobile, desktop and tablet", href: "/proof/urbannook-seo/devices.csv" },
            { label: "search-appearance.csv", detail: "Product rich results and Merchant listings", href: "/proof/urbannook-seo/search-appearance.csv" },
          ],
        },
      ],
      findings: [
        `Impressions grew from about ${Math.round(seo.before.impressionsPerDay)} a day to ${Math.round(seo.after.impressionsPerDay)} a day within three weeks of pre-built pages and the blog going live on 16 October.`,
        `${seo.nonBrand.onPageOne} searches that don't mention the brand now rank on page one — for example "katana under 2000", "brake caliper lamp" and "anime led katana".`,
        "Average position moved from about 3 to 8. That's expected and healthy: the store now appears for hundreds of new, competitive searches instead of only its own name.",
        "Brand search is locked in: “urbannook” ranks #1.3 with a 73% click-through rate, next to a verified Business Profile.",
      ],
    },
    results: [
      `${growth(seo.before.impressionsPerDay, seo.after.impressionsPerDay)} more daily Google impressions and ${growth(seo.before.clicksPerDay, seo.after.clicksPerDay)} more daily clicks, measured in Search Console.`,
      `${n(seo.nonBrand.queries)} different searches now show UrbanNook; ${seo.blogPagesWithImpressions} blog posts already appear in Google.`,
      "1.09K free product clicks in 28 days from Google Shopping, with all 66 products approved.",
      "A verified Google Business Profile at 4.9★, and Google visitors who stay 2.5× longer than paid-social visitors.",
    ],
    next: [
      "Readable product URLs (e.g. /product/brake-caliper-lamp instead of an ID).",
      "Turn high-impression blog posts like “Zoro swords explained” into more clicks with sharper titles and descriptions.",
      "Switch on the Google reviews widget in production so the 4.9★ shows on the site.",
    ],
  },
  urbannook: {
    role: "Lead engineer for growth — SEO architecture, ads and tracking infrastructure, analytics and the operations admin — working alongside UrbanNook's in-house engineer, who led the PageSpeed overhaul and the NFC gifting admin.",
    context: [
      "UrbanNook is an Indian D2C brand selling 3D-printed home decor, desk lamps and anime-inspired collectibles, shipped across India with cash on delivery. Most of its traffic arrives from Instagram ads.",
      "When I started, the storefront was a client-side React app. Crawlers received an empty shell, robots.txt blocked every bot except Google, product ratings were placeholders, and the numbers in Meta Ads Manager didn't match the order book.",
    ],
    workstreams: [
      {
        stage: "get-found",
        title: "Made the store readable to Google and AI",
        points: [
          "Moved every public page from client-side rendering to build-time static generation with hydration — real HTML for each product, variant, category and collection.",
          "Real 404s and 301s, one canonical URL per page, noindex on checkout and account pages, and the duplicate workers.dev host switched off.",
          "Structured data: Product and ProductGroup with offers, shipping and return policy, ratings from real reviews only, breadcrumbs, collections, FAQs and blog posts.",
          "Programmatic category and franchise collection pages (auto-noindexed below three products), plus an admin-managed SEO page builder and blog.",
          "robots.txt and llms.txt rewritten to welcome AI crawlers — GPTBot, ClaudeBot, PerplexityBot — alongside Google.",
        ],
      },
      {
        stage: "get-customers",
        title: "Gave Meta and Google clean signals",
        points: [
          "Found Meta's auto-configured events reporting roughly 167 add-to-carts a day against about 11 real ones — a 15× inflation training the ad algorithm on noise — and switched them off.",
          "Meta Pixel plus Conversions API sharing one event_id for deduplication, with hashed customer data, fbp/fbc and external_id.",
          "Google Ads purchase conversions keyed by order ID with enhanced conversions, and a server-side GA4 purchase fired from the Razorpay webhook as a fallback.",
          "Variant-level Merchant Center and Meta catalog feeds keyed by SKU, with brand-trademark and restricted-product cleanup to pass policy review.",
        ],
      },
      {
        stage: "measure",
        title: "Built a first-party source of truth",
        points: [
          "A 466-point tracking specification covering every step from landing to refund, with consent handling for India's DPDP Act.",
          "30+ GA4 ecommerce and custom events — view_item through payment_cancel_feedback — with the key steps mirrored to Meta's standard events.",
          "A first-touch channel classifier from UTM, gclid and fbclid, stored server-side with a purchase dedupe key.",
          "Funnel and channel dashboards inside the admin, cross-checked against Search Console and Razorpay to the rupee.",
        ],
      },
      {
        stage: "convert",
        title: "Recovered the orders that almost happened",
        points: [
          "Automatic cleanup of abandoned orders, recovery leads for failed payments and carts with WhatsApp templates, and a follow-up call desk that logs every call.",
          "Shopper identities merged by phone number, so one customer is one record across devices.",
          "Payment-failure feedback captured at the moment of failure.",
          "In-app browser detection that nudges Instagram and Facebook visitors to open the store in a real browser.",
        ],
      },
      {
        stage: "build",
        title: "Ran the business from one admin",
        points: [
          "A ~40-screen admin: orders, split shipments, settlements behind 2FA, abandoned carts, SEO pages, funnel analytics and a WhatsApp inbox.",
          "An SEO & Ads health monitor that checks the site, Merchant feed, Search Console, PageSpeed and GA4 every six hours and alerts on WhatsApp.",
          "Static site on S3 behind a Cloudflare Worker, API on EC2, Jenkins releases with one-step rollback.",
        ],
      },
    ],
    evidence: {
      intro:
        "With tracking that could be trusted, the September review (1–22 September 2026) finally showed where money was being lost — counted per person, reconciled against Razorpay.",
      visuals: [
        {
          kind: "bars",
          title: "12,414 in, 95 out — and one cliff",
          caption: "Website visitors by the furthest funnel step they reached.",
          source: "UrbanNook first-party events, 1–22 Sep 2026; each person counted once",
          rows: [
            { label: "Visited the site", value: 12414, display: "12,414" },
            { label: "Opened a product", value: 11419, display: "11,419" },
            { label: "Added to cart", value: 616, display: "616", emphasis: true, note: "10,803 product viewers left without adding (94.6%)" },
            { label: "Started checkout", value: 416, display: "416", note: "−200 (32.5%)" },
            { label: "Gave phone or email", value: 271, display: "271", note: "−145 (34.9%)" },
            { label: "Entered pincode", value: 249, display: "249", note: "−22 (8.1%)" },
            { label: "Reached payment", value: 184, display: "184", note: "−65 (26.1%)" },
            { label: "Paid", value: 95, display: "95", note: "89 reached payment and didn't pay" },
          ],
        },
        {
          kind: "table",
          title: "The biggest source was the worst-converting one",
          caption: "Visitors credited to their first-touch source.",
          source: "UrbanNook channel classifier, 1–22 Sep 2026. Google Organic is 200 visitors — a signal, not a precise rate",
          columns: ["Source", "Visitors", "Share", "Added to cart", "Bought"],
          rows: [
            ["Meta Ads", "10,219", "82.3%", "3.85%", "0.48%"],
            ["Meta Organic", "1,237", "10.0%", "8.81%", "2.02%"],
            ["Direct", "748", "6.0%", "10.03%", "1.60%"],
            ["Google Organic", "200", "1.6%", "19.00%", "4.50%"],
          ],
          emphasisRow: 3,
        },
        {
          kind: "bars",
          title: "Same site, three to four times the conversion outside Instagram",
          caption: "Purchase rate by browser.",
          source: "UrbanNook first-party events, 1–22 Sep 2026; browsers under 20 visitors excluded",
          rows: [
            { label: "Instagram in-app", value: 0.53, display: "0.53%", emphasis: true, note: "80% of all visitors (9,933)" },
            { label: "Chrome", value: 1.91, display: "1.91%", note: "1,207 visitors" },
            { label: "Safari", value: 2.1, display: "2.10%", note: "858 visitors" },
          ],
        },
      ],
      findings: [
        "Google Organic visitors bought at 4.5% — nine times the 0.48% from Meta Ads, which brought 82% of traffic.",
        "Four in five visitors never left Instagram's in-app browser, where sessions die when people switch to their UPI app to pay.",
        "₹1.08L sat in 63 orders that reached payment and failed. Nine came back (14%) before any systematic follow-up existed — which is why the call desk now logs every attempt.",
        "Two buyers were refused at payment by a coupon cap that should have fired when the coupon was applied — a self-inflicted loss and a quick fix.",
      ],
    },
    results: [
      "Every public page server-readable with rich results-eligible structured data.",
      "Meta's add-to-cart signal cut from ~15× inflated to real, with Pixel and CAPI deduplicated.",
      "₹1.92L booked from 107 paid orders in 22 days (average ₹1,796), reconciled to Razorpay.",
      "With the in-house team: mobile PageSpeed from 45–58 to 89–92, and product-page layout shift from 1.77 to 0.",
    ],
    next: [
      "Cut first-load weight for the Instagram in-app browser — the single biggest lever on the funnel.",
      "Move the coupon usage check to apply-time.",
      "Capture real-user load time and every payment error, so all 63 failures have a reason attached.",
    ],
  },

  "seo-command-centre": {
    role: "Designed and built the whole platform — data pipelines, crawlers, alerting, the dashboard UI and the AI agent API — inside Adda247's admin CMS (React + Node).",
    context: [
      "In government-exam prep, search traffic is a race. When SSC, UPSC or IBPS posts an admit card or result, millions of students search for it within minutes — and the site that publishes first, and loads fast, takes the traffic.",
      "The SEO team was working from spreadsheets, manual site checks and separate Google tools. Nobody could see, in one place, what had just been announced, who had published it, how our pages ranked, or whether the site was healthy.",
    ],
    workstreams: [
      {
        stage: "get-found",
        title: "Official Notice Monitor — know first",
        points: [
          "41 official pages — SSC, UPSC, NTA, IBPS, SBI, RRB, NABARD, SEBI, LIC, PSUs, defence and state commissions — read every 5 minutes, in parallel so 40+ slow government sites still fit the window.",
          "A new result, admit card or notification is emailed and posted to Google Chat at once. Notices listed on several pages of one organisation alert once.",
          "Honest timestamps: the date comes from the site or the notice title; notices published while the monitor was off are marked “Missed” instead of pretending to be fresh.",
          "Built for messy government sites: an SSC API source, tolerance for broken TLS, silent baseline reads for new sources, and a warning when a source keeps failing. Sites behind captchas or JavaScript-only pages are documented, not silently skipped.",
        ],
      },
      {
        stage: "get-found",
        title: "Content Race — publish first",
        points: [
          "Every 3 hours, reads the content sitemaps of 5 group sites and 3 competitors and records every new or updated page.",
          "Matches pages on the same topic across sites — even when they're named differently — to show who published first and which topics we're missing.",
          "Handles sitemaps without dates and first-time reads without flooding the feed with false “new” pages.",
        ],
      },
      {
        stage: "measure",
        title: "Rankings and Search Intent — know what's moving",
        points: [
          "Search Console data with weekly winners and losers (500+ impressions), low-CTR opportunities and a 16-week position trend for priority keywords.",
          "Every search query classified by exam lifecycle stage — notification, admit card, answer key, result — in English, Hinglish and Hindi script, plus buyer and question intent.",
        ],
      },
      {
        stage: "convert",
        title: "Site Health — fix before traffic drops",
        points: [
          "A weekly audit of the top 1,000 pages by Search Console clicks against 24 checks: errors, redirect chains, noindex, canonicals, titles, descriptions, H1s, thin content, broken JSON-LD, images without dimensions, heavy HTML and slow responses.",
          "Severity-weighted health score (error, warning, info), resumable runs, and a manual re-run button.",
        ],
      },
      {
        stage: "convert",
        title: "Core Web Vitals — prove speed with real users",
        points: [
          "Chrome UX Report (real-user) data for our site and six other exam-prep sites, weekly, plus any URL on demand.",
          "Trend analysis flags weeks that jump week-on-week or fall outside mean ± 2σ, and LCP is broken down into server, discovery, download and render time.",
          "PageSpeed diagnostics grouped by the metric they affect. All Google API calls run server-side and are cached, so keys never reach the browser.",
        ],
      },
      {
        stage: "measure",
        title: "News Radar and an AI analyst",
        points: [
          "Google's Search Status Dashboard, Search Central blog and web.dev, plus industry feeds, fetched every 2 hours; official incidents are flagged for same-day attention.",
          "A token-protected agent API lets a scheduled Claude agent write a plain-English “what changed / what we should do” for each item, and a Monday report for managers — told to use only the dashboard's own numbers and never invent a ranking factor.",
        ],
      },
    ],
    evidence: {
      intro: "The monitor in motion — replayed with real public notices it caught — followed by the system behind it and screenshots from production.",
      visuals: [
        {
          kind: "command-centre",
          title: "Official Notice Monitor",
          sweepSeconds: 300,
          caption: "Replay of real public notices detected 13–14 Nov 2026. The production dashboard is internal to Adda247.",
          sources: [
            "SSC", "UPSC", "NTA", "RRB Ranchi", "National Career Service", "Employment News", "IBPS", "SBI Careers", "NABARD", "SEBI", "LIC",
            "Oriental Insurance", "ECGC", "NICL", "GAIL", "BEL", "BHEL", "Indian Coast Guard", "CRPF", "CISF", "UPSSSC", "UPPSC", "BPSC", "RPSC",
            "HSSC", "DSSSB", "UKPSC", "WBPSC", "APPSC", "TNPSC", "TN TRB", "TNPDCL", "UPSC – Recruitment", "UPSC – Active exams", "NTA – Notice board",
            "IBPS – CRP updates", "IBPS – Careers", "UPSSSC – News", "RPSC – News", "TNPSC – Recruitments", "TN Career Services",
          ],
          notices: [
            { org: "RRB Ranchi", kind: "Notice", title: "(07/2026) Application — Special Notice, 13-11-2026" },
            { org: "RPSC", kind: "Result", title: "Samanya Darsan — Revised Result (Qualified for Interview), Asst. Prof. 2024" },
            { org: "UPPSC", kind: "Result", title: "Asst. Professor, Transfusion Medicine — Result of Advt. D-1/E-1/2026" },
            { org: "RPSC", kind: "Result", title: "Dharm Shastra — Result Preamble, Asst. Prof. (Sanskrit College Edu.) 2024" },
            { org: "RPSC", kind: "Notice", title: "Pickup List Against Non-Joiners — Asst. Agriculture Officer (Non-TSP) 2018" },
            { org: "RPSC", kind: "Result", title: "Yajurved — Result Preamble, Asst. Prof. (Sanskrit College Edu.) 2024" },
            { org: "RPSC", kind: "Result", title: "Jyotish Ganit — Result Preamble, Asst. Prof. (Sanskrit College Edu.) 2024" },
          ],
          stats: [
            { value: "41", label: "official pages" },
            { value: "5 min", label: "check cycle" },
            { value: "109", label: "new notices in 7 days" },
            { value: "0", label: "sources failing" },
          ],
        },
        {
          kind: "architecture",
          title: "How it fits together",
          caption: "Scheduled jobs collect and diff; one API feeds the dashboard, the alerts and the AI agent.",
          columns: [
            {
              label: "Sources",
              items: [
                { name: "41 official exam pages", detail: "HTML diff + SSC API" },
                { name: "Group & competitor sitemaps", detail: "8 sites" },
                { name: "Google Search Console", detail: "queries, pages, positions" },
                { name: "CrUX + PageSpeed", detail: "real-user speed" },
                { name: "Google & industry feeds", detail: "6 sources" },
              ],
            },
            {
              label: "Engine",
              items: [
                { name: "Every 5 min", detail: "notice monitor" },
                { name: "Every 2–3 h", detail: "news radar, content race" },
                { name: "Weekly", detail: "1,000-page site audit" },
                { name: "Node + MariaDB", detail: "diffing, dedupe, cache" },
              ],
            },
            {
              label: "Outputs",
              items: [
                { name: "SEO dashboard", detail: "10 views in the admin CMS" },
                { name: "Email + Google Chat", detail: "instant notice alerts" },
                { name: "AI agent API", detail: "daily briefs, weekly report" },
              ],
            },
          ],
        },
        {
          kind: "cwv",
          title: "Core Web Vitals: passed on mobile",
          caption: "75th percentile of real Chrome users, with the share of visits rated good, needs improvement and poor.",
          source: "Chrome UX Report via the dashboard's CrUX view — mobile, 28-day window 15 Oct – 11 Nov 2026",
          verdict: "Passed",
          // TODO: confirm whether this query was the whole origin or the test-series URL in the screenshot.
          items: [
            { abbr: "LCP", name: "Largest Contentful Paint", value: "1.61 s", status: "good", dist: [87, 6, 6] },
            { abbr: "INP", name: "Interaction to Next Paint", value: "183 ms", status: "good", dist: [78, 18, 4] },
            { abbr: "CLS", name: "Cumulative Layout Shift", value: "0.00", status: "good", dist: [92, 5, 4] },
            { abbr: "FCP", name: "First Contentful Paint", value: "1.48 s", status: "good", dist: [82, 10, 8] },
            { abbr: "TTFB", name: "Time to First Byte", value: "723 ms", status: "good", dist: [78, 15, 7] },
          ],
        },
        {
          kind: "gallery",
          title: "From production",
          caption: "Screenshots of the internal dashboard. Search Console click data is deliberately left out.",
          images: [
            { src: noticesShot, alt: "Official Notices view: 109 new notices in 7 days, 41 pages monitored, 0 sites with problems, and a table of new notices from RRB Ranchi, RPSC and UPPSC.", caption: "Official Notices — 109 new notices in 7 days, 41 pages, 0 failing" },
            { src: lcpCompetitorsShot, alt: "Line chart of weekly mobile LCP at the 75th percentile for several exam-prep sites from May to November 2026; the highlighted line stays near 1.6 seconds.", caption: "Mobile LCP vs other exam-prep sites, weekly CrUX p75" },
            { src: cwvOverviewShot, alt: "Core Web Vitals overview: assessment Passed; LCP 1.61 s, INP 183 ms, CLS 0.00, FCP 1.48 s, TTFB 723 ms, with LCP breakdown and navigation types.", caption: "Core Web Vitals overview with LCP breakdown" },
            { src: cwvTrendsShot, alt: "Trend charts for LCP, INP, CLS and FCP from May to November 2026 with good and poor thresholds and flagged outlier weeks.", caption: "Trends with thresholds and 2σ outlier flags" },
          ],
        },
      ],
    },
    results: [
      "Official exam notices reach the content team by email and Google Chat within minutes — 109 in one week, from 41 sources, with none failing.",
      "One screen replaced spreadsheets and scattered Google tools: notices, content race, rankings, intent, site health, speed and Google news.",
      "Real-user Core Web Vitals pass on mobile: LCP 1.61 s, INP 183 ms, CLS 0.00.",
      "The top 1,000 pages are audited every week against 24 checks, so problems surface before traffic drops.",
    ],
    next: [
      "Smarter alerts (in progress): every notice gets a priority, exam stage, search demand, whether we already have a page and whether competitors have published — with quiet hours and a 30-minute follow-up in the same Chat thread.",
    ],
  },

  "adda247-speed": {
    role: "Software engineer on Adda247's web team. This case covers my performance releases on the adda247.com store between May and October 2026 — loading, visual stability and responsiveness.",
    context: [
      "adda247.com serves 3–10 lakh learners a day, overwhelmingly on mid-range Android phones. Speed decides both rankings and whether a student stays long enough to buy a test series.",
      "Lighthouse alone was misleading here: Google Tag Manager's ~525 KB of tags and ~550 ms of main-thread work could swing the same page's mobile score between 60 and 88 from run to run. So every change was judged by Chrome UX Report (CrUX) field data — what real visitors experienced over 28 days — and Lighthouse was used only to diagnose.",
    ],
    workstreams: [
      {
        stage: "convert",
        title: "Loading (LCP): get the first screen painted sooner",
        points: [
          "Route-specific critical CSS: above-the-fold styles for the mock-test pages are extracted from real mobile and desktop renders and inlined, so the full stylesheet loads without blocking — LCP on /ssc-cgl/mock-test went from 4,112 ms to 976 ms in throttled mobile tests.",
          "Broke the HTML → CSS → font critical chain by preloading the Onest variable font (52 KB, one file for all weights), so it downloads in parallel with the CSS instead of after it.",
          "fetchpriority on the LCP image and main stylesheet; CSS split per route and a major CSS split; vendor and route chunk splitting.",
          "Product-card images requested at their real display size (180 px instead of 250 px) with q-80 compression on the image CDN — about 48% fewer bytes per card across exam-kit listings.",
          "LazySection: below-the-fold sections are still server-rendered in full for SEO, but their JavaScript downloads only when they approach the viewport.",
          "Trimmed the serialized Redux state embedded in every page, keeping only what the client can't refetch, so HTML is smaller without hydration mismatches.",
          "A service worker that caches static assets, scoped so it never stores logged-in HTML or API responses, with one-day expiry on third-party files.",
        ],
      },
      {
        stage: "convert",
        title: "Visual stability (CLS): nothing jumps",
        points: [
          "Metric-matched font fallbacks: size-adjust, ascent and descent overrides computed from Lato's and Roboto's real font metrics, so when the web font swaps in, every line keeps its exact height and the page doesn't reflow.",
          "Skeletons that reserve the final space, a fixed header taken out of the layout flow, and mobile-specific checks.",
          "Fixed a hydration mismatch that re-rendered content after load, and shipped CLS fixes across listing, product, previous-year-paper and Q&A SEO pages.",
        ],
      },
      {
        stage: "convert",
        title: "Responsiveness (INP): keep the first tap fast",
        points: [
          "Removed Lottie animations that blocked the main thread on listing pages, and cut redundant state updates.",
          "The AI chat assistant now loads only when someone opens it.",
          "Tracking deferred without losing data: GTM, GA4 and Meta load after the visitor's first interaction has painted, in an idle slot, with Meta a second after GTM so they don't stack. dataLayer and the Pixel queue events until their scripts arrive, and pages that record a purchase keep the eager path.",
          "Removed an unused attribution script, and replaced a blind 10-second tag delay — which dropped visitors who left early — with first-interaction loading.",
        ],
      },
      {
        stage: "measure",
        title: "Measure like Google does",
        points: [
          "CrUX field data as the source of truth, per URL and per origin, with weekly history and outlier detection — built into the SEO command centre.",
          "A verification script that checks the inlined critical CSS still covers the above-the-fold content after every change.",
        ],
      },
    ],
    evidence: {
      intro:
        "Releases on the left, real-user results on the right of each date. Lab numbers are labelled as lab; everything marked CrUX is Chrome's 28-day field data from real visitors on phones.",
      visuals: [
        {
          kind: "timeline",
          title: "Releases and what real users saw",
          caption: "CrUX dates are the end of the 28-day window in which the change first shows.",
          source: "henosis commit history (my releases) · Chrome UX Report via CrUX Vis, phones",
          events: [
            { date: "7–12 May 2026", type: "release", title: "Images, compression and bundle splitting", detail: "Product-card images right-sized (−48% bytes), CDN compression, CSS loader split, route and vendor chunks." },
            { date: "9–16 Jun 2026", type: "release", title: "Article CSS, hydration fix, lazy CSS", detail: "Unused CSS removed from article pages, a hydration mismatch fixed, non-critical CSS loaded lazily." },
            { date: "31 Jul 2026", type: "release", title: "Listing pages and font fallbacks", detail: "Lottie off the main thread, fewer reducer calls, skeletons, and metric-matched font fallbacks to stop font-swap reflow." },
            { date: "12–13 Aug 2026", type: "release", title: "Tag loading without the 10-second gap", detail: "Unused tracker removed; GTM loads on first interaction instead of a fixed delay." },
            { date: "5 Sep 2026", type: "field", title: "Layout shift reaches Good on three key pages", detail: "CLS on pages B and C moves from Poor to Good, and page D from Needs improvement to Good, in the first 28-day window after the July release." },
            { date: "24–28 Sep 2026", type: "release", title: "Critical CSS, font preload, service worker", detail: "Route-specific critical CSS, Onest font preload, chat assistant on click, service worker, fixed header." },
            { date: "24 Sep 2026", type: "lab", title: "Mock-test LCP: 4,112 ms → 976 ms", detail: "Throttled mobile test on /ssc-cgl/mock-test after inlining critical CSS." },
            { date: "6–15 Oct 2026", type: "release", title: "LCP image priority, CSS split, deferred tracking", detail: "fetchpriority on the LCP image, major CSS split, LazySection, slimmer page state, CLS fixes on all page types, GA4 and Meta deferred to idle." },
            { date: "14 Oct 2026", type: "lab", title: "Worst tap delay: 168–408 ms → 40–96 ms", detail: "Home, mock test and product pages on mobile with a 4× slower CPU, trackers loaded during the first tap vs deferred." },
          ],
        },
        {
          kind: "waterfall",
          title: "Breaking the critical chain",
          caption: "Schematic of the mock-test page's first load. Before, the font could only be discovered after the stylesheet arrived; after, the first screen paints from inlined CSS while the rest loads in parallel.",
          source: "Lab measurement, throttled mobile, /ssc-cgl/mock-test, 24 Sep 2026",
          scenarios: [
            {
              label: "Before",
              result: "LCP 4,112 ms",
              rows: [
                { name: "HTML", start: 0, end: 2, blocking: true },
                { name: "testprime.css", start: 2, end: 5, blocking: true },
                { name: "Onest.woff2", start: 5, end: 7, blocking: true },
              ],
              paintAt: 7.2,
            },
            {
              label: "After",
              result: "LCP 976 ms",
              rows: [
                { name: "HTML + inline CSS", start: 0, end: 2, blocking: true },
                { name: "testprime.css", start: 2, end: 5 },
                { name: "Onest.woff2", start: 2, end: 4 },
              ],
              paintAt: 2.2,
            },
          ],
        },
        {
          kind: "bars",
          title: "First-tap delay with trackers deferred",
          caption: "Worst interaction delay on home, mock test and product pages (upper end of the measured range).",
          source: "Lab measurement, mobile with 4× CPU slowdown, 14 Oct 2026",
          rows: [
            { label: "Trackers load during first tap", value: 408, display: "168–408 ms", note: "GTM's Google tags, Meta's fbevents.js and config run while the visitor is tapping" },
            { label: "Trackers deferred to idle", value: 96, display: "40–96 ms", emphasis: true, note: "loaded after the tap has painted; no events lost" },
          ],
        },
        {
          kind: "gallery",
          title: "Real-user history (CrUX, phones)",
          frameLabel: "crux vis · phones",
          caption: "CrUX Vis summaries as of 7 Nov 2026. Circles are loading (LCP), squares interactivity (INP), triangles visual stability (CLS); green is good, amber needs improvement, red poor.",
          images: [
            // TODO: replace "Page A–D" with the real URLs.
            { src: speedPageB, alt: "CrUX history on phones for page B: the CLS line sits in the poor band from January to August 2026 and drops to good from early September; loading is good.", caption: "Page B — CLS Poor → Good by early September" },
            { src: speedPageC, alt: "CrUX history on phones for page C from May 2026: CLS in the poor band until August, then good from early September; loading good.", caption: "Page C — CLS Poor → Good by early September" },
            { src: speedPageD, alt: "CrUX history on phones for page D: CLS in needs-improvement from spring to August, then good; loading good and improving.", caption: "Page D — CLS Needs improvement → Good; loading improving" },
            { src: speedPageA, alt: "CrUX history on phones for page A: CLS in the poor band from February to June 2026, then good from July; interactivity moves to good in July.", caption: "Page A — CLS Poor → Good from July; INP reaches Good" },
          ],
        },
      ],
    },
    results: [
      "Layout shift moved from Poor or Needs improvement to Good on key pages in Chrome's real-user data, in the first 28-day window after my July release.",
      "Mock-test page LCP from 4,112 ms to 976 ms in throttled mobile tests, after route-specific critical CSS.",
      "Worst first-tap delay from 168–408 ms to 40–96 ms with trackers deferred — and no tracking events lost.",
      "About 48% fewer image bytes per product card across exam-kit listings.",
    ],
    next: ["Bring interactivity (INP) from Needs improvement to Good on the pages that still show amber in CrUX."],
  },

  adda247: {
    role: "Software engineer on the web team (Nov 2024 – present): performance, technical SEO, tracking, internal tools and live-learning features.",
    context: [
      "Adda247 is one of India's largest exam-preparation platforms, serving 3–10 lakh learners a day across multiple languages with courses, test series, live classes and books.",
      "Its store is a server-rendered React application. At that scale every layout shift, render-blocking script and mis-fired event is multiplied by hundreds of thousands of sessions.",
    ],
    workstreams: [
      {
        stage: "convert",
        title: "Core Web Vitals at scale",
        points: [
          "Layout shift fixed across every page type — reserved image space, a fixed header taken out of the layout flow, mobile-specific checks.",
          "Route-level critical CSS and a split CSS bundle, fetchpriority on the LCP image, and font preloading.",
          "Removed main-thread-blocking Lottie animations from listing pages and cut redundant state updates.",
          "Fixed image over-fetching on product cards, enabled CDN compression, and shipped a service worker that caches images and HTML and clears on every release.",
          "Analytics and Meta scripts deferred behind a queued event buffer, so tracking never blocks rendering.",
        ],
      },
      {
        stage: "get-found",
        title: "Server rendering built for search",
        points: [
          "SEO data fetched during server rendering on listing pages, backed by a cached SEO API.",
          "SEO question pages with breadcrumbs, and URL redirects managed at scale.",
          "Wrote the team's 1,200-line server-rendering guide.",
        ],
      },
      {
        stage: "measure",
        title: "A tracking layer the business can trust",
        points: [
          "Audited GTM, GA4 and Meta Pixel end to end against the product's event map.",
          "Rebuilt GA4 ecommerce on a dataLayer initialised at boot, with shared pushEvent / pushEcommerceEvent helpers, restoring product-page tracking.",
          "Engagement events for chatbot, FAQs, SEO links and recently viewed items.",
        ],
      },
      {
        stage: "build",
        title: "Internal tools and live learning",
        points: [
          "In the admin: an SEO page builder with single and bulk upload, bulk redirect uploads, and a PageSpeed / Core Web Vitals dashboard.",
          "Live classes on AWS IVS: watch-time tracking, polls and leaderboards, load-tested for 3,000 concurrent users.",
          "1:1 mentorship booking for CUET Adda with slot selection and checkout.",
          "Patched the PHP base images across the WordPress blog fleet against a critical vulnerability.",
        ],
      },
    ],
    results: [
      "Core Web Vitals work across the store — detailed in the adda247.com speed case study.",
      "Live classes load-tested for 3,000 concurrent users.",
      "Product-page ecommerce tracking restored on a shared, typed event layer.",
    ],
  },

  career247: {
    role: "Tracking and technical SEO for the lead funnel.",
    context: [
      "Career247 is an upskilling platform for job-linked programs. Its business runs on leads: every form fill, OTP, application step and payment has to reach the ad and analytics platforms intact.",
      "Every action was already tracked in MoEngage — but MoEngage has its own SDK and never touches the dataLayer, so GTM, and therefore GA4, only ever saw page_view.",
    ],
    workstreams: [
      {
        stage: "measure",
        title: "One event taxonomy from lead to payment",
        points: [
          "A canonical dataLayer layer with nine snake_case events, defined in one place so call sites can't drift.",
          "Specifics — which form, program or step — live in parameters, so GTM needs one trigger per action type instead of one per form.",
          "Payment outcomes split into initiated, succeeded and failed, so drop-off can be diagnosed rather than guessed.",
        ],
      },
      {
        stage: "get-customers",
        title: "Meta events that count as conversions",
        points: [
          "Meta Pixel calls routed correctly — standard events through track, everything else through trackCustom — so Lead registers as a usable standard conversion instead of a warning.",
          "Lead forms fire Meta's standard Lead event, giving campaigns a real optimisation target.",
        ],
      },
      {
        stage: "get-found",
        title: "Lead forms crawlers can actually read",
        points: [
          "Critical pages were wrapped in client-only Suspense boundaries, so crawlers received an empty shell. Replaced them with a higher-order component that renders lead forms on the server.",
          "Google and AI crawlers now read the full page — program details, eligibility and the form itself.",
        ],
      },
    ],
    evidence: {
      intro: "The funnel, as GA4 now sees it — every step that used to be invisible.",
      visuals: [
        {
          kind: "events",
          title: "Lead-to-payment event map",
          caption: "Pushed to the GTM dataLayer alongside the existing MoEngage events.",
          source: "Career247 codebase, src/utils/analytics/dataLayer.ts",
          events: [
            { name: "generate_lead", step: "Lead form submitted", platforms: ["GA4", "Meta Lead", "MoEngage"] },
            { name: "otp_sent", step: "Phone verification started", platforms: ["GA4", "MoEngage"] },
            { name: "otp_verified", step: "Phone verified", platforms: ["GA4", "MoEngage"] },
            { name: "brochure_downloaded", step: "Program brochure downloaded", platforms: ["GA4", "MoEngage"] },
            { name: "eligibility_checked", step: "Eligibility check completed", platforms: ["GA4", "MoEngage"] },
            { name: "application_step_submitted", step: "Application step completed", platforms: ["GA4", "MoEngage"] },
            { name: "payment_initiated", step: "Payment started", platforms: ["GA4", "MoEngage"] },
            { name: "payment_succeeded", step: "Enrolment paid", platforms: ["GA4", "MoEngage"] },
            { name: "payment_failed", step: "Payment failed", platforms: ["GA4", "MoEngage"] },
          ],
        },
      ],
    },
    results: [
      "GA4 went from seeing only page_view to the full lead-to-payment funnel.",
      "Meta Lead registered as a standard conversion.",
      "Lead pages fully crawlable by search engines and AI assistants.",
    ],
  },

  "shashank-sajwan": {
    role: "Sole developer since March 2024 — design, build, CMS and every content release (224 commits).",
    context: [
      "Shashank Sajwan is a UPSC mentor and author with more than 650K YouTube subscribers. His site gives aspirants free NCERT notes, previous-year questions, daily newspaper analysis and paid batches — in English and Hindi.",
      "The audience is overwhelmingly on mobile, often on limited data, and the content changes daily. The team needed to publish without a developer in the loop.",
    ],
    workstreams: [
      {
        stage: "build",
        title: "A bilingual, app-like study experience",
        points: [
          "English/Hindi toggle with Devanagari typography and the page language updated for screen readers and search.",
          "Mobile bottom navigation, a study hub, bookmarks and recently viewed — patterns borrowed from native apps.",
          "Dark and light themes on a navy-saffron design-token system with fluid type.",
          "Shared-axis page transitions, scroll reveals and staggered lists that respect reduced-motion settings.",
          "Prelims countdown, announcement bar and campaign popups the team controls.",
        ],
      },
      {
        stage: "build",
        title: "A CMS the creator team runs themselves",
        points: [
          "Schema-driven Firebase CMS: admin forms are generated from content schemas, so notes, banners and countdowns change without code.",
          "Firestore and Storage security rules plus an admin allowlist.",
          "Course pages and course admin added as one coordinated release.",
        ],
      },
      {
        stage: "convert",
        title: "Light on mobile data",
        points: [
          "Click-to-load, privacy-enhanced YouTube embeds instead of heavy iframes.",
          "WebP and lazy-loaded images with reserved aspect ratios, so nothing shifts as they arrive.",
          "The admin code-split away from the public bundle.",
        ],
      },
    ],
    results: ["224 commits shipped over 2.5 years, including a full redesign.", "Daily content published by the creator team, with no developer in the loop."],
    next: ["Move to server rendering with per-page titles, Open Graph images and structured data, so every note page can rank on its own."],
  },

  "zimor-india": {
    role: "Freelance full-stack build — frontend, backend, payments and admin.",
    context: ["Zimor India needed a custom online store with its own checkout, customer accounts and an admin the owner could run."],
    workstreams: [
      {
        stage: "build",
        title: "A full-stack store",
        points: [
          "React 19, Vite and Tailwind 4 frontend with React Query, deployed on Vercel.",
          "Express and MongoDB API hardened with Helmet; Google sign-in via Passport; transactional email.",
          "Razorpay checkout plus cash on delivery; Cloudinary image pipeline.",
        ],
      },
      {
        stage: "build",
        title: "An admin the owner controls",
        points: ["Featured products ordered directly from the admin.", "Post-purchase prompts that collect product reviews."],
      },
      {
        stage: "convert",
        title: "Performance pass",
        points: [
          "Vendor chunk splitting, Cloudinary transforms and lazy loading.",
          "Memoised product cards, response compression and database indexes.",
        ],
      },
    ],
    results: ["A store the business fully owns — checkout, accounts, payments and admin."],
    next: ["Add GA4 ecommerce and the Meta Conversions API so ad spend is measurable from day one."],
  },
};
