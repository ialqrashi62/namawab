# Phase A1 — مواصفة تصميم EMR Lock/Signature

> 2026-06-22 | تصميم. لا تنفيذ إنتاجي قبل rehearsal+backup+موافقة.

## دورة الحالة
```
draft  →  signed (موقّع نهائي)  →  locked (مقفل)
بعد locked: لا UPDATE/DELETE مباشر. أي تغيير = amendment موثّق (سجل جديد + audit)، لا تعديل صامت.
```

## الأعمدة المضافة لكل جدول سريري مستهدف (إضافية، nullable)
| العمود | النوع | الغرض |
|---|---|---|
| emr_status | text DEFAULT 'draft' | draft/signed/locked |
| signed_by_user_id | integer | من وقّع |
| signed_at | timestamptz | متى وُقّع |
| locked_at | timestamptz | متى قُفل |
| integrity_hash | text | بصمة المحتوى عند التوقيع (كشف العبث) |
| lock_reason | text | سبب/سياق |
(tenant_id موجود مسبقاً)

## جدول التعديلات (amendments)
`emr_amendments(id, record_type, record_id, amended_by_user_id, amended_at, reason, previous_integrity_hash, new_values_summary, tenant_id)` — FORCE RLS + DEFAULT tenant_id + policy (نمط المشروع). append-only منطقياً.

## الجداول المستهدفة (المرحلة A1 الأساسية)
medical_records، nursing_assessments، medical_reports، medical_certificates، surgery_anesthesia_records. (icu_monitoring/emergency_trauma اختياري لاحقاً.)

## الصلاحيات (RBAC)
| الفعل | من |
|---|---|
| sign/finalize سجل طبي | Doctor (لسجلاته) + Admin |
| finalize تقييم تمريضي | Nurse + Admin |
| تعديل سجل بعد القفل | **ممنوع** (UPDATE/DELETE يُرفض إن emr_status='locked') |
| amendment بعد القفل | عبر endpoint مخصّص فقط، يُسجّل amendment + audit (لا يغيّر الأصل صامتاً) |
| unlock استثنائي | super-admin فقط عبر workflow مُدقّق (تصميم لاحق، خارج A1) |

## منطق الإنفاذ
- **التوقيع**: POST sign → يضبط emr_status='signed'، signed_by/at، يحسب integrity_hash. ثم 'locked' بعد التأكيد.
- **منع التعديل**: كل UPDATE/DELETE على السجل يُسبق بفحص `emr_status != 'locked'` (rowCount=0/403 إن مقفل). على مستوى التطبيق + (اختياري) trigger DB دفاع-في-العمق.
- **العزل**: كل العمليات tenant-scoped (RLS + getRequestTenantContext)؛ لا ثقة بمستأجر من body/query.
- **التدقيق**: logAudit (SIGN_RECORD / LOCK_RECORD / AMEND_RECORD) + صف emr_amendments.

## السلامة
- إضافة nullable + DEFAULT 'draft' ⇒ السجلات القائمة (لا يوجد، الجداول فارغة) تبقى draft؛ لا كسر.
- لا constraints قاسية قبل backfill (غير محتاج — فارغة).
- DB trigger للمنع = اختياري دفاع-في-العمق (يُرهَن أولاً).

## 6-12
المتطلبات: DDL candidate (Gate 3) + code candidate (Gate 4) + tests (Gate 6). الأولوية P0. المخاطر: منطق المنع قد يعيق تعديلاً مشروعاً قبل القفل ⇒ الفحص فقط على 'locked'. توصيات: rehearse DDL معزول، ثم نشر محكوم بموافقة. Acceptance: تصميم كامل لدورة الحالة+الصلاحيات+التدقيق (✅). Next: 03 SQL candidate.
