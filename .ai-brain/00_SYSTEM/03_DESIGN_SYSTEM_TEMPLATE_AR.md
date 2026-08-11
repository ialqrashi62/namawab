# {{DEPT_NAME_AR}} — Design System (MD3 + Tokens)
## NamaMedical Style Guide

> **القسم:** `{{DEPT_SLUG}}`
> **التاريخ:** {{DATE}}
> **يستند إلى:** Material Design 3 + Tailwind + custom NamaMedical tokens

---

## 1. المبادئ (Principles)

1. **الوضوح (Clarity):** كل عنصر له هدف واضح، لا زخرفة
2. **الاتساق (Consistency):** نفس النمط في كل مكان
3. **الاستجابة (Responsiveness):** يعمل على كل جهاز
4. **إمكانية الوصول (Accessibility):** WCAG 2.2 AA minimum
5. **RTL/LTR:** دعم كامل للغتين
6. **الأداء (Performance):** < 200 KB gzipped bundle

---

## 2. الألوان (Color Tokens)

### 2.1 Primary
```css
--color-primary-50:  #EFF6FF;  /* light backgrounds */
--color-primary-100: #DBEAFE;
--color-primary-200: #BFDBFE;
--color-primary-300: #93C5FD;
--color-primary-400: #60A5FA;
--color-primary-500: #3B82F6;  /* base */
--color-primary-600: #2563EB;  /* hover, focus */
--color-primary-700: #1D4ED8;  /* active, pressed */
--color-primary-800: #1E40AF;
--color-primary-900: #1E3A8A;
```

### 2.2 Semantic
```css
--color-success: #10B981;  /* green, normal */
--color-warning: #F59E0B;  /* yellow, caution */
--color-danger:  #EF4444;  /* red, critical */
--color-info:    #3B82F6;  /* blue, info */
```

### 2.3 Department accent (custom)
```css
--dept-{{DEPT_SLUG}}-color: {{DEPT_ACCENT_COLOR}};  /* {{DEPT_ACCENT_DESC_AR}} */
```

### 2.4 Neutral
```css
--color-gray-50:  #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
```

### 2.5 Dark mode
```css
@media (prefers-color-scheme: dark) {
  --color-bg: #0F172A;
  --color-bg-elevated: #1E293B;
  --color-text: #F1F5F9;
  --color-text-muted: #94A3B8;
  --color-border: #334155;
}
```

---

## 3. Typography (الخطوط)

### 3.1 Font families
```css
--font-arabic: 'Tajawal', 'Cairo', 'Noto Sans Arabic', sans-serif;
--font-latin: 'Inter', 'Roboto', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 Font sizes (modular scale 1.25)
```css
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */
```

### 3.3 Font weights
```css
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### 3.4 Line heights
```css
--leading-tight:   1.25;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
```

### 3.5 RTL support
```css
[dir="rtl"] {
  --font-arabic-tnum: 'Tajawal';  /* for numbers */
}

.text-arabic {
  font-family: var(--font-arabic);
  direction: rtl;
  text-align: right;
  line-height: var(--leading-relaxed);
}
```

---

## 4. Spacing (الفراغات)

```css
--space-0:  0;
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## 5. Border radius (الزوايا)

```css
--radius-sm:   0.25rem;  /* 4px */
--radius-base: 0.5rem;   /* 8px */
--radius-md:   0.75rem;  /* 12px */
--radius-lg:   1rem;     /* 16px */
--radius-xl:   1.5rem;   /* 24px */
--radius-full: 9999px;   /* pill */
```

---

## 6. Shadows (الظلال)

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## 7. Components (المكونات)

### 7.1 Button
```html
<button class="btn btn-primary" type="button">
  <span>حفظ</span>
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-base);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
.btn-primary {
  background: var(--color-primary-600);
  color: white;
}
.btn-primary:hover {
  background: var(--color-primary-700);
}
.btn-danger {
  background: var(--color-danger);
  color: white;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 7.2 Input
```html
<label class="form-control">
  <span class="form-label">الاسم</span>
  <input type="text" class="form-input" required />
  <span class="form-helper">نص مساعد</span>
</label>
```

```css
.form-control {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.form-label {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}
.form-input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-base);
  font-size: var(--text-base);
  background: var(--color-bg-elevated);
}
.form-input:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: -1px;
  border-color: transparent;
}
.form-input[aria-invalid="true"] {
  border-color: var(--color-danger);
}
.form-helper {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
```

### 7.3 Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">العنوان</h3>
    <button class="card-action">⋯</button>
  </div>
  <div class="card-body">المحتوى</div>
  <div class="card-footer">
    <button class="btn btn-primary">حفظ</button>
  </div>
</div>
```

### 7.4 Table
```html
<table class="table">
  <thead>
    <tr><th>الاسم</th><th>التاريخ</th></tr>
  </thead>
  <tbody>
    <tr><td>...</td><td>...</td></tr>
  </tbody>
</table>
```

### 7.5 Badge (priority indicator)
```html
<span class="badge badge-stat">STAT</span>
<span class="badge badge-urgent">عاجل</span>
<span class="badge badge-routine">عادي</span>
```

### 7.6 Modal / Dialog
### 7.7 Toast / Notification
### 7.8 Tabs
### 7.9 Stepper
### 7.10 Empty state
### 7.11 Loading skeleton
### 7.12 Error state

---

## 8. Icons (الأيقونات)

```html
<!-- Material Symbols (Google) -->
<span class="material-symbols-outlined">add</span>
<span class="material-symbols-outlined">edit</span>
<span class="material-symbols-outlined">delete</span>
<span class="material-symbols-outlined">search</span>
<span class="material-symbols-outlined">check</span>
<span class="material-symbols-outlined">close</span>
<span class="material-symbols-outlined">warning</span>
<span class="material-symbols-outlined">info</span>
```

**Department-specific icon:** `{{DEPT_ICON_NAME}}` (Material Symbol)

---

## 9. Layouts (التخطيطات)

### 9.1 Patient Queue
```
┌────────────────────────────────────────────────┐
│ Header (60px): search | notifications | user   │
├─────────────┬──────────────────────────────────┤
│             │                                  │
│ Sidebar     │  Main: Patient queue            │
│ (240px)     │  ┌──────────────────────────┐  │
│             │  │ Filters / search         │  │
│             │  ├──────────────────────────┤  │
│             │  │ Patient row (clickable)   │  │
│             │  │ Patient row               │  │
│             │  │ ...                       │  │
│             │  └──────────────────────────┘  │
│             │  Pagination                     │
└─────────────┴──────────────────────────────────┘
```

### 9.2 Patient Detail
```
┌────────────────────────────────────────────────┐
│ Header                                          │
├─────────────┬──────────────────────────────────┤
│ Sidebar     │  ┌──────────────────────────┐  │
│             │  │ Patient header (name, ID) │  │
│             │  ├──────────────────────────┤  │
│             │  │ Tabs:                    │  │
│             │  │  • Info                  │  │
│             │  │  • History               │  │
│             │  │  • {{DEPT_NAME_AR}}     │  │
│             │  │  • Medications           │  │
│             │  │  • Labs                  │  │
│             │  │  • Imaging               │  │
│             │  │  • Notes                 │  │
│             │  └──────────────────────────┘  │
└─────────────┴──────────────────────────────────┘
```

### 9.3 Form
```
┌────────────────────────────────────────────────┐
│ Title + description                            │
├────────────────────────────────────────────────┤
│ ┌─────────────┬────────────────────────────┐ │
│ │ Field 1     │ Field 2                    │ │
│ │ Field 3     │ Field 4                    │ │
│ │ Field 5 (full width)                      │ │
│ └─────────────┴────────────────────────────┘ │
├────────────────────────────────────────────────┤
│ [Cancel]  [Save Draft]  [Submit]               │
└────────────────────────────────────────────────┘
```

---

## 10. RTL Support

```css
[dir="rtl"] .icon-chevron-right::before {
  content: "\e5c4";  /* chevron-left icon */
}

[dir="rtl"] .ltr-only { display: none; }
[dir="ltr"] .rtl-only { display: none; }

[dir="rtl"] {
  --space-x-start: var(--space-4);
  --space-x-end: 0;
}
[dir="ltr"] {
  --space-x-start: 0;
  --space-x-end: var(--space-4);
}
```

---

## 11. Accessibility (WCAG 2.2 AA)

- **Color contrast:** ≥ 4.5:1 للنص، ≥ 3:1 للنصوص الكبيرة
- **Focus visible:** outline واضح على كل تفاعل
- **Keyboard navigation:** كل شيء يمكن الوصول له بـ Tab
- **Screen reader:** ARIA labels صحيحة
- **Skip links:** للقفز فوق القوائم
- **Alt text:** لكل صورة
- **Form labels:** كل input له label مرتبط
- **Error messages:** واضحة ومربوطة بـ aria-describedby

---

## 12. Animation (الحركة)

```css
:root {
  --transition-fast:   100ms ease;
  --transition-base:   200ms ease;
  --transition-slow:   300ms ease;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## 13. Performance Targets

- **Bundle size:** < 200 KB gzipped
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **FCP:** < 1.5s

---

## 14. Naming Conventions

- **CSS classes:** kebab-case (`.patient-card`)
- **CSS variables:** kebab-case (`--color-primary-500`)
- **JS variables:** camelCase
- **Components:** PascalCase (`<PatientCard />`)
- **Files:** kebab-case (`patient-card.html`)
- **i18n keys:** dot.notation (`{{DEPT_SLUG}}.nav.patients`)

---

> **Next:** [04_STYLE_GUIDE_TEMPLATE_AR.md](04_STYLE_GUIDE_TEMPLATE_AR.md) — أمثلة وتطبيقات.
