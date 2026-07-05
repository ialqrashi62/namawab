# HOS_PRO_02_GLOBAL_BENCHMARK_GAP_AR

## الغرض
مقارنة النظام الحالي مع كتالوج عالمي لأنظمة المستشفيات HIS/EHR/EMR بدون نسخ أعمى من أي Vendor.

## مراجع مفاهيمية
- HIS / HMIS
- EHR / EMR
- ADT
- CPOE
- eMAR / MAR
- LIS
- RIS / PACS
- OR Management
- Emergency / Triage
- ICU / Critical Care
- Pharmacy
- Revenue Cycle Management
- Insurance / Claims
- Patient Portal
- Telemedicine
- Quality & Patient Safety
- Infection Control
- CSSD
- Blood Bank
- Consent Management
- Medical Records
- Audit Trail
- FHIR / HL7
- NPHIES عند السياق السعودي
- CBAHI عند السياق السعودي
- ZATCA عند الفوترة السعودية

## طريقة التحليل
قارن الأقسام الحالية مع Master Hospital Catalog ثم صنّف كل فجوة:

- موجود ومكتمل.
- موجود وناقص.
- غير موجود ويجب إضافته.
- موجود لكن يحتاج فصل.
- مكرر ويحتاج دمج.
- غير واضح ويحتاج تسمية أفضل.
- Optional / Later Phase.
- عالي الخطورة ويحتاج Safety Gate.

## أولوية الفجوات
P0: خطر سريري أو أمني أو خصوصية أو مالي مباشر.
P1: نقص يؤثر على التشغيل أو الامتثال.
P2: تحسين مهم للتجربة والكفاءة.
P3: تحسين لاحق أو Optional.

## مخرجات إلزامية
- Global Benchmark Table.
- Missing Departments Table.
- Duplicate / Merge Table.
- High Risk Gaps Table.
- Later Phase Table.
- Recommendation by Priority.

## ملف التقرير
احفظ التقرير في:
.ai-brain/hospital-global-gap-analysis-ar.md
