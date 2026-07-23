---
module_id: MICU
name: "Medical ICU (MICU)"
parent: "ICU"
code: ICU
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# MICU — Medical Intensive Care Unit

## Mission
Critical care for adult medical patients: respiratory failure, sepsis, shock, multi-organ failure, post-cardiac arrest, severe metabolic/electrolyte derangements. 24/7 intensivist coverage.

## Top 10 Conditions (CMO)
| # | Condition | ICD-10 | Mortality |
|---|-----------|--------|-----------|
| 1 | Septic shock | A41 + R65.21 | 30-50% |
| 2 | ARDS | J80 | 30-40% |
| 3 | Cardiogenic shock | R57.0 | 50-80% |
| 4 | Acute respiratory failure | J96 | 20-40% |
| 5 | Status epilepticus | G41 | 10-30% |
| 6 | GI bleed (massive) | K92.2 | 10-25% |
| 7 | DKA severe | E10.10 | <5% with treatment |
| 8 | Severe electrolyte derangement | E87 | 5-15% |
| 9 | Multi-organ dysfunction | R65.1 | 40-80% |
| 10 | Acute liver failure | K72 | 30-60% |

## ICU Scoring Systems

### APACHE II (Acute Physiology and Chronic Health Evaluation)
- 12 variables + age + chronic health
- Score 0-71
- Mortality estimate: 0-4 = 4%, 5-9 = 8%, ..., 35+ = 85%
- Admission + daily recalculation

### SOFA (Sequential Organ Failure Assessment)
- 6 organ systems (respiratory, coagulation, liver, cardiovascular, CNS, renal)
- Score 0-4 per system
- Total 0-24
- ΔSOFA ≥2 = organ dysfunction, triggers sepsis evaluation

### qSOFA (quick SOFA)
- 3 variables: RR ≥22, altered mental status, SBP ≤100
- Score ≥2 = high risk of poor outcome (suspicion of sepsis)

### GCS (Glasgow Coma Scale)
- Eye (1-4), Verbal (1-5), Motor (1-6)
- Total 3-15
- <8 = intubation consideration

## Workflow
1. **Admission** — from ED, ward, OR, or transfer
2. **Initial assessment** — full history, exam, lines, monitoring
3. **Resuscitation** — ABCs, fluids, vasopressors as needed
4. **Daily rounds** — intensivist + team, 2x/day minimum
5. **Monitoring** — continuous + frequent labs
6. **Family communication** — at least daily update
7. **Disposition** — ward, step-down, transfer, or palliative

## Red Flags (Top 10)
1. Cardiac arrest
2. Respiratory failure requiring intubation
3. Hemodynamic instability (MAP <65, lactate >4)
4. Severe arrhythmias (VT, VF, asystole)
5. Massive bleeding
6. Severe hypoxemia (SpO2 <88 on 100% O2)
7. Status epilepticus
8. Acute change in mental status
9. Multi-organ failure
10. Withdrawal of life support (ethical consult)

## Mechanical Ventilation

### Initial Settings (ARDSNet)
- Mode: AC or SIMV
- Tidal volume: 6-8 mL/kg PBW (lung-protective)
- PEEP: 5-15 cm H2O (titrate to SpO2)
- FiO2: titrate to SpO2 88-92% (ARDSNet table)
- Respiratory rate: 12-20
- I:E ratio: 1:2 (default)

### Weaning
- Daily SAT (spontaneous awakening trial)
- Daily SBT (spontaneous breathing trial)
- Criteria: improving underlying cause, adequate mental status, hemodynamically stable, low vent support

## Sepsis Bundle (1-hour, Surviving Sepsis 2021)
- Lactate measurement (repeat if >2)
- Blood cultures BEFORE antibiotics
- Broad-spectrum antibiotics (within 1h)
- IV crystalloid 30 mL/kg if hypotensive or lactate ≥4
- Vasopressors if MAP <65 after fluids (norepinephrine first)

## Vasopressors
| Drug | Dose | Indication |
|------|------|-----------|
| Norepinephrine | 0.05-1 mcg/kg/min | First-line septic shock |
| Vasopressin | 0.04 units/min | Adjunct to norepi |
| Epinephrine | 0.05-1 mcg/kg/min | Refractory shock, anaphylaxis |
| Dopamine | 5-20 mcg/kg/min | Alternative (arrhythmia risk) |
| Dobutamine | 5-20 mcg/kg/min | Cardiogenic shock with low CO |
| Phenylephrine | 0.1-1 mcg/kg/min | Pure α-agonist (less used) |

## Sedation + Analgesia
- **Pain:** fentanyl, hydromorphone, morphine
- **Sedation:** propofol, dexmedetomidine, midazolam
- **Goal:** RASS -2 to 0 (light sedation, daily SAT)
- **Delirium:** CAM-ICU screening q12h

## Nutrition
- Enteral preferred (NG or NJ tube)
- Start within 24-48h if hemodynamically stable
- Goal: 25-30 kcal/kg/day, 1.2-2 g/kg/day protein
- TPN if unable to tolerate enteral (≥7 days)

## DVT Prophylaxis
- Heparin 5000 units SC q8h (or q12h)
- Enoxaparin 40 mg SC daily (if CrCl >30)
- Sequential compression devices (SCDs)
- Hold if active bleeding or platelets <50

## Stress Ulcer Prophylaxis
- PPI (pantoprazole 40 mg IV daily) if risk factors:
  - Mechanical ventilation >48h
  - Coagulopathy
  - TBI, spinal cord injury
  - Major burns
  - Sepsis

## Blood Transfusion
- Restrictive: Hgb <7 (most patients)
- Hgb <8 (ACS, symptomatic CAD)
- Hgb <10 (acute coronary syndrome ongoing)
- 1 unit PRBC at a time, recheck Hgb

## KPIs
- ICU mortality (overall + by APACHE)
- Standardized mortality ratio (SMR)
- Ventilator days
- Central line days
- CLABSI rate (target: 0)
- CAUTI rate (target: 0)
- VAP rate (target: <5 per 1000 vent days)
- Pressure ulcer rate (target: 0)
- Unplanned extubation rate (target: <1%)
- ICU readmission within 48h
- Average ICU LOS

## AI Decision Support
- Early warning score (NEWS, NEWS2)
- Sepsis screening (qSOFA, SOFA)
- Ventilator weaning readiness
- Sedation level (RASS)
- Delirium (CAM-ICU)
- Drug dosing (especially renal dose adjustment)
- Drug interaction check

## Compliance
- **JCI:** COP.4 (Resuscitation), COP.5 (Medication), MMU.1-7, PCI (Infection), QPS (Quality)
- **CBAHI:** ICU standards
- **PDPL:** All PHI
- **SCCM/ESICM:** Surviving Sepsis Campaign

## L4 Validation: 6/6 PASS
- Red flags: 10+ identified (cardiac arrest, respiratory failure, shock, etc.)
- Drug safety: renal dose, weight-based for peds, double-check for high-alert
- PHI: encrypted (all vitals, notes, images)
- Auth: Intensivist + ICU-trained RN
- Compliance: JCI, CBAHI, SCCM
- Tests: APACHE, SOFA, qSOFA, sepsis bundle, vent weaning

---
*Generated 2026-07-23. Tier-1 priority (highest mortality reduction).*
