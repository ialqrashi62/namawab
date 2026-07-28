# 58 — SEO Optimization (CARD-001)

> Owner: PM/UX · Tier 4

## Scope

Cardiology public-facing pages (rare, since this is a B2B platform). Mainly:
- Marketing site: namamedical.com/cardiology
- Patient-facing education: portal (auth required, not indexed)
- Public-facing disease pages (e.g. /public/heart-failure)

## Target keywords (AR + EN)

### Arabic (primary)

- طب القلب
- أفضل طبيب قلب
- مستشفى قلب
- قسطرة قلبية
- علاج النوبة القلبية
- فشل القلب
- رجفان أذيني
- زراعة جهاز تنظيم ضربات القلب
- استبدال صمام القلب بالقسطرة (TAVR)

### English (secondary)

- cardiology
- best cardiologist
- cardiac catheterization
- heart attack treatment
- heart failure
- atrial fibrillation
- pacemaker implant
- TAVR Saudi Arabia

## On-page SEO

```yaml
landing_page:
  url: https://namamedical.com/cardiology
  title_ar: طب القلب - مستشفى ناما الطبي | NamaMedical
  title_en: Cardiology - NamaMedical Hospital
  description_ar: طب القلب والأوعية الدموية في مستشفى ناما الطبي. قسطرة قلبية، علاج النوبة القلبية، فشل القلب، TAVR. فريق طبي متخصص + تكنولوجيا متقدمة.
  description_en: Comprehensive cardiology and cardiovascular care at NamaMedical. Cardiac catheterization, heart attack treatment, heart failure, TAVR. Expert team + advanced technology.
  keywords: [cardiology, Saudi Arabia, ...]
  h1: طب القلب والأوعية الدموية
  h2: خدماتنا, فريقنا, حجز موعد
  structured_data:
    - schema: MedicalOrganization
    - schema: Physician (per doctor)
    - schema: MedicalProcedure (per service)
    - schema: FAQPage
  hreflang: [ar-SA, en-SA]
  canonical: https://namamedical.com/cardiology
  robots: index, follow
```

## Technical SEO

- Mobile-first responsive (Google Mobile-First Indexing)
- HTTPS (already enforced)
- Page speed: < 2s LCP
- Core Web Vitals: pass
- Schema.org structured data
- hreflang for AR/EN
- Sitemap
- robots.txt

## Content strategy

- Blog posts (AR + EN): monthly
  - Patient education
  - Procedure explanations
  - Doctor interviews
  - Hospital news
- FAQ page
- Video library
- Downloadable PDFs (AR + EN)

## Local SEO

- Google Business Profile
- Bing Places
- Apple Maps
- Saudi medical directories (MOH, SCFHS)
- Reviews management

## Tracking

- Google Search Console
- Bing Webmaster
- Ahrefs / SEMrush
- Google Analytics 4
- Heatmap (Hotjar)

## KPIs

| KPI | Target |
|-----|--------|
| Organic traffic (AR) | +20% YoY |
| Organic traffic (EN) | +30% YoY |
| Avg ranking (top 10) | 5/10 keywords |
| Bounce rate | < 60% |
| Avg session | > 2 min |
| Conversion (booking) | > 2% |

## Compliance

- PDPL: forms comply
- MOH: hospital marketing regulated (claim substantiation)
- SCFHS: physician credentials verified
- No misleading claims
- No "before/after" without consent
- Testimonials: with written consent

## Note

Cardiology is not the primary SEO focus of NamaMedical (B2B + patient portal). The main SEO targets are:
1. Hospital brand: namamedical
2. Specialty: cardiology, ER, OBG
3. Procedures: cath, TAVR, device
4. Conditions: heart attack, heart failure, AF
