# Project Progress

## cenks-personal-website

GitHub: https://github.com/cnkbat/cenks-personal-website

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

## Pending

- [ ] Import repo into personal Vercel account and deploy
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
