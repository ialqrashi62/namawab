# 02 — مقارنة مرجعية بالأنظمة العالمية (Global Benchmark)

> 2026-06-22 | تحليل/تلخيص فقط، لا نسخ محتوى محمي. المنهجية: مقارنة قدرات NamaMedical الحالية (من جرد 01) مقابل القدرات المعروفة عموماً للأنظمة العالمية — مبنية على معرفة المجال الموثّقة عمومياً، **لا fetch ويب حيّ في هذه الجولة** (يُوصى بتحديث مرجعي لاحق مع روابط FHIR/CBAHI/NPHIES الرسمية).

## 1. الهدف
تحديد أين يقف NamaMedical مقابل المعايير العالمية لتغذية تحليل الفجوات (03) والـBlueprint.

## 2. نطاق الفحص (12+ فئة مرجعية)
HIS، EMR/EHR، LIS، RIS، PACS، RCM/Billing، Insurance/Claims، Pharmacy، Nursing، ICU، OR/Theatre، Emergency، Inventory/Procurement، HR/Payroll، Accounting/GL، Compliance/Audit، Integration (FHIR/HL7)، Security/Privacy.

## 3. أنماط الأنظمة العالمية (8+)
| النظام | النمط المميّز |
|---|---|
| Epic | EMR متكامل، MyChart portal، تكامل عميق، InterConnect/FHIR |
| Oracle Health (Cerner) | Millennium، CareAware، PowerChart، HL7/FHIR |
| MEDITECH | Expanse، نموذج موحّد، web-based EHR |
| InterSystems TrakCare | منصة موحّدة على IRIS، تعدد لغات/مناطق |
| Dedalus | أوروبي، LIS/RIS قوي |
| SAP Healthcare / S/4HANA | ERP مالي/لوجستي + i.s.h.med |
| Odoo Healthcare | نمط modular مفتوح، قابل للتوسعة |
| OpenMRS / Bahmni | EMR مفتوح المصدر، FHIR، مناسب للأسواق الناشئة |
| Mirth/NextGen Connect | محرّك تكامل HL7/FHIR وسيط |

## 4. جدول المقارنة المرجعي (الفئة ↔ المعيار العالمي ↔ NamaMedical ↔ التقييم)
| # | الفئة | المعيار العالمي المتوقّع | NamaMedical الحالي | التقييم |
|---|---|---|---|---|
| 1 | HIS core | تسجيل/مواعيد/تنويم/فوترة موحّدة | موجود شامل (51 صفحة) | ✅ قوي |
| 2 | EMR/EHR | سجل طولي، توقيع، عدم تعديل نهائي، ICD/CPT | medical_records + coding/files؛ توقيع/lock ناقص | 🟡 جزئي |
| 3 | LIS | باركود عينة، LOINC، تكامل أجهزة (ASTM/HL7) | lab_results/samples/catalog؛ بلا LOINC/أجهزة | 🟡 جزئي |
| 4 | RIS | جدولة، تقارير، worklist | radiology_catalog/orders؛ بلا worklist معياري | 🟡 جزئي |
| 5 | PACS | DICOM، عارض صور | غير موجود | 🔴 فجوة |
| 6 | RCM/Billing | دورة إيراد كاملة، تسعير، حِزَم | invoices/discount/packages؛ refund محصّن | ✅ قوي |
| 7 | Insurance/Claims | eligibility آني، تبادل مطالبات معياري | insurance_claims/contracts؛ بلا NPHIES حيّ | 🟡 جزئي |
| 8 | Pharmacy | تفاعلات، دفعات/انتهاء، صرف آمن | pharmacy_* شامل؛ drug_interactions كتالوج فارغ | 🟡 جزئي |
| 9 | Nursing | تقييمات معيارية، care plans، eMAR/BCMA | nursing_* + emar؛ بلا BCMA باركود | 🟡 جزئي |
| 10 | ICU | مراقبة، APACHE/SOFA، ventilator | icu_* شامل؛ scores آلية ناقصة | 🟡 جزئي |
| 11 | OR/Theatre | جدولة، WHO checklist، تخدير | surgeries + anesthesia/preop؛ WHO checklist ناقص | 🟡 جزئي |
| 12 | Emergency | triage ESI، trauma | emergency_* ؛ ESI آلي ناقص | 🟡 جزئي |
| 13 | Inventory/Procurement | PO، 3-way match، باركود | inventory_* شامل؛ 3-way match ناقص | 🟡 جزئي |
| 14 | HR/Payroll | رواتب، WPS، حضور | hr_* شامل؛ WPS ناقص | 🟡 جزئي |
| 15 | Accounting/GL | قيود مزدوجة، CoA، تقارير مالية | finance_journal_*/CoA موجودة؛ **posting OFF** | 🟡 جاهزية فقط |
| 16 | Compliance/Audit | سجل تدقيق، CBAHI/HIPAA | audit_trail FORCE append-only؛ RLS قوي | ✅ قوي |
| 17 | Integration | FHIR/HL7/ADT/ORM/ORU | integration_settings إطار؛ بلا FHIR/HL7 فعلي | 🔴 فجوة |
| 18 | Security/Privacy | RBAC، عزل، least-privilege، تشفير | 148 FORCE RLS، nama_medical_app non-super، RBAC guards | ✅ قوي جداً |
| 19 | Patient Portal | حجز/نتائج/فواتير ذاتية | portal_users/appointments؛ محدود | 🟡 جزئي |
| 20 | Telemedicine | فيديو، وصفات عن بعد | telemedicine_sessions؛ بلا WebRTC | 🟡 جزئي |
| 21 | Analytics/BI | لوحات تنفيذية، تصدير | reports + dashboards؛ BI متقدّم ناقص | 🟡 جزئي |
| 22 | Saudi-specific | ZATCA مرحلة-2، NPHIES، Seha/Mawid | zatca_invoices؛ NPHIES/Seha ناقص | 🟡 جزئي |

## 5–9 (الأدلة/المتطلبات/الفجوات/الأولويات/المخاطر)
- **نقاط القوة المميّزة**: عزل المستأجرين (RLS على مستوى DB بدور non-superuser) **يفوق كثيراً من الأنظمة** التي تعتمد عزلاً تطبيقياً فقط. التغطية الوظيفية واسعة (41+ قسم).
- **الفجوات الجوهرية**: التشغيل البيني المعياري (FHIR/HL7/PACS/NPHIES)، التوقيع الإلكتروني/قفل السجل، BCMA، scores سريرية آلية، BI.
- الأولوية: التكاملات المعيارية (P1) ثم الميزات السريرية المتقدّمة (P2).
- المخاطر: بدون FHIR/HL7 يصعب التكامل مع شبكات الصحة الوطنية.

## 10–12
- **توصيات**: تبنّي FHIR R4 كطبقة تبادل؛ محرّك تكامل (Mirth-style)؛ NPHIES للتأمين السعودي؛ DICOM/PACS.
- **Acceptance**: 12+ فئة و8+ أنظمة مغطّاة (✅).
- **Next**: 03 Gap Analysis يحوّل هذه الفئات إلى صفوف فجوات مصنّفة بالأولوية.
