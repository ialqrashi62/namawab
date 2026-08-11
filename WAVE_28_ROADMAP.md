# Wave 28 Roadmap — Next 5 Improvements

> **Date:** 2026-08-05
> **Baseline:** Post-Wave 27 (369 tables, 339 RLS, 832 indexes, chain INTACT)
> **Skill:** `improvement-roadmap` (new, scored prioritization)

## Score Formula
`score = (impact × safety_relevance) / (effort × risk)`

---

## Ranked Improvements (next 5 waves)

### 🏆 Wave 29 — Tenant Cache + Redis Sessions Hardening
- **Score: 4×4 / (2×2) = 4.0**
- **Impact (4)**: sessions are the #1 hit on Redis; current `redisStore.touch()` may have edge cases
- **Safety (4)**: touches RAILS #12 (no PHI in logs)
- **Effort (2)**: 1-2 days
- **Risk (2)**: tested in dev before prod
- **Actions**:
  - Add Redis health endpoint (`/api/health/redis?detail=1`)
  - Implement session sliding-TTL reaping (clean stale sessions every 6h)
  - Add `RedisStoreWrapper` for fail-open + metrics
  - Audit log sessions.create / sessions.destroy for SOC2 evidence

---

### 🥈 Wave 30 — Backup & DR Automation
- **Score: 5×5 / (3×3) = 2.78**
- **Impact (5)**: critical for KSA health-data hosting (PDPL retention rules)
- **Safety (5)**: every RAIL indirectly (audit chain backups, RLS state, schema)
- **Effort (3)**: 2-3 days (pg_dump + cron + S3-compatible upload)
- **Risk (3)**: backup integrity must be verified (corrupt backup = disaster)
- **Actions**:
  - `backup_nama_medical_daily.sh` — pg_dump + tar to /var/backups
  - Verify backup SHA-256 + restore-test in sandbox
  - Off-site: rsync to Hetzner Storage Box (separate from primary)
  - 30-day retention; encrypted with KEK from `crypto_envelope.js`

---

### 🥉 Wave 31 — RLS Performance Audit & Partial Composite Indexes
- **Score: 4×3 / (2×2) = 3.0**
- **Impact (4)**: with 339 FORCE RLS tables, query plan must respect RLS predicates
- **Safety (3)**: touches RAIL #5 (tenant isolation)
- **Effort (2)**: 1 day
- **Risk (2)**: ALTER INDEX CONCURRENTLY (no lock)
- **Actions**:
  - EXPLAIN ANALYZE on top 20 hot queries
  - Ensure every tenant_id column has a B-tree index (or BRIN for time-series)
  - Add `idx_*_tenant_id` to any RLS-protected table missing it
  - Document in `docs/RLS_PERF.md` the expected query patterns

---

### Wave 32 — Observability: Dashboards + Alerting
- **Score: 4×3 / (3×2) = 2.0**
- **Impact (4)**: ops visibility reduces MTTR
- **Safety (3)**: detecting RLS failures fast
- **Effort (3)**: 2-3 days (Grafana + Prometheus exporter)
- **Risk (2)**: dashboards read-only
- **Actions**:
  - `/metrics` endpoint (Prometheus format) — already exists as `/_metrics`
  - Add `audit_chain_gaps` gauge (alert when gap > 0)
  - Add `rls_policy_count_total` counter
  - Alert rules for: db_up=0, redis_up=0, audit_chain_broken > 0

---

### Wave 33 — API Documentation (OpenAPI 3.0)
- **Score: 3×2 / (2×1) = 3.0**
- **Impact (3)**: developer onboarding + partner integrations
- **Safety (2)**: docs reduce accidental API misuse
- **Effort (2)**: 1-2 days
- **Risk (1)**: pure docs, no behavior change
- **Actions**:
  - Extract route definitions from `namaweb/server.js` (use AST or regex)
  - Generate OpenAPI 3.0 spec
  - Host at `/api/docs` (Swagger UI)
  - Include examples + error responses

---

## Suggested Wave Order
1. **Wave 29** (highest score, foundational)
2. **Wave 33** (lowest risk, builds docs for everything else)
3. **Wave 31** (RLS perf = safety wins)
4. **Wave 30** (DR — biggest safety rail impact, but bigger effort)
5. **Wave 32** (observability — last because it observes everything before it)

---

## What Was Just Done (Wave 28)
- `pg_stat_statements` extension CREATED (will activate on next PG restart with shared_preload_libraries)
- **9 new indexes created** (832 total, was 822):
  - patients × 3 (tenant_created_at, tenant_updated_at, tenant_name)
  - invoices × 2 (tenant_accounting_posting_status_date, tenant_patient)
  - beds, wards, emergency_beds, audit_trail, employees × 1 each
- Live verified: still UP, redis:up, env=production, 71 min uptime

---

## Open Items Not Addressed by This Roadmap
- NPHIES production CSID (owner-gated)
- CSP_ENFORCE=true flip (owner-gated)
- PCC WebSocket (out of scope, requires React Native client)
- 13 commits on `audit/p0p1-remediation-autopilot` branch (owner-review pending)

---

## Files Created
- `improvement-roadmap/SKILL.md` (skill)
- `wave28_perf_audit.sql` (baseline)
- `wave28_critical_indexes.sql` (applied)
- `wave28_perf_verify.sql` (verification)
- `index_list.sql`, `schema_check.sql` (helpers)
- `WAVE_28_ROADMAP.md` (this file)
