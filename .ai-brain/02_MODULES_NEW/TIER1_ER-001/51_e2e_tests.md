# ER-001 — E2E Tests (Playwright)

```ts
// tests/e2e/er_001/happy-path.spec.ts
import { test, expect } from '@playwright/test';

test('ER-001: end-to-end encounter', async ({ page }) => {
  await page.goto('https://staging.jumanasoft.com');
  await page.fill('input[name=email]', 'doctor@test');
  await page.fill('input[name=password]', 'PW');
  await page.click('button:has-text("Login")');
  await page.fill('input[name=mrn]', 'PULM-TEST-001');
  await page.click('button:has-text("Open Chart")');
  await page.click('button:has-text("New Assessment")');
  await expect(page.locator('[data-test=ai-copilot]')).toBeVisible();
  await page.click('button:has-text("Accept")');
  await page.click('button:has-text("Place Orders")');
  await expect(page.locator('[data-test=orders-placed]')).toBeVisible();
});
```

---

*Owner: SA+QA — 2026-08-01*
