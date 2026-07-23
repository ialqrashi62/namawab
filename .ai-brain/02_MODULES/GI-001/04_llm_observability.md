# GI-001 — LLM Observability

## LangSmith
- Project: nama-medical-gi
- Tags: bleed, ibd, cirrhosis, hepatitis, pancreatitis, cancer
- Metadata: tenant_id, encounter_id, primary_dx

## Metrics
- Latency
- Hallucination rate
- MELD accuracy
- GBS accuracy
- User satisfaction

## Drift
- GI bleed severity
- MELD distribution
- HCV SVR rate
- Cirrhosis readmission

## Golden Dataset (60)
- GI bleed (10)
- IBD (10)
- Cirrhosis (10)
- Hepatitis B/C (10)
- Pancreatitis (8)
- GI cancer (8)
- SBP (4)

## Eval: pre-deploy full, nightly 10%, weekly full

## Human-in-the-Loop
- Mandatory: liver transplant, ERCP, biologic
- Recommended: IBD escalation, bleed protocol
- Optional: documentation, education
