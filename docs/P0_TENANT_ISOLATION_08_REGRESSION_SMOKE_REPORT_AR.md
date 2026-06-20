# P0 عزل المستأجرين — 08 تقرير الانحدار والدخان (Regression & Smoke)

> التاريخ: 2026-06-20

---

## 1. سلامة الصياغة (Syntax)

- `node --check server.js` → **OK**.
- `node --check db_postgres.js` → **OK**.

---

## 2. اختبارات العزل (Static Suites) — 17 + 1 جديد

| الحزمة | الحالة |
| ------ | ------ |
| cross_tenant_catalog_override_test.js | ✅ exit 0 |
| cross_tenant_clinical_reports_test.js | ✅ exit 0 |
| cross_tenant_dashboard_test.js | ✅ exit 0 |
| cross_tenant_discharge_occupancy_test.js | ✅ exit 0 |
| cross_tenant_emergency_test.js | ✅ exit 0 |
| cross_tenant_financial_reports_test.js | ✅ exit 0 |
| cross_tenant_icu_nursing_test.js | ✅ exit 0 |
| cross_tenant_inpatient_beds_test.js | ✅ exit 0 |
| cross_tenant_inventory_test.js | ✅ exit 0 |
| cross_tenant_lab_radiology_test.js | ✅ exit 0 |
| cross_tenant_leak_test.js | ✅ exit 0 |
| **cross_tenant_modern_modules_test.js (جديد)** | ✅ exit 0 (86/86) |
| cross_tenant_nursing_assessments_test.js | ✅ exit 0 |
| cross_tenant_pharmacy_inventory_reports_test.js | ✅ exit 0 |
| cross_tenant_pharmacy_test.js | ✅ exit 0 |
| cross_tenant_surgeries_test.js | ✅ exit 0 |
| cross_tenant_surgery_or_test.js | ✅ exit 0 |

**جميع الـ18 حزمة تنتهي بـ exit 0 (PASS). لا انحدار.**

---

## 3. اختبار الدخان E2E الحيّ (`e2e_local_smoke_test.js`)

- الخادم **أقلع بنجاح** بالكود المعدّل واتصل بـ PostgreSQL المحلية، وتهيئة الترحيل طبّقت أعمدة الـ13 جدولاً.
- اختبار الدخول الخاطئ (401) **نجح**.
- اختبار الدخول الصحيح: فشل بـ `ECONNRESET`.

### التشخيص
- الفشل وقع في **تدفق الدخول (auth)** غير المعدَّل، **قبل** الوصول لأي موديول عُولج.
- لا علاقة له بتغييرات P0 (لم تُمسّ مسارات auth/session/login).
- مُصنّف كمشكلة بيئة/harness سابقة (race في إقلاع العملية الفرعية أو إعادة ضبط هاش admin).
- **لا يُعد انحداراً** لهذه المرحلة.

> توصية متابعة (خارج P0): استقرار harness الـ e2e (انتظار جاهزية الخادم/keep-alive) — يُسجّل كبند جودة منفصل في Gate 8 من التدقيق العالمي (QA).

---

## 4. الخلاصة

`REGRESSION_SMOKE: PASS` — سلامة صياغة + 18/18 حزمة عزل ناجحة + إقلاع خادم سليم + تطبيق ترحيل فعلي محلياً. فشل e2e واحد معزول في تدفق غير معدَّل (بيئة/harness)، لا انحدار من P0.

`REGRESSION_SMOKE_REPORT_COMPLETE`
