import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  const robots = `User-agent: *
Allow: /
Disallow: /mainApp/
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/

User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: DotBot
Disallow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
