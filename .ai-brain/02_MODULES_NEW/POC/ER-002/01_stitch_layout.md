<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Stitch 3-Column Trauma Station (Dark Mode, High Contrast)

`
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP: Patient Header (sticky) + Tier 1 BANNER (red, pulsing) + Timers         │
│      Door→Trauma Team: 8 min ● Door→OR: 14 min (target <15)                  │
├────────────┬────────────────────────────────────────────────┬────────────────┤
│ LEFT       │                CENTER                          │   RIGHT        │
│            │  (ATLS A/B/C/D/E Stepper + Timers)            │                │
│ Patient    │  ┌──────────────────────────────────────────┐  │ Vitals         │
│ ─────      │  │ A: Airway + C-spine ✓                    │  │ ─────          │
│ Age 28 M   │  │ B: Breathing ✓                            │  │ HR 130         │
│ MVC        │  │ C: Circulation ⚠ (MTP ACTIVE)            │  │ BP 78/40       │
│ ejection   │  │ D: Disability ✓ GCS 13                    │  │ SpO2 94%       │
│            │  │ E: Exposure ✓                             │  │ RR 28          │
│ Mechanism  │  ├──────────────────────────────────────────┤  │                │
│ ─────      │  │ Active Step: Resuscitation               │  │ GCS Trend      │
│ MVC eject. │  │ Lactate 5.2 (trending ↓)                 │  │ ─────          │
| Belted     │  │ FAST: + (peritoneal fluid)                │  │ 13 → 13 (stable)│
│ Driver     │  │ Plan: OR for damage control lap           │  │                │
│ Speed ~80  │  │ ETA: 12 min                                │  │ Labs           │
│ km/h       │  ├──────────────────────────────────────────┤  │ ─────          │
│            │  │ DICOM Viewer (FAST, CXR)                  │  │ Hb 9.8         │
│ Allergies  │  │ [Compare Prior]                           │  │ Hct 29         │
│ NKDA       │  └──────────────────────────────────────────┘  │ Lactate 5.2    │
│            │                                                  │ ↓ 7.2          │
│ PMH        │  AI Insight:                                    │                │
│ None       │  ""Patient is Tier 1, MTP active.              │ MTP Status     │
│            │   Recommend damage control lap (FAST+,          │ ─────          │
│ Score Calc │    lactate 5.2, SBP 78).                        │ Active: 23 min │
│ ─────      │   Evidence: ATLS 10e + PROPPR 2015.""          │ Cooler #2      │
│ ISS 28     │                                                  │ PRBC 6/6       │
│ (high)     │  [Log Event] [Order Product] [OR Booking]        │ FFP 6/6        │
│ TRISS Ps   │                                                  │ Plts 1/1       │
│ 0.78       │                                                  │ Cryo 10/10     │
│ ABC 4      │                                                  │ Ratio 1:1:1 ✓  │
│ MTP yes    │                                                  │                │
│            │                                                  │ Consultants    │
│ [Activate  │                                                  │ ─────          │
│ MTP]       │                                                  │ Ortho paged    │
│ [OR Book]  │                                                  │ (ETA 5 min)    │
│            │                                                  │                │
└────────────┴────────────────────────────────────────────────┴────────────────┘
`

Tokens: Primary #0066CC, danger #DC3545, critical #DC3545, success #28A745.
Dark mode, high contrast, WCAG 2.2 AA.

---
*Section 08 of ER-002. PM voice. L1 DRAFT.*