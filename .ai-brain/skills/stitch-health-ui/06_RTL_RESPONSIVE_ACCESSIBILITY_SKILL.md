# Skill: RTL, Responsive, and Accessibility QA

The interface is Arabic RTL-first.

RTL requirements:
- Set `dir="rtl"` at the appropriate layout/root level.
- Sidebar should appear on the right for Arabic UI.
- Text alignment should be logical for Arabic.
- Mixed Arabic/English healthcare terms should not break layout.
- Numeric KPI cards should remain readable.
- Tables may scroll horizontally on small screens only when necessary.

Responsive requirements:
- Mobile: no clipped cards, no fixed-width overflow.
- Tablet: dashboard cards wrap cleanly.
- Desktop: 1440px dashboard should look premium and balanced.
- Avoid hardcoded heights that break dynamic content.

Accessibility requirements:
- Semantic headings.
- Buttons have labels.
- Inputs have labels.
- Keyboard focus visible.
- Contrast readable.
- Loading/empty states available for data sections.

QA checklist:
- Homepage loads.
- Dashboard loads.
- Sidebar/topbar usable.
- Tables readable.
- Cards responsive.
- No unintended horizontal scroll on page shell.
- No broken fonts/icons.
