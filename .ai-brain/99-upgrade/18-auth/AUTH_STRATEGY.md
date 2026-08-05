---
id: AUTH-STRATEGY
version: 1.0
date: 2026-08-01
owner: DSL+SA
status: ACTIVE
---

# Authentication, Authorization (SSO/JWT/RBAC) + Penetration Testing

> **Purpose:** Strong, multi-tenant AAA — SSO for providers, MFA mandatory, JWT short-lived, RBAC with Golden Access Rule.

---

## 1. Global systems comparison

| System | Approach |
|--------|----------|
| **Epic** | SAML + OIDC + MFA; Hyperspace SSO |
| **Cerner** | OIDC + SAML; site-level MFA |
| **athena** | OAuth2 + Google/SAML SSO; MFA |
| **MEDITECH** | OIDC + LDAP + MFA |
| **Microsoft Cloud for Healthcare** | Azure AD + MFA |
| **NamaMedical** | **OIDC/SAML SSO + MFA + JWT (15m) + refresh (7d) + RBAC + Golden Access** |

---

## 2. SSO (Single Sign-On)

```yaml
sso:
  oidc_providers:
    - google
    - microsoft
    - okta
    - keycloak
    - identity_provider_per_tenant
  saml_providers:
    - okta
    - adfs
    - shibboleth
  fallback: local_email_password + MFA (only if SSO not configured)
```

Discovery per tenant.

---

## 3. JWT (short-lived) + refresh

```ts
access_token: 15m (EdDSA signed, claims: user_id, tenant_id, role, scope)
refresh_token: 7d, rotating (one-time use), stored httpOnly cookie
revoke: token blacklist on logout; refresh invalidation
```

---

## 4. MFA mandatory

Per dept + role:
- TOTP (Google Authenticator, Microsoft Authenticator)
- SMS (fallback, with limits)
- Push notification (preferred)
- FIDO2 (for admins)
- Risk-based: step-up on suspicious login

---

## 5. RBAC + Golden Access Rule

```yaml
# Per AGENTS.md rail 13
golden_access_rule:
  Owner: ['*']                 # absolute
  Admin: ['*']                 # tenant scope
  Doctor: ['specialty:scope']  # specialty-scoped
  Staff: ['task:scope']
  Patient: ['self']
```

Per-FHIR-scope + per-dept + per-encounter:
- Doctor sees ONLY encounters of their specialty + ED (cross-coverage)
- Step-up required to access other specialty records
- All access logged (audit table `rbac_access_log`)

---

## 6. Tenant + role enforcement

```ts
// middleware/require_auth.ts
async function requireAuth(req, res, next) {
  const session = await sessionStore.get(req.cookies.sid);
  if (!session) return res.status(401).json({error: 'auth_required'});
  const user = await userRepo.findOne({id: session.user_id, tenant_id: session.tenant_id});
  if (!user) return res.status(401).json({error: 'session_invalid'});
  req.auth = {user, session};
  next();
}

// middleware/require_tenant_scope.ts
async function requireTenantScope(req, res, next) {
  await tenantContext.run({tenant_id: req.auth.user.tenant_id}, async () => {
    next();
  });
}
```

---

## 7. Penetration testing plan

```yaml
pentest_scope:
  api:
    - OWASP top 10 (2024)
    - BOLA + BFLA (tenant isolation)
    - business logic flaws (idempotency replay)
  frontend:
    - XSS (CSP compliance)
    - CSRF (state-changing)
  infra:
    - SSH hardening
    - secrets
    - misconfig
  ai:
    - prompt injection (jailbreak)
    - cross-tenant vector contamination
    - PII leak via LLM
  schedule: quarterly
  third_party: required for SOC 2/PDPL
  retest: on every critical fix
```

**In-house weekly**: OWASP ZAP automated + manual triage.

---

## 8. Files

```
src/auth/
├── oidc.ts
├── saml.ts
├── jwt.ts
├── mfa.ts
├── session_store.ts
├── require_auth.ts
├── require_tenant_scope.ts
├── rbac/
│   ├── matrix.yaml
│   ├── enforcer.ts
│   └── golden_access.ts
└── tests/
```

`rbac_audit/`:
- Weekly auto-scan
- Monthly review with Security Officer

---

*Owner: DSL+SA — version 1.0 — 2026-08-01*
