# Mobile Apps — Product Specification
v1.0 — Owner: Mobile Lead

> Two distinct apps: **NamaMedical Clinical** (for staff) and **NamaMedical Patient**
> (for patients). Each with its own publication, MDM policy, and lifecycle.

---

## 1) NamaMedical Clinical (staff)

### Audience
Doctors, nurses, on-call consultants, allied health.

### Top journeys
1. Triage capture at bedside (vitals, photos, ECG snap).
2. Quick patient lookup + summary.
3. Inbox: pages, AI alerts, results to review, sign-offs needed.
4. SBAR handover compose.
5. Order placement (subset of full ERP) with CDS gates.
6. Approve/decline AI suggestions.
7. View consent status + collect e-signature.
8. ED/ICU code activation buttons.

### Platform
- React Native (iOS + Android) + share business logic with web.
- Offline-first for triage capture + obs (sync on reconnect).
- Biometric unlock + auto-logout 2 min.
- MDM enrollment required (Intune/Jamf/Workspace ONE).

### Security
- App-wide screenshot block on PHI screens (Android FLAG_SECURE; iOS overlay).
- Local encryption for offline cache (Keychain/Keystore-backed).
- Cert pinning to NamaMedical edge.
- No PHI in push body; encrypted payload fetched after tap.
- Remote wipe via MDM on lost/stolen.

### Performance
- Cold start ≤ 2 s.
- Patient lookup ≤ 500 ms.
- Photo upload chunked + resume.

### Compliance
- PDPL data minimization.
- Audit log for every read/write.
- AI advisory banner consistent with web.

---

## 2) NamaMedical Patient

### Audience
Adult patients + guardians.

### Top journeys
- Same as Patient Portal §"Top 10 user journeys" but mobile-optimized.

### Platform
- React Native (iOS + Android).
- Biometric login after first sign-in.
- Push notifications for appointments, results, refills, bills (no PHI in body).

### Distinguishing features
- Apple Health / Health Connect integration (steps, HR, sleep) → opt-in upload.
- Wearable BP/glucose pairing for chronic patients (Bluetooth LE).
- Digital wallet: insurance card + appointment QR + invoice QR.
- Offline access to medications + vaccination card + discharge.

### Security
- No PHI in notification body.
- Auto-logout 5 min.
- Screenshot blocking on sensitive screens (settings opt-in).
- Biometric or PIN, never just SMS-OTP for ongoing access.

### Accessibility
- WCAG 2.2 AA, voiceover/talkback supported.
- Dynamic type, high-contrast theme.
- Arabic RTL with per-screen verification.

### Distribution
- Apple App Store + Google Play.
- Saudi-first launch with full AR.
- Beta via TestFlight + Play Internal.

### Phases
- v1: Auth, Appointments, Results, Vaccinations
- v2: Bills, Refills, Discharge docs
- v3: Telemedicine, Wearables, Symptom checker

## Cross-app
- Shared design system (`docs/design-system/tokens.json`).
- Shared API client (`docs/sdk/typescript/example.ts` style).
- Shared i18n keys.
- Shared crash reporting (Sentry; PHI scrubbed).
- Shared analytics (privacy-respecting; no PHI).
