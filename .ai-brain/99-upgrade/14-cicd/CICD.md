---
id: CICD
version: 1.0
date: 2026-08-01
owner: DSL
status: ACTIVE
---

# CI/CD — Feature Flags + Automated Migrations + Signed Releases

> **Purpose:** Trunk-based development with safety nets: feature flags, automated DB migrations, signed releases.

---

## 1. Global systems comparison

| System | Release cadence |
|--------|-----------------|
| **Epic** | Quarterly big bang (hospital-controlled) |
| **Cerner** | Domain-specific release trains |
| **athena** | Every 2 weeks continuous |
| **MEDITECH** | Quarterly |
| **Modern SaaS (Datadog, Linear, GitLab)** | Continuous, multiple times daily |
| **NamaMedical** | **Continuous with feature flags + safety nets** |

---

## 2. CI pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: ci
on: [pull_request]
jobs:
  lint:        # eslint + sqlfluff + prettier
  typecheck:   # tsc --noEmit
  unit:        # vitest/jest
  integration: # service tests with local Postgres
  e2e:         # Playwright (medical workflow)
  security:    # npm audit + Snyk + Gitleaks
  ia-validate: # terraform plan
  contract:    # pacts validate
  prompt-eval: # .ai-brain prompt diff triggers eval
  coverage:    # ensure ≥80%
```

**Branch protection** (main, integration/*, audit/*):
- ✅ lint, type, unit, integration pass
- ✅ 1+ reviewer
- ✅ coverage not decreased
- ✅ security scan no new HIGH+
- ✅ CHANGELOG.md updated

---

## 3. CD pipeline

```
main branch
   ↓
auto-build image → tag with semver + sha
   ↓
sign with cosign (Sigstore)
   ↓
push to GHCR
   ↓
trigger deploy job (env-aware)
   ↓
DB migrations (forward, idempotent, non-destructive)
   ↓
health check
   ↓
traffic shift (canary 10% → 100% over 30 min)
   ↓
slo monitor (rollback if error)
```

---

## 4. Feature Flags (self-hosted)

```ts
// src/flags/flag_service.ts
export class FlagService {
  async isEnabled(flagId: string, ctx: {userId, tenantId, role}): Promise<boolean> {
    // Read from flags table + cache
    // Fallback to local default (false)
  }
}
```

Storage: `feature_flags` table.

```sql
CREATE TABLE feature_flags (
  id TEXT PRIMARY KEY,
  description TEXT,
  enabled_global BOOLEAN DEFAULT false,
  rules JSONB,  -- e.g., { tenant_id: ['t1','t2'], role: ['doctor'], percent: 50 }
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
-- No PHI; safe to be global
```

**Tools** (optional): LaunchDarkly, Unleash, Flipt, or self-hosted (Postgres-based Flipt).

**Lifecycle**: draft → staged → enabled → expired.

---

## 5. Database migration automation

```yaml
# .github/workflows/migrate.yml
on:
  push:
    paths:
      - 'namaweb/migrations/**'
jobs:
  validate_migration:
    steps:
      - sqlfluff lint
      - check up+down pair exists
      - non-destructive check (no DROP DATA without backup)
      - simulate up + down on test DB
      - snapshot + restore verification
```

**Rules** (per AGENTS.md):
- Forward + reverse both present
- Non-destructive (no DROP data, no silent RLS removal)
- Both idempotent
- Snapshot before major migrations

---

## 6. Signed releases + SBOM

```bash
# Build, sign, attest
cosign sign --key cosign.key ghcr.io/nama-medical/namaweb:4.2.0
cosign attest --key cosign.key --predicate sbom.json --type spdxjson ghcr.io/...

# Generate SBOM (CycloneDX)
syft packages dir:. -o cyclonedx-json > sbom.json
```

**Verification in deploy**:
```bash
cosign verify --key cosign.pub ghcr.io/nama-medical/namaweb:4.2.0
```

---

## 7. Hotfix flow

```
hotfix branch → test in staging (1h) → production
   ↓
auto-rollback on SLO violation
   ↓
post-mortem (mandatory)
```

---

## 8. Files

```
.github/workflows/
├── ci.yml
├── cd-staging.yml
├── cd-production.yml
├── migrate.yml
├── prompt-eval.yml
├── feature-flag.yml
└── release-sign.yml
namaweb/scripts/
├── migrate.sh
├── rollback.sh
└── flag-runtime.ts
```

---

*Owner: DSL — version 1.0 — 2026-08-01*
