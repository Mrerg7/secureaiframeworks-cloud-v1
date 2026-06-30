export const SITE_URL = 'https://secureaiframeworks.cloud';
export const SITE_NAME = 'secureaiframeworks.cloud';
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
