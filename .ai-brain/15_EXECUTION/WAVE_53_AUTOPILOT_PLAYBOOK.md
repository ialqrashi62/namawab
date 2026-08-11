# WAVE 53 AUTOPILOT PLAYBOOK

## Active Skills (token-saver mode)
- nm-token-saver-pack-v2
- nm-loop-engineering-v2
- nm-autopilot-wave-runner-v1
- nm-multi-agent-wave-splitter-v1
- nm-loop-gate-enforcer-v1
- nm-final-ship-pack

## Phase Sequence
1. Phase A (Data hardening)
2. Phase B (P1 clinical/revenue gaps)
3. Phase C (Interop + UX)
4. Phase D (Ops + observability)
5. Phase E (Compliance + closeout)

## Loop Policy
- Max 4 loops per phase.
- Stop and escalate on loop-4 failure.

## Multi-Agent Lane Plan
- Lane A DB: e61 verify + index checks + audit seed plan
- Lane B API: EMR lock/signature + DDI + GL toggle
- Lane C UI: Admin panel phase-2, consent/lock UX
- Lane D QA: test expansions + redaction + tenant isolation proofs
- Lane E Ops: grafana wiring docs + alert definitions
- Lane F Docs: compliance matrix refresh + closeout pack

## Gate Checklist (must pass)
- QG1 rails intact
- QG2 tests pass for touched scope
- QG3 syntax clean for touched files
- QG4 tenant/RLS proofs present
- QG5 audit/logging proofs present
- QG6 docs/changelog/memory updated

## Immediate Sprint (Wave 53 P1)
- Task 1: EMR lock/signature enforcement
- Task 2: DDI seed + engine guard
- Task 3: audit chain seed + verify
- Task 4: GL posting safe toggle + integrity checks

## Blockers (owner action)
- ZATCA CSID/OTP
- NPHIES production credentials
- Payment provider production keys
