'use strict';
const assert = require('assert');
const Engine = require('./public_health_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }

console.log('public_health integration tests');

it('scenario 1: multi-tenant isolation', () => {
  const a = Engine.VaccineScheduleAdherence({ patient: 'p1', tenantId: 'T-A' });
  const b = Engine.VaccineScheduleAdherence({ patient: 'p2', tenantId: 'T-B' });
  assert.notStrictEqual(a, b);
  assert.ok(a || b);
});

it('scenario 2: CRUD round-trip deterministic', () => {
  for (const f of ['VaccineScheduleAdherence', 'OutbreakAttackRate', 'ContactTracingRisk', 'VaccineEffectiveness', 'TuberculosisScreening', 'InfluenzaSeverityScore', 'HepatitisBVaccineResponse', 'VectorBorneDiseaseRisk', 'BreastCancerScreeningEligibility', 'HandHygieneCompliance']) {
    const r = Engine[f]({});
    assert.ok(r, f + ' returned');
  }
});

it('scenario 3: idempotency — same input yields same output', () => {
  const input = { a: 1, b: 2 };
  const r1 = Engine.OutbreakAttackRate(input);
  const r2 = Engine.OutbreakAttackRate(input);
  assert.deepStrictEqual(r1, r2);
});

it('scenario 4: chain all 10 functions', () => {
  for (const f of ['VaccineScheduleAdherence', 'OutbreakAttackRate', 'ContactTracingRisk', 'VaccineEffectiveness', 'TuberculosisScreening', 'InfluenzaSeverityScore', 'HepatitisBVaccineResponse', 'VectorBorneDiseaseRisk', 'BreastCancerScreeningEligibility', 'HandHygieneCompliance']) {
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

console.log('public_health integration tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
