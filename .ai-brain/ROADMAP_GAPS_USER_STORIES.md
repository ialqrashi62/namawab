# Roadmap: Gaps → User Stories (90-day)

**Scope:** Convert 10 verified platform gaps into funded user stories. 6 sprints × 2 weeks (12 wks).
**Legend:** P0 = safety/compliance blocker · P1 = high business value · P2 = strategic. Effort: S ≤1 wk · M 1–3 wk · L >3 wk.
**Stack anchors:** Express monolith, PostgreSQL+RLS, pure-function engines, session+MFA auth, EN|AR bilingual, KSA (PDPL/NPHIES/ZATCA).

## Sprint Plan

| Sprint | Weeks | Theme | Story IDs |
|---|---|---|---|
| S1 | 1–2 | Persistence foundations | US-002 (Helpdesk), US-001 (Analytics) |
| S2 | 3–4 | Automated quality gates | US-010 (E2E harness + route smoke) |
| S3 | 5–6 | Clinical safety rails | US-009 (CDSS registry), US-007 (BCMA) |
| S4 | 7–8 | Compliance & AI grounding | US-006 (EPCS parity), US-004 (pgvector) |
| S5 | 9–10 | Patient & ops surfaces | US-008 (Portal), US-003 (APM) |
| S6 | 11–12 | Mobile MVP & regression closeout | US-005 (Offline), US-010 full run + sign-off |

---

### GAP-1: Analytics Event Persistence (P1, S) — `US-001`
- **User Story:** As a hospital administrator I want analytics events written to PostgreSQL so that usage dashboards survive restarts and inform capacity/licensing decisions.
- **Acceptance Criteria:**
  - GIVEN the analytics engine emits an event WHEN the handler fires THEN a row lands in `analytics_events` (`tenant_id`, `event_type`, `payload JSONB`, `created_at`) within 5 s.
  - GIVEN two tenants emit identical events WHEN either queries via API THEN RLS returns only that tenant's rows.
  - GIVEN EN|AR dashboard WHEN toggling language THEN labels switch via i18n keys with no code change; AR renders RTL correctly.
  - GIVEN a 1k events/sec burst WHEN batch inserts run THEN added p95 request latency stays <50 ms and no events drop.
- **Dependencies & risks:** Reuses existing engine; risk of table bloat → plan monthly partitioning post-MVP.

### GAP-2: Helpdesk Ticket Persistence (P1, S) — `US-002`
- **User Story:** As a support agent I want tickets stored in the DB with status workflow so that issues survive shift changes with full history.
- **Acceptance Criteria:**
  - GIVEN a submitted ticket WHEN saved THEN row persists in `helpdesk_tickets` (status, priority, SLA due_at) and appears in queue on reload.
  - GIVEN any status change WHEN committed THEN an immutable audit-log entry records actor, from→to state, timestamp.
  - GIVEN tenant A agent WHEN opening ticket list THEN zero tickets from tenant B are visible (RLS enforced).
  - GIVEN AR ticket body WHEN rendered THEN RTL layout and Arabic text are correct alongside EN tickets.
- **Dependencies & risks:** Depends on audit-log router (present); risk: SLA timers need cron worker.

### GAP-3: APM Metrics Endpoint + Persistence (P2, M) — `US-003`
- **User Story:** As an SRE I want `/api/apm/metrics` plus rolling metrics tables so that latency/error dashboards are queryable and restart-safe.
- **Acceptance Criteria:**
  - GIVEN the APM engine buffers samples WHEN the flush interval elapses THEN rows land in `apm_metrics` (route, p50/p95/p99, status codes).
  - GIVEN GET `/api/apm/metrics?window=1h` WHEN called by admin THEN Prometheus/JSON output returns; non-admin gets 403 (RBAC).
  - GIVEN server restart WHEN metrics queried THEN prior window data is intact (no in-memory-only loss).
  - GIVEN EN|AR ops UI WHEN rendering charts THEN all labels resolve through i18n keys.
- **Dependencies & risks:** Engine is stateless today; risk: cardinality explosion → cap tracked routes.

### GAP-4: pgvector Ingestion Pipeline Wiring (P1, M) — `US-004`
- **User Story:** As a clinical knowledge manager I want documents embedded into pgvector via the LangChain shim so that RAG answers ground in our corpus, not nothing.
- **Acceptance Criteria:**
  - GIVEN a source doc WHEN the ingestion job runs THEN chunks (≤1k tokens) embed into `documents.embedding` with source metadata.
  - GIVEN tenant-scoped query WHEN similarity search executes THEN top-k results exclude other tenants' vectors (RLS on vector tables).
  - GIVEN a failed embedding WHEN retried 3× THEN chunk moves to dead-letter table with error reason.
  - GIVEN bilingual docs (EN|AR) WHEN indexed THEN both languages retrieve relevant chunks for equivalent queries.
- **Dependencies & risks:** Migration exists but unwired; risk: embedding cost/quota — batch + cache.

### GAP-5: Mobile / Offline MVP (P2, L) — `US-005`
- **User Story:** As a clinician on rounds with poor connectivity I want cached schedules/vitals available offline so care is never blocked.
- **Acceptance Criteria:**
  - GIVEN installed PWA WHEN offline THEN last-viewed patient list and vitals render from encrypted IndexedDB cache.
  - GIVEN queued writes created offline WHEN connectivity resumes THEN they replay idempotently (client UUID dedupe) with conflict banner on mismatch.
  - GIVEN device loss WHEN PHI cache inspected THEN storage is AES-encrypted; remote wipe clears it.
  - GIVEN AR|EN device locale WHEN app opens THEN correct language + RTL applies offline.
- **Dependencies & risks:** Largest effort; risk: sync conflicts — scope MVP to read-mostly views first.

### GAP-6: e-Prescribing / EPCS Parity Audit (P1, M) — `US-006`
- **User Story:** As pharmacy lead I want a capability matrix vs Epic e-Prescribing (renewals, DDI checks, EPCS signing) so gaps are funded deliberately, not discovered in audit.
- **Acceptance Criteria:**
  - GIVEN the audit runs WHEN complete THEN matrix covers ≥20 capabilities scored Present/Partial/Absent vs Epic baseline.
  - GIVEN controlled-substance Rx WHEN signed THEN two-factor step-up (EPCS-style) is required and logged.
  - GIVEN any Rx event WHEN emitted THEN audit trail captures prescriber, patient, drug, timestamp, tenant.
  - GIVEN PDPL review WHEN report published THEN findings mapped to remediation stories with owners.
- **Dependencies & risks:** Depends on Rx router (present); risk: identity-proofing needs external vendor.

### GAP-7: BCMA Barcode Administration Flow (P0, M) — `US-007`
- **User Story:** As a bedside nurse I want scan-patient → scan-med validated against MAR (5 rights) so administration errors are intercepted at the bedside.
- **Acceptance Criteria:**
  - GIVEN wrong patient or med scanned WHEN compared to active MAR order THEN administration blocks with red alert; override requires reason and logs to audit.
  - GIVEN successful scan pair WHEN confirmed THEN MAR entry + BCMA audit row write atomically (tenant-scoped).
  - GIVEN AR|EN station UI WHEN alert shows THEN message is bilingual and RTL-correct.
  - GIVEN offline scan station WHEN connectivity returns THEN queued administrations sync without duplicates.
- **Dependencies & risks:** Needs barcode lib + MAR schema check; risk: scanner hardware variance.

### GAP-8: Patient Portal Self-Service Depth (P1, M) — `US-008`
- **User Story:** As a patient I want appointment booking, lab-result viewing, and bill payment online in AR|EN so I avoid phone calls.
- **Acceptance Criteria:**
  - GIVEN patient books/reschedules/cancels WHEN slot contention occurs THEN optimistic locking prevents double-booking; confirmation sent in chosen language.
  - GIVEN labs exist WHEN provider release flag set THEN results visible; before flag, hidden.
  - GIVEN invoice paid WHEN receipt generated THEN ZATCA-compliant e-invoice downloads (AR primary).
  - GIVEN patient of tenant A WHEN authenticated THEN no cross-tenant record access (RLS verified by test).
- **Dependencies & risks:** ZATCA router present; risk: NPHIES eligibility checks may gate booking.

### GAP-9: CDSS Rule Engine Formalization (P0, M) — `US-009`
- **User Story:** As clinical governance lead I want scattered if-logic consolidated into a versioned rule registry so rules are testable, auditable, and safely changeable.
- **Acceptance Criteria:**
  - GIVEN rules authored as versioned JSON WHEN engine loads THEN each carries rule_id, version, effective_from/to; superseded versions inert.
  - GIVEN dry-run mode enabled WHEN new rules evaluate THEN shadow alerts logged side-by-side with legacy output (parity report ≥95% agreement before cutover).
  - GIVEN rule fires WHEN alert rendered THEN CDSS audit entry stores rule_id/version/patient/tenant; alert text bilingual.
  - GIVEN rule unit tests WHEN CI runs THEN every registered rule has ≥1 positive and ≥1 negative case passing.
- **Dependencies & risks:** Inventory sweep required first; risk: clinical sign-off latency — parallel-track governance.

### GAP-10: Automated E2E Regression Suite (P0, M) — `US-010`
- **User Story:** As QA lead I want automated E2E coverage over the 715 mounted routes so regressions are caught pre-deploy, not in production.
- **Acceptance Criteria:**
  - GIVEN router catalog WHEN generated from router.stack THEN all 715 routes enumerated with method/path/tenant guard flags.
  - GIVEN nightly suite WHEN executed THEN authenticated smoke passes against 100% of routes; failures open helpdesk tickets (via US-002).
  - GIVEN critical paths (auth, orders, MAR, billing) WHEN tested THEN ≥100 deep flows cover happy + failure paths incl. cross-tenant denial.
  - GIVEN PR pipeline WHEN suite fails THEN merge gate blocks and badge reports red per module.
- **Dependencies & risks:** Test fixtures heavy — reuse fixture DSL; risk: flaky network tests → retry policy + quarantine lane.

---

## Definition of Done (global checklist)

- [ ] Unit + integration tests pass locally and in CI; new logic covered
- [ ] Migration applied **and reversible**; RLS policies verified with cross-tenant negative test
- [ ] i18n keys complete for EN|AR; RTL layout visually checked
- [ ] Audit-log entries written for every state-changing action (actor, tenant, timestamp)
- [ ] OpenAPI spec + endpoint catalog regenerated; routers wired via autowire pattern
- [ ] L4 quality gates green; no secrets in code, config, or logs
- [ ] Perf budget respected: API p95 <300 ms under standard load profile
- [ ] Bilingual smoke evidence attached (screenshots EN + AR)
- [ ] Story demoed to product owner; sprint retro notes captured
