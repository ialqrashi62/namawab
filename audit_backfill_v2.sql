-- Wave 26 — Backfill prev_hash for audit rows that have row_hash but no prev_hash
-- (legacy rows from autopilot iterations pre-Wave-21)

BEGIN;

DO $$
DECLARE
  r RECORD;
  prev TEXT;
  idx BIGINT;
  input TEXT;
  computed_hash TEXT;
  updated INT := 0;
BEGIN
  -- Find the head: most recent row (by id) that has a valid prev_hash chain
  SELECT row_hash, chain_idx INTO prev, idx
  FROM audit_trail
  WHERE tenant_id = 1 AND prev_hash IS NOT NULL AND row_hash IS NOT NULL
  ORDER BY chain_idx DESC
  LIMIT 1;

  IF prev IS NULL THEN
    RAISE NOTICE 'No chain head found; starting from genesis';
    prev := repeat('0', 64);
    idx := -1;
  ELSE
    RAISE NOTICE 'Chain head found: idx=%, hash=%. Continuing from idx+1', idx, prev;
  END IF;

  -- Walk through legacy rows (those without prev_hash) and link them
  FOR r IN
    SELECT id, action, module, new_values, user_id
    FROM audit_trail
    WHERE tenant_id = 1
      AND prev_hash IS NULL AND row_hash IS NOT NULL
    ORDER BY id ASC
  LOOP
    idx := idx + 1;
    input := '1|' || idx::TEXT || '|' || prev ||
             '|' || COALESCE(r.action, '') ||
             '|' || COALESCE(r.module, '') ||
             '|' || COALESCE(r.new_values, '') ||
             '|' || COALESCE(r.user_id::TEXT, '');
    -- Recompute row_hash to match logAudit() algorithm
    computed_hash := encode(digest(input, 'sha256'), 'hex');
    UPDATE audit_trail
    SET prev_hash = prev,
        row_hash = computed_hash,
        chain_idx = idx
    WHERE id = r.id;
    prev := computed_hash;
    updated := updated + 1;
  END LOOP;
  RAISE NOTICE 'Updated % legacy rows; new head idx=%, hash=%', updated, idx, prev;
END $$;

\echo
\echo === CHAIN STATUS AFTER BACKFILL ===
SELECT
  count(*) AS total,
  count(*) FILTER (WHERE prev_hash IS NULL) AS null_prev,
  count(*) FILTER (WHERE row_hash IS NULL) AS null_row,
  count(DISTINCT row_hash) AS distinct_hashes
FROM audit_trail WHERE tenant_id = 1;

\echo
\echo === INTEGRITY VERIFICATION ===
WITH chain AS (
  SELECT id, chain_idx, prev_hash, row_hash,
         LAG(row_hash) OVER (ORDER BY chain_idx) AS expected_prev
  FROM audit_trail
  WHERE tenant_id = 1 AND chain_idx IS NOT NULL
)
SELECT
  COUNT(*) AS total_rows,
  COUNT(*) FILTER (WHERE prev_hash = expected_prev OR (prev_hash IS NULL AND expected_prev IS NULL)) AS valid_links,
  COUNT(*) FILTER (WHERE prev_hash != expected_prev OR (prev_hash IS NULL AND expected_prev IS NOT NULL) OR (prev_hash IS NOT NULL AND expected_prev IS NULL)) AS broken_links,
  CASE
    WHEN COUNT(*) FILTER (WHERE prev_hash != expected_prev OR (prev_hash IS NULL AND expected_prev IS NOT NULL) OR (prev_hash IS NOT NULL AND expected_prev IS NULL)) = 0
      THEN 'CHAIN_INTACT_OK'
    ELSE 'CHAIN_BROKEN'
  END AS chain_status
FROM chain;

COMMIT;
