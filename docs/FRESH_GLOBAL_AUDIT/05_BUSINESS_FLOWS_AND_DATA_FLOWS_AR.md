# 05 — تدفّقات العمل والبيانات (Business & Data Flows)

> 2026-06-22 | ≥18 تدفّق end-to-end. لكل تدفّق: Actors, Trigger, Preconditions, Main steps, Alternate, Exceptions, Data created/updated, APIs, DB, Permissions, Audit, KPIs, Acceptance.

## الهدف/النطاق/المنهجية
توثيق المسارات التشغيلية الفعلية (من المسارات/الجداول الحالية) + نقاط التحسين. صيغة مضغوطة لكل تدفّق.

### F1 — تسجيل مريض
Actors: Reception. Trigger: مريض جديد. Pre: صلاحية patients. Steps: بحث تكرار→إدخال ديموغرافيا→MRN→تأمين→حفظ. Alt: مريض موجود→فتح ملف. Exc: MRN/هوية مكرّر. Data+: patients. APIs: POST /api/patients. DB: patients(FORCE,tid). Perm: Reception. Audit: register. KPI: وقت التسجيل. Accept: لا تكرار MRN، tenant مختوم.
### F2 — حجز موعد
Actors: Reception/Patient. Trigger: طلب موعد. Steps: اختيار طبيب/وقت→حجز→تأكيد. Alt: online_bookings. Exc: تعارض وقت. Data+: appointments. API: POST /api/appointments. DB: appointments. Perm: Reception. Audit: book. KPI: نسبة no-show. Accept: لا تعارض.
### F3 — استشارة طبيب
Actors: Doctor. Trigger: زيارة. Steps: فتح EMR→تدوين→أوامر→توقيع. Exc: سجل مقفل. Data+/~: medical_records, prescriptions. API: /api/medical*. DB: medical_records*. Perm: Doctor. Audit: open/sign. KPI: زمن الزيارة. Accept: توقيع/قفل بعد الإنهاء (فجوة P0).
### F4 — تقييم تمريضي
Actors: Nurse. Trigger: قبول/جولة. Steps: تقييم→علامات حيوية→خطة. Data+: nursing_assessments/vitals/care_plans. API: /api/nursing. DB: nursing_*. Perm: Nurse. Audit: assess. KPI: اكتمال التقييم. Accept: قوالب معيارية (Braden/Morse - فجوة).
### F5 — إعطاء دواء (MAR)
Actors: Nurse. Trigger: أمر دواء. Steps: عرض المستحق→(مسح باركود - فجوة)→إعطاء→تسجيل. Exc: حساسية/تعارض. Data+: emar_administrations. API: /api/emar. DB: emar_*. Perm: Nurse. Audit: administer. KPI: أخطاء دواء. Accept: 5 rights (BCMA فجوة).
### F6 — أمر مختبر→نتيجة
Actors: Doctor→Lab. Steps: أمر→عينة→تحليل→نتيجة→اعتماد→إشعار. Exc: قيمة حرجة. Data+: lab_radiology_orders, lab_samples, lab_results. API: /api/lab. DB: lab_*. Perm: Doctor/Lab. Audit: order/result. KPI: TAT. Accept: تنبيه قيم حرجة (تحسين).
### F7 — أمر أشعة→تقرير
Actors: Doctor→Radiologist. Steps: أمر→جدولة→تصوير(PACS فجوة)→تقرير→اعتماد. Data: lab_radiology_orders. API: /api/radiology. DB: same. Perm: Radiologist. Audit: report. KPI: زمن التقرير. Accept: ربط DICOM (فجوة).
### F8 — قبول→خروج
Actors: Doctor/Nurse. Steps: قبول→سرير→جولات→خطة خروج→خروج→فاتورة. Data+: admissions, admission_daily_rounds, bed_transfers. API: /api/admissions,/api/beds. DB: admissions*. Perm: Doctor. Audit: admit/discharge. KPI: LOS. Accept: ADT events (فجوة), سرير محرّر.
### F9 — تحويل سرير
Actors: Nurse. Steps: طلب→تخصيص سرير→تحديث إشغال. Data+: bed_transfers; ~beds. API: /api/beds. DB: beds, bed_transfers. Perm: Nurse. Audit: transfer. KPI: إشغال. Accept: سرير الوجهة متاح.
### F10 — زيارة طوارئ
Actors: Reception/Nurse/Doctor. Steps: تسجيل→triage ESI→تقييم→قرار(تنويم/خروج). Data+: emergency_visits, emergency_trauma_assessments. API: /api/emergency. DB: emergency_*. Perm: ED roles. Audit: triage. KPI: door-to-doctor. Accept: ESI آلي (فجوة).
### F11 — طلب عملية
Actors: Doctor. Steps: طلب→تقييم قبل العملية→جدولة OR→WHO checklist→تخدير→سجل. Data+: surgeries, surgery_preop_*, surgery_anesthesia_records. API: /api/surgeries. DB: surgeries*. Perm: Doctor. Audit: surgery. KPI: OR utilization. Accept: WHO checklist (فجوة).
### F12 — صرف صيدلية
Actors: Pharmacist. Steps: استلام وصفة→مراجعة DDI→صرف→خصم مخزون. Exc: تفاعل/نقص. Data+: pharmacy_sales/sale_items; ~inventory. API: /api/pharmacy. DB: pharmacy_*. Perm: Pharmacist. Audit: dispense. KPI: زمن الصرف. Accept: لا خصم قبل الصرف (محفوظ).
### F13 — أهلية تأمين
Actors: Finance. Steps: إدخال بوليصة→فحص أهلية(NPHIES فجوة)→تغطية. Data: insurance_policies/contracts. API: /api/insurance. DB: insurance_*. Perm: Finance. Audit: eligibility. KPI: نسبة أهلية. Accept: NPHIES حيّ (فجوة).
### F14 — تقديم مطالبة
Actors: Finance. Steps: تجميع→تقديم→متابعة→تسوية/رفض. Data+: insurance_claims. API: /api/insurance. DB: insurance_claims. Perm: Finance. Audit: claim. KPI: denial rate. Accept: تبادل معياري (فجوة).
### F15 — فاتورة ودفع
Actors: Finance/Reception. Steps: تجميع خدمات→فاتورة→خصم(محدود بالدور)→دفع→إيصال→(استرداد محصّن). Data+: invoices. API: /api/invoices. DB: invoices, discount_rules. Perm: Finance. Audit: invoice/refund. KPI: AR days. Accept: refund tenant-scoped (محقّق).
### F16 — شراء→مخزون
Actors: IT/Pharmacy. Steps: طلب قسم→PO→استلام(GRN)→مطابقة→صرف. Data+: inventory_purchases/items, dept_requests. API: /api/inventory. DB: inventory_*. Perm: IT. Audit: receive/issue. KPI: دوران المخزون. Accept: 3-way match (فجوة).
### F17 — توظيف HR
Actors: HR. Steps: إنشاء موظف(HR/Admin)→وثائق→راتب→حضور. Data+: hr_employees, hr_documents/salaries. API: /api/hr,/api/employees. DB: hr_*. Perm: HR. Audit: hire. KPI: وقت التوظيف. Accept: POST/DELETE employees محصور HR/Admin (محقّق).
### F18 — تحقيق تدقيق
Actors: Auditor/Admin. Steps: تحديد حدث→بحث audit_trail→تتبّع مستخدم/مستأجر→تقرير. Data: audit_trail. API: (audit-reader gated). DB: audit_trail. Perm: super-admin. Audit: read. KPI: زمن التحقيق. Accept: قارئ معزول (candidate gated).
### F19 — نسخ واسترداد
Actors: IT. Steps: نسخ (schema+data)→تخزين خارجي→drill استرداد معزول→تحقّق. Data: dumps. API: n/a. DB: كامل. Perm: IT. Audit: backup. KPI: RTO/RPO. Accept: drill PASS؛ (جدولة آلية + offsite فجوة P1).

## 6-12
المتطلبات: ربط التدفّقات بالأحداث (ADT/ORU)؛ قيم حرجة؛ checklists. الأولويات: F3 قفل EMR (P0)، F5/F11/F10 (P1). المخاطر: غياب ADT/HL7 يكسر التشغيل البيني. توصيات: تبنّي state machines لكل تدفّق. Acceptance: ≥18 تدفّق (✅ 19). Next: 06 Wireframes.
