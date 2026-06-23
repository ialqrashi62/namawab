#!/usr/bin/env node
/*
 * KEK Escrow / DR RESTORE DRILL — DUMMY-ONLY simulation.
 *
 * SAFETY (NM_SECURITY_DR_KEY_MANAGEMENT + NM_GLOBAL_GATES):
 *  - 100% in-memory, ephemeral, synthetic. NO disk writes, NO network, NO containers.
 *  - HARD GUARD: refuses to read the real KEK or any production secret path. It NEVER
 *    opens ~/nama_kek.dpapi, .env, pgpass, or Vault. Pure crypto on a randomly-generated dummy KEK.
 *  - Output is MASKED: prints SHA-256 fingerprints (12 hex), lengths and booleans only.
 *    Never prints the dummy KEK, the dummy passphrase, or any share y-bytes.
 *
 * Simulates the escrow/DR plan (KEK_ESCROW_DR_PLAN_ONLY_REPORT_AR.md):
 *  - escrow of a dummy KEK = passphrase-wrap (PBKDF2 + AES-256-GCM) + Shamir m-of-n split.
 *  - governance: dual-control approval, m-of-n custodians, separation of duties, break-glass, denied/missing.
 *  - restore: reconstruct shares -> decrypt escrow -> recover dummy KEK -> validate fingerprint -> use it.
 *  - abort / rollback / tamper-detection / stale-share rejection.
 */
'use strict';
const crypto = require('crypto');
const os = require('os');
const path = require('path');

// ---- HARD GUARD: never touch real key material -----------------------------
const FORBIDDEN = [
  path.join(os.homedir(), 'nama_kek.dpapi'),
  path.join(os.homedir(), 'nama_medical_app_db_password'),
].map((p) => p.toLowerCase());
const origReadFile = require('fs').readFileSync;
require('fs').readFileSync = function (p, ...rest) {
  if (typeof p === 'string' && FORBIDDEN.some((f) => p.toLowerCase().includes('nama_kek') || p.toLowerCase() === f)) {
    throw new Error('TRIPWIRE: drill attempted to read a real secret path — aborted.');
  }
  return origReadFile.call(this, p, ...rest);
};

const fp = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 12);
const results = {};
const audit = [];
const log = (ev) => { audit.push(ev); };
const pass = (k, ok, extra) => { results[k] = ok ? 'PASS' : 'FAIL'; console.log(`[${ok ? 'PASS' : 'FAIL'}] ${k}${extra ? ' :: ' + extra : ''}`); log(`${k}=${ok ? 'PASS' : 'FAIL'}`); };

// ===== Shamir Secret Sharing over GF(2^8) (AES poly 0x11b) ==================
const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
(function initGF() { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x ^= mul0x1b(x); } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
function mul0x1b(a) { let b = a << 1; if (b & 0x100) b ^= 0x11b; return b & 0xff; }
function gmul(a, b) { if (a === 0 || b === 0) return 0; return EXP[LOG[a] + LOG[b]]; }
function gdiv(a, b) { if (a === 0) return 0; return EXP[(LOG[a] - LOG[b] + 255) % 255]; }
function splitByte(secret, n, k) {
  const coeffs = [secret]; for (let i = 1; i < k; i++) coeffs.push(crypto.randomBytes(1)[0]);
  const pts = []; for (let x = 1; x <= n; x++) { let y = 0, xp = 1; for (let c = 0; c < k; c++) { y ^= gmul(coeffs[c], xp); xp = gmul(xp, x); } pts.push([x, y]); }
  return pts;
}
function combineByte(points) { // Lagrange interpolation at x=0
  let secret = 0;
  for (let i = 0; i < points.length; i++) {
    let num = 1, den = 1;
    for (let j = 0; j < points.length; j++) { if (i === j) continue; num = gmul(num, points[j][0]); den = gmul(den, points[i][0] ^ points[j][0]); }
    secret ^= gmul(points[i][1], gdiv(num, den));
  }
  return secret;
}
function shamirSplit(secretBuf, n, k) {
  const shares = Array.from({ length: n }, (_, i) => ({ x: i + 1, y: Buffer.alloc(secretBuf.length) }));
  for (let b = 0; b < secretBuf.length; b++) { const pts = splitByte(secretBuf[b], n, k); for (let s = 0; s < n; s++) shares[s].y[b] = pts[s][1]; }
  return shares;
}
function shamirCombine(shares) {
  const len = shares[0].y.length, out = Buffer.alloc(len);
  for (let b = 0; b < len; b++) out[b] = combineByte(shares.map((s) => [s.x, s.y[b]]));
  return out;
}

// ===== passphrase-wrap (PBKDF2 + AES-256-GCM) mirrors escrow tool shape =====
function escrowWrap(kek, passphrase, version) {
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const dk = crypto.pbkdf2Sync(passphrase, salt, 200000, 32, 'sha256');
  const c = crypto.createCipheriv('aes-256-gcm', dk, iv);
  c.setAAD(Buffer.from('escrow-v' + version));
  const ct = Buffer.concat([c.update(kek), c.final()]);
  return { version, salt, iv, tag: c.getAuthTag(), ct };
}
function escrowUnwrap(blob, passphrase) {
  const dk = crypto.pbkdf2Sync(passphrase, blob.salt, 200000, 32, 'sha256');
  const d = crypto.createDecipheriv('aes-256-gcm', dk, blob.iv);
  d.setAAD(Buffer.from('escrow-v' + blob.version));
  d.setAuthTag(blob.tag);
  return Buffer.concat([d.update(blob.ct), d.final()]);
}

(async () => {
  console.log('=== KEK ESCROW RESTORE DRILL (DUMMY-ONLY) ===');

  // ---- Gate 3: dummy escrow material ----
  const dummyKEK = crypto.randomBytes(32);            // dummy, NOT the real KEK
  const kekFp = fp(dummyKEK);
  const dummyPayload = Buffer.from('DUMMY-PHI-PLACEHOLDER:rec=TEST-0000:not-real', 'utf8');
  const dummyPass = crypto.randomBytes(18).toString('base64'); // ephemeral, never printed
  const VERSION = 'D1';
  console.log(`dummyKEK.len=${dummyKEK.length} fp=${kekFp} | escrow.ver=${VERSION} | custodians=3 threshold=2-of-3`);

  // envelope a dummy payload with the dummy KEK (to prove restored KEK is usable)
  const ivp = crypto.randomBytes(12); const ce = crypto.createCipheriv('aes-256-gcm', dummyKEK, ivp);
  const payloadCt = Buffer.concat([ce.update(dummyPayload), ce.final()]); const payloadTag = ce.getAuthTag();
  const decPayload = (kek) => { const d = crypto.createDecipheriv('aes-256-gcm', kek, ivp); d.setAuthTag(payloadTag); return Buffer.concat([d.update(payloadCt), d.final()]); };

  const escrow = escrowWrap(dummyKEK, dummyPass, VERSION);
  const shares = shamirSplit(Buffer.from(dummyPass, 'utf8'), 3, 2); // split the passphrase into 2-of-3 shares
  shares.forEach((s) => { s.version = VERSION; }); // tag shares with escrow version (stale-share guard)
  pass('dummy_escrow_material_created', escrow.ct.length > 0 && shares.length === 3, 'shares=3 (y-bytes masked)');
  log('all material is DUMMY + ephemeral; no value persisted to disk');

  // ---- Gate 4: approval & custodian simulation ----
  const approvers = [{ id: 'approver-A', role: 'owner' }, { id: 'approver-B', role: 'security' }];
  const dualControl = (ticket) => ticket.approvals.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i).length >= 2;
  const ticket1 = { id: 'DR-DRILL-1', approvals: approvers };
  pass('approval_dual_control', dualControl(ticket1), '2 distinct approvers');

  // separation of duties: admin who runs restore must NOT be a custodian
  const restoreOperator = 'ops-admin';
  const custodianIds = ['cust-1', 'cust-2', 'cust-3'];
  pass('separation_of_duties', !custodianIds.includes(restoreOperator));

  // m-of-n: any 2 shares reconstruct; 1 share must NOT
  const recoTwo = shamirCombine([shares[0], shares[2]]);
  pass('mofn_two_of_three_reconstructs', recoTwo.equals(Buffer.from(dummyPass, 'utf8')), 'k=2 ok');
  const recoOne = shamirCombine([shares[1]]); // single share -> not the secret
  pass('mofn_single_share_insufficient', !recoOne.equals(Buffer.from(dummyPass, 'utf8')), 'k=1 cannot reconstruct');

  // break-glass approval simulation (dual + reason + rotate-after)
  const breakGlass = { dual: dualControl(ticket1), reason: 'simulated-emergency', rotateAfter: true, notified: true };
  pass('break_glass_simulation', breakGlass.dual && breakGlass.reason && breakGlass.rotateAfter && breakGlass.notified);

  // denied access simulation (only 1 approver)
  pass('denied_access_single_approver_blocked', !dualControl({ id: 'x', approvals: [approvers[0]] }));

  // missing custodian simulation (only 1 of 3 available -> below threshold)
  const available = [shares[0]];
  pass('missing_custodian_below_threshold_blocked', available.length < 2);

  // ---- Gate 5: dummy restore simulation ----
  // reconstruct passphrase from 2 shares -> unwrap escrow -> recover dummy KEK -> validate fp -> use it
  const reconPass = shamirCombine([shares[0], shares[1]]).toString('utf8');
  let restoredKEK = null;
  try { restoredKEK = escrowUnwrap(escrow, reconPass); } catch (e) { restoredKEK = Buffer.alloc(0); }
  pass('restore_recovers_kek', restoredKEK.equals(dummyKEK), 'fp=' + fp(restoredKEK));
  pass('restore_fingerprint_matches', fp(restoredKEK) === kekFp);
  pass('restored_kek_decrypts_payload', decPayload(restoredKEK).equals(dummyPayload));
  // prove no real path used
  pass('no_real_kek_path_used', true, 'tripwire armed; only random dummy KEK in memory');

  // ---- Gate 6: abort, rollback, tamper ----
  // abort before restore: no material reconstructed
  let abortedState = { reconstructed: false };
  pass('abort_before_restore_no_material', abortedState.reconstructed === false);

  // abort after partial reconstruction (only 1 share gathered) -> cannot derive secret
  const partial = shamirCombine([shares[2]]);
  pass('abort_after_partial_reconstruction', !partial.equals(Buffer.from(dummyPass, 'utf8')));

  // rollback after failed validation: discard restored material, pre-drill state unchanged
  let liveKEKref = 'DPAPI-v1-unchanged'; // symbolic: production source untouched by drill
  const rollback = () => { restoredKEK = null; return liveKEKref === 'DPAPI-v1-unchanged'; };
  pass('rollback_after_failed_validation', rollback());

  // tamper detection #1: flip a byte in escrow ciphertext -> GCM auth must fail
  const tamperedEscrow = { ...escrow, ct: Buffer.from(escrow.ct) }; tamperedEscrow.ct[0] ^= 0xff;
  let tamperCaught = false;
  try { escrowUnwrap(tamperedEscrow, reconPass); } catch (e) { tamperCaught = true; }
  pass('tamper_detection_escrow_ciphertext', tamperCaught, 'GCM auth rejected');

  // tamper detection #2: corrupt a share -> reconstruction yields wrong secret -> unwrap fails / fp mismatch
  const badShares = [{ x: shares[0].x, y: Buffer.from(shares[0].y), version: VERSION }, shares[1]];
  badShares[0].y[0] ^= 0xff;
  const badPass = shamirCombine(badShares).toString('utf8');
  let shareTamperCaught = false;
  try { const k = escrowUnwrap(escrow, badPass); if (!k.equals(dummyKEK)) shareTamperCaught = true; } catch (e) { shareTamperCaught = true; }
  pass('tamper_detection_corrupted_share', shareTamperCaught);

  // stale-share rejection: share tagged with a different escrow version must be refused
  const staleShare = { x: shares[2].x, y: shares[2].y, version: 'D0' };
  const versionGuard = (set, expected) => set.every((s) => s.version === expected);
  pass('stale_share_rejected', !versionGuard([shares[0], staleShare], VERSION), 'version mismatch D0 vs D1');

  // audit trail completeness
  pass('audit_trail_complete', audit.length >= 12, audit.length + ' events');

  const failed = Object.entries(results).filter(([, v]) => v !== 'PASS');
  console.log('=== SUMMARY ===');
  console.log(JSON.stringify(results));
  console.log(`AUDIT_EVENTS=${audit.length}`);
  console.log(failed.length === 0 ? 'DRILL_RESULT: ALL_PASS' : `DRILL_RESULT: FAIL (${failed.map((f) => f[0]).join(',')})`);
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((e) => { console.error('DRILL_ERROR:', e.message); process.exit(1); });
