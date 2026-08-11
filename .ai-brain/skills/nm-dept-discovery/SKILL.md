# nm-dept-discovery — Department Discovery & Gap Analyzer

> Audits the existing NamaMedical codebase and identifies:
> - Stations present (frontend JS files)
> - Engines present (backend classes)
> - Routes wired (server.js)
> - Migrations applied
> - Tests written
> - .ai-brain coverage
>
> Outputs: gap list + suggested next steps.

---

## 1. Discovery Pattern

```bash
node .ai-brain/03_AUTOPILOT/discovery.js \
  --workspace c:/Users/ice/Desktop/NMEDCALVSCODE \
  --out .ai-brain/99-state/discovery_<date>.json
```

---

## 2. Discovery Output Schema

```yaml
discovery:
  date: 2026-08-08
  workspace: c:/Users/ice/Desktop/NMEDCALVSCODE

  summary:
    total_depts_in_master_catalog: 60
    depts_with_station: 31
    depts_with_engine: 21
    depts_with_routes: 38
    depts_with_migrations: 50
    depts_with_tests: 35
    depts_with_aibrain: 50
    depts_complete_35_files: 0
    avg_files_per_dept: 8

  depts:
    - code: DEP-001
      name: Cardiology
      station: ✓
      engine: ✓
      routes: 5
      migrations: 3
      tests: 4
      aibrain_files: 8
      status: partial
      gap: [35 files needed for full blueprint, no RAG chain, no i18n, no Stitch UI]

  missing_stations:
    - cardiac-cath-lab
    - endoscopy
    - sleep-medicine
    - dialysis
    - fertility
    ... (19 stations)

  missing_engines:
    - cardiology_engine (DONE - exists)
    - endoscopy_engine
    - sleep_engine
    - dialysis_engine
    - fertility_engine
    ... (30 engines)

  missing_routes_in_server:
    - /api/cardiac-cath/*
    - /api/endoscopy/*
    ... (per missing dept)

  priority_queue:
    - dept: cardiac-cath-lab
      impact: HIGH
      effort: MEDIUM
      reason: cardiology-station exists but no cath lab sub-module
    - dept: endoscopy
      impact: HIGH
      effort: MEDIUM
      reason: GI subspecialty, no coverage
```

---

## 3. Gap Analysis Logic

| Status | Criteria |
|---|---|
| COMPLETE | All of: station + engine + routes + migrations + tests + 35 files |
| PARTIAL | 4-5 of the above |
| MINIMAL | 1-3 of the above |
| ABSENT | 0 |

---

## 4. Priority Scoring

```
impact_score = (patients_per_year) * (revenue_per_patient) * (clinical_risk_weight)
effort_score = (lines_of_code_estimate) * (testing_complexity)
priority = impact_score / effort_score
```

---

## 5. Discovery Command (Node.js)

```javascript
// filepath: .ai-brain/03_AUTOPILOT/discovery.js
const fs = require('fs');
const path = require('path');

const WORKSPACE = process.argv[2] || 'c:/Users/ice/Desktop/NMEDCALVSCODE';
const OUT = process.argv[3] || '.ai-brain/99-state/discovery.json';

const result = {
  date: new Date().toISOString().split('T')[0],
  workspace: WORKSPACE,
  summary: {},
  depts: [],
  missing_stations: [],
  missing_engines: [],
  missing_routes: [],
  priority_queue: []
};

// 1. Scan stations
const stationsDir = path.join(WORKSPACE, 'namaweb/public/js');
const stations = fs.readdirSync(stationsDir).filter(f => f.endsWith('-station.js')).map(f => f.replace('-station.js', ''));
result.summary.depts_with_station = stations.length;

// 2. Scan engines
const engines = fs.readdirSync(WORKSPACE).filter(f => /_engine\.js$/.test(f)).map(f => f.replace('_engine.js', ''));
result.summary.depts_with_engine = engines.length;

// 3. Scan migrations
const migDir = path.join(WORKSPACE, 'namaweb/migrations');
const migrations = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).length;
result.summary.depts_with_migrations = migrations;

// 4. Scan tests
const tests = fs.readdirSync(WORKSPACE).filter(f => /_test\.js$/.test(f)).length;
result.summary.depts_with_tests = tests;

// 5. Scan .ai-brain/02_MODULES
const modsDir = path.join(WORKSPACE, '.ai-brain/02_MODULES');
let aibrainFiles = 0;
if (fs.existsSync(modsDir)) {
  for (const d of fs.readdirSync(modsDir)) {
    aibrainFiles += fs.readdirSync(path.join(modsDir, d)).length;
  }
}
result.summary.aibrain_files = aibrainFiles;

// 6. Priority queue (simple sort)
result.priority_queue = [
  { dept: 'cardiology', impact: 'HIGH', effort: 'MEDIUM', score: 0.9 },
  { dept: 'endocrinology', impact: 'HIGH', effort: 'MEDIUM', score: 0.85 },
  ...
];

fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
console.log(`Discovery written to ${OUT}`);
```

---

## 6. Usage in Loop Engineering

1. Run discovery
2. Parse `priority_queue`
3. For each priority dept: `nm-ultimate-blueprint-factory` + `nm-loop-engineering-v2`
4. Re-run discovery to verify gap closed

---

## 7. Integration
- **Drives:** `nm-loop-engineering-v2` (which dept to fix next)
- **Output:** `.ai-brain/99-state/discovery_<date>.json`
- **Used by:** `nm-autopilot-dept-generator` (decides batch order)
