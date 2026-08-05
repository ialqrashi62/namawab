---
id: TESTING-QA
version: 1.0
date: 2026-08-01
owner: SA+AIE+CMO
status: ACTIVE
---

# Testing & QA — Clinical Safety + Cross-Tenant + Contract + E2E

> **Purpose:** Multi-layer test suite where clinical safety is non-negotiable and tenant isolation is empirically proven.

---

## 1. Global systems comparison

| System | Test discipline |
|--------|-----------------|
| **Epic** | Massive regression suite (millions of tests, 3-month cycles) |
| **Cerner** | Service virtualization + auto regression |
| **athena** | Nightly automated + ad-hoc |
| **MEDITECH** | Customer-side UAT + simulated tenants |
| **NamaMedical** | **Continuous + clinical safety suite + cross-tenant tests + AI eval** |

---

## 2. Test pyramid

```
                     ──────────
                    ╱   E2E    ╲       Playwright (weekly)
                  ╱   (50 e2e)   ╲
                ─────────────────────
               ╱   Integration (200+) ╲   Service + real DB
              ──────────────────────────
             ╱      Unit (3000+)          ╲  Per engine
            ──────────────────────────────
           ╱  Clinical Safety (200+)         ╲  Red flag, drug, allergy
          ───────────────────────────────────
         ╱  Contract (Pact) (300+)              ╲  API stability
        ───────────────────────────────────────
       ╱  Cross-Tenant (100+)                      ╲  Multi-tenant bleeding
      ─────────────────────────────────────────────
     ╱  AI Eval (50+ per prompt)                    ╲  Hallucination, citation
    ───────────────────────────────────────────────
```

---

## 3. Clinical Safety Suite (critical)

Per-dept suite covers:

```yaml
clinical_safety:
  red_flag_tests:
    - test_id: RED-CARD-001-001
      scenario: 'STEMI on ECG, 5min ago'
      expected_red_flag: ACTIVATE_AMI_PATHWAY
      expected_action: page_cardiology_oncall
      expected_latency_max_ms: 1000
    - test_id: RED-OBG-001-001
      scenario: 'pregnant + teratogen proposed'
      expected_red_flag: BLOCK_TERATOGEN
      expected_action: suggest_alternative + escalate_to_obg
  drug_interaction_tests:
    - test_id: DRUG-CARD-001-001
      scenario: 'warfarin + fluconazole'
      expected_outcome: BLOCK + warning
      expected_alternative: 'consult_anticoag'
  allergy_tests:
    - test_id: ALLERGY-CARD-001-001
      scenario: 'penicillin-allergic + ceftriaxone'
      expected: BLOCK + warning (cross-reactivity)
  pediatric_dose_tests:
    - test_id: PEDS-DOSE-001-001
      scenario: '15kg child, amoxicillin 250mg'
      expected: REJECT (overdose based on 80mg/kg/day)
```

**Target**: 100% pass before any prompt ships to production.

---

## 4. Cross-Tenant Negative Tests

```yaml
cross_tenant_tests:
  - test_id: CT-001
    scenario: tenant_A user attempts to read tenant_B patient
    expected: 403 + log alert (SIEM)
  - test_id: CT-002
    scenario: tenant_A admin attempts to drop RLS
    expected: FAIL (permission denied) + alert
  - test_id: CT-003
    scenario: tenant_A user attempts to list tenant_B invoices
    expected: empty result + audit flag
```

These run nightly against staging; cannot be skipped.

---

## 5. Contract Tests (Pact)

Each consumer defines expectations:
- Web frontend ↔ API
- Mobile ↔ API
- Internal RAG service ↔ LangChain

CI gates: every PR must pass `pact:verify`.

---

## 6. E2E (Playwright)

Critical user journeys:
- Login + MFA
- Patient list → open chart → place order → verify
- ER triage + ESI assignment
- Discharge summary
- Patient portal: schedule + view results
- Telehealth join
- RAG chat from clinician side
- Cross-tenant pivot attempt (negative)

---

## 7. Performance / Load

- k6 scripts (per workflow)
- 100 concurrent users baseline, 1000 stress test
- p95 latency budget per route
- DB conn pool saturation
- LLM token budget per dept

---

## 8. Security

- OWASP top 10 (ZAP + manual)
- Tenant isolation (must read 0 rows)
- CSRF on state-changing routes
- CSP / headers
- Secret leak scan (gitleaks)
- Dependency scan (npm audit + Snyk)
- Pen test (quarterly, third party)

---

## 9. AI Eval

```yaml
ai_eval_per_prompt:
  dataset: synthetic
  size: 250
  metrics:
    - clinical_accuracy
    - citation_coverage
    - red_flag_recall
    - drug_check_recall
    - hallucination_rate
    - confidence_calibration
    - latency
  cross_check: cmo + senior_clinician
  schedule: every PR touching prompt + nightly
```

---

## 10. Coverage targets

| Layer | Target |
|-------|--------|
| Unit (per engine) | ≥ 80% |
| Integration (per service) | ≥ 70% |
| Clinical safety | 100% of red flags covered |
| Contract | 100% of public endpoints |
| Cross-tenant | All cross-tenant attack vectors tested |

---

## 11. Files

```
namaweb/tests/
├── unit/
├── integration/
├── clinical-safety/
├── contract/
├── e2e/
│   └── playwright/
├── cross-tenant/
├── ai-eval/
└── load/
```

---

*Owner: SA+AIE+CMO — version 1.0 — 2026-08-01*
