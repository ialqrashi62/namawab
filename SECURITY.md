# Security Policy — NamaMedical

NamaMedical is a multi-tenant HIS/EMR that stores Protected Health Information (PHI) and financial
records. Security issues are treated as the highest priority.

## Reporting a vulnerability
- **Do NOT** open a public issue for a security vulnerability.
- Email the maintainer privately with: affected endpoint/file, reproduction steps, and impact.
- Allow reasonable time for a fix before any disclosure.

## Security posture (enforced)
- **Tenant isolation:** PostgreSQL FORCE Row-Level Security; the app runs as a non-superuser role
  (`nama_medical_app`, `bypassrls=false`) with per-request `app.tenant_id` binding.
- **AuthN:** bcrypt password hashing (no plaintext fallback), account lockout, optional TOTP MFA with
  one-time recovery codes; secrets required in production (the app refuses to boot without them).
- **AuthZ:** layered `requireAuth` → `requireRole` → DB-matrix `requirePermission` (fail-closed).
- **PHI at rest:** stored outside the web root, served only via an authenticated, tenant-scoped,
  traversal-denied, audited endpoint; optional envelope encryption (DPAPI KEK).
- **Transport/headers:** Helmet, CORS allowlist (no reflect-any-origin), CSRF Origin checks,
  Permissions-Policy, CSP (report-only → enforce on staging first).
- **Input:** money/clinical engines are fail-closed; central `validation.js` for input schemas.
- **Audit:** `audit_trail` + optional automatic audit middleware (HIPAA §164.312(b)).

## Automated checks (CI)
- Dependency audit (`npm audit`, fail on high), CodeQL SAST, gitleaks secret scan, DB-free unit tests.
- Weekly Dependabot updates.

## Handling secrets
- Never commit real secrets. Only `*.example` env templates are tracked.
- If a secret is ever exposed: rotate immediately, then purge history. Public remotes are push-disabled.
