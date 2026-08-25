-- f019_knowledge_fallback_up.sql — RAG-lite store (JSONB embeddings, JS cosine)
-- Swap to pgvector (f015) when extension becomes available on the host.
CREATE TABLE IF NOT EXISTS knowledge_chunks_fb (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  source_dept varchar(64) NOT NULL DEFAULT 'general',
  source_doc text NOT NULL,
  chunk_index int NOT NULL DEFAULT 0,
  chunk text NOT NULL,
  embedding jsonb NOT NULL,
  provider varchar(24) NOT NULL DEFAULT 'fallback256',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kcf_tenant ON knowledge_chunks_fb(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kcf_dept ON knowledge_chunks_fb(tenant_id, source_dept);
ALTER TABLE knowledge_chunks_fb ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_kcf_tenant ON knowledge_chunks_fb;
CREATE POLICY p_kcf_tenant ON knowledge_chunks_fb USING (tenant_id::text = current_setting('app.tenant_id', true));
