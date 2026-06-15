# Test Plan — Cardiology
v1.0 — Owner: Cardiology Tech Lead + Cardiology Clinical Champion

## 1. Scope
- API: cardio orders, ECG, echo, cath, devices, HF, AI co-pilot
- UI: dashboard, patient cardio view, order entry, ECG reader, echo reporter, cath schedule, HF tracker
- AI: ECG STEMI detector, risk calculators, LangGraph orchestrator
- Integrations: existing Cardiac PACS, Lab (troponin, BNP), Pharmacy (anticoag/antiplatelet)

## 2. Out of scope
- Pediatric cardiac (covered in G20 test plan)
- Cardiac surgery cases (covered in G11 test plan)

## 3. Test levels & coverage targets
| Level | Tooling | Coverage |
|-------|---------|----------|
| Unit | pytest, vitest | ≥ 80% lines, 100% on score calculators |
| Integration | pytest + Testcontainers | All event flows; happy + 2 negatives each |
| Contract | Pact (consumer/provider) | All inter-service calls |
| E2E | Playwright | 12 critical user journeys |
| Performance | k6 | API p95 ≤ 400ms; AI ≤ 5s |
| Security | ZAP, Burp | OWASP ASVS L2 |
| Accessibility | axe-core | WCAG 2.2 AA |
| Clinical AI | golden snapshots ≥ 0.92 cosine | per AI feature |

## 4. Risk-based prioritization
| Priority | Definition | Examples |
|----------|-----------|----------|
| P0 | Patient-safety / regulatory | STEMI alert false-negative path; anticoag dose check |
| P1 | Major workflow | order place → fulfill → bill |
| P2 | Minor / cosmetic | filter chips, sort order |

## 5. Test case matrix (excerpt; full sheet `cardiology_matrix.xlsx`)
| TC-ID | Title | Priority | Type | Pre-req | Steps | Expected | Linked Req |
|-------|------|----------|------|---------|-------|---------|-----------|
| CD-001 | Place echo order — happy path | P1 | E2E | Logged in cardio doctor; patient MRN P-90001 | Open patient → click "Order Echo" → select TTE → Routine → Submit | Order created, status=requested, audit row written | US-CD-01 |
| CD-002 | Place STAT cath order with consent gate | P0 | E2E | As above | Order Cath / STAT | Consent prompt mandatory before submit | US-CD-02 |
| CD-003 | ECG upload triggers AI within 5s | P0 | Integration | Patient + visit exist | POST /cardio/ecg with sample DICOM | Worker consumes event, ai_interpretation populated, confidence shown | US-CD-03 |
| CD-004 | ECG AI flags STEMI → ED banner | P0 | E2E | ECG sample tagged STEMI conf 0.94 | Upload ECG | ED dashboard shows banner; cardio paged | US-CD-04 |
| CD-005 | HEART score calc | P0 | Unit | n/a | feed 100 vignettes | matches reference table 100% | US-CD-05 |
| CD-006 | CHA2DS2-VASc + HAS-BLED combo | P0 | Unit | n/a | feed 50 vignettes | matches | US-CD-06 |
| CD-007 | Anticoag init blocked if CrCl<15 + dabigatran | P0 | Integration | patient eGFR=12 | order dabigatran | order rejected with reason | US-CD-07 |
| CD-008 | Anthracycline cumulative limit gate | P0 | Integration | cumulative dox 440 mg/m2 | order +50 mg/m2 | block + cardiology review required | US-CD-08 |
| CD-009 | Cath schedule conflict | P1 | E2E | room booked 10:00 | book another at 10:15 | conflict warning + suggestion | US-CD-09 |
| CD-010 | HF GDMT recommender | P1 | Integration | EF 30%, no SGLT2i | run recommender | suggests SGLT2i with citation | US-CD-10 |
| CD-011 | Device interrogation due | P1 | Unit | last_interrogation > 6mo | run scheduler | ticket created | US-CD-11 |
| CD-012 | RBAC: cardio nurse cannot place cath order | P0 | Integration | nurse JWT | POST cath order | 403 with reason | US-CD-12 |
| CD-013 | PHI redaction in AI prompt | P0 | Integration | prompt with MRN | call /ai/ask | upstream LLM payload contains [MRN] | US-CD-13 |
| CD-014 | Audit hash chain integrity | P0 | Integration | n/a | sequence of 100 events | hash chain validates | US-CD-14 |
| CD-015 | Echo report PDF export | P2 | E2E | echo signed | export | PDF correct, signed by | US-CD-15 |
| CD-016 | RTL/Arabic UI in ECG reader | P1 | E2E | Arabic locale | open ECG | strings + layout RTL correct | US-CD-16 |
| CD-017 | Performance: 100 concurrent ECG uploads | P1 | Perf | k6 script | 100 VU | p95 worker latency ≤ 5s, no errors | NFR-CD-01 |
| CD-018 | Disaster: DB failover during STEMI flow | P0 | Chaos | DR drill | trigger failover | flow continues within 30s; banner shown | NFR-CD-02 |
| CD-019 | Drug-drug: warfarin + amiodarone | P0 | Integration | patient on warfarin | order amiodarone | high-severity alert + suggested INR monitoring | US-CD-19 |
| CD-020 | AI ECG drift monitor alarms | P1 | Monitoring | inject distribution shift | run monitor | alarm fires within 24h | NFR-CD-03 |

## 6. Performance targets
- /cardio/orders POST: p95 ≤ 400 ms @ 50 RPS
- /cardio/ecg POST: p95 ≤ 800 ms @ 20 RPS (excludes worker)
- ECG AI worker: p95 ≤ 5 s
- /cardio/ai/ask (LangGraph): p95 ≤ 5 s
- Live HF dashboard: p95 ≤ 1 s

## 7. Data
- Use `seeders/cardiology_seed.sql`
- ECG samples: 50 anonymized cases (10 STEMI, 5 LBBB, 5 paced, 30 normal)
- Test patients MRN P-90001 to P-90050

## 8. Environment
- Staging cluster + ephemeral PR environments via Helm
- Test PACS instance pre-loaded
- Shared LLM key with rate limit; mocks available

## 9. Reporting
- Allure dashboard
- Slack #cardio-tests on red runs
- Weekly summary to Cardiology Lead

## 10. Exit criteria for release
- All P0 tests pass
- ≥ 95% P1 pass; documented waivers for the rest
- No P0 security findings open
- AI golden snapshots ≥ 0.92 across reference set
- Performance SLOs met under expected load
- CBAHI-relevant audit evidence captured
