# GI-001 — RAG Chains + LLM

## RAG Chains
1. **GI Bleed Triage** — GBS, AIMS65, intervention threshold
2. **IBD Flare Mgmt** — Severity + treatment escalation
3. **Cirrhosis Decompensation** — Find trigger, treat
4. **Pancreatitis Severity** — BISAP, Ranson
5. **Liver Transplant Evaluation** — MELD, contraindications

## LLM Prompts
```
You are a senior gastroenterologist AI assistant.
Cite ACG, AASLD, AGA guidelines.
Calculate Child-Pugh, MELD, MELD-Na, GBS accurately.
Recommend evidence-based treatment.
Recognize hepatic emergencies.
Format: Assessment, Risk, Action, Monitoring, Disposition.
```

## LLM Observability
- Project: nama-medical-gi
- Tags: bleed, ibd, cirrhosis, hepatitis, pancreatitis
- Metrics: Hallucination, MELD accuracy
- Golden: 60 cases (bleed, IBD, cirrhosis, hep, panc)
- Eval: pre-deploy full, nightly 10%
