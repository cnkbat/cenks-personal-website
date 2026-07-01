# COMPLIANCE.md — Do-Not-Contact, Opt-Out & Data Protection

This document explains how **Vesper Outreach OS** stays compliant: how it records
businesses that must never be contacted, how every send and follow-up is gated
against that list, the mandatory opt-out sentence in every email, the
`npm run outreach:optout` processor, and where the product stands on KVKK / GDPR
for B2B outreach.

The whole system is built around one principle: **a business that has opted out,
said "not interested", or is otherwise on the suppression list is never emailed
again — not with a cold email, not with a follow-up, not after re-enrichment.**

---

## 1. The do-not-contact list (`data/do-not-contact.csv`)

This is the permanent "never email this business again" registry. It is the
single source of truth for suppression and is checked before every generation,
send, follow-up, and enrichment promotion.

### Schema

| Column | Meaning |
| --- | --- |
| `entry_id` | Auto-assigned id (the CLI generates the next one). |
| `type` | One of `email`, `domain`, or `business`. Determines how `value` is matched. |
| `value` | The address, domain, or business name to suppress. |
| `business_name` | Optional human-readable label (helps you audit the list). |
| `reason` | Why it was suppressed (e.g. `opt_out`, `not_interested`, manual note). |
| `source` | Where the entry came from (`optout`, `inbox`, `manual`, …). |
| `added_at` | ISO timestamp. |

The CSV ships with only the header row; the CLI recreates it with headers if it
is missing.

### The three suppression types

Matching is **normalized** (lower-cased, trimmed, domains stripped of `www.`),
so casing and small formatting differences do not let a suppressed business slip
through:

- **`email`** — suppresses one exact address. Matched against the lead's email.
- **`domain`** — suppresses an entire domain. Matched against **both** the
  lead's email domain **and** the lead's website domain. This is the strongest
  blanket block for a company.
- **`business`** — suppresses by normalized business name. Useful when you know
  the company but not its email/domain.

A lead is considered suppressed if **any** of these match:

```
email == a suppressed email
email-domain == a suppressed domain
website-domain == a suppressed domain
business_name == a suppressed business
```

### Example rows

```csv
entry_id,type,value,business_name,reason,source,added_at
dnc-1,email,info@ornekkafe.com,Örnek Kafe,opt_out,optout,2026-07-01T09:12:00.000Z
dnc-2,domain,ornekkafe.com,Örnek Kafe,opt_out,optout,2026-07-01T09:12:00.000Z
dnc-3,business,Rakip Ajans,Rakip Ajans,manual — çalışmak istemiyoruz,manual,2026-07-01T09:20:00.000Z
```

Adding an entry is **idempotent**: a duplicate `type`+`value` is silently
ignored, so re-running the pipeline never bloats the list.

---

## 2. How every send checks the list

Suppression is enforced by the compliance module (`src/compliance/do-not-contact.ts`,
function `isDoNotContact`) at every point where the system could email or promote
a business:

1. **Generation (`outreach:generate` / `outreach:start`).** In the sender's
   generation stage, right after basic validation, each pending lead is checked
   with `isDoNotContact({ email, website, business_name, city })`. If it matches,
   the lead is marked `skipped` with the note **"Atlandı: do-not-contact
   listesinde"** and no email is generated for it.

2. **Follow-ups (`outreach:followups`).** The follow-up engine loads the
   suppression list once, then checks every due lead before sending. A suppressed
   business's follow-up is skipped ("do-not-contact — takip atlandı") even if it
   was contacted earlier and a follow-up was already scheduled. There is **no**
   path where a follow-up bypasses the list.

3. **Enrichment promotion (`outreach:enrich`).** A discovered/enriched business
   is promoted into `leads.csv` **only if** it is not on the do-not-contact list
   (alongside the other gates: business email found, score ≥
   `minLeadScoreToSend`, a specific problem detected, and not a duplicate). A
   suppressed business is marked `do_not_contact` and never becomes a contactable
   lead.

Because these are independent gates in three different engines, a suppressed
business is filtered out no matter which command you run — hunt, enrich, start,
or followups.

> **Note:** the do-not-contact gate is enforced regardless of `dryRun`. Even in
> dry-run mode the system will not generate an email for a suppressed business.

---

## 3. The mandatory opt-out sentence (every email)

Every cold email **and** every follow-up ends with a plain-language opt-out
sentence, supplied by `config.optOutLine`:

```
Uygun değilse sorun değil, bir daha rahatsız etmeyeyim.
```

This line is injected by the email generator into both cold emails and
follow-ups, and the quality reviewer requires it — an email missing the opt-out
line does not reach quality ≥ 90 and is therefore never sent. In other words,
**it is structurally impossible to send an approved email without an opt-out
offer.**

The sentence is intentionally low-friction: the recipient does not need to click
anything or fill out a form. A simple "no thanks" reply is enough, because the
inbox classifier and the opt-out processor turn that reply into a permanent
suppression (see below).

---

## 4. Opt-out processing — `npm run outreach:optout`

`outreach:optout` (`src/compliance/optout.ts`) is the command that turns "no"
replies into permanent suppression and closes the lead. It reads inbound signals
from two files:

- **`data/replies.csv`** — replies you logged manually, or that the inbox command
  wrote. It uses the `reply_status` column.
- **`data/reply-classifications.csv`** — the classified output of
  `outreach:inbox`. It uses the `classification` column.

For every row whose state is **`opt_out`** or **`not_interested`**, the processor:

1. **Suppresses the business permanently** — it adds a `do-not-contact` entry for
   the reply's **email**, and also for that email's **domain**, so the whole
   company is blocked, not just one mailbox. Both entries carry
   `source=optout` and `reason` = the signal state.
2. **Closes the lead** — it finds the matching lead (by `lead_id`, falling back to
   normalized email), sets `reply_status` to the signal state, sets `status` to
   `closed`, and writes the note **"Opt-out (…) — iletişim durduruldu"**. A
   `closed` lead is ineligible for cold emails (validator) and for follow-ups
   (follow-up engine's stop states), so it will never be contacted again.

It prints a summary: signals found, do-not-contact entries added, and leads
stopped. If there are no opt-out signals it exits cleanly with "Opt-out sinyali
yok."

```bash
npm run outreach:optout
```

### The related `inbox` step

`outreach:inbox` classifies inbound Gmail replies (interested | maybe_later |
not_interested | opt_out | bounced | auto_reply | irrelevant). When it classifies
a reply as **`opt_out`** it already, on the spot, closes the lead
(`status=closed`, `reply_status=opt_out`) **and** adds the email (and its domain)
to the do-not-contact list. `not_interested` closes the lead as well. So in a
Gmail-connected pipeline the suppression often happens during `inbox`; running
`outreach:optout` afterwards is a belt-and-braces sweep that also catches
opt-out/not-interested rows you added to `replies.csv` by hand.

---

## 5. Manually stopping contact with a business

You have three ways to permanently stop contacting a business. Any one of them is
enough; using the do-not-contact list is the most durable because it survives
re-hunting and re-enrichment.

### Option A — add a do-not-contact row (recommended)

Edit `data/do-not-contact.csv` and add a row. Pick the `type` that best fits what
you know:

```csv
# Block one address:
dnc-10,email,info@istemedigim.com,İstemediğim İşletme,manuel,manual,2026-07-01T10:00:00.000Z
# Block the whole company (email + website domain):
dnc-11,domain,istemedigim.com,İstemediğim İşletme,manuel,manual,2026-07-01T10:00:00.000Z
# Block by name when you don't have an email/domain:
dnc-12,business,İstemediğim İşletme,İstemediğim İşletme,manuel,manual,2026-07-01T10:00:00.000Z
```

From then on the business is filtered out of generation, sending, follow-ups, and
enrichment promotion. (`entry_id` just needs to be unique; the CLI assigns ids
for entries it creates itself.)

### Option B — set the lead's `reply_status` / `status`

In `data/leads.csv`:

- Set `reply_status` to **`opt_out`** → the validator marks the lead ineligible
  ("Lead çıkış (opt-out) talep etmiş"), and the follow-up engine's stop states
  halt any pending follow-up.
- Or set `status` to **`closed`** (also `replied`, `bounced`, `blocked`) → these
  are non-sendable statuses, so no new cold email is generated and follow-ups
  stop.

This stops **that lead**, but unlike Option A it does **not** prevent the same
business from being re-discovered and re-promoted later. For a permanent block,
prefer Option A.

### Option C — reply-driven

If the business itself replies "no thanks" / "beni listeden çıkarın", let the
pipeline handle it: `outreach:inbox` (or a manual row in `replies.csv`) plus
`outreach:optout` will suppress and close it automatically.

---

## 6. Who is eligible to be contacted (validation rules)

Suppression is only half of compliance; the other half is only ever contacting a
legitimate B2B target. The validator (`src/lead-validator.ts`) enforces this. A
lead is contactable **only if all** of the following hold:

- **Business identity present** — a `business_name`, and at least one channel
  (`website`, `instagram`, or `google_maps_url`), and a sector
  (`industry` or `business_type`).
- **B2B, business email only** — the email must be a valid format and be a
  business address. Free consumer providers (gmail, hotmail, outlook, yahoo,
  icloud, yandex, proton, …) are rejected **unless** the address's domain matches
  the lead's own website domain (clear evidence it is the real business contact).
  Enrichment **never guesses** an email — if no business email is found, the lead
  is not promoted at all.
- **Not already opted out** — a `reply_status` of `opt_out` is an immediate fail.
- **No recent re-contact** — a lead contacted within the last **14 days** is not
  re-contacted (`last_contacted_at` guard), which prevents accidental repeat
  emailing.
- **Sendable status** — leads already in `blocked`, `replied`, `bounced`,
  `closed`, `sent`, `followup_1_sent`, or `followup_2_sent` are not re-sent a
  fresh cold email.

Only when validation passes does the lead move on to scoring, offer selection,
generation, quality (≥ 90), and spam checks — each of which can still stop it.

---

## 7. KVKK / GDPR stance (B2B)

Vesper Outreach OS is designed for **business-to-business** outreach: it contacts
businesses at their published business contact addresses about a professional
service. Under both KVKK (Turkey's Kişisel Verilerin Korunması Kanunu) and the
GDPR, B2B outreach to a company's business contact can rely on a legitimate-
interest basis, provided the outreach is transparent, proportionate, and easy to
stop. The product is built to satisfy exactly those conditions:

- **Honest identity.** Every email is sent from Vesper's real Gmail identity, with
  a genuine, specific reason for contact (a concrete observed problem plus one of
  the seven offers). No spoofing, no fake senders, no deceptive subject lines —
  the spam checker and quality reviewer actively guard against misleading content.
- **A clear opt-out in every message.** The mandatory
  "Uygun değilse sorun değil, bir daha rahatsız etmeyeyim." line means the
  recipient can decline with a one-line reply, and that decline is honored
  permanently and automatically.
- **Opt-outs are honored immediately and forever.** Once suppressed, a business
  is blocked at the email, domain, and name level across every command — there is
  no way to email it again without a human deliberately removing its
  do-not-contact rows.
- **B2B targeting only.** The validator rejects consumer mailboxes and requires a
  real business identity, keeping the system away from personal/consumer contacts.
- **Full logs.** Every send (`sent-log.csv`), follow-up (`followups.csv`), reply
  classification (`reply-classifications.csv`), suppression
  (`do-not-contact.csv`), and reputation snapshot (`domain-reputation-log.csv`) is
  recorded with timestamps, giving a complete, auditable trail of who was
  contacted, when, why, and how they responded.
- **Data minimization & PII handling.** The repository is public, so all runtime
  lead data and everything under `generated/` is **git-ignored** (PII never enters
  version control); only the tracked config files (`campaigns.csv`,
  `lead-sources.csv`) are committed.
- **Data controller.** The owner, **Cenk Emir Bat (brand "Vesper")**, is the data
  controller responsible for this outreach and for handling any access/erasure
  request. To action an erasure request, remove the business's rows from the
  runtime data files and add a `do-not-contact` entry so it is not re-collected.

> This document describes how the software is built to support compliant B2B
> outreach. It is not legal advice; the data controller remains responsible for
> confirming the appropriate lawful basis and obligations for their jurisdiction
> and their specific list.

---

## 8. Quick reference

| I want to… | Do this |
| --- | --- |
| Permanently block a company | Add a `domain` row (and/or `email` row) to `data/do-not-contact.csv`. |
| Block a single mailbox | Add an `email` row to `data/do-not-contact.csv`. |
| Block by name only | Add a `business` row to `data/do-not-contact.csv`. |
| Turn "no" replies into suppressions | `npm run outreach:optout` (and/or `npm run outreach:inbox`). |
| Stop one lead without a global block | Set its `status=closed` or `reply_status=opt_out` in `leads.csv`. |
| Confirm the opt-out line | It is `config.optOutLine` and appears in every generated email + follow-up. |
| See who was contacted | `data/sent-log.csv`, `data/followups.csv`, `data/reply-classifications.csv`. |
