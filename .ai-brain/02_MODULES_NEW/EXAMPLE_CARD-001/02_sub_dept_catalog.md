# 02 — Sub-Department Catalog (CARD-001)

> Owner: CMO · Source: MASTER_CATALOG_v3.yaml#cardiology.subs

| Sub-ID | Name (AR) | Name (EN) | Key Procedures | Key Equipment | Key Staff |
|--------|-----------|-----------|----------------|---------------|-----------|
| CARD-002 | طب القلب التداخلي | Interventional | PCI, TAVR, MitraClip, Watchman, ASD/PFO | Cath lab, IVUS, OCT, FFR | Interventional cardiologist, cath lab nurse, RT |
| CARD-003 | طب القلب الإلكتروفيزيولوجي | Electrophysiology | Ablation, Pacemaker, ICD, CRT, Leadless | 3D mapping, fluoro, EP lab | EP cardiologist, device nurse |
| CARD-004 | طب القلب الوقائي | Preventive | Lipid clinic, HTN clinic, cardiac rehab | Treadmill, echo, holter | Preventive cardiologist, RN, dietitian |
| CARD-005 | طب القلب النووي | Nuclear | SPECT MPI, PET MPI, MUGA | Gamma camera, PET | Nuclear cardiologist, nuclear tech, radiopharmacy |
| CARD-006 | طب القلب للحوامل | Cardio-Obstetrics | High-risk pregnancy cardio, PPCM | Echo, BNP, tele-monitoring | Cardio-obstetrician, OBG, neonatologist on call |
| CARD-007 | قسطرة القلب | Cath Lab | Diagnostic, PCI, FFR, IVUS | Cath lab equipment, ACT | Interventional cardiologist, cath lab RN |
| CARD-008 | أمراض الشرايين الطرفية | Peripheral Vascular | PVI, atherectomy, CLI, wound care | Vascular lab, angio suite | Vascular cardiologist, vascular surgeon, wound nurse |
| CARD-009 | الفشل القلبي المتقدم | Advanced HF | LVAD, transplant, CardioMEMS, IV diuresis | HF clinic, IV diuresis suite | Advanced HF cardiologist, HF nurse, transplant coord |

## Cross-references

- **wf-2 (CODE STEMI)** ↔ CARD-002 + CARD-007 + ER + CCU
- **wf-3 (HF clinic)** ↔ CARD-009 + Pharm + Nutrition
- **wf-4 (AF)** ↔ CARD-003 (EP)
- **wf-5 (preop)** ↔ Anesthesia + Surgery
