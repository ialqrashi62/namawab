<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Data Flow

`
Arrival → Triage (ESI 1-5) → Tier 1/2/3 activation (if criteria)
→ Trauma bay → ATLS primary survey (10 min) → MTP trigger check
→ Imaging (FAST, CXR, CT) → Resus → OR (if needed)
→ ICU (TICU) → Floor → Discharge
→ Registry entry (NTDB) → PI case (if deviation)
`

## Key RLS: tenant_id on all 14 tables
## Key Audit: activation.triggered, mtp.activated, mtp.terminated, transfusion.completed, or.available, transfer.out, pi.case.opened, pi.loop.closed