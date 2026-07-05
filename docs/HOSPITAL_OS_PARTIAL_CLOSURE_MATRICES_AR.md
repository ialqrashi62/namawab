# Hospital OS Partial Closure Matrices

التاريخ: 2026-07-03  
النطاق: إغلاق فجوات `PARTIAL` المتبقية بدون DDL أو Migration أو Data Write أو UI.

## 1. RBAC Action-Level Matrix للأقسام عالية الخطورة

| القسم عالي الخطورة | View | Create | Update | Approve | Cancel | Export | Print | Override | Emergency Access | Sensitive Data Access |
|---|---|---|---|---|---|---|---|---|---|---|
| الطوارئ ER | طبيب، تمريض طوارئ، Charge Nurse | طبيب، تمريض فرز | طبيب، تمريض طوارئ | طبيب طوارئ | طبيب طوارئ | HIM/Quality فقط | طبيب/تمريض/HIM | طبيب مع سبب | طبيب طوارئ | طبيب/تمريض ضمن الزيارة |
| العناية ICU/CCU/PICU/NICU | Intensivist، تمريض عناية، صيدلي سريري | طبيب/تمريض عناية | طبيب/تمريض عناية | Intensivist | Intensivist | HIM/Quality | طبيب/تمريض | طبيب مع audit | Intensivist | فريق العناية فقط |
| العمليات/التخدير/PACU | جراح، تخدير، OR/PACU Nurse | جراح/تخدير | جراح/تخدير/تمريض عمليات | جراح/تخدير | جراح/مدير OR | HIM/Quality | جراح/تخدير/HIM | طبيب مسؤول | جراح/تخدير | فريق العملية فقط |
| بنك الدم | طبيب، أخصائي بنك دم، تمريض نقل دم | بنك دم | بنك دم | طبيب/بنك دم | طبيب/بنك دم | Quality/HIM | بنك دم/طبيب | لا إلا لجنة نقل الدم | طبيب/بنك دم | بنك دم/طبيب/تمريض نقل دم |
| الصيدلية/الأدوية عالية الخطورة | طبيب، صيدلي، تمريض MAR | طبيب للوصفة | صيدلي للمراجعة، تمريض للتنفيذ | صيدلي/طبيب حسب الحالة | طبيب/صيدلي | صيدلية/Quality | صيدلية | طبيب/صيدلي مع سبب | طبيب/صيدلي | طبيب/صيدلي/تمريض منفذ |
| النساء والولادة/NICU | OB/GYN، قابلة، NICU Nurse | OB/GYN/قابلة | OB/GYN/قابلة/NICU | OB/GYN/Neonatologist | OB/GYN | HIM/Quality | OB/GYN/تمريض | OB/GYN مع سبب | OB/GYN/Neonatologist | فريق الأم والطفل فقط |
| المختبر/الأشعة التداخلية | طبيب طالب، فني/أخصائي، Radiologist | طبيب يطلب، فني ينفذ | فني/أخصائي للنتيجة | أخصائي/استشاري | أخصائي/رئيس قسم | HIM/Quality | أخصائي/HIM | لا إلا critical callback | طبيب مسؤول | فريق التشخيص فقط |

قواعد فصل الصلاحيات:

- التمريض يوثق وينفذ ويراقب ولا يوقع physician EMR.
- الفوترة والتأمين لا يعدلان أوامر الطبيب.
- المختبر والأشعة لا يعدلان أوامر الطبيب.
- الصيدلية لا تغير التشخيص.
- كل Override يحتاج سبباً وسجل Audit.

## 2. Department Owner Matrix

| القسم | CMO | CNO | COO | CFO | CIO | Head of Department | Quality Owner | Infection Control Owner | HIM Owner | Billing/Insurance Owner |
|---|---|---|---|---|---|---|---|---|---|---|
| الاستقبال/المواعيد/الانتظار | استشاري إشرافي | مدير التمريض للفرز | مدير التشغيل | مدير الفوترة عند الرسوم | CIO | مدير الاستقبال | مدير الجودة | عند الفرز المعدي | HIM للملف | التأمين عند الأهلية |
| محطة الطبيب/EMR | CMO | CNO للملاحظات التمريضية | COO | لا | CIO | رئيس القسم السريري | Quality | Infection عند العدوى | HIM | لا |
| الطوارئ | CMO | CNO/Head ER Nurse | COO | CFO عند billing | CIO | مدير الطوارئ | Patient Safety | Infection Control | HIM | Billing/Insurance |
| التنويم/ADT | CMO | CNO | COO | CFO | CIO | مدير التنويم | Quality | Infection Control | HIM | Billing/Insurance |
| ICU/CCU/PICU/NICU | CMO | CNO/Head ICU Nurse | COO | CFO | CIO | رئيس العناية | Patient Safety | Infection Control | HIM | Billing |
| OR/Anesthesia/PACU | CMO | CNO/OR Head Nurse | COO | CFO | CIO | مدير العمليات/التخدير | Quality | Infection/CSSD | HIM | Billing |
| Lab/Radiology/Pathology | CMO | CNO عند جمع العينات | COO | CFO | CIO | مدير المختبر/الأشعة/علم الأمراض | Quality | Infection عند العينات | HIM | Billing/Insurance |
| Blood Bank | CMO | CNO/Transfusion Nurse Lead | COO | CFO | CIO | مدير بنك الدم | Quality | Infection | HIM | Billing |
| Pharmacy/Clinical Pharmacy | CMO | CNO لـ MAR | COO | CFO | CIO | مدير الصيدلية | Medication Safety | Infection عند التحضير | HIM | Billing |
| Finance/Billing/Insurance | لا يملك قراراً سريرياً | لا | COO | CFO | CIO | مدير المالية/التأمين | Quality مالي | لا | HIM للترميز | مالك العملية |
| HR/CME | CMO للامتيازات السريرية | CNO لكفاءات التمريض | COO | CFO | CIO | مدير HR/التعليم | Quality | لا | لا | لا |
| Inventory/CSSD/Maintenance | CMO عند تأثير سريري | CNO للأدوات/الأقسام | COO | CFO | CIO | مدير المخازن/CSSD/الصيانة | Quality | Infection/CSSD | لا | لا |
| Social Work/Mortuary/Transport | CMO عند قرار سريري | CNO للتسليم والتمريض | COO | CFO عند الرسوم | CIO | مدير الخدمة | Quality | Infection عند الوفاة/العزل | HIM | Billing عند الحاجة |

## 3. Nursing Coverage Matrix التفصيلية

| المجال | نوع التمريض | مهام التمريض | حدود الصلاحية | توثيق/Audit |
|---|---|---|---|---|
| ICU | ICU Nurse, Charge Nurse | مراقبة مستمرة، I/O، infusions، EWS | لا يوقع physician EMR ولا يغير خطة الطبيب | ICU flowsheet, MAR, escalation audit |
| CCU | CCU Nurse | مراقبة قلبية، ECG، إنذارات | لا يغير تشخيص قلبي | cardiac monitoring notes |
| PICU | PICU Nurse | جرعات أطفال، مراقبة تنفسية | لا يعتمد وصفة أطفال | pediatric safety audit |
| NICU | NICU Nurse | حرارة، تغذية، Apgar، حضانات | لا يعتمد قرارات neonatologist | NICU charting |
| OR | Scrub/Circulating Nurse | count sheet، تجهيز، timeout | لا يعتمد العملية أو التخدير | surgical count audit |
| PACU | PACU Nurse | Aldrete، ألم، إفاقة | لا يخرج المريض دون معايير/اعتماد | PACU discharge notes |
| ER | Triage/ER Nurse | ESI، vital signs، إنعاش | لا يثبت diagnosis نهائي | triage audit |
| Blood Bank | Transfusion Nurse | تحقق هوية، مطابقة، مراقبة تفاعل | لا يقرر توافق الدم منفرداً | transfusion audit |
| Interventional Radiology | IR Nurse | تحضير، sedation monitoring | لا يوقع تقرير الأشعة | procedure nursing note |
| High-Alert Medication | MAR Nurse + witness | 5 rights، double check | لا يغير الوصفة | MAR witness audit |
| Nurse Educator | Nurse Educator | تدريب، كفاءات، سياسات | لا يعتمد امتياز طبي | CME/competency audit |

FINAL_STATUS: MATRIX_READY
