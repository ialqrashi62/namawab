-- f015_pgvector_init_up.sql — formal pgvector foundation (idempotent)
-- Requires: CREATE EXTENSION vector; (superuser once per DB)
CREATE EXTENSION IF NOT EXISTS vector;

-- Generic knowledge-chunks store used by all department RAG chains
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  source_dept varchar(64) NOT NULL,
  source_doc text NOT NULL,
  chunk_index int NOT NULL DEFAULT 0,
  chunk text NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kc_tenant ON knowledge_chunks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kc_dept ON knowledge_chunks(tenant_id, source_dept);
CREATE INDEX IF NOT EXISTS idx_kc_embedding ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_kc_tenant ON knowledge_chunks;
CREATE POLICY p_kc_tenant ON knowledge_chunks USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Validation query: SELECT count(*) FROM knowledge_chunks;
