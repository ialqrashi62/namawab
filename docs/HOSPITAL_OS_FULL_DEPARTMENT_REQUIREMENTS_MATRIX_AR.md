# Hospital OS Full Department Requirements Matrix

التاريخ: 2026-07-03  
الغرض: تحويل طلب الفحص الشامل إلى مصفوفة تنفيذية لكل قسم في التطبيق الحالي، مع ربط المستخدمين، RBAC، workflow، البيانات، التكاملات، المخاطر، الضوابط، الاختبارات، والمخرجات.

## 1. النتيجة التنفيذية

تمت تغطية كل الأقسام المذكورة في الطلب داخل مصفوفة واحدة قابلة للتنفيذ. لا يحتوي هذا الملف على أسرار أو بيانات مرضى حقيقية، ولم يتطلب DDL أو Migration أو Data Write أو تغيير UI.

الحكم: `PARTIAL_DOCUMENTATION_COMPLETE_DB_TESTS_BLOCKED`

سبب الحكم: التغطية المعمارية والتوثيقية اكتملت لكل الأقسام، لكن التحقق الكامل من الجداول الفعلية والعلاقات والـ RLS يحتاج DB اختبار معزولة.

## 2. المراجع العالمية المستخدمة للمقارنة

| المرجع | الاستخدام |
|---|---|
| Epic specialties | مقارنة التخصصات السريرية مثل الطوارئ، الأسنان، القلب، الجلدية، المناظير، وواجهات الطبيب. |
| Oracle Health products and service lines | مقارنة التكاملات السريرية والتشغيلية: LIS، RIS/PACS، pharmacy، revenue cycle، critical care، infection control. |
| MEDITECH product list | مقارنة تغطية EHR، diagnostic services، patient engagement، telehealth، transport، revenue cycle، HIM، HR، materials management. |

## 3. Role Matrix عام

| الفئة | أمثلة الأدوار | صلاحيات مبدئية | قيود صارمة |
|---|---|---|---|
| الطبيب | طبيب عام، طوارئ، Hospitalist، Intensivist، جراح، تخدير، نساء، أطفال، أسنان، أشعة، علم أمراض، تأهيل، طب عن بعد | قراءة/إنشاء/تعديل/اعتماد سريري حسب القسم | لا تفويض توقيع Physician EMR للتمريض أو الإداريين. |
| التمريض | Triage، ER، ICU، CCU، PICU، NICU، OR، PACU، OB، Blood Bank، IR، MAR، Infection، Quality، Educator، Dental Nurse | توثيق تمريضي، تنفيذ أوامر، مراقبة، تصعيد | لا تعديل تشخيص أو أوامر الطبيب ولا توقيع Physician EMR. |
| الصيدلة | صيدلي صرف، فني، صيدلي سريري، ICU، أطفال، أورام، TDM | مراجعة وصفات، صرف، تداخلات، حساسية، TDM | لا تغيير التشخيص أو أمر الطبيب؛ التوصية/الرفض وفق workflow. |
| التشخيص والفنيون | مختبر، أحياء دقيقة، كيمياء، دم، أنسجة، بنك دم، أشعة، علاج طبيعي، CSSD، هندسة طبية | تنفيذ فحوص، تسجيل نتائج، تجهيزات | لا تعديل أوامر الطبيب؛ الاعتماد حسب الدور. |
| الإداري والتشغيلي | استقبال، مواعيد، تنويم، مالية، تأمين، HR، مخازن، صيانة، Portal، Telemedicine، CIO | تشغيل وإدارة غير سريرية | لا صلاحيات سريرية إلا اعتماد إداري محدد. |
| الحوكمة | CMO، CNO، COO، CFO، CIO، جودة، مخاطر، خصوصية، قانوني، لجان | اعتماد سياسات ومراقبة | لا تجاوز workflow الطبي إلا عبر break-glass مؤرشف. |

## 4. Nursing Matrix متخصص

| وحدة التمريض | المهام | حدود الصلاحية | اختبارات مطلوبة |
|---|---|---|---|
| استقبال/عيادات | قياسات أولية، تحضير، تثقيف | لا تشخيص ولا توقيع EMR | RBAC، Audit، Workflow |
| ER/Triage | ESI، إنعاش، تصعيد | تصعيد الطبيب للحالات الحرجة | Clinical Safety، ESI |
| تنويم | متابعة، أدوية، خطط رعاية | تنفيذ أوامر موثقة فقط | MAR، 5 Rights |
| ICU/CCU | مراقبة حرجة، infusions، scores | high-alert double-check | ICU safety، medication |
| PICU/NICU | مراقبة أطفال/حديثي ولادة | صلاحيات عمرية/وزنية دقيقة | Pediatric dosing، APGAR |
| OR | Scrub/Circulating، عد أدوات | لا اعتماد العملية | Surgical count |
| PACU | إفاقة، pain، airway | discharge طبي منفصل | PACU discharge gate |
| OB/Midwife | partogram، ولادة، neonatal handoff | obstetric escalation | OB safety |
| Blood Bank | تحقق نقل الدم، مراقبة reaction | لا release منفرد | ABO/Rh/crossmatch |
| Interventional Radiology | sedation monitoring، procedure support | procedural approval للطبيب | Sedation/audit |
| High-Alert Medication | إعطاء أدوية عالية الخطورة | double sign/override audited | MAR high-alert |
| Nurse Educator | كفاءة وتدريب | لا صلاحيات تشغيلية تلقائية | Competency tests |
| Dental Nurse | دعم عيادة الأسنان وقراءة السجل | لا كتابة علاجية مستقلة | Dental RBAC |

## 5. Department Owner Matrix

| القسم | Executive Owner | Department Head | Quality Owner | Infection Owner | HIM Owner | Billing/Insurance |
|---|---|---|---|---|---|---|
| الأقسام السريرية والطوارئ والعناية والعمليات | CMO/CNO | رئيس القسم | Quality Lead | Infection Control | HIM | عند وجود مطالبة |
| المختبر والأشعة وعلم الأمراض وبنك الدم | CMO/COO | مدير الخدمة | Quality Diagnostic Lead | Infection عند الحاجة | HIM | Insurance عند الفوترة |
| الصيدلية والصيدلية السريرية | CMO/COO | مدير الصيدلية | Medication Safety | Infection عند الحاجة | HIM عند الحاجة | Billing عند الصرف |
| المالية والتأمين والفوترة | CFO | Revenue Cycle Head | Claims Quality | غير منطبق غالبا | HIM linkage | Billing/Insurance Owner |
| HR/CME/Settings/IT | CIO/COO | مدير الوحدة | IT/Training Quality | غير منطبق غالبا | Audit/HIM عند الحاجة | غير منطبق غالبا |
| CSSD/Inventory/Maintenance/Dietary/Transport | COO | Operational Manager | Operations Quality | Infection عند الصلة | غير منطبق غالبا | عند التكلفة |

## 6. مصفوفة الأقسام التفصيلية

> الأعمدة تختصر القالب المطلوب: الهدف، personas، RBAC، workflow، البيانات، التكاملات، المخاطر، الضوابط، الاختبارات، والمخرجات.

| القسم | الهدف التشغيلي | Personas | RBAC Action-Level | Workflow مختصر | البيانات | التكاملات | المخاطر والضوابط | الاختبارات والمخرجات |
|---|---|---|---|---|---|---|---|---|
| الاستقبال | فتح ملف، تحقق هوية، دخول الخدمة | Reception، ممرضة استقبال، علاقات مرضى، Billing | View/Create/Update إداري، Print محدود، Sensitive حسب الهوية | تسجيل، تحقق، موعد/انتظار، ربط تأمين، إغلاق | مريض، هوية، اتصال، تأمين، زيارة | EMR، Billing، Insurance، Queue، Audit | خطأ هوية أو كشف PHI؛ ضوابط: تحقق إلزامي، tenant، audit | Unit/RBAC/Audit؛ شاشات تسجيل، APIs مرضى |
| المواعيد | جدولة وإدارة الحضور | منسق مواعيد، طبيب، تمريض عيادة، مدير عيادات | View/Create/Update/Cancel، Print، Export محدود | طلب، تحقق توفر، حجز، check-in/no-show، إغلاق | مريض، طبيب، قسم، وقت، حالة | EMR، Queue، Portal، Telemedicine، Billing | تضارب مواعيد؛ ضوابط conflict check وaudit | Workflow/Integration؛ شاشة مواعيد، API |
| قائمة الانتظار | إدارة تدفق المرضى | Reception، Nurse، Doctor، Clinic Manager | View/Update/Call/Escalate | Check-in، أولوية، دخول للطبيب، خروج | visit، queue no، status، priority | Appointments، EMR، Nursing | تأخير أو فرز خاطئ؛ ضوابط priority وtracking | Workflow؛ شاشة queue وتنبيهات |
| محطة الطبيب | توثيق طبي وأوامر واعتماد | Doctor، Specialist، CMO، HIM | View/Create/Update/Approve/Sign/Print/Sensitive | فتح زيارة، SOAP، تشخيص، أوامر، نتائج، توقيع، قفل | EMR، ICD، أوامر، نتائج، موافقات | LIS، RIS، Pharmacy، Billing، CDS، Audit | تشخيص/أمر خاطئ؛ ضوابط CDS، allergy، lock/sign | Clinical safety/RBAC؛ EMR screens/API |
| التمريض | تنفيذ الرعاية والتوثيق | Nurse، Charge، Head Nurse، CNO | View/Create/Update تمريضي، Escalate، Print محدود | Vitals، MAR، assessment، care plan، escalation | vitals، MAR، notes، scores | EMR، Pharmacy/MAR، ICU، Audit | خلط صلاحيات الطبيب؛ ضوابط 5 rights وRBAC | MAR/RBAC/Audit؛ Nursing screens/API |
| الطوارئ | استقبال وفرز ومعالجة الحالات الحرجة | ER Doctor، Triage Nurse، ER Nurse، ER Manager | View/Create/Update/Approve/Cancel/Emergency/Sensitive | arrival، ESI، bed، provider، treatment، disposition | complaint، ESI، trauma، bed، disposition | ADT، Lab، Radiology، Pharmacy، Billing | missed critical؛ ضوابط ESI، alerts، audit | ER workflow/safety؛ ER board/API |
| التنويم | إدارة دخول وخروج وحركة الأسرة | Hospitalist، Ward Nurse، Bed Manager، HIM | View/Create/Update/Approve discharge/Cancel | admit، bed assign، rounds، transfer، discharge | admission، bed، diagnosis، orders | EMR، Billing، Insurance، Dietary، Nursing | سرير خاطئ أو خروج غير آمن؛ ضوابط ADT gates | ADT/RBAC؛ census/API |
| العناية المركزة | إدارة المرضى الحرجين | Intensivist، ICU Nurse، RT، Clinical Pharmacist | View/Create/Update/Approve/Override/Emergency | admit ICU، monitoring، ventilator، infusions، scores، discharge | ICU flowsheet، SOFA/GCS، vent، fluids | EMR، Lab، Pharmacy، Nursing، Alerts | high-alert، sepsis؛ ضوابط double-check وearly warning | ICU safety؛ ICU board/API |
| العمليات وما قبلها | إدارة العمليات من الجدولة للإفاقة | Surgeon، Anesthesia، OR Nurse، PACU، CSSD | View/Create/Update/Approve/Cancel/Override | schedule، pre-op، anesthesia، WHO، count، PACU | surgery، consent، anesthesia، count، room | EMR، CSSD، Blood Bank، Billing | wrong site/count؛ ضوابط WHO، count، consent | OR workflow؛ surgery screens/API |
| النساء والتوليد | رعاية الحمل والولادة والمواليد | OB/GYN، Midwife، OB Nurse، Neonatologist | View/Create/Update/Approve/Sensitive | pregnancy، antenatal، partogram، delivery، neonatal | pregnancy، GPAL، scans، delivery، APGAR | EMR، Lab، Ultrasound، NICU، Billing | maternal/neonatal risk؛ ضوابط alerts وpartogram | OB/NICU safety؛ OB screens/API |
| جراحة التجميل | إدارة إجراءات وحالات وموافقات | Cosmetic Surgeon، Nurse، Coordinator | View/Create/Update/Approve/Print | consult، consent، schedule، procedure، follow-up | procedure، photos metadata، consent | EMR، Billing، Consent، Audit | موافقة ناقصة أو صور حساسة؛ ضوابط consent/PHI | Workflow/PHI؛ cosmetic screens/API |
| المختبر | تنفيذ أوامر المختبر وإرجاع النتائج | Lab Doctor، Technician، Phlebotomy، Lab Manager | View/Create/Update result/Verify/Callback | order، sample، QC، result، verify، critical callback | orders، samples، results، QC | EMR، LIS/HL7، Billing، Audit | نتيجة حرجة غير مبلغة؛ ضوابط callback وQC | LIS/critical tests؛ Lab screens/API |
| الأشعة | إدارة الفحوص والتقارير والصور | Radiologist، Technician، IR Nurse، Coordinator | View/Create/Update/Sign/Addendum/Notify | order، worklist، imaging، report، sign، notify | order، study، report، DICOM، priors | RIS/PACS، EMR، Billing، Audit | critical finding؛ ضوابط sign/critical notify | RIS/PACS; Radiology screens/API |
| علم الأمراض | العينات والشرائح والتقرير النهائي | Pathologist، Histology Tech، Lab | View/Create/Update/Signout/Addendum | receive، grossing، block، slide، report، signout | specimen، block، slide، report | EMR، Lab، Billing، Audit | خطأ عينة/تقرير؛ ضوابط state machine وsignout | Pathology workflow/API |
| بنك الدم | إدارة التبرع والتوافق ونقل الدم | Blood Bank Specialist، Transfusion Doctor، Nurse | View/Create/Update/Approve/Override/Emergency | inventory، donor، crossmatch، issue، transfusion | unit، donor، ABO/Rh، crossmatch | EMR، Lab، Nursing، OR/ER/ICU | عدم توافق دم؛ ضوابط ABO/Rh/crossmatch | Blood safety; screens/API |
| إعادة التأهيل | تقييم وخطط علاج وجلسات | Physiatrist، PT، OT، Speech، Rehab Nurse | View/Create/Update/Approve plan | referral، assessment، goal، session، discharge | referral، assessment، goals، sessions | EMR، Billing، Scheduling | خطة غير مناسبة؛ ضوابط goals/progress | Rehab workflow/API |
| الصيدلية | صرف وإدارة مخزون دوائي | Pharmacist، Technician، Pharmacy Manager | View/Create/Update/Approve/Dispense/Override | review، allergy/interactions، dispense، stock | prescriptions، drugs، batches، stock | EMR، MAR، Inventory، Billing | تداخل/جرعة خاطئة؛ ضوابط CDS وcontrolled log | Pharmacy safety/API |
| الصيدلية السريرية | مراجعة علاجية وTDM | Clinical Pharmacist، ICU/Pediatric/Oncology Pharmacist | View/Create review/Resolve/Recommend | med review، interactions، TDM، intervention، education | meds، allergies، labs، recommendations | EMR، Lab، Pharmacy، MAR | توصية غير معتمدة؛ ضوابط physician approval | Clinical pharmacy tests/API |
| فوترة إلكترونية | إصدار وربط الفواتير والضرائب | Billing، CFO، Accountant | View/Create/Update/Submit gated/Export | invoice، hash chain، credit note، submit gate | invoice، VAT، hash، previous hash | ZATCA، GL، Billing | إرسال دون مفاتيح؛ ضوابط feature flags | Billing/ZATCA tests |
| حسابات المرضى | ملخص مالي ومدفوعات | Accounts، Cashier، Finance | View/Create payment/Refund gated/Print | charge، payment، partial، refund، receipt | account، invoice، payment، refund | Billing، Finance، Insurance | رد مالي غير مخول؛ ضوابط approval/audit | Payment integrity tests |
| التأمين | أهلية وموافقات ومطالبات | Insurance Officer، Finance، Doctor read-only | View/Create/Update claim/Submit/Appeal | eligibility، pre-auth، claim، denial، remittance | policy، claim، lines، denial | NPHIES، Billing، EMR | تعديل أمر طبي ماليا؛ ضوابط read-only clinical | Insurance lifecycle tests |
| المالية | GL، AP/AR، قيود، تقارير | CFO، Accountant، Finance Manager | View/Create/Post/Reverse/Export | journal، post، reverse، aging، reports | accounts، entries، lines، AR/AP | Billing، ZATCA، NPHIES | قيد غير متوازن؛ ضوابط balanced entry/idempotency | Finance engine tests |
| التقارير | مؤشرات وقراءات تشغيلية | Admin، Quality، Finance، CMO/CNO | View/Export/Print/Sensitive حسب الدور | select report، filter، render، export | clinical/finance/ops aggregates | EMR، Finance، Audit | كشف PHI؛ ضوابط RBAC ومجاميع | Report/RBAC tests |
| الموارد البشرية | موظفين، حضور، رواتب، تراخيص | HR، Manager، CIO، CFO | View/Create/Update/Approve payroll/Verify credential | employee، attendance، leave، payroll، credential | employee، salary، license، shifts | HR، Finance، CME، Audit | كشف رواتب؛ ضوابط HR/Admin فقط | HR/workforce tests |
| المخازن | مخزون وشراء وحركات | Inventory Manager، Pharmacy، Department requester | View/Create/Update/Approve/Cancel | item، PO، receipt، movement، count | item، batch، PO، GRN، stock count | Pharmacy، CSSD، Finance | نفاد أو فساد مخزون؛ ضوابط reorder/batch | Inventory tests |
| الأصناف | كتالوج خدمات ومختبر وأشعة | Catalog Admin، Finance، Lab/Radiology | View/Update controlled | service، price، code، override | service catalog، lab/rad catalog | Billing، LIS، RIS | تسعير خاطئ؛ ضوابط catalog access | Catalog tests |
| طلبات الأقسام | طلب مواد وخدمات | Department requester، Inventory، Approver | View/Create/Approve/Reject | request، items، approve، issue | request، items، qty، status | Inventory، Finance، Audit | اعتماد غير مخول؛ ضوابط approval | Dept request workflow |
| التعقيم المركزي | تعقيم أدوات ودورات CSSD | CSSD Tech، OR Nurse، CSSD Manager | View/Create/Update/Release | batch، cycle، BI، release، tray issue | trays، cycles، BI، instruments | OR، Inventory، Infection | release قبل BI؛ ضوابط BI gate | CSSD workflow tests |
| مكافحة العدوى | surveillance وoutbreaks وتدقيق | Infection Nurse، Infection Manager، Quality | View/Create/Update/Resolve/Export | report، classify، isolate، resolve، audit | infection، organism، isolation، hand hygiene | EMR، Lab، Quality | outbreak missed؛ ضوابط alerts/CAPA | Infection tests |
| الجودة | OVR، CAPA، KPI، audit | Quality Manager، Risk، CMO/CNO | View/Create/Update/Approve/Close/Sensitive | incident، triage، CAPA، KPI، close | incident، harm، CAPA، KPI | EMR، Audit، Reports | سرية incident؛ ضوابط confidential gate | Quality/CAPA tests |
| التغذية | أوامر حمية وتقييم غذائي | Dietitian، Nurse، Doctor | View/Create/Update/Approve diet | order، allergies، meal، assessment | diet، allergies، nutrition | ADT، EMR، Kitchen، Billing | حساسية غذاء؛ ضوابط allergy check | Dietary workflow |
| نقل المرضى | نقل داخلي آمن | Transport، Nursing، Department | View/Create/Update/Complete | request، assign، pickup، dropoff | patient، from/to، priority | ADT، Nursing، Audit | نقل خاطئ؛ ضوابط tenant/status | Transport tests |
| الخدمة الاجتماعية | تقييم ودعم اجتماعي | Social Worker، Doctor، Case Manager | View/Create/Update/Close/Sensitive | referral، assessment، plan، follow-up | case، assessment، plan، referrals | EMR، Discharge، Portal | خصوصية اجتماعية؛ ضوابط RBAC/audit | Social workflow |
| الصيانة | أوامر عمل وأصول | Maintenance، Biomedical Engineer، COO | View/Create/Update/Close | request، assign، repair، PM، close | asset، work order، location | Inventory، Quality، Safety | تعطل جهاز حرج؛ ضوابط priority/escalation | Maintenance workflow |
| الإقرارات | موافقات طبية وقانونية | Doctor، Nurse witness، Patient، Legal/HIM | View/Create/Sign/Print/Sensitive | template، explain، sign، archive | consent، procedure، signatures | EMR، Surgery، Blood Bank، HIM | موافقة ناقصة؛ ضوابط mandatory consent | Consent tests |
| السجلات الطبية | HIM، coding، ROI، access log | HIM، Doctor، Audit Officer | View/Code/ROI/Break-glass/Export | coding، ROI، release، access log | record، code، request، access | EMR، Billing، Audit | كشف غير مصرح؛ ضوابط HIM role/break-glass | HIM/RBAC tests |
| بوابة المرضى | خدمة رقمية للمريض | Patient، Portal Manager، Support | View/Create request/Message | login، appointments، results، message | portal user، appointment، message | EMR، Appointments، Telemedicine | كشف نتائج؛ ضوابط auth/consent | Portal tests |
| الطب عن بعد | جلسات افتراضية | Telemedicine Doctor، Coordinator، Patient | View/Create/Update/Complete | schedule، link، consult، complete | session، date/time، link، notes | Portal، EMR، Messaging | رابط غير آمن؛ ضوابط generated link/audit | Telemedicine tests |
| الرسائل | تواصل داخلي آمن | Staff، Doctor، Nurse، Admin | View/Create/Read/Delete حسب الدور | compose، send، read، archive | message، recipient، subject | Notifications، Audit | PHI في رسالة؛ ضوابط RBAC/logging | Messaging tests |
| التعليم الطبي CME | أنشطة وتسجيلات وكفاءات | CME Manager، HR، Nurse Educator، Staff | View/Create/Register/Export | event، activity، registration، attendance | activity، credits، employee | HR، Quality، Credentialing | اعتماد كفاءة غير صحيح؛ ضوابط owner approval | CME tests |
| خدمة الوفيات | تسجيل وإدارة حالات الوفاة | Physician، Mortuary Manager، HIM، Social Work | View/Create/Update/Release/Sensitive | death record، next of kin، storage، release | deceased، cause، physician، release | EMR، HIM، Legal، Billing عند الحاجة | حساسية عالية؛ ضوابط privacy/audit | Mortuary tests |
| الإعدادات | إعدادات النظام والمستخدمين | Admin، CIO، RBAC Officer، Audit Officer | View/Create/Update/Delete users/Admin only | configure، users، integrations، security | settings، users، roles، integrations | All modules، Audit | privilege escalation؛ ضوابط admin gate | Settings/RBAC tests |
| الأسنان | توثيق وعلاج الأسنان | Dentist، Dental Nurse، Reception، Radiology | View/Create/Update dental، Print، Sensitive | select patient، odontogram، diagnosis، treatment، history | tooth، condition، treatment، visit | EMR، Radiology OPG/CBCT، Billing، Consent | كتابة علاجية من غير طبيب أسنان؛ ضوابط Dental RBAC | Dental RBAC/workflow |

## 7. التخصصات الدقيقة المطلوبة

| المجال | التغطية المطلوبة | طريقة التنفيذ الموصى بها |
|---|---|---|
| الباطنة | قلب، صدر، جهاز هضمي، كلى، دم وأورام، سكري وغدد، روماتيزم، مناعة، عدوى، جلدية | Metadata-driven templates داخل clinical_templates لا جداول منفصلة. |
| الجراحة | عامة، قلب وصدر، أوعية، مخ وأعصاب، عمود، عظام، عيون، ENT، مسالك، تجميل، حروق، وجه وفكين | Specialty templates + OR workflow + consent + billing linkage. |
| النساء والأطفال | MFM، IVF، NICU، Pediatrics subspecialties | OB/NICU/PICU templates + neonatal scoring + medication dosing. |
| التشخيص المتقدم | CT، MRI، nuclear، microbiology، chemistry، immunology، genetics، toxicology، blood bank | Catalogs + LIS/RIS/PACS + result verification. |
| الفحوص الوظيفية | ECG، Holter، EEG، EMG، PFT، allergy tests | Orders/results templates + device interface candidates. |
| الطوارئ والعناية | Trauma، chest pain، stroke، pediatric ER، ICU types، burn ICU | ER/ICU protocols + early warning + escalation gates. |
| التخدير والألم | Anesthesia، PACU، Pain، HBOT | OR/anesthesia records + PACU + pain templates. |
| التأهيل | PT، OT، speech، pediatric rehab، prosthetics | Rehab referrals/goals/sessions + outcomes. |
| الخدمات الداعمة | Nutrition، social، patient relations، biomedical، HIS، cybersecurity، translation، statistics، safety، disaster | Operational modules + governance workflows. |
| الإدارة والتعليم | Executive، quality، accreditation، CME، research، HR، legal، PR | Role/owner matrices + reports + audit. |

## 8. Prompt جاهز لأي قسم جديد

```text
صمم أو راجع قسم [اسم القسم] في Hospital OS عربي RTL.
يجب أن يشمل:
1. اسم القسم والهدف التشغيلي.
2. personas: الطبيب/الأخصائي، التمريض المتخصص، الفني/الصيدلي/الإداري، مسؤول القسم، الجهات الداعمة.
3. RBAC action-level: View, Create, Update, Approve, Cancel, Escalate, Print/Export, Sensitive Data.
4. Workflow: البداية، الإدخال، التحقق، التنفيذ، الاعتماد، التوثيق، الفوترة/التأمين، الإغلاق.
5. البيانات: patient, encounter, orders, nursing notes, results, consents, invoices, inventory, records.
6. التكاملات: EMR/EHR, LIS, RIS/PACS, Pharmacy/MAR, Billing, Insurance, Inventory, HR, Portal, Telemedicine, Messaging, Audit.
7. المخاطر والضوابط: clinical, nursing, financial, privacy, operational, RBAC, documentation.
8. الاختبارات: unit, integration, workflow, RBAC, audit, clinical safety, billing, Arabic UTF-8.
9. المخرجات: screens, APIs, DB candidates without DDL, reports, permissions, alerts, audit logs, Arabic docs.
لا تنفذ UI جديداً إلا بوجود Stitch Source أو Stitch Prompt معتمد.
```

## 9. سيناريو عمل موحد

1. يبدأ المريض من الاستقبال أو البوابة أو الطوارئ.
2. يتم تثبيت tenant context والتحقق من الهوية والصلاحية.
3. ينتقل إلى موعد أو قائمة انتظار أو ER/ADT.
4. التمريض يسجل العلامات والفرز والتقييمات.
5. الطبيب يفتح الزيارة ويوثق التشخيص والأوامر.
6. المختبر والأشعة والصيدلية تنفذ الأوامر دون تعديل القرار الطبي.
7. النتائج والتنبيهات تعود للطبيب والتمريض.
8. الأقسام عالية الخطورة تمر عبر safety/approval/audit gates.
9. الفوترة والتأمين تقرأ الخدمات وتدير المطالبات دون تعديل الأوامر السريرية.
10. HIM يدير coding وROI وaccess logs.
11. الإغلاق يكون خروجاً أو تحويلًا أو متابعة أو مطالبة أو أرشفة.

## 10. Data Flow

```text
Patient / Portal / Reception / ER
  -> Auth + RBAC + Tenant Context
  -> Encounter / Queue / ADT
  -> Nursing Documentation + Physician EMR
  -> Orders
     -> LIS / Lab
     -> RIS/PACS / Radiology
     -> Pharmacy / MAR
     -> OR / ICU / Blood Bank / CSSD / Rehab / Dietary
  -> Results + Alerts + Audit Trail
  -> Billing + Insurance + NPHIES + ZATCA
  -> HIM + Coding + ROI
  -> Reports + Quality + Infection Control
```

## 11. Gates

| Gate | النتيجة |
|---|---|
| GATE 0 قراءة النطاق | PASS |
| GATE 1 Role Matrix | PASS |
| GATE 2 Nursing Matrix | PASS |
| GATE 3 Owner Matrix | PASS |
| GATE 4 RBAC Matrix | PASS |
| GATE 5 Workflow Matrix | PASS |
| GATE 6 Integration Matrix | PASS |
| GATE 7 Safety & Compliance Gates | PASS |
| GATE 8 Test Plan | PASS |
| GATE 9 Reports & Audit Trail | PASS |
| GATE 10 عدم سقوط الأقسام | PASS |
| GATE 11 القرار النهائي | PARTIAL بسبب DB integration tests |

## 12. Test Plan آمن

| الفحص | الأمر/المخرج |
|---|---|
| Syntax Backend | `node --check server.js` |
| Syntax Frontend | `node --check public/js/app.js` |
| Static Hospital Gates | `node hospital_os_gate_static_test.js` |
| Static Enterprise Fixes | `node hospital_os_enterprise_discovery_static_test.js` |
| Safe Tests | `npm run test:safe` |
| DB Tests | `BLOCKED_DB_TEST_ENV_REQUIRED` حتى توفير DB اختبار معزولة |
| Mojibake Guard | فحص رموز التلف النصي المعروفة على docs/code قبل الإغلاق |

## 13. Final Status

`FINAL_STATUS: PARTIAL_DOCUMENTATION_COMPLETE_DB_TESTS_BLOCKED`
