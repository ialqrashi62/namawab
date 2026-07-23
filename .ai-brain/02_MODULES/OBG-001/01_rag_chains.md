# OBG-001 — RAG Chains (LangGraph)

## Chain 1: Preeclampsia Triage
- **Trigger:** BP >140/90 after 20 weeks + proteinuria
- **Steps:**
  1. Confirm gestational age
  2. Severity assessment (severe features: BP ≥160/110, plts <100k, AST >70, Cr >1.1, pulmonary edema, neuro symptoms)
  3. Order labs (CBC, LFT, Cr, uric acid, LDH, urine protein:Cr)
  4. MgSO4 (4g IV load, then 1-2g/h maintenance) if severe
  5. Antihypertensive (labetalol, hydralazine, nifedipine)
  6. Corticosteroids if <34 weeks
  7. Delivery plan (timing based on severity + GA)
- **Output:** Classification + treatment plan

## Chain 2: GDM Screening & Management
- **Trigger:** 24-28 weeks or risk factors
- **Steps:**
  1. OGTT 75g (one-step) or 50g screen → 100g diagnostic (two-step)
  2. If positive: GDM diagnosis
  3. Medical nutrition therapy + exercise
  4. Self-monitoring blood glucose
  5. Insulin if glucose targets not met
  6. Fetal monitoring (growth US q4 weeks)
  7. Delivery plan (40 weeks if well-controlled, 38 if poor)
- **Output:** GDM management plan

## Chain 3: Labor & Delivery Triage
- **Trigger:** Contractions, rupture of membranes, bleeding, decreased fetal movement
- **Steps:**
  1. Assess (history, vitals, fetal heart, cervical exam, ultrasound)
  2. Determine true vs false labor
  3. Admit to L&D if in active labor
  4. Stage of labor, fetal monitoring (Category I, II, III)
  5. Pain management options
  6. Delivery plan (vaginal vs C-section)
- **Output:** Disposition (admit, discharge home with precautions, C-section)

## Chain 4: Postpartum Hemorrhage
- **Trigger:** EBL >500mL (SVD) or >1000mL (C-section), or unstable
- **Steps:**
  1. Call for help (OB, anesthesia, blood bank)
  2. 2 large-bore IVs, type & crossmatch
  3. Uterine massage
  4. Uterotonic: oxytocin 10U IV (then 20U/L drip)
  5. If atonic: misoprostol, methylergometrine, carboprost
  6. If retained tissue: D&C
  7. If trauma: repair
  8. If atony + medical: balloon tamponade (Bakri)
  9. If all else: surgical (B-Lynch suture, artery ligation, hysterectomy)
- **Output:** PPH management + transfusion protocol

## Chain 5: Infertility Workup
- **Trigger:** <12 months trying (or earlier if AMA, irregular cycles)
- **Steps:**
  1. History (cycle, prior pregnancies, STIs, prior surgery)
  2. Semen analysis (male factor 50%)
  3. Ovulation assessment (mid-luteal progesterone, OPK)
  4. Tubal patency (HSG)
  5. Uterine cavity (saline sonohysterography)
  6. Hormones (FSH, LH, TSH, prolactin, AMH)
  7. Treatment (timed intercourse → IUI → IVF)
- **Output:** Workup + treatment plan

## Chain 6: Cervical Cancer Screening
- **Trigger:** Age 21-65
- **Steps:**
  1. Pap smear q3y (21-29), Pap+HPV co-test q5y (30-65)
  2. ASCUS → HPV reflex
  3. LSIL/HSIL → colposcopy
  4. Biopsy if abnormal
  5. Treatment (LEEP, cone, hysterectomy)
- **Output:** Screening result + plan

## Vector Indexes
- **prenatal_protocols_idx** — 200 prenatal screening, vaccination
- **labor_management_idx** — 150 labor scenarios
- **pph_protocols_idx** — 100 PPH algorithms
- **gyn_protocols_idx** — 300 gyn conditions
- **infertility_idx** — 100 infertility workups
- **onc_protocols_idx** — 50 gyn oncology
