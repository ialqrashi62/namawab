---
id: DIGITAL-ASSETS
version: 1.0
date: 2026-08-01
owner: PM
status: ACTIVE
---

# Digital Assets — Patient Portal (MyNama) + Provider Mobile + Telehealth + Engagement

> **Purpose:** Patient-facing + provider-facing digital surfaces, with same compliance/security as the main app.

---

## 1. Global systems comparison

| System | Patient + Provider surfaces |
|--------|----------------------------|
| **Epic MyChart** | Patient portal: appointments, labs, messages, refills, telehealth, billing |
| **Cerner HealtheLife / Patient Portal** | Same + integration with Apple Health / Google Fit |
| **athenaCommunicator** | Patient comms, scheduling, intake |
| **MEDITECH Patient Portal** | Touch-first, mobile-friendly |
| **Phreesia** | Pre-visit + registration |
| **Klara / WELL** | Patient messaging |
| **Microsoft Teams for Clinical** | Embedded in Teams |
| **NamaMedical** | **MyNama portal + Provider Mobile + Telehealth + WhatsApp bridge** |

---

## 2. MyNama (Patient Portal)

Web (responsive) + Mobile (RN, shared codebase).

### 2.1 Features

- **Appointments**: schedule, reschedule, cancel; check-in; telehealth join
- **Results**: lab + imaging; explain in plain language; trend charts
- **Medications**: refills request; adherence reminders; interactions view
- **Messages**: secure messaging with care team (not email — HIPAA-safe)
- **Visits summary**: post-visit read; download PDF; share with family
- **Care plan**: goals + interventions; progress
- **Vitals**: home BP, glucose, weight sync (Apple Health, Google Fit)
- **Billing**: pay invoice, history, installment
- **Insurance**: card + coverage view
- **Consent**: digital consent (sign, audit trail)
- **Profile**: demographics, contacts, language
- **Notifications**: SMS, WhatsApp, push, email

### 2.2 Arabic + English native

RTL layout for AR. Full localization.

### 2.3 Security

- **2FA** mandatory (SMS + TOTP options)
- **OAuth2 + SMART on FHIR** (patient scope only)
- **PDPL consent** per data view/export
- **Right to export** (Patient Bundle JSON + PDF)
- **Right to delete** (with regulatory exceptions)
- **Session timeout** 10 min idle

### 2.4 Architecture

```
mynama/                       # separate app, same auth
├── public/
│   ├── index.html
│   ├── js/
│   └── css/
├── server/
│   ├── routes/
│   ├── services/
│   └── middleware/
├── mobile/                   # RN
└── docs/
```

**Reuses**: auth (OAuth2 server), FHIR APIs, design tokens (STITCH v2).

---

## 3. Provider Mobile App (Expo / React Native)

### 3.1 Features

- **Schedule** (today, week)
- **My patients** (inpatient, outpatient, ER, ICU)
- **Inbox** (results to review, messages, tasks)
- **Notes** (scribe mode — voice-to-text)
- **Orders** (place, view, discontinue)
- **Results** (review, sign)
- **Telehealth** (one-tap join)
- **Calls** (on-call paging)
- **Provider profile** (license, NPHIES ID, etc.)

### 3.2 Scribe Mode (DAX-like)

- Background audio capture (with consent)
- Whisper-large-v3 → transcript (AR + EN)
- Summarize into SOAP note (specialty-tuned)
- Provider edits + signs
- Push to EHR (signed + locked)

### 3.3 Push notifications

- Stat alerts (results ready, red flag, page)
- Task reminders
- Schedule changes

---

## 4. Telehealth Integration

```yaml
stack:
  video: Daily.co (WebRTC)   # or alternative
  recording: optional per consent
  bandwidth: 250kbps min (video), 64kbps (audio)
  codec: VP9/Opus (browser-native)
  encryption: DTLS-SRTP
  accessibility: captioning (Whisper live), ASL on request
```

**Scheduling**: appointment → link → join → encounter auto-created.

**Cross-checks**: identity verification (KYC per PDPL), consent, location capture (jurisdiction).

**Bill**: encounter type `telehealth_<spec>`; insurance eligible per NPHIES.

---

## 5. Patient Engagement (WhatsApp + SMS + Email)

```yaml
channels:
  whatsapp_business:
    provider: Meta Cloud API
    use: appointment reminders, lab results notification, simple Q&A
    compliance: opt-in per PDPL; not for clinical content
  sms:
    provider: local KSA gateway
    use: OTP, reminders
  email:
    provider: sendgrid or aws-ses
    use: summaries, billing
  push:
    provider: FCM/APNs
    use: realtime alerts
consent:
  storage: patient_consents table
  versioned consent forms
  withdraw = suppress channel
```

---

## 6. Files (initial scope)

```
mynama/
├── public/index.html
├── public/js/main.js
├── server/app.js
├── server/routes/*.js
├── server/services/messaging.js
├── server/services/telehealth.js
├── design-tokens.css
└── mobile/ (RN shared)

telehealth/
├── server/daily-adapter.js
└── public/telehealth-room.html
```

---

## 7. Tests

- Auth flows (login, 2FA, forgot, reset)
- Patient scope isolation (cannot read other patient's data)
- Telehealth jitter, drop, reconnect
- Consent + revocation
- PDPL export request
- Right-to-delete cascade
- i18n parity (no string left in EN when AR expected)

---

*Owner: PM — version 1.0 — 2026-08-01*
