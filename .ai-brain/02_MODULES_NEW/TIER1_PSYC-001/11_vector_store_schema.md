# PSYC-001 — Vector Store Schema

```sql
CREATE TABLE IF NOT EXISTS ai_psyc_001_corpus (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  embedding VECTOR(1024),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ai_psyc_001_vec ON ai_psyc_001_corpus USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
ALTER TABLE ai_psyc_001_corpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_psyc_001_corpus FORCE ROW LEVEL SECURITY;
-- policy: tenant scoped
```

Loading: nightly from authoritative bundles per dept.

---

*Owner: AIE+SA — 2026-08-01*
