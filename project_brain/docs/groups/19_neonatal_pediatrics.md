# G19 — حديثي الولادة وطب الأطفال (Neonatology, Pediatrics, NICU)

## 0) Meta
```yaml
dept_key: "neonatal_pediatrics"
group_id: "G19"
sub_units: [pediatrics_general, neonatology, nicu_level_3, nicu_level_4,
            nursery, follow_up_clinic, pediatric_genetics,
            pediatric_nutrition, developmental_pediatrics]
```

## 1) System Prompt
```text
You are NamaMedical-Neonatal/Peds Assistant.
GUARDRAILS: AAP, NRP, AAP Bright Futures, ESPGHAN, KSA pediatric guidelines.
- Drug dosing: always weight-based (mg/kg) + max-dose check.
- NRP algorithm: HR/respiration/tone within first minute.
- Bilirubin nomogram per gestational age + risk factors.
- Vaccination per KSA-MoH schedule (NICVD).
TOOLS: ga_calc, weight_dose_calc, bilirubin_nomogram, apgar_tracker,
       growth_chart_who, nrp_algorithm, escalate.
STYLE: Always show weight + GA + corrected age before recommendations.
```

## 2) Workflow
LangGraph: classify → load(birth + growth + vaccines) → rag → tools(dose/biliconnect) → critique.

## 3) API
| /api/v1/peds/well_visits | GET,POST | Bright Futures schedule |
| /api/v1/peds/growth | GET,POST | weight/length/HC |
| /api/v1/peds/vaccines | GET,POST | per KSA schedule |
| /api/v1/neo/admissions | GET,POST | NICU admit |
| /api/v1/neo/respiratory_support | POST | CPAP/mech vent logs |
| /api/v1/neo/bilirubin | POST | Tcb/Tsb + nomogram |
| /api/v1/peds/ai/ask | POST | LangGraph |

Events: `neo.admit`, `peds.vaccine.given`, `neo.bilirubin.action_threshold`.

## 4) Data
```sql
CREATE TABLE neo_admissions (id UUID PRIMARY KEY, patient_id INT,
  birth_at DATETIMEOFFSET, ga_weeks DECIMAL(3,1), birth_weight_g INT,
  apgar_1 INT, apgar_5 INT, apgar_10 INT,
  resuscitation_needed BIT, surfactant_given BIT,
  outcome VARCHAR(40));
CREATE TABLE neo_respiratory_support (id UUID PRIMARY KEY, neo_admit_id UUID,
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET, mode VARCHAR(20),
  fio2 DECIMAL(3,2), peep INT, pip INT, vt_ml DECIMAL(4,1));
CREATE TABLE neo_bilirubin (id UUID PRIMARY KEY, patient_id INT,
  measured_at DATETIMEOFFSET, hour_of_life INT, total_bili DECIMAL(4,1),
  direct_bili DECIMAL(4,1), risk_category VARCHAR(20), action VARCHAR(40));
CREATE TABLE peds_well_visits (id UUID PRIMARY KEY, patient_id INT,
  visit_date DATE, age_months INT, weight_kg DECIMAL(4,2),
  length_cm DECIMAL(4,1), hc_cm DECIMAL(4,1),
  developmental_screening NVARCHAR(MAX));
CREATE TABLE peds_vaccinations (id UUID PRIMARY KEY, patient_id INT,
  vaccine VARCHAR(40), dose_n INT, given_at DATETIMEOFFSET,
  lot VARCHAR(40), site VARCHAR(20), nicvd_synced BIT);
CREATE TABLE peds_growth_curves (id UUID PRIMARY KEY, patient_id INT,
  date DATE, weight_pct INT, length_pct INT, hc_pct INT, bmi_pct INT);
```

### 4.2 Vector
- `kb_guidelines_neonate` (AAP, NRP, ESPGHAN)
- `kb_guidelines_peds_general`
- `kb_drug_dosing_peds` (Lexicomp peds, BNF-C)

## 5) Frontend
NICU bed map, Vent/CPAP chart, Bilirubin nomogram plotter, Vaccine calendar (KSA),
Growth chart viewer (WHO), Well-baby visit form.
Components: `<NICUBay>`, `<VentChart>`, `<BiliNomogram>`, `<GrowthChart>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard. Pediatric dose calc: 100% unit-test coverage MANDATORY.
- BPMN: `neo_admission_pathway.bpmn`, `peds_vaccine_visit.bpmn`, `neo_bilirubin_pathway.bpmn`.
```gherkin
Feature: Bilirubin action threshold
  Scenario: Term newborn 36h old, TSB above phototherapy line
    Given Tsb = 17 at 36h with no risk factors
    When result entered
    Then phototherapy is recommended and order auto-suggested
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#fbbf24`. Seeders 30 newborns, 50 well visits, 80 vaccines. PDPL minor data, CBAHI peds bundle, MoH NICVD vaccine registry.

## 23) Risks
Wrong-weight med-error fatality; NICU staffing ratios; vaccine hesitancy education; safeguarding suspected NAT.
