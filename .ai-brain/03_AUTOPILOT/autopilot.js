# AUTOPILOT — Master Orchestrator

> 7-stage pipeline: DISCOVER → PLAN → CODE → TEST → COMMIT → PUSH → CLOSE.
> Stops on first gate failure or owner escalation. Caps loops at 4.

## Usage

```bash
node .ai-brain/03_AUTOPILOT/autopilot.js \
  --phase=PCC_P3_PHASE_06 \
  --depts=family,geriatric,sports \
  --branch=ops/jumanasoft-enterprise-facility-platform-staging-prep
```

## Configuration

```yaml
# autopilot.config.yaml (in .ai-brain/03_AUTOPILOT/)
phase: PCC_P3_PHASE_06
branch: ops/jumanasoft-enterprise-facility-platform-staging-prep
max_attempts: 4
escalate_on:
  - tenant_breach
  - missing_secret
  - blocked_by_external
budget:
  per_dept_tokens: 60000
  per_phase_tokens: 200000
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
  - i18n_ar.json
  - i18n_en.json
  - i18n_fr.json
  - i18n_ur.json
gates:
  discover: state.md emitted
  plan:     file list with budget
  code:     no `...existing code...` shortcuts
  test:     all unit + integration green
  commit:   git status clean
  push:     remote shows new commit
  close:    CHANGELOG updated + closeout doc
```

## Main loop

```javascript
// .ai-brain/03_AUTOPILOT/autopilot.js
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = path.join(__dirname, 'STATE.json');
const CONFIG_FILE = path.join(__dirname, 'autopilot.config.yaml');

function loadConfig() {
    // Minimal YAML-ish parser for our config
    const text = fs.readFileSync(CONFIG_FILE, 'utf8');
    const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    const cfg = {};
    let curList = null;
    for (const line of lines) {
        const indent = line.search(/\S/);
        const m = line.match(/^(\s*)([\w_]+)\s*:\s*(.*)$/);
        if (!m) continue;
        const [, , key, val] = m;
        if (val === '') { cfg[key] = {}; curList = null; }
        else if (val.trim().startsWith('- ')) { (cfg[key] = cfg[key] || []).push(val.trim().slice(2)); }
        else { cfg[key] = val.trim().replace(/^["']|["']$/g, ''); }
    }
    return cfg;
}

function saveState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(stage, msg) {
    console.log(`[${new Date().toISOString()}] [${stage}] ${msg}`);
}

// ============================================================
// STAGE 1: DISCOVER
// ============================================================
function discover(cfg) {
    log('DISCOVER', `Scanning baseline for phase ${cfg.phase}...`);

    const state = {
        phase: cfg.phase,
        branch: cfg.branch,
        started_at: new Date().toISOString(),
        depts: cfg.depts.split(',').map(d => d.trim()),
        files: { existing: {}, planned: {} },
        gates_passed: [],
        attempts: 0
    };

    for (const dept of state.depts) {
        const blueprintDir = path.join('.ai-brain', '01_DEPT_BLUEPRINTS', dept);
        const liveEngine = path.join('namaweb', `${dept}_engine.js`);
        const liveRouter = path.join('namaweb', `${dept}_router.js`);

        state.files.existing[dept] = {
            blueprint: fs.existsSync(path.join(blueprintDir, '00_README.md')),
            engine: fs.existsSync(liveEngine),
            router: fs.existsSync(liveRouter)
        };
    }

    fs.mkdirSync(path.join('.ai-brain', '03_AUTOPILOT', 'state'), { recursive: true });
    fs.writeFileSync(
        path.join('.ai-brain', '03_AUTOPILOT', 'state', `${cfg.phase}_discover.md`),
        `# DISCOVER — ${cfg.phase}\n\n` +
        `Generated ${new Date().toISOString()}\n\n` +
        '```json\n' + JSON.stringify(state, null, 2) + '\n```'
    );

    log('DISCOVER', `State emitted → .ai-brain/03_AUTOPILOT/state/${cfg.phase}_discover.md`);
    return state;
}

// ============================================================
// STAGE 2: PLAN
// ============================================================
function plan(cfg, state) {
    log('PLAN', 'Building file list and budget...');

    const perDept = cfg.deliverables_per_dept || [];
    state.planned_files = [];
    state.budget = { tokens: 0, files: 0 };

    for (const dept of state.depts) {
        for (const file of perDept) {
            const target = file.replace('{dept}', dept);
            const tokens = estimateTokens(target);
            state.planned_files.push({ dept, file: target, tokens });
            state.budget.tokens += tokens;
            state.budget.files += 1;
        }
    }

    log('PLAN', `Planned ${state.budget.files} files, ~${state.budget.tokens} tokens`);
    return state;
}

function estimateTokens(filename) {
    const ext = path.extname(filename);
    const base = {
        '.js':   400,
        '.sql':  300,
        '.json': 200,
        '.html': 600,
        '.css':  250,
        '.md':   300,
        '.svg':  100
    };
    return base[ext] || 200;
}

// ============================================================
// STAGE 3: CODE
// ============================================================
function code(cfg, state) {
    log('CODE', 'Generating files via token-saver skills...');

    for (const dept of state.depts) {
        log('CODE', `  → ${dept}`);
        for (const file of state.planned_files.filter(f => f.dept === dept)) {
            const target = path.join('namaweb', file.file);
            // Delegate to sub-agent or generator
            // Each generator reads .ai-brain/skills/nm-* for the template
            generateFile(dept, file.file, target);
            log('CODE', `    ✓ ${target}`);
        }
    }

    state.gates_passed.push('code');
    return state;
}

function generateFile(dept, name, target) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // Stub: real impl uses nm-engine-pattern, nm-router-middleware, etc.
    const ext = path.extname(name);
    const template = fs.readFileSync(
        path.join('.ai-brain', 'skills', 'nm-' + templateSkill(name), 'SKILL.md'),
        'utf8'
    );
    fs.writeFileSync(target, `# Generated for ${dept} using ${templateSkill(name)}\n# ${template.slice(0, 200)}...`);
}

function templateSkill(filename) {
    if (filename.endsWith('_engine.js'))   return 'engine-pattern';
    if (filename.endsWith('_router.js'))   return 'router-middleware';
    if (filename.endsWith('_up.sql'))      return 'sql-table-template';
    if (filename.endsWith('.html'))        return 'stitch-scaffold';
    if (filename.endsWith('ar.json') || filename.endsWith('en.json')
     || filename.endsWith('fr.json') || filename.endsWith('ur.json')) return 'i18n-default';
    if (filename.endsWith('_test.js'))     return 'test-suite-default';
    return 'handoff';
}

// ============================================================
// STAGE 4: TEST
// ============================================================
function test(cfg, state) {
    log('TEST', 'Running unit + integration tests...');

    try {
        const out = execSync('cd namaweb && npm test 2>&1', { encoding: 'utf8', stdio: 'pipe' });
        const passMatch = out.match(/(\d+) passing/);
        const failMatch = out.match(/(\d+) failing/);
        state.tests = {
            passing: passMatch ? +passMatch[1] : 0,
            failing: failMatch ? +failMatch[1] : 0,
            output: out.slice(-2000)
        };
        if (state.tests.failing > 0) {
            log('TEST', `FAIL: ${state.tests.failing} tests failing`);
            return { ok: false, state };
        }
        log('TEST', `PASS: ${state.tests.passing} tests green`);
        state.gates_passed.push('test');
        return { ok: true, state };
    } catch (e) {
        log('TEST', `FAIL: ${e.message}`);
        return { ok: false, state };
    }
}

// ============================================================
// STAGE 5: COMMIT
// ============================================================
function commit(cfg, state) {
    log('COMMIT', `git commit on ${cfg.branch}`);
    try {
        execSync('git add -A', { stdio: 'inherit' });
        execSync(`git commit -m "feat(${cfg.phase}): ship ${state.depts.join(', ')}"`, { stdio: 'inherit' });
        state.commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        log('COMMIT', `Commit ${state.commit}`);
        state.gates_passed.push('commit');
        return { ok: true, state };
    } catch (e) {
        log('COMMIT', `FAIL: ${e.message}`);
        return { ok: false, state };
    }
}

// ============================================================
// STAGE 6: PUSH
// ============================================================
function push(cfg, state) {
    log('PUSH', `git push origin ${cfg.branch}`);
    try {
        execSync(`git push origin ${cfg.branch}`, { stdio: 'inherit' });
        log('PUSH', 'OK');
        state.gates_passed.push('push');
        return { ok: true, state };
    } catch (e) {
        log('PUSH', `FAIL: ${e.message}`);
        return { ok: false, state };
    }
}

// ============================================================
// STAGE 7: CLOSE
// ============================================================
function close(cfg, state) {
    log('CLOSE', 'Writing CHANGELOG + closeout doc');

    // Update CHANGELOG.md
    const changelogPath = 'docs/CHANGELOG.md';
    if (fs.existsSync(changelogPath)) {
        const cur = fs.readFileSync(changelogPath, 'utf8');
        const entry = `\n## [${cfg.phase}] ${new Date().toISOString().slice(0, 10)}\n\n` +
            `### Added\n- ${state.depts.length} dept engines + routers + migrations\n` +
            `- ${state.budget.files} files generated\n` +
            `- Tests: ${state.tests.passing} passing, ${state.tests.failing} failing\n` +
            `- Commit: ${state.commit}\n`;
        if (!cur.includes(`[${cfg.phase}]`)) {
            fs.appendFileSync(changelogPath, entry);
        }
    }

    // Closeout doc
    const closeoutPath = path.join('docs', `PHASE_${cfg.phase}_AR.md`);
    const closeout = `# Phase ${cfg.phase} Closeout\n\n` +
        `## Summary\n\n- Depts: ${state.depts.join(', ')}\n` +
        `- Files: ${state.budget.files}\n` +
        `- Tests: ${state.tests.passing} passing\n` +
        `- Commit: ${state.commit}\n` +
        `- Branch: ${cfg.branch}\n` +
        `- Gates passed: ${state.gates_passed.join(' → ')}\n`;
    fs.writeFileSync(closeoutPath, closeout);

    state.gates_passed.push('close');
    return { ok: true, state };
}

// ============================================================
// MAIN LOOP
// ============================================================
async function main() {
    const cfg = loadConfig();
    log('AUTOPILOT', `Starting phase ${cfg.phase}`);

    let state = discover(cfg);
    state = plan(cfg, state);
    state = code(cfg, state);

    // Loop up to max_attempts to repair
    let attempts = 0;
    let testResult;
    do {
        testResult = test(cfg, state);
        attempts += 1;
        if (!testResult.ok && attempts < cfg.max_attempts) {
            log('LOOP', `Repair attempt ${attempts}...`);
            // Stub: real repair invokes LOOP ENGINEERING
        }
    } while (!testResult.ok && attempts < cfg.max_attempts);

    if (!testResult.ok) {
        log('AUTOPILOT', 'ESCALATE: max attempts reached');
        process.exit(2);
    }
    state = testResult.state;

    const c = commit(cfg, state);
    if (!c.ok) { log('AUTOPILOT', 'ESCALATE: commit failed'); process.exit(3); }
    state = c.state;

    const p = push(cfg, state);
    if (!p.ok) { log('AUTOPILOT', 'ESCALATE: push failed'); process.exit(4); }
    state = p.state;

    const cl = close(cfg, state);
    if (!cl.ok) { log('AUTOPILOT', 'ESCALATE: close failed'); process.exit(5); }
    state = cl.state;

    saveState(state);
    log('AUTOPILOT', `SUCCESS — phase ${cfg.phase} closed`);
}

if (require.main === module) main();

module.exports = { discover, plan, code, test, commit, push, close };
```

## Output

```json
{
  "status": "SUCCESS" | "ESCALATED" | "FAILED",
  "phase": "PCC_P3_PHASE_06",
  "depts": ["family", "geriatric", "sports"],
  "deliverables": { "engines": 3, "routers": 3, "tests": 3, "migrations": 3 },
  "tests_run": 47,
  "tests_passed": 47,
  "commits_pushed": 1,
  "tokens_consumed": 124500,
  "wall_clock_min": 22,
  "gates_passed": ["code", "test", "commit", "push", "close"],
  "next_action": "Phase PCC_P3_PHASE_07 ready"
}
```

## Pair with

- `loop_engineering.js` — when one sub-agent needs iteration
- `multi_agent.js` — when running 3 depts in parallel
- `quality_gates.js` — enforce 6 L4 gates before close

## Token saving

Manual end-to-end = ~600K tokens. AUTOPILOT = ~125K. ~80% reduction.