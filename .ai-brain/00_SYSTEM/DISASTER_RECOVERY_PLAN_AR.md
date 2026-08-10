# خطة استعادة الكوارث (DR Plan) — NamaMedical
**التاريخ:** 2026-08-10 · **الإصدار:** v3.0 · **RTO:** 4h · **RPO:** 15min

---

## 1. نظرة عامة

| الخاصية | القيمة |
|---|---|
| **RTO** (Recovery Time Objective) | 4 ساعات |
| **RPO** (Recovery Point Objective) | 15 دقيقة |
| **MTTR** (Mean Time To Recover) | 2 ساعة |
| **البيئة** | Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74) |
| **منطقة ثانوية** | Hetzner `nbg1-dc3` (نفس region، منفصل كهرباء وشبكة) |
| **DB primary** | PostgreSQL 14 |
| **DB replica** | Streaming replication، async |

---

## 2. سيناريوهات الكوارث

| السيناريو | الاحتمال | الأثر | الأولوية |
|---|---|---|---|
| تعطل السيرفر (HW/SW) | متوسط | عالي | P1 |
| تعطل DB (data corruption) | منخفض | عالي جداً | P1 |
| تعطل region كامل | منخفض جداً | كارثي | P0 |
| اختراق أمني (ransomware) | منخفض | كارثي | P0 |
| فقدان بيانات بسبب bug | متوسط | عالي | P1 |
| DDoS | متوسط | متوسط | P2 |

---

## 3. استراتيجية الاستعادة

### 3.1 DB recovery

```bash
# Daily backup (encrypted)
pg_dump --format=custom --compress=9 \
  --file=/backup/nama_$(date +%Y%m%d).dump \
  $DATABASE_URL

# Push to S3 (eu-central-1, AES-256)
aws s3 cp /backup/nama_*.dump \
  s3://nama-medical-backups/daily/ \
  --sse AES256

# Retention
# - daily: 7 days
# - weekly: 4 weeks
# - monthly: 12 months
# - yearly: 7 years (PDPL)
```

### 3.2 Application recovery

```bash
# Restore from Docker image
docker pull ghcr.io/jumanasoft/nama-medical-erp:latest
docker run -d --name nama-medical-erp \
  -p 3000:3000 \
  --env-file .env \
  -v /var/nama-uploads:/app/uploads \
  ghcr.io/jumanasoft/nama-medical-erp:latest

# Verify
curl http://localhost:3000/health
```

### 3.3 Failover DB

```bash
# Promote replica to primary
ssh replica "pg_ctl promote -D /var/lib/postgresql/14/main"

# Update app config
export DATABASE_URL="postgres://nama:***@replica:5432/nama_medical"
pm2 restart nama-medical-erp --update-env
```

---

## 4. النسخ الاحتياطي

| النوع | التردد | الموقع | الاستعادة |
|---|---|---|---|
| Full DB | أسبوعياً | S3 + Glacier | restore_db.sh |
| Incremental DB | يومياً | S3 | pg_restore |
| WAL archive | كل 5 دقائق | S3 | PITR |
| App code | كل commit | GitHub | git checkout |
| PHI blobs | يومياً | phi_vault/ + S3 | crypto_envelope |
| DICOM | يومياً | phi_vault/ + S3 | Orthanc restore |
| Audit log | كل ساعة | audit_log table | replay_audit.js |

---

## 5. خطة الاستعادة خطوة بخطوة

### P1: Server down (single instance)

1. **0-15min:** PM2 auto-restart (max 3 attempts)
2. **15-30min:** SSH + restart manually
3. **30-60min:** Rebuild VM from snapshot
4. **60-120min:** Restore from latest backup
5. **120-240min:** Full verification

### P0: Region down

1. **0-15min:** DNS failover to secondary region (Route53 health check)
2. **15-60min:** Promote replica DB in secondary
3. **60-180min:** Restore from S3 backup
4. **180-240min:** Verify + restore operations

### P0: Ransomware

1. **0-30min:** Isolate all systems (network policy)
2. **30-60min:** Notify SOC + insurer
3. **60-240min:** Rebuild from clean backup (NOT infected backup)
4. **240-480min:** Reset all credentials + re-issue MFA
5. **480-720min:** Restore service + forensics

---

## 6. اختبار الاستعادة (DR drill)

| النوع | التردد | المدة | المالك |
|---|---|---|---|
| Backup restore (test env) | شهرياً | 2h | DevOps |
| Failover drill (staging) | ربع سنوي | 4h | DevOps + DBA |
| Region failover (game day) | سنوياً | 8h | كل الفريق |
| Tabletop exercise | نصف سنوي | 4h | القيادة |

---

## 7. الاتصالات في الكوارث

| الجمهور | القناة | الرسالة |
|---|---|---|
| الفريق | Slack `#incident` | real-time |
| الإدارة | SMS + email | every 30min |
| العملاء | email + status page | every 1h |
| المرضى | in-app banner | only if data loss |
| الإعلام | press release | only if major |

**Status page:** status.jumanasoft.com (UpptimeRobot)

---

## 8. Post-Mortem

كل حادث P0/P1 يحتاج post-mortem خلال 5 أيام عمل:
- Timeline
- Root cause (5 whys)
- Action items (with owner + due date)
- Prevention plan

محفوظ في `.ai-brain/incidents/YYYY-MM-DD_*_AR.md`

---

## 9. Compliance

- **PDPL:** نسخ احتياطية مشفّرة، استعادة خلال 30 يوم
- **HIPAA:** contingency plan (§164.308)
- **CBAHI:** disaster plan + yearly drill (§PRH)
- **NPHIES:** service availability ≥ 99.5%

---

## 10. الملاك

| الدور | الاسم | المسؤول |
|---|---|---|
| DR Owner | DevOps Lead | الخطة + drills |
| DB Owner | DBA | النسخ الاحتياطية + PITR |
| Sec Owner | CISO | ransomware + isolation |
| Comms Owner | CMO/CCO | العملاء + الإعلام |
| Exec Sponsor | CEO | القرارات الكبرى |
