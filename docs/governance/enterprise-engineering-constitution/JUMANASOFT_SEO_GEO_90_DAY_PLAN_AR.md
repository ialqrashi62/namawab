# جمانة سوفت — خطة SEO/GEO لـ 90 يوماً (PHASE 5)

**التاريخ:** 2026-06-30 · **لا نشر قبل المراجعة.** يخصّ الموقع العام `jumanasoft.com` فقط (لا /app المعزول).
يستفيد من مهارات SEO/GEO المثبّتة. راجع [[jumanasoft-seo-geo-growth]].

## 1) Entity Profile (ملف الكيان)
- **الاسم:** جمانة سوفت / Jumanasoft. **النوع:** SoftwareApplication / Organization (نظام ERP طبي SaaS).
- **الفئة:** Healthcare ERP / HIS / نظام إدارة مستشفيات وعيادات (SaaS سعودي).
- **القيمة:** متعدّد المستأجرين، عزل بيانات، فوترة ZATCA، تأمين NPHIES (قيد التجهيز)، امتثال رؤية 2030.
- **الكيانات المرتبطة:** السعودية، ZATCA، NPHIES، CCHI، رؤية 2030، HIS/EMR.
- **E-E-A-T:** صفحة About بفريق/خبرة، سياسة خصوصية/أمان، شهادات/امتثال.

## 2) خريطة الموقع (Site Map)
```
/ (Home)
/pricing
/modules            (ERP Modules: عيادات، صيدلية، مختبر، أشعة، تمريض، طوارئ، مالية، HR...)
/industries         (مستشفيات، مجمّعات عيادات، مراكز صحية، مدن طبية)
/about
/contact
/blog  + /blog/{slug}
/legal/privacy , /legal/terms
```
- `/app` و أي مسار تطبيق = **noindex** + robots disallow.

## 3) الصفحات الأساسية (مع نيّة البحث)
| الصفحة | النيّة | عناصر GEO (قابلة للاقتباس) |
|---|---|---|
| Home | علامة/قيمة | تعريف مباشر «ما هو جمانة سوفت» + مزايا منقّطة |
| Pricing | تجاري | جدول خطط واضح + FAQ أسعار |
| Modules | معلوماتي | قائمة وحدات + ماذا يفعل كلٌّ منها |
| Industries | تجاري | حلول لكل نوع منشأة |
| About | ثقة | الفريق/الخبرة/الامتثال |
| Blog | معلوماتي | أدلّة ZATCA/NPHIES/إدارة عيادات |

## 4) Schema.org (JSON-LD)
- `Organization` (الاسم/الشعار/التواصل) + `SoftwareApplication` (الفئة/التقييم/الأسعار) في Home.
- `Product` + `Offer` في Pricing. `FAQPage` في Pricing/Modules. `BreadcrumbList` عام. `Article` في المدوّنة.

## 5) ملفات تقنية (مسودّات — لا تُنشر قبل المراجعة)
- **robots.txt:** السماح بالعام، `Disallow: /app`, `Disallow: /api`, ربط sitemap.
- **sitemap.xml:** كل الصفحات العامة + المدوّنة، `lastmod`/`changefreq`.
- **llms.txt:** ملخّص للكيان + روابط الصفحات الأساسية للوكلاء (GEO) — وصف موجز لما تقدّمه جمانة سوفت + روابط /pricing /modules /about.
- **meta (AR/EN):** title (≤60 حرفاً) + description (≤155) فريدة لكل صفحة، hreflang ar/en، canonical، Open Graph.

## 6) خطة المحتوى 90 يوماً
- **شهر 1 (الأساس):** نشر الصفحات الأساسية (Home/Pricing/Modules/Industries/About/Contact) + Schema + التقنية. 4 مقالات أساس: «ما هو نظام ERP طبي»، «دليل فاتورة ZATCA للعيادات»، «اختيار نظام إدارة عيادات»، «أمان بيانات المرضى».
- **شهر 2 (التوسّع):** 8 مقالات (NPHIES، التحوّل الرقمي الصحي، إدارة الصيدلية/المختبر، مؤشّرات الجودة)، صفحات صناعات تفصيلية، تحسين CWV.
- **شهر 3 (السلطة):** 8 مقالات + مقارنات + دراسات حالة، بناء روابط (backlink-analyzer)، تتبّع ترتيب (rank-tracker)، تقرير أداء شهري (performance-reporter).
- **GEO مستمرّ:** entity-optimizer + content-quality-auditor على كل صفحة؛ صياغة إجابات مباشرة قابلة للاقتباس.

## 7) القياس
- أدوات: rank-tracker، domain-authority-auditor، backlink-analyzer، performance-reporter (شهرياً).
- KPIs: ظهور عضوي، CWV (LCP<2.5s)، ترتيب الكلمات المستهدفة، اقتباسات في محرّكات الذكاء (GEO).

## 8) قرار البوابة (PHASE 5)
- ✅ **PASS** — خطة كاملة (كيان/خريطة/صفحات/Schema/تقني/محتوى 90 يوم/قياس)، لا نشر. ننتقل إلى PHASE 6.
