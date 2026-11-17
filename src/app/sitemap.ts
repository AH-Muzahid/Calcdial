import type { MetadataRoute } from "next";
import { TOOLS, GUIDES } from "@/data/tools-registry";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://calcdial.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-11-01T00:00:00Z",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: "2026-11-01T00:00:00Z",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: "2026-11-01T00:00:00Z",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: "2026-11-01T00:00:00Z",
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.flatMap((tool) => [
    {
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(tool.lastUpdated).toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...tool.pSEOPresets.map((preset) => ({
      url: `${baseUrl}/tools/${tool.slug}-${preset}`,
      lastModified: new Date(tool.lastUpdated).toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt).toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes, ...guideRoutes];
}
