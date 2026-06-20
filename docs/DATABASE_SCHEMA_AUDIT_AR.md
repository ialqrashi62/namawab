# تدقيق مخطط قاعدة البيانات (Database Schema Audit)

> التاريخ: 2026-06-20 | فحص قراءة-فقط (الإنتاج + db_postgres.js). مرجع: [GLOBAL_AUDIT_05_DATABASE_TENANT_ISOLATION_AR.md](GLOBAL_AUDIT_05_DATABASE_TENANT_ISOLATION_AR.md), [MEDICAL_DATABASE_TENANT_ISOLATION_AUDIT_AR.md](MEDICAL_DATABASE_TENANT_ISOLATION_AUDIT_AR.md).

## 1. عام
- ~148 جدولاً (`CREATE TABLE` في db_postgres.js). 228+ إشارة `tenant_id`. آلية سياق المستأجر: GUC `app.tenant_id` عبر `set_config(...,true)` (P0 binding منشور).

## 2. ⚠️ حالة RLS على الإنتاج (قراءة-فقط) — تباين موثّق
| القياس | القيمة الفعلية على الإنتاج |
| ------ | ------------------------- |
| `relrowsecurity` (ENABLE RLS) | **14 جدولاً** |
| `relforcerowsecurity` (FORCE RLS) | **13 جدولاً** |
| `pg_policies` | **14 سياسة** |
| app role | `nama_medical_app` (NOBYPASSRLS)؛ `patients` بلا سياق = 0 صف (RLS فعّال) |

> **اكتشاف تدقيقي (P1)**: توجد commit توثيقية (`docs(rls): Phase 2 ... 42->115 tables`) تدّعي تفعيل RLS على **115 جدولاً**، لكن الحالة الفعلية على هذه القاعدة الإنتاجية = **13 FORCE / 14 ENABLE**. **تباين بين التوثيق والواقع** يجب تسويته: إمّا الـ115 طُبّقت على بيئة أخرى/لم تُطبّق فعلياً، أو التوثيق مبالغ. **يلزم تحقق وتسوية قبل الاعتماد على ادعاء الـ115.**

## 3. الجداول الحساسة بلا RLS فعلي (مخاطر عزل متبقية)
- خارج الـ13-14 المحمية: معظم الجداول الحساسة تعتمد على **عزل التطبيق فقط** (`WHERE tenant_id=$N`) دون RLS على مستوى DB. آمن طالما الكود يفلتر، لكنه ليس دفاعاً عميقاً.
- **Class A بلا tenant_id إطلاقاً**: blood_bank_*, approvals, package_sessions (+ موديولات Wave1: medical_records_*, rehab_*, portal_users, diet_* — لها tenant_id في المصدر/dev لكن RLS DDL غير منشور على الإنتاج).

## 4. مخطط المحاسبة (جديد)
- finance_journal_entries/lines: بهما tenant_id؛ **لا `source_type`/`source_id` + لا فهرس فريد** → idempotency تطبيقي عبر `reference` (يُفضّل DDL لفهرس فريد).
- finance_chart_of_accounts: **بلا tenant_id** (عام) + **فارغ على الإنتاج (CoA=0)** → الترحيل لا يمكن تفعيله قبل seed.

## 5. ملاحظات عامة
- لا `soft-delete`/`updated_at`/`created_by` في معظم الجداول → تتبّع تغييرات ناقص.
- الفهارس: `tenant_id` مركّبة على الجداول الأساسية جيدة؛ جداول Class A تحتاج فهارس عند إضافة tenant_id.
- مستخدم التطبيق محدود الصلاحيات (`nama_medical_app`) — ممتاز.

## 6. القرار
`DATABASE_STATUS: WARNING`. أولويات: (1) **تسوية تباين RLS 115-vs-13** (تحقق فعلي). (2) إكمال tenant_id + RLS لـ Class A (DDL معلّق). (3) DDL idempotency للمحاسبة + tenant_id لـ CoA. (4) soft-delete/audit columns.

`DATABASE_SCHEMA_AUDIT_COMPLETE`
