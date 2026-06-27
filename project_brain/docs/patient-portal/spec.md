# Patient Portal — Product Specification
v1.0 — Owner: Patient Experience + Frontend Lead

## Personas
- **Adult patient** (primary user, KSA national/resident)
- **Guardian** (managing minor or elderly dependent)
- **Caregiver** (limited delegated access)

## Top 10 user journeys
1. Sign up & verify identity (Yaqeen).
2. Book / reschedule / cancel appointment (sync with Mawid).
3. View upcoming + past appointments.
4. View lab + imaging results with plain-language explanations.
5. View + download discharge summary.
6. View + request refill of medications (via Wasfaty).
7. View + pay bills (ZATCA-compliant invoice + multiple gateways).
8. View vaccination card + due reminders.
9. Submit a complaint or feedback.
10. Manage privacy: access log, consents, AI opt-out.

## Information architecture
```
Home (next appt, latest results, alerts)
├── Appointments
│   ├── Upcoming
│   ├── Past
│   └── Book new
├── Medical Record
│   ├── Visits
│   ├── Results (labs, imaging)
│   ├── Medications (current + history)
│   ├── Allergies + Problems
│   └── Documents (discharges, certificates)
├── Bills
├── Vaccinations
├── Family (linked accounts)
├── Messages (secure inbox with care team)
├── My Rights
│   ├── Access Log
│   ├── Consents
│   ├── AI preferences
│   └── Submit complaint / data request
└── Settings (lang, notifications, biometric login)
```

## Functional requirements
- Bilingual AR/EN with RTL.
- Identity via Yaqeen; biometric/PIN login after first sign-in.
- Push notifications for appointments, results, refills, bill due.
- Result plain-language explainer (where guideline-based explanations exist).
- Discharge summary AR + EN download.
- Complaint with SLA tracker visible.
- Access log shows who/when accessed any record entry.
- Consent management: granular per data type + withdrawal.
- AI opt-out toggle (recorded in record).

## Non-functional
- WCAG 2.2 AA accessibility.
- Offline-friendly cache for read-only screens.
- p95 page load ≤ 2 s on 4G.
- Crash-free sessions ≥ 99.5%.
- KSA data residency.

## Privacy & safety
- No PHI in push notification body.
- Auto-logout after 5 min inactivity.
- Screenshot blocking on sensitive screens (mobile).
- Children's accounts: extra guardian consent, restricted features.

## Integrations
- Yaqeen (identity)
- Mawid (appointments)
- Wasfaty (prescriptions + refill)
- Sehhaty (cross-publish results, optional)
- ZATCA (invoice display + payment QR)
- Payment gateway (mada / Apple Pay / STC Pay)

## KPIs
- 30-day active patients
- Appointment self-service rate
- Result-view latency (publish → first view)
- NPS
- Complaint resolution SLA
- Refill conversion

## Phases
- v1: Auth + Appointments + Results + Bills + Vaccinations
- v2: Refills + Messages + Family
- v3: Telemedicine + AI symptom checker (advisory) + Wearable integration
