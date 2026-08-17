# PHARMACY — Business Scenarios & Data Flows

## Scenario 1: Inpatient Antibiotic Order (Vancomycin)

```
[Provider chart] → CPOE → Search "vancomycin" → Dose 1000mg IV q12h
   ↓
DDI Engine:
  - Allergy: NKDA ✓
  - Renal: CrCl 65 ml/min → dose 1000mg q12h OK ✓
  - Active meds: no interaction ✓
  - Duplicate: no duplicate ✓
   ↓
[Provider signs order] → timestamp + signature
   ↓
pharma_rx_order.status: PENDING_VERIFICATION
   ↓
[Pharmacy queue] → Pharmacist opens order
   ↓
DDI: pharmacist double-checks with renal module
   ↓
pharma_rx_order.status: VERIFIED
   ↓
[Dispense workbench] → Select 2 vials 1g, dilute 250mL NS, label
   ↓
pharma_rx_dispense: 2 units, lot, expiry
   ↓
[IV room USP 797 check] → technician scans, 1st + 2nd check
   ↓
pharma_iv_admixture: prepared
   ↓
[Delivered to unit] → Nurse hangs
   ↓
[MAR] → administration timestamp, site, IV pump rate
   ↓
[Monitor] → trough level at dose 4, adjust if needed
   ↓
[Discontinue] → after 7 days, stop
```

## Scenario 2: DDI Alert — Warfarin + Aspirin

```
[Provider orders] warfarin 5mg PO daily for AFib
   ↓
[Provider orders] aspirin 81mg PO daily for CAD
   ↓
DDI Engine:
  - Severity: MAJOR (bleeding risk)
  - Recommendation: monitor INR closely OR aspirin for primary prevention only
   ↓
[Provider must acknowledge OR modify]
   ↓
Override with reason
   ↓
pharma_ddi_event: severity=MAJOR, override=true, reason="INR monitoring"
   ↓
[Pharmacy sees] → highlighted for review
   ↓
Order proceeds
```

## Scenario 3: Controlled Substance (Morphine PCA)

```
[Provider orders] morphine PCA 1mg/mL, basal 1mg/h, bolus 1mg q15min lockout
   ↓
[Presh orders to CS vault queue]
   ↓
[Two-pharmacist check] → scan badge + biometric
   ↓
[Both sign] → 1st and 2nd pharmacist
   ↓
pharma_controlled_substance_log: dispensed
   ↓
[Delivered to unit with] tamper-evident seal
   ↓
[Nurse opens] → scans seal, checks intact
   ↓
[MAR] administration log
   ↓
[Wastage] discarded amount logged
   ↓
[End of shift] CS count audit
```

## Scenario 4: IV Chemotherapy (Cisplatin)

```
[Oncologist orders] cisplatin 75mg/m² IV
   ↓
Patient BSA: 1.8m² → Total dose: 135mg
   ↓
[Pharmacy verification] → IV chemotherapy safety check
   ↓
- Pre-meds: antiemetic scheduled
- Hydration: 1L NS pre
- Renal: CrCl check
- Hearing: baseline audiogram
   ↓
[IV room USP 800] → chemo compounding in BSC
   ↓
pharma_iv_admixture: cytotoxic, BSC-1, 2-pharmacist check
   ↓
[Chemo label] ZPL with patient + drug + dose + rate
   ↓
[Delivered to infusion center]
   ↓
[Administered] with safety check (5 rights)
   ↓
[Monitoring] renal function, hearing
   ↓
[Discontinue] after 3 cycles
```

## Data Flow Diagram

```
┌──────────────┐
│   Provider   │
│   (CPOE)     │
└──────┬───────┘
       │ POST /api/pharma_order/rx_order_create
       ▼
┌──────────────┐
│ pharma_rx_   │ ←  tenant_id (RLS)
│   order      │
└──────┬───────┘
       │ status=PENDING_VERIFICATION
       ▼
┌──────────────┐
│ DDI Engine   │ ← 5 engines: interaction, allergy, dose, renal, peds
│  (101)       │
└──────┬───────┘
       │ alert? → override | no_alert
       ▼
┌──────────────┐
│  Pharmacy    │
│  Queue       │
└──────┬───────┘
       │ pharmacist verifies
       ▼
┌──────────────┐
│ Dispense     │  ←  unit-dose | IV bag | syringe | topical
│  (102)       │
└──────┬───────┘
       │ if IV:
       ▼
┌──────────────┐
│ IV Room      │  ←  USP 797 | USP 800
│  (103)       │
└──────┬───────┘
       │ dispense complete
       ▼
┌──────────────┐
│ MAR          │  ←  nurse administers
│  (existing)  │
└──────┬───────┘
       │ dose done
       ▼
┌──────────────┐
│ Reconcile    │  ←  on transfer/discharge
│  (104)       │
└──────────────┘
```
