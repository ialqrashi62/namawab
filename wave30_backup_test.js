/**
 * wave30_backup_test.js — Smoke tests for the Wave 30 backup script.
 *
 * The actual backup script runs against PostgreSQL and (optionally) rsync.
 * Here we only verify that the script:
 *   - is syntactically valid bash (sh -n)
 *   - does NOT contain any hardcoded secret (per AGENTS.md §2.2 rail 1)
 *   - honors the env-var contract documented in the header
 *
 * Full DR drill verification is a manual step on the live server.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execSync } = require('child_process');

let passed = 0, failed = 0;
function test(name, fn) {
    try { fn(); console.log('[PASS]', name); passed++; }
    catch (e) { console.error('[FAIL]', name, e && e.message ? e.message : e); failed++; }
}

const script = path.join(__dirname, 'wave30_backup.sh');
const src = fs.readFileSync(script, 'utf8');

test('script: bash syntax valid', () => {
    // Try git-bash / wsl. On Linux/macOS / Git-Bash / WSL we can shell out; on plain PowerShell
    // without bash, fall back to a structural check (shebang + balanced parens).
    const cp = require('child_process');
    const hasBash = (() => {
        try { cp.execSync('bash --version', { stdio: 'pipe' }); return true; }
        catch (_) { return false; }
    })();
    if (hasBash) {
        // Map Windows path -> bash-mount path. /mnt/c/... (WSL) or /c/... (Git-Bash).
        let bashArg = script;
        if (process.platform === 'win32') {
            const m = script.match(/^([A-Za-z]):[\\/](.*)$/);
            if (m) {
                // Try WSL path first (it actually exists for files on C: drive in WSL),
                // then fall back to the Git-Bash /c/ path.
                const wslArg = '/mnt/' + m[1].toLowerCase() + '/' + m[2].replace(/\\/g, '/');
                bashArg = wslArg;
            }
        }
        cp.execSync(`bash -n "${bashArg}"`, { stdio: 'pipe' });
    } else {
        assert.ok(src.startsWith('#!/usr/bin/env bash') || src.startsWith('#!/bin/bash'),
            'must have a bash shebang');
        const opens = (src.match(/[({[]/g) || []).length;
        const closes = (src.match(/[)}\]]/g) || []).length;
        assert.strictEqual(opens, closes, `unbalanced ${opens} vs ${closes}`);
    }
});

test('script: no hardcoded passwords / API keys', () => {
    // AGENTS.md §2.2 rail 1: no hardcoded secrets.
    const re = /\bpassword\s*=\s*['"][^'"]+['"]/i;
    assert.ok(!re.test(src), 'no hardcoded password literal');
    const re2 = /\bsecret\s*=\s*['"][^'"]+['"]/i;
    assert.ok(!re2.test(src), 'no hardcoded secret literal');
});

test('script: PGPASSWORD read from env (not literal)', () => {
    // We allow the literal string "PGPASSWORD" only as a variable name reference.
    // Forbid any inline literal that looks like a real DB password.
    const literal = /['"]NamaMedicalApp@/i;
    assert.ok(!literal.test(src), 'no literal DB password string in script');
});

test('script: env vars are documented in the header', () => {
    const required = ['PGHOST', 'PGPORT', 'PGUSER', 'PGDATABASE', 'BACKUP_DIR', 'RETENTION_DAYS'];
    for (const v of required) {
        assert.ok(src.includes(`${v}:`), `missing documented env var: ${v}`);
    }
});

test('script: uses pg_dump with -Fc + compression', () => {
    assert.ok(src.includes('-Fc'), 'pg_dump must use custom format (-Fc)');
    assert.ok(src.includes('-Z 9'), 'pg_dump must compress (-Z 9)');
});

test('script: uses sha256 for integrity', () => {
    assert.ok(/sha256sum/i.test(src), 'sha256sum required');
});

test('script: encrypted-at-rest path uses openssl with KEK', () => {
    assert.ok(/openssl enc/i.test(src), 'openssl enc required');
    assert.ok(/KEK_PASSPHRASE/.test(src), 'KEK_PASSPHRASE referenced');
});

test('script: retention prunes files > RETENTION_DAYS', () => {
    assert.ok(/RETENTION_DAYS/.test(src) && src.includes('delete'), 'retention delete present');
});

test('script: DR restore drill references pg_restore', () => {
    assert.ok(src.includes('pg_restore'), 'pg_restore referenced');
});

test('script: rsync + remote dest optional', () => {
    assert.ok(src.includes('rsync'), 'rsync present');
    assert.ok(src.includes('REMOTE_DEST'), 'REMOTE_DEST env var referenced');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
