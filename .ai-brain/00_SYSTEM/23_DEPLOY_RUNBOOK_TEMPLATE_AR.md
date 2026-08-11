# {{DEPT_NAME_AR}} — Deployment Runbook
## NamaMedical Department

> **القسم:** `{{DEPT_SLUG}}`
> **التاريخ:** {{DATE}}
> **المالك:** {{OWNER}}
> **المراجِع:** DevOps

---

## 1. نظرة عامة على النشر

| Item | Value |
|---|---|
| **Stack** | Node 20 + Express + PostgreSQL 16 + Redis |
| **Server** | Hetzner CPX21 (4GB, 2 vCPU) — app |
| **Storage** | Hetzner Storage Box (1 TB) — backups |
| **CDN** | Cloudflare |
| **Process Manager** | PM2 (`nama-medical-erp`) |
| **Reverse Proxy** | Nginx |
| **TLS** | Let's Encrypt (auto-renew) |
| **DNS** | Cloudflare |
| **Live URL** | https://jumanasoft.com |

---

## 2. Pre-Deploy Checklist

- [ ] **PD-1** كل الـ tests خضراء (Vitest, Playwright, k6)
- [ ] **PD-2** Coverage ≥ 80%
- [ ] **PD-3** OpenAPI spec محدّث
- [ ] **PD-4** i18n keys مضافة (4 locales)
- [ ] **PD-5** Migrations جاهزة (up + down + test)
- [ ] **PD-6** RBAC policies مكتوبة ومختبرة
- [ ] **PD-7** Audit instrumentation موجود
- [ ] **PD-8** لا secrets في الكود
- [ ] **PD-9** لا PHI في commits (pre-commit)
- [ ] **PD-10** CHANGELOG محدّث
- [ ] **PD-11** PR مراجع (2 approvers)
- [ ] **PD-12** Branch protection rules pass
- [ ] **PD-13** Dependencies لا ثغرات (npm audit)
- [ ] **PD-14** Performance budget محقق (p95 < 200ms)
- [ ] **PD-15** Security scan نظيف (OWASP ZAP, Snyk)

---

## 3. خطوات النشر (10 خطوات)

### 3.1 الخطوة 1: استنساخ والبناء

```bash
ssh root@46.4.188.170
cd /www/wwwroot/namainvist.com
git fetch --all --prune
git checkout main
git pull --rebase origin main
npm ci --production
npm run build
```

**تأكيد:** `git status` نظيف، `npm run build` بدون أخطاء.

---

### 3.2 الخطوة 2: تشغيل الـ tests (smoke)

```bash
npm run test:smoke
```

**تأكيد:** جميع الاختبارات خضراء.

---

### 3.3 الخطوة 3: تطبيق الـ Migrations

```bash
# Backup DB أولاً
ssh root@46.4.188.170 "pg_dump -U nama nama_medical_prod > /var/backups/nama_pre_deploy_$(date +%Y%m%d_%H%M%S).sql"

# Apply migrations
NODE_ENV=production node migrate.js up
```

**تأكيد:** كل migration applied بدون أخطاء.

**في حالة الفشل:** `node migrate.js down` للعودة للحالة السابقة.

---

### 3.4 الخطوة 4: بناء الـ Frontend

```bash
cd public
npm ci
npm run build:prod
cd ..
```

**تأكيد:** `dist/` موجود بـ bundle محسّن.

---

### 3.5 الخطوة 5: تشغيل الـ Seeders (إذا لزم)

```bash
# فقط للـ seeders الجديدة (idempotent)
node seeds/run.js
```

**تأكيد:** لا أخطاء.

---

### 3.6 الخطوة 6: Reload PM2

```bash
ssh root@46.4.188.170 "pm2 reload nama-medical-erp --update-env"
```

**تأكيد:** Process restarted, memory stable, no errors in logs.

---

### 3.7 الخطوة 7: Reload Nginx

```bash
ssh root@46.4.188.170 "nginx -t && nginx -s reload"
```

**تأكيد:** Nginx config نظيف، reload ناجح.

---

### 3.8 الخطوة 8: Cloudflare Purge (إذا لزم)

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything": true}'
```

---

### 3.9 الخطوة 9: Smoke Test على Production

```bash
# Health
curl -sI https://jumanasoft.com/api/health | head -1
# expect: HTTP/2 200

# API check (per dept)
curl -sI https://jumanasoft.com/api/{{DEPT_SLUG}}/health | head -1
# expect: HTTP/2 200

# Frontend
curl -sI https://jumanasoft.com/{{DEPT_SLUG}} | head -1
# expect: HTTP/2 200
```

**تأكيد:** جميع الـ endpoints تستجيب بـ 200.

---

### 3.10 الخطوة 10: المراقبة (post-deploy)

```bash
# Tail logs
ssh root@46.4.188.170 "pm2 logs nama-medical-erp --lines 100 --nostream"

# Check metrics
open https://grafana.namamedical.sa/d/nama-medical-erp
```

**المراقبة لمدة 30 دقيقة بعد النشر:**
- Error rate < 0.1%
- p95 latency < 200ms
- لا تنبيهات P0/P1
- لا ارتفاع غير طبيعي في CPU/memory

---

## 4. Blue-Green Deployment (zero-downtime)

```bash
# 1. نشر النسخة الجديدة على port 3001
PORT=3001 NODE_ENV=production node server.js &

# 2. انتظر حتى تكون healthy
until curl -sf http://localhost:3001/api/health; do sleep 1; done

# 3. Switch Nginx إلى النسخة الجديدة
ssh root@46.4.188.170 "sed -i 's/localhost:3000/localhost:3001/' /etc/nginx/conf.d/namainvist.com.conf"
ssh root@46.4.188.170 "nginx -s reload"

# 4. إيقاف النسخة القديمة بعد 60s
sleep 60
pkill -f "PORT=3000"
```

**في حالة الفشل:**
```bash
# 1. إيقاف النسخة الجديدة
pkill -f "PORT=3001"

# 2. Switch Nginx للنسخة القديمة
ssh root@46.4.188.170 "sed -i 's/localhost:3001/localhost:3000/' /etc/nginx/conf.d/namainvist.com.conf"
ssh root@46.4.188.170 "nginx -s reload"
```

---

## 5. Database Migration Strategy

### 5.1 Forward-Only (Simple)
```bash
node migrate.js up
```

### 5.2 Backward-Compatible (Zero-Downtime)
الـ migrations يجب أن تكون **backward-compatible**:
- ✅ Add column (no drop)
- ✅ Add index (CONCURRENTLY)
- ✅ Add table
- ❌ Drop column (rename + deprecate أولاً)
- ❌ Rename column (add new + migrate + drop)
- ❌ Change type (add new + migrate + drop)

### 5.3 Backward-Incompatible (Maintenance Window)
```bash
# 1. Schedule maintenance window
# 2. Set maintenance page
# 3. Apply breaking change
# 4. Verify
# 5. Remove maintenance
```

---

## 6. Rollback

### 6.1 Code Rollback
```bash
ssh root@46.4.188.170
cd /www/wwwroot/namainvist.com
git log --oneline -5  # find last good SHA
git reset --hard <last-good-sha>
pm2 reload nama-medical-erp
```

### 6.2 Database Rollback
```bash
# List migrations
node migrate.js status

# Roll back to specific version
node migrate.js down --to <version>

# Or restore from backup
ssh root@46.4.188.170 "psql -U nama nama_medical_prod < /var/backups/nama_pre_deploy_*.sql"
```

### 6.3 Full Rollback
```bash
# Restore full server snapshot
ssh root@46.4.188.170 "snapper undochange 42"
```

---

## 7. Post-Deploy Verification

### 7.1 Automated (CI)
```yaml
- name: Post-deploy smoke
  run: |
    sleep 30
    curl -sf https://jumanasoft.com/api/health || exit 1
    curl -sf https://jumanasoft.com/api/{{DEPT_SLUG}}/health || exit 1
```

### 7.2 Manual (Owner)
- [ ] افتح https://jumanasoft.com → يعمل
- [ ] سجل دخول → يعمل
- [ ] اذهب إلى /{{DEPT_SLUG}} → يعمل
- [ ] أنشئ تقييم → يعمل
- [ ] اقرأ نتيجة → يعمل
- [ ] جرّب AI co-pilot → يعمل
- [ ] غيّر اللغة → AR → يعمل
- [ ] تحقق من Audit Log → entry موجود

---

## 8. Acceptance Gates (6 gates)

| # | Gate | Pass Condition |
|---|---|---|
| G1 | Tests | All green, coverage ≥ 80% |
| G2 | Security | No secrets, no XSS, no PHI in logs |
| G3 | RLS | All new tables FORCE_RLS + policy |
| G4 | i18n | All 4 locales 100% |
| G5 | RBAC | Every router has full middleware |
| G6 | Deploy | Sandbox → live, smoke green |

**لا تنتقل للخطوة التالية قبل اجتياز البوابة السابقة.**

---

## 9. Observability

### 9.1 Logs
- **Location:** `/var/log/nama-medical-erp/*.log` (PM2)
- **Format:** JSON structured
- **Retention:** 30d hot, 1y cold (S3)
- **Searchable:** Loki / Grafana

### 9.2 Metrics
- **Prometheus:** http://prometheus.namamedical.sa
- **Grafana:** https://grafana.namamedical.sa
- **Dashboards:** API latency, error rate, DB pool, LLM cost, tenant count

### 9.3 Traces
- **OpenTelemetry → Jaeger:** https://jaeger.namamedical.sa
- **Sample rate:** 10% (100% for errors)

### 9.4 Alerts
- **PagerDuty:** P0 (down, data loss, security)
- **Email:** P1 (degraded)
- **Slack:** P2 (warning)

---

## 10. Useful One-Liners

```bash
# Restart everything
ssh root@46.4.188.170 "pm2 restart all && nginx -s reload"

# Tail logs
ssh root@46.4.188.170 "pm2 logs nama-medical-erp --lines 100"

# Check disk
ssh root@46.4.188.170 "df -h /"

# Check memory
ssh root@46.4.188.170 "free -h"

# Check connections
ssh root@46.4.188.170 "ss -s"

# Quick health
curl -sf https://jumanasoft.com/api/health
```

---

> **Next:** [24_INCIDENT_PLAYBOOK_TEMPLATE_AR.md](24_INCIDENT_PLAYBOOK_TEMPLATE_AR.md) — استجابة الحوادث.
