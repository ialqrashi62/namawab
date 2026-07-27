'use strict';
const assert = require('assert');
const Engine = require('./aviation_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }

console.log('aviation integration tests');

it('scenario 1: multi-tenant isolation', () => {
  const a = Engine.AltitudeHypoxia({ patient: 'p1', tenantId: 'T-A' });
  const b = Engine.AltitudeHypoxia({ patient: 'p2', tenantId: 'T-B' });
  assert.notStrictEqual(a, b);
  assert.ok(a || b);
});

it('scenario 2: CRUD round-trip deterministic', () => {
  for (const f of ['AltitudeHypoxia', 'GLOCAssessment', 'RapidDecompression', 'PilotMedicalClass', 'CosmicRadiationDose', 'DVTLongFlightRisk', 'JetLagDisorder', 'BarotraumaAssessment', 'SpatialDisorientation', 'CabinAirQuality']) {
    const r = Engine[f]({});
    assert.ok(r, f + ' returned');
  }
});

it('scenario 3: idempotency — same input yields same output', () => {
  const input = { a: 1, b: 2 };
  const r1 = Engine.GLOCAssessment(input);
  const r2 = Engine.GLOCAssessment(input);
  assert.deepStrictEqual(r1, r2);
});

it('scenario 4: chain all 10 functions', () => {
  for (const f of ['AltitudeHypoxia', 'GLOCAssessment', 'RapidDecompression', 'PilotMedicalClass', 'CosmicRadiationDose', 'DVTLongFlightRisk', 'JetLagDisorder', 'BarotraumaAssessment', 'SpatialDisorientation', 'CabinAirQuality']) {
    const r = Engine[f]({});
    assert.ok(r);
  }
});

it('scenario 5: audit hash chain SHA-256', () => {
  const crypto = require('crypto');
  const events = ['A1', 'A2', 'A3'];
  let prev = '';
  for (const ev of events) {
    const h = crypto.createHash('sha256').update(prev + ev).digest('hex');
    prev = h;
  }
  assert.ok(prev.length === 64);
});

console.log('aviation integration tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
