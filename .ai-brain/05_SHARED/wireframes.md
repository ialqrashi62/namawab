# نماذج التصميم (Wireframes) — NamaMedical
# Filepath: .ai-brain/05_SHARED/wireframes.md
# Generated: 2026-08-08

# Wireframes — Stitch-inspired (60 Departments)

> **Pattern:** 2-column layout (sidebar + main)
> **Variations:** Per-department widgets (vital trends, lab results, dose calculator, etc.)

---

## 1. Station Shell (60 depts)

```
┌──────────────────────────────────────────────────────────────┐
│ [NamaMedical] 🏥  [EN|AR]  [Search...]   [🔔]  [👤 Dr. Ali] │
├──────────────────────────────────────────────────────────────┤
│ SIDEBAR (260px)               │ MAIN AREA (flex-1)             │
│ ┌─────────────────────────┐  │ ┌───────────────────────────┐  │
│ │ Patient Card            │  │ │ Tabs: Overview|Orders|     │  │
│ │ ┌───┐                  │  │ │       Results|Notes         │  │
│ │ │SA │ Salem Ahmed      │  │ ├───────────────────────────┤  │
│ │ └───┘ MRN: 100045      │  │ │ Vitals Panel              │  │
│ │       45y · M · O+     │  │ │ HR  BP  SpO₂  RR  Temp    │  │
│ │       DM-T2 · HTN      │  │ │ 72  120/80 98  16  37     │  │
│ │       ⚠ Penicillin     │  │ ├───────────────────────────┤  │
│ │       ⚠ Shellfish      │  │ │ Risk Stratifier           │  │
│ └─────────────────────────┘  │ │ NEWS2: 2 (LOW)           │  │
│ ┌─────────────────────────┐  │ ├───────────────────────────┤  │
│ │ Risk Stratifier         │  │ │ Active Orders (3)        │  │
│ │ Score: 2               │  │ │ - CBC [pending]          │  │
│ │ Level: LOW             │  │ │ - CMP [pending]          │  │
│ │ Recommendation:        │  │ │ - Lipid [completed]      │  │
│ │   Routine monitoring   │  │ ├───────────────────────────┤  │
│ └─────────────────────────┘  │ │ Recent Notes (1)         │  │
│ ┌─────────────────────────┐  │ │ "S/O: patient presents..." │  │
│ │ AI Assistant �        │  │ ├───────────────────────────┤  │
│ │ Ask question...        │  │ │ AI Diagnosis              │  │
│ │ [Send]                 │  │ │ [Type question...]        │  │
│ └─────────────────────────┘  │ │ [Get AI suggestion]      │  │
│                              │ └───────────────────────────┘  │
│ Nav:                         │                                  │
│ - Overview                   │                                  │
│ - Orders (3)                 │                                  │
│ - Results                    │                                  │
│ - Notes                      │                                  │
│ - History                    │                                  │
│ - Discharge                  │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

---

## 2. Department-Specific Widgets

### 2.1 Cardiology — ECG Viewer
```
┌────────────────────────────┐
│ ECG (12-lead)               │
│ ┌────────────────────────┐ │
│ │ ╱╲    ╱╲    ╱╲        │ │
│ │╱  ╲  ╱  ╲  ╱  ╲  ...   │ │
│ │    ╲╱    ╲╱    ╲╱     │ │
│ └────────────────────────┘ │
│ HR: 72  PR: 160  QRS: 88  │
│ Interpretation: NSR         │
│ ⚠ ST elevation in II,III  │
│ [Order Troponin] [View All] │
└────────────────────────────┘
```

### 2.2 Cardiology — Cath Lab Booking
```
┌────────────────────────────┐
│ Cath Lab Schedule           │
│ Date: [2026-08-08] ▼       │
│ Slot: [09:00-11:00] ▼      │
│ Procedure: [PCI] ▼        │
│ Indication: ACS            │
│ Surgeon: [Dr. Sarah Chen]  │
│ Patient Consent: ✓ Signed  │
│ Labs: ✓ Cleared            │
│ [Book Slot]                │
└────────────────────────────┘
```

### 2.3 Oncology — Chemo Regimen
```
┌────────────────────────────�
│ Chemo Regimen: R-CHOP       │
│ Cycle: 3 of 6              │
│ Day: 1                     │
│ ────────────────────────── │
│ Drug       Dose    Route   │
│ Rituximab  375mg/m² IV    │
│ Cyclophos  750mg/m² IV    │
│ Vincristin  1.4mg/m² IV   │
│ Prednisone 100mg    PO    │
│ ────────────────────────── │
│ Pre-meds: ✓ Given          │
│ Labs: ✓ ANC > 1500         │
│ [Start Infusion]           │
└────────────────────────────┘
```

### 2.4 ICU — Vitals + Scoring
```
┌────────────────────────────┐
│ SOFA Score: 8 (HIGH)       │
│ ────────────────────────── │
│ PaO₂/FiO₂:    200 (1)     │
│ Platelets:    80K  (2)     │
│ Bilirubin:    1.5 (0)     │
│ MAP:          70    (1)    │
│ GCS:          12    (2)    │
│ Creatinine:   1.8 (2)     │
│ ────────────────────────── │
│ Trend (24h):                │
│ ┌────────────────────────┐ │
│ │ ╱╲�╲╱╲╱╲╱╲╱╲�╲      │ │
│ └────────────────────────┘ │
│ [Trend Chart] [Order Labs] │
└────────────────────────────┘
```

### 2.5 Pharmacy — Dispense + BCMA
```
┌────────────────────────────┐
│ Dispense Medication         │
│ ────────────────────────── │
│ [Scan Patient Barcode]     │
│ MRN: 100045 ✓              │
│ Name: Salem Ahmed ✓        │
│ ────────────────────────── │
│ [Scan Medication Barcode]  │
│ Rx: Amoxicillin 500mg TID  │
│ ✓ Match                    │
│ ────────────────────────── │
│ Dose: 1 tab PO TID         │
│ Quantity: 21 tabs          │
│ [Dispense]                 │
└────────────────────────────┘
```

### 2.6 Lab — Results Viewer
```
┌────────────────────────────┐
│ CBC (Complete Blood Count) │
│ Result Date: 2026-08-08    │
│ ────────────────────────── │
│ Analyte     Result   Flag  │
│ WBC         7.2      N    │
│ RBC         4.8      N    │
│ Hgb         14.5     N    │
│ Hct         42%      N    │
│ MCV         88       N    │
│ MCH         30       N    │
│ Platelets   250      N    │
│ ────────────────────────── │
│ [Trend] [Compare] [Print] │
└────────────────────────────┘
```

### 2.7 Radiology — Image Viewer
```
┌────────────────────────────┐
│ Chest X-ray (PA)          │
│ Study Date: 2026-08-08    │
│ ────────────────────────── │
│ ┌────────────────────────┐ │
│ │                        │ │
│ │     [Chest X-ray]      │ │
│ │                        │ │
│ └────────────────────────┘ │
│ Tools: Pan | Zoom | W/L    │
│ Report:                    │
│ [AI auto-draft] [Edit]    │
│ Status: □ Unsigned        │
│ [Sign Report]              │
└────────────────────────────┘
```

### 2.8 ER — Triage
```
┌────────────────────────────┐
│ ESI Triage                 │
│ ────────────────────────── │
│ Chief Complaint:           │
│ [Chest pain × 2 hours]    │
│ ────────────────────────── │
│ Vital Signs:                │
│ HR: 110 (↑)               │
│ BP: 90/60 (↓)             │
│ RR: 24 (↑)                │
│ SpO₂: 94% (↓)            │
│ Pain: 8/10                │
│ ────────────────────────── │
│ ESI Level: 2              │
│ ⚠ HIGH RISK               │
│ [Activate STEMI Pathway]  │
└────────────────────────────┘
```

### 2.9 OB/GYN — Partogram
```
┌────────────────────────────┐
│ Partogram — Active Labor  │
│ ────────────────────────── │
│ Time →   0  2  4  6  8   │
│ Cervix   3  5  7  8  9   │
│ Dilat.   ╱─────╱──────     │
│ Station  -2 -1  0  +1 +2  │
│ FHR      ──────────       │
│ Contractions: 3/10 min    │
│ ────────────────────────── │
│ Alert: 2nd stage > 2h      │
│ [Consider Instrumental]   │
└────────────────────────────┘
```

### 2.10 Surgery — Pre-op Checklist
```
┌────────────────────────────�
│ WHO Surgical Safety        │
│ ────────────────────────── │
│ ☑ Patient ID confirmed    │
│ ☑ Site marked             │
│ ☑ Procedure verified      │
│ ☑ Consent signed          │
│ ☑ Anesthesia check        │
│ ☑ Allergies reviewed      │
│ ☑ Antibiotic prophylaxis  │
│ ────────────────────────── │
│ Team:                       │
│ - Surgeon: Dr. Smith      │
│ - Anesth: Dr. Jones       │
│ - Nurse: Sara              │
│ [Time Out Complete]        │
└────────────────────────────┘
```

### 2.11 Pediatrics — Growth Chart
```
┌────────────────────────────┐
│ Growth Chart (Age 5)       │
│ ────────────────────────── │
│ Weight: 18 kg (50th %)    │
│ Height: 110 cm (75th %)   │
│ BMI: 14.9 (60th %)        │
│ Head: 51 cm (50th %)      │
│ ────────────────────────── │
│ [Weight Chart]             │
│ ┌────────────────────────┐ │
│ │   ╱─────●              │ │
│ │  ╱                   │ │
│ └────────────────────────┘ │
│ [Vaccinations Up-to-Date]  │
└────────────────────────────┘
```

### 2.12 Mental Health — PHQ-9
```
┌────────────────────────────┐
│ PHQ-9 Depression Screening│
│ ────────────────────────── │
│ Q1: Little interest       │
│ 0 1 2 ●3                  │
│ Q2: Feeling down          │
│ 0 ●1 2 3                  │
│ ...                       │
│ ────────────────────────── │
│ Total Score: 12           │
│ Severity: MODERATE        │
│ Recommendation:           │
│ - Consider therapy        │
│ - Re-screen in 2 weeks    │
└────────────────────────────┘
```

### 2.13 Rehabilitation — Barthel Index
```
┌────────────────────────────┐
│ Barthel Index              │
│ ────────────────────────── │
│ Feeding:    10/10 ✓       │
│ Bathing:    5/5   ✓       │
│ Grooming:   5/5   ✓       │
│ Toilet:     10/10 ✓       │
│ Stairs:     5/10 (partial)│
│ ────────────────────────── │
│ Total: 90/100              │
│ Independence: MODIFIED    │
│ [Plan Rehab Session]      │
└────────────────────────────┘
```

### 2.14 Billing — Invoice
```
┌────────────────────────────┐
│ Invoice #INV-2026-0042     │
│ ────────────────────────── │
│ Patient: Salem Ahmed      │
│ Encounter: OP-100045      │
│ ────────────────────────── │
│ Service          Qty  Amt │
│ Consultation     1   200  │
│ ECG              1   150  │
│ CBC              1   80   │
│ ────────────────────────── │
│ Subtotal:         430 SAR │
│ VAT 15%:          64.50   │
│ Total:            494.50  │
│ ────────────────────────── │
│ Insurance: ABC (80%)      │
│ Patient owes:    98.90   │
│ [Submit NPHIES] [Print]   │
└────────────────────────────┘
```

---

## 3. Modal Patterns

### 3.1 Confirmation Modal
```
┌────────────────────────────────┐
│ � Confirm Action               │
│ ────────────────────────────── │
│ Are you sure you want to      │
│ delete this encounter?         │
│                                │
│ This action cannot be undone.  │
│                                │
│         [Cancel] [Delete]       │
└────────────────────────────────┘
```

### 3.2 AI Diagnosis Result Modal
```
┌────────────────────────────────────────┐
│ 🤖 AI Diagnosis — Cardiology           │
│ ────────────────────────────────────── │
│ Patient: Salem Ahmed (MRN 100045)      │
│ Question: "What is treatment for ACS?" │
│ ────────────────────────────────────── │
│ Differential Diagnosis:                │
│ 1. STEMI (I21.0)        Probability: 85%│
│ 2. Unstable Angina (I20.0) Probability: 10%│
│ 3. Pericarditis (I30.0)  Probability: 5% │
│ ────────────────────────────────────── │
│ Recommended Workup:                    │
│ - Troponin I (STAT)                     │
│ - ECG (12-lead)                         │
│ - Cardiology consult                   │
│ ────────────────────────────────────── │
│ Sources:                                │
│ - ESC 2024 ACS Guidelines              │
│ - AHA/ACC 2023                          │
│ ────────────────────────────────────── │
│ ⚠ This is AI-assisted, not a diagnosis│
│        [Close] [Accept] [Override]      │
└────────────────────────────────────────┘
```

---

## 4. Navigation Patterns

### 4.1 Top Bar
- Brand logo (left)
- Search (center)
- Language toggle, notifications, user menu (right)

### 4.2 Sidebar (Department Picker)
- All 60 departments grouped (10 groups)
- Search/filter
- Recent stations
- Favorites

### 4.3 Breadcrumbs
```
Home > Cardiology > Patient 100045 > Encounter #1234
```

---

**Generated:** 2026-08-08 · **Total wireframes:** 60 stations + 14 dept-specific widgets + 2 modals
