# تدقيق تغطية الاختبارات (Testing Coverage Audit)

> التاريخ: 2026-06-20 | مرجع: [GLOBAL_AUDIT_08_QA_TESTING_COVERAGE_AR.md](GLOBAL_AUDIT_08_QA_TESTING_COVERAGE_AR.md), [MEDICAL_TESTING_COVERAGE_AUDIT_AR.md](MEDICAL_TESTING_COVERAGE_AUDIT_AR.md).

## 1. الموجود (الحالة الراهنة — 24 ملف اختبار)
| النوع | الملفات | الأسلوب |
| ----- | ------- | ------- |
| عزل المستأجرين | 19 ملف `cross_tenant_*` (مرضى/فواتير/مواعيد/مختبر/أشعة/صيدلية/مخزون/لوحات/تقارير/جراحة/تنويم/طوارئ/ICU/تمريض/إفراغ/كتالوج/modern/wave2) | Static audit + محاكاة |
| ربط RLS P0 | `cross_tenant_app_tenant_binding_test.js` (9/9) | DB-backed (سياق/تسرّب/معاملة) |
| استحقاقات المنشأة | `cross_tenant_facility_entitlement_test.js` (41) + `cross_tenant_facility_failclosed_test.js` (50) | static + محاكاة |
| المحاسبة | `accounting_posting_test.js` (28) | دوال نقية |
| Staging (جديد) | `staging_failclosed_test.js`, `staging_posting_validation.js`, `staging_runtime_role_smoke.js` | DB-backed staging |
| E2E/سياق | `e2e_local_smoke_test.js`, `tenant_context_pg_session_test.js` | حيّ |

**الانحدار الراهن**: 22/22 حزمة (cross_tenant_* + accounting) exit 0 على كود ef1acf9.

## 2. الفجوات
| النوع | الحالة | أولوية |
| ----- | ------ | ------ |
| اختبارات عزل DB-backed حقيقية لكل موديول (لا static فقط) | جزئي (الأغلب static + محاكاة؛ binding + staging حقيقية) | P1 |
| اختبارات عزل لبنك الدم/الموافقات/الباقات | مفقودة (Class A) | P1 |
| Unit/Integration بإطار رسمي (Jest) | شبه معدوم (لا service layer) | P1 |
| CI pipeline | **لا CI** (تشغيل يدوي) | P1 |
| اختبارات أداء/حمل | مفقودة | P2 |
| E2E browser (Playwright) | مفقودة (Playwright متاح كأداة الآن) | P2 |
| اختبارات المحاسبة DB-backed عند التفعيل | staging موجودة؛ تحتاج توسعة عند go-live | P1 |

## 3. مصفوفة (موديول × سيناريو حرج)
| الموديول | سيناريو حرج | اختبار موجود | ناقص |
| -------- | ----------- | ------------ | ---- |
| المرضى | A لا يرى B | ✅ leak_test/binding | DB-backed لكل route |
| المحاسبة | قيد متوازن + idempotent + fail-closed | ✅ engine 28 + staging | go-live DB tests |
| نوع المنشأة | حجب 403 + تجاوز مباشر | ✅ 50/50 | live 403 بمستأجر مقيّد |
| بنك الدم | عزل | ❌ | مطلوب |
| RLS P0 | 0→tenant→0 | ✅ binding 9/9 | — |

## القرار
`TESTING_STATUS: WARNING (تحسّن)`. تغطية العزل + المحاسبة + الاستحقاقات قوية ومتنامية (24 ملف، 22/22). الفجوات: CI، إطار رسمي، DB-backed شامل، بنك الدم، E2E browser، load.

`TESTING_COVERAGE_AUDIT_COMPLETE`
