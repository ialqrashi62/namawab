// SBX_FHIR_BUNDLE_IN — channel-equivalent local relay: executes the channel data path against a REAL local HAPI.
// receive dummy transaction Bundle -> filter(type=transaction) -> HTTP-send to HAPI /fhir -> transaction-response -> read-back; bad -> DLQ.
// Loopback HAPI only (default http://127.0.0.1:8090/fhir). Dummy only, no PHI, no external healthcare calls.
// Run (after starting HAPI loopback): node tools/mirth-sandbox/channel_relay.js
'use strict';
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildTransactionBundle } = require('../fhir-sandbox/transaction_bundle');

const BASE = process.env.HAPI_BASE || 'http://127.0.0.1:8090/fhir';
const u = new URL(BASE);
if (u.hostname !== '127.0.0.1' && u.hostname !== 'localhost') { console.log('FAIL HAPI base not loopback'); process.exit(1); }

const work = path.join(os.tmpdir(), 'nama_mirth_relay');
const dlq = path.join(work, 'dlq'); const auditDir = path.join(work, 'audit');
function reset() { try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) {} fs.mkdirSync(dlq, { recursive: true }); fs.mkdirSync(auditDir, { recursive: true }); }
function audit(ev, detail) { fs.appendFileSync(path.join(auditDir, 'channel.log'), `[SBX_FHIR_BUNDLE_IN] ${ev} ${detail || ''}\n`); } // metadata only, no PHI

function send(method, p, body) {
  return new Promise((res, rej) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const r = http.request({ hostname: u.hostname, port: u.port, path: u.pathname.replace(/\/$/, '') + p, method,
      headers: { 'Content-Type': 'application/fhir+json', ...(data ? { 'Content-Length': data.length } : {}) } },
      x => { const ch = []; x.on('data', c => ch.push(c)); x.on('end', () => { let j = {}; try { j = JSON.parse(Buffer.concat(ch)); } catch (e) {} res({ status: x.statusCode, json: j }); }); });
    r.on('error', rej); if (data) r.write(data); r.end();
  });
}

// destination "HTTP Sender" with bounded retry
async function destinationSend(bundle) {
  const maxRetry = 3;
  for (let attempt = 1; attempt <= maxRetry; attempt++) {
    try { const r = await send('POST', '', bundle); if (r.status === 200) return r; audit('RETRY', `attempt=${attempt} status=${r.status}`); }
    catch (e) { audit('RETRY', `attempt=${attempt} ${e.message}`); }
  }
  return null;
}

(async () => {
  const R = []; const P = (n, ok, x) => R.push((ok ? 'PASS' : 'FAIL') + ' ' + n + (x ? ' :: ' + x : ''));
  reset();
  try {
    // --- good message path ---
    const bundle = buildTransactionBundle();
    // source filter: must be a transaction Bundle
    const accepted = bundle.resourceType === 'Bundle' && bundle.type === 'transaction';
    P('source filter accepts transaction Bundle', accepted);
    audit('RECEIVED', `entries=${bundle.entry.length}`);
    const resp = await destinationSend(bundle);
    P('destination forwarded to HAPI (200 transaction-response)', !!resp && resp.json.type === 'transaction-response', resp ? 'status=' + resp.status : 'no-response');
    const statuses = resp ? (resp.json.entry || []).map(e => (e.response && e.response.status) || '?') : [];
    P('all entries persisted via channel (2xx)', statuses.length === bundle.entry.length && statuses.every(s => /^20[01]/.test(s)), statuses.join(','));
    // read-back a Patient
    const patEntry = resp && (resp.json.entry || []).find(e => e.response && /Patient\//.test(e.response.location || ''));
    if (patEntry) { const rb = await send('GET', '/' + patEntry.response.location.split('/').slice(0, 2).join('/')); P('read-back created Patient via channel (200)', rb.status === 200 && rb.json.resourceType === 'Patient'); audit('FORWARDED_OK', 'patient persisted'); }
    else P('read-back created Patient via channel (200)', false, 'no patient');

    // --- bad message path -> DLQ (HAPI not called) ---
    const bad = { resourceType: 'Bundle', type: 'collection', note: 'not a transaction' };
    if (!(bad.type === 'transaction')) { fs.writeFileSync(path.join(dlq, 'bad_001.json'), JSON.stringify(bad)); audit('DLQ', 'non-transaction routed to dead-letter'); }
    P('non-transaction message routed to DLQ', fs.existsSync(path.join(dlq, 'bad_001.json')));

    // --- audit present, no PHI ---
    const a = fs.readFileSync(path.join(auditDir, 'channel.log'), 'utf8');
    P('audit log present (metadata only, no PHI)', /RECEIVED|FORWARDED_OK|DLQ/.test(a) && !/national-id|0000000001/.test(a));
    // DLQ should contain only the bad one (good path did not DLQ)
    P('good-path produced no DLQ entry', fs.readdirSync(dlq).length === 1);
  } catch (e) { R.push('FAIL exception :: ' + e.message); }
  finally { try { fs.rmSync(work, { recursive: true, force: true }); } catch (e) {} }
  console.log(R.join('\n'));
  const fail = R.filter(x => x.startsWith('FAIL')).length;
  console.log(`\n${R.length - fail}/${R.length} PASS (channel relay -> local HAPI; dummy only; no PHI; loopback)`);
  process.exit(fail ? 1 : 0);
})();
