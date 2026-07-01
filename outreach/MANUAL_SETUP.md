# Manual setup — Vesper Outreach OS

Everything the system can automate, it does. This file is the short list of things
**only you** can do. Do them once. Until you finish, keep `outreach-config.json`
→ `"dryRun": true` (nothing is ever sent in dry-run).

Estimated time: ~20–30 minutes.

---

## Part A — Gmail API access (one time)

You need 4 values in the end: `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`,
`GMAIL_REFRESH_TOKEN`, `GMAIL_SENDER_EMAIL`.

### 1. Create / select a Google Cloud project
- Go to https://console.cloud.google.com/ → top bar → **New Project** (e.g.
  "vesper-outreach"). Use the Google account you'll send **from**.

### 2. Enable the Gmail API
- APIs & Services → **Library** → search **Gmail API** → **Enable**.

### 3. Configure the OAuth consent screen
- APIs & Services → **OAuth consent screen** → User type **External** → Create.
- App name: "Vesper Outreach", support email: your email.
- **Scopes:** you can skip adding scopes on this screen (you'll request them in
  step 5).
- **Test users:** add your own sending Gmail address. (In "Testing" mode a refresh
  token is valid for your test user — good enough for internal use.)

### 4. Create OAuth credentials
- APIs & Services → **Credentials** → **Create Credentials** → **OAuth client ID**.
- Application type: **Web application**.
- **Authorized redirect URIs** → add:
  `https://developers.google.com/oauthplayground`
- Create → copy the **Client ID** and **Client secret**.

### 5. Generate a refresh token (OAuth Playground — no code)
1. Open https://developers.google.com/oauthplayground
2. Click the ⚙️ (top-right) → check **Use your own OAuth credentials** → paste your
   Client ID + Client secret.
3. On the left, in **Input your own scopes**, paste:
   `https://www.googleapis.com/auth/gmail.modify`
   (this single scope covers send + labels + reading replies + drafts).
4. Click **Authorize APIs** → sign in with your sending Gmail → allow.
5. Click **Exchange authorization code for tokens**.
6. Copy the **Refresh token** value.

### 6. Add environment variables
Open the repo's `.env` (already gitignored) and add:

```
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_SENDER_EMAIL=you@yourdomain.com
```

> Never commit `.env`. Secrets are read from the environment only.

### 7. Verify
```
npm run outreach:setup-check
```
All four `GMAIL_*` should show **Env var set** and "Gmail kimlik bilgileri tam."

---

## Part A2 — Lead search APIs (OPTIONAL — the Lead Hunter OS)

**You do not need any of this to get leads.** The Lead Hunter runs today with
**zero APIs** using the **manual import** source (see below). Everything in this
section is optional and only makes discovery faster.

The hunter looks up a source adapter per campaign (`source` column in
`data/campaigns.csv`). Only two adapters actually produce leads today:

| Source (`source`) | Status today | Needs |
|---|---|---|
| `manual` | ✅ Works with **no API** | You paste businesses into a CSV template |
| `google_search` | ✅ Works when enabled + keyed | Google Custom Search API + CX |
| `google_maps` | ⏳ Honest **placeholder** — no scraping | `GOOGLE_PLACES_API_KEY` + config flag (wired for later) |
| `instagram` | ⏳ Honest **placeholder** — no scraping | Manual import fallback |
| `directory` | ⏳ Honest **placeholder** — no scraping | Manual import fallback |

> The `google_maps`, `instagram`, and `directory` adapters **do not scrape**. They
> return `needsSetup=true` with Turkish instructions and make **no** network call.
> If you point a campaign at a source that isn't ready, the run does not crash — the
> step is reported and skipped, and you can fall back to `manual`.

### Option 1 — Manual import (no API, recommended to start)
This is the honest fallback and needs nothing but a CSV editor.

1. Add a campaign row in `data/campaigns.csv` (or use one of the 6 İstanbul
   examples) and set its `source` to `manual`. Campaigns are **INACTIVE** by
   default — set `status=active` when you're ready (see Part B, step 8b).
2. Run the hunt once — it creates a paste template for that campaign:
   ```
   npm run outreach:hunt
   ```
   Template path: `generated/hunter/manual/<campaign_id>.csv`
3. Open that file and fill in businesses you collected by hand. Columns accepted
   (any subset may be filled; the commented `#` example line is ignored):
   ```
   business_name,website,phone,city,district,industry,business_type,instagram,google_maps_url,source_url,rating,review_count
   ```
4. Re-run the hunt — your rows flow into `data/discovered-leads.csv` (deduped),
   then `npm run outreach:enrich` fetches each homepage, extracts a **real**
   business email (never guessed), detects a specific problem, scores it, and
   **promotes** qualifying leads into `data/leads.csv`.

### Option 2 — Google Custom Search (Programmable Search Engine)
When enabled and keyed, this makes **one real** HTTP request per campaign against
the Custom Search JSON API and maps results into discovered leads.

1. Create a Programmable Search Engine at
   https://programmablesearchengine.google.com/ → configure it to **search the
   entire web** → copy the **Search engine ID** (this is your **cx**).
2. Get an API key: https://developers.google.com/custom-search/v1/overview →
   **Get a Key** (enable the Custom Search API in your Google Cloud project).
3. Add to `.env`:
   ```
   GOOGLE_CUSTOM_SEARCH_API_KEY=your-api-key
   GOOGLE_CUSTOM_SEARCH_CX=your-search-engine-id
   ```
4. Turn it on in `outreach-config.json`:
   ```json
   "hunterSources": { "googleCustomSearch": true, ... }
   ```
5. Set a campaign's `source` to `google_search` (optionally fill its `query`
   column; otherwise the hunter builds one from `industry + city + district`),
   then `npm run outreach:hunt`.

> The free Custom Search tier is limited (roughly 100 queries/day). The hunter
> requests at most `num=10` per campaign and caps results at
> `maxHunterResultsPerCampaign` (default 50) and per-campaign `max_results`.

### Option 3 — Google Places API (PLACEHOLDER, wired for later)
The `google_maps` adapter is an **honest placeholder** in V1 — it does **not**
call any API or scrape. To prepare for the later Places Text Search integration:

```
GOOGLE_PLACES_API_KEY=your-places-api-key
```
and set `"hunterSources": { "googlePlaces": true, ... }`. Until the integration
lands, this source reports `needsSetup` and produces no leads — use `manual` or
`google_search` in the meantime.

### Option 4 — SerpAPI (PLACEHOLDER, wired for later)
Reserved for a future adapter. Add the key now if you have one; nothing consumes
it yet:
```
SERPAPI_API_KEY=your-serpapi-key
```
with `"hunterSources": { "serpApi": true, ... }`.

> Env var names are configurable in `outreach-config.json → apiKeys`
> (`googleCustomSearchEnv`, `googleCustomSearchCxEnv`, `googlePlacesEnv`,
> `serpApiEnv`). The defaults are the names shown above.

---

## Part B — Leads & first run

### 8. Add your first leads
You have two paths:

- **Via the hunter (recommended):** run the pipeline
  ```
  npm run outreach:hunt      # discover -> data/discovered-leads.csv
  npm run outreach:enrich    # fetch site, extract email, score, promote
  npm run outreach:dedupe    # remove duplicates
  ```
  Enrichment only **promotes** a lead into `data/leads.csv` when a real business
  email is found **and** the score ≥ `minLeadScoreToSend` **and** a specific
  problem is detected **and** it isn't a duplicate or on the do-not-contact list.
- **By hand:** open `data/leads.csv` and add 10–20 rows (replace the examples).
  Each needs at least: `business_name`, a **business** email, one of
  website/instagram/google_maps, and industry/business_type. Write
  `observed_problem` in your own words for sharper emails.

### 8b. Activate a campaign (if using the hunter)
Campaigns in `data/campaigns.csv` are **all INACTIVE by default**. Pick a
city/industry and set that row's `status` to `active`, and choose its `source`
(`manual` or `google_search`). Inactive campaigns are skipped by `hunt`.

### 9. First dry run (still safe — nothing sent)
```
npm run outreach:setup-check
npm run outreach:start        # dryRun:true → generates + reviews, sends nothing
npm run outreach:report
```
Read `generated/emails/*.md` — these are the exact emails that *would* be sent.

### 10. Go live
When you're happy with the emails:
- `outreach-config.json` → `"dryRun": false`
- Run `npm run outreach:start` — approved emails send automatically (up to 5/run).
- Run it again later in the day (or schedule hourly) to reach the daily cap.

### 11. (Optional) One-command autopilot
Once Gmail is set up and you've tested in dry-run, you can run the whole pipeline
in sequence:
```
npm run outreach:autopilot
```
This runs setup-check → hunt → enrich → dedupe → validate → start → inbox →
optout → followups → reputation → report. It **never** bypasses `dryRun`, the
daily/hourly limits, the quality/spam gates, the do-not-contact list, or the
reputation pause. Steps that lack API keys or credentials are reported and
skipped — they never crash the run. Autopilot is gated by
`"autopilotEnabled"` (default `false`) in `outreach-config.json`.

---

## Sending limits, warm-up & staying out of spam

**Gmail hard limits (Google's, not ours):**
- Free @gmail.com: ~**500** recipients/day. Google Workspace: ~**2000**/day.
- These are ceilings, not targets. Cold outreach should stay far below them.

**Why the defaults are low (20/day, 5/hour):**
- New/cold sending reputation is fragile. Blasting hundreds of cold emails gets
  your domain flagged and lands you in spam or gets the account suspended.
- **Warm up:** start at ~10–20/day for the first 1–2 weeks, then increase slowly.
  Real replies and low spam-complaints build reputation.

**Avoiding spam (the system already helps):**
- Every email is personalized (business name + a real, specific problem).
- No identical mass emails (near-duplicates are blocked).
- No spam words, all-caps, false guarantees, or misleading subjects.
- An opt-out line is always included.
- **You should also:** send from a real domain mailbox (not a brand-new one), keep
  SPF/DKIM/DMARC configured for your domain, and never buy lead lists.

**Reputation guard (automatic):** `npm run outreach:reputation` computes your
bounce and opt-out rates and **pauses real sending** when they exceed
`pauseOnBounceRateAbove` (default 5%) or `pauseOnOptOutRateAbove` (default 10%),
logging to `data/domain-reputation-log.csv`.

**Legal (TR/KVKK & GDPR):** B2B cold outreach with a clear opt-out and honest
identity is generally defensible, but you are responsible for compliance. Always
honor opt-outs immediately (see below) and keep the logs this system produces.

---

## Tracking replies

Reply detection has two paths:
1. **Assisted (with Gmail set up):** `npm run outreach:inbox` searches your inbox
   (`gmail.modify` scope) for replies from contacted addresses and classifies each
   as `interested` / `maybe_later` / `not_interested` / `opt_out` / `bounced` /
   `auto_reply` / `irrelevant`, updates the lead, and stops its follow-ups.
2. **Manual:** when a lead replies, add a row to `data/replies.csv` and set that
   lead's `reply_status` in `leads.csv` to `replied` / `interested` /
   `not_interested` / `opt_out`. Any of these stops follow-ups automatically.

## Stop contacting a lead (opt-out)

Run `npm run outreach:optout` to move opt-out / not-interested leads into
`data/do-not-contact.csv` and close them — or set that lead's `reply_status` to
`opt_out` (or `status` to `blocked` / `closed`) in `leads.csv` by hand. The
validator and follow-up engine will never touch a do-not-contact lead again.

---

## What I still need to do manually — checklist

1. **Gmail API credentials** — the four `GMAIL_*` env vars (Part A). **Required**
   to send anything.
2. **(Optional) Google Custom Search** — `GOOGLE_CUSTOM_SEARCH_API_KEY` +
   `GOOGLE_CUSTOM_SEARCH_CX`, and set `hunterSources.googleCustomSearch=true`.
3. **(Optional) Google Places API** — `GOOGLE_PLACES_API_KEY` +
   `hunterSources.googlePlaces=true`. Placeholder, wired for later.
4. **(Optional) SerpAPI** — `SERPAPI_API_KEY` + `hunterSources.serpApi=true`.
   Placeholder, wired for later.
5. **Flip `dryRun=false`** in `outreach-config.json` — only **after** testing in
   dry-run and reading the generated emails.
6. **Decide campaign city/industry** in `data/campaigns.csv` and set that row's
   `status=active` (campaigns are inactive by default). If using the manual
   source, also paste businesses into `generated/hunter/manual/<campaign_id>.csv`.
7. **Keep daily send limits low** (`dailySendLimit`, `hourlySendLimit`) while you
   warm up the sending reputation.
