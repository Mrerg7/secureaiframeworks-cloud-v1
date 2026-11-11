# secureaiframeworks.cloud

Static Astro site for the premium domain **secureaiframeworks.cloud**, deployed on Cloudflare Workers with static assets.

## Canonical URLs (SEO)

Indexed HTML URLs are always:

- `https://secureaiframeworks.cloud/` (apex, HTTPS)
- trailing slash on every HTML path (`/blog/`, not `/blog`)

The Worker (`src/worker.ts`) issues a **single 301** that normalizes HTTP → HTTPS, `www` → apex, `index.html` aliases, and missing trailing slashes. That prevents Cloudflare Assets’ default **307** trailing-slash redirects (and redirect chains), which Google Search Console reports as “Page with redirect” and does not treat as a strong permanent-canonical signal.

## Local development

```bash
npm install
npm run dev
```

## Build & preview

```bash
npm run build
npm run preview
```

## Deploy

```bash
npm run build
npx wrangler deploy
```

Custom domain: `secureaiframeworks.cloud` (see `wrangler.toml` `[[routes]]`).
