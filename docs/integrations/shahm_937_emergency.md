# Integration — Shahm + MoH 937 (Emergency)

> Saudi MoH ambulance dispatch (Shahm) and the 937 medical hotline.

## Shahm
- **Purpose**: ambulance dispatch + arrival ETA + handover record exchange.
- **Direction**:
  - Inbound: incoming ambulance manifest with patient brief, vitals, arrival ETA.
  - Outbound: ED bed availability, ED diversion status (e.g., MCI mode).

### Inbound payload (incoming ambulance)
```json
{
  "case_id": "SHM-2026-...",
  "patient_brief": { "age": 72, "sex": "M", "complaint": "chest pain", "vitals": {...} },
  "etas": { "arrival_estimate": "2026-05-13T22:40:00+03:00" },
  "from_unit": "AMB-RUH-104",
  "trauma_level_suspected": null
}
```

### Outbound payload (status push)
```json
{
  "facility": "NMA-NNCH",
  "ed_bed_available": 7,
  "icu_bed_available": 1,
  "trauma_diversion": false,
  "stroke_capable": true,
  "stemi_capable": true
}
```

### Implementation
- Push every 60 s OR on event (bed change, MCI declared).
- On inbound: pre-create ED visit (provisional MRN), notify charge nurse + ED MD.
- Auto-link upon physical arrival (badge scan / case_id).

## 937 (medical hotline)
- **Purpose**: operator-mediated triage and referral.
- **Inbound to NamaMedical**: scheduled OPD slot via Mawid (most cases) OR
  direct ED visit booking for urgent triage.
- **Outbound**: appointment confirmation → 937 status board.

## Auth
- mTLS + facility token.

## Compliance
- All inbound PHI logged with consent assumed under emergency exception.
- Audit retention 10 y.
