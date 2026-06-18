# Project Progress

## cenks-personal-website

GitHub: https://github.com/cnkbat/cenks-personal-website
Live: https://cenk-emir-bat.vercel.app

---

## Completed

- [x] Scaffold Next.js 16 project (App Router, TypeScript, Tailwind CSS 4)
- [x] Home page — title, description, additional pages note
- [x] Static export configured (`output: "export"` in `next.config.ts`)
- [x] Production build verified (all pages static, no TypeScript errors)
- [x] README written
- [x] Initial commit pushed to GitHub (`main` branch, commit `98d0fd0`)
- [x] GitHub repo renamed to `cenks-personal-website`
- [x] Reusable `LegalLayout` component (`app/components/legal/LegalLayout.tsx`)
- [x] Content Machine — Privacy Policy (`/content-machine/privacy`) — commit `9c3dc22`
- [x] Content Machine — Terms of Service (`/content-machine/terms`) — commit `9c3dc22`
- [x] Vercel deployment connected and live
- [x] TikTok verification file at `/content-machine/privacy/tiktokckwqS5Qfv2ECBQVieIkjzQm3IGAxZTJg`
- [x] TikTok verification file at root `/tiktokhdqx7r1Ek28viAqxrQrRkbu6Gi2sN4Z3`
- [x] TikTok URL prefix verification file — `public/tiktok-developers-site-verification.txt` — commit `82955dd`
  - Returns HTTP 200, `Content-Type: text/plain; charset=utf-8`
  - Verified live via curl: `https://cenk-emir-bat.vercel.app/tiktok-developers-site-verification.txt`

## Pending

- [ ] Content Machine — Data Deletion page (`/content-machine/data-deletion`)
- [ ] Add API platform review pages
- [ ] Add project documentation pages

---

## Architecture Notes

### Legal page pattern
Future projects reuse `LegalLayout` by adding two files:

```
app/{project-slug}/privacy/page.tsx
app/{project-slug}/terms/page.tsx
```

Each page imports `LegalLayout` and passes `projectName`, `projectSlug`, `pageType`, and `lastUpdated`. No changes to shared code required.
