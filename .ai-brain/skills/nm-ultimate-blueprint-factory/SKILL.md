# nm-ultimate-blueprint-factory — Generate 35-file Blueprint per Dept

> Input: dept config (1 YAML). Output: 35 files in `.ai-brain/02_MODULES/<DEP>/`.
> Token reduction: 70% via snippet reuse (nm-token-saver-pack-v2).

---

## 1. Input Config (per dept)

```yaml
dept:
  code: DEP-001
  code_short: card
  name_ar: أمراض القلب
  name_en: Cardiology
  facility_types: [medical_city, tertiary_hospital, general_hospital, specialized_hospital]
  parent_group: internal_medicine
  subspecialties: [general, interventional, electrophysiology, echo, nuclear, hf, structural, congenital]
  conditions_top10: [ACS, heart_failure, AF, HTN, valve_disease, hyperlipidemia, syncope, endocarditis, myocarditis, pulmonary_embolism]
  procedures_top20: [ECG, echo, stress_test, holter, cardiac_cath, PCI, CABG, valve_replace, pacemaker, ICD, ablation, TEE, CMR, CT_angio, pericardiocentesis, ECMO, IABP, LVAD, heart_transplant, FFR]
  scores: [CHA2DS2-VASc, HAS-BLED, HEART, TIMI, GRACE, Killip, NYHA, CCS, Wells_PE, EF]
  red_flags: [STEMI, cardiac_tamponade, aortic_dissection, cardiogenic_shock, unstable_arrhythmia, PE_massive]
  drugs_top: [aspirin, clopidogrel, warfarin, DOACs, beta_blockers, ACEi, ARBs, statins, amiodarone, digoxin]
  jci_controls: [ACC-1, ACC-2, MMU-1, MMU-2, IPSG-1, IPSG-2, IPSG-3, IPSG-4, IPSG-5, QPS-1, QPS-2]
  cbahi_controls: [CARE-1, EM-1, MM-1, PR-1, RC-1]
  pdpl_pii_categories: [name, mrn, dob, phone, email, address, national_id]
  rbac_roles: [cardiologist, cardiologist_interventional, cardiologist_ep, cardiologist_echo, cardiology_nurse, cardiology_tech]
  routes_count: 5
  openapi_version: "3.0.3"
```

---

## 2. The 35 Files (Generated)

| # | File | Snippet | Tokens (Saved) |
|---|---|---|---|
| 01 | `01_brain.md` | — | ~600 |
| 02 | `02_clinical_spec.md` | S-02 | ~600 |
| 03 | `03_ai_orchestration.md` | — | ~500 |
| 04 | `04_technical_architecture.md` | — | ~500 |
| 05 | `05_ux_ui_stitch.md` | S-07, S-18 | ~700 |
| 06 | `06_compliance_security.md` | S-12 | ~600 |
| 07 | `07_implementation_plan.md` | — | ~400 |
| 08 | `08_prompt_engineering.md` | S-06 | ~500 |
| 09 | `09_workflow_orchestration.md` | S-09 | ~400 |
| 10 | `10_langchain_chains.md` | S-06 | ~600 |
| 11 | `11_vector_mine.md` | S-11 | ~500 |
| 12 | `12_api_openapi.yaml` | S-05 | ~700 |
| 13 | `13_data_erd.sql` | S-03, S-10 | ~500 |
| 14 | `14_data_migrations_up.sql` | S-03 | ~400 |
| 15 | `15_data_migrations_down.sql` | S-03 | ~300 |
| 16 | `16_data_seed.sql` | — | ~400 |
| 17 | `17_rag_pipeline.py` | S-06 | ~700 |
| 18 | `18_backend_models.py` | S-20 | ~300 |
| 19 | `19_backend_schemas.py` | S-19 | ~300 |
| 20 | `20_backend_service.py` | S-02 | ~500 |
| 21 | `21_backend_router.py` | — | ~500 |
| 22 | `22_frontend_page.tsx` | S-18 | ~500 |
| 23 | `23_frontend_components.tsx` | S-18 | ~500 |
| 24 | `24_frontend_api_client.ts` | S-17 | ~400 |
| 25 | `25_style_guide_tokens.json` | S-07 | ~300 |
| 26 | `26_i18n_ar.json` | S-08 | ~400 |
| 27 | `27_i18n_en.json` | S-08 | ~300 |
| 28 | `28_test_unit.py` | S-04, S-14 | ~400 |
| 29 | `29_test_integration.py` | S-15 | ~500 |
| 30 | `30_test_bdd.feature` | S-16 | ~300 |
| 31 | `31_user_manual_ar.md` | S-11 | ~300 |
| 32 | `32_user_manual_en.md` | S-11 | ~300 |
| 33 | `33_training_video_script.md` | — | ~400 |
| 34 | `34_legal_compliance.md` | S-12, S-13 | ~500 |
| 35 | `35_pmo_budget.md` | — | ~500 |

**Total per dept: ~14,000 tokens (vs ~50,000 raw) → 72% saving**

---

## 3. Factory CLI

```bash
python .ai-brain/03_AUTOPILOT/generate_all_depts.py \
  --config .ai-brain/00_SYSTEM/MASTER_CATALOG_v5.yaml \
  --out .ai-brain/02_MODULES \
  --mode parallel \
  --workers 8
```

---

## 4. Generation Pipeline

```
[YAML config]
   ↓
[Validator] → check schema + completeness
   ↓
[Template engine (Jinja2)] → fill snippets (S-NN) with config
   ↓
[Parallel write] → 35 files per dept
   ↓
[Verifier] → file count + token count + completeness check
   ↓
[Index updater] → INDEX.md + DEPARTMENT_COVERAGE_MAP.md
```

---

## 5. Snippet Substitution Examples

### Input YAML
```yaml
dept: { code: DEP-001, name_ar: "أمراض القلب", name_en: "Cardiology", routes_count: 5 }
```

### Output `22_frontend_page.tsx` (using S-18)
```tsx
import { DeptPage, VitalPanel, AllergyBanner, RiskStratifier } from '@nama/stitch-medical';

export default function CardiologyPage({ tenantId, patientId, lang='ar' }: Props) {
  return (
    <DeptPage
      title_ar="أمراض القلب"
      title_en="Cardiology"
      tenantId={tenantId}
      lang={lang}
      sidebar={
        <>
          <AllergyBanner patientId={patientId} />
          <RiskStratifier scoreType="CHA2DS2-VASc" patientId={patientId} />
        </>
      }
      main={
        <VitalPanel patientId={patientId} metrics={['HR','BP','SpO2','RR']} />
      }
      tabs={[
        { id:'overview', label_ar:'نظرة', label_en:'Overview' },
        { id:'orders', label_ar:'الطلبات', label_en:'Orders' },
        { id:'results', label_ar:'النتائج', label_en:'Results' },
        { id:'notes', label_ar:'الملاحظات', label_en:'Notes' }
      ]}
    />
  );
}
```

---

## 6. Multi-Department Batch

```yaml
batch:
  - dept_codes: [DEP-001, DEP-002, DEP-003, DEP-004, DEP-005]
    parallel: true
    workers: 5
    estimated_tokens: 70000
    estimated_minutes: 8
```

---

## 7. Integration
- **Mandatory pair:** `nm-token-saver-pack-v2` (S-NN library)
- **Recommended:** `nm-multi-agent-orchestrator-v2` (parallel expert review)
- **Loop:** `nm-loop-engineering-v2` (4-cap iteration per dept)
