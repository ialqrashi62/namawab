# NamaMedical Master Plan — Complete Hospital ERP Delivery
**Date**: 2026-08-17
**Status**: Active — Wave 14+
**Branch**: audit/phase-1a-critical-remediation
**Production**: jumanasoft.com (Hetzner 204.168.144.74)

---

## 0. Executive Summary

NamaMedical is a multi-tenant hospital ERP platform targeting Saudi Arabia (ZATCA/NPHIES/CBAHI/PDPL compliant). The codebase now contains **1,365+ mounted routes** across **455+ engines** with **679 tier tables** in PostgreSQL. This master plan identifies all major EMR/EHR sections, world-class systems reference, and remaining gaps to ship to full Epic/Cerner parity.

## 1. World-Class Systems Reference

| System | Vendor | Specialty | Key Modules Reference |
|---|---|---|---|
| **Epic** | Epic Systems | Enterprise EMR | Willow (Pharm), Cupid (Cardio), Beaker (Lab), Radiant (Rad), OpTime (OR), Stork (OB), ASAP (ED), Cadence (Sched), Grand Central (ADT), MyChart (Portal), Healthy Planet (PopHealth), Resolute (RCM), Cogito (BI) |
| **Cerner/Oracle Health** | Oracle | Enterprise EMR | PharmNet, RadNet, PathNet, CareAware, Millennium, RevElate, HealtheIntent, FirstNet |
| **MEDITECH** | Meditech | Mid-size EMR | Expanse, M-Health, MAGIC, NUR, OBS, ED, ORS, PCS |
| **athenahealth** | athena | Ambulatory | athenaClinicals, athenaCollector, athenaCommunicator |
| **Allscripts/Veradigm** | Allscripts | Enterprise | Sunrise, TouchWorks, Professional EHR |
| **NextGen** | NextGen | Ambulatory | NextGen Enterprise, Mirth |
| **eClinicalWorks** | eClinicalWorks | Ambulatory | V12, PRISMA |
| **PointClickCare** | PCC | Long-term Care | POC, LTC, Senior Living |
| **Net Health** | Net Health | Rehab/Wound | Optima, TherapyRehab |
| **OpenSpecimen** | Krishagni | Biobank | OpenSpecimen |
| **Mirth** | NextGen | Integration | Mirth Connect 4.5 |
| **ONC** | US Gov | Standards | USCDI v3, FHIR R4, C-CDA, SMART |

## 2. Sections Coverage Matrix (Current vs Target)

### 2.1 Clinical — Core
| Section | Status | Epic Ref | Priority |
|---|---|---|---|
| ADT/Registration | DONE | Grand Central | ✅ |
| Orders/Results | DONE | Order Entry | ✅ |
| Documentation | DONE (TIER12) | NoteWriter | ✅ |
| CPOE | Partial | Order Entry | 🔄 |
| Pharmacy | **MISSING** | Willow | 🔴 CRITICAL |
| Lab | DONE (TIER10) | Beaker | ✅ |
| Blood Bank | DONE (TIER10.105) | HCLL | ✅ |
| Microbiology | DONE (TIER10.103) | Beaker Micro | ✅ |
| Pathology | DONE (TIER10.101) | Beaker AP | ✅ |
| Imaging/Rad | DONE (TIER11) | Radiant | ✅ |
| Cardiology | DONE (TIER5) | Cupid | ✅ |
| OB/Maternity | DONE (TIER5) | Stork | ✅ |
| NICU | **MISSING** | Stork | 🔴 |
| Pediatrics | DONE (TIER5) | Pediatric | ✅ |
| Surgery/OR | Partial (TIER5) | OpTime | 🔄 |
| Anesthesia | Partial | Anesthesia | 🔄 |
| ICU | **MISSING** | ICU/CIS | 🔴 |
| Emergency | Partial (admtriage) | ASAP | 🔄 |
| Trauma | **MISSING** | ASAP | 🟡 |
| Endoscopy | **MISSING** | Endo | 🟡 |
| Cath Lab | **MISSING** | Cupid Cath | 🟡 |
| Sleep Lab | **MISSING** | Sleep | 🟡 |
| Wound Care | **MISSING** | Net Health | 🟡 |
| Palliative | **MISSING** | Palliative | 🟡 |
| Hospice | **MISSING** | Hospice | 🟡 |
| Home Health | DONE (TIER5) | Home Health | ✅ |
| Long-term Care | **MISSING** | PCC | 🟡 |
| Rehab | DONE (TIER5/7) | Rehab | ✅ |
| Pain Mgmt | DONE (TIER5) | Pain | ✅ |
| Mental Health | DONE (TIER5) | Behavioral | ✅ |
| Substance Abuse | DONE (TIER5) | ASAM | ✅ |
| Infusion Center | **MISSING** | Infusion | 🟡 |
| Dialysis | DONE (TIER5) | Dialysis | ✅ |
| Transplant | **MISSING** | Transplant | 🟡 |
| Oncology | DONE (TIER5) | Beacon | ✅ |
| Genetics | DONE (TIER10.106) | Genomics | ✅ |
| Nutrition | DONE (TIER5) | Nutrition | ✅ |

### 2.2 Administrative
| Section | Status | Epic Ref | Priority |
|---|---|---|---|
| Scheduling | Partial | Cadence | 🔄 |
| Registration | DONE | Cadence | ✅ |
| Patient Portal | **MISSING** | MyChart | 🔴 |
| Patient Flow | Partial | Grand Central | 🔄 |
| Bed Mgmt | DONE (TIER5) | Capacity | ✅ |
| Provider Sched | **MISSING** | Cadence | 🔴 |
| RCM/Coding | Partial (TIER8) | Resolute | 🔄 |
| HIM | **MISSING** | Coding | 🔴 |
| Release of Info | **MISSING** | MRO | 🟡 |
| Insurance/NPHIES | DONE (TIER5) | Resolute | ✅ |
| Financial KPIs | DONE (TIER8) | KPI | ✅ |

### 2.3 Quality & Safety
| Section | Status | Epic Ref | Priority |
|---|---|---|---|
| Quality Measures | DONE (TIER7) | Quality | ✅ |
| HEDIS | DONE (TIER7) | Quality | ✅ |
| Population Health | DONE (TIER7) | Healthy Planet | ✅ |
| Infection Control | **MISSING** | Surveillance | 🔴 |
| Antimicrobial Stew | **MISSING** | ASAP AMS | 🔴 |
| Falls/Risk | DONE (TIER5) | Quality | ✅ |
| Adverse Events | DONE (TIER5/9) | Reporting | ✅ |
| Sentinel Events | DONE (TIER5) | Reporting | ✅ |

### 2.4 Research
| Section | Status | Epic Ref | Priority |
|---|---|---|---|
| Clinical Trials | **MISSING** | Research | 🔴 |
| Biobank | **MISSING** | OpenSpecimen | 🟡 |
| Genomics | DONE (TIER5/10) | Genomics | ✅ |
| Precision Med | DONE (TIER12) | Genomics | ✅ |
| Cohort Discovery | DONE (TIER7) | Healthy Planet | ✅ |

### 2.5 Tech Foundation
| Section | Status | Priority |
|---|---|---|
| FHIR R4 | DONE (TIER12/13) | ✅ |
| HL7 v2 | DONE (TIER13) | ✅ |
| DICOM | DONE (TIER13) | ✅ |
| Webhooks | DONE (TIER13) | ✅ |
| CDA | DONE (TIER12) | ✅ |
| NLP | DONE (TIER12) | ✅ |
| Voice/AI Scribe | DONE (TIER12) | ✅ |
| Mirth Connect | DONE (TIER13) | ✅ |
| Monitoring/SLA | DONE (TIER13) | ✅ |
| Audit Trail | DONE (TIER9) | ✅ |
| RBAC | DONE (T9) | ✅ |
| Privacy/PDPL | DONE (TIER9) | ✅ |
| Compliance CBAHI/ZATCA | DONE (TIER9) | ✅ |

## 3. Remaining Gaps to Ship (Priority Order)

### Wave 14 — PHARMACY (CRITICAL — biggest gap)
- 101: prescription_order_entry
- 102: pharmacy_dispensing
- 103: iv_compounding_sterile
- 104: medication_reconciliation
- 105: drug_interaction_check
- 106: controlled_substance_tracking
**30 endpoints**

### Wave 15 — ICU
- 101: icu_admission_assessment
- 102: icu_daily_progress
- 103: icu_ventilator_mgmt
- 104: icu_sepsis_bundle
- 105: icu_handoff_sbar
- 106: icu_outcome_quality
**30 endpoints**

### Wave 16 — PATIENT PORTAL
- 101: portal_authentication
- 102: portal_appointment_book
- 103: portal_results_view
- 104: portal_messaging
- 105: portal_telehealth_entry
- 106: portal_billing_payment
**30 endpoints**

### Wave 17 — OR / PERIOPERATIVE
- 101: or_case_scheduling
- 102: or_surgical_safety_checklist
- 103: or_instrument_tracking
- 104: or_anes_record
- 105: or_sterilization
- 106: or_outcomes_ssi
**30 endpoints**

### Wave 18 — INFECTION CONTROL & ANTIMICROBIAL
- 101: infection_surveillance
- 102: hai_classification
- 103: antimicrobial_stewardship
- 104: outbreak_detection
- 105: isolation_precautions
- 106: ic_dashboard
**30 endpoints**

### Wave 19 — EMERGENCY / TRAUMA
- 101: ed_triage_esi
- 102: ed_fast_track
- 103: ed_trauma_activation
- 104: ed_disposition
- 105: ed_observation_status
- 106: ed_boarding_dashboard
**30 endpoints**

### Wave 20 — CLINICAL TRIALS / RESEARCH
- 101: trial_protocol_mgmt
- 102: trial_screening
- 103: trial_consent
- 104: trial_sae_reporting
- 105: trial_drug_accountability
- 106: trial_ehr_integration
**30 endpoints**

### Wave 21 — PROVIDER SCHEDULING
- 101: provider_template
- 102: provider_schedule_build
- 103: provider_booking
- 104: provider_oncall
- 105: provider_utilization
- 106: provider_payroll
**30 endpoints**

### Wave 22 — HOSPITAL OPS / CMD
- 101: command_center
- 102: bed_board
- 103: transport_logistics
- 104: housekeeping
- 105: equipment_mgmt
- 106: facility_dashboard
**30 endpoints**

### Wave 23 — ENDOSCOPY / SPECIALTY PROC
- 101: endoscopy_scheduling
- 102: endoscopy_sedation
- 103: endoscopy_reporting
- 104: endoscopy_quality
- 105: bronchoscopy
- 106: colonoscopy_adenoma
**30 endpoints**

### Wave 24 — NUTRITION / DIETARY
- 101: diet_order
- 102: menu_planning
- 103: tube_feeding
- 104: nutrition_screen
- 105: allergen_mgmt
- 106: kitchen_dashboard
**30 endpoints**

### Wave 25 — BIOBANK
- 101: specimen_collect
- 102: specimen_process
- 103: specimen_store
- 104: specimen_distribute
- 105: chain_of_custody
- 106: biostorage_mgmt
**30 endpoints**

### Wave 26 — LONG-TERM / SKILLED NURSING
- 101: ltc_admission_mds
- 102: ltc_care_plan
- 103: ltc_med_pass
- 104: ltc_incident_fall
- 105: ltc_omr_review
- 106: ltc_discharge_planning
**30 endpoints**

### Wave 27 — HOSPICE / PALLIATIVE
- 101: hospice_eligibility
- 102: hospice_care_plan
- 103: pain_symptom_mgmt
- 104: bereavement
- 105: spiritual_care
- 106: hospice_quality
**30 endpoints**

### Wave 28 — WOUND CARE
- 101: wound_assessment
- 102: wound_photography
- 103: wound_dressing
- 104: wound_progress
- 105: wound_healing_predict
- 106: wound_dashboard
**30 endpoints**

### Wave 29 — SLEEP LAB / EEG
- 101: sleep_study_order
- 102: sleep_scoring
- 103: sleep_report
- 104: eeg_order
- 105: eeg_interpret
- 106: sleep_dashboard
**30 endpoints**

### Wave 30 — REHAB THERAPY
- 101: pt_initial_eval
- 102: ot_initial_eval
- 103: speech_eval
- 104: treatment_plan
- 105: progress_discharge
- 106: rehab_outcomes
**30 endpoints**

**Total remaining**: 17 waves × 30 = **510 more endpoints**
**Grand total at end**: 1,365 + 510 = **~1,875 mounted routes**

## 4. Strategy: Skills + Loop + Autopilot

For each wave:
1. **Skills**: Use `nm-loop-engineering` + `nm-autopilot` + `nm-multi-agent-orchestrator`
2. **Loop**: Plan → Implement → Test → Verify (max 4 iterations)
3. **Autopilot**: 6 gates (Discover→Plan→Code→Test→Commit→Push→Close)
4. **Token saving**: Generator + body-files smoke + 30-endpoint batch

## 5. Quality Gates (per wave)

- G1: All 30 endpoints smoke 200 OK
- G2: All 6 tables created with RLS + FORCE_RLS
- G3: Migration forward only (no DROP)
- G4: Server.js mounts verified
- G5: Git commit + push
- G6: Memory file saved

## 6. .ai-brain/ Folder Structure

```
.ai-brain/
├── 01-master-plan/         # this file + per-wave plans
├── 02-system-audit/        # existing inventory + gaps
├── 03-sections-prompt-engineering/  # prompts per section
├── 04-scenarios-data-flows/  # business scenarios + flows
├── 05-stitch-wireframes/   # wireframes for new sections
├── 06-erd-database/        # ERDs
├── 07-openapi-specs/       # OpenAPI specs
├── 08-test-cases/          # test plans
├── 09-architecture-security/  # arch + security
└── 10-iteration-loops/     # loop engineering records
```
