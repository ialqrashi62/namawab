# Hospital OS Prompt + Scenario + Data Flow

التاريخ: 2026-07-03

## 1. النتيجة التنفيذية

تم إعداد مستند عملي مختصر لفحص وتطوير نظام المستشفى، يغطي القوائم والأقسام الجاهزة، المتطلبات المتوقعة من الجداول والواجهات والأزرار والقوائم، مع Prompt جاهز وسيناريو عمل وفلو بيانات.

المراجع العالمية المستخدمة للمقارنة:

| المرجع | الاستخدام |
|---|---|
| Oracle Health service lines and departments | مقارنة تغطية الخدمات السريرية والتشغيلية عبر أقسام المستشفى. |
| MEDITECH product list | مقارنة diagnostic services، revenue cycle، HIM، telehealth، transport، laboratory، blood bank، pathology. |
| Epic/EHR specialty coverage references | مقارنة التخصصات والعيادات والخدمات السريرية المتخصصة. |

## 2. الأقسام المشمولة

الاستقبال، المواعيد، قائمة الانتظار، محطة الطبيب، التمريض، الطوارئ، التنويم، العناية المركزة، العمليات وما قبلها، النساء والتوليد، جراحة التجميل، المختبر، الأشعة، علم الأمراض، بنك الدم، إعادة التأهيل، الصيدلية، الصيدلية السريرية، الفوترة الإلكترونية، حسابات المرضى، التأمين، المالية، التقارير، الموارد البشرية، المخازن، الأصناف، طلبات الأقسام، التعقيم المركزي، مكافحة العدوى، الجودة، التغذية، نقل المرضى، الخدمة الاجتماعية، الصيانة، الإقرارات، السجلات الطبية، بوابة المرضى، الطب عن بعد، الرسائل، التعليم الطبي، خدمة الوفيات، الإعدادات، الأسنان.

## 3. Prompt جاهز للاستخدام

```text
Act as a complete enterprise hospital operating system architect, senior healthcare product strategist, clinical workflow analyst, medical informatics consultant, nursing operations lead, hospital operations manager, QA lead, security/compliance reviewer, and implementation auditor.

اللغة: العربية الفصحى المهنية.
النظام: Hospital OS شامل للمستشفيات والعيادات والمراكز التخصصية.

افحص أو صمم قسم: [اسم القسم].

يجب أن يشمل لكل قسم:
1. الهدف التشغيلي.
2. المستخدمون:
   - الطبيب أو الأخصائي.
   - التمريض المتخصص.
   - الفني أو الصيدلي أو الإداري حسب القسم.
   - رئيس القسم.
   - الجهات الداعمة: HIM، الجودة، مكافحة العدوى، الفوترة، التأمين، IT.
3. RBAC action-level:
   - View.
   - Create.
   - Update.
   - Approve.
   - Cancel.
   - Escalate.
   - Print/Export.
   - Emergency Access.
   - Sensitive Data Access.
4. Workflow:
   - البداية.
   - الإدخال.
   - التحقق.
   - التنفيذ.
   - الاعتماد.
   - التوثيق.
   - الفوترة/التأمين عند الحاجة.
   - الإغلاق.
5. البيانات:
   - Patient.
   - Encounter.
   - Orders.
   - Nursing notes.
   - Results.
   - Consents.
   - Invoices.
   - Inventory.
   - Records.
6. التكاملات:
   - EMR/EHR.
   - LIS.
   - RIS/PACS.
   - Pharmacy/MAR.
   - Billing.
   - Insurance/NPHIES.
   - Inventory.
   - HR.
   - Patient Portal.
   - Telemedicine.
   - Messaging.
   - Audit Log.
7. المخاطر:
   - سريرية.
   - تمريضية.
   - مالية.
   - خصوصية.
   - تشغيلية.
   - صلاحيات.
   - نقص توثيق.
8. الضوابط:
   - Mandatory validation.
   - Approval gate.
   - Safety gate.
   - Audit trail.
   - RBAC.
   - Tenant isolation.
   - No secrets.
   - No PHI in examples.
9. الاختبارات:
   - Unit.
   - Integration.
   - Workflow.
   - RBAC.
   - Audit.
   - Clinical safety.
   - Billing/Insurance.
   - Arabic UTF-8 guard.
10. المخرجات:
   - Screens.
   - APIs.
   - DB tables/candidates without executing DDL.
   - Reports.
   - Permissions.
   - Alerts.
   - Audit logs.
   - Arabic documentation.

قواعد صارمة:
- لا تخلط صلاحيات الطبيب والتمريض.
- لا تجعل الإداري يملك صلاحية سريرية.
- لا تسمح للفوترة أو التأمين بتعديل أوامر الطبيب.
- لا تسمح للصيدلية بتغيير التشخيص.
- لا تسمح للمختبر أو الأشعة بتعديل أوامر الطبيب.
- أي UI جديد يحتاج Stitch Source أو Stitch Prompt معتمد قبل التنفيذ.
```

## 4. سيناريو عمل موحد

| المرحلة | السيناريو |
|---|---|
| 1. الدخول | المريض يصل عبر الاستقبال أو البوابة أو الطوارئ أو الطب عن بعد. |
| 2. التحقق | النظام يتحقق من الهوية، tenant، الصلاحية، التأمين، والموافقات المطلوبة. |
| 3. التوجيه | يتم تحويل المريض إلى موعد، قائمة انتظار، ER، ADT، أو عيادة تخصصية. |
| 4. التمريض | التمريض يسجل العلامات الحيوية، الفرز، التقييم، MAR، وخطط الرعاية. |
| 5. الطبيب | الطبيب يوثق SOAP، التشخيص، الأوامر، الموافقات، وخطة العلاج. |
| 6. الخدمات التشخيصية | المختبر والأشعة وعلم الأمراض تنفذ الأوامر وتعيد النتائج دون تعديل القرار الطبي. |
| 7. الصيدلية | الصيدلية تراجع الحساسية والتداخلات والجرعات وتصرف أو تعيد للطبيب للمراجعة. |
| 8. الأقسام عالية الخطورة | الطوارئ، ICU، OR، بنك الدم، OB/NICU، التخدير تطبق Safety/Approval/Audit gates. |
| 9. المالية والتأمين | الفوترة والتأمين تقرأ الخدمات وتدير المطالبات دون تغيير أوامر الطبيب. |
| 10. الإغلاق | خروج، تنويم، تحويل، متابعة، مطالبة، ROI، أو أرشفة نهائية في HIM. |

## 5. Data Flow

```text
Patient / Portal / Reception / ER
  -> Auth + RBAC + Tenant Context
  -> Appointment / Queue / Encounter / ADT
  -> Nursing Documentation
  -> Physician EMR
  -> Orders
     -> LIS / Laboratory / Microbiology / Pathology
     -> RIS / PACS / Radiology / Interventional Radiology
     -> Pharmacy / Clinical Pharmacy / MAR
     -> OR / Anesthesia / PACU / ICU / Blood Bank / CSSD
     -> Rehab / Dietary / Social Work / Transport
  -> Results + Alerts + Critical Callback
  -> Billing + Insurance + NPHIES + ZATCA
  -> HIM + Coding + ROI + Audit Trail
  -> Reports + Quality + Infection Control + Governance
```

## 6. متطلبات الواجهات والأزرار والقوائم

| نوع الواجهة | المتطلبات |
|---|---|
| قائمة القسم | View، Create، Search، Filter، Export حسب RBAC. |
| شاشة التفاصيل | بيانات المريض/الزيارة، الحالة، التاريخ، audit، الإجراءات المتاحة. |
| نموذج الإنشاء | تحقق إلزامي، حقول مطلوبة، tenant context، no PHI demo. |
| شاشة الاعتماد | Approve/Reject، سبب إلزامي عند الرفض، audit trail. |
| شاشة الإلغاء | Cancel reason، صلاحية محددة، منع الإلغاء بعد حالات نهائية. |
| الطباعة والتصدير | watermark، RBAC، إخفاء الحقول الحساسة عند الحاجة. |
| الحالات | Empty state، Loading state، Error state، Permission denied state. |
| العربية وRTL | دعم RTL كامل، UTF-8، عدم وجود mojibake. |
| الوصولية | labels، keyboard navigation، contrast، focus state. |

## 7. نواقص أو افتراضات خطرة

| البند | الحكم |
|---|---|
| التحقق DB integration | محجوب حتى توفير DB اختبار معزولة. |
| أي UI جديد | ممنوع التنفيذ دون Stitch Source أو Stitch Prompt. |
| الصلاحيات السريرية الدقيقة | يجب أن تبقى action-level لكل قسم عالي الخطورة. |
| أمثلة البيانات | يجب أن تبقى وهمية بالكامل دون PHI. |

## 8. FINAL_STATUS

`FINAL_STATUS: PROMPT_SCENARIO_DATAFLOW_READY_DB_TESTS_BLOCKED`
