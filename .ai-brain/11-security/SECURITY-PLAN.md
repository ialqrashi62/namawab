# Security Plan — NamaMedical ERP
# Filepath: .ai-brain/11-security/SECURITY-PLAN.md
# Generated: 2026-08-08

# Security Plan — Master v5

> **Standards:** OWASP Top 10 + HIPAA + PDPL + CBAHI
> **Layers:** Network + Application + Database + AI + Audit
> **Review Cycle:** Quarterly

---

## 1. Defense in Depth (7 Layers)

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Network (Hetzner firewall, fail2ban)        │
├─────────────────────────────────────────────────────┤
│ Layer 2: Reverse Proxy (Nginx + rate limit + CSP)    │
├─────────────────────────────────────────────────────┤
│ Layer 3: Application (Helmet + CORS + validation)    │
├─────────────────────────────────────────────────────┤
│ Layer 4: Authentication (JWT + MFA + session)       │
├─────────────────────────────────────────────────────┤
│ Layer 5: Authorization (RBAC + tenant scope)        │
├─────────────────────────────────────────────────────┤
│ Layer 6: Database (RLS + encryption + audit)         │
├─────────────────────────────────────────────────────┤
│ Layer 7: AI Safety (RAGAS + guardrails + human-in-loop) │
└─────────────────────────────────────────────────────┘
```

---

## 2. Authentication

### 2.1 Multi-Factor (MFA)
- **TOTP** (Google Authenticator, Authy)
- **SMS** (fallback)
- **Backup codes** (10 one-time codes)
- **Mandatory for:** Owner, Admin, Doctor, Pharmacist
- **Optional for:** Nurse, Tech (recommended)

### 2.2 JWT

```javascript
// filepath: namaweb/auth/jwt_handler.js
const jwt = require('jsonwebtoken');

function sign(payload, expiresIn = '1h') {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn,
    issuer: 'nama-medical',
    audience: 'nama-medical-users',
  });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'nama-medical',
    audience: 'nama-medical-users',
  });
}

module.exports = { sign, verify };
```

### 2.3 Session Management
- Redis-backed session store (express-session)
- 24h session lifetime
- Idle timeout: 30 minutes
- Absolute timeout: 8 hours

### 2.4 Password Policy
- Minimum 12 characters
- Must contain: upper, lower, digit, special
- bcrypt cost factor: 12
- No password reuse (last 5 passwords)
- Forced rotation: every 90 days (admin only)

---

## 3. Authorization (RBAC)

### 3.1 Roles (Global)

| Role | Permissions |
|---|---|
| `owner` | All (super-admin) |
| `admin` | Manage users, settings, tenant |
| `doctor` | Clinical per RBAC scope |
| `nurse` | Limited clinical |
| `pharmacist` | Pharmacy + drug checks |
| `lab_tech` | Lab orders + results |
| `rad_tech` | Imaging orders + results |
| `biller` | Billing + coding |
| `insurance` | Claims + NPHIES |
| `quality` | Quality + safety reports |
| `viewer` | Read-only |

### 3.2 Specialty-Based Access (Golden Access Rule)

Each clinical user has:
- `primary_specialty`: main dept (e.g., `cardiology`)
- `secondary_specialties`: array of allowed secondary depts (e.g., `['emergency']`)

```javascript
// filepath: namaweb/middleware/rbac_guards.js
const SPECIALTY_ACCESS = {
  owner: '*', // all depts
  admin: '*', // all depts
  doctor: 'specialty_scoped', // own + explicitly granted
  nurse: 'specialty_scoped',
  pharmacist: ['pharmacy'],
  lab_tech: ['lab'],
  rad_tech: ['radiology'],
  biller: ['billing'],
  insurance: ['insurance'],
  quality: ['quality'],
  viewer: 'specialty_scoped_readonly',
};

function hasAccess(user, dept) {
  if (user.role === 'owner' || user.role === 'admin') return true;
  if (SPECIALTY_ACCESS[user.role] === '*') return true;
  if (user.primary_specialty === dept) return true;
  if (user.secondary_specialties && user.secondary_specialties.includes(dept)) return true;
  return false;
}

module.exports = { hasAccess };
```

---

## 4. Tenant Isolation (RLS)

### 4.1 FORCE_RLS on Every Table

```sql
-- Pattern for every new table
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {table} FORCE ROW LEVEL SECURITY;
CREATE POLICY {table}_tenant_iso ON {table}
  USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT);
```

### 4.2 requireTenantScope Middleware

```javascript
// filepath: namaweb/middleware/tenant_scope.js
function requireTenantScope(req, res, next) {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) {
    return res.status(400).json({ ok: false, error: 'Missing tenant header' });
  }
  const tenantIdNum = parseInt(tenantId, 10);
  if (isNaN(tenantIdNum) || tenantIdNum <= 0) {
    return res.status(400).json({ ok: false, error: 'Invalid tenant header' });
  }
  if (req.user && req.user.tenant_id !== tenantIdNum) {
    return res.status(403).json({ ok: false, error: 'Cross-tenant access denied' });
  }
  req.tenantId = tenantIdNum;
  next();
}

module.exports = { requireTenantScope };
```

---

## 5. Encryption

### 5.1 At Rest
- **PHI blobs:** `crypto_envelope.js` (DPAPI KEK + per-row DEK)
- **Database backups:** AES-256-GCM
- **PHI columns:** Application-level encryption before INSERT

### 5.2 In Transit
- **TLS 1.2+** enforced (no TLS 1.0/1.1)
- **HSTS** enabled (max-age 1 year, includeSubDomains)
- **Certificate:** Let's Encrypt auto-renewal

---

## 6. Audit Logging

### 6.1 Hash-Chained

```javascript
// filepath: namaweb/audit_middleware.js
const crypto = require('crypto');

class AuditChain {
  constructor(pool) {
    this.pool = pool;
  }

  async log(tenantId, actorId, action, entity, entityId, payload) {
    const client = await this.pool.connect();
    try {
      await client.query("SET LOCAL app.tenant_id = $1", [tenantId]);
      // Get prev_hash
      const prev = await client.query(
        `SELECT curr_hash FROM audit_log WHERE tenant_id = $1 ORDER BY id DESC LIMIT 1`,
        [tenantId]
      );
      const prevHash = prev.rows[0]?.curr_hash || 'GENESIS';
      const payloadStr = JSON.stringify(payload);
      const currHash = crypto.createHash('sha256')
        .update(prevHash + actorId + action + entity + entityId + payloadStr)
        .digest('hex');
      await client.query(
        `INSERT INTO audit_log (tenant_id, actor_id, action, entity, entity_id, prev_hash, curr_hash, payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [tenantId, actorId, action, entity, entityId, prevHash, currHash, payloadStr]
      );
    } finally {
      client.release();
    }
  }

  async verify(tenantId) {
    const result = await this.pool.query(
      `SELECT id, prev_hash, curr_hash FROM audit_log WHERE tenant_id = $1 ORDER BY id ASC`,
      [tenantId]
    );
    let prevHash = 'GENESIS';
    for (const row of result.rows) {
      if (row.prev_hash !== prevHash) return false;
      prevHash = row.curr_hash;
    }
    return true;
  }
}
```

### 6.2 Retention
- **7+ years** (PDPL + HIPAA)
- Daily backup to S3 (cold storage after 1 year)

---

## 7. Input Validation

### 7.1 Fail-Closed Validation

```javascript
// filepath: namaweb/validation.js
function validateBody(schema) {
  return (req, res, next) => {
    const { valid, errors } = schema.validate(req.body);
    if (!valid) {
      return res.status(400).json({
        ok: false,
        error: 'Validation failed',
        details: errors,
      });
    }
    req.body = valid;
    next();
  };
}
```

### 7.2 SQL Injection Prevention
- **All queries parameterized** (pg library)
- No string concatenation in SQL
- ORM (SQLAlchemy in Python, none in Node — direct pg)

### 7.3 XSS Prevention
- `escapeHTML` on all user content
- CSP report-only by default
- `SafeHtml` React component

---

## 8. Rate Limiting

```javascript
// filepath: namaweb/middleware/rate_limit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 req/min
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Rate limit exceeded' },
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 10 req/min for sensitive
  message: { ok: false, error: 'Strict rate limit' },
});
```

Applied to:
- `/api/auth/login` → strict
- `/api/*/ai/*` → standard
- `/api/finance/*` → strict
- All others → standard

---

## 9. Money Route Idempotency

```javascript
// filepath: namaweb/middleware/idempotency.js
const idempotencyCache = new Map();

function idempotencyGuard(req, res, next) {
  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const cached = idempotencyCache.get(key);
  if (cached) {
    if (cached.expiresAt < Date.now()) {
      idempotencyCache.delete(key);
    } else {
      return res.status(cached.status).json(cached.body);
    }
  }

  // Override res.json to cache
  const origJson = res.json.bind(res);
  res.json = (body) => {
    idempotencyCache.set(key, {
      status: res.statusCode,
      body,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return origJson(body);
  };

  next();
}
```

Applied to: `/api/billing/*`, `/api/insurance/*`, `/api/finance/*`, `/api/pharmacy/dispense`

---

## 10. Incident Response

### 10.1 Severity Levels

| Severity | Definition | Response Time |
|---|---|---|
| **P0** | Active breach, PHI leak | 15 min |
| **P1** | Vulnerability discovered, not exploited | 4 hours |
| **P2** | Suspicious activity, investigation | 24 hours |
| **P3** | Minor issue, scheduled fix | 7 days |

### 10.2 Runbook

1. **Detect** — Alert from SIEM, log analysis, or user report
2. **Contain** — Disable affected account, block IP, kill session
3. **Eradicate** — Patch vulnerability, remove malicious code
4. **Recover** — Restore from backup if needed, verify integrity
5. **Notify** — PDPL within 72 hours, customers within 24 hours
6. **Post-mortem** — RCA + preventive measures

---

## 11. Compliance Audit Schedule

| Audit | Frequency | Owner |
|---|---|---|
| Internal security review | Quarterly | Security team |
| External pentest | Annually | Vendor |
| PDPL audit | Annually | Legal + DPO |
| HIPAA gap analysis | Annually | Compliance |
| CBAHI prep | Pre-survey | Quality team |
| SFDA review | On-demand | Pharmacy |
| NPHIES certification | Pre-launch | Insurance team |

---

**Generated:** 2026-08-08 · **Owner:** Security Team
