# Planets of Hell Website

Official coming-soon website for Planets of Hell by Collapse Initiative, Inc.

## Prerequisites

- Node.js 18 or later
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL printed by Vite.

## Production Build

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

## Deployment

Deploy the contents of `dist/` to any static hosting provider. Ensure the host serves `index.html` for unknown routes so client-side routing works.

Update canonical URLs, Open Graph metadata, and `sitemap.xml` if the production domain differs from `https://planetsofhell.com/`.

## Project Structure

- `src/` — application source
- `public/` — static assets (images, robots.txt, sitemap.xml)
- `index.html` — HTML shell and SEO metadata
