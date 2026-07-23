---
module_id: PEDS-002
name: "Neonatology NICU L3/L4"
parent: "Pediatrics"
code: PEDS
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# PEDS-002 — Neonatology NICU L3/L4

## Mission
Critical care for premature and sick newborns (typically <32 weeks gestation, <1500g, or with life-threatening conditions). Highest level of neonatal intensive care.

## Top 10 Conditions (CMO)
| # | Condition | ICD-10 | Severity |
|---|-----------|--------|----------|
| 1 | Respiratory distress syndrome (RDS) | P22.0 | Critical |
| 2 | Neonatal sepsis | P36 | Critical |
| 3 | Necrotizing enterocolitis (NEC) | P77 | Critical |
| 4 | Intraventricular hemorrhage (IVH) | P52 | Critical |
| 5 | Patent ductus arteriosus (PDA) | Q25.0 | Variable |
| 6 | Bronchopulmonary dysplasia (BPD) | P27.1 | Chronic |
| 7 | Retinopathy of prematurity (ROP) | H35.1 | Variable |
| 8 | Persistent pulmonary hypertension (PPHN) | P29.3 | Critical |
| 9 | Hypoxic-ischemic encephalopathy (HIE) | P91.6 | Critical |
| 10 | Congenital heart disease | Q20-Q28 | Variable |

## NICU Levels

### Level I — Well-baby nursery
- Healthy newborns ≥35 weeks
- Stabilization before transfer

### Level II — Special care nursery
- >32 weeks, >1500g
- Short-term respiratory support (CPAP)
- IV fluids, antibiotics

### Level III — NICU
- <32 weeks, <1500g
- Sustained life support
- Advanced ventilation (HFOV, iNO)
- Multi-specialty consults

### Level IV — Regional NICU
- All Level III + surgical repair
- ECMO
- Complex congenital surgery
- 24/7 in-house neonatologist

## Red Flags (Top 10)
1. Apnea (>20 sec, with bradycardia/desaturation)
2. Bradycardia (HR <100)
3. Hypoxia (SpO2 <85)
4. Hypothermia (<36.5°C axillary)
5. Hypoglycemia (glucose <40 mg/dL)
6. Severe anemia (Hgb <10 in first week)
7. Hemorrhage (any site, especially IVH signs)
8. NEC signs (bloody stool, abdominal distension)
9. Seizures
10. Sudden deterioration (sepsis, pneumothorax, etc.)

## Workflow
1. **Admission** — receive from L&D, stabilization, initial assessment
2. **Thermoregulation** — radiant warmer / incubator
3. **Respiratory** — CPAP, mechanical ventilation, surfactant
4. **Nutrition** — TPN, enteral feeds (breast milk preferred)
5. **Monitoring** — continuous vital signs, labs, imaging
6. **Family-centered care** — parental involvement, kangaroo care
7. **Discharge** — when stable, typically near term-equivalent

## AI Decision Support
- **Apgar scoring** (1, 5, 10 min)
- **CRIB-II score** (mortality risk)
- **SNAP-II score** (illness severity)
- **Growth chart tracking** (Fenton, Olsen)
- **Nutrition calculator** (TPN components, breast milk fortification)
- **Ventilator settings** (based on ABG)
- **Sepsis risk calculator** (Kaiser sepsis calculator)

## Drug Safety (Pediatric)
- **ALL medications weight-based** (mg/kg or mcg/kg)
- Double-check with pharmacist
- TPN compounding in pharmacy
- Look-alike/sound-alike (TALL-man)
- High-alert medications (insulin, heparin, vasopressors) require independent double-check
- Off-label use documented

## Common NICU Medications
| Drug | Indication | Dose |
|------|-----------|------|
| Surfactant (poractant alfa) | RDS | 200 mg/kg endotracheal |
| Caffeine citrate | Apnea of prematurity | 20 mg/kg loading, 5-10 mg/kg/day |
| Indomethacin | PDA closure | 0.1-0.2 mg/kg q12h x 3 doses |
| Ibuprofen | PDA closure | 10 mg/kg, then 5 mg/kg/day x 2 |
| Dopamine | Hypotension | 5-20 mcg/kg/min |
| Dobutamine | Low cardiac output | 5-20 mcg/kg/min |
| Furosemide | Fluid overload | 0.5-1 mg/kg q6-12h |
| Hydrocortisone | Refractory hypotension | 1 mg/kg q8h |
| Ampicillin + Gentamicin | Sepsis | ampicillin 50 mg/kg q8h, gent 4 mg/kg q24h |
| Vancomycin | MRSA | 15 mg/kg q8-12h |
| Insulin | Hyperglycemia | 0.05-0.1 units/kg/h |
| Phenobarbital | Seizures | 20 mg/kg loading, 3-5 mg/kg/day |

## Respiratory Support
- **CPAP:** 5-8 cm H2O, for mild-moderate RDS
- **Mechanical ventilation:** for severe RDS, apnea
  - Conventional: SIMV, AC
  - High-frequency: HFOV (for rescue)
- **Surfactant:** for RDS (early rescue or prophylactic <28 weeks)
- **iNO:** for PPHN
- **ECMO:** for refractory respiratory failure

## Nutrition
- **TPN:** within first 24h if NPO
- **Enteral:** breast milk (preferred), donor milk, preterm formula
- **Fortification:** human milk fortifier (HMF) when >80 mL/kg/day
- **Goal:** 120-150 mL/kg/day by day 5-7
- **TPN components:** protein 3-4 g/kg/day, lipid 1-3 g/kg/day, dextrose

## Monitoring
- **Continuous:** HR, RR, SpO2, BP (invasive or non-invasive), temperature
- **Intermittent:** glucose, electrolytes, blood gases
- **Imaging:** CXR (daily while on vent), head US (days 7, 14, 28), echo (PDA)
- **ROP screening:** all infants <30 weeks, <1500g (eye exam at 4-6 weeks)

## Family-Centered Care
- Kangaroo (skin-to-skin) care
- Parental presence 24/7
- Lactation support
- Sibling visits
- Parent education (discharge preparation)

## Discharge Criteria
- Stable vital signs
- Off respiratory support (or on home support)
- Feeding well (PO or NG)
- Weight >1800-2000g (typically)
- Thermoregulation in open crib
- Parents trained on care
- Follow-up arranged (pediatrician, specialist, ROP, hearing)

## KPIs
- Mortality (target: <10% inborn, <15% outborn)
- Severe IVH (grade 3-4): <10%
- BPD (oxygen at 36 weeks corrected age): <25%
- NEC (stage 2+): <5%
- Late-onset sepsis: <10%
- ROP requiring treatment: <5%
- Average LOS by gestational age
- Breastfeeding rate at discharge: >60%
- Kangaroo care rate: >70%

## Compliance
- **JCI:** COP.4 (Resuscitation), COP.5 (Medication), PCI (Infection), PFR (Patient/Family)
- **CBAHI:** Peds-specific standards
- **AAP:** Neonatal Resuscitation Program (NRP) standards

## L4 Validation: 6/6 PASS
- Red flags: 10 identified (apnea, bradycardia, hypoxia, etc.)
- Drug safety: weight-based for all peds, double-check for high-alert
- PHI: encrypted (mother + baby, linked records)
- Auth: Peds-trained MD, RN; NRP-certified
- Compliance: JCI, CBAHI, AAP
- Tests: Apgar, CRIB-II, sepsis calculator, growth tracking

---
*Generated 2026-07-23. Tier-1 priority (neonatal safety).*
