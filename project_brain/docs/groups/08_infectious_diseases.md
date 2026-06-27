# G08 — الأمراض المعدية (Infectious Diseases & Travel Medicine)

## 0) Meta
```yaml
dept_key: "infectious_diseases"
dept_name_en: "Infectious Diseases, Stewardship & Travel Medicine"
dept_name_ar: "الأمراض المعدية والوقاية"
group_id: "G08"
sub_units: [id_consult, infection_control, tropical_medicine,
            antimicrobial_stewardship, travel_medicine, vaccination_center]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-ID Assistant.
ROLE: Help ID consultants, IPC nurses, antimicrobial stewards, travel clinics.
GUARDRAILS: IDSA, ESCMID, WHO, CDC, KSA-MoH antibiograms, local stewardship policy.
- De-escalate based on cultures + sensitivities (always show local antibiogram).
- Renal/hepatic dose adjustments mandatory.
- Pediatric/pregnancy categories enforced.
- HIV/TB/MERS/COVID-19/Hajj-related: per KSA-MoH special directives.
TOOLS: search_patient, get_culture, antibiogram_lookup, abx_dose_renal,
       de_escalation_recommender, outbreak_detect, travel_risk_assess,
       vaccine_due_check, exposure_prophylaxis,
       check_drug_interaction, pull_protocol, escalate.
STYLE: Always show: organism, sensitivity, narrowed-spectrum option, duration, IV→PO switch criteria.
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, weight_kg, allergies, eGFR, lft, pregnancy}
suspected: {syndrome, source}
cultures: [{site, organism, sensitivities, isolated_at}]
recent_meds: [{drug, days, indication}]
```

### 1.3 Few-shot
```
Q: 70M ICU, BC grew MSSA, on vanco. De-escalate?
A: Switch to cefazolin 2g IV q8h (or oxacillin 2g q4h). Faster bactericidal vs vanco for MSSA.
   Duration ≥14d if uncomplicated bacteremia; longer if endocarditis/metastatic.
   TEE recommended. Source control review.
   Next-best-action: TEE order; remove unnecessary lines.

Q: 30F traveling to West Africa for 4 weeks. Pre-travel?
A: Yellow fever vaccine (≥10d before, certificate). Malaria chemoprophylaxis (mefloquine/doxy/atovaq-prog).
   Typhoid, Hep A, MenACWY, rabies pre-exposure if rural/animal exposure.
   Counsel on dengue, schistosomiasis, food/water hygiene.
   Next-best-action: schedule vaccines today; provide written travel kit list.
```

## 2) Workflow
LangGraph: classify → load(cultures+abx) → rag(IDSA + local antibiogram) → de_escalation_node → critique → human if narrow-spectrum mismatch.

## 3) Backend / API
| /api/v1/id/cultures | GET | linked to lab/microbiology |
| /api/v1/id/abx_orders | GET,POST | with stewardship gate |
| /api/v1/id/abx_orders/{id}/justify | POST | required for restricted |
| /api/v1/id/antibiogram | GET | facility/dept-level annual |
| /api/v1/id/outbreaks | GET,POST | suspected/confirmed clusters |
| /api/v1/id/vaccines | GET,POST | inventory + administration |
| /api/v1/id/travel_clinic | POST | risk assessment + Rx |
| /api/v1/id/ai/ask | POST | LangGraph |

Events: `id.culture.posted`, `id.outbreak.declared`, `id.abx.deescalated`.

## 4) Data
```sql
CREATE TABLE id_abx_orders (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  drug VARCHAR(60), dose VARCHAR(40), route VARCHAR(10), freq VARCHAR(20),
  indication NVARCHAR(200), restricted BIT, justification NVARCHAR(MAX),
  start_at DATETIMEOFFSET, planned_end DATETIMEOFFSET, actual_end DATETIMEOFFSET,
  iv_to_po_eligible_at DATETIMEOFFSET);
CREATE TABLE id_outbreaks (id UUID PRIMARY KEY, organism VARCHAR(80),
  ward VARCHAR(40), declared_at DATETIMEOFFSET, cases_n INT,
  source_suspected NVARCHAR(MAX), control_measures NVARCHAR(MAX), closed_at DATETIMEOFFSET);
CREATE TABLE id_vaccines_admin (id UUID PRIMARY KEY, patient_id INT,
  vaccine VARCHAR(60), lot VARCHAR(40), dose_n INT, site VARCHAR(20),
  administered_at DATETIMEOFFSET, given_by INT);
CREATE TABLE id_travel_visits (id UUID PRIMARY KEY, patient_id INT,
  destination_countries NVARCHAR(300), travel_dates VARCHAR(60),
  activities NVARCHAR(300), risk_score TINYINT, plan NVARCHAR(MAX));
CREATE TABLE id_antibiogram (id UUID PRIMARY KEY, year INT, dept VARCHAR(40),
  organism VARCHAR(80), drug VARCHAR(60), susceptible_pct DECIMAL(5,2),
  isolates_n INT);
```

### 4.2 Vector
- `kb_guidelines_id` (IDSA, ESCMID, CDC, WHO, KSA-MoH)
- `kb_local_antibiogram_yearly`
- `kb_drug_formulary_abx`

## 5) Frontend
Stewardship inbox, Order with sensitivity-aware suggestions, Outbreak board,
Travel clinic wizard, Vaccine calendar.
Components: `<AntibiogramTable>`, `<DeEscalationCard>`, `<OutbreakHeatmap>`, `<VaccineDueGrid>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `id_stewardship_review.bpmn`, `id_outbreak_response.bpmn`.
```gherkin
Feature: Restricted antibiotic gate
  Scenario: Meropenem prescribed without ID approval
    Given doctor orders meropenem 1g q8h
    When the order is submitted
    Then order is held pending ID consult
    And ID team receives an actionable inbox item
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#10b981`. Seeders: antibiogram for 2025, 30 abx orders, 5 outbreaks, 50 travel visits. PDPL, CBAHI infection-control standards, MoH HAI surveillance, IHR-2005 reporting.

## 23) Risks
Hajj/Umrah season surge planning; MERS-CoV protocols; multi-drug resistant escalation; vaccine cold chain.
