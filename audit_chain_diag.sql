-- Diagnose chain: identify which rows are valid, which are not, and why.
\pset footer off

\echo === Chain distribution ===
SELECT
  count(*) FILTER (WHERE chain_idx IS NOT NULL) AS has_chain_idx,
  count(*) FILTER (WHERE chain_idx IS NULL) AS no_chain_idx,
  count(*) FILTER (WHERE row_hash IS NOT NULL) AS has_row_hash,
  count(*) FILTER (WHERE prev_hash IS NOT NULL) AS has_prev_hash,
  min(chain_idx) AS min_idx, max(chain_idx) AS max_idx
FROM audit_trail WHERE tenant_id=1;

\echo
\echo === First 5 + last 5 chain rows ===
(SELECT 'first' AS pos, id, chain_idx, substring(prev_hash, 1, 16) AS prev16, substring(row_hash, 1, 16) AS row16
 FROM audit_trail WHERE tenant_id=1 AND chain_idx IS NOT NULL
 ORDER BY chain_idx ASC LIMIT 5)
UNION ALL
(SELECT 'last', id, chain_idx, substring(prev_hash, 1, 16), substring(row_hash, 1, 16)
 FROM audit_trail WHERE tenant_id=1 AND chain_idx IS NOT NULL
 ORDER BY chain_idx DESC LIMIT 5);
