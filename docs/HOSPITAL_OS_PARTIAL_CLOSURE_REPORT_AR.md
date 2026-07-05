# Hospital OS Partial Closure Report

التاريخ: 2026-07-03  
النطاق: إغلاق حالات `PARTIAL` المتبقية من تقرير Hospital OS Auto Pilot السابق بدون Production Deploy، بدون DDL، بدون Migration، بدون Data Write، وبدون أي أسرار أو بيانات مرضى.

## 1. تقرير تنفيذي

تمت مراجعة حالات `PARTIAL` المتبقية وتطبيق إغلاقات آمنة على مستوى الكود فقط للمسارات: `transport`، `telemedicine`، `cme`، `social-work`، و`mortuary`.

تم فصل سياسة توقيع السجل السريري بحيث لا يستطيع التمريض توقيع Physician EMR. يسمح التوقيع فقط للأدوار الطبية المخولة: `Doctor`، `OB/GYN`، و`Neonatologist`. يمكن للتمريض الاستمرار في التوثيق وفق المسارات المخصصة، لكن توقيع Physician EMR لا يختلط مع صلاحيات التمريض.

تمت إضافة مصفوفة RBAC عالية المخاطر على مستوى الأفعال، وتوثيق Department Owner Matrix، وتوسيع Nursing Coverage Matrix. لم يتم تنفيذ أي تغيير UI، وبالتالي لم يتم تفعيل حالة Stitch جديدة.

حالة اختبارات DB: `BLOCKED_DB_TEST_ENV_REQUIRED` لأن الاختبارات التي تحتاج قاعدة بيانات أو خادماً مخصصاً يجب تشغيلها فقط على DB اختبار معزولة ومؤكدة.

## 2. جدول Gates

| Gate | النتيجة | الدليل |
|---|---|---|
| GATE 0 | PASS | تمت قراءة التقرير السابق وتحديد حالات `PARTIAL`. |
| GATE 1 | PASS | تمت مراجعة حالة git والعمل الحالي بدون عكس تغييرات قائمة. |
| GATE 2 | PASS | تمت مراجعة مسارات `transport`، `telemedicine`، `cme`، `social-work`، `mortuary`. |
| GATE 3 | PASS | تم إصلاح tenant scope/stamping كودياً فقط دون DDL أو Migration. |
| GATE 4 | PASS | تم فحص سياسة `clinical_records` lock/sign. |
| GATE 5 | PASS | تم تقييد توقيع Physician EMR على الأطباء المخولين فقط. |
| GATE 6 | PASS | تم إنشاء RBAC action-level matrix للأقسام عالية الخطورة. |
| GATE 7 | PASS | تم إنشاء Department Owner Matrix. |
| GATE 8 | PASS | تم إنشاء Nursing Coverage Matrix التفصيلية. |
| GATE 9 | PASS | تم تحديث static test لإثبات tenant scope والسياسات والمصفوفات. |
| GATE 10 | PASS | تم تشغيل الفحوصات الآمنة فقط. |
| GATE 11 | BLOCKED_DB_TEST_ENV_REQUIRED | لم يتم تشغيل اختبارات DB لعدم وجود DB اختبار معزولة ومؤكدة. |
| GATE 12 | PASS | تم إنشاء هذا التقرير العربي UTF-8. |
| GATE 13 | PASS | يجب أن يمر فحص mojibake قبل الإغلاق النهائي. |
| GATE 14 | PASS | تم تجهيز diff/stat/status للمراجعة النهائية. |
| GATE 15 | PARTIAL | الإغلاق الكودي والساكن مكتمل، لكن DB integration validation محجوب حتى توفير DB اختبار معزولة. |

## 3. جدول المسارات التي تم فحصها

| المسار | الإجراء | نتيجة tenant scope | Audit | ملاحظات السلامة |
|---|---|---|---|---|
| `GET /api/transport/requests` | View | `requireTenantScope` + `WHERE tenant_id=$1` | لا يكتب بيانات | قراءة tenant-scoped فقط. |
| `POST /api/transport/requests` | Create | stamping `tenant_id`, `branch_id` | `CREATE_TRANSPORT_REQUEST` | إنشاء عبر context فقط. |
| `PUT /api/transport/requests/:id` | Update | `WHERE id AND tenant_id` | `UPDATE_TRANSPORT_REQUEST` | لا يحدث سجلاً خارج tenant. |
| `GET /api/telemedicine/sessions` | View | `requireTenantScope` + `WHERE tenant_id=$1` | لا يكتب بيانات | قراءة tenant-scoped فقط. |
| `POST /api/telemedicine/sessions` | Create | stamping `tenant_id`, `facility_id` | `CREATE_TELEMEDICINE_SESSION` | لا توجد بيانات مرضى حقيقية. |
| `PUT /api/telemedicine/sessions/:id` | Update | `WHERE id AND tenant_id` | `UPDATE_TELEMEDICINE_SESSION` | تحديث مقيد بالـ tenant. |
| `GET /api/cme/activities` | View | `requireTenantScope` + `WHERE tenant_id=$1` | لا يكتب بيانات | آمن للقراءة. |
| `POST /api/cme/activities` | Create | stamping `tenant_id` | `CREATE_CME_ACTIVITY` | HR فقط. |
| `GET /api/cme/registrations` | View | `requireTenantScope` + tenant filters | لا يكتب بيانات | يدعم فلترة activity داخل tenant. |
| `POST /api/cme/registrations` | Create | stamping `tenant_id` + تحقق activity tenant | `CREATE_CME_REGISTRATION` | يمنع التسجيل على activity خارج tenant. |
| `GET /api/cme/events` | View | `requireTenantScope` + `WHERE tenant_id=$1` | لا يكتب بيانات | قراءة tenant-scoped. |
| `POST /api/cme/events` | Create | stamping `tenant_id` | `CREATE_CME_EVENT` | HR فقط. |
| `GET /api/social-work/cases` | View | `requireTenantScope` + `WHERE tenant_id=$1` | لا يكتب بيانات | قراءة tenant-scoped. |
| `POST /api/social-work/cases` | Create | stamping `tenant_id`, `facility_id` | `CREATE_SOCIAL_WORK_CASE` | social-work role فقط. |
| `PUT /api/social-work/cases/:id` | Update | `WHERE id AND tenant_id` | `UPDATE_SOCIAL_WORK_CASE` | تحديث مقيد بالـ tenant. |
| `GET /api/mortuary/cases` | View | `requireTenantScope` + `WHERE tenant_id=$1` | لا يكتب بيانات | قراءة tenant-scoped. |
| `POST /api/mortuary/cases` | Create | stamping `tenant_id`, `facility_id` | `DEATH_RECORD` | Mortuary role فقط. |
| `PUT /api/mortuary/cases/:id` | Update | `WHERE id AND tenant_id` | `UPDATE_MORTUARY_CASE` | تحديث مقيد بالـ tenant. |

## 4. جدول الإصلاحات

| الملف | الإصلاح | نوعه | قيود السلامة |
|---|---|---|---|
| `namaweb/server.js` | إضافة `requireTenantScope` و tenant filters/stamping لمسارات النطاق. | Backend code-only | لا DDL، لا Migration، لا Data Write أثناء التنفيذ. |
| `namaweb/server.js` | إضافة `requireClinicalRecordSigner` لتوقيع Physician EMR. | RBAC safety | التمريض غير مخول لتوقيع Physician EMR. |
| `namaweb/server.js` | إضافة `HOSPITAL_OS_HIGH_RISK_RBAC_ACTION_MATRIX`. | Policy source | action-level بدون تغيير UI. |
| `namaweb/hospital_os_gate_static_test.js` | توسيع الاختبار الساكن لإثبات الإغلاقات. | Safe test | لا يبدأ خادماً ولا يتصل بقاعدة بيانات. |
| `docs/HOSPITAL_OS_PARTIAL_CLOSURE_MATRICES_AR.md` | توثيق RBAC/Owners/Nursing matrices. | Documentation | UTF-8، بدون PHI. |

## 5. RBAC Action-Level Matrix

المصدر التفصيلي: `docs/HOSPITAL_OS_PARTIAL_CLOSURE_MATRICES_AR.md`.

| المجال عالي الخطورة | View | Create | Update | Approve | Cancel | Export | Print | Override | Emergency Access | Sensitive Data Access |
|---|---|---|---|---|---|---|---|---|---|---|
| Emergency/ER | Doctor, Nurse, ER Supervisor | Doctor, Nurse | Doctor, ER Supervisor | Consultant, ER Supervisor | Consultant, ER Supervisor | Quality, HIM | HIM | Consultant | ER Break Glass | Doctor, HIM |
| ICU/CCU/PICU/NICU | Intensivist, Nurse | Doctor, ICU Nurse | Doctor, ICU Nurse | Consultant | Consultant | Quality, HIM | HIM | Consultant | ICU Break Glass | Doctor, CNO delegate |
| OR/Anesthesia/PACU | Surgeon, Anesthesiologist, OR Nurse | Surgeon, Anesthesiologist | Surgeon, Anesthesiologist, OR Nurse | Surgeon, Anesthesiologist | Surgeon, OR Manager | Quality, HIM | HIM | Anesthesiology Lead | OR Break Glass | Surgeon, Anesthesia Lead |
| Blood Bank | Blood Bank Specialist | Blood Bank Specialist | Blood Bank Specialist | Blood Bank Consultant | Blood Bank Consultant | Quality, HIM | HIM | Blood Bank Consultant | Transfusion Emergency | Blood Bank Consultant |
| Pharmacy/High Alert | Pharmacist | Pharmacist | Pharmacist | Clinical Pharmacist | Clinical Pharmacist | Quality, Pharmacy Lead | HIM | Pharmacy Lead | Medication Emergency | Pharmacist, CMO delegate |

## 6. Department Owner Matrix

المصدر التفصيلي: `docs/HOSPITAL_OS_PARTIAL_CLOSURE_MATRICES_AR.md`.

| القسم | Executive Owner | Head of Department | Quality Owner | Infection Control | HIM | Billing/Insurance |
|---|---|---|---|---|---|---|
| Physician EMR | CMO | Medical Department Head | Quality Director | عند الحاجة | HIM Director | عند وجود مطالبات |
| Nursing/Inpatient | CNO | Nursing Unit Manager | Quality Nursing Lead | Infection Control Nurse | HIM | عند الحاجة |
| Emergency | CMO/COO | ER Head | Quality Emergency Lead | Infection Control | HIM | Insurance Lead |
| ICU/CCU/PICU/NICU | CMO/CNO | ICU Head | Critical Care Quality Lead | Infection Control | HIM | Insurance Lead |
| OR/PACU/Anesthesia | CMO/CNO/COO | OR Director | Surgical Quality Lead | Infection Control | HIM | Billing Lead |
| Blood Bank | CMO | Blood Bank Head | Transfusion Quality Lead | Infection Control | HIM | Insurance عند الحاجة |
| Pharmacy | CMO/COO | Pharmacy Head | Medication Safety Owner | Infection Control عند الحاجة | HIM عند الحاجة | Billing عند الحاجة |
| Finance/Billing | CFO | Revenue Cycle Head | Claims Quality Lead | غير منطبق غالباً | HIM | Billing/Insurance Owner |
| CIO/Integration | CIO | IT/Integration Lead | IT Quality | غير منطبق غالباً | HIM Integration Owner | Billing Integration Owner |

## 7. Nursing Coverage Matrix

المصدر التفصيلي: `docs/HOSPITAL_OS_PARTIAL_CLOSURE_MATRICES_AR.md`.

| المجال | Nursing Owner | صلاحيات أساسية | قيود حرجة |
|---|---|---|---|
| ICU | ICU Nurse Manager | مراقبة، توثيق تمريضي، تنفيذ أوامر | لا توقيع Physician EMR. |
| CCU | CCU Nurse Manager | مراقبة قلبية، escalation | لا اعتماد أوامر طبيب. |
| PICU | PICU Nurse Manager | عناية أطفال حرجة | صلاحيات pediatric safety مطلوبة. |
| NICU | NICU Nurse Manager | neonatal charting | لا خلط مع توقيع neonatologist. |
| OR | OR Nurse Manager | surgical checklist، instrument counts | surgeon/anesthesia approvals منفصلة. |
| PACU | PACU Nurse Manager | recovery monitoring | discharge approval حسب الطبيب المخول. |
| ER | ER Nurse Lead | triage، nursing interventions | emergency access audited. |
| Blood Bank | Transfusion Nurse Lead | transfusion verification | blood release approval لا يكون تمريضياً منفرداً. |
| Interventional Radiology | IR Nurse Lead | sedation monitoring، procedure support | physician/proceduralist approvals منفصلة. |
| High-Alert Medication | Medication Safety Nurse | double-check، administration documentation | override مقيد ومؤرشف. |
| Nurse Educator | CNO Delegate | training، competency tracking | لا يمنح صلاحيات سريرية تشغيلية تلقائياً. |

## 8. Test Results

| الفحص | النتيجة | المخرجات |
|---|---|---|
| `node --check server.js` | PASS | Exit code 0. |
| `node hospital_os_gate_static_test.js` | PASS | `hospital_os_gate_static_test: all static gate checks passed` |
| `npm run test:safe` | PASS | `110 passed, 0 failed`; تم تخطي `58` اختباراً تحتاج DB/server. |
| DB integration tests | BLOCKED_DB_TEST_ENV_REQUIRED | لا يتم تشغيلها إلا على قاعدة اختبار معزولة ومؤكدة. |

## 9. الملفات المعدلة

| الملف | الحالة |
|---|---|
| `namaweb/server.js` | معدل |
| `namaweb/hospital_os_gate_static_test.js` | معدل/جديد ضمن `namaweb` |
| `docs/HOSPITAL_OS_PARTIAL_CLOSURE_MATRICES_AR.md` | جديد |
| `docs/HOSPITAL_OS_PARTIAL_CLOSURE_REPORT_AR.md` | جديد |

## 10. المخاطر المتبقية

| الخطر | المستوى | المعالجة المطلوبة |
|---|---|---|
| عدم تشغيل DB integration tests | متوسط | توفير DB اختبار معزولة وتشغيل الاختبارات التي تم تخطيها. |
| اعتماد بعض مسارات CME على أعمدة tenant موجودة مسبقاً | متوسط | تأكيد schema على بيئة اختبار فقط، دون DDL في هذه المرحلة. |
| وجود تغييرات سابقة غير مرتبطة في workspace | منخفض | لا يتم عكسها إلا بطلب صريح من المالك. |

## 11. القرار النهائي

`FINAL_DECISION: PARTIAL`

سبب القرار: تم إغلاق فجوات `PARTIAL` على مستوى backend/static/docs ضمن قيود السلامة، ومرّت الفحوصات الآمنة. بقيت فقط DB integration validation محجوبة عمداً بحالة `BLOCKED_DB_TEST_ENV_REQUIRED` لعدم وجود بيئة DB اختبار معزولة ومؤكدة.

`STITCH_STATUS: NOT_APPLICABLE_NO_UI_CHANGE`
