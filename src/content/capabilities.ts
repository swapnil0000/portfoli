export type Zone = {
  slug: string;
  name: string;
  summary: string;
  tech: string[];
  proof: string[]; // case-study slugs from work.ts
};

// The consultancy's engineering coverage. Growth zones (SEO, ads, CRO,
// analytics) live in solutions.ts as stages; these are what gets built.
export const zones: Zone[] = [
  {
    slug: "web",
    name: "Web platforms",
    summary: "Marketing sites, storefronts and web apps — server-rendered or statically generated, responsive on every screen.",
    tech: ["Next.js", "React", "Vite", "Tailwind", "SSR / SSG"],
    proof: ["adda247-speed", "urbannook", "career247"],
  },
  {
    slug: "app",
    name: "App design & PWAs",
    summary: "App-grade UX for mobile-first audiences: installable PWAs, bottom-nav patterns, offline caching and in-app event tracking.",
    tech: ["PWA", "Service workers", "Figma", "Framer Motion", "MoEngage"],
    proof: ["shashank-sajwan", "adda247"],
  },
  {
    slug: "backend",
    name: "Backend & APIs",
    summary: "Node services, REST APIs, webhooks and data models that stay fast under real traffic.",
    tech: ["Node.js", "Express", "MongoDB", "Firebase", "Redis"],
    proof: ["urbannook", "zimor-india"],
  },
  {
    slug: "cloud",
    name: "Cloud & DevOps",
    summary: "CI/CD, edge delivery, containers and rollback-safe releases — plus security patching when it matters.",
    tech: ["AWS S3 / EC2", "Cloudflare Workers", "Docker", "Jenkins", "Vercel"],
    proof: ["urbannook", "adda247"],
  },
  {
    slug: "commerce",
    name: "E-commerce & payments",
    summary: "Checkouts, payment gateways, COD, shipping integrations and product feeds for Google and Meta.",
    tech: ["Razorpay", "Magic Checkout", "Shipmozo", "Merchant Center", "Meta Catalog"],
    proof: ["urbannook", "zimor-india"],
  },
  {
    slug: "realtime",
    name: "Real-time & video",
    summary: "Live classes, polls and leaderboards built on streaming infrastructure and load-tested before launch.",
    tech: ["AWS IVS", "Daily.co", "Socket.IO", "Load testing"],
    proof: ["adda247"],
  },
  {
    slug: "admin",
    name: "CMS, admin & ops tools",
    summary: "Admin panels and CMSs non-technical teams can run: orders, recovery desks, SEO page builders, health monitors.",
    tech: ["Schema-driven CMS", "Dashboards", "TipTap", "Recharts", "RBAC / 2FA"],
    proof: ["seo-command-centre", "urbannook", "shashank-sajwan"],
  },
  {
    slug: "automation",
    name: "Automation & AI",
    summary: "WhatsApp workflows, scheduled monitors, CRM sync, and making your site readable by AI search assistants.",
    tech: ["WhatsApp API", "Cron jobs", "CRM sync", "llms.txt", "LLM integrations"],
    proof: ["seo-command-centre", "urbannook", "career247"],
  },
];
