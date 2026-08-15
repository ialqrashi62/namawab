# CARD-303_ONCO — Chaining Patterns

## Pattern 1: Pre-Treatment CV Risk Assessment
```
[Cancer Diagnosis] → [HFA-ICOS Risk Score]
       ↓
[Risk Level] → [Monitoring Plan]
       ↓
[Cardioprotection] → [Cancer Therapy Adjust]
       ↓
[Follow-up Schedule]
```

## Pattern 2: Anthracycline Surveillance
```
[Anthracycline Start] → [Baseline Echo + GLS + Troponin]
       ↓
[Every 3 months] → [Echo + Troponin]
       ↓
[GLS drop >15% relative] → [Hold Chemo + Start ACEi + BB]
       ↓
[EF drop >10% to <50%] → [Hold Chemo + Cardio-Onc MDT]
       ↓
[EF <50% persistent] → [Permanent Discontinue + Chemo Alternative]
```

## Pattern 3: Trastuzumab Monitoring
```
[HER2+ Breast Cancer] → [Echo Baseline]
       ↓
[Every 3 months during Rx]
       ↓
[EF drop >10% to <50%]:
       ├─ Hold trastuzumab
       ├─ Start ACEi + BB
       ├─ Reassess 4 weeks
       └─ Resume if EF recovers
       ↓
[EF <50% or symptomatic] → [Permanent D/C trastuzumab]
```

## Pattern 4: ICI Myocarditis Detection
```
[ICI Start] → [Baseline ECG + Troponin]
       ↓
[Every Cycle]:
       ↓
[Troponin ↑] → [Pause ICI + Verify]
       ↓
[Troponin >3x ULN] → [Severe Myocarditis]
       ↓
[Methylprednisolone 1g/day × 3-5d]
       ↓
[If No Response] → [anti-IL-6 (Tocilizumab) + ATG]
       ↓
[Cardiac MRI Confirmed] → [Definitive Diagnosis]
```

## Pattern 5: VTE in Cancer
```
[Suspected VTE] → [CT Pulmonary Angiography / DUS]
       ↓
[Confirmed VTE] → [Cancer Type Assessment]
       ↓
[GI/Genitourinary Cancer?]:
       ├─ Yes → LMWH (avoid DOAC)
       └─ No → DOAC (Apixaban first-line)
       ↓
[Platelet Count]:
       ├─ >50K → Full dose anticoagulation
       ├─ 25-50K → Half dose
       └─ <25K → Hold, transfuse
       ↓
[Duration: 3-6 months minimum]
```

## Pattern 6: HTN Management on VEGF Inhibitor
```
[VEGF Inhibitor Start] → [Weekly BP Home]
       ↓
[BP >140/90] → [Start ACEi/ARB]
       ↓
[BP >160/100] → [Add CCB + Counsel]
       ↓
[BP >180/110] → [Hold VEGF + Hospitalize]
       ↓
[Stable BP <130/80] → [Continue VEGF]
```

## Pattern 7: QTc Monitoring
```
[QT-prolonging Agent Start] → [Baseline ECG + QTc]
       ↓
[Weekly 1st Cycle, then biweekly]
       ↓
[QTc increase >60ms or >500ms]:
       ├─ Hold agent
       ├─ Check electrolytes (K+, Mg++)
       ├─ Correct
       └─ Resume if QTc <500ms
```

## Pattern 8: Multi-Agent Cardio-Onc Consultation
```
[Cancer Patient with CV Issue] → [Oncologist Agent]
                              → [Cardiologist Agent]
                              → [Cardio-Onc Specialist Agent]
                              → [Pharmacist Agent]
                              → [Coordinator Agent]
                              → [Decision Consensus]
```

## Pattern 9: Survivorship Longitudinal
```
[Active Treatment] → [Curative Intent]
       ↓
[5 Years Remission] → [Annual CV Screening]
       ↓
[10-15 Years Post-Radiation] → [More Frequent Screening]
       ↓
[Cardiac Amyloid Risk] → [Pyrophosphate Scan]
       ↓
[Cardiac Sarcoma Risk] → [MRI Surveillance]
       ↓
[20+ Years] → [Annual CV Risk Assessment]
```
