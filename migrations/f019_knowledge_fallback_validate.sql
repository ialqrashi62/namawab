-- f019_knowledge_fallback_validate.sql
SELECT count(*) AS rows_kcf FROM knowledge_chunks_fb;
SELECT count(*) AS policy_ok FROM pg_policies WHERE tablename='knowledge_chunks_fb' AND policyname='p_kcf_tenant';
