# HOS_PRO_10_QA_TESTING_ACCEPTANCE_AR

## الغرض
بناء Test Plan وAcceptance Criteria لكل قسم وسيناريو ومنع سقوط الأقسام.

## أنواع الاختبارات
- Unit Tests.
- Integration Tests.
- Workflow Tests.
- RBAC Tests.
- Audit Tests.
- Clinical Safety Tests.
- Billing/Insurance Tests.
- UI Smoke Tests.
- Arabic UTF-8 Mojibake Guard.
- No Missing Department Audit.

## Sidebar Tests
- كل قسم ظاهر حسب الصلاحية.
- كل رابط يعمل.
- لا توجد صفحة Placeholder غير موثقة.
- لا توجد Routes مخفية بدون سبب.
- لا توجد عناصر مكررة.
- لا توجد عناصر بلا Implementation.

## RBAC Tests
- الطبيب لا يرى وظائف إدارية غير مسموحة.
- التمريض لا يعدل التشخيص.
- الصيدلية لا تغير التشخيص.
- المختبر لا يغير أمر الطبيب.
- الأشعة لا تغير أمر الطبيب.
- الفوترة لا تعدل الأمر الطبي.
- التأمين لا يعدل السجل السريري.
- المريض لا يرى بيانات غير معتمدة عند المنع.
- كل وصول حساس يكتب Audit Log.

## Clinical Safety Tests
- حساسية دواء.
- تداخل دوائي.
- جرعة عالية.
- دواء عالي الخطورة.
- نقل دم.
- نتيجة حرجة.
- موافقة مفقودة.
- توقيع سريري.
- قفل سجل.
- محاولة تعديل بعد الاعتماد.

## Workflow Tests
- Patient Journey.
- ER Journey.
- Inpatient Journey.
- OR Journey.
- Pharmacy Journey.
- Lab Journey.
- Radiology Journey.
- Billing/Insurance Journey.
- Portal Journey.

## UI Tests
- RTL.
- LTR.
- Responsive.
- Loading.
- Empty.
- Error.
- Permission Denied.
- Print/Export.

## Acceptance Criteria
لكل قسم يجب توفر:
- شاشة أو خطة شاشة.
- RBAC.
- Workflow.
- Data Flow.
- Buttons.
- Tables.
- APIs.
- Tests.
- Audit Logs.
- Owner.
- Safety Gate إذا كان عالي الخطورة.

## ملف التقرير
احفظ في:
.ai-brain/hospital-qa-testing-acceptance-ar.md
