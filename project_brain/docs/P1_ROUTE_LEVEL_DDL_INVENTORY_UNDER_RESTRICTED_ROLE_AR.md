# P1 — جرد DDL داخل معالجات المسارات تحت الدور المقيَّد (Route-Level DDL Inventory)

> المرحلة: `P0_RESTRICTED_ROLE_POST_DEPLOY_MONITORING_THEN_ROUTE_LEVEL_DDL_REFACTOR_CANDIDATE` — Gate 3 | التاريخ: 2026-06-21 | فحص قراءة-فقط.
> السياق: بعد تشغيل التطبيق فعلياً بدور `nama_medical_app` (Phase 163)، أي `CREATE/ALTER` داخل معالج مسار يرمي **42501** (ثبت في Gate 7 السابق حتى لكائنات موجودة) ⇒ المسار يُرجِع **500** ما لم يكن الـDDL ملفوفاً بـ`.catch`.

## الحقيقة المثبتة
- `CREATE TABLE IF NOT EXISTS` و`ALTER TABLE ... ADD COLUMN IF NOT EXISTS` كلاهما يرمي **42501** تحت `nama_medical_app` (لا CREATE على schema public؛ ليس مالك الجدول) — حتى لو كان الجدول/العمود موجوداً.
- **🔴 تصحيح حاسم (تحقّق فعلي)**: **13 من جداول المسارات غير موجودة أصلاً في الإنتاج** (تلك المسارات الثانوية لم تُستدعَ قط تحت postgres فلم يُنشأ الجدول): obgyn_pregnancies, obgyn_deliveries, referrals, medical_reports, cash_drawer, visit_lifecycle, pathology_specimens, cssd_batches, cme_events, infection_control_reports, maintenance_orders, inventory, pharmacy_prescriptions. **الموجود فقط**: insurance_policies, pharmacy_prescriptions_queue (+ النواة patients/invoices). ⇒ عمود «الجدول موجود؟» أدناه = **لا** لمعظمها (كان افتراضاً خاطئاً قبل التحقق).
- **الأثر**: تحت `nama_medical_app`، استدعاء أيٍّ من تلك المسارات يفشل **سواء** بـ42501 (محاولة CREATE) **أو** — بعد إزالة الـDDL — بـ42P01 (استعلام لجدول مفقود). كلاهما **500**. ⇒ الإصلاح الصحيح = إزالة DDL من الكود **+ تشغيل migration candidate خارج-النطاق (superuser) لإنشاء الجداول** — يُنشَران **معاً** (SQL أولاً ثم الكود).
- لا startup DDL متبقٍّ (محروس في d0f1f70؛ IIFEs داخل `if(NODE_ENV!=='production')`).

## الجرد المصنّف (CREATE/ALTER داخل معالجات `app.get/post/put`)

| الجدول | المسار/المعالج | السطور | النوع | الجدول موجود؟ | يفشل تحت nama_medical_app؟ | الأثر للمستخدم | .catch؟ | الأولوية | التصنيف |
|---|---|---|---|---|---|---|---|---|---|
| obgyn_pregnancies, obgyn_deliveries | GET /api/obgyn/stats | 5563–5584 | CREATE×2 + ALTER×2 | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| referrals | POST /api/referrals | 5743–5748 | CREATE + ALTER | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| referrals | GET /api/referrals | 5763–5768 | CREATE + ALTER | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| medical_reports | POST /api/medical-reports | 5882–5902 | CREATE + ALTER | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| medical_reports | GET /api/medical-reports | 5927 | ALTER | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| medical_reports | GET /api/medical-reports/:id | 5950 | ALTER | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| cash_drawer | POST /api/cash-drawer/open | 6133–6147 | CREATE | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| visit_lifecycle | POST /api/visits/lifecycle | ~6206–6230 | CREATE | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| visit_lifecycle | GET /api/visits/lifecycle/today | 6279 | CREATE | نعم | نعم | **500** | لا | A | ROUTE_LEVEL_DDL |
| visit_lifecycle | PUT /api/appointments/:id/checkin | 6304 | CREATE | نعم | نعم | **500** (مسار أساسي في تدفّق المريض) | لا | A | ROUTE_LEVEL_DDL |
| pathology_specimens | (pathology) | 6764 | CREATE | نعم | نعم | **500** | لا | B | ROUTE_LEVEL_DDL |
| cssd_batches | (cssd) | 6779 | CREATE | نعم | نعم | **500** | لا | B | ROUTE_LEVEL_DDL |
| cme_events | (cme) | 6801 | CREATE | نعم | نعم | **500** | لا | B | ROUTE_LEVEL_DDL |
| infection_control_reports | GET/POST infection-control (×3) | 6818–6860 | CREATE + ALTER×3 | نعم | نعم | **500** | لا | B | ROUTE_LEVEL_DDL |
| maintenance_orders | (maintenance) | 6876 | CREATE | نعم | نعم | **500** | لا | B | ROUTE_LEVEL_DDL |
| insurance_policies | GET /api/insurance/policies | 6898 | CREATE | نعم | نعم | **500** | لا | B | ROUTE_LEVEL_DDL |
| inventory | GET /api/inventory | 6907–6914 | CREATE + ALTER×2 | نعم | CREATE نعم | **500** (من CREATE) | CREATE لا، ALTER نعم | B | ROUTE_LEVEL_DDL |
| pharmacy_prescriptions | GET /api/pharmacy/prescriptions | 6979–6987 | CREATE + ALTER×2 | نعم | CREATE نعم | **500** (من CREATE) | CREATE لا، ALTER نعم | B | ROUTE_LEVEL_DDL |
| pharmacy_prescriptions_queue | POST /api/prescriptions, PUT /api/pharmacy/queue/:id | 4702–4706, 4754–4755 | ALTER×7 | نعم | يُرمى ويُبتلَع | لا 500 (مبتلَع) لكن **ابتلاع DDL** | نعم | C | ROUTE_LEVEL_DDL |
| inventory (ثانوي) | مسارات inventory أخرى | 6739–6740, 6926–6927, 6940, 6961 | ALTER | نعم | يُرمى ويُبتلَع | لا 500 (مبتلَع) | نعم | C | ROUTE_LEVEL_DDL |
| system_users / pharmacy_prescriptions_queue / audit_trail (IIFEs) | startup | 7038–7045 | ALTER | نعم | — | محروس NODE_ENV (d0f1f70) | — | — | STARTUP_DDL_ALREADY_REMOVED |

## الخلاصة
- **ROUTE_LEVEL_DDL يسبب 500 مباشر (غير مبتلَع)**: ~14 معالجاً عبر 13 جدولاً (Batch A + B).
- **ROUTE_LEVEL_DDL مبتلَع (.catch، لا 500 لكنه ابتلاع DDL محظور)**: pharmacy_prescriptions_queue ALTERs + inventory ALTERs الثانوية (Batch C).
- **الجداول الأساسية** (patients, invoices, system_users, audit_trail, appointments, waiting_queue …) **بلا DDL في المعالج** ⇒ تعمل تحت الدور المقيَّد. أُثبت: login/patients/health/binding/write-smoke كلها تعمل.
- **مسار أساسي متأثّر**: `PUT /api/appointments/:id/checkin` (6304) يُنشئ visit_lifecycle ⇒ تسجيل وصول الموعد قد يفشل 500 ⇒ أولوية A.

`ROUTE_LEVEL_DDL_INVENTORY_COMPLETE — 13 TABLES / ~14 HANDLERS DIRECT-500 (A+B) + 2 SWALLOWED GROUPS (C); CORE TABLES UNAFFECTED`
