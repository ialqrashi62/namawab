-- filepath: namaweb/migrations/e53b_ai_store_simple_up.sql
-- AI Store (simple version, no pgvector required)
-- Uses REAL[] for embeddings (1536 floats)
-- Pattern: nm-sql-table-template

BEGIN;

-- ============================================================
-- ai_document_chunks (simple version, REAL[] embedding)
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_document_chunks (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    doc_id TEXT NOT NULL,
    doc_kind TEXT NOT NULL,
    chunk_idx INT NOT NULL,
    text TEXT NOT NULL,
    embedding REAL[],          -- 1536 floats as REAL[] (no pgvector needed)
    embedding_norm REAL,       -- pre-computed L2 norm for cosine similarity
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (doc_id, chunk_idx)
);

CREATE INDEX IF NOT EXISTS idx_ai_chunks_tenant ON ai_document_chunks (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_chunks_kind   ON ai_document_chunks (tenant_id, doc_kind);
CREATE INDEX IF NOT EXISTS idx_ai_chunks_doc    ON ai_document_chunks (doc_id);
CREATE INDEX IF NOT EXISTS idx_ai_chunks_fts     ON ai_document_chunks USING gin (to_tsvector('simple', text));

ALTER TABLE ai_document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_document_chunks FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_chunks_tenant_isolation ON ai_document_chunks;
CREATE POLICY ai_chunks_tenant_isolation ON ai_document_chunks
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

-- ============================================================
-- ai_prompt_log -- request/response audit
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_prompt_log (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT,
    session_id TEXT,
    prompt_key TEXT,
    version TEXT,
    locale TEXT,
    role TEXT,
    input_hash TEXT NOT NULL,
    output_hash TEXT,
    latency_ms INT,
    prompt_tokens INT,
    completion_tokens INT,
    model TEXT,
    provider TEXT,
    citations JSONB,
    feedback SMALLINT,
    ts TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_prompt_log_tenant_ts ON ai_prompt_log (tenant_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_log_user_ts   ON ai_prompt_log (user_id, ts DESC);

ALTER TABLE ai_prompt_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_log FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_prompt_log_tenant ON ai_prompt_log;
CREATE POLICY ai_prompt_log_tenant ON ai_prompt_log
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

-- ============================================================
-- ai_cost_log -- daily cost tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_cost_log (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT,
    session_id TEXT,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_tokens INT,
    completion_tokens INT,
    cost_usd NUMERIC(10,6),
    ts TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_cost_log_tenant_ts ON ai_cost_log (tenant_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_ai_cost_log_provider   ON ai_cost_log (tenant_id, provider, model, ts DESC);

ALTER TABLE ai_cost_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cost_log FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_cost_log_tenant ON ai_cost_log;
CREATE POLICY ai_cost_log_tenant ON ai_cost_log
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

COMMIT;