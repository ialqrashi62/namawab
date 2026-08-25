-- filepath: namaweb/migrations/e53b_ai_store_simple_down.sql
-- AI Store (simple version) -- reverse migration
BEGIN;

DROP POLICY IF EXISTS ai_cost_log_tenant ON ai_cost_log;
ALTER TABLE ai_cost_log DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ai_cost_log CASCADE;

DROP POLICY IF EXISTS ai_prompt_log_tenant ON ai_prompt_log;
ALTER TABLE ai_prompt_log DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ai_prompt_log CASCADE;

DROP POLICY IF EXISTS ai_chunks_tenant_isolation ON ai_document_chunks;
ALTER TABLE ai_document_chunks DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ai_document_chunks CASCADE;

COMMIT;