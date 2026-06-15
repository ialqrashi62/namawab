# Test Plan — Emergency Department
v1.0 — Owner: ED Tech Lead + ED Clinical Champion

## 1. Scope
- API: triage, visits, codes (STEMI/Stroke/Sepsis/Trauma/Blue), bundles, board SSE, AI
- UI: Live board (TV mode), triage form, track sheet, code console, SBAR composer
- AI: CTAS suggestion, sepsis early warning, code routing
- Integrations: Cardiology (STEMI), Neurology (Stroke), ICU (admit), Pharmacy (order sets), Lab (cultures)

## 2. Test levels & coverage
| Level | Tooling | Coverage |
|-------|---------|----------|
| Unit | pytest, vitest | ≥ 80%, 100% on score calculators |
| Integration | pytest + Testcontainers | All event flows |
| E2E | Playwright | 15 critical journeys |
| Performance | k6 | board SSE 200 concurrent users |
| Security | ZAP, Burp | OWASP ASVS L2 |
| Accessibility | axe-core | WCAG 2.2 AA |
| Clinical AI | golden snapshots | per AI feature |

## 3. Test case matrix (excerpt)
| TC-ID | Title | Priority | Type | Steps | Expected |
|-------|------|----------|------|-------|---------|
| ED-001 | Walk-in registration → triage CTAS 3 → discharge | P1 | E2E | walk through flow | LOS recorded; audit complete |
| ED-002 | AI suggests CTAS 1 for chest pain + low BP | P0 | Integration | submit triage | ai_suggested_ctas=1, conf ≥ 0.85 |
| ED-003 | Code STEMI activation pages cardio < 60s | P0 | Integration | activate code | pager fired ≤ 60s, cath case incoming created |
| ED-004 | Code Stroke + tPA window check | P0 | Integration | last-known-well 2h | stroke pathway + tPA check + neuro paged |
| ED-005 | Code Sepsis 1-hour bundle countdown | P0 | E2E | start bundle | items applied; countdown visible; alarms if missed |
| ED-006 | Trauma L1 activates blood bank + OR + anesthesia | P0 | Integration | activate | all paged; resus bed assigned |
| ED-007 | Pediatric resus weight-based dosing guard | P0 | Integration | 8 kg child | adult dose paracetamol blocked |
| ED-008 | Board SSE receives updates ≤ 1s | P1 | Performance | 200 VU | p95 push ≤ 1s |
| ED-009 | RBAC: nurse cannot set disposition=ICU | P0 | Integration | nurse JWT | 403 |
| ED-010 | Disposition transfer triggers ambulance request | P1 | Integration | set disposition=transfer | ambulance request created |
| ED-011 | Triage AI confidence < 0.7 → manual review flag | P0 | Integration | low-confidence vignette | requires_human_confirm=true |
| ED-012 | Door-to-doctor SLA breached → escalate | P1 | Monitoring | wait time > 15min CTAS 2 | alert fires |
| ED-013 | SBAR generator from track sheet | P1 | Unit + E2E | export SBAR | structured + reviewable |
| ED-014 | Allergy interactions block analgesia order | P0 | Integration | penicillin allergy + amox order | block + alt suggested |
| ED-015 | Multi-language UI (AR/EN) | P1 | E2E | switch language | strings + layout correct |
| ED-016 | Surge mode: > 90% capacity triggers escalation | P1 | Integration | populate 90% beds | escalation + diversion proposal |
| ED-017 | Chaos: AI worker outage; manual triage path remains usable | P0 | Chaos | kill AI worker | UI degrades gracefully; banner shown |
| ED-018 | PDPL: PHI redacted on TV mode | P0 | Integration | board snapshot | last name initial only on public board |
| ED-019 | Audit chain on code activation tamper-evident | P0 | Integration | tamper attempt | hash mismatch detected |
| ED-020 | Mass casualty: bulk patient registration | P1 | E2E | upload 30 patients via MCI mode | each registered with provisional MRN |

## 4. Performance
- /ed/triage POST: p95 ≤ 400 ms
- /ed/ai/ask: p95 ≤ 4 s
- /ed/board SSE push: p95 ≤ 1 s
- 200 concurrent dashboard viewers; 50 concurrent triages

## 5. Data
- `seeders/ed_seed.sql` (100 visits, 2 active codes)
- 50 mock vignettes for triage AI golden tests
- 30 mock MCI scenarios

## 6. Exit criteria
- All P0 pass
- ≥ 95% P1
- Door-to-X timer accuracy ±5s under load
- AI golden snapshots ≥ 0.92
- Audit chain validates over 1000-event run
- No security HIGH/CRITICAL open
