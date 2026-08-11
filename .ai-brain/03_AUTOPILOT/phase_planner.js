# PHASE PLANNER — Roadmap → Phases → Deliverables

> Decomposes a roadmap into shippable phases with skills, agents, gates, ETA.

## Usage

```bash
node .ai-brain/03_AUTOPILOT/phase_planner.js \
  --roadmap="ship 122 depts" \
  --scope=14 \
  --budget_per_dept=60000
```

## Configuration

```yaml
# phase_planner.config.yaml
roadmap: "ship 122 depts"
phases_total: 14
depts_per_phase: 9
budget_per_dept_tokens: 60000
budget_per_phase_tokens: 540000
deliverables_per_dept:
  - engine.js
  - engine_test.js
  - router.js
  - router_test.js
  - migration_NN_up.sql
  - migration_NN_down.sql
  - route_schemas.js
  - index.html
  - queue.html
  - detail.html
  - form.html
  - settings.html
  - app.js
  - app.css
  - icon.svg
  - i18n_ar.json
  - i18n_en.json
  - i18n_fr.json
  - i18n_ur.json
skills_per_dept:
  - nm-sql-table-template
  - nm-engine-pattern
  - nm-router-middleware
  - nm-test-suite-default
  - nm-stitch-google
  - nm-deployment-cicd
agents_per_phase:
  generator: 3
  tester: 3
  auditor: 1
  deployer: 1
```

## Main planner

```javascript
// .ai-brain/03_AUTOPILOT/phase_planner.js
'use strict';

const fs = require('fs');
const path = require('path');

const DEPT_CATALOG = [
    // W01-W05 (already shipped)
    'cardiology', 'oncology', 'pediatrics', 'surgery', 'pharmacy', 'emergency',
    'endocrine', 'pulmonology', 'gi', 'rheumatology', 'orthopedics', 'neurology',
    'nephrology', 'obgyn',
    // W06
    'family_medicine', 'geriatrics', 'sports_medicine',
    // W07
    'dental', 'ophthalmology', 'ent',
    // W08
    'urology', 'plastic_surgery', 'vascular_surgery',
    // W09
    'thoracic_surgery', 'neurosurgery', 'trauma_surgery',
    // W10
    'anesthesia', 'pain_management', 'palliative_care',
    // W11
    'rehabilitation', 'physiotherapy', 'occupational_therapy',
    // W12
    'nutrition', 'psychiatry', 'sleep_medicine',
    // W13
    'genetics', 'immunology', 'allergy',
    // W14 (remaining 38)
    'infectious_disease', 'dermatology', 'radiology', 'pathology', 'nuclear_medicine',
    'hematology', 'audiology', 'speech_therapy', 'social_work', 'chaplaincy',
    'infection_control', 'wound_care', 'burn_unit', 'transplant', 'dialysis',
    'ivf', 'fetal_medicine', 'maternal_fetal', 'neonatology', 'nicu',
    'picu', 'icu', 'ccu', 'cicu', 'ctu',
    'cardiac_rehab', 'pulmonary_rehab', 'stroke_unit', 'memory_clinic', 'movement_disorders',
    'epilepsy', 'headache', 'multiple_sclerosis', 'neuro_oncology', 'movement'
];

const SHIPPED = new Set([
    'cardiology', 'oncology', 'pediatrics', 'surgery', 'pharmacy', 'emergency',
    'endocrine', 'pulmonology', 'gi', 'rheumatology', 'orthopedics', 'neurology',
    'nephrology', 'obgyn'
]);

function main() {
    const args = parseArgs();
    const scope = +args.scope || 14;
    const budgetPerDept = +args.budget_per_dept || 60000;

    const remaining = DEPT_CATALOG.filter(d => !SHIPPED.has(d));
    console.log(`[phase_planner] Total: ${DEPT_CATALOG.length}, Shipped: ${SHIPPED.size}, Remaining: ${remaining.length}`);

    const phases = [];
    for (let i = 0; i < remaining.length; i += scope) {
        const slice = remaining.slice(i, i + scope);
        const wave = Math.floor(i / scope) + 6;   // W06, W07, ...
        phases.push({
            id: `PCC_P3_PHASE_${String(wave).padStart(2, '0')}`,
            wave: `W${String(wave).padStart(2, '0')}`,
            name: slice.map(capitalize).join(' + '),
            depts: slice,
            deliverables: slice.length * 19,
            skills_per_dept: ['nm-sql-table-template', 'nm-engine-pattern', 'nm-router-middleware',
                              'nm-test-suite-default', 'nm-stitch-google', 'nm-deployment-cicd'],
            eta_wall_clock_min: slice.length * 18,    // ~18 min/dept via multi-agent
            tokens_estimate: slice.length * budgetPerDept
        });
    }

    // Output plan
    const planPath = path.join('.ai-brain', '03_AUTOPILOT', 'PHASE_PLAN.json');
    fs.writeFileSync(planPath, JSON.stringify(phases, null, 2));

    console.log(`\n=== PHASE PLAN (${phases.length} phases, ${remaining.length} depts) ===\n`);
    for (const p of phases) {
        console.log(`${p.id} ${p.wave}: ${p.name}`);
        console.log(`  depts: ${p.depts.join(', ')}`);
        console.log(`  deliverables: ${p.deliverables} files`);
        console.log(`  ETA: ${p.eta_wall_clock_min}m | Tokens: ~${(p.tokens_estimate / 1000).toFixed(0)}K`);
        console.log();
    }
    console.log(`Plan written to: ${planPath}`);
}

function capitalize(s) { return s.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }

function parseArgs() {
    const args = {};
    for (const a of process.argv.slice(2)) {
        const m = a.match(/^--([^=]+)=(.*)$/);
        if (m) args[m[1]] = m[2];
    }
    return args;
}

if (require.main === module) main();

module.exports = { DEPT_CATALOG, SHIPPED, main };
```

## Output

```json
[
  {
    "id": "PCC_P3_PHASE_06",
    "wave": "W06",
    "name": "Family Medicine + Geriatrics + Sports Medicine",
    "depts": ["family_medicine", "geriatrics", "sports_medicine"],
    "deliverables": 57,
    "skills_per_dept": ["nm-sql-table-template", "nm-engine-pattern", "nm-router-middleware",
                        "nm-test-suite-default", "nm-stitch-google", "nm-deployment-cicd"],
    "eta_wall_clock_min": 54,
    "tokens_estimate": 180000
  },
  ...
]
```

## Risk matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Migration fails on live | medium | high | sandbox first, backup always |
| Engine returns wrong value | low | critical | cite-based tests, golden fixtures |
| Router 500s on first deploy | medium | medium | try/catch wrapper, audit log |
| HTML breaks RTL/LTR | low | low | Material tokens, manual flip tested |
| Smoke test fails after deploy | medium | high | rollback script ready, 5-min SLA |
| Token budget exceeded | medium | medium | skip optional deliverables |

## Pair with

- `autopilot.js` — uses this plan as input
- `multi_agent.js` — executes each phase
- `quality_gates.js` — enforces acceptance per phase

## Token saving

Manual planning = ~400 lines per phase. With template = ~80 lines unique
(deliverables, risks). ~80% reduction.