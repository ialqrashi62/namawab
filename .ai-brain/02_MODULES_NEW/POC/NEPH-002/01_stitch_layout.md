<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Stitch 3-Column Station (Transplant)

`
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP: Patient Header (sticky) + Days Post-Tx + Alert flags                   │
├────────────┬────────────────────────────────────────────────┬────────────────┤
│ LEFT       │                CENTER                          │   RIGHT        │
│            │  (Workflow: Waitlist → Eval → Tx → Follow-up) │                │
│ Donor      │  ┌──────────────────────────────────────────┐  │ Graft Function │
│ ─────      │  │ Step 3 of 5: Post-Transplant Day 7      │  │ ─────          │
│ Type: LRD  │  │ Disposition: Discharge                  │  │ Cr 1.4         │
│ Age 42 F   │  │ IS: Tac 2mg BID, MMF 1g BID, Pred 5mg  │  │ eGFR 56        │
│ KDPI 18%   │  │ Plan: Clinic Day 14                      │  │                │
│ HLA MM 2/6 │  ├──────────────────────────────────────────┤  │ IS Levels      │
│ XM NEG     │  │ Active Step Content:                    │  │ ─────          │
│            │  │ Disposition checklist + education log    │  │ Tac trough 8.5 │
│ Recipient  │  │ [← Prev] [Save] [Next →]                 │  │ ✓ Target 5-10  │
│ ─────      │  └──────────────────────────────────────────┘  │ MMF dose 1g    │
│ Age 38 M   │                                                  │ BID            │
│ ESRD 4y    │  AI Insight:                                    │                │
│ cPRA 5%    │  ""BK PCR trending up (1.2K → 4.5K over    │  │ Surveillance   │
│ EPTS 23    │   3 months). Consider biopsy + reduce MMF.    │  │ ─────          │
│ Blood: A+  │   Evidence: KDIGO BK nephropathy 2020.""     │  │ BK PCR 4.5K   │
│            │                                                  │ ↑ (alert)      │
│ Score Calc │                                                  │ CMV PCR neg    │
│ ─────      │                                                  │ DSA neg        │
│ KDPI 18%   │                                                  │                │
│ EPTS 23    │                                                  │ Red Flags      │
│ MM 2/6     │                                                  │ ─────          │
│ Match: OK  │                                                  │ None           │
│ (proceed)  │                                                  │                │
│            │                                                  │                │
│ [Paired Ex]│                                                  │                │
└────────────┴────────────────────────────────────────────────┴────────────────┘
`

Tokens: Primary #0066CC, success #28A745, critical_value #DC3545.
RTL: AR primary, EN secondary. WCAG 2.2 AA.

---
*Section 08 of NEPH-002. PM voice. L1 DRAFT.*