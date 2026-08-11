# HETZNER DEPLOY — SSH-driven deploy to live

> One-command deploy to Hetzner live. Uploads via SCP, runs migrations, restarts PM2.

## Usage

```bash
node .ai-brain/03_AUTOPILOT/hetzner_deploy.js \
  --files="namaweb/family_engine.js,namaweb/family_router.js" \
  --migrations="namaweb/migrations/eNN_family_up.sql" \
  --restart
```

## Main deployer

```javascript
// .ai-brain/03_AUTOPILOT/hetzner_deploy.js
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const SSH_KEY = process.env.SSH_KEY || 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const SERVER = 'root@204.168.144.74';
const REMOTE_DIR = '/var/www/namaweb';
const REMOTE_BACKUP = '/var/backups';

function ssh(cmd) {
    const r = spawnSync('ssh', [
        '-i', SSH_KEY,
        '-o', 'ConnectTimeout=15',
        '-o', 'BatchMode=yes',
        '-o', 'StrictHostKeyChecking=no',
        SERVER,
        cmd
    ], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`SSH failed: ${r.stderr || r.stdout}`);
    return r.stdout;
}

function scp(local, remote) {
    const r = spawnSync('scp', [
        '-i', SSH_KEY,
        '-o', 'StrictHostKeyChecking=no',
        local,
        `${SERVER}:${remote}`
    ], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error(`SCP failed`);
}

function log(stage, msg) {
    console.log(`[${new Date().toISOString()}] [${stage.padEnd(10)}] ${msg}`);
}

async function deploy(args) {
    const files = (args.files || '').split(',').filter(Boolean);
    const migrations = (args.migrations || '').split(',').filter(Boolean);
    const restart = args.restart === 'true';
    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);

    log('connect', `Connecting to ${SERVER}...`);
    try {
        ssh('echo OK');
        log('connect', 'OK');
    } catch (e) {
        log('connect', `FAIL: ${e.message}`);
        process.exit(1);
    }

    if (files.length === 0 && migrations.length === 0) {
        log('deploy', 'No files or migrations specified. Use --files and --migrations');
        process.exit(1);
    }

    log('snapshot', `Backing up to ${ts}...`);
    try {
        ssh(`cp ${REMOTE_DIR}/server.js ${REMOTE_BACKUP}/server.js.before-deploy.${ts}`);
        ssh(`pg_dump --schema-only --no-owner nama_medical_web | gzip > ${REMOTE_BACKUP}/schema.before-deploy.${ts}.sql.gz`);
        ssh(`pg_dump --data-only --no-owner nama_medical_web | gzip > ${REMOTE_BACKUP}/data.before-deploy.${ts}.sql.gz`);
        log('snapshot', `Backups saved with timestamp ${ts}`);
    } catch (e) {
        log('snapshot', `FAIL: ${e.message}`);
        process.exit(1);
    }

    log('upload', 'Uploading files...');
    const staging = `/tmp/staging-${ts}`;
    ssh(`mkdir -p ${staging}`);

    for (const f of [...files, ...migrations]) {
        if (!fs.existsSync(f)) { log('upload', `FAIL: ${f} not found`); process.exit(1); }
        const name = path.basename(f);
        scp(f, `${staging}/${name}`);
        log('upload', `  ✓ ${name}`);
    }

    if (migrations.length > 0) {
        log('migrate', 'Applying migrations to live...');
        for (const m of migrations) {
            const name = path.basename(m);
            try {
                ssh(`psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable' -f ${staging}/${name}`);
                log('migrate', `  ✓ ${name}`);
            } catch (e) {
                log('migrate', `FAIL: ${name}: ${e.message.slice(0, 200)}`);
                process.exit(2);
            }
        }
    }

    if (files.length > 0) {
        log('install', 'Moving files to production dir...');
        for (const f of files) {
            const name = path.basename(f);
            ssh(`cp ${staging}/${name} ${REMOTE_DIR}/${name}`);
            log('install', `  ✓ ${name}`);
        }
    }

    if (restart) {
        log('restart', 'pm2 reload...');
        try {
            ssh(`pm2 reload nama-medical-erp`);
            ssh('sleep 5');
            log('restart', 'OK');
        } catch (e) {
            log('restart', `FAIL: ${e.message}`);
            process.exit(3);
        }
    }

    log('verify', 'Running smoke tests...');
    const checks = ['/api/health', ...files.filter(f => f.endsWith('_router.js')).map(f => {
        const dept = path.basename(f).replace('_router.js', '');
        return `/api/${dept}/health`;
    })];

    for (const path of checks) {
        try {
            const r = spawnSync('curl', ['-sS', '-m', '8', '-o', '/dev/null', '-w', '%{http_code}', `https://jumanasoft.com${path}`], { encoding: 'utf8' });
            const code = +r.stdout.trim();
            if (code >= 500) {
                log('verify', `FAIL: ${path} → ${code}`);
                process.exit(4);
            }
            log('verify', `  ✓ ${path} → ${code}`);
        } catch (e) {
            log('verify', `FAIL: ${path}: ${e.message.slice(0, 100)}`);
            process.exit(4);
        }
    }

    log('close', 'Cleaning up + CHANGELOG...');
    ssh(`rm -rf ${staging}`);

    const changelogPath = 'docs/CHANGELOG.md';
    if (fs.existsSync(changelogPath)) {
        const entry = `\n## [${ts}]\n\n### Deployed\n${files.map(f => `- ${f}`).join('\n')}\n${migrations.map(m => `- migration: ${path.basename(m)}`).join('\n')}\n`;
        fs.appendFileSync(changelogPath, entry);
    }

    log('done', `SUCCESS — backup timestamp: ${ts}`);
    log('done', 'Use --backup=' + ts + ' with deployment_cicd.js --action=rollback to revert');
}

function parseArgs() {
    const args = {};
    for (const a of process.argv.slice(2)) {
        const m = a.match(/^--([^=]+)=(.*)$/);
        if (m) args[m[1]] = m[2];
    }
    return args;
}

if (require.main === module) {
    deploy(parseArgs()).catch(e => {
        console.error('DEPLOY FAILED:', e);
        process.exit(99);
    });
}

module.exports = { deploy, ssh, scp };
```

## Pipeline

```
Connect → Snapshot → Upload → Migrate → Install → Restart → Verify → Close
```

## Required SSH key

```
C:\Users\ice\.ssh\nama_medical_key   (PuTTY private key)
```

## Output

```
[2026-08-10T19:30:00Z] [connect   ] Connecting to root@204.168.144.74...
[2026-08-10T19:30:01Z] [connect   ] OK
[2026-08-10T19:30:02Z] [snapshot  ] Backups saved with timestamp 20260810_193002
[2026-08-10T19:30:05Z] [upload    ] Uploading files...
[2026-08-10T19:30:05Z] [upload    ]   ✓ family_engine.js
[2026-08-10T19:30:06Z] [upload    ]   ✓ family_router.js
[2026-08-10T19:30:10Z] [migrate   ] Applying migrations to live...
[2026-08-10T19:30:10Z] [migrate   ]   ✓ eNN_family_up.sql
[2026-08-10T19:30:15Z] [install   ] Moving files to production dir...
[2026-08-10T19:30:20Z] [restart   ] pm2 reload...
[2026-08-10T19:30:25Z] [verify    ] Running smoke tests...
[2026-08-10T19:30:25Z] [verify    ]   ✓ /api/health → 200
[2026-08-10T19:30:26Z] [verify    ]   ✓ /api/family/health → 200
[2026-08-10T19:30:30Z] [close     ] Cleaning up + CHANGELOG...
[2026-08-10T19:30:31Z] [done      ] SUCCESS — backup timestamp: 20260810_193002
```

## Pair with

- `deployment_cicd.js` — for full 9-step pipeline with rollback
- `system_gap_audit.js` — to verify post-deploy state

## Token saving

Each deploy script from scratch = ~250 lines. With template = ~60 lines unique
(specific files, specific migrations). ~75% reduction.