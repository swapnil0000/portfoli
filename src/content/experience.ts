// Résumé content for the About page and the home-page snapshot.

export type Role = {
  org: string;
  title: string;
  period: string;
  summary: string;
  highlights: { text: string; caseStudy?: string }[];
};

export const roles: Role[] = [
  {
    org: "Adda247",
    title: "Software Engineer", // TODO: confirm exact job title
    period: "Nov 2024 – present",
    summary: "India's exam-preparation platform, serving 3–10 lakh learners a day. Web team: store, admin CMS, SEO, performance and tracking.",
    highlights: [
      { text: "Built an SEO dashboard that checks 41 official exam websites every 5 minutes and alerts the content team instantly.", caseStudy: "seo-command-centre" },
      { text: "Made adda247.com faster on phones: layout shift moved from Poor to Good in Google's real-user data.", caseStudy: "adda247-speed" },
      { text: "Server-rendered SEO pages, a rebuilt GA4 ecommerce data layer, and an SEO page builder with bulk redirects.", caseStudy: "adda247" },
      { text: "Live classes on AWS IVS with polls and leaderboards, load-tested for 3,000 concurrent users." },
    ],
  },
  {
    org: "Freelance",
    title: "Full-stack & growth developer",
    period: "2024 – present",
    summary: "Websites, stores and growth systems for D2C brands and creators.",
    highlights: [
      { text: "UrbanNook (D2C): SEO, Meta Conversions API and Google Ads tracking, and an admin that recovered 14% of failed orders.", caseStudy: "urbannook" },
      { text: "Shashank Sajwan (UPSC educator, 650K+ subscribers): bilingual site and a no-code CMS.", caseStudy: "shashank-sajwan" },
      { text: "Zimor India: full-stack e-commerce store with Razorpay and an admin.", caseStudy: "zimor-india" },
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "Redux"] },
  { group: "Backend", items: ["Node.js", "Express", "MongoDB", "MariaDB", "Firebase", "REST APIs & webhooks"] },
  { group: "SEO", items: ["Technical SEO", "SSR / SSG", "Structured data", "Sitemaps & robots", "Search Console"] },
  { group: "Speed", items: ["Core Web Vitals", "CrUX field data", "Critical CSS", "Service workers", "Image optimisation"] },
  { group: "Ads & analytics", items: ["GA4", "Google Tag Manager", "Meta Pixel + CAPI", "Google Ads conversions", "MoEngage"] },
  { group: "Cloud & tools", items: ["AWS (S3, EC2, IVS)", "Cloudflare Workers", "Vercel", "Docker", "Jenkins", "Claude agents"] },
];
