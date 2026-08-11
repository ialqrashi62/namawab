\pset footer off
WITH chain AS (
  SELECT id, chain_idx, prev_hash, row_hash, action, module,
         LAG(row_hash) OVER (ORDER BY chain_idx) AS expected_prev
  FROM audit_trail
  WHERE tenant_id = 1 AND chain_idx IS NOT NULL
)
SELECT id, chain_idx, action, module,
       substring(prev_hash, 1, 12) AS prev12,
       substring(expected_prev, 1, 12) AS expected12,
       substring(row_hash, 1, 12) AS row12
FROM chain
WHERE prev_hash != expected_prev
   OR (prev_hash IS NULL AND expected_prev IS NOT NULL)
   OR (prev_hash IS NOT NULL AND expected_prev IS NULL)
ORDER BY chain_idx;
