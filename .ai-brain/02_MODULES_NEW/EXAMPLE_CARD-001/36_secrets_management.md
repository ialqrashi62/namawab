# 36 — Secrets Management (CARD-001)

> Owner: DSL · Tier 2

## Secret categories

| Category | Examples | Storage |
|----------|----------|---------|
| DB | PG password, PG app password | Vault (prod) / .env (dev) |
| Session | session secret, redis password | Vault / .env |
| Auth | bcrypt salt, MFA issuer | Vault / .env |
| LLM | OpenAI key, Anthropic key, Langfuse keys | Vault / .env |
| NPHIES | client_id, client_secret, private key | Vault / .env |
| SFDA | drug API key | Vault / .env |
| Email | SMTP user/pass | Vault / .env |
| SMS | Twilio / Unifonic key | Vault / .env |
| Object storage | S3 / MinIO keys | Vault / .env |
| TLS | Let's Encrypt certs (mounted, not env) | Filesystem |
| SSH | deploy key | Filesystem (600) |

## Storage tiers

### Local dev

```
.env (gitignored, mode 600, owner=user)
  - Placeholders like __CHANGE_ME__ in .env.example
  - Real values only in .env (not committed)
```

### Staging

```
/opt/nama-medical/.env.staging (mode 600, owner=nama-medical)
  - Encrypted at rest via LUKS
  - Backed up to secure offsite
  - Rotated every 90 days
```

### Production (planned)

```
HashiCorp Vault
  - Per-tenant secrets possible (multi-tenant)
  - Dynamic DB credentials (TTL 24h)
  - Audit log of all access
  - Auto-rotation
```

## Rotation policy

| Secret | Frequency | Owner |
|--------|-----------|-------|
| DB password | 90 days | DSL |
| Session secret | 90 days | DSL |
| LLM API keys | 90 days | DSL |
| NPHIES keys | 180 days | DSL + billing |
| SSH keys | 180 days | DSL |
| TLS certs | auto (Let's Encrypt 90d) | automated |
| Master KEK (DPAPI) | 365 days | DSL + Owner |

## .env.example (template)

```bash
# .env.example — placeholders only
NODE_ENV=development
PORT=3000

# Database
PGHOST=__CHANGE_ME__
PGPORT=5432
PGDATABASE=__CHANGE_ME__
PGUSER=nama_medical_app
PGPASSWORD=__CHANGE_ME__

# Session
SESSION_SECRET=__CHANGE_ME__
REDIS_URL=__CHANGE_ME__

# LLM
OPENAI_API_KEY=__CHANGE_ME__
ANTHROPIC_API_KEY=__CHANGE_ME__
LANGFUSE_PUBLIC_KEY=__CHANGE_ME__
LANGFUSE_SECRET_KEY=__CHANGE_ME__

# NPHIES
NPHIES_BASE_URL=__CHANGE_ME__
NPHIES_CLIENT_ID=__CHANGE_ME__
NPHIES_CLIENT_SECRET=__CHANGE_ME__
NPHIES_PRIVATE_KEY_PATH=__CHANGE_ME__

# Email
SMTP_HOST=__CHANGE_ME__
SMTP_USER=__CHANGE_ME__
SMTP_PASS=__CHANGE_ME__

# Object storage
S3_ENDPOINT=__CHANGE_ME__
S3_ACCESS_KEY=__CHANGE_ME__
S3_SECRET_KEY=__CHANGE_ME__
S3_BUCKET=__CHANGE_ME__
```

## Rules

- NO secrets in code, comments, commits, fixtures, tests
- NO real keys in `.env.example` (placeholders only)
- NO secrets in console.log, error messages, audit logs
- NO secrets in LLM prompts (PHI redaction includes secrets)
- All env files: mode 600, owner=user
- All env files: gitignored
- All secrets: rotated on incident, on role change, on schedule
- All access: logged (Vault or shell history audit)

## Audit

- Quarterly: review all env files for leaked secrets
- Quarterly: review .gitignore coverage
- On-commit: git-secrets pre-commit hook (planned)
- CI: scan for hardcoded patterns
