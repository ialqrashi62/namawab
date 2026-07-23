# NEPH-001 — E2E + Training + Design Tokens + Sub-Dept

## E2E
```js
const { test, expect } = require('@playwright/test');
test('Hyperkalemia → treatment activated', async ({ page }) => {
  await page.goto('https://jumanasoft.com/login');
  await page.fill('input[name=email]', 'doc@neph.test');
  await page.fill('input[name=password]', 'Test1234!');
  await page.click('button[type=submit]');
  await page.click('a[href="/neph"]');
  await page.click('button[data-test=new-lab]');
  await page.fill('input[name=potassium]', '7.0');
  await page.click('button[data-test=save-lab]');
  await expect(page.locator('[data-test=critical-alert]')).toBeVisible();
  await expect(page.locator('[data-test=ecg-order]')).toBeVisible();
});
```

## Training (10 min)
- Welcome (1)
- Board (1)
- eGFR (2)
- AKI (2)
- Dialysis (2)
- Transplant (1)
- Electrolyte (1)
- Wrap (1)

## Design Tokens
| Token | Hex | Use |
|---|---|---|
| `--neph-egfr-good` | #10B981 | G1-G2 |
| `--neph-egfr-mod` | #F59E0B | G3 |
| `--neph-egfr-sev` | #DC2626 | G4-G5 |
| `--neph-k-hyper` | #DC2626 | K >6.5 |

## Sub-Dept
1. NEPH-001-OPD
2. NEPH-001-IP
3. NEPH-001-HD
4. NEPH-001-PD
5. NEPH-001-TRANSPLANT
6. NEPH-001-GN
7. NEPH-001-PRE
