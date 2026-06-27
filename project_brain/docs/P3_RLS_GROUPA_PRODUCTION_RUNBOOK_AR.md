# P3 — RLS المجموعة A: دليل تشغيل الإنتاج (Runbook)

> **تخطيط فقط — لا تنفيذ.** يتطلب موافقة + smoke مُصادَق. مبني على بروفة staging الناجحة.

## المتطلبات المسبقة
- [ ] بروفة staging PASS (تمّت — 40/40 سياسات، عزل مُثبت).
- [ ] **smoke مُصادَق على مسارات المجموعة A** (تسجيل دخول مستخدم حقيقي ⇒ قراءة medical_records/hr/etc تُرجع بيانات المستأجر لا 0) — يحتاج بيانات اعتماد المشغّل.
- [ ] backup إنتاج حديث + تأكيد.
- [ ] DB_USER=nama_medical_app (قائم)؛ app/redis مُشرَف عليهما (قائم).
- [ ] نافذة صيانة قصيرة (ALTER ENABLE/FORCE RLS قفل خفيف).

## الأساس الأماني
التطبيق يربط `app.tenant_id` تلقائياً لكل `pool.query` عبر AsyncLocalStorage + pool مغلّف (نفس آلية الـ42 جدولاً الحيّة). ⇒ تفعيل RLS على المجموعة A لا يكسر المسارات التي تمرّ بسياق طلب صحيح.

## الأوامر (عند الاعتماد فقط)
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"
# 1) backup
pg_dump --format=custom --no-owner -f pre_groupA_rls.dump "$PROD_DSN"
# 2) (موصى) دفعات صغيرة: قسّم الـ40 إلى دفعات (مثلاً medical_records*، ثم rehab*، ثم hr*، ثم باقي)
#    يمكن تطبيق الكل دفعة واحدة (الملف يفعل ذلك) أو تقسيمه يدوياً لتقليل المخاطرة.
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/rls_groupA_candidate_up.sql
# 3) validate
psql "$PROD_DSN" -f docs/accounting_candidates/rls_groupA_candidate_validate.sql   # 40/40/0
# 4) smoke مُصادَق لكل دفعة: تسجيل دخول + قراءة جدول من الدفعة (يجب أن تُرجع بيانات المستأجر)
# 5) فحص صحة التطبيق + سجلات PM2 (لا 500/0-rows غير متوقّع)
```

## التحقق بعد التطبيق
- validate = 40 RLS+FORCE / 40 policies / 0 missing.
- بدور غير-superuser: بلا سياق ⇒ 0؛ مع سياق ⇒ بيانات المستأجر؛ إدراج عبر-المستأجر مرفوض.
- مسارات HTTP المُصادَقة تُرجع بيانات (لا 0) — دليل ربط السياق سليم.

## الاسترجاع
- **فوري (مشكلة دالّة)**: `down` لإزالة سياسات المجموعة A، أو إعادة DB_USER إلى postgres مؤقتاً (يتجاوز RLS) ثم `pm2 restart nama-app`.
- لا حذف بيانات (RLS تعريف فقط)؛ backup متاح.

## شروط التوقف
- أي مسار مُصادَق يُرجع 0 صفوف غير متوقّع ⇒ توقف، شغّل `down` للدفعة، حقّق ربط السياق.
- أي خطأ permission/500 ⇒ توقف + استرجاع.

## الحالة
```text
RLS_GROUPA_DDL: READY (staging-proven) | PROD_APPLIED: NO
PREREQ: authenticated route smoke + backup + approval
ROLLBACK: down.sql OR revert DB_USER (instant) | NO data change
```
