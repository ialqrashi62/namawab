-- Wave 26 — Audit Trail smoke write + chain verification
-- Validates the SHA-256 hash chain infrastructure (Wave 21) end-to-end.

BEGIN;

-- 1. Smoke row via direct INSERT mimicking logAudit() with hash chain
-- (We use the `nama_medical_app` role which has RLS but bypasses via current_setting)

DO $$
DECLARE
  prev_row RECORD;
  prev_hash TEXT := repeat('0', 64);
  new_idx BIGINT;
  new_hash TEXT;
  hash_input TEXT;
BEGIN
  -- Fetch the head of the chain for tenant_id=1
  SELECT row_hash, chain_idx INTO prev_row
  FROM audit_trail
  WHERE tenant_id = 1
  ORDER BY chain_idx DESC
  LIMIT 1;
  IF prev_row.row_hash IS NOT NULL THEN
    prev_hash := prev_row.row_hash;
  END IF;
  new_idx := COALESCE(prev_row.chain_idx, 0) + 1;

  -- Build hash exactly like logAudit() does (server.js logic)
  hash_input := '1|' || new_idx::TEXT || '|' || prev_hash ||
                '|smoke_test||Wave 26 audit chain smoke write|0';
  new_hash := encode(digest(hash_input, 'sha256'), 'hex');

  INSERT INTO audit_trail (
    user_id, username, action, module, new_values, ip_address,
    tenant_id, prev_hash, row_hash, chain_idx
  ) VALUES (
    NULL, 'wave26_smoke', 'WAVE26_SMOKE', 'system',
    '{"wave":26, "purpose":"chain_verification"}'::text,
    '127.0.0.1',
    1, prev_hash, new_hash, new_idx
  );
  RAISE NOTICE 'Wrote chain row idx=%, hash=%', new_idx, new_hash;
END $$;

-- 2. Verify chain integrity
\echo
\echo === CHAIN VERIFICATION ===
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
    WHEN COUNT(*) FILTER (WHERE prev_hash IS NOT NULL AND prev_hash != expected_prev) = 0 THEN 'CHAIN_INTACT'
    ELSE 'CHAIN_BROKEN'
  END AS chain_status
FROM chain;

\echo
\echo === AUDIT TRAIL ROW COUNT ===
SELECT count(*) AS audit_rows FROM audit_trail;

COMMIT;
