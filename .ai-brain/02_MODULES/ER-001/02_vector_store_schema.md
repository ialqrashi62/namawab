---
module_id: ER-001
section: 02_ai_orchestration
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Vector Store Schema

## Embedding Model
- **Primary:** MedEmbed (768d) — medical-domain fine-tuned
- **Fallback:** OpenAI text-embedding-3-large (3072d)
- **Self-hosted:** all-MiniLM-L6-v2 (384d) for offline mode

## Chunking Strategy
- **Size:** 512 tokens
- **Overlap:** 64 tokens (12.5%)
- **By:** section (paragraph + heading + table-aware)
- **Metadata:** source, section, year, guideline version, citation count

## Vector Indexes (per tier)

### Tier 1: Clinical Knowledge
- `idx_clinical_knowledge` — UpToDate, DynaMed, BMJ Best Practice
  - All 46 specialties
  - ~500K chunks
  - Refresh: monthly
  - Confidence filter: high (peer-reviewed guidelines)

### Tier 2: Institution Protocols
- `idx_institution_protocols` — local SOPs, clinical pathways
  - NamaMedical specific
  - ~5K chunks
  - Refresh: on protocol update (event-driven)
  - Confidence: absolute (authoritative)

### Tier 3: Drug Database
- `idx_drug_interactions` — RxNorm, DrugBank, Lexicomp
  - ~50K chunks (drug monographs)
  - Refresh: weekly (FDA/SFDA updates)
  - Confidence: high

### Tier 4: Patient Education
- `idx_patient_education` — MedlinePlus, Mayo Clinic
  - Bilingual (AR/EN)
  - ~10K chunks
  - Refresh: quarterly
  - Reading level: 5th-6th grade

### Tier 5: Quality & Safety
- `idx_quality_safety` — JCI standards, ISO, ACEP clinical policies
  - ~20K chunks
  - Refresh: on standard update
  - Confidence: regulatory (mandatory)

## PGVector Schema (PostgreSQL)

```sql
CREATE TABLE er_vector_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source TEXT NOT NULL,  -- 'uptodate', 'protocol', 'rxnorm', etc.
  tier INT NOT NULL,  -- 1-5
  section TEXT,
  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(768),  -- or 3072 for OpenAI
  citation_count INT DEFAULT 0,
  year INT,
  guideline_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_er_vector_embedding ON er_vector_chunks 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_er_vector_tenant ON er_vector_chunks (tenant_id);
CREATE INDEX idx_er_vector_tier_source ON er_vector_chunks (tier, source);

-- RLS
ALTER TABLE er_vector_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_vector_chunks FORCE ROW LEVEL SECURITY;
CREATE POLICY er_vector_tenant_isolation ON er_vector_chunks
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

## Hybrid Retrieval (vector + BM25 + KG)

```yaml
retrieval:
  hybrid:
    bm25: 0.3
    vector: 0.5
    knowledge_graph: 0.2
  top_k_initial: 20
  top_k_rerank: 5
  reranker: "BGE-reranker-v2-m3"  # cross-encoder
  context_window: 4000  # max tokens
  citation_required: true
```

## Reranking
- Cross-encoder (BGE-reranker or Cohere Rerank 3)
- Re-score top 20 → top 5
- Boost: institution protocols (authoritative) + recent guidelines

## Conflict Detection
- When 2+ chunks disagree:
  - Flag in response ("conflicting evidence")
  - Prioritize: institution protocol > clinical guideline > drug DB
  - Show both with citation
  - Recommend physician review

## Token Budget
- Max context: 4000 tokens
- Max output: 800 tokens
- Reserve 200 for system prompt + safety reminders
- Total: 5000 tokens per LLM call

## Re-indexing Schedule
- Clinical knowledge: monthly (or on new edition)
- Institution protocols: on PR merge
- Drug DB: weekly
- Patient education: quarterly
- Quality/safety: on standard update

## Vector Search Performance
- p99 latency target: <500ms (with reranking)
- Cache: common queries (e.g., "sepsis bundle", "STEMI criteria")
- Pre-warm: top 100 query patterns on startup

---
*Section 02.b of ER-001. Owner: AIE.*
