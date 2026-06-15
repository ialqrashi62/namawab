# Skill: Health Excellence Design Tokens

Use these tokens as the canonical design source unless `748/health_excellence_global/DESIGN.md` says otherwise.

Brand:
- Premium Saudi healthcare enterprise UI.
- Reliable, advanced, compliant.
- RTL-first Arabic interface.
- Corporate modern with subtle glassmorphism.

Colors:
- Primary / Deep Navy: `#001629`
- Primary Container: `#002b49`
- Secondary / Medical Teal: `#006970`
- Secondary Container: `#7af1fc`
- Tertiary / Gold: `#ac8c44` or tokenized tertiary container variants
- Background: `#f8f9fa`
- Surface Lowest: `#ffffff`
- Surface Low: `#f3f4f5`
- Surface: `#edeeef`
- Surface High: `#e7e8e9`
- Text / On Surface: `#191c1d`
- Text Muted / On Surface Variant: `#42474d`
- Outline: `#73777e`
- Outline Variant: `#c3c7ce`
- Error: `#ba1a1a`

Typography:
- Arabic font: IBM Plex Sans Arabic if available.
- Avoid loading font repeatedly per component.
- Configure globally through Next.js font, global CSS, or existing font system.

Type scale:
- Display large: 48px / 60px / 700
- Mobile display: 32px / 40px / 700
- Headline large: 32px / 40px / 600
- Headline medium: 24px / 32px / 600
- Title large: 20px / 28px / 500
- Body large: 18px / 28px / 400
- Body medium: 16px / 24px / 400
- Label medium: 14px / 20px / 500
- Caption: 12px / 16px / 400

Radius:
- sm: 0.25rem
- default: 0.5rem
- md: 0.75rem
- lg: 1rem
- xl: 1.5rem
- full: 9999px

Spacing:
- base: 8px
- xs: 4px
- sm: 12px
- md: 24px
- lg: 40px
- xl: 64px
- mobile margin: 16px
- desktop margin: 48px

Implementation rule:
Move shared tokens to Tailwind config, CSS variables, and reusable components. Do not duplicate token values inside every page.
