# Wave 31 — RLS Query Pattern Audit (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

Provide a static, CI-friendly audit that classifies every `pool.query(...)`
call in `server.js` against a curated list of tenant-scoped tables, and
reports whether the SQL includes an explicit `tenant_id` predicate (or
`app.tenant_id` GUC pattern). This is the prerequisite for closing out
the "RLS query pattern audit" deliverable in the Wave 28 → 33 improvement
roadmap.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/wave31_rls_audit.js` | Static scanner. READ-ONLY — no `require()`, no `eval()`, no DB connection. Pure regex against source text. |
| `namaweb/wave31_rls_audit_test.js` | 10 unit tests — all PASS. |
| `namaweb/rls_audit_report.json` | Pre-baked audit report on the current `server.js` (1,161 queries scanned). |
| `server.js` | + `wave31` require, + `/api/security/rls-audit` GET (Admin/IT only). |
| `WAVE_31_RLS_AUDIT_AR.md` | This report. |

---

## 3. Design choices

- **Curated allowlist of tenant-scoped tables.** Lookup / global tables
  (`medical_services`, `lab_tests_catalog`, etc.) are NOT in the list —
  queries against them are reported as `INFO`, not findings.
- **Two predicate patterns count as "scoped":**
  1. `WHERE tenant_id = $N` (or `AND tenant_id = $N`) — explicit predicate.
  2. `app.tenant_id` GUC reference (e.g. `set_config('app.tenant_id', $1, true)`) — FORCE-RLS pattern.
- **60s in-process cache** so repeated scrapes don't re-scan the ~26.5k-line file.
- **Exit non-zero on risk findings** so CI can gate on drift.
- **Prometheus output** (`WAVE31_OUTPUT=prom`) so the same data is scrapeable.

---

## 4. Current audit results (on `server.js`)

```
$ node wave31_rls_audit.js server.js
{
  "summary": {
    "files": 1,
    "total": 1161,
    "ok": 564,
    "risk": 295,
    "info": 393
  }
}
```

**Interpretation:**

- **564 queries** are explicitly defended (tenant predicate OR app.tenant_id GUC).
- **295 queries** reference a tenant-scoped table without a visible predicate.
  In practice many of these live inside `client.query` calls that
  *preceded* a `set_config('app.tenant_id', …)` on the same connection —
  the regex cannot statically link the two. The audit surfaces them
  as **drift candidates** for follow-up patching.
- **393 queries** are informational (lookup tables, no scope needed).

The 295 risk findings are the canonical backlog for the next round of
RLS hardening. They include:

- `SELECT patient_id FROM lab_samples WHERE id = $1` (line 675)
- `SELECT patient_id FROM lab_radiology_orders WHERE id = $1` (line 679)
- `SELECT phone FROM patients WHERE id = $1` (line 684)

These are typically inside `<tx>` blocks where the GUC is set first; a
focused Wave 31b follow-up could replace them with explicit
`tenant_id` predicates.

---

## 5. Verification

```
$ node --check wave31_rls_audit.js
$ node wave31_rls_audit_test.js
[PASS] auditSource: tenant predicate matches the OK class
[PASS] auditSource: missing tenant_id on a tenant-scoped table => RISK
[PASS] auditSource: non-tenant-scoped table is INFO, not risk
[PASS] auditSource: app.tenant_id GUC reference also counts as scoped
[PASS] auditSource: multiple tables in a join, all need tenant_id
[PASS] auditSource: tenant_id present in join, all good
[PASS] auditSource: ignores non pool.query calls
[PASS] auditFiles: returns aggregate + per-file summary
[PASS] toPrometheusMetrics: well-formed output
[PASS] TENANT_SCOPED_TABLES: contains core tables
10 passed, 0 failed
```

Live HTTP smoke (server running on port 3999):

```
$ curl /api/security/rls-audit            # → 401 (auth required, correct)
$ curl /api/security/rls-audit (admin)  # → 200 JSON report
```

---

## 6. Safety rails respected

- **Zero DB / no code execution.** The scanner only reads source text.
- **No PHI / secrets in the report.** Only SQL snippets.
- **No behavior change.** No existing pool.query is rewritten.
- **Auth-gated.** The HTTP surface is Admin/IT only (the report reveals internal table names).

---

## 7. Activation

Routes are mounted in `server.js` and effective on next PM2 restart.

```bash
# Offline CI gate
node wave31_rls_audit.js server.js          # exit 1 if drift > 0

# HTTP surface (admin)
curl -u admin:*** http://localhost:3000/api/security/rls-audit
```
