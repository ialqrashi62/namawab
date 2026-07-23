---
module_id: ER-001
section: 01_clinical_spec
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 ICD-10 / SNOMED CT / LOINC Map

## Top 50 ER Diagnoses (ICD-10-CM)

| # | Diagnosis | ICD-10 | SNOMED CT | LOINC (if lab) |
|---|-----------|--------|-----------|----------------|
| 1 | STEMI (anterior wall) | I21.0 | 401303003 | 10839-9 (troponin) |
| 2 | STEMI (inferior wall) | I21.1 | 401304005 | 10839-9 |
| 3 | NSTEMI | I21.4 | 401305006 | 10839-9 |
| 4 | Unstable angina | I20.0 | 4557003 | 10839-9 |
| 5 | Ischemic stroke | I63.9 | 422504002 | (CT, no lab) |
| 6 | Hemorrhagic stroke | I61.9 | 23276006 | (CT) |
| 7 | TIA | G45.9 | 266257000 | (CT/MRI) |
| 8 | Subarachnoid hemorrhage | I60.9 | 21454007 | (CT) |
| 9 | Pulmonary embolism | I26.9 | 59282003 | D-dimer 48099-2 |
| 10 | Aortic dissection | I71.00 | 308546005 | (CT angio) |
| 11 | Cardiac arrest | I46.9 | 410620009 | — |
| 12 | Atrial fibrillation | I48.91 | 49436004 | — |
| 13 | Sepsis | A41.9 | 10001005 | Lactate 2524-7, BCx |
| 14 | Severe sepsis | A41.9 + R65.2 | 10001005 + 76571007 | — |
| 15 | Septic shock | A41.9 + R65.21 | 10001005 + 10042005 | — |
| 16 | Pneumonia (CAP) | J18.9 | 385093006 | Procalcitonin 33914-3 |
| 17 | COPD exacerbation | J44.1 | 13645005 | ABG |
| 18 | Asthma exacerbation | J45.901 | 55570000 | Peak flow |
| 19 | Acute respiratory failure | J96.00 | 65710008 | ABG |
| 20 | Pulmonary edema | J81.0 | 19242006 | BNP 42637-9 |
| 21 | Anaphylaxis | T78.2 | 247472004 | Tryptase 21582-5 |
| 22 | Acute abdomen | R10.0 | 79886009 | Lipase 3040-3 |
| 23 | Appendicitis | K35.80 | 74400008 | WBC 6690-2 |
| 24 | Cholecystitis | K81.0 | 76581006 | LFTs |
| 25 | Bowel obstruction | K56.60 | 81060008 | — |
| 26 | GI bleed (upper) | K92.2 | 87763006 | Hgb 718-7, BUN 3094-0 |
| 27 | GI bleed (lower) | K92.2 | 87763006 | Hgb |
| 28 | Acute pancreatitis | K85.9 | 197456007 | Lipase, amylase |
| 29 | UTI | N39.0 | 68566005 | UA 24356-8, culture |
| 30 | Pyelonephritis | N10 | 45816000 | UA, BCx |
| 31 | Renal colic | N23 | 7093002 | UA, CT-KUB |
| 32 | Testicular torsion | N44.1 | 81996005 | Doppler US |
| 33 | Ectopic pregnancy | O00.9 | 79586000 | hCG 2118-3 |
| 34 | Spontaneous abortion | O03.9 | 17369002 | hCG, type & screen |
| 35 | Placental abruption | O45.9 | 415105001 | — |
| 36 | Pre-eclampsia | O14.9 | 398254007 | — |
| 37 | Hyperglycemia/DKA | E10.10 | 420491004 | Glucose 2345-7, HbA1c |
| 38 | Hypoglycemia | E16.2 | 80394007 | Glucose |
| 39 | Thyroid storm | E05.91 | 34486009 | TSH, free T4 |
| 40 | Adrenal crisis | E27.2 | 70704007 | Cortisol 2143-6 |
| 41 | Acute kidney injury | N17.9 | 14669001 | Creatinine 2160-0, BUN |
| 42 | Hyperkalemia | E87.5 | 14140009 | K 2823-3, ECG |
| 43 | Hyponatremia | E87.1 | 89627008 | Na 2951-2 |
| 44 | Drug overdose | T50.901 | 7248001 | Tox screen 6772-1 |
| 45 | Alcohol intoxication | F10.129 | 25702006 | ETOH 5644-0 |
| 46 | Suicide attempt | T14.91 | 30461009 | — |
| 47 | Acute psychosis | F23.9 | 191526005 | — |
| 48 | Seizure | R56.9 | 91175000 | Anti-epileptic levels |
| 49 | Migraine | G43.909 | 37796009 | — |
| 50 | Meningitis | G03.9 | 7180009 | LP, CSF culture |

## Procedures (CPT + SNOMED)

| Procedure | CPT | SNOMED CT |
|-----------|-----|-----------|
| CPR | 92950 | 89666000 |
| Defibrillation | 92960 | 42588008 |
| Cardioversion | 92961 | 250980009 |
| Endotracheal intubation | 31500 | 112798008 |
| Central line (IJ) | 36556 | 40582007 |
| Central line (femoral) | 36558 | 40582007 |
| Arterial line | 36620 | 182771004 |
| Chest tube | 32551 | 179406003 |
| Needle decompression | 32554 | 182705001 |
| Thoracentesis | 32554 | 91602002 |
| Paracentesis | 49082 | 1339006 |
| Lumbar puncture | 62270 | 6717004 |
| NG tube | 43752 | 23550003 |
| Foley | 51702 | 41051000 |
| FAST ultrasound | 93308 | 426396005 |
| Echocardiogram (limited) | 93308 | 40701008 |
| Laceration repair (simple) | 12001-12018 | 26104002 |
| Laceration repair (intermediate) | 12031-12057 | 26104002 |
| Laceration repair (complex) | 13100-13160 | 26104002 |
| Incision & drainage | 10060, 10061 | 64647001 |
| Splinting | 29065-29584 | 30242003 |
| Reduction (dislocation) | 23650-27848 | 181600006 |
| Foreign body removal | various | 44677007 |
| Activated charcoal | (no separate CPT) | 387458008 |
| Thrombolysis (tPA) | 37195 | 425489005 |
| Cardioversion (elective) | 92960 | 250980009 |

## Medications (RxNorm)

| Drug | RxNorm | Common ER Dose |
|------|--------|----------------|
| Aspirin | 1191 | 325 mg PO |
| Clopidogrel | 32968 | 300-600 mg PO |
| Ticagrelor | 1116628 | 180 mg PO |
| Heparin | 5224 | 60 U/kg bolus, 12 U/kg/h |
| Enoxaparin | 6809 | 1 mg/kg SC q12h |
| Alteplase (tPA) | 25473 | 0.9 mg/kg (max 90mg) |
| Tenecteplase | 259790 | weight-based bolus |
| Epinephrine | 3992 | 1 mg IV q3-5min (ACLS) |
| Amiodarone | 703 | 300 mg IV, then 150 mg |
| Adenosine | 446 | 6 mg, 12 mg, 12 mg IV push |
| Atropine | 1223 | 0.5-1 mg IV |
| Nitroglycerin | 4917 | 0.4 mg SL, 5-200 mcg/min IV |
| Morphine | 7052 | 0.1 mg/kg IV |
| Fentanyl | 4337 | 1-2 mcg/kg IV |
| Ondansetron | 26225 | 4 mg IV |
| Ceftriaxone | 23148 | 1-2 g IV |
| Azithromycin | 308136 | 500 mg IV |
| Vancomycin | 11124 | 15-20 mg/kg IV |
| Piperacillin-tazobactam | 348795 | 4.5 g IV |
| Levetiracetam | 1443068 | 1000-1500 mg IV |
| Mannitol | 6575 | 0.5-1 g/kg IV |
| Sodium bicarbonate | 36676 | 1 mEq/kg IV |
| Calcium gluconate | 1907 | 1-3 g IV |
| Naloxone | 7242 | 0.04-0.4 mg IV |
| Flumazenil | 5956 | 0.2 mg IV (caution) |

## All Critical Care Labs (LOINC)

| Test | LOINC | TAT (ER) | Critical Value |
|------|-------|----------|----------------|
| Troponin I (high-sensitivity) | 10839-9 | <60 min | >0.04 ng/mL (gender-specific) |
| CBC with differential | 57021-8 | <30 min | Hgb <7, Plt <20, WBC <2 or >30 |
| BMP | 24323-8 | <30 min | K <2.5 or >6.5, Na <120 or >160, Glu <50 or >500 |
| Lactate | 2524-7 | <15 min | >2 mmol/L (sepsis) / >4 (severe) |
| ABG | 24336-0 | <15 min | pH <7.2 or >7.6, pO2 <60, pCO2 >50 |
| D-dimer | 48099-2 | <60 min | >500 ng/mL FEU (age-adjusted) |
| BNP | 42637-9 | <60 min | >500 pg/mL (HF) / >100 (age>50) |
| Procalcitonin | 33914-3 | <90 min | >0.25 ng/mL (bacterial) |
| hCG (quantitative) | 2118-3 | <60 min | any in male / >1000 in female (ectopic risk) |
| Urinalysis | 24356-8 | <30 min | +blood, +leuk esterase, +nitrite |
| Toxicology screen | 6772-1 | <60 min | any positive |
| Ethanol | 5644-0 | <30 min | >300 mg/dL (severe) |
| Ammonia | 1841-9 | <60 min | >100 umol/L |
| Carboxyhemoglobin | 20563-9 | <30 min | >10% (smoker) / >25% (severe CO) |
| Methemoglobin | 2614-6 | <30 min | >3% (normal) / >30% (severe) |

## Critical Values — Auto-Callback (GATE3)

All critical values trigger immediate callback to ordering MD (15 min SLA):
- Per `lis.js` `autoVerify()` + `isCritical()` functions
- Hash-chained audit log of call + acknowledgment
- Repeat callback if not acknowledged in 30 min (charge nurse)

---
*Section 01.c of ER-001. Owner: AIE + SA. L4 validated.*
