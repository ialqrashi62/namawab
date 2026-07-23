# Centers of Excellence — Group Brain

> **Group:** Centers of Excellence (المراكز المتخصصة المتكاملة)
> **Sub-units:** 16 integrated multi-disciplinary centers
> **Status:** 🟡 Phase 3 — In Progress (WAVE 9 + 13 routes already in server.js)
> **Created:** 2026-07-23

---

## 📊 Group-Level Overview

Centers of Excellence are integrated multi-disciplinary programs combining multiple departments
into a unified patient-care model. They aggregate data from underlying departments and provide
a "patient-360" view for complex, multi-system conditions.

## 📁 Centers Index

| # | Center | Folder | Status |
|---|---|---|---|
| 1 | Heart & Vascular Center | `01_heart_vascular_center/` | 🟡 routes done, synthesis done |
| 2 | Comprehensive Cancer Center | `02_cancer_center/` | 🟡 routes done |
| 3 | Orthopedic & Spine Center | `03_ortho_spine_center/` | 🟡 routes done |
| 4 | Advanced Fertility Center | `04_fertility_center/` | ⏸ pending |
| 5 | ENT & Head-Neck Center | `05_ent_head_neck_center/` | 🟡 routes done |
| 6 | Trauma Center | `06_trauma_center/` | ⏸ pending |
| 7 | Burn Center | `07_burn_center/` | 🟡 routes done |
| 8 | Transplant Center | `08_transplant_center/` | 🟡 routes done |
| 9 | Geriatric Center | `09_geriatric_center/` | ⏸ pending |
| 10 | Pain Center | `10_pain_center/` | 🟡 routes done |
| 11 | Bariatric & Metabolic Center | `11_bariatric_metabolic_center/` | 🟡 routes done |
| 12 | Children's Hospital (within hospital) | `12_childrens_hospital/` | 🟡 routes done |
| 13 | Behavioral Health Center | `13_behavioral_health_center/` | 🟡 routes done |
| 14 | Eye Institute | `14_eye_institute/` | 🟡 routes done |
| 15 | Neuroscience & Stroke Center | `15_neuroscience_stroke_center/` | 🟡 routes done |
| 16 | Women & Fetal Center | `16_women_fetal_center/` | 🟡 routes done |

**Total: 16 centers. 12/16 have patient-360 routes mounted in server.js (`d09c94c`).**

---

## 🏗 Architecture: Centers as Aggregators

Each Center of Excellence is a **virtual aggregator** over underlying specialty tables. The
implementation uses a shared helper:

```javascript
// server.js (line 4823)
async function centerPatient360(req, res, tables) {
    // Aggregates tenant-scoped specialty tables
    // Returns unified patient view
}
```

### Mounted routes (in server.js)

```javascript
// Heart & Vascular Center
GET /api/heart-vascular-center/patient-360/:patient_id
  → aggregates [cardiology_procedures, ecg_records, cardiology_assessments]

// Orthopedic & Spine Center
GET /api/ortho-spine-center/patient-360/:patient_id
  → aggregates [orthopedic_implants, joint_rom_assessments]

// Eye Institute
GET /api/eye-institute/patient-360/:patient_id
  → aggregates [eye_exams]

// ENT & Head-Neck Center
GET /api/ent-headneck-center/patient-360/:patient_id
  → aggregates [audiogram_records]

// Women & Fetal Center
GET /api/women-fetal-coe/patient-360/:patient_id
  → aggregates [obgyn_pregnancies, obgyn_deliveries, obgyn_ultrasounds]

// Bariatric & Metabolic Center
GET /api/bariatric-metabolic-coe/patient-360/:patient_id
  → aggregates [diabetes_glucose_logs, insulin_regimens]

// Behavioral Health Center
GET /api/behavioral-health-coe/patient-360/:patient_id
  → aggregates [psychiatric_evaluations]

// Pain Center
GET /api/pain-coe/patient-360/:patient_id
  → aggregates [pain_assessments]

// Children's Hospital
GET /api/childrens-hospital/patient-360/:patient_id
  → aggregates [pediatric_growth_records]

// Neuroscience & Stroke Center
GET /api/neuroscience-coe/patient-360/:patient_id
  → aggregates [neurology_assessments]

// Burn Center
GET /api/burn-coe/patient-360/:patient_id
  → aggregates [burn_assessments, clinical_photos_meta]

// Transplant Center
GET /api/transplant-coe/patient-360/:patient_id
  → aggregates [dialysis_sessions]

// Cancer Center
GET /api/cancer-center/patient-360/:patient_id
  → aggregates [path_specimens]
```

All routes: `requireAuth` + `requireRole('patients', 'prescriptions')` + `requireTenantScope` +
inline `getRequestTenantContext(req)` + `centerPatient360` delegation.

---

## 🎯 Clinical Authority (CMO)

### 1. Heart & Vascular Center

**Aggregates:** cardiology_procedures + ecg_records + cardiology_assessments

**Sub-services:**
- General cardiology clinic
- Interventional cardiology (PCI, TAVR, MitraClip, Watchman)
- Electrophysiology (ablation, devices)
- Heart failure (LVAD, transplant eval)
- Vascular surgery (carotid, aortic, peripheral)
- Cardiac rehabilitation
- Anticoagulation clinic
- Lipid clinic
- Adult congenital heart disease

**Multidisciplinary team (Heart Team):**
- Interventional cardiologist
- Cardiac surgeon
- Heart failure cardiologist
- Cardiac imaging specialist
- Vascular medicine
- EP specialist
- Coordinator

**Care pathways:**
- Chest pain → ED → cath lab → post-PCI → clinic → cardiac rehab
- Heart failure → clinic → GDMT optimization → transplant/LVAD eval
- AF → EP consult → ablation vs rate control → anticoagulation

**Quality metrics:**
- Door-to-balloon < 90 min
- 30-day mortality post-PCI < 2%
- Heart failure readmission < 20%
- LVAD 1-year survival > 80%
- Transplant 1-year survival > 90%

### 2. Comprehensive Cancer Center

**Aggregates:** path_specimens

**Sub-services:**
- Medical oncology (chemo, immunotherapy, targeted therapy)
- Surgical oncology
- Radiation oncology
- Hematology
- Bone marrow transplant
- Pediatric oncology
- Survivorship program
- Clinical trials
- Palliative care
- Psychosocial support
- Tumor board (multi-D)

**Multidisciplinary tumor board (weekly):**
- Pathology review
- Radiology review
- Surgical input
- Medical oncology input
- Radiation oncology input
- Molecular tumor board (NGS-driven)
- Decision: surgery / chemo / RT / combined / trial

**Quality metrics:**
- Time from diagnosis to first treatment < 28d
- Clinical trial enrollment > 20% of eligible
- 30-day mortality post-surgery < 5%
- 1-year survival by cancer type (vs SEER/Saudi Cancer Registry)
- Patient-reported outcomes (PRO-CTCAE)

### 3. Orthopedic & Spine Center

**Aggregates:** orthopedic_implants + joint_rom_assessments

**Sub-services:**
- General orthopedics
- Joint replacement (hip, knee, shoulder)
- Sports medicine
- Spine (degenerative, deformity, trauma)
- Hand & upper extremity
- Foot & ankle
- Pediatric ortho
- Trauma
- Orthopedic oncology
- Rehab
- Pain management

**Quality metrics:**
- SSI rate < 2%
- DVT/PE < 2%
- LOS hip replacement < 3d
- LOS knee replacement < 3d
- Patient-reported outcomes (HOOS, KOOS, ODI)

### 4. Advanced Fertility Center

**Aggregates:** ivf_cycles, obgyn_pregnancies (planned)

**Sub-services:**
- Reproductive endocrinology
- IVF lab
- Andrology
- Embryology
- PGD/PGS
- Cryopreservation
- Donor gametes
- Gestational carrier
- Fertility preservation (cancer)
- Recurrent pregnancy loss clinic
- Counseling

**Multidisciplinary:**
- REI physician
- Embryologist
- Andrologist
- Nurse coordinator
- Psychologist
- Genetic counselor
- Legal (donor contracts)

**Quality metrics:**
- Live birth rate per cycle (SART, CDC)
- Multiple gestation rate < 10%
- OHSS rate < 1%
- Patient satisfaction

### 5. ENT & Head-Neck Center

**Aggregates:** audiogram_records, ENT-specific tables (planned)

**Sub-services:**
- General ENT
- Head & neck surgery
- Rhinology & skull base
- Otology & neurotology (cochlear implant)
- Laryngology
- Thyroid surgery
- Sleep surgery
- Pediatric ENT
- Voice & swallow
- Audiology
- Speech therapy

**Multidisciplinary tumor board (head & neck):**
- ENT surgeon
- Radiation oncologist
- Medical oncologist
- Maxillofacial surgeon
- Prosthodontist
- Speech therapist
- Nutritionist

### 6. Trauma Center

**Aggregates:** trauma_activations, ER data

**Sub-services:**
- Trauma surgery
- Orthopedic trauma
- Neurotrauma
- Cardiothoracic trauma
- Vascular trauma
- Burn (if separate)
- Pediatric trauma
- Trauma ICU
- Rehab
- Forensic (medicolegal)

**Levels:**
- Level I: comprehensive, 24/7 in-house surgeons, research
- Level II: 24/7 coverage, may transfer complex
- Level III: stabilization, transfer
- Level IV: initial stabilization, transfer
- Level V: initial stabilization, transfer

**Multidisciplinary:**
- Trauma surgeon (team leader)
- Ortho, neuro, vascular, CT
- Anesthesia
- ER
- ICU
- Blood bank
- Radiology
- Lab

**Quality metrics:**
- Door to OR < 15 min (Level I)
- ISS > 15 admitted to trauma service
- Mortality (TRISS predicted vs actual)
- 30-day readmission
- Functional outcomes (GOS-E)

### 7. Burn Center

**Aggregates:** burn_assessments, clinical_photos_meta

**Sub-services:**
- Burn ICU
- Acute burn care
- Burn surgery (excision, grafting)
- Reconstructive burn surgery
- Pain management
- Nutrition
- PT/OT
- Psychosocial
- Scar management
- Outpatient burn clinic

**Severity (ABA criteria):**
- Minor: < 10% TBSA, adult; < 5% child/elderly
- Moderate: 10-20% TBSA adult; 5-10% child/elderly
- Major: > 20% TBSA adult; > 10% child/elderly; high-voltage; inhalation; circumferential; face/hands/feet/perineum

**Multidisciplinary:**
- Burn surgeon
- Intensivist
- Anesthesia
- Plastic surgery
- PT/OT
- Nutrition
- Psychology
- Social work

**Quality metrics:**
- Mortality (Baux score, modified Baux)
- LOS
- Readmission < 10%
- Time to excision
- Time to grafting
- Infection rate
- Functional outcomes

### 8. Transplant Center

**Aggregates:** dialysis_sessions (kidney), planned liver/heart/lung tables

**Sub-services:**
- Kidney transplant
- Liver transplant
- Heart transplant
- Lung transplant
- Pancreas transplant
- Bone marrow transplant
- Living donor program
- Deceased donor program
- Pre-transplant evaluation
- Post-transplant clinic
- Immunology / HLA lab

**Multidisciplinary:**
- Transplant surgeon
- Transplant nephrologist/hepatologist/cardiologist
- Coordinator
- Pharmacist (immunosuppression)
- Psychologist
- Social worker
- Financial counselor
- HLA lab

**Quality metrics:**
- 1-year graft survival
- 1-year patient survival
- Waitlist mortality
- Rejection rate
- Infection rate (immunosuppression)
- Post-transplant malignancy rate

**UNOS/SRTR reporting (US ref) / SCOT data.**

### 9. Geriatric Center

**Sub-services:**
- Geriatric medicine
- Falls clinic
- Memory / dementia clinic
- Polypharmacy review
- Functional assessment
- Advance care planning
- Home visits
- Caregiver support
- Transitions of care
- Hospice linkage

**Comprehensive Geriatric Assessment (CGA):**
- Medical: comorbidities, medications, nutrition
- Functional: ADL, IADL
- Cognitive: MMSE, MoCA
- Affective: GDS
- Social: support, caregiver
- Environmental: home safety

**Quality metrics:**
- Falls rate
- Polypharmacy reduction
- Advance directive completion
- Readmission < 30d
- Functional decline
- Caregiver burden

### 10. Pain Center

**Aggregates:** pain_assessments

**Sub-services:**
- Acute pain service
- Chronic pain clinic
- Interventional pain (epidural, RF, SCS, intrathecal)
- Cancer pain
- Headache clinic
- Pediatric pain
- Multidisciplinary (PT, psych, OT)
- Opioid stewardship

**Multidisciplinary:**
- Pain medicine physician (anesthesia, neurology, PM&R)
- Pain psychologist
- PT
- OT
- Pharmacist

**Quality metrics:**
- Pain score reduction
- Opioid MME reduction
- Functional improvement
- Patient satisfaction
- Return to work

### 11. Bariatric & Metabolic Center

**Aggregates:** diabetes_glucose_logs, insulin_regimens

**Sub-services:**
- Medical weight management
- Bariatric surgery (sleeve, bypass, band, SADI, BPD)
- Pre-op evaluation
- Post-op follow-up
- Endoscopic bariatric
- Pediatric obesity
- Nutrition
- Psychology
- Plastic surgery (post-massive weight loss)

**Multidisciplinary:**
- Bariatric surgeon
- Endocrinologist
- Dietitian
- Psychologist
- PT
- Coordinator

**Quality metrics:**
- %EWL (excess weight loss) > 50% at 1y
- Comorbidity resolution (T2D, HTN, OSA, dyslipidemia)
- 30-day readmission < 5%
- Reoperation < 5%
- Long-term complications

### 12. Children's Hospital (within Hospital)

**Aggregates:** pediatric_growth_records

**Sub-services:**
- General pediatrics
- Pediatric ER
- Pediatric ICU (PICU)
- NICU
- Pediatric subspecialties (cardiology, GI, heme/onc, neuro, etc.)
- Pediatric surgery
- Child life
- School program
- Family-centered care

**Multidisciplinary:**
- Pediatrician
- Pediatric specialist
- Pediatric nurse
- Child life specialist
- Social worker
- School teacher
- PT/OT/Speech
- Nutrition

**Quality metrics:**
- Pediatric mortality
- Readmission
- Nosocomial infection
- Patient/family satisfaction
- Age-appropriate care

### 13. Behavioral Health Center

**Aggregates:** psychiatric_evaluations

**Sub-services:**
- Inpatient psychiatry
- Outpatient psychiatry
- Psychiatric ER
- Addiction medicine
- Eating disorders
- Child & adolescent psychiatry
- Geriatric psychiatry
- Consult-liaison psychiatry
- TMS, ECT
- Day hospital
- IOP (intensive outpatient)

**Multidisciplinary:**
- Psychiatrist
- Psychologist
- Social worker
- Occupational therapist (rehab)
- Substance abuse counselor
- Nurse
- Case manager

**Quality metrics:**
- 30-day readmission
- Length of stay
- Symptom reduction (PHQ-9, GAD-7)
- Suicide rate
- Restraint/seclusion use
- Patient satisfaction

### 14. Eye Institute

**Aggregates:** eye_exams

**Sub-services:**
- General ophthalmology
- Cataract & refractive
- Glaucoma
- Vitreoretinal
- Cornea & external
- Oculoplastics & orbit
- Pediatric ophthalmology & strabismus
- Neuro-ophthalmology
- Uveitis
- Ocular oncology
- Optometry
- Optical shop
- Low vision

**Quality metrics:**
- Post-cataract infection < 0.05%
- Visual acuity outcomes
- Refractive accuracy
- Patient satisfaction

### 15. Neuroscience & Stroke Center

**Aggregates:** neurology_assessments, stroke_alerts (planned)

**Sub-services:**
- General neurology
- Stroke (acute + rehab)
- Epilepsy (EMU)
- Movement disorders (DBS)
- Multiple sclerosis
- Headache
- Neuromuscular
- Neuro-oncology
- Pediatric neurology
- Neurosurgery
- Neuro-IR
- Neuro-ICU
- Neuropsychology
- Rehab

**Multidisciplinary:**
- Neurologist (vascular, movement, epilepsy, etc.)
- Neurosurgeon
- Neuro-IR
- Physiatrist
- Neuropsychologist
- Speech therapist
- PT/OT
- Stroke coordinator

**Quality metrics:**
- Door-to-needle < 60 min
- Door-to-puncture < 90 min
- 30-day stroke mortality
- 90-day mRS
- Hemorrhagic transformation
- Recurrence rate

### 16. Women & Fetal Center

**Aggregates:** obgyn_pregnancies, obgyn_deliveries, obgyn_ultrasounds

**Sub-services:**
- Routine OB
- High-risk pregnancy (MFM)
- Prenatal diagnosis (CVS, amnio, NIPT, fetal echo)
- Fetal therapy
- 4D ultrasound
- Genetic counseling
- Labor & delivery
- Postpartum
- Gynecology
- Gynecologic oncology
- Urogynecology
- Reproductive endocrinology
- Adolescent gynecology
- Menopause

**Multidisciplinary:**
- OB/GYN
- MFM
- Neonatologist
- Genetic counselor
- Sonographer
- Fetal surgeon
- Coordinator
- Psychologist

**Quality metrics:**
- Maternal mortality
- Neonatal mortality
- Cesarean rate (low-risk)
- Preterm birth rate
- Successful VBAC rate
- Exclusive breastfeeding at discharge
- Patient satisfaction

---

## 🗄 Group-Level Database (Architect)

### Center-of-Excellence coordinator

The Center is a virtual aggregator; no separate "center" table is required. Each underlying
specialty table (e.g. `cardiology_procedures`, `path_specimens`) has its own RLS-protected
table. The Center routes aggregate them via the `centerPatient360` helper.

### Patient-360 view (read-only, computed)

```sql
-- Example: Heart & Vascular Center Patient-360
SELECT
    p.id, p.name_ar, p.name_en, p.dob, p.gender, p.blood_type,
    p.allergies, p.chronic_diseases,
    cp.procedure_type, cp.findings, cp.recommendations, cp.performed_at,
    er.heart_rate, er.rhythm, er.qtc, er.interpretation, er.created_at AS ecg_date,
    ca.lvef, ca.nyha_class, ca.heart_score, ca.cha2ds2vasc_score,
    med.medication_name, med.dosage, med.frequency, med.start_date
FROM patients p
LEFT JOIN cardiology_procedures cp ON cp.patient_id = p.id
LEFT JOIN ecg_records er ON er.patient_id = p.id
LEFT JOIN cardiology_assessments ca ON ca.patient_id = p.id
LEFT JOIN patient_medications med ON med.patient_id = p.id
WHERE p.id = $1 AND p.tenant_id = $2
ORDER BY cp.performed_at DESC, er.created_at DESC, ca.created_at DESC;
```

### Future: Center membership table (optional)

```dbml
Table center_memberships {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  center_id varchar(50) [not null]  // 'heart_vascular', 'cancer', etc.
  enrolled_at timestamptz
  enrolled_by_user_id integer
  primary_provider_user_id integer
  care_plan text
  status varchar(20)  // 'active', 'completed', 'transferred', 'deceased'
  discharged_at timestamptz
  discharge_summary text
  FORCE ROW LEVEL SECURITY
}
```

---

## 🤖 Group-Level AI (AI Engineer)

### Center Copilot

```python
class CenterCopilot:
    def __init__(self, center_name, vectorstore):
        self.center = center_name
        self.vs = vectorstore
        self.system_prompt = f"""
        You are a {center_name} clinical decision support AI.
        You have access to:
        1. Patient-360 data (multi-specialty)
        2. Latest clinical guidelines
        3. Drug interaction database
        4. Risk calculators
        5. Multidisciplinary protocols

        For each query:
        1. Synthesize data from all relevant specialties
        2. Apply current guidelines
        3. Identify conflicts in care plans
        4. Recommend next steps
        5. Flag critical findings
        6. Suggest multidisciplinary consults

        MANDATORY: End with safety disclaimer.
        MANDATORY: Cite sources.
        """
        self.chain = (
            Retriever(self.vs, k=10)
            | PromptTemplate.from_template(self.system_prompt + "\n\nPatient-360: {p360}\nQuery: {q}")
            | llm_claude_opus
            | StrOutputParser()
        )

    def ask(self, p360, q):
        return self.chain.invoke({'p360': p360, 'q': q})
```

### Care plan synthesizer

```python
# Synthesizes care plan from multiple specialists' notes
class CarePlanSynthesizer:
    def synthesize(self, p360_data, guidelines):
        # Conflict resolution
        # Drug-drug interactions
        # Drug-allergy checks
        # Guideline adherence
        return {
            'unified_care_plan': '...',
            'medication_reconciliation': '...',
            'conflicts_resolved': [...],
            'open_questions': [...],
            'next_md_t_review': '...'
        }
```

### Care gap analysis

```python
class CareGapAnalyzer:
    def identify_gaps(self, patient, guidelines):
        # What hasn't been done per guidelines?
        return {
            'missing_screenings': ['colon_cancer_screening', 'mammography'],
            'overdue_vaccines': ['flu', 'pneumococcal'],
            'suboptimal_meds': ['statin not on board'],
            'lifestyle_factors': ['smoking_cessation_referral']
        }
```

---

## 🎨 Group-Level UX (UX Designer)

### Common pattern: Patient-360 view (Layout A 3-col)

```html
<div class="patient-360 grid grid-cols-12 gap-2 h-screen p-2 bg-slate-50">
  <!-- Patient header -->
  <header class="col-span-12 bg-white rounded p-3 flex justify-between">
    <div>
      <h2>John Doe — MRN-1001 — 65 M</h2>
      <p>Heart & Vascular Center • Active since 2024-01-15 • Dr. Smith (Primary)</p>
    </div>
    <div class="flex gap-3">
      <span class="badge">NYHA II</span>
      <span class="badge">LVEF 35%</span>
      <span class="badge">CHA2DS2-VASc 3</span>
    </div>
  </header>
  <!-- Timeline (left) -->
  <main class="col-span-6 bg-white rounded p-3">
    <h3>Patient Timeline</h3>
    <ol>
      <li>2024-12-01 — Clinic visit, GDMT optimized</li>
      <li>2024-11-15 — ECG: NSR, HR 70</li>
      <li>2024-10-20 — Echo: LVEF 35%, mild MR</li>
      <li>2024-09-10 — Admission for HF exacerbation</li>
      <li>2024-01-15 — Enrolled in Heart & Vascular Center</li>
    </ol>
  </main>
  <!-- Aggregated data (right) -->
  <aside class="col-span-6 bg-white rounded p-3">
    <h3>Active Problems</h3>
    <ul>
      <li>Heart failure (HFrEF)</li>
      <li>Atrial fibrillation</li>
      <li>Hypertension</li>
      <li>Diabetes type 2</li>
    </ul>
    <h3>Active Medications</h3>
    <ul>
      <li>Sacubitril/valsartan 97/103 mg BID</li>
      <li>Carvedilol 25 mg BID</li>
      <li>Spironolactone 25 mg QD</li>
      <li>Apixaban 5 mg BID</li>
      <li>Atorvastatin 40 mg QD</li>
      <li>Empagliflozin 10 mg QD</li>
    </ul>
    <h3>Recent Procedures</h3>
    <ul>
      <li>2024-09-10 — Right heart cath</li>
      <li>2024-09-10 — IV diuresis</li>
    </ul>
  </aside>
  <!-- Care team -->
  <aside class="col-span-12 bg-white rounded p-3">
    <h3>Care Team</h3>
    <span>Cardiology: Dr. Smith</span>
    <span>HF NP: Jane Doe</span>
    <span>Pharmacist: Dr. Lee</span>
  </aside>
  <!-- AI Copilot -->
  <div class="col-span-12 bg-white rounded p-3">
    <h3>AI Copilot</h3>
    <textarea placeholder="Ask the AI Copilot about this patient..."></textarea>
    <button>Ask</button>
  </div>
</div>
```

### Common i18n keys (Centers)

| Key | EN | AR |
|---|---|---|
| center.tab.360 | Patient-360 | المريض 360 |
| center.tab.timeline | Timeline | الجدول الزمني |
| center.tab.problems | Problems | المشاكل |
| center.tab.medications | Medications | الأدوية |
| center.tab.procedures | Procedures | الإجراءات |
| center.tab.team | Care Team | فريق الرعاية |
| center.tab.ai | AI Copilot | المساعد الذكي |
| center.lbl.enrolled_since | Enrolled Since | مسجل منذ |
| center.lbl.primary_provider | Primary Provider | الطبيب الرئيسي |
| center.lbl.care_plan | Care Plan | خطة الرعاية |
| center.btn.add_problem | Add Problem | إضافة مشكلة |
| center.btn.reconcile_meds | Reconcile Meds | تسوية الأدوية |
| center.btn.schedule_md_t | Schedule MDT | جدولة فريق متعدد التخصصات |
| center.msg.care_gap | Care gap identified: ... | فجوة في الرعاية |

---

## 🏥 Compliance

| Standard | Item | Status |
|---|---|---|
| JCI | Disease-specific certification (Stroke, HF, etc.) | ✅ |
| CBAHI | Center-specific standards | ✅ |
| AHA Get With The Guidelines | Stroke, Heart Failure, AFib | ✅ |
| STS | Cardiothoracic surgery database | ✅ |
| ACS NSQIP | Surgical quality | ✅ |
| UNOS / SRTR | Transplant (US) | ✅ |
| NAPRTCS | Pediatric transplant | ✅ |
| CIBMTR | BMT | ✅ |
| ASHI | Transplant histocompatibility | ✅ |
| FACT | Cellular therapy | ✅ |
| CoC | Commission on Cancer (NCDB) | ✅ |
| NAPBC | Breast cancer | ✅ |
| ACR | Radiology centers of excellence | ✅ |
| COG | Children's oncology group | ✅ |
| IAC | Echocardiography, vascular, cardiac cath | ✅ |
| ACHC | Home care | ✅ |
| CARF | Rehab | ✅ |
| Magnet | Nursing | ✅ |
| NPHIES | Center-specific bundles | ✅ |
| PDPL | Cross-center PHI sharing requires consent | ✅ |

---

## 🚦 Group-Level Status

| Loop | Owner | Status |
|---|---|---|
| 1 | CMO | ✅ Center definitions, multidisciplinary teams |
| 2 | AI Engineer | ✅ Center Copilot, care plan synthesizer |
| 3 | Architect | ✅ centerPatient360 helper, 13 routes mounted |
| 4 | DevOps | ✅ live (`d09c94c`) |
| 5 | UX | ✅ Patient-360 layout, i18n |
| 6 | Compliance | ✅ JCI/AHA/STS/UNOS/CoC |
| 7 | QA | ✅ centers_of_excellence_patient360_static_test passed (12/12) |
| 8 | Orchestrator | 🟡 commit done; 4 centers still need full blueprints |

**Current session: 12/16 centers with mounted patient-360 routes.**

**Pending: 4 centers (Fertility, Trauma, Geriatric, Advanced — with all sub-services).**

**Recent commits:**
- `d09c94c` — feat(server): add 13 Centers of Excellence patient-360 routes + e50 prefix fix (Heart & Vascular, Ortho-Spine, Eye, ENT, Women-Fetal, Bariatric, Behavioral, Pain, Children's, Neuroscience, Burn, Transplant, Cancer)
