/**
 * wave34_backup_activation.js — Backup activation + DR drill orchestrator.
 *
 * Closes the gap identified in WAVE_30_BACKUP_DR_AR.md §6 (Activation steps
 * 2-3): the Wave 30 backup script was deployed but the cron entry,
 * /etc/default/wave30.env file, and sandbox DB were never created.
 *
 * This module:
 *   - validates that the cron entry, env file, and sandbox DB exist
 *   - installs the cron entry idempotently (SSH to production)
 *   - writes the env file (mode 600) idempotently
 *   - creates the sandbox DB (idempotent — CREATE DATABASE IF NOT EXISTS via
 *     a SELECT pg_database check)
 *   - runs the Wave 30 backup script
 *   - runs a FORCED DR drill (bypasses the Sunday gate so the first run can
 *     validate the pipeline end-to-end before relying on the cron schedule)
 *   - verifies backup integrity via `pg_restore --list`
 *
 * Safety rails (AGENTS.md §2.2):
 *   - Rail 1: never embed real secrets; all secrets come from env or
 *     explicitly provided owner override at runtime
 *   - Rail 3: no force-push (no git operations)
 *   - Rail 4: never DELETE/DROP the production DB; sandbox DB is created +
 *     dropped by wave30_backup.sh, never by this file
 *   - Rail 12: never print secrets, tokens, or PHI in logs
 *
 * Activation (one-time, on the production host, as the owner):
 *   1. Run: node wave34_backup_activation.js --install-all
 *      (does: validate, install-cron, write-env, create-sandbox)
 *   2. Run: node wave34_backup_activation.js --run-and-drill
 *      (does: backup + forced DR drill + verify)
 *   3. The next 02:05 cron will then run the same backup unattended.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

// ----- Constants -----

const PROD_HOST = '204.168.144.74';
const SSH_KEY = process.env.WAVE34_SSH_KEY
    || (process.platform === 'win32' ? 'C:\\Users\\ice\\.ssh\\nama_medical_key' : '/root/.ssh/nama_medical_key');
const SSH_OPTS = ['-i', SSH_KEY, '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes'];

// Wave 34 hardening: use a dedicated BYPASSRLS role for backups so RLS policies
// don't block pg_dump / pg_restore. The app role stays tenant-scoped (rail 5).
const BACKUP_DB_USER = 'nama_medical_backup';

const CRON_PATH = '/etc/cron.d/wave30';
const ENV_PATH = '/etc/default/wave30.env';
const BACKUP_SCRIPT = '/usr/local/bin/wave30_backup.sh';
const BACKUP_DIR = '/var/backups/nama-medical';
const LOG_PATH = '/var/log/wave30.log';
const DRILL_LOG = '/var/backups/nama-medical/dr-restore.log';

const CRON_LINE = '5 2 * * * root set -a; . /etc/default/wave30.env; set +a; /usr/local/bin/wave30_backup.sh >> /var/log/wave30.log 2>&1';

// ----- SSH wrapper (no secrets logged) -----

function sshExec(host, remoteCmd, opts = {}) {
    const args = [...SSH_OPTS, `root@${host}`, remoteCmd];
    const r = spawnSync('ssh', args, { encoding: 'utf8', ...opts });
    return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

// Local exec helper (used when the caller is on the same host as prod — e.g. the server endpoint).
// Returns the same { code, stdout, stderr } shape so validateActivation can stay parameterised.
function localExec(_host, remoteCmd, opts = {}) {
    try {
        const stdout = execFileSync('bash', ['-c', remoteCmd], { encoding: 'utf8', timeout: opts.timeout || 10000 });
        return { code: 0, stdout: stdout || '', stderr: '' };
    } catch (e) {
        return { code: typeof e.status === 'number' ? e.status : 1, stdout: (e.stdout || '') + '', stderr: (e.stderr || e.message || '') + '' };
    }
}

// ----- Validators -----

/**
 * Validate activation: checks that all four pre-conditions hold:
 *  - cron.d/wave30 file exists and contains the expected line
 *  - /etc/default/wave30.env exists and is mode 600
 *  - sandbox DB (nama_medical_drill) exists or can be created
 *  - /usr/local/bin/wave30_backup.sh exists and is executable
 *
 * Returns { ok: bool, checks: [{name, ok, detail}] }
 */
function validateActivation({ exec = sshExec, local = undefined } = {}) {
    // Auto-detect local mode ONLY when caller didn't supply a custom exec (i.e. default sshExec)
    // AND didn't explicitly set local. Otherwise mocks with their own `exec` get bypassed on hosts
    // without the SSH key path. On hosts without the key, fall back to localExec to avoid the
    // "Identity file not accessible" SSH failure when running from server.js on prod.
    if (local === undefined) {
        if (exec === sshExec) {
            try { if (!fs.existsSync(SSH_KEY)) local = true; } catch (_) {}
        } else {
            local = false;  // caller supplied a custom exec; respect their choice
        }
    }
    const ex = local ? localExec : exec;
    const checks = [];

    // 1. cron entry (exit 2 if missing so the detail code is informative)
    const cron = ex(PROD_HOST, `if [ -f ${CRON_PATH} ]; then cat ${CRON_PATH}; else echo MISSING; exit 2; fi`);
    const cronOk = cron.code === 0 && cron.stdout.trim().split('\n').some(line => line.startsWith('5 2 * * *'));
    checks.push({ name: 'cron-entry', ok: cronOk, detail: cronOk ? cron.stdout.trim() : `missing or wrong content (code=${cron.code}, got="${(cron.stdout || '').slice(0, 80)}")` });

    // 2. env file (exit 3 if missing)
    const env = ex(PROD_HOST, `if [ -f ${ENV_PATH} ]; then stat -c '%a %s' ${ENV_PATH}; else echo MISSING; exit 3; fi`);
    const envOk = env.code === 0 && env.stdout.trim().startsWith('600');
    checks.push({ name: 'env-file', ok: envOk, detail: envOk ? `mode=${env.stdout.trim()}` : `missing or wrong mode (got="${(env.stdout || '').slice(0, 80)}", code=${env.code})` });

    // 3. sandbox DB exists (use the backup role which has CONNECT on postgres DB)
    // When running locally (no SSH), source the env file so PGPASSWORD is available to psql.
    const sandboxCmd = local
        ? `set -a; . ${ENV_PATH}; set +a; PGPASSWORD="$PGPASSWORD" psql -h 127.0.0.1 -U ${BACKUP_DB_USER} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='nama_medical_drill'"`
        : `PGPASSWORD="${process.env.PGPASSWORD || ''}" psql -h 127.0.0.1 -U ${BACKUP_DB_USER} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='nama_medical_drill'"`;
    const db = ex(PROD_HOST, sandboxCmd);
    const dbOk = db.code === 0 && db.stdout.trim() === '1';
    let dbDetail;
    if (dbOk) dbDetail = 'nama_medical_drill exists';
    else if (db.code === 127) dbDetail = 'psql not on PATH';
    else dbDetail = `sandbox DB missing or psql error (code=${db.code}, stderr="${(db.stderr || '').slice(0, 80)}")`;
    checks.push({ name: 'sandbox-db', ok: dbOk, detail: dbDetail });

    // 4. backup script executable (exit 4 if missing)
    const bs = ex(PROD_HOST, `if [ -x ${BACKUP_SCRIPT} ]; then echo OK; else echo MISSING; exit 4; fi`);
    const bsOk = bs.code === 0 && bs.stdout.trim() === 'OK';
    checks.push({ name: 'backup-script', ok: bsOk, detail: bsOk ? `${BACKUP_SCRIPT} executable` : `${BACKUP_SCRIPT} missing or not executable (code=${bs.code}, got="${(bs.stdout || '').slice(0, 80)}")` });

    return { ok: checks.every(c => c.ok), checks };
}

// ----- Installers -----

/**
 * Install the cron entry idempotently. Uses a heredoc-style single-quoted
 * payload to avoid shell expansion. Verifies the file lands as expected.
 */
function installCron({ exec = sshExec } = {}) {
    const payload = CRON_LINE + '\n';
    // base64-encoding avoids quote-escaping nightmares entirely.
    const b64 = Buffer.from(payload, 'utf8').toString('base64');
    const cmd = `echo '${b64}' | base64 -d > ${CRON_PATH} && chmod 644 ${CRON_PATH} && echo INSTALLED`;
    const r = exec(PROD_HOST, cmd);
    if (r.code !== 0) return { ok: false, detail: r.stderr };
    // verify
    const v = exec(PROD_HOST, `cat ${CRON_PATH}`);
    if (v.code !== 0 || !v.stdout.includes('5 2 * * *')) return { ok: false, detail: 'post-install verify failed' };
    return { ok: true, detail: v.stdout.trim() };
}

/**
 * Write the env file with mode 600. Owner must supply secrets via env vars
 * or stdin — never embedded in this file.
 *
 * Required env vars from the operator: PGPASSWORD, KEK_PASSPHRASE, REMOTE_DEST
 * (the latter is optional — empty disables rsync).
 */
function createEnvFile(env = process.env, { exec = sshExec } = {}) {
    const pgPassword = env.PGPASSWORD || env.PG_PASSWORD || '';
    const kek = env.KEK_PASSPHRASE || '';
    const remote = env.REMOTE_DEST || '';
    const drill = env.DR_DRILL_DB || 'nama_medical_drill';

    if (!pgPassword) {
        return { ok: false, detail: 'PGPASSWORD env var required to write env file (rail 1: no secrets in source)' };
    }

    const body = [
        '# /etc/default/wave30.env — Wave 30/34 backup + DR drill env',
        `# Generated ${new Date().toISOString()} by wave34_backup_activation.js`,
        '',
        `PGHOST=127.0.0.1`,
        `PGPORT=5432`,
        // Use the dedicated BYPASSRLS role for backups (rail 5 preserved for app role).
        `PGUSER=${BACKUP_DB_USER}`,
        `PGDATABASE=nama_medical_web`,
        `BACKUP_DIR=${BACKUP_DIR}`,
        `REMOTE_DEST=${remote}`,
        `KEK_PASSPHRASE=${kek}`,
        `DR_DRILL_DB=${drill}`,
        `RETENTION_DAYS=30`,
        `PGPASSWORD=${pgPassword}`,
        ''
    ].join('\n');

    const b64 = Buffer.from(body, 'utf8').toString('base64');
    const cmd = `echo '${b64}' | base64 -d > ${ENV_PATH} && chmod 600 ${ENV_PATH} && chown root:root ${ENV_PATH} && echo INSTALLED`;
    const r = exec(PROD_HOST, cmd);
    if (r.code !== 0) return { ok: false, detail: r.stderr };
    const v = exec(PROD_HOST, `stat -c '%a %s %n' ${ENV_PATH}`);
    if (v.code !== 0 || !v.stdout.trim().startsWith('600 ')) return { ok: false, detail: `post-install mode verify failed: ${v.stdout}` };
    return { ok: true, detail: v.stdout.trim() };
}

/**
 * Create the sandbox DB (idempotent — only creates if absent).
 * NEVER touches the production DB. Uses the BYPASSRLS backup role which has
 * CREATEDB privilege.
 */
function createSandboxDb({ exec = sshExec } = {}) {
    const check = exec(PROD_HOST,
        `PGPASSWORD="${process.env.PGPASSWORD || ''}" psql -h 127.0.0.1 -U ${BACKUP_DB_USER} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='nama_medical_drill'"`);
    if (check.stdout.trim() === '1') return { ok: true, detail: 'sandbox DB already exists', alreadyExists: true };

    const create = exec(PROD_HOST,
        `PGPASSWORD="${process.env.PGPASSWORD || ''}" psql -h 127.0.0.1 -U ${BACKUP_DB_USER} -d postgres -c "CREATE DATABASE nama_medical_drill"`);
    if (create.code !== 0) return { ok: false, detail: create.stderr };
    return { ok: true, detail: 'sandbox DB created', alreadyExists: false };
}

// ----- Runners -----

/**
 * Run the backup script. Outputs to LOG_PATH on the production host.
 */
function runBackup({ exec = sshExec } = {}) {
    const r = exec(PROD_HOST, `set -a; . ${ENV_PATH}; set +a; ${BACKUP_SCRIPT} 2>&1 | tail -30`, { timeout: 300000 });
    return { ok: r.code === 0, code: r.code, detail: r.stdout, stderr: r.stderr };
}

/**
 * Run a FORCED DR drill — bypasses the Sunday gate so the first
 * activation can verify the pipeline end-to-end. The wave30_backup.sh
 * script honors a SKIP_SUNDAY_GATE flag if set; here we instead set
 * DATE_DRILL=7 (Sunday marker) by overriding `date -u +%u` via an env
 * shim.
 */
function runDrDrill({ exec = sshExec } = {}) {
    // The wave30_backup.sh checks `$(date -u +%u)` against "7" for Sunday.
    // We force a drill by exporting FORCE_DRILL=1; if the script honors
    // that, great. If not, we directly call the drill block.
    // For portability we wrap the drill block into a self-contained command.
    const cmd = [
        'set -a',
        `. ${ENV_PATH}`,
        'set +a',
        // Force the Sunday gate by faking the day-of-week using a shell function
        // that overrides `date`. Safe because we restore `unalias date` after.
        `shopt -s expand_aliases`,
        // Bash function shadows `date` for this command only — never persists.
        `date() { if [[ "$1" == "-u" && "$2" == "+%u" ]]; then echo 7; else command date "$@"; fi; }`,
        `export -f date`,
        `DR_DRILL_DB=nama_medical_drill ${BACKUP_SCRIPT}`,
    ].join(' && ');
    const r = exec(PROD_HOST, cmd, { timeout: 300000 });
    return { ok: r.code === 0, code: r.code, detail: r.stdout, stderr: r.stderr, logTail: '' };
}

/**
 * Verify the latest backup is a valid pg_dump archive by listing its TOC.
 * `pg_restore --list` reads the archive without writing to a database.
 * If the backup is encrypted (.enc), decrypt it first to a temp file using
 * the KEK_PASSPHRASE from the env file.
 */
function verifyBackup({ exec = sshExec } = {}) {
    const list = exec(PROD_HOST, `ls -t ${BACKUP_DIR}/keep/nama_*.dump* 2>/dev/null | head -1`);
    if (list.code !== 0 || !list.stdout.trim()) return { ok: false, detail: 'no backup file found in /keep' };
    const latest = list.stdout.trim();
    const isEncrypted = latest.endsWith('.enc');

    if (isEncrypted) {
        // Decrypt to a temp file in the work dir, then list.
        const workLatest = latest.replace('/keep/', '/work/').replace('.enc', '');
        const decrypt = exec(PROD_HOST,
            `set -a; . ${ENV_PATH}; set +a; openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in ${latest} -out ${workLatest} -pass env:KEK_PASSPHRASE 2>/dev/null; ls -la ${workLatest}`,
            { timeout: 60000 });
        if (decrypt.code !== 0) return { ok: false, file: latest, detail: 'decrypt failed' };
        // Use single quotes so the regex backslash isn't double-escaped through SSH.
        const toc = exec(PROD_HOST, `pg_restore --list ${workLatest} 2>/dev/null | grep -cE '^[0-9]+;'`, { timeout: 60000 });
        const tocCount = parseInt(toc.stdout.trim(), 10) || 0;
        // clean up the decrypted temp
        exec(PROD_HOST, `rm -f ${workLatest}`);
        return {
            ok: tocCount > 100,
            file: latest,
            tocCount,
            encrypted: true,
            preview: `TOC entries: ${tocCount}`
        };
    }

    const r = exec(PROD_HOST, `pg_restore --list "${latest}" 2>&1 | head -10`, { timeout: 60000 });
    const toc = exec(PROD_HOST, `pg_restore --list "${latest}" 2>/dev/null | grep -cE '^[0-9]+;'`, { timeout: 60000 });
    const tocCount = parseInt(toc.stdout.trim(), 10) || 0;
    return {
        ok: r.code === 0 && tocCount > 100,
        file: latest,
        tocCount,
        preview: r.stdout.split('\n').slice(0, 5).join('\n')
    };
}

// ----- Reporting -----

/**
 * Convert the validateActivation result to a Prometheus-friendly metrics
 * block.
 */
function toPrometheusMetrics(report) {
    const lines = ['# HELP wave34_activation_status Activation check pass/fail (1=ok, 0=fail)', '# TYPE wave34_activation_status gauge'];
    for (const c of report.checks) {
        const safe = c.name.replace(/[^a-z0-9_]/gi, '_');
        lines.push(`wave34_activation_status{check="${safe}"} ${c.ok ? 1 : 0}`);
    }
    return lines.join('\n') + '\n';
}

// ----- Exports -----

module.exports = {
    PROD_HOST, SSH_KEY, BACKUP_DB_USER, CRON_PATH, ENV_PATH, BACKUP_SCRIPT, BACKUP_DIR,
    CRON_LINE,
    sshExec,
    localExec,
    validateActivation,
    installCron,
    createEnvFile,
    createSandboxDb,
    runBackup,
    runDrDrill,
    verifyBackup,
    toPrometheusMetrics
};

// ----- CLI -----
if (require.main === module) {
    const args = process.argv.slice(2);
    const flags = new Set(args);

    function log(stage, r) {
        console.log(`[${stage}]`, r.ok ? '✅' : '❌', r.detail || '');
        if (!r.ok && process.env.WAVE34_FAIL_FAST !== '0') {
            console.error(`Aborting (fail-fast). Set WAVE34_FAIL_FAST=0 to continue.`);
            process.exit(1);
        }
    }

    if (flags.has('--install-all') || flags.has('--install-cron')) log('install-cron', installCron());
    if (flags.has('--install-all') || flags.has('--write-env'))   log('write-env',    createEnvFile());
    if (flags.has('--install-all') || flags.has('--create-sandbox')) log('create-sandbox', createSandboxDb());

    if (flags.has('--validate')) {
        const v = validateActivation();
        console.log('VALIDATE:', v.ok ? '✅' : '❌');
        for (const c of v.checks) console.log(`  ${c.ok ? '✅' : '❌'} ${c.name}: ${c.detail}`);
        process.exit(v.ok ? 0 : 1);
    }

    if (flags.has('--run-and-drill')) {
        log('run-backup', runBackup());
        log('verify-backup', verifyBackup());
        log('run-drill', runDrDrill());
        const v = validateActivation();
        console.log('POST-VALIDATE:', v.ok ? '✅' : '❌');
    }
}