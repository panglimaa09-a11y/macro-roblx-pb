import type { MetadataRoute } from "next";

const siteUrl = "https://macro-roblx-pb.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/macro",
    "/cara-penggunaan",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/download",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
