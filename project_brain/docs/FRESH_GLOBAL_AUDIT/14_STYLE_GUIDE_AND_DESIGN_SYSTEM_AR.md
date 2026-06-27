# 14 — دليل الأسلوب ونظام التصميم (Style Guide & Design System)

> 2026-06-22 | مبني على الواقع (Tailwind-compiled + styles.css، RTL، data-theme=5، Stitch design system المرجعي). لا تغيير UI.

## 1-4 الهدف/النطاق/المنهجية
توحيد الهوية البصرية ومكوّنات الواجهة العربية RTL ثنائية اللغة. المصدر: index.html (dir=rtl, data-theme=5)، css القائمة، مهارة MEDICAL_STITCH_DESIGN_SYSTEM.

## العناصر
| العنصر | التوصية |
|---|---|
| Brand direction | طبي/مؤسسي، نظيف، ثقة؛ "نما الطبي / Nama Medical ERP" |
| Color tokens | primary/surface/on-surface-variant (مستخدمة)؛ توحيد كـCSS variables؛ ألوان حالة (success/warn/error/critical) |
| Typography | خط عربي واضح (RTL)؛ مقاسات سلّمية (h1-h6, body, caption) |
| Spacing | سلّم 4/8px؛ حشو بطاقات موحّد |
| Cards | FormCard/StatCard/InfoCard موحّدة بظل خفيف |
| Tables | DataTable: ترويسة لاصقة، فرز، صفحات، حالة فارغة، RTL |
| Buttons | primary/secondary/danger/ghost؛ أحجام؛ حالة تحميل |
| Forms | حقول موحّدة، تسميات، رسائل تحقّق، RTL، أخطاء حقلية |
| Badges | حالة (active/pending/critical/...) بألوان دلالية |
| Modals | تأكيد/نموذج؛ إغلاق بـEsc؛ تركيز محصور |
| Navigation | sidebar RTL قابل للطيّ + حسب الدور/النوع |
| Dashboards | شبكة بطاقات KPI + Chart.js |
| Charts | ألوان متّسقة، تسميات عربية |
| RTL | dir=rtl شامل؛ مرايا الأيقونات الاتجاهية |
| Dark/light | data-theme؛ توكنات للوضعين (مقترح توحيد) |
| Accessibility | WCAG AA تباين، ARIA، تنقّل لوحة مفاتيح، حجم خط |
| Bilingual | tr(en,ar)؛ تبديل فوري؛ أرقام/تواريخ محليّة |

## مكوّنات قابلة لإعادة الاستخدام (مقترح)
DataTable, FormCard, StatusBadge, StatCard, ConfirmModal, FilterBar, EmptyState, ErrorToast, LoadingSkeleton, PageHeader, Sidebar.

## 6-12
المتطلبات: استخراج توكنات موحّدة + مكتبة مكوّنات. الأولويات: توحيد الحالات/الجداول (P2). المخاطر: تباين بصري بين الشاشات. توصيات: اعتماد Stitch كمصدر رسمي (موجود). Acceptance: توكنات+مكوّنات+RTL+a11y (✅). Next: 15 i18n.
