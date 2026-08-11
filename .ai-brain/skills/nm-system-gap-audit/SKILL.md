---
name: nm-system-gap-audit
description: Use when auditing a multi-tier production system (DB + API + workers + frontend) end-to-end. Identifies schema gaps, missing policies, env misconfigurations, missing migrations, orphaned tables. Saves ~80% tokens per audit.
---

# System Gap Audit — Token-Saver

## When to use

A full system health audit before:
- Major deploy
- Compliance certification
- Going live
- Quarterly review

## 6 audit dimensions

| Dimension | What to check | Tool |
|---|---|---|
| **Schema** | Missing tables, missing columns, missing indexes, orphaned tables | pg_catalog queries |
| **Policies** | RLS enabled on every tenant-scoped table? FORCE_RLS on every one? | pg_class, pg_policy |
| **Migrations** | All migrations applied on live? Forward + back both present? | migrations/*.sql |
| **Env** | All required env vars set on live? No dev secrets on prod? | pm2 env, .env.example |
| **Routes** | Every route has the right middleware chain? Mounted in server.js? | source scan |
| **Frontend** | i18n 100%? RTL/LTR tested? No console.log of PHI? | audit scripts |

## Schema audit

```sql
-- Find tables without tenant_id
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('tenants', 'migrations', 'schema_migrations', 'pg_*')
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT IN (
      SELECT c.relname FROM pg_class c
      JOIN pg_attribute a ON a.attrelid = c.oid
      WHERE a.attname = 'tenant_id' AND a.attnum > 0
  );

-- Find tables without FORCE RLS
SELECT c.relname
FROM pg_class c
WHERE c.relkind = 'r' AND c.relnamespace = 'public'::regnamespace
  AND NOT c.relrowsecurity;     -- missing RLS
-- (separate query for FORCE RLS)

-- Find orphaned tables (no recent SELECT)
SELECT schemaname, tablename, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan = 0 AND idx_scan = 0 AND n_live_tup = 0;
```

## Policy audit

```sql
-- Tables with RLS enabled but no policy
SELECT c.relname
FROM pg_class c
WHERE c.relkind = 'r'
  AND c.relnamespace = 'public'::regnamespace
  AND c.relrowsecurity = true
  AND NOT EXISTS (SELECT 1 FROM pg_policy p WHERE p.polrelid = c.oid);
```

## Migration audit

```bash
# List all migration files
ls -la namaweb/migrations/*_up.sql | wc -l

# Check which are recorded as applied
psql -c "SELECT filename FROM schema_migrations ORDER BY applied_at;"

# Diff: applied vs file count
diff <(ls namaweb/migrations/*_up.sql | xargs -n1 basename | sort) \
     <(psql -t -c "SELECT filename FROM schema_migrations" | sort)

# Check that every up has a matching down
for up in namaweb/migrations/*_up.sql; do
    dn="${up/_up.sql/_down.sql}"
    [ -f "$dn" ] || echo "MISSING DOWN: $up"
done
```

## Env audit

```bash
# Required env vars (from .env.example)
REQ=(DATABASE_URL SESSION_SECRET COOKIE_SECRET DPAPI_KEK_BASE64
     OPENAI_API_KEY ANTHROPIC_API_KEY ZATCA_CERT_PATH ZATCA_KEY_PATH
     NPHIES_ENDPOINT NPHIES_TOKEN PUBLIC_URL LOG_LEVEL
     CSRF_SECRET IDEMPOTENCY_TIMEOUT_MINUTES)

# Check live (via pm2)
ssh root@204.168.144.74 "pm2 env nama-medical-erp 2>/dev/null" | grep -E "^|^Key" > /tmp/pm2.env
for v in "${REQ[@]}"; do
    if ! grep -q "^$v=" /tmp/pm2.env; then echo "MISSING: $v"; fi
done

# Check no dev secrets on live
for v in dev_ test_ localhost 127.0.0.1 fake_; do
    if grep -q "$v" /tmp/pm2.env; then echo "DEV SECRET LEAK: $v"; fi
done
```

## Routes audit

```bash
# List all routes in server.js
grep -nE "app\.(get|post|put|delete|patch)\(" namaweb/server.js | head -50

# Verify each router file has the middleware chain
for f in namaweb/*_router.js; do
    if ! grep -q "requireAuth" "$f"; then echo "MISSING requireAuth: $f"; fi
    if ! grep -q "requireTenantScope" "$f"; then echo "MISSING tenant: $f"; fi
done
```

## Frontend audit

```bash
# i18n coverage
node scripts/i18n_coverage.js
# Must show 100% for all 4 locales

# Hardcoded strings
node scripts/i18n_audit_strings.js
# Must be empty

# PHI in console.log
grep -nE "console\.(log|info|warn|error).*patient" namaweb/public/js/*.js
# Must be empty

# unsafe innerHTML
grep -nE "\.innerHTML\s*=" namaweb/public/js/*.js
# Must use SafeHtml, not raw innerHTML
```

## Audit report template

```markdown
# System Gap Audit — {Date}

## Summary
- Total issues: N
- Critical: X
- High: Y
- Medium: Z

## 1. Schema
- ❌ {table} missing tenant_id (BLOCKING)
- ❌ {table} missing FORCE_RLS (BLOCKING)
- ✓ {table} OK

## 2. Policies
- ❌ {table} RLS enabled but no policy
- ✓ {table} OK

## 3. Migrations
- ❌ eNN missing down migration
- ❌ eNN not applied to live
- ✓ All others OK

## 4. Env
- ❌ ZATCA_CERT_PATH not set on live (BLOCKING for invoicing)
- ❌ No dev secret leaks
- ✓ All other vars present

## 5. Routes
- ❌ {file} missing requireAuth
- ❌ {file} missing requireTenantScope
- ✓ All others OK

## 6. Frontend
- ❌ 3 hardcoded Arabic strings in {file}
- ❌ 2 i18n keys missing in fr.json
- ✓ i18n 99.7%

## Action plan
1. Fix critical (now): add tenant_id + FORCE_RLS to {table}
2. Fix high (this week): add missing policies, missing migrations
3. Fix medium (this sprint): i18n gaps, hardcoded strings
4. Re-audit after fixes
```

## Token saving

Each audit from scratch = ~500 lines. With template = ~80 lines unique
(specific env vars, specific tables, specific routes). ~85% reduction.