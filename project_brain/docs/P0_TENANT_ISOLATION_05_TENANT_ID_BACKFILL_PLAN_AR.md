# P0 عزل المستأجرين — 05 خطة backfill لـ tenant_id (Backfill Plan)

> التاريخ: 2026-06-20 | **لا يُنفَّذ backfill على الإنتاج بدون موافقة منفصلة.**

---

## 1. الجداول التي تحتاج backfill (الموجة 1)

13 جدولاً (Class A): medical_records_files/requests/coding، clinical_pharmacy_reviews، patient_drug_education، rehab_patients/sessions/goals/assessments، portal_users، diet_orders/diet_meals، nutrition_assessments.

---

## 2. مصدر القيمة (Backfill Source) — آمن ومُثبَت

- البيئة الحالية **single-tenant** (مستأجر افتراضي وحيد `id=1` — مؤكَّد في seed وفي noop checks).
- لذلك القيمة الصحيحة لكل الصفوف القائمة: `tenant_id = 1, facility_id = 1`.
- لا غموض ولا خطر إسناد خاطئ ما دام عدد المستأجرين = 1.

> **شرط الأمان**: قبل التطبيق، يجب أن يؤكّد `noop_safety_checks.sql` أن `COUNT(*) FROM tenants = 1`. إذا > 1، **يُوقف** الـ backfill ويُراجع يدوياً (قد لا تكون كل الصفوف للمستأجر 1).

---

## 3. أمر الـ backfill (ضمن up.sql)

```sql
UPDATE <table> SET tenant_id = 1 WHERE tenant_id IS NULL;
UPDATE <table> SET facility_id = 1 WHERE facility_id IS NULL;
```
- idempotent (يستهدف NULL فقط).
- محاط بمعاملة في `up.sql`.

---

## 4. التحقق بعد الـ backfill

عبر `validate.sql`: `COUNT(*) WHERE tenant_id IS NULL` = 0 لكل جدول.

تم التحقق فعلياً على **قاعدة dev المحلية**: `rehab_patients/portal_users/diet_orders → null_tenant=0` ✅.

---

## 5. التراجع

- `down.sql` لا يحذف الأعمدة افتراضياً (آمن)؛ خيار `DROP COLUMN` مُعطّل/مُعلّق.
- لا يلزم تراجع للـ backfill نفسه (لا يُتلف بيانات؛ يملأ NULL فقط).

---

## 6. الحالة

- **dev/staging**: مُطبَّق ومُتحقَّق منه.
- **الإنتاج**: مُخطَّط، بانتظار موافقة صريحة منفصلة (Gate 9).

`TENANT_ID_BACKFILL_PLAN_COMPLETE`
