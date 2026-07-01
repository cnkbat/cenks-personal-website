# Vesper Outreach OS

An internal, safety-first B2B cold-outreach system for **Vesper** (Cenk Emir Bat).
It finds problems in local businesses, scores them, picks the right service to
offer, writes a personalized **Turkish** cold email, runs an automated quality +
spam review, and — only if the email passes — sends it via Gmail, tracks it, and
follows up automatically. You do **not** need to read every email before it goes out.

With the new **Lead Hunter OS** layer, it also finds and enriches the leads for
you: you no longer need to hand-fill `data/leads.csv` in normal usage — `hunt` +
`enrich` discover businesses, extract real contact emails, detect a concrete
problem, score them, and promote only the qualified ones into `leads.csv`.

> Portfolio: https://cenk-emir-bat.vercel.app · Meeting (online **or** offline): https://cal.com/cenk-emir-bat/30min

---

## What it does

1. **Find leads** with the Lead Hunter (see below) — or import/hold them in `data/leads.csv`.
2. **Validate** each lead (B2B only, real business email, enough data).
3. **Analyze** the business and detect concrete problems (no website, weak mobile,
   no online booking, weak SEO, ad potential, etc.).
4. **Score** the lead 0–100.
5. **Select the best offer** from your 7 services, matched to the detected problem.
6. **Generate** a short, personalized Turkish email (90–150 words).
7. **AI/automated quality review** (0–100). Blocks anything below 90.
8. **Spam check** (near-duplicate, sales words, all-caps, forbidden services…).
9. **Send** via Gmail — only if everything passes and within daily/hourly limits.
10. **Track** every send, **follow up** automatically (3 & 7 business days),
    **classify replies**, honor opt-outs, guard sender reputation, and **report** daily.

## What it does NOT do

- ❌ Social media management, content creation/packages, Instagram posting — these
  offers are **forbidden** and blocked by the quality reviewer.
- ❌ Mass-send identical emails (near-duplicates are blocked).
- ❌ Send on low confidence, low score, missing data, or no detected problem.
- ❌ Send to personal mailboxes (gmail/hotmail/outlook…) unless clearly a business
  contact.
- ❌ **Scrape** Google Maps, Instagram, or directories. Those adapters are honest
  placeholders that report what setup they'd need; they never pretend to scrape.
- ❌ **Guess** email addresses during enrichment — only real, found addresses are used.
- ❌ Make guarantees or use spammy/aggressive language.
- ❌ Send anything at all while `dryRun: true` (the default).

---

## The 7 offers

Premium Website · AI CRM / Appointment System · Google Ads · Meta Ads · TikTok Ads
· SEO · AI Business Automation.

Offer is chosen automatically from the detected problem (e.g. no website → Website;
appointment business → CRM; search intent → Google Ads; visual/young audience →
TikTok/Meta; site exists but low discovery → SEO; operational load → Automation).
A valid `suggested_offer` you put on the lead is respected when it matches a
detected problem.

---

## Lead Hunter OS

The Lead Hunter turns Vesper from "process the leads you already have" into
"find → enrich → dedupe → promote" — largely autonomously. It is enabled by
default (`leadHunterEnabled: true`) but sends **nothing** on its own; it only
feeds qualified leads into the existing, gated pipeline.

**Flow:**

1. **hunt** — reads your **search campaigns** (`data/campaigns.csv`, 6 İstanbul
   examples, all **inactive** by default) and runs each active campaign through its
   **source adapter** to discover candidate businesses into `data/discovered-leads.csv`
   (deduping as it goes).
2. **enrich** — fetches each candidate's homepage/contact page (with an
   `AbortController` timeout), extracts **real** emails (never guessed), detects a
   specific problem via the analyzer, and scores it. It **promotes** a candidate to
   `data/leads.csv` only if **all** of these hold: a business email was found **and**
   score ≥ `minLeadScoreToSend` **and** a specific problem was detected **and** it is
   not a duplicate **and** it is not on the do-not-contact list.
3. **dedupe** — flags duplicates by email / domain / phone / name+city across the
   discovered set.
4. **promote** — handled inside `enrich`; only qualified, de-duplicated,
   contactable leads reach `leads.csv`, ready for the normal `start` pipeline.

Then the normal pipeline (`start` → `inbox` → `optout` → `reputation` → `report`)
takes over, and `autopilot` chains the whole thing end to end.

### Source adapters (be honest about what works today)

| Adapter | Status | Produces leads today? |
|---|---|---|
| **manual** | Works with **no API**. Paste businesses into `generated/hunter/manual/<campaign_id>.csv` and re-run `hunt`. | ✅ Yes |
| **google_search** (Google Custom Search JSON API) | **Off by default.** Needs `hunterSources.googleCustomSearch=true` + `GOOGLE_CUSTOM_SEARCH_API_KEY` + `GOOGLE_CUSTOM_SEARCH_CX`. | ✅ Yes, once configured |
| **google_maps / instagram / directory** | **Honest placeholders.** They return `needsSetup=true` with Turkish instructions and **do not scrape**. | ❌ No — setup required |

Only **manual** and **(optional) Google Custom Search** actually produce leads
right now. The adapter registry (`data/lead-sources.csv`) and architecture make it
easy to later plug in Google Places, SerpAPI, Apify, PhantomBuster, BrightData, or
more manual CSVs — without touching the pipeline. See **`LEAD_HUNTER.md`** for the
full walkthrough.

---

## Commands

```bash
npm run outreach:setup-check   # check env, Gmail creds, hunter sources, data files, config
npm run outreach:validate      # validate leads only (no sending)
npm run outreach:generate      # generate + quality + spam review (no sending)
npm run outreach:send          # send AI-approved "ready" emails (limits enforced)
npm run outreach:start         # full pipeline: generate → review → send
npm run outreach:followups     # send due follow-ups
npm run outreach:report        # write daily report
npm run outreach:scheduler     # hourly daemon: runs start + report every hour
npm run outreach:scheduler:once# one guarded pass (for Windows Task Scheduler/cron)
npm run outreach:typecheck     # type-check the module

# -- Lead Hunter OS --
npm run outreach:hunt [id]     # discover leads from campaigns → discovered-leads.csv (id = one campaign)
npm run outreach:enrich        # enrich discovered leads + promote qualified ones to leads.csv
npm run outreach:dedupe        # flag duplicate leads (email/domain/phone/name+city)
npm run outreach:inbox         # scan + classify Gmail replies (needs Gmail creds)
npm run outreach:optout        # add opt-out / not-interested to do-not-contact.csv
npm run outreach:reputation    # bounce/opt-out rate + reputation guard (can pause sending)
npm run outreach:campaign [id] # campaign status + suggested next actions
npm run outreach:autopilot     # full autonomous pipeline (all safety gates on)
```

Every command is safe to run repeatedly. With `dryRun: true` nothing is ever sent.
The scheduler is a thin wrapper — it calls the same pipeline and honors every gate
and limit. `autopilot` runs, in sequence:
`setup-check → hunt → enrich → dedupe → validate → start → inbox → optout →
followups → reputation → report`, never bypassing `dryRun`/limits/quality/spam/
do-not-contact/reputation. Steps that lack an API or credentials (e.g. Gmail, an
optional search key) are **reported and skipped** — they never crash the run.
Setup + Windows Task Scheduler steps are in `DAILY_WORKFLOW.md`.

---

## File structure

```
outreach/
  data/                         # CSV "database"
    # ---- runtime lead data (GITIGNORED — PII, public repo) ----
    leads.csv                   # final, qualified leads + live status (auto-filled by enrich)
    discovered-leads.csv        # raw hunt output (candidates)
    enriched-leads.csv          # enrichment working set
    do-not-contact.csv          # opt-outs / suppressions
    domain-reputation-log.csv   # bounce/opt-out reputation history
    reply-classifications.csv   # classified inbox replies
    sent-log.csv                # every send attempt
    followups.csv               # every follow-up
    blocked-leads.csv           # spam-blocked leads
    replies.csv                 # replies you log
    # ---- tracked config (checked in) ----
    campaigns.csv               # search campaigns (6 İstanbul examples, all INACTIVE)
    lead-sources.csv            # source adapter registry
  templates/                    # Turkish email bodies (edit tone here)
    *-offer.tr.md, followup-1.tr.md, followup-2.tr.md
  generated/                    # output (gitignored)
    emails/                     # <lead>.md approved · <lead>.failed.md rejected
    followups/  reports/  logs/
    hunter/                     # hunt artifacts
      manual/<campaign_id>.csv  # paste-your-businesses templates for the manual adapter
    campaigns/                  # per-campaign status snapshots
    enrichment/                 # enrichment artifacts
    inbox/                      # reply-scan artifacts
  src/                          # TypeScript implementation
  outreach-config.json          # all settings + safety limits
  README.md  MANUAL_SETUP.md  DAILY_WORKFLOW.md
  LEAD_HUNTER.md  AUTOPILOT.md  COMPLIANCE.md  REPUTATION.md  CAMPAIGNS.md
  tsconfig.json
```

The CLI recreates any missing data file (with headers) on the next run.
`campaigns.csv` and `lead-sources.csv` are tracked config; all runtime lead data
and `generated/` are gitignored because the repo is public and they hold PII.

---

## Configuration (`outreach-config.json`)

Existing safety settings still apply: `dryRun` (true), `dailySendLimit` (20),
`hourlySendLimit` (5), `minLeadScoreToSend` (70), `minEmailQualityScoreToSend` (90),
`autoSendEnabled`, `followupsEnabled`, and the `scheduler` block.

New fields added for Lead Hunter OS:

| Field | Default | Meaning |
|---|---|---|
| `calendarUrl` | cal.com/cenk-emir-bat/30min | Booking link used in emails (online or offline). |
| `leadHunterEnabled` | `true` | Master switch for hunt/enrich. |
| `hunterSources.googleCustomSearch` | `false` | Enable the Google Custom Search adapter (needs keys). |
| `hunterSources.googlePlaces` | `false` | Google Places adapter (placeholder — needs setup). |
| `hunterSources.serpApi` | `false` | SerpAPI adapter (placeholder — needs setup). |
| `hunterSources.manualImport` | `true` | Manual paste adapter — works with no API. |
| `apiKeys.googleCustomSearchEnv` | `GOOGLE_CUSTOM_SEARCH_API_KEY` | Env var name for the CSE key. |
| `apiKeys.googleCustomSearchCxEnv` | `GOOGLE_CUSTOM_SEARCH_CX` | Env var name for the CSE engine id. |
| `apiKeys.googlePlacesEnv` | `GOOGLE_PLACES_API_KEY` | Env var name for Places. |
| `apiKeys.serpApiEnv` | `SERPAPI_API_KEY` | Env var name for SerpAPI. |
| `maxHunterResultsPerCampaign` | `50` | Cap on discovered leads per campaign per run. |
| `maxWebsiteFetchesPerRun` | `30` | Cap on homepage/contact fetches during enrich. |
| `requestTimeoutMs` | `10000` | Per-request fetch timeout (AbortController). |
| `minReviewCountPreferred` | `20` | Preferred minimum review count when ranking. |
| `pauseOnBounceRateAbove` | `0.05` | Reputation guard pauses real sending above this bounce rate. |
| `pauseOnOptOutRateAbove` | `0.10` | Reputation guard pauses real sending above this opt-out rate. |
| `autopilotEnabled` | `false` | Extra gate for fully unattended autopilot runs. |

---

## Safety rules (enforced in code)

- `dryRun: true` → generate + log everything, send nothing.
- Daily limit **20**, hourly limit **5** (a single run sends at most the hourly
  amount, then stops — re-run later or schedule hourly).
- Do **not** send if: lead score < `minLeadScoreToSend` (70), quality < 90,
  confidence < 50, no specific problem, incomplete data, or personal email.
- Enrichment **never guesses** emails; a lead is promoted only with a real business
  email, a real detected problem, a qualifying score, and no duplicate/DNC conflict.
- **Reputation guard**: bounce rate > 5% or opt-out rate > 10% **pauses** real
  sending and logs to `domain-reputation-log.csv` (see `REPUTATION.md`).
- **Opt-out / do-not-contact** is always honored; every email carries the opt-out
  line: *"Uygun değilse sorun değil, bir daha rahatsız etmeyeyim."* (see `COMPLIANCE.md`).
- Near-duplicate emails (>90% similar) are blocked.
- Forbidden services and false-promise phrases are blocked.

---

## How to add leads

**Normal usage: you don't.** Activate a campaign and let `hunt` + `enrich` fill
`leads.csv` for you (see `LEAD_HUNTER.md` and `CAMPAIGNS.md`).

If you want to add leads by hand anyway, open `data/leads.csv` and add rows.
Minimum useful fields: `business_name`, a **business** `email`, one of
`website`/`instagram`/`google_maps_url`, and `industry` (or `business_type`). Fill
`observed_problem` in your own words for sharper emails; optionally set
`suggested_offer`. Leave `lead_score`/`status` blank — the system fills them
(`status` defaults to `pending`).

`lead_id` must be unique (e.g. `L0006`). Statuses the system uses:
`pending, skipped, ready, sent, followup_1_sent, followup_2_sent, replied, blocked,
bounced, closed`.

To use the **manual** hunter source instead: set a campaign to `active` in
`data/campaigns.csv`, run `npm run outreach:hunt`, paste businesses into the
generated `generated/hunter/manual/<campaign_id>.csv` template, then re-run
`hunt` followed by `enrich`.

---

## Dry run vs real sending

- **Dry run (default):** `outreach-config.json` → `"dryRun": true`. Run
  `npm run outreach:start` — emails are written to `generated/emails/` and logged
  with mode `dry-run`, nothing is sent.
- **Enable real sending:** complete `MANUAL_SETUP.md`, run
  `npm run outreach:setup-check` until Gmail creds are green, then set
  `"dryRun": false`. With `autoSendEnabled: true`, `outreach:start`/`:send` will
  send automatically. Set `autoSendEnabled: false` to create Gmail **drafts**
  instead of sending.

## Disable auto-send quickly

Set `"dryRun": true` (kills all sending) or `"autoSendEnabled": false` (switch to
drafts) in `outreach-config.json`.

---

## Inspect logs

- Approved emails: `generated/emails/<lead_id>.md` · rejected: `<lead_id>.failed.md`
- Full run log: `generated/logs/outreach.log`
- Sends: `data/sent-log.csv` · follow-ups: `data/followups.csv` · blocked:
  `data/blocked-leads.csv`
- Hunt/enrich: `data/discovered-leads.csv`, `data/enriched-leads.csv`,
  `generated/hunter/`, `generated/enrichment/`
- Replies & compliance: `data/reply-classifications.csv`, `data/do-not-contact.csv`,
  `generated/inbox/`
- Reputation: `data/domain-reputation-log.csv`
- Daily report: `generated/reports/daily-report-<date>.md`

## Troubleshooting

- **"Gmail kimlik bilgileri eksik"** → env vars not set; see `MANUAL_SETUP.md`.
- **`hunt` found nothing** → the campaign may be inactive, or it uses a placeholder
  adapter (google_maps/instagram/directory). Use the **manual** paste template or
  enable Google Custom Search. See `LEAD_HUNTER.md`.
- **`enrich` promoted nothing** → no business email found, score below 70, no
  specific problem detected, or a duplicate/DNC match — all expected gates.
- **Sending paused unexpectedly** → the reputation guard tripped on bounce/opt-out
  rate; check `data/domain-reputation-log.csv` and `REPUTATION.md`.
- **Everything skipped** → check `notes` in `leads.csv`; usually personal email or
  missing data. Run `npm run outreach:validate`.
- **Quality < 90** → see `generated/emails/<lead>.failed.md` for the exact reasons.
- **Turkish characters look wrong in a terminal** → display only; files are UTF-8.
- **Re-run from scratch** → set the leads' `status` back to `pending` (or clear
  `data/*.csv` — the CLI recreates headers on next run).

---

## Documentation map

| Doc | What it covers |
|---|---|
| `README.md` | This overview. |
| `MANUAL_SETUP.md` | One-time Gmail (and optional API-key) credential setup. |
| `DAILY_WORKFLOW.md` | Day-to-day operation + Windows Task Scheduler/cron. |
| `LEAD_HUNTER.md` | Find → enrich → dedupe → promote, source adapters, manual paste. |
| `AUTOPILOT.md` | The end-to-end autonomous run and every gate it respects. |
| `COMPLIANCE.md` | Opt-out handling, do-not-contact, the mandatory opt-out line. |
| `REPUTATION.md` | Bounce/opt-out thresholds and the sending pause guard. |
| `CAMPAIGNS.md` | Defining and activating search campaigns in `campaigns.csv`. |

---

## Notes on architecture

- CSV is the V1 datastore — intentionally simple. `src/store.ts` + `src/csv.ts`
  isolate all I/O so migrating to SQLite/Supabase later is a small change.
- The analyzer (`src/website-analyzer.ts`) and quality reviewer
  (`src/quality-reviewer.ts`) are deterministic and pluggable — they expose the
  same contract an LLM pass would, so you can layer an LLM on top without touching
  the pipeline.
- The Lead Hunter is adapter-based (`src/hunter/`, registry in `data/lead-sources.csv`):
  new discovery sources plug in without changing hunt/enrich/dedupe.
- The module is isolated from the Next.js site (own `tsconfig.json`, excluded from
  the app's lint/build). It cannot break the website.
