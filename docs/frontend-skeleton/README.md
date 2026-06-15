# Frontend Skeleton — React 19 + Vite + TS

> Drop-in template for the NamaMedical web portal. Bilingual RTL/LTR.

## Stack
- React 19 + Vite + TypeScript (strict)
- React Router v6 (lazy routes)
- TanStack Query (server cache)
- Zustand (auth + app state, persisted)
- i18next (AR/EN with RTL toggling)
- TailwindCSS (theme bound to `docs/design-system/tokens.json`)
- Axios (with auth + idempotency interceptors)

## Layout
```
src/
├── main.tsx                # bootstrap, providers
├── App.tsx                 # routes
├── index.css               # tailwind + base + components
├── lib/
│   ├── api.ts              # axios + interceptors
│   └── i18n.ts             # i18next setup with RTL switching
├── stores/
│   └── auth.ts             # Zustand persisted store
├── hooks/
│   └── useCardio.ts        # TanStack Query hooks for cardio
├── components/
│   ├── AppShell.tsx        # sidebar + header + outlet
│   ├── ProtectedRoute.tsx
│   ├── PatientHeader.tsx
│   ├── OrderSheet.tsx
│   ├── AINotePad.tsx
│   └── LangToggle.tsx
└── pages/                  # lazy-loaded routes (Dashboard, Patients, Cardio, ED, Settings, Login)
```

## Conventions
- Every screen has `t('...')` keys; never raw strings.
- All user-mutating actions show success/danger toast and use Idempotency-Key.
- Safety-critical confirms (STAT/EMERGENT, anticoag init, chemo) use `<ConfirmDialog>`.
- AI outputs always render the **advisory only** badge.
- Screens prefer composition of small components over monolithic pages.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Test
```bash
npm test          # vitest
npm run test:e2e  # playwright
```
