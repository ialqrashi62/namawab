---
name: Health Excellence Global
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#42474d'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#73777e'
  outline-variant: '#c3c7ce'
  surface-tint: '#406182'
  primary: '#001629'
  on-primary: '#ffffff'
  primary-container: '#002b49'
  on-primary-container: '#7293b6'
  inverse-primary: '#a8caef'
  secondary: '#006970'
  on-secondary: '#ffffff'
  secondary-container: '#7af1fc'
  on-secondary-container: '#006e75'
  tertiary: '#1d1300'
  on-tertiary: '#ffffff'
  tertiary-container: '#362700'
  on-tertiary-container: '#ac8c44'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#a8caef'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#274969'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#5dd8e2'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffdf9d'
  tertiary-fixed-dim: '#e6c274'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system establishes a high-trust, premium healthcare environment that bridges international medical standards with Saudi Arabian cultural excellence. The brand personality is **Reliable, Advanced, and Compliant**, targeting high-stakes healthcare stakeholders, practitioners, and patients who expect a global tier of service.

The design style is **Corporate Modern with Glassmorphism**. It utilizes high whitespace to ensure "breathing room," facilitating clarity in complex medical data environments. The aesthetic is clean and professional, using translucent layers and subtle blurs to create a sense of depth and modern sophistication without sacrificing the grounded authority required for enterprise healthcare.

## Colors

The palette is rooted in medical stability and Saudi prestige. 
- **Primary (Deep Navy):** Used for navigation, headers, and primary actions to evoke authority and trust.
- **Secondary (Medical Teal):** Used for interactive elements, status indicators, and healthcare-specific callouts.
- **Tertiary (Gold):** Applied sparingly for premium membership tiers, "Excellence" badges, or subtle border accents to provide a sense of luxury.
- **Accent (Sand):** A soft, warm neutral used for secondary backgrounds or subtle divider tints to ground the clinical whites.
- **System States:** Success is Teal; Error is a muted Crimson; Info is Primary Navy.

## Typography

The typography system uses **IBM Plex Sans** (with its Arabic counterpart) to ensure seamless bi-directional support. The typeface is systematic, technical, and highly legible, making it ideal for medical records and enterprise dashboards.

- **Hierarchy:** High contrast between display sizes and body text to guide the eye through dense information.
- **Alignment:** Primary alignment is Right-to-Left (RTL) for Arabic contexts, with Latin text interleaved naturally. 
- **Weights:** Use Bold/SemiBold for headers and Medium for interactive labels. Regular weight is reserved for long-form reading and clinical notes.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for desktop to maintain an "editorial" feel, transitioning to a fluid model for mobile.

- **Grid:** 12-column grid for desktop (max-width 1440px) with 24px gutters.
- **Rhythm:** An 8px linear scale drives all padding and margins, ensuring vertical rhythm across clinical dashboards.
- **RTL primary:** The interface is designed from right to left. Sidebar navigation is typically positioned on the right in the Arabic locale.
- **Breathing Room:** Content blocks are separated by significant 'lg' (40px) or 'xl' (64px) vertical spacing to reduce cognitive load in medical contexts.

## Elevation & Depth

This design system uses a combination of **Glassmorphism** and **Ambient Shadows** to communicate hierarchy.

- **Surface Layers:** The base layer is pure white (#FFFFFF). Elevated containers use a subtle 1px border in Sand (#E3D1B4) at 30% opacity.
- **Glass Effects:** Overlays, modals, and dropdown menus utilize a backdrop-filter (blur: 12px) with a semi-transparent white fill (80% opacity) to maintain context of the underlying data.
- **Shadows:** Use extra-diffused, low-opacity shadows (e.g., `0px 10px 30px rgba(0, 43, 73, 0.05)`) to lift cards off the background without creating "visual noise." Shadows are tinted with the Primary Navy color rather than pure black.

## Shapes

The shape language is defined by **Rounded (0.5rem / 8px - 16px)** corners. This softens the clinical nature of the platform, making it feel more approachable and modern.

- **Standard Elements:** Buttons and input fields use an 8px radius.
- **Containers:** Content cards and feature blocks use a 16px (rounded-lg) radius.
- **Specialty:** Progress bars and status tags utilize a 32px (pill) radius for a distinct, softer look.

## Components

- **Buttons:** Primary buttons are Solid Navy with white text. Secondary buttons are Teal outlines. High-premium actions can feature a subtle Gold gradient border.
- **Input Fields:** Use a subtle Sand tint for the background (#F8F9FA) with an 8px radius. On focus, the border transitions to Teal.
- **Glass Cards:** High-level dashboard summaries use the glassmorphic style with a 16px radius and a soft Navy shadow.
- **Chips & Tags:** Use Teal for medical status (Active, Healthy) and Gold for premium statuses (VIP, Specialist). Tags are always pill-shaped.
- **Lists:** Data tables and lists use "breathing" rows with 16px vertical padding and subtle Teal dividers (10% opacity).
- **Navigation:** Vertical navigation rail on the right side (RTL) using Navy for active states and high-contrast icons.