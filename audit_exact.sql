SELECT
  count(*) AS total,
  count(*) FILTER (WHERE row_hash IS NULL) AS null_row_hash,
  count(*) FILTER (WHERE prev_hash IS NULL) AS null_prev_hash,
  count(*) FILTER (WHERE chain_idx IS NULL) AS null_chain_idx,
  count(*) FILTER (WHERE row_hash IS NOT NULL AND prev_hash IS NULL) AS row_with_no_prev,
  count(DISTINCT row_hash) AS distinct_row_hashes
FROM audit_trail WHERE tenant_id = 1;
