# Integration — Wasfaty (E-Prescription)

> KSA-MoH national e-prescription platform. All ambulatory prescriptions to community
> pharmacies dispensed via Wasfaty.

## Scope
- Outbound: prescription submission, refill request, cancellation.
- Inbound: dispense status, substitution events.

## Auth
- OAuth2 client_credentials issued by Wasfaty admin portal.
- mTLS between NamaMedical and Wasfaty edge.
- Signing key for prescription payload (Doctor's SCFHS-bound key).

## Base URL
- Sandbox: `https://wasfaty.moh.gov.sa/sandbox`
- Production: `https://wasfaty.moh.gov.sa`

## Endpoints
| Path | Method | Purpose |
|------|--------|---------|
| `/api/v1/prescriptions` | POST | submit new |
| `/api/v1/prescriptions/{id}` | GET | status |
| `/api/v1/prescriptions/{id}/cancel` | POST | cancel before dispense |
| `/api/v1/prescriptions/{id}/refill` | POST | refill request |
| `/api/v1/dispenses` (webhook) | POST→us | dispense notification |

## Payload (submit example)
```json
{
  "doctor": { "scfhs_id": "...", "name": "..." },
  "patient": { "national_id": "...", "name": "...", "phone": "+9665..." },
  "facility": { "moh_code": "..." },
  "prescription": {
    "id": "RX-20260513-0001",
    "issued_at": "2026-05-13T10:15:00+03:00",
    "diagnosis_icd10": ["E11.9"],
    "items": [
      { "medication_code": "rxnorm:861007",
        "name": "Metformin 500 mg tablet",
        "dose": "500 mg PO BID with meals",
        "duration_days": 30, "qty": 60, "refills": 3 }
    ]
  },
  "signature_b64": "...digital signature over the prescription block..."
}
```

## Mapping
| NamaMedical | Wasfaty |
|-------------|--------|
| `pharmacy_prescriptions_queue.id` | `prescription.id` |
| `system_users.scfhs_id` | `doctor.scfhs_id` |
| `patients.national_id` | `patient.national_id` |
| `medications.rxnorm` | `items[].medication_code` (rxnorm:* or moh:*) |

## Implementation
- Driver `wasfaty_client.py` with retry + idempotency on `prescription.id`.
- Webhook receiver `POST /api/v1/integrations/wasfaty/dispenses` updates local status.
- Local fallback queue if Wasfaty unreachable; re-submit when up.
- Auto-cancel expired (≥ 30 d unfilled) per MoH policy.

## Error handling
- Invalid SCFHS license → 403 → escalate to credentialing.
- Drug not in formulary → suggest alternative; surface to doctor.
- Patient unreachable → fallback to facility pharmacy print.

## Monitoring
- `wasfaty_submissions_total{status}`
- Alert: success rate < 98% → Sev2

## Compliance
- PDPL: prescription contains PHI; processed by Wasfaty as data processor under MoH.
- Controlled substances: extra signing + chain-of-custody per SFDA.
