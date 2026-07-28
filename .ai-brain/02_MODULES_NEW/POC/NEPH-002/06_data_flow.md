<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Data Flow

## Recipient Listing
`
Referral → Evaluation → MDT → Listing → Waitlist (cPRA, EPTS)
`

## Transplant Day
`
Crossmatch final → Pre-op → Induction IS (OR) → Anesthesia →
Vascular anastomosis → Reperfusion (UO within min) →
Ureteroneocystostomy + stent → Closure → PACU → ICU
`

## Post-Tx Follow-up
`
Discharge Day 7 → Day 14 clinic (Cr, trough) → Day 30 →
Day 60 → Day 90 → Day 180 → Day 365 → Yearly
Labs: Cr, eGFR, trough, BK/CMV PCR, DSA
Biopsy: protocol 3-6-12 mo (optional), for-cause any time
`

## Rejection Workup
`
↑Cr >25% → Biopsy (for-cause) → Pathology + C4d + SV40 + DSA →
Banff grade → Treatment per grade
`

## Key RLS Touchpoints
- Every table: tenant_id, RLS, FORCE RLS

## Key Audit Touchpoints
- transplant.waitlist.added
- transplant.crossmatch.performed
- transplant.procedure.completed
- transplant.immunosuppression.administered
- transplant.rejection.detected
- transplant.graft_loss
- transplant.biopsy.banff.graded

---
*Section 33 of NEPH-002. L1 DRAFT.*