# CARD-301_STROKE — Test Cases

## Unit Tests (25 cases — in 23_unit_test.js)

### NIHSS (4 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-001 | All zeros | score=0, severity=minor | ✅ |
| TC-002 | Moderate deficits | score=3, severity=moderate | ✅ |
| TC-003 | Severe + bilateral | score=26, severity=severe | ✅ |
| TC-004 | Out-of-range value | Throws OUT_OF_RANGE | ✅ |

### ASPECTS (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-005 | All 1s | score=10, favorable | ✅ |
| TC-006 | All 0s | score=0, poor | ✅ |

### mRS (4 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-007 | score=0 | favorable=true | ✅ |
| TC-008 | score=2 | favorable=true | ✅ |
| TC-009 | score=3 | favorable=false | ✅ |
| TC-010 | score=6 | description="Dead" | ✅ |
| TC-011 | score=7 | Throws INVALID | ✅ |

### ICH Score (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-012 | Low (GCS15, age50, small) | score=0, mortality=0% | ✅ |
| TC-013 | High (GCS3, age85, large) | score=6, mortality=100% | ✅ |

### Hunt-Hess (3 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-014 | grade=1 | elective | ✅ |
| TC-015 | grade=5 | urgent | ✅ |
| TC-016 | grade=6 | Throws INVALID | ✅ |

### ABCD2 (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-017 | Low | score=0, low risk | ✅ |
| TC-018 | High (all positive) | score=7, high risk | ✅ |

### CHA2DS2-VASc (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-019 | Male low | score=0, no anticoag | ✅ |
| TC-020 | Female elderly all | score=9, anticoag recommended | ✅ |

### HAS-BLED (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-021 | All negative | score=0 | ✅ |
| TC-022 | All positive | score=9, high risk | ✅ |

### Tenecteplase (3 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-023 | 80kg | 20mg | ✅ |
| TC-024 | 200kg (max dose) | 25mg | ✅ |
| TC-025 | 20kg | Throws INVALID_WEIGHT | ✅ |

### Thrombolysis Eligibility (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-026 | Eligible | eligible=true | ✅ |
| TC-027 | Out-of-window | eligible=false | ✅ |

### DNT Compliance (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-028 | 45 min | compliant=true | ✅ |
| TC-029 | 75 min | compliant=false | ✅ |

### Secondary Prevention Bundle (2 cases)
| TC | Input | Expected | Status |
|---|---|---|---|
| TC-030 | All 5 elements | complete=true, 100% | ✅ |
| TC-031 | 2/5 elements | complete=false, 40% | ✅ |

## Integration Tests (in 24_integration_test.js)
- IT-001: /health endpoint reachable (401 auth gate)
- IT-002: Tenant 1 exists
- IT-003: /cases auth-gated
- IT-004: stroke_cases table queryable

## BDD Tests (in 25_bdd_feature.feature)
- BDD-001: Code Stroke activation
- BDD-002: NIHSS calculation
- BDD-003: ASPECTS scoring
- BDD-004: Eligibility check
- BDD-005: Door-to-needle compliance
- BDD-006: Tenecteplase dosing
- BDD-007: CHA2DS2-VASc
- BDD-008: Secondary prevention bundle

## Performance Tests
- PT-001: NIHSS calc P95 <50ms
- PT-002: RAG retrieval P95 <200ms
- PT-003: API endpoint P95 <300ms

## Security Tests (per AGENTS.md §2.2)
- ST-001: All endpoints require auth (rails #5)
- ST-002: Tenant isolation enforced (rails #5)
- ST-003: No PHI in logs (rails #12)
- ST-004: 2FA on dose endpoints (rails #13)
- ST-005: RLS enabled on all tables (rails #5)
