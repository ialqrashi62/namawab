/**
 * wave34_backup_activation_test.js — Tests for the Wave 34 backup
 * activation orchestrator.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const w34 = require('./wave34_backup_activation');

let passed = 0, failed = 0;
function test(name, fn) {
    try { fn(); console.log('[PASS]', name); passed++; }
    catch (e) { console.error('[FAIL]', name, e && e.message ? e.message : e); failed++; }
}

// ----- Constants -----

test('constants: SSH key fallback present', () => {
    assert.ok(typeof w34.SSH_KEY === 'string' && w34.SSH_KEY.length > 0, 'SSH_KEY must be a string');
});

test('constants: production host correct', () => {
    assert.strictEqual(w34.PROD_HOST, '204.168.144.74', 'PROD_HOST must be the Hetzner host');
});

test('constants: cron path is /etc/cron.d/wave30', () => {
    assert.strictEqual(w34.CRON_PATH, '/etc/cron.d/wave30');
});

test('constants: env path is /etc/default/wave30.env', () => {
    assert.strictEqual(w34.ENV_PATH, '/etc/default/wave30.env');
});

test('constants: cron line has correct schedule (5 2 * * *)', () => {
    assert.ok(w34.CRON_LINE.startsWith('5 2 * * *'), 'cron must run daily at 02:05');
    assert.ok(w34.CRON_LINE.includes('wave30_backup.sh'), 'must reference the backup script');
    assert.ok(w34.CRON_LINE.includes('/etc/default/wave30.env'), 'must source env file');
});

test('constants: backup script path matches Wave 30 deployment', () => {
    assert.strictEqual(w34.BACKUP_SCRIPT, '/usr/local/bin/wave30_backup.sh');
});

// ----- Validate (mocked) -----

test('validateActivation: returns ok=true when all checks pass (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.includes('/etc/cron.d/wave30') && cmd.startsWith('if')) return { code: 0, stdout: '5 2 * * * root ... wave30_backup.sh', stderr: '' };
        if (cmd.includes('/etc/default/wave30.env') && cmd.startsWith('if')) return { code: 0, stdout: '600 1234', stderr: '' };
        if (cmd.includes('pg_database WHERE datname')) return { code: 0, stdout: '1', stderr: '' };
        if (cmd.includes('/usr/local/bin/wave30_backup.sh') && cmd.startsWith('if')) return { code: 0, stdout: 'OK', stderr: '' };
        return { code: 1, stdout: '', stderr: 'unknown' };
    };
    const r = w34.validateActivation({ exec: fakeExec });
    assert.strictEqual(r.ok, true, 'all checks pass');
    assert.strictEqual(r.checks.length, 4);
    assert.ok(r.checks.every(c => c.ok));
});

test('validateActivation: returns ok=false when cron missing (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.includes('/etc/cron.d/wave30') && cmd.startsWith('if')) return { code: 2, stdout: 'MISSING', stderr: '' };
        if (cmd.includes('/etc/default/wave30.env') && cmd.startsWith('if')) return { code: 0, stdout: '600 1234', stderr: '' };
        if (cmd.includes('pg_database WHERE datname')) return { code: 0, stdout: '1', stderr: '' };
        if (cmd.includes('/usr/local/bin/wave30_backup.sh') && cmd.startsWith('if')) return { code: 0, stdout: 'OK', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w34.validateActivation({ exec: fakeExec });
    assert.strictEqual(r.ok, false);
    const cronCheck = r.checks.find(c => c.name === 'cron-entry');
    assert.strictEqual(cronCheck.ok, false);
});

test('validateActivation: returns ok=false when env file has wrong mode (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.includes('/etc/cron.d/wave30') && cmd.startsWith('if')) return { code: 0, stdout: '5 2 * * *', stderr: '' };
        if (cmd.includes('/etc/default/wave30.env') && cmd.startsWith('if')) return { code: 0, stdout: '644 1234', stderr: '' };  // bad mode
        if (cmd.includes('pg_database WHERE datname')) return { code: 0, stdout: '1', stderr: '' };
        if (cmd.includes('/usr/local/bin/wave30_backup.sh') && cmd.startsWith('if')) return { code: 0, stdout: 'OK', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w34.validateActivation({ exec: fakeExec });
    assert.strictEqual(r.ok, false);
    const envCheck = r.checks.find(c => c.name === 'env-file');
    assert.strictEqual(envCheck.ok, false, 'env file must be 600');
});

test('validateActivation: returns ok=false when sandbox DB missing (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.includes('/etc/cron.d/wave30') && cmd.startsWith('if')) return { code: 0, stdout: '5 2 * * *', stderr: '' };
        if (cmd.includes('/etc/default/wave30.env') && cmd.startsWith('if')) return { code: 0, stdout: '600 1234', stderr: '' };
        if (cmd.includes('pg_database WHERE datname')) return { code: 0, stdout: '', stderr: '' };  // empty
        if (cmd.includes('/usr/local/bin/wave30_backup.sh') && cmd.startsWith('if')) return { code: 0, stdout: 'OK', stderr: '' };
        return { code: 1, stdout: '', stderr: '' };
    };
    const r = w34.validateActivation({ exec: fakeExec });
    assert.strictEqual(r.ok, false);
    const dbCheck = r.checks.find(c => c.name === 'sandbox-db');
    assert.strictEqual(dbCheck.ok, false);
});

// ----- Installers (mocked) -----

test('installCron: idempotent — repeated calls succeed (mocked)', () => {
    let written = '';
    const fakeExec = (host, cmd) => {
        // Capture the base64-encoded content and verify it contains the cron line.
        if (cmd.includes('base64 -d >')) {
            const m = cmd.match(/echo '([A-Za-z0-9+/=]+)' \| base64/);
            assert.ok(m, 'command must base64-encode the cron line');
            written = Buffer.from(m[1], 'base64').toString('utf8');
            return { code: 0, stdout: 'INSTALLED', stderr: '' };
        }
        if (cmd.startsWith('cat /etc/cron.d/wave30')) return { code: 0, stdout: written, stderr: '' };
        return { code: 0, stdout: '', stderr: '' };
    };
    const r1 = w34.installCron({ exec: fakeExec });
    assert.strictEqual(r1.ok, true, 'first install ok');
    assert.ok(written.includes('5 2 * * *'));
    // Re-install simulates the same write succeeding.
    const r2 = w34.installCron({ exec: fakeExec });
    assert.strictEqual(r2.ok, true, 'second install ok (idempotent)');
});

test('createEnvFile: refuses when PGPASSWORD missing (rail 1)', () => {
    const r = w34.createEnvFile({});  // empty env
    assert.strictEqual(r.ok, false);
    assert.ok(/PGPASSWORD/i.test(r.detail), 'error must mention PGPASSWORD');
});

test('createEnvFile: writes 600-mode file with all keys (mocked)', () => {
    let written = '';
    const fakeExec = (host, cmd) => {
        if (cmd.includes('base64 -d >')) {
            const m = cmd.match(/echo '([A-Za-z0-9+/=]+)' \| base64/);
            written = Buffer.from(m[1], 'base64').toString('utf8');
            return { code: 0, stdout: 'INSTALLED', stderr: '' };
        }
        if (cmd.startsWith('stat -c')) {
            // Verify mode is 600
            return { code: 0, stdout: '600 1234 /etc/default/wave30.env', stderr: '' };
        }
        return { code: 0, stdout: '', stderr: '' };
    };
    const r = w34.createEnvFile({ PGPASSWORD: 'TEST_PASS', KEK_PASSPHRASE: 'TEST_KEK' }, { exec: fakeExec });
    assert.strictEqual(r.ok, true);
    assert.ok(written.includes('PGHOST=127.0.0.1'));
    assert.ok(written.includes('PGDATABASE=nama_medical_web'));
    // Wave 34 hardening: must use the dedicated BYPASSRLS role for backups
    // (rail 5 preserved for the app role).
    assert.ok(written.includes('PGUSER=nama_medical_backup'),
        'must use nama_medical_backup role (BYPASSRLS) for pg_dump');
    assert.ok(written.includes('KEK_PASSPHRASE=TEST_KEK'));
    assert.ok(written.includes('DR_DRILL_DB=nama_medical_drill'));
    assert.ok(written.includes('PGPASSWORD=TEST_PASS'));
});

test('createEnvFile: chmod 600 enforced via post-install verify (mocked)', () => {
    let verifiedMode = '644';  // simulate wrong mode after write
    const fakeExec = (host, cmd) => {
        if (cmd.includes('base64 -d >')) return { code: 0, stdout: 'INSTALLED', stderr: '' };
        if (cmd.startsWith('stat -c')) return { code: 0, stdout: `${verifiedMode} 1234 ${w34.ENV_PATH}`, stderr: '' };
        return { code: 0, stdout: '', stderr: '' };
    };
    const r = w34.createEnvFile({ PGPASSWORD: 'X' }, { exec: fakeExec });
    assert.strictEqual(r.ok, false, 'must reject when post-install mode != 600');
    assert.ok(/post-install/i.test(r.detail));
});

// ----- Runners (mocked) -----

test('runBackup: returns ok=true when script exits 0 (mocked)', () => {
    const fakeExec = () => ({ code: 0, stdout: '[OK] backup complete (size=123B sha256=abc...)', stderr: '' });
    const r = w34.runBackup({ exec: fakeExec });
    assert.strictEqual(r.ok, true);
    assert.ok(/backup complete/.test(r.detail));
});

test('runBackup: returns ok=false when script fails (mocked)', () => {
    const fakeExec = () => ({ code: 1, stdout: '', stderr: 'FATAL: pg_dump failed' });
    const r = w34.runBackup({ exec: fakeExec });
    assert.strictEqual(r.ok, false);
});

test('runDrDrill: calls the backup script with a date-function shim (mocked)', () => {
    let captured = '';
    const fakeExec = (host, cmd) => {
        captured = cmd;
        return { code: 0, stdout: '==== DR restore drill complete ====', stderr: '' };
    };
    const r = w34.runDrDrill({ exec: fakeExec });
    assert.strictEqual(r.ok, true);
    assert.ok(captured.includes('wave30_backup.sh'), 'must invoke the backup script');
    assert.ok(captured.includes('date()'), 'must shadow date for Sunday gate');
});

test('verifyBackup: returns ok=true when TOC has >100 entries (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('ls -t')) return { code: 0, stdout: '/var/backups/nama-medical/keep/nama_20260805.dump', stderr: '' };
        if (cmd.startsWith('pg_restore --list')) {
            if (cmd.endsWith('| head -10')) return { code: 0, stdout: '; TOC entry 1\n; TOC entry 2', stderr: '' };
            if (cmd.includes("grep -cE '^[0-9]+;'")) return { code: 0, stdout: '339', stderr: '' };
        }
        return { code: 0, stdout: '', stderr: '' };
    };
    const r = w34.verifyBackup({ exec: fakeExec });
    assert.strictEqual(r.ok, true);
    assert.strictEqual(r.tocCount, 339);
});

test('verifyBackup: returns ok=false when no backup file (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('ls -t')) return { code: 1, stdout: '', stderr: 'no files' };
        return { code: 0, stdout: '', stderr: '' };
    };
    const r = w34.verifyBackup({ exec: fakeExec });
    assert.strictEqual(r.ok, false);
    assert.ok(/no backup file/i.test(r.detail));
});

test('verifyBackup: decrypts .enc backup then counts TOC entries (mocked)', () => {
    let decryptedChecked = false;
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('ls -t')) return { code: 0, stdout: '/var/backups/nama-medical/keep/nama_20260805.dump.enc', stderr: '' };
        if (cmd.startsWith('set -a; . /etc/default/wave30.env') && cmd.includes('openssl enc -d')) {
            // simulate successful decrypt
            return { code: 0, stdout: '-rw-r--r-- 1 root root 1588193 /var/backups/nama-medical/work/nama_20260805.dump', stderr: '' };
        }
        if (cmd.startsWith('pg_restore --list') && cmd.includes("grep -cE '^[0-9]+;'")) {
            decryptedChecked = true;
            return { code: 0, stdout: '3749', stderr: '' };
        }
        return { code: 0, stdout: '', stderr: '' };
    };
    const r = w34.verifyBackup({ exec: fakeExec });
    assert.strictEqual(r.ok, true, 'encrypted backup with valid TOC should be ok');
    assert.strictEqual(r.tocCount, 3749);
    assert.strictEqual(r.encrypted, true);
    assert.ok(decryptedChecked, 'must decrypt+list for .enc backup');
});

test('verifyBackup: returns ok=false when encrypted backup decrypt fails (mocked)', () => {
    const fakeExec = (host, cmd) => {
        if (cmd.startsWith('ls -t')) return { code: 0, stdout: '/var/backups/nama-medical/keep/nama_20260805.dump.enc', stderr: '' };
        if (cmd.includes('openssl enc -d')) return { code: 1, stdout: '', stderr: 'bad decrypt' };
        return { code: 0, stdout: '', stderr: '' };
    };
    const r = w34.verifyBackup({ exec: fakeExec });
    assert.strictEqual(r.ok, false);
    assert.ok(/decrypt/i.test(r.detail));
});

// ----- Reporting -----

test('toPrometheusMetrics: emits a gauge per check', () => {
    const report = { ok: false, checks: [
        { name: 'cron-entry', ok: true, detail: '' },
        { name: 'env-file', ok: false, detail: 'missing' },
        { name: 'sandbox-db', ok: true, detail: '' },
        { name: 'backup-script', ok: true, detail: '' }
    ]};
    const m = w34.toPrometheusMetrics(report);
    assert.ok(m.includes('wave34_activation_status{check="cron_entry"} 1'), 'cron ok');
    assert.ok(m.includes('wave34_activation_status{check="env_file"} 0'), 'env fail');
    assert.ok(m.includes('wave34_activation_status{check="sandbox_db"} 1'), 'sandbox ok');
    assert.ok(m.includes('wave34_activation_status{check="backup_script"} 1'), 'script ok');
    assert.ok(m.startsWith('# HELP wave34_activation_status'));
});

// ----- File-system hygiene -----

test('source file: present and non-empty', () => {
    const src = fs.readFileSync(path.join(__dirname, 'wave34_backup_activation.js'), 'utf8');
    assert.ok(src.length > 5000, 'file must be substantive');
});

test('source file: never embeds a real DB password (rail 1)', () => {
    const src = fs.readFileSync(path.join(__dirname, 'wave34_backup_activation.js'), 'utf8');
    assert.ok(!src.includes('NamaMedicalApp@'), 'no literal DB password');
    assert.ok(!src.includes('@2026!'), 'no literal credential suffix');
});

test('source file: never references DELETE FROM or DROP DATABASE on prod (rail 4)', () => {
    const src = fs.readFileSync(path.join(__dirname, 'wave34_backup_activation.js'), 'utf8');
    // We allow DROP on the sandbox DB but never on the production DB.
    // The production DB is identified by PG_DATABASE='nama_medical_web'.
    // No `DROP DATABASE nama_medical_web` literal should appear.
    assert.ok(!src.toLowerCase().includes("drop database nama_medical_web"),
        'never DROP production DB');
    // The only CREATE/DROP allowed is on nama_medical_drill sandbox.
    assert.ok(!src.toLowerCase().includes('delete from'),
        'no DELETE FROM (rail 4)');
});

test('source file: BACKUP_DB_USER is the BYPASSRLS role, not the app role (rail 5)', () => {
    const src = fs.readFileSync(path.join(__dirname, 'wave34_backup_activation.js'), 'utf8');
    assert.ok(src.includes("BACKUP_DB_USER = 'nama_medical_backup'"),
        'must use nama_medical_backup (BYPASSRLS) for pg_dump');
    // The env file must NOT default to nama_medical_app for PGUSER — that
    // would put RLS-restricted reads into the backup archive (the original
    // Wave 30 deployment bug).
    assert.ok(!/PGUSER=nama_medical_app/.test(src),
        'env file must NOT default PGUSER to nama_medical_app (RLS would block pg_dump)');
});

test('constants: BACKUP_DB_USER is defined and references BYPASSRLS role', () => {
    assert.ok(typeof w34.BACKUP_DB_USER === 'string');
    assert.strictEqual(w34.BACKUP_DB_USER, 'nama_medical_backup');
    assert.notStrictEqual(w34.BACKUP_DB_USER, 'nama_medical_app',
        'must not use the tenant-scoped app role for backups');
});
// ----- localExec path (no SSH self-loop on prod) -----

test('localExec: returns ok=false with code=127 when command not found', () => {
    // Invoke bash to run a non-existent binary
    const r = w34.localExec(w34.PROD_HOST, 'definitely-not-a-real-binary-12345', {});
    assert.strictEqual(r.code, 127, 'missing binary should exit with 127');
});

test('localExec: returns ok=true with stdout for simple commands', () => {
    const r = w34.localExec(w34.PROD_HOST, 'echo hello-world', {});
    assert.strictEqual(r.code, 0);
    assert.ok(/hello-world/.test(r.stdout));
});

test('validateActivation local mode: auto-detects when SSH key is missing', () => {
    // Force auto-detection by hiding the SSH key. The function checks fs.existsSync(SSH_KEY);
    // on Windows this path won't exist, so local mode kicks in automatically.
    const r = w34.validateActivation();
    // On Windows the SSH key path is C:\Users\ice\.ssh\nama_medical_key which usually does NOT
    // exist in this dev environment, so local mode is used. We only assert that the function
    // returns a well-shaped result with 4 checks (not a crash).
    assert.strictEqual(typeof r.ok, 'boolean');
    assert.ok(Array.isArray(r.checks));
    assert.strictEqual(r.checks.length, 4);
});

test('validateActivation local mode: explicit local:true flag is respected', () => {
    const r = w34.validateActivation({ local: true });
    assert.strictEqual(typeof r.ok, 'boolean');
    assert.strictEqual(r.checks.length, 4);
});

test('localExec: handles non-zero exit with stderr', () => {
    const r = w34.localExec(w34.PROD_HOST, 'bash -c "echo some-error-output 1>&2; exit 5"', {});
    assert.strictEqual(r.code, 5);
    assert.ok(/some-error-output/.test(r.stderr));
});

console.log(
 passed,  failed);
process.exit(failed > 0 ? 1 : 0);
