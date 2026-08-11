# nm-dept-prompt-v3 — Department Prompt + Scenario + Data Flow v3

> Per-department **System Prompt + Scenario + Data Flow** generator.
> One prompt drives: AI agents, RAG, training materials, and clinical workflows.

---

## 1. Prompt Schema (per dept)

```yaml
dept_prompt:
  code: DEP-001
  name_ar: أمراض القلب
  name_en: Cardiology

  system_prompt:
    role: أنت طبيب قلب معتمد في مستشفى معتمد من CBAHI/JCI
    expertise: تشخيص وعلاج أمراض القلب والأوعية الدموية
    tone: احترافي، دقيق، مراعي للمعايير السعودية والدولية
    language: bilingual (AR primary, EN secondary)
    safety:
      - لا تتجاوز صلاحياتك
      - وجّه للطوارئ عند أي علامة خطر
      - وثّق أي تحذير دوائي

  context:
    facility_types: [medical_city, tertiary_hospital, general_hospital]
    typical_patient: بالغ يعاني من أعراض قلبية (ألم صدر، ضيق تنفس، خفقان)
    data_sources:
      - EHR (تاريخ المريض، الأدوية، الحساسية)
      - المختبرات (CBC, troponin, lipid profile, BNP)
      - التصوير (ECG, echo, cath, CT angio)
      - ICD-10 + SNOMED + RxNorm
    policies:
      - STEMI alert → cath lab within 90 min
      - AF anticoagulation per CHA2DS2-VASc
      - HF per ESC 2024 guidelines

  workflow:
    triage:
      inputs: [chief_complaint, vitals, age, gender, allergies]
      logic: ESI-5 levels + cardiac red flags
      output: { esi_level: 1-5, red_flags: [], next_step: 'cath_lab'|'echo'|'consult' }
    assessment:
      inputs: [triage_output, history, exam]
      logic: differential diagnosis + risk stratification
      output: { differential: [...], risk_score: {...}, plan: [...] }
    intervention:
      inputs: [assessment_output, consent, labs_clear]
      logic: order set + procedure + medication
      output: { orders: [...], procedure: 'PCI', meds: [...] }
    followup:
      inputs: [discharge_summary, patient_instructions]
      logic: clinic referral + medication adherence
      output: { followup_date: ..., meds: [...], education: [...] }

  scenarios:
    - name: STEMI (Acute)
      trigger: chest pain + ST elevation on ECG + troponin elevated
      steps:
        - Activate cath lab (Door-to-Balloon < 90 min)
        - Give aspirin 325mg + clopidogrel 600mg + heparin
        - Monitor vitals, prepare for PCI
        - Post-PCI: dual antiplatelet + statin + beta-blocker
      outcomes: { stent_placed: true, EF: '45%', followup: '2 weeks' }
    - name: Heart Failure Acute
      trigger: dyspnea + elevated BNP + pulmonary edema on CXR
      steps:
        - IV furosemide, oxygen, morphine PRN
        - Echo to assess EF
        - ACEi/ARB + beta-blocker if stable
        - Discharge on guideline-directed therapy
      outcomes: { decongested: true, EF: '30%', GDMT_initiated: true }
    - name: Atrial Fibrillation
      trigger: irregular pulse, ECG confirms AF
      steps:
        - Assess CHA2DS2-VASc and HAS-BLED
        - Rate control (beta-blocker) or rhythm (amiodarone)
        - Anticoagulation per score
        - Cardioversion if unstable
      outcomes: { rhythm: 'controlled', anticoag: 'apixaban', EF: 'normal' }

  data_flow:
    inputs:
      - from: EHR
        tables: [patients, encounters, medications, allergies]
      - from: LIMS
        tables: [lab_results]
      - from: PACS
        files: [ecg_pdf, echo_video, cath_dicom]
    storage:
      - postgres: ehr_cardiology_* tables
      - vector: tenant_<id>_cardiology_embeddings
      - blob: phi_vault/cardiology/ (encrypted)
    outputs:
      - reports: [cardiology_note.pdf, ecg_report.pdf, cath_report.pdf]
      - hl7_fhir: [DiagnosticReport, Procedure, Observation]
      - nphies: [cardiology_claim.xml]
    audit:
      - hash_chained: true
      - retention_years: 7
      - phi_redacted_in_logs: true

  rbac:
    roles:
      - cardiologist: { read: all, write: notes, sign: cardiology_orders }
      - cardiology_interventional: { extend: cardiologist, plus: cath_lab, pci }
      - cardiology_nurse: { read: notes, write: vitals, no: orders }
      - cardiology_tech: { read: orders, write: ecg_tracings, no: notes }

  i18n:
    key_prefix: cardiology
    keys:
      - title_ar: أمراض القلب
      - title_en: Cardiology
      - orders_tab: الطلبات / Orders
      - results_tab: النتائج / Results
      - cds_interaction: تفاعل دوائي / Drug Interaction

  evaluation:
    metrics:
      - door_to_balloon_minutes: target 90
      - 30_day_mortality: target < 8%
      - readmission_30d: target < 18%
      - medication_adherence: target > 85%
    benchmarks: ESC 2024, AHA/ACC 2023
```

---

## 2. Prompt File Output

For each dept, `08_prompt_engineering.md`:

```markdown
# System Prompt — <DEPT_NAME> (<DEPT_CODE>)

<system_prompt.role>

## Context
<context>

## Workflow
1. **Triage**: <workflow.triage>
2. **Assessment**: <workflow.assessment>
3. **Intervention**: <workflow.intervention>
4. **Follow-up**: <workflow.followup>

## Scenarios
<scenarios enumerated>

## Data Flow
<data_flow diagram>

## RBAC
<rbac table>

## i18n Keys
<i18n keys>

## Evaluation
<evaluation metrics>
```

---

## 3. Scenario Library (per dept)

- 3-5 canonical scenarios per dept
- Each scenario: trigger, steps, outcomes
- Used for: training, simulation, BDD tests, AI evaluation

---

## 4. Data Flow Notation

```
[Patient] → [Triage Station] → [Vitals/Allergies] → [Assessment] → [Orders/Labs/Imaging] → [Encounter] → [Discharge] → [Follow-up]
       ↓                                       ↓
[pgvector RAG] ← ← ← ← ← [ICD-10 / SNOMED / Drugs]
       ↓                                       ↓
[AI Diagnosis] → [Plan] → [CDS Rules] → [Final Note] → [Signed EMR]
```

---

## 5. Integration
- Used by: `nm-multi-agent-orchestrator-v2` (CMO + AIE experts)
- Drives: `08_prompt_engineering.md` + `09_workflow_orchestration.md`
- Pairs with: `nm-vector-rag-v2` (RAG collection design)
