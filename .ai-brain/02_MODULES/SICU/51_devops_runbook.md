# DevOps Runbook — Sicu (SICU)
**Last updated:** 2026-08-10

## Deployment

### Pipeline

```
GitHub Actions:
  1. Lint (eslint + prettier)
  2. Unit tests (jest)
  3. Integration tests (supertest)
  4. Guard tests (boundary)
  5. BDD tests (cucumber)
  6. Migration check (forward + backward)
  7. Docker build
  8. Push to ghcr.io
  9. Deploy to Hetzner staging
  10. Smoke tests
  11. Manual approval
  12. Deploy to production
  13. Notify (Slack + PagerDuty)
```

### Rollback plan

| Issue | Action |
|---|---|
| App broken | `pm2 restart nama-medical-erp --update-env` (no code change) |
| Code broken | `git revert` + redeploy |
| Migration broken | run *_down.sql + restart |
| DB broken | restore from backup (last good backup) |
| Region down | failover to secondary region |

### Backup

- Daily pg_dump → S3 (encrypted)
- Weekly full + daily incremental
- Retention: 7d daily, 4w weekly, 12m monthly
- Restore test: monthly

### Monitoring (per dept)

- Latency p95 < 200ms
- Error rate < 0.1%
- RPS matches expected (alert if 10x or 0.1x)
- DB query p95 < 100ms
- Cache hit rate > 80%

### Alerts

| Severity | Channel |
|---|---|
| P1 | PagerDuty + SMS + Slack |
| P2 | Slack + email |
| P3 | email |
| P4 | log only |

### Sicu-specific runbook

- How to restart just the Sicu engine: `pm2 restart nama-medical-erp --name=sicu`
- How to scale Sicu: edit `pm2.config.js` → `sicu: instances=4`
- How to clear Sicu cache: `redis-cli -n 1 FLUSHDB`
- How to replay Sicu audit log: `node scripts/replay_audit.js --dept=SICU`

### Secrets rotation

- DB password: every 90d
- API keys: every 180d
- JWT signing key: every 365d
- Crypto envelope KEK: every 730d (with re-encryption of all PHI)
