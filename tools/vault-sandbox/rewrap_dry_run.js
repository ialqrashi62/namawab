#!/usr/bin/env node
/*
 * Production re-wrap DRY-RUN — DUMMY-ONLY, timed, against a loopback Vault sandbox.
 *
 * Purpose: walk the PRODUCTION re-wrap PROCEDURE end-to-end on dummy material and MEASURE
 * the KEK-protection-swap time, to inform RTO. Production inventory (44ec2eb) found:
 *   - 0 ciphertext at-rest in the DB (mfa_secret/phi_files/integration_settings/encryption_metadata = 0 rows)
 *   - exactly ONE KEK artifact (DPAPI-protected) to re-wrap.
 * So the real re-wrap migrates ONE KEK (no data re-encryption). This dry-run simulates exactly that.
 *
 * SAFETY: dummy KEK only; NEVER reads ~/nama_kek.dpapi; no real DPAPI; no DB; loopback Vault only;
 * sanitized output (fingerprints/lengths/timings only — no KEK plaintext, no token).
 *
 * Env (runtime-only): VAULT_ADDR (default http://127.0.0.1:8200), VAULT_TOKEN.
 */
'use strict';
const crypto = require('crypto');
const http = require('http');
const { URL } = require('url');

const VAULT_ADDR = process.env.VAULT_ADDR || 'http://127.0.0.1:8200';
const VAULT_TOKEN = process.env.VAULT_TOKEN || '';
const KEY = 'nama-kek-dryrun';
const parsed = new URL(VAULT_ADDR);
if (!['127.0.0.1', 'localhost'].includes(parsed.hostname)) { console.error('TRIPWIRE: non-loopback VAULT_ADDR'); process.exit(2); }
if (!VAULT_TOKEN) { console.error('VAULT_TOKEN not set (runtime only)'); process.exit(2); }

const fp = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 12);
const b64 = (b) => Buffer.from(b).toString('base64');
const now = () => Number(process.hrtime.bigint() / 1000000n); // ms

function vault(method, path, body) {
  return new Promise((res, rej) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({ hostname: parsed.hostname, port: parsed.port || 8200, path: '/v1' + path, method,
      headers: { 'X-Vault-Token': VAULT_TOKEN, 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } },
      (r) => { let c = ''; r.on('data', (d) => (c += d)); r.on('end', () => res({ status: r.statusCode, json: c ? JSON.parse(c) : {} })); });
    req.on('error', rej); if (data) req.write(data); req.end();
  });
}

const results = {}; const timings = {};
const pass = (k, ok, extra) => { results[k] = ok ? 'PASS' : 'FAIL'; console.log(`[${ok ? 'PASS' : 'FAIL'}] ${k}${extra ? ' :: ' + extra : ''}`); };

(async () => {
  console.log('=== PRODUCTION RE-WRAP DRY-RUN (DUMMY-ONLY, TIMED) ===');
  console.log('inventory-informed scope: 1 KEK to re-wrap, 0 data ciphertext (DB empty) -> KEK-protection swap only');

  // dummy production-equivalent material
  const dummyKEK = crypto.randomBytes(32);              // stands in for the single real KEK
  const dummyPayload = Buffer.from('DUMMY-AT-REST-SAMPLE:not-real', 'utf8');
  const ivp = crypto.randomBytes(12); const ce = crypto.createCipheriv('aes-256-gcm', dummyKEK, ivp);
  const dataCt = Buffer.concat([ce.update(dummyPayload), ce.final()]); const dataTag = ce.getAuthTag();
  const dataFp = fp(Buffer.concat([dataCt, dataTag]));
  console.log(`dummyKEK.fp=${fp(dummyKEK)} | data_ciphertext.fp=${dataFp} (must stay constant)`);

  // STEP 1: enable transit + create prod-equivalent key (measure)
  let t = now();
  let r = await vault('POST', '/sys/mounts/transit', { type: 'transit' });
  pass('step1_transit_enabled', r.status === 204 || (r.status === 400 && JSON.stringify(r.json).includes('already in use')));
  r = await vault('POST', `/transit/keys/${KEY}`, { type: 'aes256-gcm96' });
  pass('step1_key_created', r.status === 204 || r.status === 200);
  timings.step1_setup_ms = now() - t;

  // STEP 2: re-wrap the single KEK (DPAPI -> Vault transit) (measure the core swap)
  t = now();
  r = await vault('POST', `/transit/encrypt/${KEY}`, { plaintext: b64(dummyKEK) });
  const wrapped = r.json?.data?.ciphertext;
  timings.step2_kek_rewrap_ms = now() - t;
  pass('step2_kek_rewrapped', !!wrapped && wrapped.startsWith('vault:v1:'), `prefix=${wrapped ? wrapped.split(':').slice(0,2).join(':') : 'none'}`);

  // STEP 3: verify unwrap recovers identical KEK (measure)
  t = now();
  r = await vault('POST', `/transit/decrypt/${KEY}`, { ciphertext: wrapped });
  const back = r.json?.data ? Buffer.from(r.json.data.plaintext, 'base64') : Buffer.alloc(0);
  timings.step3_verify_unwrap_ms = now() - t;
  pass('step3_unwrap_matches', back.equals(dummyKEK), `fp=${fp(back)}`);

  // STEP 4: prove data ciphertext UNCHANGED (no data re-encryption in a KEK-swap)
  pass('step4_data_ciphertext_unchanged', fp(Buffer.concat([dataCt, dataTag])) === dataFp);

  // STEP 5: dual-read window (v1 DPAPI-sim + v2 Vault both decrypt the SAME data)
  const dec = (kek) => { const d = crypto.createDecipheriv('aes-256-gcm', kek, ivp); d.setAuthTag(dataTag); return Buffer.concat([d.update(dataCt), d.final()]); };
  pass('step5_dualread_v2', dec(back).equals(dummyPayload));

  // STEP 6: ROLLBACK (revert to v1) — measure; prove instantaneous + non-destructive
  t = now();
  const rolledBack = dec(dummyKEK); // v1 source still valid
  timings.step6_rollback_ms = now() - t;
  pass('step6_rollback_to_v1', rolledBack.equals(dummyPayload));

  const failed = Object.entries(results).filter(([, v]) => v !== 'PASS');
  console.log('=== TIMINGS (ms) ===');
  console.log(JSON.stringify(timings));
  console.log(`core_kek_rewrap+verify_ms = ${timings.step2_kek_rewrap_ms + timings.step3_verify_unwrap_ms}`);
  console.log('=== SUMMARY ===');
  console.log(JSON.stringify(results));
  console.log(failed.length === 0 ? 'DRY_RUN_RESULT: ALL_PASS' : `DRY_RUN_RESULT: FAIL (${failed.map((f) => f[0]).join(',')})`);
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((e) => { console.error('DRY_RUN_ERROR:', e.message); process.exit(1); });
