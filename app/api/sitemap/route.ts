export async function GET(): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  const sitemap = [
    // Public pages that should be indexed
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/security`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
  ];

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return new Date().toISOString().split("T")[0];
    if (typeof date === "string") return date;
    return date.toISOString().split("T")[0];
  };

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${sitemap
        .map(
          (item) =>
            `<url>
        <loc>${item.url}</loc>
        <lastmod>${formatDate(item.lastModified)}</lastmod>
        <changefreq>${item.changeFrequency}</changefreq>
        <priority>${item.priority}</priority>
      </url>`,
        )
        .join("\n")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
      },
    },
  );
}
