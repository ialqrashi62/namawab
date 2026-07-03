# المهمة

إكمال الموجة التالية من Phase 1 عبر مسح كامل للمسارات عالية الخطورة في backend وإغلاق فجوات tenant scope وRBAC بدون Production Deploy، وبدون DDL/Migration، وبدون Data Write، وبدون UI.

## النطاق

- `namaweb/server.js`
- `namaweb/hospital_os_gate_static_test.js`
- `namaweb/run_safe_tests.js`
- تقرير عربي في `docs/HOSPITAL_OS_PHASE1_FULL_HIGH_RISK_ENDPOINT_SWEEP_AR.md`

## القيود

- لا نشر إنتاج.
- لا DDL.
- لا Migration.
- لا اختبارات DB/server دون بيئة معزولة.
- لا أسرار ولا بيانات مرضى.
- لا UI جديد.
