# SEO — Cardiology (Public-Facing)

> **Owner:** PM/UX
> **Date:** 2026-07-22
> **Applies to:** Public pages only (jumanasoft.com/cardiology)

---

## Meta Tags (per public page)

```html
<title>Cardiology Department | NamaMedical Hospital</title>
<meta name="description" content="Comprehensive cardiac care at NamaMedical Hospital — cardiology clinic, interventional cath lab, EP, heart failure program, cardiac rehab, anticoagulation clinic. ESC/AHA guidelines aligned. 24/7 STEMI service." />
<meta name="keywords" content="cardiology, cardiac care, cath lab, heart failure, AF, anticoagulation, Saudi Arabia, NamaMedical" />
<link rel="canonical" href="https://jumanasoft.com/cardiology" />
<meta property="og:title" content="Cardiology Department | NamaMedical" />
<meta property="og:description" content="Comprehensive cardiac care — 24/7 STEMI service, advanced heart failure program, and full anticoagulation clinic." />
<meta property="og:image" content="https://jumanasoft.com/img/cardiology-og.jpg" />
<meta property="og:url" content="https://jumanasoft.com/cardiology" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="alternate" hreflang="ar" href="https://jumanasoft.com/ar/cardiology" />
<link rel="alternate" hreflang="en" href="https://jumanasoft.com/cardiology" />
```

## Schema.org (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalSpecialty",
  "name": "Cardiology",
  "alternateName": "أمراض القلب",
  "description": "Comprehensive cardiac care including interventional, EP, heart failure, and rehabilitation services",
  "medicalSpecialty": "https://schema.org/Cardiovascular",
  "availableService": [
    { "@type": "MedicalProcedure", "name": "Cardiac Catheterization" },
    { "@type": "MedicalProcedure", "name": "PCI" },
    { "@type": "MedicalProcedure", "name": "TAVR" },
    { "@type": "MedicalProcedure", "name": "RF Ablation" },
    { "@type": "MedicalProcedure", "name": "ICD Implant" }
  ],
  "hospitalAffiliation": {
    "@type": "Hospital",
    "name": "NamaMedical Hospital",
    "address": "Riyadh, Saudi Arabia"
  }
}
```

## Open Graph Image

- 1200×630 px
- Department name in AR + EN
- Photo of modern cath lab (with consent)
- Logo overlay

## Sitemap

```xml
<url>
  <loc>https://jumanasoft.com/cardiology</loc>
  <lastmod>2026-07-22</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

## robots.txt

```
User-agent: *
Allow: /cardiology
Disallow: /api/
Disallow: /admin/
```

## Performance

- LCP <2.5s
- CLS <0.1
- INP <200ms

## Accessibility

- WCAG 2.2 AA
- All images have alt text
- All videos have captions
- Color contrast 4.5:1 minimum

---

End of SEO spec.
