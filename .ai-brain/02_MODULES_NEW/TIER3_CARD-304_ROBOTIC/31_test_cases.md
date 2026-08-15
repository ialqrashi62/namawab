# CARD-304_ROBOTIC — Test Cases

## Unit Tests (24 cases)

### STS Score (2 cases)
- TC-001: Low risk
- TC-002: High risk

### EuroSCORE II (2 cases)
- TC-003: Low risk
- TC-004: Very high risk

### TAVI Eligibility (2 cases)
- TC-005: Eligible elderly
- TC-006: Ineligible young

### MitraClip (2 cases)
- TC-007: COAPT eligible
- TC-008: Ineligible

### WATCHMAN (2 cases)
- TC-009: Eligible
- TC-010: Ineligible

### Robotic Eligibility (2 cases)
- TC-011: Eligible
- TC-012: Ineligible

### Pre-Op Checklist (3 cases)
- TC-013: Complete
- TC-014: Incomplete (1 missing)
- TC-015: 10/10

### Conversion Risk (2 cases)
- TC-016: Low risk
- TC-017: High risk

### Post-Op Complication (2 cases)
- TC-018: Low
- TC-019: High

### Discharge Readiness (3 cases)
- TC-020: All criteria met
- TC-021: 2 missing
- TC-022: Not ready

## Integration Tests
- IT-001: Health (401 auth gate)
- IT-002: Tenant 1 exists
- IT-003: GET /cases auth-gated
- IT-004: robotic_cv_cases queryable

## BDD Tests (11 scenarios)
- Low STS → Open acceptable
- High STS → TAVI
- TAVI elderly
- TAVI young ineligible
- MitraClip COAPT
- WATCHMAN
- Robotic eligibility
- Pre-op complete
- Pre-op missing consent
- Conversion high risk
- Discharge ready

## Security Tests
- Auth on all endpoints
- Tenant isolation
- No PHI in logs
- RLS on all 4 tables
