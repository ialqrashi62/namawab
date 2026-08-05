---
id: STITCH-V2
version: 1.0
date: 2026-08-01
owner: PM
status: ACTIVE
---

# Frontend / UI-UX — Stitch v2 + Clinical Command Bar + Conversational UI + Mobile

> **Purpose:** Modern, accessible, multilingual UI that rivals Epic Hyperspace + DAX + MEDITECH Expanse.

---

## 1. Global systems comparison

| System | UI approach |
|--------|-------------|
| **Epic Hyperspace** | Desktop dense UI; Hyperdrive web; **Galaxy design system** |
| **Cerner PowerChart** | MPages (modular) + Care Pathways |
| **MEDITECH Expanse** | Touch-first; Google-style search; **Canvas design system** |
| **athena** | Web-first; conversational on top; **athenaDS** |
| **DSO / Phreesia** | Mobile/registration |
| **Microsoft Cloud for Healthcare** | Embedded in Teams |
| **NamaMedical** | **Stitch v2 + Cmd+K + Scribe Mode + Mobile RN** |

---

## 2. Stitch v2 Design System

Path: `.ai-brain/99-upgrade/28-design-system/` + `namaweb/public/css/tokens.css`

```yaml
design_system:
  name: STITCH v2 (Medical)
  version: 2.0
  sources:
    - Google Stitch project: 17612445146025313712
  principles:
    - Clinical-first: density without clutter
    - Accessibility: WCAG 2.2 AA
    - Bilingual native: AR+EN, RTL/LTR
    - Performance: <200ms TTI on 4G
    - Mobile parity: same workflows on phone
  tokens:
    color:
      primary:   '#00A19A'
      primary_hover:   '#008985'
      success:   '#2E7D32'
      warning:   '#F57C00'
      danger:    '#C62828'
      info:      '#0277BD'
      bg:        '#F8F9FA'
      surface:   '#FFFFFF'
      text:      '#212121'
      text_dim:  '#616161'
      border:    '#E0E0E0'
      red_flag_bg: '#FFEBEE'
    font:
      sans:      'Tajawal, Inter, system-ui'
      mono:      'Cascadia Code, monospace'
    spacing:
      1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 24px, 6: 32px, 8: 48px, 10: 64px
    radius:
      sm: 4px, md: 8px, lg: 16px, full: 9999px
    shadow:
      sm: '0 1px 2px rgba(0,0,0,0.05)'
      md: '0 4px 12px rgba(0,0,0,0.08)'
      lg: '0 8px 24px rgba(0,0,0,0.12)'
    motion:
      fast: 120ms, base: 200ms, slow: 320ms
      easing: cubic-bezier(0.2, 0.8, 0.2, 1)
```

---

## 3. Clinical Command Bar (Cmd+K)

Universal search + action bar across the app.

```tsx
// src/frontend/CommandBar.tsx
export function CommandBar() {
  // Cmd+K (Mac) / Ctrl+K (Win) opens bar
  // Queries:
  //   - patients (by MRN, name, phone)
  //   - encounters (open)
  //   - orders (place, view)
  //   - results (recent labs/imaging)
  //   - paths (care pathways)
  //   - notes (open, draft)
  //   - settings (theme, language)
  //   - shortcuts (jump to dept)
  // Result types: action | navigation | preview
}
```

**Backed by**: GET `/api/v1/search?q=...&limit=10`

**Keyboard nav**: ↑↓ to navigate, Enter to select, Esc to close.

**Localization**: ar/en; auto-detects.

---

## 4. Conversational UI for Clinicians

```tsx
// src/frontend/ConversationalPanel.tsx
// Right-side panel
// Shows AI-generated cards (Differential, Recommendations, Citations)
// User can: Accept | Reject (with reason) | Edit | Ask follow-up
// Voice input via SpeechRecognition (browser-native)
```

**Features**:
- Patient context injected on encounter
- Citation chips (clickable, opens source)
- Override reason required
- Multi-modal (text + voice + image)

---

## 5. Mobile Native (React Native + Expo)

```yaml
mobile_stack:
  framework: React Native (Expo)
  navigation: Expo Router
  state: Zustand + TanStack Query
  offline: SQLite + sync queue (mmkv)
  auth: same OAuth2 + SMART on FHIR
  themes: same STITCH v2 tokens
  push: FCM (Android) + APNs (iOS)
```

**Screens (initial)**:
- Login + MFA
- Schedule + Roster
- Patient list (my patients)
- Patient chart (mobile-optimized)
- Inbox (tasks)
- Notes (scribe mode)
- Order entry
- Results (lab/imaging)
- Telehealth (WebRTC)

Same UX as web with phone-native gestures.

---

## 6. Critical UX Patterns

### 6.1 Patient Chart (provider view)

```
┌─ Header: patient name, MRN, age/sex, allergies ⚠, weight, BMI
├─ Tabs: Summary | History | Notes | Orders | Results | Imaging | Meds | Care Plan
├─ Right rail (collapsible): AI Insights (DAX-style cards)
└─ Bottom action bar: New Order | New Note | Scribe | Telehealth | Discharge
```

### 6.2 Order Entry (provider view)

```
Quick orders (one-tap from order set)
Search by code or name
Dose calculator (built-in, weight-based for peds)
Allergy check (auto)
Interaction check (auto)
SFDA registry badge
Dose override (requires reason)
```

### 6.3 ER Triage View

```
ESI level (color-coded)
Vitals trend (last 4h)
Chief complaint
Red flag alerts (prominent)
Active orders
Result timeline
```

### 6.4 ICU Cockpit

```
Bed grid (each = patient card)
Per patient: NEWS2 score, SOFA trend, vent settings, drips
Action: hover → quick actions
```

---

## 7. Accessibility (WCAG 2.2 AA)

- Keyboard nav everywhere
- Focus rings visible
- Color contrast ≥ 4.5:1 (AA), 7:1 (AAA on critical text)
- Screen reader labels (aria-*)
- Captions on video training
- Reduced motion honored
- Form errors announced

**Testing**: axe-core + Pa11y in CI

---

## 8. i18n

```yaml
i18n:
  primary: ar-SA
  secondary: en-US
  framework: i18next + react-i18next
  rtl: yes
  fallback: en
  namespaces: per page
  pseudo-locale: qqq
  pluralization: arabic + english rules
  dates: dayjs + locale-aware
  numbers: ICU NumberFormatter
  medical_units: SFDA format
```

Key files: `.ai-brain/99-upgrade/27-i18n/ar-SA.json`, `en-US.json`

---

## 9. Files

```
namaweb/public/
├── index.html
├── login.html
├── admin.html
├── css/
│   ├── tokens.css
│   ├── components.css
│   └── themes.css
├── js/
│   ├── app.js
│   ├── command-bar.js
│   ├── conversational-panel.js
│   ├── theme.js
│   ├── i18n.js
│   └── stations/*.js        # 28 Stitch stations
└── mobile/                  # RN app
```

---

## 10. Tests

- Visual regression (Playwright)
- Accessibility (axe-core)
- Cross-browser (Chrome, Safari, Firefox, Edge)
- RTL/LTR switching
- Mobile (iOS Safari, Android Chrome)
- Performance (LCP, CLS, FID)

---

*Owner: PM — version 1.0 — 2026-08-01*
