---
id: BUSINESS-FLOWS
version: 1.0
date: 2026-08-01
owner: PM+CMO
status: ACTIVE
---

# Business Flows — Care Pathways + Order Sets + Care Plans + Outcomes

> **Purpose:** Encode clinical/operational flows as reusable building blocks: pathways (time-bound, state machine), order sets (one-tap orders), care plans (longitudinal), and outcome dashboards (KPIs).

---

## 1. Global systems comparison

| System | Flow model |
|--------|------------|
| **Epic Best Practice Advisories (BPA)** | Trigger + condition + action (rules) |
| **Cerner Care Pathways** | Nodes + decision logic |
| **MEDITECH Care Plans** | Goal + intervention |
| **athena Care Coordination** | Network effect |
| **InterSystems IRIS** | Business Rules Engine |
| **NamaMedical** | **LangGraph + Order Sets Library + Care Plans + Outcome dashboards (CBAHI-aligned)** |

---

## 2. Master library locations

```
.ai-brain/99-upgrade/16-business/
├── pathways/                  # 50+ as YAML
├── order-sets/                # 100+ as YAML
├── care-plans/                # per-condition templates
├── outcome-dashboards/        # per-dept KPI
└── scenarios/                 # end-to-end clinical scenarios
```

---

## 3. Care Pathway schema (canonical)

```yaml
# .ai-brain/99-upgrade/16-business/pathways/AMI_STEMI.yaml
id: PATH:AMI:STEMI
name: ST-Elevation Myocardial Infarction
name_ar: احتشاء عضلة القلب مع رفع ST
version: 2.1.0
owner_clinical: CMO
owner_technical: AIE
jurisdictions: [KSA, EU]
triggers:
  - ECG: ST_elevation >=1mm_2_contiguous
  - NEW_LBBB
  - cardiac_arrest_with_stemi
target_population:
  - adult: age>=18
  - exclude: pregnancy  (use PATH:AMI:OBSTETRIC_CARDIO for pregnancy)
nodes:
  - id: trigger
    sla: ECG_within_10m_door
  - id: cath_lab_activate
    sla: within_30m_door
    auto_action:
      - page: cardiology_oncall
      - order: triage_cath_lab_set
  - id: aspirin_loading
    dose: 325mg_po_chewed
    timing: stat
  - id: heparin_loading
    dose: 60U/kg_iv_max_4000
    timing: stat
  - id: pci
    sla: door_to_balloon_within_90m
  - id: post_pci
    order_set: AMI_post_pci_day1
  - id: risk_stratify
    calculator: GRACE_score
  - id: cardiac_rehab_refer
    trigger: post_discharge_+_stable
order_sets_referenced:
  - OS:AMI:STEMI:acute
  - OS:AMI:post_pci
  - OS:cardiac_rehab
durations_targets:
  door_to_balloon_min: 90
  door_to_ecg_min: 10
  door_to_aspirin_min: 30
overrides_audit: strict
red_flag_blockers:
  - cardiogenic_shock
  - mechanical_complication
  - refractory_arrhythmia
citations:
  - CIT:ESC-2024:STEMI
  - CIT:NPHIES:ACS-001
  - CIT:CBAHI:ED-04
kdigo_evidence_level: 1A
```

---

## 4. Order Set schema

```yaml
# .ai-brain/99-upgrade/16-business/order-sets/AMI_STEMI_acute.yaml
id: OS:AMI:STEMI:acute
name: AMI STEMI Acute (Door-to-Balloon)
items:
  - type: medication
    drug: aspirin
    dose: 325 mg
    route: PO chewed
    timing: STAT
    sfda_registered: true
    allergy_check: true
  - type: medication
    drug: clopidogrel
    dose: 600 mg (or ticagrelor 180 mg)
    route: PO
    timing: STAT
  - type: medication
    drug: heparin
    dose: 60 U/kg (max 4000)
    route: IV bolus
    timing: STAT
  - type: lab
    panel: troponin_q3h
    duration_hours: 24
    auto_repeat: true
  - type: imaging
    study: ECG
    timing: STAT
    qualifier: 'serial, as needed'
  - type: consult
    dept: interventional_cardiology
    priority: STAT
  - type: procedure
    name: primary_PCI
    timing: within 90m door-to-balloon
    location: cath_lab
compatibility_checks:
  - on_renal_failure: adjust_heparin_dose
  - on_allergy_aspirin: use_clopidogrel_solo
  - on_active_bleed: defer_PCI_to_stabilize
```

---

## 5. Care Plan schema

```yaml
id: CP:CHF:AMA
name: Heart Failure Management Plan
name_ar: خطة علاج قصور القلب
patient_profile: adult_with_HFrEF
goals:
  - goal: 'Reduce HF readmissions by 50% in 6 months'
    metric: '30-day readmission rate'
    target_value: '5%'
    target_date: '+6 months'
interventions:
  - {action: GDMT_optimization, freq: weekly}
  - {action: BNP_lab_q_month, freq: monthly}
  - {action: TeleHealth_daily_weight_check}
  - {action: diet_low_sodium, education: at_diagnosis}
  - {action: device_education, if: LVEF<35%}
outcomes:
  tracked_metrics:
    - readmission_30d
    - all_cause_mortality_1y
    - LVEF_trend
  dashboards:
    - dept_dashboard: cardiology_kpi
review_triggers:
  - ED_visit
  - weight_gain_2kg_3d
```

---

## 6. Outcome Dashboards (per dept)

```yaml
# .ai-brain/99-upgrade/16-business/outcome-dashboards/cardiology_dashboard.yaml
id: DASH:CARD-001:kpi
name: Cardiology KPIs (CBAHI-aligned)
panels:
  - title: Door-to-Balloon (median)
    query: |
      SELECT AVG(EXTRACT(EPOCH FROM (pci_time - door_time))) / 60
      FROM pci_encounters
      WHERE pathway_id = 'PATH:AMI:STEMI' AND door_time >= now() - INTERVAL '30 days'
    target_minutes: 90
    alert_threshold_minutes: 100
  - title: 30-day HF readmission
    query: ... (similar)
    target: '5%'
  - title: Adherence to GDMT
    query: ...
    target: '95%'
  - title: DAPT compliance
  - title: Statin prescription rate
```

---

## 7. End-to-End Scenarios (top 30)

Each scenario is a Markdown doc walking through:
1. Patient arrival
2. Triage (ESI)
3. First assessment
4. Pathway activation
5. Orders placed
6. Care team coordination
7. Documentation
8. Discharge + plan
9. Follow-up
10. KPI capture

Examples:
- `SCN:ER001:chest_pain.md` (ACS workup)
- `SCN:OBG001:routine_prenatal.md`
- `SCN:ICU001:postop_complication.md`
- `SCN:PEDS001:well_child_6mo.md`
- `SCN:CARD001:ACS_admission_to_discharge.md`

---

## 8. Files

```
.ai-brain/99-upgrade/16-business/
├── pathways/                  # 50+
├── order-sets/                # 100+
├── care-plans/                # 40+
├── outcome-dashboards/        # per-dept
└── scenarios/                 # 30+
```

Loaded at runtime by `src/workflow/pathway_loader.js` and `src/order_sets/loader.js`.

---

## 9. Tests

- Unit: per pathway transition rules
- Integration: pathway execute from trigger to completion
- E2E: scenarios replay
- Outcome dashboards: query correctness
- Override audit: every deviation logged

---

*Owner: PM+CMO — version 1.0 — 2026-08-01*
