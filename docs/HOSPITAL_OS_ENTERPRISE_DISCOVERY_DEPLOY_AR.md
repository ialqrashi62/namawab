# تقرير فحص Hospital OS Enterprise

التاريخ: 2026-07-03  
النطاق: فحص التطبيق الحالي من الكود الفعلي، القوائم، الأقسام، المسارات، الجداول، RBAC، التمريض، التدفقات، التكاملات، الاختبارات، وإصلاح النواقص الآمنة فقط قبل الرفع.

## 1. النتيجة التنفيذية

تم فحص التطبيق الحالي كمنصة مستشفى/عيادات/مراكز تخصصية. التطبيق يحتوي حالياً على:

| العنصر | العدد/الحالة |
|---|---|
| عناصر القائمة الرئيسية | 44 شاشة/قسم |
| دوال عرض الواجهة | 54 دالة render تقريباً |
| مسارات API في `server.js` | 684 مساراً |
| تعريفات/مرشحات جداول في bootstrap/migrations/docs | 316 تعريفاً تقريبياً |
| اختبارات آمنة DB-free | 111 ناجحة، 0 فاشلة |
| اختبارات تحتاج DB/server | 58 محجوبة لحين بيئة اختبار معزولة |

تم تنفيذ إصلاحات آمنة:

| الإصلاح | النتيجة |
|---|---|
| تفعيل قسم الأسنان في منشآت المستشفى العام، المرجعي، المجمع، المركز التخصصي، ومركز الأسنان | تم |
| إضافة أدوار `Dentist` و`Dental Nurse` إلى RBAC | تم |
| حماية مسارات سجلات الأسنان بحارس action-aware | تم |
| إصلاح payload واجهة الطب عن بعد ليتطابق مع API | تم |
| إضافة اختبار static لهذه الإصلاحات | تم |

لم يتم تنفيذ DDL، ولا Migration، ولا كتابة بيانات، ولا طباعة أسرار، ولا استخدام بيانات مرضى حقيقية.

## 2. مراجع المقارنة العالمية

تمت مقارنة التغطية مع خطوط عامة من أنظمة عالمية:

| المصدر | الدلالة المستخدمة |
|---|---|
| Epic Specialties: https://www.epic.com/software/specialties/ | وجود تخصصات مثل الطوارئ، الأسنان، الجلدية، القلب، المناظير، وتدفقات متخصصة لكل خدمة. |
| Oracle Health Products: https://www.oracle.com/health/products/ | تغطية service lines، المختبر، بنك الدم، الأشعة، التخدير، الصيدلية، النساء والولادة، التشغيل، revenue cycle، التحليلات، البوابة، والأمن السريري. |
| Oracle Health Service Lines: https://www.oracle.com/health/service-lines-departments/ | أهمية دمج ED، critical care، RIS/PACS، infection control، lab، blood bank، oncology، anesthesia مع EHR والتوثيق والفوترة. |
| MEDITECH Product List: https://ehr.meditech.com/meditech-product-list | تغطية clinical solutions، diagnostic services، patient engagement، telehealth، transport، revenue cycle، HIM، HR، materials management، analytics. |

## 3. الأقسام المشمولة في التطبيق

| القسم | الحالة في القائمة | ملاحظات |
|---|---|---|
| لوحة التحكم | موجود | مؤشرات تشغيلية ومالية وسريرية. |
| الاستقبال | موجود | تسجيل المرضى وملف MRN. |
| المواعيد | موجود | حجز، إلغاء، check-in، no-show. |
| قائمة الانتظار | موجود | Queue board وتحديث دوري. |
| محطة الطبيب | موجود | SOAP، توقيع، تعديلات، CDS، أوامر. |
| التمريض | موجود | Vitals، eMAR، care plans، assessments. |
| الطوارئ | موجود | ER board، triage ESI، أسرّة، خروج، تحويل. |
| التنويم | موجود | ADT، إشغال، تنويم، خروج. |
| العناية المركزة | موجود | Monitoring، ventilator، infusions، scores، fluids. |
| العمليات وما قبلها | موجود | جدول عمليات، pre-op، anesthesia، WHO/PACU، غرف. |
| النساء والتوليد | موجود | حمل، antenatal، partogram، ultrasound، delivery، neonatal. |
| جراحة التجميل | موجود | إجراءات، حالات، موافقات، متابعات. |
| المختبر | موجود | Orders، samples، results، QC، HL7، callbacks. |
| الأشعة | موجود | Orders، worklist، DICOM، reports، sign/addendum. |
| علم الأمراض | موجود | Specimen، block، slide، report، signout. |
| بنك الدم | موجود | Inventory، donors، crossmatch، transfusion. |
| إعادة التأهيل | موجود | Referrals، sessions، assessments، goals. |
| الصيدلية | موجود | Drugs، batches، queue، dispense، controlled substances. |
| الصيدلية السريرية | موجود | Medication review، interactions، education. |
| الفوترة الإلكترونية/ZATCA | موجود | Credit notes، invoice chain، submission gated. |
| حسابات المرضى | موجود | Patient account/billing summary. |
| التأمين/NPHIES | موجود | eligibility، pre-auth، claims، denials، remittance. |
| المالية | موجود | GL، journal، AP/AR، vouchers، aging، reports. |
| التقارير | موجود | مالية، مرضى، مختبر، عمولات، P&L. |
| الموارد البشرية | موجود | موظفون، حضور، إجازات، رواتب، credentialing، GOSI/WPS/Nitaqat. |
| المخازن | موجود | Items، batches، PO، receipts، movements، counts. |
| الأصناف | موجود | كتالوجات خدمات/مختبر/أشعة. |
| طلبات الأقسام | موجود | طلبات مخزون واعتماد/رفض. |
| التعقيم المركزي CSSD | موجود | Batches، cycles، BI، trays. |
| مكافحة العدوى | موجود | Surveillance، outbreaks، hand hygiene، exposure. |
| الجودة | موجود | Incidents، CAPA، KPIs، audit logs. |
| التغذية | موجود | Diet orders، meals، nutrition assessments. |
| نقل المرضى | موجود | Transport requests مع tenant scope. |
| الخدمة الاجتماعية | موجود | Social work cases. |
| الصيانة | موجود | Work orders، assets، PM schedules. |
| الإقرارات | موجود | 31 نموذج موافقة/إقرار HTML. |
| السجلات الطبية/HIM | موجود | Coding، ROI، access log، break-glass. |
| بوابة المرضى | موجود | Appointments، results، messages، telemedicine. |
| الطب عن بعد | موجود ومصحح | payload الآن يرسل `scheduled_date` و`scheduled_time`. |
| الرسائل | موجود | Internal messages. |
| التعليم الطبي CME | موجود | Activities، registrations، events. |
| خدمة الوفيات | موجود | Mortuary cases. |
| الإعدادات | موجود | Users، hospital، security، compliance. |
| الأسنان | موجود ومصحح | تم تفعيل الصفحة وربط RBAC الخاص بها. |

## 4. Role Matrix مختصر

| المجال | أدوار طبية | أدوار تمريضية | أدوار فنية/إدارية | ضابط مهم |
|---|---|---|---|---|
| EMR/محطة الطبيب | Doctor، OB/GYN، Neonatologist | Nursing للتوثيق غير الطبي | HIM | توقيع Physician EMR للطبيب فقط. |
| التمريض/eMAR | Doctor للأوامر | Nurse، Charge Nurse، ICU/ER/OR/PACU Nurse | Quality عند التدقيق | لا تعديل تشخيص الطبيب. |
| الطوارئ | ER Doctor، Consultant | Triage/ER Nurse | Reception، Bed manager | ESI، audit، escalation. |
| ICU/CCU/PICU/NICU | Intensivist، Neonatologist | ICU/CCU/PICU/NICU Nurse | Respiratory/Pharmacy | high-alert gates. |
| العمليات والتخدير | Surgeon، Anesthesiologist | Scrub، Circulating، PACU Nurse | CSSD، OR manager | WHO checklist، surgical count. |
| المختبر/علم الأمراض | Pathologist، Lab Medicine | Phlebotomy عند الحاجة | Lab Technician | النتائج لا تغير أوامر الطبيب. |
| الأشعة | Radiologist | IR Nurse عند الحاجة | Radiology Technician | report sign/addendum فقط للمخول. |
| بنك الدم | Transfusion physician | Blood bank/transfusion nurse | Blood bank specialist | ABO/Rh/crossmatch gate. |
| الصيدلية | Clinical Pharmacist | Medication nurse للتنفيذ | Pharmacist/Technician | لا تغير التشخيص. |
| الأسنان | Dentist/Doctor | Dental Nurse للقراءة والدعم | Reception | الكتابة العلاجية للطبيب/طبيب الأسنان فقط. |
| المالية/التأمين | لا صلاحية سريرية | لا صلاحية سريرية | Finance، Insurance، Billing | لا تعديل أوامر الطبيب. |

## 5. Nursing Matrix

| وحدة التمريض | التغطية الحالية/المطلوبة | صلاحيات آمنة |
|---|---|---|
| استقبال/عيادات | موجودة ضمن Nursing/Reception | Vitals، تحضير، لا توقيع Physician EMR. |
| ER/Triage | موجودة | ESI، escalation، توثيق تمريضي. |
| ICU | موجودة | Monitoring، scores، infusions documentation. |
| CCU/PICU/NICU | مدعومة ضمن ICU/OB/Pediatrics وتحتاج تفصيل UI لاحق | توثيق متخصص دون اعتماد طبي منفرد. |
| OR | موجودة ضمن Surgery | Surgical count، checklist support. |
| PACU | موجودة ضمن OR Workflow | Recovery monitoring. |
| Blood Bank | موجودة ضمن Blood Bank/Nursing | تحقق نقل الدم، دون release منفرد. |
| Interventional Radiology | تحتاج شاشة/تدفق أكثر تفصيلاً لاحقاً | Sedation/procedure support. |
| High-Alert Medication | موجودة عبر eMAR/Pharmacy/ICU | Double-check، override audited. |
| Nurse Educator | موجود كمتطلب HR/CME، يحتاج صفحة Competency متقدمة لاحقاً | Training/competency فقط، لا صلاحيات سريرية تلقائية. |

## 6. RBAC Matrix عالية المستوى

| الفعل | طبيب | تمريض | فني/صيدلي | إداري/مالي | جودة/HIM | Admin |
|---|---|---|---|---|---|---|
| قراءة | حسب القسم | حسب القسم | حسب القسم | غير سريري غالباً | Audit/HIM | نعم |
| إنشاء | أوامر/تشخيص/تقرير طبي | توثيق تمريضي | نتائج/صرف حسب الدور | معاملات مالية/إدارية | تقارير جودة | نعم |
| تعديل | ضمن السجل غير المقفل | ضمن توثيق التمريض | نتائج قبل الاعتماد | معاملات غير سريرية | تصحيح مرخص | نعم |
| اعتماد | الطبيب/الاستشاري | محدود وتمريضي | Pathology/Radiology/Pharmacy حسب الدور | مالي فقط | جودة/HIM حسب workflow | نعم |
| إلغاء | الطبيب أو owner | حسب workflow | حسب workflow | مالي/إداري | مراقبة | نعم |
| تصدير/طباعة | حسب الحاجة | محدود | محدود | مالي | HIM/Quality | نعم |
| وصول حساس | مبرر سريري | مبرر تمريضي | مبرر وظيفي | لا PHI إلا مطالبة | HIM/Audit | Break-glass audited |

## 7. Workflow Matrix مختصر

| القسم | البداية | الإدخال | التحقق | التنفيذ | الاعتماد | الإغلاق |
|---|---|---|---|---|---|---|
| استقبال/مواعيد | وصول أو طلب حجز | بيانات مريض/موعد | Tenant/RBAC/تكرار | إنشاء ملف/موعد | إداري | Queue أو زيارة |
| طبيب/EMR | دخول المريض | SOAP/diagnosis/orders | CDS/allergy/results | أوامر/خطة علاج | توقيع طبي | Lock/amendment |
| تمريض | أمر أو زيارة | Vitals/MAR/assessment | 5 rights/scores | إعطاء/رعاية | Charge/Head عند الحاجة | توثيق |
| مختبر | أمر طبي | عينة/نتيجة | QC/reference/callback | تحليل | Verify/sign | نتيجة إلى EMR |
| أشعة | أمر طبي | Worklist/report | DICOM/critical notify | تصوير | Sign/addendum | نتيجة إلى EMR |
| صيدلية | وصفة | Review/dispense | Allergy/interactions/TDM | صرف/تثقيف | Pharmacist | eMAR/stock |
| طوارئ | Arrival | Registration/ESI | Safety gate | علاج/مراقبة | Disposition | Discharge/admit/transfer |
| عمليات | Schedule | Pre-op/anesthesia/counts | WHO/safety | Procedure | Surgeon/Anesthesia | PACU/discharge |
| مالية/تأمين | خدمة/مطالبة | Claim/invoice | Eligibility/NPHIES/ZATCA | Posting/submit | Finance/Insurance | Remittance/close |

## 8. Integration Matrix

| التكامل | الحالة في الكود | ملاحظات |
|---|---|---|
| EMR/EHR | موجود | clinical records، templates، problem list، summaries. |
| LIS | موجود | samples، results، QC، microbiology، LOINC. |
| RIS/PACS/DICOM | موجود | worklist، DICOM studies، image upload، reports. |
| Pharmacy/MAR | موجود | eMAR، dispense، controlled substances، medication reconciliation. |
| Billing/Finance | موجود | invoices، GL، AP/AR، ZATCA candidate. |
| Insurance/NPHIES | موجود | eligibility، claims، remittance، claim-status. |
| Inventory/CSSD | موجود | items، batches، PO، CSSD cycles/trays. |
| HR | موجود | employees، credentialing، GOSI، WPS، Nitaqat. |
| Patient Portal | موجود | portal appointments/messages/results. |
| Telemedicine | موجود ومصحح | payload متوافق مع backend. |
| Messaging | موجود | internal messages/notifications. |
| Audit Log | موجود | audit_trail وlogAudit في المسارات الحساسة. |
| FHIR/HL7/AI | موجود | FHIR resource، HL7 messages، CDS hooks، voice dictation. |

## 9. Safety & Compliance Gates

| Gate | الحكم |
|---|---|
| Clinical Safety | موجود للأقسام عالية الخطورة، ويحتاج توسيع detail للـ IR وNurse Educator لاحقاً. |
| RBAC | موجود، وتم تحسين الأسنان. |
| Audit | موجود في أغلب المسارات الحساسة، ويحتاج فحص coverage مستمر لكل route جديد. |
| Tenant Isolation | موجود في أغلب المسارات الحديثة؛ اختبارات DB محجوبة حتى DB اختبار. |
| PDPL/PHI | توجد crypto/audit guards، ولم تستخدم بيانات مرضى حقيقية في هذا الفحص. |
| ZATCA/NPHIES | موجودة كمسارات gated، ولا يتم تشغيل clearing فعلي دون مفاتيح وإعدادات. |
| Stitch/UI | لم يتم تصميم UI جديد. الإصلاحات كانت تشغيلية على واجهة موجودة. أي UI جديد لاحقاً يحتاج Stitch Source أو Prompt معتمد. |

## 10. Test Plan

| نوع الاختبار | الحالة |
|---|---|
| Unit Tests | موجودة وتشمل محركات مالية/سريرية/تمريضية. |
| Integration Tests | موجودة لكن جزء منها يحتاج DB/server. |
| Workflow Tests | موجودة للطوارئ، ADT، ICU، OR، OB، blood bank، pharmacy، HR. |
| RBAC Tests | موجودة، وأضيف static guard للأسنان. |
| Audit Tests | موجودة. |
| Clinical Safety Tests | موجودة للأدوية، الدم، ICU، EWS، sepsis، surgical counts. |
| Billing/Insurance Tests | موجودة. |
| Arabic UTF-8/Mojibake | يجب تشغيل فحص رموز mojibake المعروفة على التقارير والملفات المعدلة قبل الإغلاق دون إبقاء هذه الرموز داخل التقرير نفسه. |

## 11. Prompt جاهز للتوسع القادم

استخدم هذا prompt عند طلب شاشة أو وحدة جديدة لاحقاً:

```text
صمم/راجع وحدة [اسم القسم] داخل Hospital OS Arabic RTL.
يجب أن تشمل:
- الهدف التشغيلي.
- personas: طبيب، تمريض متخصص، فني/صيدلي/إداري، رئيس القسم، الجودة، HIM، الفوترة/التأمين عند الحاجة.
- RBAC action-level: View/Create/Update/Approve/Cancel/Export/Print/Override/Emergency/Sensitive.
- Workflow كامل من البداية حتى الإغلاق.
- البيانات المطلوبة والجداول/API المقترحة بدون DDL تنفيذي.
- التكاملات: EMR/LIS/RIS/PACS/Pharmacy/MAR/Billing/Insurance/Inventory/HR/Portal/Messaging/Audit.
- Safety Gates وApproval Gates وAudit Gates.
- Empty/Loading/Error states، RTL، accessibility، responsive behavior.
- اختبارات: unit/integration/workflow/RBAC/audit/clinical safety/billing/mojibake.
لا تنفذ UI إلا بعد Stitch Source أو Stitch Prompt معتمد.
```

## 12. سيناريو عمل شامل

1. المريض يسجل في الاستقبال أو عبر البوابة.
2. يتم التحقق من الهوية، التأمين، وtenant context.
3. يدخل إلى قائمة الانتظار أو الطوارئ حسب الحالة.
4. التمريض يسجل العلامات الحيوية والفرز.
5. الطبيب يفتح محطة الطبيب ويكتب التقييم والأوامر.
6. المختبر/الأشعة/الصيدلية تنفذ الأوامر دون تعديل التشخيص.
7. النتائج تعود إلى EMR مع callback عند النتائج الحرجة.
8. التمريض ينفذ MAR والرعاية ويوثق.
9. في الأقسام عالية الخطورة يتم تطبيق safety/approval/audit gates.
10. الفوترة والتأمين يقرآن الخدمات ولا يغيران الأوامر السريرية.
11. HIM يدير coding وROI وaccess log.
12. يتم الإغلاق بخروج، تحويل، متابعة، مطالبة، أو تقرير.

## 13. Data Flow

```text
Patient/Portal/Reception
  -> Tenant Context + RBAC
  -> Encounter/Queue/ADT/ER
  -> Doctor EMR + Nursing Documentation
  -> Orders
     -> LIS/Lab Results
     -> RIS/PACS/Radiology Reports
     -> Pharmacy/eMAR
     -> OR/ICU/Blood Bank/CSSD/Dietary/Rehab
  -> Results + Alerts + Audit Trail
  -> Billing/Insurance/NPHIES/ZATCA
  -> HIM/Coding/ROI
  -> Reports/Quality/Infection Control
```

## 14. النواقص والمخاطر

| النقص/الخطر | المستوى | القرار |
|---|---|---|
| اختبارات DB/server غير مشغلة | متوسط | `BLOCKED_DB_TEST_ENV_REQUIRED` حتى توفير بيئة معزولة. |
| Interventional Radiology يحتاج workflow تمريضي أدق | منخفض/متوسط | توثيق مطلوب قبل UI جديد. |
| Nurse Educator يحتاج competency workspace أعمق | منخفض | Phase لاحقة. |
| بعض الأقسام الدقيقة تظهر ضمن specialty modules لا كشاشات مستقلة | منخفض | مناسب حالياً إذا بقيت metadata-driven. |
| أي UI جديد مستقبلي | حوكمي | يتطلب Stitch Source/Prompt. |

## 15. الملفات المعدلة في هذه المرحلة

| الملف | التغيير |
|---|---|
| `namaweb/server.js` | RBAC للأسنان، حارس Dental access، وحماية مسارات dental records. |
| `namaweb/public/js/app.js` | تفعيل صفحة الأسنان حسب نوع المنشأة، وإصلاح payload الطب عن بعد. |
| `namaweb/hospital_os_enterprise_discovery_static_test.js` | اختبار static جديد. |
| `docs/HOSPITAL_OS_ENTERPRISE_DISCOVERY_DEPLOY_AR.md` | هذا التقرير. |

## 16. نتائج الاختبار

| الأمر | النتيجة |
|---|---|
| `node --check server.js` | PASS |
| `node --check public/js/app.js` | PASS |
| `node hospital_os_gate_static_test.js` | PASS |
| `node hospital_os_enterprise_discovery_static_test.js` | PASS |
| `npm run test:safe` | PASS: `111 passed, 0 failed`; `58 skipped need DB/server` |

## 17. القرار

`FINAL_STATUS: DEPLOYED_PARTIAL_DB_TESTS_BLOCKED`

السبب: الإصلاحات الآمنة اكتملت ومرّت الاختبارات DB-free، وتم رفعها إلى `jumanasoft.com` بناءً على طلب المالك الصريح. بقيت DB/server integration tests محجوبة حتى بيئة اختبار معزولة.

## 18. سجل النشر

| البند | النتيجة |
|---|---|
| الهدف | `jumanasoft.com` |
| الخادم | `204.168.144.74` |
| مسار التطبيق | `/var/www/namaweb` |
| PM2 process | `nama-medical-erp` |
| طريقة النشر | surgical copy بعد staging وbackup |
| DDL/Migration | لم يتم |
| Data Write | لم يتم من الاختبارات أو السكربتات |
| Backup قبل الاستبدال | `/root/nama_backups/hos_enterprise_20260702_223832` |
| Health بعد النشر | `{"status":"UP","db":"up"}` |
| PM2 | online، restart count انتقل إلى 161 |
| التقرير على الخادم | `/var/www/namaweb/docs/HOSPITAL_OS_ENTERPRISE_DISCOVERY_DEPLOY_AR.md` |
