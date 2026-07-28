# nm-stitch-medical-ui v2

> **Type:** UI/UX skill
> **Stack:** Google Stitch Design System (medical edition)
> **Project source:** https://stitch.withgoogle.com/projects/17612445146025313712
> **Languages:** AR primary + EN secondary, RTL/LTR
> **Tokens:** 50+ design tokens
> **A11y:** WCAG 2.1 AA minimum

---

## Description

Authoritative skill for producing Stitch-based UI for any NamaMedical page, button, screen, or workflow. Stitch is the **single source of design** for the medical app. Use this skill whenever a new screen, page, or component is required.

## When to use

- "Design a [screen] for [department]"
- "Add a new button/modal/drawer to [station]"
- "Map the journey of [patient persona] in [department]"
- "Generate wireframes for [feature]"

## The 8 Stitch layouts (A-H)

| ID | Layout | Use case | Departments |
|----|--------|----------|-------------|
| **A** | Hero + 3-col | Marketing / landing | Portal, public |
| **B** | Sidebar + main + timeline | Doctor station | Cardiology, Surgery, ER, ICU |
| **C** | Top bar + tabs + grid | Admin / settings | HR, Quality, Admin |
| **D** | Triage board (cards) | High-volume queue | ER, Pharmacy, Lab, OR |
| **E** | Calendar + day-planner | Scheduling | Appointments, OR, Clinic |
| **F** | Form-heavy wizard | Order entry | CPOE, Discharge, Onboarding |
| **G** | Timeline + media | Patient 360 view | EMR, Surgery, OBG |
| **H** | Dashboard cards (KPI) | Executive / quality | Dashboard, Reports |

## Wireframe template (per screen)

```yaml
screen:
  id: <station_id>__<screen_slug>
  title_ar: <...>
  title_en: <...>
  layout: A|B|C|D|E|F|G|H
  rtl: true
  persona: <doctor|nurse|patient|admin|technician|executive>
  components:
    - { id: <comp>, type: <header|nav|main|sidebar|footer|modal|drawer|toast|tab|card|form|table|chart|kpi|button|filter|search>, position: <grid coords>, i18n_key: <...> }
  data:
    sources: [<api path or table>]
    real_time: true|false
    cache: <key + ttl>
  states:
    - { state: loading, ui: skeleton_shimmer }
    - { state: empty, ui: empty_state_illustration }
    - { state: error, ui: error_state_with_retry }
    - { state: success, ui: success_toast + redirect }
  a11y:
    aria_labels: <list>
    focus_order: <list>
    keyboard_shortcuts: <list>
  stitch_component_ids: [<list>]
  red_flag_highlight: <list of UI hints>
  safe_html_required: true
```

## Design tokens (50+)

| Group | Token | Value | AR usage |
|-------|-------|-------|----------|
| **Color primary** | `nm.p.500` | `#0E5A6B` | Headers, primary buttons |
| | `nm.p.600` | `#0A4351` | Hover, focus |
| | `nm.p.100` | `#E0F0F4` | Subtle bg |
| **Color clinical** | `nm.c.critical` | `#D32F2F` | Red flags, critical alerts |
| | `nm.c.warning` | `#F57C00` | Caution, pending |
| | `nm.c.success` | `#2E7D32` | Success, normal |
| | `nm.c.info` | `#1976D2` | Info, neutral |
| | `nm.c.neutral` | `#607D8B` | Disabled, secondary |
| **Surface** | `nm.s.canvas` | `#F7FAFB` | App canvas |
| | `nm.s.card` | `#FFFFFF` | Card surface |
| | `nm.s.elevated` | `#FFFFFF` + shadow | Modal, drawer |
| | `nm.s.glass` | `rgba(255,255,255,0.85)` + blur | Glass cards (RTL) |
| **Text** | `nm.t.heading` | `#0B2530` | H1, H2 |
| | `nm.t.body` | `#1A2B36` | Body |
| | `nm.t.muted` | `#5A6B73` | Caption |
| **Spacing** | `nm.space.1` | 4px | tight |
| | `nm.space.2` | 8px | small |
| | `nm.space.3` | 12px | default |
| | `nm.space.4` | 16px | medium |
| | `nm.space.5` | 24px | large |
| | `nm.space.6` | 32px | xlarge |
| | `nm.space.7` | 48px | section |
| **Radius** | `nm.r.sm` | 6px | chips |
| | `nm.r.md` | 10px | buttons, inputs |
| | `nm.r.lg` | 16px | cards |
| | `nm.r.xl` | 24px | modals |
| **Shadow** | `nm.sh.1` | `0 1px 2px rgba(0,0,0,0.05)` | card |
| | `nm.sh.2` | `0 2px 8px rgba(0,0,0,0.08)` | popover |
| | `nm.sh.3` | `0 8px 24px rgba(0,0,0,0.12)` | modal |
| **Font** | `nm.f.sans` | `IBM Plex Sans Arabic, Inter, system-ui` | AR + EN |
| | `nm.f.mono` | `JetBrains Mono, monospace` | codes |
| | `nm.f.size.xs` | 12px | caption |
| | `nm.f.size.sm` | 14px | small |
| | `nm.f.size.md` | 16px | body |
| | `nm.f.size.lg` | 20px | h3 |
| | `nm.f.size.xl` | 28px | h2 |
| | `nm.f.size.xxl` | 36px | h1 |
| **RTL** | `nm.rtl.mirror` | auto | for icons, charts, tables |
| **A11y** | `nm.a.min_contrast` | 4.5:1 | text vs bg |
| **States** | `nm.st.skeleton` | shimmer gradient | loading |
| | `nm.st.spinner` | svg 24x24 | async |
| | `nm.st.toast` | top-right 4s | info, success, error |

## i18n key pattern

```yaml
i18n:
  - { key: card.title, ar: "ملخص المريض", en: "Patient Summary" }
  - { key: btn.save, ar: "حفظ", en: "Save" }
  - { key: btn.cancel, ar: "إلغاء", en: "Cancel" }
  - { key: alert.red_flag, ar: "⚠ تنبيه عاجل", en: "⚠ URGENT" }
  - { key: empty.no_data, ar: "لا توجد بيانات", en: "No data" }
  - { key: err.network, ar: "خطأ في الاتصال", en: "Network error" }
  - { key: err.tenant_missing, ar: "الجلسة منتهية، أعد تسجيل الدخول", en: "Session expired, please sign in again" }
```

## Safe-HTML rules

- **Never** `innerHTML =` raw content. Use `SafeHtml()`, `escapeHTML()`, `safeId()`, `safeUrl()`, `jsStr()` from `app.js` head.
- All user-input rendered to DOM goes through the safe wrappers.
- All API responses with HTML/markdown go through `SafeHtml()`.
- All i18n strings are pre-escaped at build time.

## Wireframe-to-station bridge

When a dept is ready for implementation, this skill hands off to:
- `nm-ai-brain-frontend-bridge` for the `station.js` file
- `namaweb/public/js/app.js` (existing main entry) for integration
- `.ai-brain/templates/wireframe_v1` template

## Stitch URL reference

Project: https://stitch.withgoogle.com/projects/17612445146025313712

When a new screen is needed, **start from Stitch** then map to:
1. Stitch component IDs
2. `.ai-brain/templates/wireframe_v1`
3. namaweb station module
4. AR/EN i18n keys
5. Token references (no hardcoded values)
