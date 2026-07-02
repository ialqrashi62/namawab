# NM_UI_UX_RTL — تصميم الواجهة العربية RTL للأدوار السريرية والإدارية

## متى تُستخدم
أي تعديل على الواجهة، صفحة جديدة، مكوّن جديد، أو مراجعة UX لأي دور.

## الهدف
ضمان واجهة مستخدم احترافية، ثنائية اللغة (عربي/إنجليزي)، سهلة الاستخدام لكل دور سريري وإداري.

## قواعد إلزامية
```
RTL_ARABIC: YES — الواجهة تدعم RTL كاملاً للعربية
LTR_ENGLISH: YES — تدعم LTR للإنجليزية بدون كسر التخطيط
ACCESSIBILITY: YES — معايير WCAG 2.1 الأساسية
ROLE_SPECIFIC_UI: YES — كل دور يرى واجهة مناسبة لعمله
RESPONSIVE: YES — يعمل على desktop وtablet
ERROR_STATES: YES — رسائل خطأ واضحة بالعربية والإنجليزية
EMPTY_STATES: YES — حالات فارغة بتوجيهات واضحة
CLINICAL_DISCLAIMER_VISIBLE: YES — إخلاء مسؤولية سريري مرئي
NO_PHI_IN_UI_LOGS: YES — لا بيانات مرضى في console.log
ESCAPE_ALL_USER_INPUT: YES — كل إخراج مستخدم يمر بـ escapeHTML
```

## مكوّنات UI المعيارية
```
NAVBAR: تنقل سريع + إشعارات + تبديل لغة
SIDEBAR: قائمة الأقسام حسب الدور
DASHBOARD: بطاقات إحصائية + جداول + رسوم بيانية
TABLES: data-table مع بحث + فلتر + pagination
FORMS: form-input + validation + رسائل خطأ
MODALS: للعمليات الثانوية بدون مغادرة الصفحة
TOASTS: إشعارات نجاح/خطأ غير مزعجة
BADGES: لحالات (active/inactive/pending/urgent)
STATUS_INDICATORS: للطوارئ والحالات الحرجة
PRINT_VIEWS: تقارير قابلة للطباعة
```

## خطوات التنفيذ
1. تحقق من أن الجهة (dir) صحيحة حسب اللغة
2. تحقق من escapeHTML على كل إخراج مستخدم
3. اختبر الواجهة بحساب كل دور
4. تحقق من الـ empty state و error state
5. تحقق من أن الـ modals تُغلق بشكل صحيح

## أدلة النجاح
- الواجهة العربية: dir=rtl، محاذاة صحيحة
- الواجهة الإنجليزية: dir=ltr، محاذاة صحيحة
- كل خطأ يظهر رسالة مفيدة للمستخدم
- حالة فارغة تحمل توجيهاً وليس فراغاً

## حالات الحظر
- innerHTML بدون escapeHTML → BLOCKED_XSS_RISK
- الواجهة لا تدعم RTL → BLOCKED_RTL_BROKEN
- لا حالة خطأ للمستخدم → BLOCKED_MISSING_ERROR_STATE

## صيغة التقرير المختصر
```
UI_GATE: PASS/BLOCKED | RTL_OK: YES/NO | LTR_OK: YES/NO
ESCAPE_HTML_VERIFIED: YES/NO | ROLE_UI_TESTED: YES/NO
ERROR_STATES: PRESENT | EMPTY_STATES: PRESENT
ACCESSIBILITY_BASIC: PASS/FAIL
```
