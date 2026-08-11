# AI Orchestration — Interventional_Radiology (DEP-041)

> **AIE:** Eng. Marcus Patel · Generated 2026-08-08

## 1. LangGraph State Machine
```
[triage] → [assessment] → [diagnosis] → [plan] → [intervention] → [followup]
   ↓           ↓              ↓          ↓            ↓              ↓
red_flags   vitals         RAG        RAG        CDS rules      education
```

## 2. Nodes
1. **triage**: ESI scoring + red flag detection
2. **assessment**: history + exam + scoring
3. **diagnosis**: RAG + ICD-10 + differential
4. **plan**: order set + medication + procedure
5. **intervention**: CDS check + execution
6. **followup**: education + appointment

## 3. Tools
- ir_guidelines_search
- ir_drug_search
- icd10_search
- snomed_search
- vital_calculator
- drug_interaction_check

## 4. Embedding Strategy
- Model: text-embedding-3-large (3072 dim)
- Chunk size: 512 (guidelines), 256 (drugs)
- Store: pgvector + ChromaDB

## 5. Agent Prompt (system)
```
You are a Interventional_Radiology specialist at CBAHI/JCI hospital.
Use ONLY the context provided. Cite ICD-10 / SNOMED.
If insufficient info, say 'insufficient context'.
Always consider Saudi-specific epidemiology.
```

## 6. Token Budget
- Ingestion (one-time): ~$15
- Query (per turn): ≤4000 tokens
- p95 latency: <800ms