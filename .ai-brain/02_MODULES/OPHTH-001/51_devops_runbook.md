# DevOps Runbook — Ophth-001 (OPHTH-001)
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

### Ophth-001-specific runbook

- How to restart just the Ophth-001 engine: `pm2 restart nama-medical-erp --name=ophth_001`
- How to scale Ophth-001: edit `pm2.config.js` → `ophth_001: instances=4`
- How to clear Ophth-001 cache: `redis-cli -n 1 FLUSHDB`
- How to replay Ophth-001 audit log: `node scripts/replay_audit.js --dept=OPHTH-001`

### Secrets rotation

- DB password: every 90d
- API keys: every 180d
- JWT signing key: every 365d
- Crypto envelope KEK: every 730d (with re-encryption of all PHI)
