// Submit the dummy transaction Bundle to a LOCAL HAPI FHIR server and verify ingest + read-back.
// Calls ONLY the loopback HAPI base (default http://127.0.0.1:8090/fhir). No external healthcare calls, no PHI.
// Run: node tools/fhir-sandbox/hapi_transaction_test.js   (after starting HAPI on loopback)
'use strict';
const http = require('http');
const { buildTransactionBundle } = require('./transaction_bundle');

const BASE = process.env.HAPI_BASE || 'http://127.0.0.1:8090/fhir';
const u = new URL(BASE);
if (u.hostname !== '127.0.0.1' && u.hostname !== 'localhost') { console.log('FAIL base is not loopback'); process.exit(1); }

function req(method, path, body) {
  return new Promise((res, rej) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const r = http.request({ hostname: u.hostname, port: u.port, path: (u.pathname.replace(/\/$/, '')) + path,
      method, headers: { 'Content-Type': 'application/fhir+json', ...(data ? { 'Content-Length': data.length } : {}) } },
      x => { const ch = []; x.on('data', c => ch.push(c)); x.on('end', () => { let j = {}; try { j = JSON.parse(Buffer.concat(ch)); } catch (e) {} res({ status: x.statusCode, json: j }); }); });
    r.on('error', rej); if (data) r.write(data); r.end();
  });
}

(async () => {
  const R = []; const P = (n, ok, x) => R.push((ok ? 'PASS' : 'FAIL') + ' ' + n + (x ? ' :: ' + x : ''));
  try {
    const meta = await req('GET', '/metadata');
    P('metadata 200', meta.status === 200);

    const bundle = buildTransactionBundle();
    P('transaction bundle built (type=transaction, entries)', bundle.type === 'transaction' && bundle.entry.length === 10);

    const tr = await req('POST', '', bundle); // POST to base = transaction
    P('transaction POST 200', tr.status === 200, 'status=' + tr.status);
    const isResp = tr.json.resourceType === 'Bundle' && tr.json.type === 'transaction-response';
    P('response is transaction-response Bundle', isResp);

    if (isResp) {
      const statuses = (tr.json.entry || []).map(e => (e.response && e.response.status) || '?');
      const all2xx = statuses.length === bundle.entry.length && statuses.every(s => /^20[01]/.test(s));
      P('all entries persisted (2xx)', all2xx, statuses.join(','));
      // read-back: follow the first Patient location
      const patEntry = (tr.json.entry || []).find(e => (e.response && /Patient\//.test(e.response.location || '')));
      const loc = patEntry && patEntry.response.location; // e.g. Patient/123/_history/1
      const rel = loc ? '/' + loc.split('/').slice(0, 2).join('/') : null;
      if (rel) { const rb = await req('GET', rel); P('read-back created Patient (200)', rb.status === 200 && rb.json.resourceType === 'Patient', rel); }
      else P('read-back created Patient (200)', false, 'no Patient location');
      // reference integrity: the persisted Encounter.subject should resolve to a Patient
      const encEntry = (tr.json.entry || []).find(e => (e.response && /Encounter\//.test(e.response.location || '')));
      if (encEntry) { const er = await req('GET', '/' + encEntry.response.location.split('/').slice(0, 2).join('/')); P('reference integrity: Encounter.subject -> Patient/...', er.status === 200 && /^Patient\//.test((er.json.subject || {}).reference || '')); }
      else P('reference integrity: Encounter.subject -> Patient/...', false, 'no Encounter');
    } else {
      // capture diagnostic if it failed
      const diag = (tr.json.issue || []).map(i => `${i.severity}:${(i.diagnostics || '').slice(0, 160)}`).join(' | ');
      P('transaction-response diagnostics', false, diag || JSON.stringify(tr.json).slice(0, 200));
    }
  } catch (e) { R.push('FAIL exception :: ' + e.message); }
  console.log(R.join('\n'));
  const fail = R.filter(x => x.startsWith('FAIL')).length;
  console.log(`\n${R.length - fail}/${R.length} PASS (local HAPI loopback; dummy only; no PHI; no external healthcare calls)`);
  process.exit(fail ? 1 : 0);
})();
