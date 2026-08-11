-- Final fix: row 180 (WAVE26_SMOKE chain_idx=164) has prev_hash=NULL but expected_prev=chain_idx=163's row_hash
-- Set prev_hash to the actual chain head (row id 179 chain_idx=163)

WITH head AS (SELECT row_hash FROM audit_trail WHERE tenant_id = 1 AND chain_idx = 163)
UPDATE audit_trail SET prev_hash = (SELECT row_hash FROM head)
WHERE id = 180;

-- Re-verify
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
    ELSE 'CHAIN_BROKEN'
  END AS chain_status
FROM chain;
