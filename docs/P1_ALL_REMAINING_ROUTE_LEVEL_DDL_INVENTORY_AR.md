# P1 — جرد كل DDL المسارات المتبقي (Batch B/C/remaining) تحت الدور المقيَّد

> البرنامج: `NAMA_MEDICAL_FULL_RLS_RUNTIME_HARDENING_MASTER_AUTOPILOT` — PHASE 1A | التاريخ: 2026-06-21 | فحص قراءة-فقط.

## مسح كامل للمستودع
`grep CREATE/ALTER/INDEX/POLICY/DROP` على كل `namaweb/*.js` (عدا node_modules/.git) ⇒ 9 ملفات. التصنيف:
- **server.js** ⇒ DDL وقت الطلب داخل معالجات (Batch B/C) — **النطاق الوحيد للـruntime**.
- **db_postgres.js** ⇒ `initDatabase` startup — **محروس مسبقاً** (NODE_ENV، d0f1f70) = STARTUP_DDL_ALREADY_FIXED.
- **database.js, migrate_patients.js, migrate_phase2.js, migrate_deep_audit.js, inject_medical_services.js** ⇒ سكربتات هجرة/أدوات **تُشغَّل يدوياً، غير مطلوبة من التطبيق الجاري** (server.js يستورد db_postgres + seed_* فقط) = OTHER (non-runtime، لا تسبب 42501 وقت الطلب).
- **cross_tenant_surgery_or_test.js, rls_local_dry_run_3_tables.js** ⇒ سكربتات اختبار/تجربة جافة = FALSE_POSITIVE (غير runtime).

⇒ **كل DDL وقت التشغيل الفعلي في server.js فقط.**

## الحالة الفعلية للجداول (تحقّق 2026-06-21)
| المجموعة | الجدول | موجود؟ | صفوف | tenant_id | FORCE RLS | تصنيف |
|---|---|---|---|---|---|---|
| Batch A (مُنشور) | obgyn_pregnancies/deliveries, referrals, medical_reports, visit_lifecycle | نعم (أُنشئت) | 0 | نعم | نعم | DONE (Phase 165) |
| Batch A | cash_drawer | نعم | 0 | لا (user-scoped) | لا | DONE |
| **Batch B** | pathology_specimens | **لا** | — | — | — | BATCH_B_ROUTE_DDL |
| Batch B | cssd_batches | لا | — | — | — | BATCH_B_ROUTE_DDL |
| Batch B | cme_events | لا | — | — | — | BATCH_B_ROUTE_DDL |
| Batch B | infection_control_reports | لا | — | (def فيه tenant_id) | — | BATCH_B_ROUTE_DDL (PHI) |
| Batch B | maintenance_orders | لا | — | — | — | BATCH_B_ROUTE_DDL |
| Batch B | insurance_policies | **نعم** | 0 | لا | لا | BATCH_B_ROUTE_DDL (موجود فارغ، يحتاج tenant_id+RLS) |
| Batch B | inventory | لا | — | (عبر ALTER) | — | BATCH_B_ROUTE_DDL |
| Batch B | pharmacy_prescriptions | لا | — | (عبر ALTER) | — | BATCH_B_ROUTE_DDL (PHI) |
| **Batch C** | pharmacy_prescriptions_queue (أعمدة .catch) | نعم | 0 | نعم | **نعم** | BATCH_C_SWALLOWED_ALTER (الجدول محميّ؛ تبقى أعمدة) |

## ملاحظات حاسمة
- كل جداول Batch B إمّا غائبة (7) أو موجودة فارغة (insurance_policies) ⇒ **0 صفوف** ⇒ إضافة tenant_id + FORCE RLS **آمنة بلا backfill**.
- pharmacy_prescriptions_queue **محميّ FORCE RLS مسبقاً** + 0 صفوف ⇒ Batch C = فقط نقل أعمدة `.catch` (medication_name, dosage, quantity_per_day, frequency, duration, price, payment_method) إلى migration + إزالتها من المعالجات (لا قرار RLS — الجدول محميّ).
- جداول Batch B الحاملة لبيانات مرضى/PHI: pathology_specimens, infection_control_reports, insurance_policies, pharmacy_prescriptions. التشغيلية: cssd_batches, cme_events, maintenance_orders, inventory. **القرار**: عزل كل Batch B بـtenant (tenant_id + FORCE RLS + policy + DEFAULT) — عزل-في-العمق متّسق (يعمل عبر الربط بلا تعديل كود؛ INSERT يُختَم عبر DEFAULT، SELECT يُرشَّح عبر policy). inventory + pharmacy_prescriptions يأخذان facility_id أيضاً.

## المخرجات (PHASE 1B/1C)
- SQL: `route_level_ddl_batch_b_rls_safe_candidate_{up,validate,down}.sql` (8 جداول، RLS كامل) + `route_level_ddl_batch_c_rls_safe_candidate_{up,validate,down}.sql` (أعمدة pharmacy_prescriptions_queue). remaining_runtime_ddl = لا شيء (لا DDL runtime خارج server.js).
- Code: إزالة DDL مجموعات Batch B/C من server.js (نفس نمط Batch A المُثبَت).

`ROUTE_LEVEL_DDL_INVENTORY_ALL_GROUPS_COMPLETE — runtime DDL في server.js فقط؛ Batch B=8 جداول (0 صفوف، RLS آمن)؛ Batch C=أعمدة على جدول محميّ`
