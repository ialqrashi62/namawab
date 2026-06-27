# G04 — الكلى وزراعة الكلى وغسيل الكلى (Nephrology, Transplant & Dialysis)

## 0) Meta
```yaml
dept_key: "nephrology"
dept_name_en: "Nephrology, Renal Transplantation & Dialysis"
dept_name_ar: "طب الكلى وزراعتها وغسيلها"
group_id: "G04"
sub_units: [nephrology_general, renal_transplant, hemodialysis, peritoneal_dialysis,
            home_dialysis, plasmapheresis, pediatric_dialysis]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-Nephrology Assistant.
ROLE: Help nephrologists, dialysis nurses, transplant coordinators.
GUARDRAILS: KDIGO 2024, AKIN/RIFLE for AKI, ISPD for PD, KHA-CARI.
- Always check eGFR (CKD-EPI 2021), albuminuria, BP target per CKD stage.
- Drug dosing per renal function (vancomycin, gentamicin, DOAC, metformin).
- Dialysis: Kt/V ≥1.4 weekly (HD); URR ≥65%.
TOOLS: search_patient, get_renal_panel, egfr_calc, kt_v_calc,
       fluid_balance, transplant_match_score, immuno_dose_calc,
       check_drug_interaction, pull_protocol, escalate.
STYLE: SOAP; cite KDIGO; flag time-critical (hyperK >6.5, fluid overload).
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, weight_kg, dialysis_modality, vascular_access, allergies}
labs: {creatinine, urea, k, na, ca, po4, hb, ferritin, pth, alb, hco3}
recent: {dialysis_sessions[], fluid_removal_l, urine_output}
top_k_rag: 5
```

### 1.3 Few-shot
```
Q: HD patient, K=6.8, ECG shows peaked T. Plan?
A: Severe hyperK + ECG changes. Time-critical.
   1. IV calcium gluconate 1g over 5 min (cardioprotection)
   2. Insulin 10U + D50 50ml IV; salbutamol nebs 10-20mg
   3. Bicarb if acidotic. Avoid Kayexalate solo.
   4. Urgent HD session (potassium-free or 1K bath).
   Next-best-action: arrange STAT HD slot; recheck K post-Rx.
   Time-critical: YES.

Q: Living-donor renal transplant candidate, recipient ABO-O, donor ABO-A. Compatible?
A: ABO-incompatible. Options: ABO-i protocol (rituximab + plasmapheresis + IVIG),
   or paired exchange registry. HLA crossmatch needed; PRA assessment.
   Next-best-action: schedule transplant board; pre-transplant workup expanded.
```

### 1.4 Self-critique
- [ ] Drug dose adjusted for eGFR? • Dry weight current? • Vascular access infection signs?

## 2) Workflow
LangGraph: classify → load_renal_ctx → rag(KDIGO) → tools(eGFR/KtV) → compose → critique.
Chains: AKI → KDIGO stage → fluid resus + nephrotoxin removal → renal replacement decision.

## 3) Backend / API
| Path | Method | Purpose |
|------|--------|---------|
| /api/v1/nephro/dialysis_sessions | GET,POST | HD/PD session logs |
| /api/v1/nephro/access | GET,POST | AVF/AVG/CVC registry |
| /api/v1/nephro/transplant/workup | GET,POST | recipient/donor workup |
| /api/v1/nephro/immunosuppression | GET,POST | drug levels (tac/cya/sir) |
| /api/v1/nephro/ai/ask | POST | LangGraph |

Events: `nephro.dialysis.completed`, `nephro.access.created`, `nephro.transplant.scheduled`.

## 4) Data
```sql
CREATE TABLE nephro_dialysis_sessions (id UUID PRIMARY KEY, patient_id INT,
  session_date DATETIMEOFFSET, modality VARCHAR(10), -- 'HD','PD','CRRT','SLED'
  duration_min INT, ufr_ml_hr INT, dialysate_k INT, dialysate_ca DECIMAL(3,1),
  pre_weight_kg DECIMAL(5,2), post_weight_kg DECIMAL(5,2),
  pre_bp VARCHAR(15), post_bp VARCHAR(15), kt_v DECIMAL(4,2), urr DECIMAL(4,1),
  complications NVARCHAR(500), nurse_id INT);
CREATE TABLE nephro_vascular_access (id UUID PRIMARY KEY, patient_id INT,
  type VARCHAR(20), location VARCHAR(40), created_at DATE,
  maturation_status VARCHAR(20), last_cannulation DATE,
  flow_ml_min INT, complications NVARCHAR(500));
CREATE TABLE nephro_transplant_workup (id UUID PRIMARY KEY, patient_id INT,
  donor_type VARCHAR(20), -- 'living_related','living_unrelated','deceased'
  hla_match TINYINT, pra_pct DECIMAL(4,1), abo_compat BIT,
  workup_status VARCHAR(20), listed_date DATE);
CREATE TABLE nephro_immunosuppression (id UUID PRIMARY KEY, patient_id INT,
  drug VARCHAR(40), level DECIMAL(5,2), target_low DECIMAL(5,2),
  target_high DECIMAL(5,2), measured_at DATETIMEOFFSET);
CREATE TABLE nephro_pd_logs (id UUID PRIMARY KEY, patient_id INT,
  log_date DATE, dwell_volume_ml INT, exchanges_n INT,
  ultrafiltration_ml INT, peritonitis_signs BIT);
```

### 4.2 Vector
- `kb_guidelines_nephro` (KDIGO, ISPD, KHA-CARI)
- `kb_local_sop_nephro` (HD bath protocols, AVF cannulation)
- `kb_drug_formulary_nephro` (renal-dose drugs, immunosuppressants)

## 5) Frontend
Dialysis schedule grid, Patient HD round, Access map, Transplant tracker, Drug-level chart.
Components: `<DialysisChair>`, `<KtVTrend>`, `<AccessFlowGauge>`, `<ImmunoLevelChart>`.

## 6-7) Infra/CI/Tests: standard.

## 8-15) BPMN/ERD/Stories
- BPMN: `nephro_hd_session.bpmn`, `nephro_transplant_listing.bpmn`, `nephro_aki_alert.bpmn`.
```gherkin
Feature: AKI alert
  Scenario: Creatinine rise 1.5x baseline in 48h
    Given baseline Cr 0.9, current Cr 1.5
    When lab posts new result
    Then KDIGO AKI Stage 1 alert created for nephro on-call
    And nephrotoxin scan run on active orders
```
- STRIDE: dialysis machine telemetry, transplant listing data.

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#0ea5e9`. Seeders 30 HD pts, 10 PD, 5 transplant. PDPL, CBAHI dialysis bundle, MoH transplant registry.

## 23) Risks
Pediatric dialysis weight-based parameter limits; donor consent legal framework KSA; immuno drug supply chain.
