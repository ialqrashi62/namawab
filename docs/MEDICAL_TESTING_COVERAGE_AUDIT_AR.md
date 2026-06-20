# تدقيق التغطية الاختبارية (Testing Coverage Audit)

> التاريخ: 2026-06-20 | الأدلة: 19 ملف `cross_tenant_*` + `e2e_local_smoke_test.js` + `tenant_context_pg_session_test.js`. مرجع: `GLOBAL_AUDIT_08_QA_TESTING_COVERAGE`.

## 1. الموجود فعلياً
- **اختبارات عزل المستأجرين (static + simulation)**: 18 حزمة `cross_tenant_*` (المرضى/الفواتير/المواعيد/المختبر/الأشعة/الصيدلية/المخزون/لوحات/تقارير مالية/سريرية/الجراحة/OR/التنويم/الطوارئ/ICU/التمريض/الإفراغ/تجاوز الكتالوج/modern_modules/wave2).
- **اختبار ربط RLS (DB-backed)**: `cross_tenant_app_tenant_binding_test.js` (9/9 — query/connect/txn/missing-ctx/isolation/leakage).
- **E2E حيّ**: `e2e_local_smoke_test.js` (يقلع الخادم + login).
- **سياق PG**: `tenant_context_pg_session_test.js`.
- **لا إطار رسمي** (Jest/Mocha)، **لا `npm test`**، **لا CI**.

## 2. مصفوفة التغطية

| Module | Critical Scenario | Existing Test | Missing Test | Risk if Untested | Priority | Suggested Test File |
| ------ | ----------------- | ------------- | ------------ | ---------------- | -------- | ------------------- |
| المرضى | عزل + IDOR | ✅ leak_test | unit منطق التكرار/MRN | سجلات مكرّرة | P2 | unit_patient_logic_test.js |
| المواعيد | conflict/dup/noshow | ✅ (عزل) | اختبار conflict منطقي | حجز متعارض | P2 | appointment_logic_test.js |
| الصيدلية | عزل + خصم | ✅ pharmacy | **FEFO/منع منتهٍ/لا خصم قبل صرف** | صرف منتهٍ/خطأ مخزون | **P1** | pharmacy_stock_fefo_test.js |
| المختبر | عزل | ✅ lab_radiology | **فصل verify/approve** | نتيجة غير معتمدة | P1 | lab_result_approval_test.js |
| الأشعة | عزل | ✅ | **اعتماد أخصائي** | تقرير غير معتمد | P1 | radiology_approval_test.js |
| الفوترة | عزل | ✅ financial | refund/cancel/عكس | عكس خاطئ | P1 | billing_reversal_test.js |
| التأمين | عزل | ⚠️ ضمن clinical | دورة مطالبة/رفض/EDI | تحصيل ناقص | P1 | insurance_claim_cycle_test.js |
| المحاسبة | — | ❌ | **ترحيل آلي صحيح** | دفاتر خاطئة | **P1** | accounting_posting_test.js |
| المخزون | عزل | ✅ inventory | تقييم/تحويل | تقييم خاطئ | P2 | inventory_valuation_test.js |
| المشتريات | — | ❌ | PO/GRN/3-way | استلام/AP خاطئ | P1 | procurement_flow_test.js |
| نوع المنشأة | إنفاذ API | ❌ | **حجب API لموديول غير مفعّل** | تجاوز عبر API | **P1** | facility_entitlement_api_test.js |
| SaaS tenant | onboarding | ❌ | provisioning/suspend | — | P1 | tenant_lifecycle_test.js |
| الأمن | IDOR/CSRF/XSS | ⚠️ (IDOR ضمن عزل) | CSRF/XSS/قفل حساب | اختراق | P1 | security_suite_test.js |
| كل الموديولات | regression في CI | ❌ لا CI | تشغيل آلي عند push | انحدار صامت | P1 | .github/workflows/ci.yml |

## 3. قسم RLS P0 (مُغطّى — PASS)
| السيناريو | الاختبار | الحالة |
| --------- | -------- | ------ |
| `app.tenant_id` يُضبط داخل السياق | binding test #2 | ✅ |
| `pool.query` (wrapper) | binding #2,3 | ✅ |
| `pool.connect` + transaction | binding #6,7 | ✅ |
| missing tenant context → لا ضبط/المسار الأصلي | binding #1,8 | ✅ |
| FORCE RLS protected tables (إنتاج، app user) | تحقق Gate4 (0→3→0) | ✅ |
| tenant=1 / no context / tenant=999 | binding #5 + إنتاج | ✅ |
| عدم التسرّب (تتابعي + متزامن + reset) | binding #3,4,5,7 | ✅ |

## 4. الخطة المقترحة
1. تبنّي **Jest** + `npm test` + هيكلة.
2. **CI** (GitHub Actions) يشغّل كل `cross_tenant_*` + الجديدة عند push.
3. سدّ فجوات P1: FEFO الصيدلية، اعتماد المختبر/الأشعة، الترحيل المحاسبي، دورة التأمين، **إنفاذ نوع المنشأة على API**، أمن (CSRF/XSS/قفل).
4. Unit/Integration بعد استخراج service layer. E2E (Playwright) لأهم التدفّقات.

## 5. الخلاصة
`QA_STATUS: WARNING` — تغطية عزل المستأجرين **ممتازة** (19 حزمة + binding، RLS P0 مُغطّى)، لكن: لا إطار رسمي/CI، ولا اختبارات منطق عمل حرج (محاسبة/FEFO/اعتماد/تأمين/مشتريات/إنفاذ نوع منشأة).

`TESTING_COVERAGE_AUDIT_COMPLETE`
