# P1A_STAGING_DB_AND_CLIENT_TOOLS — تقرير حظر (BLOCKER)

> أُنشئ وفق القاعدة 11. التاريخ: 2026-06-20.

## الحظر
**Gate 5/6 — إنشاء قاعدة staging معزولة والتحقق منها: لم يكتمل.**
(أدوات العميل psql/pg_dump أصبحت متاحة — جزء الأدوات من الحظر السابق مرفوع. المتبقّي: القاعدة المعزولة.)

## السبب
1. **Docker daemon متوقف** ⇒ لا يمكن تشغيل حاوية `postgres:16` معزولة الآن (ولن أُجبر تشغيل Docker Desktop).
2. **إنشاء قاعدة على عنقود الإنتاج (createdb @ localhost:5432) رُفض بوّابياً** (auto-mode classifier) باعتباره كتابة على بنية الإنتاج تتعارض مع حصر الإنتاج بالقراءة فقط ومتطلّب العزل. **لم ألتفّ على الرفض.**
3. لم أُنشئ عنقوداً منفصلاً (initdb على منفذ 5433) تلقائياً، لأنه وقوف خادم قاعدة بيانات جديد — إجراء بنية تحتية ثقيل يستحق موافقة صريحة، خصوصاً بعد إشارة الرفض الأمنية.

## ما تأكّد إنجازه بأمان
- أدوات العميل: ✅ PostgreSQL 16.14 (psql/pg_dump/pg_restore/createdb/initdb/pg_ctl).
- هوية الإنتاج: ✅ `nama_medical_web` @5432 (read-only).
- schema-only export: ✅ `C:\Users\ice\nama_staging_artifacts\prod_schema_only.sql` (148 جدولاً، بلا بيانات، خارج git).
- قالب بيئة آمن: ✅ `docs/staging/.env.staging.example`.

## ما لم يتأثّر (سلامة)
لا DDL/seed محاسبي · لا تغيير بيانات · لا كتابة على عنقود الإنتاج · المحرك غير موصول · لا نشر · لا force push · لا لمس `.gitmodules`/`df893ab`/RLS/entitlement.

## خيارات رفع الحظر (يختار المستخدم واحداً)
| # | الطريقة | العزل | ما يلزم منك |
|---|---|---|---|
| A (مُوصى) | تشغيل Docker Desktop ثم حاوية `postgres:16` على منفذ 5433 (provenance: صورة Docker Hub الرسمية، تطابق إصدار الإنتاج 16) | حاوية منفصلة (الأعلى) | تشغيل Docker + موافقة على سحب الصورة |
| B | عنقود PostgreSQL محلي منفصل عبر `initdb` في مجلد بيانات جديد على منفذ 5433 ثم `pg_ctl start` | عملية/منفذ/مجلد منفصل (عالٍ) | موافقة على إنشاء وتشغيل عنقود محلي |
| C | قاعدة منفصلة `nama_medical_staging_rehearsal` على عنقود الإنتاج نفسه (5432) عبر `createdb` | اسم قاعدة مختلف فقط (الحد الأدنى) | إضافة قاعدة Bash permission للسماح بـ createdb، أو تنفيذك له يدوياً |

بعد أي خيار: استيراد `prod_schema_only.sql` ثم استئناف بروفة DDL (Gate 7 في تقرير التجهيز).

## الأوامر الجاهزة (للخيارين A/B — للاستخدام عند الموافقة فقط)
```bash
# الخيار A — Docker (بعد تشغيل الـ daemon)
docker run -d --name nama_pg_staging -e POSTGRES_PASSWORD=<local_only> \
  -e POSTGRES_DB=nama_medical_staging_rehearsal -p 5433:5432 postgres:16
PGBIN="/c/Program Files/PostgreSQL/16/bin"; export PGPASSWORD=<local_only>
"$PGBIN/psql.exe" -h localhost -p 5433 -U postgres -d nama_medical_staging_rehearsal \
  -f /c/Users/ice/nama_staging_artifacts/prod_schema_only.sql

# الخيار B — عنقود محلي منفصل
"$PGBIN/initdb.exe" -D /c/Users/ice/nama_pg_staging_data -U postgres --encoding=UTF8
"$PGBIN/pg_ctl.exe" -D /c/Users/ice/nama_pg_staging_data -o "-p 5433" -l /c/Users/ice/nama_pg_staging.log start
"$PGBIN/createdb.exe" -h localhost -p 5433 -U postgres nama_medical_staging_rehearsal
"$PGBIN/psql.exe" -h localhost -p 5433 -U postgres -d nama_medical_staging_rehearsal \
  -f /c/Users/ice/nama_staging_artifacts/prod_schema_only.sql
```

## الحالة
```text
FINAL_STATUS: STAGING_DB_AND_CLIENT_TOOLS_BLOCKED
BLOCKING_GATE: GATE_5_ISOLATED_STAGING_DB_CREATION
CLIENT_TOOLS: READY
ISOLATED_STAGING_DB: NOT_PROVISIONED
NEXT_REQUIRED_ACTION: APPROVE_STAGING_PROVISIONING_METHOD (A: Docker | B: separate cluster :5433 | C: createdb on local cluster)
```
