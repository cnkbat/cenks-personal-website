# Cenk Emir Bat — Premium Digital Solutions

The personal business website of **Cenk Emir Bat**. A premium, bilingual (Turkish/English) marketing site for helping local businesses become more professional online — modern websites, CRM, online appointment systems, SEO and digital growth.

Live: https://cenk-emir-bat.vercel.app

## Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — section reveals, hover lift, micro-interactions
- **Lucide Icons**
- **Geist** font (Sans + Mono)
- **shadcn/ui**-style primitives (`components/ui`)

## Features

- Dark-luxury design — glassmorphism, soft gradients, glow, animated blurred backgrounds, grid overlays
- Bilingual i18n (TR default / EN) via React context + typed dictionaries — see `lib/i18n/dictionaries.ts`
- Sticky navbar (transparent → glass on scroll) with language switcher, CTA and WhatsApp
- Sections: Hero, Business Value, Services, Demos, Packages, About, Contact
- **Sector demo suite** — standalone, Turkish, self-themed business-system demos with coded
  interactive dashboards: `/demos/{kuafor-os,beauty-center-crm,clinic-os,estate-os,restaurant-os}`
  plus the live `/puruze-caffe` cafe site. Built on a shared, CSS-variable-themed kit
  (`components/demos/kit`, `lib/demos/themes.ts`). Old `/demos/*` slugs 301-redirect to these.
- SEO: metadata, Open Graph (generated image), `robots.txt`, `sitemap.xml`
- Fully responsive, accessible, reduced-motion aware

## Project Structure

```
app/
  (site)/            # marketing site (navbar, footer, background)
    page.tsx         # home
  demos/<slug>/      # standalone, self-themed sector demos (outside (site))
  puruze-caffe/      # standalone live cafe demo (+ /menu)
  content-machine/   # preserved legal pages for a separate product
  layout.tsx         # root: fonts, metadata, providers
  opengraph-image.tsx
  sitemap.ts / robots.ts
components/
  demos/kit/         # reusable demo kit (shell, hero, sections, mockup atoms)
  demos/<sector>/    # each sector demo's page component + coded dashboard
  puruze/            # Püruze cafe demo
  layout, sections, ui, providers
lib/
  demos/themes.ts    # per-sector CSS-variable theme tokens
  i18n/              # translation dictionaries + site config
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # static export to out/
```

## Deployment

Deployed to the Vercel project **cenk-emir-bat** on every push to `main`.

> Note: the `content-machine/` legal pages and root TikTok verification files belong to a separate product and are intentionally preserved.
