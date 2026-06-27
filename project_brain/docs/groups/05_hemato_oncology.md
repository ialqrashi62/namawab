# G05 — الدم والأورام وزراعة النخاع (Hematology, Oncology & BMT)

## 0) Meta
```yaml
dept_key: "hemato_oncology"
dept_name_en: "Medical Hematology, Oncology & BMT"
dept_name_ar: "أمراض الدم والأورام وزراعة النخاع"
group_id: "G05"
sub_units: [medical_oncology, gyn_oncology, hematology, coagulation_anemia,
            bmt_autologous, bmt_allogeneic, bmt_cord_blood]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-Onc/Heme Assistant. SAFETY-CRITICAL DOMAIN.
ROLE: Help med-onc, hem-onc, BMT, oncology pharmacy, oncology nursing.
GUARDRAILS: NCCN 2025, ESMO, ASH, EBMT, ASCO. Local formulary + chemo regimens DB.
- ALL chemo orders REQUIRE: BSA recompute, cumulative anthracycline check, organ function
  (LVEF, eGFR, bili), neutrophil & platelet counts, allergy review, prior cycle delay/dose.
- Tumor lysis risk → score before cycle 1 of high-burden disease.
- Neutropenic fever ANC<500 → empiric antibiotics within 1h.
TOOLS: search_patient, get_oncology_summary, bsa_calc, ecog_perf,
       chemo_dose_check, anthracycline_lifetime, tumor_lysis_score,
       nccn_protocol_pick, fn_protocol, gcsf_decision,
       check_drug_interaction, pull_protocol, escalate.
STYLE: Always print "DOUBLE-CHECK" boxes; require pharmacist + nurse 2-witness before admin.
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, height_cm, weight_kg, bsa_m2, ecog, allergies}
diagnosis: {primary_site, histology, stage, biomarkers (her2, er, pr, egfr, alk, pdl1...)}
labs: {anc, plt, hb, alb, bili, alt, creatinine, lvef_recent, egfr}
prior_lines: [{regimen, cycles, response, last_dose}]
top_k_rag: 5
```

### 1.3 Few-shot
```
Q: 55F, HER2+ breast cancer post-op, stage IIB. Adjuvant?
A: NCCN: TCH (docetaxel + carboplatin + trastuzumab) ×6 then trastuzumab to 1y.
   Add pertuzumab if N+ or stage III. Echo q3mo. Dexrazoxane if anthracycline used.
   Pre-cycle: ANC≥1500, Plt≥100k, LVEF≥50%. BSA recompute.
   Next-best-action: schedule echo + port placement + chemo teaching.

Q: 65M AML, ANC 100, T 38.7°C. Plan?
A: Febrile neutropenia. Time-critical.
   Within 1h: blood cx ×2, urine cx, CXR, broad-spectrum (cefepime or pip-tazo).
   Add vanco if line/skin/MRSA risk. CT chest if stable.
   Avoid solid food risk; reverse isolation.
   Next-best-action: ID consult; consider G-CSF per protocol.
   Time-critical: YES.
```

### 1.4 Self-critique
- [ ] BSA recomputed today? • Cumulative dose under limit? • Counts above floor? • Premeds prescribed (5HT3, dex, antihistamine)?

## 2) Workflow
LangGraph: classify → load(prior lines + biomarkers) → rag(NCCN) → tools(BSA/dose) → compose → critique → 2-person sign-off node.

## 3) Backend / API
| Path | Method | Purpose |
|------|--------|---------|
| /api/v1/onc/regimens | GET | NCCN catalogs |
| /api/v1/onc/orders/cycle | POST | create chemo cycle order |
| /api/v1/onc/cycle/{id}/sign-off | POST | dual-witness verification |
| /api/v1/onc/anthracycline/cumulative | GET | lifetime exposure check |
| /api/v1/onc/bmt/cases | GET,POST | BMT case mgmt |
| /api/v1/onc/tumor_board/decisions | GET,POST | MDT decisions |
| /api/v1/onc/ai/ask | POST | LangGraph |

Events: `onc.cycle.ordered`, `onc.cycle.administered`, `onc.tumor_board.decided`, `onc.bmt.engraftment.confirmed`.

## 4) Data
```sql
CREATE TABLE onc_regimens (id UUID PRIMARY KEY, name VARCHAR(80),
  disease VARCHAR(80), drugs_json NVARCHAR(MAX), schedule VARCHAR(60),
  cycle_length_days INT, total_cycles INT, source_guideline VARCHAR(40));
CREATE TABLE onc_cycle_orders (id UUID PRIMARY KEY, patient_id INT,
  regimen_id UUID, cycle_n INT, planned_date DATE,
  bsa_m2 DECIMAL(4,2), dose_modification_pct DECIMAL(4,1),
  status VARCHAR(20), -- 'planned','signed','dispensed','administered','postponed','cancelled'
  doctor_signoff_at DATETIMEOFFSET, pharm_signoff_at DATETIMEOFFSET,
  nurse_signoff_at DATETIMEOFFSET);
CREATE TABLE onc_cycle_drug_admin (id UUID PRIMARY KEY, cycle_order_id UUID,
  drug VARCHAR(60), dose_mg DECIMAL(8,2), route VARCHAR(20),
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET, line VARCHAR(40),
  reaction NVARCHAR(MAX));
CREATE TABLE onc_anthracycline_lifetime (id UUID PRIMARY KEY, patient_id INT,
  drug VARCHAR(40), cumulative_mg_m2 DECIMAL(8,2), updated_at DATETIMEOFFSET);
CREATE TABLE bmt_cases (id UUID PRIMARY KEY, patient_id INT,
  type VARCHAR(20), -- 'autologous','allogeneic','cord'
  donor_id INT NULL, hla_match TINYINT, conditioning VARCHAR(60),
  infusion_date DATE, engraftment_anc_date DATE, engraftment_plt_date DATE,
  gvhd_acute_grade TINYINT, gvhd_chronic VARCHAR(20));
CREATE TABLE onc_tumor_board (id UUID PRIMARY KEY, patient_id INT,
  meeting_date DATE, attendees NVARCHAR(MAX), decision NVARCHAR(MAX),
  next_action NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_onc` (NCCN, ESMO, ASCO)
- `kb_guidelines_heme` (ASH, BSH)
- `kb_bmt_protocols` (EBMT)
- `kb_drug_formulary_onc`

## 5) Frontend
Screens: Cycle planner, Order verification (3-pane: doctor → pharmacist → nurse),
Anthracycline lifetime gauge, BMT day +N tracker, Tumor board worklist.
Components: `<DoseCheckCard>`, `<CumulativeAnthraGauge>`, `<DualSignoffPad>`, `<EngraftmentChart>`.

## 6-7) Infra/CI/Tests: standard + extra mandatory: dose-calc unit tests 100% coverage.

## 8-15) BPMN/ERD/Stories
- BPMN: `onc_cycle_workflow.bpmn`, `onc_fn_pathway.bpmn`, `bmt_conditioning.bpmn`.
```gherkin
Feature: Anthracycline cumulative limit
  Scenario: Doxorubicin cumulative > 450 mg/m2
    Given patient cumulative dox = 440 mg/m2 and new cycle adds 50 mg/m2
    When physician submits order
    Then system blocks order and requires cardiology consultation
    And LVEF re-check is mandated
```
- STRIDE: chemo dose tampering, BMT donor identity, biomarker leakage.

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#a855f7`. Seeders: 30 onc pts (mix breast/lung/AML/lymphoma), 10 BMT, 50 cycles. PDPL, CBAHI oncology, MoH cancer registry, IAEA radiation if combined with G28.

## 23) Risks
Chemo error fatality rate; dose calc edge-cases (obesity capping); BMT donor consent KSA legal; CAR-T pipeline future.
