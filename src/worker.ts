const CANONICAL_HOST = 'secureaiframeworks.cloud';
const HSTS = 'max-age=31536000; includeSubDomains; preload';

/**
 * Locked-down CSP for a static site:
 * - page scripts are bundled by Astro into same-origin modules (never inlined)
 * - fonts are self-hosted in /fonts
 * - the hero/OG artwork is delivered by the Cloudflare Images CDN
 * - static.cloudflareinsights.com is Cloudflare's zone-injected Web Analytics
 *   beacon (auto-added at the edge — not part of this codebase)
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://imagedelivery.net",
  "connect-src 'self' https://static.cloudflareinsights.com",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': HSTS,
};

/** Hashed build artifacts are safe to cache for a year. */
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
/** Stable-name font files: long-lived, but revalidate so a swap propagates. */
const FONT_CACHE = 'public, max-age=604800, stale-while-revalidate=86400';

type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

function visitorUsesHttp(request: Request): boolean {
  const cfVisitor = request.headers.get('CF-Visitor');
  if (cfVisitor) {
    try {
      const { scheme } = JSON.parse(cfVisitor) as { scheme?: string };
      if (scheme === 'http') return true;
      if (scheme === 'https') return false;
    } catch {
      // Fall through to the request URL protocol.
    }
  }
  return new URL(request.url).protocol === 'http:';
}

function canonicalPath(pathname: string): string {
  if (pathname === '/index.html' || pathname === '/index') return '/';
  return pathname.replace(/\/index\.html$/i, '/').replace(/\/index$/i, '/');
}

function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  );
}

function isImmutableAsset(pathname: string): boolean {
  return pathname.startsWith('/_astro/');
}

function isFont(pathname: string): boolean {
  return pathname.startsWith('/fonts/');
}

function withCacheHeaders(headers: Headers, pathname: string): void {
  if (isImmutableAsset(pathname)) {
    headers.set('Cache-Control', IMMUTABLE_CACHE);
  } else if (isFont(pathname)) {
    headers.set('Cache-Control', FONT_CACHE);
  }
}

function secureHeaders(): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return headers;
}

function withHeaders(response: Response, pathname: string): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  withCacheHeaders(headers, pathname);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: AssetEnv): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    const path = canonicalPath(url.pathname);
    const needsHttps = visitorUsesHttp(request);
    const needsHost = host === `www.${CANONICAL_HOST}`;
    const needsPath = path !== url.pathname;

    if (!isLocalDevHost(host) && (needsHttps || needsHost || needsPath)) {
      const dest = new URL(url.href);
      dest.protocol = 'https:';
      dest.hostname = CANONICAL_HOST;
      dest.port = '';
      dest.pathname = path;
      const headers = secureHeaders();
      headers.set('Location', dest.toString());
      return new Response(null, { status: 301, headers });
    }

    const response = await env.ASSETS.fetch(request);
    return withHeaders(response, url.pathname);
  },
};
