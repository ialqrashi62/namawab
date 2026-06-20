# مراجعة تجربة المستخدم والواجهة (UX/UI Review)

> التاريخ: 2026-06-20 | مرجع تفصيلي: [GLOBAL_AUDIT_03_UX_UI_GAP_ANALYSIS_AR.md](GLOBAL_AUDIT_03_UX_UI_GAP_ANALYSIS_AR.md). هذا ملخص للحالة الراهنة.

## 1. نقاط القوة (تبقى)
- SPA بـ Vanilla JS + نظام تصميم **Stitch Premium** (8 ثيمات داكنة/فاتحة، glassmorphism/Neon).
- توطين عربي/إنجليزي كامل مع RTL/LTR (`tr()` + `data-theme`) — ميزة تنافسية.
- التكيّف حسب نوع المنشأة في الواجهة (`FACILITY_ALLOWED`) + RBAC في القائمة.
- طباعة محسّنة (فواتير/مختبر/تقارير)، skeleton/toast، off-canvas sidebar.

## 2. مشاكل UX حرجة (P1) — تبقى من التدقيق السابق
| المشكلة | الأثر | الإصلاح |
| ------- | ----- | ------- |
| غياب الإتاحة (WCAG/ARIA، alt، focus trap) | يعيق الشراء المؤسسي | سمات ARIA، `<dialog>`، نص بديل |
| البحث مخفي على الموبايل (≤768px) | فقدان وظيفة جوهرية | بحث مصغّر/أيقونة |
| لا ترقيم صفحات (pagination) | بطء + إرباك على الجداول الكبيرة | pagination + lazy load |
| لا تركيز محصور في النوافذ | إتاحة + استخدام | focus trap + ESC |

## 3. متوسطة (P2)
- تحقق نماذج كـ toast فقط (لا رسائل سطرية)، اختصارات لوحة المفاتيح غير موثّقة، لا تحديث لحظي (طوارئ/طابور/ICU)، لا bulk actions، تصدير محدود، لا حوارات تأكيد/undo للعمليات الحساسة.

## 4. حالة Stitch (تصميم)
- Batches B/C/D/E **مطبّقة**؛ **Batch A (استقبال/مواعيد/بوابة) PENDING** (يحتاج سحب Stitch MCP — مؤجّل، انظر [P1_STITCH_DESIGN_TRANSFER_FINAL_CLOSEOUT_AR.md](P1_STITCH_DESIGN_TRANSFER_FINAL_CLOSEOUT_AR.md)).

## 5. تجربة الأدوار
الطبيب/الاستقبال/التمريض/الإدارة: جيدة. **مالك SaaS**: لا تجربة مخصصة (لا control center). 

## القرار
`UX_UI_STATUS: WARNING` (بسبب فجوة WCAG التي تعيق الشراء المؤسسي). الواجهة غنية ومتوطّنة بامتياز — لا إعادة بناء؛ إصلاحات مركّزة: الإتاحة، بحث الموبايل، pagination، focus trap، + Batch A عند توفّر MCP.

`UX_UI_REVIEW_COMPLETE`
