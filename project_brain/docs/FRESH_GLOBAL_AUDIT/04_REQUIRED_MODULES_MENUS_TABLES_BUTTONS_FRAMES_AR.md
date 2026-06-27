# 04 — الوحدات/القوائم/الجداول/الأزرار/الفريمات المطلوبة

> 2026-06-22 | تصميم ما يجب إضافته/تحسينه لكل قسم. مرجع الفجوات: 03. لا تنفيذ.

## الهدف/النطاق/المنهجية
لكل قسم: Menus, Submenus, Pages, Cards, Tables, Forms, Buttons, Filters, Status badges, Empty/Error states, Permissions, APIs, DB tables, Audit events, Reports. ≥30 قسم.

> صيغة مختصرة لكل قسم: **القوائم/الصفحات | البطاقات/الجداول | النماذج/الأزرار/الفلاتر | الحالات | الصلاحيات | API | DB | تدقيق | تقارير**.

| # | القسم | قوائم/صفحات | بطاقات/جداول | نماذج/أزرار/فلاتر | حالات (badge/empty/error) | صلاحيات | API | DB | تدقيق | تقارير |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | الرئيسية/Dashboard | لوحة موحّدة + per-role | KPI cards، إشغال، طوابير، إيراد اليوم | فلاتر تاريخ/فرع؛ زر تحديث | empty: لا بيانات؛ loading skeleton | الكل | /api/dashboard | تجميعي | view | يومي |
| 2 | لوحة الإدارة | مستخدمون/إعدادات/تدقيق | مستخدمون، أدوار، استحقاقات | نموذج مستخدم؛ أزرار create/edit/deactivate (Admin) | badge active/inactive | Admin | /api/settings | system_users, tenant_settings | user CRUD | usage |
| 3 | لوحة الطبيب | مرضاي/مواعيدي/أوامري | قائمة مرضى، نتائج معلّقة | فتح EMR؛ أمر مختبر/أشعة/وصفة | badge حالة الزيارة | Doctor | /api/medical | medical_records | open/sign | إنتاجية |
| 4 | لوحة التمريض | مهامي/تقييماتي/eMAR | مرضى الجناح، علامات حيوية مستحقة | تقييم؛ تسجيل علامات؛ صرف دواء | badge مستحق/متأخر | Nurse | /api/nursing,/api/emar | nursing_*, emar_* | administer | shift report |
| 5 | لوحة الاستقبال | تسجيل/مواعيد/طابور | طابور اليوم، مواعيد | تسجيل مريض؛ حجز؛ تحويل لطابور | badge waiting/with-doctor | Reception | /api/patients,/api/appointments | patients, waiting_queue | register | daily |
| 6 | لوحة المالية | فواتير/تأمين/إقفال | فواتير مستحقة، مطالبات | إصدار فاتورة؛ دفع؛ استرداد | badge paid/unpaid | Finance | /api/invoices,/api/insurance | invoices, insurance_claims | invoice/refund | revenue |
| 7 | لوحة المختبر | worklist/نتائج | عينات معلّقة | استلام عينة؛ إدخال نتيجة؛ اعتماد | badge pending/resulted | Lab | /api/lab | lab_results/samples | result/verify | TAT |
| 8 | لوحة الأشعة | worklist/تقارير | طلبات معلّقة | جدولة؛ تقرير؛ اعتماد | badge ordered/reported | Radiologist | /api/radiology | lab_radiology_orders | report | volume |
| 9 | لوحة الصيدلية | صرف/مخزون/طلبات | وصفات معلّقة، نواقص | صرف؛ مراجعة سريرية؛ طلب شراء | badge dispensed/low-stock | Pharmacist | /api/pharmacy | pharmacy_* | dispense | consumption |
| 10 | لوحة HR | موظفون/رواتب/إجازات | حضور، إجازات معلّقة | إضافة موظف (HR)؛ راتب؛ إجازة | badge present/on-leave | HR | /api/hr,/api/employees | hr_* | hire/payroll | payroll |
| 11 | لوحة التشغيل | صحة/مهام/صيانة | أوامر صيانة، أصول | أمر صيانة؛ جدولة PM | badge open/closed | IT | /api/maintenance | maintenance_* | work order | uptime |
| 12 | إدارة المرضى | بحث/ملف/دمج | ديموغرافيا، زيارات، تأمين | تسجيل؛ تعديل؛ دمج سجلات | empty: لا مريض؛ خطأ MRN مكرّر | Reception/Doctor | /api/patients | patients | register/merge | demographics |
| 13 | المواعيد | تقويم/قائمة | تقويم يومي/أسبوعي | حجز؛ إعادة جدولة؛ إلغاء؛ no-show | badge booked/cancelled | Reception | /api/appointments | appointments | book | utilization |
| 14 | الطوارئ | triage/متابعة | لوحة ED، أسرّة | triage ESI؛ تقييم صدمة | badge ESI 1-5 | Doctor/Nurse | /api/emergency | emergency_* | triage | ED metrics |
| 15 | العيادات الخارجية | قائمة/زيارة | زيارات اليوم | بدء زيارة؛ إنهاء | badge in-progress | Doctor | /api/medical,/api/visits | visit_lifecycle | visit | OPD |
| 16 | التنويم | قبول/جولات/خروج | مرضى منوّمون | قبول؛ جولة يومية؛ خروج | badge admitted | Doctor | /api/admissions | admissions, admission_daily_rounds | admit/discharge | LOS |
| 17 | الأسرّة/الإشغال | خريطة أسرّة | حالة أسرّة/أجنحة | تخصيص؛ تحويل؛ تنظيف | badge free/occupied/clean | Nurse | /api/beds,/api/wards | beds, wards, bed_transfers | transfer | occupancy |
| 18 | العمليات/OR | جدولة/سجل | جدول OR، تخدير | حجز OR؛ checklist WHO؛ تخدير | badge scheduled/done | Doctor | /api/surgeries | surgeries, operating_rooms | surgery | OR util |
| 19 | الأوامر الطبية (CPOE) | أوامر موحّدة | أوامر نشطة | أمر مختبر/أشعة/دواء موحّد | badge active/completed | Doctor | /api/lab,/api/radiology,/api/pharmacy | lab_radiology_orders, prescriptions | order | order sets |
| 20 | EMR | سجل طولي | تشخيصات، أدوية، نتائج، ملفات | تدوين؛ توقيع/قفل؛ ترميز ICD | badge draft/signed | Doctor | /api/medical-records | medical_records* | sign/lock | clinical |
| 21 | eMAR | جدول إعطاء | أدوية مستحقة | مسح باركود مريض/دواء؛ تسجيل | badge due/given/held | Nurse | /api/emar | emar_* | administer | MAR |
| 22 | LIS | catalog/worklist/نتائج | فحوصات، نتائج | إدخال نتيجة؛ مرجعي؛ اعتماد | badge abnormal/critical | Lab | /api/lab | lab_* | result | QC |
| 23 | RIS/PACS | worklist/عارض | تقارير، صور (PACS مقترح) | جدولة؛ تقرير؛ ربط DICOM | badge reported | Radiologist | /api/radiology | lab_radiology_orders | report | turnaround |
| 24 | الصيدلية | صرف/مخزون/مشتريات | وصفات، دفعات، نواقص | صرف؛ DDI تنبيه؛ PO | badge low/expired | Pharmacist | /api/pharmacy | pharmacy_* | dispense | stock |
| 25 | الفوترة | فواتير/حِزَم/خصومات | فواتير، حِزَم | إصدار؛ خصم محدود بالدور؛ استرداد | badge paid/refunded | Finance | /api/invoices | invoices, packages, discount_rules | invoice | AR |
| 26 | التأمين/المطالبات | أهلية/مطالبات | مطالبات، عقود | فحص أهلية؛ تقديم مطالبة (NPHIES) | badge submitted/rejected | Finance | /api/insurance | insurance_* | claim | denial rate |
| 27 | المحاسبة (readiness) | قيود/CoA/تقارير | قيود يومية، حسابات | (gated) ترحيل؛ سند | badge posted/draft | Finance | /api/finance | finance_journal_*, chart_of_accounts | post (gated) | trial balance |
| 28 | المخزون/المشتريات | أصناف/PO/صرف | أصناف، أوامر شراء | استلام؛ صرف لقسم؛ جرد | badge in-stock/low | IT/Pharmacy | /api/inventory | inventory_* | issue/receive | valuation |
| 29 | الموردون | قائمة/عقود | موردون، أوامر | إضافة مورد؛ ربط PO | badge active | IT | /api/inventory,/api/pharmacy | pharmacy_suppliers | — | spend |
| 30 | الموارد البشرية | موظفون/رواتب/وثائق | حضور، رواتب، عُهد | راتب؛ سلفة؛ وثيقة؛ عهدة | badge active/terminated | HR | /api/hr | hr_* | payroll | HR KPIs |
| 31 | إدارة المنشآت | فروع/أقسام/أنواع | منشآت، استحقاقات | تفعيل وحدة حسب النوع | badge enabled | Admin | /api/admin | facilities, tenant_settings | config | — |
| 32 | التقارير/التحليلات | مالية/سريرية/تشغيل | لوحات، جداول | فلاتر؛ تصدير PDF/Excel | empty/loading | Finance/Admin | /api/reports | تجميعي | export | BI |
| 33 | الأمن/الصلاحيات | أدوار/مستخدمون | مصفوفة صلاحيات | إسناد دور؛ تعطيل | badge role | Admin | /api/settings | system_users | role change | access |
| 34 | التدقيق/Audit | سجل/بحث | أحداث تدقيق | فلتر مستخدم/وحدة/تاريخ | badge action | Admin | (audit-reader gated) | audit_trail | — | compliance |
| 35 | الإعدادات | عام/منشأة/تكامل | إعدادات، تكاملات | حفظ؛ مفاتيح تكامل | — | Admin/IT | /api/settings | company_settings, integration_settings | config | — |
| 36 | التكاملات | FHIR/HL7/NPHIES/PACS/SMS | حالة قنوات | تفعيل قناة؛ سجل رسائل | badge connected/failed | IT | (مقترح) | integration_settings | integration | logs |

## 6-12
- **المتطلبات الجديدة المقترحة** (موجزة): bed board بصري، CPOE موحّد، triage ESI، WHO checklist، DDI/BCMA، NPHIES/ZATCA-2، FHIR/HL7 channels، BI، secure file vault، entitlement guard backend، audit-reader UI (gated).
- **الفجوات/الأولويات/المخاطر**: مرجع 03.
- **توصيات التنفيذ**: كل وحدة جديدة تتبع نمط RLS+tenant_id+RBAC القائم؛ DDL كـcandidate (راجع 07/17).
- **Acceptance**: ≥30 قسم بكل العناصر (✅ 36).
- **Next**: 05 Business Flows.
