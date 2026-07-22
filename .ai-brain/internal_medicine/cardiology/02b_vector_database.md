# Vector Database — Cardiology

> **Owner:** AI Engineer
> **Date:** 2026-07-22
> **Cluster:** cardiology.dbml

---

## Table Schema

```sql
CREATE TABLE IF NOT EXISTS clinical_knowledge_vectors (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  cluster VARCHAR(64) NOT NULL,
  sub_unit VARCHAR(64),
  chunk_id VARCHAR(64) NOT NULL,
  source VARCHAR(256) NOT NULL,
  text TEXT NOT NULL,
  embedding REAL[] NOT NULL,     -- 1536-dim
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant isolation
ALTER TABLE clinical_knowledge_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_knowledge_vectors FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON clinical_knowledge_vectors
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);

-- Index by cluster + chunk
CREATE INDEX idx_ckv_cluster_chunk ON clinical_knowledge_vectors(cluster, chunk_id);
CREATE INDEX idx_ckv_tenant_cluster ON clinical_knowledge_vectors(tenant_id, cluster);
```

## Cardiology chunks (target: 200+)

- 50 ESC Guidelines chunks (2020-2024)
- 50 AHA/ACC Guidelines chunks (2020-2024)
- 30 Saudi Heart Association chunks
- 30 UTD (UpToDate) cardiology summaries
- 20 StatPearls cardiology chapters
- 20 drug monographs (anticoagulants, antiplatelets, antiarrhythmics)

## Sub-unit chunks

| Sub-unit | Target chunks | Topics |
|---|---|---|
| General | 50 | ACS, HF, AF, HTN, lipids |
| Interventional | 30 | PCI, TAVR, structural, devices |
| Electrophysiology | 25 | Ablation, devices, SCD prevention |
| Preventive | 20 | Risk scoring, lipid mgmt, lifestyle |
| Nuclear | 15 | MPI, PET, viability |
| Cardio-Obstetrics | 15 | Pregnancy + CVD, PPCM |
| Cath Lab | 20 | Pre-procedure, post-procedure, complications |
| PVD | 15 | PAD, CLI, screening |
| Heart Failure | 30 | HFrEF, HFpEF, LVAD, transplant |

## Embedding strategy

- **Model:** text-embedding-3-small (1536-dim, $0.02/1M tokens)
- **Chunk size:** 512 tokens, 50 overlap
- **Preprocessing:** strip citations, normalize units, dedupe near-duplicates (cosine ≥0.95 → drop)
- **Re-embed:** weekly cron + on guideline-version change

## Index

```sql
-- ivfflat (production)
CREATE INDEX idx_ckv_embedding ON clinical_knowledge_vectors
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Fallback (no pgvector)
-- Compute cosine in app code:
-- similarity = 1 - (a·b) / (||a|| * ||b||)
```

## Retrieval

```js
async function retrieveGuidelines(query, tenantId, k = 5) {
  // 1. Embed query
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  });
  // 2. Cosine search (pgvector or REAL[] fallback)
  const chunks = await db.query(`
    SELECT id, chunk_id, source, text,
           1 - (embedding <=> $1::vector) AS similarity
    FROM clinical_knowledge_vectors
    WHERE tenant_id = $2 AND cluster = 'cardiology'
    ORDER BY embedding <=> $1::vector
    LIMIT 50
  `, [queryEmbedding, tenantId]);
  // 3. Re-rank with cross-encoder
  const reranked = await crossEncoder.rank(query, chunks);
  return reranked.slice(0, k).filter(c => c.similarity >= 0.7);
}
```

---

End of vector database spec.
