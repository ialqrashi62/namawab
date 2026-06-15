# NamaMedical — Department One-Pagers (catalog)

> Compact "what-it-does" sheet per department for sales kits and partner conversations.

---

## Cardiology
**Solves**: STEMI delays, anticoag dosing errors, heart-failure re-admissions.
**Features**: AI ECG STEMI flag, HEART/GRACE/CHA2DS2/HAS-BLED calculators with renal-aware DOAC selector, integrated cath lab scheduler, HF program tracker with GDMT prompts, device registry with battery alerts.
**Integrates with**: Cardiac PACS, Lab (troponin/BNP), Pharmacy (anticoag).
**KPI moves**: Door-to-Balloon ↓, HF readmit ↓, anticoag adherence ↑.

## Emergency Department
**Solves**: missed time-critical conditions, alert fatigue, board chaos.
**Features**: AI CTAS triage, Code STEMI/Stroke/Sepsis/Trauma activation, 1-hour bundle countdown, live TV board, SBAR handover composer.
**Integrates with**: Cardiology, Stroke unit, ICU, Blood bank, Shahm.
**KPI moves**: D2B ↓, D2N ↓, Sepsis bundle ↑, LOS ↓.

## ICU
**Solves**: vent-injury, missed daily goals, sedation drift, slow extubation.
**Features**: ARDSnet vent settings, FAST-HUG-BID daily goals, RASS sedation pad, drip titration board, APACHE-II/SOFA streams, handover SBAR.
**KPI moves**: VAP ↓, ventilator days ↓, mortality risk-adjusted ↓.

## Lab
**Solves**: missed critical values, slow turnaround, antibiogram drift.
**Features**: structured result entry with delta checks, critical-value call-back workflow with read-back, microbiology cultures with sensitivities feeding antibiogram, genetics ACMG, blood-bank crossmatch.
**KPI moves**: critical-call SLA 100%, TAT ↓, transfusion errors → 0.

## Radiology
**Solves**: inappropriate imaging, contrast AKI, dose creep.
**Features**: ACR Appropriateness gate at order, contrast safety check, AI overlays for CXR/CT-stroke/MRI, dose dashboard, structured reports.
**Integrates with**: existing PACS (NNCH/Cardiac/BADER).
**KPI moves**: appropriate imaging ↑, AKI events ↓, dose per-study ↓.

## OB-GYN + IVF
**Solves**: preeclampsia missed, IVF cycle errors, cryostore mishaps.
**Features**: ANC card with preeclampsia screening, partograph, CS log, IVF cycle planner, embryo registry, cryostore inventory + consent tracking.
**KPI moves**: severe maternal morbidity ↓, IVF live-birth-rate visibility ↑.

## Neonatal & Pediatrics
**Solves**: weight-based dose errors, vaccine schedule gaps.
**Features**: NICU bed map, vent/CPAP charts, bilirubin nomogram plotter, weight-based dose guard (mandatory), KSA NICVD vaccine sync, growth chart WHO.
**KPI moves**: med errors → 0 in peds, vaccine compliance ↑.

## Hemato-Oncology + BMT
**Solves**: chemo dose errors, anthracycline cardiotoxicity, FN delays.
**Features**: regimen library (NCCN), 3-pane sign-off (doctor/pharm/nurse), cumulative anthracycline gauge, BMT day +N tracker, tumor board worklist, FN 1h pathway.
**KPI moves**: chemo errors → 0, FN antibiotic-within-1h ↑, anthracycline-related cardiotoxicity ↓.

## Pharmacy
**Solves**: dispense errors, cold-chain breach, stewardship drift.
**Features**: USP <797>/<800> compounding logs with QA double-check, antimicrobial stewardship gates, TDM tracker, ZATCA-compliant dispense receipts.
**KPI moves**: stewardship compliance ↑, dispense errors ↓.

## Nursing
**Solves**: med admin errors, fall/pressure injury, late handover.
**Features**: NANDA care plans, observations chart with NEWS2, 5-rights barcode admin, Braden/Morse risk auto-bundles, SBAR handover composer.
**KPI moves**: HAPI ↓, falls ↓, med admin errors ↓.

## Quality & Accreditation
**Solves**: survey unreadiness, sentinel-event repeat, slow CAPA.
**Features**: CBAHI evidence index, OVR with auto-RCA-2 templates, CAPA tracker with SLA, privileging dashboard with expiry alerts, risk register heatmap.
**KPI moves**: survey gaps ↓, CAPA on-time ↑, sentinel events ↓ year-over-year.

## (similar one-pagers exist for all 40 groups — generated from `groups/{NN}_*.md`)

---

## How to use these
- Print double-sided and bring to facility tours.
- Embed in PowerPoint for executive pitches.
- Translate to AR via [i18n/](../i18n/) per facility branding.
