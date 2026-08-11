---
name: nm-stitch-google
description: Use when generating any Stitch Google design page. Loads the canonical Material Design 3 tokens + Google web fonts + AR/EN/Font fallback so every page follows the Stitch Google spec. Saves ~85% tokens per Stitch page.
---

# Stitch Google — Material Design 3 + Google Fonts

## What this skill produces

A complete HTML page that:
- Uses Material Design 3 tokens (`--md-sys-color-primary`, etc.)
- Loads only Google Fonts (Roboto + Cairo for AR/UR)
- Is RTL/LTR aware (auto-flips)
- Uses the Stitch Google component library
- Auto-wires to `namaApi` + `namaI18n`

## Skeleton (drop-in)

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{DEPT_TITLE_AR} · NamaMedical</title>

<!-- Google Fonts: Roboto (LTR) + Cairo (RTL) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

<!-- Material Design 3 tokens (from nama-tokens.css) -->
<link rel="stylesheet" href="/css/nama-tokens.css">

<style>
  :root {
    --md-ref-typeface-brand: 'Cairo','Roboto',sans-serif;
    --md-sys-color-primary: #006B5F;
    --md-sys-color-on-primary: #FFFFFF;
    --md-sys-color-surface: #FAFDFB;
    --md-sys-color-on-surface: #191C1B;
    --md-sys-color-outline: #6F7978;
    --md-sys-shape-corner-medium: 12px;
    --md-sys-shape-corner-large: 16px;
    --md-sys-elevation-1: 0 1px 2px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.06);
    --md-sys-elevation-2: 0 2px 6px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06);
  }
  html[lang="en"], html[lang="fr"] { --md-ref-typeface-brand: 'Roboto','Cairo',sans-serif; }

  body { font-family: var(--md-ref-typeface-brand); margin: 0;
         background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); }

  /* Stitch buttons */
  .md-btn { display: inline-flex; gap: 8px; padding: 10px 24px; border-radius: 999px;
            font-weight: 500; cursor: pointer; transition: background .15s; }
  .md-btn-filled { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); border: 0; }
  .md-btn-filled:hover { box-shadow: var(--md-sys-elevation-2); }
  .md-btn-outlined { background: transparent; color: var(--md-sys-color-primary); border: 1px solid var(--md-sys-color-primary); }

  /* Stitch card */
  .md-card { background: white; border-radius: var(--md-sys-shape-corner-large);
             padding: 24px; box-shadow: var(--md-sys-elevation-1); margin-bottom: 16px; }
  .md-card-title { margin: 0 0 8px; font-size: 18px; font-weight: 600; }
  .md-card-sub { margin: 0; font-size: 14px; color: var(--md-sys-color-outline); }

  /* Stitch text fields */
  .md-field { display: block; margin-bottom: 16px; }
  .md-field label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
  .md-field input, .md-field select, .md-field textarea {
      width: 100%; padding: 12px 14px; border: 1px solid var(--md-sys-color-outline);
      border-radius: 4px; font-family: inherit; font-size: 14px;
      background: transparent; color: var(--md-sys-color-on-surface); }
  .md-field input:focus { outline: 2px solid var(--md-sys-color-primary); outline-offset: -1px; }

  /* Stitch chips */
  .md-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
             border-radius: 8px; font-size: 13px; font-weight: 500;
             background: rgba(0,107,95,.08); color: var(--md-sys-color-primary); }

  /* Stitch risk badges */
  .md-badge { display: inline-block; padding: 4px 10px; border-radius: 999px;
              font-size: 12px; font-weight: 600; }
  .md-badge-low      { background: #DCFCE7; color: #14532D; }
  .md-badge-moderate { background: #FEF3C7; color: #78350F; }
  .md-badge-high     { background: #FED7AA; color: #7C2D12; }
  .md-badge-very_high{ background: #FECACA; color: #7F1D1D; }

  /* Layout */
  .md-shell { display: grid; grid-template-rows: 64px 1fr; min-height: 100vh; }
  .md-app-bar { display: flex; align-items: center; padding: 0 24px; gap: 16px;
                background: white; border-bottom: 1px solid rgba(0,0,0,.06); }
  .md-app-bar h1 { font-size: 18px; margin: 0; font-weight: 600; }
  .md-content { padding: 24px; max-width: 1200px; margin: 0 auto; }
  .md-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 16px; }

  .md-lang-toggle { margin-inline-start: auto; display: flex; gap: 4px; }
  .md-lang-toggle button { background: transparent; border: 1px solid var(--md-sys-color-outline);
                           border-radius: 999px; padding: 4px 12px; cursor: pointer; font-weight: 500; }
  .md-lang-toggle button.active { background: var(--md-sys-color-primary); color: white; border-color: var(--md-sys-color-primary); }

  .md-foot { padding: 16px 24px; text-align: center; font-size: 12px;
             color: var(--md-sys-color-outline); }
</style>
</head>
<body>
<div class="md-shell">
  <header class="md-app-bar">
    <span style="font-size:24px">🏥</span>
    <h1 data-i18n="page.title">{DEPT_TITLE_AR}</h1>
    <div class="md-lang-toggle">
      <button id="btn-ar" class="active" onclick="setLang('ar')">عربي</button>
      <button id="btn-en" onclick="setLang('en')">EN</button>
      <button id="btn-fr" onclick="setLang('fr')">FR</button>
      <button id="btn-ur" onclick="setLang('ur')">UR</button>
    </div>
  </header>

  <main class="md-content">
    <div class="md-grid">
      <!-- CONTENT HOOK -->
      <div class="md-card">
        <h3 class="md-card-title" data-i18n="card1.title">رؤساء الأقسام</h3>
        <p class="md-card-sub" data-i18n="card1.sub">جارٍ التحميل…</p>
      </div>
    </div>
  </main>

  <footer class="md-foot">NamaMedical · {DEPT_TITLE_AR}</footer>
</div>

<script src="/js/nama-i18n.js"></script>
<script src="/js/nama-api.js"></script>
<script>
  async function setLang(lang) {
      localStorage.setItem('nama_lang', lang);
      document.documentElement.dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.querySelectorAll('.md-lang-toggle button').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-' + lang).classList.add('active');
      await namaI18n.loadLocale(lang);
      namaI18n.applyTranslations();
  }
  document.addEventListener('DOMContentLoaded', async () => {
      const lang = localStorage.getItem('nama_lang') || 'ar';
      await setLang(lang);
  });
</script>
</body>
</html>
```

## Content hook examples

### Score calculator
```html
<div class="md-card">
  <h3 class="md-card-title" data-i18n="form.title">حاسبة GRACE</h3>
  <form onsubmit="return submitGrace(event)">
    <div class="md-field"><label data-i18n="form.age">العمر</label><input name="age" type="number" required></div>
    <div class="md-field"><label data-i18n="form.sbp">ضغط الدم الانقباضي</label><input name="sbp" type="number" required></div>
    <div class="md-field"><label data-i18n="form.hr">معدل ضربات القلب</label><input name="hr" type="number" required></div>
    <button class="md-btn md-btn-filled" type="submit" data-i18n="form.submit">احسب</button>
  </form>
  <div id="grace-result" style="margin-top:16px"></div>
</div>
```

### Queue list
```html
<div class="md-card">
  <h3 class="md-card-title" data-i18n="queue.title">قائمة المرضى</h3>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr><th data-i18n="queue.mrn">MRN</th><th data-i18n="queue.name">الاسم</th><th data-i18n="queue.status">الحالة</th></tr></thead>
    <tbody id="queue-body"></tbody>
  </table>
</div>
```

## Conventions

- Use Material Design 3 tokens (`--md-sys-*`), not raw colors
- Use `Cairo` for AR/UR, `Roboto` for EN/FR (auto via CSS variable)
- Use `margin-inline-start` not `margin-left` for RTL
- Always include the lang toggle in app-bar
- Use semantic colors via `.md-badge-low/moderate/high/very_high`

## Token saving

Stitch Google page from scratch = ~400 lines. With this template = ~60 lines unique
content + shared skeleton. ~85% reduction × 122 departments × ~6 pages = massive.