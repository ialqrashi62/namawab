# G22 — المختبرات الطبية المركزية (Pathology, Microbiology, Chemistry, Immunology, Genetics, Toxicology, Blood Bank)

## 0) Meta
```yaml
dept_key: "laboratories"
group_id: "G22"
sub_units: [histopathology, cytopathology, frozen_section, electron_microscopy,
            immunohistochemistry, molecular_pathology,
            bacteriology, virology, mycology, parasitology, blood_culture, sensitivity,
            clinical_chemistry_routine, hormones_tumor_markers, tdm,
            immunology_serology, autoimmune_panels, allergy_panels,
            genetics_cytogenetics, genetics_molecular, pgd_lab,
            toxicology_drugs, toxicology_metals, toxicology_pesticides,
            blood_bank_general, apheresis, blood_components, single_donor_platelets]
```

## 1) System Prompt
```text
You are NamaMedical-Lab Assistant.
GUARDRAILS: CAP, CLSI, ISO 15189, JCI lab, KSA-MoH lab regulations, IFCC.
- Reference ranges age/sex/method-specific; flag delta-checks.
- Critical values: phone-call notification + read-back + audit.
- Microbiology: link sensitivities to antibiogram (G08); flag MDRO.
- Blood bank: pre-transfusion compatibility; ABO/Rh/antibody screen mandatory.
- Genetics: counseling consent before reporting actionable findings.
TOOLS: ref_range_lookup, delta_check, critical_value_notify,
       antibiogram_summary, transfusion_compat_check, escalate.
```

## 2) Workflow
LangGraph: classify(test family) → load(prior + ref ranges) → tools(delta/critical) → compose result narrative.

## 3) API
| /api/v1/lab/orders | GET,POST | extends existing lab_results |
| /api/v1/lab/results | GET,POST | structured |
| /api/v1/lab/critical_notify | POST | document call-back |
| /api/v1/lab/microbiology | GET,POST | cultures + sens |
| /api/v1/lab/genetics | GET,POST | report + counsel link |
| /api/v1/lab/blood_bank/units | GET,POST | inventory |
| /api/v1/lab/blood_bank/crossmatch | POST | compat result |
| /api/v1/lab/ai/ask | POST | LangGraph |

Events: `lab.result.posted`, `lab.critical.notified`, `bb.unit.allocated`, `bb.transfusion.completed`.

## 4) Data
```sql
-- extends existing lab_results, lab_samples
CREATE TABLE lab_panels (id UUID PRIMARY KEY, name VARCHAR(60), tests_json NVARCHAR(MAX));
CREATE TABLE lab_critical_calls (id UUID PRIMARY KEY, result_id INT,
  called_at DATETIMEOFFSET, called_to_user_id INT, read_back_ok BIT,
  caller_id INT);
CREATE TABLE micro_cultures (id UUID PRIMARY KEY, sample_id INT,
  source VARCHAR(40), organism VARCHAR(80), preliminary_at DATETIMEOFFSET,
  final_at DATETIMEOFFSET, sensitivities_json NVARCHAR(MAX), mdro BIT);
CREATE TABLE lab_genetics_reports (id UUID PRIMARY KEY, patient_id INT,
  test_type VARCHAR(40), result_json NVARCHAR(MAX), variants_acmg NVARCHAR(MAX),
  reported_at DATETIMEOFFSET, counsel_required BIT);
CREATE TABLE bb_units (id UUID PRIMARY KEY, unit_no VARCHAR(40),
  product VARCHAR(20), -- 'PRBC','FFP','PLT','CRYO','SDP'
  abo CHAR(2), rh CHAR(3), volume_ml INT,
  collected_at DATETIMEOFFSET, expiry DATETIMEOFFSET, status VARCHAR(20));
CREATE TABLE bb_crossmatch (id UUID PRIMARY KEY, patient_id INT, unit_id UUID,
  abo_compat BIT, ab_screen_neg BIT, crossmatch_ok BIT, performed_at DATETIMEOFFSET);
CREATE TABLE bb_transfusions (id UUID PRIMARY KEY, patient_id INT, unit_id UUID,
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET, reaction VARCHAR(40), notes NVARCHAR(MAX));
CREATE TABLE lab_apheresis (id UUID PRIMARY KEY, patient_id INT, type VARCHAR(40),
  date DATE, volume_processed_ml INT, replacement VARCHAR(40));
```

### 4.2 Vector
- `kb_lab_methods` (CLSI, IFCC)
- `kb_genetics_variants` (ClinVar, ACMG criteria)
- `kb_bb_protocols`

## 5) Frontend
Lab worklist, Result entry with auto-flags, Critical-value call-back form, Micro report builder,
Genetics report viewer with ACMG annotation, Blood-bank inventory + crossmatch pad,
Apheresis schedule.
Components: `<LabResultRow flags>`, `<CriticalCallPad>`, `<AntibioGramTable>`, `<BBUnitRow>`, `<CrossmatchPad>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `lab_critical_call.bpmn`, `bb_transfusion_pathway.bpmn`, `lab_genetics_workflow.bpmn`.
```gherkin
Feature: Critical value notification
  Scenario: K = 7.2 in adult inpatient
    Given lab posts K = 7.2 mEq/L
    Then critical-value workflow triggers, ICU/ward nurse paged within 10 min
    And read-back is documented before result is "released"
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#fbbf24`. Seeders 200 results, 30 cultures, 5 genetics, 50 BB units. PDPL, CAP, ISO 15189, MoH lab licensing, JCI lab.

## 23) Risks
Mislabeling root-cause; LIS↔HIS interface stability; genetics counselor staffing; BB inventory disasters.
