-- filepath: namaweb/migrations/e78_kb_up.sql
-- e78 Wave 28: Knowledge base + FAQ tables

CREATE TABLE IF NOT EXISTS knowledge_articles (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    slug            TEXT NOT NULL,
    title_en        TEXT NOT NULL,
    title_ar        TEXT DEFAULT '',
    category        TEXT DEFAULT 'general',       -- general | clinical | billing | privacy | faq
    summary_en      TEXT DEFAULT '',
    summary_ar      TEXT DEFAULT '',
    body_en         TEXT DEFAULT '',
    body_ar         TEXT DEFAULT '',
    tags            JSONB DEFAULT '[]'::jsonb,
    audience        TEXT DEFAULT 'patient',       -- patient | staff | both
    view_count      INTEGER DEFAULT 0,
    helpful_yes     INTEGER DEFAULT 0,
    helpful_no      INTEGER DEFAULT 0,
    published       BOOLEAN DEFAULT FALSE,
    created_by      BIGINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_kb_tenant_category ON knowledge_articles (tenant_id, category, published);
CREATE INDEX IF NOT EXISTS idx_kb_tenant_audience ON knowledge_articles (tenant_id, audience, published);

DO $$
BEGIN BEGIN ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY; ALTER TABLE knowledge_articles FORCE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'kb RLS exists'; END; END$$;
DO $$
BEGIN BEGIN CREATE POLICY kb_tenant_isolation ON knowledge_articles USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::BIGINT); EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'kb policy exists'; END; END$$;

-- FAQ items (lightweight Q&A)
CREATE TABLE IF NOT EXISTS faqs (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    question_en     TEXT NOT NULL,
    question_ar     TEXT DEFAULT '',
    answer_en       TEXT NOT NULL,
    answer_ar       TEXT DEFAULT '',
    category        TEXT DEFAULT 'general',
    sort_order      INTEGER DEFAULT 0,
    published       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_faqs_tenant ON faqs (tenant_id, published, sort_order);

DO $$
BEGIN BEGIN ALTER TABLE faqs ENABLE ROW LEVEL SECURITY; ALTER TABLE faqs FORCE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'faqs RLS exists'; END; END$$;
DO $$
BEGIN BEGIN CREATE POLICY faqs_tenant_isolation ON faqs USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::BIGINT); EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'faqs policy exists'; END; END$$;