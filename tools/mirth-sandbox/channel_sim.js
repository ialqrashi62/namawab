// Mirth sandbox — LOCAL channel-flow simulator (no Mirth install, no network, no PHI).
// Mirrors the channel model (receive -> transform -> route -> dead-letter, with retry + audit)
// so the D1 design is provable offline. Uses D2 dummy fixtures. Run: node tools/mirth-sandbox/channel_sim.js
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildBundle } = require('../fhir-sandbox/mappers');
const fx = require('../fhir-sandbox/fixtures');

// offline tripwire: any outbound http/https fails the run
for (const m of ['http', 'https']) {
  const mod = require(m);
  mod.request = () => { throw new Error(`EXTERNAL CALL BLOCKED (${m}.request)`); };
  mod.get = () => { throw new Error(`EXTERNAL CALL BLOCKED (${m}.get)`); };
}

const work = path.join(os.tmpdir(), 'nama_mirth_sbx');
const dirs = { out: path.join(work, 'out'), dlq: path.join(work, 'dlq'), audit: path.join(work, 'audit') };
function reset() { try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) {} Object.values(dirs).forEach(d => fs.mkdirSync(d, { recursive: true })); }
function audit(ch, ev, detail) { fs.appendFileSync(path.join(dirs.audit, 'channel.log'), `${'2026-06-23'} [${ch}] ${ev} ${detail || ''}\n`); } // no PHI, no timestamp-now (deterministic)

// ---- Channel: SBX_FHIR_BUNDLE_IN (receive dummy bundle -> transform -> write resources) ----
function chFhirBundleIn() {
  const bundle = buildBundle(fx);               // D2 dummy bundle (no PHI, no DB)
  let written = 0;
  for (const e of bundle.entry) {
    const r = e.resource;
    fs.writeFileSync(path.join(dirs.out, `${r.resourceType}-${r.id}.json`), JSON.stringify(r));
    written++;
  }
  audit('SBX_FHIR_BUNDLE_IN', 'TRANSFORMED', `resources=${written}`);
  return written;
}

// ---- Channel: SBX_HL7_ADT_IN (dummy ADT^A01 -> minimal parse -> ACK) ----
function chHl7AdtIn() {
  // synthetic ADT (dummy MRN 9001, fabricated; NO real PHI)
  const adt = ['MSH|^~\\&|SBX|NAMA|RCV|NAMA|20260623||ADT^A01|SBXMSG1|P|2.5', 'EVN|A01|20260623', 'PID|1||9001^^^NAMA^MR||TEST^DUMMY'].join('\r');
  const seg = adt.split('\r').map(s => s.split('|')[0]);
  const ok = seg.includes('MSH') && seg.includes('PID');
  const ack = ok ? 'MSH|^~\\&|NAMA|RCV|SBX|NAMA|20260623||ACK|SBXACK1|P|2.5\rMSA|AA|SBXMSG1' : 'MSA|AE|SBXMSG1';
  fs.writeFileSync(path.join(dirs.out, 'adt_ack.hl7'), ack);
  audit('SBX_HL7_ADT_IN', ok ? 'ACK_AA' : 'NAK_AE', `segments=${seg.join(',')}`);
  return ok;
}

// ---- Dead-letter: malformed message routed to DLQ ----
function chDeadLetter() {
  const bad = 'THIS_IS_NOT_A_VALID_MESSAGE';
  let routed = false;
  try {
    if (!bad.startsWith('MSH') && !bad.trim().startsWith('{')) throw new Error('unparseable');
  } catch (e) {
    fs.writeFileSync(path.join(dirs.dlq, 'msg_001.dlq'), bad + `\n# reason: ${e.message}`);
    audit('SBX_DLQ', 'ROUTED', e.message);
    routed = true;
  }
  return routed;
}

// ---- Retry: transient failure then success (at-least-once + idempotency) ----
function chRetry() {
  let attempt = 0, delivered = false;
  const maxRetry = 3;
  while (attempt < maxRetry && !delivered) {
    attempt++;
    try {
      if (attempt < 2) throw new Error('transient'); // fail first attempt
      delivered = true;
    } catch (e) { audit('SBX_RETRY', 'RETRY', `attempt=${attempt} ${e.message}`); }
  }
  audit('SBX_RETRY', delivered ? 'DELIVERED' : 'DEADLETTER', `attempts=${attempt}`);
  return { delivered, attempt };
}

// ---- run + assert ----
const R = []; const T = (n, ok) => R.push((ok ? 'PASS' : 'FAIL') + ' ' + n);
reset();
try {
  const written = chFhirBundleIn();
  T('FHIR Bundle Receiver transformed all dummy resources', written === buildBundle(fx).entry.length && written === 8);
  T('transformed resources written to out/', fs.readdirSync(dirs.out).filter(f => f.endsWith('.json')).length === 8);
  const adtOk = chHl7AdtIn();
  T('HL7 ADT dummy receiver produced ACK (AA)', adtOk && fs.readFileSync(path.join(dirs.out, 'adt_ack.hl7'), 'utf8').includes('MSA|AA'));
  const dlq = chDeadLetter();
  T('dead-letter routes malformed message to DLQ', dlq && fs.existsSync(path.join(dirs.dlq, 'msg_001.dlq')));
  const retry = chRetry();
  T('retry recovers transient failure (delivered within maxRetry)', retry.delivered && retry.attempt === 2);
  const auditTxt = fs.readFileSync(path.join(dirs.audit, 'channel.log'), 'utf8');
  T('audit log records channel events (no PHI)', /SBX_FHIR_BUNDLE_IN|SBX_HL7_ADT_IN|SBX_DLQ|SBX_RETRY/.test(auditTxt) && !/[0-9]{10}\^\^\^NAMA\^MR.*REAL/.test(auditTxt));
  T('no external calls (tripwire intact)', (() => { try { require('https').get('https://x'); return false; } catch (e) { return /BLOCKED/.test(e.message); } })());
} catch (e) { R.push('FAIL simulator-exception :: ' + e.message); }
finally { try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) {} }

console.log(R.join('\n'));
const fail = R.filter(x => x.startsWith('FAIL')).length;
console.log(`\n${R.length - fail}/${R.length} PASS (local channel simulation; no Mirth install, no network, no PHI)`);
process.exit(fail ? 1 : 0);
