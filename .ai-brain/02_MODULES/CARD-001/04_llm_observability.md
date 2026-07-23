# CARD-001 — LLM Observability

## LangSmith
- Project: nama-medical-card
- Tags: stemi, acs, afib, hf, pci, cabg, devices
- Metadata: tenant_id, encounter_id, chief_complaint

## Metrics
- Latency
- Token usage
- Hallucination rate
- STEMI detection accuracy (>99%)
- Risk score accuracy
- User satisfaction

## Drift
- Procedure mix
- Door-to-balloon time
- PCI rate
- CABG rate
- HF readmission
- AF ablation rate

## Golden Dataset (80 cases)
- STEMI (15)
- NSTEMI (10)
- Stable angina (5)
- AF (10)
- HF (10)
- Syncope (5)
- PE (5)
- Endocarditis (3)
- Pericarditis (3)
- Aortic dissection (3)
- Cardiac arrest (5)
- Bradyarrhythmia (3)
- Cardiomyopathy (3)

## Eval
- Pre-deploy: full golden set
- Nightly: 10%
- Weekly: full
- On-incident: 100% affected

## Human-in-the-Loop
- Mandatory: PCI decision, ablation, ICD implant
- Recommended: AF management, HF GDMT
- Optional: documentation, education
