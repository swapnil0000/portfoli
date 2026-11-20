// Single source of truth for identity + URLs. The domain isn't bought yet:
// set NEXT_PUBLIC_SITE_URL at deploy time and every canonical/OG/sitemap URL follows.
export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://swapnil.example").replace(/\/$/, ""),
  name: "Swapnil Srivastav",
  shortName: "Swapnil",
  role: "Full-stack tech & growth consultant",
  tagline: "Products that rank, load fast, and measure every conversion.",
  description:
    "Swapnil Srivastav is a full-stack tech and growth consultant. Websites, apps, backends, cloud and admin systems — plus the SEO, speed, Meta and Google Ads and end-to-end tracking that turn them into revenue.",
  locale: "en_IN",
  location: { city: "", country: "IN" }, // TODO: city once confirmed
  email: "", // TODO: public contact email
  whatsapp: "", // TODO: WhatsApp number with country code, digits only (e.g. 9198xxxxxxxx)
  links: {
    github: "https://github.com/swapnil0000",
    linkedin: "", // TODO
  },
  bookingUrl: "", // TODO: Cal.com link (Phase 4)
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
