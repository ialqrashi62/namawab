-- ============================================================
-- NamaMedical — Vector Store Schema
-- pgvector for RAG embeddings
-- ============================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- 2. Documents (logical grouping of chunks)
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  source text NOT NULL,                        -- e.g., "cardiology/up-to-date-2024.pdf"
  title text,
  description text,
  doc_type text NOT NULL,                      -- 'guideline', 'protocol', 'textbook', 'policy', 'patient-handout', 'drug-info'
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('ar','en','fr','ur')),
  version text,
  url text,
  metadata jsonb NOT NULL DEFAULT '{}',
  chunk_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

CREATE INDEX idx_documents_tenant ON public.documents (tenant_id);
CREATE INDEX idx_documents_source ON public.documents (source);
CREATE INDEX idx_documents_type ON public.documents (doc_type);
CREATE INDEX idx_documents_status ON public.documents (status) WHERE status = 'active';

-- RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents FORCE ROW LEVEL SECURITY;
CREATE POLICY documents_tenant_isolation ON public.documents
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 3. Chunks (the embeddings)
CREATE TABLE IF NOT EXISTS public.chunks (
  id text PRIMARY KEY,                          -- sha256(source + chunk_text)[:32]
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  chunk_index integer NOT NULL,
  text text NOT NULL,
  text_tokens integer,
  embedding vector(1536),                       -- OpenAI text-embedding-3-small dim; switch to 3072 for large
  embedding_model text NOT NULL DEFAULT 'text-embedding-3-small',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, chunk_index)
);

-- HNSW index for fast vector search (better than IVFFlat for most cases)
CREATE INDEX idx_chunks_embedding ON public.chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_chunks_document ON public.chunks (document_id);
CREATE INDEX idx_chunks_tenant ON public.chunks (tenant_id);

-- RLS
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks FORCE ROW LEVEL SECURITY;
CREATE POLICY chunks_tenant_isolation ON public.chunks
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 4. Vector search function
CREATE OR REPLACE FUNCTION public.fn_search_chunks(
  query_embedding vector(1536),
  p_tenant_id uuid,
  p_top_k integer DEFAULT 5,
  p_min_similarity real DEFAULT 0.7,
  p_doc_types text[] DEFAULT NULL,
  p_languages text[] DEFAULT NULL
) RETURNS TABLE (
  chunk_id text,
  document_id uuid,
  source text,
  title text,
  doc_type text,
  chunk_index integer,
  text text,
  similarity real
) AS $$
  SELECT
    c.id, c.document_id, d.source, d.title, d.doc_type,
    c.chunk_index, c.text,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM chunks c
  JOIN documents d ON d.id = c.document_id
  WHERE c.tenant_id = p_tenant_id
    AND d.status = 'active'
    AND (p_doc_types IS NULL OR d.doc_type = ANY(p_doc_types))
    AND (p_languages IS NULL OR d.language = ANY(p_languages))
    AND 1 - (c.embedding <=> query_embedding) > p_min_similarity
  ORDER BY c.embedding <=> query_embedding
  LIMIT p_top_k;
$$ LANGUAGE sql STABLE;

-- 5. Hybrid search (vector + keyword via tsvector)
ALTER TABLE public.chunks ADD COLUMN IF NOT EXISTS text_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', text)) STORED;

CREATE INDEX IF NOT EXISTS idx_chunks_tsv ON public.chunks USING gin (text_tsv);

CREATE OR REPLACE FUNCTION public.fn_hybrid_search(
  query_embedding vector(1536),
  query_text text,
  p_tenant_id uuid,
  p_top_k integer DEFAULT 5,
  p_vector_weight real DEFAULT 0.7,
  p_keyword_weight real DEFAULT 0.3
) RETURNS TABLE (
  chunk_id text,
  document_id uuid,
  source text,
  chunk_index integer,
  text text,
  similarity real,
  keyword_score real,
  combined_score real
) AS $$
  WITH vector_results AS (
    SELECT
      c.id, c.document_id, d.source, c.chunk_index, c.text,
      1 - (c.embedding <=> query_embedding) AS sim
    FROM chunks c
    JOIN documents d ON d.id = c.document_id
    WHERE c.tenant_id = p_tenant_id
      AND d.status = 'active'
    ORDER BY c.embedding <=> query_embedding
    LIMIT p_top_k * 3
  ),
  keyword_results AS (
    SELECT
      c.id, c.document_id, d.source, c.chunk_index, c.text,
      ts_rank(c.text_tsv, plainto_tsquery('simple', query_text)) AS kw_score
    FROM chunks c
    JOIN documents d ON d.id = c.document_id
    WHERE c.tenant_id = p_tenant_id
      AND d.status = 'active'
      AND c.text_tsv @@ plainto_tsquery('simple', query_text)
    ORDER BY kw_score DESC
    LIMIT p_top_k * 3
  ),
  combined AS (
    SELECT
      COALESCE(v.id, k.id) AS chunk_id,
      COALESCE(v.document_id, k.document_id) AS document_id,
      COALESCE(v.source, k.source) AS source,
      COALESCE(v.chunk_index, k.chunk_index) AS chunk_index,
      COALESCE(v.text, k.text) AS text,
      COALESCE(v.sim, 0) AS similarity,
      COALESCE(k.kw_score, 0) AS keyword_score,
      p_vector_weight * COALESCE(v.sim, 0) + p_keyword_weight * COALESCE(k.kw_score, 0) AS combined_score
    FROM vector_results v
    FULL OUTER JOIN keyword_results k ON v.id = k.id
  )
  SELECT * FROM combined
  ORDER BY combined_score DESC
  LIMIT p_top_k;
$$ LANGUAGE sql STABLE;

-- 6. Update chunk_count in documents after bulk insert
CREATE OR REPLACE FUNCTION public.fn_update_doc_chunk_count() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE documents SET chunk_count = chunk_count + 1, updated_at = now()
    WHERE id = NEW.document_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE documents SET chunk_count = chunk_count - 1, updated_at = now()
    WHERE id = OLD.document_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chunks_count ON public.chunks;
CREATE TRIGGER trg_chunks_count
AFTER INSERT OR DELETE ON public.chunks
FOR EACH ROW EXECUTE FUNCTION public.fn_update_doc_chunk_count();

GRANT USAGE ON SCHEMA public TO nama_app, nama_readonly;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO nama_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chunks TO nama_app;
GRANT SELECT ON public.documents, public.chunks TO nama_readonly;
GRANT EXECUTE ON FUNCTION public.fn_search_chunks TO nama_app;
GRANT EXECUTE ON FUNCTION public.fn_hybrid_search TO nama_app;
