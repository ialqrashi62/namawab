---
name: nm-security-rbac
description: Use when adding authentication (JWT/MFA), authorization (RBAC), or any security feature. Loads the canonical AGENTS.md safety rails (1, 5, 11, 13). Saves ~80% tokens per security module.
---

# Security & RBAC — Token-Saver

## When to use

Any module touches:
- Login / logout / password reset
- MFA enrollment / verification
- Session / JWT creation
- Role-based authorization
- Cross-specialty permission grants
- API key / personal access token

## AGENTS.md safety rails covered

- **RAIL-1** No hardcoded secrets
- **RAIL-5** Tenant isolation stays on
- **RAIL-11** Fail-closed on missing tenant context
- **RAIL-13** Golden Access Rule

## Login (email + password + optional MFA)

```js
// namaweb/routes/auth/login.js
router.post('/login', async (req, res) => {
    const { username, password, mfaCode } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'missing_credentials' });

    const { rows } = await db.query(
        'SELECT id, tenant_id, username, password_hash, role, mfa_secret, mfa_enabled FROM system_users WHERE username = $1',
        [username]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    if (user.mfa_enabled) {
        if (!mfaCode) return res.status(401).json({ error: 'mfa_required' });
        if (!speakeasy.totp.verify({ secret: user.mfa_secret, encoding: 'base32', token: mfaCode })) {
            return res.status(401).json({ error: 'mfa_invalid' });
        }
    }

    req.session.user = { id: user.id, tenantId: user.tenant_id, role: user.role, username: user.username };
    res.json({ ok: true, role: user.role });
});
```

## requireAuth middleware

```js
function requireAuth(req, res, next) {
    if (!req.session?.user) return res.status(401).json({ error: 'unauthenticated' });
    req.userId   = req.session.user.id;
    req.tenantId = req.session.user.tenantId;
    req.userRole = req.session.user.role;
    next();
}
```

## requireTenantScope (fail-closed, RAIL-11)

```js
function requireTenantScope(req, res, next) {
    if (!req.tenantId) {
        logger.error({ route: req.path }, 'missing tenant context');
        return res.status(400).json({ error: 'missing_tenant' });  // FAIL-CLOSED
    }
    // Tenant already in AsyncLocalStorage via tenant_bind
    next();
}
```

## requireRole (RBAC, RAIL-13)

```js
const ROLE_HIERARCHY = {
    owner: ['owner', 'admin', 'doctor', 'nurse', 'lab', 'radiology', 'pharmacy', 'receptionist', 'patient'],
    admin: ['admin', 'doctor', 'nurse', 'lab', 'radiology', 'pharmacy', 'receptionist'],
    doctor: ['doctor', 'nurse'],
    nurse: ['nurse']
};

function requireRole(...allowed) {
    return (req, res, next) => {
        const effective = ROLE_HIERARCHY[req.userRole] || [];
        if (!effective.some(r => allowed.includes(r))) {
            return res.status(403).json({ error: 'forbidden' });
        }
        next();
    };
}

// Examples:
// requireRole('doctor')                  → owner|admin|doctor
// requireRole('doctor', 'nurse')         → owner|admin|doctor|nurse
// requireRole('admin', 'owner')          → only admin/owner
```

## requireSpecialtyAccess (Golden Access Rule)

```js
async function requireSpecialtyAccess(req, res, next) {
    const targetSpecialty = req.params.specialty || req.body.specialty;
    if (req.userRole === 'owner' || req.userRole === 'admin') return next();   // Golden Access

    const { rows } = await db.query(`
        SELECT 1 FROM user_specialties
        WHERE user_id = $1 AND specialty = $2
           OR (grantee_user_id = $1 AND specialty_id = $2 AND expires_at > now())
    `, [req.userId, targetSpecialty]);

    if (rows.length === 0) return res.status(403).json({ error: 'specialty_forbidden' });
    next();
}
```

## MFA enrollment

```js
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

router.post('/mfa/enroll',
    requireAuth, requireTenantScope,
    async (req, res) => {
        const secret = speakeasy.generateSecret({ name: `NamaMedical (${req.session.user.username})` });
        await db.query('UPDATE system_users SET mfa_secret = $1 WHERE id = $2', [secret.base32, req.userId]);
        const qr = await QRCode.toDataURL(secret.otpauth_url);
        res.json({ qr, secret: secret.base32 });
    }
);

router.post('/mfa/verify',
    requireAuth, requireTenantScope,
    async (req, res) => {
        const { token } = req.body;
        const { rows } = await db.query('SELECT mfa_secret FROM system_users WHERE id = $1', [req.userId]);
        const ok = speakeasy.totp.verify({ secret: rows[0].mfa_secret, encoding: 'base32', token });
        if (!ok) return res.status(401).json({ error: 'mfa_invalid' });
        await db.query('UPDATE system_users SET mfa_enabled = true WHERE id = $1', [req.userId]);
        res.json({ ok: true });
    }
);
```

## Password reset (RAIL-1: no secret in commit)

```js
const crypto = require('crypto');

router.post('/password/reset-request', async (req, res) => {
    const { username } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000);   // 30 min

    await db.query(`
        INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
        SELECT id, $1, $2 FROM system_users WHERE username = $3
    `, [hash, expires, username]);

    // Email the token (do not log it)
    await emailService.send({
        to: username, template: 'password-reset',
        vars: { resetUrl: `${process.env.PUBLIC_URL}/reset?token=${token}` }
    });
    res.json({ ok: true });
});
```

## API key / PAT

```js
router.post('/api-keys',
    requireAuth, requireTenantScope, requireRole('owner', 'admin'),
    async (req, res) => {
        const raw = crypto.randomBytes(32).toString('base64url');
        const hash = crypto.createHash('sha256').update(raw).digest('hex');
        await db.query(`
            INSERT INTO api_keys (tenant_id, user_id, name, key_hash, scopes, expires_at)
            VALUES ($1,$2,$3,$4,$5,$6)
        `, [req.tenantId, req.userId, req.body.name, hash, req.body.scopes, req.body.expires_at]);
        res.status(201).json({ key: raw });   // shown once
    }
);

function requireApiKey(...scopes) {
    return async (req, res, next) => {
        const headerKey = req.headers['x-api-key'];
        if (!headerKey) return res.status(401).json({ error: 'api_key_required' });
        const hash = crypto.createHash('sha256').update(headerKey).digest('hex');
        const { rows } = await db.query(`
            SELECT ak.id, ak.tenant_id, ak.scopes, ak.expires_at
            FROM api_keys ak WHERE key_hash = $1 AND expires_at > now()
        `, [hash]);
        if (rows.length === 0) return res.status(401).json({ error: 'api_key_invalid' });
        if (!scopes.every(s => rows[0].scopes.includes(s))) {
            return res.status(403).json({ error: 'scope_forbidden' });
        }
        req.tenantId = rows[0].tenant_id;
        next();
    };
}
```

## Audit log (RAIL-10)

```js
router.post('/audit/log',
    requireAuth, requireTenantScope, requireRole('owner'),
    async (req, res) => {
        const { event_type, target_type, target_id, payload } = req.body;
        const prev_hash = await getLastAuditHash(req.tenantId);
        const current = JSON.stringify({ event_type, target_type, target_id, payload, ts: Date.now() });
        const hash = crypto.createHash('sha256').update(prev_hash + current).digest('hex');
        await db.query(`
            INSERT INTO audit_log (tenant_id, user_id, event_type, target_type, target_id, payload, prev_hash, hash)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `, [req.tenantId, req.userId, event_type, target_type, target_id, payload, prev_hash, hash]);
        res.status(201).json({ ok: true });
    }
);
```

## Token saving

Each auth module from scratch = ~400 lines. With template = ~80 lines unique
(custom policies, custom scopes). ~80% reduction.