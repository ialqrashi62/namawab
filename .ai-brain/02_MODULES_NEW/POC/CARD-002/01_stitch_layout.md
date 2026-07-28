<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Stitch 3-Column Station (Layout C)

`
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP: Patient Header (sticky, encrypted MRN)                                  │
│      D2B Timer: 47 min ● OPTIMAL  (target ≤90 min)                           │
│      Red flag banner: NONE                                                   │
├────────────┬────────────────────────────────────────────────┬────────────────┤
│ LEFT       │                CENTER                          │   RIGHT        │
│            │  (Procedure Timeline + Imaging)                │                │
│ Patient    │  ┌──────────────────────────────────────────┐  │ Vitals         │
│ ─────      │  │ 14:32 Door  | 14:35 ECG (STEMI)         │  │ ─────          │
│ Name ***   │  │ 14:42 Cath Lab Accept                    │  │ HR 78          │
│ Age 58 M   │  │ 14:50 Wire  | 14:52 Balloon 1st          │  │ BP 132/78      │
│ MRN ***    │  │ Time: 47 min (optimal)                   │  │ SpO2 98%       │
│            │  ├──────────────────────────────────────────┤  │                │
│ Allergies  │  │ Active Step: Stent Deployment            │  │ ACT            │
│ PCN (rash) │  │ Vessel: LAD mid | Stenosis: 99%→0%       │  │ ─────          │
│            │  │ DES 3.0×18 @ 14 atm                      │  │ 280s ●         │
│ PMH        │  │ Pre-TIMI 2 → Post-TIMI 3                 │  │ Target 250-300 │
│ HTN, T2DM  │  ├──────────────────────────────────────────┤  │                │
│ CKD-3      │  │ Hemodynamics:                             │  │ Anticoag       │
│            │  │  ────── Ao ── 142/82 (88)                 │  │ ─────          │
│ Prior Cath │  │  ──── LV ── 128/12                       │  │ UFH bolus:     │
│ 2023: 1-DES│  │  ── PA ── 30/14 (22)                     │  │ 7,000U 14:42   │
│ RCA        │  │  ─ PCW ── 14 mmHg                        │  │ Next ACT: 14:55│
│            │  │  ─ CO ── 5.8 L/min (Fick)                │  │                │
│ [View Old] │  ├──────────────────────────────────────────┤  │ Medication     │
│            │  │ DICOM Viewer (DSA, zoom, W/L, compare)   │  │ ─────          │
│ Score Calc │  │ [Cine: ●●●○○] [Compare Prior]            │  │ ASA 325 ✓      │
│ ─────      │  └──────────────────────────────────────────┘  │ Ticagrelor     │
│ SYNTAX 11  │                                                  │ 180 ✓          │
│ GRACE 142  │  AI Insight:                                    │ Bivalirudin    │
│ TIMI 3     │  ""High calcification in proximal LAD.         │ gtt running    │
│ DAPT 24    │   Consider rotational atherectomy.            │                │
│ CIN risk   │   Evidence: SCAI 2023 consensus.""            │ Red Flags      │
│ Low (eGFR 67)│                                                │ ─────          │
│            │  [← Prev] [Next →] [Complete Procedure]       │ None           │
└────────────┴────────────────────────────────────────────────┴────────────────┘
`

Tokens: Primary #0066CC, danger #DC3545, critical_value #DC3545.
RTL: AR primary, EN secondary. WCAG 2.2 AA.

---
*Section 08 of CARD-002. PM voice. L1 DRAFT.*