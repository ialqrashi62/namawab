# Hospital OS Phase 1 - P0 Safety, Tenant, RBAC, Audit

التاريخ: 2026-07-03  
النطاق: بدء إغلاق Phase 1 من خطة Auto Pilot، مع التركيز على tenant scope، RBAC، audit، ومنع تسرب أو تعديل بيانات عالية الخطورة خارج نطاق المستأجر.  
القيود: لا Production Deploy، لا DDL، لا Migration، لا Data Write، لا أسرار، لا PHI، لا UI جديد.

## 1. النتيجة التنفيذية

تم تنفيذ موجة P0 آمنة على مستوى backend/static tests فقط. ركزت الموجة على مسارات عالية الخطورة في:

- المختبر وأوامر المختبر.
- الأشعة وأوامر الأشعة وملفات PHI.
- الفوترة والفواتير والدفع.
- clinical records الديناميكية.
- ICU assessments القديمة.
- Orthopedics implants/ROM القديمة.
- payment-first workflow بين الطبيب والاستقبال والمختبر/الأشعة.

تمت إضافة أو تقوية:
- `requireTenantScope`.
- `requireRole` حسب المجال.
- tenant predicates داخل `UPDATE` وعمليات reload.
- tenant stamping عند تسجيل `phi_files`.
- static tests لإثبات هذه الإغلاقات.

`FINAL_STATUS: PHASE1_P0_SAFETY_TENANT_RBAC_AUDIT_PARTIAL_DB_TESTS_BLOCKED`

سبب PARTIAL: الإصلاحات الساكنة والآمنة نجحت، لكن DB integration validation محجوب حتى توفر DB اختبار معزولة. كما أن Phase 1 أكبر من هذه الموجة، وما زالت تحتاج موجات لاحقة لمسح كل endpoints غير P0.

## 2. Gates

| Gate | النتيجة | الدليل |
|---|---|---|
| G0 Scope | PASS | تم تثبيت النطاق: Safety/Tenant/RBAC/Audit للأقسام عالية الخطورة. |
| G1 Safety Constraints | PASS | لا deploy، لا DDL، لا migration، لا DB writes يدوية. |
| G2 Existing State | PASS | تم فحص `server.js` و`hospital_os_gate_static_test.js`. |
| G3 Gap Mapping | PASS | تم ربط الفجوات بخطة Phase 1 وNo-Omission. |
| G4 Implementation | PASS | إصلاحات backend-only وstatic test فقط. |
| G5 Static Verification | PASS | `node --check server.js` وstatic test نجحا. |
| G6 Safe Tests | PASS | `npm run test:safe` نجح. |
| G7 DB Gate | BLOCKED_DB_TEST_ENV_REQUIRED | 58 اختباراً تحتاج DB/server ولم تُشغّل. |
| G8 ai-brain Closeout | PASS | تم إنشاء ملفات closeout المطلوبة. |
| G9 Final Decision | PARTIAL | Phase 1 بدأت وأغلقت موجة P0، لكنها لم تنته بالكامل. |

## 3. المسارات التي تم تقويتها

| المجال | المسارات | الإغلاق |
|---|---|---|
| Lab Orders | `GET/POST/PUT /api/lab/orders`, `POST /api/lab/orders/direct`, `GET /api/lab/orders/:id` | RBAC + tenant scope + tenant reload/update. |
| Radiology Orders | `GET/POST/PUT /api/radiology/orders`, `POST /api/radiology/orders/:id/upload` | RBAC + tenant scope + tenant reload/update. |
| PHI Files | `GET /api/phi-files/:id` | RBAC + tenant scope + `phi_files.tenant_id` stamping عند upload. |
| Invoices | `GET/POST /api/invoices`, `POST /api/invoices/generate`, `PUT /api/invoices/:id/pay`, `POST /api/invoices/cancel/:id` | tenant scope + tenant update/reload. |
| Payments | `POST /api/payments/moyasar/initiate` | tenant scope + tenant update على `payment_gateway_ref`. |
| Clinical Records | `GET/POST /api/clinical/records` | تصحيح `requireRole` من أسماء roles إلى modules: `doctor/nursing/obgyn`. |
| ICU Legacy | `POST /api/icu/assessments`, `GET /api/icu/assessments/patient/:patient_id` | RBAC أدق + tenant scope + تحقق patient tenant. |
| Orthopedics Legacy | implants وROM | RBAC أدق + tenant scope + تحقق patient tenant. |
| Payment-first Orders | pending payment وapprove payment | RBAC billing + tenant scope + tenant update. |

## 4. الإصلاحات

| الملف | التغيير |
|---|---|
| `namaweb/server.js` | إضافة/تقوية `requireTenantScope` و`requireRole` لمسارات P0. |
| `namaweb/server.js` | إضافة tenant predicates داخل updates/reloads لأوامر lab/radiology والفواتير والدفع. |
| `namaweb/server.js` | طباعة `tenant_id` عند تسجيل `phi_files` لملفات الأشعة. |
| `namaweb/server.js` | تصحيح `clinical_records` role modules. |
| `namaweb/hospital_os_gate_static_test.js` | إضافة assertions لإثبات tenant/RBAC/PHI/clinical records/legacy ICU/orthopedics/payment-first closures. |

## 5. Test Results

| الفحص | النتيجة |
|---|---|
| `node --check server.js` | PASS |
| `node --check hospital_os_gate_static_test.js` | PASS |
| `node hospital_os_gate_static_test.js` | PASS |
| `npm run test:safe` | PASS: 111 passed, 0 failed |
| DB/server tests | BLOCKED_DB_TEST_ENV_REQUIRED: 58 skipped |

## 6. المخاطر المتبقية

| الخطر | المستوى | القرار |
|---|---|---|
| عدم تشغيل DB integration tests | متوسط | محجوب حتى DB اختبار معزولة. |
| وجود routes أخرى خارج موجة P0 تحتاج مسحاً لاحقاً | متوسط | تُرحّل إلى الموجة التالية من Phase 1. |
| وجود تغييرات سابقة غير مرتبطة في `namaweb` | منخفض | لم يتم عكسها أو لمسها إلا ضمن النطاق الحالي. |
| audit tenant tagging الكامل يحتاج تأكيد schema | متوسط | لا DDL الآن؛ يؤجل لبيئة اختبار. |

## 7. القرار النهائي

بدأ تنفيذ المشروع على مراحل فعلياً. هذه موجة أولى من Phase 1 وليست نهاية Phase 1 كاملة.

`FINAL_DECISION: PARTIAL`

`NEXT_STEP: PHASE1_CONTINUE_FULL_HIGH_RISK_ENDPOINT_SWEEP`
