export const SITE_URL = 'https://secureaiframeworks.cloud';
export const SITE_NAME = 'secureaiframeworks.cloud';

/** Shared FAQ entry shape — drives both the visible FAQ section and FAQPage schema. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Shared article metadata — drives the BlogPosting schema on guide pages. */
export interface ArticleMeta {
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
}

/** Asking price — surfaced in title, meta description, and Product/Offer schema. */
export const DOMAIN_PRICE = '14997';
export const DOMAIN_PRICE_DISPLAY = '$14,997';

/** Title tag: [Domain Name] | Premium Domain for Sale | [Price]. Keep ≤ 60 chars. */
export const PAGE_TITLE = `${SITE_NAME} | Premium Domain for Sale — ${DOMAIN_PRICE_DISPLAY}`;

/** Meta description: availability + price + UVP + CTA. Keep ≤ 158 chars. */
export const PAGE_DESCRIPTION =
  `Buy ${SITE_NAME} — the category-owning premium domain for secure AI frameworks and enterprise AI security. ${DOMAIN_PRICE_DISPLAY}, escrow-protected, fast transfer.`;

/** Appends the brand to a title tag only when the result stays ≤ 68 characters. */
export function pageTitle(base: string): string {
  const suffix = ` | ${SITE_NAME}`;
  return base.length + suffix.length <= 68 ? `${base}${suffix}` : base;
}

/** Apex HTTPS URL with a trailing slash and no query/hash — the only URL we want indexed. */
export function canonicalUrl(pathname = '/'): string {
  const origin = SITE_URL.replace(/\/+$/, '');
  let path = (pathname.split('#')[0] ?? '/').split('?')[0] || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.replace(/\/index\.html$/i, '/').replace(/\/index$/i, '/');
  if (!path.endsWith('/')) path += '/';
  path = path.replace(/\/{2,}/g, '/');
  return `${origin}${path}`;
}

export const CANONICAL_HOME = canonicalUrl('/');
export const ACQUISITION_EMAIL = 'sales@desertrich.com';
export const GOOGLE_SITE_VERIFICATION = 'SHdvjEOTSzbqlHLq2mrfqsjXFt9jCUgeyRXyUFlh4Lk';

/** Cloudflare Images CDN — hero / OG */
export const HERO_IMAGE_URL =
  'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/32fbeea6-ef96-4813-4082-7211eb59cb00/public';

export const DISCLAIMER =
  'This website is for demonstration and informational purposes only. It does not constitute an offer of services, a commitment to deploy, or a guarantee of outcomes. All statistics, projections, and references to specific technologies are based on publicly available information as of the date shown and are subject to change.';

export function acquisitionMailto(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  params.set(
    'subject',
    subject ?? 'Domain acquisition inquiry: secureaiframeworks.cloud',
  );
  if (body) params.set('body', body);
  return `mailto:${ACQUISITION_EMAIL}?${params.toString()}`;
}

/** Primary CTA — buyer is ready to close at asking price. */
export function buyNowMailto(): string {
  return acquisitionMailto(
    `Purchase intent: secureaiframeworks.cloud (${DOMAIN_PRICE_DISPLAY})`,
    `I would like to proceed with acquiring secureaiframeworks.cloud at ${DOMAIN_PRICE_DISPLAY} via Escrow.com.\n\nName:\nCompany:\nPreferred transfer registrar:\n`,
  );
}

/** Secondary CTA — buyer wants to negotiate. */
export function makeOfferMailto(): string {
  return acquisitionMailto(
    'Offer to purchase: secureaiframeworks.cloud',
    `I would like to submit an offer for secureaiframeworks.cloud.\n\nName:\nCompany:\nOffer (USD):\n`,
  );
}
