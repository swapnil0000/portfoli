import type { Metadata } from "next";

// Per-page metadata with a self-referencing canonical. Setting openGraph here
// replaces the root's (including its file-based image), so the share card is
// always declared explicitly: the route's own `image`, else the site card.
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const images = [{ url: image, width: 1200, height: 630 }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
