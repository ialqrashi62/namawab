# CARD-303_ONCO — Test Cases

## Unit Tests (25+ cases in 23_unit_test.js)

### HFA-ICOS Risk (2 cases)
- TC-001: Low risk
- TC-002: Very high risk

### CTCAE Grade (4 cases)
- TC-003: Grade I
- TC-004: Grade III
- TC-005: Grade IV life-threatening
- TC-006: Grade V fatal

### GLS Change (2 cases)
- TC-007: Normal change
- TC-008: >15% drop holds chemo

### ICI Myocarditis (3 cases)
- TC-009: Mild
- TC-010: Severe
- TC-011: Fulminant

### Anthracycline Dose (3 cases)
- TC-012: Dox 200 low
- TC-013: Dox 450 high
- TC-014: Epi 600 = Dox 402

### Trastuzumab (2 cases)
- TC-015: Mild
- TC-016: Severe

### QTc (2 cases)
- TC-017: Normal
- TC-018: >500ms hold

### VTE (2 cases)
- TC-019: Breast → DOAC
- TC-020: Gastric → LMWH

### Amyloid (2 cases)
- TC-021: Pyrophosphate Grade 3
- TC-022: LGE + thick septum

### Cardioprotection (2 cases)
- TC-023: Very High risk
- TC-024: Low risk

## Integration Tests
- IT-001: Health (401 auth gate)
- IT-002: Tenant 1 exists
- IT-003: GET /cases auth-gated
- IT-004: cardio_onc_cases queryable

## BDD Tests (10 scenarios)
- Risk stratification
- GLS-guided hold
- ICI Myocarditis confirmed
- Trastuzumab severe
- QTc >500ms
- VTE — DOAC
- VTE — LMWH
- Amyloid high suspicion
- Cardioprotection

## Security Tests
- Auth on all endpoints
- Tenant isolation
- No PHI in logs
- 2FA on dose endpoints
- RLS on all 4 tables
