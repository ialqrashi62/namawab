# P1 fail-closed — 04 تقرير الاختبارات (Test Report)

> التاريخ: 2026-06-20 | `cross_tenant_facility_failclosed_test.js` (50/50) + `cross_tenant_facility_entitlement_test.js` (41/41) + انحدار 21/21.

## مصفوفة السيناريوهات المطلوبة

| Scenario | Expected | Actual | Status |
| -------- | -------- | ------ | ------ |
| common path بدون facility type (dashboard/settings) | PASS | 200 | ✅ |
| health بدون facility type | PASS | 200 | ✅ |
| auth/login لا ينكسر | PASS | 200 | ✅ |
| sensitive clinical path بدون نوع (patients/emr/admissions/emergency/surgery/icu) | 403 | 403 | ✅ |
| sensitive financial path بدون نوع (invoices/insurance/finance/reports) | 403 | 403 | ✅ |
| sensitive pharmacy path بدون نوع (pharmacy) | 403 | 403 | ✅ |
| sensitive lab/radiology path بدون نوع | 403 | 403 | ✅ |
| sensitive inventory path بدون نوع (inventory) | 403 | 403 | ✅ |
| sensitive HR path بدون نوع (hr/employees) | 403 | 403 | ✅ |
| خطأ قراءة company_settings على مسار حساس | fail-closed 403 | 403 | ✅ |
| خطأ قراءة على مسار عام/health | يمرّ (لا يكسر) | 200 | ✅ |
| unknown facility type | 422 | 422 | ✅ |
| known but not entitled | 403 | 403 | ✅ |
| direct API bypass deep path (surgeries/9/anesthesia، icu/monitoring/5) | 403 | 403 | ✅ |
| unclassified path بدون نوع | 403 | 403 | ✅ |
| unclassified path حتى للنوع الكامل (large_hospital) | 403 (default-deny) | 403 | ✅ |
| Medical City full access | PASS | 200 | ✅ |
| Health Center blocked from inpatient/OR/ICU | 403 | 403 | ✅ |
| Pharmacy Only blocked from EMR/inpatient/lab/radiology | 403 | 403 | ✅ |
| Lab Only blocked from pharmacy/EMR/inpatient | 403 | 403 | ✅ |
| Radiology Only blocked from pharmacy/lab/EMR | 403 | 403 | ✅ |
| RLS P0 no context/tenant1/tenant999 | PASS | 9/9 binding | ✅ |
| pool.query/pool.connect regression | PASS | binding 9/9 | ✅ |

## فحص الربط الثابت في server.js
- `isCommonModule` مستخدم ✅ | خطأ قراءة→403 ✅ | missing→403 ✅ | `ft.error` معالَج ✅ | getFacilityType يُبلّغ الخطأ ✅ | **لا fail-open عام** (`catch→next`) ✅.

## الانحدار
- 21/21 حزمة `cross_tenant_*` exit 0 (منها RLS P0 binding 9/9). `node --check` OK.

`TEST_REPORT_COMPLETE — 50/50 + 41/41 + REGRESSION 21/21 PASS`
