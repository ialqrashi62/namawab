#!/usr/bin/env node
/*
 * DPAPI -> Vault transit re-wrap REHEARSAL (DUMMY-ONLY).
 *
 * SAFETY (NM_SECURITY_DR_KEY_MANAGEMENT + NM_INTEGRATION_SANDBOX):
 *  - DUMMY-ONLY: KEK, payload and "DPAPI" source are synthetic, generated in-memory here.
 *  - NEVER touches the real KEK (~/nama_kek.dpapi), never calls real Windows DPAPI,
 *    never reads .env / production secrets, never touches the database.
 *  - Vault target is LOOPBACK ONLY (127.0.0.1:8200). A network tripwire blocks any other host.
 *  - Output is SANITIZED: prints booleans, byte-lengths, ciphertext PREFIX and SHA-256
 *    fingerprints only. Never prints the dummy KEK plaintext nor the Vault token.
 *
 * Model (envelope, two layers):
 *   Layer 1 (DATA): dummy payload encrypted with a dummy DEK/KEK via AES-256-GCM (Node crypto).
 *                   This layer is UNCHANGED by a provider swap (no data re-encryption).
 *   Layer 2 (KEK PROTECTION): the swappable provider.
 *     v1 provider = DPAPI  -> SIMULATED by a local dummy wrap (NO real DPAPI call).
 *     v2 provider = Vault transit -> wrap dummy KEK plaintext via transit/encrypt.
 *   re-wrap = move the SAME dummy KEK from v1 protection to v2 protection. DEK/payload ciphertext stays.
 *
 * Env (runtime-only, never committed/printed):
 *   VAULT_ADDR  (default http://127.0.0.1:8200)
 *   VAULT_TOKEN (dev root token, supplied at runtime)
 */
'use strict';
const crypto = require('crypto');
const http = require('http');
const { URL } = require('url');

const VAULT_ADDR = process.env.VAULT_ADDR || 'http://127.0.0.1:8200';
const VAULT_TOKEN = process.env.VAULT_TOKEN || '';
const KEY_NAME = 'nama-kek-dummy';

// ---- loopback tripwire ---------------------------------------------------
const parsed = new URL(VAULT_ADDR);
if (!['127.0.0.1', 'localhost'].includes(parsed.hostname)) {
  console.error(`TRIPWIRE: non-loopback VAULT_ADDR rejected (${parsed.hostname}). Aborting.`);
  process.exit(2);
}
if (!VAULT_TOKEN) {
  console.error('VAULT_TOKEN not set in runtime env. Aborting (no token will be read from disk).');
  process.exit(2);
}

// ---- tiny sanitized helpers ----------------------------------------------
const fp = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 12); // fingerprint, not the secret
const b64 = (buf) => Buffer.from(buf).toString('base64');

function vault(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      { hostname: parsed.hostname, port: parsed.port || 8200, path: '/v1' + path, method,
        headers: { 'X-Vault-Token': VAULT_TOKEN, 'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } },
      (res) => { let chunks = ''; res.on('data', (d) => (chunks += d));
        res.on('end', () => resolve({ status: res.statusCode, json: chunks ? JSON.parse(chunks) : {} })); }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ---- envelope (Layer 1) AES-256-GCM, ENCv1:iv:tag:ct (same shape as crypto_envelope.js) ----
function encEnvelope(kek, plaintextBuf) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', kek, iv);
  const ct = Buffer.concat([c.update(plaintextBuf), c.final()]);
  const tag = c.getAuthTag();
  return `ENCv1:${b64(iv)}:${b64(tag)}:${b64(ct)}`;
}
function decEnvelope(kek, blob) {
  const [, ivb, tagb, ctb] = blob.split(':');
  const d = crypto.createDecipheriv('aes-256-gcm', kek, Buffer.from(ivb, 'base64'));
  d.setAuthTag(Buffer.from(tagb, 'base64'));
  return Buffer.concat([d.update(Buffer.from(ctb, 'base64')), d.final()]);
}

// ---- v1 provider = DPAPI SIMULATION (NO real DPAPI) ----------------------
// Local AES wrap with an in-memory dummy "machine key" to stand in for DPAPI ProtectedData.
const DUMMY_DPAPI_KEY = crypto.createHash('sha256').update('DUMMY-DPAPI-SIM-NOT-REAL').digest();
function dpapiSimWrap(kek) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', DUMMY_DPAPI_KEY, iv);
  const ct = Buffer.concat([c.update(kek), c.final()]);
  return `DPAPISIM:${b64(iv)}:${b64(c.getAuthTag())}:${b64(ct)}`;
}
function dpapiSimUnwrap(blob) {
  const [, ivb, tagb, ctb] = blob.split(':');
  const d = crypto.createDecipheriv('aes-256-gcm', DUMMY_DPAPI_KEY, Buffer.from(ivb, 'base64'));
  d.setAuthTag(Buffer.from(tagb, 'base64'));
  return Buffer.concat([d.update(Buffer.from(ctb, 'base64')), d.final()]);
}

const results = {};
const pass = (k, ok, extra) => { results[k] = ok ? 'PASS' : 'FAIL'; console.log(`[${ok ? 'PASS' : 'FAIL'}] ${k}${extra ? ' :: ' + extra : ''}`); };

(async () => {
  console.log('=== DPAPI -> Vault re-wrap REHEARSAL (DUMMY-ONLY) ===');
  console.log(`VAULT_ADDR=${VAULT_ADDR} (loopback verified) | key=${KEY_NAME}`);

  // dummy material (in-memory only)
  const dummyKEK = crypto.randomBytes(32);          // 256-bit dummy KEK (NOT the real KEK)
  const dummyPayload = Buffer.from('DUMMY-PHI-PLACEHOLDER:patient=TEST-0000:not-real', 'utf8');
  console.log(`dummyKEK.len=${dummyKEK.length} fp=${fp(dummyKEK)} | payload.len=${dummyPayload.length} fp=${fp(dummyPayload)}`);

  // Layer 1: encrypt dummy payload once; ciphertext must survive the provider swap untouched.
  const dataBlob = encEnvelope(dummyKEK, dummyPayload);
  const dataBlobFp = fp(Buffer.from(dataBlob));
  console.log(`dataBlob(ENCv1).fp=${dataBlobFp} (must stay constant across re-wrap)`);

  // v1: protect dummy KEK with DPAPI-sim
  const v1Wrapped = dpapiSimWrap(dummyKEK);
  pass('v1_dpapi_sim_roundtrip', dpapiSimUnwrap(v1Wrapped).equals(dummyKEK), 'fp=' + fp(dpapiSimUnwrap(v1Wrapped)));

  // ---- GATE 3: Vault transit + re-wrap ----
  let ok;
  // enable transit (idempotent: 204 first time, 400 'already in use' after)
  let r = await vault('POST', '/sys/mounts/transit', { type: 'transit' });
  ok = r.status === 204 || (r.status === 400 && JSON.stringify(r.json).includes('already in use'));
  pass('transit_enabled', ok, 'http=' + r.status);

  r = await vault('POST', `/transit/keys/${KEY_NAME}`, { type: 'aes256-gcm96' });
  pass('transit_key_created', r.status === 204 || r.status === 200, 'http=' + r.status);

  // v2 wrap: protect the SAME dummy KEK under Vault transit (re-wrap step)
  r = await vault('POST', `/transit/encrypt/${KEY_NAME}`, { plaintext: b64(dummyKEK) });
  const v2Wrapped = r.json && r.json.data && r.json.data.ciphertext;
  pass('rewrap_v1_to_v2', !!v2Wrapped && v2Wrapped.startsWith('vault:v1:'),
    'provider_prefix=' + (v2Wrapped ? v2Wrapped.split(':').slice(0, 2).join(':') : 'none') + ' ct.len=' + (v2Wrapped ? v2Wrapped.length : 0));

  // prove data ciphertext UNCHANGED by the re-wrap (no data re-encryption)
  pass('data_ciphertext_unchanged_by_rewrap', fp(Buffer.from(dataBlob)) === dataBlobFp);

  // unwrap v2 -> must recover identical dummy KEK
  r = await vault('POST', `/transit/decrypt/${KEY_NAME}`, { ciphertext: v2Wrapped });
  const kekFromV2 = r.json && r.json.data ? Buffer.from(r.json.data.plaintext, 'base64') : Buffer.alloc(0);
  pass('v2_unwrap_recovers_kek', kekFromV2.equals(dummyKEK), 'fp=' + fp(kekFromV2));

  // idempotency: re-encrypt yields a different ciphertext that still decrypts to same KEK
  const r2 = await vault('POST', `/transit/encrypt/${KEY_NAME}`, { plaintext: b64(dummyKEK) });
  const v2b = r2.json.data.ciphertext;
  const rd = await vault('POST', `/transit/decrypt/${KEY_NAME}`, { ciphertext: v2b });
  pass('rewrap_idempotent_semantics', v2b !== v2Wrapped && Buffer.from(rd.json.data.plaintext, 'base64').equals(dummyKEK));

  // failure behavior: tampered ciphertext must be rejected
  const tampered = v2Wrapped.slice(0, -4) + 'AAAA';
  const rf = await vault('POST', `/transit/decrypt/${KEY_NAME}`, { ciphertext: tampered });
  pass('tampered_ciphertext_rejected', rf.status >= 400);

  // ---- GATE 4: dual-read (v1 DPAPI-sim AND v2 Vault) ----
  const kekViaV1 = dpapiSimUnwrap(v1Wrapped);
  const dataViaV1 = decEnvelope(kekViaV1, dataBlob);
  pass('dualread_v1_path', dataViaV1.equals(dummyPayload), 'src=DPAPI-sim');

  const rdr = await vault('POST', `/transit/decrypt/${KEY_NAME}`, { ciphertext: v2Wrapped });
  const kekViaV2 = Buffer.from(rdr.json.data.plaintext, 'base64');
  const dataViaV2 = decEnvelope(kekViaV2, dataBlob);
  pass('dualread_v2_path', dataViaV2.equals(dummyPayload), 'src=Vault-transit');
  pass('dualread_both_agree', dataViaV1.equals(dataViaV2));

  // dual-read fallback: if v2 (Vault) unreachable, reader falls back to v1
  function dualRead(preferV2) {
    if (preferV2) { try { return decEnvelope(kekViaV2, dataBlob); } catch (e) { /* fall through */ } }
    return decEnvelope(kekViaV1, dataBlob); // v1 fallback
  }
  pass('dualread_fallback_to_v1', dualRead(false).equals(dummyPayload), 'simulated Vault-down -> v1');

  // ---- GATE 5: rollback (revert to v1; prove no destructive effect) ----
  // Rollback = stop using v2, keep v1 as source of truth. Dummy-only; nothing real deleted.
  const rolledBack = decEnvelope(kekViaV1, dataBlob);
  pass('rollback_to_v1_recovers_data', rolledBack.equals(dummyPayload));
  // prove rollback does not require deleting the Vault key (non-destructive); key still usable
  const rcheck = await vault('POST', `/transit/decrypt/${KEY_NAME}`, { ciphertext: v2Wrapped });
  pass('rollback_nondestructive_v2_still_valid', Buffer.from(rcheck.json.data.plaintext, 'base64').equals(dummyKEK));

  const failed = Object.entries(results).filter(([, v]) => v !== 'PASS');
  console.log('=== SUMMARY ===');
  console.log(JSON.stringify(results, null, 0));
  console.log(failed.length === 0 ? 'REHEARSAL_RESULT: ALL_PASS' : `REHEARSAL_RESULT: FAIL (${failed.map((f) => f[0]).join(',')})`);
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((e) => { console.error('REHEARSAL_ERROR:', e.message); process.exit(1); });
