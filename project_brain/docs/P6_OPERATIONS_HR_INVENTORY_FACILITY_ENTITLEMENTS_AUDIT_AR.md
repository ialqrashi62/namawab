# PHASE 6 — العمليات/HR/المخزون/استحقاقات المنشأة

> 2026-06-22 | تحقّق حيّ + استخراج من server.js/app.js.

## HR/الموظفين
- `employees`: **POST/DELETE → requireRole('hr')+audit (منشور bc24a47)**؛ GET مفتوح عمداً (قوائم الأطباء). جدول FORCE RLS (عزل عبر المستأجرين).
- `hr_employees/hr_salaries/hr_leaves/hr_attendance`: requireRole('hr')، FORCE RLS. حقول الراتب محصورة بدور hr+Admin.

## المخزون/المشتريات/الموردين
- inventory (10 جداول) FORCE RLS، requireRole. عزل مفروض.

## branches/departments
- FORCE RLS (14-table backfill)، requireAuth. عزل مفروض.

## استحقاقات المنشأة (facility entitlements)
- خريطة الأنواع في app.js (مثال: health_center/clinic → قائمة معرّفات الشاشات المتاحة). الحارس الخلفي: requireAuth + RLS؛ تقييد الشاشات حسب النوع. (تفصيل الإنفاذ في MEDICAL_FACILITY_TYPE_ENTITLEMENTS skill.)

## transport/maintenance
- FORCE RLS، requireRole. عزل مفروض.

## الحالة
```text
OPERATIONS_HR_STATUS: PASS (RLS+RBAC)
EMPLOYEES_RBAC: DEPLOYED (POST/DELETE hr; GET open by design)
SALARY_FIELDS: restricted to hr+Admin
FACILITY_ENTITLEMENTS: type-map enforced + RLS backstop
```
