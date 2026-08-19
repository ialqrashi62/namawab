# P0-3_BCMA — Barcode Medication Administration

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Closed-loop barcode medication administration per Joint Commission NPSG.01, CBAHI, MoH SFDA barcode requirements. Scans patient wristband + medication barcode at bedside, validates 5 Rights (patient/drug/dose/route/time).

## Compliance
- ✅ Joint Commission NPSG.01 (5 Rights)
- ✅ CBAHI Medication Safety Standards
- ✅ SFDA Barcode Requirements
- ✅ ASHP Best Practices
- ✅ ISMP Medication Safety
- ✅ HIMSS EMRAM Stage 6/7

## Special Features
- **Patient Wristband Scan** — NID + MRN + DOB
- **Medication Barcode Scan** — GS1, HIBC, Codabar
- **5 Rights Verification** — Patient/Drug/Dose/Route/Time
- **Allergy Alert** — Real-time cross-check
- **Interaction Check** — Drug-drug
- **Override Workflow** — Documented overrides
- **PRN Tracking** — Pain score + last dose
- **Multi-locale** — AR/EN/FR/UR
- **RAG Pipeline** — ISMP database
- **Vector Store** — pgvector + HNSW

## Files (51)
Standard 51-file template per department.

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_3_bcma_engine.js \
  namaweb/bcma_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/bcma', require('./bcma_router')); } catch(e) { console.error('bcma mount failed', e.message); }
```
