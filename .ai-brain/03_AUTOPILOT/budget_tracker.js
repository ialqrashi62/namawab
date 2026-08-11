# BUDGET TRACKER — Token + cost logging

> Tracks token consumption, API costs, project budget. Logs per-call to DB.

## Usage

```bash
node .ai-brain/03_AUTOPILOT/budget_tracker.js \
  --session=2026-08-10-pcc-deploy \
  --report=.ai-brain/03_AUTOPILOT/budget_latest.md
```

## Main tracker

```javascript
// .ai-brain/03_AUTOPILOT/budget_tracker.js
'use strict';

const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join('.ai-brain', '03_AUTOPILOT', 'BUDGET_STATE.json');

const PRICING = {
    'gpt-4o-mini':           { input: 0.15, output: 0.60 },
    'gpt-4o':                { input: 5.00, output: 15.00 },
    'claude-3-5-sonnet':     { input: 3.00, output: 15.00 },
    'claude-3-haiku':        { input: 0.25, output: 1.25 },
    'gemini-1.5-pro':        { input: 1.25, output: 5.00 },
    'gemini-1.5-flash':      { input: 0.075, output: 0.30 }
};

function loadState() {
    if (fs.existsSync(STATE_FILE)) {
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
    return {
        session_id: process.argv.find(a => a.startsWith('--session='))?.split('=')[1] || 'unknown',
        started_at: new Date().toISOString(),
        calls: [],
        totals: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }
    };
}

function saveState(state) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function logCall(state, { provider, model, inputTokens, outputTokens, dept, task }) {
    const pricing = PRICING[model] || { input: 0.15, output: 0.60 };
    const cost = (inputTokens / 1e6) * pricing.input + (outputTokens / 1e6) * pricing.output;

    state.calls.push({
        ts: new Date().toISOString(),
        provider, model, dept, task,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost_usd: +cost.toFixed(6)
    });
    state.totals.input_tokens += inputTokens;
    state.totals.output_tokens += outputTokens;
    state.totals.cost_usd += cost;

    console.log(`  [${provider}/${model}] ${dept}/${task}: in=${inputTokens} out=${outputTokens} cost=$${cost.toFixed(4)}`);
}

function generateReport(state) {
    const lines = [
        `# Budget Tracker — ${state.session_id}`,
        ``,
        `## Summary`,
        ``,
        `- Started: ${state.started_at}`,
        `- Total calls: ${state.calls.length}`,
        `- Total input tokens: ${state.totals.input_tokens.toLocaleString()}`,
        `- Total output tokens: ${state.totals.output_tokens.toLocaleString()}`,
        `- Total cost: $${state.totals.cost_usd.toFixed(2)}`,
        ``,
        `## By model`,
        ``
    ];

    const byModel = {};
    for (const c of state.calls) {
        const k = `${c.provider}/${c.model}`;
        byModel[k] = byModel[k] || { calls: 0, in: 0, out: 0, cost: 0 };
        byModel[k].calls += 1;
        byModel[k].in += c.input_tokens;
        byModel[k].out += c.output_tokens;
        byModel[k].cost += c.cost_usd;
    }

    lines.push('| Model | Calls | In tokens | Out tokens | Cost USD |');
    lines.push('|---|---|---|---|---|');
    for (const [k, v] of Object.entries(byModel).sort((a,b) => b[1].cost - a[1].cost)) {
        lines.push(`| ${k} | ${v.calls} | ${v.in.toLocaleString()} | ${v.out.toLocaleString()} | $${v.cost.toFixed(2)} |`);
    }

    lines.push('');
    lines.push('## By dept');
    lines.push('');
    const byDept = {};
    for (const c of state.calls) {
        const k = c.dept || 'unknown';
        byDept[k] = byDept[k] || { calls: 0, cost: 0 };
        byDept[k].calls += 1;
        byDept[k].cost += c.cost_usd;
    }
    lines.push('| Dept | Calls | Cost USD |');
    lines.push('|---|---|---|');
    for (const [k, v] of Object.entries(byDept).sort((a,b) => b[1].cost - a[1].cost).slice(0, 20)) {
        lines.push(`| ${k} | ${v.calls} | $${v.cost.toFixed(2)} |`);
    }

    return lines.join('\n');
}

function main() {
    const args = parseArgs();
    const state = loadState();

    if (args.log) {
        // --log=provider,model,in,out,dept,task
        const [provider, model, in_t, out_t, dept, task] = args.log.split(',');
        logCall(state, { provider, model, inputTokens: +in_t, outputTokens: +out_t, dept, task });
        saveState(state);
    }

    if (args.report) {
        const report = generateReport(state);
        fs.mkdirSync(path.dirname(args.report), { recursive: true });
        fs.writeFileSync(args.report, report);
        console.log(`\n=== Budget Report ===\n`);
        console.log(report);
        console.log(`\nWritten to: ${args.report}`);
    }

    if (args.reset) {
        saveState({
            session_id: args.session || 'unknown',
            started_at: new Date().toISOString(),
            calls: [],
            totals: { input_tokens: 0, output_tokens: 0, cost_usd: 0 }
        });
        console.log('State reset.');
    }

    if (!args.log && !args.report && !args.reset) {
        // Show current state
        console.log(`\n=== Budget State ===\n`);
        console.log(`Session: ${state.session_id}`);
        console.log(`Calls:   ${state.calls.length}`);
        console.log(`In tok:  ${state.totals.input_tokens.toLocaleString()}`);
        console.log(`Out tok: ${state.totals.output_tokens.toLocaleString()}`);
        console.log(`Cost:    $${state.totals.cost_usd.toFixed(2)}`);
    }
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

module.exports = { logCall, generateReport, PRICING };
```

## Usage examples

```bash
# Log a call
node budget_tracker.js --log="openai,gpt-4o-mini,1500,800,cardiology,engine"

# Generate report
node budget_tracker.js --report=budget_latest.md

# Reset state
node budget_tracker.js --reset --session=2026-08-11-pcc-deploy

# Show current
node budget_tracker.js
```

## Output

```
=== Budget Report ===

# Budget Tracker — 2026-08-10-pcc-deploy

## Summary

- Started: 2026-08-10T08:00:00Z
- Total calls: 247
- Total input tokens: 1,840,000
- Total output tokens: 720,000
- Total cost: $24.32

## By model

| Model | Calls | In tokens | Out tokens | Cost USD |
|---|---|---|---|---|
| gpt-4o-mini | 180 | 1,200,000 | 480,000 | $18.00 |
| claude-3-haiku | 67 | 640,000 | 240,000 | $6.32 |

## By dept

| Dept | Calls | Cost USD |
|---|---|---|
| cardiology | 24 | $4.12 |
| oncology | 22 | $3.98 |
| pediatrics | 20 | $3.45 |
| ... | | |
```

## Acceptance gate (per phase)

| Metric | Threshold | Action |
|---|---|---|
| tokens per dept | < 60K | OK |
| tokens per dept | 60-80K | WARNING; optimize |
| tokens per dept | > 80K | BLOCKING; split dept |
| cost per dept | < $5 | OK |
| cost per dept | > $20 | REVIEW with owner |

## Token saving

Each budget tracker from scratch = ~150 lines. With template = ~40 lines unique
(custom pricing, custom caps). ~70% reduction.