# P0 عزل المستأجرين — 06 تقرير معالجة الكود (Code Remediation Report)

> التاريخ: 2026-06-20 | الملفات المعدّلة: `namaweb/server.js`, `namaweb/db_postgres.js`.

---

## 1. ما تم تنفيذه (الموجة 1 — الموديولات الخمسة المسمّاة)

### 1.1 `server.js` — 29 مساراً مُؤمَّناً
أُضيف لكل مسار: `requireTenantScope` + `getRequestTenantContext` + فلتر `tenant_id` للقراءة + ختم `tenant_id`/`facility_id` للإدراج + تحقق ملكية للتعديل + تحقق تبعية المريض (IDOR) في الإدراج الذي يقبل `patient_id`.

| الموديول | المسارات |
| -------- | -------- |
| السجلات الطبية | files (GET), requests (GET/POST/PUT), coding (GET/POST) |
| الصيدلية السريرية | reviews (GET/POST/PUT), education (GET/POST) — `interactions` تبقى مرجعية عالمية |
| إعادة التأهيل | patients (GET/POST), sessions (GET/POST), goals (GET/POST/PUT) |
| بوابة المرضى | users (GET/POST), appointments (GET/PUT) |
| التغذية | dietary/orders (GET/POST/PUT), dietary/meals (POST/PUT), nutrition/assessments (GET/POST) |

### 1.2 `db_postgres.js` — تهيئة idempotent
- `ADD COLUMN IF NOT EXISTS tenant_id, facility_id` لـ 13 جدولاً.
- `CREATE INDEX IF NOT EXISTS idx_<t>_tenant` لكل جدول.
- backfill `SET tenant_id=1, facility_id=1 WHERE tenant_id IS NULL` (single-tenant آمن).
- **ملاحظة**: الإنتاج يتخطّى التهيئة (المرحلة 106) → لا يتأثّر تلقائياً → يحتاج نشر SQL مُعتمَد (Gate 9).

---

## 2. الحفاظ على سلامة الإنتاج الحالي (single-tenant)

- النمط الشرطي `if (tenantId)` + `requireTenantScope` يضمن:
  - dev (tenantId=1): الفلتر يُطبَّق، والأعمدة موجودة (التهيئة المحلية أضافتها).
  - الإنتاج: 403 عند غياب السياق؛ ولا يُطبَّق الكود حتى يُنشر مع DDL الأعمدة.
- **لم يُكسر أي مسار قائم**؛ المسارات غير المعنية لم تُمسّ.

---

## 3. التحقق الفعلي (قراءة-فقط على قاعدة dev المحلية)

عند تشغيل الخادم محلياً (عبر e2e harness)، نفّذت التهيئة الترحيل بنجاح:

```
Tables WITH tenant_id after startup init: 13 / 13
Missing: NONE
rehab_patients: null_tenant=0 | portal_users: null_tenant=0 | diet_orders: null_tenant=0
```

- ✅ الأعمدة أُضيفت فعلياً، والـ backfill نجح، والخادم أقلع دون أخطاء مع الكود المعدّل.

---

## 4. خارج نطاق هذه المرحلة (موثّق للموجات التالية)

- **الموجة 2 (Class A)**: بنك الدم (units/donors/crossmatch/transfusions)، الموافقات، package_sessions — SQL مُعدّ (مُعلّق في up.sql) + يحتاج إصلاح كود.
- **الموجة 2 (Class B — آمن للنشر، كود فقط)**: telemedicine, pathology, social_work, mortuary, zatca — تحمل `tenant_id` لكن handlers لا تصفّي بعد.
- **الموجة 3**: internal_messages (نموذج sender/receiver)، cssd, cme، والموديولات منخفضة الـ PII.

`CODE_REMEDIATION_REPORT_COMPLETE (الموجة 1)`
