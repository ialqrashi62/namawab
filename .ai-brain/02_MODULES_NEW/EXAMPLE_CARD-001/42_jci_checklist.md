# 42 — JCI Checklist (CARD-001)

> Owner: CQO · Tier 1

## JCI 7th Edition — Cardiology-specific

### IPSG (International Patient Safety Goals)

| ID | Goal | Cardiology-specific | Status |
|----|------|---------------------|--------|
| IPSG.1 | Identify patients correctly | Patient ID + MRN + national ID verified at every encounter | implemented |
| IPSG.2 | Improve effective communication | SBAR handoff for cath lab, ICU; verbal orders read-back | implemented |
| IPSG.3 | Improve safety of high-alert medications | Heparin, amiodarone, digoxin, anticoagulants | implemented |
| IPSG.4 | Ensure correct site, correct procedure, correct patient | Surgical pause for cath + device implant | implemented |
| IPSG.5 | Reduce risk of health care-associated infection | Hand hygiene, sterile cath lab, device infection surveillance | implemented |
| IPSG.6 | Reduce risk of patient falls | Cardiology floor + CCU risk assessment | implemented |

### ACC (Access to Care & Continuity of Care)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| ACC.1 | Patient flow | Cardiology triage, CODE STEMI activation < 90 min |
| ACC.2 | Continuity | Discharge summary + follow-up plan + cardiac rehab referral |
| ACC.3 | Handoff | SBAR for cath lab → CCU → ward |
| ACC.4 | Referral | Cardiology referral to cardiac surgery, EP, HF clinic |
| ACC.5 | Transfer | ER → cath lab → CCU |

### PFR (Patient & Family Rights)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| PFR.1 | Care respect | Patient consent for cath, device, anesthesia |
| PFR.2 | Information | Diagnosis + procedure + risks + alternatives in AR + EN |
| PFR.3 | Participation | Patient involvement in GDMT decisions, advanced directives |
| PFR.4 | Consent | Informed consent (snippet:consent-forms) |
| PFR.5 | Privacy | PHI protection (snippet:phi-vault) |

### AOP (Assessment of Patients)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| AOP.1 | Initial assessment | Cardiology H&P + ECG + echo within 24h |
| AOP.2 | Reassessment | Daily rounds + per-shift CCU |
| AOP.3 | Lab + imaging | TTE/TEE/stress/holter as needed |
| AOP.4 | Risk assessment | HEART, CHA2DS2-VASc, HAS-BLED, NYHA, Killip |
| AOP.5 | Falls + pressure | Cardiology floor + CCU |

### COP (Care of Patients)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| COP.1 | Care planning | Cardiology care plan + GDMT optimization |
| COP.2 | High-risk meds | Anticoagulants, antiarrhythmics, inotropes |
| COP.3 | Resuscitation | CODE STEMI, CODE BLUE (cardiac arrest), ACLS |
| COP.4 | Pain management | For chest pain, post-cath |
| COP.5 | End-of-life | Advanced directives, palliative HF care |

### MMU (Medication Management & Use)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| MMU.1 | Storage | Crash cart, defibrillator meds, thrombolytics |
| MMU.2 | Prescribing | NPHIES e-prescription, server-side money |
| MMU.3 | Preparation | IV heparin, nitro, amiodarone (CCU) |
| MMU.4 | Administration | 5 rights (snippet:5-rights) |
| MMU.5 | Monitoring | aPTT for heparin, INR for warfarin, K for MRA |
| MMU.6 | Adverse events | Bleeding, hyperkalemia, bradycardia, hypotension |

### QPS (Quality Improvement & Patient Safety)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| QPS.1 | Quality program | Cardiology KPIs: door-to-balloon, GDMT rate, readmission |
| QPS.2 | Data collection | Clinical + operational + financial |
| QPS.3 | Analysis | Monthly + quarterly |
| QPS.4 | Improvement | PDCA cycles |
| QPS.5 | Sentinel events | Cardiac arrest, unexpected death, wrong-site cath |

### PCI (Prevention & Control of Infections)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| PCI.7 | Catheter-associated UTI | Foley in CCU |
| PCI.8 | Device infection | PM/ICD/CRT infection surveillance + extraction |
| PCI.9 | Surgical site | Cath access site (radial > femoral if possible) |

### FMS (Facility Management & Safety)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| FMS.6 | Utility systems | Cath lab, EP lab, echo, stress lab, monitoring |
| FMS.7 | Emergency management | Code Blue, mass casualty, fire in cath lab |

### SQE (Staff Qualifications & Education)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| SQE.1 | Credentialing | Cardiologist, EP, interventional, HF, cath lab nurse, echo tech, device tech |
| SQE.2 | Training | ACLS, BLS, cath lab safety, radiation safety |
| SQE.3 | Health | Radiation badge for cath lab staff |

### MOI (Management of Information)

| ID | Standard | Cardiology-specific |
|----|----------|---------------------|
| MOI.1 | Information management | Cardiology EMR, ECG archive, echo archive |
| MOI.2 | Confidentiality | PHI protection (snippet:phi-vault) |
| MOI.3 | Integrity | Hash-chained audit |
| MOI.4 | Retention | 7+ years |
| MOI.5 | Interoperability | NPHIES, SFDA, PACS |

## Cardiology-specific KPIs

| KPI | Target | Source |
|-----|--------|--------|
| Door-to-balloon (STEMI) | < 90 min | cardiology_cath + ED |
| GDMT optimization (HFrEF) | > 80% | cardiology_engine.hfGdmt |
| ACEi/ARB/ARNI (HFrEF) | > 90% | registry |
| Beta-blocker (post-MI) | > 90% | registry |
| Statin (post-PCI) | > 95% | registry |
| Anticoag (AF, CHA2DS2-VASc≥2) | > 85% | registry |
| 30-day readmission (HF) | < 20% | registry |
| Cath site infection | < 1% | infection surveillance |
| Device infection (1y) | < 2% | device clinic |
| Mortality (STEMI in-hospital) | < 8% | registry |
| Patient satisfaction | > 4.5/5 | surveys |
| LLM red-flag detection | > 99% | langfuse eval |
| Audit log completeness | 100% | audit_middleware |

## Compliance cadence

- Daily: KPI dashboard
- Weekly: cardiology QI meeting
- Monthly: KPI review + improvement
- Quarterly: full JCI self-assessment
- Annually: full JCI mock survey
- Triennially: full JCI survey

## Evidence

- Policies & procedures (P&P)
- Audit logs (hash-chained)
- KPI dashboards
- Mock survey reports
- Training records
- Sentinel event analyses
- Patient feedback
