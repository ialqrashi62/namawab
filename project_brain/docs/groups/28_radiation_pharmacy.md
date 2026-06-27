# G28 — العلاج الإشعاعي والصيدلية الإكلينيكية (Radiation Oncology & Clinical Pharmacy)

## 0) Meta
```yaml
dept_key: "radiation_pharmacy"
group_id: "G28"
sub_units: [imrt, srs, gamma_knife, cyber_knife, proton_therapy, brachytherapy,
            chemo_pharmacy, icu_pharmacy, peds_pharmacy, hem_pharmacy,
            drug_information, tdm_pharmacy]
```

## 1) System Prompt
```text
You are NamaMedical-RadOnc/Pharm Assistant.
GUARDRAILS: ASTRO, ESTRO, NCCN-radiation, IAEA, ASHP, ISMP, ACCP.
- Radiation: dose-volume constraints (QUANTEC); fractionation choice; OAR limits.
- Pharmacy: dose check by indication + organ function; high-alert med double-check;
  USP <797>/<800> sterile compounding standards.
- Chemo: BSA, cumulative limits, hood compliance, spill kit.
TOOLS: dvh_check, fractionation_select, oar_dose_lookup,
       sterile_compound_check, high_alert_double_check, escalate.
```

## 2) Workflow
LangGraph: classify → load(plan + meds) → rag → tools(dose) → critique → human (always sign-off for radiation plan + chemo).

## 3) API
| /api/v1/radonc/plans | GET,POST | radiation plan |
| /api/v1/radonc/dvh | GET | dose-volume histograms |
| /api/v1/radonc/fractions | POST | per-fraction delivery |
| /api/v1/pharm/orders | GET,POST | medication orders |
| /api/v1/pharm/compound | POST | sterile prep log |
| /api/v1/pharm/tdm | POST | drug levels + adjust |
| /api/v1/pharm/ai/ask | POST | LangGraph |

Events: `radonc.plan.signed`, `radonc.fraction.delivered`, `pharm.compound.qa.passed`, `pharm.tdm.adjusted`.

## 4) Data
```sql
CREATE TABLE radonc_plans (id UUID PRIMARY KEY, patient_id INT,
  diagnosis VARCHAR(80), modality VARCHAR(20),
  total_dose_cgy INT, fractions INT, technique VARCHAR(20),
  oar_constraints_json NVARCHAR(MAX), planned_by INT, signed_by INT,
  signed_at DATETIMEOFFSET);
CREATE TABLE radonc_dvh (id UUID PRIMARY KEY, plan_id UUID,
  structure VARCHAR(40), dose_cgy INT, volume_pct DECIMAL(4,1));
CREATE TABLE radonc_fractions (id UUID PRIMARY KEY, plan_id UUID,
  fraction_n INT, delivered_at DATETIMEOFFSET, gantry_angle DECIMAL(4,1),
  delivered_dose_cgy INT, qa_passed BIT);
CREATE TABLE pharm_orders (id UUID PRIMARY KEY, patient_id INT,
  drug VARCHAR(60), dose VARCHAR(40), route VARCHAR(20), freq VARCHAR(20),
  high_alert BIT, indication NVARCHAR(200), ordered_by INT,
  ordered_at DATETIMEOFFSET);
CREATE TABLE pharm_compound_log (id UUID PRIMARY KEY, order_id UUID,
  compounded_at DATETIMEOFFSET, hood_id VARCHAR(20), pharm_id INT,
  qa_check_by INT, qa_passed BIT);
CREATE TABLE pharm_tdm (id UUID PRIMARY KEY, patient_id INT,
  drug VARCHAR(40), level DECIMAL(6,2), measured_at DATETIMEOFFSET,
  target_low DECIMAL(6,2), target_high DECIMAL(6,2), action VARCHAR(40));
```

### 4.2 Vector
- `kb_guidelines_radonc` (ASTRO, ESTRO, NCCN-radiation, QUANTEC)
- `kb_pharmacy_protocols` (ASHP, ISMP, USP <797>/<800>)

## 5) Frontend
Radiation plan viewer (DVH chart), Daily linac queue, Fraction QA pad,
Pharmacy order verify, Compound log with hood/pharm sign-off, TDM trend chart.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `radonc_plan_signoff.bpmn`, `pharm_chemo_compound.bpmn`, `pharm_tdm_pathway.bpmn`.
```gherkin
Feature: OAR over-dose alarm
  Scenario: Spinal cord max dose exceeds 50 Gy
    Given plan v2 OAR cord max = 52 Gy
    Then plan blocked, replanning required, physicist notified
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#facc15`. Seeders 10 radonc plans, 80 fractions, 100 pharm orders, 30 TDM. PDPL, CBAHI radonc, IAEA, KSA NRC, SFDA pharm.

## 23) Risks
Linac downtime contingency; radioisotope supply; sterile compounding QA; chemo spill response.
