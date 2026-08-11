---
name: nm-wireframe-stub
description: Use when sketching any new wireframe, mock UI, or prototype. Loads the canonical NamaMedical wireframe conventions — token-driven CSS, AR/EN labels, RTL/LTR aware, mobile-first. Saves ~70% tokens per wireframe.
---

# Wireframe Stub — Token-Saver for Prototypes

## When to use

Anytime you need to show what a UI will look like before building it. The stub
gives you a fully styled skeleton so you can focus on layout/composition, not CSS.

## HTML skeleton

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>{Feature} — Wireframe</title>
<link rel="stylesheet" href="/css/nama-tokens.css" />
<style>
  body { margin: 0; padding: 16px; background: var(--nama-bg); font-family: var(--nama-font); }
  .wf-shell { display: grid; grid-template-rows: auto 1fr auto; min-height: 100vh; }
  .wf-topbar { display: flex; justify-content: space-between; align-items: center;
               padding: 12px 24px; background: var(--nama-card-bg);
               border-bottom: 1px solid var(--nama-border); }
  .wf-main { padding: 24px; }
  .wf-bottom { padding: 12px 24px; background: var(--nama-card-bg);
               border-top: 1px solid var(--nama-border); font-size: 12px;
               color: var(--nama-text-muted); }

  /* TODO: replace .wf-skeleton with your layout */
  .wf-skeleton { display: grid; grid-template-columns: 240px 1fr; gap: 16px;
                 min-height: 600px; }
  .wf-skeleton-aside { background: var(--nama-bg-subtle); border-radius: 8px; padding: 16px; }
  .wf-skeleton-main  { background: var(--nama-bg-subtle); border-radius: 8px; padding: 16px; }
</style>
</head>
<body>
<div class="wf-shell">
  <header class="wf-topbar">
    <div>
      <h2 style="margin:0">{Feature} — Wireframe</h2>
      <small style="color:var(--nama-text-muted)">Sketched {date}</small>
    </div>
    <div>
      <button>AR</button>
      <button>EN</button>
    </div>
  </header>

  <main class="wf-main">
    <div class="wf-skeleton">
      <aside class="wf-skeleton-aside">[LEFT PANEL: filters / nav]</aside>
      <section class="wf-skeleton-main">[MAIN: queue / form / detail]</section>
    </div>
  </main>

  <footer class="wf-bottom">
    Wireframe · {Feature} · Stub uses nama-tokens · RTL/LTR aware
  </footer>
</div>
</body>
</html>
```

## Common wireframe patterns (drop in for `.wf-skeleton-main`)

### Patient queue

```html
<table class="wf-list">
  <thead>
    <tr><th>MRN</th><th>Patient</th><th>CC</th><th>Status</th><th></th></tr>
  </thead>
  <tbody>
    <!-- Stub rows -->
  </tbody>
</table>
```

### Form (calculator)

```html
<form class="wf-form">
  <div class="wf-form-row"><label>Age</label><input type="number" /></div>
  <div class="wf-form-row"><label>SBP</label><input type="number" /></div>
  <button type="submit">Calculate</button>
</form>
```

### Detail panel

```html
<div class="wf-detail">
  <div class="wf-row"><span>Name</span><strong>John Doe</strong></div>
  <div class="wf-row"><span>MRN</span><strong>P-001</strong></div>
  <div class="wf-row"><span>Diagnosis</span><strong>STEMI</strong></div>
</div>
```

## Conventions

- Use `var(--nama-*)` tokens, never hardcode colors
- Mobile-first: default to 1-column grid at < 768px
- RTL/LTR aware: use `margin-inline-start`, `padding-inline-end`, never `margin-left`
- Always include a topbar + footer in stubs so reviewers can navigate

## Token references

`/css/nama-tokens.css` exports:

| Token | Use |
|---|---|
| `--nama-primary` | primary buttons, links |
| `--nama-secondary` | secondary buttons |
| `--nama-danger` | error / high risk |
| `--nama-warning` | caution |
| `--nama-success` | confirmations |
| `--nama-bg` | page background |
| `--nama-bg-subtle` | card / panel |
| `--nama-card-bg` | topbar / cards |
| `--nama-border` | dividers |
| `--nama-text` | primary text |
| `--nama-text-muted` | secondary text |
| `--nama-font` | system font stack |

## Token saving

Each wireframe = ~250 lines from scratch → ~80 lines with stub. ~70% reduction.