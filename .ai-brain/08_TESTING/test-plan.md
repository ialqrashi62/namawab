# Test Plan — NamaMedical ERP
# Filepath: .ai-brain/08_TESTING/test-plan.md
# Generated: 2026-08-08

# Test Plan — Master v5 (60 Departments)

> **Coverage:** Unit + Integration + BDD + E2E + Security + Performance
> **Target:** 95% code coverage on engines, 100% on critical paths
> **CI/CD:** GitHub Actions (runs on every PR)

---

## 1. Test Pyramid

```
       ┌────────────────┐
       │   E2E (10%)    │   Playwright — full user flows
       ├────────────────┤
       │ Integration    │   Supertest — API endpoints
       │    (30%)       │   Cross-tenant master
       ├────────────────┤
       │  Unit Tests    │   Jest — engines, helpers
       │    (60%)       │
       └────────────────┘
```

---

## 2. Unit Tests (60 × 5 = 300 tests)

For each department's engine:
1. `setTenant` fails without tenant_id
2. `setTenant` succeeds with valid id
3. `list` filters by tenant_id (RLS)
4. `create` writes audit log
5. `delete` is soft delete (deleted_at set)

---

## 3. Integration Tests (60 × 8 = 480 tests)

For each dept router:
1. `GET /list` requires tenant header → 400
2. `GET /list` with valid tenant → 200
3. `GET /list` cross-tenant blocked → 404
4. `POST /` requires role → 403
5. `POST /` with role → 201
6. `PUT /:id` updates correctly
7. `DELETE /:id` soft deletes
8. `POST /risk/calculate` works for known scores

---

## 4. Cross-Tenant Master Test (300 tests)

`namaweb/cross_tenant_master_test.js` — already created.
Tests every dept × 4 scenarios = 240+ tenant isolation tests.

---

## 5. BDD Tests (60 × 5 = 300 scenarios)

For each dept, `30_test_bdd.feature`:
- Encounter creation flow
- Order → result flow
- Note signing flow
- AI diagnosis flow
- Cross-department referral

---

## 6. Security Tests (50 tests)

### 6.1 OWASP Top 10
- SQL injection (100 payloads × 60 depts = 6000)
- XSS (50 payloads × 60 depts = 3000)
- CSRF (token validation on 60 routes)
- Broken access control (cross-tenant)
- Security misconfig (default creds check)
- Vulnerable components (`npm audit`)

### 6.2 Custom
- Hash chain integrity (audit log)
- PHI redaction (log files)
- JWT tampering
- Rate limiting
- Idempotency on money routes

---

## 7. Performance Tests

### 7.1 Load Tests (k6 scripts)

```javascript
// filepath: .ai-brain/08_TESTING/load/k6_load.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 },  // ramp up
    { duration: '10m', target: 500 }, // sustained
    { duration: '5m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% < 200ms
    http_req_failed: ['rate<0.01'],   // < 1% errors
  },
};

export default function () {
  const res = http.get('https://jumanasoft.com/api/cardiology/list', {
    headers: { 'x-tenant-id': '1' },
  });
  check(res, {
    'status 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

### 7.2 Targets

| Metric | Target |
|---|---|
| Throughput | 1000 RPS |
| p50 latency | < 50ms |
| p95 latency | < 200ms |
| p99 latency | < 500ms |
| Error rate | < 0.1% |
| Concurrent users | 500 |

---

## 8. Accessibility Tests (WCAG 2.1 AA)

- axe-core integration (50 pages × 60 depts = 3000 tests)
- Keyboard navigation
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Color contrast (≥ 4.5:1)
- RTL support verification

---

## 9. Compliance Tests

### 9.1 PDPL
- PHI encryption verification
- Audit log immutability
- Data export requests work
- Erasure requests respect retention

### 9.2 CBAHI
- Time-out procedure for surgery
- Hand hygiene documentation
- Patient identification (2 identifiers)
- Critical lab value alerting

### 9.3 NPHIES
- Claim format validation
- Eligibility check
- Pre-authorization flow
- Bundle submission

---

## 10. CI/CD Pipeline

```yaml
# .github/workflows/main.yml (excerpt)
jobs:
  test-unit:
    - npm test -- *_test.js --coverage
  test-integration:
    - npm run test:safe
    - npm test -- cross_tenant_master_test.js
  test-security:
    - npm audit
    - sqlmap-scan (60 routes)
    - xss-scan (60 pages)
  test-bdd:
    - cucumber-js 30_test_bdd.feature
  test-performance:
    - k6 run load/k6_load.js
  test-accessibility:
    - axe-core 60 pages
```

---

## 11. Test Reports

| Report | Frequency | Tool |
|---|---|---|
| Coverage | Per PR | Jest + Codecov |
| Performance | Per release | k6 + Grafana |
| Security | Per release | OWASP ZAP |
| Compliance | Annual | External auditor |

---

## 12. Test Metrics

| Metric | Target | Current |
|---|---|---|
| Code coverage (engines) | 95% | TBD |
| Test pass rate | 100% | TBD |
| Test execution time | < 10 min | TBD |
| False positives | < 5% | TBD |

---

**Generated:** 2026-08-08 · **Owner:** QA Team
