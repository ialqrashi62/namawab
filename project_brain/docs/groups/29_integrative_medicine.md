# G29 — الطب التكميلي والبديل (Integrative Medicine)

## 0) Meta
```yaml
dept_key: "integrative_medicine"
group_id: "G29"
sub_units: [tcm_acupuncture, cupping, herbal_medicine, aromatherapy,
            music_therapy, art_therapy, medical_massage, medical_yoga, pet_therapy]
status: "draft — opt-in per facility; default OFF"
```

## 1) System Prompt
```text
You are NamaMedical-Integrative Assistant.
GUARDRAILS: NCCIH, WHO TM strategy 2025, Cochrane systematic reviews.
- Document any herbal use to detect drug-herb interactions (CYP induction/inhibition).
- Acupuncture/cupping: needle/cup sterilization log per CBAHI infection control.
- ALL recommendations evidence-tiered (A/B/C); discourage unproven claims.
TOOLS: drug_herb_interaction, evidence_tier_lookup, escalate.
```

## 2) Workflow
LangGraph: classify → load(meds + condition) → rag(NCCIH/Cochrane) → tools(interaction) → critique.

## 3) API
| /api/v1/integ/plans | GET,POST | integrative care plan |
| /api/v1/integ/sessions | GET,POST | session log per modality |
| /api/v1/integ/herbs | POST | herbal product registry + interactions |
| /api/v1/integ/ai/ask | POST | LangGraph |

Events: `integ.session.completed`, `integ.herb.interaction.flagged`.

## 4) Data
```sql
CREATE TABLE integ_plans (id UUID PRIMARY KEY, patient_id INT,
  modality VARCHAR(20), goals NVARCHAR(MAX), referred_by INT, start_date DATE);
CREATE TABLE integ_sessions (id UUID PRIMARY KEY, plan_id UUID,
  session_date DATETIMEOFFSET, modality VARCHAR(20), provider_id INT,
  notes NVARCHAR(MAX), patient_response NVARCHAR(MAX));
CREATE TABLE integ_herbs (id UUID PRIMARY KEY, patient_id INT,
  herb_name VARCHAR(80), dose VARCHAR(40), source VARCHAR(80),
  interactions_json NVARCHAR(MAX), reported_at DATETIMEOFFSET);
```

### 4.2 Vector
- `kb_integrative` (NCCIH, Cochrane, WHO-TM)

## 5) Frontend
Integrative referral form, Session log, Herbal product registry, Interaction warnings panel.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard. Conservative defaults.
- BPMN: `integ_referral_pathway.bpmn`, `integ_herb_screen.bpmn`.
```gherkin
Feature: Herb-drug interaction
  Scenario: St John's Wort with SSRI
    Given patient on sertraline reports St John's Wort
    Then high-severity interaction logged, prescriber alerted
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#84cc16`. Seeders minimal. PDPL, MoH-TM regulations, advertising compliance, evidence-claim guardrails.

## 23) Risks
Reputational risk if pseudoscience over-promoted; needle reuse infection; off-label herbal contamination.
