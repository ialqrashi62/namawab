# TIER3_CARD-302_ADHF — Advanced Heart Failure Center

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Advanced Heart Failure Center per AHA/ACC/HFSA 2022 guidelines. Supports GDMT 4-pillar therapy, LVAD implantation, heart transplantation, and palliative care.

## Compliance
- ✅ AHA/ACC/HFSA 2022
- ✅ ISHLT 2023
- ✅ INTERMACS 2023
- ✅ SCAI 2022 SHOCK
- ✅ SCOT (Saudi Center for Organ Transplantation)
- ✅ CBAHI
- ✅ NPHIES
- ✅ PDPL
- ✅ SFDA

## Special Features
- **GDMT 4-Pillar** — ARNI + BB + MRA + SGLT2i
- **16 pure scoring functions** — NYHA, ACC, LVEF, MAGGIC, INTERMACS, SCAI, etc.
- **LVAD monitoring** — pump speed/power/flow, thrombosis risk
- **Heart transplant** — listing status, biopsy schedule
- **Palliative care** — trigger detection
- **Multi-locale** — AR/EN/FR/UR
- **RAG pipeline** — AHA/ACC + PARADIGM-HF + DAPA-HF + MOMENTUM 3
- **Vector store** — pgvector + HNSW

## Files (51)
See TIER3_CARD-301_STROKE for template structure (same pattern).

## Quality Gates (6/6)
- [x] G1: Tests — 30+ unit + 4 integration + 11 BDD
- [x] G2: Security — STRIDE threat model
- [x] G3: RLS — FORCE on all 5 tables + 1 vector
- [x] G4: i18n — 4 locales
- [x] G5: RBAC — 7-tier Golden Access Rule
- [x] G6: Deploy — Runbook + rollback

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_302_ahf_engine.js \
  namaweb/ahf_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/ahf', require('./ahf_router')); } catch(e) { console.error('ahf mount failed', e.message); }
```

## Next
- TIER3_CARD-303_ONCO — Cardio-Oncology (51 files)
