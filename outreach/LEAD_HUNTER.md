# Lead Hunter OS

How **Vesper Outreach OS** finds businesses to contact. This is the discovery
layer that feeds the rest of the pipeline: it hunts for candidate businesses,
enriches them (fetch site, find a real email, detect concrete problems, score),
deduplicates, and — only when a lead truly qualifies — promotes it into
`data/leads.csv` where the existing sender takes over.

> Portfolio: https://cenk-emir-bat.vercel.app · Meeting (online/offline): https://cal.com/cenk-emir-bat/30min

**The honest headline:** today, only two sources actually produce leads — the
**Manual Import adapter** (works with **no API keys at all**) and the optional
**Google Custom Search adapter** (needs a key + flag). The `google_maps`,
`instagram`, and `directory` adapters are **honest placeholders**: they never
scrape and never invent data. When you point a campaign at one of them, they
politely return a "needs setup" note in Turkish and stop. Nothing here pretends
to scrape anything.

---

## The pipeline at a glance

```
hunt      → discover businesses per active campaign → data/discovered-leads.csv
enrich    → fetch site, extract email, detect problems, score → data/enriched-leads.csv
            (promotes qualifying leads → data/leads.csv)
dedupe    → mark repeat businesses in discovered-leads.csv
start     → existing sender pipeline (validate → generate → quality → send)
```

Each stage is a separate command and is safe to re-run. `hunt` and `enrich`
**never send email** — they only research and log. Sending stays behind every
existing safety gate (`dryRun`, daily/hourly limits, quality ≥ 90, spam check,
do-not-contact, reputation pause).

```bash
npm run outreach:hunt [campaignId]   # discover → discovered-leads.csv
npm run outreach:enrich              # enrich + promote qualifying leads → leads.csv
npm run outreach:dedupe              # mark duplicate discovered rows
npm run outreach:campaign [id]       # per-campaign pipeline rollup + next actions
```

`hunt` and `campaign` take an optional campaign id. For `hunt`, passing an id
runs **that one campaign regardless of its status**; with no id, only campaigns
whose `status` is `active` run.

---

## Source adapters

Every adapter implements the same contract (`HunterAdapter`): given a campaign it
returns `{ results, note, needsSetup }` and **must not throw**. The hunter looks
up an adapter by the campaign's `source` column; an unknown source falls back to
`manual` (the always-available safe default). The registry lives in
`src/hunter/sources/`.

| `source` id | Adapter | Works today? | Needs |
| --- | --- | --- | --- |
| `manual` | Manuel İçe Aktarım | **Yes** | Nothing — paste businesses into a CSV template |
| `google_search` | Google Custom Search | **Yes, optional** | `config.hunterSources.googleCustomSearch=true` + `GOOGLE_CUSTOM_SEARCH_API_KEY` + `GOOGLE_CUSTOM_SEARCH_CX` |
| `google_maps` | Google Places (Maps) | No — **honest placeholder** | Future Places integration; returns `needsSetup=true` |
| `instagram` | Instagram | No — **honest placeholder** | No public API; points you to `manual` |
| `directory` | İşletme Rehberi | No — **honest placeholder** | Reserved for a future directory source |

The registry of adapters (and their setup status) is also tracked as config in
`data/lead-sources.csv`, so you can see at a glance which sources exist and what
each one requires.

### `manual` — Manual Import (no API required)

The honest fallback that always works. It reads businesses **you collected by
hand** from a per-campaign template at
`generated/hunter/manual/<campaign_id>.csv`. If that file is missing or empty,
the adapter **creates it** (header row + one commented example line), reports
`needsSetup=true` with Turkish instructions, and returns zero results. Fill it
in, re-run `hunt`, and your rows become discovered leads.

Template columns (fill any subset; blanks are fine):

```
business_name,website,phone,city,district,industry,business_type,instagram,google_maps_url,source_url,rating,review_count
```

Rows whose `business_name` is empty — or that start with `#` (the example line) —
are ignored.

### `google_search` — Google Custom Search (optional, real HTTP)

When enabled **and** keyed, this makes **one** real request per campaign to the
Google Custom Search (Programmable Search Engine) JSON API and maps result items
into discovered rows (`business_name` ← result title, `website`/`source_url` ←
result link). The request uses an `AbortController` timeout
(`config.requestTimeoutMs`, default 10s). Note that Custom Search returns web
pages, not structured business records — so `phone`, `city`, rating, etc. come
back blank and are filled later by enrichment or left empty.

When it is **not** configured it makes **no network call** and returns an honest
`needsSetup` note telling you exactly which flag and env vars to set.

### `google_maps`, `instagram`, `directory` — honest placeholders

These three **do not scrape and do not call any API**. Their `isConfigured()`
always returns `false` and `search()` returns `needsSetup=true` with a Turkish
explanation:

- **`google_maps`** — "V1'de placeholder. Kurulum: `GOOGLE_PLACES_API_KEY` alın,
  `config.hunterSources.googlePlaces=true` yapın; Places Text Search
  entegrasyonu bu adım sonrası eklenir." (The env var name and flag already
  exist in config so the integration can be dropped in later without churn.)
- **`instagram`** — there is no official public API for discovering business
  profiles, so it never runs for real and points you at `source=manual`.
- **`directory`** — reserved for a future business-directory data source.

A campaign pointed at any of these simply logs a "needs setup" line in the hunt
report and contributes zero leads — it never crashes the run and never fabricates
businesses.

---

## Run it with NO paid APIs (manual mode, step by step)

You can run the entire discovery layer for free using the manual adapter. All six
seed campaigns already default to `source=manual`.

**1. Activate a campaign.** Open `data/campaigns.csv` and set one campaign's
`status` from `inactive` to `active`:

```csv
campaign_id,name,city,district,industry,business_type,query,source,max_results,status,created_at,last_run_at,notes
istanbul_barber,İstanbul Berberler,İstanbul,,barber,erkek kuaförü,"İstanbul berber kuaför",manual,50,active,,,"..."
```

**2. First hunt — create the paste template.** Run:

```bash
npm run outreach:hunt istanbul_barber
```

Because the template doesn't exist yet, the manual adapter creates
`generated/hunter/manual/istanbul_barber.csv` and tells you (in Turkish) to fill
it in. Zero leads discovered so far — that's expected.

**3. Paste businesses you collected by hand.** Open that CSV and add one row per
business. Minimum useful data is a `business_name` plus a `website` (so
enrichment can fetch it and find an email). Example:

```csv
business_name,website,phone,city,district,industry,business_type,instagram,google_maps_url,source_url,rating,review_count
Berber Ahmet,https://berberahmet.com,+90 555 111 2233,İstanbul,Kadıköy,barber,erkek kuaförü,berberahmet,,,4.7,180
Kuaför Züleyha,https://zuleyhakuafor.com,,İstanbul,Beşiktaş,barber,kadın kuaförü,,,,4.5,64
```

Delete or ignore the `#` example line — the adapter skips it automatically.

**4. Re-run hunt.** Same command:

```bash
npm run outreach:hunt istanbul_barber
```

Now each pasted business is deduplicated against existing leads and prior
discoveries, then appended to `data/discovered-leads.csv` with `status=new`.

**5. Enrich → promote.**

```bash
npm run outreach:enrich
```

That's it — no API keys, no scraping. Repeat for other campaigns by activating
them and pasting into their own `generated/hunter/manual/<campaign_id>.csv`.

---

## Add Google Custom Search later (optional)

When you want automated discovery without pasting, wire up Google's Programmable
Search Engine:

1. Create a Programmable Search Engine and get its **CX** id.
2. Get a **Custom Search JSON API** key from Google Cloud.
3. Export both as environment variables (names come from
   `config.apiKeys` and are read from your env / `.env`):

   ```bash
   export GOOGLE_CUSTOM_SEARCH_API_KEY="..."
   export GOOGLE_CUSTOM_SEARCH_CX="..."
   ```

4. Flip the flag in `outreach-config.json`:

   ```json
   "hunterSources": { "googleCustomSearch": true, "googlePlaces": false, "serpApi": false, "manualImport": true }
   ```

5. Point a campaign at it by setting its `source` column to `google_search`, then
   run `npm run outreach:hunt <campaignId>`.

`npm run outreach:setup-check` confirms the state — it prints whether Google
Custom Search is "yapılandırıldı" (configured) or "kapalı" (off / optional).

## Add Google Places (Maps) later

The config already reserves the flag `hunterSources.googlePlaces` and the env-var
name `GOOGLE_PLACES_API_KEY` (via `config.apiKeys.googlePlacesEnv`), and
`data/lead-sources.csv` lists `google_maps` as a `requires_setup` source. The
adapter itself is still a placeholder — a real Places **Text Search** integration
is a later step. Until that ships, `source=google_maps` campaigns report
"needs setup" and produce nothing. (The same is true for SerpAPI: the
`serpApi` flag and `SERPAPI_API_KEY` name exist for future use.)

---

## `campaigns.csv` — the search-campaign registry

A campaign is a saved search: *what businesses, in what place, using which
source.* It is tracked config (committed to git), unlike the runtime lead data,
which is gitignored.

**Schema:**

| Column | Meaning |
| --- | --- |
| `campaign_id` | Unique id (e.g. `istanbul_barber`); also names the manual template file |
| `name` | Human label shown in reports |
| `city` | City used as a default when a result omits one |
| `district` | Optional district default |
| `industry` | Industry tag applied to discovered leads |
| `business_type` | Freeform business type (Turkish is natural here) |
| `query` | Search query string (used by `google_search`; explicit query wins) |
| `source` | Which adapter: `manual`, `google_search`, `google_maps`, `instagram`, `directory` |
| `max_results` | Per-campaign cap (further clamped by `config.maxHunterResultsPerCampaign`, 50) |
| `status` | `active` or `inactive` — only `active` runs on a bare `hunt` (any non-`active` value is skipped) |
| `created_at` | Optional timestamp |
| `last_run_at` | Written by `hunt` after each run (even if the source needed setup) |
| `notes` | Freeform notes |

**The 6 seed campaigns** (all shipped as `status=inactive`, `source=manual`):

| `campaign_id` | Name | Industry / business type |
| --- | --- | --- |
| `istanbul_barber` | İstanbul Berberler | barber / erkek kuaförü |
| `istanbul_beauty` | İstanbul Güzellik Merkezleri | beauty clinic / güzellik merkezi |
| `istanbul_dental` | İstanbul Diş Klinikleri | dental clinic / diş kliniği |
| `istanbul_realestate` | İstanbul Emlakçılar | real estate / emlak ofisi |
| `istanbul_fitness` | İstanbul Pilates / Fitness | fitness / pilates stüdyosu |
| `istanbul_cafe` | İstanbul Kafe / Restoran | restaurant/cafe / kafe restoran |

They are examples, intentionally inactive. Activate one by setting
`status=active`; switch `source` to `google_search`/`google_maps` if/when you
enable those.

---

## The discover → enrich → dedupe flow in detail

### `hunt` — discover

For each selected campaign, `hunt`:

1. Resolves the adapter from the `source` column (unknown → `manual`).
2. Runs the adapter's `search()`; captures its `note`/`needsSetup`.
3. Caps results at `min(campaign.max_results, config.maxHunterResultsPerCampaign)`.
4. For each result, builds a dedupe candidate and **skips** it if it matches an
   existing lead (any status) **or** a row already in `discovered-leads.csv`.
5. Appends survivors to `data/discovered-leads.csv` with a fresh
   `discovery_id` and `status=new`.
6. Stamps `last_run_at` on the campaign and writes a Turkish run report to
   `generated/hunter/hunt-<date>.md`.

A single failing or unconfigured source is wrapped in try/catch — it is reported
and skipped, never fatal.

### `enrich` — research, score, promote

`enrich` walks every discovered row with `status=new`, within a per-run website
budget of `config.maxWebsiteFetchesPerRun` (30):

- **Fetch the homepage** (one polite GET, `AbortController` timeout, redirects
  followed, body capped ~400k chars, identifiable bot User-Agent). The fetcher
  never throws — failures become `ok:false`.
- **Detect signals** from the HTML: mobile-friendly (viewport), SEO basics
  (title + meta description + `<h1>`), online booking (randevu/rezervasyon/
  booking/calendly…), WhatsApp, a lead form, a services page. It also derives a
  0–100 website-quality heuristic.
- **Follow a contact/iletişim link** if one exists and the budget allows, to find
  a better email.
- **Extract an email** from `mailto:` links and page text, drop junk (tracking
  pixels, image filenames, framework noise), and pick the best address
  (prefer one on the site's own domain, then any non-free provider). **Enrichment
  never guesses or constructs an email** — if none is found on the page, the lead
  simply has no email and cannot be promoted.
- **Analyze / score / pick an offer** using the same shared
  analyzer + scorer + offer-selector the sender uses, so a promoted lead is
  already scored and matched to one of the 7 offers.
- **Append an enriched row** to `data/enriched-leads.csv` with all the signals,
  the detected problems, the recommended offer, and a final `status`.

### `dedupe` — mark repeats

`dedupe` scans `discovered-leads.csv` and marks any row (`status → duplicate`)
that repeats an existing lead **or** an earlier discovered row. Matching uses,
in order: normalized **email**, then website **domain**, then **phone** (last 10
digits, `+90`/leading-0 stripped), then **business name + city**. It's idempotent
and leaves `promoted`/`rejected` rows untouched. (Note: `hunt` and `enrich`
already apply the same dedupe inline; this command is the explicit sweep.)

---

## Inspecting the data files

Everything is plain CSV under `outreach/data/` — open it in any editor or
spreadsheet. Runtime lead data is gitignored (it contains PII and the repo is
public); the CLI recreates any missing file with the correct header on the next
run.

### `discovered-leads.csv`

Raw finds, one row per business, before any research.

Columns: `discovery_id, campaign_id, business_name, website, phone, city,
district, industry, business_type, source, source_url, google_maps_url,
instagram, rating, review_count, discovered_at, status, notes`

`status` values: `new` (awaiting enrichment) · `enriched` · `promoted` ·
`duplicate` · `rejected`.

### `enriched-leads.csv`

The research record for each discovered lead — this is where you see *why* a lead
was or wasn't promoted.

Columns: `discovery_id, campaign_id, business_name, email, email_source, website,
has_website, website_status, website_quality, mobile_friendly, has_online_booking,
has_whatsapp, has_lead_form, has_services_page, seo_basics, ad_opportunity,
instagram, google_maps_url, whatsapp_link, contact_page, detected_problems,
recommended_offer, confidence, lead_score, enriched_at, status, notes`

Useful fields to scan:

- `email_source` — `homepage`, `contact_page`, or `none` (no email found).
- `detected_problems` — pipe-separated problem ids (empty means nothing concrete
  was found → not promotable).
- `lead_score` — must reach `minLeadScoreToSend` (70) to promote.
- `status` — `enriched` · `promoted` · `rejected` · `no_email` · `duplicate` ·
  `do_not_contact`. This tells you exactly which gate a lead hit.

For a per-campaign rollup (discovered → enriched → sendable → sent → replies →
interested, plus suggested next actions), run `npm run outreach:campaign` — it
writes `generated/campaigns/campaigns-<date>.md`.

---

## Promotion rules into `leads.csv`

A discovered + enriched lead is promoted into `data/leads.csv` (as a `pending`
lead the sender can pick up) **only if ALL of these are true**:

1. **A real business email was found** on the page — extracted, never guessed.
2. **`lead_score` ≥ `minLeadScoreToSend`** (default **70**).
3. **At least one specific problem was detected** (`detected_problems` is
   non-empty) — no vague leads.
4. **Not a duplicate** of an existing lead (email / domain / phone / name+city).
5. **Not on the do-not-contact list** (`data/do-not-contact.csv`).

If any condition fails, the lead is **not** promoted and its enriched `status`
records the reason:

| `status` | Meaning |
| --- | --- |
| `promoted` | All gates passed → new row added to `leads.csv` (`notes: Lead Hunter: <campaign_id>`) |
| `no_email` | No email found on the site (cannot contact) |
| `duplicate` | Matches a lead we already have |
| `do_not_contact` | On the opt-out / do-not-contact list |
| `rejected` | Had an email but failed score or had no specific problem |

Promoted leads land with their `observed_problem`, `suggested_offer`,
`lead_score`, and `status=pending` already filled in — so
`npm run outreach:start` (or `autopilot`) can validate, write the Turkish email,
run the quality + spam review, and send it under all the usual limits.

> Reminder: discovery and enrichment are automated, but **activating campaigns**,
> **pasting businesses** (manual source), and adding any **optional API keys**
> remain manual. And no adapter ever scrapes — `manual` and (optional)
> `google_search` are the only sources that produce leads today.
