# UI Modal Fix — vGlobal.0.1

## المشكلة
جميع stations (30 ملف) فيها `alert('X Modal Triggered')` مع أو بدون API endpoint.
الصورة أظهرت: "MFM Modal Triggered" alert — بدلاً من modal حقيقي.

## الحل
1. Modal Framework موحد in `namaweb/public/js/modal.js`:
   - `Modal.open({title, body, primaryLabel, secondaryLabel, hidePrimary, danger, fields})`
   - `Modal.confirm(message)` — Promise-based
   - `Modal.toast(message, {type, durationMs})`
   - `Modal.close()`
   - Escape + focus trap + scroll lock + AR/EN + RTL
   - Z-index 10000 (فوق الـ sidebar)

2. استبدال 56 alert() بـ Modal.open عبر سكريبت batch:
   - 26 alert in 13 file (Wave 1)
   - 30 alert in 15 file (Wave 2)
   - 28 station files مع Modal.open total

3. uploaded to Hetzner + index.html updated to load modal.js

## Smoke
```
PASS: 95 / 95 (no regression)
```

## Results
| Item | Before | After |
|---|---|---|
| alert() calls | 56 | 0 |
| Modal.open calls | 0 | 56 |
| stations مع modals | 0 | 28/30 |
| بقاء الـ doctor/nursing modals اليدوية | 3 | 3 (متعمد - متقدمة) |

## Safety rails
- RAIL-12: Modal HTML escapes via escapeHTML.
- RAIL-11: Modal closes on Escape + outside click.
- RAIL-5: Modal aria-labelledby + aria-modal added.

## Closeout
جميع المتصفحات الحية على jumanasoft.com تستفيد من modal.js.
