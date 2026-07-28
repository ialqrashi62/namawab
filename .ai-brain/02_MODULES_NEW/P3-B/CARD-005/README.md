<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-005
name: "Nuclear Cardiology"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Nuclear Cardiology — CARD-005

## Mission
Non-invasive cardiac imaging: MPI (SPECT/PET), viability, MUGA, amyloid imaging, sarcoid cardiac.

## Scope
Stress MPI (treadmill + pharmacologic adenosine/dobutamine), rest MPI, PET MPI (Rb-82, N-13 ammonia), viability (PET or thallium), MUGA (LVEF), cardiac amyloid (PYP scan), cardiac sarcoid (FDG-PET).

## Top 10 Conditions
1. CAD (I25.10) 2. Suspected CAD (Z13.6) 3. Post-MI risk strat (I25.2) 4. Pre-op CV (Z01.81) 5. Viability (I25.5) 6. Amyloid (E85.4) 7. Sarcoid (D86.85) 8. Hibernating myocardium (I25.5) 9. False + ECG (R94.31) 10. Unable to exercise (Z73.6)

## Top 20 Procedures
MPI SPECT 78452, MPI rest+stress 78453, PET MPI 78459, pharmacologic stress 93017, treadmill 93015, dobutamine stress echo 93350, adenosine 93017, MUGA 78472, PYP amyloid 78803, FDG-PET cardiac 78815, SPECT viability 78451, thallium 78451, Rb-82 78469, N-13 ammonia 78491, attenuation correction, prone imaging, gated SPECT, summed stress score, summed rest score, summed difference score

## Red Flags
Severe ischemia (SSS>13) · Post-stress LVEF drop >5% · Transient ischemic dilation (TID) >1.1 · LBBB with abnormal septal motion · Multi-vessel ischemia · Amyloid positive (PYP grade 2-3) · Sarcoid active (FDG uptake) · VT with sarcoid · Stress-induced hypotension · Severe asthma + adenosine (use regadenoson) · Caffeine within 12h

## Database: 5 tables, RLS-forced
## 10 endpoints
## 3 LangChain chains

## Compliance
JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL. Radiation: ALARA, ICRP, dose limits. ASNC guidelines 2018. IAEA safety standards.

## Engine: nuclear_cardiology_engine.js
SSSCalculator(segments, scores), TIDRatio, SSStoMortalityRisk, PYPGrade, FDGSarcoidActivity, IschemiaThreshold, MUGALVEF, ViabilityPrediction, HibernationIndex, RestStressComparison

## Sub-Departments
Nuclear Lab, Stress Lab, PYP Reading, Amyloid Clinic

---
*L1 DRAFT complete.*