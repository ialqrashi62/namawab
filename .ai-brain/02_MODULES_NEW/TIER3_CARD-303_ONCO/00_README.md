# TIER3_CARD-303_ONCO — Cardio-Oncology Center

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Cardio-Oncology Center per ESC 2022, AHA/ACC 2023, IC-OS 2024 guidelines. Manages cardiac complications of cancer therapy (anthracyclines, trastuzumab, ICIs, VEGF inhibitors), cancer-associated VTE, cardiac amyloid, and survivorship.

## Compliance
- ✅ ESC 2022 Cardio-Onc
- ✅ AHA/ACC 2023
- ✅ IC-OS 2024 ICI Myocarditis
- ✅ ASCO 2020 Cardioprotection
- ✅ NCCN 2024 VTE
- ✅ HFA-ICOS 2022 Risk Score
- ✅ CBAHI
- ✅ NPHIES
- ✅ PDPL
- ✅ SFDA

## Special Features
- **HFA-ICOS Risk Stratification** — Low/Moderate/High/Very High
- **CTCAE v5.0** — Cardiotoxicity grading
- **GLS-guided Surveillance** — Early detection
- **ICI Myocarditis Detection** — IC-OS criteria
- **Cancer-Associated VTE** — DOAC vs LMWH
- **Cardiac Amyloid Workup**
- **Angiotensin / Beta-blocker / Statin Cardioprotection**
- **Dexrazoxane** — Anthracycline protection
- **Survivorship Care**
- **Multi-locale** — AR/EN/FR/UR
- **RAG Pipeline** — ESC/AHA/ASCO/NCCN/IC-OS
- **Vector Store** — pgvector + HNSW

## Files (51)
See TIER3_CARD-301_STROKE for template (same pattern).

## Quality Gates (6/6)
- [x] G1: Tests
- [x] G2: Security (STRIDE)
- [x] G3: RLS (FORCE on 4 tables + 1 vector)
- [x] G4: i18n (4 locales)
- [x] G5: RBAC (7-tier)
- [x] G6: Deploy (runbook)

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_303_onco_engine.js \
  namaweb/coo_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/coo', require('./coo_router')); } catch(e) { console.error('coo mount failed', e.message); }
```

## Next
- Wave 6 Batch 4: TIER3_CARD-304 (Robotic CV Surgery)
- Stage 3: 12 P0 gap closers
- Stage 4: Live wire-up + waves 132-145
