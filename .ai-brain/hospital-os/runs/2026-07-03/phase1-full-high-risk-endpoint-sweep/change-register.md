# Change Register

| الملف | التغيير |
|---|---|
| `namaweb/server.js` | توحيد tenant scope وRBAC على المسارات عالية الخطورة |
| `namaweb/server.js` | إضافة/استخدام `patientBelongsToTenant` في تدفقات حساسة |
| `namaweb/server.js` | إضافة tenant predicates وختم tenant/facility في مسارات code-only |
| `namaweb/hospital_os_gate_static_test.js` | إضافة ماسح عام للمسارات عالية الخطورة |
| `namaweb/run_safe_tests.js` | زيادة maxBuffer وtimeout لمخرجات/اختبارات static الطويلة |
| `docs/HOSPITAL_OS_PHASE1_FULL_HIGH_RISK_ENDPOINT_SWEEP_AR.md` | تقرير عربي شامل |
