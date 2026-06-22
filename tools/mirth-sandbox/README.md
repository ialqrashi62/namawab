# Mirth Sandbox (D1) — local, isolated, dummy-only

Two artifacts:
1. **`docker-compose.candidate.yml`** — deployment artifact for a REAL Mirth sandbox. **Not run in this gate** (pulling the image is an external network call). Loopback-only ports, no certs, no PHI. Run later only after owner approval.
2. **`channel_sim.js`** — a LOCAL channel-flow simulator (no Mirth install, no network, no PHI) that mirrors the channel model so the design is provable offline now.

## Run the simulator
```
node tools/mirth-sandbox/channel_sim.js
```
Expected: `7/7 PASS`. Uses `tools/fhir-sandbox/` dummy fixtures; writes to a temp dir and cleans up.

## Simulated channels
- `SBX_FHIR_BUNDLE_IN` — receive D2 dummy bundle → transform → write resources to `out/`.
- `SBX_HL7_ADT_IN` — synthetic ADT^A01 (dummy MRN) → minimal parse → ACK (AA).
- `SBX_DLQ` — malformed message → dead-letter folder.
- `SBX_RETRY` — transient failure → retry → delivered (at-least-once).
- audit log — channel events, **no PHI**.

## Guarantees
loopback/offline only · dummy only · no DB · no certs · no production wiring · http/https tripwire in the simulator.

## Next (gated)
Run the real compose (owner-approved), wire `SBX_FHIR_BUNDLE_IN` to the D2 mapping, then plan NPHIES/HL7 device channels with the Phase-2 key model for mTLS/signing.
