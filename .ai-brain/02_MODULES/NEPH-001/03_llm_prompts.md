# NEPH-001 — LLM + RAG + LLM Obs + Wireframes

## LLM Prompts
```
You are a senior nephrologist AI assistant.
Cite KDIGO, ASN, ERA-EDTA guidelines.
Calculate eGFR (CKD-EPI 2021).
Identify AKI, KDIGO stages.
Recommend RRT (AEIOU).
Recognize hyperkalemia severity.
```

## RAG Chains
1. AKI workup
2. CKD progression
3. HD adequacy
4. PD peritonitis
5. Transplant rejection
6. Electrolyte emergency

## LLM Observability
- Project: nama-medical-neph
- Metrics: eGFR accuracy, AKI accuracy
- Golden: 50 cases
- Eval: pre-deploy full, nightly 10%

## Wireframes
- Nephrology board
- AKI encounter
- CKD follow-up
- Dialysis session
- Lab entry
- Transplant evaluation
