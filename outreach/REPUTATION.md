# Sending reputation & warm-up guard — Vesper Outreach OS

Cold email only works if your mailbox stays trusted. One bad run — a batch of
bounces, a spike in opt-outs, or Gmail throttling you — can quietly land every
future message in spam. The reputation guard is the layer that watches for those
signals and **stops real sending before the damage spreads**.

This document covers what `npm run outreach:reputation` measures, when it pauses
the sender, how the sender respects that pause, the audit log it writes, and the
warm-up / anti-spam habits that keep the numbers healthy in the first place.

---

## Command

```
npm run outreach:reputation
```

Running it does three things:

1. Computes a **rolling health snapshot** from the log CSVs (read-only — it never
   sends and never touches your leads).
2. Appends **one audit row** to `data/domain-reputation-log.csv`.
3. Prints a Turkish summary and tells you whether sending is currently paused.

The same snapshot logic runs automatically inside the sender on **every**
`npm run outreach:start` / `send` / `autopilot` run, so you are protected even if
you never run the command by hand. Running it directly is how you *inspect* the
state and leave an audit trail.

---

## What it tracks

The snapshot is computed from `sent-log.csv`, `followups.csv`,
`reply-classifications.csv`, `replies.csv` and `blocked-leads.csv`. It reports:

| Metric | Meaning | Source |
| --- | --- | --- |
| `sendsToday` | Real deliveries (cold + follow-up) made today | sent-log + followups, dry-run excluded |
| `sendsLastHour` | Real deliveries in the last rolling 60 minutes | sent-log + followups, dry-run excluded |
| `totalSends` | All successful real deliveries on record | sent-log rows with `status=ok` |
| `bounces` | Bounced sends + inbound replies classified `bounced` | sent-log `status=bounced` + reply classifications |
| `replies` | Total inbound replies seen | reply-classifications + replies |
| `optOuts` | Replies classified `opt_out` | reply-classifications |
| `complaints` | Replies whose text mentions spam/şikayet/complaint | reply-classifications |
| `failures` | Sends that errored | sent-log `status=error` |
| `gmailErrors` | Failures whose error text looks transport-level | sent-log errors matching `gmail`, `token`, `429`, `rate`, `quota` |
| `bounceRate` | `bounces / max(1, totalSends)` | derived |
| `optOutRate` | `optOuts / max(1, totalSends)` | derived |

> **Dry-run does not count as a send.** Only rows with `status=ok` **and**
> `mode ≠ dry-run` are treated as real deliveries, so a demo run never inflates
> your reputation numbers or burns your daily quota.

---

## Pause rules

Sending is marked **paused** the moment *any* of these conditions is true. Each
adds a human-readable Turkish reason to the snapshot:

| Condition | Threshold | Config key | Turkish reason logged |
| --- | --- | --- | --- |
| Bounce rate too high | `bounceRate > 0.05` (5%) | `pauseOnBounceRateAbove` | `Bounce oranı yüksek (%…)` |
| Opt-out rate too high | `optOutRate > 0.10` (10%) | `pauseOnOptOutRateAbove` | `Opt-out oranı yüksek (%…)` |
| Gmail / transport errors | `gmailErrors ≥ 3` | — (fixed) | `Gmail API hataları` |
| Too many failed sends | `failures ≥ 5` | — (fixed) | `Gönderim hataları yüksek` |
| Too many near-duplicate emails blocked | `≥ 5` blocked rows whose reason contains `benziyor` | — (fixed) | `Çok fazla benzer e-posta engellendi` |

The bounce and opt-out thresholds come straight from `outreach-config.json`
(`pauseOnBounceRateAbove: 0.05`, `pauseOnOptOutRateAbove: 0.1`). The other three
are fixed guards baked into the code. If none fire, the snapshot status is `ok`
and sending continues normally.

---

## How the sender respects a pause

The sender calls the reputation check *before* it delivers anything on a run:

- **Live mode (`dryRun: false`).** If the snapshot is paused, the sender logs the
  reasons, records a `Reputation pause: …` note on the run summary, and **returns
  immediately without sending a single email.** Nothing goes out until you fix
  the underlying problem and the rates fall back below threshold.
- **Dry-run mode (`dryRun: true`, the default).** A pause only **warns**. Because
  dry-run never delivers real mail, there is nothing to stop — the run stays fully
  demonstrable so you can keep generating and inspecting emails while you
  investigate. The pause note is still added to the summary.

In short: the guard blocks *real* sending only, and it fails safe — the default
`dryRun: true` config means the very first thing that could ever be paused is
already sending nothing.

The pause check is read-only. It computes the snapshot but writes **no** files,
so it is cheap and safe to call on every send run. The single log write happens
only when you run `npm run outreach:reputation` (or when `autopilot` reaches its
reputation step).

---

## The audit log: `data/domain-reputation-log.csv`

Each `outreach:reputation` run appends one snapshot row. Columns:

```
logged_at,window,sends,bounces,replies,opt_outs,complaints,failures,gmail_errors,bounce_rate,opt_out_rate,status,reason
```

| Column | Notes |
| --- | --- |
| `logged_at` | ISO timestamp of the snapshot |
| `window` | Always `rolling` (the snapshot is over all history on record) |
| `sends` | `totalSends` |
| `bounces` / `replies` / `opt_outs` / `complaints` / `failures` / `gmail_errors` | Raw counts |
| `bounce_rate` / `opt_out_rate` | Rates, 3 decimals (e.g. `0.062`) |
| `status` | `ok` or `paused` |
| `reason` | Semicolon-joined Turkish pause reasons (empty when `ok`) |

This file lives under `outreach/data/`. Like the other runtime lead files it is
**gitignored** (it can reflect real send activity) — treat it as a local audit
trail. The CLI recreates it with headers if it is missing.

Example rows:

```csv
logged_at,window,sends,bounces,replies,opt_outs,complaints,failures,gmail_errors,bounce_rate,opt_out_rate,status,reason
2026-07-01T09:12:04.000Z,rolling,18,0,2,0,0,0,0,0.000,0.000,ok,
2026-07-01T15:40:11.000Z,rolling,42,3,5,1,0,1,0,0.071,0.024,paused,Bounce oranı yüksek (%7.1)
```

Reviewing this file over time is the simplest way to see your warm-up trend and
to spot the exact run where a pause was triggered.

---

## Warm-up guidance — start low, raise slowly

A brand-new sending domain/mailbox has no reputation. Ramp volume gradually so
mailbox providers learn that your mail is wanted:

1. **Keep `dryRun: true` at first.** Generate and read the Turkish emails, confirm
   quality and offer selection, and verify `setup-check` passes — all without
   sending anything.
2. **Flip `dryRun: false` only after testing**, and start tiny. The shipped caps
   are already conservative: `hourlySendLimit: 5`, `dailySendLimit: 20`. A single
   run sends at most the **hourly** amount, so re-run through the day to pace
   naturally.
3. **Raise limits slowly** — a few more per day each week — only while
   `bounce_rate` stays near 0 and `opt_out_rate` stays low. If either climbs,
   hold or step back.
4. **Let replies breathe.** Run `npm run outreach:inbox` and `npm run
   outreach:optout` so opt-outs land in `do-not-contact.csv` and follow-ups stop
   for people who asked you to. Suppressing the unhappy recipients is what keeps
   the rates down.
5. **Check `outreach:reputation` before scaling.** If the last snapshot is
   `paused`, fix the cause before touching the limits.

Cold email is a marathon: consistent low volume to well-targeted businesses beats
a burst that gets you filtered.

---

## Avoiding spam in the first place

The reputation guard is a safety net, not a strategy. The pipeline already builds
in most of the protections; keep them on:

- **Personalize every email.** Each message is generated from the specific problem
  the analyzer detected for that business and one of the seven allowed offers.
  Generic blasts are what trip spam filters.
- **No duplicates.** The spam checker compares each new body against previously
  approved bodies and blocks near-duplicates (logged with reason `benziyor`). Five
  or more such blocks is itself a pause trigger — a signal your copy is too
  templated.
- **Always keep the opt-out line.** Every email ends with
  *"Uygun değilse sorun değil, bir daha rahatsız etmeyeyim."* Honoring opt-outs
  (via `inbox` → `optout` → `do-not-contact.csv`) directly lowers your complaint
  and opt-out rates.
- **Enrich, never guess.** Enrichment only promotes a lead when a **real business
  email** was found on the site — the system never invents `info@…` addresses.
  Guessed addresses are the #1 source of bounces; not guessing is why your bounce
  rate should stay near zero.
- **Respect the caps.** `dailySendLimit` and `hourlySendLimit` exist to keep you
  under provider rate limits and out of `429`/quota territory (which the guard
  flags as `gmailErrors`).
- **Authenticate your domain.** Set up **SPF, DKIM and DMARC** for the sending
  domain so receivers can verify your mail. Send from a **real mailbox on your own
  domain**, not a throwaway address — a properly authenticated, established mailbox
  is the single biggest factor in landing in the inbox.

---

## Quick reference

```bash
# Inspect sending health and append an audit row
npm run outreach:reputation

# The guard also runs automatically inside these:
npm run outreach:start      # generate + send (pauses real sending if unhealthy)
npm run outreach:autopilot  # …→ start → inbox → optout → followups → reputation → report
```

| Config key | Default | Effect |
| --- | --- | --- |
| `dryRun` | `true` | When `true`, a pause only warns (nothing is ever sent) |
| `pauseOnBounceRateAbove` | `0.05` | Pause real sending above 5% bounce rate |
| `pauseOnOptOutRateAbove` | `0.1` | Pause real sending above 10% opt-out rate |
| `dailySendLimit` | `20` | Max real deliveries per day (cold + follow-up share the pool) |
| `hourlySendLimit` | `5` | Max real deliveries per hour; caps a single run |

Related docs: `README.md`, `DAILY_WORKFLOW.md`, `MANUAL_SETUP.md`.
