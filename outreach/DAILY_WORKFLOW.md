# Daily workflow — Vesper Outreach OS

A practical, ~15-minute routine. Assumes setup is done (`MANUAL_SETUP.md`) and
you've decided on dry-run vs live.

> **New:** with the **Lead Hunter OS** layer you no longer have to hand-type most
> leads. `hunt` discovers businesses and `enrich` fetches their site, finds a real
> email, detects a specific problem, scores them and promotes only the good ones to
> `leads.csv`. The fastest path is a single command — `npm run outreach:autopilot` —
> which runs the whole chain (hunt → enrich → dedupe → validate → start → inbox →
> optout → followups → reputation → report) behind every existing safety gate.
> See the two routines below: the classic manual routine still works unchanged, and
> the new autopilot-centered routine sits on top of it.

---

## 🚀 The fast path — autopilot-centered daily flow

This is the recommended routine once the Lead Hunter OS is set up. It leans on
`hunt` + `enrich` so you spend your time reviewing output, not typing leads.

### ☀️ Morning (feed the hunter, then autopilot)

1. **Decide where today's leads come from.** You need *at least one* working
   source. Only two actually produce leads today:
   - **Manual paste (no API needed):** activate a campaign and paste businesses.
     - In `outreach/data/campaigns.csv`, set a row's `status` to `active` (all 6
       İstanbul examples ship **inactive** by default).
     - Run `npm run outreach:hunt` once so the paste template is created, then open
       `outreach/generated/hunter/manual/<campaign_id>.csv`, paste in businesses
       (name, website/maps/instagram, city, etc.), save, and re-run `hunt`.
   - **Google Custom Search (optional API):** set
     `hunterSources.googleCustomSearch: true` in `outreach-config.json` and export
     `GOOGLE_CUSTOM_SEARCH_API_KEY` + `GOOGLE_CUSTOM_SEARCH_CX`. Then `hunt` pulls
     candidates automatically for every **active** campaign.

   > `google_maps`, `instagram` and `directory` are **honest placeholders** — they
   > return `needsSetup=true` with Turkish setup notes and do **not** scrape. They
   > will not produce leads until you wire in a real provider.

2. **Check the system is ready**
   ```
   npm run outreach:setup-check
   ```

3. **Run autopilot — dry-run first (always)**
   ```
   npm run outreach:autopilot
   ```
   In order it runs: **setup-check → hunt → enrich → dedupe → validate → start →
   inbox → optout → followups → reputation → report**. Any step that is blocked
   (no live search API, no Gmail creds, `leadHunterEnabled=false`, etc.) is
   **reported and skipped** — autopilot never crashes and never bypasses a gate.
   - With `dryRun: true` it **sends nothing**: it discovers, enriches, promotes,
     writes emails to `generated/emails/`, and writes the daily report.

4. **Review the output**
   - Open the newest report in `outreach/generated/reports/daily-report-<today>.md`
     — it summarizes hunted, enriched/promoted, generated, sent, skipped, blocked,
     follow-ups due, reputation status, and manual actions.
   - Skim a few drafts in `generated/emails/` for tone, the cal.com CTA
     (https://cal.com/cenk-emir-bat/30min), and the opt-out sentence
     *"Uygun değilse sorun değil, bir daha rahatsız etmeyeyim."*
   - Spot-check `outreach/data/leads.csv` — enrichment only promotes a lead when it
     found a **real business email**, the **score ≥ `minLeadScoreToSend`**, a
     **specific problem** was detected, and it's not a duplicate or on the
     do-not-contact list. It **never guesses** an email.

5. **Go live when you're happy** (only after testing, per `MANUAL_SETUP.md`):
   flip `"dryRun": false` in `outreach-config.json`. Now `npm run outreach:autopilot`
   will **send within the caps** — at most **5/hour** and **20/day** — and mark the
   rest `ready` for the next pass. Re-run it every hour or two, or let the scheduler
   drive it (see the hourly runner section below).

### 🌙 Evening (process replies)

1. **Pull and classify replies** (needs Gmail creds):
   ```
   npm run outreach:inbox
   ```
   It searches Gmail and classifies each reply as `interested`, `maybe_later`,
   `not_interested`, `opt_out`, `bounced`, `auto_reply`, or `irrelevant`, updates the
   lead, and **stops follow-ups** where appropriate.

2. **Apply opt-outs / suppression**
   ```
   npm run outreach:optout
   ```
   Adds `opt_out` and `not_interested` contacts to `do-not-contact.csv` and closes
   those leads so they're never emailed again.

   > Autopilot already runs `inbox` and `optout` as part of its chain, so if you ran
   > autopilot in the evening these are done. Running them standalone is handy for a
   > quick reply sweep without the full pipeline.

3. **Prepare demos** for `interested` leads. Send the cal.com link if they haven't
   booked (https://cal.com/cenk-emir-bat/30min) and ask whether they prefer an
   **online or offline** meeting (the emails already ask this).

---

## ☀️ Morning (classic manual routine — still fully supported)

Prefer to drive each step yourself, or not using the hunter yet? The original
routine works exactly as before.

1. **Add 10–20 new leads** to `outreach/data/leads.csv`.
   - Sources: Google Maps, Instagram local business pages, directories.
   - Fill `business_name`, business `email`, one of website/instagram/maps,
     `industry`, and a one-line `observed_problem` in your own words.
   - *(Or let `hunt` + `enrich` fill `leads.csv` for you — see the fast path above.)*

2. **Check the system is ready**
   ```
   npm run outreach:setup-check
   ```

3. **Run the pipeline**
   ```
   npm run outreach:start
   ```
   - Dry-run: writes emails to `generated/emails/`, sends nothing.
   - Live: sends up to **5** approved emails (hourly cap), marks the rest `ready`.

4. **(Live only) top up during the day**
   - Re-run `npm run outreach:start` every hour or two to keep sending within the
     5/hour · 20/day limits, or schedule it hourly. Already-sent leads are skipped.

5. **Send due follow-ups**
   ```
   npm run outreach:followups
   ```

6. **Generate the report**
   ```
   npm run outreach:report
   ```
   Open `generated/reports/daily-report-<today>.md` — it lists what was sent,
   skipped, blocked, follow-ups due, and any manual actions needed.

---

## 🌙 Evening (reply + convert)

1. **Check your Gmail** for replies to today's outreach (label: "Vesper Outreach").
   *(Or automate it: `npm run outreach:inbox` classifies replies for you.)*

2. **Log replies** in `outreach/data/replies.csv` and update the lead's
   `reply_status` in `leads.csv`:
   - `interested` / `replied` → follow-ups stop automatically.
   - `not_interested` / `opt_out` → follow-ups stop; never contacted again.
   *(`npm run outreach:optout` will move opt-outs to `do-not-contact.csv` for you.)*

3. **Mark hot leads** — set `notes` (e.g. "wants demo Fri") and `status` toward
   `closed` when won.

4. **Prepare a demo** for interested leads.
   - Send your cal.com link if they haven't booked: https://cal.com/cenk-emir-bat/30min
   - Ask whether they prefer **online or offline** (the emails already ask this).

---

## 🤖 Automatic hourly runner (optional)

Instead of running the pipeline by hand, let the scheduler do it. It runs the full
`outreach:start` **plus a report once per hour**, and it **respects every limit and
safety gate** — it never bypasses quality review, spam check, lead score, or opt-out
(it just calls the same pipeline you'd run manually).

**It refuses to run / stops automatically when:**
- `scheduler.enabled` is `false`, or
- `dryRun` is `true` **and** `scheduler.allowDryRun` is `false`, or
- `dryRun` is `false` **and** Gmail credentials are missing.

**Config** (`outreach-config.json` → `scheduler`, conservative defaults):
```json
"scheduler": { "enabled": true, "intervalMinutes": 60, "allowDryRun": true, "maxRunsPerDay": 24 }
```
`intervalMinutes` is clamped to 15–1440; `maxRunsPerDay` to 1–48. Lifecycle logs go
to `outreach/generated/logs/scheduler.log`.

> **Autopilot vs scheduler.** The scheduler drives the send-side pipeline
> (`outreach:start` + report) on a timer. `outreach:autopilot` is the *whole* chain
> in one manual command — including `hunt`, `enrich`, `dedupe`, `inbox`, `optout`
> and `reputation`. Run autopilot yourself (once dry-run, then live) and let the
> scheduler keep topping up sends within the caps between your autopilot passes.

### Option 1 — local daemon (keep a terminal open)
```
npm run outreach:scheduler
```
Loops every `intervalMinutes` (default 60), re-reading the config each tick so edits
(or a flip to `dryRun:false` without creds) are picked up and can halt it safely.
Press **Ctrl+C** to stop. Good when the machine is already on.

### Option 2 — Windows Task Scheduler (recommended on Windows)
Task Scheduler provides the hourly trigger and runs a **single guarded pass** each
time (`npm run outreach:scheduler:once`) — more robust than keeping a Node process
alive.

**Quick setup (PowerShell, run once):**
```powershell
$dir = "C:\Users\cenk\Desktop\claude-works\cenks-personal-website"
$action  = New-ScheduledTaskAction -Execute "cmd.exe" `
  -Argument "/c cd /d `"$dir`" && npm run outreach:scheduler:once >> outreach\generated\logs\scheduler-task.log 2>&1"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "VesperOutreachHourly" -Action $action -Trigger $trigger `
  -Description "Vesper Outreach OS - hourly guarded run"
```

**Or via the GUI:**
1. Open **Task Scheduler** → **Create Task…**
2. **General:** name `VesperOutreachHourly`; select "Run only when user is logged on".
3. **Triggers** → New → **Daily**, recur every 1 day; tick **Repeat task every 1 hour**
   for a duration of **1 day** (or Indefinitely).
4. **Actions** → New → Program/script: `cmd.exe` · Arguments:
   `/c cd /d "C:\Users\cenk\Desktop\claude-works\cenks-personal-website" && npm run outreach:scheduler:once`
5. **Conditions:** untick "Start the task only if the computer is on AC power" if you
   want it to run on battery.
6. Save. After the first hour, check `outreach/generated/logs/scheduler.log`.

**To pause/stop it:** `Unregister-ScheduledTask -TaskName "VesperOutreachHourly"`
(or delete it in the GUI). You can also neutralize sends any time with
`scheduler.enabled:false`, or the master switch `dryRun:true`.

> The runner obeys the **5/hour · 20/day** caps automatically: each hourly pass
> sends at most 5, and it will never exceed 20 in a day. Over a workday it fills up
> to the daily cap on its own — no babysitting.

---

## Weekly

- Review `sent-log.csv` vs replies → which industries & offers convert best.
- Adjust email tone directly in `templates/*.tr.md`.
- Review `campaigns.csv` — pause campaigns that discover weak leads, activate new
  cities/industries. Skim `domain-reputation-log.csv` for bounce/opt-out trends.
- If reputation is healthy (replies coming, no spam complaints), consider raising
  `dailySendLimit` slightly in `outreach-config.json`. Increase slowly.

---

## Quick reference

| Goal | Command |
|------|---------|
| Am I set up? | `npm run outreach:setup-check` |
| Check leads only | `npm run outreach:validate` |
| Discover businesses (active campaigns) | `npm run outreach:hunt [campaignId]` |
| Enrich + promote to `leads.csv` | `npm run outreach:enrich` |
| Remove duplicates | `npm run outreach:dedupe` |
| Write emails, don't send | `npm run outreach:generate` |
| Send approved emails | `npm run outreach:send` |
| Send-side pipeline | `npm run outreach:start` |
| **Whole chain, one command** | `npm run outreach:autopilot` |
| Classify Gmail replies | `npm run outreach:inbox` |
| Apply opt-outs / suppression | `npm run outreach:optout` |
| Reputation guard check | `npm run outreach:reputation` |
| Follow-ups | `npm run outreach:followups` |
| Report | `npm run outreach:report` |

**Panic button:** set `"dryRun": true` in `outreach-config.json` to stop all sending
immediately — this applies to `start`, the scheduler **and** `autopilot`.
