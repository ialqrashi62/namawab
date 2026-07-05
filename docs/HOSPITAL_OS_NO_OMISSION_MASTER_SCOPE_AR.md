# Hospital OS No-Omission Master Scope

التاريخ: 2026-07-03  
المبدأ: لا اختصار، لا تجاهل، لا دمج غير واضح بين صلاحيات الطبيب والتمريض والإدارة والفوترة والتأمين والتشخيص.  
القيود: لا DDL، لا Migration، لا Data Write، لا أسرار، لا بيانات مرضى حقيقية، لا UI جديد دون Stitch Source أو Stitch Prompt معتمد.

## 1. النتيجة التنفيذية

هذا الملف هو نطاق عدم الإسقاط الكامل لتطبيق Hospital OS. كل قسم مطلوب مذكور صراحة، وكل قسم له: الشاشات، الأزرار، الجداول أو مرشحات الجداول، APIs، RBAC، Workflow، Integrations، Safety Gates، Audit، Tests، والمخاطر المتبقية.

`FINAL_STATUS: NO_OMISSION_SCOPE_DOCUMENTED_DB_TESTS_BLOCKED`

سبب الحالة: التوثيق الكامل متاح، لكن إثبات الجداول والعلاقات والـ RLS على قاعدة بيانات فعلية يحتاج DB اختبار معزولة.

## 2. مصادر المقارنة العالمية

| المصدر | نطاق المقارنة |
|---|---|
| Oracle Health service lines and departments | خطوط الخدمة، الأقسام، continuum of care، workflow بين التخصصات. |
| Oracle Health products | EHR، revenue cycle، analytics، population health، clinical workflows. |
| MEDITECH product list | Clinical solutions، diagnostic services، blood bank، laboratory، microbiology، pathology، telehealth، transport، registration، scheduling، HIM، revenue cycle. |
| Epic specialty and EHR coverage references | تغطية التخصصات، الطبيب، المختبر، الأشعة، الصيدلية، الأسنان، العيادات، العمليات، patient engagement. |

## 3. الأدوار الطبية بدون إسقاط

| الدور | نطاقه | ممنوع عليه |
|---|---|---|
| طبيب عام | كشف، تشخيص، أوامر، إحالة، متابعة | توقيع أعمال تخصصية لا يملك صلاحيتها إذا قيّدها النظام. |
| طبيب طوارئ | ESI، إنعاش، أوامر طوارئ، disposition | تجاوز audit أو إغلاق حالة حرجة دون توثيق. |
| Hospitalist | تنويم، جولات، خروج، خطط علاج | تعديل سجلات تخصصية مقفلة دون amendment. |
| Intensivist | ICU، ventilator، infusions، sepsis، scores | صرف دواء فعلي بدلاً من الصيدلية. |
| جراح عام | عمليات، pre-op، consent، orders | تخدير أو اعتماد PACU دون تخدير مخول. |
| جراح تخصصي | تخصص جراحي دقيق | اعتماد خارج تخصصه إذا ضبط RBAC يمنعه. |
| طبيب تخدير | anesthesia، airway، pain، PACU medical clearance | تعديل أوامر الجراحة غير المتعلقة بالتخدير دون صلاحية. |
| طبيب نساء وولادة | antenatal، delivery، partogram، C-section | اعتماد neonatal care المتخصص دون neonatology عند الحاجة. |
| طبيب أطفال | pediatrics، dosing، APGAR review | تجاهل weight-based dosing. |
| طبيب حديثي ولادة | NICU، neonatal، APGAR، neonatal orders | توقيع maternal workflow إلا إذا مخول. |
| طبيب أسنان | odontogram، diagnosis، treatment، dental orders | توقيع Physician EMR العام دون صلاحية. |
| Radiologist | report، sign، addendum، critical notify | تعديل أمر الطبيب الأصلي. |
| Pathologist | specimen report، signout، addendum | تعديل أمر الطبيب الأصلي. |
| طبيب مختبر | lab clinical oversight، verify، critical interpretation | تعديل طلب الطبيب دون workflow. |
| طبيب تأهيل | rehab plan، goals، discharge | تعديل أوامر تخصصية غير تأهيلية دون صلاحية. |
| طبيب طب عن بعد | virtual visit، assessment، e-prescription حسب السياسة | استخدام روابط أو قنوات غير مؤرشفة. |
| طبيب الموافقات | clinical consent، procedural approval | توقيع نيابة عن المريض أو الشاهد. |
| استشاري تخصص دقيق | approval، escalation، complex cases | تجاوز RBAC/Audit. |

## 4. الأدوار التمريضية بدون إسقاط

| الدور | نطاقه | ممنوع عليه |
|---|---|---|
| ممرضة استقبال/فرز أولي | قياسات أولية، triage basic، توجيه | تشخيص طبي أو توقيع Physician EMR. |
| ممرضة عيادة خارجية | vitals، preparation، education | تعديل أوامر الطبيب. |
| ممرضة محطة الطبيب | دعم encounter، تنفيذ أوامر، توثيق تمريضي | توقيع SOAP الطبي. |
| ممرضة طوارئ | ER interventions، monitoring | disposition النهائي دون طبيب. |
| Triage Nurse | ESI، priority، escalation | إخفاء critical triage. |
| ممرضة إنعاش | resuscitation support | اعتماد أوامر إنعاش دون طبيب إلا وفق standing protocol. |
| ممرضة تنويم | ward care، MAR، care plan | discharge approval الطبي. |
| Charge Nurse | assignment، escalation، shift oversight | تعديل تشخيص أو أوامر. |
| Head Nurse | staffing، policy compliance | صلاحيات مالية أو طبية غير مخولة. |
| ICU Nurse | ICU flowsheet، infusions documentation، scores | high-alert override دون double-check. |
| CCU Nurse | cardiac monitoring، escalation | اعتماد cardiology plan. |
| PICU Nurse | pediatric ICU monitoring | جرعات دون weight check. |
| NICU Nurse | neonatal monitoring، feeding، incubator notes | neonatal physician sign. |
| Scrub Nurse | sterile field، surgical count | اعتماد operation note. |
| Circulating Nurse | OR flow، timeout support، count witness | إلغاء surgery order. |
| PACU Nurse | recovery، pain، airway observation | PACU discharge الطبي. |
| OB Nurse | labor support، fetal monitoring | obstetric decision النهائي. |
| Midwife | low-risk birth support، partogram documentation | high-risk birth decision دون escalation. |
| Blood Bank Nurse | transfusion verification، reaction monitoring | blood release approval منفرد. |
| Interventional Radiology Nurse | sedation monitoring، procedure support | procedural sign أو radiology report. |
| High-Alert Medication Nurse | double-check، administration | prescribing أو pharmacy verification. |
| Infection Nurse | surveillance، isolation، hand hygiene | diagnosis coding. |
| Quality Nurse | audits، OVR support | تعديل السجل السريري. |
| Nurse Educator | competency، training، CME nursing | منح صلاحيات سريرية تلقائياً. |
| Discharge/Home Care Nurse | education، home instructions | discharge medical decision. |
| Dental Nurse | dental support، read dental record | كتابة علاج أو تشخيص dental مستقل. |

## 5. الأدوار الصيدلانية والتشخيصية والإدارية والحوكمية

| الفئة | الأدوار | صلاحيات | قيود |
|---|---|---|---|
| الصيدلة | صيدلي صرف، فني صيدلة، صيدلي سريري، صيدلي ICU، صيدلي أطفال، صيدلي أورام، معلومات دوائية، TDM، مسؤول التداخلات | review، dispense، reconcile، educate، controlled log | لا تعديل تشخيص ولا أمر طبي؛ يوصي أو يرفض وفق policy. |
| المختبر | أخصائي مختبر، فني، أحياء دقيقة، كيمياء، أمراض دم، أنسجة، بنك دم | collect، result، verify، QC، critical callback | لا تعديل أمر الطبيب. |
| الأشعة | Radiology tech، coordinator، IR support | schedule، worklist، imaging metadata | لا توقيع تقرير إلا Radiologist/Doctor مخول. |
| التأهيل | PT، OT، speech، nutrition، prosthetics | assessment، sessions، goals | لا تعديل خطة الطبيب خارج التأهيل. |
| التشغيل | استقبال، مواعيد، قائمة انتظار، علاقات مرضى، مدراء الأقسام | operational create/update | لا صلاحية سريرية. |
| المالية | CFO، billing، cashier، accounts، insurance | invoice، claim، payment، refund، GL | لا تعديل أوامر الطبيب. |
| التقنية | CIO، admin، security، RBAC officer، audit officer | users، integrations، security، audit | لا قراءة PHI إلا بمسوغ وصلاحية. |
| الحوكمة | CMO، CNO، COO، CFO، CIO، Quality، Risk، Privacy، Legal، Committees | policy، approval، oversight | كل break-glass مؤرشف. |

## 6. مصفوفة الأقسام بدون إسقاط

| # | القسم | الشاشات المطلوبة | الأزرار والقوائم | الجداول/البيانات | APIs | RBAC | Workflow | Integrations | Safety/Audit/Tests |
|---|---|---|---|---|---|---|---|---|---|
| 1 | الاستقبال | تسجيل مريض، بحث، تفاصيل ملف، دفع فتح ملف، تحقق هوية | New Patient، Search، Edit، Check-in، Print، Export، Insurance Check | patients، invoices، appointments، audit_trail | `/api/patients`, `/api/invoices`, `/api/appointments` | Reception view/create/update، Admin full، Finance payment | وصول، تحقق هوية، فتح ملف، ربط موعد، إدخال انتظار | EMR، Billing، Insurance، Queue | PHI gate، duplicate check، tenant، audit، RBAC tests |
| 2 | المواعيد | تقويم، حجز، إلغاء، no-show، check-in، conflict | New Appointment، Reschedule، Cancel، Check-in، No-show، Duplicate Check | appointments، waiting_queue، employees | `/api/appointments`, `/api/appointments/check-conflict` | Appointments create/update/cancel، Doctor view | طلب، تحقق توفر، حجز، إشعار، حضور | Reception، Queue، Portal، Telemedicine | conflict gate، audit، workflow tests |
| 3 | قائمة الانتظار | Queue board، حسب الطبيب، حسب القسم، أولوية | Call، Move to Doctor، Refresh، Filter | waiting_queue، patients، appointments | `/api/waiting-queue`, `/api/doctor/my-queue` | Reception/Nurse/Doctor حسب المرحلة | check-in، ترتيب، دخول، خروج | Appointments، Doctor Station، Nursing | delay alerts، audit، queue tests |
| 4 | محطة الطبيب | قائمة مرضى، SOAP، تشخيص، أوامر، نتائج، توقيع، amendment | Open، Save Note، Order Lab، Order Radiology، Prescribe، Sign، Amend، Print | clinical_records، medical_records، prescriptions، orders، results | `/api/clinical/records`, `/api/medical-records`, `/api/clinical/problem-list` | Doctor create/sign، Nurse document فقط، HIM read حسب role | فتح encounter، تقييم، أوامر، نتائج، توقيع، lock | LIS، RIS، Pharmacy، Billing، CDS | physician sign only، allergy، CDS، audit، clinical safety |
| 5 | التمريض | Vitals، eMAR، care plans، assessments، risk scores | Save Vitals، Administer، Hold، Refuse، New Care Plan، Escalate | nursing_vitals، emar_orders، emar_administrations، nursing_assessments | `/api/nursing/vitals`, `/api/nursing/risk-assessment` | Nurse create/update nursing، Doctor view، Charge approve nursing | قياس، تقييم، إعطاء، مراقبة، تصعيد | EMR، Pharmacy/MAR، ICU، Quality | 5 rights، high-alert double-check، MAR tests |
| 6 | الطوارئ | ER board، register، triage، beds، discharged، transferred | Register، Start Triage، Assign Bed، Discharge، Admit، Transfer، Critical Alert | emergency_visits، emergency_beds، trauma_assessments | `/api/emergency/visits`, `/api/emergency/triage` | ER Doctor، ER Nurse، Reception limited، Admin | arrival، ESI، provider، treatment، disposition | ADT، Lab، Radiology، Pharmacy، Billing | ESI safety، break-glass، audit، ER tests |
| 7 | التنويم | Census، admit، patients، bed map، transfer، discharge | Admit، Assign Bed، Transfer، Discharge، Print Summary | admissions، beds، wards، bed_transfers | `/api/adt/admit`, `/api/admissions`, `/api/beds` | Hospitalist/Doctor approve، Nurse document، Bed manager operational | admission، bed، rounds، transfer، discharge | EMR، Nursing، Dietary، Billing، Insurance | bed state gate، discharge approval، ADT tests |
| 8 | العناية المركزة | ICU board، patients، flowsheet، ventilator، infusions، scores، fluids | Add Monitoring، Vent Settings، Infusion، Score، Fluid Balance، Discharge | icu_monitoring، icu_ventilator، icu_infusions، icu_scores، icu_fluid_balance | `/api/icu/*` | Intensivist/Doctor، ICU Nurse، Clinical Pharmacist view/review | admit، continuous monitoring، orders، escalation، discharge | EMR، Lab، Pharmacy، Nursing | sepsis/EWS، high-alert، ICU tests |
| 9 | العمليات وما قبلها | Schedule، pre-op، anesthesia، OR workflow، rooms، PACU | Schedule، Pre-op Save، Anesthesia Save، WHO Checklist، Count، Complete، Cancel | surgeries، preop_assessments، anesthesia_records، operating_rooms، count_sheet | `/api/surgeries`, `/api/or/*`, `/api/surgery/count-sheet` | Surgeon/Anesthesia/OR Nurse/PACU/CSSD | schedule، consent، pre-op، anesthesia، procedure، PACU | EMR، Blood Bank، CSSD، Billing | WHO gate، surgical count، consent، OR tests |
| 10 | النساء والتوليد | Pregnancy، antenatal، partogram، ultrasound، delivery، neonatal، NST | New Pregnancy، Add Visit، Partogram، Delivery، Neonatal، NST، Alert | ob_pregnancies، antenatal، partogram، ultrasounds، deliveries، neonatal | `/api/obgyn/*` | OB/GYN، Midwife، OB Nurse، Neonatologist | pregnancy، monitoring، delivery، neonatal handoff | Lab، Radiology، NICU، Billing | maternal/fetal alerts، APGAR، OB tests |
| 11 | جراحة التجميل | Procedures، cases، new case، consents، follow-ups، photos metadata | Schedule Case، Complete، Sign Consent، Print، Follow-up | cosmetic_procedures، cosmetic_cases، cosmetic_consents، cosmetic_photos، followups | `/api/cosmetic/*` | Cosmetic Surgeon، Nurse، Coordinator | consult، consent، schedule، procedure، follow-up | EMR، Consent، Billing، PHI vault | consent/photo privacy، audit، cosmetic tests |
| 12 | المختبر | Orders، samples، results، QC، HL7، microbiology، LOINC | New Order، Collect Sample، Enter Result، Verify، Callback، QC | lab_orders، lab_samples، lab_results، lab_qc، microbiology | `/api/lab/*`, `/api/results/*` | Lab Tech create، Lab Doctor verify، Doctor view | order، sample، analyze، verify، critical callback | EMR، LIS/HL7، Billing | QC، critical result، lab tests |
| 13 | الأشعة | Orders، catalog، worklist، DICOM، report، priors، critical notify | New Order، Upload، Report، Sign، Addendum، Critical Notify | radiology_orders، dicom_studies، radiology_reports، phi_files | `/api/radiology/*`, `/api/phi-files/*` | Radiologist sign، Tech image، Doctor view | order، image، report، sign، notify | EMR، RIS/PACS، Billing | critical notify، PHI file guard، radiology tests |
| 14 | علم الأمراض | Specimens، blocks، slides، reports، signout، addendum | Accession، Add Block، Add Slide، Save Report، Sign Out، Addendum | pathology_specimens، blocks، slides، reports | `/api/pathology/*` | Pathologist sign، Lab/Pathology tech create | receive، grossing، processing، report، signout | EMR، Lab، Billing | state machine، immutable signed report، pathology tests |
| 15 | بنك الدم | Inventory، donors، crossmatch، transfusions، reactions | Add Unit، Register Donor، Crossmatch، Issue، Transfuse، Recall، Discard | blood_bank_units، donors، crossmatch، transfusions | `/api/bloodbank/*` | Blood Bank Specialist، Doctor approve، Nurse verify | stock، donor، compatibility، release، transfusion | Lab، OR، ER، ICU، Nursing | ABO/Rh، incompatibility block، blood tests |
| 16 | إعادة التأهيل | Referrals، patients، sessions، assessments، goals | New Referral، Add Session، Assessment، Goal، Progress، Discharge | rehab_patients، rehab_sessions، rehab_goals، rehab_assessments | `/api/rehab/*` | Rehab Doctor، PT/OT/Speech، Nurse view | referral، assessment، plan، sessions، outcome | EMR، Scheduling، Billing | goal progress، audit، rehab tests |
| 17 | الصيدلية | Drugs، low stock، queue، batches، dispense، controlled substances | Add Drug، Verify، Dispense، Reconcile، Controlled Dispense، Print Label | pharmacy_drug_catalog، prescriptions_queue، batches، controlled_log | `/api/pharmacy/*` | Pharmacist verify/dispense، Technician limited، Nurse MAR only | review، interaction، allergy، dispense، stock update | EMR، MAR، Inventory، Billing | allergy/interactions، controlled double-sign، pharmacy tests |
| 18 | الصيدلية السريرية | Reviews، interactions، medication reconciliation، education، TDM | Review، Resolve، Recommend، Med Recon، Educate | clinical_pharmacy_reviews، drug_interactions، med_reconciliation | `/api/clinical/medication-reconciliation`, `/api/drug-interactions/check` | Clinical Pharmacist، Doctor approve | review meds، labs، intervention، physician action | EMR، Lab، Pharmacy | no diagnosis edit، intervention audit، clinical pharmacy tests |
| 19 | فوترة إلكترونية | ZATCA invoices، credit notes، invoice chain، submission status | Generate، Submit، Credit Note، Print، Export | invoices، zatca_invoices، credit_notes | `/api/zatca/*`, `/api/invoices/*` | Finance/Billing، CFO، Admin | invoice، hash، submit gated، archive | ZATCA، GL، Billing | feature flags، no real submission without keys، billing tests |
| 20 | حسابات المرضى | Account summary، payments، refunds، partial pay، receipts | Pay، Partial Pay، Refund، Print Receipt، Export | invoices، payments، patient_accounts | `/api/patients/:id/account`, `/api/invoices/:id/pay` | Accounts/Finance only | charge، collect، refund، close | Billing، Finance، Insurance | refund approval، idempotency، payment tests |
| 21 | التأمين | Companies، policies، eligibility، pre-auth، claims، denials، remittance | Eligibility، Preauth، Submit Claim، Appeal، Remittance، Post AR | insurance_companies، policies، claims، lines، denials، remittance | `/api/insurance/*`, `/api/nphies/*` | Insurance/Finance، Doctor read clinical only | eligibility، auth، claim، denial، remittance | NPHIES، Billing، EMR | cannot edit doctor orders، claim lifecycle tests |
| 22 | المالية | Accounts، journal، vouchers، AP، AR، aging، financial reports | New Account، Journal، Post، Reverse، Pay AP، Collect AR، Generate Report | finance_accounts، journal_entries، journal_lines، AP، AR | `/api/finance/*` | CFO/Finance/Accounts | create، validate، post، reverse، report | Billing، ZATCA، NPHIES | balanced entry، idempotency، finance tests |
| 23 | التقارير | Dashboard reports، clinical، financial، operational، audit | Filter، Generate، Export، Print، Drilldown | reports snapshots، aggregates | `/api/reports/*`, `/api/dashboard/*` | حسب التقرير: Finance، Quality، Admin، HIM | select، filter، generate، export | كل الأنظمة | PHI masking، RBAC، report tests |
| 24 | الموارد البشرية | Employees، payroll، leaves، attendance، credentialing، GOSI، WPS، Nitaqat | Add Employee، Leave، Attendance، Generate Payroll، Verify Credential | hr_employees، attendance، leaves، payroll، credentials | `/api/hr/*` | HR، Finance payroll، Admin | hire، schedule، payroll، credential، compliance | Finance، CME، Audit | salary privacy، credential alerts، HR tests |
| 25 | المخازن | Items، batches، purchase orders، receipts، movements، stock counts، low stock | Add Item، PO، Receive، Move، Count، Reorder | inventory_items، batches، purchase_orders، goods_receipts، movements | `/api/inventory/*` | Inventory/Pharmacy، Approver | request، procure، receive، issue، count | Pharmacy، CSSD، Finance | stock race، expiry، reorder tests |
| 26 | الأصناف | Medical services، lab catalog، radiology catalog، prices، overrides | Add/Update Service، Update Price، Filter، Export | medical_services، lab_catalog، radiology_catalog، tenant_overrides | `/api/medical/services`, `/api/catalog/*` | Catalog Admin، Finance، Lab/Rad heads | define، price، approve، publish | Billing، LIS، RIS | pricing errors، catalog tests |
| 27 | طلبات الأقسام | Department requests، items، approve/reject، issue | New Request، Add Item، Approve، Reject، Issue | inventory_dept_requests، request_items | `/api/dept-requests` | Department requester، Inventory approver | request، approve، fulfill، close | Inventory، Finance | unauthorized approval، request tests |
| 28 | التعقيم المركزي CSSD | Instruments، batches، cycles، BI result، trays، issue | Add Set، Start Cycle، Complete، BI Result، Release، Issue Tray | cssd_instrument_sets، sterilization_cycles، load_items، trays | `/api/cssd/*` | CSSD، OR Nurse، Surgery | collect، sterilize، BI، release، issue | OR، Infection، Inventory | BI gate، sterile release tests |
| 29 | مكافحة العدوى | Surveillance، reports، hand hygiene، outbreaks، exposure | Report، Resolve، Hand Hygiene Audit، Isolation، Export | infection_surveillance، outbreaks، hand_hygiene، reports | `/api/infection-control/*`, `/api/infection/*` | Infection Control، Quality، Nurse | detect، isolate، investigate، resolve | Lab، Nursing، Quality | outbreak alerts، infection tests |
| 30 | الجودة | Incidents، CAPA، KPI، satisfaction، audit logs | New Incident، CAPA، Close، KPI، Export | quality_incidents، CAPA، KPIs، satisfaction | `/api/quality/*`, `/api/audit-trail` | Quality Manager، Risk، CMO/CNO | report، triage، action، close | EMR، Audit، Reports | confidential gate، OVR tests |
| 31 | التغذية | Diet orders، meals، nutrition assessment، allergies | Order Diet، Update Meal، Assessment، Print | diet_orders، diet_meals، nutrition_assessments | `/api/dietary/*` | Dietitian، Doctor، Nurse | order، check allergy، prepare، deliver | ADT، EMR، Billing | allergy risk، dietary tests |
| 32 | نقل المرضى | Transport requests، assignment، pickup، dropoff، completion | New Request، Assign، Pickup، Complete، Cancel | transport_requests | `/api/transport/requests` | Transport، Nursing، Department | request، assign، move، complete | ADT، Nursing، Audit | wrong patient/location، transport tests |
| 33 | الخدمة الاجتماعية | Social cases، assessment، plan، referrals، follow-up | New Case، Update Plan، Referral، Close | social_work_cases | `/api/social-work/cases` | Social Worker، Doctor view، Case Manager | referral، assessment، intervention، follow-up | EMR، Discharge، Portal | privacy، social tests |
| 34 | الصيانة | Work orders، biomedical assets، PM، equipment | New WO، Assign، Complete، Add Asset، PM Schedule | maintenance_work_orders، equipment، PM | `/api/maintenance/*` | Maintenance، Biomedical، COO | request، triage، repair، validate، close | Inventory، Quality | critical device downtime، maintenance tests |
| 35 | الإقرارات | Templates، patient consent، signature، print، archive | New Template، Sign، Print، View، Revoke by policy | consent_forms، consent_templates | `/api/consent/*`, static consent forms | Doctor explain، Patient sign، HIM archive | select، explain، sign، store | EMR، Surgery، Blood Bank، HIM | missing consent، consent tests |
| 36 | السجلات الطبية HIM | Medical records، coding، ROI، access log، break-glass | Code، ROI Request، Approve Release، Break Glass، Export | medical_records، coding، ROI، access_log | `/api/him/*`, `/api/medical-records/*` | HIM/Admin، Doctor limited | code، release، audit، archive | Billing، Audit، EMR | privacy، break-glass audit، HIM tests |
| 37 | بوابة المرضى | Portal dashboard، appointments، results، messages، telehealth | Request Appointment، View Results، Message، Join Televisit | portal_users، portal_appointments، portal_messages | `/api/portal/*` | Patient، Portal Admin، Support | login، request، view، communicate | EMR، Telemedicine، Messaging | patient privacy، portal tests |
| 38 | الطب عن بعد | Sessions، schedule، meeting link، complete، notes | Schedule، Join، Complete، Cancel، Send Message | telemedicine_sessions | `/api/telemedicine/sessions` | Doctor/Telemedicine Coordinator | schedule، link، consult، document، close | Portal، EMR، Messaging | secure link، audit، telemedicine tests |
| 39 | الرسائل | Inbox، sent، compose، read، delete، notifications | Compose، Send، Mark Read، Delete، Filter | internal_messages، notifications | `/api/messages`, `/api/notifications` | Staff by tenant، Admin audit | compose، send، read، archive | All modules، Audit | PHI leakage، messaging tests |
| 40 | التعليم الطبي CME | Activities، events، registrations، credits، competencies | Add Activity، Register، Attendance، Export، Credential Link | cme_activities، registrations، cme_events، competencies | `/api/cme/*`, `/api/hr/competencies` | HR/CME Manager، Nurse Educator، Staff | create، register، attend، credit، report | HR، Quality، Credentialing | false competency، CME tests |
| 41 | خدمة الوفيات | Mortuary cases، death record، storage، release، documents | Register، Update Release، Print، Notify Kin، Close | mortuary_cases | `/api/mortuary/cases` | Mortuary، Physician، HIM، Social Work | record، identify، store، release، archive | EMR، HIM، Legal، Billing | high privacy، mortuary tests |
| 42 | الإعدادات | Hospital settings، users، roles، integrations، cybersecurity، compliance | Save، Create User، Update Role، Disable، Reset MFA، Integration Save | system_users، settings، integration_settings، audit | `/api/settings/*`, `/api/mfa/*` | Admin/CIO/RBAC Officer | configure، provision، audit، secure | All modules | privilege escalation، settings tests |
| 43 | الأسنان | Dental charting، odontogram، history، diagnosis، treatment | Select Patient، Select Tooth، Save Tooth Record، History، Print | dental_records، patients، radiology_orders OPG/CBCT candidate | `/api/dental/records` | Dentist write، Dental Nurse read، Doctor/Admin allowed | select patient، chart، diagnose، treat، history | EMR، Radiology، Billing، Consent | dental RBAC، no nurse treatment write، dental tests |

## 7. التخصصات الدقيقة بدون تجاهل

| المجموعة | التخصصات المطلوبة | شاشة أو Template | تكاملات | اختبارات |
|---|---|---|---|---|
| الباطنة | القلب، الصدر، الجهاز الهضمي، الكلى، الدم والأورام، السكري والغدد، الروماتيزم، المناعة، الأمراض المعدية، الجلدية | Specialty EMR templates | Lab، Radiology، Pharmacy، Billing | specialty workflow، CDS |
| الجراحة | العامة، القلب والصدر، الأوعية، المخ والأعصاب، العمود الفقري، العظام، العيون، ENT، المسالك، التجميل، الحروق، الوجه والفكين | OR + specialty templates | OR، Anesthesia، Blood Bank، CSSD | OR safety، consent |
| النساء والأطفال | طب الأم والجنين، IVF، حديثي الولادة، NICU، طب الأطفال، تخصصات الأطفال الدقيقة | OB/NICU/PICU templates | Lab، Ultrasound، Pharmacy، Nursing | neonatal/APGAR/dosing |
| التشخيص المتقدم | CT، MRI، الطب النووي، الميكروبيولوجي، الكيمياء، المناعة، الوراثة، السموم، بنك الدم | RIS/LIS catalogs | PACS، HL7، EMR | result verify، critical callback |
| الفحوص الوظيفية | ECG، Holter، EEG، EMG، PFT، اختبارات الحساسية | Orders/results forms | Device integration candidates | result workflow |
| الطوارئ والعناية | Trauma، chest pain، stroke، pediatric ER، medical ICU، surgical ICU، CCU، neuro ICU، PICU، NICU، burn ICU | ER/ICU protocols | Lab، Radiology، Pharmacy | EWS، sepsis، triage |
| التخدير والألم | Anesthesia، PACU، Pain Management، HBOT | anesthesia and pain templates | OR، ICU، Pharmacy | anesthesia safety |
| التأهيل | PT، OT، speech/swallowing، pediatric rehab، prosthetics | Rehab modules | EMR، Scheduling | goals/outcomes |
| الخدمات الداعمة | التغذية، الخدمة الاجتماعية، علاقات المرضى، الهندسة الطبية، HIS، الأمن السيبراني، الترجمة الطبية، الإحصاء الطبي، السلامة، إدارة الكوارث | Operational modules | Quality، Reports، Audit | operational tests |
| الإدارة والتعليم | الإدارة التنفيذية، الجودة، الاعتماد، CME، البحث العلمي، HR، الشؤون القانونية، العلاقات العامة | Governance dashboards | Reports، Audit، HR | governance tests |

## 8. الأزرار والقوائم المشتركة التي لا يجوز إسقاطها

| النوع | الأزرار |
|---|---|
| قراءة | View، Open، Details، Search، Filter، Refresh |
| إنشاء | New، Add، Register، Schedule، Create، Request |
| تعديل | Edit، Update، Save Draft، Save Changes |
| اعتماد | Approve، Verify، Sign، Sign Out، Post، Release |
| رفض/إلغاء | Reject، Cancel، Void، Reverse، Recall، Discard |
| تصعيد | Escalate، Critical Alert، Break Glass، Notify |
| طباعة/تصدير | Print، Export CSV، Export PDF، Download |
| إغلاق | Complete، Close، Discharge، Transfer، Archive |
| أمان | Permission Denied، Audit View، MFA Reset، Disable User |

## 9. حالات الواجهة التي لا يجوز إسقاطها

| الحالة | المطلوب |
|---|---|
| Empty State | رسالة واضحة، زر إجراء مناسب حسب RBAC. |
| Loading State | مؤشر تحميل لا يكسر RTL. |
| Error State | رسالة خطأ آمنة لا تعرض secrets أو PHI. |
| Permission Denied | توضيح منع الصلاحية مع audit. |
| Validation Error | حقول واضحة، لا إرسال ناقص. |
| Offline/Integration Down | حالة تكامل متعطل دون فقدان البيانات. |
| Critical Alert | لون وتحذير وتصعيد وتوثيق. |
| Locked Record | منع التعديل، إظهار amendment flow. |

## 10. فلو بيانات كامل

```text
Patient / Portal / Reception / ER
  -> Authentication
  -> RBAC
  -> Tenant Context
  -> Patient Master
  -> Appointment / Queue / Encounter / ADT
  -> Nursing Vitals / Assessments / MAR
  -> Physician EMR / Diagnosis / Orders
  -> Consent if required
  -> Lab / Microbiology / Pathology
  -> Radiology / RIS / PACS / DICOM
  -> Pharmacy / Clinical Pharmacy / Controlled Substances / MAR
  -> OR / Anesthesia / PACU / CSSD
  -> ICU / Blood Bank / Dietary / Rehab / Transport / Social Work
  -> Results / Critical Callbacks / Alerts
  -> Billing / Patient Accounts / Insurance / NPHIES / ZATCA / Finance
  -> HIM / Coding / ROI / Medical Records / Audit Trail
  -> Reports / Quality / Infection Control / Governance
  -> Close / Discharge / Transfer / Follow-up / Archive
```

## 11. Prompt كامل بدون اختصار

```text
افحص أو صمم قسم [اسم القسم] في Hospital OS.
لا تختصر ولا تسقط أي دور أو شاشة أو زر أو جدول أو API أو RBAC أو workflow.

لكل قسم اكتب:
1. اسم القسم.
2. الهدف التشغيلي.
3. المستخدمون:
   - الطبيب أو الأخصائي.
   - التمريض المتخصص.
   - الفني أو الصيدلي أو الإداري.
   - مدير القسم.
   - HIM.
   - الجودة.
   - مكافحة العدوى عند الحاجة.
   - الفوترة والتأمين عند الحاجة.
4. الشاشات.
5. الأزرار.
6. القوائم والفلاتر.
7. الجداول أو مرشحات الجداول.
8. APIs.
9. RBAC action-level:
   View, Create, Update, Approve, Cancel, Escalate, Print, Export, Override, Emergency Access, Sensitive Data Access.
10. Workflow:
   البداية، الإدخال، التحقق، التنفيذ، الاعتماد، التوثيق، الفوترة، التأمين، الإغلاق.
11. Integrations:
   EMR, LIS, RIS/PACS, Pharmacy/MAR, Billing, Insurance/NPHIES, Inventory, HR, Patient Portal, Telemedicine, Messaging, Audit.
12. Safety gates.
13. Approval gates.
14. Audit gates.
15. Tests:
   Unit, Integration, Workflow, RBAC, Audit, Clinical Safety, Billing/Insurance, Arabic UTF-8.
16. Risks:
   Clinical, Nursing, Financial, Privacy, Operational, RBAC, Documentation.
17. Output:
   Screens, APIs, DB candidates without DDL, Reports, Permissions, Alerts, Audit logs, Arabic UTF-8 documentation.

لا تسمح للفوترة أو التأمين بتعديل أوامر الطبيب.
لا تسمح للصيدلية بتغيير التشخيص.
لا تسمح للمختبر أو الأشعة بتعديل أوامر الطبيب.
لا تسمح للتمريض بتوقيع Physician EMR.
أي UI جديد يحتاج Stitch Source أو Stitch Prompt معتمد.
```

## 12. ملحق نطاق المنتجات الرقمية والتخصصات الفائقة المطلوب إضافته

هذا الملحق يضيف إلى التقرير السابق نطاقاً تشغيلياً وتقنياً أوسع بناءً على طلب المالك، بدون تنفيذ DDL، بدون Migration، بدون Data Write، وبدون واجهات UI جديدة قبل Stitch Source أو Stitch Prompt معتمد.

### 12.1 نطاق منتجات التسليم الرقمية

| المجال | المطلوب في Hospital OS | القرار الآمن |
|---|---|---|
| Prompt Engineering | مكتبة prompts محكومة لكل قسم، مع قيود سلامة، RBAC، PHI، وسياق عربي/إنجليزي. | توثيق وإنشاء prompt catalog فقط قبل التنفيذ. |
| System Prompt | System prompts حسب الدور: طبيب، تمريض، صيدلية، مختبر، أشعة، إدارة، مالية، جودة. | يمنع خلط صلاحيات الدور داخل prompt واحد. |
| Context | سياق tenant، facility، role، encounter، department، consent، audit، language، clinical safety. | لا يسمح بسياق مجهول أو خارج tenant. |
| Workflow & Orchestration | Orchestrator يربط الطلبات، النتائج، الاعتماد، التصعيد، الفوترة، التأمين، والتوثيق. | backend workflow فقط، لا DB write في هذه المرحلة. |
| LangChain | سلاسل RAG وtools وربط آمن مع مصادر معرفة داخلية. | يحتاج بيئة اختبار وسجلات audit قبل التشغيل الطبي. |
| Chaining | تسلسل مهام: intake -> validation -> recommendation -> human approval -> audit. | لا اعتماد طبي آلي بدون موافقة بشرية. |
| VectorMine | طبقة تعدين/بحث معرفي vectorية للأدلة، السياسات، البروتوكولات، والأسئلة المتكررة. | وثيقة متطلبات قبل اختيار التنفيذ. |
| Backend / Logic | خدمات آمنة متعددة المستأجرين مع RBAC action-level وtenant stamping. | backend-only عند الإصلاح، بدون DDL. |
| API | OpenAPI لكل قسم، مع scopes، responses، errors، audit headers، idempotency. | توثيق مواصفات قبل توسيع endpoints. |
| Data & Storage | ERD مرشح، data dictionary، retention، masking، backup، audit. | لا إنشاء جداول أو migrations في هذه المرحلة. |
| Vector Databases | PGVector أو بدائل مع metadata filtering حسب tenant/role/source. | لا تحميل بيانات مرضى حقيقية. |
| RAG | Retrieval محكوم بالمصادر، citation، freshness، confidence، no-PHI leakage. | RAG مساعد قرار وليس بديلاً عن الطبيب. |
| Frontend / UI-UX | Wireframes، RTL، responsive، loading/error/empty states، accessibility. | أي UI جديد يحتاج Stitch Source أو Stitch Prompt معتمد. |
| Shutterstock / Assets | سياسة أصول مرخصة للصور غير السريرية والتدريبية. | لا استخدام صور مرضى حقيقية أو أصول بلا ترخيص. |
| Infrastructure / DevOps | بيئات dev/test/staging/prod، secrets، PM2، مراقبة، نسخ احتياطي. | لا Production Deploy ضمن هذا الملحق إلا بأمر مستقل. |
| CI/CD | lint، static checks، safe tests، deploy gates، rollback plan. | لا migration تلقائي بدون gate مستقل. |
| Testing & QA | خطة Unit/Integration/Workflow/RBAC/Audit/Security/Arabic UTF-8. | DB tests محجوبة حتى تتوفر DB اختبار معزولة. |
| Unit Testing | اختبار منطق الخدمات، RBAC helpers، validation، mapping. | آمن دون DB. |
| Integration Testing | تكامل APIs مع tenant/RBAC/audit. | BLOCKED_DB_TEST_ENV_REQUIRED عند الحاجة DB. |
| Wireframes & Mockups | خرائط شاشات لكل قسم وrole، مع empty/error/loading. | Stitch Prompt أولاً. |
| Business Flows | سيناريوهات تشغيلية كاملة لكل قسم. | لا تغيير workflow طبي لأجل الشكل. |
| Database ERD | ERD مقترح للأقسام، العلاقات، القيود، audit، tenancy. | مرشح فقط، لا DDL. |
| API Specifications (OpenAPI) | ملفات OpenAPI لكل domain عالي المخاطر والتكاملات. | يجب ربطها بالصلاحيات والإجراءات. |
| User Stories & Acceptance Criteria | قصص مستخدم ومعايير قبول لكل role/action. | تشمل السلامة والصلاحيات والتدقيق. |
| Test Cases & Test Plan | حالات اختبار تفصيلية لكل workflow. | لا تستخدم PHI أو production DB. |
| Architecture Document | معمارية modules، services، integrations، data flow، risks. | وثيقة مرجعية قبل التنفيذ. |
| Security Plan | RBAC، ABAC عند الحاجة، audit، emergency access، secrets، masking. | لا أسرار مطبوعة. |
| Deployment Plan | runbook، backup، smoke، rollback، health، monitoring. | منفصل عن هذا الملحق. |
| Style Guide / Design System | tokens، typography، colors، spacing، components، RTL. | من Stitch فقط. |
| i18n Translation Files | ملفات ترجمة عربية/إنجليزية لكل labels/errors/states. | فحص UTF-8 وmojibake إلزامي. |
| Sample Data / Seeders | بيانات تدريب وهمية غير PHI للأقسام والسيناريوهات. | لا data write الآن. |
| Migration Scripts | migrations مستقبلية محكومة بالمراجعة. | ممنوعة في هذه المرحلة. |
| User Manual | أدلة مستخدم عربية لكل دور وقسم. | بدون أسرار أو بيانات مرضى. |
| Training Videos | سيناريوهات تدريبية لاحقة لكل workflow. | تستخدم بيانات وهمية. |
| Legal & Compliance Docs | PDPL، CBAHI، NPHIES، ZATCA، consent، retention، ROI. | مراجعة قانونية قبل الاعتماد النهائي. |

### 12.2 الطب الباطني والتخصصات الدقيقة

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| Cardiology | General Cardiology، Interventional Cardiology، Electrophysiology، Preventive Cardiology، Nuclear Cardiology، Cardio-Obstetrics، Cath Lab، Peripheral Vascular Disease، Advanced Heart Failure. |
| Pulmonology | Pulmonology، Allergic Pulmonology، Sleep Medicine، Respiratory Care، Bronchoscopy، Home Oxygen. |
| Gastroenterology / Hepatology | Gastroenterology، Advanced Endoscopy مثل EUS وERCP وEnteroscopy وMedical Laparoscopy، Hepatology، Pancreato-Biliary، GI Motility، Clinical Nutrition Medicine. |
| Nephrology | Nephrology، Renal Transplant، Hemodialysis، Peritoneal Dialysis، Home Dialysis، Plasmapheresis، Pediatric Dialysis. |
| Hematology / Oncology | Medical Oncology، Gynecologic Oncology، Hematology، Coagulation، Anemia، Bone Marrow Transplant: Autologous، Allogeneic، Cord Blood. |
| Endocrinology / Diabetes | Endocrinology، Diabetology Type 1، Type 2/Insulin Resistance، Gestational Diabetes، Diabetic Foot/Neuropathy، Metabolic Bone، Obesity Medicine. |
| Rheumatology / Immunology | Rheumatology، Clinical Immunology، Autoimmune Diseases، Allergy، Asthma. |
| Infectious / Tropical | Infectious Diseases، Infection Control، Tropical Medicine، Antimicrobial Stewardship، Travel Medicine، Vaccination Center. |
| Dermatology | Dermatology، Cosmetic Dermatology، Dermatosurgery، Dermatologic Oncology، Phototherapy. |

### 12.3 الأقسام الجراحية

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| General Surgery | General Surgery، Surgical Oncology، Endocrine Surgery: Thyroid/Adrenal/Parathyroid، Minimally Invasive/Robotic Surgery، Bariatric Surgery، Breast Surgery، Trauma Surgery، Colorectal Surgery. |
| Cardiothoracic / Vascular | Open Heart Surgery، Thoracic Surgery، Airway Surgery، Endovascular Surgery، Vascular Grafts، Venous Disease. |
| Neurosurgery / Spine | Cerebrovascular Neurosurgery، Neuro-Oncology Surgery، Functional Neurosurgery، Peripheral Nerve Surgery، Skull Base Surgery، Endoscopic Neurosurgery، Spine Surgery، Interventional Spine، Scoliosis. |
| Orthopedics | General Orthopedics، Spine Orthopedics، Arthroplasty: Hip/Knee/Shoulder/Elbow، Trauma Orthopedics، Hand/Microsurgery، Foot/Ankle، Sports/Arthroscopy، Orthopedic Oncology، Pediatric Orthopedics. |
| Ophthalmology | General Ophthalmology، Vitreoretinal، Cornea/External Disease، Eye Bank، DMEK/DSAEK، Cataract/Anterior Segment، Glaucoma، Oculoplastics/Orbit، Lacrimal، Pediatric/Strabismus، Neuro-Ophthalmology، Refractive/Lens. |
| ENT | General ENT، Head and Neck Surgery، Rhinology/Skull Base، Advanced Sinus Endoscopy، Otology/Neurotology، Cochlear Implant، Ear Skull Base، Laryngology، Thyroid Neck Surgery، Sleep Surgery. |
| Urology / Andrology | General Urology، Endourology/Stone، Urologic Oncology: Prostate/Bladder/Kidney، Pediatric Urology، Andrology/Infertility، Male ART، Fertility Restoration after Chemotherapy، Female Urology/Urodynamics، Reconstructive Urology. |
| Plastic / Burns / Maxillofacial | Facial Plastic، Body Contouring، Microsurgery، Composite Tissue Allotransplantation، Burns Center: Chemical/Electrical/Burn ICU/Post-Burn Reconstruction، Maxillofacial: Orthognathic/Facial Trauma. |

### 12.4 النساء والتوليد والأطفال

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| Obstetrics / Gynecology | General OB/GYN، Maternal Fetal Medicine، High-Risk Pregnancy، Prenatal Diagnosis، 4D Ultrasound، CVS/Amniocentesis، Gynecologic Surgery، Laparoscopy، Robotics، Reproductive Endocrinology/IVF، IVF Lab، ICSI، IMSI، PGD/PGS، Cryopreservation، Sperm Bank، Egg/Embryo Bank، Ovarian Tissue Bank، Adolescent Gynecology، Menopause، Urogynecology، Cosmetic Gynecology. |
| Pediatrics / Neonatology | General Pediatrics، Neonatology، NICU Level III/IV، Nursery، Preterm Follow-up، Pediatric Genetics، Pediatric Nutrition، Developmental/Behavioral Pediatrics. |
| Pediatric Subspecialties | Pediatric Cardiology، Pediatric Cardiac Catheterization، Pediatric Cardiac Surgery، Pediatric Nephrology، Pediatric Gastroenterology، Pediatric Hematology/Oncology، Pediatric Ophthalmology، Pediatric ENT، Pediatric Dermatology، Pediatric Endocrine/Metabolic، Pediatric Rheumatology/Immunology، Pediatric Orthopedics، Pediatric General Surgery، Birth Defects، Pediatric Laparoscopy، Pediatric Oncology Surgery. |

### 12.5 التشخيص المتقدم والفحوصات الوظيفية

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| Radiology | Diagnostic Radiology، Interventional Radiology، Angiography، Embolization، Tumor Ablation، Stenting، IVC Filters، CT Dual Energy، Cardiac CT، Extremity CTA، MRI: fMRI/Spectroscopy/DTI/MRA/MRV/Breast/Pelvic، Ultrasound: TEE/TRUS/4D Fetal/Vascular Doppler، Nuclear Medicine، PET-CT، PET-MRI، Bone Scan، Thyroid Scan، Renal Scan، Myocardial Perfusion، I-131 Therapy، Radioisotope Therapy. |
| Central Labs | Pathology: Histopathology/Cytopathology/Frozen Section/Electron Microscopy/IHC/Molecular Pathology، Microbiology: Bacteriology/Virology/Mycology/Parasitology/Blood Culture/Antibiotic Sensitivity، Clinical Chemistry: Routine/Hormones/Tumor Markers/TDM، Immunology/Serology: Autoimmune/Allergy، Medical Genetics: Cytogenetics/Molecular Genetics/PGD، Toxicology: Drugs/Heavy Metals/Pesticides، Blood Bank: Transfusion/Apheresis/Cell-Derived Therapy/Single Donor Platelets. |
| Functional Tests | ECG، Stress Testing، Exercise Stress، Dobutamine Stress Echo، Holter، Event Recorder، Cerebral Angiography، Bronchial Angiography، EMG/NCS، Evoked Potentials، EEG، Video EEG، Sleep EEG، PFT، Exercise Tolerance، Gas Diffusion، Sweat Testing، Allergy Testing. |

### 12.6 العناية والطوارئ والتخدير

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| Emergency | General ER، Trauma Center Level I/II، Chest Pain Unit، Stroke/Code Stroke، Psychiatric Emergency، Pediatric ER، Toxicology Emergency، Hyperthermia/Hypothermia، Triage، Observation، Minor Surgery ER. |
| Intensive Care | Medical ICU، Surgical ICU، Trauma ICU، CCU، Post-Cath Care، Post-Open-Heart Care، Neuro ICU، PICU، NICU، Burn ICU، Oncology ICU، Renal/Dialysis ICU، Transplant ICU، Obstetric ICU. |
| Anesthesia / Pain | General Anesthesia، Obstetric Anesthesia، Pediatric Anesthesia، Cardiac Anesthesia، Interventional Pain، Spine Injections، Radiofrequency Ablation، Spinal Cord Stimulator، Intrathecal Pumps، PACU، Hyperbaric Oxygen Therapy. |

### 12.7 الخدمات العلاجية والتأهيلية

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| PM&R | Physical Therapy: Electrotherapy/Hydrotherapy/Manual/Post-Op/Spine Pain، Occupational Therapy: ADL Rehab/Sensory Integration، Speech and Swallowing، VFSS، Spinal Cord Injury Rehab، Pediatric Rehab، Prosthetics/Orthotics، Child Life/Play Therapy. |
| Oncology Therapeutics | Radiation Oncology، IMRT، SRS، Gamma Knife، CyberKnife، Proton Therapy، Brachytherapy، Clinical Pharmacy Units: Chemotherapy/ICU/Pediatric/Hematology/Drug Information/TDM. |
| Integrative Medicine | Traditional Chinese Medicine، Acupuncture، Cupping، Herbal Medicine، Aromatherapy، Music Therapy، Art Therapy، Medical Massage، Medical Yoga، Pet Therapy. |

### 12.8 الخدمات المساندة والداعمة

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| Nursing & Patient Care | Nursing Administration، Medical-Surgical Nursing، Perioperative Nursing، Critical Care Nursing، Pediatric Nursing، Obstetric Nursing، Home Health Nursing، Geriatric Nursing، Oncology Nursing، Psychiatric Nursing، Emergency Nursing، Ophthalmic Nursing، ENT Nursing، Palliative Care Nursing. |
| Nutrition / Kitchen | Clinical Nutrition، TPN/Enteral Nutrition، Chronic Disease Diets، Pediatric Nutrition، Bariatric Nutrition، Central Kitchen، Therapeutic Meals، Room Service، Preventive Nutrition. |
| Psychosocial | Medical Social Work، Patient/Family Support، Discharge and Home Care Coordination، Child/Elder Protection، Patient Relations، Patient Advocacy، Health Education، Employee Assistance. |
| Logistics / Technical | Biomedical Engineering، MRI/CT/Ventilator Maintenance، Calibration، Nanotech Support، Prosthetics، HIT/HIS، EMR، PACS، Cybersecurity، Medical Translation، Health Statistics/Data Analytics، Big Data، Epidemic Prediction، Medical Communication، Telemedicine، Teleradiology. |
| Safety / Security | Security، Violent Incident Management، Occupational Health and Safety، Radiation Safety، Infection Safety، Chemical/Biological Safety، Disaster Management، Mass Casualty Plans، Medical Evacuation. |

### 12.9 الإدارة والجودة والتعليم

| المجال | التخصصات المطلوب تغطيتها |
|---|---|
| Executive | CEO Office، CMO، CNO، CFO، COO، Medical Staff Council، Ethics Committee، Patient Care Committee. |
| Quality / Accreditation | Total Quality Management، Credentialing، Privileging، JCI/CAP/ISO Accreditation، Medical Audit، Patient Complaints، Risk Management، Medical Liability، Medical Errors. |
| Education / Research | Medical Education Center، Internship، Residency، Fellowship، CME، Research Center، Clinical Trials/CRC، Basic Science، Clinical Pharmacology، IRB، Biostatistics، Publication Office، Medical Library، Simulation Center: Surgery/Emergency/Childbirth/Pediatrics. |
| HR / Admin | Medical HR، Physician and Specialist Recruitment، Career Planning، Training and Development، Legal Affairs، PR/Media، Community Outreach، Customer Service، Call Center. |

### 12.10 Centers of Excellence

| المركز | نطاق التغطية |
|---|---|
| Heart & Vascular Center | cardiology، cardiac surgery، vascular، cath lab، EP، heart failure، rehab. |
| Comprehensive Cancer Center | medical oncology، surgical oncology، radiation oncology، pathology، infusion، clinical trials، palliative. |
| Orthopedic & Spine Center | orthopedics، spine، arthroplasty، sports، trauma، rehab. |
| Advanced Fertility Center | IVF، ART، cryopreservation، genetics، reproductive endocrinology. |
| ENT & Head-Neck Center | ENT، head/neck oncology، skull base، otology، laryngology، sleep surgery. |
| Trauma Center | ER، trauma surgery، ICU، blood bank، OR، rehab، social work. |
| Burn Center | burn ICU، surgery، infection control، rehab، pain، nutrition. |
| Transplant Center | renal، liver candidate workflows، immunology، infectious disease، pharmacy، ICU. |
| Geriatric Center | geriatric medicine، rehab، nursing، social work، pharmacy review. |
| Pain Center | interventional pain، anesthesia، rehab، psychology، medication safety. |
| Bariatric & Metabolic Center | bariatric surgery، endocrine، nutrition، psychology، long-term follow-up. |
| Children’s Hospital within Hospital | pediatrics، NICU/PICU، pediatric surgery، pediatric subspecialties. |
| Behavioral Health Center | psychiatry، psychology، crisis، substance use، social work. |
| Eye Institute | ophthalmology subspecialties، surgery، retina، cornea، glaucoma. |
| Neuroscience & Stroke Center | neurology، neurosurgery، stroke pathway، neuro ICU، rehab. |
| Women & Fetal Center | OB/GYN، MFM، fetal medicine، prenatal diagnosis، NICU linkage. |

### 12.11 الأقسام النادرة والمتقدمة

| المجال | التغطية المطلوبة |
|---|---|
| Space & Dive Medicine | طب الفضاء والغوص، الضغط، اللياقة الخاصة، السلامة المهنية. |
| Sleep Disorders Center | Polysomnography، CPAP/BiPAP، sleep EEG، sleep medicine workflows. |
| Epilepsy Monitoring Unit | Video EEG، seizure protocols، neurology، safety alerts. |
| Advanced Stem Cell Therapy | eligibility، consent، lab chain-of-custody، ethics، audit. |
| Fetal Surgery | MFM، fetal intervention، OR/NICU linkage، consent، risk escalation. |
| Fetal Medicine / Prenatal Diagnosis | genetic counseling، CVS/Amniocentesis، imaging، fetal board. |
| Deep Brain Stimulation | neurology، neurosurgery، device programming، follow-up. |
| Nuclear Medicine Therapy | I-131، radioisotope therapy، radiation safety، isolation workflow. |
| Cryotherapy / Cryosurgery | procedure workflow، consent، complications، documentation. |
| Confocal Laser Endomicroscopy | advanced endoscopy، image capture، pathology correlation. |
| Pharmacogenomics | genotype-guided medication support، pharmacy، consent، data protection. |
| Nanomedicine | research-controlled workflows، consent، ethics، trial governance. |

### 12.12 متطلبات كل تخصص في هذا الملحق

كل تخصص أو مركز أعلاه يجب أن يحصل عند التخطيط والتنفيذ على:

1. Department Charter.
2. Role Matrix وRBAC action-level.
3. Nursing Coverage Matrix عند وجود تمريض متخصص.
4. شاشة أو أكثر فقط بعد Stitch Source أو Stitch Prompt معتمد.
5. OpenAPI draft.
6. ERD candidate بدون DDL.
7. Business workflow: intake، assessment، orders، execution، results، billing، coding، discharge/follow-up.
8. Safety gates: consent، allergy، critical alerts، infection control، blood/product safety، radiation safety عند الحاجة.
9. Audit trail لكل View/Create/Update/Approve/Cancel/Print/Export/Override/Emergency Access.
10. Test plan آمن بدون Production DB.

## 13. القرار النهائي المحدث

`FINAL_STATUS: NO_OMISSION_MASTER_SCOPE_EXTENDED_WITH_SUPER_SPECIALTIES_DB_TESTS_BLOCKED`
