---
name: jumanasoft-seo-geo-growth
description: طبقة النمو والمحتوى لجمانة سوفت — SEO تقليدي + GEO (تحسين للظهور في محرّكات الذكاء) للموقع العام.
---

# جمانة سوفت — النمو (SEO/GEO)

تعتمد على skills الخارجية المثبّتة (`seo-geo-claude-skills` + `.ai-brain/external-skills/...`) كطبقة أدوات، وهذا الملف يربطها بسياق جمانة سوفت.

## النطاق
- يخصّ **الموقع العام/التسويقي** (الهبوط، صفحات الميزات، المدوّنة) — **لا** يخصّ تطبيق المستأجر المعزول.
- ثنائي اللغة (عربي RTL أساسي + إنجليزي)، السوق السعودي/الخليجي.

## SEO تقليدي
- Meta (title/description) فريدة لكل صفحة، Open Graph، canonical، sitemap.xml، robots.txt.
- بيانات منظّمة Schema.org: `Organization`, `SoftwareApplication`, `Product`, `FAQPage`, `BreadcrumbList`.
- أداء = SEO: Core Web Vitals (راجع [[jumanasoft-observability-deployment]] و Vercel skills).
- محتوى عربي أصيل (لا ترجمة آلية)، كلمات مفتاحية: «نظام إدارة عيادات/مستشفيات»، «SaaS طبي سعودي».

## GEO (Generative Engine Optimization)
- تحسين الظهور في إجابات الذكاء (ChatGPT/Perplexity/Google AI): محتوى **قابل للاقتباس**، إجابات مباشرة، حقائق منظّمة.
- صفحات FAQ + مقارنات + تعريفات واضحة. entity optimization (اسم العلامة «جمانة سوفت / Jumanasoft» مرتبط بالكيانات الصحيحة).
- استعمل skills: `entity-optimizer`, `content-quality-auditor`, `rank-tracker`, `backlink-analyzer`, `domain-authority-auditor`, `performance-reporter`.

## بوابات
- لا فهرسة لصفحات التطبيق المعزولة (noindex على /app). الموقع العام فقط.
- قياس: rank-tracker + performance-reporter دورياً. راجع [[jumanasoft-skills-index]].
