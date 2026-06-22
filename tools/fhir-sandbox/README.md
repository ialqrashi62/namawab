# FHIR Local Sandbox (D2) — standalone, dummy-only

Local FHIR R4 mapping sandbox. **Not wired to the production app, routes, nginx, or PM2.** No DB, no network, no real PHI.

## Run
```
node tools/fhir-sandbox/test.js
```
Expected: `10/10 PASS` (6 resources + reference integrity + PHI-guard + no-real-PHI + offline tripwire).

## Files
- `fixtures.js` — synthetic dummy rows (ids 9001/9002; fake national ids).
- `mappers.js` — NamaMedical-row → FHIR R4 resource (Patient/Encounter/Observation/DiagnosticReport/MedicationRequest/Claim) + `buildBundle`.
- `validate.js` — structural + reference-integrity + PHI-guard validator (no external validator).
- `test.js` — assertions + an http/https tripwire that throws if anything tries to call out.

## Guarantees
- DiagnosticReport images are **guarded references** (`/api/phi-files/:id`), never embedded bytes.
- The test installs an http/https tripwire so any external call fails the suite.
- No DB reads/writes; fixtures are in-memory dummy only.

## Next (gated)
Install HAPI FHIR locally + validate with the official validator + add KSA profiles for NPHIES — all dummy/local, via `APPROVE_PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT` / NPHIES readiness gates.
