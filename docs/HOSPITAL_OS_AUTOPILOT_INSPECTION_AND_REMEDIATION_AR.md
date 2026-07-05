# تقرير Hospital OS Auto Pilot للفحص والعمل

التاريخ: 2026-07-03  
النظام: NamaMedical / `namaweb`  
اللغة والترميز: العربية UTF-8  
النطاق: فحص منظومة HIS/EMR/ERP كاملة مقابل مهارات Hospital OS، مع تنفيذ إصلاحات Backend آمنة لا تتطلب DDL أو Migration أو Deploy.

## 1. النتيجة التنفيذية

الحالة التنفيذية: `PARTIAL`

تم تنفيذ فحص Gate-by-Gate أولي على التطبيق الفعلي، وليس على وصف نظري فقط. تم اكتشاف تطبيق Express كبير داخل `namaweb` يغطي معظم أقسام المستشفى بواجهات API، جداول، migrations، اختبارات، ووثائق Stitch/RTL.

تم تنفيذ 5 إصلاحات Backend آمنة:

1. إلزام `requireTenantScope` على مسارات المرضى الأساسية.
2. جعل توليد رقم ملف المريض `file_number/MRN` tenant-scoped عند وجود tenant.
3. إصلاح tenant context في problem-list، ومنع غير المخولين سريرياً من إضافة ICD/SNOMED أو principal diagnosis.
4. تقييد قراءة/إنشاء clinical templates بملكية القسم للـ tenant.
5. إضافة اختبار ثابت: `namaweb/hospital_os_gate_static_test.js`.

لم يتم تنفيذ أي DDL أو Migration أو Production Deploy أو Data Write.

## 2. أدلة الفحص من الكود

| البند | النتيجة |
|---|---:|
| تطبيق الويب الرئيسي | `namaweb` |
| نوع التطبيق | Node.js + Express |
| ملف الخادم الرئيسي | `namaweb/server.js` |
| عدد مسارات Express المرصودة | 684 |
| ملفات SQL داخل `namaweb/migrations` | 234 |
| migrations صاعدة/أولية | 79 |
| ملفات validate SQL | 77 |
| ملفات SQL تلامس RLS أو policies | 191 |
| ملفات الاختبار بعد إضافة اختبار Hospital OS | 168 |
| اختبار آمن بلا DB | `npm run test:safe` |

## 3. الأقسام المشمولة

الأقسام التي لها شواهد API/DB/UI مباشرة:

- الاستقبال والمرضى: `patients`, `visits`, `bookings`.
- المواعيد وقائمة الانتظار: `appointments`, `queue`.
- محطة الطبيب والملف السريري: `doctor`, `clinical`, `medical-records`, `orders`, `results`.
- التمريض: `nursing`, `mar`, `emar`, `nursing_vitals`, `nursing_assessments`.
- الطوارئ والفرز: `emergency`, `er`, `ews`, ESI.
- التنويم والأسرة: `admissions`, `adt`, `wards`, `beds`, `bed-transfers`.
- العناية المركزة: `icu`.
- العمليات وما قبلها والتخدير والإفاقة: `surgery`, `surgeries`, `or`, `operating-rooms`, `anesthesia`, `surgery-preop-tests`.
- النساء والتوليد والأطفال: `obgyn`, `pediatrics`.
- التخصصات الدقيقة: `cardiology`, `gastro`, `endocrine`, `nephrology`, `neurology`, `pulmonology`, `rheumatology`, `orthopedics`, `ophthalmology`, `ent`, `dermatology`, `urology`, `plastic-burns`, `psychiatry`.
- المختبر والأشعة وعلم الأمراض: `lab`, `radiology`, `pathology`, `hl7`, `fhir`.
- بنك الدم: `bloodbank`, `blood-bank`.
- إعادة التأهيل والأسنان: `rehab`, `dental`.
- الصيدلية والصيدلية السريرية: `pharmacy`, `clinical-pharmacy`, `prescriptions`, `drug-interactions`.
- الفوترة والتأمين والمالية: `billing`, `invoices`, `payments`, `insurance`, `finance`, `cash-drawer`, `nphies`, `zatca`.
- الموارد البشرية والتعليم الطبي: `hr`, `employees`, `cme`.
- المخازن والأصناف وطلبات الأقسام والتعقيم: `inventory`, `catalog`, `dept-requests`, `cssd`.
- مكافحة العدوى والجودة: `infection`, `infection-control`, `quality`.
- التغذية ونقل المرضى والخدمة الاجتماعية وخدمة الوفيات: `dietary`, `nutrition`, `transport`, `social-work`, `mortuary`.
- السجلات والتقارير والبوابات: `him`, `medical-reports`, `reports`, `portal`, `telemedicine`, `messages`, `notifications`.
- الإعدادات والحوكمة: `settings`, `audit-trail`, `super-admin`, `admin`, `mfa`.

لا يوجد إسقاط كامل للأقسام الأساسية، لكن توجد تفاوتات في قوة العزل والصلاحيات بين الموديولات الحديثة والقديمة.

## 4. الأدوار الطبية والتمريضية والإدارية

الأدوار المرصودة في RBAC داخل `server.js` تشمل:

- أدوار طبية: `Doctor`, `OB/GYN`, `Neonatologist`, `Radiologist`, `Pathologist`.
- أدوار تمريضية: `Nurse`, `Midwife`.
- أدوار فنية/صيدلانية: `Pharmacist`, `Lab Technician`, `Blood Bank`, `CSSD Manager`.
- أدوار إدارية/مالية/تشغيلية: `Reception`, `Finance`, `Insurance`, `HR`, `Inventory Manager`, `IT`, `Quality Manager`, `Infection Control`, `HIM`.

الملاحظة: المصفوفة الحالية module-level أكثر من action-level. Hospital OS يتطلب لاحقاً تفصيل `View/Create/Update/Approve/Cancel/Export/Emergency Access/Sensitive Data Access` لكل عملية عالية الخطورة.

## 5. Nursing Matrix مختصر

| المجال | التغطية الحالية | قرار Gate |
|---|---|---|
| تمريض استقبال/فرز | موجود عبر queue/emergency/ESI | `PASS` أولي |
| تمريض عيادات ومحطة طبيب | موجود عبر vitals/clinical flows | `PASS` أولي |
| تمريض تنويم | موجود عبر ADT/nursing care plans | `PASS` أولي |
| تمريض ICU/CCU/PICU/NICU | ICU وpediatrics/obgyn موجودة، يحتاج فصل أكثر لـ PICU/NICU | `PARTIAL` |
| تمريض عمليات/PACU | surgery/anesthesia/PACU UI موجودة | `PASS` أولي |
| تمريض بنك الدم ونقل الدم | bloodbank workflows موجودة | `PASS` أولي |
| تمريض أدوية عالية الخطورة | MAR/eMAR مع witness/high-alert checks موجود | `PASS` أولي |
| Nurse Educator | موجود جزئياً عبر CME/education | `PARTIAL` |

## 6. RBAC وAudit

نقاط قوة:

- `requireRole` يسجل `BLOCKED_AUTHORIZATION`.
- `requireTenantScope` موجود ويمنع الطلبات بلا tenant في production.
- `audit_trail` موجود.
- يوجد middleware اختياري لـ auto-audit عند `AUDIT_ALL_MUTATIONS=true`.
- يوجد قفل وتوقيع EMR مع SHA-256 في عدة مسارات.

إصلاحات منفذة:

- مسارات `/api/patients`, `/api/patients/:id`, `POST /api/patients`, `PUT /api/patients/:id` أصبحت تمر عبر `requireTenantScope`.
- إعادة تحميل المريض بعد الإنشاء/التعديل أصبحت tenant-scoped.
- توليد `file_number` أصبح tenant-scoped عند وجود tenant.
- `problem-list` لم يعد يمرر كائن tenant context كقيمة tenant.
- غير الطبيب/OB-GYN/Neonatologist لا يستطيع إضافة diagnosis codes أو principal diagnosis.
- `clinical/templates` أصبحت مقيدة بملكية القسم للـ tenant.

نواقص متبقية:

- بعض المسارات القديمة مثل `transport`, `telemedicine`, `cme`, `social-work`, `mortuary` تحتاج مراجعة tenant stamping كاملة لأنها تستخدم استعلامات غير مقيّدة أو تعتمد على migrations مؤجلة.
- مسار `POST /api/clinical/records/:id/lock` ما زال يسمح بـ `Doctor` و`Nurse`. يجب حسم ما إذا كان هذا السجل generic nursing record أم physician EMR. إذا كان physician EMR فيجب قصره على الطبيب أو مسار توقيع تمريضي منفصل.
- `clinical_departments` ما زال موثقاً في migration e50 كحاجة إلى unique `(tenant_id, code)` بدل unique عالمي.

## 7. Workflow Matrix مختصر

| Workflow | الحالة |
|---|---|
| Patient registration → invoice opening fee → audit | `PARTIAL` بعد إصلاح tenant scope |
| Appointment → queue → vitals → doctor encounter | `PASS` أولي |
| CPOE orders → lab/radiology/pharmacy → results acknowledgement | `PASS` أولي |
| MAR/eMAR 5 rights + high-alert witness | `PASS` أولي |
| ED triage/EWS/critical alerts | `PASS` أولي |
| ADT bed admission/transfer/discharge | `PASS` أولي |
| OR/pre-op/anesthesia/PACU | `PASS` أولي |
| Blood bank crossmatch/transfusion/reaction/recall | `PASS` أولي |
| Insurance/NPHIES/ZATCA/Finance GL | `PASS` أولي مع بوابات live integration |
| Social work/mortuary/transport/telemedicine/CME | `PARTIAL` بسبب مراجعة tenant/RBAC متبقية |

## 8. Integration Matrix مختصر

| التكامل | شواهد |
|---|---|
| EMR/EHR | clinical/medical-records/templates/records |
| LIS | lab, LOINC, microbiology, HL7 |
| RIS/PACS | radiology, DICOM/PHI file gates |
| Pharmacy/MAR | prescriptions, pharmacy, MAR/eMAR |
| Billing/Insurance | invoices, billing, insurance, NPHIES |
| Finance/GL/ZATCA | finance, ZATCA Phase 2, GL posting |
| Inventory/CSSD | inventory, CSSD trays/cycles |
| Quality/Infection | quality incidents, infection surveillance |
| HR/CME | HR workforce, credentialing, CME |
| Patient Portal/Telemedicine/Messaging | portal, telemedicine, messages |
| Audit Log | audit_trail, logAudit, audit middleware |

## 9. Stitch Design Source

لا توجد واجهة UI جديدة تم تنفيذها في هذه الجولة، لذلك لا تنطبق حالة `STITCH_SOURCE_REQUIRED` على التعديلات المنفذة.

شواهد Stitch الموجودة:

- `namaweb/docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md`
- `namaweb/docs/STITCH_FULL_DESIGN_CLOSEOUT_REPORT_AR.md`
- `namaweb/docs/STITCH_MODULE_BATCH_PROGRESS_AR.md`
- `namaweb/public/css/styles.css`

أي تطوير UI لاحق يجب أن يبدأ من Stitch Source أو Stitch Prompt معتمد.

## 10. Safety & Compliance Gates

| البوابة | القرار | ملاحظات |
|---|---|---|
| Patient PHI tenant isolation | `PARTIAL` | تم إصلاح مسارات المرضى الأساسية، وتبقى مسارات deferred |
| EMR lock/signature | `PARTIAL` | physician route جيد، dynamic clinical lock يحتاج قرار دور Nurse |
| Nursing boundaries | `PARTIAL` | أُضيف منع diagnosis coding لغير المخولين في problem-list |
| Billing/Insurance segregation | `PASS` أولي | شواهد منع تعديل سريري من الفوترة/التأمين موجودة |
| Pharmacy diagnosis boundary | `PASS` أولي | الصيدلة تراجع وتصرف ولا تغير التشخيص حسب المسارات |
| Lab/Radiology order boundary | `PASS` أولي | نتائج وتقارير منفصلة مع audit |
| Audit | `PARTIAL` | قوي في المسارات الحديثة، يحتاج تفعيل/توسيع للقديمة |
| RLS/Tenant isolation | `PARTIAL` | 191 ملف SQL يلامس RLS، لكن deferred modules تحتاج إغلاق |
| Arabic UTF-8/Mojibake | `PASS` أولي | لم تظهر رموز تالفة في الملفات المعدلة |

## 11. Test Plan وتنفيذ الاختبارات

تم تشغيل:

```text
node --check server.js
node hospital_os_gate_static_test.js
npm run test:safe
```

النتائج:

```text
node --check server.js: exit 0
hospital_os_gate_static_test: all static gate checks passed
run_safe_tests: 110 passed, 0 failed (of 110)
skipped (need provisioned DB): 58
```

لم يتم تشغيل `npm test/run_all_tests.js` لأن 58 اختباراً تحتاج DB/Server معزول، وتشغيلها على بيئة غير مخصصة قد يسبب writes أو يعتمد على بيانات/مخططات غير جاهزة.

## 12. Gates النهائية

| Gate | القرار |
|---|---|
| GATE 0: قراءة النطاق والقائمة | `PASS` |
| GATE 1: Role Matrix | `PARTIAL` |
| GATE 2: Nursing Matrix | `PARTIAL` |
| GATE 3: Department Owner Matrix | `PARTIAL` |
| GATE 4: RBAC Matrix | `PARTIAL` |
| GATE 5: Workflow Matrix | `PARTIAL` |
| GATE 6: Integration Matrix | `PASS` أولي |
| GATE 7: Safety & Compliance | `PARTIAL` |
| GATE 8: Test Plan | `PASS` للآمن، `PARTIAL` للـ DB |
| GATE 9: Reports & Audit Trail | `PASS` للتقرير الحالي، `PARTIAL` للمسارات القديمة |
| GATE 10: عدم وجود أقسام ساقطة | `PASS` أولي، مع gaps تشغيلية موثقة |
| GATE 11: التقرير النهائي | `PARTIAL` |

## 13. الأولويات التالية

1. إغلاق tenant scope لمسارات `transport`, `telemedicine`, `cme`, `social-work`, `mortuary` بعد مطابقة migrations والجداول.
2. حسم سياسة توقيع `clinical_records`: physician EMR فقط أم توقيع تمريضي منفصل حسب نوع القالب.
3. تحويل RBAC من module-level إلى action-level للأقسام عالية الخطورة.
4. تشغيل `npm test` على قاعدة بيانات اختبار معزولة فقط.
5. إنشاء مصفوفة Department Owner تفصيلية تربط كل قسم بـ CMO/CNO/COO/CFO/CIO/مدير القسم.
6. ربط أي UI جديد لاحقاً بـ Stitch Source أو Stitch Prompt قبل التنفيذ.

FINAL_STATUS: `PARTIAL`
