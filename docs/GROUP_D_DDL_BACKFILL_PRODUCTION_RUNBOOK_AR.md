# Phase 4 — Group D DDL/backfill: دليل تشغيل الإنتاج (Runbook)

> **تخطيط فقط — لا تنفيذ.** يطبّق فقط على الجداول الأربعة الآمنة، بموافقة + backup + auth-smoke.

## النطاق
4 جداول آمنة فقط: `blood_bank_transfusions`, `blood_bank_crossmatch`, `package_sessions`, `approvals` (مصدر tenant_id حتمي = patient_id→patients). الـ18 المؤجَّلة خارج النطاق (انظر قرار التأجيل).

## المتطلبات المسبقة
- [ ] موافقة إنتاج صريحة + auth-smoke (أو قبول مخاطرة) لـ RLS.
- [ ] backup إنتاج حديث + تأكيد.
- [ ] DB_USER=nama_medical_app؛ app/redis سليمان؛ posting OFF.
- [ ] نافذة صيانة (ALTER ADD COLUMN خفيف؛ UPDATE backfill حسب عدد الصفوف).

## الخطوات (عند الاعتماد فقط)
```bash
PGBIN="/c/Program Files/PostgreSQL/16/bin"
# 1) backup
pg_dump --format=custom --no-owner -f pre_groupd.dump "$PROD_DSN"
# 2) عدّ صفوف الجداول الأربعة (مدة backfill)
psql "$PROD_DSN" -c "SELECT 'approvals',count(*) FROM approvals UNION ALL SELECT 'pkg_sessions',count(*) FROM package_sessions UNION ALL SELECT 'bb_transfusions',count(*) FROM blood_bank_transfusions UNION ALL SELECT 'bb_crossmatch',count(*) FROM blood_bank_crossmatch;"
# 3) ADD tenant_id + backfill + index
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/group_d_tenant_id_backfill_candidate_up.sql
# 4) validate: unbackfilled_with_patient=0, tenant_mismatch=0, tenant_indexes=4
psql "$PROD_DSN" -f docs/accounting_candidates/group_d_tenant_id_backfill_candidate_validate.sql
#    => إن وُجدت صفوف rows_without_patient>0: قرار يدوي قبل RLS (تبقى tenant_id NULL => RLS تخفيها للجميع)
# 5) RLS (بعد backfill نظيف)
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/rls_group_d_candidate_up.sql
# 6) auth-smoke مُصادَق على مسارات هذه الجداول (تُرجع بيانات المستأجر لا 0)
```

## تحذير مهم (صفوف بلا patient_id)
أي صف في الجداول الأربعة بلا `patient_id` يبقى `tenant_id=NULL` بعد backfill ⇒ سياسة RLS تخفيه عن **كل** المستأجرين (لا أحد يراه). قبل تفعيل RLS: راجع `rows_without_patient`؛ إن > 0 قرّر معالجتها (تعيين يدوي/استبعاد) — لا تفعّل RLS عليها قبل الحسم.

## الاسترجاع
- RLS: `rls_group_d_candidate_down.sql` (فوري، لا حذف بيانات).
- backfill/عمود: `group_d_tenant_id_backfill_candidate_down.sql` (يحذف tenant_id + index)؛ أو **backup restore** إن وُجدت بيانات حقيقية (أأمن).
- أو إعادة DB_USER=postgres مؤقتاً (يتجاوز RLS) + pm2 restart.

## شروط التوقف
- `unbackfilled_with_patient > 0` أو `tenant_mismatch > 0` ⇒ توقف، لا تفعّل RLS.
- مسار مُصادَق يُرجع 0 صفوف غير متوقّع ⇒ توقف + down.

## الحالة
```text
GROUP_D_SAFE_4_TABLES: candidate ready (staging-proven backfill+RLS) | PROD_APPLIED: NO
NEXT: prod approval + backup + auth-smoke => apply ; 18 deferred tables = separate design/review
```
