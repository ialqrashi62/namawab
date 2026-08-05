---
id: UNIVERSAL-RAG
version: 1.0
date: 2026-08-01
owner: AIE
status: ACTIVE
---

# Universal RAG Service — Citation Engine + Patient Graph + Knowledge Graph

> **Purpose:** Every AI feature uses this RAG service. Citation-first, hybrid retrieval, patient-scoped isolation.

---

## 1. Global systems comparison

| System | RAG approach |
|--------|--------------|
| **Microsoft DAX** | RAG on patient chart + MS Cloud knowledge |
| **AWS HealthScribe** | Cite-first RAG |
| **Google Vertex AI Search** | Multi-source + grounded answer |
| **Palantir Foundry** | Knowledge graph + LLM |
| **NamaMedical RAG** | **Citation-first + hybrid (vector+BM25+KG) + patient graph + tenant isolation** |

---

## 2. Universal RAG API

```
POST /api/v1/rag/query
   {
     "tenant_id": "<uuid>",
     "user_id": "<uuid>",
     "role": "doctor",
     "patient_id": "<id>",         # optional
     "query": "...",
     "corpus_filter": ["cba","nphies","sfda","journal"],
     "max_tokens": 1500,
     "language": "ar-SA",
     "stream": false,
     "options": { ... }
   }
```

Response:
```json
{
  "answer": "...",             // LLM answer with [CIT:1],[CIT:2]
  "citations": [
    {
      "id": 1,
      "source_type": "cba",
      "document": "CBAHI ED-04 STEMI Pathway",
      "version": "2024.1",
      "chunk_id": "...",
      "score": 0.94,
      "url": "..."
    },
    ...
  ],
  "patient_chart": [...],     // if patient_id provided
  "audit_id": "<uuid>",
  "token_usage": {"in": 1200, "out": 350},
  "model": "gpt-4o"
}
```

---

## 3. Citation Engine

```ts
// src/rag/citation_engine.ts
export class CitationEngine {
  async annotate(answer: string, sources: Chunk[]): Promise<AnnotatedAnswer> {
    // For every factual claim, attach [CIT:n]
    // Validator: if any claim lacks citation → refuse
    // Validator: if citation score < 0.5 → weaken claim
    return annotated;
  }
}
```

**Anti-hallucination rules**:
- ≥3 sources for any clinical decision (or mark `UNCERTAIN`)
- If model-generated text doesn't have a citation marker, reject
- If citation source not in approved bundle, reject

---

## 4. Patient Graph RAG (a unique NamaMedical feature)

Encodes patient facts as graph nodes:
```
patient:123
  ├── condition:HTN (since 2018, ICD-10 I10)
  ├── condition:CKD-3 (since 2024, ICD-10 N18.3)
  ├── medication:lisinopril (since 2018)
  ├── medication:furosemide (since 2024)
  ├── allergy:penicillin (severity: severe)
  ├── lab:creatinine (last: 1.8 mg/dL, trend: rising)
  └── imaging:renal_ultrasound (conclusion: bilateral cortical thinning)
```

Enables reasoning chains:
- "Patient has CKD-3 + rising creatinine + on furosemide → avoid NSAIDs, consider nephrotoxic contrast"
- "Patient has penicillin allergy → no beta-lactams"

Implementation: Postgres + ltree + PGVector.

---

## 5. Knowledge Graph (SNOMED + ICD + LOINC + RxNorm)

```sql
CREATE TABLE kg_relationships (
  id BIGSERIAL PRIMARY KEY,
  from_system TEXT, from_code TEXT,
  rel_type TEXT,  -- 'is_a'|'may_treat'|'contraindicated_with'|'ingredient_of'
  to_system TEXT, to_code TEXT,
  -- RLS optional (system-level)
);
```

Pre-loaded:
- SNOMED CT relationships (`is_a`, `finding_site`, etc.)
- ICD-10 ↔ SNOMED mappings
- RxNorm ingredients + interactions
- DrugBank monographs

Used by KG retriever to expand queries (e.g., "diabetes" → expand to "T2DM", "T1DM", "gestational diabetes", etc.).

---

## 6. RAG Workflow

```
User query
   ↓
1. Pre-process: deidentify + intent detect
   ↓
2. Patient Graph expand (if patient_id)
   ↓
3. Hybrid retrieve (vector + BM25 + KG)
   ↓
4. Re-rank (cross-encoder)
   ↓
5. Inject context into prompt
   ↓
6. LLM call
   ↓
7. Citation annotate + verify
   ↓
8. Post-guardrails (red flag, drug, etc.)
   ↓
9. Return annotated answer + audit
```

---

## 7. Multi-corpus configuration

```yaml
corpora:
  - id: cba
    source: cba
    name_ar: 'معايير CBAHI'
    name_en: 'CBAHI Standards'
    languages: [ar, en]
  - id: nphies
    source: nphies_bundles
    name_ar: 'حزم NPHIES'
  - id: sfda
    source: sfda_drug_db
    name_ar: 'قاعدة SFDA'
  - id: who
    source: who_guidelines
    languages: [ar, en]
  - id: nice
    source: nice_uk
  - id: esc
    source: esc_eu
  - id: aha
    source: aha_acc
  - id: nccn
    source: nccn_oncology
  - id: local_protocol
    source: tenant_uploaded
    languages: [tenant's]
    ttl_days: 365
```

Per-dept `corpus_filter` recommended.

---

## 8. Caching

- Query → cache key (hashed query, hash tenant, hash filter)
- Cache hit returns previous answer + new audit
- TTL 24h for clinical queries
- Bypass cache for: patient-scoped queries, sensitive queries

---

## 9. Patient privacy

- Patient chart never leaves tenant's scope
- Embedding done locally; raw text never sent to LLM (only masked JSON)
- Logging: only patient_id_hash, never raw
- Right to delete: cascade delete from all vector indices

---

## 10. Files

```
src/rag/
├── query_api.ts
├── citation_engine.ts
├── patient_graph.ts
├── knowledge_graph.ts
├── corpus_loader.ts
├── re_ranker.ts           # cross-encoder
├── cache.ts
├── audit.ts
└── tests/
    ├── unit/
    ├── integration/
    └── clinical_safety/
```

---

*Owner: AIE — version 1.0 — 2026-08-01*
