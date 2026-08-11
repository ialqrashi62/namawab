---
name: nm-stitch-scaffold
description: Use when generating any Stitch HTML page. Loads the canonical HTML skeleton, design tokens, AR/EN locale loader, and nama-api client. Saves ~80% tokens per Stitch page.
---

# Stitch Scaffold — Token-Saver for HTML Pages

## When to use

Anytime you need to create a new HTML page for the NamaMedical hospital platform.
The scaffold captures the design system, locale loader, API client, AR/EN toggling,
RTL support, and core layout — so each page only needs its unique content block.

## Reference implementation

See `namaweb/public/departments/cardiology.html` for a fully filled example using this
scaffold.

## HTML skeleton (paste into new file, edit `<!-- CONTENT HOOK -->`)

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title data-i18n="page.title">{PAGE_TITLE}</title>
<link rel="stylesheet" href="/css/nama-tokens.css" />
<link rel="stylesheet" href="/css/station.css" />
<link rel="stylesheet" href="/css/theme-default.css" />
<style>
  .dept-page { padding: 24px; max-width: 1400px; margin: 0 auto; }
  .dept-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .dept-icon { width: 64px; height: 64px; border-radius: 16px;
               background: linear-gradient(135deg, var(--nama-primary), var(--nama-accent));
               display: flex; align-items: center; justify-content: center;
               color: white; font-size: 28px; }
  .dept-title { font-size: 28px; font-weight: 700; color: var(--nama-text); margin: 0; }
  .dept-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
  .dept-card { background: var(--nama-card-bg); border-radius: 12px; padding: 20px;
               box-shadow: 0 1px 3px rgba(0,0,0,.06); border: 1px solid var(--nama-border); }
  .dept-card h3 { margin: 0 0 8px; font-size: 16px; color: var(--nama-text-muted);
                  font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .dept-card .value { font-size: 32px; font-weight: 700; color: var(--nama-primary); }
  .dept-card .sub { font-size: 14px; color: var(--nama-text-muted); margin-top: 4px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .form-row.full { grid-template-columns: 1fr; }
  .form-row label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .form-row input, .form-row select { width: 100%; padding: 8px 10px; border: 1px solid var(--nama-border);
                                       border-radius: 6px; font-size: 14px; }
  .btn { padding: 10px 20px; border: 0; border-radius: 8px; cursor: pointer;
         font-weight: 600; font-size: 14px; }
  .btn-primary { background: var(--nama-primary); color: white; }
  .btn-secondary { background: var(--nama-bg-subtle); color: var(--nama-text); }
  .results { margin-top: 24px; padding: 16px; background: var(--nama-card-bg);
             border-radius: 12px; border: 1px solid var(--nama-border); }
  .risk-high { color: var(--nama-danger); font-weight: 700; }
  .risk-med  { color: var(--nama-warning); font-weight: 600; }
  .risk-low  { color: var(--nama-success); font-weight: 600; }
  .cite { font-size: 11px; color: var(--nama-text-muted); margin-top: 8px; }
  table.dept-list { width: 100%; border-collapse: collapse; }
  table.dept-list th, table.dept-list td { padding: 8px 12px; text-align: start;
                                          border-bottom: 1px solid var(--nama-border); font-size: 14px; }
  table.dept-list th { background: var(--nama-bg-subtle); font-weight: 600; }
  .lang-toggle { position: fixed; top: 12px; left: 12px; z-index: 1000;
                 display: flex; gap: 4px; background: white;
                 border-radius: 999px; padding: 4px;
                 box-shadow: 0 2px 6px rgba(0,0,0,.08); }
  .lang-toggle button { padding: 4px 12px; border: 0; background: transparent;
                        border-radius: 999px; cursor: pointer; font-weight: 600; }
  .lang-toggle button.active { background: var(--nama-primary); color: white; }
</style>
</head>
<body>
<div class="lang-toggle">
  <button id="btn-ar" class="active" onclick="setLang('ar')">عربي</button>
  <button id="btn-en" onclick="setLang('en')">EN</button>
</div>

<main class="dept-page">
  <header class="dept-header">
    <div class="dept-icon">🏥</div>
    <div>
      <h1 class="dept-title" data-i18n="dept.name">{DEPARTMENT_NAME_AR}</h1>
      <p data-i18n="dept.subtitle">{DEPARTMENT_SUBTITLE_AR}</p>
    </div>
  </header>

  <!-- CONTENT HOOK -->
  <section class="dept-grid">
    <div class="dept-card">
      <h3 data-i18n="card1.title">رؤساء الأقسام</h3>
      <p class="value">—</p>
      <p class="sub" data-i18n="card1.sub">Loading…</p>
    </div>
    <!-- Add more cards here -->
  </section>

  <section class="results" id="results">
    <p data-i18n="results.placeholder">النتائج ستظهر هنا</p>
  </section>
</main>

<script src="/js/nama-i18n.js"></script>
<script src="/js/nama-api.js"></script>
<script>
  // Page-specific logic goes here. Keep it minimal — wire forms to API, render results.
  document.addEventListener('DOMContentLoaded', async () => {
    await namaI18n.loadLocale();
    namaI18n.applyTranslations();
  });
</script>
</body>
</html>
```

## Content Hook variations

Pick the right `<!-- CONTENT HOOK -->` content based on dept type:

### Score calculator
```html
<form class="dept-card" onsubmit="return submitScore(event)">
  <h3 data-i18n="form.title">حاسبة</h3>
  <div class="form-row"><label>Age</label><input name="age" type="number" required /></div>
  <div class="form-row"><label>SBP</label><input name="sbp" type="number" required /></div>
  <button class="btn btn-primary" type="submit">Calculate</button>
</form>
```

### Patient queue
```html
<table class="dept-list">
  <thead><tr><th>Patient</th><th>Chief Complaint</th><th>Status</th><th>Action</th></tr></thead>
  <tbody id="queue-body"></tbody>
</table>
```

### Order entry
```html
<form class="dept-card" onsubmit="return submitOrder(event)">
  <h3>New Order</h3>
  <div class="form-row"><label>Type</label>
    <select name="orderType">
      <option value="lab">Lab</option>
      <option value="imaging">Imaging</option>
      <option value="med">Medication</option>
    </select>
  </div>
  <div class="form-row full"><label>Notes</label>
    <textarea name="notes" rows="3"></textarea>
  </div>
  <button class="btn btn-primary">Submit</button>
</form>
```

## API client usage

```js
const data = await namaApi.post('/api/cardiology/assessments/grace', {
  age: 65, sbp: 140, hr: 90, killip: 1, creatinine: 1.0
});
console.log(data.score, data.risk, data.recommendation);
```

## i18n usage

All text uses `data-i18n="key.path"` attributes. Add keys to `js/locales/ar.json` and
`js/locales/en.json`:

```json
// ar.json
{ "page": { "title": "أمراض القلب" }, "dept": { "name": "أمراض القلب" } }

// en.json
{ "page": { "title": "Cardiology" }, "dept": { "name": "Cardiology" } }
```

The `namaI18n.applyTranslations()` call walks the DOM and replaces all `data-i18n` text.

## RTL handling

The HTML root has `dir="rtl" lang="ar"`. When user switches to English via
`setLang('en')`, the script does:
```js
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = lang;
```
Layouts use logical CSS properties (`margin-inline-start`) so flipping is automatic.

## Tokens consumed

CSS variables in `/css/nama-tokens.css` (referenced by `var(--nama-primary)` etc.)
must be defined. If a new page introduces colors, add them to tokens first — never
hardcode hex inside a page.

## Token saving

Compared to writing each page from scratch (~250 lines), this scaffold reduces a
new page to ~50 lines of unique content. Saves ~80% tokens per page × 122 departments
× 6 pages/dept = massive.
