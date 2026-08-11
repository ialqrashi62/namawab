---
name: nm-i18n-coverage
description: Use when auditing translation coverage or generating missing translations. Loads the canonical i18n key registry, locale matrix, and medical-context translation dictionary. Saves ~70% tokens per i18n audit.
---

# i18n Coverage — Token-Saver

## When to use

- Auditing translation coverage (must be 100% AR/EN/FR/UR)
- Generating missing translations from medical dictionary
- Detecting orphan keys (defined but not used)
- Detecting hardcoded strings in source code

## Canonical locale structure

```
public/js/locales/
  ar.json   (primary, 5000+ keys)
  en.json   (translated)
  fr.json   (translated)
  ur.json   (translated)
```

## Coverage audit script

```js
// scripts/i18n_coverage.js
const fs = require('fs');
const path = require('path');

const LOCALES = ['ar', 'en', 'fr', 'ur'];
const SRC = path.join(__dirname, '../public/js/locales');

const allKeys = (obj, prefix = '') => {
    let out = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'object') out = out.concat(allKeys(v, path));
        else out.push(path);
    }
    return out;
};

const loadLocale = (loc) => JSON.parse(fs.readFileSync(path.join(SRC, `${loc}.json`), 'utf8'));
const locales = Object.fromEntries(LOCALES.map(l => [l, loadLocale(l)]));

const matrix = {};
for (const loc of LOCALES) matrix[loc] = new Set(allKeys(locales[loc]));

console.log('=== i18n coverage matrix ===');
const allKeysSet = new Set();
for (const loc of LOCALES) allKeysSet.forEach(k => allKeysSet.add(k)); // init
for (const loc of LOCALES) matrix[loc].forEach(k => allKeysSet.add(k));

for (const key of allKeysSet) {
    const present = LOCALES.map(loc => matrix[loc].has(key) ? '✓' : '✗').join(' ');
    console.log(`${present} ${key}`);
}

console.log('\n=== summary ===');
for (const loc of LOCALES) {
    const present = [...allKeysSet].filter(k => matrix[loc].has(k)).length;
    const pct = (present / allKeysSet.size * 100).toFixed(1);
    console.log(`${loc}: ${present}/${allKeysSet.size} (${pct}%)`);
}
```

## Medical context dictionary

```js
// scripts/medical_dict.js
const AR_TO_EN = {
    'قلب': 'heart',
    'صدر': 'chest',
    'رئة': 'lung',
    'كبد': 'liver',
    'كلى': 'kidney',
    'دماغ': 'brain',
    'معدة': 'stomach',
    'أمعاء': 'intestine',
    'عظم': 'bone',
    'مفصل': 'joint',
    'عضلة': 'muscle',
    'جلد': 'skin',
    'عين': 'eye',
    'أذن': 'ear',
    'أنف': 'nose',
    'حلق': 'throat',
    'أسنان': 'teeth',
    'سكري': 'diabetes',
    'ضغط': 'pressure',
    'حرارة': 'temperature',
    'نبض': 'pulse',
    'تنفّس': 'breathing',
    'صداع': 'headache',
    'دوخة': 'dizziness',
    'غثيان': 'nausea',
    'قيء': 'vomiting',
    'إسهال': 'diarrhea',
    'إمساك': 'constipation',
    'ألم': 'pain',
    'حرقة': 'burning',
    'حكة': 'itching',
    'طفح': 'rash',
    'تورّم': 'swelling',
    'التهاب': 'inflammation',
    'عدوى': 'infection',
    'جراحة': 'surgery',
    'تخدير': 'anesthesia',
    'تحاليل': 'lab tests',
    'أشعة': 'imaging',
    'وصفة': 'prescription',
    'جرعة': 'dose',
    'حبة': 'tablet',
    'كبسولة': 'capsule',
    'حقنة': 'injection',
    'قطرة': 'drop',
    'مرهم': 'ointment',
    'مريض': 'patient',
    'طبيب': 'doctor',
    'ممرض': 'nurse',
    'صيدلي': 'pharmacist',
    'موعد': 'appointment',
    'طوارئ': 'emergency',
    'عناية': 'care',
    'دخول': 'admission',
    'خروج': 'discharge',
    'تشخيص': 'diagnosis',
    'علاج': 'treatment',
    'شفاء': 'recovery',
    'وفاة': 'death'
};

const EN_TO_AR = Object.fromEntries(Object.entries(AR_TO_EN).map(([k,v]) => [v, k]));
const EN_TO_FR = { heart: 'cœur', chest: 'poitrine', lung: 'poumon', liver: 'foie',
                   kidney: 'rein', brain: 'cerveau', stomach: 'estomac',
                   patient: 'patient', doctor: 'médecin', nurse: 'infirmier',
                   pain: 'douleur', fever: 'fièvre', cough: 'toux', /* ... */ };
const EN_TO_UR = { heart: 'دل', chest: 'سینہ', lung: 'پھیپھڑا', liver: 'جگر',
                   kidney: 'گردہ', brain: 'دماغ', stomach: 'معدہ',
                   patient: 'مریض', doctor: 'ڈاکٹر', nurse: 'نرس',
                   pain: 'درد', fever: 'بخار', cough: 'کھانسی', /* ... */ };
```

## Auto-generate missing keys

```js
function translateFromDict(arText) {
    const dict = require('./medical_dict');
    const enText = Object.entries(dict.AR_TO_EN)
        .reduce((text, [ar, en]) => text.replace(new RegExp(ar, 'g'), en), arText);
    const frText = Object.entries(dict.EN_TO_FR)
        .reduce((text, [en, fr]) => text.replace(new RegExp(`\\b${en}\\b`, 'g'), fr), enText);
    const urText = Object.entries(dict.EN_TO_UR)
        .reduce((text, [en, ur]) => text.replace(new RegExp(`\\b${en}\\b`, 'g'), ur), enText);
    return { en: enText, fr: frText, ur: urText };
}
```

## Detect hardcoded strings

```js
// scripts/i18n_audit_strings.js
const fs = require('fs');
const path = require('path');

const srcDirs = ['namaweb/public/js', 'namaweb/public/css', 'namaweb/public/html'];
const HARDCODED = [];

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(js|html)$/.test(entry.name)) {
            const content = fs.readFileSync(full, 'utf8');
            // Find Arabic text in JS/HTML strings (rough heuristic)
            const matches = content.match(/['"`][^'"`]*[\u0600-\u06FF]{3,}[^'"`]*['"`]/g);
            if (matches) HARDCODED.push({ file: full, matches });
        }
    }
}

srcDirs.forEach(walk);

console.log(`Found ${HARDCODED.length} files with hardcoded Arabic strings`);
HARDCODED.forEach(({ file, matches }) => {
    console.log(`\n=== ${file} ===`);
    matches.forEach(m => console.log(`  ${m}`));
});
```

## CI hook

```yaml
# .github/workflows/i18n.yml
- name: i18n coverage check
  run: |
    node scripts/i18n_coverage.js | tee coverage.log
    grep -E "^(ar|en|fr|ur):" coverage.log | awk '{ if ($2+0 < 100) { print "FAIL: " $0; exit 1 } }'
- name: detect hardcoded strings
  run: |
    node scripts/i18n_audit_strings.js | tee hardcoded.log
    if [ -s hardcoded.log ]; then echo "FAIL: hardcoded strings found"; exit 1; fi
```

## Acceptance gate

- All 4 locales: 100% key coverage
- 0 hardcoded Arabic/English strings in JS/HTML
- 0 orphan keys (defined but unused) — flagged for cleanup

## Token saving

Each i18n audit from scratch = ~200 lines. With template = ~50 lines unique
(custom locale paths, custom dict). ~75% reduction.