# P0-1 Patient Portal — Workflow Orchestration

## Phase 1: Identity Verification
- **Trigger**: App launch
- **Actions**: Nafath/Absher authentication → biometric verification
- **SLA**: Within 30 seconds
- **Tools**: Nafath SSO, Absher integration, Biometric API

## Phase 2: PDPL Consent
- **Trigger**: First-time login
- **Actions**: Display bilingual consent form → capture signed acknowledgment
- **SLA**: Required before any data access
- **Tools**: Consent manager, digital signature

## Phase 3: Onboarding Wizard
- **Trigger**: First-time login post-consent
- **Actions**: Profile completion → Emergency contact → Insurance card → Caregiver setup
- **SLA**: 5 minutes
- **Tools**: Form validation, OCR for insurance card

## Phase 4: Dashboard Render
- **Trigger**: Login success
- **Actions**: Show upcoming appointments, lab results, medications, vitals
- **SLA**: < 2 seconds
- **Tools**: Aggregated FHIR queries

## Phase 5: Appointment Booking
- **Trigger**: User taps "Book Appointment"
- **Actions**: Specialty select → Slot search → Insurance verify → Confirm
- **SLA**: 60 seconds end-to-end
- **Tools**: Mawid integration, Wateen insurance check

## Phase 6: Telehealth Visit
- **Trigger**: Appointment confirmed + video modality
- **Actions**: Pre-visit form → Video room join → In-call chat → Post-visit summary
- **SLA**: Join within 30 seconds of scheduled time
- **Tools**: WebRTC (Twilio/Agora), Sehhaty integration

## Phase 7: Lab Results Review
- **Trigger**: New result available
- **Actions**: Notification → Display with critical alert (if applicable) → Provider verification
- **SLA**: Critical = immediate, normal = within 24 hours
- **Tools**: Push notifications, PDPL compliance gate

## Phase 8: Refill Request
- **Trigger**: User taps "Request Refill"
- **Actions**: Validate refills_remaining → Check controlled status → Forward to pharmacy
- **SLA**: Confirmation within 4 hours
- **Tools**: Pharmacy queue, controlled substance blocker

## Phase 9: Vital Tracking
- **Trigger**: Self-reported or device sync
- **Actions**: Validate range → Flag abnormal → Notify provider (if severe)
- **SLA**: Real-time
- **Tools**: Range normalizer, alert engine

## Phase 10: Bill Payment
- **Trigger**: User taps "Pay Bill"
- **Actions**: Display balance → Select payment method → 2FA confirm → Process via MADA
- **SLA**: Transaction within 10 seconds
- **Tools**: SADAD/MADA payment gateway, 2FA

## BPMN Diagram
See `26_business_flow.md`.

## Orchestration Engines
- **Identity Manager** — Nafath/Absher + biometric
- **Consent Manager** — PDPL rights (access, erasure, portability)
- **Appointment Engine** — Mawid + Sehhaty
- **Telehealth Engine** — WebRTC + bandwidth optimizer
- **Lab Results Engine** — Critical alert + verification gate
- **Pharmacy Engine** — Refill queue + controlled substance blocker
- **Vital Engine** — Range normalizer + alert
- **Billing Engine** — SADAD/MADA + insurance
- **Caregiver Engine** — Proxy + PDPL consent
- **Notification Engine** — Push + SMS + email
- **Audit Logger** — Hash-chained, 7+ years
