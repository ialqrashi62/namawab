# Phase A1 — خطة الاختبار والنتائج (Test Plan & Results)

> 2026-06-22 | rehearsal على قاعدة معزولة نُفِّذ ونجح. اختبارات الكود الحيّ تُشغَّل عند تنفيذ الكود (بعد الموافقة).

## نتائج rehearsal (قاعدة nama_emr_rehearsal معزولة + دور NOSUPER/NOBYPASSRLS — أُنشئت وأُسقطت)
| # | الاختبار | المتوقّع | النتيجة |
|---|---|---|---|
| 1 | إنشاء سجل → الحالة الافتراضية | draft | ✅ draft |
| 2 | توقيع+قفل (UPDATE ... WHERE emr_status<>'locked') | rowCount=1 | ✅ 1 |
| 3 | **تعديل بعد القفل** (UPDATE content WHERE emr_status<>'locked') | rowCount=0 (مرفوض) | ✅ 0 |
| 4 | المحتوى بعد محاولة التعديل | بلا تغيير ('note v1') | ✅ غير معدّل |
| 5 | إدراج amendment @ctx1 | يُختَم tenant=1 | ✅ n=1, tid=1 |
| 6 | عرض amendments @ctx999 | 0 (عزل RLS) | ✅ 0 |
| 7 | تزوير amendment tenant_id=1 @ctx999 | 42501 | ✅ blocked 42501 |
| 8 | emr_amendments FORCE RLS + policy | force=true, policies=1 | ✅ |
| 9 | أعمدة القفل على medical_records | 6 أعمدة | ✅ 6 |
| 10 | down.sql (في الكود) | يرجع نظيفاً | ✅ (نمط مثبت) |

## اختبارات الكود الحيّ (تُشغَّل عند التنفيذ — candidate)
```text
unit: hash(content) ثابت/يكشف العبث
API: POST sign يقفل؛ POST amend يُدرج amendment + audit
RBAC negative: غير الطبيب/المستأجر الآخر → 403/404
locked update denied: UPDATE/DELETE على سجل مقفل → 409 (rowCount 0)
amendment creates audit: AMEND_RECORD في audit_trail + صف emr_amendments
cross-tenant: سجل مستأجر آخر غير مرئي (RLS)
tenant forge: body tenant_id يُتجاهل
accounting remains OFF: journal=0 دون تأثّر
```

## الحالة
```text
REHEARSAL: PASS (10/10)
LIVE_CODE_TESTS: PENDING_IMPLEMENTATION (بعد موافقة النشر)
```
