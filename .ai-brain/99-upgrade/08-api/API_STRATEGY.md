---
id: API-STRATEGY
version: 1.0
date: 2026-08-01
owner: SA
status: ACTIVE
---

# API — OpenAPI 3.1 + SMART on FHIR + Versioning + Rate Limiting

> **Purpose:** One unified API surface for internal + external consumers. Standardized schemas, OAuth2 with SMART on FHIR scopes, versioning, and tenant-aware rate limits.

---

## 1. Global systems comparison

| System | API surface |
|--------|--------------|
| **Epic** | FHIR R4 mandatory + SMART on FHIR + App Orchard (marketplace) |
| **Cerner** | HL7 + FHIR + proprietary MPages API |
| **athena** | REST + GraphQL developer portal |
| **MEDITECH** | REST FHIR + NAPL |
| **1upHealth, Smile CDR** | Pure FHIR R4 |
| **NamaMedical** | **OpenAPI 3.1 unified spec + SMART on FHIR + tenant-aware rate limits** |

---

## 2. OpenAPI 3.1 unified spec

`openapi.yaml` is the canonical machine-readable contract.

```yaml
openapi: 3.1.0
info:
  title: NamaMedical ERP API
  version: 4.2.0
  description: Hospital Enterprise Platform — production
servers:
  - url: https://jumanasoft.com/api/v4
  - url: https://staging.jumanasoft.com/api/v4
security:
  - BearerAuth: []
  - OAuth2_FHIR:
      - launch/patient
      - patient/Patient.read
      - patient/Observation.read
paths:
  /patients/{id}:
    get:
      operationId: getPatient
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200': { content: { application/json: { schema: { $ref: '#/components/schemas/Patient' } } } }
        '404': ...
  # + 600 paths total
components:
  securitySchemes:
    BearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
    OAuth2_FHIR:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://jumanasoft.com/oauth2/authorize
          tokenUrl: https://jumanasoft.com/oauth2/token
          refreshUrl: https://jumanasoft.com/oauth2/refresh
          scopes:
            launch/patient: Patient context launch
            patient/Patient.read: Read patient
            patient/Observation.read: Read observations
            # + scope per FHIR resource × per role
```

**Tool**: `swagger-cli bundle openapi.yaml -t -o dist/openapi.yaml`

**Live**: served at `https://jumanasoft.com/api/docs` (Swagger UI)

---

## 3. SMART on FHIR launch

```ts
// src/oauth2/smart_launch.ts
// 1. EHR launches app
//    GET /oauth2/authorize?response_type=code&client_id=...&redirect_uri=...
//       &launch=patient-pkce-token&scope=launch/patient patient/Patient.read
// 2. User authenticates (existing or new SAML/MFA)
// 3. Consent screen (PDPL)
// 4. Issue 1-time code, redirect to client
// 5. Client exchanges code for tokens
// 6. Client uses bearer for FHIR calls
```

**Scopes matrix** (`RBAC_MATRIX.yaml`):
```yaml
scopes:
  # Provider
  provider.standard:
    - launch/patient
    - patient/Patient.read
    - patient/Observation.read
    - patient/MedicationRequest.read
  provider.senior:
    - patient/MedicationRequest.write
  # Patient
  patient.self:
    - launch/patient
    - patient/Patient.read
    - patient/Observation.$export
  patient.guardian:
    - patient/Patient.read         # for minor
  # Admin
  admin.tenant:
    - tenant/admin.read
  admin.system:
    - system/Patient.read
    - system/*.*
```

---

## 4. Versioning policy

- **Stable**: `/api/v4/` is current. Backward compatibility 12 months.
- **Beta**: `/api/v4/beta/...` for new features. May break.
- **Internal**: `/api/_internal/...` (not for external).
- **Deprecated**: deprecated version stays live for 12 months with `Sunset: <date>` header + `Deprecation: true`.

**Version bump**:
- Major: breaking changes
- Minor: backward-compatible new endpoints
- Patch: bug fixes

**Header**: `X-API-Version: 4.2.0` returned on every response.

---

## 5. Rate limiting + quota

```ts
// src/middleware/rate_limit.ts
export function rateLimit(opts: RateLimitOpts) {
  // Token bucket per (tenant_id, route, role)
  return async (req, res, next) => {
    const key = `${req.tenant.id}:${req.route.id}:${req.userRole}`;
    const limit = await quotaStore.get(key);
    if (limit.remaining <= 0) return res.status(429).json({error: 'quota_exceeded', retry_after: limit.resetMs});
    limit.remaining -= 1;
    await quotaStore.set(key, limit);
    res.setHeader('X-RateLimit-Limit', limit.total);
    res.setHeader('X-RateLimit-Remaining', limit.remaining);
    next();
  };
}
```

**Quotas** (configurable per tenant):

| Role | Default / hour | Default / day | Burst |
|------|---------------|--------------|-------|
| Doctor | 5000 | 50000 | 100 |
| Nurse | 3000 | 30000 | 60 |
| Patient self-service | 1000 | 10000 | 30 |
| Admin | 20000 | 200000 | 200 |
| External FHIR client | 1000 | 10000 | 30 |

---

## 6. Idempotency

```ts
// Each POST/PUT for money or state changes requires:
Header: Idempotency-Key: <uuid>
```

Server caches for 24h. Replay returns same response. Already required on money routes (GATE 7).

---

## 7. Standard headers

```
Request:
- Authorization: Bearer <jwt>
- Idempotency-Key: <uuid>      (for mutating requests)
- X-Tenant-Id: <uuid>          (defense-in-depth)
- X-Correlation-Id: <uuid>
- Accept-Language: ar-SA|en-US

Response:
- X-API-Version: 4.2.0
- X-RateLimit-*: ...
- X-Request-Id: ...
- Strict-Transport-Security: ...
- Content-Security-Policy: report-only (per safety rail 8)
```

---

## 8. Files

```
api/
├── openapi.yaml          # master spec
├── openapi.beta.yaml     # beta additions
├── docs/                 # generated HTML
├── bundles/
│   ├── path/             # per-resource paths
│   └── schema/           # JSON schemas
└── tests/
    ├── contract/         # Pact
    ├── smoke/
    └── security/         # OWASP + custom
```

---

## 9. Tests

- Contract (Pact)
- Schema validation (ajv)
- OWASP API top 10 (ZAP)
- Rate limit overflow
- Idempotency replay
- Tenant isolation

---

*Owner: SA — version 1.0 — 2026-08-01*
