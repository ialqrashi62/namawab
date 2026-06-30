# Runbook — تجهيز DB اختبار معزولة وإكمال التحقّق (NamaMedical)

> **لماذا:** من بيئة الكود، القاعدة المحلية الوحيدة هي **الإنتاج** (`nama_medical_web`, NODE_ENV=production,
> دور `nama_medical_app` بـ createdb=false). لذا تعذّر تشغيل اختبارات التكامل (cross-tenant/RLS)، وفرض CSP،
> ووصل validation، وتنفيذ DDL — كلها تحتاج بيئة منفصلة. هذا الـrunbook يفتح كل ذلك بأمان.
> **يحتاج فقط:** صلاحية Postgres superuser/createdb (لا يملكها الوكيل).

## الخطوة 1 — إنشاء DB اختبار معزولة (بصلاحية superuser)
```bash
# بحساب postgres/superuser — لا يلمس nama_medical_web إطلاقاً
psql -U postgres -c "DROP DATABASE IF EXISTS nama_medical_test;"
psql -U postgres -c "CREATE DATABASE nama_medical_test OWNER postgres;"
# تأكد من وجود دور التطبيق (نفس الإنتاج) — أنشئه إن لزم على هذا الـinstance
psql -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app') THEN CREATE ROLE nama_medical_app LOGIN PASSWORD '<set>'; END IF; END \$\$;"
psql -U postgres -d nama_medical_test -c "GRANT ALL ON SCHEMA public TO postgres; GRANT USAGE ON SCHEMA public TO nama_medical_app;"
```

## الخطوة 2 — تطبيق مخطط الإنتاج على قاعدة الاختبار (بالأداة المعتمدة)
استخدم **`namaweb/DEPLOY_RUN.sh`** — أداة المستودع الرسمية التي تطبّق كل migrations + validators
**بالترتيب الصحيح** مع preflight آمن متعدد المستأجرين (لا تعتمد فرزاً أبجدياً). **موجِّهاً إياها لقاعدة الاختبار:**
```bash
cd namaweb
export PGHOST=localhost PGDATABASE=nama_medical_test PGUSER=postgres PGPASSWORD='<superuser>'
bash DEPLOY_RUN.sh         # يطبّق e0..e21 + ex + validators، يتوقّف عند أول خطأ
```
> ملاحظة: `DEPLOY_RUN.sh` **لا يشمل `e22_01` الجديد** (مضاف هذه الجلسة) — يُطبَّق في الخطوة 4.
> backfill داخل بعض الـ_up يستخدم `tenant_id=1`؛ على بيانات اختبار نظيفة هذا no-op آمن (الـpreflight يتحقّق).
> بعد الانتهاء امنح `nama_medical_app` صلاحيات القراءة/الكتابة على قاعدة الاختبار كما في الإنتاج.

> تحقّق من RLS: الـvalidators تعمل تلقائياً ضمن `DEPLOY_RUN.sh` ويجب أن تمرّ كلها (0 مشاكل).

## الخطوة 3 — تشغيل المجموعة الكاملة معزولةً
```bash
export TEST_DB_NAME=nama_medical_test DB_USER=nama_medical_app DB_PASSWORD='<test>' NODE_ENV=test
bash ops/run_full_suite_isolated.sh      # فيه حارس يرفض الإنتاج
```
يشغّل `run_all_tests.js` كاملاً (incl. cross_tenant_*, e2e). متوقَّع: PASS شامل.

## الخطوة 4 — اختبار e22_01 (مال REAL→NUMERIC) معزولاً
```bash
psql -U postgres -d nama_medical_test -f namaweb/migrations/e22_01_operational_money_numeric_up.sql
psql -U postgres -d nama_medical_test -f namaweb/migrations/e22_01_operational_money_numeric_validate.sql   # متوقَّع: 0
# عند النجاح -> جدول التنفيذ على الإنتاج عبر runbook النسخ الاحتياطي المعتمد + موافقتك
```

## الخطوة 5 — وصل validation تدريجياً (مع اختبار التكامل)
ابدأ بمسار مالي/طبي واحد: `const V=require('./validation'); ... V.validateBody({...})` ثم شغّل المجموعة
معزولةً (الخطوة 3). كرّر لكل مجموعة مسارات. **لا تفرض قيوداً تكسر الدومين** (مثال: المريض غير السعودي
يستخدم إقامة/جواز لا هوية 10 أرقام → اجعل national_id اختيارياً/مرناً).

## الخطوة 6 — فرض CSP على staging
على بيئة staging فقط: `CSP_ENFORCE=true` + راقب `/api/csp-report` 48 ساعة، عالج أي انتهاك (inline)،
ثم فعّل على الإنتاج.

## ملاحظة أمان
- **لا تشغّل أيّاً من هذا على `nama_medical_web`.** السكربت يرفض ذلك تلقائياً.
- خذ نسخة احتياطية قبل أي DDL على الإنتاج (الخطوة 4 النهائية) عبر runbook النسخ الاحتياطي المعتمد.
