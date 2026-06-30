---
name: jumanasoft-ui-ux-design-system
description: نظام تصميم جمانة سوفت — RTL عربي، الوصولية، لوحة احترافية، يستفيد من Vercel web-design-guidelines.
---

# جمانة سوفت — نظام التصميم (UI/UX)

يستفيد من Vercel skills (`web-design-guidelines`, `vercel-react-best-practices`, `vercel-react-view-transitions`).

## المبادئ
- **عربي RTL أساسي** + إنجليزي LTR. تبديل لغة سلس. خطوط عربية واضحة.
- وصولية (a11y): تباين كافٍ، تنقّل لوحة مفاتيح، ARIA، «تخطّي إلى المحتوى» (موجود في الموقع الحيّ).
- اتساق: نظام ألوان/مسافات/مكوّنات موحّد (tokens). داكن/فاتح.

## اللوحة الاحترافية (Dashboard)
- شريط جانبي تنقّل + ترويسة سياق المستأجر (ظاهر حالياً: «جمانة الطبي»، سياق المستأجر).
- بطاقات مؤشّرات (KPIs)، رسوم (Chart.js)، جداول قابلة للفرز/التصفية.
- حالات فارغة/تحميل/خطأ مصمّمة. تأكيد للإجراءات الخطرة.

## الأمان في الواجهة (إلزامي)
- **هرّب كل مخرَج مستخدم** عند الإدراج في DOM (`escapeHTML`) — لا `innerHTML` خام لبيانات المستخدم. راجع [[jumanasoft-security-audit]].
- CSP enforce مفعّل — تجنّب inline handlers الجديدة قدر الإمكان؛ اختبر بصرياً بعد أي تشديد CSP.

## الأداء (= تجربة + SEO)
- Core Web Vitals، lazy-load، تقليل JS، صور محسّنة. راجع [[jumanasoft-observability-deployment]] و [[jumanasoft-seo-geo-growth]].

## بوابات
- لا شحن واجهة بلا: RTL سليم + a11y أساسي + تهريب المخرجات + فحص بصري حيّ.
