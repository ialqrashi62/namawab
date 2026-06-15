# Accessibility Testing Kit
v1.0

## Tools
| Tool | Purpose | Where |
|------|---------|------|
| axe-core | Automated checks | unit + e2e CI |
| Lighthouse | Page audit | CI nightly |
| Pa11y | Headless audits | nightly |
| Wave (browser ext) | Manual exploration | dev workstation |
| NVDA | Screen reader (Windows) | manual QA |
| JAWS | Screen reader (Windows) | manual QA |
| VoiceOver | Screen reader (macOS/iOS) | manual QA |
| TalkBack | Screen reader (Android) | manual QA |
| color-contrast-analyzer | Contrast | manual checks |
| Polypane | Multi-viewport, RTL | manual |

## Vitest + axe sample
```ts
import { axe } from 'vitest-axe';
import { render } from '@testing-library/react';

test('PatientHeader has no a11y violations', async () => {
  const { container } = render(<PatientHeader patient={mockPatient}/>);
  expect(await axe(container)).toHaveNoViolations();
});
```

## Playwright + axe sample
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Cardio dashboard accessible', async ({ page }) => {
  await page.goto('/cardio');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

## Manual QA scripts (per release)
1. Tab through 5 random pages — focus visible, order logical, no traps.
2. Resize text to 200%; check overflow + functionality.
3. Toggle AR/EN; check layout doesn't break.
4. Use NVDA/VoiceOver on Cardio Dashboard, ED Triage, Patient Search.
5. Test with high-contrast OS theme.

## Definition of Done (a11y)
- Zero serious/critical violations in axe.
- Lighthouse a11y ≥ 95.
- Manual smoke test signed off.
- New widget? include AAA-aspirational where no extra cost.
