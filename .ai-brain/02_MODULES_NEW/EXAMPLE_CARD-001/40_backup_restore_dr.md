# 40 — Backup / Restore / DR (CARD-001)

> Owner: DSL · Tier 2

## Backup strategy

### Schedule

| Backup | Frequency | Retention | Storage |
|--------|-----------|-----------|---------|
| Full DB | Daily 02:00 KSA | 30 days rolling + 7 years monthly | Encrypted S3 |
| Incremental WAL | Continuous | 7 days | Encrypted S3 |
| Pre-deploy | Per deploy | 30 days | Local + S3 |
| Application files | Daily 03:00 KSA | 30 days | Encrypted S3 |
| LLM traces | Daily 04:00 KSA | 1 year | Encrypted S3 |
| Audit log | Daily + immediate for CRITICAL | 7+ years | Encrypted S3 (immutable) |

### Encryption

- AES-256 at rest
- Server-side encryption (S3 SSE-S3)
- Per-tenant encryption key (multi-tenant)
- Key rotation annually

### Verification

- Daily: backup size sanity check
- Weekly: restore drill (in isolated DB)
- Monthly: full restore to isolated DB + smoke tests
- Quarterly: DR drill (full region failover)

## Restore procedures

### Single-table restore

```bash
# 1. Find backup
ls /opt/nama-medical/backups/daily/ | tail -1

# 2. Extract single table
pg_restore -U nama_medical_app -d nama_medical_restore --table=cardio_cath /opt/nama-medical/backups/daily/<ts>.dump

# 3. Copy back
pg_dump -U nama_medical_app -d nama_medical_restore --table=cardio_cath | psql -U nama_medical_app -d nama_medical_web
```

### Full DB restore

```bash
# 1. Stop app
pm2 stop nama-medical-erp

# 2. Drop + recreate DB (after owner approval)
sudo -u postgres dropdb nama_medical_web
sudo -u postgres createdb nama_medical_web -O nama_medical_app

# 3. Restore from backup
pg_restore -U nama_medical_app -d nama_medical_web /opt/nama-medical/backups/daily/<ts>.dump

# 4. Run migrations
PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -f migrations/all_up.sql

# 5. Verify
node e2e_local_smoke_test.js

# 6. Restart
pm2 reload nama-medical-erp
```

### Per-tenant restore

```bash
# 1. Create restore DB
sudo -u postgres createdb nama_medical_restore -O nama_medical_app

# 2. Restore full backup
pg_restore -U nama_medical_app -d nama_medical_restore /opt/nama-medical/backups/daily/<ts>.dump

# 3. Dump per-tenant subset
pg_dump -U nama_medical_app -d nama_medical_restore \
  --table='cardio_*' \
  --table='patients' \
  --table='encounters' \
  --where='tenant_id = <uuid>' \
  | psql -U nama_medical_app -d nama_medical_web
```

## Disaster Recovery

### RTO / RPO

- **RTO:** 4 hours (cardiology is critical)
- **RPO:** 1 hour (max data loss acceptable)

### DR site

- Primary: Hetzner 204.168.144.74 (jumanasoft.com)
- DR: TBD (secondary region)
- Replication: streaming WAL + 5 min lag target

### DR scenarios

| Scenario | Detection | RTO | Action |
|----------|-----------|-----|--------|
| Server crash | monitoring | 30 min | pm2 restart → if fail, redeploy from git |
| DB corruption | monitoring | 2h | restore from latest backup + WAL |
| Region down | monitoring | 4h | DR region failover |
| Accidental DROP | owner report | 1h | restore from pre-deploy backup |
| Ransomware | owner report | 4h | restore from offsite backup + rotate all secrets |
| Data corruption | owner report | 4h | per-table restore from backup |

### Failover procedure

```bash
# 1. Verify DR site is up
ssh dr.nama-medical

# 2. Stop writes on primary (if reachable)
ssh primary.nama-medical "pm2 stop nama-medical-erp"

# 3. Promote DR to primary
ssh dr.nama-medical "pm2 reload nama-medical-erp"

# 4. Update DNS
# (manual or automated via cloudflare API)

# 5. Smoke test
./scripts/smoke_test.sh https://jumanasoft.com

# 6. Notify owner + users
```

## Pre-deploy backup (mandatory)

```bash
# Always run before any migration or major deploy
cd /opt/nama-medical
./ops/live_deploy/backup_db.sh
ls -lh backups/$(date +%Y%m%d_%H%M%S).dump
```

## Backup file location

- Local: `/opt/nama-medical/backups/`
- Offsite: `s3://nama-medical-backups-encrypted/`
- Mode: 600
- Owner: nama-medical

## Offsite transfer

```bash
# Daily
rclone sync /opt/nama-medical/backups/ s3-encrypted:nama-medical-backups-encrypted/ \
  --s3-server-side-encryption aws:kms \
  --s3-kms-key-id <key-id> \
  --transfers 4
```

## Monitoring

- Backup success/fail: alert within 1h
- Backup size anomaly: alert (could indicate issue)
- Offsite sync: alert on failure
- Restore drill: monthly report
- DR drill: quarterly report
