import type { NextConfig } from "next";

const securityHeaders = [
  // Disable iframing of our pages (anti-clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Disable MIME-sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full referrer to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Block legacy XSS auditor edge cases.
  { key: "X-XSS-Protection", value: "0" },
  // Disallow Flash/PDF cross-domain.
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // Drop unused powerful browser APIs by default.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  // HSTS only matters when the site is served over HTTPS. Safe to send always —
  // browsers ignore it on plain HTTP. Includes subdomains; preload-ready.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP — strict-ish; we use Tailwind inline styles and Google Maps iframe on /about,
  // so allow them. Update if other 3rd-party scripts are added.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      // Next.js dev needs 'unsafe-eval'; in prod build it's not used.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Google Maps embed (на /about) и наш VPS Postgres проксироваться не должен,
      // он не из браузера. Так что connect ограничиваем своим origin.
      "connect-src 'self'",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
