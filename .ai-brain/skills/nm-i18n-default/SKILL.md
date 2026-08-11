---
name: nm-i18n-default
description: Use when adding any new user-facing string. Loads the i18n key registry, translation matrix (AR/EN/FR/UR), and locale files. Enforces 4-language parity for all UI strings.
---

# i18n Default — 4-Language Parity

## Required languages

- **AR** (Arabic) — default, RTL
- **EN** (English) — LTR
- **FR** (French) — LTR
- **UR** (Urdu) — RTL

Every UI string must exist in all four locales before merging.

## Key structure

```json
// public/js/locales/ar.json
{
  "cardiology": {
    "page_title": "أمراض القلب",
    "grace_form": {
      "title": "حاسبة GRACE",
      "fields": {
        "age": "العمر",
        "sbp": "ضغط الدم الانقباضي",
        "hr": "معدل ضربات القلب",
        "killip": "فئة Killip",
        "creatinine": "الكرياتينين"
      },
      "submit": "احسب",
      "results": {
        "low": "خطر منخفض",
        "moderate": "خطر متوسط",
        "high": "خطر مرتفع",
        "very_high": "خطر مرتفع جداً"
      },
      "cite": "GRACE 2.0 — JAMA 2006"
    }
  }
}
```

## Locale files

| File | Lines | Owner |
|---|---|---|
| `public/js/locales/ar.json` | ~5000 | primary |
| `public/js/locales/en.json` | ~5000 | translated |
| `public/js/locales/fr.json` | ~5000 | translated |
| `public/js/locales/ur.json` | ~5000 | translated |

## Usage in HTML

```html
<h1 data-i18n="cardiology.page_title">أمراض القلب</h1>
<button data-i18n="cardiology.grace_form.submit">احسب</button>
```

## Usage in JS

```js
const title = namaI18n.t('cardiology.page_title');
// → 'Cardiology' when lang=en
// → 'أمراض القلب' when lang=ar
// → 'Cardiologie' when lang=fr
// → 'امراض قلب' when lang=ur
```

## RTL handling

```js
function setLang(lang) {
    localStorage.setItem('nama_lang', lang);
    document.documentElement.dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    namaI18n.applyTranslations();
}
```

## Number / date formatting

```js
// Numbers
const formatted = new Intl.NumberFormat(lang).format(2.5);   // 2.5 vs ٢٫٥

// Dates
const dateStr = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' })
    .format(new Date());                                      // 8/10/2026 vs ١٠‏/٠٨‏/٢٠٢٦

// Hijri calendar (medical records)
const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { dateStyle: 'long' })
    .format(new Date());                                      // ٢٦ صفر ١٤٤٧ هـ
```

## Plural rules (Arabic has 6 forms)

```js
const plurals = new Intl.PluralRules(lang);
const form = plurals.select(count);     // 'zero'|'one'|'two'|'few'|'many'|'other'

// Examples:
// AR count=1 → 'one'  → '١ مريض'
// AR count=2 → 'two'  → '٢ مريضان'
// AR count=5 → 'few'  → '٥ مرضى'
// AR count=11 → 'many' → '١١ مريضاً'
```

## Anti-patterns

- ❌ Hardcoding strings inside HTML (`<h1>Submit</h1>` instead of `<h1 data-i18n="...">...</h1>`)
- ❌ Translating to 3 of 4 locales (must be 4/4)
- ❌ Mixing LTR/RTL text inside a single phrase
- ❌ Using English number formatting in Arabic UI
- ❌ Storing translations in source code (use JSON files)

## Coverage check

```bash
# In CI
node scripts/i18n-coverage.js \
  --locales=ar,en,fr,ur \
  --src=public/js/locales \
  --min-coverage=1.0    # 100%
```

## Token saving

Avoids re-writing i18n boot/loader per page. The `namaI18n.loadLocale()` +
`applyTranslations()` pattern is canonical. Each page = ~30 lines i18n code vs
~100 lines from scratch.