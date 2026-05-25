import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const isProd = process.env.NODE_ENV === "production";

  return {
    rules: isProd
      ? { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/onboarding"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
