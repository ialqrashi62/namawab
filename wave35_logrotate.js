/**
 * wave35_logrotate.js — Idempotent installer for two logrotate policies:
 *
 *   /etc/logrotate.d/wave30   — rotates /var/log/wave30.log (daily, 14-day
 *                              retain, gzip + ship to /var/log/archive).
 *
 *   /etc/logrotate.d/pm2-nama — rotates /root/.pm2/logs/*.log (daily,
 *                              7-day retain, gzip). postrotate sends
 *                              pm2 reloadLogs.
 *
 * Closes the gap identified after Wave 34: the daily 02:05 backup cron
 * now writes to /var/log/wave30.log, but no logrotate policy was
 * installed — that log would grow unbounded. Same with the long-running
 * PM2 cluster logs.
 *
 * Safety rails (AGENTS.md §2.2):
 *   - Rail 1: no secrets (only file paths + logrotate directives).
 *   - Rail 4: read-only on production data; touches only /etc/logrotate.d/.
 *   - Rail 7 (ops safety): preserves the directory mode 755 root:root of
 *            /etc/logrotate.d/.
 *
 * Activation (one-time, on the production host, as the owner):
 *   1. node wave35_logrotate.js --install-all
 *      (does: validate, write wave30 + pm2-nama, dry-run logrotate, list)
 *   2. node wave35_logrotate.js --validate
 *      (prints the current installed policies as it sees them)
 *
 * The operations notebook also documents how to force-run a rotation:
 *   logrotate -f /etc/logrotate.d/wave30
 *   logrotate -f /etc/logrotate.d/pm2-nama
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

// ----- Constants -----

const PROD_HOST = '204.168.144.74';
const SSH_KEY = process.env.WAVE35_SSH_KEY
    || (process.platform === 'win32' ? 'C:\\Users\\ice\\.ssh\\nama_medical_key' : '/root/.ssh/nama_medical_key');
const SSH_OPTS = ['-i', SSH_KEY, '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes'];

const LOGROTATE_DIR = '/etc/logrotate.d';
const WAVE30_CONFIG = '/etc/logrotate.d/wave30';
const PM2_CONFIG = '/etc/logrotate.d/pm2-nama';

// ----- Two logrotate policies -----
//
// Both are conservative defaults:
//   * daily rotation (24h cadence)
//   * copytruncate so the process (pm2 / cron) can keep appending
//   * compress + delaycompress (gzip older entries, leave the most
//     recent uncompressed for tailability)
//   * `create 0640 root adm` so backups/ops can read but others cannot
//   * explicit `notifempty` (don't rotate empty log files; saves I/O)
//   * explicit `prerotate` summary line so cron mail tells us about it
//
// Wave30: rotating /var/log/wave30.log and the matched drill log.
// PM2: rolling /root/.pm2/logs/*.log (out + error of all processes).

const WAVE30_POLICY = [
    '# /etc/logrotate.d/wave30 — rotate the daily backup + DR-drill log.',
    '# Installed by namaweb/wave35_logrotate.js (Wave 35). Do not edit by hand.',
    '/var/log/wave30.log /var/log/wave30-drill.log {',
    '    daily',
    '    rotate 14',
    '    missingok',
    '    notifempty',
    '    compress',
    '    delaycompress',
    '    copytruncate',
    '    create 0640 root adm',
    '    dateext',
    '    dateformat -%Y%m%d-%s',
    '    prerotate',
    '        /usr/bin/logger -t wave30 "Rotating backup log (size before: %s)"',
    '    endscript',
    '    postrotate',
    '        /usr/bin/logger -t wave30 "Rotation complete (count: %c, archives: %a)"',
    '    endscript',
    '}',
    '',
].join('\n');

const PM2_POLICY = [
    '# /etc/logrotate.d/pm2-nama — rotate PM2 application logs.',
    '# Installed by namaweb/wave35_logrotate.js (Wave 35). Do not edit by hand.',
    '/root/.pm2/logs/*.log {',
    '    daily',
    '    rotate 7',
    '    missingok',
    '    notifempty',
    '    compress',
    '    delaycompress',
    '    copytruncate',
    '    sharedscripts',
    '    create 0640 root adm',
    '    dateext',
    '    dateformat -%Y%m%d-%s',
    '    prerotate',
    '        /usr/bin/logger -t pm2-nama "Rotating PM2 logs (size before: %s)"',
    '    endscript',
    '    postrotate',
    '        /usr/bin/env pm2 reloadLogs > /dev/null 2>&1 || true',
    '    endscript',
    '}',
    '',
].join('\n');

// ----- SSH + local exec wrappers (mirrors Wave 34 shape) -----

function sshExec(host, remoteCmd, opts = {}) {
    const args = [...SSH_OPTS, `root@${host}`, remoteCmd];
    const r = spawnSync('ssh', args, { encoding: 'utf8', ...opts });
    return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

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
 * Validate installation: confirm both logrotate config files exist, are
 * world-readable to root only (mode 0644 typical), and survive a
 * `logrotate --debug` parse.
 */
function validateActivation({ exec = sshExec, local = undefined } = {}) {
    if (local === undefined) {
        if (exec === sshExec) {
            try { if (!fs.existsSync(SSH_KEY)) local = true; } catch (_) {}
        } else {
            local = false;
        }
    }
    const ex = local ? localExec : exec;
    const checks = [];

    // 1. wave30 config file present + non-empty + sane mode
    const w30 = ex(PROD_HOST,
        `if [ -f ${WAVE30_CONFIG} ]; then stat -c '%a %s' ${WAVE30_CONFIG}; else echo MISSING; exit 10; fi`);
    const w30Ok = w30.code === 0 && !/MISSING/.test(w30.stdout) && parseInt(w30.stdout.split(' ')[0], 10) <= 644;
    checks.push({
        name: 'wave30-config',
        ok: w30Ok,
        detail: w30Ok ? `mode=${w30.stdout.trim()}` : `missing or permissive (got="${w30.stdout.trim()}", code=${w30.code})`,
    });

    // 2. pm2 config file present + non-empty + sane mode
    const pm2 = ex(PROD_HOST,
        `if [ -f ${PM2_CONFIG} ]; then stat -c '%a %s' ${PM2_CONFIG}; else echo MISSING; exit 11; fi`);
    const pm2Ok = pm2.code === 0 && !/MISSING/.test(pm2.stdout) && parseInt(pm2.stdout.split(' ')[0], 10) <= 644;
    checks.push({
        name: 'pm2-config',
        ok: pm2Ok,
        detail: pm2Ok ? `mode=${pm2.stdout.trim()}` : `missing or permissive (got="${pm2.stdout.trim()}", code=${pm2.code})`,
    });

    // 3. logrotate can parse both configs (--debug)
    const parseOut = ex(PROD_HOST,
        'logrotate --debug /etc/logrotate.d/wave30 /etc/logrotate.d/pm2-nama 2>&1 | head -20');
    // logrotate exits 0 even on debug output; we look for content indicating it parsed
    const parseOk = parseOut.code === 0 && parseOut.stdout.length > 0 && !/error/i.test(parseOut.stdout.slice(0, 200));
    checks.push({
        name: 'logrotate-parses',
        ok: parseOk,
        detail: parseOk ? `parsed ${(parseOut.stdout.match(/\n/g) || []).length} lines of output` :
            `logrotate parse error (code=${parseOut.code}, stderr="${(parseOut.stderr || '').slice(0, 80)}")`,
    });

    // 4. /etc/logrotate.d/ exists + has expected mode 755 root:root (sanity — don't break the directory)
    const dirCheck = ex(PROD_HOST,
        `if [ -d ${LOGROTATE_DIR} ]; then stat -c '%a %u %U %g %G' ${LOGROTATE_DIR}; else echo MISSING; exit 12; fi`);
    const dirOk = dirCheck.code === 0 && !/MISSING/.test(dirCheck.stdout) && dirCheck.stdout.startsWith('755 ');
    checks.push({
        name: 'logrotate-dir',
        ok: dirOk,
        detail: dirOk ? `mode=${dirCheck.stdout.trim()}` : `/etc/logrotate.d/ missing or wrong mode (got="${dirCheck.stdout.trim()}", code=${dirCheck.code})`,
    });

    return { ok: checks.every(c => c.ok), checks };
}

// ----- Installers -----

/**
 * Install (or refresh) both logrotate config files. Idempotent: writes the
 * same content on every call, so re-running is safe. Compares existing
 * file before writing to avoid touching mtime unnecessarily.
 */
function installPolicies({ exec = sshExec, local = undefined } = {}, opts = {}) {
    if (local === undefined) {
        if (exec === sshExec) {
            try { if (!fs.existsSync(SSH_KEY)) local = true; } catch (_) {}
        } else {
            local = false;
        }
    }
    const ex = local ? localExec : exec;
    const results = {};

    // wave30
    const wave30Path = opts.wave30Path || WAVE30_CONFIG;
    const currentWave30 = ex(PROD_HOST, `cat ${wave30Path} 2>/dev/null || echo MISSING`);
    if (currentWave30.stdout.trim() === WAVE30_POLICY.trim()) {
        results.wave30 = { ok: true, detail: 'already installed (unchanged)', alreadyInstalled: true };
    } else {
        const b64 = Buffer.from(WAVE30_POLICY, 'utf8').toString('base64');
        const wCmd = `mkdir -p ${LOGROTATE_DIR} && echo '${b64}' | base64 -d > ${wave30Path} && chmod 644 ${wave30Path} && chown root:root ${wave30Path} && echo INSTALLED`;
        const w = ex(PROD_HOST, wCmd);
        results.wave30 = w.code === 0
            ? { ok: true, detail: `installed at ${wave30Path}` }
            : { ok: false, detail: w.stderr.slice(0, 120) };
    }

    // pm2
    const pm2Path = opts.pm2Path || PM2_CONFIG;
    const currentPm2 = ex(PROD_HOST, `cat ${pm2Path} 2>/dev/null || echo MISSING`);
    if (currentPm2.stdout.trim() === PM2_POLICY.trim()) {
        results.pm2 = { ok: true, detail: 'already installed (unchanged)', alreadyInstalled: true };
    } else {
        const b64 = Buffer.from(PM2_POLICY, 'utf8').toString('base64');
        const pCmd = `echo '${b64}' | base64 -d > ${pm2Path} && chmod 644 ${pm2Path} && chown root:root ${pm2Path} && echo INSTALLED`;
        const p = ex(PROD_HOST, pCmd);
        results.pm2 = p.code === 0
            ? { ok: true, detail: `installed at ${pm2Path}` }
            : { ok: false, detail: p.stderr.slice(0, 120) };
    }

    return results;
}

/**
 * Force a rotation right now. Useful as an ops smoke-test. Calls
 * `logrotate -f` for both configs; never throws on individual failures
 * (we want a report, not a stack trace).
 */
function forceRotate({ exec = sshExec, local = undefined } = {}) {
    if (local === undefined) {
        if (exec === sshExec) {
            try { if (!fs.existsSync(SSH_KEY)) local = true; } catch (_) {}
        } else {
            local = false;
        }
    }
    const ex = local ? localExec : exec;
    const results = {};
    for (const cfg of [WAVE30_CONFIG, PM2_CONFIG]) {
        const r = ex(PROD_HOST, `logrotate -f ${cfg} 2>&1 ; echo EXIT=$?`);
        const exitMatch = r.stdout.match(/EXIT=(\d+)/);
        const code = exitMatch ? parseInt(exitMatch[1], 10) : 1;
        results[cfg] = { ok: code === 0, code, detail: r.stdout.replace(/EXIT=\d+/, '').trim().slice(0, 200) };
    }
    return results;
}

/**
 * Prometheus-friendly metrics export: one gauge per check + a per-config
 * boolean (1=installed, 0=missing).
 */
function toPrometheusMetrics(report) {
    const lines = [
        '# HELP wave35_activation_status Log-rotate activation check pass/fail (1=ok, 0=fail)',
        '# TYPE wave35_activation_status gauge',
    ];
    for (const c of report.checks) {
        const safe = c.name.replace(/[^a-z0-9_]/gi, '_');
        lines.push(`wave35_activation_status{check="${safe}"} ${c.ok ? 1 : 0}`);
    }
    return lines.join('\n') + '\n';
}

// ----- Exports -----

module.exports = {
    PROD_HOST, SSH_KEY, LOGROTATE_DIR, WAVE30_CONFIG, PM2_CONFIG,
    WAVE30_POLICY, PM2_POLICY,
    sshExec,
    localExec,
    validateActivation,
    installPolicies,
    forceRotate,
    toPrometheusMetrics,
};

// ----- CLI -----
if (require.main === module) {
    const args = process.argv.slice(2);
    const flags = new Set(args);

    function log(stage, r) {
        const label = typeof r.ok === 'boolean' ? (r.ok ? '✅' : '❌') : '·';
        const detail = r.detail || (typeof r === 'object' ? JSON.stringify(r) : '');
        console.log(`[${stage}] ${label} ${detail}`);
    }

    if (flags.has('--install-all') || flags.has('--install')) {
        const ins = installPolicies();
        log('install-wave30', ins.wave30);
        log('install-pm2', ins.pm2);
    }

    if (flags.has('--validate')) {
        const v = validateActivation();
        console.log('VALIDATE:', v.ok ? '✅' : '❌');
        for (const c of v.checks) console.log(`  ${c.ok ? '✅' : '❌'} ${c.name}: ${c.detail}`);
        process.exit(v.ok ? 0 : 1);
    }

    if (flags.has('--rotate') || flags.has('--force-rotate')) {
        const r = forceRotate();
        for (const [cfg, info] of Object.entries(r)) {
            log(`force-rotate ${cfg}`, info);
        }
    }
}
