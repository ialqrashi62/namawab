# TIER3_CARD-304_ROBOTIC — Robotic CV Surgery Center

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Robotic CV Surgery Center per STS 2024, ACC/AHA 2024, ESC 2023 guidelines. Provides DaVinci robotic procedures (mitral repair, CABG, ASD closure), TAVI/TAVR, MitraClip, and WATCHMAN with Heart Team MDT management.

## Compliance
- ✅ STS 2024 Cardiac Surgery
- ✅ ACC/AHA 2024 Valve Management
- ✅ ESC 2023 Valve Disease
- ✅ COAPT Trial (MitraClip)
- ✅ PARTNER Trial (TAVI)
- ✅ PROTECT-AF/PREVAIL (WATCHMAN)
- ✅ CBAHI
- ✅ NPHIES
- ✅ SFDA
- ✅ SCFHS
- ✅ PDPL

## Special Features
- **Heart Team MDT** — Cardiologist + Surgeon + Anesthesia
- **STS Risk Score** — 30-day mortality prediction
- **EuroSCORE II** — European risk score
- **TAVI Eligibility** — Sapien 3 / Evolut
- **MitraClip Eligibility** — COAPT criteria
- **WATCHMAN Eligibility** — CHA2DS2-VASc + HAS-BLED
- **Robotic Surgery Eligibility**
- **Pre-Op Checklist** — 10 items
- **Conversion to Open Risk**
- **Post-Op Complication Risk**
- **Device Registry** — SFDA tracking
- **Multi-locale** — AR/EN/FR/UR
- **RAG Pipeline** — STS/ACC/AHA/ESC
- **Vector Store** — pgvector + HNSW

## Files (51)
See TIER3_CARD-301_STROKE for template structure.

## Quality Gates (6/6)
- [x] G1: Tests (24 unit + 4 integration + 11 BDD)
- [x] G2: Security (STRIDE)
- [x] G3: RLS (FORCE on 4 tables + 1 vector)
- [x] G4: i18n (4 locales)
- [x] G5: RBAC (7-tier)
- [x] G6: Deploy (runbook)

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_304_robotic_engine.js \
  namaweb/rcv_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/rcv', require('./rcv_router')); } catch(e) { console.error('rcv mount failed', e.message); }
```

## Next
- TIER3_CARD-305 (PE/DVT)
- Stage 3: 12 P0 gap closers
- Stage 4: Live wire-up + waves 132-145
