# Orthanc PACS Sandbox (D5) — local, dummy-metadata-only

Two artifacts:
1. **`docker-compose.candidate.yml`** — real Orthanc deployment artifact. **Not run** (image pull = external). Loopback-only, dummy, no PHI/certs.
2. **`dicom_sim.js`** — LOCAL DICOM simulator (no Orthanc/Docker/network). Dummy DICOM **metadata only** (no pixel bytes, synthetic PatientIDs 9000–9999).

## Run
```
node tools/orthanc-sandbox/dicom_sim.js
```
Expected: `7/7 PASS`. Writes to a temp store and cleans up.

## What it proves
- STOW-RS-style store of dummy metadata.
- PHI tripwire rejects non-synthetic PatientIDs (e.g. 10-digit national ids) and any pixel bytes.
- Client-facing access is modeled through the **A3A guarded route** `/api/phi-files/:id` (auth+RLS+tenant+encryption) — Orthanc is never exposed to the browser; the app fetches internally on loopback.
- network tripwire blocks any outbound http/https.

## Real Orthanc (gated)
Run `docker-compose.candidate.yml` only after owner approval (image pull). Keep loopback-only; the app stays the sole client-facing path behind A3A.
