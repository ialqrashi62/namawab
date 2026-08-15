# P0-1 Patient Portal — BPMN Workflow

## Phase 1: First-Time User Onboarding
```
[App Install]
       ↓
[Nafath SSO Login]
       ↓
[PDPL Consent Display]
       ↓
[Accept + Sign Consent]
       ↓
[Profile Completion]
       ↓
[Insurance Card Capture (OCR)]
       ↓
[Emergency Contact]
       ↓
[Caregiver Setup (optional)]
       ↓
[Dashboard Ready]
```

## Phase 2: Appointment Booking
```
[User taps Book]
       ↓
[Specialty Selection]
       ↓
[Date + Time Selection]
       ↓
[Wateen Insurance Check]
       ├─ Approved: Display copay + confirm
       └─ Not Approved: Display full cost + confirm
       ↓
[Mawid Pre-Auth]
       ↓
[Confirmation + Appointment ID]
       ↓
[Push + Email Notification]
```

## Phase 3: Telehealth Visit
```
[15 min before: Push notification with URL]
       ↓
[Patient opens video room]
       ↓
[Pre-visit form (chief complaint)]
       ↓
[Provider joins]
       ↓
[Video visit (WebRTC)]
       ↓
[Provider documents in EMR]
       ↓
[Visit summary emailed]
       ↓
[Prescription sent to pharmacy]
       ↓
[Lab orders (if any)]
```

## Phase 4: Lab Results Review
```
[Lab completes test]
       ↓
[Results posted to EMR]
       ↓
[Is critical?]
       ├─ Yes: Provider contacted by system (page within 1 hour)
       └─ No: Queue for 24-hour disclosure
       ↓
[Provider review]
       ↓
[Patient notification (push + email)]
       ↓
[Patient opens results]
       ↓
[AI explains in plain language]
       ↓
[If abnormal: "Consult your doctor" CTA]
       ↓
[Audit log entry]
```

## Phase 5: Refill Request
```
[User taps Refill]
       ↓
[Validate prescription]
       ├─ No refills remaining: BLOCK
       └─ Controlled substance: BLOCK + in-person required
       ↓
[Pharmacy receives request]
       ↓
[Pharmacist reviews]
       ↓
[Approval / Rejection]
       ↓
[Patient notified]
       ↓
[If approved: Pickup or delivery]
```

## Phase 6: Vital Tracking
```
[Self-reported vital entered]
       ↓
[Range validation]
       ├─ Normal: Save + "All good"
       ├─ Moderate abnormal: Save + reminder to consult
       └─ Severe abnormal: Save + PROVIDER ALERT (SMS + push)
       ↓
[Trend chart updated]
       ↓
[Weekly summary email]
```

## Phase 7: Bill Payment
```
[User taps Pay Bill]
       ↓
[Display balance + insurance status]
       ↓
[Amount > 500 SAR?]
       ├─ Yes: 2FA (OTP)
       └─ No: Direct payment
       ↓
[Payment method selection]
       ↓
[SADAD/MADA processing]
       ↓
[Receipt + confirmation email]
```

## Phase 8: Caregiver Proxy Management
```
[User taps Add Caregiver]
       ↓
[Caregiver Nafath/Absher verification]
       ↓
[Relationship selection]
       ↓
[PDPL consent generation]
       ↓
[Both sign (e-signature)]
       ↓
[Set expiration date]
       ↓
[Caregiver active]
       ↓
[Caregiver can now access]
       ↓
[Audit log entry]
```

## Actors (Swim Lanes)

| Lane | Actor | Responsibility |
|---|---|---|
| Patient | Self | Self-service |
| Nafath SSO | External | Identity verification |
| Mawid | External | Appointment booking |
| Wateen | External | Insurance verification |
| Sehhaty | External | National health record |
| SFDA | External | Pharmacy regulation |
| Provider | Doctor | Care delivery |
| Pharmacist | RPh | Medication dispensing |
| Caregiver | Family | Proxy access |
| AI Assistant | Bot | Symptom triage, lab explanation |
