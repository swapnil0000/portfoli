export type Metric = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  period: string;
  title: string;
  summary: string;
  stages: string[]; // stage slugs from solutions.ts
  metrics: Metric[];
  stack: string[];
  // Three-line summary for readers who skim: shown on cards and atop each case.
  tldr: { problem: string; did: string; result: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "seo-command-centre",
    client: "Adda247 · SEO dashboard",
    sector: "Internal platform · Adda247",
    period: "2026",
    title: "An SEO dashboard that spots new exam notices within 5 minutes",
    summary:
      "41 official exam sites watched every 5 minutes, competitor sitemaps raced every 3 hours, rankings, search intent, a 1,000-page weekly audit, real-user Core Web Vitals and an AI analyst — in one dashboard.",
    stages: ["get-found", "convert", "measure"],
    metrics: [
      { value: "41", label: "official exam sources checked every 5 minutes" },
      { value: "109", label: "new notices caught in one week" },
      { value: "1,000", label: "top pages audited weekly against 24 checks" },
    ],
    stack: ["React", "Node.js", "MariaDB", "Search Console API", "CrUX API", "PageSpeed API", "Google Chat", "Claude agent"],
    tldr: {
      problem: "The SEO team found out about new exam notices late and tracked rankings, speed and competitors in spreadsheets.",
      did: "Built one dashboard: 41 official sites checked every 5 minutes with instant alerts, competitor tracking, rankings, site audits, speed data and an AI news analyst.",
      result: "109 new notices caught in a week, each reaching the team within minutes.",
    },
  },
  {
    slug: "urbannook-seo",
    client: "UrbanNook · SEO",
    sector: "D2C e-commerce",
    period: "Sep – Nov 2026",
    title: "SEO that took UrbanNook from brand-only searches to 945 search terms",
    summary:
      "Pre-built pages, structured data, a 44-post blog, category pages, Merchant Center and Google Business Profile — proven with Search Console, GA4 and Merchant Center data.",
    stages: ["get-found", "get-customers", "measure"],
    metrics: [
      { value: "22×", label: "more daily Google impressions in three weeks" },
      { value: "945", label: "different searches now show the store" },
      { value: "66 / 66", label: "products approved for free Google Shopping listings" },
    ],
    tldr: {
      problem: "Google showed UrbanNook almost only to people who already typed its name — about 27 times a day.",
      did: "Pre-built every page, added structured data, launched 44 blog posts and 8 category pages, fixed the Merchant Center feed and set up Google Business Profile.",
      result: "Daily Google impressions grew 22× to about 600; 945 searches now show the store, and all 66 products are live on Google Shopping.",
    },
    stack: ["React SSG", "Structured data", "Search Console", "Merchant Center", "Google Business Profile", "GA4", "Cloudflare Workers"],
  },
  {
    slug: "urbannook-sales",
    client: "UrbanNook · Sales & support",
    sector: "D2C e-commerce",
    period: "Aug – Nov 2026",
    title: "Sales and support on WhatsApp, without paying for a CRM",
    summary:
      "WhatsApp login for Instagram shoppers, automatic cart and failed-payment messages, a team call desk with notes, and a direct-reply inbox — for the cost of the messages alone.",
    stages: ["convert", "measure"],
    metrics: [
      { value: "30", label: "orders (≈ ₹1 lakh) won back in one month" },
      { value: "₹900", label: "WhatsApp cost for 1,300 people that month" },
      { value: "+35%", label: "more phone numbers after WhatsApp login" },
    ],
    tldr: {
      problem: "Google login doesn't work in Instagram's browser, so most shoppers stayed anonymous and couldn't be followed up.",
      did: "WhatsApp login, automatic WhatsApp messages, a Customer Hub with call notes split between callers, and a reply inbox — all in our own admin.",
      result: "30 orders worth about ₹1 lakh won back in a month, while WhatsApp cost ₹900 for 1,300 people.",
    },
    stack: ["Gupshup WhatsApp API", "Node.js", "MongoDB", "React", "Cron jobs", "Webhooks"],
  },
  {
    slug: "adda247-speed",
    client: "Adda247 · Website speed",
    sector: "Core Web Vitals · Adda247",
    period: "May – Oct 2026",
    title: "Made adda247.com faster for real users on phones",
    summary:
      "Critical CSS, font-chain fixes, metric-matched font fallbacks, deferred tracking and leaner pages — judged by Chrome's real-user field data on phones.",
    stages: ["convert", "get-found", "measure"],
    metrics: [
      { value: "Poor → Good", label: "layout shift on key pages, real users (CrUX)" },
      { value: "4.1 → 0.98 s", label: "mock-test LCP after critical CSS (lab)" },
      { value: "408 → 96 ms", label: "worst first-tap delay, trackers deferred (lab)" },
    ],
    stack: ["React SSR", "Webpack", "Critical CSS", "Service worker", "ImageKit CDN", "CrUX API", "GTM", "Meta Pixel"],
    tldr: {
      problem: "Pages jumped around while loading and the first tap felt slow on mid-range phones.",
      did: "Critical CSS, font fixes, right-sized images, lazy-loaded code and tracking that waits until after the first tap.",
      result: "Layout shift moved from Poor to Good in Google’s real-user data; mock-test page loads in under a second in lab tests.",
    },
  },
  {
    slug: "urbannook",
    client: "UrbanNook",
    sector: "D2C e-commerce",
    period: "2025 – present",
    title: "D2C store: SEO, Meta & Google Ads tracking and failed-order recovery",
    summary:
      "Build-time rendered storefront with rich schema, Meta Pixel + CAPI and Google Ads enhanced conversions, first-party attribution, and an ops admin that recovers failed orders.",
    stages: ["build", "get-found", "get-customers", "convert", "measure"],
    metrics: [
      { value: "15×", label: "fake AddToCart inflation removed from Meta" },
      { value: "14%", label: "of failed orders recovered" },
      { value: "9×", label: "higher purchase rate from Google Organic than Meta Ads" },
    ],
    stack: ["React 19", "Vite SSG", "Express", "MongoDB", "Razorpay", "GA4", "Meta CAPI", "Google Ads"],
    tldr: {
      problem: "Google couldn’t read the store, and Meta’s numbers didn’t match real orders.",
      did: "Made every page readable to Google, fixed Meta and Google Ads tracking, and built an admin with a failed-order recovery desk.",
      result: "Real numbers in Meta again (15× inflation removed) and 14% of failed orders recovered.",
    },
  },
  {
    slug: "adda247",
    client: "Adda247 · Platform",
    sector: "Ed-tech at scale",
    period: "2024 – present",
    title: "Ed-tech platform: SEO rendering, tracking, admin tools and live classes",
    summary:
      "Server-rendered store performance work on a multi-language platform, measured in Google's public field data, plus a rebuilt GA4 ecommerce data layer.",
    stages: ["build", "get-found", "convert", "measure"],
    metrics: [
      { value: "3–10L", label: "daily users on the platform" }, // TODO: confirm public source
      { value: "3,000", label: "concurrent users load-tested for live classes" },
    ],
    stack: ["React SSR", "Express", "Redux", "Webpack", "GA4", "GTM", "MoEngage"],
    tldr: {
      problem: "A large ed-tech store needed search-friendly pages, reliable tracking and better internal tools.",
      did: "Server-rendered SEO pages, a rebuilt GA4 data layer, an SEO page builder, and live classes on AWS IVS.",
      result: "Product-page tracking restored and live classes load-tested for 3,000 users.",
    },
  },
  {
    slug: "career247",
    client: "Career247",
    sector: "Upskilling",
    period: "2025 – 2026",
    title: "Lead tracking that finally shows the whole funnel in GA4",
    summary:
      "GA4 only ever saw page_view. A canonical dataLayer of nine funnel events, correctly routed Meta Pixel calls, and lead forms rendered on the server for crawlers.",
    stages: ["get-found", "get-customers", "measure"],
    metrics: [{ value: "9", label: "new funnel events GA4 now receives (it saw only page views)" }],
    stack: ["Next.js", "GTM", "GA4", "Meta Pixel", "MoEngage", "Vercel"],
    tldr: {
      problem: "GA4 only saw page views, so the lead funnel was invisible to analytics and ads.",
      did: "Added nine funnel events to the dataLayer, fixed Meta Pixel events, and made lead forms readable to crawlers.",
      result: "The full lead-to-payment funnel now shows in GA4, and Meta counts leads as conversions.",
    },
  },
  {
    slug: "shashank-sajwan",
    client: "Shashank Sajwan",
    sector: "UPSC education creator",
    period: "2024 – present",
    title: "Bilingual study website with a CMS the creator's team runs",
    summary:
      "English/Hindi, mobile-first experience with motion and dark mode, and a schema-driven Firebase CMS for an audience of 650K+ subscribers.",
    stages: ["build", "convert"],
    metrics: [{ value: "224", label: "commits over 2.5 years" }],
    stack: ["React 18", "MUI", "Framer Motion", "Firebase"],
    tldr: {
      problem: "A UPSC educator with 650K+ subscribers needed a fast bilingual site the team could update daily.",
      did: "Designed and built an English/Hindi, app-like site with a no-code CMS.",
      result: "224 releases over 2.5 years, with daily content published without a developer.",
    },
  },
  {
    slug: "zimor-india",
    client: "Zimor India",
    sector: "E-commerce",
    period: "2026",
    title: "Full-stack e-commerce store with payments and admin",
    summary: "React + Express commerce with Razorpay, Google login, an admin and a performance pass.",
    stages: ["build", "convert"],
    metrics: [],
    stack: ["React 19", "Vite", "Tailwind 4", "Express", "MongoDB", "Razorpay", "Cloudinary"],
    tldr: {
      problem: "A brand needed its own online store instead of relying on marketplaces.",
      did: "Built the full store: React frontend, Node API, Razorpay and cash on delivery, Google login and an admin.",
      result: "A store the owner fully controls, from checkout to featured products.",
    },
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
