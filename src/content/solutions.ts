export type Channel = "Organic" | "Social" | "Paid" | "App";

export type Stage = {
  slug: string;
  index: string;
  name: string;
  headline: string;
  summary: string;
  deliverables: string[];
  channels: Channel[];
  process: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
};

// The growth system, in the order a business experiences it.
export const stages: Stage[] = [
  {
    slug: "build",
    index: "01",
    name: "Websites & apps",
    headline: "Fast, responsive websites and apps, built to grow",
    summary:
      "Responsive UI/UX, design systems and full-stack builds on Next.js, React and Node, with speed, SEO and tracking designed in from the first commit.",
    deliverables: [
      "UI/UX design for web and app, responsive on every screen",
      "Next.js / React frontends with SSR or static generation",
      "Node, Express and MongoDB backends, admin panels and CMSs",
      "Payments (Razorpay, COD), auth, and order operations",
    ],
    channels: ["Organic", "App"],
    process: [
      { step: "Discover", detail: "Goals, audience, channels and the numbers that define success." },
      { step: "Design", detail: "Wireframes to high-fidelity UI, responsive from 360px to ultrawide." },
      { step: "Engineer", detail: "Typed, tested code with SEO, speed and tracking built in — not bolted on." },
      { step: "Launch & hand over", detail: "Monitored release, documentation and a CMS your team can run." },
    ],
    faqs: [
      { q: "Which tech stack do you use?", a: "Usually Next.js or React on the front, Node and MongoDB or Firebase behind, deployed on Vercel, AWS or Cloudflare. I pick the stack that fits your team and traffic, not the trendiest one." },
      { q: "Do you design as well as develop?", a: "Yes. I take projects from wireframes and UI design through to production code, so nothing is lost between a designer's file and the shipped product." },
      { q: "Can you work on an existing codebase?", a: "Yes — most engagements start with an existing site or app. I audit it first and fix the highest-impact problems before adding features." },
    ],
  },
  {
    slug: "get-found",
    index: "02",
    name: "SEO",
    headline: "Rank on Google and in AI answers",
    summary:
      "Technical SEO that search engines and AI crawlers can actually read: server rendering, structured data, programmatic pages, sitemaps and crawl control.",
    deliverables: [
      "Technical SEO audit and fixes (rendering, canonicals, status codes)",
      "Structured data: Product, Breadcrumb, FAQ, Article, Organization",
      "Programmatic category, collection and landing pages",
      "Search Console, sitemaps, robots.txt and llms.txt for AI search",
    ],
    channels: ["Organic"],
    process: [
      { step: "Crawl & audit", detail: "Rendering, indexation, status codes, canonicals, schema and Core Web Vitals." },
      { step: "Fix the foundation", detail: "Server rendering or static generation so Google and AI crawlers see real content." },
      { step: "Scale pages", detail: "Programmatic category, collection and landing pages with rich structured data." },
      { step: "Measure", detail: "Search Console, rankings and organic revenue tracked against the baseline." },
    ],
    faqs: [
      { q: "How long does SEO take to show results?", a: "Technical fixes are picked up within days to weeks once Google recrawls. Ranking for competitive service keywords typically takes three to six months of consistent content and links. No one can honestly guarantee a #1 position." },
      { q: "What is technical SEO?", a: "Everything that decides whether search engines can crawl, render and understand your site: server rendering, status codes, canonicals, sitemaps, structured data and page speed." },
      { q: "Do you optimise for AI search like ChatGPT and Perplexity?", a: "Yes. That means crawlable server-rendered content, structured data, an llms.txt file and robots rules that let AI assistants read your site." },
    ],
  },
  {
    slug: "get-customers",
    index: "03",
    name: "Meta & Google Ads",
    headline: "Ads that learn from real purchases, not guesses",
    summary:
      "Campaign infrastructure that feeds ad platforms clean signals: product catalogs, Merchant Center feeds, enhanced conversions and server-side events.",
    deliverables: [
      "Meta Ads: Pixel + Conversions API with event deduplication",
      "Google Ads: conversion tracking, enhanced conversions, remarketing",
      "Merchant Center and Meta catalog feeds that pass policy",
      "Social and in-app browser journeys that don't leak buyers",
    ],
    channels: ["Social", "Paid"],
    process: [
      { step: "Signal audit", detail: "Check what Meta and Google actually receive versus what really happened." },
      { step: "Fix the pipes", detail: "Pixel + Conversions API with deduplication, enhanced conversions, clean feeds." },
      { step: "Launch & learn", detail: "Campaign structure built around the conversion events that matter." },
      { step: "Optimise", detail: "Cut wasted spend using first-party attribution, not platform guesses." },
    ],
    faqs: [
      { q: "Why do my Meta Ads numbers not match my orders?", a: "Usually browser-only tracking, auto-configured events or missing deduplication. On one D2C store I found Meta counting about 15 times more add-to-carts than really happened. Server-side events with an event_id fix this." },
      { q: "What is the Meta Conversions API?", a: "A server-to-server connection that sends purchase and lead events directly to Meta, so ad blockers and iOS restrictions don't hide your conversions." },
      { q: "Do you run the ad campaigns too?", a: "I set up the full infrastructure — tracking, feeds, conversion goals and campaign structure — and can work alongside your media buyer or run campaigns directly." },
    ],
  },
  {
    slug: "convert",
    index: "04",
    name: "Speed & conversion",
    headline: "Faster pages and checkouts that turn visitors into orders",
    summary:
      "Core Web Vitals, checkout and funnel fixes, plus recovery systems for the orders that almost happened.",
    deliverables: [
      "Core Web Vitals: LCP, CLS and INP fixes measured in field data",
      "Checkout and payment-flow optimisation",
      "Failed-payment and abandoned-cart recovery (WhatsApp, call desk)",
      "Funnel forensics: where and why buyers drop",
    ],
    channels: ["Organic", "Social", "Paid", "App"],
    process: [
      { step: "Find the leaks", detail: "Funnel analysis by device, browser and channel to see where buyers drop." },
      { step: "Speed", detail: "LCP, CLS and INP fixed and verified in Google's real-user field data." },
      { step: "Checkout", detail: "Payment flows, trust signals and in-app browser fixes." },
      { step: "Recover", detail: "Failed-payment and abandoned-cart recovery over WhatsApp and calls." },
    ],
    faqs: [
      { q: "What are Core Web Vitals?", a: "Google's real-user measures of loading (LCP), visual stability (CLS) and responsiveness (INP). They affect both rankings and conversion rate." },
      { q: "Can you recover failed payments?", a: "Yes. On one store a recovery desk with WhatsApp templates and follow-up calls won back 14% of failed orders." },
      { q: "How do you prove a speed improvement?", a: "With Chrome UX Report field data from real visitors, not just a one-off Lighthouse score." },
    ],
  },
  {
    slug: "measure",
    index: "05",
    name: "Tracking & analytics",
    headline: "Know exactly where every lead and sale came from",
    summary:
      "One measurement plan from click to purchase: GA4, GTM, Meta and Google Ads, server-side events and first-party attribution you can trust.",
    deliverables: [
      "Tracking plan and dataLayer spec for every funnel step",
      "GA4 ecommerce, GTM, server-side and webhook purchase events",
      "UTM / gclid / fbclid first-touch channel attribution",
      "Funnel and channel dashboards, consent mode v2 and DPDP",
    ],
    channels: ["Organic", "Social", "Paid", "App"],
    process: [
      { step: "Tracking plan", detail: "Every funnel step named, specified and mapped to GA4, Meta and Google Ads." },
      { step: "Implement", detail: "dataLayer, GTM or direct tags, server-side and webhook events, consent mode." },
      { step: "Verify", detail: "Event-by-event QA and deduplication checks across platforms." },
      { step: "Report", detail: "Funnel and channel dashboards your team can actually make decisions from." },
    ],
    faqs: [
      { q: "What does end-to-end event tracking mean?", a: "Every meaningful action — view, add to cart, checkout step, payment, lead, refund — is captured once, with consistent IDs, and sent to analytics and ad platforms from the browser and the server." },
      { q: "Is GA4 enough on its own?", a: "GA4 is a good base, but browser-only tracking misses purchases. Server-side events and a first-party record of orders give you numbers you can trust." },
      { q: "Is tracking compliant with India's DPDP Act?", a: "I implement Google Consent Mode v2 and a consent layer so tracking follows the visitor's choice." },
    ],
  },
];

export const getStage = (slug: string) => stages.find((s) => s.slug === slug);
