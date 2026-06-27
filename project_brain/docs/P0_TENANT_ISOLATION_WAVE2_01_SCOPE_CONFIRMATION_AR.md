# P0 الموجة 2 — 01 تأكيد النطاق (Scope Confirmation)

> التاريخ: 2026-06-20 | المرحلة: `P0_TENANT_ISOLATION_WAVE2_REMEDIATION_AND_CONTROLLED_DEPLOY`

## التصنيف المؤكَّد (من `db_postgres.js`)

| الموديول | الجداول | tenant_id موجود؟ | الصنف | الإجراء |
| -------- | ------- | :---------------: | ----- | ------- |
| الطب عن بعد | telemedicine_sessions | ✅ | **Class B** | إصلاح كودي + نشر آمن |
| علم الأمراض | pathology_cases | ✅ | **Class B** | إصلاح كودي + نشر آمن |
| الخدمة الاجتماعية | social_work_cases | ✅ | **Class B** | إصلاح كودي + نشر آمن |
| خدمة الوفيات | mortuary_cases | ✅ | **Class B** | إصلاح كودي + نشر آمن |
| ZATCA | zatca_invoices | ✅ | **Class B** | إصلاح كودي + نشر آمن |
| بنك الدم | blood_bank_units/donors/crossmatch/transfusions | ❌ | **Class A** | SQL مُعدّ — مؤجّل (DDL) |
| الموافقات | approvals | ❌ | **Class A** | SQL مُعدّ — مؤجّل (DDL) |
| الباقات | package_sessions | ❌ | **Class A** | SQL مُعدّ — مؤجّل (DDL) |

## قرار النطاق

- **Class B (5 موديولات)**: تحمل `tenant_id` على الإنتاج (أُضيف في الترحيل المجمّع المنشور) → إضافة الفلاتر **آمنة للنشر فوراً** (code-only). تُعالَج وتُنشر في هذه الموجة.
- **Class A (3 مجموعات)**: تفتقر `tenant_id` على الإنتاج → إضافة الفلاتر **تكسر الإنتاج** بدون DDL. لذلك:
  - يُجهَّز SQL متتبع (up/validate/down/noop).
  - **يُؤجَّل الكود + DDL إلى Wave 2b بموافقة إنتاج صريحة** (التزام Hard Stop 5.1 من محرّك القرار الأعلى).
  - **لا يُعدَّل كود blood_bank في الـ build المنشور** حتى لا يُكسر الإنتاج.

`WAVE2_SCOPE_CONFIRMATION_COMPLETE`
