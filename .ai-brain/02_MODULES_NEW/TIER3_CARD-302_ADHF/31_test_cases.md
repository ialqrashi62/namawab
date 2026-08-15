# CARD-302_ADHF — Test Cases

## Unit Tests (30+ cases in 23_unit_test.js)

### NYHA (2 cases)
- TC-001: NYHA 1-4 valid
- TC-002: NYHA invalid (5) throws

### ACC Stage (2 cases)
- TC-003: Stage A/B/C/D valid
- TC-004: Stage E invalid throws

### LVEF (3 cases)
- TC-005: HFrEF (≤40)
- TC-006: HFmrEF (41-49)
- TC-007: HFpEF (≥50)

### NT-proBNP (3 cases)
- TC-008: Normal range
- TC-009: High range
- TC-010: Age-adjusted threshold

### MAGGIC (2 cases)
- TC-011: Low risk scenario
- TC-012: High risk scenario

### INTERMACS (2 cases)
- TC-013: Profile 1 urgent
- TC-014: Profile 7 not urgent

### SCAI Shock (3 cases)
- TC-015: Stage A
- TC-016: Stage C
- TC-017: Stage E

### GDMT (4 cases)
- TC-018: HFrEF eligible for all 4
- TC-019: Hypotension excludes ARNI
- TC-020: Hyperkalemia excludes MRA
- TC-021: HFpEF not eligible for all 4

### ARNI (2 cases)
- TC-022: Standard dosing
- TC-023: ACEi contraindicated

### SGLT2i (2 cases)
- TC-024: Dapagliflozin standard
- TC-025: Low GFR contraindicated

### LVAD Checklist (2 cases)
- TC-026: All 10 items complete
- TC-027: Partial not ready

### Transplant (3 cases)
- TC-028: Status 1A
- TC-029: Status 1B
- TC-030: Inactive

### LVAD Thrombosis (2 cases)
- TC-031: High risk
- TC-032: Low risk

### HeartMate 3 (2 cases)
- TC-033: Low risk
- TC-034: High risk

### Diuretic (2 cases)
- TC-035: Standard dose
- TC-036: High dose for low UO

### Palliative (1 case)
- TC-037: Multi-trigger eligible

## Integration Tests (in 24_integration_test.js)
- IT-001: Health endpoint
- IT-002: Tenant 1 exists
- IT-003: GET /cases auth-gated
- IT-004: hf_cases table queryable

## BDD Tests (in 25_bdd_feature.feature)
- 11 scenarios

## Security Tests (Rails)
- Auth required on all endpoints
- Tenant isolation enforced
- No PHI in logs
- 2FA for dose endpoints
- RLS on all 5 tables
