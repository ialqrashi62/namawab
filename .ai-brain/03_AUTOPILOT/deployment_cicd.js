# DEPLOYMENT & ROLLBACK — 9-step pipeline

> Deploy to Hetzner live. Or rollback if smoke fails.

## Usage

```bash
# Deploy
node .ai-brain/03_AUTOPILOT/deployment_cicd.js \
  --action=deploy \
  --files="namaweb/family_engine.js,namaweb/family_router.js" \
  --migrations="namaweb/migrations/eNN_family_up.sql"

# Rollback
node .ai-brain/03_AUTOPILOT/deployment_cicd.js \
  --action=rollback \
  --backup=20260810_175657
```

## Main deployer

```javascript
// .ai-brain/03_AUTOPILOT/deployment_cicd.js
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SSH_KEY = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const SERVER = 'root@204.168.144.74';
const REMOTE_DIR = '/var/www/namaweb';

function ssh(cmd) {
    return execSync(
        `ssh -i "${SSH_KEY}" -o ConnectTimeout=15 -o BatchMode=yes -o StrictHostKeyChecking=no ${SERVER} '${cmd}'`,
        { encoding: 'utf8', stdio: 'pipe' }
    );
}

function scp(local, remote) {
    execSync(
        `scp -i "${SSH_KEY}" -o StrictHostKeyChecking=no ${local} ${SERVER}:${remote}`,
        { stdio: 'inherit' }
    );
}

function log(stage, msg) {
    console.log(`[${new Date().toISOString()}] [${stage}] ${msg}`);
}

// ============================================================
// DEPLOY
// ============================================================
async function deploy(args) {
    const files = (args.files || '').split(',').filter(Boolean);
    const migrations = (args.migrations || '').split(',').filter(Boolean);
    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);

    log('PREFLIGHT', 'git status...');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
        log('PREFLIGHT', `FAIL: uncommitted changes:\n${gitStatus}`);
        process.exit(1);
    }

    log('SNAPSHOT', `Creating backups with timestamp ${ts}...`);
    ssh(`cp ${REMOTE_DIR}/server.js /var/backups/server.js.before-deploy.${ts}`);
    ssh(`pg_dump --schema-only --no-owner nama_medical_web | gzip > /var/backups/schema.before-deploy.${ts}.sql.gz`);
    ssh(`pg_dump --data-only --no-owner nama_medical_web | gzip > /var/backups/data.before-deploy.${ts}.sql.gz`);

    log('SYNC', 'Uploading files...');
    const staging = `/tmp/staging-${ts}`;
    ssh(`mkdir -p ${staging}`);
    for (const f of files) {
        const localPath = path.resolve(f);
        if (!fs.existsSync(localPath)) { log('SYNC', `FAIL: ${f} not found`); process.exit(1); }
        const remoteName = path.basename(f);
        scp(localPath, `${staging}/${remoteName}`);
        log('SYNC', `  ✓ ${f}`);
    }

    log('MIGRATE', 'Applying migrations to live...');
    for (const m of migrations) {
        if (!fs.existsSync(m)) { log('MIGRATE', `FAIL: ${m} not found`); process.exit(1); }
        const mName = path.basename(m);
        scp(m, `${staging}/${mName}`);
        try {
            ssh(`psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable' -f ${staging}/${mName}`);
            log('MIGRATE', `  ✓ ${m}`);
        } catch (e) {
            log('MIGRATE', `FAIL: ${e.message.slice(0, 200)}`);
            log('MIGRATE', 'Auto-rollback triggered');
            await rollback({ backup: ts });
            process.exit(2);
        }
    }

    log('RESTART', 'Moving files + pm2 reload...');
    for (const f of files) {
        const remoteName = path.basename(f);
        ssh(`cp ${staging}/${remoteName} ${REMOTE_DIR}/${remoteName}`);
    }
    ssh(`pm2 reload nama-medical-erp`);
    ssh('sleep 5');

    log('VERIFY', 'Running smoke tests...');
    const checks = ['/api/health', ...files.filter(f => f.endsWith('_router.js')).map(f => `/api/${path.basename(f).replace('_router.js', '')}/health`)];
    for (const path of checks) {
        try {
            const r = execSync(`curl -sS -m 8 -o /dev/null -w '%{http_code}' https://jumanasoft.com${path}`, { encoding: 'utf8' });
            const code = +r.trim();
            if (code >= 500) {
                log('VERIFY', `FAIL: ${path} returned ${code}`);
                log('VERIFY', 'Auto-rollback triggered');
                await rollback({ backup: ts });
                process.exit(3);
            }
            log('VERIFY', `  ✓ ${path} → ${code}`);
        } catch (e) {
            log('VERIFY', `FAIL: ${path}: ${e.message.slice(0, 100)}`);
            await rollback({ backup: ts });
            process.exit(3);
        }
    }

    log('CLOSE', 'Cleaning up + CHANGELOG...');
    ssh(`rm -rf ${staging}`);

    const changelogPath = 'docs/CHANGELOG.md';
    if (fs.existsSync(changelogPath)) {
        const entry = `\n## [${ts}]\n\n### Deployed\n${files.map(f => `- ${f}`).join('\n')}\n${migrations.map(m => `- migration: ${path.basename(m)}`).join('\n')}\n`;
        fs.appendFileSync(changelogPath, entry);
    }

    log('DEPLOY', `SUCCESS — backup timestamp: ${ts}`);
}

// ============================================================
// ROLLBACK
// ============================================================
async function rollback(args) {
    const backup = args.backup;
    if (!backup) {
        log('ROLLBACK', 'FAIL: --backup=<timestamp> required');
        process.exit(1);
    }

    log('ROLLBACK', `Restoring from backup ${backup}...`);

    try {
        ssh(`pm2 stop nama-medical-erp`);
        ssh(`cp /var/backups/server.js.before-deploy.${backup} ${REMOTE_DIR}/server.js`);

        if (args.with_db === 'true') {
            ssh(`gunzip -c /var/backups/data.before-deploy.${backup}.sql.gz | \
                psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable'`);
        }

        ssh(`pm2 start nama-medical-erp`);
        ssh('sleep 5');

        const r = execSync(`curl -sS -m 8 -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/health`, { encoding: 'utf8' });
        if (+r.trim() !== 200) {
            log('ROLLBACK', `FAIL: post-rollback health check returned ${r}`);
            process.exit(1);
        }

        log('ROLLBACK', `SUCCESS — restored to ${backup}`);
    } catch (e) {
        log('ROLLBACK', `FAIL: ${e.message.slice(0, 200)}`);
        process.exit(2);
    }
}

function main() {
    const args = parseArgs();
    const action = args.action || 'deploy';

    if (action === 'deploy') deploy(args);
    else if (action === 'rollback') rollback(args);
    else { console.error(`Unknown action: ${action}`); process.exit(1); }
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

module.exports = { deploy, rollback };
```

## Pipeline stages

| Stage | What |
|---|---|
| PREFLIGHT | git status clean, branch correct |
| SNAPSHOT | backup server.js + schema + data |
| SYNC | upload files to staging dir |
| MIGRATE | apply migrations to live (rollback on fail) |
| RESTART | move files + pm2 reload |
| VERIFY | smoke tests against jumanasoft.com |
| CLOSE | cleanup + CHANGELOG entry |

## Pair with

- `nm-deployment-cicd` (skill) — describes the pipeline
- `nm-deployment-rollback` (skill) — describes rollback steps

## Token saving

Each deploy script from scratch = ~300 lines. With template = ~80 lines unique
(specific files, specific migrations). ~75% reduction.