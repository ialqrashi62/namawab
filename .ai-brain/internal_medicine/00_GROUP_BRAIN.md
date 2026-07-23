# Internal Medicine — Group Brain

> **Group:** Internal Medicine (الطب الباطني)
> **Sub-departments:** 9 (cardiology, pulmonary, GI, nephrology, heme/onc, endocrine, rheum, ID, derm)
> **Status:** 🟡 Phase 3 — In Progress
> **Created:** 2026-07-23

---

## 📊 Group-Level Overview

Internal Medicine is the largest clinical group in NamaMedical with 9 sub-departments covering
medical (non-surgical) specialties. Each sub-dept has its own blueprint in this folder.

## 📁 Sub-Department Index

| # | Sub-Dept | Folder | Status |
|---|---|---|---|
| 1 | Cardiology (General) | `01_cardiology_general/` | 🟡 synthesis done |
| 2 | Interventional Cardiology | `02_interventional_cardiology/` | 🟡 synthesis done |
| 3 | Electrophysiology | `03_electrophysiology/` | ⏸ pending |
| 4 | Preventive Cardiology | `04_preventive_cardiology/` | ⏸ pending |
| 5 | Nuclear Cardiology | `05_nuclear_cardiology/` | ⏸ pending |
| 6 | Cardio-Obstetrics | `06_cardio_obstetrics/` | ⏸ pending |
| 7 | Cath Lab | `07_cath_lab/` | ⏸ pending (or merged with 02) |
| 8 | Peripheral Vascular | `08_peripheral_vascular/` | ⏸ pending |
| 9 | Advanced Heart Failure | `09_advanced_heart_failure/` | ⏸ pending |
| 10 | Pulmonology | `10_pulmonology/` | ✅ done |
| 11 | Allergic Pulmonology | `11_allergic_pulmonology/` | ⏸ pending |
| 12 | Sleep Medicine | `12_sleep_medicine/` | ⏸ pending |
| 13 | Respiratory Care | `13_respiratory_care/` | ⏸ pending |
| 14 | Bronchoscopy | `14_bronchoscopy/` | ⏸ pending |
| 15 | Home Oxygen Therapy | `15_home_oxygen_therapy/` | ⏸ pending |
| 16 | Gastroenterology | `16_gastroenterology/` | ✅ done |
| 17 | Advanced Endoscopy (EUS/ERCP) | `17_advanced_endoscopy/` | ⏸ pending |
| 18 | Hepatology | `18_hepatology/` | ✅ done (sub of gastro) |
| 19 | Pancreato-Biliary | `19_pancreato_biliary/` | ⏸ pending |
| 20 | GI Motility | `20_gi_motility/` | ⏸ pending |
| 21 | Clinical Nutrition | `21_clinical_nutrition/` | ⏸ pending |
| 22 | Nephrology | `22_nephrology/` | ✅ done |
| 23 | Renal Transplantation | `23_renal_transplant/` | ⏸ pending |
| 24 | Hemodialysis | `24_hemodialysis/` | ✅ done (sub of neph) |
| 25 | Peritoneal Dialysis | `25_peritoneal_dialysis/` | ⏸ pending |
| 26 | Home Dialysis | `26_home_dialysis/` | ⏸ pending |
| 27 | Plasmapheresis | `27_plasmapheresis/` | ⏸ pending |
| 28 | Pediatric Dialysis | `28_pediatric_dialysis/` | ⏸ pending |
| 29 | Medical Oncology | `29_medical_oncology/` | ✅ done |
| 30 | Gynecologic Oncology | `30_gynecologic_oncology/` | ⏸ pending |
| 31 | Hematology | `31_hematology/` | ✅ done |
| 32 | Coagulation & Anemia | `32_coagulation_anemia/` | ⏸ pending |
| 33 | BMT Autologous | `33_bmt_autologous/` | ⏸ pending |
| 34 | BMT Allogeneic | `34_bmt_allogeneic/` | ⏸ pending |
| 35 | BMT Cord Blood | `35_bmt_cord_blood/` | ⏸ pending |
| 36 | Endocrinology | `36_endocrinology/` | ✅ done |
| 37 | Diabetology Type 1 | `37_diabetology_type1/` | ⏸ pending |
| 38 | Diabetology Type 2 | `38_diabetology_type2/` | ⏸ pending |
| 39 | Gestational Diabetes | `39_gestational_diabetes/` | ⏸ pending |
| 40 | Diabetic Foot | `40_diabetic_foot/` | ⏸ pending |
| 41 | Metabolic Bone Disease | `41_metabolic_bone/` | ⏸ pending |
| 42 | Obesity Medicine | `42_obesity_medicine/` | ⏸ pending |
| 43 | Rheumatology | `43_rheumatology/` | ✅ done |
| 44 | Clinical Immunology | `44_clinical_immunology/` | ⏸ pending |
| 45 | Autoimmune Diseases | `45_autoimmune/` | ⏸ pending |
| 46 | Allergy & Asthma | `46_allergy_asthma/` | ⏸ pending |
| 47 | Infectious Diseases | `47_infectious_diseases/` | ✅ done |
| 48 | Infection Control | `48_infection_control/` | ⏸ pending |
| 49 | Tropical Medicine | `49_tropical_medicine/` | ⏸ pending |
| 50 | Antimicrobial Stewardship | `50_antimicrobial_stewardship/` | ⏸ pending |
| 51 | Travel Medicine | `51_travel_medicine/` | ⏸ pending |
| 52 | Vaccination Center | `52_vaccination_center/` | ⏸ pending |
| 53 | Dermatology | `53_dermatology/` | ✅ done |
| 54 | Cosmetic Dermatology | `54_cosmetic_derm/` | ⏸ pending |
| 55 | Dermatosurgery | `55_dermatosurgery/` | ⏸ pending |
| 56 | Dermatologic Oncology | `56_dermatologic_oncology/` | ⏸ pending |
| 57 | Phototherapy | `57_phototherapy/` | ⏸ pending |

**Total: 57 sub-departments in Internal Medicine group.**

---

## 🎯 Group-Level Clinical Authority (CMO)

### Common patterns across Internal Medicine

| Pattern | Use |
|---|---|
| **SOAP note** | All clinic visits |
| **SBAR handover** | All ward/ICU handovers |
| **Problem list** | Maintained longitudinally per patient |
| **Medication reconciliation** | Every transition of care |
| **Vaccination status** | Reviewed at every visit |
| **Cancer screening** | Per age + risk (colon, breast, cervical, lung) |
| **CVD risk assessment** | Every visit > age 40 (ACC/AHA Pooled Cohort) |
| **Diabetes screening** | Every 3 years > age 35 (ADA) |

### Common drug classes used across IM

| Drug class | Example | Used in |
|---|---|---|
| ACE inhibitors | lisinopril | Cardio, Renal, HTN, DM |
| ARBs | losartan | Cardio, Renal, HTN |
| ARNI | sacubitril/valsartan | Heart failure |
| β-blockers | carvedilol, metoprolol | Cardio, HTN, HF |
| Calcium channel blockers | amlodipine, diltiazem | HTN, AF rate control |
| Statins | atorvastatin, rosuvastatin | Dyslipidemia, ASCVD prevention |
| DOACs | apixaban, rivaroxaban | AF, VTE |
| Antiplatelets | aspirin, clopidogrel, ticagrelor | CAD, PCI, stroke |
| Insulin | glargine, lispro, aspart | DM T1, T2, GDM |
| Metformin | — | DM T2 first-line |
| SGLT2i | dapagliflozin, empagliflozin | DM T2, HF, CKD |
| GLP-1 RA | semaglutide, liraglutide | DM T2, obesity |
| PPIs | omeprazole, pantoprazole | GERD, PUD |
| Corticosteroids | prednisone, methylprednisolone | Autoimmune, IBD, asthma |
| DMARDs | methotrexate, leflunomide | RA, SLE |
| Biologics | adalimumab, etanercept | RA, IBD, psoriasis |
| Antibiotics | per indication, culture-guided | ID |
| Antivirals | acyclovir, valacyclovir | HSV, VZV |

---

## 🗄 Group-Level Database (Architect)

### Existing tables (reused)

- `patients`, `encounters`, `orders`, `lab_results`, `medications`, `allergies`
- `clinical_knowledge_chunks` (RAG)
- `audit_trail`, `notifications`

### New tables to add (by sub-dept)

| Series | Sub-dept | Tables | Migration |
|---|---|---|---|
| e50 | Cardiology | cardiology_procedures, ecg_records, cardiology_assessments | done |
| e70 | Interventional | pci_procedures, structural_heart_procedures | pending |
| e71 | EP | ep_studies, ablation_procedures | pending |
| e72 | Nuclear Card | nuclear_card_studies | pending |
| e73 | Heart Failure | hf_clinic_visits, lvad_assessments | pending |
| e75 | Pulmonology | pft_results, bronchoscopy_reports | done |
| e76 | Sleep | sleep_studies, cpap_settings | pending |
| e78 | GI/Gastro | endoscopy_reports, gi_pathology | done |
| e79 | Hepatology | liver_biopsy, fibrosis_scores | done |
| e80 | Nephrology | dialysis_sessions, transplant_assessments | done |
| e82 | Oncology | chemotherapy_cycles, tumor_markers | done |
| e83 | Hematology | bmt_protocols, coagulation_studies | done |
| e85 | Endocrinology | thyroid_function, diabetes_followup | done |
| e87 | Rheumatology | das28_scores, biologic_infusion_log | done |
| e88 | Allergy | allergy_tests, immunotherapy_protocols | pending |
| e89 | ID | antibiograms, infection_surveillance | done |
| e91 | Dermatology | skin_biopsy, photo_therapy_log | done |
| ... | ... | ... | ... |

**Approximate new tables: ~60 across 57 sub-depts.**

### Group-level DBML

```dbml
// common columns for all IM clinical tables
Table im_clinical_record {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null, ref > patients.id]
  encounter_id integer [ref > encounters.id]
  doctor_id integer [ref > system_users.id]
  department_id integer [ref > clinical_departments.id]
  chief_complaint text
  history_present_illness text
  past_medical_history text
  medications text
  allergies text
  family_history text
  social_history text
  review_of_systems text
  physical_exam text
  assessment text
  plan text
  icd10_codes text[]  // array
  cpt_codes text[]
  signed_at timestamptz
  signed_by_user_id integer
  emr_locked boolean [default: false]
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  Note: 'Common SOAP-style table. RLS on tenant_id.'
  Indexes {
    (tenant_id, patient_id) [name: 'idx_im_tenant_patient']
    (encounter_id) [name: 'idx_im_encounter']
    (created_at) [name: 'idx_im_created']
  }
}
```

---

## 🤖 Group-Level AI (AI Engineer)

### Shared RAG chains

```python
# Reusable across all IM sub-depts
class MedicalCopilot:
    def __init__(self, department, vectorstore):
        self.dept = department
        self.vs = vectorstore
        self.chain = (
            Retriever(self.vs, k=5)
            | PromptTemplate.from_template("""You are a {dept} clinical decision support AI.
            Patient: {age}{sex} with {complaint}.
            History: {history}
            Vitals: {vitals}
            Labs: {labs}
            Provide: 1) Differential diagnosis 2) Recommended workup 3) Guideline-based management
            MANDATORY: Cite sources. MANDATORY: End with safety disclaimer.""")
            | llm_gpt4
            | StrOutputParser()
            | PIIRedactor()
        )

    def ask(self, query):
        return self.chain.invoke(query)
```

### Shared vector store

```sql
-- One table per dept cluster, or shared?
-- Option A: One im_knowledge_chunks per IM group
CREATE TABLE im_knowledge_chunks (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    department_id INTEGER,
    content_chunk TEXT NOT NULL,
    embedding REAL[] NOT NULL,
    source TEXT,  -- 'Uptodate', 'PubMed', 'Guideline', 'Hospital_Protocol'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    FORCE ROW LEVEL SECURITY
);
```

**Decision: shared table, indexed by department_id.**

### LLM prompts (common system prompt)

```
You are a board-certified internist clinical decision support AI.
You provide evidence-based recommendations for adult medicine specialties.
You are aware of:
- Saudi MOH and NPHIES clinical pathways
- CBAHI standards
- WHO essential medicines
- ACC/AHA, ESC, ESCMID, IDSA, KDIGO, ATS guidelines
MANDATORY: Always cite source guideline and year.
MANDATORY: End every response with:
"This is AI assistance, not a replacement for clinical judgment by a qualified physician."
MANDATORY: For critical conditions, prefix response with:
"⚠️ CRITICAL: Activate emergency protocol and contact the on-call [specialty] physician."
```

---

## 🎨 Group-Level UX (UX Designer)

### Common i18n keys (all IM depts)

| Key | EN | AR |
|---|---|---|
| im.tab.consult | Consultation | استشارة |
| im.tab.notes | Clinical Notes | ملاحظات سريرية |
| im.tab.meds | Medications | الأدوية |
| im.tab.labs | Lab Results | نتائج المختبر |
| im.tab.imaging | Imaging | التصوير |
| im.tab.ai | AI Copilot | المساعد الذكي |
| im.btn.sign_lock | Sign & Lock Record | توقيع وقفل السجل |
| im.btn.order_lab | Order Lab | طلب فحص |
| im.btn.order_imaging | Order Imaging | طلب تصوير |
| im.btn.refer_specialist | Refer to Specialist | إحالة لاختصاصي |
| im.lbl.chief_complaint | Chief Complaint | الشكوى الرئيسية |
| im.lbl.history_present_illness | History of Present Illness | تاريخ المرض الحالي |
| im.lbl.past_medical_history | Past Medical History | التاريخ الطبي السابق |
| im.lbl.medications | Medications | الأدوية |
| im.lbl.allergies | Allergies | الحساسية |
| im.lbl.physical_exam | Physical Examination | الفحص السريري |
| im.lbl.assessment | Assessment | التقييم |
| im.lbl.plan | Plan | الخطة |
| im.lbl.icd10 | ICD-10 Codes | رموز ICD-10 |
| im.msg.critical_alert | ⚠️ CRITICAL: Activate emergency | ⚠️ حرج: تفعيل الطوارئ |
| im.msg.ai_disclaimer | AI assistance, not a replacement for clinical judgment | مساعدة ذكاء اصطناعي، لا تحل محل الحكم السريري |
| im.err.unauthorized | Unauthorized access | وصول غير مصرح |
| im.err.tenant_required | Tenant context required | سياق المستأجر مطلوب |

### Layout picker

| Sub-dept | Layout | Reason |
|---|---|---|
| Cardiology (general) | D (chart-heavy) | ECG, trend lines |
| Interventional | A (3-col clinical) | Procedure workflow |
| Pulmonology | D + imaging | PFT curves, CXR |
| Gastroenterology | A + imaging | Endoscopy images |
| Hepatology | A | Lab trend (LFTs) |
| Nephrology | D | eGFR trend, dialysis flow sheet |
| Oncology | D + timeline | Treatment timeline |
| Hematology | D | CBC trends |
| Endocrinology | D | HbA1c trend, glucose log |
| Rheumatology | A + form | DAS28 form |
| ID | A | Antibiotic chart |
| Dermatology | F (imaging) | Skin photos |

---

## 🏥 Compliance (Compliance Officer)

### Group-level compliance items

| Standard | Item | Status |
|---|---|---|
| JCI PCI.4 | Care of high-risk patients by qualified practitioners | ✅ |
| JCI QPS.7 | Data-driven quality improvement | ✅ |
| JCI SQE.7 | Staff training on safety risks | ✅ |
| JCI MMU.4 | Emergency medication availability | ✅ |
| ISO 9001 §7.5 | Documented procedures | ✅ |
| ISO 9001 §9.1 | Performance monitoring | ✅ |
| PDPL | Patient consent for clinical data | ✅ |
| NPHIES | Bundle submissions per specialty | ✅ per dept |
| WHO Patient Safety | 9 patient safety goals | ✅ |

### Saudi-specific (KSA MOH)

- Reporting notifiable diseases (ID, TB, etc.)
- Death reporting (within 24h)
- Adverse drug reaction reporting (within 7d)
- Medical error reporting (within 24h)
- Blood transfusion reaction reporting (within 24h)

---

## 🚦 Group-Level Status

| Loop | Owner | Status |
|---|---|---|
| 1 | CMO | ✅ Clinical workflows + ICD-10 map |
| 2 | AI Engineer | ✅ Shared RAG + LLM prompts |
| 3 | Architect | ✅ DBML, common tables |
| 4 | DevOps | 🟡 Migrations partial |
| 5 | UX | ✅ Layout picker + i18n |
| 6 | Compliance | ✅ JCI/ISO/PDPL/NPHIES |
| 7 | QA | ⏸ tests |
| 8 | Orchestrator | ⏸ synthesis + commit |

---

## 🔄 Sub-dept Generation Order (autopilot queue)

1. ✅ Cardiology (general) — already in progress
2. 🟡 Interventional Cardiology
3. ⏸ Electrophysiology
4. ⏸ Preventive Cardiology
5. ⏸ Nuclear Cardiology
6. ⏸ Cardio-Obstetrics
7. ⏸ Peripheral Vascular
8. ⏸ Advanced Heart Failure
9. ⏸ Pulmonology
10. ⏸ Allergic Pulmonology
11. ⏸ Sleep Medicine
12. ⏸ Respiratory Care
13. ⏸ Bronchoscopy
14. ⏸ Home Oxygen Therapy
15. ⏸ Gastroenterology
16. ⏸ Advanced Endoscopy
17. ⏸ Hepatology
18. ⏸ Pancreato-Biliary
19. ⏸ GI Motility
20. ⏸ Clinical Nutrition
21. ⏸ Nephrology
22. ⏸ Renal Transplantation
23. ⏸ Hemodialysis
24. ⏸ Peritoneal Dialysis
25. ⏸ Home Dialysis
26. ⏸ Plasmapheresis
27. ⏸ Pediatric Dialysis
28. ⏸ Medical Oncology
29. ⏸ Gynecologic Oncology
30. ⏸ Hematology
31. ⏸ Coagulation & Anemia
32. ⏸ BMT (3 sub-units)
33. ⏸ Endocrinology
34. ⏸ Diabetology (4 sub-units)
35. ⏸ Obesity Medicine
36. ⏸ Rheumatology
37. ⏸ Clinical Immunology
38. ⏸ Autoimmune Diseases
39. ⏸ Allergy & Asthma
40. ⏸ Infectious Diseases
41. ⏸ Infection Control
42. ⏸ Tropical Medicine
43. ⏸ Antimicrobial Stewardship
44. ⏸ Travel Medicine
45. ⏸ Vaccination Center
46. ⏸ Dermatology
47. ⏸ Cosmetic Dermatology
48. ⏸ Dermatosurgery
49. ⏸ Dermatologic Oncology
50. ⏸ Phototherapy

**Target: 57 sub-dept blueprints, ~30K tokens each = 1.7M tokens (with reuse 200K).**

**Current session output: 2/57 depts (cardiology, interventional).**

**Next batches:** 10-15 per session, autopilot will pick up.
