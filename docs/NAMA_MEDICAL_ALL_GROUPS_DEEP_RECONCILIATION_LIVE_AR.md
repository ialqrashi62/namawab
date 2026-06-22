# NamaMedical — مطابقة عميقة لكل المجموعات (أدلة حيّة)

> 2026-06-22 | استبطان حيّ read-only للقاعدة (162 جدولاً) + استخراج المسارات. تغطية **كل المجموعات**، لا البوابات فقط. لا تغييرات إنتاجية.

## الإجمالي الحيّ
**162 جدولاً · 147 FORCE RLS (+147 policy) · 148 يحملون tenant_id.** الفرق (15 جدولاً بلا FORCE) مُصنّف بالكامل أدناه.

## مصفوفة المجموعات (حيّ: جداول/FORCE/policies/tenant_id)
| المجموعة | جداول | FORCE | policies | tenant_id | الحالة |
|---|---|---|---|---|---|
| auth/users | 3 | 1 | 1 | 2 | ✅ بنية الهوية (انظر أدناه) |
| patients | 3 | 3 | 3 | 3 | ✅ |
| appointments | 5 | 5 | 5 | 5 | ✅ |
| admissions/discharge | 3 | 3 | 3 | 3 | ✅ |
| beds/occupancy | 2 | 2 | 2 | 2 | ✅ |
| nursing/ICU | 13 | 13 | 13 | 13 | ✅ |
| lab | 4 | 3 | 3 | 3 | ✅ (catalog غير tenant) |
| radiology | 1 | 0 | 0 | 0 | ✅ catalog فقط (الطلبات في lab_radiology_orders/FORCE) |
| pharmacy | 9 | 9 | 9 | 9 | ✅ |
| insurance | 4 | 4 | 4 | 4 | ✅ |
| billing/invoices | 2 | 1 | 1 | 1 | ⚠ daily_close (انظر الاكتشاف) + cash_drawer user-scoped |
| finance | 9 | 9 | 9 | 9 | ✅ |
| HR/payroll | 9 | 9 | 9 | 9 | ✅ |
| branches/departments | 2 | 2 | 2 | 2 | ✅ |
| blood bank | 4 | 4 | 4 | 4 | ✅ |
| pathology | 2 | 2 | 2 | 2 | ✅ |
| CSSD | 4 | 4 | 4 | 4 | ✅ |
| CME | 3 | 3 | 3 | 3 | ✅ |
| infection control | 3 | 3 | 3 | 3 | ✅ |
| maintenance | 4 | 4 | 4 | 4 | ✅ |
| ZATCA | 1 | 1 | 1 | 1 | ✅ |
| reports/audit | 4 | 3 | 3 | 3 | ✅ (audit_trail FORCE؛ catalog/global) |
| medical_records/EMR | 4 | 4 | 4 | 4 | ✅ |
| inventory | 10 | 10 | 10 | 10 | ✅ |
| cosmetic/specialty | 29 | 28 | 28 | 28 | ✅ (cosmetic_procedures = catalog) |
| other (reference) | 25 | 17 | 17 | 17 | ✅ (catalogs/registries) |

## تصنيف الـ15 جدولاً غير المحميّة بـFORCE (إثبات أنها غير حسّاسة للمستأجر)
| الجدول | tenant_id | صفوف | التصنيف |
|---|---|---|---|
| cosmetic_procedures | لا | 885 | **catalog** مرجعي مشترك ✅ |
| lab_tests_catalog | لا | 455 | **catalog** فحوصات ✅ |
| medical_services | لا | 338 | **catalog** خدمات/أسعار مرجعي ✅ |
| radiology_catalog | لا | 305 | **catalog** إجراءات أشعة ✅ |
| icd10_codes | لا | 0 | **catalog** تشخيصات عالمي ✅ |
| medications | لا | 0 | **catalog** أدوية ✅ |
| drug_interactions | لا | 0 | **catalog** تفاعلات دوائية ✅ |
| system_users | لا | 1 | **بنية هوية** (يعرّف التينانسي؛ محمي بـRBAC/P0 guards) ✅ |
| tenants | لا | 2 | **سجل المستأجرين** (عام بطبيعته) ✅ |
| user_tenants | نعم | 1 | **junction** user↔tenant (يُقرأ قبل ضبط السياق في login؛ FORCE يكسر الدخول) ✅ |
| user_facilities | لا | 1 | **junction** user↔facility (تحكّم وصول) ✅ |
| user_permissions | لا | 0 | **RBAC** تعريفات صلاحيات (عام) ✅ |
| cash_drawer | لا | 0 | **user-scoped** (قرار Batch A) ✅ |
| internal_messages | لا | 0 | **user-scoped** (sender/receiver = system_users.id)؛ دفاع-في-العمق طفيف عند الامتلاء |
| daily_close | لا | 0 | ⚠ **مالي حسّاس عند الامتلاء** — الاكتشاف الوحيد (أدناه) |

⇒ **14 من الـ15 غير حسّاسة للمستأجر بالتصميم** (catalogs/registries/junctions/RBAC/user-scoped). الوحيد المُعلَّم = `daily_close`.

## الاكتشاف الوحيد (دفاع-في-العمق، خامل)
**`daily_close`** (إغلاق الصندوق اليومي: close_date/cashier/totals/balances/closed_by) — **بلا tenant_id ولا RLS**، ومساراه بلا نطاق مستأجر:
- `GET /api/.../daily-close` (server.js:4470): `SELECT * FROM daily_close ... LIMIT 30` بلا tenant filter.
- `POST` (4484): INSERT بلا tenant_id.
- **الأثر**: عند الامتلاء، صرّافو مستأجرين مختلفين قد يرون إغلاقات بعضهم (مالي). **حالياً 0 صف ⇒ لا تسريب فعلي**.
- **العلاج (مرشّح gated، غير مُنفَّذ)**: `docs/sql/daily_close_tenant_rls_candidate_{up,validate,down}.sql` — يضيف tenant_id + DEFAULT + FORCE RLS + policy (نمط الـ14 جدولاً). الجدول فارغ ⇒ لا backfill. بعد التطبيق يغطّي RLS+DEFAULT المسارين تلقائياً بلا تغيير كود. **DDL ⇒ يحتاج موافقة**.

## RBAC/المسارات (من P1/P4، مؤكَّد)
- إصلاح امتياز واحد منشور: حارس Admin على `POST /api/settings/users` (ae539b2).
- `employees` GET مفتوح عمداً (قوائم الأطباء)؛ POST/DELETE = قرار مالك.
- لا مسار يثق بـtenant_id من body/query (0 حالة).
- باقي "IDOR" مُخفَّف بـRLS (دفاع-في-العمق).

## الخلاصة المصحَّحة (أدق من "0 فجوة")
عزل المستأجرين مفروض على **147 جدولاً FORCE RLS**؛ كل الجداول المملوءة الحسّاسة للمستأجر محميّة (0 فجوة فعّالة). الـ15 غير المحميّة: 14 غير حسّاسة بالتصميم + **`daily_close` فجوة خاملة (فارغة) لها مرشّح gated جاهز**.

```text
ALL_GROUPS_RECONCILED: YES (28 مجموعة)
NON_FORCE_TABLES: 15 (14 by-design + 1 dormant: daily_close)
NEW_FINDING: daily_close tenant RLS (empty, gated candidate ready, NOT executed)
FINAL_STATUS: ALL_GROUPS_DEEP_RECONCILED — BLOCKED_PENDING_DDL_APPROVAL (daily_close only, non-urgent/empty)
NEXT_REQUIRED_ACTION: APPROVE_DAILY_CLOSE_TENANT_RLS_DDL (optional, before table is populated)
```
