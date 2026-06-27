# Skill: Stitch HTML to React/Next.js Conversion

Use this skill when converting `code.html` from Stitch into application components.

Never:
- Do not paste `code.html` as one giant component.
- Do not keep `<html>`, `<head>`, or `<body>` inside React components.
- Do not use Tailwind CDN in production.
- Do not duplicate the same classes across every page when a reusable component is better.
- Do not break existing routes, API calls, authentication, Prisma, or business logic.

Always:
- Convert `class` to `className`.
- Convert `for` to `htmlFor`.
- Convert inline styles to valid React style objects only when necessary.
- Replace static Stitch data with existing API data when the route already has data.
- Use mock data only for widgets that have no backend; add `TODO: connect to backend data`.
- Extract repeated structures into shared components.

Recommended component extraction:
- `AppShell`
- `PremiumSidebar`
- `PremiumTopbar`
- `PageHeader`
- `PremiumCard`
- `GlassCard`
- `MetricCard`
- `StatusChip`
- `PremiumButton`
- `PremiumInput`
- `PremiumTable`
- `DashboardSection`
- `EmptyState`
- `LoadingSkeleton`

Icon handling:
- Prefer existing project icon library.
- If Stitch uses Material Symbols, load it once globally only, not per component.

Accessibility:
- Buttons must have visible text or aria labels.
- Inputs must have labels.
- Decorative icons should be aria-hidden.
- Ensure contrast remains readable.
- Keep focus states.

Output quality:
- Clean TSX.
- No unnecessary dependencies.
- No unused imports.
- No TypeScript errors.
- Responsive and RTL-safe.
