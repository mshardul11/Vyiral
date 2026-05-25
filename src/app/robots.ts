import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vyiral.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/keywords", "/titles", "/tags", "/descriptions", "/ideas", "/audit", "/competitors", "/stats", "/trends", "/calendar", "/automations", "/billing", "/pricing", "/admin", "/workspace", "/settings", "/onboarding", "/projects"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
