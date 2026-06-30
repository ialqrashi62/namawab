# Runbook — تجهيز بيئة Staging كاملة (NamaMedical)

> **الهدف:** بيئة منفصلة تماماً عن الإنتاج (instance/قاعدة/منفذ مختلف) تُستعاد عليها نسخة من الإنتاج،
> فتصبح ساحة آمنة لتشغيل المجموعة الكاملة + فرض CSP + وصل validation + اختبار `e22_01` قبل الإنتاج.
> **هذا يحلّ أخطر بند تشغيلي:** التطوير الحالي يجري على قاعدة الإنتاج مباشرة.
> **مبدأ:** لا يلمس أي أمر هنا `nama_medical_web` الإنتاجية. أوامر الإنتاج الوحيدة = **قراءة** نسخة احتياطية.

---

## القرار: أين تبني staging؟ (الأأمن أولاً)
| الخيار | العزل | ملاحظة |
|---|---|---|
| **A. instance/خادم منفصل (موصى)** | كامل | VM/cloud أو جهاز آخر؛ صفر تأثير على الإنتاج |
| **B. PG cluster ثانٍ على نفس الجهاز، منفذ 5433** | جيد | native، لا Docker |
| **C. حاوية Docker (منفذ 5433)** | جيد | ⚠️ **تحذير:** عمليات Docker قد تُرتِد Docker Desktop → تُسقِط `nama-redis` والتطبيق الإنتاجي. لا تستخدمه إن كان الإنتاج يعتمد Docker على نفس الجهاز |

> اختر A إن أمكن. لا تستخدم منفذ 5432 (الإنتاج).

---

## الخطوة 1 — نسخة احتياطية من الإنتاج (قراءة فقط)
```bash
# على جهاز الإنتاج، بدور قراءة. لا يعدّل شيئاً.
pg_dump -Fc -h localhost -p 5432 -U <readonly_or_priv_role> nama_medical_web \
  > /secure/path/prod_snapshot_$(date +%F).dump
```

## الخطوة 2 — أنشئ instance/قاعدة staging (منفصلة)
مثال للخيار B (cluster ثانٍ، منفذ 5433) أو A (خادم منفصل، منفذ 5432 عليه):
```bash
# بحساب superuser على instance الـstaging (ليس الإنتاج):
psql -p 5433 -U postgres -c "CREATE DATABASE nama_medical_staging OWNER postgres;"
# دور التطبيق (نفس اسم الإنتاج، كلمة سر staging مختلفة):
psql -p 5433 -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app') THEN CREATE ROLE nama_medical_app LOGIN PASSWORD '<staging_pw>'; END IF; END \$\$;"
```

## الخطوة 3 — استعد نسخة الإنتاج إلى staging
```bash
pg_restore -h localhost -p 5433 -U postgres -d nama_medical_staging --no-owner --role=postgres \
  /secure/path/prod_snapshot_<date>.dump
# امنح صلاحيات التطبيق + تأكد FORCE RLS كما الإنتاج:
psql -p 5433 -U postgres -d nama_medical_staging -c "GRANT USAGE ON SCHEMA public TO nama_medical_app; GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO nama_medical_app; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO nama_medical_app;"
```

## الخطوة 4 — طبّق أي migrations ناقصة + e22_01
```bash
cd namaweb
export PGHOST=localhost PGPORT=5433 PGDATABASE=nama_medical_staging PGUSER=postgres PGPASSWORD='<su>'
bash DEPLOY_RUN.sh                                   # e0..e21 + ex + validators (idempotent)
psql -f migrations/e22_01_operational_money_numeric_up.sql
psql -f migrations/e22_01_operational_money_numeric_validate.sql   # متوقَّع: 0
```

## الخطوة 5 — هيّئ التطبيق لـstaging
انسخ `namaweb/.env.staging.example` إلى `.env` على خادم staging واملأ القيم (NODE_ENV=staging،
منفذ DB 5433، كلمات سر staging). **شغّل الميزات الخاملة تدريجياً للاختبار:**
```
RATE_LIMIT_GLOBAL=true
AUDIT_ALL_MUTATIONS=true
# CSP: ابدأ Report-Only (الافتراضي)، راقب /api/csp-report، ثم:
# CSP_ENFORCE=true   <-- بعد 24-48h بلا انتهاكات
```

## الخطوة 6 — شغّل المجموعة الكاملة على staging
```bash
export TEST_DB_NAME=nama_medical_staging DB_PORT=5433 DB_USER=nama_medical_app DB_PASSWORD='<staging_pw>' NODE_ENV=test
bash ops/run_full_suite_isolated.sh     # حارس يرفض الإنتاج؛ يشغّل كل cross_tenant + e2e
```
**متوقَّع: PASS شامل.** أرسل لي أي فشل لأُصلحه.

## الخطوة 7 — تفعيل الميزات + مراقبة
1. **CSP:** راقب `/api/csp-report` على staging؛ عالج أي inline؛ ثم `CSP_ENFORCE=true`.
2. **Audit/Rate-limit:** تأكد من امتلاء `audit_trail` وأن الحدود لا تعيق الاستخدام الطبيعي.
3. **validation:** بعد الوصل (PHASE 1.2)، أعد الخطوة 6.

## الخطوة 8 — الترقية للإنتاج (بموافقتك + backup)
بعد نجاح كل ما سبق على staging:
1. `pg_dump` احتياطي للإنتاج.
2. طبّق `e22_01` على الإنتاج (دور DDL) + `_validate`.
3. فعّل الأعلام على الإنتاج بنفس تدرّج staging.
4. أعِد تشغيل التطبيق (PM2) — **بموافقتك الصريحة، خارج هذا الـrunbook**.

---

## حواجز أمان
- **لا تشغّل أيّ خطوة كتابة على `nama_medical_web`.** الإنتاج = قراءة (pg_dump) فقط هنا.
- `ops/run_full_suite_isolated.sh` يرفض تلقائياً أي هدف اسمه إنتاجي أو NODE_ENV=production.
- خذ backup قبل أي DDL على الإنتاج (الخطوة 8).
- إن كان الإنتاج يعتمد Docker على نفس الجهاز، **تجنّب الخيار C** (خطر ارتداد Docker → إسقاط الإنتاج).
