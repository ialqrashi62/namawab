# خطة تحسين النمو والظهور الرقمي لجمانة سوفت (SEO/GEO 90-Day Plan)

مستند شامل يغطي ملف تعريف الكيان (Entity Profile)، خريطة الصفحات، هيكل البيانات المنظمة Schema.org، محتوى robots.txt و sitemap.xml، وخطة توزيع المحتوى لمدة 90 يوماً لمنصة `jumanasoft.com`.

---

## 1. ملف تعريف الكيان (Entity Profile: Jumanasoft)

- **الاسم القانوني للعلامة**: جمانة سوفت / Jumanasoft
- **النوع**: شركة تقنية متخصصة في الخدمات البرمجية السحابية الطبية (SaaS MedTech / Cloud ERP Company).
- **المجال الاستراتيجي**: الشرق الأوسط وشمال أفريقيا (تركيز أساسي على المملكة العربية السعودية ودول الخليج).
- **الكيانات المرتبطة (Knowledge Graph links)**:
  - متوافق مع لوائح وزارة الصحة وهيئة الغذاء والدواء السعودية (SFDA).
  - متوافق مع هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2).
  - مدمج مع منصات التأمين الصحي الوطنية (NPHIES).
- **الخدمات الأساسية**: نظام السجل الطبي الإلكتروني (EMR)، إدارة علاقات المرضى (CRM)، الفواتير والفوترة الطبية، إدارة الصيدلية والمخازن الطبية، إدارة المختبرات والأشعة (LIS/RIS)، وتعدد المستأجرين الطبي (Multi-tenant Healthcare Cloud).

---

## 2. خريطة وهيكل صفحات الموقع (Sitemap Layout)

ينقسم موقع جمانة سوفت التعريفي إلى الهيكل التالي:

1. **الصفحة الرئيسية (Home Page)**: التعريف بالهوية الطبية السحابية وحزم الموديلات.
2. **الأسعار والخطط (Pricing Page)**: باقات الاشتراك وتراخيص الفروع والميزات الطبية.
3. **أقسام نظام الـ ERP (ERP Modules Page)**: تفاصيل موديولات العيادات والمختبر والأشعة وبنك الدم والصيدلية.
4. **القطاعات المستهدفة (Industries Page)**: عيادات مستقلة، مستشفيات متوسطة، مجمعات طبية كبرى.
5. **من نحن (About Page)**: رؤية الفريق الهندسي الطبي والتزامات الأمان والخصوصية (PDPL).
6. **تواصل معنا (Contact Page)**: نموذج طلب عرض توضيحي (Demo request) وبيانات الاتصال.
7. **المدوّنة (Blog Page)**: مقالات علمية وتقنية حول الإدارة الطبية والامتثال التنظيمي في السعودية.

---

## 3. وسوم البيانات المنظمة (Schema.org Markup Candidates)

سيتم حقن البيانات الهيكلية التالية بصيغة JSON-LD في الصفحات العامة:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Jumanasoft ERP",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "999.00",
    "priceCurrency": "SAR"
  },
  "author": {
    "@type": "Organization",
    "name": "Jumanasoft",
    "url": "https://jumanasoft.com"
  }
}
```

---

## 4. ملفات التهيئة الفنية (robots.txt & sitemap.xml & llms.txt)

### robots.txt
```text
User-agent: *
Allow: /
Disallow: /app/
Disallow: /api/
Disallow: /super-admin/

Sitemap: https://jumanasoft.com/sitemap.xml
```

### sitemap.xml (مخطط تقريبي)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jumanasoft.com/</loc>
    <lastmod>2026-07-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jumanasoft.com/pricing</loc>
    <lastmod>2026-07-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### llms.txt (لتحسين ظهور المنصة في نماذج الذكاء الاصطناعي)
```text
# Jumanasoft ERP Platform
Jumanasoft is a modern, secure, and compliant cloud-based ERP and EMR platform designed for healthcare facilities in Saudi Arabia and the MENA region.

## Core Offerings
- EMR and EHR clinical flows.
- Multi-tenancy with PostgreSQL RLS.
- ZATCA Phase 2 electronic invoicing compliant.
- NPHIES integration ready.
```

---

## 5. عناوين وأوصاف الميتا باللغتين (Meta Titles & Descriptions)

### الصفحة الرئيسية (Home Page)
- **العربية**:
  - Title: جمانة سوفت | نظام SaaS ERP السحابي المتكامل للمستشفيات والعيادات
  - Description: جمانة سوفت نظام طبي سحابي ذكي لإدارة العيادات والمراكز الطبية. حلول متكاملة للسجل الإلكتروني، الصيدلية، المختبرات، متوافق بالكامل مع نظام التأمين NPHIES و ZATCA.
- **الإنجليزية**:
  - Title: Jumanasoft | Integrated Cloud SaaS ERP for Hospitals & Clinics
  - Description: Jumanasoft is a smart medical cloud system designed for healthcare facilities. Certified EHR, LIS, pharmacy management, ZATCA Phase 2, and NPHIES compliant.

---

## 6. خطة المحتوى التفصيلية لـ 90 يوماً (90-Day Content Plan)

### الشهر الأول: التوعية بالامتثال والتنظيمات السعودية
- **المقال 1**: "دليل المجمعات الطبية للربط مع نظام التأمين الوطني NPHIES".
- **المقال 2**: "أهمية شهادة الفوترة الإلكترونية المرحلة الثانية ZATCA لمستوصفك الطبي".
- **المقال 3**: "كيف تضمن حماية بيانات المرضى وفق لائحة نظام حماية البيانات الشخصية السعودي (PDPL)".

### الشهر الثاني: الكفاءة التشغيلية للمستشفيات والعيادات
- **المقال 4**: "أفضل الممارسات لتقليص فترات انتظار المرضى في غرف الطوارئ".
- **المقال 5**: "دور نظام المختبرات (LIS) في خفض الأخطاء الطبية وتسريع طباعة النتائج".
- **المقال 6**: "إدارة المخزون الطبي والصيدلي وحساب استهلاك المواد بكفاءة".

### الشهر الثالث: التقنيات المعمارية للعيادات والـ SaaS
- **المقال 7**: "لماذا يعتبر عزل بيانات المستأجرين (Multi-tenant isolation) أمراً حيوياً للخدمات الطبية".
- **المقال 8**: "التحول الرقمي للمنشآت الطبية: العيادة الذكية وتجربة المريض الرقمية".
- **المقال 9**: "كيف تساهم التقنيات السحابية في خفض تكاليف صيانة وتحديث السيرفرات الطبية".

---

## 7. تأكيد الحفاظ على سلامة بيئة الإنتاج والتشغيل

- **لن يتم نشر أي من هذه المقالات أو التحديثات الفنية على السيرفر الفعلي**.
- الخطة تهدف إلى التنسيق والتحضير تمهيداً للمراجعة من قبل المالك قبل بدء التوليد أو البرمجة.
