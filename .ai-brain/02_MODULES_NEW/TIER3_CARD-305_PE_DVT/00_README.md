# TIER3_CARD-305_PE_DVT — PE/DVT Response Team

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

PE/DVT Response Team per ESC 2019, ACC 2024, AHA 2024 guidelines. Provides PERT activation, risk stratification, thrombolysis, catheter-directed therapy, mechanical thrombectomy, IVC filter, anticoagulation, and CTEPH workup.

## Compliance
- ✅ ESC 2019 PE
- ✅ ACC 2024 PE
- ✅ AHA 2024 PE
- ✅ CHEST 2024 Antithrombotic
- ✅ ISHLT CTEPH
- ✅ CBAHI
- ✅ NPHIES
- ✅ SFDA
- ✅ PDPL

## Special Features
- **PERT Activation** — Multi-disciplinary team
- **sPESI / PESI** — Risk stratification
- **Wells DVT/PE** — Pre-test probability
- **Severity Tiers** — Massive/Submassive/Low
- **Thrombolysis Eligibility** — Alteplase / Tenecteplase
- **Catheter-Directed Therapy** — EKOS
- **Mechanical Thrombectomy** — FlowTriever / Indigo
- **IVC Filter** — Retrievable
- **Anticoagulation Choice** — DOAC/Warfarin/LMWH
- **CTEPH Workup**
- **Multi-locale** — AR/EN/FR/UR
- **RAG Pipeline** — ESC/AHA/CHEST
- **Vector Store** — pgvector + HNSW

## Files (51)
See TIER3_CARD-301_STROKE for template.

## Quality Gates (6/6)
- [x] G1: Tests
- [x] G2: Security
- [x] G3: RLS (FORCE on 3 tables)
- [x] G4: i18n (4 locales)
- [x] G5: RBAC
- [x] G6: Deploy

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_305_pe_dvt_engine.js \
  namaweb/pedvt_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/pedvt', require('./pedvt_router')); } catch(e) { console.error('pedvt mount failed', e.message); }
```
