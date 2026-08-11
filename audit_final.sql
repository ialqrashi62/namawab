-- Final: ensure first row (chain_idx=0) has prev_hash = repeat('0', 64)
BEGIN;
UPDATE audit_trail
SET prev_hash = repeat('0', 64)
WHERE tenant_id = 1 AND chain_idx = 0 AND (prev_hash IS NULL OR prev_hash != repeat('0', 64));

-- Recompute final integrity
\echo === CHAIN INTEGRITY (final) ===
WITH chain AS (
  SELECT id, chain_idx, prev_hash, row_hash,
         LAG(row_hash) OVER (ORDER BY chain_idx) AS expected_prev
  FROM audit_trail
  WHERE tenant_id = 1 AND chain_idx IS NOT NULL
)
SELECT
  COUNT(*) AS total_rows,
  COUNT(*) FILTER (
    WHERE prev_hash = expected_prev
       OR (chain_idx = 0 AND prev_hash = repeat('0', 64))
  ) AS valid_links,
  COUNT(*) FILTER (
    WHERE prev_hash != expected_prev
      AND NOT (chain_idx = 0 AND prev_hash = repeat('0', 64))
  ) AS broken_links,
  CASE
    WHEN COUNT(*) FILTER (
      WHERE prev_hash != expected_prev
        AND NOT (chain_idx = 0 AND prev_hash = repeat('0', 64))
    ) = 0
    THEN 'CHAIN_INTACT_OK'
    ELSE 'CHAIN_BROKEN'
  END AS chain_status
FROM chain;
COMMIT;
