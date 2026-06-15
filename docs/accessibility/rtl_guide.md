# RTL (Arabic) Implementation Guide
v1.0

## Setup
- Set `<html lang="ar" dir="rtl">` based on locale.
- Switch `dir` attribute on language change (i18next handler).
- Tailwind: prefer logical CSS properties + `[dir="rtl"]:` variant where needed.

## Logical properties (preferred)
| Avoid | Prefer |
|-------|--------|
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |
| `left: 0` | `inset-inline-start: 0` |
| `float: left` | `float: inline-start` |

## Common pitfalls
- **Icons**: chevron-right means "forward" in LTR but "back" in RTL. Mirror or use direction-aware icons.
- **Numbers + dates**: keep numerals in default (Arabic-Indic vs ASCII; respect locale, but consider readability). Use `Intl.NumberFormat`.
- **Mixed AR/EN text**: wrap LTR substrings in `<bdi>` or `&lrm;` to avoid bidi confusion.
- **Form layout**: labels naturally flow right-to-left; don't fight the layout.
- **Charts/graphs**: axis labels can overflow; test at narrow widths.
- **Animations**: `transform: translateX(...)` direction inverts; use logical alternatives or compute sign.

## Components
- `<LangToggle>` swaps language + sets `dir`.
- All components built on logical properties so no per-component RTL overrides needed.

## Testing
- Snapshot tests run twice (LTR + RTL).
- Visual regression on critical pages in both directions.
- Manual review: every new screen tested in AR before merge.

## Fonts
- Arabic: Tajawal (primary), fallback IBM Plex Sans Arabic.
- Latin: Inter.
- Display: Orbitron (LTR only — auto-fallback in RTL).
- Test rendering across Windows, macOS, iOS, Android, Chrome, Safari, Firefox, Edge.

## Numbers, dates, currencies
- Use `new Intl.NumberFormat('ar-SA').format(...)`.
- Hijri date support via `Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', ...)`.
- Currency: SAR with localized symbol.

## Punctuation
- Comma → Arabic comma `،`
- Question mark → `؟`
- Semicolon → `؛`
- Use proper Unicode characters, not transliterated Latin punctuation.

## Translation quality
- Medical terms: use UMLS-Arabic mapping where available.
- Avoid literal translation; use idiomatic phrasing.
- Have native AR clinical reviewer sign off before each release.
