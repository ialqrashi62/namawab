# HOS_PRO_01_SIDEBAR_DISCOVERY_AR

## الغرض
فحص القائمة الجانبية Sidebar / Navigation / Menu وعدّ الأقسام الحالية واستخراج حالة التنفيذ الفعلية.

## ابحث في الملفات والمسارات التي تحتوي على
- sidebar
- navigation
- nav
- menu
- routes
- layout
- dashboard
- modules
- app routes
- pages
- components/navigation
- config/navigation
- permissions
- role visibility

## المطلوب لكل عنصر في القائمة
- اسم القسم المعروض.
- route/path.
- icon إن وجد.
- هل يحتوي submenu؟
- عدد عناصر submenu.
- هل العنصر مرتبط بصلاحيات؟
- الأدوار التي ترى العنصر.
- هل له صفحة فعلية؟
- هل الصفحة مكتملة؟
- هل الصفحة Placeholder؟
- هل يوجد API مرتبط؟
- هل يوجد جدول/بيانات فعلية؟
- هل يوجد تقرير أو Audit Log؟
- هل الرابط مكسور؟
- هل القسم مكرر باسم آخر؟

## التصنيفات
صنّف كل عنصر إلى:
- Patient Access
- Clinical Care
- Nursing
- Diagnostics
- Pharmacy
- Revenue Cycle
- Operations
- Governance & Quality
- Administration
- Patient Digital Services
- System / Settings
- Unknown / Needs Review

## مخرجات إلزامية
- SIDEBAR_SECTIONS_COUNT
- SIDEBAR_SUBMENU_ITEMS_COUNT
- BROKEN_ROUTES_COUNT
- PLACEHOLDER_PAGES_COUNT
- DUPLICATE_ITEMS_COUNT
- HIDDEN_ROUTES_COUNT

## جدول Sidebar Inventory
الأعمدة:
# | القسم | التصنيف | Route | Submenu Count | Page Status | RBAC Status | API/Data Status | Notes

## ملف التقرير
احفظ التقرير في:
.ai-brain/hospital-sidebar-inventory-ar.md
