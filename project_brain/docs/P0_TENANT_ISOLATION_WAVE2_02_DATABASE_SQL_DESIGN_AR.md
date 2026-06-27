# P0 الموجة 2 — 02 تصميم قاعدة البيانات وSQL (Class A فقط)

> التاريخ: 2026-06-20 | **لا تنفيذ DDL على الإنتاج** في هذه المرحلة.

## 1. Class B — لا يحتاج SQL

telemedicine/pathology/social_work/mortuary/zatca: الأعمدة (`tenant_id`/`facility_id`) موجودة أصلاً على الإنتاج (أُضيفت في الترحيل المجمّع). الإصلاح كودي بحت — لا DDL.

## 2. Class A — SQL متتبع مُجهَّز

الملفات (تحت `docs/sql/`):
- `p0_tenant_isolation_wave2_up.sql` — `ADD COLUMN tenant_id/facility_id` + backfill (tenant 1) + فهارس + `ENABLE`/`FORCE RLS` + سياسات، لـ: blood_bank_units/donors/crossmatch/transfusions, approvals, package_sessions.
- `p0_tenant_isolation_wave2_validate.sql` — تحقق read-only (أعمدة، 0 nulls، RLS forced، السياسات).
- `p0_tenant_isolation_wave2_down.sql` — تراجع (drop policy/disable RLS/drop index؛ حذف الأعمدة مُعطّل).
- `p0_tenant_isolation_wave2_noop_safety_checks.sql` — فحوص ما قبل التطبيق (المستأجر 1، عدد المستأجرين، وجود الجداول، مستخدم محدود).

## 3. السياسة الموحّدة

`USING/WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)` — نفس آلية الجداول المُفعّلة. idempotent بالكامل.

## 4. شرط التطبيق

تطبيق `up.sql` على الإنتاج **يقترن إلزامياً** بنشر كود مسارات blood_bank/approvals/packages (يُعدّ في Wave 2b)، وبموافقة + نسخة احتياطية + validate + rollback.

`WAVE2_DATABASE_SQL_DESIGN_COMPLETE`
