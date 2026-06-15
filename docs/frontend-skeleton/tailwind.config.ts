import type { Config } from 'tailwindcss';
import tokens from '../docs/design-system/tokens.json' with { type: 'json' };

// Map W3C-DTCG tokens to Tailwind theme.
const colors = {
  brand: {
    primary: tokens.color.brand.primary.value,
    secondary: tokens.color.brand.secondary.value,
    accent: tokens.color.brand.accent.value,
  },
  success: tokens.color.semantic.success.value,
  warning: tokens.color.semantic.warning.value,
  danger:  tokens.color.semantic.danger.value,
  info:    tokens.color.semantic.info.value,
  muted:   tokens.color.semantic.muted.value,
  darkBase:    tokens.color.background.darkBase.value,
  darkSurface: tokens.color.background.darkSurface.value,
  darkRaised:  tokens.color.background.darkRaised.value,
  primaryDark:   tokens.color.text.primaryDark.value,
  secondaryDark: tokens.color.text.secondaryDark.value,
  mutedDark:     tokens.color.text.mutedDark.value,
};

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans:    ["Tajawal", "Inter", "sans-serif"],
        en:      ["Inter", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: tokens.radius.sm.value,
        md: tokens.radius.md.value,
        lg: tokens.radius.lg.value,
        xl: tokens.radius.xl.value,
      },
      boxShadow: {
        glow: tokens.elevation.glow.value,
      },
    },
  },
  plugins: [],
} satisfies Config;
