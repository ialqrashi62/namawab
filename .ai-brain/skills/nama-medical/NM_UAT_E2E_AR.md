# NM_UAT_E2E — اختبارات القبول والـ E2E للنظام

## متى تُستخدم
قبل أي نشر، بعد أي تغيير كود، وفي كل بوابة تحتاج تحقق وظيفي.

## الهدف
ضمان أن النظام يعمل وظيفياً من منظور المستخدم عبر اختبارات آلية وتحقق حقيقي.

## قواعد إلزامية
```
EVIDENCE_REQUIRED: YES — PASS يتطلب إخراج أوامر حقيقي
NO_CLAIMED_PASS: YES — لا ادعاء نجاح بدون إثبات
SKIPPED_TESTS: DOCUMENT_REASON — كل test مُتجاوز يحتاج سبب مكتوب
ROLE_BASED_TESTS: YES — اختبر كل دور رئيسي
CROSS_TENANT_TEST: YES — اختبر عزل المستأجرين
AUTH_TESTS: YES — اختبر login/logout/session expiry
REGRESSION_TEST: YES — اختبر الميزات القديمة بعد كل تغيير
REAL_COMMAND_OUTPUT: YES — اعرض الإخراج الحقيقي للأوامر
```

## أنواع الاختبارات
```
UNIT: Jest unit tests (node run_safe_tests.js)
INTEGRATION: node clinical_dental_rehab_integration_test.js
E2E_SMOKE: node e2e_local_smoke_test.js
E2E_PLAYWRIGHT: Playwright browser tests (إن توفرت)
MANUAL_UAT: تحقق يدوي من المتصفح لـ UI-heavy tests
```

## خطوات التنفيذ
```bash
# 1. Unit tests
node run_safe_tests.js
# المتوقع: N passed, 0 failed

# 2. Integration tests (يحتاج DB)
node run_all_tests.js
# المتوقع: N passed, 0 failed

# 3. Smoke test
node e2e_local_smoke_test.js
# المتوقع: PASS على كل endpoints حيوية

# 4. تحقق بعد التغيير
# اختبر الميزة المُعدَّلة + الميزات المجاورة
```

## معايير PASS
```
unit_tests: 103/103 passed (0 failed)
integration_tests: 86/86 passed (DB required)
smoke_tests: PASS على /api/health, /login, /dashboard
cross_tenant_test: PASS
auth_test: PASS (login 200, logout 200, unauth 401)
```

## أدلة النجاح
- إخراج `run_safe_tests.js` يُظهر `0 failed`
- إخراج smoke test يُظهر PASS
- لا 500 errors في PM2 logs بعد الاختبار

## حالات الحظر
- unit tests فاشلة → BLOCKED_UNIT_TESTS_FAILED
- smoke test فاشل → BLOCKED_SMOKE_TEST_FAILED
- cross-tenant leak → BLOCKED_CROSS_TENANT_LEAK
- لا إخراج أوامر حقيقي → BLOCKED_NO_EVIDENCE

## صيغة التقرير المختصر
```
UAT_GATE: PASS/BLOCKED
unit_tests: N/N passed | integration_tests: N/N passed
smoke_test: PASS/FAIL | cross_tenant_test: PASS/FAIL
auth_test: PASS/FAIL | skipped_tests: N (reasons documented)
evidence_provided: YES/NO
```
