-- Wave 28 — Performance verification

\echo === EXPLAIN: patient list query (typical) ===
EXPLAIN (ANALYZE, BUFFERS) SELECT id, name_en, mrn, status
FROM patients
WHERE tenant_id = 1
ORDER BY created_at DESC
LIMIT 50;

\echo
\echo === EXPLAIN: invoice AR aging ===
EXPLAIN (ANALYZE, BUFFERS) SELECT id, total, accounting_posting_status
FROM invoices
WHERE tenant_id = 1 AND accounting_posting_status = 'UNPOSTED'
ORDER BY created_at DESC LIMIT 100;

\echo
\echo === EXPLAIN: bed availability ===
EXPLAIN (ANALYZE, BUFFERS) SELECT id, ward_id, status
FROM beds WHERE tenant_id = 1 AND ward_id = 5;

\echo
\echo === EXPLAIN: audit chain verification ===
EXPLAIN (ANALYZE, BUFFERS) SELECT id, chain_idx, prev_hash, row_hash
FROM audit_trail WHERE tenant_id = 1
ORDER BY chain_idx DESC LIMIT 100;
