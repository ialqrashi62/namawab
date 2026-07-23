# PEDS-002 — LLM Observability

## LangSmith
- Project: nama-medical-peds-nicu
- Tags: preemie, RDS, sepsis, NEC, BPD, ROP, HIE
- Metadata: tenant_id, GA, weight, current_age

## Metrics
- Latency P50/P95
- Token usage
- Hallucination rate
- Weight-based dose accuracy (>99%)
- User satisfaction

## Drift
- Patient mix (GA distribution)
- Survival rate
- NEC rate
- CLABSI rate
- BPD rate

## Golden Dataset (50 cases)
- Premature care (15)
- RDS (8)
- Neonatal sepsis (8)
- NEC (5)
- BPD (3)
- HIE (3)
- Hyperbilirubinemia (4)
- IVH (2)
- ROP (2)

## Eval
- Pre-deploy: full golden set
- Nightly: 10%
- Weekly: full
- On-incident: 100% affected

## Human-in-the-Loop
- Mandatory: medication order, surfactant, surgical consult
- Recommended: feeding plan, weaning
- Optional: documentation, education
