# Autopilot — the full autonomous pipeline

`npm run outreach:autopilot` runs the **entire Lead Hunter OS pipeline end-to-end
in one command**: it finds businesses, enriches and scores them, promotes the good
ones to leads, writes personalized **Turkish** emails, quality- and spam-checks
them, sends (or, in dry-run, just drafts) within your limits, tracks replies,
suppresses opt-outs, sends due follow-ups, checks sending reputation, and writes a
report — all in sequence, **without ever bypassing a safety gate**.

It is the same guarded functions the individual commands (`hunt`, `enrich`,
`dedupe`, `validate`, `start`, `inbox`, `optout`, `followups`, `reputation`,
`report`) call — just chained. Autopilot adds no new powers and removes no
guardrails; it only removes the manual typing between steps.

> Portfolio: https://cenk-emir-bat.vercel.app · Meeting (online/offline): https://cal.com/cenk-emir-bat/30min

---

## What it does — the 10 ordered steps

Running `npm run outreach:autopilot` executes these, in order. Each step is
wrapped so that a failure or a missing dependency is **reported and skipped**, and
the pipeline moves on to the next step (see [Safety guarantees](#safety-guarantees)).

| # | Step | What happens | Can be blocked/skipped when… |
|---|------|--------------|------------------------------|
| 1 | **setup-check** | Reports `dryRun`, whether Gmail creds are present, and which live hunter sources are configured (or "manuel içe aktarma" if none). | — (always runs, report-only) |
| 2 | **hunt** | Discovers businesses from active campaigns via the source adapters → `discovered-leads.csv` (dedupes as it goes). | `leadHunterEnabled=false` → **skipped** |
| 3 | **enrich** | Fetches homepage/contact (with a timeout), extracts real emails (never guesses), detects a concrete problem, scores, and **promotes** qualifying rows to `leads.csv`. | runs; no work if nothing was discovered |
| 4 | **dedupe** | Marks duplicate leads (by email / domain / phone / name+city). | runs |
| 5 | **validate** | Counts how many leads are sendable (B2B, real business email, enough data). | runs (report-only, sends nothing) |
| 6 | **start** | The core pipeline: analyze → score → pick offer → generate Turkish email (90–150 words, opt-out line + cal.com CTA) → quality review (≥90) → spam check → **limit-aware** send/dry-run → schedule follow-ups. | runs; sends only if `dryRun=false` **and** Gmail creds present |
| 7 | **inbox + optout** | Searches Gmail for replies and classifies them (`interested` / `maybe_later` / `not_interested` / `opt_out` / `bounced` / `auto_reply` / `irrelevant`); updates leads, stops follow-ups; then adds opt-outs/not-interested to `do-not-contact.csv` and closes those leads. | inbox needs Gmail creds; without them it reports "bağlı değil" and does nothing |
| 8 | **followups** | Sends any follow-ups whose 3- / 7-business-day delay is due (same limits & gates). | runs; sends only under the same send conditions as step 6 |
| 9 | **reputation** | Computes bounce & opt-out rates and Gmail errors; **pauses real sending** if a threshold is crossed; logs to `domain-reputation-log.csv`. | runs |
| 10 | **report** | Writes the daily report to `generated/reports/`. | runs |

At the end it prints a per-step summary (`✓ done`, `✗ error`, `• skipped/blocked`)
and a **Güvenlik** (safety) block restating the mode, the limits, and whether the
reputation guard is currently paused.

### The three run modes

Autopilot labels its run according to config (this only affects **sending**, not
which steps run):

| Mode | Condition | Effect |
|------|-----------|--------|
| `dry-run` | `dryRun: true` (the default) | Emails are generated and logged; **nothing is sent**. |
| `send` | `dryRun: false` **and** `autoSendEnabled: true` | Approved emails are sent via Gmail, within limits. |
| `draft` | `dryRun: false` **and** `autoSendEnabled: false` | Emails are prepared/marked ready but auto-send is held. |

---

## Safety guarantees

Autopilot **cannot** do anything the individual commands can't. Every gate stays in
force on every run:

- **`dryRun` is honored.** With `dryRun: true` (the default) autopilot sends **zero**
  emails — it only generates drafts and logs. This is the master switch.
- **Daily/hourly limits are enforced.** At most **5/hour** and **20/day** — a single
  autopilot pass sends at most the hourly amount; the rest is left `ready` for the
  next run.
- **Quality gate (≥90).** Any email scoring below 90 is blocked, never sent.
- **Spam check.** Near-duplicates, sales-y/all-caps language, and any **forbidden
  service** are blocked.
- **do-not-contact / opt-out.** Anyone on `do-not-contact.csv` is never emailed;
  every email still contains the opt-out sentence
  *"Uygun değilse sorun değil, bir daha rahatsız etmeyeyim."*
- **Reputation guard.** If bounce rate exceeds `pauseOnBounceRateAbove` (0.05) or
  opt-out rate exceeds `pauseOnOptOutRateAbove` (0.10), real sending is paused.
- **Enrichment never guesses emails** — a lead is only promoted if a real business
  email was found **and** score ≥ `minLeadScoreToSend` **and** a specific problem was
  detected **and** it isn't a duplicate or on do-not-contact.
- **Blocked steps are reported, not fatal.** No live search API? No Gmail creds?
  Those steps are marked `skipped`/`blocked` in the summary and the pipeline
  continues — autopilot **never crashes** because a dependency is missing.

> `autopilotEnabled` (config, default `false`) is a *review flag*, not a kill
> switch. When it's `false`, autopilot still runs all the safe steps and prints a
> warning; it will only ever **send** if `dryRun=false` and Gmail creds are present.
> Flip `autopilotEnabled` to `true` once you've reviewed the pipeline and are
> comfortable running it unattended (see [Enabling real sending](#4-enable-real-sending)).

---

## 1. Your first autopilot run (safe dry-run)

Because `dryRun: true` is the default, you can run autopilot **right now** with zero
risk — it will draft everything and send nothing.

```bash
# Optional but recommended first:
npm run outreach:setup-check

# The full pipeline, dry-run:
npm run outreach:autopilot
```

What to expect on a fresh setup (no API keys, no Gmail creds, no active campaigns):

- **setup-check** → `dryRun=true · Gmail=eksik · canlı kaynak=yok (manuel içe aktarma)`
- **hunt** → runs, but discovers **0** unless a campaign is active and a source
  produces leads (see below).
- **enrich / dedupe / validate** → run over whatever leads already exist.
- **start** → generates Turkish emails into `generated/emails/` and logs them;
  **sends nothing** (dry-run).
- **inbox** → reports "Gmail bağlı değil" and does nothing.
- **reputation / report** → run; report lands in `generated/reports/`.

Inspect the drafts under `outreach/generated/emails/`, the report under
`outreach/generated/reports/`, and the run summary in the console. Nothing left your
machine. This is the intended way to see the whole system work before any credentials
exist.

---

## 2. Enable real lead hunting

By default `hunt` runs but finds nothing, because **all example campaigns are
inactive** and no live search source is configured. Two independent things unlock
real discovery — you can do either or both.

### a) Activate at least one campaign

Open `outreach/data/campaigns.csv` (a tracked config file with 6 İstanbul example
rows) and set `status=active` on the campaigns you want to run. Inactive campaigns
are ignored by `hunt`.

### b) Give the hunt a real source

Only two sources actually produce leads today:

| Source | Works today? | How to enable |
|--------|--------------|---------------|
| **manual** | ✅ Yes, no API | Paste businesses into `generated/hunter/manual/<campaign_id>.csv` (a template is created for you), then re-run `hunt`. |
| **google_search** (Google Custom Search JSON API) | ✅ Yes, with keys | Set `hunterSources.googleCustomSearch: true` in config **and** provide `GOOGLE_CUSTOM_SEARCH_API_KEY` + `GOOGLE_CUSTOM_SEARCH_CX` env vars. |
| **google_maps / instagram / directory** | ❌ **No — honest placeholders** | These return `needsSetup=true` with Turkish setup instructions. **They do not scrape.** They exist so a real provider (Google Places, SerpAPI, etc.) can be plugged in later. |

> **No adapter scrapes anything.** `google_maps`, `instagram`, and `directory` are
> placeholders that tell you what setup they'd need; they never fetch or fabricate
> businesses. Until you use the **manual** paste flow or configure **Google Custom
> Search**, `hunt` will legitimately discover 0 leads.

After activating a campaign and providing a source, re-run:

```bash
npm run outreach:autopilot     # hunt now discovers; enrich promotes qualifiers
```

---

## 3. Verify with a dry-run before sending

Once leads exist (via hunting or by importing into `leads.csv` directly), run
autopilot again **still in dry-run** and review:

- `outreach/generated/emails/*.md` — approved drafts; `*.failed.md` — quality/spam rejects.
- `outreach/generated/reports/daily-report-<date>.md` — what would be sent/skipped.

Only proceed to real sending when the drafts read well and the report looks right.

---

## 4. Enable real sending

Three things must be true for autopilot to actually email people:

1. **Gmail credentials present.** Follow `MANUAL_SETUP.md` and set
   `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`,
   `GMAIL_SENDER_EMAIL`. Confirm with `npm run outreach:setup-check`
   (should report "Gmail kimlik bilgileri tam").
2. **`dryRun: false`** in `outreach-config.json` — the master send switch. Do this
   **only after** a clean dry-run.
3. **`autopilotEnabled: true`** in `outreach-config.json` — signals you've reviewed
   the pipeline and want it to run unattended. (With `autoSendEnabled: true`, the
   default, approved emails auto-send; keep it `false` for `draft` mode.)

Keep the limits conservative to start — the shipped `dailySendLimit: 20` /
`hourlySendLimit: 5` are deliberately low. Raise them slowly, only once replies are
healthy and reputation stays green.

```bash
# After creds + dryRun:false + autopilotEnabled:true:
npm run outreach:autopilot     # now sends up to 5/hour, 20/day, all gates active
```

> **Panic button:** set `"dryRun": true` in `outreach-config.json` to halt all
> sending immediately — the very next autopilot run reverts to draft-only.

---

## 5. Schedule autopilot

Autopilot is a single command, so you can run it manually whenever, or automate it.

### Run it manually

```bash
npm run outreach:autopilot
```

Because every pass respects the **5/hour · 20/day** caps and skips already-sent
leads, running it a few times across the day naturally fills the daily quota with no
babysitting.

### Windows Task Scheduler (recommended for unattended runs)

The same single-pass pattern used for `scheduler:once` works for autopilot: let Task
Scheduler provide the hourly trigger and run **one guarded autopilot pass** each time.

**PowerShell (run once to register):**

```powershell
$dir = "C:\Users\cenk\Desktop\claude-works\cenks-personal-website"
$action  = New-ScheduledTaskAction -Execute "cmd.exe" `
  -Argument "/c cd /d `"$dir`" && npm run outreach:autopilot >> outreach\generated\logs\autopilot-task.log 2>&1"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "VesperAutopilotHourly" -Action $action -Trigger $trigger `
  -Description "Vesper Outreach OS - hourly autopilot pass"
```

**Or via the GUI:**

1. **Task Scheduler → Create Task…**
2. **General:** name `VesperAutopilotHourly`; "Run only when user is logged on".
3. **Triggers → New → Daily**, recur every 1 day; tick **Repeat task every 1 hour**
   for a duration of **1 day** (or Indefinitely).
4. **Actions → New → Program/script:** `cmd.exe` · Arguments:
   `/c cd /d "C:\Users\cenk\Desktop\claude-works\cenks-personal-website" && npm run outreach:autopilot`
5. **Conditions:** untick "Start the task only if the computer is on AC power" if you
   want it to run on battery.
6. Save. Check `outreach/generated/logs/` and the daily report after the first hour.

**To pause/stop it:** `Unregister-ScheduledTask -TaskName "VesperAutopilotHourly"`
(or delete it in the GUI). You can also neutralize sends any time with `dryRun: true`.

> **Autopilot vs. the scheduler.** `outreach:scheduler` / `scheduler:once` run only
> the **send** slice (`start` + `report`) on a timer and have their own preflight
> (`scheduler.enabled`, `scheduler.allowDryRun`, Gmail-creds check). **Autopilot**
> runs the **whole** pipeline (hunt → enrich → … → report). Schedule **one** of them
> per machine to avoid double-processing; pick autopilot if you want discovery and
> reply-tracking automated too.

---

## Quick reference

| Goal | Command |
|------|---------|
| Am I set up? | `npm run outreach:setup-check` |
| Full autonomous pipeline (dry-run safe) | `npm run outreach:autopilot` |
| Just discover leads | `npm run outreach:hunt [campaignId]` |
| Just the send slice on a timer | `npm run outreach:scheduler:once` |
| Campaign status + next actions | `npm run outreach:campaign [campaignId]` |

**Golden rule:** autopilot never bypasses `dryRun`, the daily/hourly limits, the
quality (≥90) and spam gates, `do-not-contact`, or the reputation guard. Blocked
steps are reported, not fatal. Start in dry-run, verify, then enable sending slowly.
