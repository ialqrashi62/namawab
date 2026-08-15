# P0-1 Patient Portal — Test Cases

## Unit Tests (24 cases)

### Identity Verification (3 cases)
- TC-001: Nafath OTP verified
- TC-002: Biometric L3 verified
- TC-003: Unverified (rejected)

### Appointment Booking (3 cases)
- TC-004: With insurance (free)
- TC-005: Without insurance (200 SAR)
- TC-006: Missing required field (rejected)

### Telehealth Eligibility (3 cases)
- TC-007: Routine follow-up eligible
- TC-008: Physical exam required (in-person)
- TC-009: Outside KSA (in-person)

### Lab Results (3 cases)
- TC-010: Normal result disclosed
- TC-011: Critical needs verification
- TC-012: Without consent (rejected)

### Refill (3 cases)
- TC-013: Refills available (eligible)
- TC-014: No refills remaining
- TC-015: Controlled substance (blocked)

### Caregiver (2 cases)
- TC-016: Spouse proxy granted
- TC-017: Invalid relationship (rejected)

### Vitals (2 cases)
- TC-018: Normal BP recorded
- TC-019: High BP flagged abnormal

### FHIR Export (2 cases)
- TC-020: All sections
- TC-021: Selected sections

### Insurance (1 case)
- TC-022: Copay calculated correctly

### Health Risk (1 case)
- TC-023: High risk elderly smoker

### Consent Withdrawal (1 case)
- TC-024: Marketing consent withdrawn

## Integration Tests
- IT-001: Health endpoint (200, no auth)
- IT-002: Tenant 1 exists
- IT-003: Patient sees only own data
- IT-004: pp_appointments queryable

## BDD Tests (24 scenarios)
- Nafath OTP
- Appointment booking with/without insurance
- Telehealth eligibility
- Lab results disclosure
- Critical lab verification
- Refill eligibility
- Caregiver proxy
- Self-reported vitals
- FHIR export
- Insurance verification
- Consent withdrawal
- High risk detection

## Security Tests
- PDPL consent gate enforced
- Patient sees only own data
- Caregiver access respects PDPL
- 2FA for sensitive operations
- RLS on all 5 tables
- No PHI in logs
- Critical lab requires clinician
- Controlled substance blocked
