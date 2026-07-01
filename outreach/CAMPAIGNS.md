# CAMPAIGNS.md — Campaign Manager

A **campaign** in Vesper Outreach OS is a saved lead-search: a city/district +
industry + query + source that the Lead Hunter uses to discover businesses, and
that the rest of the pipeline (enrich → send → follow up → classify replies)
rolls up against. This document explains the `campaigns.csv` schema, the six seed
İstanbul campaigns, how to activate and create campaigns, how to choose a
discovery source, and how to read the `npm run outreach:campaign` report.

Campaigns are **configuration** (tracked in git), unlike the runtime lead data,
which is gitignored PII. The two tracked config files are
`outreach/data/campaigns.csv` and `outreach/data/lead-sources.csv`.

---

## 1. `campaigns.csv` schema

File: `outreach/data/campaigns.csv`. One row per search campaign. Every column:

| Column | Meaning | Notes |
| --- | --- | --- |
| `campaign_id` | Stable unique id | Used as the join key across `discovered-leads.csv`, `enriched-leads.csv`, and the manual template filename `generated/hunter/manual/<campaign_id>.csv`. Keep it lowercase, no spaces (e.g. `istanbul_barber`). |
| `name` | Human-readable label | Shown in the CLI output and the report table (e.g. `İstanbul Berberler`). |
| `city` | Target city | Passed through to discovery + used on discovered leads. |
| `district` | Target district (optional) | Leave blank for a whole-city search. |
| `industry` | Normalized industry tag | e.g. `barber`, `beauty clinic`, `dental clinic`. |
| `business_type` | Turkish business-type phrase | e.g. `erkek kuaförü`, `güzellik merkezi`. |
| `query` | Search query string | The literal query the source adapter uses (e.g. `"İstanbul berber kuaför"`). |
| `source` | Discovery adapter id | One of `manual`, `google_search`, `google_maps`, `instagram`, `directory`. See §4. |
| `max_results` | Per-campaign discovery cap | Also globally bounded by `maxHunterResultsPerCampaign` (50) in `outreach-config.json`. |
| `status` | `active` or `inactive` | Only `active` campaigns are hunted. **All seeds ship `inactive`.** |
| `created_at` | Creation timestamp | Optional; you may leave blank. |
| `last_run_at` | Last hunt timestamp | Optional / bookkeeping. |
| `notes` | Free-text notes | Quote if it contains commas. |

### Example row

```csv
campaign_id,name,city,district,industry,business_type,query,source,max_results,status,created_at,last_run_at,notes
istanbul_barber,İstanbul Berberler,İstanbul,,barber,erkek kuaförü,"İstanbul berber kuaför",manual,50,inactive,,,"Aktifleştirmek için status=active yapın; source'u google_search/google_maps yapabilirsiniz"
```

> Fields with commas (like `query` and `notes`) **must** be wrapped in double
> quotes. Leave `district`, `created_at`, and `last_run_at` empty rather than
> inventing values.

---

## 2. The six seed İstanbul campaigns

`campaigns.csv` ships with six example campaigns, all **`status=inactive`** by
default so nothing is hunted or sent until you deliberately opt in:

| `campaign_id` | Name | Industry | Query |
| --- | --- | --- | --- |
| `istanbul_barber` | İstanbul Berberler | barber | `İstanbul berber kuaför` |
| `istanbul_beauty` | İstanbul Güzellik Merkezleri | beauty clinic | `İstanbul güzellik merkezi estetik` |
| `istanbul_dental` | İstanbul Diş Klinikleri | dental clinic | `İstanbul diş kliniği` |
| `istanbul_realestate` | İstanbul Emlakçılar | real estate | `İstanbul emlak ofisi` |
| `istanbul_fitness` | İstanbul Pilates / Fitness | fitness | `İstanbul pilates reformer fitness` |
| `istanbul_cafe` | İstanbul Kafe / Restoran | restaurant/cafe | `İstanbul kafe restoran` |

All six use `source=manual` and `max_results=50`. They are examples — edit them
freely (change city/district/query), or leave them and add your own.

---

## 3. Activating and creating campaigns

### Activate an existing campaign

Set its `status` to `active` in `campaigns.csv`:

```csv
istanbul_barber,İstanbul Berberler,İstanbul,,barber,erkek kuaförü,"İstanbul berber kuaför",manual,50,active,,,""
```

Only `active` campaigns are picked up by `npm run outreach:hunt`. `inactive`
campaigns are skipped entirely (and the campaign report flags them with the
next action **"Kampanyayı aktifleştir (status=active)"**).

### Create a new campaign

Append a new row with a fresh `campaign_id`:

```csv
kadikoy_dental,Kadıköy Diş Klinikleri,İstanbul,Kadıköy,dental clinic,diş kliniği,"Kadıköy diş kliniği implant",manual,50,active,,,"Yeni kampanya"
```

Then, for the `manual` source, run `npm run outreach:hunt kadikoy_dental` once to
generate the paste template at
`generated/hunter/manual/kadikoy_dental.csv`, fill it with businesses, and rerun
the hunt. Running a single campaign id limits the run to that campaign; running
`npm run outreach:hunt` with no id hunts **all active** campaigns.

> The CLI recreates any missing data file (with headers) on the next run, so you
> never have to hand-create files — but `campaigns.csv` itself is tracked config
> you edit directly.

---

## 4. Choosing a source

The `source` column selects a discovery adapter (registry:
`outreach/data/lead-sources.csv`). **Honesty matters here — only two sources
actually produce leads today:**

| `source` | What it does | Status today |
| --- | --- | --- |
| `manual` | Reads businesses you paste into `generated/hunter/manual/<campaign_id>.csv`. If the template is missing/empty it is created with a header + one commented example row and reports `needsSetup=true` with Turkish instructions. | **Works with no API.** Default for all seeds. |
| `google_search` | Google Custom Search JSON API adapter. | **Works only after setup:** set `hunterSources.googleCustomSearch=true` in `outreach-config.json` and provide `GOOGLE_CUSTOM_SEARCH_API_KEY` + `GOOGLE_CUSTOM_SEARCH_CX`. OFF by default. |
| `google_maps` | Google Places (Text Search) adapter. | **Honest placeholder.** Returns `needsSetup=true` with Turkish instructions; it does **not** scrape. Becomes usable only after a Google Places API key is wired in. |
| `instagram` | Instagram profile adapter. | **Honest placeholder.** No usable public API — returns `needsSetup=true`; import profiles manually instead. Does **not** scrape. |
| `directory` | Business directory adapter. | **Honest placeholder.** Returns `needsSetup=true`; does **not** scrape. |

**No adapter pretends to scrape.** For anything other than `manual` and
(optionally) `google_search`, discovery reports that setup is required and the
step is skipped — it never crashes and never fabricates leads.

### The manual paste template

For a `manual` campaign, the template file
`generated/hunter/manual/<campaign_id>.csv` accepts these columns (any subset may
be filled — missing fields become empty):

```
business_name,website,phone,city,district,industry,business_type,instagram,google_maps_url,source_url,rating,review_count
```

The auto-generated example (commented with `#`, so it's ignored) looks like:

```csv
# Örnek: Güzellik Merkezi X,https://ornek.com,+90 555 000 0000,İstanbul,Kadıköy,güzellik,salon,ornekx,,,4.6,120
```

Fill one row per business, delete/keep the commented example, then rerun
`npm run outreach:hunt <campaign_id>`. Rows whose `business_name` is empty or
starts with `#` are ignored.

---

## 5. `npm run outreach:campaign [id]` — the campaign report

`npm run outreach:campaign` rolls up **every** campaign; passing an id
(`npm run outreach:campaign istanbul_barber`) limits the rollup to that one. It is
a **read-only** command — it reads the discovered / enriched / sent /
reply-classification stores and writes a Markdown report. It **never sends
anything.**

### Metrics per campaign

| Column | Source of truth | Meaning |
| --- | --- | --- |
| **discovered** | `discovered-leads.csv` (rows with this `campaign_id`) | Businesses found by the hunt. |
| **enriched** | `enriched-leads.csv` (rows with this `campaign_id`) | Businesses that went through enrichment. |
| **sendable** | enriched rows with `status=promoted` | Enriched leads that passed the promotion gate (business email + score ≥ `minLeadScoreToSend` + a specific detected problem + not duplicate + not on do-not-contact) and landed in `leads.csv`. |
| **sent** | `sent-log.csv` rows with `status=ok` whose email matches an enriched lead of this campaign | Emails actually sent (or logged, in `dryRun`). |
| **replies** | `reply-classifications.csv` matched by email | Classified replies. |
| **interested** | replies with `classification=interested` | Positive replies. |
| **conversion** | `interested / sent` (0 if nothing sent) | Shown as a percentage in the report. |

Matching between stages is done by normalized email, so a campaign only "owns" a
sent email / reply if that email appears among its enriched leads.

### Console output

For each campaign the CLI prints a line plus its next actions, e.g.:

```
İstanbul Berberler [inactive] — keşif 0 · zeng. 0 · gönderilebilir 0 · gönderilen 0 · yanıt 0 · ilgilenen 0
    → Kampanyayı aktifleştir (status=active)
    → Kaynak ekleyip 'npm run outreach:hunt' çalıştır
```

### Next actions (how they're chosen)

The report builds a Turkish checklist from each campaign's current state:

| Condition | Suggested next action |
| --- | --- |
| `status != active` | Kampanyayı aktifleştir (status=active) |
| `discovered == 0` | Kaynak ekleyip 'npm run outreach:hunt' çalıştır |
| `enriched < discovered` | 'npm run outreach:enrich' çalıştır |
| `sendable > 0` **and** `dryRun=true` | Test bitince dryRun=false yapıp gönder |
| `sendable > 0` **and** `dryRun=false` | 'npm run outreach:start' ile gönder |
| `replies > 0` | 'npm run outreach:inbox' ile yanıtları sınıflandır |

### Per-campaign reports on disk

Every run writes a timestamped Markdown report to
`outreach/generated/campaigns/campaigns-<YYYY-MM-DD>.md` containing:

- a **Kampanya durumları** table (Kampanya · Durum · Bulunan · Zenginleştirilen ·
  Gönderilebilir · Gönderilen · Yanıt · İlgilenen · Dönüşüm), and
- an **Önerilen sonraki adımlar** section listing the next actions per campaign.

The `generated/` tree (including `generated/campaigns/`) is **gitignored** because
it can contain lead-derived data.

---

## 6. Where campaigns sit in the pipeline

```
campaigns.csv (active)
   └─ hunt      → discovered-leads.csv   (per campaign_id, deduped)
       └─ enrich → enriched-leads.csv    (promote → leads.csv if gates pass)
           └─ start → sent-log.csv       (dryRun-safe, quality+spam+limit gated)
               └─ inbox → reply-classifications.csv
                   └─ campaign → generated/campaigns/campaigns-<date>.md
```

`npm run outreach:campaign` is the read-only reporting layer over all of the
above. It is a **separate** reporting command — it is **not** part of the
`autopilot` chain (autopilot runs setup-check → hunt → enrich → dedupe → validate
→ start → inbox → optout → followups → reputation → report). The campaign command
itself only measures — activation (`status=active`), pasting manual businesses,
providing optional API keys, and flipping `dryRun=false` remain deliberate manual
actions.
