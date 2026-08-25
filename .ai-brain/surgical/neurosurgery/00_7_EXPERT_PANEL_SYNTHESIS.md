# 7-Expert Panel Synthesis — NS-NEURO v1.0.0

| Expert | Mandate | Key decisions | Residual risk / mitigation |
|---|---|---|---|
| CMO | Clinical safety & fidelity | GCS/Hunt-Hess/Spetzler-Martin as canonical scores; WHO SSC mandatory on all craniotomies; NICU co-management model | Score entry errors → dual-entry + range guards |
| Lead AI Engineer | RAG + decision support | pgvector(1536) HNSW; citation-enforced chains; prompts versioned like code | Hallucination → 100% citation coverage gate + 2% daily human audit |
| Principal Architect | System shape | Pure-function engine layer; thin express routes; event-driven audit via outbox table | Engine drift vs guidelines → quarterly CMO sign-off |
| DevOps/Security | Pipeline & hardening | Flyway-style up/down pairs; RLS tenant isolation; secrets in vault; signed images | Migration drift → validate.sql in CI gate |
| PM/UX | Clinician workflow | 4-zone console (Cases, Assessments, ICU, Programs); RTL-first AR parity | Alert fatigue → single red-banner pattern |
| Compliance Officer | JCI/PDPL/NPHIES | Consent capture pre-op block; PDPL purpose-bound processing; NPHIES claim hooks | Audit gaps → immutable audit log, 6y retention |
| QA | Verification | Unit tests bind every engine fn; cross-tenant deny tests mandatory; Playwright E2E incl RTL flip | Untested paths → coverage gate 90% engine layer |

**Consensus:** ship v1 scope = CBV + FUNC + SPINE flows; NONC/PN/SB/ENDO ride shared case framework with catalog flags.
