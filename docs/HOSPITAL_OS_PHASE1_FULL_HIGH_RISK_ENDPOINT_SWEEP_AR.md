# تقرير Phase 1 - المسح الكامل للمسارات عالية الخطورة

التاريخ: 2026-07-03
الحالة: PHASE1_FULL_HIGH_RISK_ENDPOINT_SWEEP_PASS_STATIC_DB_TESTS_BLOCKED

## 1. التقرير التنفيذي

تم الانتقال إلى الموجة التالية من Phase 1 لإغلاق فجوات المسارات عالية الخطورة في `namaweb/server.js` بدون Production Deploy، وبدون DDL، وبدون Migration، وبدون كتابة بيانات، وبدون طباعة أسرار أو بيانات مرضى.

نتيجة الماسح الثابت بعد الإصلاح:

| المؤشر | النتيجة |
|---|---:|
| المسارات عالية الخطورة المفحوصة | 347 |
| مسارات بلا tenant scope | 0 |
| مسارات بلا RBAC/action guard | 0 |
| webhooks/callbacks الخارجية المستثناة | Moyasar callback و billing webhooks فقط |

## 2. جدول Gates

| Gate | النتيجة | الملاحظة |
|---|---|---|
| GATE 0 | PASS | استكمال موجة Phase 1 التالية بناء على تقرير المرحلة السابقة |
| GATE 1 | PASS | فحص git status؛ تم تجاهل تغييرات غير مرتبطة موجودة مسبقا |
| GATE 2 | PASS | مسح backend API high-risk routes |
| GATE 3 | PASS | إصلاح backend code-only دون DDL |
| GATE 4 | PASS | عدم تغيير سياسة توقيع Physician EMR في هذه الموجة |
| GATE 5 | PASS | لم يتم منح Nurse صلاحية توقيع Physician EMR |
| GATE 6 | PASS | كل المسارات عالية الخطورة أصبحت tenant + RBAC guarded |
| GATE 7 | PASS | لا تغيير جديد على Department Owner Matrix في هذه الموجة |
| GATE 8 | PASS | لا تغيير جديد على Nursing Matrix في هذه الموجة |
| GATE 9 | PASS | توسيع `hospital_os_gate_static_test.js` بماسح عام |
| GATE 10 | PASS | الفحوصات الآمنة نجحت |
| GATE 11 | BLOCKED | DB/server tests مؤجلة لبيئة DB معزولة فقط |
| GATE 12 | PASS | تم إنشاء تقرير عربي UTF-8 |
| GATE 13 | PASS | فحص mojibake مطلوب قبل الإغلاق |
| GATE 14 | PASS | تم عرض diff/stat/status |
| GATE 15 | PASS_STATIC_DB_TESTS_BLOCKED | إغلاق static كامل؛ DB validation blocked |

## 3. جدول المسارات التي تم فحصها

| المجموعة | أمثلة | الحالة |
|---|---|---|
| Appointments | appointments, followup, checkin, noshow, duplicate/conflict | مغلقة tenant + RBAC |
| Clinical/Medical | medical reports, medical records files/requests/coding, diagnosis templates | مغلقة tenant + RBAC |
| Pharmacy/Lab/Radiology | prescriptions, pharmacy queue/drugs/stock-log/deduct-stock, LIS routes, print prescription/lab | مغلقة tenant + RBAC |
| Emergency/Nursing/ICU | emergency visits/beds/stats/trauma, triage, vitals, care plans | مغلقة tenant + RBAC |
| Surgery/Consent | surgery preop tests, consent forms | مغلقة tenant + RBAC |
| Dietary/Rehab/Maintenance/CME | dietary orders, rehab patients, maintenance orders/work-orders, CME | مغلقة tenant + RBAC |
| External callbacks | Moyasar callback, billing webhooks | مستثناة من session RBAC؛ تحتاج gateway verification |

## 4. جدول الإصلاحات

| الملف | نوع الإصلاح |
|---|---|
| `namaweb/server.js` | إضافة `requireTenantScope` و`requireRole`/حراس صلاحيات إلى المسارات عالية الخطورة |
| `namaweb/server.js` | إضافة `patientBelongsToTenant` والتحقق من ملكية المريض في مسارات حساسة |
| `namaweb/server.js` | ختم `tenant_id` و`facility_id` في فواتير/زيارات/مواعيد/شهادات/صيانة حيث كان الإصلاح code-only |
| `namaweb/server.js` | إضافة tenant predicates في تحديثات/حذف/إعادة تحميل عدة سجلات |
| `namaweb/hospital_os_gate_static_test.js` | إضافة ماسح عام يمنع أي مسار high-risk بلا tenant scope أو RBAC |
| `namaweb/run_safe_tests.js` | زيادة `maxBuffer` وtimeout لمجمع الاختبارات حتى لا يفشل بسبب مخرجات عربية طويلة أو اختبار static طويل |

## 5. RBAC Action-Level Matrix

الموجة طبقت إغلاقا تنفيذيا على مستوى المسار: View/Create/Update/Print/Export/Approve/Cancel عبر `requireRole` أو حارس مخصص مثل `requireCatalogAccess` و`requireClinicalRecordSigner`.

| المجال | View | Create | Update/Approve | Print/Export | Sensitive Access |
|---|---|---|---|---|---|
| Pharmacy | pharmacy, doctor, nursing حسب المسار | doctor/pharmacy | pharmacy/doctor | pharmacy, doctor, HIM | pharmacy, doctor |
| Lab | lab, doctor | lab/doctor | lab | lab, doctor, HIM | lab, doctor |
| Emergency | emergency, doctor, nursing | emergency, doctor, nursing | emergency, doctor, nursing | HIM/doctor عند الطباعة | emergency, doctor, nursing |
| Surgery/Consent | surgery, doctor, nursing, consent | surgery/doctor/consent | surgery/doctor/nursing | doctor/HIM | doctor, nursing |
| Medical Records | doctor, HIM, medical-records | doctor/HIM حسب المسار | HIM/doctor | HIM/medical-records | HIM, doctor |
| Finance/Billing | invoices, accounts, finance | invoices/accounts | invoices/accounts | invoices/accounts | finance/accounts |

## 6. Department Owner Matrix

لم يتم تعديل matrix الوثائقية في هذه الموجة؛ بقيت مرجعية المرحلة السابقة نافذة. هذه الموجة نفذت الإغلاق البرمجي للمسارات فقط.

## 7. Nursing Coverage Matrix

لم يتم تعديل matrix الوثائقية في هذه الموجة؛ لكن تم تعزيز مسارات nursing vitals, triage, care-plans, dietary, emergency, ICU action access بالحراسة البرمجية.

## 8. Test Results

| الأمر | النتيجة |
|---|---|
| `node --check server.js` | PASS |
| `node --check hospital_os_gate_static_test.js` | PASS |
| `node hospital_os_gate_static_test.js` | PASS |
| `npm run test:safe` | PASS: 111 passed, 0 failed |
| DB/server tests | BLOCKED_DB_TEST_ENV_REQUIRED: 58 skipped تحتاج DB/server معزولة |

## 9. الملفات المعدلة

| الملف | الحالة |
|---|---|
| `namaweb/server.js` | معدل ضمن هذه الموجة |
| `namaweb/hospital_os_gate_static_test.js` | معدل/مضاف ضمن هذه الموجة |
| `namaweb/run_safe_tests.js` | معدل ضمن هذه الموجة |
| `public/js/app.js` | موجود كفرق سابق/غير من هذه الموجة |
| `.agents/AGENTS.md` | موجود كفرق سابق/غير من هذه الموجة |

## 10. المخاطر المتبقية

| الخطر | الحالة |
|---|---|
| التحقق العملي من schema على DB حقيقية | BLOCKED_DB_TEST_ENV_REQUIRED |
| webhooks/callbacks الخارجية | تحتاج سياسة gateway signature/verification منفصلة، ولا يجب حمايتها بجلسة مستخدم |
| احتمال وجود جداول tenant columns غير متوافقة في بيئة قديمة | يحتاج isolated DB validation |
| Production Deploy | لم يتم تنفيذه ضمن هذه المرحلة |

## 11. القرار النهائي

PASS_STATIC_DB_TESTS_BLOCKED

تم إغلاق فجوات static high-risk endpoint sweep بأمان. لا يوجد Production Deploy، ولا DDL، ولا Migration، ولا DB data write، ولا UI implementation.
