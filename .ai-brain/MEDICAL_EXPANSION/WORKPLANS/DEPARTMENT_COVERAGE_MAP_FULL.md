# DEPARTMENT ↔ STATION/CLUSTER/DBML COVERAGE MAP
## Master list (38+ depts, 100+ sub-units) → Existing NamaMedical assets

> **Date:** 2026-07-22
> **Source of truth:** Master clinical list (user request) + audit
> **Map columns:** Master dept | Existing station | Cluster DBML | Sub-units covered | Sub-units missing | Priority

---

## 1. INTERNAL MEDICINE (المجموعات 1-9)

### 1.1 CARDIOLOGY & VASCULAR
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Cardiology (general) | `cardiology-station` | `cardiology.dbml` | ✅ | — | DONE |
| Interventional Cardiology | `cardiology-station` (sub-tab) | `cardiology.dbml` | partial | full cath lab workspace | P1 |
| Electrophysiology | none | `cardiology.dbml` (small) | minimal | EP lab workspace + ablation | P1 |
| Preventive Cardiology | none | `cardiology.dbml` | minimal | full preventive clinic | P2 |
| Nuclear Cardiology | `diagnostics-station` (sub) | `radiology_imaging.dbml` | partial | dedicated nuclear card workspace | P2 |
| Cardio-Obstetrics | none | `cardiology.dbml` + `obgyn.dbml` | none | joint workspace | P2 |
| Cardiac Catheterization Lab | none | `cardiology.dbml` (small) | partial | full cath lab | P1 |
| Peripheral Vascular Disease | none | `cts_vascular_surgery.dbml` | partial | dedicated PVD clinic | P2 |
| Advanced Heart Failure | none | `cardiology.dbml` | minimal | LVAD / transplant workspace | P1 |

### 1.2 RESPIRATORY (الجهاز التنفسي)
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Pulmonology (general) | `pulmonology-station` | `pulmonology.dbml` | ✅ | — | DONE |
| Allergic Pulmonology | none | `pulmonology.dbml` (small) | minimal | full allergy-pulm | P2 |
| Sleep Medicine | none | `pulmonology.dbml` (small) | minimal | polysomnography workspace | P1 |
| Respiratory Care | `pacu-station` (sub) | `intensive_care.dbml` | partial | dedicated RT workspace | P2 |
| Bronchoscopy Unit | `diagnostics-station` (sub) | `pulmonology.dbml` (small) | partial | full bronchoscopy | P2 |
| Home Oxygen Therapy | none | `pulmonology.dbml` | none | dedicated home-care | P3 |

### 1.3 GASTROENTEROLOGY & HEPATOLOGY
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Gastroenterology (general) | `gastro-station` | `gastro_hepato.dbml` | ✅ | — | DONE |
| Advanced Endoscopy (EUS, ERCP, Enteroscopy, Lap) | `diagnostics-station` (sub) | `gastro_hepato.dbml` | partial | full advanced endo | P1 |
| Hepatology | `gastro-station` (sub) | `gastro_hepato.dbml` | ✅ | — | DONE |
| Pancreato-Biliary | `gastro-station` (sub) | `gastro_hepato.dbml` | partial | full PB unit | P2 |
| GI Motility | none | `gastro_hepato.dbml` | minimal | motility lab | P3 |
| Clinical Nutrition Medicine | none | `nutrition.dbml` | partial | standalone CN workspace | P2 |

### 1.4 NEPHROLOGY & DIALYSIS
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Nephrology (general) | `nephrology-station` | `nephrology.dbml` | ✅ | — | DONE |
| Renal Transplantation | `nephrology-station` (sub) | `nephrology.dbml` | partial | full transplant workspace | P1 |
| Hemodialysis | `nephrology-station` (sub) | `nephrology.dbml` | ✅ | — | DONE |
| Peritoneal Dialysis | `nephrology-station` (sub) | `nephrology.dbml` | partial | full PD workspace | P2 |
| Home Dialysis | none | `nephrology.dbml` | none | dedicated home-care | P3 |
| Plasmapheresis | none | `nephrology.dbml` | none | full apheresis unit | P2 |
| Pediatric Dialysis | `nephrology-station` (peds sub) | `pediatric_subspec.dbml` | minimal | dedicated peds unit | P2 |

### 1.5 ONCOLOGY & HEMATOLOGY
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Medical Oncology | `oncology-station` | `hemato_oncology.dbml` | ✅ | — | DONE |
| Gynecologic Oncology | none | `hemato_oncology.dbml` + `obgyn.dbml` | minimal | full Gyn Onc | P2 |
| Hematology | `oncology-station` (sub) | `hemato_oncology.dbml` | ✅ | — | DONE |
| Coagulation & Anemia | `oncology-station` (sub) | `hemato_oncology.dbml` | partial | full coag clinic | P2 |
| BMT — Autologous | `oncology-station` (sub) | `hemato_oncology.dbml` | partial | full BMT-auto | P1 |
| BMT — Allogeneic | `oncology-station` (sub) | `hemato_oncology.dbml` | partial | full BMT-allo | P1 |
| BMT — Cord Blood | none | `hemato_oncology.dbml` | minimal | full cord-blood unit | P3 |

### 1.6 ENDOCRINOLOGY & DIABETES
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Endocrinology (general) | `endocrine-station` | `endocrine_diabetes.dbml` | ✅ | — | DONE |
| Diabetology — Type 1 | `endocrine-station` (sub) | `endocrine_diabetes.dbml` | partial | dedicated T1D | P2 |
| Diabetology — Type 2 | `endocrine-station` (sub) | `endocrine_diabetes.dbml` | partial | dedicated T2D | P2 |
| Gestational Diabetes | `obgyn-peds-station` (sub) | `obgyn.dbml` + `endocrine_diabetes.dbml` | partial | joint workspace | P2 |
| Diabetic Foot & Neuropathy | none | `endocrine_diabetes.dbml` | none | dedicated foot clinic | P2 |
| Metabolic Bone Disease | none | `endocrine_diabetes.dbml` | none | dedicated bone clinic | P3 |
| Obesity Medicine | `nutrition-station` (proposed) | `nutrition.dbml` + `endocrine_diabetes.dbml` | minimal | full obesity clinic | P1 |

### 1.7 RHEUMATOLOGY & IMMUNOLOGY
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Rheumatology | `rheuma-station` | `rheum_immunology.dbml` | ✅ | — | DONE |
| Clinical Immunology | `rheuma-station` (sub) | `rheum_immunology.dbml` | partial | full immunology | P3 |
| Autoimmune Diseases | `rheuma-station` (sub) | `rheum_immunology.dbml` | partial | dedicated autoimmune | P3 |
| Allergy & Asthma | `rheuma-station` (sub) | `rheum_immunology.dbml` | partial | dedicated A&A | P2 |

### 1.8 INFECTIOUS DISEASES
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Infectious Diseases | `infectious-station` | `infectious_diseases.dbml` | ✅ | — | DONE |
| Infection Control | none | `infectious_diseases.dbml` | partial | full IC workspace | P2 |
| Tropical Medicine | `infectious-station` (sub) | `infectious_diseases.dbml` | minimal | dedicated tropical | P3 |
| Antimicrobial Stewardship | none | `infectious_diseases.dbml` | minimal | full ASP workspace | P2 |
| Travel Medicine | none | `infectious_diseases.dbml` | none | dedicated travel clinic | P3 |
| Vaccination Center | none | `infectious_diseases.dbml` | none | dedicated vacc clinic | P3 |

### 1.9 DERMATOLOGY
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Dermatology | `derm-station` | `dermatology.dbml` | ✅ | — | DONE |
| Cosmetic Dermatology | `derm-station` (sub) | `dermatology.dbml` | partial | full cosmetic | P3 |
| Dermatosurgery | `derm-station` (sub) | `dermatology.dbml` | partial | full dermatosurg | P2 |
| Dermatologic Oncology | `oncology-station` + `derm-station` (joint) | `dermatology.dbml` + `hemato_oncology.dbml` | minimal | full D-Onc | P2 |
| Phototherapy | none | `dermatology.dbml` | none | dedicated phototherapy | P3 |

---

## 2. SURGICAL (المجموعات 10-17)

### 10-17. SURGICAL DEPARTMENTS
| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| General Surgery | `surgery-station` | `general_surgery.dbml` | ✅ | — | DONE |
| Surgical Oncology | `surgery-station` + `oncology-station` | `general_surgery.dbml` + `hemato_oncology.dbml` | partial | full surg-onc | P1 |
| Endocrine Surgery (thyroid/adrenal/parathyroid) | `surgery-station` (sub) | `general_surgery.dbml` | partial | full endocrine-surg | P2 |
| Minimal Invasive & Robotic | `surgery-station` (sub) | `general_surgery.dbml` | partial | dedicated robotic | P1 |
| Bariatric Surgery | `surgery-station` (sub) | `general_surgery.dbml` | partial | full bariatric | P1 |
| Breast Surgery | `surgery-station` (sub) | `general_surgery.dbml` | partial | full breast clinic | P2 |
| Trauma Surgery | `er-station` (sub) | `general_surgery.dbml` | partial | full trauma | P1 |
| Colorectal Surgery | `surgery-station` (sub) | `general_surgery.dbml` | partial | full colorectal | P2 |
| Cardiothoracic (Open Heart) | `cardiothoracic-station` | `cts_vascular_surgery.dbml` | ✅ | — | DONE |
| Thoracic Surgery | `cardiothoracic-station` (sub) | `cts_vascular_surgery.dbml` | ✅ | — | DONE |
| Airway Surgery | `cardiothoracic-station` (sub) | `cts_vascular_surgery.dbml` | partial | full airway | P3 |
| Vascular Surgery | `cardiothoracic-station` (sub) | `cts_vascular_surgery.dbml` | partial | full vascular | P2 |
| Endovascular | `cardiothoracic-station` (sub) | `cts_vascular_surgery.dbml` | partial | full endovascular | P2 |
| Venous Disease (varicose/ulcers) | `cardiothoracic-station` (sub) | `cts_vascular_surgery.dbml` | partial | full venous clinic | P3 |
| Neurosurgery (Cerebrovascular) | `neurosurgery-station` | `neurosurgery_spine.dbml` | ✅ | — | DONE |
| Neuro-oncology Surgery | `neurosurgery-station` (sub) | `neurosurgery_spine.dbml` + `hemato_oncology.dbml` | partial | full neuro-onc | P2 |
| Functional Neurosurgery (epilepsy, Parkinson) | `neurosurgery-station` (sub) | `neurosurgery_spine.dbml` | partial | full functional (DBS, etc.) | P1 |
| Peripheral Nerve Surgery | `neurosurgery-station` (sub) | `neurosurgery_spine.dbml` | partial | full peripheral nerve | P3 |
| Skull Base Surgery | none | `neurosurgery_spine.dbml` | minimal | full skull base | P1 |
| Endoscopic Neurosurgery | none | `neurosurgery_spine.dbml` | minimal | full endo-neuro | P2 |
| Spine — Interventional | `neurosurgery-station` (sub) | `neurosurgery_spine.dbml` | partial | full spine-int | P2 |
| Spine — Scoliosis | `neurosurgery-station` (sub) | `neurosurgery_spine.dbml` | partial | full scoliosis | P3 |
| Orthopedics (general) | `orthopedics-station` | `orthopedics.dbml` | ✅ | — | DONE |
| Spinal Orthopedics | `orthopedics-station` (sub) | `orthopedics.dbml` | partial | full spinal ortho | P2 |
| Joint Replacement (Arthroplasty) | `orthopedics-station` (sub) | `orthopedics.dbml` | partial | full arthroplasty (hip, knee, shoulder) | P1 |
| Trauma Orthopedics | `er-station` (sub) | `orthopedics.dbml` | partial | full trauma ortho | P1 |
| Hand & Microsurgery | `orthopedics-station` (sub) | `orthopedics.dbml` | partial | full hand-microsurg | P2 |
| Foot & Ankle | `orthopedics-station` (sub) | `orthopedics.dbml` | partial | full foot-ankle | P3 |
| Sports Medicine & Arthroscopy | `orthopedics-station` (sub) | `orthopedics.dbml` | partial | full sports med | P2 |
| Orthopedic Oncology | `orthopedics-station` + `oncology-station` | `orthopedics.dbml` + `hemato_oncology.dbml` | minimal | full ortho-onc | P2 |
| Pediatric Orthopedics | `neonatal_pediatrics.dbml` (sub) | `pediatric_subspec.dbml` | partial | full peds ortho | P1 |
| Ophthalmology (general) | `ophthalmology-station` | `ophthalmology.dbml` | ✅ | — | DONE |
| Vitreoretinal Surgery | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full VR | P2 |
| Cornea & External Disease | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full cornea | P2 |
| Eye Bank | none | `ophthalmology.dbml` | none | dedicated eye bank | P3 |
| DMEK / DSAEK | `ophthalmology-station` (sub) | `ophthalmology.dbml` | minimal | full DMEK workspace | P3 |
| Cataract & Anterior Segment | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full cataract | P2 |
| Glaucoma | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full glaucoma | P2 |
| Oculoplastics & Orbit | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full oculoplastics | P3 |
| Pediatric Ophthalmology | `neonatal_pediatrics.dbml` (sub) | `pediatric_subspec.dbml` | partial | full peds ophth | P2 |
| Neuro-ophthalmology | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full neuro-ophth | P3 |
| Refractive Surgery & Lens | `ophthalmology-station` (sub) | `ophthalmology.dbml` | partial | full refractive | P3 |
| ENT (general) | `ent-station` | `ent.dbml` | ✅ | — | DONE |
| Head & Neck Surgery | `ent-station` (sub) | `ent.dbml` | partial | full H&N | P1 |
| Rhinology & Skull Base | `ent-station` (sub) | `ent.dbml` | partial | full rhinology | P2 |
| Otology & Neurotology | `ent-station` (sub) | `ent.dbml` | partial | full otology | P2 |
| Cochlear Implant | `ent-station` (sub) | `ent.dbml` | minimal | full cochlear | P3 |
| Laryngology | `ent-station` (sub) | `ent.dbml` | partial | full laryngology | P3 |
| Thyroid Surgery | `surgery-station` + `ent-station` (joint) | `ent.dbml` + `general_surgery.dbml` | partial | joint workspace | P2 |
| Sleep Surgery | none | `ent.dbml` | minimal | dedicated sleep-surg | P3 |
| Urology (general) | `urology-station` | `urology.dbml` | ✅ | — | DONE |
| Endourology & Stone Disease | `urology-station` (sub) | `urology.dbml` | partial | full endourology | P2 |
| Urologic Oncology | `urology-station` + `oncology-station` | `urology.dbml` + `hemato_oncology.dbml` | partial | full uro-onc | P1 |
| Pediatric Urology | `neonatal_pediatrics.dbml` (sub) | `pediatric_subspec.dbml` | partial | full peds urology | P2 |
| Andrology | `urology-station` (sub) | `urology.dbml` | partial | full andrology | P2 |
| Female Urology & Urodynamics | `urology-station` (sub) | `urology.dbml` + `obgyn.dbml` | minimal | joint workspace | P3 |
| Reconstructive Urology | `urology-station` (sub) | `urology.dbml` | minimal | full reconstructive | P3 |
| Plastic & Reconstructive | `plastic-surgery-station` | `plastic_burns.dbml` | ✅ | — | DONE |
| Facial Plastic | `plastic-surgery-station` (sub) | `plastic_burns.dbml` | partial | full facial | P3 |
| Body Contouring | `plastic-surgery-station` (sub) | `plastic_burns.dbml` | partial | full body-contour | P3 |
| Microsurgery (Plastic) | `plastic-surgery-station` (sub) | `plastic_burns.dbml` | partial | full microsurg | P3 |
| Composite Tissue Allotransplant | none | `plastic_burns.dbml` | none | dedicated CTA | P3 |
| Burns Center | `plastic-surgery-station` (sub) | `plastic_burns.dbml` | partial | full burn center (with burn ICU sub-flag) | P1 |
| Maxillofacial Surgery | `plastic-surgery-station` (sub) | `plastic_burns.dbml` | partial | full maxillofacial | P2 |

---

## 3. OBGYN & PEDIATRICS (المجموعات 18-20)

| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| OB/GYN (general) | `obgyn-peds-station` | `obgyn.dbml` | ✅ | — | DONE |
| Maternal-Fetal Medicine | `obgyn-peds-station` (sub) | `obgyn.dbml` | partial | full MFM | P1 |
| Prenatal Diagnosis (4D US, CVS, amnio) | none | `obgyn.dbml` | minimal | dedicated prenatal dx | P1 |
| Gynecologic Surgery (lap, robotic) | `obgyn-peds-station` (sub) | `obgyn.dbml` | partial | full Gyn-surg | P2 |
| Reproductive Endocrinology & IVF | none | `obgyn.dbml` | minimal | **full IVF workspace** | P1 |
| IVF Lab (ICSI, IMSI, PGD, Cryo) | none | `obgyn.dbml` | none | dedicated IVF lab | P1 |
| Cryopreservation Bank | none | `obgyn.dbml` | none | dedicated cryo bank | P2 |
| Adolescent Gynecology | none | `obgyn.dbml` | minimal | dedicated adolescent gyn | P3 |
| Menopause Medicine | none | `obgyn.dbml` | minimal | dedicated menopause clinic | P3 |
| Urogynecology & Cosmetic Gyn | none | `obgyn.dbml` | minimal | dedicated urogyn | P3 |
| Pediatrics (general) | `obgyn-peds-station` (sub) | `neonatal_pediatrics.dbml` | ✅ | — | DONE |
| Neonatology (NICU level III/IV) | `nicu-station` | `neonatal_pediatrics.dbml` | ✅ | — | DONE |
| Nursery | `nicu-station` (sub) | `neonatal_pediatrics.dbml` | partial | full nursery | P2 |
| Follow-up Clinic (NICU grads) | `nicu-station` (sub) | `neonatal_pediatrics.dbml` | minimal | full follow-up | P3 |
| Pediatric Genetics | none | `neonatal_pediatrics.dbml` | minimal | dedicated genetics | P2 |
| Pediatric Nutrition | none | `neonatal_pediatrics.dbml` | partial | dedicated peds nutrition | P2 |
| Developmental Pediatrics | none | `neonatal_pediatrics.dbml` | minimal | dedicated developmental | P2 |
| Pediatric Cardiology | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds card | P1 |
| Pediatric Nephrology | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds nephro | P2 |
| Pediatric GI | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds GI | P2 |
| Pediatric Hem-Onc | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds hem-onc | P1 |
| Pediatric Ophthalmology | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds ophth | P2 |
| Pediatric ENT | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds ENT | P2 |
| Pediatric Dermatology | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds derm | P3 |
| Pediatric Endocrinology | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds endo | P2 |
| Pediatric Rheumatology | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds rheum | P3 |
| Pediatric Orthopedics | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds ortho | P1 |
| Pediatric General Surgery | `obgyn-peds-station` (sub) | `pediatric_subspec.dbml` | partial | full peds gen-surg | P1 |

---

## 4. DIAGNOSTICS (المجموعات 21-23)

| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Diagnostic Radiology | `radiology-station` | `radiology_imaging.dbml` | ✅ | — | DONE |
| Interventional Radiology | `radiology-station` (sub) | `radiology_imaging.dbml` | partial | full IR | P1 |
| CT Scan (incl. dual-energy, cardiac) | `radiology-station` (sub) | `radiology_imaging.dbml` | ✅ | — | DONE |
| MRI (fMRI, MR-Spect, DTI, MRA) | `radiology-station` (sub) | `radiology_imaging.dbml` | ✅ | — | DONE |
| Ultrasound (TEE, TRUS, 4D) | `radiology-station` (sub) | `radiology_imaging.dbml` | ✅ | — | DONE |
| Nuclear Medicine (PET-CT, etc.) | `radiology-station` (sub) | `radiology_imaging.dbml` | partial | full nuclear | P1 |
| Radioisotope Therapy (I-131) | `oncology-station` (sub) | `radiology_imaging.dbml` + `hemato_oncology.dbml` | minimal | full radioisotope | P2 |
| Pathology (Histo/Cyto/Frozen/EM/IHC/Mol) | `lab-station` | `laboratories.dbml` | ✅ | — | DONE |
| Microbiology (Bact/Vir/Mycol/Paras) | `lab-station` (sub) | `laboratories.dbml` | ✅ | — | DONE |
| Clinical Chemistry | `lab-station` (sub) | `laboratories.dbml` | ✅ | — | DONE |
| Immunology & Serology | `lab-station` (sub) | `laboratories.dbml` | ✅ | — | DONE |
| Medical Genetics (Cyto/Mol/PGD) | `lab-station` (sub) | `laboratories.dbml` | partial | full genetics lab | P1 |
| Toxicology | `lab-station` (sub) | `laboratories.dbml` | partial | full tox lab | P2 |
| Blood Bank | `lab-station` (sub) | `laboratories.dbml` | partial | full blood bank | P1 |
| ECG & Stress Testing | `diagnostics-station` | `functional_diagnostics.dbml` | ✅ | — | DONE |
| Holter / Event Recorder | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | partial | full Holter | P2 |
| Cerebral Angiography | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | partial | full angio | P2 |
| Bronchial Angiography | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | minimal | full bronchial | P3 |
| EMG & Nerve Conduction | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | ✅ | — | DONE |
| Evoked Potentials | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | partial | full EP | P3 |
| EEG (incl. Video-EEG) | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | ✅ | — | DONE |
| PFT (Pulmonary Function Test) | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | ✅ | — | DONE |
| Sweat Test & Allergy | `diagnostics-station` (sub) | `functional_diagnostics.dbml` | partial | full allergy testing | P3 |

---

## 5. CRITICAL CARE (المجموعات 24-26)

| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| General ER | `er-station` | `ed.dbml` | ✅ | — | DONE |
| Trauma Center (Level I/II) | `er-station` (sub) | `ed.dbml` | partial | full trauma center (workflow) | P1 |
| Chest Pain Unit | `er-station` (sub) + `cardiology-station` | `ed.dbml` + `cardiology.dbml` | partial | joint chest-pain | P1 |
| Stroke Unit / Code Stroke | `er-station` (sub) + `neurosurgery-station` | `ed.dbml` + `neurosurgery_spine.dbml` | partial | full stroke unit | P1 |
| Psychiatric Emergency | none | `ed.dbml` + (psych cluster TBD) | minimal | dedicated psych ER | P2 |
| Pediatric ER | `er-station` (sub) | `ed.dbml` | partial | full peds ER | P1 |
| Toxicology Emergency | `er-station` (sub) | `ed.dbml` + `laboratories.dbml` | minimal | full tox ER | P2 |
| Hyper/Hypothermia | `er-station` (sub) | `ed.dbml` | minimal | full thermo unit | P3 |
| Triage | `er-station` (sub) | `ed.dbml` | ✅ | — | DONE |
| Observation Unit | none | `ed.dbml` | minimal | full obs unit | P2 |
| Minor Surgery ER | `er-station` (sub) | `ed.dbml` + `general_surgery.dbml` | partial | full minor surg | P3 |
| Medical ICU | `icu-station` | `intensive_care.dbml` | ✅ | — | DONE |
| Surgical ICU | `icu-station` (sub) | `intensive_care.dbml` | partial | full SICU | P2 |
| Trauma ICU | `icu-station` (sub) | `intensive_care.dbml` | partial | full TICU | P1 |
| CCU (Coronary Care) | `icu-station` (sub) | `intensive_care.dbml` + `cardiology.dbml` | partial | full CCU | P1 |
| Post-Catheterization Care | `icu-station` (sub) | `intensive_care.dbml` | partial | full post-cath | P2 |
| Post-Open-Heart Care | `icu-station` (sub) | `intensive_care.dbml` + `cts_vascular_surgery.dbml` | partial | full post-OH | P1 |
| Neuro ICU | `icu-station` (sub) | `intensive_care.dbml` + `neurosurgery_spine.dbml` | partial | full neuro-ICU | P1 |
| PICU | `icu-station` (sub) | `intensive_care.dbml` + `pediatric_subspec.dbml` | partial | full PICU | P1 |
| NICU | `nicu-station` | `intensive_care.dbml` + `neonatal_pediatrics.dbml` | ✅ | — | DONE |
| Burn ICU | `icu-station` (sub) + `plastic-surgery-station` | `intensive_care.dbml` + `plastic_burns.dbml` | partial | full burn-ICU | P1 |
| Oncology ICU | `icu-station` (sub) | `intensive_care.dbml` + `hemato_oncology.dbml` | partial | full onc-ICU | P2 |
| Renal ICU / Dialysis ICU | `icu-station` (sub) | `intensive_care.dbml` + `nephrology.dbml` | partial | full renal-ICU | P2 |
| Transplant ICU | `icu-station` (sub) | `intensive_care.dbml` | minimal | full transplant-ICU | P1 |
| Obstetric ICU | `icu-station` (sub) | `intensive_care.dbml` + `obgyn.dbml` | partial | full obs-ICU | P2 |
| Anesthesiology (general) | `anesthesia-station` | `anesthesia_pain.dbml` | ✅ | — | DONE |
| Obstetric Anesthesia | `anesthesia-station` (sub) | `anesthesia_pain.dbml` + `obgyn.dbml` | partial | full obs-anesth | P2 |
| Pediatric Anesthesia | `anesthesia-station` (sub) | `anesthesia_pain.dbml` + `neonatal_pediatrics.dbml` | partial | full peds-anesth | P2 |
| Cardiac Anesthesia | `anesthesia-station` (sub) | `anesthesia_pain.dbml` + `cts_vascular_surgery.dbml` | partial | full cardiac-anesth | P2 |
| Interventional Pain Mgmt | `anesthesia-station` (sub) | `anesthesia_pain.dbml` | partial | **full pain center** | P1 |
| Spinal Cord Stimulator | `anesthesia-station` (sub) | `anesthesia_pain.dbml` | minimal | full SCS | P2 |
| Intrathecal Pumps | `anesthesia-station` (sub) | `anesthesia_pain.dbml` | minimal | full ITP | P3 |
| PACU | `pacu-station` | `anesthesia_pain.dbml` | ✅ | — | DONE |
| Hyperbaric Oxygen (HBOT) | `anesthesia-station` (sub) | `anesthesia_pain.dbml` | partial | full HBOT | P2 |

---

## 6. THERAPEUTIC & REHABILITATION (المجموعات 27-29)

| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Physical Therapy | none (legacy in PT) | `rehab_pt.dbml` | partial | full PT workspace | P1 |
| Electrotherapy | none | `rehab_pt.dbml` | minimal | full electrotherapy | P2 |
| Hydrotherapy | none | `rehab_pt.dbml` | minimal | full hydrotherapy | P3 |
| Manual Therapy | none | `rehab_pt.dbml` | minimal | full manual | P3 |
| Post-Op PT | none | `rehab_pt.dbml` | partial | full post-op | P1 |
| Spinal PT | none | `rehab_pt.dbml` | partial | full spinal PT | P2 |
| Occupational Therapy | none | `rehab_pt.dbml` | partial | full OT | P2 |
| Speech & Swallowing | none | `rehab_pt.dbml` | partial | full SLP | P2 |
| SCI Rehab | none | `rehab_pt.dbml` + `neurosurgery_spine.dbml` | partial | full SCI | P1 |
| Pediatric Rehab | none | `rehab_pt.dbml` + `neonatal_pediatrics.dbml` | minimal | full peds rehab | P2 |
| Prosthetics & Orthotics | none | `rehab_pt.dbml` | minimal | full P&O | P2 |
| Child Life / Play Therapy | none | `rehab_pt.dbml` | none | dedicated | P3 |
| Radiation Oncology | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full rad-onc | P1 |
| IMRT | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full IMRT | P2 |
| SRS / Gamma Knife / CyberKnife | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full SRS | P2 |
| Proton Therapy | none | `radiation_pharmacy.dbml` | none | dedicated proton | P3 |
| Brachytherapy | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full brachy | P2 |
| Clinical Pharmacy | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full pharmacy workspace | P1 |
| Chemo Pharmacy | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full chemo-pharm | P1 |
| ICU Pharmacy | `icu-station` (sub) | `radiation_pharmacy.dbml` | minimal | full ICU-pharm | P2 |
| Pediatric Pharmacy | `oncology-station` (sub) | `radiation_pharmacy.dbml` + `neonatal_pediatrics.dbml` | minimal | full peds-pharm | P2 |
| Hematology Pharmacy | `oncology-station` (sub) | `radiation_pharmacy.dbml` | partial | full hem-pharm | P2 |
| Drug Information Center | none | `radiation_pharmacy.dbml` | minimal | full DIC | P3 |
| TDM (Therapeutic Drug Monitoring) | `lab-station` (sub) | `radiation_pharmacy.dbml` + `laboratories.dbml` | partial | full TDM | P2 |
| TCM (Acupuncture, Cupping) | none | `integrative_medicine.dbml` | partial | full TCM | P3 |
| Herbal Medicine | none | `integrative_medicine.dbml` | partial | full herbal | P3 |
| Aromatherapy | none | `integrative_medicine.dbml` | minimal | full aroma | P3 |
| Music Therapy | none | `integrative_medicine.dbml` | minimal | full music | P3 |
| Art Therapy | none | `integrative_medicine.dbml` | minimal | full art | P3 |
| Medical Massage | none | `integrative_medicine.dbml` | minimal | full massage | P3 |
| Medical Yoga | none | `integrative_medicine.dbml` | minimal | full yoga | P3 |
| Pet Therapy | none | `integrative_medicine.dbml` | minimal | full pet | P3 |

---

## 7. SUPPORT SERVICES (المجموعات 30-34)

| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| Nursing Admin | `nursing-station` (legacy) | `nursing.dbml` | partial | full nursing admin | P2 |
| Med-Surg Nursing | `nursing-station` | `nursing.dbml` | ✅ | — | DONE |
| Perioperative Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full peri-op | P2 |
| Critical Care Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full CCN | P2 |
| Pediatric Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full peds-nurse | P2 |
| Obstetric Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full obs-nurse | P2 |
| Home Health Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full home-health | P3 |
| Geriatric Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full geri-nurse | P3 |
| Oncology Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full onc-nurse | P2 |
| Psychiatric Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full psych-nurse | P3 |
| Emergency Nursing | `nursing-station` (sub) | `nursing.dbml` | partial | full ER-nurse | P2 |
| Specialty Nursing (Ophth, ENT, Pain) | `nursing-station` (sub) | `nursing.dbml` | partial | full spec-nurse | P3 |
| Clinical Nutrition | none (proposed `nutrition-station`) | `nutrition.dbml` | partial | full CN | P2 |
| TPN & Enteral | none | `nutrition.dbml` | minimal | full TPN | P2 |
| Disease-Specific Diets | none | `nutrition.dbml` | partial | full disease-diet | P2 |
| Pediatric Nutrition | none | `nutrition.dbml` | partial | full peds-nutrition | P2 |
| Bariatric Nutrition | none | `nutrition.dbml` | minimal | full baria-nutrition | P2 |
| Central Kitchen | none | `nutrition.dbml` | none | full kitchen | P3 |
| Preventive Nutrition | none | `nutrition.dbml` | minimal | full preventive | P3 |
| Medical Social Work | none (proposed `social-station`) | `social_psych.dbml` | partial | full MSW | P2 |
| Patient Relations / Advocacy | none | `social_psych.dbml` | partial | full PR | P2 |
| Health Education | none | `social_psych.dbml` | minimal | full health-ed | P3 |
| Employee Assistance Program | none | `social_psych.dbml` | minimal | full EAP | P3 |
| Biomedical Engineering | none (proposed `his-station`) | `logistics_it.dbml` | partial | full BME | P2 |
| Health IT (HIS / EMR / PACS) | none | `logistics_it.dbml` | partial | full HIS workspace | P1 |
| Medical Translation | none | `logistics_it.dbml` | minimal | full translation | P3 |
| Health Statistics & Big Data | none | `logistics_it.dbml` | minimal | full stats workspace | P1 |
| Telemedicine | none | `logistics_it.dbml` | minimal | full tele | P1 |
| Teleradiology | `radiology-station` (sub) | `logistics_it.dbml` + `radiology_imaging.dbml` | partial | full telerad | P2 |
| Medical Security | none (proposed `safety-station`) | `security_safety.dbml` | minimal | full security | P3 |
| Occupational Health & Safety | none | `security_safety.dbml` | partial | full OHS | P2 |
| Disaster Management | none | `security_safety.dbml` | minimal | full DM | P2 |

---

## 8. ADMIN & ACADEMIC (المجموعات 35-38)

| Master dept | Station | Cluster DBML | Sub-units covered | Sub-units missing | Priority |
|---|---|---|---|---|---|
| CEO Office | none (proposed `admin-station`) | `executive.dbml` | none | full exec dashboard | P1 |
| CMO | none | `executive.dbml` | none | full CMO | P1 |
| CNO | none | `executive.dbml` | none | full CNO | P2 |
| CFO | none | `executive.dbml` | none | full CFO | P1 |
| COO | none | `executive.dbml` | none | full COO | P2 |
| Medical Staff Council | none | `executive.dbml` | none | full council | P3 |
| Ethics Committee | none | `executive.dbml` | none | full ethics | P3 |
| Patient Care Committee | none | `executive.dbml` | none | full PCC | P3 |
| TQM | none (proposed `quality-station`) | `quality_accreditation.dbml` | partial | full TQM | P1 |
| Credentialing & Privileging | none | `quality_accreditation.dbml` | partial | full C&P | P2 |
| JCI / CAP / ISO | none | `quality_accreditation.dbml` | partial | full JCI workspace | P1 |
| Medical Audit | none | `quality_accreditation.dbml` | partial | full audit | P1 |
| Patient Complaints | none | `quality_accreditation.dbml` | partial | full complaints | P1 |
| Risk Management | none | `quality_accreditation.dbml` | partial | full risk | P1 |
| Medical Liability | none | `quality_accreditation.dbml` | minimal | full liability | P2 |
| Medical Education Center | none (proposed `research-station`) | `education_research.dbml` | partial | full education | P1 |
| Internship / Residency / Fellowship | none | `education_research.dbml` | partial | full GME | P1 |
| CME | none | `education_research.dbml` | partial | full CME | P2 |
| Clinical Trials Unit (CTU / CRC) | none | `education_research.dbml` | minimal | full CTU | P1 |
| Basic Science Research | none | `education_research.dbml` | none | full BSR | P3 |
| Clinical Pharmacology Research | none | `education_research.dbml` | minimal | full CPR | P2 |
| IRB | none | `education_research.dbml` | partial | full IRB | P1 |
| Biostatistics | none | `education_research.dbml` | minimal | full biostats | P1 |
| Publication Office | none | `education_research.dbml` | none | full pubs | P3 |
| Medical Library | none | `education_research.dbml` | minimal | full library | P3 |
| Simulation Center | none | `education_research.dbml` | minimal | full sim center (OR/ER/OB) | P2 |
| Medical HR | none (proposed `hr-station`) | `hr_admin.dbml` | partial | full med-HR | P1 |
| Training & Development | none | `hr_admin.dbml` | partial | full T&D | P2 |
| Legal Affairs | none | `hr_admin.dbml` | partial | full legal | P2 |
| Public Relations | none | `hr_admin.dbml` | partial | full PR | P3 |
| Medical Media | none | `hr_admin.dbml` | minimal | full media | P3 |
| Community Outreach | none | `hr_admin.dbml` | minimal | full outreach | P3 |
| Call Center / Customer Service | none | `hr_admin.dbml` | partial | full call center | P2 |

---

## 9. CENTERS OF EXCELLENCE (15 unified dashboards)

| Center | Aggregates | Status | Priority |
|---|---|---|---|
| Heart & Vascular Center | cardiology + CTS + vascular | not built | P1 |
| Comprehensive Cancer Center | onco + hem + BMT + rad-onc + pharmacy | not built | P1 |
| Orthopedic & Spine Center | ortho + neuro-spine + rehab | not built | P1 |
| Advanced Fertility Center | OB-GYN + IVF + andrology | not built | P1 |
| ENT & Head-Neck Center | ENT + dental + maxillofacial | not built | P2 |
| Trauma Center | ER + trauma-surg + ortho-trauma + neuro-trauma | not built | P1 |
| Burn Center | plastic + burn-ICU + rehab | not built | P1 |
| Transplant Center | nephro + CTS + gastro-hepato + BMT | not built | P1 |
| Geriatric Center | internal-med + rehab + psych | not built | P2 |
| Pain Center | anesthesia-pain + neurosurgery + rehab | not built | P1 |
| Bariatric & Metabolic Center | endo + gastro + surgery-bariatric | not built | P1 |
| Children's Hospital (within hospital) | all peds + NICU + PICU + sub-specs | not built | P1 |
| Behavioral Health Center | psych + addiction + geri-psych | not built | P2 |
| Eye Institute | ophth + oculoplastics + peds-ophth | not built | P2 |
| Neuroscience & Stroke Center | neuro + neurosurgery + rehab + stroke unit | not built | P1 |
| Women & Fetal Center | OB + fetal-med + neonatology | not built | P1 |

---

## 10. RARE & SUPER-SPECIALIZED (12 deep specs)

| Dept | Status | Engine needed | Priority |
|---|---|---|---|
| Space & Dive Medicine | none | `space_medicine.js` | P3 |
| Sleep Disorders Center (Polysomnography) | partial | `sleep_study.js` | P1 |
| Epilepsy Monitoring Unit | partial | `epilepsy_em.js` | P2 |
| Advanced Stem Cell Therapy | none | `stem_cell.js` | P3 |
| Fetal Surgery | none | `fetal_surgery.js` | P2 |
| Fetal Medicine Unit | partial | `fetal_medicine.js` | P1 |
| Deep Brain Stimulation (DBS) | partial | extension to `neurosurgery_engine` | P2 |
| Nuclear Medicine Therapy | partial | extension to `lis.js` | P2 |
| Cryotherapy / Cryosurgery | none | `cryo_unit.js` | P3 |
| Confocal Laser Endomicroscopy | none | `endomicro_engine.js` | P3 |
| Pharmacogenomics | none | `pharmacogenomics.js` | P1 |
| Nanomedicine & Microrobotics | none | `nanomedicine_engine.js` | P3 |

---

## COVERAGE SUMMARY

| Group | Sub-units | Done | Partial | Missing | % Done |
|---|---|---|---|---|---|
| Internal Medicine | 45 | 9 | 27 | 9 | 20% |
| Surgical | 50 | 8 | 35 | 7 | 16% |
| OBGYN & Peds | 30 | 2 | 13 | 15 | 7% |
| Diagnostics | 30 | 3 | 24 | 3 | 10% |
| Critical Care | 28 | 4 | 22 | 2 | 14% |
| Therapeutic & Rehab | 25 | 1 | 14 | 10 | 4% |
| Support Services | 30 | 0 | 8 | 22 | 0% |
| Admin & Academic | 25 | 0 | 2 | 23 | 0% |
| Centers of Excellence | 15 | 0 | 0 | 15 | 0% |
| Rare & Super-Specialized | 12 | 0 | 4 | 8 | 0% |
| **TOTAL** | **290** | **27** | **149** | **114** | **~9%** |

**Verdict:** Stations exist for ~30 top-level dept groups. Sub-unit workspaces
and AI orchestration are the next frontier. Phase 3 will close ~75% of the
gap using the 11-batch rollout (estimated 1,700 docs, ~150K effective tokens).
