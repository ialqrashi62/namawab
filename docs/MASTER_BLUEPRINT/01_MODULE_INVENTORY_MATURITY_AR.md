# 01 — جرد الوحدات الـ43 + النضج + الأولوية + ملخّص الفجوة

> الحالة الفعلية مستخلصة من `namaweb/public/js/app.js` (المُصيّرات + الجداول + الأزرار) و`server.js` (الـendpoints). النضج تقييم وظيفي (L0–L4 حسب 00). الفجوة = أبرز ما تضيفه الأنظمة العالمية.

## الجدول الرئيسي
| # | الوحدة | الحالة الفعلية (مختصر) | نضج | أولوية | أبرز فجوة عالمية |
|---|---|---|---|---|---|
| 1 | Dashboard | بطاقات إحصاء + top doctors + revenue-by-type | L2 | P3 | لوحات حسب الدور (role-based) + KPIs حيّة + drill-down + تنبيهات سريرية |
| 2 | Reception | تسجيل/بحث مرضى + إنشاء فاتورة | L2 | P1 | تحقّق هوية وطنية/إقامة + eligibility تأمين فوري (NPHIES) + دمج سجلات مكرّرة (EMPI) |
| 3 | Appointments | جدول مواعيد + check-in/no-show | L2 | P1 | تقويم موارد (طبيب/غرفة/جهاز) + تذكير SMS + قوائم انتظار + overbooking rules |
| 4 | Doctor Station | بطاقة مريض + نتائج + وصف + تفاعلات دوائية/حساسية | L2/L3 | P0 | EMR منظّم (problem list/SOAP) + CPOE + order sets + clinical decision support + templates |
| 5 | Laboratory | طلبات + نتائج + باركود + طباعة تقرير | L2/L3 | P0 | LIS كامل: تكامل أجهزة (HL7/ASTM) + LOINC + auto-verification + delta checks + QC + اعتماد |
| 6 | Radiology | طلبات + أنواع + نتائج | L2 | P0 | RIS+PACS (DICOM) + worklist + structured reporting + قياس جرعة + critical results |
| 7 | Pharmacy | طابور صرف + باركود + فاتورة | L2 | P0 | e-prescribing + مخزون دفعات/انتهاء + تفاعلات + dispensing بالباركود + Wasfaty/NPHIES |
| 8 | HR | دليل موظفين + رواتب + إجازات + رواتب slip | L2 | P3 | حضور بيومتري + جدولة مناوبات + تراخيص SCFHS + تقييم أداء + self-service |
| 9 | Finance | فواتير + P&L + كشوف | L2 | P1 | دفتر أستاذ عام + posting محاسبي + مراكز تكلفة + AR aging + ربط ZATCA (محاسبة OFF حالياً) |
| 10 | Insurance | شركات + مطالبات + حالة | L2 | P1 | NPHIES: eligibility + pre-auth + claims + remittance + رفض/استئناف + عقود/تسعير |
| 11 | Inventory | جداول أصناف + تعديل + فلترة | L2 | P2 | دفعات/انتهاء + نقاط إعادة طلب + PO/استلام + جرد دوري + ربط CSSD/الصيدلية |
| 12 | Nursing | بطاقة علامات حيوية + تقييم | L2 | P0 | MAR (سجل إعطاء الدواء) + خطط رعاية + موازين (Braden/MEWS) + I/O + handover (ISBAR) |
| 13 | Waiting Queue | طابور + استدعاء التالي | L2 | P2 | شاشات عرض عامة + أولوية فرز + متوسط انتظار + توجيه متعدّد المحطات |
| 14 | Patient Accounts | كشف حساب + فواتير المريض | L2 | P1 | محفظة/إيداعات + خطط تقسيط + co-pay + استرداد + بيان موحّد |
| 15 | Reports | تقارير عامة + retry | L1/L2 | P3 | منشئ تقارير (ad-hoc) + جدولة + تصدير + لوحات CBAHI/MOH التنظيمية |
| 16 | Messaging | inbox/sent/compose | L2 | P3 | رسائل آمنة مرتبطة بالمريض + قوالب + تنبيهات نتائج حرجة + إشعارات داخل النظام |
| 17 | Catalog | أصناف مختبر/أشعة/خدمات + تسعير | L2 | P2 | CDM (chargemaster) موحّد + LOINC/CPT mapping + إصدارات تسعير + عقود تأمين |
| 18 | Dept Requests | طلبات بين الأقسام | L1/L2 | P2 | سير موافقات + SLA + تتبّع حالة + ربط المخزون/الصيانة |
| 19 | Surgery & Pre-Op | قائمة عمليات + checklist ما قبل + إجراءات | L2 | P1 | جدولة غرف + WHO Safe Surgery checklist + استهلاك + تخدير + تقرير عملية + PACU |
| 20 | Blood Bank | crossmatch + وحدات + نقل | L2 | P1 | تتبّع وحدات كامل + فصائل/تحسّس + صلاحية + تفاعلات نقل + ربط المختبر + استدعاء |
| 21 | Consent Forms | قوالب + توقيع + طباعة | L2 | P2 | قوالب ديناميكية + توقيع رقمي + ربط الإجراء/العملية + لغات + أرشفة |
| 22 | Emergency | فرز + visits + نقل/خروج + خرائط أسرّة | L2/L3 | P0 | ESI/CTAS triage + tracking board + time-to-provider + ربط الإسعاف + critical alerts |
| 23 | Inpatient ADT | قبول/نقل/خروج + census + أسرّة | L2/L3 | P0 | إدارة أسرّة حيّة + حالة السرير + LOS + ربط التمريض/الصيدلية + discharge planning |
| 24 | ICU | مرضى + مراقبة | L2 | P0 | flowsheets + scoring (APACHE/SOFA) + أجهزة + بروتوكولات + ventilator/IO |
| 25 | CSSD | (تعقيم مركزي) | L1 | P2 | تتبّع أدوات/صواني + دورات تعقيم + مؤشّرات بيولوجية + ربط العمليات |
| 26 | Dietary | قائمة تغذية | L1/L2 | P2 | طلبات غذائية حسب الحمية + حساسية + ربط القبول + توصيل + تكامل المطبخ |
| 27 | Infection Control | حسب النوع + سجل | L1/L2 | P2 | مراقبة عدوى (HAI) + تنبيهات + عزل + إبلاغ تنظيمي + AMS (مضادات حيوية) |
| 28 | Quality | KPI + حوادث + audit log | L2 | P2 | حوادث/near-miss + CAPA + مؤشّرات CBAHI + risk register + accreditation tracking |
| 29 | Maintenance | جداول + أوامر عمل + معدّات | L2 | P2 | إدارة أصول (CMMS) + صيانة وقائية مجدولة + biomedical calibration + downtime |
| 30 | Transport | طلبات نقل المرضى | L1/L2 | P2 | تتبّع حيّ + أولوية + موارد (نقّالة/كرسي) + ربط ADT/الأشعة |
| 31 | Medical Records | (سجلات طبية) | L1/L2 | P0 | EMR موحّد + ترميز ICD/SNOMED + release of information + retention + amendments (قائم) |
| 32 | Clinical Pharmacy | (صيدلية سريرية) | L1 | P3 | مراجعة دوائية + TPN/جرعات + AMS + تثقيف + توصيات تدخّل |
| 33 | Rehabilitation | (إعادة تأهيل) | L1 | P3 | PT/OT/Speech + خطط علاج + جلسات + قياس تقدّم + ربط الإحالات |
| 34 | Patient Portal | (بوابة المرضى) | L1 | P3 | حجز + نتائج + فواتير + telehealth + تثقيف + رسائل (مرآة MyChart) |
| 35 | ZATCA E-Invoice | (فوترة إلكترونية) | L1/L2 | P1 | Phase 2: ختم رقمي + XML (UBL) + QR + clearance/reporting + أرشفة (CSID حقيقي gated) |
| 36 | Telemedicine | رابط جلسة (crypto link) | L1 | P3 | فيديو مدمج + جدولة + موافقة + وصف عن بعد + فوترة + تسجيل |
| 37 | Pathology | (علم الأمراض) | L1 | P3 | عيّنات/تشريح + gross/micro + SNOMED + cassettes/slides + تقارير منظّمة |
| 38 | Social Work | قوائم حالات | L1/L2 | P3 | تقييم اجتماعي + خطط + إحالات خارجية + دعم مالي/خيري + متابعة |
| 39 | Mortuary | قوائم وفيات | L1/L2 | P3 | تسجيل وفاة + شهادة + تتبّع جثمان + موافقات + ربط الأحوال/التصاريح |
| 40 | CME | (تعليم طبي) | L1 | P3 | دورات + ساعات SCFHS + شهادات + تتبّع امتثال التراخيص |
| 41 | Cosmetic Surgery | إجراءات + موافقات + طباعة | L2 | P3 | باقات + before/after (PHI) + تسعير خاص + جدولة + متابعة + تسويق |
| 42 | OB/GYN | حمل (GPAL) + متابعة + لوحات مختبر | L2 | P1 | antenatal/partogram + ultrasound growth + delivery record + neonatal + مخاطر |
| 43 | Settings | إعدادات + مستخدمون + تدقيق + نسخ احتياطي | L2/L3 | P3 | RBAC matrix + إعدادات منشأة + قوالب + تكاملات + مفاتيح + استرداد |

## ملخّص توزيع النضج
- **L3 (Integrated جزئياً):** Doctor Station, Laboratory, Emergency, Inpatient ADT, Settings (≈5).
- **L2 (Functional):** الغالبية (≈24).
- **L1 (Basic):** CSSD, Clinical Pharmacy, Rehabilitation, Patient Portal, Pathology, CME, Telemedicine, Medical Records (≈10).
- **L0/Placeholder:** لا يوجد placeholder صريح؛ الأضعف عند L1.

## أعلى 12 فجوة ذات أثر (تُعالَج أولاً — P0/P1)
1. **CPOE + Clinical Decision Support** (Doctor Station) — جوهر EMR الحديث.
2. **LIS device integration + LOINC** (Laboratory) — أتمتة النتائج.
3. **RIS + PACS/DICOM** (Radiology) — الصور والتقارير المنظّمة.
4. **e-Prescribing + batch/expiry + Wasfaty** (Pharmacy).
5. **NPHIES eligibility/pre-auth/claims** (Insurance) — الإيراد التأميني.
6. **ESI triage + ED tracking board** (Emergency).
7. **Live bed management + discharge planning** (Inpatient ADT).
8. **MAR + care plans + ISBAR handover** (Nursing).
9. **ZATCA Phase 2 clearance** (الفوترة) — إلزام تنظيمي.
10. **GL posting + cost centers + AR aging** (Finance) — محاسبة OFF حالياً.
11. **Antenatal/partogram + delivery record** (OB/GYN).
12. **ICU flowsheets + scoring (APACHE/SOFA)**.

> التفصيل الكامل (gap/prompt/scenario/dataflow) لكل قسم في `02_*` (السريرية/التشخيصية) و`03_*` (الباقي).
