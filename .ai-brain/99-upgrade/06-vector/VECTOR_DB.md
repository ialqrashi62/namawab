---
id: VECTOR-DB
version: 1.0
date: 2026-08-01
owner: AIE+SA
status: ACTIVE
---

# Vector DB (PGVector) + Hybrid Retrieval + Terminology

> **Purpose:** Central knowledge index for all RAG operations. Single pgvector extension on production Postgres, with per-tenant namespace, multilingual embedding, and hybrid retrieval (vector + BM25 + knowledge graph).

---

## 1. Global systems comparison

| System | Vector approach |
|--------|-----------------|
| **Epic Cosmos** | Custom vectors (limited API) |
| **Cerner HealtheDataLab** | OMOP + custom embeddings |
| **AWS HealthLake** | Native FHIR + transitive embeddings via Bedrock |
| **Google Vertex AI Search** | BigQuery + proprietary embeddings |
| **Pinecone, Weaviate, Qdrant, Milvus** | External services used widely |
| **NamaMedical pgvector** | Native Postgres extension (lower ops cost, perfect RLS) |

We pick pgvector — no extra service to maintain.

---

## 2. Production setup (PGVector)

```sql
-- Already in production database for 150+ tables
CREATE EXTENSION IF NOT EXISTS vector;

-- Universal content store
CREATE TABLE ai_content_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  source_type TEXT NOT NULL,     -- 'cba' | 'nphies' | 'sfda' | 'journal' | 'patient_doc' | 'visit'
  source_id TEXT NOT NULL,
  source_version TEXT,
  section TEXT,                  -- 'cardiology.sections.ACS'
  language TEXT DEFAULT 'ar',
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,    -- sha256
  embedding VECTOR(1024),         -- multilingual-e5-large
  embedding_model TEXT DEFAULT 'multilingual-e5-large@1.0',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,         -- null = never
  UNIQUE(tenant_id, source_type, source_id, section, language, content_hash)
);

CREATE INDEX idx_ai_content_emb_tenant ON ai_content_embeddings(tenant_id);
CREATE INDEX idx_ai_content_emb_vec ON ai_content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_ai_content_emb_fulltext ON ai_content_embeddings USING gin(to_tsvector('arabic', content));

ALTER TABLE ai_content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_embeddings FORCE ROW LEVEL SECURITY;
```

**Why ivfflat?** Balance of speed + accuracy. For larger corpora consider HNSW.

---

## 3. Per-dept tables (when corpus dedicated)

```sql
-- Optional per-dept schemas for clinical content
CREATE TABLE ai_cardiology_corpus (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  topic TEXT NOT NULL,
  ...
  content TEXT,
  embedding VECTOR(1024),
  ...
);
-- Same shape, different table name
```

Or use the universal table with `source_type` filter.

---

## 4. Embedding Service

```ts
// src/embeddings/embedding_service.ts
export class EmbeddingService {
  private provider: 'local-multilingual-e5'|'openai-text-3'|'cohere-multilingual-v3';
  private model: string = process.env.EMBEDDING_MODEL || 'intfloat/multilingual-e5-large';

  async embed(texts: string[], lang: 'ar'|'en' = 'ar'): Promise<number[][]> {
    // 1024 dims for e5; 1536 for OpenAI text-3-large
    // Always include Lang detection; batch up to 100 texts/call
    // Use mean-pooling; L2 normalize
  }

  async embedPatientContext(ctx: PatientContext): Promise<number[]> {
    // Embed structured fields: dx list, current meds, allergies, demographics
  }
}
```

**Model choice**:
- **Primary**: `intfloat/multilingual-e5-large` (1024d, AR+EN strong)
- **Clinical fine-tune**: future on Saudi/CBAHI corpus (planned)

---

## 5. Chunking strategy

| Content type | Chunk size | Overlap | Notes |
|--------------|-----------|---------|-------|
| Guideline document | 1024 tok | 128 | by section |
| Patient note | full sentence | — | depends on length |
| Drug monograph | 512 tok | 64 | by DrugBank field |
| Visit summary | 256 tok | 32 | per paragraph |
| Journal article | 1024 tok | 128 | abstract+intro+conclusion prioritized |

Use **late chunking** for documents where global context matters (e.g., guidelines).

---

## 6. Hybrid Retrieval

```ts
// src/vector/hybrid_retriever.ts
export class HybridRetriever {
  async retrieve(query: string, tenantId: string, opts: RetrieveOpts): Promise<Chunk[]> {
    const [vec, bm25, kg] = await Promise.all([
      this.vectorSearch(query, tenantId, opts.k_vec || 20),
      this.bm25Search(query, tenantId, opts.k_bm25 || 20),
      this.kgSearch(query, tenantId, opts.k_kg || 5),
    ]);

    // Reciprocal Rank Fusion
    const fused = reciprocalRankFusion(vec, bm25, kg, [0.5, 0.3, 0.2]);
    return fused.slice(0, opts.top_k || 5);
  }
}
```

**Why hybrid?** Pure vector misses exact IDs (drug names, ICD codes). Pure BM25 misses semantic. KG bridges.

---

## 7. Terminology Index (SNOMED + ICD + LOINC + RxNorm)

```sql
CREATE TABLE terminology_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,         -- null = system-wide (read-only)
  system TEXT NOT NULL,            -- 'snomed'|'icd10'|'loinc'|'rxnorm'
  code TEXT NOT NULL,
  display_en TEXT NOT NULL,
  display_ar TEXT,
  synonyms TEXT[],
  embedding VECTOR(1024),
  parent_id BIGINT,
  UNIQUE(system, code)
);
```

Loaded at startup from authoritative bundles (e.g., `snomed_ct_2024_07`).

**Why?** Lets RAG answer "what's the SNOMED code for STEMI?" directly.

---

## 8. Patient chart pre-processing (privacy + RAG)

Embed only **deidentified** patient content:

- ✅ Demographics (age band, sex, no name)
- ✅ Diagnoses (active + resolved)
- ✅ Medications (code + dose, no raw notes)
- ✅ Allergies
- ✅ Recent labs (with reference range)
- ❌ Free text names, phone, address, ID, encounter date

---

## 9. Operations

- **Reindex**: weekly (full), daily (incremental)
- **Expiry**: per `expires_at`; cron sweep daily
- **Tenant data deletion**: drop rows on tenant offboard + cascade
- **Storage**: pgvector 1024d × 1M rows = ~6GB; monitor size

---

## 10. Files

```
src/vector/
├── pgvector_pool.js
├── embedding_service.ts
├── content_repo.js
├── hybrid_retriever.ts
├── rrf.js          # Reciprocal Rank Fusion
├── terminology_index.js
├── audit.js
└── tests/
```

---

*Owner: AIE+SA — version 1.0 — 2026-08-01*
