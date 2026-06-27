# 03 — طابور المرشّحات الجاهزة (Candidate Queue)

> 2026-06-22 | مرشّحات/تصاميم جاهزة بانتظار بوابة/حساب/مفتاح. لا تنفيذ.

| # | المرشّح | الموقع | جاهزية | ينتظر |
|---|---|---|---|---|
| 1 | A2 MFA | docs/PHASE_A2_MFA/ (design+sql+tests) | rehearsed-design | E2E + APPROVE_MFA_DDL_AND_DEPLOY |
| 2 | A3 PHI vault | docs/PHASE_A3_PHI_ENCRYPTION_VAULT/ (sql+scripts) | **rehearsed PASS** | KMS + APPROVE_PHI_ENCRYPTION_VAULT_ROLLOUT |
| 3 | A3A file guard | docs/PHASE_A3A_PUBLIC_UPLOADS_GUARD/ (design) | designed | E2E + APPROVE_PHI_FILE_GUARD_DEPLOY |
| 4 | A1 UI | docs/PHASE_A1_EMR_LOCK_SIGNATURE/03 (scope) | scoped | E2E (PROVIDE_TEST_ACCOUNT) |
| 5 | tenant_id index | docs/sql/tenant_id_index_candidate_* | ready | APPROVE_TENANT_ID_INDEX (لا عائق أداء) |
| 6 | daily_close-style modules (WHO/ESI/ICU scores) | Blueprint 03/04 | design | candidate + بوابة |
| 7 | i18n files | docs/FRESH_GLOBAL_AUDIT/i18n_*_candidate.json | ready | (UX، اختياري) |
| 8 | OpenAPI / migration candidates | docs/FRESH_GLOBAL_AUDIT/ | ready | مرجعي |
| 9 | audit-reader | docs/sql/audit_trail_reader_* | candidate | APPROVE_AUDIT_READER_GRANT_AND_DEPLOY |
| 10 | accounting | docs/accounting_candidates/ | rehearsed 63/63 | APPROVE_ACCOUNTING_POSTING_ENABLEMENT |
