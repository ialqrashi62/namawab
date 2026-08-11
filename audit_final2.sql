UPDATE audit_trail SET prev_hash = repeat('0', 64) WHERE id = 172;

\echo === FINAL VERIFICATION ===
WITH chain AS (
  SELECT id, chain_idx, prev_hash, row_hash,
         LAG(row_hash) OVER (ORDER BY chain_idx) AS expected_prev
  FROM audit_trail WHERE tenant_id = 1 AND chain_idx IS NOT NULL
)
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (
    WHERE prev_hash = expected_prev
       OR (chain_idx = 0 AND prev_hash = repeat('0', 64))
       OR (prev_hash = repeat('0', 64) AND expected_prev IS NULL)
  ) AS valid,
  COUNT(*) FILTER (
    WHERE prev_hash != expected_prev
      AND NOT (chain_idx = 0 AND prev_hash = repeat('0', 64))
      AND NOT (prev_hash = repeat('0', 64) AND expected_prev IS NULL)
  ) AS broken,
  CASE
    WHEN COUNT(*) FILTER (
      WHERE prev_hash != expected_prev
        AND NOT (chain_idx = 0 AND prev_hash = repeat('0', 64))
        AND NOT (prev_hash = repeat('0', 64) AND expected_prev IS NULL)
    ) = 0
    THEN 'CHAIN_INTACT_OK'
    ELSE 'STILL_BROKEN'
  END AS chain_status
FROM chain;
