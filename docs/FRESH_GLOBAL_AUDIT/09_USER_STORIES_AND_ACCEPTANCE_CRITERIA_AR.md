# 09 — قصص المستخدم ومعايير القبول (User Stories)

> 2026-06-22 | ≥80 قصة عبر 14 دوراً. صيغة: "كـ<دور> أريد <هدف> لكي <قيمة>" + Acceptance + Priority + Dependencies.

| # | الدور | أريد (US) | لكي | Acceptance | Pri | Deps |
|---|---|---|---|---|---|---|
| 1 | Super Admin | إدارة المستأجرين/المنشآت | فصل البيانات | إنشاء مستأجر يعزل بياناته (RLS) | P0 | tenants |
| 2 | Super Admin | قراءة تدقيق عبر المستأجرين | تحقيق حوادث | قارئ معزول SELECT-only (gated) | P2 | audit-reader |
| 3 | Super Admin | تعطيل مستخدم فوراً | إيقاف وصول | تعطيل يمنع الدخول | P1 | system_users |
| 4 | Super Admin | عرض صحة النظام | مراقبة | لوحة health/PM2/Redis | P2 | monitoring |
| 5 | Hospital Admin | إنشاء مستخدمين بأدوار | تشغيل الفريق | Admin فقط ينشئ (محقّق) | P0 | settings |
| 6 | Hospital Admin | تفعيل وحدات حسب نوع المنشأة | ملاءمة | FACILITY_ALLOWED + حارس backend | P2 | entitlements |
| 7 | Hospital Admin | ضبط إعدادات المنشأة | تخصيص | حفظ tenant_settings | P2 | settings |
| 8 | Hospital Admin | تقارير تنفيذية | قرار | لوحات KPI | P2 | reports |
| 9 | Doctor | فتح ملف المريض | متابعة | عرض السجل الطولي tenant-scoped | P0 | medical_records |
| 10 | Doctor | تدوين وتوقيع سجل | توثيق قانوني | توقيع يقفل السجل (فجوة) | P0 | signatures |
| 11 | Doctor | أمر مختبر/أشعة | تشخيص | الأمر يصل LIS/RIS | P1 | lab/radiology |
| 12 | Doctor | كتابة وصفة مع تنبيه تفاعل | سلامة | DDI ينبّه (فجوة) | P1 | drug_interactions |
| 13 | Doctor | ترميز ICD/CPT | فوترة/إحصاء | اختيار من كتالوج (فجوة) | P1 | clinical_codes |
| 14 | Doctor | طلب عملية + checklist | سلامة OR | WHO checklist (فجوة) | P1 | surgery |
| 15 | Doctor | عرض نتائج حرجة | تدخّل سريع | تنبيه قيم حرجة | P1 | lab_results |
| 16 | Nurse | تسجيل علامات حيوية | متابعة | حفظ مع tenant | P0 | nursing_vitals |
| 17 | Nurse | تقييم تمريضي معياري | جودة | قوالب Braden/Morse (فجوة) | P2 | nursing |
| 18 | Nurse | إعطاء دواء بالباركود | سلامة (5 rights) | BCMA (فجوة) | P1 | emar |
| 19 | Nurse | خطة رعاية | استمرارية | care_plans محفوظة | P2 | nursing_care_plans |
| 20 | Nurse | إدارة أسرّة الجناح | إشغال | bed board (فجوة) | P2 | beds |
| 21 | Receptionist | تسجيل مريض | استقبال | لا تكرار MRN | P0 | patients |
| 22 | Receptionist | حجز/إلغاء موعد | تنظيم | لا تعارض | P1 | appointments |
| 23 | Receptionist | إدارة الطابور | تدفّق | استدعاء/تحويل | P2 | waiting_queue |
| 24 | Receptionist | تذكير المريض | حضور | SMS/بريد (فجوة) | P2 | reminders |
| 25 | Lab Tech | استلام عينة بباركود | تتبّع | barcode (فجوة) | P2 | lab_samples |
| 26 | Lab Tech | إدخال/اعتماد نتيجة | تشخيص | مرجعي + critical flag | P1 | lab_results |
| 27 | Lab Tech | استقبال نتائج الأجهزة | كفاءة | HL7/ASTM (فجوة) | P1 | LIS interface |
| 28 | Radiology Tech | جدولة فحص | تنظيم | worklist | P2 | radiology |
| 29 | Radiologist | كتابة/اعتماد تقرير | تشخيص | structured report | P1 | radiology |
| 30 | Radiologist | عرض صور DICOM | تشخيص | PACS viewer (فجوة) | P1 | PACS |
| 31 | Pharmacist | صرف وصفة آمن | سلامة | لا خصم قبل الصرف (محقّق) | P0 | pharmacy |
| 32 | Pharmacist | مراجعة سريرية | سلامة | clinical_pharmacy_reviews | P2 | clinical-pharmacy |
| 33 | Pharmacist | طلب شراء عند النقص | توفّر | PO + low-stock | P2 | pharmacy purchases |
| 34 | Pharmacist | تتبّع دفعة/انتهاء | سلامة | batch/expiry | P1 | pharmacy |
| 35 | Billing Officer | إصدار فاتورة | إيراد | بنود + tenant | P0 | invoices |
| 36 | Billing Officer | تطبيق خصم بحدود الدور | ضبط | MAX_DISCOUNT_BY_ROLE | P1 | discount_rules |
| 37 | Billing Officer | استرداد آمن | تصحيح | refund tenant-scoped (محقّق) | P0 | invoices |
| 38 | Billing Officer | إقفال يومي | مطابقة | daily_close | P1 | daily_close |
| 39 | Insurance Officer | فحص أهلية | تغطية | NPHIES (فجوة) | P1 | insurance |
| 40 | Insurance Officer | تقديم مطالبة | تحصيل | claim submission | P1 | insurance_claims |
| 41 | Insurance Officer | متابعة رفض | تحصيل | denial tracking | P2 | insurance_claims |
| 42 | HR Officer | إضافة موظف | كادر | HR/Admin فقط (محقّق) | P1 | employees |
| 43 | HR Officer | إدارة رواتب | صرف | WPS (فجوة) | P2 | hr_salaries |
| 44 | HR Officer | إجازات/حضور | تشغيل | hr_leaves/attendance | P2 | hr |
| 45 | HR Officer | وثائق/عُهد الموظف | حوكمة | hr_documents/custody | P3 | hr |
| 46 | Inventory Officer | استلام مشتريات | مخزون | GRN + 3-way (فجوة) | P2 | inventory |
| 47 | Inventory Officer | صرف لقسم | توزيع | issue_to_dept | P2 | inventory |
| 48 | Inventory Officer | جرد دوري | دقّة | stock_count | P3 | inventory |
| 49 | Auditor | بحث سجل التدقيق | امتثال | فلترة + قارئ معزول (gated) | P2 | audit_trail |
| 50 | Auditor | تقرير امتثال | اعتماد | CBAHI checklist (فجوة) | P2 | compliance |
| 51 | Patient | حجز موعد ذاتي | راحة | portal booking | P2 | portal |
| 52 | Patient | عرض نتائجي | شفافية | portal results | P2 | portal |
| 53 | Patient | عرض/دفع فاتورة | راحة | portal billing | P3 | portal |
| 54 | Patient | استشارة عن بعد | وصول | telemedicine + فيديو (فجوة) | P2 | telemedicine |
| 55 | Doctor | استخدام مساعد سريري AI | كفاءة | RAG بضوابط PHI (blueprint) | P3 | AI |
| 56-62 | Doctor (ICU/ED/OBGYN/Cosmetic/Rehab/Dental/Path) | إدارة قسمي التخصّصي | رعاية | شاشات القسم tenant-scoped | P2 | المعنية |
| 63-70 | Nurse/Reception/Lab/Pharmacy/Finance/HR/IT/Admin | تقارير قسمي | قرار | تقارير tenant-scoped + تصدير | P2 | reports |
| 71-76 | كل الأدوار | واجهة عربية RTL واضحة | استخدام | tr() + RTL + a11y | P2 | i18n |
| 77 | IT | مراقبة وتنبيه | استقرار | alerting (فجوة) | P2 | monitoring |
| 78 | IT | نسخ احتياطي مجدول | تعافٍ | scheduled + offsite (فجوة) | P1 | backup |
| 79 | IT | تكامل FHIR/HL7 | بيني | channels (فجوة) | P1 | integration |
| 80 | Admin | تفعيل المحاسبة (gated) | مالية | بوابة مستقلة بموافقة | P1 | finance |
| 81 | Admin | MFA للمستخدمين | أمن | TOTP (فجوة) | P1 | mfa |
| 82 | Super Admin | سياسة احتفاظ بيانات | امتثال | retention policy (فجوة) | P2 | retention |

## 6-12
المتطلبات/الأولويات/المخاطر: مرجع 03/04. توصيات: ربط كل قصة بـepic في 22. Acceptance: ≥80 قصة عبر 14 دوراً (✅ 82). Next: 10 Test Plan.
