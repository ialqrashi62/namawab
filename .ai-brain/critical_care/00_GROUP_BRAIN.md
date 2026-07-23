# Critical Care, Emergency & Anesthesia — Group Brain

> **Group:** Critical Care & Emergency (العناية المركزة والطوارئ والألم)
> **Sub-departments:** 3 main groups, 50+ sub-specialties
> **Status:** 🟡 Phase 3 — In Progress
> **Created:** 2026-07-23

---

## 📊 Group-Level Overview

Covers Emergency Department (10 sub-units), Intensive Care Units (12 sub-types), and Anesthesia & Pain Management (10 sub-specialties). High-acuity, time-sensitive care with critical safety implications.

## 📁 Sub-Specialty Index

### Emergency Department (10 sub-units)
| # | Sub-Unit | Folder | Status |
|---|---|---|---|
| 1 | General ER | `01_general_er/` | ⏸ pending |
| 2 | Trauma Center (Level I/II) | `02_trauma_center/` | ⏸ pending |
| 3 | Chest Pain Unit | `03_chest_pain_unit/` | ⏸ pending |
| 4 | Stroke Unit / Code Stroke | `04_stroke_unit/` | ⏸ pending |
| 5 | Psychiatric Emergency | `05_psych_emergency/` | ⏸ pending |
| 6 | Pediatric ER | `06_pediatric_er/` | ⏸ pending |
| 7 | Toxicology Emergency | `07_toxicology_er/` | ⏸ pending |
| 8 | Hyperthermia/Hypothermia Unit | `08_thermal_er/` | ⏸ pending |
| 9 | Triage | `09_triage/` | ⏸ pending |
| 10 | Observation Unit | `10_observation/` | ⏸ pending |
| 11 | Minor Surgery ER | `11_minor_surgery_er/` | ⏸ pending |

### Intensive Care Units (12 sub-types)
| # | ICU Type | Folder | Status |
|---|---|---|---|
| 12 | Medical ICU (MICU) | `12_micu/` | ⏸ pending |
| 13 | Surgical ICU (SICU) | `13_sicu/` | ⏸ pending |
| 14 | Trauma ICU | `14_trauma_icu/` | ⏸ pending |
| 15 | Coronary Care Unit (CCU) | `15_ccu/` | ⏸ pending |
| 16 | Neuro ICU | `16_neuro_icu/` | ⏸ pending |
| 17 | Pediatric ICU (PICU) | `17_picu/` | ⏸ pending |
| 18 | Neonatal ICU (NICU) | `18_nicu/` | ⏸ pending (covered in peds) |
| 19 | Burn ICU | `19_burn_icu/` | ⏸ pending |
| 20 | Onc ICU | `20_onc_icu/` | ⏸ pending |
| 21 | Renal ICU / Dialysis ICU | `21_renal_icu/` | ⏸ pending |
| 22 | Transplant ICU | `22_transplant_icu/` | ⏸ pending |
| 23 | Obstetric ICU (OB ICU) | `23_ob_icu/` | ⏸ pending |

### Anesthesia & Pain Management (10 sub-specialties)
| # | Sub-Specialty | Folder | Status |
|---|---|---|---|
| 24 | Anesthesiology (General) | `24_anesthesia_general/` | ⏸ pending |
| 25 | Obstetric Anesthesia | `25_ob_anesthesia/` | ⏸ pending |
| 26 | Pediatric Anesthesia | `26_peds_anesthesia/` | ⏸ pending |
| 27 | Cardiac Anesthesia | `27_cardiac_anesthesia/` | ⏸ pending |
| 28 | Interventional Pain Management | `28_interventional_pain/` | ⏸ pending |
| 29 | Spinal Cord Stimulator | `29_scs/` | ⏸ pending |
| 30 | Intrathecal Pumps | `30_intrathecal_pumps/` | ⏸ pending |
| 31 | PACU | `31_pacu/` | ⏸ pending |
| 32 | Hyperbaric Oxygen (HBOT) | `32_hbot/` | ⏸ pending |
| 33 | Chronic Pain Clinic | `33_chronic_pain/` | ⏸ pending |

**Total: 33 sub-depts in Critical Care/Emergency/Anesthesia.**

---

## 🎯 Group-Level Clinical Authority (CMO)

### Emergency Department

**Triage (ESI - Emergency Severity Index, 5-level):**

| Level | Acuity | Examples | Time to provider |
|---|---|---|---|
| 1 | Resuscitation | Cardiac arrest, severe trauma, unresponsive | Immediate |
| 2 | Emergent | Stroke, STEMI, severe respiratory distress, suicidal | < 10 min |
| 3 | Urgent | Abdominal pain, fever in infant, fractures | < 30 min |
| 4 | Less urgent | Minor lacerations, simple UTI | < 60 min |
| 5 | Non-urgent | Sore throat, rash, prescription refill | < 120 min |

**ESI decision rules:**
1. Does the patient require immediate life-saving intervention? → ESI 1
2. Is this a high-risk situation? (confusion, severe pain, vitals off) → ESI 2
3. How many resources will the patient need?
   - 0 resources → ESI 5
   - 1 resource → ESI 4
   - 2+ resources → ESI 3
4. What's the patient's vitals?
   - Danger zone (HR > 100, RR > 20) → upgrade to ESI 2

**Stroke recognition (FAST + BE-FAST):**
- Face droop
- Arm weakness
- Speech difficulty
- Time of onset (critical for tPA window)
- Balance loss
- Eyes (vision change)
- Face (other)

**Door-to-Needle tPA target: 60 min; Door-to-Puncture (thrombectomy): 90 min**

**Trauma primary survey (ABCDE):**
- A: Airway + C-spine
- B: Breathing
- C: Circulation (hemorrhage control)
- D: Disability (neuro, GCS)
- E: Exposure (full exam)

**Trauma activation criteria (Level I):**
- Penetrating injury to head, neck, torso
- GCS < 9
- SBP < 90
- HR > 120 or < 50
- RR < 10 or > 30
- Fall > 20 feet
- MVC with ejection
- Major burn
- Amputation

### ICU

**Daily ICU workflow:**
1. Pre-round (review labs, imaging, overnight events)
2. Multidisciplinary rounds (intensivist, nurse, RT, pharmacist, nutritionist, social)
3. Daily goals sheet
4. Family update
5. Order updates
6. Evening sign-out

**ICU monitoring (continuous):**
- ECG (HR, rhythm)
- BP (invasive arterial line if unstable)
- SpO2 (continuous pulse ox)
- RR (impedance or capnography)
- Temperature
- Urine output (Foley)
- Ventilator parameters (if intubated)
- ICP (if neuro)

**Ventilator settings (initial):**
| Mode | Description | Use |
|---|---|---|
| AC/VC | Assist Control, Volume Control | Most intubated patients |
| SIMV | Synchronized Intermittent Mandatory | Weaning |
| PSV | Pressure Support | Spontaneous breathing trial |
| PRVC | Pressure Regulated Volume Control | Lung protection |

**Initial settings:**
- TV: 6-8 mL/kg PBW (lung-protective)
- RR: 12-20
- PEEP: 5 cmH2O
- FiO2: titrate SpO2 90-95%
- Plateau pressure: < 30 cmH2O

**ARDS (Berlin definition):**
- Mild: PaO2/FiO2 200-300
- Moderate: 100-200
- Severe: < 100
- All with bilateral infiltrates, not from cardiac failure

**Sepsis (Sepsis-3):**
- Sepsis = infection + organ dysfunction (SOFA ≥ 2)
- Septic shock = vasopressor needed to maintain MAP ≥ 65 + lactate > 2 despite adequate fluid

**Hour-1 bundle:**
1. Measure lactate
2. Obtain blood cultures before antibiotics
3. Administer broad-spectrum antibiotics
4. Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate ≥ 4
5. Apply vasopressors if hypotensive during/after fluid resuscitation

**Glasgow Coma Scale (GCS):**
- Eye: 1-4
- Verbal: 1-5
- Motor: 1-6
- Total: 3-15
- Severe TBI: GCS ≤ 8 (intubate)

**SOFA Score (Sequential Organ Failure Assessment):**
| System | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Respiratory (PaO2/FiO2) | ≥ 400 | < 400 | < 300 | < 200 (with vent) | < 100 (with vent) |
| Coagulation (platelets) | ≥ 150 | < 150 | < 100 | < 50 | < 20 |
| Liver (bilirubin) | < 1.2 | 1.2-1.9 | 2.0-5.9 | 6.0-11.9 | ≥ 12.0 |
| Cardiovascular | MAP ≥ 70 | MAP < 70 | Dop ≤ 5 or Dob (any) | Dop > 5, Epi ≤ 0.1, Norepi ≤ 0.1 | Dop > 15, Epi > 0.1, Norepi > 0.1 |
| CNS (GCS) | 15 | 13-14 | 10-12 | 6-9 | < 6 |
| Renal (creatinine) | < 1.2 | 1.2-1.9 | 2.0-3.4 | 3.5-4.9 or UO < 500 mL/d | ≥ 5.0 or UO < 200 mL/d |

**APACHE II (Acute Physiology And Chronic Health Evaluation):**
- 12 variables, age, chronic health
- Score 0-71
- Mortality correlation

**Sedation scoring (Richmond Agitation-Sedation Scale RASS):**
- +4: Combative
- +3: Very agitated
- +2: Agitated
- +1: Restless
- 0: Alert and calm
- -1: Drowsy
- -2: Light sedation
- -3: Moderate sedation
- -4: Deep sedation
- -5: Unarousable

**Delirium screening (CAM-ICU):**
- Feature 1: Acute onset/fluctuating mental status
- Feature 2: Inattention
- Feature 3: Altered level of consciousness
- Feature 4: Disorganized thinking
- Positive: Features 1+2 + 3 or 4

### Anesthesia

**Pre-op evaluation (ASA standard):**
- NPO status (clear liquids 2h, light meal 6h, fatty meal 8h)
- Airway assessment (Mallampati)
- Cardiopulmonary risk
- Labs (CBC, coags, chem, EKG, CXR as indicated)
- Anesthesia plan
- Consent (anesthesia + procedure)

**Mallampati Score:**
- Class I: Soft palate, uvula, pillars visible
- Class II: Soft palate, uvula visible
- Class III: Soft palate, base of uvula visible
- Class IV: Only hard palate visible
- Higher class = more difficult intubation

**ASA Physical Status (1-6):**
- I: Normal healthy
- II: Mild systemic disease
- III: Severe systemic disease
- IV: Severe systemic disease, constant threat
- V: Moribund
- VI: Brain dead

**Anesthesia types:**
- General (GA): unconscious, intubated
- Regional: spinal, epidural, peripheral nerve block
- Monitored Anesthesia Care (MAC): sedation + local
- Local: surgeon-administered

**Airway management (Difficult Airway Algorithm - ASA):**
- Assess airway (Mallampati, mouth opening, neck mobility, thyromental distance)
- Plan A: facemask ventilation + standard intubation
- Plan B: supraglottic (LMA)
- Plan C: surgical airway (cricothyroidotomy)
- Plan D: awake fiberoptic

**Pain management ladder (WHO):**
- Step 1: Non-opioid (acetaminophen, NSAID)
- Step 2: Mild opioid (codeine, tramadol) for mild-moderate
- Step 3: Strong opioid (morphine, fentanyl, hydromorphone) for moderate-severe
- ± adjuvant: gabapentin, TCA, muscle relaxant, topical

**Multimodal analgesia (ERAS):**
- Acetaminophen 1g q6h
- Celecoxib 200mg q12h (if no contraindication)
- Gabapentin 300mg TID
- Lidocaine patch
- Opioid PRN (lowest effective dose)

**Regional anesthesia common blocks:**
- Spinal
- Epidural (lumbar, thoracic, cervical)
- Brachial plexus (interscalene, supraclavicular, infraclavicular, axillary)
- Femoral
- Sciatic
- TAP (transversus abdominis plane)
- ESP (erector spinae plane)
- PENG (pericapsular nerve group)
- iPACK (interspace between popliteal artery and capsule of knee)

**Anesthesia complications monitoring:**
- Malignant hyperthermia (rare, fatal if untreated)
- Local anesthetic systemic toxicity (LAST)
- Awareness under anesthesia
- Post-op cognitive dysfunction
- Post-op nausea/vomiting (PONV)

**Malignant Hyperthermia:**
- Triggers: succinylcholine, volatile anesthetics
- Signs: hyperthermia, muscle rigidity, tachycardia, hypercarbia
- Treatment: dantrolene 2.5 mg/kg IV bolus, cooling, treat hyperkalemia

---

## 🗄 Group-Level Database (Architect)

### Existing (reused)
- `patients`, `encounters`, `orders`, `lab_results`, `medications`
- `icu_scoring` engine (SOFA, APACHE, GCS already implemented)
- `ews_engine` (MEWS, PEWS, qSOFA)

### New tables

| Series | Migration | Tables |
|---|---|---|
| e50e | er_triage, er_encounters, er_disposition | ER core |
| e51e | trauma_activations, trauma_assessments | Trauma |
| e52e | stroke_alerts, stroke_thrombolysis | Stroke |
| e53e | icu_admissions, icu_daily, icu_intake_output, icu_ventilator_settings | ICU core |
| e54e | anesthesia_records, anesthesia_preop, anesthesia_intraop | Anesthesia |
| e55e | pain_assessments, pain_procedures | Pain |
| e56e | pacu_records, postop_complications | PACU |
| e57e | hbot_sessions | HBOT |

### DBML (excerpt)

```dbml
Table er_triage {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  arrival_time timestamptz
  triage_time timestamptz
  esi_level integer  // 1-5
  chief_complaint text
  pain_score integer  // 0-10
  vital_signs jsonb
  allergy_check boolean
  pregnancy_status varchar(20)  // 'unknown', 'no', 'yes', 'unable'
  mode_of_arrival varchar(50)  // 'self', 'ambulance', 'wheelchair', 'stretcher'
  triage_nurse_id integer
  room_assigned varchar(20)
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table trauma_activations {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  activation_time timestamptz
  activation_level varchar(20)  // 'level_1', 'level_2', 'consultation'
  mechanism varchar(100)
  injury_summary text
  airway_status varchar(50)
  breathing_status varchar(50)
  circulation_status varchar(50)
  disability_gcs integer
  exposure_findings text
  primary_survey_completed_at timestamptz
  secondary_survey_completed_at timestamptz
  team_lead_id integer
  activated_by_user_id integer
  outcome varchar(50)
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table stroke_alerts {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  activation_time timestamptz
  symptom_onset_time timestamptz  // last known well
  fast_score integer
  nihss_score integer
  ct_brain_done boolean
  ct_brain_findings text
  tpa_eligible boolean
  tpa_administered boolean
  tpa_dose_mg decimal(5,2)
  tpa_administered_at timestamptz
  thrombectomy_eligible boolean
  thrombectomy_done boolean
  door_to_needle_min integer
  door_to_puncture_min integer
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table icu_admissions {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  admission_time timestamptz
  discharge_time timestamptz
  icu_type varchar(50)  // 'micu', 'sicu', 'ccu', 'neuro', 'picu', 'nicu', etc.
  admission_diagnosis text
  aps_score integer
  apache_ii integer
  sofa_score integer
  reason_for_icu text
  intubation_status varchar(50)
  vasopressor_use boolean
  crrt_status varchar(50)  // continuous renal replacement therapy
  isolation_status varchar(50)
  code_status varchar(50)  // 'full', 'dnr', 'dnr_dni', 'and', 'comfort'
  attending_intensivist_id integer
  disposition varchar(50)  // 'discharged', 'transferred', 'deceased'
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table icu_daily {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  icu_admission_id integer [ref > icu_admissions.id]
  assessment_date date
  sofa_score integer
  rass_score integer
  cam_icu_positive boolean
  vent_settings jsonb
  vasopressor_doses jsonb
  intake_output_ml integer
  iv_fluids_ml integer
  urine_output_ml integer
  drains_output_ml integer
  weight_kg decimal(5,2)
  nutrition_kcal integer
  protein_g decimal(5,1)
  blood_glucose_avg decimal(4,1)
  antibiotic_summary text
  culture_results_summary text
  imaging_summary text
  daily_goals text
  assessed_by integer
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table anesthesia_records {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  surgical_case_id integer [ref > surgical_cases.id]
  preop_assessment_id integer [ref > preop_assessments.id]
  anesthesia_type varchar(50)  // 'GA', 'regional', 'MAC', 'local'
  asa_class varchar(5)
  mallampati_class varchar(5)
  airway_management text
  anesthesia_drugs jsonb  // [{drug, dose, route, time}]
  iv_fluids_ml integer
  ebl_ml integer
  urine_output_ml integer
  blood_products_ml integer
  intraop_vitals jsonb  // {time: [hr, sbp, dbp, spo2, etco2, temp]}
  intraop_events text
  complications text
  emergence_time timestamptz
  extubation_time timestamptz
  pacu_handoff_time timestamptz
  anesthesiologist_id integer
  crna_id integer
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table pain_assessments {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  assessment_date timestamptz
  pain_score integer  // 0-10 numeric rating scale
  pain_locations jsonb
  pain_character varchar(100)
  pain_duration varchar(50)
  aggravating_factors text
  relieving_factors text
  functional_impact text
  opioid_use_24h_meq decimal(5,2)  // morphine equivalent dose
  pain_catastrophizing_score integer
  neuropathic_pain_questionnaire_score integer
  current_medications text
  assessed_by integer
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}
```

### Engines (already implemented + new)

```javascript
// icu_scoring.js (existing)
- calculateSOFA(params) → SOFA score
- calculateAPACHE_II(params) → APACHE II
- calculateGCS(eye, verbal, motor) → GCS

// ews_engine.js (existing)
- calculateMEWS → MEWS
- calculatePEWS → PEWS
- calculateqSOFA → qSOFA

// critical_care_engine.js (new)
- calculateRASS(level) → RASS score
- assessCAMICU(features) → CAM-ICU positive
- calculateCharlson(comorbidities) → Charlson Comorbidity Index
- calculateCHA2DS2VASC → already exists
- calculateNIHSS(strokeAssessment) → NIHSS stroke scale
- assessTraumaActivation(criteria) → Level I/II/consult
- assessTpaEligibility(stroke) → tPA window
- classifyARDS(pfRatio) → ARDS severity
- identifySepsis(qsofa, organDysfunction) → sepsis screen

// pain_engine.js
- calculateOpioidMeq(drug, dose, route) → morphine equivalent
- classifyPainType(character, location) → nociceptive/neuropathic/mixed
- assessOpioidRisk(factors) → risk of misuse
```

---

## 🤖 Group-Level AI (AI Engineer)

### Sepsis early warning AI

```python
class SepsisPredictor:
    def predict(self, vitals, labs, clinical_features):
        # Multi-modal model: vitals + labs + nursing notes
        # Predicts 6-hour ahead sepsis onset
        features = self.extract_features(vitals, labs, clinical_features)
        risk = self.model.predict_proba(features)
        return {
            'risk_score': risk,
            'risk_level': 'high' if risk > 0.7 else 'moderate' if risk > 0.4 else 'low',
            'recommendation': 'sepsis bundle' if risk > 0.7 else 'monitor',
            'top_risk_factors': self.explain(features)
        }
```

### Stroke triage AI (Viz.ai, Aidoc integration)

```python
class StrokeTriage:
    def analyze_ct_brain(self, dicom_data):
        # LVO (large vessel occlusion) detection
        return {
            'lvo_detected': True/False,
            'location': 'M1',  # or M2, ICA, etc.
            'aspects_score': 8,  # Alberta Stroke Program Early CT Score
            'door_to_puncture_target_min': 90,
            'recommendation': 'activate_thrombectomy'
        }
```

### Trauma triage AI

```python
class TraumaTriage:
    def assess_need(self, vitals, mechanism, injury_pattern):
        # PREDICT mortality
        return {
            'mortality_risk': 'X%',
            'activation_level': 'level_1'/'level_2'/'consult',
            'massive_transfusion_protocol': True/False,
            'icu_admission_likely': True/False
        }
```

### ICU RAG chain

```python
chain_icu = (
    Retriever(vectorstore, k=10)  # SCCM guidelines, Surviving Sepsis, etc.
    | PromptTemplate.from_template("""ICU patient: {age}{sex}, admission dx: {dx}.
        Current: SOFA {sofa}, on {support}.
        Question: {question}""")
    | llm_claude_opus
    | StrOutputParser()
)
```

### Anesthesia AI

```python
# Pre-op risk assessment
class AnesthesiaAI:
    def assess_aira_risk(self, patient, surgery, history):
        # Airway, Intraop, Recovery, Anesthesia risk
        return {
            'airway_risk': 'difficult',
            'malignant_hyperthermia_risk': 'low',
            'last_risk': 'low',
            'nausea_risk': 'moderate',
            'recommendation': 'general_vs_regional'
        }
```

---

## 🎨 Group-Level UX (UX Designer)

### Common patterns

| Sub-dept | Layout | Reason |
|---|---|---|
| ER | E (Timeline) | Triage → workup → disposition |
| Trauma | E (Timeline) | Primary → secondary survey |
| ICU | E (Timeline) + D | Daily trends, multi-system |
| Anesthesia | G (Form) | Pre-op, intraop, postop forms |
| Pain | G (Form) | Pain questionnaire, multimodal orders |

### ER-specific UI

```html
<div class="er-board grid grid-cols-5 gap-2 h-screen bg-slate-50 p-2">
  <!-- ESI 1 column (red) -->
  <div class="esi1 bg-red-100 p-2">
    <h2 class="text-sm font-bold text-red-900">ESI 1 — Resuscitation</h2>
    <div class="patient-card bg-red-200">Room 1: John Doe, STEMI</div>
  </div>
  <!-- ESI 2 column (orange) -->
  <div class="esi2 bg-orange-100 p-2">
    <h2 class="text-sm font-bold text-orange-900">ESI 2 — Emergent</h2>
    <div class="patient-card">Room 5: Jane Smith, chest pain</div>
  </div>
  <!-- ESI 3 (yellow) -->
  <div class="esi3 bg-yellow-100 p-2">
    <h2 class="text-sm font-bold text-yellow-900">ESI 3 — Urgent</h2>
  </div>
  <!-- ESI 4 (green) -->
  <div class="esi4 bg-green-100 p-2">
    <h2 class="text-sm font-bold text-green-900">ESI 4 — Less Urgent</h2>
  </div>
  <!-- ESI 5 (blue) -->
  <div class="esi5 bg-blue-100 p-2">
    <h2 class="text-sm font-bold text-blue-900">ESI 5 — Non-Urgent</h2>
  </div>
</div>
```

### ICU-specific UI

```html
<div class="icu-dashboard grid grid-cols-12 gap-2 h-screen p-2 bg-slate-50">
  <!-- Patient header -->
  <header class="col-span-12 bg-white rounded p-3 flex justify-between">
    <div>
      <h1>John Doe — Room 12</h1>
      <p>MICU • Day 4 • Intubated</p>
    </div>
    <div class="flex gap-3">
      <span>SOFA: 8</span>
      <span>APACHE: 22</span>
      <span>RASS: -2</span>
    </div>
  </header>
  <!-- Vitals trend (left) -->
  <div class="col-span-7 bg-white rounded p-3">
    <h3>Vitals (24h)</h3>
    <canvas id="hr-trend"></canvas>
    <canvas id="map-trend"></canvas>
    <canvas id="spo2-trend"></canvas>
  </div>
  <!-- Labs (right) -->
  <div class="col-span-5 bg-white rounded p-3">
    <h3>Labs (Latest)</h3>
    <table>
      <tr><td>Hgb</td><td>8.5 ↓</td></tr>
      <tr><td>WBC</td><td>14.2 ↑</td></tr>
      <tr><td>Cr</td><td>1.8 ↑</td></tr>
      <tr><td>Lactate</td><td>2.3 ↑</td></tr>
    </table>
  </div>
  <!-- I/O (left) -->
  <div class="col-span-6 bg-white rounded p-3">
    <h3>Intake/Output (24h)</h3>
    <p>In: 4500 mL</p>
    <p>Out: 3800 mL</p>
    <p>Balance: +700 mL</p>
  </div>
  <!-- Vent settings (right) -->
  <div class="col-span-6 bg-white rounded p-3">
    <h3>Ventilator</h3>
    <p>Mode: AC/VC</p>
    <p>TV: 420 mL</p>
    <p>PEEP: 8</p>
    <p>FiO2: 40%</p>
  </div>
  <!-- Daily goals (bottom) -->
  <div class="col-span-12 bg-white rounded p-3">
    <h3>Today's Goals</h3>
    <ul>
      <li>Wean FiO2 to 35%</li>
      <li>Spontaneous breathing trial</li>
      <li>PT consult</li>
    </ul>
  </div>
</div>
```

### Common i18n keys (ER)

| Key | EN | AR |
|---|---|---|
| er.tab.triage | Triage | الفرز |
| er.tab.assessment | Assessment | التقييم |
| er.tab.workup | Workup | التحاليل |
| er.tab.disposition | Disposition | القرار |
| er.lbl.esi | ESI Level | درجة ESI |
| er.lbl.chief_complaint | Chief Complaint | الشكوى الرئيسية |
| er.lbl.pain_score | Pain Score | درجة الألم |
| er.btn.admit | Admit | قبول |
| er.btn.discharge | Discharge | خروج |
| er.btn.transfer | Transfer | تحويل |
| er.btn.activate_stroke | ⚠️ Activate Stroke | ⚠️ تفعيل السكتة |
| er.btn.activate_trauma | ⚠️ Activate Trauma | ⚠️ تفعيل الصدمة |
| er.msg.critical_wait_time | Wait time critical | وقت الانتظار حرج |
| er.err.bed_unavailable | No bed available, divert to other facility | لا سرير متاح |

### Common i18n keys (ICU)

| Key | EN | AR |
|---|---|---|
| icu.tab.vitals | Vitals | العلامات الحيوية |
| icu.tab.labs | Labs | التحاليل |
| icu.tab.io | I/O | الداخل/الخارج |
| icu.tab.vent | Ventilator | جهاز التنفس |
| icu.tab.goals | Goals | الأهداف |
| icu.lbl.sofa | SOFA | SOFA |
| icu.lbl.apache | APACHE II | APACHE II |
| icu.lbl.gcs | GCS | GCS |
| icu.lbl.rass | RASS | RASS |
| icu.lbl.cam_icu | CAM-ICU | CAM-ICU |
| icu.btn.sbt | Spontaneous Breathing Trial | تجربة تنفس عفوي |
| icu.btn.daily_goals | Daily Goals | الأهداف اليومية |
| icu.msg.sepsis_alert | Sepsis bundle activated | تفعيل حزمة الإنتان |
| icu.msg.code_blue | CODE BLUE activated in Room X | تفعيل الكود الأزرق |

### Common i18n keys (Anesthesia)

| Key | EN | AR |
|---|---|---|
| anes.tab.preop | Pre-op | قبل العملية |
| anes.tab.intraop | Intra-op | أثناء العملية |
| anes.tab.pacu | PACU | الإفاقة |
| anes.lbl.asa | ASA | ASA |
| anes.lbl.mallampati | Mallampati | مالامباتي |
| anes.lbl.airway | Airway | مجرى الهواء |
| anes.lbl.anesthesia_type | Anesthesia Type | نوع التخدير |
| anes.btn.intubate | Intubate | تنبيب |
| anes.btn.extubate | Extubate | إزالة الأنبوب |
| anes.btn.spine | Spinal | نصفي |
| anes.btn.epidural | Epidural | فوق الجافية |
| anes.msg.malignant_hyperthermia | ⚠️ MH PROTOCOL: dantrolene 2.5 mg/kg IV | ⚠️ ارتفاع الحرارة الخبيث |
| anes.msg.last | ⚠️ LAST PROTOCOL: lipid emulsion 20% | ⚠️ سمية المخدر الموضعي |

---

## 🏥 Compliance

| Standard | Item | Status |
|---|---|---|
| JCI COP.5 | Resuscitation services available | ✅ |
| JCI COP.5.1 | Crash cart on every unit | ✅ |
| JCI COP.5.2 | Code blue response time < 5 min | ✅ |
| JCI PCI.4 | High-risk patients by qualified | ✅ |
| JCI QPS.6 | Sentinel events (unexpected death) | ✅ |
| JCI QPS.7 | Cardiac arrest review | ✅ |
| JCI MMU.4 | Emergency medication availability | ✅ |
| JCI SQE.7 | BLS/ACLS/ATLS certification | ✅ |
| JCI SQE.8 | Procedural sedation training | ✅ |
| JCI PFR.4 | ED meets community needs | ✅ |
| ISO 9001 §7.5 | Procedures documented | ✅ |
| Trauma Center | ACS verification (Level I/II) | ✅ |
| Stroke Center | Joint Commission stroke certification | ✅ |
| Chest Pain Center | ACC accreditation | ✅ |
| ASA Standards | Pre-anesthesia evaluation | ✅ |
| ASA Difficult Airway Algorithm | Adherence tracked | ✅ |
| WHO Surgical Safety | Checklist | ✅ |
| SCCM | ICU staffing standards | ✅ |
| KSA MOH | Stroke center designation | ✅ |
| PDPL | Emergency consent exceptions | ✅ (implied consent for life-threatening) |
| NPHIES | Critical care bundles | ✅ |

### Code Blue (resuscitation) workflow

```
Recognition of cardiac arrest → Activate code blue → 
CPR within 10 sec → Crash cart within 3 min →
Defibrillation if VF/VT within 2 min →
ACLS protocol →
Post-resuscitation care in ICU
```

### Sepsis Hour-1 Bundle (Surviving Sepsis Campaign 2021)

1. Measure lactate
2. Blood cultures before antibiotics
3. Broad-spectrum antibiotics
4. 30 mL/kg crystalloid for hypotension or lactate ≥ 4
5. Vasopressors for MAP < 65

### Stroke Time Targets

| Metric | Target |
|---|---|
| Door to Stroke Alert | < 10 min |
| Door to CT | < 25 min |
| Door to CT interpretation | < 45 min |
| Door to Needle (tPA) | < 60 min |
| Door to Puncture (mechanical thrombectomy) | < 90 min |
| Door to ICU | < 3h |

### Trauma Time Targets (Level I)

| Metric | Target |
|---|---|
| Trauma activation → OR | < 15 min |
| ED dwell time (ISS > 15) | < 6h |
| Craniotomy for epidural hematoma | < 4h from onset |
| Laparotomy for hemoperitoneum | < 1h from decision |

---

## 🚦 Group-Level Status

| Loop | Owner | Status |
|---|---|---|
| 1 | CMO | ✅ Triage, ICU workflow, anesthesia |
| 2 | AI Engineer | ✅ Sepsis, stroke, trauma AI |
| 3 | Architect | ✅ Tables, engines |
| 4 | DevOps | ⏸ migrations |
| 5 | UX | ✅ Board layouts, dashboards, i18n |
| 6 | Compliance | ✅ JCI/ASA/SCCM |
| 7 | QA | ⏸ tests |
| 8 | Orchestrator | ⏸ synthesis + commit |

**Current session: 0/33 sub-dept syntheses done.**

**Next batch priority: 8 (ER, trauma, stroke, MICU, SICU, anesthesia, pain, PACU).**
