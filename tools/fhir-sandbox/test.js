// FHIR sandbox — local test runner. Run: node tools/fhir-sandbox/test.js
// Proves: each resource valid, reference integrity, no external calls, no real PHI.
'use strict';
const assert = require('assert');
const fx = require('./fixtures');
const { buildBundle } = require('./mappers');
const { validateBundle } = require('./validate');

// Guard: this sandbox must never reach the network. Trip-wire any http(s) use.
for (const m of ['http', 'https']) {
  const mod = require(m);
  mod.request = () => { throw new Error(`EXTERNAL CALL BLOCKED (${m}.request) — sandbox is offline-only`); };
  mod.get = () => { throw new Error(`EXTERNAL CALL BLOCKED (${m}.get) — sandbox is offline-only`); };
}

const results = [];
const T = (name, fn) => { try { fn(); results.push(`PASS ${name}`); } catch (e) { results.push(`FAIL ${name} :: ${e.message}`); } };

const bundle = buildBundle(fx);
const v = validateBundle(bundle);
const byType = t => v.filter(r => r.res.startsWith(t + '/'));

T('Patient resource valid', () => assert(byType('Patient').length === 2 && byType('Patient').every(r => r.ok)));
T('Encounter resource valid', () => assert(byType('Encounter').length === 1 && byType('Encounter').every(r => r.ok)));
T('Observation resource valid', () => assert(byType('Observation').length === 2 && byType('Observation').every(r => r.ok)));
T('DiagnosticReport resource valid', () => assert(byType('DiagnosticReport').length === 1 && byType('DiagnosticReport').every(r => r.ok)));
T('MedicationRequest resource valid', () => assert(byType('MedicationRequest').length === 1 && byType('MedicationRequest').every(r => r.ok)));
T('Claim resource valid', () => assert(byType('Claim').length === 1 && byType('Claim').every(r => r.ok)));
T('references integrity valid (all subject refs resolve in bundle)', () => assert(v.every(r => r.refOk)));
T('no embedded PHI bytes (images are guarded references)', () => assert(v.every(r => r.phiOk)));
T('no real PHI (fixtures are synthetic dummy ids 9001/9002)', () => {
  const ids = fx.patients.map(p => p.id);
  assert(ids.every(id => id >= 9000) && fx.patients.every(p => /^0000000\d{3}$/.test(p.national_id)));
});
T('no external calls performed (http/https tripwire intact)', () => {
  assert.throws(() => require('https').get('https://example.com'), /BLOCKED/);
});

console.log(results.join('\n'));
const fail = results.filter(r => r.startsWith('FAIL')).length;
console.log(`\nbundle entries: ${bundle.entry.length} | ${results.length - fail}/${results.length} PASS`);
process.exit(fail ? 1 : 0);
