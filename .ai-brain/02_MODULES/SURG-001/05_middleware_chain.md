# SURG-001 — Middleware Chain

## Layered Security
```js
// 1. requireAuth
// 2. requireTenantScope
// 3. requireRole
// 4. validateBody
// 5. idempotencyGuard (OR booking)
// 6. auditMiddleware (every procedure, complication, OR time)
```

## Surgery Roles
- `attending_surgeon` — full access
- `fellow_surgery` — limited
- `resident_surgery` — limited (with supervision)
- `scrub_nurse` — OR support
- `circulating_nurse` — OR support
- `or_scheduler` — booking
- `anesthesiologist` — anesthesia
- `crna` (nurse anesthetist) — anesthesia
- `admin` — read-only

## Pre-Op Time-Out
- **Sign-in** (before anesthesia): patient ID, procedure, site, consent
- **Time-out** (immediately before incision): team intro, procedure, site, antibiotic given
- **Sign-out** (before leaving OR): procedure, counts, specimens, plan

## WHO Checklist (3-Phase)
```js
const checkSignIn = (patient) => ({
  patientId: patient.id,
  procedure: patient.procedure,
  site: patient.site,
  consent: patient.consent,
  siteMarked: patient.siteMarked,
  anesthesiaPlan: patient.anesthesiaPlan,
  pulseOx: true
});
```

## Antibiotic Guard
- **If scheduledAt + 60 min passed and not given → ALERT**
- **If given > 60 min before incision → ALERT**
- **If high-risk surgery (cardiac, implant) → re-dose if > 3h**

## VTE Prophylaxis Guard
- **Caprini score** calculated automatically
- **Score ≥ 5** → pharmacologic + mechanical
- **Score 3-4** → pharmacologic
- **Score 0-2** → early ambulation

## Surgical Site Marking
- Required for: bilateral, paired organs, laterality, digits, levels
- Marked by: operating surgeon
- Method: permanent marker
- Verification: time-out

## Counts
- Sponges, instruments, sharps
- Initial count + final count
- If discrepancy → re-count, image if needed
- Documented in intraop record

## Idempotency
- OR booking (cannot double-book)
- Procedure (cannot duplicate)
- Complication (can be added)

## Tenant Isolation
- Per AGENTS.md §2.2
- Multi-tenant, single DB
- Each tenant's OR schedule separate

## Audit
- Every procedure
- Every complication (Clavien-Dindo)
- Every OR time (start, end, time-out)
- Every specimen
- Every implant
