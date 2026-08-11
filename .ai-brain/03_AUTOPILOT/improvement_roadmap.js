# IMPROVEMENT ROADMAP — Prioritize fixes

> Ranks improvements by (impact × safety × urgency) / (effort × risk).
> Outputs wave-by-wave rollout plan with SQL/code templates.

## Usage

```bash
node .ai-brain/03_AUTOPILOT/improvement_roadmap.js \
  --improvements=improvements.yaml \
  --report=roadmap_quarter.md
```

## Configuration

```yaml
# improvements.yaml
improvements:
  - id: IMP-001
    title: "Add FORCE RLS to patient_insurance table"
    description: "patient_insurance has RLS but not FORCE_RLS. Table owner bypasses."
    impact: 5
    safety_relevance: 5
    urgency: 5
    effort: 1
    risk: 1
    files: [namaweb/migrations/eNN_force_rls_up.sql]
    eta_minutes: 5

  - id: IMP-002
    title: "Migrate hardcoded ICU strings to i18n keys"
    description: "Hardcoded Arabic in icu-station.js"
    impact: 2
    safety_relevance: 1
    urgency: 2
    effort: 2
    risk: 1
    files: [namaweb/public/js/icu-station.js]
    eta_minutes: 30
```

## Main scorer

```javascript
// .ai-brain/03_AUTOPILOT/improvement_roadmap.js
'use strict';

const fs = require('fs');
const path = require('path');

function loadImprovements(filePath) {
    // Minimal YAML-ish parser
    const text = fs.readFileSync(filePath, 'utf8');
    const improvements = [];
    let cur = null;
    for (const line of text.split('\n')) {
        const m = line.match(/^\s*-\s+id:\s*['"]?([^'"]+)['"]?/);
        if (m) { if (cur) improvements.push(cur); cur = { id: m[1] }; continue; }
        const kv = line.match(/^\s+(\w+):\s*(.+)$/);
        if (kv && cur) {
            const [, key, val] = kv;
            cur[key] = isNaN(+val) ? val.replace(/^["']|["']$/g, '') : +val;
        }
    }
    if (cur) improvements.push(cur);
    return improvements;
}

function score(imp) {
    // score = (impact × safety × urgency) / (effort × risk)
    const num = (imp.impact || 1) * (imp.safety_relevance || 1) * (imp.urgency || 1);
    const den = (imp.effort || 1) * (imp.risk || 1);
    return +(num / den).toFixed(2);
}

function priority(score) {
    if (score >= 12) return 'P0';
    if (score >= 6)  return 'P1';
    if (score >= 3)  return 'P2';
    if (score >= 1)  return 'P3';
    return 'P4';
}

function planWaves(improvements) {
    const scored = improvements.map(i => ({ ...i, score: score(i), priority: priority(score(i)) }));
    scored.sort((a, b) => b.score - a.score);

    const waves = { P0: [], P1: [], P2: [], P3: [], P4: [] };
    for (const i of scored) waves[i.priority].push(i);
    return { scored, waves };
}

function renderReport(plan) {
    const lines = ['# Improvement Roadmap\n'];
    lines.push(`## Summary\n`);
    lines.push(`- Total: ${plan.scored.length} improvements`);
    lines.push(`- P0: ${plan.waves.P0.length}, P1: ${plan.waves.P1.length}, P2: ${plan.waves.P2.length}, P3: ${plan.waves.P3.length}, P4: ${plan.waves.P4.length}\n`);

    for (const prio of ['P0', 'P1', 'P2', 'P3', 'P4']) {
        if (plan.waves[prio].length === 0) continue;
        lines.push(`## ${prio} (${plan.waves[prio].length} items)\n`);
        lines.push('| ID | Title | Score | ETA |');
        lines.push('|---|---|---|---|');
        for (const i of plan.waves[prio]) {
            lines.push(`| ${i.id} | ${i.title} | ${i.score} | ${i.eta_minutes || '?'}m |`);
        }
        lines.push('');
    }

    lines.push('## Done criteria');
    lines.push('- All IMPs verified via SQL query or test');
    lines.push('- All IMPs tested (smoke + integration)');
    lines.push('- CHANGELOG.md updated');
    lines.push('- docs/ROADMAP_QUARTER.md created');

    return lines.join('\n');
}

function main() {
    const args = parseArgs();
    const inputFile = args.improvements || 'improvements.yaml';
    const reportFile = args.report || 'roadmap_latest.md';

    if (!fs.existsSync(inputFile)) {
        console.error(`File not found: ${inputFile}`);
        process.exit(1);
    }

    const improvements = loadImprovements(inputFile);
    const plan = planWaves(improvements);
    const report = renderReport(plan);

    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
    fs.writeFileSync(reportFile, report);

    console.log(`\n=== IMPROVEMENT ROADMAP ===\n`);
    console.log(report);
    console.log(`\nWritten to: ${reportFile}`);
}

function parseArgs() {
    const args = {};
    for (const a of process.argv.slice(2)) {
        const m = a.match(/^--([^=]+)=(.*)$/);
        if (m) args[m[1]] = m[2];
    }
    return args;
}

if (require.main === module) main();

module.exports = { score, priority, planWaves };
```

## Priority formula

```
score = (impact × safety_relevance × urgency) / (effort × risk)
```

| Score | Priority |
|---|---|
| ≥ 12 | P0 (this sprint) |
| 6-11.9 | P1 (next sprint) |
| 3-5.9 | P2 (this quarter) |
| 1-2.9 | P3 (next quarter) |
| < 1 | P4 (backlog) |

## Output

```
=== IMPROVEMENT ROADMAP ===

# Improvement Roadmap

## Summary
- Total: 47 improvements
- P0: 8, P1: 12, P2: 18, P3: 9, P4: 0

## P0 (8 items)

| ID | Title | Score | ETA |
|---|---|---|---|
| IMP-001 | Add FORCE RLS to patient_insurance | 25.0 | 5m |
| IMP-005 | Add tenant scope check | 18.0 | 30m |
| IMP-007 | Fix hardcoded JWT secret | 15.0 | 15m |
| IMP-010 | PDPL consent capture | 14.0 | 4h |
| ... | | | |

## Done criteria
- All IMPs verified via SQL query or test
- All IMPs tested (smoke + integration)
- CHANGELOG.md updated
- docs/ROADMAP_QUARTER.md created
```

## Pair with

- `system_gap_audit.js` — feeds improvements to this scorer
- `phase_planner.js` — uses P0/P1 in next phase

## Token saving

Each roadmap from scratch = ~400 lines. With template = ~80 lines unique
(specific IMPs, specific scores). ~80% reduction.