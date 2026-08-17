const CANONICAL_HOST = 'secureaiframeworks.cloud';
const HSTS = 'max-age=31536000; includeSubDomains; preload';

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
      return new Response(null, {
        status: 301,
        headers: {
          Location: dest.toString(),
          'Strict-Transport-Security': HSTS,
        },
      });
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Strict-Transport-Security', HSTS);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
