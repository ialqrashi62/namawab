/**
 * wave35_logrotate_test.js — Unit + structural + safety tests.
 *
 * Safety rails (AGENTS.md §2.2):
 *   - Rail 1: source must not embed any secret material.
 *   - Rail 4: no DELETE / DROP on production data paths.
 *   - Rail 7: only /etc/logrotate.d/ is touched.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const w35 = require('./wave35_logrotate');
// Path of the production source file that this test actually guards.
const SOURCE_FILE = path.join(__dirname, 'wave35_logrotate.js');

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    tests.push({ name, fn });
}

function assert(cond, msg) {
    if (!cond) throw new Error('assertion failed' + (msg ? `: ${msg}` : ''));
}

function assertStrictEqual(a, b, msg) {
    if (a !== b) throw new Error('assertion failed' + (msg ? `: ${msg}` : '') + ` (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);
}

// ----- Constants / sanity -----

test('constants: SSH key fallback present', () => {
    assert(typeof w35.SSH_KEY === 'string' && w35.SSH_KEY.length > 0, 'SSH_KEY must be a string');
});

test('constants: production host correct', () => {
    assertStrictEqual(w35.PROD_HOST, '204.168.144.74', 'PROD_HOST must be the Hetzner host');
});

test('constants: logrotate config paths under /etc/logrotate.d/', () => {
    assertStrictEqual(w35.WAVE30_CONFIG, '/etc/logrotate.d/wave30');
    assertStrictEqual(w35.PM2_CONFIG, '/etc/logrotate.d/pm2-nama');
    assertStrictEqual(w35.LOGROTATE_DIR, '/etc/logrotate.d');
});

test('constants: WAVE30_POLICY rotates wave30.log + drill log', () => {
    assert(/\/var\/log\/wave30\.log/.test(w35.WAVE30_POLICY), 'must cover /var/log/wave30.log');
    assert(/\/var\/log\/wave30-drill\.log/.test(w35.WAVE30_POLICY), 'must cover /var/log/wave30-drill.log');
});

test('constants: PM2_POLICY rotates PM2 logs', () => {
    assert(/\/root\/\.pm2\/logs\/\*\.log/.test(w35.PM2_POLICY), 'must cover /root/.pm2/logs/*.log');
});

// ----- Policy file safety -----

test('wave30 policy: no DELETE / DROP', () => {
    assert(!/\bdelete\b/i.test(w35.WAVE30_POLICY), 'no delete rules');
    assert(!/\bdrop\b/i.test(w35.WAVE30_POLICY), 'no drop rules');
});

test('pm2 policy: no DELETE / DROP', () => {
    assert(!/\bdelete\b/i.test(w35.PM2_POLICY), 'no delete rules');
    assert(!/\bdrop\b/i.test(w35.PM2_POLICY), 'no drop rules');
});

test('wave30 policy: copytruncate is set', () => {
    assert(/copytruncate/i.test(w35.WAVE30_POLICY), 'copytruncate required so the cron task keeps appending');
});

test('pm2 policy: copytruncate is set', () => {
    assert(/copytruncate/i.test(w35.PM2_POLICY), 'copytruncate required so PM2 keeps appending');
});

test('wave30 policy: postrotate notifies the operator', () => {
    assert(/postrotate/.test(w35.WAVE30_POLICY), 'must have postrotate');
    assert(/logger -t wave30/.test(w35.WAVE30_POLICY), 'must log rotation to syslog');
});

test('pm2 policy: postrotate runs pm2 reloadLogs', () => {
    assert(/pm2 reloadLogs/.test(w35.PM2_POLICY), 'postrotate must reload PM2 logs');
});

test('wave30 policy: retention is 14 days', () => {
    assert(/\brotate 14\b/.test(w35.WAVE30_POLICY), 'retention must be 14 days for backup logs');
});

test('pm2 policy: retention is 7 days', () => {
    assert(/\brotate 7\b/.test(w35.PM2_POLICY), 'retention must be 7 days for app logs');
});

test('wave30 policy: file mode is 0640 (root:adm)', () => {
    assert(/create 0640 root adm/.test(w35.WAVE30_POLICY), 'mode must be 0640 root adm');
});

test('pm2 policy: file mode is 0640 (root:adm)', () => {
    assert(/create 0640 root adm/.test(w35.PM2_POLICY), 'mode must be 0640 root adm');
});

// ----- Rail 1: source hygiene -----

test('source file: present and non-empty', () => {
    assert(fs.existsSync(SOURCE_FILE), `${SOURCE_FILE} must exist`);
    const content = fs.readFileSync(SOURCE_FILE, 'utf8');
    assert(content.length > 1000, 'source should be substantial');
});

test('source file: never embeds a password or KEK phrase', () => {
    const src = fs.readFileSync(SOURCE_FILE, 'utf8');
    assert(!/BackupRole2026Secure/.test(src), 'no backup role password literal');
    assert(!/NamaMedicalApp@2026/.test(src), 'no app role password literal');
    assert(!/NamaWave30KEK/.test(src), 'no KEK phrase literal');
});

test('source file: never references DELETE or DROP DATABASE on prod', () => {
    const src = fs.readFileSync(SOURCE_FILE, 'utf8');
    assert(!/delete from/i.test(src), 'no DELETE FROM statements');
    assert(!/drop database/i.test(src), 'no DROP DATABASE statements');
});

// ----- validateActivation (mocked) -----

test('validateActivation: returns ok=true when all checks pass (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.includes(WAVE30) || (cmd.includes('/etc/logrotate.d/wave30') && cmd.startsWith('if [ -f'))) {
            return { code: 0, stdout: '644 1247', stderr: '' };
        }
        if (cmd.includes(PM2) || (cmd.includes('/etc/logrotate.d/pm2-nama') && cmd.startsWith('if [ -f'))) {
            return { code: 0, stdout: '644 856', stderr: '' };
        }
        if (cmd.startsWith('logrotate --debug')) {
            return { code: 0, stdout: 'reading config file /etc/logrotate.d/wave30\nreading config file /etc/logrotate.d/pm2-nama\nAll flags parsed', stderr: '' };
        }
        if (cmd.startsWith('if [ -d /etc/logrotate.d')) {
            return { code: 0, stdout: '755 0 root root root root', stderr: '' };
        }
        return { code: 1, stdout: '', stderr: 'unknown' };
    };
    const r = w35.validateActivation({ exec: fakeExec });
    assertStrictEqual(r.ok, true, 'all checks pass');
    assertStrictEqual(r.checks.length, 4);
    assert(r.checks.every(c => c.ok));
});

test('validateActivation: returns ok=false when wave30 config missing (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('if [ -f /etc/logrotate.d/wave30')) return { code: 10, stdout: 'MISSING', stderr: '' };
        if (cmd.startsWith('if [ -f /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: '644 856', stderr: '' };
        if (cmd.startsWith('logrotate --debug')) return { code: 0, stdout: 'reading config /etc/logrotate.d/wave30\nreading config /etc/logrotate.d/pm2-nama', stderr: '' };
        if (cmd.startsWith('if [ -d /etc/logrotate.d')) return { code: 0, stdout: '755 0 root root root root', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w35.validateActivation({ exec: fakeExec });
    assertStrictEqual(r.ok, false);
    const wave30Check = r.checks.find(c => c.name === 'wave30-config');
    assertStrictEqual(wave30Check.ok, false);
});

test('validateActivation: returns ok=false when pm2 config missing (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('if [ -f /etc/logrotate.d/wave30')) return { code: 0, stdout: '644 1247', stderr: '' };
        if (cmd.startsWith('if [ -f /etc/logrotate.d/pm2-nama')) return { code: 11, stdout: 'MISSING', stderr: '' };
        if (cmd.startsWith('logrotate --debug')) return { code: 0, stdout: 'reading config files OK', stderr: '' };
        if (cmd.startsWith('if [ -d /etc/logrotate.d')) return { code: 0, stdout: '755 0 root root root root', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w35.validateActivation({ exec: fakeExec });
    assertStrictEqual(r.ok, false);
    const pm2Check = r.checks.find(c => c.name === 'pm2-config');
    assertStrictEqual(pm2Check.ok, false);
});

test('validateActivation: returns ok=false when logrotate parse fails (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('if [ -f /etc/logrotate.d/wave30')) return { code: 0, stdout: '644 1247', stderr: '' };
        if (cmd.startsWith('if [ -f /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: '644 856', stderr: '' };
        if (cmd.startsWith('logrotate --debug')) return { code: 127, stdout: '', stderr: 'logrotate: not found' };
        if (cmd.startsWith('if [ -d /etc/logrotate.d')) return { code: 0, stdout: '755 0 root root root root', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w35.validateActivation({ exec: fakeExec });
    assertStrictEqual(r.ok, false);
    const parse = r.checks.find(c => c.name === 'logrotate-parses');
    assertStrictEqual(parse.ok, false);
});

test('validateActivation: returns ok=false when /etc/logrotate.d missing (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('if [ -f /etc/logrotate.d/wave30')) return { code: 0, stdout: '644 1247', stderr: '' };
        if (cmd.startsWith('if [ -f /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: '644 856', stderr: '' };
        if (cmd.startsWith('logrotate --debug')) return { code: 0, stdout: 'parse ok', stderr: '' };
        if (cmd.startsWith('if [ -d /etc/logrotate.d')) return { code: 12, stdout: 'MISSING', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w35.validateActivation({ exec: fakeExec });
    assertStrictEqual(r.ok, false);
    const dir = r.checks.find(c => c.name === 'logrotate-dir');
    assertStrictEqual(dir.ok, false);
});

// ----- installPolicies (mocked) -----

function mockExecForConfig(wave30Stdout, pm2Stdout) {
    return (host, cmd) => {
        if (cmd.startsWith('cat /etc/logrotate.d/wave30')) return { code: 0, stdout: wave30Stdout, stderr: '' };
        if (cmd.startsWith('cat /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: pm2Stdout, stderr: '' };
        return { code: 1, stdout: '', stderr: 'unexpected cmd ' + cmd.slice(0, 80) };
    };
}

test('installPolicies: idempotent on equal content (mocked)', () => {
    const fakeExec = mockExecForConfig(w35.WAVE30_POLICY, w35.PM2_POLICY);
    const r = w35.installPolicies({ exec: fakeExec });
    assertStrictEqual(r.wave30.ok, true);
    assertStrictEqual(r.wave30.alreadyInstalled, true);
    assertStrictEqual(r.pm2.ok, true);
    assertStrictEqual(r.pm2.alreadyInstalled, true);
});

test('installPolicies: writes wave30 config when absent (mocked)', () => {
    const writes = [];
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('cat /etc/logrotate.d/wave30')) return { code: 0, stdout: 'MISSING', stderr: '' };
        if (cmd.startsWith('cat /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: w35.PM2_POLICY, stderr: '' };
        if (cmd.includes("base64 -d > /etc/logrotate.d/wave30")) { writes.push('wave30'); return { code: 0, stdout: 'INSTALLED', stderr: '' }; }
        return { code: 1, stdout: '', stderr: 'unexpected' };
    };
    const r = w35.installPolicies({ exec: fakeExec });
    assertStrictEqual(r.wave30.ok, true);
    assertStrictEqual(r.wave30.alreadyInstalled, undefined);
    assertStrictEqual(writes.includes('wave30'), true);
    assertStrictEqual(r.pm2.alreadyInstalled, true, 'pm2 was untouched');
});

test('installPolicies: writes pm2 config when absent (mocked)', () => {
    const writes = [];
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('cat /etc/logrotate.d/wave30')) return { code: 0, stdout: w35.WAVE30_POLICY, stderr: '' };
        if (cmd.startsWith('cat /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: 'MISSING', stderr: '' };
        if (cmd.includes("base64 -d > /etc/logrotate.d/pm2-nama")) { writes.push('pm2'); return { code: 0, stdout: 'INSTALLED', stderr: '' }; }
        return { code: 1, stdout: '', stderr: 'unexpected' };
    };
    const r = w35.installPolicies({ exec: fakeExec });
    assertStrictEqual(r.pm2.ok, true);
    assertStrictEqual(r.pm2.alreadyInstalled, undefined);
    assertStrictEqual(writes.includes('pm2'), true);
    assertStrictEqual(r.wave30.alreadyInstalled, true, 'wave30 was untouched');
});

// ----- forceRotate -----

test('forceRotate: returns ok=true for both configs on success (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('logrotate -f /etc/logrotate.d/wave30')) return { code: 0, stdout: 'rotation ok\nEXIT=0', stderr: '' };
        if (cmd.startsWith('logrotate -f /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: 'rotation ok\nEXIT=0', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w35.forceRotate({ exec: fakeExec });
    assertStrictEqual(r['/etc/logrotate.d/wave30'].ok, true);
    assertStrictEqual(r['/etc/logrotate.d/pm2-nama'].ok, true);
});

test('forceRotate: surfaces failure when logrotate returns non-zero exit (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('logrotate -f /etc/logrotate.d/wave30')) return { code: 0, stdout: 'permission denied\nEXIT=1', stderr: '' };
        if (cmd.startsWith('logrotate -f /etc/logrotate.d/pm2-nama')) return { code: 0, stdout: 'ok\nEXIT=0', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w35.forceRotate({ exec: fakeExec });
    assertStrictEqual(r['/etc/logrotate.d/wave30'].ok, false);
    assertStrictEqual(r['/etc/logrotate.d/pm2-nama'].ok, true);
});

// ----- toPrometheusMetrics -----

test('toPrometheusMetrics: emits a gauge per check', () => {
    const report = {
        ok: true,
        checks: [
            { name: 'wave30-config', ok: true, detail: 'ok' },
            { name: 'pm2-config', ok: true, detail: 'ok' },
            { name: 'logrotate-parses', ok: true, detail: 'ok' },
            { name: 'logrotate-dir', ok: false, detail: 'wrong mode' },
        ],
    };
    const out = w35.toPrometheusMetrics(report);
    assert(out.includes('# HELP wave35_activation_status'), 'has HELP');
    assert(out.includes('# TYPE wave35_activation_status gauge'), 'has TYPE');
    assert(out.includes('wave35_activation_status{check="wave30_config"} 1'), '1 for wave30');
    assert(out.includes('wave35_activation_status{check="logrotate_dir"} 0'), '0 for logrotate_dir');
});

// ----- localExec -----

test('localExec: returns ok=false with code=127 when command not found', () => {
    const r = w35.localExec(w35.PROD_HOST, 'definitely-not-a-real-binary-12345', {});
    assertStrictEqual(r.code, 127, 'missing binary should exit with 127');
});

test('localExec: returns ok=true with stdout for simple commands', () => {
    const r = w35.localExec(w35.PROD_HOST, 'echo hello-world', {});
    assertStrictEqual(r.code, 0);
    assert(/hello-world/.test(r.stdout));
});

test('localExec: handles non-zero exit with stderr', () => {
    const r = w35.localExec(w35.PROD_HOST, 'bash -c "echo oops 1>&2; exit 5"', {});
    assertStrictEqual(r.code, 5);
    assert(/oops/.test(r.stderr));
});

// ----- Run all -----

(async () => {
    for (const t of tests) {
        try {
            await t.fn();
            console.log(`[PASS] ${t.name}`);
            passed++;
        } catch (e) {
            console.log(`[FAIL] ${t.name} ${e.message || e}`);
            failed++;
        }
    }
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
})();

// Required so constants in `test()` blocks parse
const WAVE30 = w35.WAVE30_CONFIG;
const PM2 = w35.PM2_CONFIG;
