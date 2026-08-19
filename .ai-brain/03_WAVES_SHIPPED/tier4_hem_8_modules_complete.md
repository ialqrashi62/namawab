# TIER4_HEM 8 Modules Complete — 2026-08-15

## Wave Summary
TIER4_HEM-101..108 (8 hematology subspecialty modules shipped live)

## Modules
- 101 Anemia Workup (MCV/retic/ferritin/B12 classification)
- 102 Hemoglobinopathies (SCD pain + thalassemia)
- 103 Thrombosis (DVT + APS)
- 104 Anticoagulation (DOAC choice + reversal)
- 105 Platelet (thrombocytopenia + ITP)
- 106 Coagulopathy (DIC score)
- 107 MPN (stratify)
- 108 Transfusion (PRBC + platelet)

## Files
- 8 engines: tier4_hem_101..108_*_engine.js
- 8 routers: tier4_hem_101..108_*_router.js
- 8 migrations: e439..e446 (all RLS + tenant_id)
- 1 server mount (8 routes)

## Live Mounts
- /api/hemanemia/workup
- /api/hemoglobin/sc, /api/hemoglobin/thal
- /api/hemthromb/dvt, /api/hemthromb/aps
- /api/hemanticoag/doac, /api/hemanticoag/reversal
- /api/hemplatelet/thrombo, /api/hemplatelet/itp
- /api/hemcoag/dic
- /api/hemmpn/stratify
- /api/hemtransfuse/prbc, /api/hemtransfuse/plt

## Smoke
13/13 endpoints returned 200 OK after iterative enum/key field fix.

## Commits
- Inner: dfd7e383 (namaweb)
- Outer: b4923e39 (pointer)

## Pattern
Server uses generic tenant middleware that requires patient_id and validated fields.
Engines use enum validation with strict whitelist (e.g., 'afib', 'afib_old' are distinct).
Field names: dx (not diagnosis), hgb_g_dl (not hgb), severity (not bleed_severity),
procedure (not indication), platelet_count (not plat), etiology (not cause).

## Cumulative
Total Tier-4 routers: 78 (from 70 after HEM+8)
Total Tier-3 routers: 155
Grand total: 233 routers live
