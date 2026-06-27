# Integration — Mawid + Sehhaty + Yaqeen

> Patient-facing MoH platforms: appointment booking, patient app, identity verification.

---

## Mawid (Appointment Booking)
- **Purpose**: bidirectional sync of appointment slots and bookings.
- **Auth**: OAuth2 + facility scope.
- **Direction**: NamaMedical publishes available slots; Mawid books patients into them.

### Endpoints
| Path | Method | Purpose |
|------|--------|---------|
| `/v1/clinics/{id}/slots` | PUT | publish/refresh slots |
| `/v1/appointments` (webhook) | POST→us | new booking |
| `/v1/appointments/{id}/cancel` | POST | cancel |
| `/v1/appointments/{id}/checkin` | POST→us | check-in event |

### Payload (slots PUT)
```json
{
  "clinic_id": "NM-CARDIO-001",
  "slots": [
    { "starts_at": "2026-05-14T08:00:00+03:00", "duration_min": 15, "available": true },
    { "starts_at": "2026-05-14T08:15:00+03:00", "duration_min": 15, "available": true }
  ]
}
```

### Mapping
| NamaMedical | Mawid |
|-------------|-------|
| `online_bookings.id` | `appointment.external_id` |
| Doctor `scfhs_id` | `clinic.provider` |
| Specialty | mapped via lookup table |

---

## Sehhaty (Patient App)
- **Purpose**: deliver medical info, results, bookings, vaccines, virtual care to patients.
- **Auth**: per-citizen OAuth via Absher; NamaMedical writes per consent token.

### Use cases we push
- Lab/Rad results when finalized.
- Discharge summary in AR/EN.
- Upcoming appointments.
- Medication list.
- Vaccination card updates.

### Endpoints
| Path | Method | Purpose |
|------|--------|---------|
| `/v1/citizens/{nin}/results` | POST | publish result |
| `/v1/citizens/{nin}/discharge` | POST | publish discharge summary |
| `/v1/citizens/{nin}/medications` | PUT | reconcile med list |

### Consent
- Patient must accept Sehhaty TOS for data delivery; we read consent on first share attempt.
- Suspended sharing if patient withdraws.

---

## Yaqeen (Identity Verification)
- **Purpose**: verify patient identity (NIN + biometric/OTP) for sensitive operations
  (consent signing, controlled meds dispense, account creation).

### Endpoints
| Path | Method | Purpose |
|------|--------|---------|
| `/v1/identity/verify` | POST | NIN + DOB + OTP/biometric |
| `/v1/identity/match` | POST | name vs NIN match |

### Use cases
- Consent E-signature
- Controlled substance dispense
- Pharmacy proxy dispense check
- Account creation in patient portal

### Implementation
- All Yaqeen calls audited.
- Cache verification result for the visit only (do not persist NIN unmasked).
- If Yaqeen unavailable → manual ID check fallback with documented reason.

---

## Common
- mTLS + OAuth2 across all three.
- Rate limits per facility; respect `Retry-After`.
- KSA region only.
- Logs retained 10 y.
