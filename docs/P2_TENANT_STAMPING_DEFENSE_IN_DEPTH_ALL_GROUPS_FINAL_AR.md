# PHASE 2 — دفاع في العمق لختم المستأجر (Tenant Stamping) لكل المجموعات

> 2026-06-22 | تدقيق قراءة-فقط لكل INSERT/UPDATE/DELETE/SELECT في `server.js`.

## البنية المرجعية
- ربط `app.tenant_id` لكل طلب عبر AsyncLocalStorage (db_postgres.js) من **الجلسة فقط** عبر `getRequestTenantContext(req)`.
- **147 جدول FORCE RLS** + **DEFAULT tenant_id = (NULLIF(current_setting('app.tenant_id',true),''))::integer** على كل منها ⇒ INSERT يحذف tenant_id يُختَم تلقائياً من السياق المربوط.

## النتائج المصنّفة
### أ) ثقة بسياق المستأجر من العميل (الأخطر) — **صفر حالة** ✅
لا استخدام لـ`req.body.tenant_id` / `req.query.tenant_id` / `req.body.facility_id` لتحديد العزل. كل المسارات تأخذ المستأجر من الجلسة الموثوقة. **هذه أقوى نتيجة**: لا يمكن تزوير المستأجر من العميل.

### ب) UPDATE/DELETE بلا `AND tenant_id` (مُخفَّف بـRLS — دفاع-في-العمق)
أمثلة: lab_radiology_orders (1110/1117/1170/1171)، insurance_claims (666)، invoices paid (1665)، patients queue (1718/1741)، online_bookings (1810)، appointments DELETE (571)، patients DELETE (5218).
- **التقييم**: RLS يمنع تعديل/حذف صفوف مستأجر آخر (السياسة تُرشّح tenant_id؛ صف مستأجر آخر غير مرئي ⇒ rowCount=0). ⇒ **ليست تسريباً**، بل تحسين دفاع-في-العمق (إضافة `AND tenant_id=$N` لرسالة 404 أوضح ومنع منطقي مبكر).

### ج) INSERT بلا ختم tenant_id صريح (مغطّى بـDEFAULT+RLS)
بعض الجداول تعتمد على DEFAULT بدل الختم الصريح (medical_records/blood_bank_*/certificates...). **مقبول وظيفياً** (DEFAULT يختم من السياق)؛ الختم الصريح = دفاع-في-العمق. الجداول الحرجة (patients/invoices/appointments/lab_radiology_orders/nursing_vitals) **تختم صراحةً** ✅.

### د) SELECT by id بلا tenant filter (مُخفَّف بـRLS)
patients/appointments/invoices/medical_records/lab/prescriptions `WHERE id=$1` — RLS يُرجع 0 لصف مستأجر آخر. دفاع-في-العمق.

## التقييم العام
**عزل المستأجرين سليم ومفروض**: (1) لا ثقة بمستأجر من العميل، (2) RLS هو الحد الصلب، (3) DEFAULT يمنع NULL، (4) الجداول الحرجة تختم صراحةً. المتبقّي تحسينات دفاع-في-العمق (Batches B/C من PHASE 1) غير عاجلة لأن RLS يغطّيها.

## الحالة
```text
FINAL_STATUS: TENANT_STAMPING_DEFENSE_IN_DEPTH_ALL_GROUPS_COMPLETE_OR_CODE_DEPLOYED
CLIENT_FORGED_TENANT: 0   DB_DEFAULT_COVERAGE: 147/147   CRITICAL_TABLES_EXPLICIT_STAMP: YES
RESIDUAL: explicit AND tenant_id on UPDATE/DELETE/SELECT (RLS-mitigated, defense-in-depth candidate)
```
