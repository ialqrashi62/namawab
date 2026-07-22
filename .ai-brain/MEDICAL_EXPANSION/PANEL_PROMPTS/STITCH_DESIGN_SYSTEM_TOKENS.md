# Stitch Design System — Master Tokens for NamaMedical

> **Use case:** All 88 dept workstations + 15 centers use the same Stitch design tokens
> **Source:** Inspired by Google Stitch design system, adapted for Saudi healthcare
> **Date:** 2026-07-22
> **Version:** 1.0

---

## 1. Design Tokens (JSON)

```json
{
  "color": {
    "primary": {
      "50": "#EFF6FF",
      "500": "#3B82F6",
      "700": "#1D4ED8",
      "900": "#1E3A8A"
    },
    "success": {"500": "#10B981"},
    "warning": {"500": "#F59E0B"},
    "danger": {"500": "#EF4444"},
    "critical": {"500": "#991B1B"},
    "neutral": {
      "0": "#FFFFFF",
      "50": "#F9FAFB",
      "100": "#F3F4F6",
      "200": "#E5E7EB",
      "500": "#6B7280",
      "900": "#111827"
    }
  },
  "font": {
    "primary_ar": "IBM Plex Sans Arabic",
    "primary_en": "Inter",
    "mono": "IBM Plex Mono",
    "size": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px"
    }
  },
  "spacing": {
    "0": "0",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px",
    "12": "48px",
    "16": "64px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgba(0,0,0,0.05)",
    "md": "0 4px 6px -1px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px -3px rgba(0,0,0,0.1)"
  }
}
```

---

## 2. 8 Base Layouts (apply to any dept)

### Layout A — 3-col clinical workspace (default for most depts)

```
+----------+------------------------+----------+
|          |                        |          |
|  LEFT    |       CENTER           |  RIGHT   |
|  Context |       Workspace        |  Notes / |
|  (320px) |       (flex)           |  Orders  |
|          |                        |  (320px) |
+----------+------------------------+----------+
```

### Layout B — Dashboard (for centers of excellence)

```
+----------+----------+----------+
|  KPI 1   |  KPI 2   |  KPI 3   |
+----------+----------+----------+
|   Patient list (full width)   |
+-------------------------------+
|   Timeline / Activity         |
+-------------------------------+
```

### Layout C — Wizard (intake / triage)

```
+-------------------------------+
|   Step indicator (1/5)        |
+-------------------------------+
|   Form (centered, max 640px)  |
+-------------------------------+
|   [Back]            [Next]    |
+-------------------------------+
```

### Layout D — Chart-heavy (cardiology, oncology, OB)

```
+----------+------------------------+
|  Filters |   Trend chart         |
|          |   (full width)        |
|          +------------------------+
|          |   Data table          |
+----------+------------------------+
```

### Layout E — Timeline (ED, ICU, OB)

```
+-------------------------------+
|   Patient header              |
+-------------------------------+
|   Vertical timeline (events)  |
|   [●] 10:00 Triage             |
|   [●] 10:15 Labs ordered       |
|   [●] 10:30 Med administered   |
+-------------------------------+
```

### Layout F — Imaging (radiology, pathology, derm)

```
+----------+------------------------+
|  Study   |   Image viewer         |
|  list    |   (DICOM / image)      |
|          +------------------------+
|          |   Report (markdown)    |
+----------+------------------------+
```

### Layout G — Forms (most intake / order entry)

```
+-------------------------------+
|   Section 1: Patient          |
+-------------------------------+
|   Section 2: Vitals           |
+-------------------------------+
|   Section 3: Orders           |
+-------------------------------+
|   [Save Draft]      [Submit]  |
+-------------------------------+
```

### Layout H — Queue + Detail (clinics, pharmacy, lab)

```
+----------+------------------------+
|  Queue   |   Patient detail       |
|  (live)  |   (active selection)   |
|          |                        |
+----------+------------------------+
```

---

## 3. RTL / LTR Mirroring

- AR: dir="rtl", margin/padding swap, icons mirror (arrow, chevron)
- EN: dir="ltr", default
- All text uses `dir="auto"` for mixed content

---

## 4. Accessibility (WCAG 2.2 AA)

- Color contrast: 4.5:1 minimum (test with axe)
- Keyboard: tab order, focus ring visible
- ARIA: aria-label, aria-live for dynamic content
- Touch target: min 44×44 px
- Screen reader: tested with NVDA / VoiceOver

---

## 5. 11 Theme Variants (per facility type)

| Theme | Primary color | Use case |
|---|---|---|
| `default` | blue 500 | general |
| `cardiac` | red 700 | cardiology, CTS |
| `neuro` | purple 700 | neuro, psych |
| `obgyn` | pink 500 | OB/GYN, fertility |
| `peds` | yellow 500 | pediatrics, NICU |
| `onco` | violet 700 | oncology, palliative |
| `ortho` | orange 500 | ortho, sports med |
| `ophth` | teal 500 | ophthalmology |
| `ed` | red 900 | ER, trauma |
| `icu` | red 500 | ICU, CCU |
| `admin` | slate 500 | admin, quality, HR |

---

## 6. Per-Station File Path

- `04_ux_ui_stitch.md` per dept (inline HTML + design tokens)
- Or standalone: `namaweb/public/stitch/<dept>.html` (production reference)

---

End of design system.
