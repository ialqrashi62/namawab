-- Wave 26 — Backfill hash chain for legacy rows (pre-Wave-21 audit entries)
-- Safe: transactional, uses same hash algorithm as logAudit() in server.js

BEGIN;

-- 1. Snapshot current state
\echo === BEFORE ===
SELECT
  count(*) FILTER (WHERE chain_idx IS NULL OR row_hash IS NULL) AS legacy_rows,
  count(*) FILTER (WHERE chain_idx IS NOT NULL AND row_hash IS NOT NULL) AS chained_rows,
  max(chain_idx) AS max_chain_idx
FROM audit_trail WHERE tenant_id = 1;

-- 2. Backfill chain indices + hashes for rows where chain_idx IS NULL
-- Process in id order to maintain a deterministic chain
DO $$
DECLARE
  r RECORD;
  prev TEXT := repeat('0', 64);
  idx BIGINT := 0;
  input TEXT;
  computed_hash TEXT;
BEGIN
  FOR r IN
    SELECT id, action, module, new_values, user_id
    FROM audit_trail
    WHERE tenant_id = 1
      AND row_hash IS NULL
    ORDER BY id ASC
  LOOP
    input := '1|' || idx::TEXT || '|' || prev ||
             '|' || COALESCE(r.action, '') ||
             '|' || COALESCE(r.module, '') ||
             '|' || COALESCE(r.new_values, '') ||
             '|' || COALESCE(r.user_id::TEXT, '');
    computed_hash := encode(digest(input, 'sha256'), 'hex');
    UPDATE audit_trail
    SET prev_hash = prev, row_hash = computed_hash, chain_idx = idx
    WHERE id = r.id;
    prev := computed_hash;
    idx := idx + 1;
  END LOOP;
  RAISE NOTICE 'Backfilled % rows; final chain_idx=%, head_hash=%', idx, idx-1, prev;
END $$;

-- 3. Verify chain integrity post-backfill
\echo
\echo === AFTER ===
SELECT
  count(*) FILTER (WHERE chain_idx IS NULL OR row_hash IS NULL) AS legacy_rows,
  count(*) FILTER (WHERE chain_idx IS NOT NULL AND row_hash IS NOT NULL) AS chained_rows,
  max(chain_idx) AS max_chain_idx
FROM audit_trail WHERE tenant_id = 1;

\echo
\echo === CHAIN INTEGRITY VERIFICATION ===
WITH RECURSIVE chain AS (
  SELECT id, chain_idx, prev_hash, row_hash,
         LAG(row_hash) OVER (ORDER BY chain_idx) AS expected_prev
  FROM audit_trail
  WHERE tenant_id = 1 AND chain_idx IS NOT NULL
)
SELECT
  COUNT(*) AS total_rows,
  COUNT(*) FILTER (WHERE prev_hash = expected_prev) AS valid_chain_links,
  COUNT(*) FILTER (WHERE prev_hash IS NULL OR prev_hash != expected_prev) AS broken_chain_links,
  CASE
    WHEN COUNT(*) FILTER (WHERE prev_hash IS NOT NULL AND prev_hash != expected_prev) = 0
      THEN 'CHAIN_INTACT ✓'
    ELSE 'CHAIN_BROKEN'
  END AS chain_status
FROM chain;

COMMIT;
