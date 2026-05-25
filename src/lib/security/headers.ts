const baseSecurityHeaders: ReadonlyArray<{ key: string; value: string }> = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/** Security headers applied in middleware and next.config */
export function getSecurityHeaders(): ReadonlyArray<{ key: string; value: string }> {
  if (process.env.NODE_ENV === "production") {
    return [
      ...baseSecurityHeaders,
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
  }
  return baseSecurityHeaders;
}

export const securityHeaders = getSecurityHeaders();

export function applySecurityHeaders(response: Response): Response {
  for (const { key, value } of getSecurityHeaders()) {
    response.headers.set(key, value);
  }
  return response;
}
