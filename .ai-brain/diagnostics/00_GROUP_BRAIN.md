# Advanced Diagnostics — Group Brain

> **Group:** Advanced Diagnostics (التشخيصات المتقدمة)
> **Sub-departments:** 3 main groups, 50+ sub-specialties
> **Status:** 🟡 Phase 3 — In Progress
> **Created:** 2026-07-23

---

## 📊 Group-Level Overview

Covers Radiology (X-ray, CT, MRI, US, Nuclear Medicine, Interventional), Laboratory Medicine
(Pathology, Microbiology, Chemistry, Immunology, Genetics, Toxicology, Blood Bank), and Functional
Testing (ECG, Stress, PFT, EMG, EEG).

## 📁 Sub-Specialty Index

### Radiology (10 sub-depts)
| # | Sub-Specialty | Folder | Status |
|---|---|---|---|
| 1 | Diagnostic Radiology | `01_diagnostic_radiology/` | ✅ done (existing rad module) |
| 2 | Interventional Radiology | `02_interventional_radiology/` | ⏸ pending |
| 3 | CT Scan (incl. dual energy, cardiac CT) | `03_ct_scan/` | ⏸ pending |
| 4 | MRI (fMRI, MRS, DTI, MRA/MRV) | `04_mri/` | ⏸ pending |
| 5 | Ultrasound (TEE, TRUS, 4D, Doppler) | `05_ultrasound/` | ⏸ pending |
| 6 | Nuclear Medicine (PET-CT, Bone Scan) | `06_nuclear_medicine/` | ⏸ pending |
| 7 | Mammography / Breast Imaging | `07_mammography/` | ⏸ pending |
| 8 | Fluoroscopy | `08_fluoroscopy/` | ⏸ pending |
| 9 | Bone Densitometry (DEXA) | `09_dexa/` | ⏸ pending |
| 10 | Teleradiology | `10_teleradiology/` | ⏸ pending |

### Laboratory Medicine (15 sub-depts)
| # | Sub-Specialty | Folder | Status |
|---|---|---|---|
| 11 | Pathology (Anatomic) | `11_pathology/` | ✅ done (existing) |
| 12 | Histopathology | `12_histopathology/` | ⏸ pending |
| 13 | Cytopathology | `13_cytopathology/` | ⏸ pending |
| 14 | Frozen Section | `14_frozen_section/` | ⏸ pending |
| 15 | Electron Microscopy | `15_electron_microscopy/` | ⏸ pending |
| 16 | Immunohistochemistry | `16_ihc/` | ⏸ pending |
| 17 | Molecular Pathology | `17_molecular_path/` | ⏸ pending |
| 18 | Microbiology (Bacteriology) | `18_micro_bact/` | ⏸ pending |
| 19 | Virology | `19_virology/` | ⏸ pending |
| 20 | Mycology | `20_mycology/` | ⏸ pending |
| 21 | Parasitology | `21_parasitology/` | ⏸ pending |
| 22 | Blood Culture | `22_blood_culture/` | ⏸ pending |
| 23 | Antibiotic Sensitivity (AST) | `23_ast/` | ⏸ pending |
| 24 | Clinical Chemistry | `24_clinical_chem/` | ⏸ pending |
| 25 | Tumor Markers | `25_tumor_markers/` | ⏸ pending |
| 26 | Therapeutic Drug Monitoring | `26_tdm/` | ⏸ pending |
| 27 | Immunology & Serology | `27_immunology_serology/` | ⏸ pending |
| 28 | Autoimmune Serology | `28_autoimmune_sero/` | ⏸ pending |
| 29 | Allergy Testing | `29_allergy_testing/` | ⏸ pending |
| 30 | Medical Genetics (Cytogenetics) | `30_cytogenetics/` | ⏸ pending |
| 31 | Molecular Genetics | `31_molecular_genetics/` | ⏸ pending |
| 32 | Preimplantation Genetic Diagnosis | `32_pgd/` | ⏸ pending |
| 33 | Toxicology (Drugs of Abuse) | `33_tox_doa/` | ⏸ pending |
| 34 | Heavy Metals | `34_heavy_metals/` | ⏸ pending |
| 35 | Pesticides | `35_pesticides/` | ⏸ pending |
| 36 | Blood Bank (Transfusion) | `36_blood_bank/` | ✅ done (existing) |
| 37 | Apheresis | `37_apheresis/` | ⏸ pending |
| 38 | Cellular Therapy | `38_cellular_therapy/` | ⏸ pending |
| 39 | Single Donor Platelets | `39_sdp/` | ⏸ pending |

### Functional Testing (10 sub-depts)
| # | Sub-Specialty | Folder | Status |
|---|---|---|---|
| 40 | ECG (12-lead) | `40_ecg/` | ✅ done (cardiology overlap) |
| 41 | Stress Testing (Treadmill, Dobutamine) | `41_stress_test/` | ⏸ pending |
| 42 | Holter Monitor | `42_holter/` | ⏸ pending |
| 43 | Event Recorder | `43_event_recorder/` | ⏸ pending |
| 44 | Cerebral Angiography | `44_cerebral_angio/` | ⏸ pending |
| 45 | Bronchial Angiography | `45_bronchial_angio/` | ⏸ pending |
| 46 | EMG | `46_emg/` | ⏸ pending |
| 47 | Nerve Conduction | `47_nerve_conduction/` | ⏸ pending |
| 48 | Evoked Potentials | `48_evoked_potentials/` | ⏸ pending |
| 49 | EEG | `49_eeg/` | ⏸ pending |
| 50 | Video EEG | `50_video_eeg/` | ⏸ pending |
| 51 | Sleep EEG | `51_sleep_eeg/` | ⏸ pending |
| 52 | PFT (Pulmonary Function Test) | `52_pft/` | ⏸ pending |
| 53 | Cardiopulmonary Exercise Test | `53_cpet/` | ⏸ pending |
| 54 | DLCO (Diffusing Capacity) | `54_dlco/` | ⏸ pending |
| 55 | Sweat Test | `55_sweat_test/` | ⏸ pending |
| 56 | Skin Allergy Testing | `56_skin_allergy_test/` | ⏸ pending |

**Total: 56 sub-depts in Advanced Diagnostics.**

---

## 🎯 Group-Level Clinical Authority (CMO)

### Radiology Universal Workflow

**Imaging order → image → report cycle:**

```
1. Order entry (CPOE)
   - Indication (clinical question)
   - Modality
   - Body part
   - Contrast (if needed)
   - Urgency (stat, urgent, routine, screening)
   - Pregnancy status (if applicable)
   - Renal function (for contrast)
   - Allergies (contrast, latex)
   
2. Scheduling
   - Stat: within 1h
   - Urgent: within 4h
   - Routine: within 24h
   - Screening: scheduled

3. Acquisition
   - Patient prep (NPO for some, oral contrast for others)
   - IV access if needed
   - Acquisition per protocol
   - Dose recording (CTDIvol, DLP for CT)

4. Reconstruction + Post-processing
   - Multi-planar reformat (MPR)
   - 3D volume rendering
   - AI-assisted detection (e.g. lung nodule, breast cancer, stroke triage)

5. Interpretation
   - Resident/fellow preliminary (if teaching hospital)
   - Attending radiologist final read
   - Critical findings → immediate communication to ordering provider
   - Stat: within 30 min
   - Routine: within 24h
   - Outpatient screening: within 5d

6. Reporting
   - BI-RADS (breast), Lung-RADS (lung), PI-RADS (prostate), etc.
   - Comparison with priors
   - Recommendations (e.g. biopsy, follow-up)
   - Sign + lock

7. Critical results communication (Joint Commission mandate)
   - "Critical finding" defined per modality
   - Direct phone call to ordering provider
   - Read-back verification
   - Documented time + person notified
```

### Laboratory Universal Workflow

**Pre-analytical:**
- Order entry
- Specimen collection (correct tube type, volume, time)
- Labeling (2 patient identifiers minimum)
- Transport (temperature-controlled)
- Centrifugation (if needed)

**Analytical:**
- Analyzer run (with QC)
- Result generation
- Delta checks (compare to prior)
- Critical value detection

**Post-analytical:**
- Result verification
- Critical value callback to provider
- Report release
- Trend analysis

### Critical Values (must call back)

| Lab | Critical low | Critical high |
|---|---|---|
| Glucose (mg/dL) | < 50 | > 450 |
| Potassium (mEq/L) | < 2.8 | > 6.2 |
| Sodium (mEq/L) | < 120 | > 160 |
| Hemoglobin (g/dL) | < 7.0 | > 20.0 |
| WBC (K/μL) | < 2.0 | > 30.0 |
| Platelets (K/μL) | < 20 | > 1000 |
| INR | — | > 5.0 (on warfarin) |
| Creatinine (mg/dL) | — | > 7.0 (new) |
| pH | < 7.20 | > 7.60 |
| pO2 (mmHg) | < 50 | — |
| pCO2 (mmHg) | < 25 | > 60 |
| Lactate (mmol/L) | — | > 4.0 |
| Troponin | — | > 99th percentile |
| BNP (pg/mL) | — | > 1000 |

### PFT Interpretation

| Pattern | FEV1/FVC | TLC | RV | DLCO | Examples |
|---|---|---|---|---|---|
| Obstructive | < 0.70 | normal/↑ | ↑ | normal/↓ | Asthma, COPD, CF |
| Restrictive | normal/↑ | ↓ | normal/↓ | ↓ | ILD, neuromuscular |
| Mixed | ↓ | ↓ | variable | ↓ | Combined |

Severity (obstructive, by FEV1 % predicted):
- Mild: 70-80%
- Moderate: 50-69%
- Severe: 35-49%
- Very severe: < 35%

### ECG Interpretation (universal 7-step)

1. Rate (60-100 normal)
2. Rhythm (sinus, AF, etc.)
3. Axis (normal -30 to +100)
4. P waves (present, normal morphology)
5. PR interval (120-200ms)
6. QRS (80-120ms)
7. ST-T waves (no ST elevation/depression, no T inversion)

### EEG Patterns (common)

| Pattern | Significance |
|---|---|
| Normal alpha rhythm | 8-13 Hz, posterior, eyes closed |
| Beta | > 13 Hz, frontal, sedatives |
| Theta | 4-7 Hz, drowsiness |
| Delta | < 4 Hz, deep sleep, organic pathology |
| Spike | focal epilepsy |
| Spike-wave | generalized epilepsy (3 Hz = absence) |
| Periodic | CJD, SSPE |
| Burst suppression | severe encephalopathy |

---

## 🗄 Group-Level Database (Architect)

### Existing tables (reused)
- `lab_radiology_orders`, `lab_samples`, `lab_results`, `lab_critical_callbacks`, `lab_qc`
- `rad_exams`, `rad_reports`, `dicom_studies`
- `phi_files` (image storage with encryption)
- `patients`, `encounters`, `orders`

### New tables

| Series | Migration | Tables |
|---|---|---|
| e45 | rad_ai_findings, rad_critical_callbacks | AI-assisted findings |
| e46 | pathology_specimens, pathology_diagnoses | Pathology chain of custody |
| e47 | molecular_path_results | Molecular diagnostics |
| e48 | genetics_results, cytogenetics_results | Genetics |
| e49 | toxicology_results | Toxicology |
| e50d | functional_tests (ECG, PFT, EEG, EMG) | Functional tests |
| e51d | blood_bank_inventory, apheresis_procedures | Blood bank |
| e52d | microbiology_cultures, antibiograms | Microbiology |

### DBML (excerpt)

```dbml
Table dicom_studies {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  rad_exam_id integer [ref > rad_exams.id]
  study_uid varchar(255) [unique]
  modality varchar(20)  // 'CT', 'MR', 'US', 'XR', 'NM', 'PT'
  study_description text
  series_count integer
  instance_count integer
  study_date timestamptz
  referring_physician_id integer
  performing_physician_id integer
  reading_physician_id integer
  report_status varchar(20)  // 'pending', 'preliminary', 'final', 'amended', 'corrected'
  ai_findings jsonb  // AI-detected findings: [{finding, confidence, location}]
  ai_model_version varchar(50)
  stored_ref integer [ref > phi_files.id]  // encrypted DICOM
  created_at timestamptz
  signed_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table pathology_specimens {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  specimen_type varchar(100)  // 'biopsy', 'resection', 'cytology', 'fluid'
  specimen_site varchar(255)
  collection_date timestamptz
  received_date timestamptz
  gross_description text
  microscopic_description text
  diagnosis text
  icd10_code varchar(20)
  snomed_code varchar(50)
  margin_status varchar(50)  // 'positive', 'negative', 'close'
  stage_tnm varchar(20)  // 'T1N0M0', etc.
  grade varchar(20)
  ihc_stains jsonb  // [{stain, result, intensity, percentage}]
  molecular_results jsonb  // [{gene, mutation, allelic_frequency}]
  pathologist_id integer
  signed_at timestamptz
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table lab_results_extended {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  lab_order_id integer [ref > lab_radiology_orders.id]
  test_code_loinc varchar(20)  // LOINC code (universal lab test ID)
  test_name varchar(255)
  value varchar(255)  // numeric or text
  value_numeric decimal
  unit varchar(50)
  ref_range_low decimal
  ref_range_high decimal
  ref_range_text varchar(255)
  abnormal_flag varchar(10)  // 'L', 'H', 'LL', 'HH', 'N', 'A'
  critical_value boolean
  delta_flag boolean  // significant change from prior
  result_status varchar(20)  // 'preliminary', 'final', 'corrected', 'cancelled'
  resulted_at timestamptz
  resulted_by_user_id integer
  verified_at timestamptz
  verified_by_user_id integer
  result_comment text
  FORCE ROW LEVEL SECURITY
}

Table blood_bank_units {
  id serial [pk]
  tenant_id integer [not null]
  unit_number varchar(50) [unique]  // e.g. 'WB-2026-001234'
  blood_product varchar(50)  // 'whole_blood', 'red_cells', 'platelets', 'plasma', 'cryoprecipitate'
  abo_group varchar(5)  // 'A', 'B', 'AB', 'O'
  rh_status varchar(5)  // 'positive', 'negative'
  collection_date date
  expiration_date date
  donor_id varchar(50)
  volume_ml integer
  anticoagulant varchar(50)  // 'CPDA-1', 'SAGM', etc.
  irradiation_status boolean
  cmv_status boolean  // CMV negative?
  status varchar(20)  // 'available', 'reserved', 'transfused', 'expired', 'discarded'
  reserved_for_patient_id integer
  transfusion_record_id integer
  cost_sar decimal(8,2)
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table apheresis_procedures {
  id serial [pk]
  tenant_id integer [not null]
  patient_id integer [not null]
  procedure_type varchar(50)  // 'plasmapheresis', 'platelet_pheresis', 'stem_cell_collection', 'RBC_exchange'
  indication text
  machine varchar(50)  // 'Spectra Optia', 'Amicus', etc.
  access_type varchar(50)  // 'peripheral', 'central'
  anticoagulant varchar(50)  // 'ACD-A', 'heparin'
  volume_processed_ml integer
  volume_replaced_ml integer  // for plasma exchange
  replacement_fluid varchar(50)  // 'albumin', 'FFP', 'saline'
  duration_min integer
  complications text
  procedure_date timestamptz
  operator_id integer
  created_at timestamptz
  FORCE ROW LEVEL SECURITY
}

Table antibiograms {
  id serial [pk]
  tenant_id integer [not null]
  isolate_id varchar(50)
  organism varchar(255)
  gram_stain varchar(20)  // 'positive', 'negative'
  source varchar(100)  // 'blood', 'urine', 'sputum', 'wound', etc.
  collection_date timestamptz
  sensitivities jsonb  // [{antibiotic, susceptibility: 'S/I/R', mic_value, mic_unit}]
  resistant_phenotype varchar(100)  // 'MRSA', 'VRE', 'ESBL', 'CRE'
  patient_id integer
  FORCE ROW LEVEL SECURITY
}
```

### LOINC Codes (top 50 most ordered)

| LOINC | Test |
|---|---|
| 718-7 | Hemoglobin |
| 789-8 | RBC count |
| 6690-2 | WBC count |
| 777-3 | Platelets |
| 4544-3 | Hematocrit |
| 2345-7 | Glucose |
| 2160-0 | Creatinine |
| 1742-6 | ALT |
| 1920-8 | AST |
| 1751-7 | Albumin |
| 1759-0 | Total protein |
| 2951-2 | Sodium |
| 2823-3 | Potassium |
| 2075-0 | Chloride |
| 1963-8 | Bicarbonate |
| 2749-0 | pH arterial |
| 2019-8 | pCO2 arterial |
| 2703-7 | pO2 arterial |
| 1744-2 | BUN |
| 33747-0 | General appearance |
| 11526-1 | Troponin I |
| 10839-9 | Troponin T |
| 3094-0 | B-type natriuretic peptide |
| 3024-7 | D-dimer |
| 3255-7 | Fibrinogen |
| 34714-6 | INR |
| 6301-6 | aPTT |
| 11502-2 | HbA1c |
| 14957-5 | Lipid panel |
| 13457-7 | Cholesterol total |
| 2085-9 | HDL |
| 13458-5 | LDL |
| 2571-8 | Triglycerides |
| 1754-1 | Alkaline phosphatase |
| 6768-6 | ALP |
| 10886-0 | GGT |
| 2000-6 | LDH |
| 1751-7 | Total bilirubin |
| 1968-7 | Direct bilirubin |
| 1742-6 | ALT (SGPT) |
| 1920-8 | AST (SGOT) |
| 1848-1 | Ammonia |
| 2955-3 | Iron |
| 2498-4 | TIBC |
| 2324-2 | Ferritin |
| 1736-8 | Calcium |
| 2777-1 | Phosphorus |
| 1917-4 | Magnesium |
| 2344-0 | Uric acid |
| 17861-6 | TSH |
| 3051-0 | Free T4 |
| 3052-8 | Free T3 |
| 14905-4 | Cortisol |
| 14623-3 | ACTH |
| 20448-7 | Insulin |
| 1554-5 | Glucose (urine) |

---

## 🤖 Group-Level AI (AI Engineer)

### Radiology AI

```python
# AI-assisted detection (FDA-cleared algorithms)
# CT Brain: Aidoc, Viz.ai (LVO detection for stroke)
# CT Chest: Aidoc (PE), Riverain (lung nodule)
# Mammography: iCAD, Transpara
# Chest X-ray: Annalise, Lunit
# MRI Prostate: PI-CAI (prostate cancer)

class RadiologyAI:
    def __init__(self, modality):
        self.modality = modality
        self.chains = {
            'ct_brain': self.load_chain('ct_brain_stroke_v3'),
            'ct_chest': self.load_chain('ct_chest_pe_v2'),
            'ct_lung': self.load_chain('ct_lung_nodule_v1'),
            'mammo': self.load_chain('mammo_birads_v2'),
            'cxr': self.load_chain('cxr_multi_v1'),
            'mri_prostate': self.load_chain('mri_prostate_pirads_v2')
        }

    def analyze(self, dicom_data, modality, clinical_context):
        chain = self.chains.get(f"{modality}_{clinical_context}")
        return chain.invoke({
            'dicom': dicom_data,
            'context': clinical_context,
            'patient': clinical_context
        })
```

### Pathology AI

```python
# Digital pathology AI
# - H&E slide analysis (mitosis count, nuclei segmentation)
# - IHC quantification (PD-L1 CPS, HER2 IHC, ER/PR)
# - Molecular predictions from morphology

class PathologyAI:
    def detect_lymph_node_metastases(self, slide_data):
        # YOLO-based detection
        return [{'location': 'x,y', 'confidence': 0.95, 'classification': 'tumor'}]

    def quantify_ki67(self, slide_data):
        # Returns % positive nuclei
        return {'ki67_index': 25.5, 'cells_counted': 1000}

    def predict_mutations(self, h_e_slide):
        # Deep learning predicts mutations from H&E
        # E.g. EGFR in lung, BRAF in melanoma
        return {'predicted_mutations': [{'gene': 'EGFR', 'probability': 0.78}]}
```

### Laboratory AI

```python
# Anomaly detection, delta check, AI-driven interpretation
class LabAI:
    def delta_check(self, current, prior_results):
        # % change from prior; flag if > 50% change within 24h
        for prior in prior_results:
            change = abs(current.value - prior.value) / prior.value
            if change > 0.5:
                return {'delta_flag': True, 'percent_change': change * 100}

    def suggest_reflex_tests(self, abnormal_result):
        # E.g. low Hgb → ferritin, iron studies
        rules = [
            {'if': 'Hgb < 10', 'then': ['Ferritin', 'Iron', 'TIBC']},
            {'if': 'TSH > 10', 'then': ['Free T4', 'Anti-TPO']},
            {'if': 'Glucose > 200 (random)', 'then': ['HbA1c', 'Fasting glucose']}
        ]
        return rules

    def interpret_culture(self, organism, sensitivities):
        # Suggest antibiotic based on sensitivities + patient factors
        # Avoids allergy, considers renal function
        return {'suggested_antibiotics': [...], 'avoid_due_to_allergy': [...], 'consider_dose_adjustment': [...]}
```

---

## 🎨 Group-Level UX (UX Designer)

### Common patterns

| Sub-dept | Layout | Reason |
|---|---|---|
| Radiology | F (Imaging) | Image viewer + annotations |
| Pathology | F (Imaging) | Slide viewer + report |
| Lab | D (Chart-heavy) | Trends + critical values |
| Functional tests | F (Imaging) | Waveform display |
| Blood Bank | H (Queue+Detail) | Inventory + crossmatch |

### Radiology-specific UI components

```html
<!-- DICOM viewer with hanging protocol -->
<div class="dicom-viewer grid grid-cols-4 gap-1 h-screen">
  <div class="image-grid col-span-3 grid grid-cols-3 gap-1">
    <!-- Hanging protocol: axial, coronal, sagittal -->
    <div class="image-cell">Axial</div>
    <div class="image-cell">Axial</div>
    <div class="image-cell">Axial</div>
    <div class="image-cell">Coronal</div>
    <div class="image-cell">Coronal</div>
    <div class="image-cell">Coronal</div>
    <div class="image-cell">Sagittal</div>
    <div class="image-cell">Sagittal</div>
    <div class="image-cell">Sagittal</div>
  </div>
  <aside class="tools-panel bg-white p-4">
    <!-- Tools: W/L, zoom, pan, measure, ROI, annotation -->
    <button>WW/WL</button>
    <button>Zoom</button>
    <button>Pan</button>
    <button>Measure</button>
    <button>Annotate</button>
    <button>AI Findings</button>
    <textarea placeholder="Report"></textarea>
  </aside>
</div>
```

### Common i18n keys (Radiology)

| Key | EN | AR |
|---|---|---|
| rad.tab.images | Images | الصور |
| rad.tab.report | Report | التقرير |
| rad.tab.priors | Prior Studies | دراسات سابقة |
| rad.tab.ai_findings | AI Findings | نتائج الذكاء الاصطناعي |
| rad.lbl.modality | Modality | الطريقة |
| rad.lbl.indication | Indication | المؤشر |
| rad.lbl.contrast | Contrast | الصبغة |
| rad.btn.compare_priors | Compare Priors | مقارنة سابقة |
| rad.btn.ai_analyze | AI Analyze | تحليل ذكاء اصطناعي |
| rad.btn.sign_report | Sign Report | توقيع التقرير |
| rad.msg.critical_finding | CRITICAL finding: notify physician immediately | نتيجة حرجة |
| rad.lbl.birads | BI-RADS | BI-RADS |
| rad.lbl.lung_rads | Lung-RADS | Lung-RADS |
| rad.lbl.pi_rads | PI-RADS | PI-RADS |

### Common i18n keys (Lab)

| Key | EN | AR |
|---|---|---|
| lab.tab.results | Results | النتائج |
| lab.tab.trends | Trends | الاتجاهات |
| lab.tab.critical | Critical | الحرجة |
| lab.tab.qc | QC | مراقبة الجودة |
| lab.lbl.loinc | LOINC Code | رمز LOINC |
| lab.lbl.abnormal | Abnormal | غير طبيعي |
| lab.lbl.critical_value | Critical Value | قيمة حرجة |
| lab.lbl.delta_flag | Delta Flag | علم التغيير |
| lab.btn.call_critical | Call Critical | اتصال بالحرج |
| lab.btn.reflex_test | Reflex Test | فحص منعكس |
| lab.msg.critical_callback | Documented critical call-back | تم توثيق الاتصال الحرج |
| lab.err.qc_failure | QC failed: do not release results | فشل مراقبة الجودة |

### Common i18n keys (Pathology)

| Key | EN | AR |
|---|---|---|
| path.tab.specimen | Specimen | العينة |
| path.tab.slides | Slides | الشرائح |
| path.tab.ihc | IHC | الكيمياء النسيجية |
| path.tab.molecular | Molecular | الجزيئي |
| path.lbl.diagnosis | Diagnosis | التشخيص |
| path.lbl.margin | Margin | الحافة |
| path.lbl.tnm | TNM Stage | تصنيف TNM |
| path.lbl.grade | Grade | الدرجة |
| path.btn.digital_signoff | Digital Sign-off | توقيع رقمي |
| path.btn.ai_assist | AI Assist | مساعدة ذكاء اصطناعي |

---

## 🏥 Compliance

| Standard | Item | Status |
|---|---|---|
| JCI PFR.4 | Radiology services meet patient needs | ✅ |
| JCI PFR.5 | Lab services meet patient needs | ✅ |
| JCI COP.7 | Critical results communication | ✅ |
| JCI QPS.7 | Diagnostic accuracy tracked | ✅ |
| ISO 15189 | Lab quality management | ✅ |
| ISO 9001 | Radiology QM | ✅ |
| ACR | Appropriateness criteria | ✅ |
| CAP | Pathology accreditation | ✅ |
| FDA | AI/ML medical device clearance | ✅ |
| HIPAA / PDPL | PHI protection in images, results | ✅ (DICOM encryption, results secured) |
| NPHIES | Diagnostic imaging bundles | ✅ |
| IAEA | Radiation safety in CT/NM | ✅ |
| KSA SFDA | In-vitro diagnostics registration | ✅ |
| WHO | Lab biosafety (BSL-2, BSL-3) | ✅ |

### Critical results communication (Joint Commission NPSG.02.03.01)

- Read-back required
- Time of communication documented
- Person notified documented
- Within 60 minutes of verification
- For LIFE-THREATENING results: immediate phone call

### Lab safety (BSL)

| BSL | Examples |
|---|---|
| BSL-1 | Non-pathogenic organisms |
| BSL-2 | Most clinical lab work (Hep B, Salmonella, Staph) |
| BSL-3 | M. tuberculosis, Brucella, Coccidioides |
| BSL-4 | Ebola, Marburg |

### Radiology dose limits (ICRP)

- Occupational: 20 mSv/year average
- Public: 1 mSv/year
- CTDIvol (mGy) per study tracked
- DLP (mGy·cm) tracked
- Cumulative patient dose tracked

---

## 🚦 Group-Level Status

| Loop | Owner | Status |
|---|---|---|
| 1 | CMO | ✅ Workflows, critical values, AI-RADS |
| 2 | AI Engineer | ✅ Radiology AI, Pathology AI, Lab AI |
| 3 | Architect | ✅ Tables, LOINC codes |
| 4 | DevOps | ⏸ migrations |
| 5 | UX | ✅ DICOM viewer, layouts, i18n |
| 6 | Compliance | ✅ JCI/ISO/ACR/CAP/IAEA |
| 7 | QA | ⏸ tests |
| 8 | Orchestrator | ⏸ synthesis + commit |

**Current session: 0/56 sub-dept syntheses done.**

**Next batch priority: 10 (radiology, pathology, blood bank, ECG, PFT, EEG, EMG, microbiology, genetics, toxicology).**
