# Test Plan — {{Department Name}}
v0.1 — Owner: {{Tech Lead}} + {{Clinical Champion}}

## 1. Scope
- API: ...
- UI: ...
- AI: ...
- Integrations: ...

## 2. Out of scope
- ...

## 3. Test levels & coverage targets
| Level | Tooling | Coverage |
|-------|---------|----------|
| Unit | pytest, vitest | ≥ 75% |
| Integration | pytest + Testcontainers | All event flows |
| Contract | Pact | Inter-service calls |
| E2E | Playwright | N critical journeys |
| Performance | k6 | per SLO |
| Security | ZAP | OWASP ASVS L2 |
| Accessibility | axe-core | WCAG 2.2 AA |
| Clinical AI (if any) | golden snapshots ≥ 0.92 | per AI feature |

## 4. Risk-based prioritization
| Priority | Definition |
|----------|-----------|
| P0 | Patient-safety / regulatory |
| P1 | Major workflow |
| P2 | Minor / cosmetic |

## 5. Test case matrix
| TC-ID | Title | Priority | Type | Pre-req | Steps | Expected | Linked Req |
|-------|------|----------|------|---------|-------|---------|-----------|
| {{KEY}}-001 | ... | P0 | E2E | ... | ... | ... | US-...-01 |

## 6. Performance targets
- ...

## 7. Data
- `seeders/{{dept_key}}_seed.sql`
- ...

## 8. Environment
- Staging cluster + ephemeral PR environments

## 9. Reporting
- Allure + Slack #...

## 10. Exit criteria for release
- All P0 pass
- ≥ 95% P1
- No security HIGH/CRITICAL open
- AI golden snapshots ≥ 0.92 (if applicable)
- Performance SLOs met
- Accreditation evidence captured
