-- e146 P0-3 BCMA Vector Table UP
-- Vector storage for BCMA RAG (drug interaction patterns, override history)

CREATE TABLE IF NOT EXISTS bcma_vectors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  source VARCHAR(30) NOT NULL,        -- 'ismp'|'sfda'|'moh'|'history'
  doc_id VARCHAR(80) NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding REAL[],                   -- 1536-dim
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, source, doc_id)
);
CREATE INDEX IF NOT EXISTS idx_bcma_vec_tenant ON bcma_vectors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcma_vec_source ON bcma_vectors(source);

ALTER TABLE bcma_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcma_vectors FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bcma_vec_tenant_isolation ON bcma_vectors;
CREATE POLICY bcma_vec_tenant_isolation ON bcma_vectors
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));